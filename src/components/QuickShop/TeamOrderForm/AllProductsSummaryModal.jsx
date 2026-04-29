import { useMemo } from "react";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

function aggregateTeamColor(rows, colorKey, sizeOptions) {
  const sizes = {};
  let total = 0;
  (rows || []).forEach((row) => {
    const selectedSize = row[colorKey];
    if (!selectedSize) return;
    sizes[selectedSize] = (sizes[selectedSize] || 0) + 1;
    total += 1;
  });
  const sizeCounts = (sizeOptions || []).reduce((acc, size) => {
    acc[size.value] = sizes[size.value] || 0;
    return acc;
  }, {});
  return { sizeCounts, total };
}

function buildTablesByColor(teams, colorOptions, sizeOptions) {
  if (!teams?.length || !colorOptions?.length || !sizeOptions?.length)
    return [];
  return colorOptions.map((color) => {
    const colorKey = color.value;
    const colorLabel = color.label;
    const teamRows = teams.map((team) => {
      const { sizeCounts, total } = aggregateTeamColor(
        team.rows || [],
        colorKey,
        sizeOptions,
      );
      return {
        teamLabel: team.name,
        label: `${team.name} ${colorLabel} Jersey`,
        sizeCounts,
        total,
      };
    });
    const totalRow = {
      sizeCounts: sizeOptions.reduce((acc, size) => {
        acc[size.value] = teamRows.reduce(
          (sum, r) => sum + (r.sizeCounts[size.value] || 0),
          0,
        );
        return acc;
      }, {}),
      total: teamRows.reduce((sum, r) => sum + r.total, 0),
    };
    return { colorLabel, teamRows, totalRow };
  });
}

function generateProductCSV(tablesByColor, sizeOptions) {
  const csvRows = [];
  tablesByColor.forEach(({ colorLabel, teamRows, totalRow }) => {
    const headers = [
      "TEAM NAME",
      "COLOR",
      ...sizeOptions.map((s) => s.label),
      "TOTAL",
      "TEST",
    ];
    csvRows.push(headers.join(","));
    teamRows.forEach((row) => {
      const values = [
        row.teamLabel,
        colorLabel,
        ...sizeOptions.map((s) => row.sizeCounts[s.value] || 0),
        row.total,
        "ok",
      ];
      csvRows.push(values.join(","));
    });
    const totalValues = [
      "TOTAL",
      "",
      ...sizeOptions.map((s) => totalRow.sizeCounts[s.value] || 0),
      totalRow.total,
      "0",
    ];
    csvRows.push(totalValues.join(","));
    csvRows.push([...Array(sizeOptions.length + 2)].fill("").join(","));
  });
  return csvRows.join("\n");
}

