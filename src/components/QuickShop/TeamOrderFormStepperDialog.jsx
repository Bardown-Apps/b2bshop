import { useState, useCallback, useEffect, useMemo } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { usePost } from "@/hooks/usePost";
import { SHOP_ORDER_FORM, SHOP_UI } from "@/constants/services";
import { set as setShop } from "@/store/slices/shopSlice";

import useCart from "@/pages/cart/useCart";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "@/utils/classNames";
import { FormSection, ProductImageSection } from "./TeamOrderForm";
import { SummarySheetModal } from "./TeamOrderForm/SummarySheetModal";
import { AllProductsSummaryModal } from "./TeamOrderForm/AllProductsSummaryModal";

const STEPS = ["Select Club", "Teams", "Select Products", "Team Order Form"];

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getProductKeyPrefix(product) {
  const id = product?.prodId ?? product?.id ?? product?.name;
  return id != null ? String(id) : "product";
}

function getMergedColumnKey(product, key) {
  const safeKey = key != null ? String(key) : "";
  return `${getProductKeyPrefix(product)}::${safeKey}`;
}

function getLastTwoWords(text) {
  const value = text != null ? String(text).trim() : "";
  if (!value) return "Product";
  const parts = value.split(/\s+/).filter(Boolean);
  return parts.slice(-2).join(" ");
}

