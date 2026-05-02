import { useNavigate } from "react-router-dom";

const getPrimaryColorCode = (entry) => {
  if (typeof entry?.colorCode === "string" && entry.colorCode.trim()) {
    return entry.colorCode.trim();
  }

  const fallback = entry?.multiColors?.find(
    (mc) => typeof mc?.colorCode === "string" && mc.colorCode.trim(),
  );
  return fallback?.colorCode?.trim() || null;
};

/** One visual box per color variant value. */
const buildSwatchItems = (colorEntries) =>
  colorEntries.map((entry, entryIndex) => {
    const label = entry.label?.trim() ?? "";
    return {
      key: `swatch-${entryIndex}-${label || "fallback"}`,
      label,
      code: entry.code,
    };
  });

const ColorSwatchBox = ({ label, code }) => (
  <span className="relative inline-flex group/swatch">
    <span
      aria-label={label ? `Color: ${label}` : "Color swatch"}
      className="inline-block size-6 rounded-md border border-slate-200/90 shadow-sm shrink-0 ring-1 ring-black/5"
      style={
        code
          ? { backgroundColor: code }
          : { backgroundColor: "#e2e8f0" }
      }
    />
    {label ? (
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover/swatch:opacity-100"
      >
        {label}
      </span>
    ) : null}
  </span>
);

const StoreProductCard = ({ product }) => {
  const navigate = useNavigate();

  const colorVariant = product?.variants?.find((v) => v?.variant === "Color");
  const colorEntries = (colorVariant?.values ?? [])
    .map((entry) => ({
      label:
        typeof entry?.value === "string"
          ? entry.value.trim()
          : String(entry?.value ?? ""),
      code: getPrimaryColorCode(entry),
    }))
    .filter((e) => e.label || e.code);

  const swatchItems = buildSwatchItems(colorEntries);

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="border border-slate-200 rounded-xl bg-white hover:shadow-lg hover:border-slate-300 transition-all duration-300 group cursor-pointer overflow-visible"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/product/${product.id}`);
        }
      }}
    >
      <div className="aspect-square bg-slate-100 relative overflow-hidden rounded-t-xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4 rounded-b-xl overflow-visible">
        <p className="text-[11px] text-slate-500 font-medium mb-0.5">
          {product.club}
        </p>
        <p className="text-sm font-bold text-slate-900 leading-snug mb-1 group-hover:text-red-600 transition-colors duration-200">
          {product.name}
        </p>
        {swatchItems.length > 0 ? (
          <div
            className="flex flex-wrap items-center gap-1.5 mb-1.5 pt-0.5"
            aria-label="Available colors"
          >
            {swatchItems.map((item) => (
              <ColorSwatchBox
                key={item.key}
                label={item.label}
                code={item.code}
              />
            ))}
          </div>
        ) : null}
        <p className="text-sm font-black text-slate-900">{product.price}</p>
      </div>
    </div>
  );
};

export default StoreProductCard;