function downloadCSV(csvContent, filename = "summary-all-products.csv") {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Modal showing summary for all selected products on Step 4:
 * one section per product (product name + teams × colors × sizes tables).
 */
export function AllProductsSummaryModal({
  open,
  onClose,
  selectedProducts = [],
  teams = [],
}) {
  const productSummaries = useMemo(() => {
    return (selectedProducts || []).map((product) => {
      const colorVariant = product?.variants?.find(
        (v) => v?.variant === "Color",
      );
      const colorOptions =
        colorVariant?.values?.map((v) => ({
          value: v?.value,
          label: v?.value,
        })) ?? [];
      const sizeVariant = product?.variants?.find((v) => v?.variant === "Size");
      const sizeOptions =
        sizeVariant?.values?.map((v) => ({
          value: v?.value,
          label: v?.value,
        })) ?? [];
      const tablesByColor = buildTablesByColor(
        teams,
        colorOptions,
        sizeOptions,
      );
      return {
        productName: product?.name ?? "Product",
        colorOptions,
        sizeOptions,
        tablesByColor,
      };
    });
  }, [selectedProducts, teams]);

  const hasAnyData = productSummaries.some(
    (s) => s.tablesByColor && s.tablesByColor.length > 0,
  );

  const handleDownloadCSV = () => {
    const sections = productSummaries
      .filter((s) => s.tablesByColor?.length > 0)
      .map((s) => {
        const header = `Product: ${s.productName}`;
        const csv = generateProductCSV(s.tablesByColor, s.sizeOptions);
        return [header, "", csv].join("\n");
      });
    if (sections.length === 0) return;
    const fullCsv = sections.join("\n\n");
    const timestamp = new Date().toISOString().split("T")[0];
    downloadCSV(fullCsv, `summary-all-products-${timestamp}.csv`);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-9999">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150"
      />
      <DialogPanel
        transition
        className="fixed inset-4 flex flex-col overflow-hidden rounded-xl bg-white shadow-xl data-[closed]:opacity-0 data-[closed]:scale-95 data-[enter]:duration-200 data-[leave]:duration-150 sm:inset-8"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </button>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <DocumentTextIcon className="size-5" />
              Summary Sheet – All Products
            </h3>
          </div>
          {hasAnyData && (
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <ArrowDownTrayIcon className="size-4" />
              Download CSV
            </button>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4 space-y-8">
          {productSummaries.length === 0 ? (
            <p className="text-sm text-gray-500">
              No products selected. Select products in Step 3 to see the
              summary.
            </p>
          ) : (
            productSummaries.map((summary, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">
                  {summary.productName}
                </h4>
                {summary.tablesByColor.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No size/color options or add orders to see the summary.
                  </p>
                ) : (
                  summary.tablesByColor.map(
                    ({ colorLabel, teamRows, totalRow }) => (
                      <div key={colorLabel} className="space-y-2">
                        <h5 className="text-sm font-semibold text-gray-700">
                          {colorLabel} Jersey
                        </h5>
                        <div className="overflow-x-auto border border-gray-300 rounded-lg">
                          <table className="min-w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-red-600">
                                <th className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white">
                                  TEAM NAME
                                </th>
                                <th className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white">
                                  COLOR
                                </th>
                                {summary.sizeOptions.map((size) => (
                                  <th
                                    key={size.value}
                                    className="border border-gray-800 px-2 py-2 text-center font-bold uppercase text-white"
                                  >
                                    {size.label}
                                  </th>
                                ))}
                                <th className="border border-gray-800 px-3 py-2 text-center font-bold uppercase text-white">
                                  TOTAL
                                </th>
                                <th className="border border-gray-800 px-3 py-2 text-center font-bold uppercase text-white">
                                  TEST
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {teamRows.map((row) => (
                                <tr key={`${row.teamLabel}-${colorLabel}`}>
                                  <td className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-900">
                                    {row.teamLabel}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-900">
                                    {colorLabel} Jersey
                                  </td>
                                  {summary.sizeOptions.map((size) => (
                                    <td
                                      key={size.value}
                                      className="border border-gray-300 px-2 py-2 text-right text-gray-900"
                                    >
                                      {row.sizeCounts[size.value] || 0}
                                    </td>
                                  ))}
                                  <td className="border border-gray-300 px-3 py-2 text-right font-medium text-gray-900">
                                    {row.total}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-2 text-center">
                                    <span className="inline-block rounded border border-green-500 px-2 py-0.5 text-xs text-gray-700">
                                      ok
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-black">
                                <td className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white">
                                  TOTAL
                                </td>
                                <td className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white" />
                                {summary.sizeOptions.map((size) => (
                                  <td
                                    key={size.value}
                                    className="border border-gray-800 px-2 py-2 text-right text-white"
                                  >
                                    {totalRow.sizeCounts[size.value] || 0}
                                  </td>
                                ))}
                                <td className="border border-gray-800 px-3 py-2 text-right font-bold text-white">
                                  {totalRow.total}
                                </td>
                                <td className="border border-gray-800 px-3 py-2 text-center text-white">
                                  0
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ),
                  )
                )}
              </div>
            ))
          )}
        </div>
      </DialogPanel>
    </Dialog>
  );
}