/** Theme: light background tint from hex (e.g. for selected card) */
function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== "string") return `rgba(79, 70, 229, ${alpha})`;
  const h = hex.replace("#", "");
  if (h.length !== 6) return `rgba(79, 70, 229, ${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Build form teams (with rows) from step-2 config: each team has playersCount + coachesCount rows; # column shows Player1, Coach1, etc. */
function createTeamsFromConfig(teamsConfig) {
  return (teamsConfig || []).map((t) => {
    const players = Math.max(0, Number(t.playersCount) || 0);
    const coaches = Math.max(0, Number(t.coachesCount) || 0);
    const totalRows = players + coaches;
    const rows = Array.from({ length: totalRows }, (_, i) => {
      const label =
        i < players ? `Player ${i + 1}` : `Coach ${i - players + 1}`;
      return { id: generateId(), rowLabel: label };
    });
    return {
      id: t.id,
      name: t.name || "Team",
      rows,
    };
  });
}

/** Step 1: Club cards with logo */
function Step1Clubs({ clubs, selectedClub, onSelect }) {
  const themeBg = "#000000";
  const themeLight = hexToRgba(themeBg, 0.12);
  if (!clubs?.length) {
    return <p className="text-gray-500">No clubs available for this shop.</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      {clubs.map((club) => {
        const isSelected = selectedClub?.clubId === club?.clubId;
        const logo = club?.clubLogo || club?.clubTileBanner;
        const hasOrderForm = !!club?.orderForm;
        return (
          <button
            key={club?.clubId}
            type="button"
            onClick={() => onSelect(club)}
            className={classNames(
              "flex flex-col items-center rounded-2xl border-2 p-5 transition-all duration-200 text-left shadow-sm",
              !isSelected &&
                "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-md",
            )}
            style={
              isSelected
                ? {
                    borderColor: themeBg,
                    backgroundColor: themeLight,
                    boxShadow: `0 0 0 2px ${themeBg}, 0 4px 6px -1px rgba(0,0,0,0.08)`,
                  }
                : undefined
            }
          >
            <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 ring-1 ring-gray-200/80">
              {logo ? (
                <img
                  src={logo}
                  alt={club?.clubName || ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xs">No logo</span>
              )}
            </div>
            <span className="mt-3 text-sm font-semibold text-gray-900 truncate w-full text-center">
              {club?.clubName || "Unnamed club"}
            </span>
            {hasOrderForm && (
              <span
                className="mt-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: hexToRgba(themeBg, 0.15),
                  color: themeBg,
                }}
              >
                Form saved
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Step 2: Teams – add/delete teams, each with number of players and coaches */
function Step2Teams({ teamsConfig, onAddTeam, onDeleteTeam, onUpdateTeam }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600 max-w-xl">
        Add each team and set how many players and coaches per team. You can add
        or remove teams.
      </p>
      <div className="space-y-4">
        {teamsConfig.map((team, index) => (
          <div
            key={team.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="min-w-[140px] shrink-0">
              <label className="sr-only">Team name</label>
              <input
                type="text"
                value={team.name ?? ""}
                onChange={(e) =>
                  onUpdateTeam(index, { ...team, name: e.target.value })
                }
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v !== (team.name ?? "").trim()) {
                    onUpdateTeam(index, {
                      ...team,
                      name: v || `Team ${index + 1}`,
                    });
                  }
                }}
                placeholder={`Team ${index + 1}`}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 flex-1">
              <div>
                <label className="sr-only">Players</label>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={team.playersCount === "" ? "" : team.playersCount}
                  onChange={(e) => {
                    const v =
                      e.target.value === ""
                        ? ""
                        : Math.max(0, parseInt(e.target.value, 10) || 0);
                    onUpdateTeam(index, { ...team, playersCount: v });
                  }}
                  placeholder="Players"
                  className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                />
                <span className="ml-2 text-sm text-gray-500">players</span>
              </div>
              <div>
                <label className="sr-only">Coaches</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={team.coachesCount === "" ? "" : team.coachesCount}
                  onChange={(e) => {
                    const v =
                      e.target.value === ""
                        ? ""
                        : Math.max(0, parseInt(e.target.value, 10) || 0);
                    onUpdateTeam(index, { ...team, coachesCount: v });
                  }}
                  placeholder="Coaches"
                  className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                />
                <span className="ml-2 text-sm text-gray-500">coaches</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDeleteTeam(index)}
              className="inline-flex items-center gap-1 rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label={`Delete ${team.name}`}
              title="Delete team"
            >
              <TrashIcon className="size-5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAddTeam}
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-opacity"
        style={{
          backgroundColor: "#000000",
          color: "#fff",
        }}
      >
        <PlusIcon className="size-5" />
        Add team
      </button>
    </div>
  );
}

/** Step 3: Product cards (multi-select). Selected club bar is shown above by the dialog. */
function Step5Products({
  club,
  products,
  selectedProductIds,
  onToggleProduct,
}) {
  const themeBg = "#000000";
  const themeLight = hexToRgba(themeBg, 0.12);
  if (!club)
    return <p className="text-gray-500">Select a club in Step 1 first.</p>;
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-4">
          Select products (multi-select)
        </p>
        {!products?.length ? (
          <p className="text-gray-500">
            No products for this club, or still loading.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map((product) => {
              const id = product?.prodId;
              const idKey = id != null ? String(id) : null;
              const isSelected =
                idKey != null && selectedProductIds.includes(idKey);
              const img =
                product?.defaultImageUrl || product?.mediaFiles?.[0]?.imageUrl;
              return (
                <button
                  key={idKey ?? product?.name}
                  type="button"
                  onClick={() => idKey != null && onToggleProduct(idKey)}
                  className={classNames(
                    "flex flex-col rounded-xl border-2 p-3 transition-all duration-200 text-left shadow-sm",
                    !isSelected &&
                      "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md",
                  )}
                  style={
                    isSelected
                      ? {
                          borderColor: themeBg,
                          backgroundColor: themeLight,
                          boxShadow: `0 0 0 2px ${themeBg}, 0 2px 4px -1px rgba(0,0,0,0.06)`,
                        }
                      : undefined
                  }
                >
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 ring-1 ring-gray-200/80">
                    {img ? (
                      <img
                        src={img}
                        alt={product?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-900 break-words">
                    {product?.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/** Step 4: Clone of Team Order Form with stepper data */
function Step4OrderForm({ clubName, teams, onTeamsChange, selectedProducts }) {
  const product = selectedProducts?.[0];
  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const mergedProduct = useMemo(() => {
    if (!selectedProducts?.length) return null;

    const mergedCustomFields = selectedProducts.flatMap((p) => {
      const productName = p?.name || "Product";
      const shortProductName = getLastTwoWords(productName);
      return (p?.customFields ?? []).map((field) => {
        const rawKey =
          field?.fieldName || field?.name || field?.id || field?.title || "";
        const mergedKey = getMergedColumnKey(p, rawKey);
        return {
          ...field,
          fieldName: mergedKey,
          name: `${shortProductName} / ${rawKey}`,
          title: `${shortProductName} / ${rawKey}`,
          tooltipTitle: `${productName} / ${rawKey}`,
        };
      });
    });

    const mergedColorValues = selectedProducts.flatMap((p) => {
      const productName = p?.name || "Product";
      const shortProductName = getLastTwoWords(productName);
      const colorVariant = p?.variants?.find((v) => v?.variant === "Color");
      return (colorVariant?.values ?? []).map((color) => {
        const rawColor = color?.value;
        const mergedKey = getMergedColumnKey(p, rawColor);
        return {
          ...color,
          value: mergedKey,
          label: `${shortProductName} / ${rawColor}`,
          tooltipTitle: `${productName} / ${rawColor}`,
        };
      });
    });

    const mergedSizeMap = new Map();
    selectedProducts.forEach((p) => {
      const sizeVariant = p?.variants?.find((v) => v?.variant === "Size");
      (sizeVariant?.values ?? []).forEach((size) => {
        if (!size?.value) return;
        if (!mergedSizeMap.has(size.value)) {
          mergedSizeMap.set(size.value, {
            value: size.value,
            label: size.value,
          });
        }
      });
    });

    return {
      ...selectedProducts[0],
      customFields: mergedCustomFields,
      variants: [
        { variant: "Color", values: mergedColorValues },
        { variant: "Size", values: Array.from(mergedSizeMap.values()) },
      ],
    };
  }, [selectedProducts]);

  const mergedColorVariant = mergedProduct?.variants?.find(
    (v) => v?.variant === "Color",
  );
  const colorOptions =
    mergedColorVariant?.values?.map((v) => ({
      value: v?.value,
      label: v?.label || v?.value,
    })) ?? [];
  const mergedSizeVariant = mergedProduct?.variants?.find(
    (v) => v?.variant === "Size",
  );
  const sizeOptions =
    mergedSizeVariant?.values?.map((v) => ({
      value: v?.value,
      label: v?.label,
    })) ?? [];

  if (!product) {
    return (
      <p className="text-gray-500">
        Select at least one product in the previous step.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        <div className="flex min-h-0 flex-1 overflow-hidden rounded border border-gray-200">
          <ProductImageSection
            product={product}
            onSummarySheetClick={() => setSummarySheetOpen(true)}
          />
          <div className="flex-1 min-w-0">
            <FormSection
              product={mergedProduct}
              clubName={clubName}
              onClubNameChange={() => {}}
              teams={teams}
              onTeamsChange={onTeamsChange}
              hideClubName
              hideAddTeam
              readOnlyTeamTabs
              hideRowActions
            />
          </div>
        </div>
      </div>
      <SummarySheetModal
        open={summarySheetOpen}
        onClose={() => setSummarySheetOpen(false)}
        teams={teams}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
      />
    </>
  );
}

/** Step 4: every row in every team must have all color columns and custom fields filled (per product). */
function isStep4Valid(teams, selectedProducts) {
  if (!selectedProducts?.length || !teams?.length) return false;
  for (const product of selectedProducts) {
    const customFields = product?.customFields ?? [];

    const customKeys = customFields
      .map((col) => {
        const rawKey = col?.fieldName || col?.name || col?.id || col?.title;
        return getMergedColumnKey(product, rawKey);
      })
      .filter(Boolean);

    const numberFieldKeys = customFields
      .map((col) => {
        const name = col?.fieldName || col?.name || col?.id || col?.title;
        if (typeof name !== "string") return null;
        return name.toUpperCase().includes("NUMBER")
          ? getMergedColumnKey(product, name)
          : null;
      })
      .filter(Boolean);

    const colorVariant = product?.variants?.find((v) => v?.variant === "Color");
    const colorOptions = colorVariant?.values ?? [];
    const colorKeys = colorOptions
      .map((c) => getMergedColumnKey(product, c?.value))
      .filter(Boolean);
    const requiredKeys = [...new Set([...customKeys, ...colorKeys])];

    if (requiredKeys.length === 0) continue;

    let count = 0;

    for (const team of teams) {
      for (const row of team.rows ?? []) {
        for (const key of requiredKeys) {
          const val = row[key];
          if (val) {
            count++;
          }
        }
      }
    }

    if (count === 0) return false;

    // NUMBER fields (e.g. jersey numbers) must be unique within a team
    if (numberFieldKeys.length > 0) {
      for (const team of teams) {
        for (const key of numberFieldKeys) {
          const seen = new Set();
          for (const row of team.rows ?? []) {
            const rawVal = row[key];
            if (rawVal === undefined || rawVal === null) continue;
            const normalized = String(rawVal).trim();
            if (!normalized) continue;
            if (seen.has(normalized)) return false;
            seen.add(normalized);
          }
        }
      }
    }
  }
  return true;
}

/** Default one team config entry */
function defaultTeamConfig(index) {
  return {
    id: generateId(),
    name: `Team ${index + 1}`,
    playersCount: 0,
    coachesCount: 0,
  };
}

export function TeamOrderFormStepperDialog({ open, onClose }) {
  const dispatch = useDispatch();
  const { clubs, shopName, shopLink } = useSelector((s) => s?.shop);
  const { mutateAsync } = usePost();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedClub, setSelectedClub] = useState(null);
  const [teamsConfig, setTeamsConfig] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [teams, setTeams] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [stepValidationError, setStepValidationError] = useState(null);
  const [allProductsSummaryOpen, setAllProductsSummaryOpen] = useState(false);
  const { addToCart } = useCart();

  const clubId = selectedClub?.clubId;
  const products = useSelector((state) => state.products.list);

  const selectedProducts = useMemo(
    () =>
      products.filter((p) => {
        const id = p?.prodId;
        return id != null && selectedProductIds.includes(String(id));
      }),
    [products, selectedProductIds],
  );

  // At least one team configured with all values (name, players, coaches)
  const hasAtLeastOneCompleteTeam = useMemo(() => {
    if (!teamsConfig?.length) return false;
    return teamsConfig.some(
      (t) =>
        (t.name ?? "").trim() !== "" &&
        t.playersCount !== "" &&
        t.coachesCount !== "" &&
        Number(t.playersCount) >= 0 &&
        Number(t.coachesCount) >= 0,
    );
  }, [teamsConfig]);

  // At least one product selected
  const hasAtLeastOneProductSelected = selectedProductIds.length > 0;

  // At least one size selected anywhere in the teams (for any selected product/color)
  const hasAtLeastOneSizeSelected = useMemo(() => {
    if (!selectedProducts?.length || !teams?.length) return false;

    for (const product of selectedProducts) {
      const colorVariant = product?.variants?.find(
        (v) => v?.variant === "Color",
      );
      const colorOptions = colorVariant?.values ?? [];
      if (!colorOptions.length) continue;

      for (const team of teams) {
        for (const row of team.rows ?? []) {
          for (const color of colorOptions) {
            const key = getMergedColumnKey(product, color?.value);
            if (!key) continue;
            const raw = row?.[key];
            if (
              raw !== undefined &&
              raw !== null &&
              String(raw).trim() !== ""
            ) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }, [selectedProducts, teams]);

  // For Step 4: sizes for all colors in a row must match (per product/team/row).
  const hasRowSizeMismatch = useMemo(() => {
    if (currentStep !== 3) return false;
    if (!selectedProducts?.length || !teams?.length) return false;

    for (const product of selectedProducts) {
      const colorVariant = product?.variants?.find(
        (v) => v?.variant === "Color",
      );
      const colorOptions =
        colorVariant?.values?.map((v) => v?.value).filter(Boolean) ?? [];
      if (!colorOptions.length) continue;

      for (const team of teams) {
        for (const row of team.rows ?? []) {
          const values = colorOptions.map((colorKey) => {
            const mergedColorKey = getMergedColumnKey(product, colorKey);
            const raw = row?.[mergedColorKey];
            return raw !== undefined && raw !== null ? String(raw).trim() : "";
          });
          const nonEmpty = values.filter((v) => v !== "");
          if (nonEmpty.length > 1) {
            const first = nonEmpty[0];
            const mismatch = nonEmpty.some((v) => v !== "" && v !== first);
            if (mismatch) return true;
          }
        }
      }
    }

    return false;
  }, [currentStep, selectedProducts, teams]);

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setSelectedClub(null);
      setTeamsConfig([]);
      setSelectedProductIds([]);
      setTeams([]);
    }
  }, [open]);

  // Prefill form when selected club has saved orderForm data
  useEffect(() => {
    if (!selectedClub) return;
    const of = selectedClub.orderForm;
    if (of) {
      setTeamsConfig(Array.isArray(of.teamsConfig) ? of.teamsConfig : []);
      setSelectedProductIds(
        Array.isArray(of.selectedProductIds)
          ? of.selectedProductIds.map((id) => String(id))
          : [],
      );
      setTeams(Array.isArray(of.teams) ? of.teams : []);
    } else {
      setTeamsConfig([]);
      setSelectedProductIds([]);
      setTeams([]);
    }
  }, [selectedClub]);

  const advanceToNextStep = () => {
    if (!canNext()) {
      setStepValidationError(getStepValidationMessage(currentStep));
      return;
    }
    setStepValidationError(null);
    if (currentStep === 2) {
      const fromConfig = createTeamsFromConfig(teamsConfig);
      // Only overwrite teams if structure changed (e.g. user edited config); preserve prefilled Step 4 data
      const sameStructure =
        teams.length === fromConfig.length &&
        fromConfig.every(
          (fc, i) =>
            teams[i] && (teams[i].rows?.length ?? 0) === (fc.rows?.length ?? 0),
        );
      if (!sameStructure) {
        setTeams(fromConfig);
      }
    }
    setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const addTeam = () => {
    setTeamsConfig((prev) => [...prev, defaultTeamConfig(prev.length)]);
  };

  const deleteTeam = (index) => {
    setTeamsConfig((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTeam = (index, updated) => {
    setTeamsConfig((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const toggleProduct = (id) => {
    const key = id != null ? String(id) : null;
    if (key == null) return;
    setSelectedProductIds((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  const canNext = () => {
    switch (currentStep) {
      case 0:
        return !!selectedClub;
      case 1:
        return (
          teamsConfig.length >= 1 &&
          teamsConfig.every(
            (t) =>
              (t.name ?? "").trim() !== "" &&
              t.playersCount !== "" &&
              Number(t.playersCount) >= 0 &&
              t.coachesCount !== "" &&
              Number(t.coachesCount) >= 0,
          )
        );
      case 2:
        return selectedProductIds.length > 0;
      case 3:
        return isStep4Valid(teams, selectedProducts);
      default:
        return true;
    }
  };

  const isAllStepsValid = () =>
    !!selectedClub &&
    teamsConfig.length >= 1 &&
    teamsConfig.every(
      (t) =>
        (t.name ?? "").trim() !== "" &&
        t.playersCount !== "" &&
        Number(t.playersCount) >= 0 &&
        t.coachesCount !== "" &&
        Number(t.coachesCount) >= 0,
    ) &&
    selectedProductIds.length > 0 &&
    isStep4Valid(teams, selectedProducts);

  const getStepValidationMessage = (step) => {
    switch (step) {
      case 0:
        return !selectedClub ? "Please select a club." : null;
      case 1:
        if (teamsConfig.length < 1) return "Please add at least one team.";
        const bad = teamsConfig.find(
          (t) =>
            (t.name ?? "").trim() === "" ||
            t.playersCount === "" ||
            t.coachesCount === "",
        );
        if (bad) {
          if ((bad.name ?? "").trim() === "")
            return "Every team must have a name.";
          if (bad.playersCount === "")
            return "Every team must have a number of players.";
          if (bad.coachesCount === "")
            return "Every team must have a number of coaches.";
        }
        return null;
      case 2:
        return selectedProductIds.length === 0
          ? "Please select at least one product."
          : null;
      case 3:
        return !isStep4Valid(teams, selectedProducts)
          ? "Please fill in all required fields in the order form (every row: size/color and any custom fields), and ensure that any NUMBER fields are unique within each team."
          : null;
      default:
        return null;
    }
  };

  const performSave = useCallback(
    async (closeOnSuccess = false) => {
      if (!selectedClub || !clubs?.length) return;
      setSubmitError(null);
      setSubmitLoading(true);
      try {
        const orderForm = {
          teamsConfig,
          teams,
          selectedProductIds,
          productSummary: selectedProducts.map((p) => ({
            productId: p?.prodId ?? p?.id,
            name: p?.name,
          })),
        };
        const updatedClubs = clubs.map((c) =>
          String(c?.clubId) === String(selectedClub.clubId)
            ? { ...c, orderForm }
            : c,
        );
        const result = await mutateAsync({
          url: SHOP_ORDER_FORM,
          data: { clubs: updatedClubs },
          isPut: true,
        });
        if (result?.error) {
          setSubmitError(result.error);
          return;
        }
        // Fetch shop data again and save in Redux so clubs/orderForm are up to date

        const shopRes = await mutateAsync({
          url: SHOP_UI,
          data: { shopName: shopLink },
        });
        if (shopRes?.data) dispatch(setShop(shopRes.data));
        if (closeOnSuccess) onClose();
      } catch (err) {
        setSubmitError(err?.message ?? "Failed to save");
      } finally {
        setSubmitLoading(false);
      }
    },
    [
      selectedClub,
      clubs,
      shopName,
      teamsConfig,
      teams,
      selectedProductIds,
      selectedProducts,
      mutateAsync,
      dispatch,
      onClose,
    ],
  );

  const handleSave = useCallback(() => {
    // Save is a "draft" save – no validation, everything is optional.
    setStepValidationError(null);
    performSave(false);
  }, [performSave]);

  const handleSubmitOrder = useCallback(async () => {
    if (!isAllStepsValid()) {
      setStepValidationError(
        "Please complete all steps: select club, add teams with names and counts, select products, and fill all order form fields.",
      );
      return;
    }
    setStepValidationError(null);

    // For each selected product, build an orderForm scoped to that product only.
    // In orderForm.teams, each team must only have:
    // - name: string
    // - orderCombinations: array of { Size, Color, name, qty, unitPrice, subTotal }
    try {
      const cartPromises = selectedProducts.map((product) => {
        const productId = product?.prodId ?? product?.id;
        const productIdStr = productId != null ? String(productId) : undefined;

        const colorVariant = product?.variants?.find(
          (v) => v?.variant === "Color",
        );
        const colorKeys =
          colorVariant?.values?.map((v) => v?.value).filter(Boolean) ?? [];
        const baseUnitPrice = Number(product?.price ?? 0);

        const teamsForProduct = (teams || []).map((team) => {
          const orderCombinations = [];
          const rows = team?.rows || [];

          for (const row of rows) {
            if (!row) continue;

            for (const colorKey of colorKeys) {
              if (!colorKey) continue;
              const mergedColorKey = getMergedColumnKey(product, colorKey);
              const rawSize = row?.[mergedColorKey];
              const sizeValue =
                rawSize !== undefined && rawSize !== null
                  ? String(rawSize).trim()
                  : "";
              if (!sizeValue) continue;

              const qty = 1;
              const unitPrice = baseUnitPrice;
              const subTotal = unitPrice * qty;

              orderCombinations.push({
                Size: sizeValue,
                Color: colorKey,
                name: `${sizeValue} | ${colorKey}`,
                qty,
                unitPrice,
                subTotal,
              });
            }
          }

          return {
            name: team?.name ?? "",
            orderCombinations,
          };
        });

        const productOrderForm = {
          teams: teamsForProduct,
        };

        const payload = {
          ...product,
          orderForm: productOrderForm,
        };

        return addToCart(payload);
      });

      await Promise.all(cartPromises);
    } catch (e) {
      // addToCart already handles error display; abort submit on failure
      return;
    }

    // performSave(true);
  }, [
    addToCart,
    isAllStepsValid,
    performSave,
    selectedProducts,
    selectedProductIds,
    teams,
    teamsConfig,
  ]);

  const stepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1Clubs
            clubs={clubs}
            selectedClub={selectedClub}
            onSelect={setSelectedClub}
          />
        );
      case 1:
        return (
          <Step2Teams
            teamsConfig={teamsConfig}
            onAddTeam={addTeam}
            onDeleteTeam={deleteTeam}
            onUpdateTeam={updateTeam}
          />
        );
      case 2:
        return (
          <Step5Products
            club={selectedClub}
            products={products}
            selectedProductIds={selectedProductIds}
            onToggleProduct={toggleProduct}
          />
        );
      case 3:
        return (
          <Step4OrderForm
            clubName={selectedClub?.clubName ?? ""}
            teams={teams}
            onTeamsChange={setTeams}
            selectedProducts={selectedProducts}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} className="relative z-20">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-600/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150"
        />
        <DialogPanel
          transition
          className="fixed inset-0 flex flex-col overflow-hidden bg-white shadow-2xl data-[closed]:opacity-0 data-[closed]:scale-95 data-[enter]:duration-200 data-[leave]:duration-150"
          style={{
            ["--theme-primary"]: "#000000",
            ["--theme-primary-text"]: "#fff",
          }}
        >
          {/* Fixed Header */}
          <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">
              Team Order Form
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  submitLoading ||
                  !selectedClub ||
                  hasRowSizeMismatch ||
                  !hasAtLeastOneCompleteTeam ||
                  !hasAtLeastOneProductSelected ||
                  !hasAtLeastOneSizeSelected
                }
                className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {submitLoading ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={
                  submitLoading ||
                  !selectedClub ||
                  hasRowSizeMismatch ||
                  !hasAtLeastOneCompleteTeam ||
                  !hasAtLeastOneProductSelected ||
                  !hasAtLeastOneSizeSelected
                }
                className="rounded-md px-5 py-2.5 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none"
                style={{
                  backgroundColor: "#000000",
                  color: "#fff",
                }}
              >
                {submitLoading ? "Saving…" : "Submit Order"}
              </button>
            </div>
          </header>

          {submitError && (
            <div className="shrink-0 bg-red-50 border-b border-red-200 border-l-4 border-l-red-500 px-4 py-3 text-sm text-red-800">
              {submitError}
            </div>
          )}

          {/* Stepper */}
          <div className="shrink-0 border-b border-gray-200 bg-gray-50/80 px-4 py-4 sm:px-6">
            <nav
              aria-label="Progress"
              className="flex items-center justify-between gap-1 overflow-x-auto pb-0.5"
            >
              {STEPS.map((label, index) => {
                const complete = index < currentStep;
                const current = index === currentStep;
                const themeBg = "#000000";
                const themeText = "#fff";
                return (
                  <div key={label} className="flex shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(index);
                        setStepValidationError(null);
                      }}
                      className="flex items-center rounded-lg px-1.5 py-1.5 -m-1.5 cursor-pointer hover:bg-gray-200/80 focus:outline-none transition-colors"
                      aria-label={`Go to step ${index + 1}: ${label}`}
                      aria-current={current ? "step" : undefined}
                    >
                      <span
                        className={classNames(
                          "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                          !complete &&
                            !current &&
                            "border-gray-300 bg-white text-gray-500",
                        )}
                        style={
                          complete
                            ? {
                                borderColor: themeBg,
                                backgroundColor: themeBg,
                                color: themeText,
                              }
                            : current
                              ? {
                                  borderColor: themeBg,
                                  backgroundColor: "white",
                                  color: themeBg,
                                }
                              : undefined
                        }
                      >
                        {complete ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span
                        className={classNames(
                          "ml-2 hidden text-sm font-medium sm:block",
                          !current && !complete && "text-gray-500",
                          complete && "text-gray-900",
                        )}
                        style={current ? { color: themeBg } : undefined}
                      >
                        {label}
                      </span>
                    </button>
                    {index < STEPS.length - 1 && (
                      <ChevronRightIcon
                        className="mx-1 h-5 w-5 text-gray-400 shrink-0"
                        aria-hidden
                      />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Scrollable Body */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/30">
            {stepValidationError && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {stepValidationError}
              </div>
            )}
            {currentStep >= 1 && selectedClub && (
              <div className="flex items-center justify-between gap-4 mb-5 p-4 rounded-xl bg-white border border-gray-200 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-200/80">
                    {selectedClub?.clubLogo || selectedClub?.clubTileBanner ? (
                      <img
                        src={
                          selectedClub.clubLogo || selectedClub.clubTileBanner
                        }
                        alt={selectedClub.clubName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                        No logo
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Selected club
                    </p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {selectedClub.clubName}
                    </p>
                  </div>
                </div>
                {currentStep === 3 && selectedProducts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAllProductsSummaryOpen(true)}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:ring-offset-2"
                  >
                    <DocumentTextIcon className="size-4" />
                    All Products Summary Sheet
                  </button>
                )}
              </div>
            )}
            {stepContent()}
          </div>

          {/* Fixed Footer */}
          <footer className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-white px-4 py-4 sm:px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep((s) => Math.max(0, s - 1));
                  setStepValidationError(null);
                }}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:ring-offset-2"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                Back
              </button>
            </div>

            <div className="flex items-center gap-2">
              {currentStep < STEPS.length - 1 && (
                <button
                  type="button"
                  onClick={advanceToNextStep}
                  disabled={!canNext()}
                  className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-base font-medium shadow-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:ring-offset-2"
                  style={{
                    backgroundColor: "#000000",
                    color: "#fff",
                  }}
                >
                  Next
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </footer>
        </DialogPanel>
      </Dialog>
      <AllProductsSummaryModal
        open={allProductsSummaryOpen}
        onClose={() => setAllProductsSummaryOpen(false)}
        selectedProducts={selectedProducts}
        teams={teams}
      />
    </>
  );
}
