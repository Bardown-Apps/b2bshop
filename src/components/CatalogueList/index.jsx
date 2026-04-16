import { ArrowUpRight } from "lucide-react";

const CatalogueCard = ({ item, onOpenCatalogue }) => {
  const subtitle = item.sport || item.category || "General";

  return (
    <article
      className="group relative isolate overflow-hidden h-full flex flex-col bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 cursor-pointer"
      onClick={() => onOpenCatalogue(item)}
    >
      {item.logo && (
        <div>
          {/* <img
            src={item.logo}
            alt=""
            className="absolute -right-5 -top-5 h-40 w-40 object-contain opacity-[0.32] group-hover:opacity-[0.4] transition-opacity duration-300"
            loading="lazy"
            aria-hidden="true"
          /> */}
          {/* <div
            className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/80 to-white/70"
            aria-hidden="true"
          /> */}

          <img
            src={item.link?.replace(".pdf", ".png")}
            alt=""
            // className="object-cover opacity-[0.32] group-hover:opacity-[0.2] transition-opacity duration-300"
            loading="lazy"
            aria-hidden="true"
          />
        </div>
      )}

      <div className="relative z-10 mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
          {item.brand}
        </p>
      </div>
      <h3 className="relative z-10 text-lg font-bold text-slate-900">
        {item.name}
      </h3>
      <p className="relative z-10 text-sm text-slate-500 mt-1">{subtitle}</p>

      {/* <div className="relative z-10 mt-auto pt-5">
        <button
          type="button"
          onClick={() => onOpenCatalogue(item)}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold transition-all duration-200 hover:bg-slate-700 hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        >
          Open Catalogue
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div> */}
    </article>
  );
};

const CatalogueList = ({ items, onOpenCatalogue }) => (
  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {items.map((item) => (
      <CatalogueCard
        key={item.name}
        item={item}
        onOpenCatalogue={onOpenCatalogue}
      />
    ))}
  </section>
);

export default CatalogueList;
