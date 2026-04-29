import { useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { classNames } from "@/utils/classNames";

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

function getCustomFieldMeta(field, index) {
  const key = field?.fieldName || field?.name || field?.id || field?.title;
  const value = typeof key === "string" && key.trim() ? key : `field_${index}`;
  const rawKey =
    typeof value === "string" && value.includes("::")
      ? value.split("::").pop()?.trim()
      : value;
  const label = field?.name || field?.title || value;
  return { key: value, rawKey, label };
}

function getTeamDisplayRows(team, colorOptions) {
  if (Array.isArray(team?.rows) && team.rows.length > 0) {
    return team.rows;
  }

  if (
    !Array.isArray(team?.orderCombinations) ||
    team.orderCombinations.length === 0
  ) {
    return [];
  }

  const colorKeys = new Set((colorOptions || []).map((color) => color.value));
  const normalizedRows = [];

  team.orderCombinations.forEach((combo, comboIndex) => {
    const colorKey = combo?.Color;
    const sizeValue = combo?.Size;
    const qty = Math.max(1, Number(combo?.qty || 0) || 1);
    if (!colorKey || !sizeValue || !colorKeys.has(colorKey)) return;

    for (let i = 0; i < qty; i += 1) {
      normalizedRows.push({
        id: `${team?.id || team?.name || "team"}-${comboIndex}-${i}`,
        [colorKey]: sizeValue,
      });
    }
  });

  return normalizedRows;
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
  productName,
  clubName = "",
  customFields = [],
}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
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

  const customFieldColumns = useMemo(
    () => (customFields || []).map(getCustomFieldMeta),
    [customFields],
  );

  const teamTabs = useMemo(
    () =>
      (teams || []).map((team, index) => ({
        id: team?.id || `${team?.name || "team"}-${index}`,
        name: team?.name || `Team ${index + 1}`,
        rows: getTeamDisplayRows(team, colorOptions),
      })),
    [teams, colorOptions],
  );

  const handleDownloadCSV = () => {
    if (tablesByColor.length === 0) return;
    const csvContent = generateCSV(tablesByColor, sizeOptions);
    const timestamp = new Date().toISOString().split("T")[0];
    downloadCSV(csvContent, `summary-sheet-${timestamp}.csv`);
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
              Summary Sheet ({productName})
            </h3>
          </div>
          {activeTabIndex === 0 && tablesByColor.length > 0 && (
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
        <div className="min-h-0 flex-1 overflow-hidden p-4">
          <TabGroup selectedIndex={activeTabIndex} onChange={setActiveTabIndex}>
            <TabList className="mb-4 flex flex-wrap gap-2 border-b border-gray-200 pb-2">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "rounded-md border px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500",
                    selected
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                  )
                }
              >
                Summary Sheet
              </Tab>
              {teamTabs.map((team) => (
                <Tab
                  key={team.id}
                  className={({ selected }) =>
                    classNames(
                      "rounded-md border px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500",
                      selected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                    )
                  }
                >
                  {team.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="min-h-0 h-full overflow-auto">
              <TabPanel className="space-y-6 focus:outline-none">
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
                                TEAM
                              </th>
                              <th className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white">
                                ITEM
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
                                  {productName}
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
              </TabPanel>
              {teamTabs.map((team) => (
                <TabPanel
                  key={team.id}
                  className="space-y-3 focus:outline-none"
                >
                  <p className="text-md font-semibold text-gray-900">
                    {productName}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {clubName ? `${clubName} - ${team.name}` : team.name}
                  </p>

                  <div className="overflow-x-auto border border-gray-300">
                    <table className="min-w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-red-600">
                          {customFieldColumns.map((field) => (
                            <th
                              key={field.key}
                              className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white"
                            >
                              {field.label}
                            </th>
                          ))}
                          {colorOptions.map((color) => (
                            <th
                              key={color.value}
                              className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white"
                            >
                              {color.label}
                            </th>
                          ))}
                          {/* {sizeOptions.map((size) => (
                            <th
                              key={`size-${size.value}`}
                              className="border border-gray-800 px-3 py-2 text-right font-bold uppercase text-white"
                            >
                              {size.label}
                            </th>
                          ))} */}
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {team.rows.length === 0 ? (
                          <tr>
                            <td
                              colSpan={
                                customFieldColumns.length +
                                colorOptions.length +
                                sizeOptions.length
                              }
                              className="border border-gray-300 px-3 py-3 text-sm text-gray-500"
                            >
                              No rows added for this team.
                            </td>
                          </tr>
                        ) : (
                          team.rows.map((row) => (
                            <tr key={row.id}>
                              {customFieldColumns.map((field) => (
                                <td
                                  key={`${row.id}-${field.key}`}
                                  className="border border-gray-300 px-3 py-2 text-gray-900"
                                >
                                  {row?.[field.key] ??
                                    row?.[field.rawKey] ??
                                    "-"}
                                </td>
                              ))}
                              {colorOptions.map((color) => (
                                <td
                                  key={`${row.id}-${color.value}`}
                                  className="border border-gray-300 px-3 py-2 text-gray-900"
                                >
                                  {row[color.value] || "-"}
                                </td>
                              ))}
                              {/* {sizeOptions.map((size) => {
                                const count = colorOptions.reduce(
                                  (sum, color) =>
                                    row?.[color.value] === size.value
                                      ? sum + 1
                                      : sum,
                                  0,
                                );
                                return (
                                  <td
                                    key={`${row.id}-size-${size.value}`}
                                    className="border border-gray-300 px-3 py-2 text-right text-gray-900"
                                  >
                                    {count}
                                  </td>
                                );
                              })} */}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-sm font-semibold text-gray-900">
                    Uniform Summary
                  </p>
                  <div className="overflow-x-auto border border-gray-300">
                    <table className="min-w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-red-600">
                          <th className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white">
                            ITEM
                          </th>

                          {sizeOptions.map((size) => (
                            <th
                              key={`size-${size.value}`}
                              className="border border-gray-800 px-3 py-2 text-right font-bold uppercase text-white"
                            >
                              {size.label}
                            </th>
                          ))}

                          <th className="border border-gray-800 px-3 py-2 text-left font-bold uppercase text-white">
                            TOTAL
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {team.rows.length === 0 ? (
                          <tr>
                            <td
                              colSpan={
                                customFieldColumns.length +
                                colorOptions.length +
                                sizeOptions.length
                              }
                              className="border border-gray-300 px-3 py-3 text-sm text-gray-500"
                            >
                              No rows added for this team.
                            </td>
                          </tr>
                        ) : (
                          team.rows.map((row) => (
                            <tr key={row.id}>
                              <td className="border border-gray-300 px-3 py-2 text-gray-900">
                                {productName}
                              </td>

                              {sizeOptions.map((size) => {
                                const count = colorOptions.reduce(
                                  (sum, color) =>
                                    row?.[color.value] === size.value
                                      ? sum + 1
                                      : sum,
                                  0,
                                );
                                return (
                                  <td
                                    key={`${row.id}-size-${size.value}`}
                                    className="border border-gray-300 px-3 py-2 text-right text-gray-900"
                                  >
                                    {count}
                                  </td>
                                );
                              })}
                              <td className="border border-gray-300 px-3 py-2 text-right font-medium text-gray-900">
                                {colorOptions.reduce(
                                  (sum, color) =>
                                    row?.[color.value] ? sum + 1 : sum,
                                  0,
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
