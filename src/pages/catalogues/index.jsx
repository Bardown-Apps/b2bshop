import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ChevronDown, Download, Shapes, Tag, Trophy, X } from "lucide-react";
import CatalogueList from "@/components/CatalogueList";
import { CATALOGUES } from "@/constants/navigation";

const getGroupedItems = (items, key, fallbackLabel = "General") => {
  const grouped = items.reduce((acc, item) => {
    const rawValue = item[key];
    const groupValue =
      typeof rawValue === "string" && rawValue.trim()
        ? rawValue
        : fallbackLabel;

    if (!acc[groupValue]) {
      acc[groupValue] = [];
    }

    acc[groupValue].push(item);
    return acc;
  }, {});

  return Object.entries(grouped).sort(([a], [b]) => {
    if (a === fallbackLabel && b !== fallbackLabel) return 1;
    if (b === fallbackLabel && a !== fallbackLabel) return -1;
    return a.localeCompare(b);
  });
};

const normalizeValue = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "");

const CatalogueSection = ({
  groups,
  onOpenCatalogue,
  activeAccordions,
  onToggleAccordion,
}) => (
  <section className="mt-8 md:mt-10 space-y-8 md:space-y-10">
    {groups.map(([groupName, items]) => (
      <div
        key={groupName}
        className="rounded-xl border border-slate-200/80 p-4 md:p-5 bg-white/70"
      >
        <button
          type="button"
          onClick={() => onToggleAccordion(groupName)}
          className="w-full cursor-pointer flex items-center justify-between gap-4"
        >
          <h3 className="text-left text-lg md:text-xl font-bold text-slate-800">
            {groupName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {items.length} {items.length === 1 ? "catalogue" : "catalogues"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                activeAccordions[groupName] !== false ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </div>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            activeAccordions[groupName] !== false
              ? "max-h-[2000px] mt-4 opacity-100"
              : "max-h-0 mt-0 opacity-0"
          }`}
        >
          <CatalogueList items={items} onOpenCatalogue={onOpenCatalogue} />
        </div>
      </div>
    ))}
  </section>
);

const Catalogues = ({ mode = "brand", fixedCategory = "" }) => {
  const { brandSlug } = useParams();
  const [searchParams] = useSearchParams();
  const sportQuery = searchParams.get("sport") || "";
  const categoryQuery = searchParams.get("category") || "";
  const categoryFilter = fixedCategory || categoryQuery;
  const [activeView, setActiveView] = useState("brand");
  const [activeCatalogue, setActiveCatalogue] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const isCategoryQueryView =
    (mode === "brand" || mode === "category-fixed") &&
    categoryFilter.trim().length > 0;
  const filteredCatalogues = CATALOGUES.filter((catalogue) => {
    if (mode === "sport-query") {
      if (!sportQuery.trim()) return true;
      return normalizeValue(catalogue.sport) === normalizeValue(sportQuery);
    }

    if (isCategoryQueryView) {
      return (
        normalizeValue(catalogue.category) === normalizeValue(categoryFilter)
      );
    }

    if (brandSlug) {
      return normalizeValue(catalogue.brand) === normalizeValue(brandSlug);
    }

    return true;
  });
  const brandGroups = getGroupedItems(filteredCatalogues, "brand");
  const categoryGroups = getGroupedItems(filteredCatalogues, "category");
  const sportGroups = getGroupedItems(filteredCatalogues, "sport");
  const colorGuideGroups = getGroupedItems(filteredCatalogues, "colorGuide");

  console.log(colorGuideGroups);

  const sectionViews = [
    {
      id: "brand",
      label: "By Brand",
      icon: Tag,
      groups: brandGroups,
    },
    {
      id: "category",
      label: "By Category",
      icon: Shapes,
      groups: categoryGroups,
    },
    {
      id: "sport",
      label: "By Sport",
      icon: Trophy,
      groups: sportGroups,
    },
    {
      id: "colorGuide",
      label: "Color Guide",
      icon: Trophy,
      groups: colorGuideGroups,
    },
  ];
  const activeSection =
    sectionViews.find((section) => section.id === activeView) ||
    sectionViews[0];
  const shouldShowSectionTabs = mode !== "sport-query" && !isCategoryQueryView;
  const [expandedAccordions, setExpandedAccordions] = useState({});

  const handleOpenCatalogue = (item) => {
    setActiveCatalogue(item);
    setIsPdfLoading(true);
  };
  const handleCloseCatalogue = () => {
    setActiveCatalogue(null);
    setIsPdfLoading(false);
  };
  const activeAccordionState = expandedAccordions[activeView] || {};
  const handleToggleAccordion = (groupName) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [activeView]: {
        ...(prev[activeView] || {}),
        [groupName]: (prev[activeView] || {})[groupName] === false,
      },
    }));
  };

  return (
    <>
      <main className="flex-1 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-14">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mt-2">
            {mode === "sport-query"
              ? sportQuery.trim()
                ? sportQuery
                : "Sport Catalogues"
              : isCategoryQueryView
                ? mode === "category-fixed"
                  ? categoryFilter
                  : `${categoryFilter} Catalogues`
                : brandSlug && filteredCatalogues.length > 0
                  ? `${filteredCatalogues[0].brand} Catalogues`
                  : "Catalogues"}
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-3 mb-8 md:mb-10">
            {mode === "sport-query"
              ? sportQuery.trim()
                ? "Browse catalogues for this sport. Open any catalogue to view the full document."
                : "Select a sport from the navigation to browse related catalogues."
              : isCategoryQueryView
                ? "Browse catalogues for this category. Open any catalogue to view the full document."
                : brandSlug
                  ? "Browse catalogues for this brand. Open any catalogue to view the full document."
                  : "Browse our latest sport and apparel catalogues. Open any catalogue to view the full document."}
          </p>
          {(
            mode === "sport-query"
              ? sportQuery.trim() && filteredCatalogues.length === 0
              : isCategoryQueryView
                ? filteredCatalogues.length === 0
                : brandSlug && filteredCatalogues.length === 0
          ) ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 text-sm font-medium">
              {mode === "sport-query"
                ? "No catalogues found for this sport."
                : isCategoryQueryView
                  ? "No catalogues found for this category."
                  : "No catalogues found for this brand."}
            </div>
          ) : null}

          {filteredCatalogues.length > 0 ? (
            <>
              {shouldShowSectionTabs ? (
                <div className="inline-flex flex-wrap items-center gap-2 p-1 rounded-xl border border-slate-200 bg-white shadow-sm">
                  {sectionViews.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeView === section.id;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveView(section.id)}
                        className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <div
                key={activeSection.id}
                className="motion-safe:animate-[catalogueFadeIn_280ms_ease-out]"
              >
                <CatalogueSection
                  groups={activeSection.groups}
                  onOpenCatalogue={handleOpenCatalogue}
                  activeAccordions={activeAccordionState}
                  onToggleAccordion={handleToggleAccordion}
                />
              </div>
            </>
          ) : null}
        </div>
      </main>
      {activeCatalogue && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-sm p-2 md:p-4 flex items-center justify-center motion-safe:animate-[dialogOverlayFadeIn_220ms_ease-out]"
          onClick={(e) =>
            e.target === e.currentTarget && handleCloseCatalogue()
          }
        >
          <div className="h-[80vh] w-[80vw] max-w-none rounded-xl md:rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xl flex flex-col motion-safe:animate-[dialogPanelFadeIn_260ms_cubic-bezier(0.22,1,0.36,1)]">
            <div className="h-14 md:h-16 border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-3">
              <h2 className="text-sm md:text-base font-bold text-slate-900 truncate">
                {activeCatalogue.name}
              </h2>
              <div className="flex items-center gap-2">
                <a
                  href={activeCatalogue.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Download
                </a>
                <button
                  type="button"
                  onClick={handleCloseCatalogue}
                  className="cursor-pointer p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Close catalogue viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative h-full w-full bg-white">
              {isPdfLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/90">
                  <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
                  <p className="text-sm font-medium text-slate-600">
                    Loading catalogue...
                  </p>
                </div>
              )}
              <iframe
                title={activeCatalogue.name}
                src={activeCatalogue.link}
                className="h-full w-full bg-white"
                onLoad={() => setIsPdfLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes catalogueFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes dialogOverlayFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes dialogPanelFadeIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default Catalogues;
