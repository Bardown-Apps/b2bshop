import { useMemo } from "react";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

/**
 * Aggregates counts by size for one team and one color.
 *
 * Supports two shapes of team data:
 * - Builder flow: team.rows[] with columns keyed by color (value = size)
 * - Persisted cart data: team.orderCombinations[] with { Size, Color, qty }
 */
function aggregateTeamColor(team, colorKey, sizeOptions) {
  const sizes = {};
  let total = 0;

  // Builder flow: per-row selections keyed by color
  if (Array.isArray(team?.rows) && team.rows.length > 0) {
    team.rows.forEach((row) => {
      if (!row) return;
      const selectedSize = row[colorKey];
      if (!selectedSize) return;
      sizes[selectedSize] = (sizes[selectedSize] || 0) + 1;
      total += 1;
    });
  }

  // Persisted cart data: explicit orderCombinations with Size/Color/qty
  if (
    (!Array.isArray(team?.rows) || team.rows.length === 0) &&
    Array.isArray(team?.orderCombinations) &&
    team.orderCombinations.length > 0
  ) {
    team.orderCombinations.forEach((combo) => {
      if (!combo || combo.Color !== colorKey) return;
      const sizeValue = combo.Size;
      if (!sizeValue) return;
      const qty = Number(combo.qty || 0) || 0;
      sizes[sizeValue] = (sizes[sizeValue] || 0) + qty;
      total += qty;
    });
  }

  const sizeCounts = sizeOptions.reduce((acc, size) => {
    acc[size.value] = sizes[size.value] || 0;
    return acc;
  }, {});

  return { sizeCounts, total };
}

/**
 * Converts summary data to CSV format.
 */
function generateCSV(tablesByColor, sizeOptions) {
  const csvRows = [];

  tablesByColor.forEach(({ colorLabel, teamRows, totalRow }) => {
    // Add color/jersey header
    // csvRows.push(`${colorLabel}`);
    // csvRows.push("");

    // Add table headers
    const headers = [
      "TEAM NAME",
      "COLOR",
      ...sizeOptions.map((s) => s.label),
      "TOTAL",
      "TEST",
    ];
    csvRows.push(headers.join(","));

    // Add data rows
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

    // Add total row
    const totalValues = [
      "TOTAL",
      ...sizeOptions.map((s) => totalRow.sizeCounts[s.value] || 0),
      totalRow.total,
      "0",
    ];
    csvRows.push(totalValues.join(","));

    // Add spacing between tables
    csvRows.push([...Array(sizeOptions.length + 2)].map(() => "").join(","));
  });

  return csvRows.join("\n");
}

/**
 * Downloads CSV file.
 */
function downloadCSV(csvContent, filename = "summary-sheet.csv") {
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
 * Modal showing summary of all teams: one table per color (jersey type),
 * with TEAM ITEM rows (T1 BLACK Jersey, T2 BLACK Jersey, ...) and a TOTAL row.
 */
export function SummarySheetModal({
  open,
  onClose,
  teams,
  colorOptions,
  sizeOptions,
}) {
  const tablesByColor = useMemo(() => {
    if (!teams?.length || !colorOptions?.length || !sizeOptions?.length)
      return [];

    return colorOptions.map((color) => {
      const colorKey = color.value;
      const colorLabel = color.label;
      const teamRows = teams.map((team) => {
        const { sizeCounts, total } = aggregateTeamColor(
          team,
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
  }, [teams, colorOptions, sizeOptions]);

  const handleDownloadCSV = () => {
    if (tablesByColor.length === 0) return;
    const csvContent = generateCSV(tablesByColor, sizeOptions);
    const timestamp = new Date().toISOString().split("T")[0];
    downloadCSV(csvContent, `summary-sheet-${timestamp}.csv`);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-30">
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
              Summary Sheet
            </h3>
          </div>
          {tablesByColor.length > 0 && (
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
        <div className="min-h-0 flex-1 overflow-auto p-4 space-y-6">
          {tablesByColor.length === 0 ? (
            <p className="text-sm text-gray-500">
              Add teams and enter orders to see the summary.
            </p>
          ) : (
            tablesByColor.map(({ colorLabel, teamRows, totalRow }) => (
              <div key={colorLabel} className="space-y-2">
                <h4 className="text-base font-bold text-gray-900">
                  {colorLabel}
                </h4>
                <div className="overflow-x-auto border border-gray-300">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-red-600">
                        <th className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white">
                          TEAM NAME
                        </th>
                        <th className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white">
                          COLOR
                        </th>
                        {sizeOptions.map((size) => (
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
                          {sizeOptions.map((size) => (
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
                        <td className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white"></td>
                        {sizeOptions.map((size) => (
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
            ))
          )}
        </div>
      </DialogPanel>
    </Dialog>
  );
}
