import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

const OrderPreviewDialog = ({
  isOpen,
  onClose,
  orderPreviewSearch,
  setOrderPreviewSearch,
  fields,
  accentBgColor,
  accentTextColor,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const filteredOrderPreviewFields = useMemo(() => {
    const orderPreviewSearchText = orderPreviewSearch?.trim().toLowerCase();
    if (!orderPreviewSearchText) return fields || [];

    return (fields || []).filter((product) => {
      const haystackParts = [
        product?.name,
        product?.orderedCombination?.name,
        product?.orderedCombination?.qty,
        product?.size,
        product?.orderForm ? "order form" : null,
        ...(product?.customFields || [])
          .map((f) => `${f?.fieldName || ""} ${f?.value || ""}`.trim())
          .filter(Boolean),
      ];

      const haystack = haystackParts.filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(orderPreviewSearchText);
    });
  }, [fields, orderPreviewSearch]);

  const orderPreviewTotals = useMemo(
    () =>
      (filteredOrderPreviewFields || []).reduce(
        (acc, product) => {
          const isOrderFormItem = !!product?.orderForm;
          const decorations = !isOrderFormItem
            ? product?.decorations?.filter((d) => !!d?.customDecorationUrl) ||
              []
            : [];

          const totalSetupCost =
            decorations?.reduce(
              (sum, d) => sum + Number(d?.setUpCost || 0),
              0
            ) || 0;
          const setUpCostTax = !isOrderFormItem
            ? (totalSetupCost *
                Number(product?.orderedCombination?.taxValuePercentage || 0)) /
                100 || 0
            : 0;

          const orderFormTeams = product?.orderForm?.teams || [];
          const orderFormCombinationsCount = orderFormTeams.reduce(
            (sum, team) => sum + (team?.orderCombinations?.length || 0),
            0
          );

          let orderFormSubTotal = 0;
          for (const team of orderFormTeams) {
            for (const combo of team?.orderCombinations || []) {
              orderFormSubTotal += Number(combo?.subTotal || 0);
            }
          }
          const orderFormTaxValue = Number(product?.orderForm?.taxValue || 0);
          const orderFormLineTotal = orderFormSubTotal + orderFormTaxValue;

          const qtyValue = isOrderFormItem
            ? orderFormCombinationsCount
            : Number(product?.orderedCombination?.qty || 0);
          const lineItemTotal = isOrderFormItem
            ? Number(orderFormLineTotal || 0)
            : Number(product?.orderedCombination?.subTotal || 0) +
              Number(product?.orderedCombination?.taxValue || 0) +
              totalSetupCost +
              setUpCostTax;

          return {
            qtyTotal: acc.qtyTotal + qtyValue,
            lineTotal: acc.lineTotal + lineItemTotal,
          };
        },
        { qtyTotal: 0, lineTotal: 0 }
      ),
    [filteredOrderPreviewFields]
  );

  const getSizeLabelFromVariantObject = (variantObj) => {
    if (!variantObj) return "";

    const directSize = String(
      variantObj?.Size || variantObj?.size || ""
    ).trim();
    if (directSize) return directSize;

    const variantSelections = Array.isArray(variantObj?.variants)
      ? variantObj.variants
      : [];
    const sizeVariant = variantSelections.find((v) =>
      String(v?.variant || "")
        .trim()
        .toLowerCase()
        .includes("size")
    );

    return String(sizeVariant?.selected || "").trim();
  };

  const getProductPreviewSizeLabel = (product) => {
    const orderedCombination = product?.orderedCombination || {};
    const directSize = String(
      orderedCombination?.Size ||
        orderedCombination?.size ||
        product?.size ||
        ""
    ).trim();
    if (directSize) return directSize;

    const matchedVariant = (product?.variantsCombinations || []).find(
      (v) => v?.name === orderedCombination?.name
    );
    return getSizeLabelFromVariantObject(matchedVariant);
  };

  const orderPreviewCustomFieldColumns = useMemo(
    () => [
      ...new Set(
        (filteredOrderPreviewFields || [])
          .flatMap((product) => product?.customFields || [])
          .map((field) => String(field?.fieldName || "").trim())
          .filter(Boolean)
      ),
    ],
    [filteredOrderPreviewFields]
  );

  const orderPreviewSizeColumns = useMemo(
    () => [
      ...new Set(
        (filteredOrderPreviewFields || [])
          .flatMap((product) => {
            if (product?.orderForm) {
              return (product?.orderForm?.teams || []).flatMap((team) =>
                (team?.orderCombinations || []).map((combo) =>
                  getSizeLabelFromVariantObject(combo)
                )
              );
            }
            return [getProductPreviewSizeLabel(product)];
          })
          .filter(Boolean)
      ),
    ],
    [filteredOrderPreviewFields]
  );

  const getOrderPreviewRowMetrics = (product) => {
    const isOrderFormItem = !!product?.orderForm;
    const orderFormTeams = product?.orderForm?.teams || [];
    const orderFormCombinationsCount = orderFormTeams.reduce(
      (acc, team) => acc + (team?.orderCombinations?.length || 0),
      0
    );

    const qtyValue = isOrderFormItem
      ? orderFormCombinationsCount
      : Number(product?.orderedCombination?.qty || 0);

    const sizeQtyMap = {};
    if (isOrderFormItem) {
      for (const team of orderFormTeams) {
        for (const combo of team?.orderCombinations || []) {
          const comboSize = getSizeLabelFromVariantObject(combo);
          if (!comboSize) continue;
          sizeQtyMap[comboSize] = (sizeQtyMap[comboSize] || 0) + 1;
        }
      }
    } else {
      const productSize = getProductPreviewSizeLabel(product);
      if (productSize) {
        sizeQtyMap[productSize] = Number(qtyValue || 0);
      }
    }

    return { qtyValue, sizeQtyMap };
  };

  const orderPreviewDisplayRows = useMemo(() => {
    const groupedRows = new Map();
    const displayRows = [];

    for (const product of filteredOrderPreviewFields || []) {
      const customFields = product?.customFields || [];
      const hasCustomFields = customFields.some(
        (f) =>
          String(f?.fieldName || "").trim() !== "" ||
          String(f?.value || "").trim() !== ""
      );
      const { qtyValue, sizeQtyMap } = getOrderPreviewRowMetrics(product);

      if (hasCustomFields) {
        displayRows.push({
          key: `${product?.id || product?.name || "product"}-${displayRows.length}`,
          product,
          customFields,
          qtyValue,
          sizeQtyMap,
        });
        continue;
      }

      const stableProductId =
        product?.productId ||
        product?.orderedCombination?.productId ||
        product?.prodId;
      const groupKey = String(
        stableProductId ||
          product?.name ||
          product?.id ||
          `grouped-row-${groupedRows.size}`
      );
      if (!groupedRows.has(groupKey)) {
        const groupedRow = {
          key: groupKey,
          product,
          customFields: [],
          qtyValue: 0,
          sizeQtyMap: {},
        };
        groupedRows.set(groupKey, groupedRow);
        displayRows.push(groupedRow);
      }

      const currentRow = groupedRows.get(groupKey);
      currentRow.qtyValue += Number(qtyValue || 0);

      for (const [sizeName, sizeQty] of Object.entries(sizeQtyMap)) {
        currentRow.sizeQtyMap[sizeName] =
          (currentRow.sizeQtyMap[sizeName] || 0) + Number(sizeQty || 0);
      }
    }

    return displayRows;
  }, [filteredOrderPreviewFields]);

  if (!isOpen) return null;

  return createPortal(
    (
    <div
      className="fixed inset-0 z-100 h-screen w-screen flex items-center justify-center bg-slate-900/55 backdrop-blur-[1px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="flex h-[90vh] w-[94vw] max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Order Preview
            </h3>
            <p className="text-xs text-slate-500">
              Review items, custom fields, sizes, and quantities.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={orderPreviewSearch}
              onChange={(e) => setOrderPreviewSearch(e.target.value)}
              placeholder="Search product or custom field"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
              style={{
                boxShadow: "none",
              }}
            />
          </div>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            onClick={onClose}
            aria-label="Close order preview"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-white">
          <table
            className="min-w-full table-fixed border-collapse text-slate-700"
            style={{ color: accentBgColor || "#334155" }}
          >
            <thead
              className="sticky top-0 z-10 bg-slate-100"
              style={{
                backgroundColor: accentBgColor || undefined,
              }}
            >
              <tr>
                <th
                  className="border border-slate-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
                  style={{
                    color: accentTextColor || "#334155",
                  }}
                >
                  Product Name
                </th>
                {orderPreviewCustomFieldColumns.map((fieldName) => (
                  <th
                    key={fieldName}
                    className="border border-slate-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
                    style={{
                      color: accentTextColor || "#334155",
                    }}
                  >
                    {fieldName}
                  </th>
                ))}
                {orderPreviewSizeColumns.map((sizeName) => (
                  <th
                    key={sizeName}
                    className="border border-slate-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
                    style={{
                      color: accentTextColor || "#334155",
                    }}
                  >
                    {sizeName}
                  </th>
                ))}
                <th
                  className="border border-slate-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
                  style={{
                    color: accentTextColor || "#334155",
                  }}
                >
                  Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {orderPreviewDisplayRows?.length ? (
                orderPreviewDisplayRows?.map((row) => {
                  const { product, customFields, sizeQtyMap, qtyValue, key } = row;
                  return (
                    <tr key={key} className="even:bg-slate-50/60">
                      <td className="border border-slate-200 px-3 py-3 align-middle text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="shrink-0">
                            <img
                              alt={product.name}
                              src={product.defaultImageUrl}
                              className="h-12 w-12 rounded-md border border-slate-200 object-cover"
                            />
                          </div>
                          <div className="min-w-0 text-center">
                            <p className="text-xs font-medium">{product.name}</p>
                          </div>
                        </div>
                      </td>

                      {orderPreviewCustomFieldColumns.map((fieldName) => {
                        const values = customFields
                          .filter(
                            (f) =>
                              String(f?.fieldName || "").trim() === fieldName &&
                              String(f?.value || "").trim() !== ""
                          )
                          .map((f) => String(f?.value || "").trim());

                        const uniqueValues = [...new Set(values)];

                        return (
                          <td
                            key={fieldName}
                            className="border border-slate-200 px-3 py-2 align-middle text-center"
                          >
                            {uniqueValues.length ? (
                              <p className="text-xs">{uniqueValues.join(", ")}</p>
                            ) : (
                              <p className="text-xs text-slate-400">-</p>
                            )}
                          </td>
                        );
                      })}

                      {orderPreviewSizeColumns.map((sizeName) => {
                        const sizeQty = sizeQtyMap[sizeName];
                        return (
                          <td
                            key={sizeName}
                            className="border border-slate-200 px-3 py-2 align-middle text-center"
                          >
                            <p className="text-xs">{sizeQty || 0}</p>
                          </td>
                        );
                      })}

                      <td className="border border-slate-200 px-3 py-2 align-middle text-center text-xs font-semibold text-slate-900">
                        {qtyValue}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={
                      2 + orderPreviewCustomFieldColumns.length + orderPreviewSizeColumns.length
                    }
                    className="border border-slate-200 px-4 py-10 text-center text-sm text-slate-500"
                  >
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 bg-slate-50">
          <table className="min-w-full table-fixed border-collapse">
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2" />
                {orderPreviewCustomFieldColumns.map((fieldName) => (
                  <td
                    key={fieldName}
                    className="border border-slate-200 px-3 py-2"
                  />
                ))}
                {orderPreviewSizeColumns.map((sizeName) => (
                  <td
                    key={sizeName}
                    className="border border-slate-200 px-3 py-2"
                  />
                ))}
                <td className="border border-slate-200 px-3 py-2 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-slate-900">
                      Total: {orderPreviewTotals.qtyTotal}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    ),
    document.body
  );
};

export default OrderPreviewDialog;
