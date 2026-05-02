/** Single source for order status filters, labels, and badge colors (OrderCard). */
export const ORDER_STATUS_FILTERS = [
  { value: "", label: "All", color: "text-green-600" },
  { value: "pending", label: "Pending", color: "text-green-600" },
  { value: "on-hold", label: "On Hold", color: "text-amber-600" },
  {
    value: "pre-production",
    label: "Pre-Production",
    color: "text-blue-500",
  },
  {
    value: "in-production",
    label: "In-Production",
    color: "text-blue-500",
  },
  { value: "completed", label: "Completed", color: "text-green-600" },
  { value: "quality-check", label: "Quality Check", color: "text-indigo-600" },
  {
    value: "partially-shipped",
    label: "Partially Shipped",
    color: "text-green-600",
  },
  { value: "shipped", label: "Shipped", color: "text-green-600" },
  {
    value: "ready-for-pick-up",
    label: "Ready for Pick-up",
    color: "text-teal-600",
  },
  { value: "picked-up", label: "Picked-up", color: "text-teal-600" },
  {
    value: "partially-picked-up",
    label: "Partially Picked-up",
    color: "text-teal-600",
  },
  { value: "received", label: "Received", color: "text-green-600" },
  { value: "cancelled", label: "Cancelled", color: "text-red-500" },
  { value: "refunded", label: "Refunded", color: "text-red-500" },
  {
    value: "cancelled-and-refunded",
    label: "Cancelled & Refunded",
    color: "text-red-500",
  },
];

/** Extra keys APIs may still return (not in filters list). */
const LEGACY_STATUS_COLORS = {
  Delivered: "text-green-600",
  Processing: "text-blue-500",
};

/** Lookup map for `orderStatusColorClass` — keyed by slug, label variants, and legacy strings. */
export const STATUS_COLORS = ORDER_STATUS_FILTERS.reduce(
  (acc, row) => {
    acc[row.value] = row.color;
    acc[row.label] = row.color;
    acc[row.label.toLowerCase()] = row.color;
    acc[row.value.replace(/-/g, " ")] = row.color;
    const titledSlug =
      row.value.length <= 1
        ? row.value.toUpperCase()
        : row.value
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join("-");
    acc[titledSlug.replace(/-/g, " ")] = row.color;
    return acc;
  },
  { ...LEGACY_STATUS_COLORS },
);
