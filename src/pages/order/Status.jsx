import { useMemo } from "react";

const options = [
  { value: "pending", label: "Pending" },
  { value: "on-hold", label: "On Hold" },
  { value: "pre-production", label: "Pre-Production" },
  { value: "in-production", label: "In-Production" },
  { value: "completed", label: "Completed" },
  { value: "quality-check", label: "Quality Check" },
  { value: "partially-shipped", label: "Partially Shipped" },
  { value: "shipped", label: "Shipped" },
  { value: "ready-for-pick-up", label: "Ready for Pick-up" },
  { value: "picked-up", label: "Picked-up" },
  { value: "partially-picked-up", label: "Partially Picked-up" },
  { value: "received", label: "Received" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
  { value: "cancelled-and-refunded", label: "Cancelled & Refunded" },
];

const OrderStatus = ({ order, updateOrderDetails }) => {
  const normalizedStatus = String(order?.status || "").toLowerCase();
  const selected = useMemo(
    () => options.find((item) => item.value === normalizedStatus)?.value || "",
    [normalizedStatus],
  );
  if (!order) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Current Status</p>
          <p className="text-sm font-semibold text-slate-900">
            {order?.status?.toUpperCase()}
          </p>
        </div>
        <select
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700"
          value={selected}
          onChange={(event) => {
            const nextStatus = event.target.value;
            if (!nextStatus || nextStatus === selected) return;
            updateOrderDetails({ status: nextStatus, notifyCustomer: false });
          }}
        >
          <option value="" disabled>
            Select status
          </option>
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrderStatus;
