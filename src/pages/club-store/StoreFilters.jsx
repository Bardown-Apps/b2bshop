import { useRef, useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, ChevronDown, RotateCcw } from "lucide-react";
import { useSelector } from "react-redux";
import { getFilterOptions } from "@/constants/clubStore";

const CheckboxFilterGroup = ({
  label,
  options,
  selected,
  onChange,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open, selected]);

  const getOptionValue = (item) =>
    typeof item === "object" && item !== null ? item.name : item;

  const toggle = (item, isChecked) => {
    const value = getOptionValue(item);
    const next = isChecked
      ? [...new Set([...selected, value])]
      : selected.filter((s) => s !== value);
    onChange(label, next);
  };

  const count = selected.length;

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-slate-800 cursor-pointer group transition-colors hover:text-slate-950"
      >
        <span className="flex items-center gap-2">
          {label}
          {count > 0 && (
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 group-hover:text-slate-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-250 ease-out"
        style={{ maxHeight: `${height}px`, opacity: open ? 1 : 0 }}
      >
        <div ref={contentRef} className="pb-4 space-y-1">
          {options?.map((item, index) => {
            const value = getOptionValue(item);
            const isClubOption =
              typeof item === "object" && item !== null && "name" in item;
            const isChecked = selected.includes(value);
            return (
              <label
                key={`${label}-${value}-${index}`}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors duration-150 ${
                  isChecked
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => toggle(item, e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 accent-slate-900 cursor-pointer"
                />
                {isClubOption && item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="w-8 h-8 object-contain shrink-0"
                  />
                ) : null}
                {value}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PRICE_SORT_OPTIONS = [
  { value: "high-low", label: "High to Low" },
  { value: "low-high", label: "Low to High" },
];

const PriceSortGroup = ({ priceSort, onChange }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open, priceSort]);

  const hasValue = Boolean(priceSort);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-slate-800 cursor-pointer group transition-colors hover:text-slate-950"
      >
        <span className="flex items-center gap-2">
          Sort by price
          {hasValue && (
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
              !
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 group-hover:text-slate-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-250 ease-out"
        style={{ maxHeight: `${height}px`, opacity: open ? 1 : 0 }}
      >
        <div ref={contentRef} className="pb-4 space-y-1">
          {PRICE_SORT_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors duration-150 ${
                priceSort === value
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="club-store-price-sort"
                checked={priceSort === value}
                onChange={() => onChange("priceSort", value)}
                className="w-3.5 h-3.5 border-slate-300 accent-slate-900 cursor-pointer"
              />
              {label}
            </label>
          ))}
          {hasValue && (
            <button
              type="button"
              onClick={() => onChange("priceSort", "")}
              className="w-full py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Clear sort
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const NAME_SORT_OPTIONS = [
  { value: "a-z", label: "A - Z" },
  { value: "z-a", label: "Z - A" },
];

const NameSortGroup = ({ nameSort, onChange }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open, nameSort]);

  const hasValue = Boolean(nameSort);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-slate-800 cursor-pointer group transition-colors hover:text-slate-950"
      >
        <span className="flex items-center gap-2">
          Sort by name
          {hasValue && (
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
              !
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 group-hover:text-slate-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-250 ease-out"
        style={{ maxHeight: `${height}px`, opacity: open ? 1 : 0 }}
      >
        <div ref={contentRef} className="pb-4 space-y-1">
          {NAME_SORT_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors duration-150 ${
                nameSort === value
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="club-store-name-sort"
                checked={nameSort === value}
                onChange={() => onChange("nameSort", value)}
                className="w-3.5 h-3.5 border-slate-300 accent-slate-900 cursor-pointer"
              />
              {label}
            </label>
          ))}
          {hasValue && (
            <button
              type="button"
              onClick={() => onChange("nameSort", "")}
              className="w-full py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Clear sort
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CHECKBOX_FILTERS = [
  { label: "Clubs", defaultOpen: true },
  { label: "Size", defaultOpen: false },
  { label: "Color", defaultOpen: false },
];

const StoreFilters = ({ filters, onChange, onReset, activeCount }) => {
  const clubs = useSelector((state) => state.clubs.list);
  const products = useSelector((state) => state.products.list);
  const filterOptions = useMemo(
    () => getFilterOptions(clubs, products),
    [clubs, products],
  );

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Filters
            </span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-[11px] font-medium text-slate-500 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        <div className="px-4">
          {CHECKBOX_FILTERS.map(({ label, defaultOpen }) => (
            <CheckboxFilterGroup
              key={label}
              label={label}
              options={filterOptions[label]}
              selected={filters[label]}
              onChange={onChange}
              defaultOpen={defaultOpen}
            />
          ))}
          <PriceSortGroup
            priceSort={filters.priceSort}
            onChange={onChange}
          />
          <NameSortGroup
            nameSort={filters.nameSort}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default StoreFilters;
