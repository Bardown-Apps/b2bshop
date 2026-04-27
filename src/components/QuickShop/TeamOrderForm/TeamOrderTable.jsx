import {
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { UniformSummary } from "./UniformSummary";

/**
 * Table for a single team: heading "Team Name Order Form",
 * columns = Custom Fields (dynamic from product) + Color columns (dynamic, one per color),
 * "Add" button to insert rows.
 * Each color column has a size select (from product sizes).
 */
export function TeamOrderTable({
  teamName,
  rows,
  onAddRow,
  onDeleteRow,
  onCloneRow,
  onRowChange,
  customFieldColumns,
  colorOptions = [],
  sizeOptions = [],
  hideRowActions = false,
}) {
  const fallbackColor = "#4f46e5";
  const textColor = "#ffffff";

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">
        {teamName} Order Form
      </h3>

      <div className="overflow-x-auto border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-red-600">
            <tr>
              <th className="w-[160px] min-w-[160px] px-3 py-2 font-medium text-white">
                #
              </th>
              {customFieldColumns?.map((col, colIdx) => {
                const fieldKey =
                  col?.fieldName || col?.name || col?.id || col?.title;
                const headingLabel =
                  col?.name || col?.title || col?.fieldName || String(col);
                const headingTooltip = col?.tooltipTitle || headingLabel;
                return (
                  <th
                    key={
                      typeof fieldKey === "string" ? fieldKey : `col-${colIdx}`
                    }
                    className="px-3 py-2 font-medium text-white"
                  >
                    <span className="whitespace-nowrap" title={headingTooltip}>
                      {headingLabel}
                    </span>
                  </th>
                );
              })}
              {colorOptions.map((color) => (
                <th
                  key={color.value}
                  className="px-3 py-2 font-medium text-white"
                >
                  <span
                    className="whitespace-nowrap"
                    title={color?.tooltipTitle || color.label}
                  >
                    {color.label}
                  </span>
                </th>
              ))}
              {!hideRowActions && (
                <th className="px-3 py-2 font-medium text-white w-[90px]">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rows?.map((row, rowIndex) => {
              // For rows with size options, ensure all selected sizes for different colors are the same.
              const sizeMismatchByColor = {};
              const sizeMatchByColor = {};
              if (sizeOptions.length && colorOptions.length) {
                const colorValues = colorOptions.map((color) => {
                  const colorKey = color.value;
                  const raw = row[colorKey];
                  const val =
                    raw !== undefined && raw !== null ? String(raw).trim() : "";
                  return { key: colorKey, value: val };
                });
                const nonEmpty = colorValues.filter((v) => v.value !== "");
                if (nonEmpty.length > 1) {
                  const first = nonEmpty[0].value;
                  const hasMismatch = nonEmpty.some(
                    (v) => v.value !== "" && v.value !== first,
                  );
                  if (hasMismatch) {
                    nonEmpty.forEach((v) => {
                      sizeMismatchByColor[v.key] = true;
                    });
                  } else {
                    nonEmpty.forEach((v) => {
                      sizeMatchByColor[v.key] = true;
                    });
                  }
                }
              }

              return (
                <tr key={row.id}>
                  <td className="w-[160px] min-w-[160px] px-3 py-2 text-gray-500">
                    {row.rowLabel ?? rowIndex + 1}
                  </td>
                  {customFieldColumns?.map((col, colIdx) => {
                    const fieldKey =
                      col?.fieldName ||
                      col?.name ||
                      col?.id ||
                      col?.title ||
                      `field_${colIdx}`;
                    const key =
                      typeof fieldKey === "string"
                        ? fieldKey
                        : `field_${colIdx}`;

                    const isNumberField =
                      typeof fieldKey === "string" &&
                      fieldKey.toUpperCase().includes("NUMBER");
                    const currentValue =
                      row[key] !== undefined && row[key] !== null
                        ? String(row[key]).trim()
                        : "";
                    const isDuplicateNumber =
                      isNumberField &&
                      currentValue !== "" &&
                      rows?.some((otherRow, otherIndex) => {
                        if (otherIndex === rowIndex) return false;
                        const otherVal =
                          otherRow &&
                          otherRow[key] !== undefined &&
                          otherRow[key] !== null
                            ? String(otherRow[key]).trim()
                            : "";
                        return otherVal !== "" && otherVal === currentValue;
                      });

                    return (
                      <td
                        key={`cell-${colIdx}-${rowIndex}`}
                        className="px-3 py-2"
                      >
                        <div className="relative group">
                          <input
                            type="text"
                            value={row[key] ?? ""}
                            onChange={(e) =>
                              onRowChange(rowIndex, key, e.target.value)
                            }
                            className={`w-full min-w-[80px] rounded border border-gray-300 px-2 pr-8 py-1 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500${
                              isDuplicateNumber
                                ? " border-red-400 focus:border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                            aria-invalid={isDuplicateNumber || undefined}
                            aria-describedby={
                              isDuplicateNumber
                                ? `number-error-${rowIndex}-${colIdx}`
                                : undefined
                            }
                          />
                          {isDuplicateNumber && (
                            <>
                              <ExclamationCircleIcon className="pointer-events-none absolute inset-y-0 right-2 my-auto h-4 w-4 text-red-500" />
                              <div
                                id={`number-error-${rowIndex}-${colIdx}`}
                                className="absolute z-10 -bottom-8 left-0 hidden max-w-xs rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg group-hover:block"
                              >
                                This NUMBER field must be unique within the
                                team.
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {colorOptions.map((color) => {
                    const colorKey = color.value;
                    const hasSizeMismatch = !!sizeMismatchByColor[colorKey];
                    const hasSizeMatch = !!sizeMatchByColor[colorKey];
                    return (
                      <td
                        key={`color-${colorKey}-${rowIndex}`}
                        className="px-3 py-2"
                      >
                        {sizeOptions.length ? (
                          <select
                            value={row[colorKey] ?? ""}
                            onChange={(e) =>
                              onRowChange(rowIndex, colorKey, e.target.value)
                            }
                            className={`w-full min-w-[80px] rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500${
                              hasSizeMismatch
                                ? " border-red-400 focus:border-red-500 focus:ring-red-500"
                                : hasSizeMatch
                                  ? " border-green-400 focus:border-green-500 focus:ring-green-500"
                                  : ""
                            }`}
                            title={
                              hasSizeMismatch
                                ? "Size must be the same for all colors in this row."
                                : hasSizeMatch
                                  ? "Sizes match across all colors in this row."
                                  : undefined
                            }
                          >
                            <option value="">Select size</option>
                            {sizeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={row[colorKey] ?? ""}
                            onChange={(e) =>
                              onRowChange(rowIndex, colorKey, e.target.value)
                            }
                            className="w-full min-w-[80px] rounded border border-gray-300 px-2 py-1 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                          />
                        )}
                      </td>
                    );
                  })}
                  {!hideRowActions && (
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onCloneRow?.(rowIndex)}
                          className="inline-flex items-center justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                          aria-label={`Clone row ${rowIndex + 1}`}
                          title="Clone row"
                        >
                          <DocumentDuplicateIcon className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRow?.(rowIndex)}
                          className="inline-flex items-center justify-center rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
                          aria-label={`Delete row ${rowIndex + 1}`}
                          title="Delete row"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!hideRowActions && (
        <button
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white shadow-sm"
          style={{ backgroundColor: fallbackColor, color: textColor }}
        >
          <PlusIcon className="size-4" />
          Add
        </button>
      )}

      {/* Uniform Summary */}
      <UniformSummary
        rows={rows}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
      />
    </div>
  );
}
