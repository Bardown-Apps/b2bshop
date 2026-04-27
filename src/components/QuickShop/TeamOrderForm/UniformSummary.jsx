import { useMemo } from "react";

/**
 * Uniform Summary table: aggregates team order data by color and size.
 * Shows totals per color and size, matching the reference UI design.
 */
export function UniformSummary({ rows, colorOptions, sizeOptions }) {
  const summaryData = useMemo(() => {
    if (!rows?.length || !colorOptions?.length || !sizeOptions?.length) {
      return [];
    }

    // Aggregate: for each color, count occurrences of each size
    const colorSummary = {};

    rows.forEach((row) => {
      colorOptions.forEach((color) => {
        const colorKey = color.value;
        const selectedSize = row[colorKey];
        if (!selectedSize) return;

        if (!colorSummary[colorKey]) {
          colorSummary[colorKey] = {
            color: color.label,
            sizes: {},
            total: 0,
          };
        }

        // Count this size for this color
        const sizeKey = selectedSize;
        colorSummary[colorKey].sizes[sizeKey] =
          (colorSummary[colorKey].sizes[sizeKey] || 0) + 1;
        colorSummary[colorKey].total += 1;
      });
    });

    // Convert to array format
    return Object.values(colorSummary).map((item) => ({
      ...item,
      sizes: sizeOptions.reduce((acc, size) => {
        acc[size.value] = item.sizes[size.value] || 0;
        return acc;
      }, {}),
    }));
  }, [rows, colorOptions, sizeOptions]);

  if (!summaryData.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-base font-bold text-gray-900">UNIFORM SUMMARY</h4>
      <div className="overflow-x-auto border border-gray-300">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-red-600">
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
            {summaryData.map((item, idx) => (
              <tr key={`${item.color}-${idx}`}>
                <td className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-900">
                  {item.color} Jersey
                </td>
                {sizeOptions.map((size) => (
                  <td
                    key={size.value}
                    className="border border-gray-300 px-2 py-2 text-right text-gray-900"
                  >
                    {item.sizes[size.value] || 0}
                  </td>
                ))}
                <td className="border border-gray-300 px-3 py-2 text-right font-medium text-gray-900">
                  {item.total}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <span className="inline-block rounded border border-green-500 px-2 py-0.5 text-xs text-gray-700">
                    ok
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
