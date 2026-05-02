import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { CATEGORIES, getFilterOptions } from "@/constants/clubStore";
import StoreFilters from "./StoreFilters";
import StoreProductCard from "./StoreProductCard";

const parsePrice = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    return parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  }
  return 0;
};

const getCategoryName = (category) => category?.catName || "";

const getCategoryImage = (category) => category?.catImg || "";

const getProductName = (product) => product?.name || "";

const getProductCategory = (product) => product?.category?.catName || "";

const getProductClub = (product, clubs) => {
  const club = clubs?.find((club) => club?.clubId === product?.clubId);
  return club?.clubName || "";
};

const getProductSizes = (product) => {
  const sizes = product?.variants?.find((v) => v?.variant === "Size")?.values;
  if (Array.isArray(sizes) && sizes.length > 0) {
    return sizes
      .map((sizeItem) =>
        typeof sizeItem === "string" ? sizeItem : sizeItem?.value,
      )
      .map((size) => size?.trim())
      .filter(Boolean);
  }

  return [];
};

const getProductColor = (product) => {
  const colors = product?.variants?.find((v) => v?.variant === "Color")?.values;
  if (Array.isArray(colors) && colors.length > 0) {
    return colors
      .map((colorItem) =>
        typeof colorItem === "string" ? colorItem : colorItem?.value,
      )
      .map((color) => color?.trim())
      .filter(Boolean);
  }

  return [];
};

const getProductImage = (product) => product?.defaultImageUrl || "";

const normalizeProduct = (product, clubs) => {
  const priceValue =
    product?.price ?? product?.productPrice ?? product?.prodPrice ?? 0;
  const numericPrice = parsePrice(priceValue);
  const formattedPrice =
    typeof priceValue === "string" && priceValue.includes("$")
      ? priceValue
      : `$${numericPrice.toFixed(2)}`;

  return {
    ...product,
    id: product?.prodId ?? product?.id,
    name: getProductName(product),
    category: getProductCategory(product),
    club: getProductClub(product, clubs),
    sizes: getProductSizes(product),
    color: getProductColor(product),
    image: getProductImage(product),
    price: formattedPrice,
    numericPrice,
  };
};

const ProductGrid = () => {
  const clubs = useSelector((state) => state.clubs.list);
  const categories = useSelector((state) => state.categories.list);
  const products = useSelector((state) => state.products.list);
  const filterOptions = useMemo(
    () => getFilterOptions(clubs, products),
    [clubs, products],
  );
  const availableClubNames = useMemo(
    () => filterOptions.Clubs.map((club) => club.name),
    [filterOptions.Clubs],
  );

  const normalizedProducts = useMemo(
    () =>
      products
        .map((product) => normalizeProduct(product, clubs))
        .filter((product) => Boolean(product.name)),
    [products, clubs],
  );
  const categoryTabs = useMemo(() => {
    const dynamicTabs = categories
      .map((category) => ({
        name: getCategoryName(category),
        image: getCategoryImage(category),
      }))
      .filter((category) => Boolean(category.name));

    const tabs =
      dynamicTabs.length > 0
        ? dynamicTabs
        : CATEGORIES.filter((name) => name !== "All").map((name) => ({
            name,
            image: "",
          }));

    return [{ name: "All", image: "" }, ...tabs];
  }, [categories]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [animating, setAnimating] = useState(false);
  const [gridKey, setGridKey] = useState(0);
  const [filters, setFilters] = useState({
    Clubs: [],
    Size: [],
    Color: [],
    priceSort: "",
    nameSort: "",
  });
  const selectedTeam = searchParams.get("team")?.trim() || "";

  useEffect(() => {
    if (!selectedTeam) return;

    const isValidTeam = availableClubNames.includes(selectedTeam);
    if (!isValidTeam) return;

    setFilters((prev) => {
      const alreadySelected =
        prev.Clubs.length === 1 && prev.Clubs[0] === selectedTeam;
      return alreadySelected ? prev : { ...prev, Clubs: [selectedTeam] };
    });
  }, [selectedTeam, availableClubNames]);

  const filtered = useMemo(() => {
    const rows = normalizedProducts.filter((p) => {
      const matchCat =
        activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchClub =
        filters.Clubs.length === 0 || filters.Clubs.includes(p.club);
      const matchSize =
        filters.Size.length === 0 ||
        p.sizes.some((s) => filters.Size.includes(s));
      const matchColor =
        filters.Color.length === 0 ||
        filters.Color.some((c) => p.color.includes(c));

      return matchCat && matchSearch && matchClub && matchSize && matchColor;
    });

    const nameCmp = (a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" });

    if (filters.priceSort === "high-low") {
      rows.sort((a, b) => b.numericPrice - a.numericPrice);
    } else if (filters.priceSort === "low-high") {
      rows.sort((a, b) => a.numericPrice - b.numericPrice);
    } else if (filters.nameSort === "a-z") {
      rows.sort((a, b) => nameCmp(a, b));
    } else if (filters.nameSort === "z-a") {
      rows.sort((a, b) => nameCmp(b, a));
    }

    return rows;
  }, [
    normalizedProducts,
    activeCategory,
    search,
    filters.Clubs,
    filters.Size,
    filters.Color,
    filters.priceSort,
    filters.nameSort,
  ]);

  const handleCategoryChange = (cat) => {
    if (cat === activeCategory) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveCategory(cat);
      setGridKey((k) => k + 1);
      setAnimating(false);
    }, 150);
  };

  const handleFilterChange = (key, values) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: values };
      if (key === "priceSort" && values) {
        next.nameSort = "";
      } else if (key === "nameSort" && values) {
        next.priceSort = "";
      }
      return next;
    });

    if (key === "Clubs") {
      const nextParams = new URLSearchParams(searchParams);
      if (values.length === 1) {
        nextParams.set("team", values[0]);
      } else {
        nextParams.delete("team");
      }
      setSearchParams(nextParams, { replace: true });
    }

    setGridKey((k) => k + 1);
  };

  const handleReset = () => {
    setFilters({
      Clubs: [],
      Size: [],
      Color: [],
      priceSort: "",
      nameSort: "",
    });
    setGridKey((k) => k + 1);
  };

  const activeFilterCount =
    filters.Clubs.length +
    filters.Size.length +
    filters.Color.length +
    (filters.priceSort ? 1 : 0) +
    (filters.nameSort ? 1 : 0);

  return (
    <div className="flex flex-col">
      {/* Fixed header: title + tabs + search */}
      <div className="shrink-0 pb-4">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-5">
          Buy Your Gear
        </h2>

        <div className="flex items-center gap-2 flex-wrap mb-5">
          {categoryTabs.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                activeCategory === cat.name
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:shadow-sm"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={`w-4 h-4 rounded-full object-cover ${
                      activeCategory === cat.name ? "bg-white p-0.5" : ""
                    }`}
                  />
                )}
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center border border-slate-200 rounded-lg bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-slate-300 transition-all">
          <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 text-sm text-slate-800 outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Scrollable content area: filters (sticky) + product grid */}
      <div className="flex gap-6">
        {/* Filters */}
        <div className="hidden md:block shrink-0 w-64 lg:w-72">
          <StoreFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            activeCount={activeFilterCount}
          />
        </div>

        {/* Scrollable product grid */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs text-slate-500 mb-4">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}{" "}
            found
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl animate-fade-in">
              <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                No products match your filters.
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleReset}
                  className="mt-3 text-xs font-medium text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div
              key={gridKey}
              className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-4 transition-opacity duration-150"
              style={{ opacity: animating ? 0 : 1 }}
            >
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <StoreProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
