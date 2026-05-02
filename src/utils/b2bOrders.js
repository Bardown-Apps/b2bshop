/** Normalize list endpoint payloads (array or common wrappers). */
import moment from "moment";

export function normalizeOrdersPayload(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.orders)) return data.orders;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

/** Total row count for pagination when API returns a wrapper object. */
export function extractOrdersListMeta(data) {
  const list = normalizeOrdersPayload(data);
  let total = null;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const rawTotal =
      data.totalCount ??
      data.total ??
      data.count ??
      data.pagination?.total ??
      data.meta?.total ??
      data.totalRecords;
    if (rawTotal != null && rawTotal !== "") {
      const n = Number(rawTotal);
      total = Number.isFinite(n) ? n : null;
    }
  }
  return { list, total };
}

export function formatOrderedAt(value) {
  if (value == null || value === "") return "—";
  return moment.unix(value).format("MMM D, YYYY");
}

export function computeOrderTotal(raw) {
  const pd = raw?.paymentDetails ?? raw?.payment_details;
  const orderTotalRaw = pd?.orderTotal;
  const orderTotalNum = Number(orderTotalRaw);
  if (
    orderTotalRaw != null &&
    orderTotalRaw !== "" &&
    !Number.isNaN(orderTotalNum) &&
    orderTotalNum < 0
  ) {
    return Number(pd?.creditAmount ?? 0) - Number(pd?.creditLeft ?? 0);
  }
  return Number(pd?.orderTotal ?? raw?.total ?? raw?.orderTotal ?? 0);
}

export function formatOnlineOrderDisplay(raw) {
  const v = raw?.onlineOrder ?? raw?.isOnlineOrder ?? raw?.online_order;
  if (v === true || v === "Yes" || v === "yes") return "Yes";
  if (v === false || v === "No" || v === "no") return "No";
  if (v == null || v === "") return "—";
  return String(v);
}

/** Money string for order lists (e.g. `$-8630.44`). */
export function formatOrderListMoney(amount) {
  const num = Number(amount);
  if (!Number.isFinite(num)) return "—";
  const abs = Math.abs(num).toFixed(2);
  if (num < 0) return `$-${abs}`;
  return `$${abs}`;
}

/** Non-empty lines for `shippingAddress` / `shipping_address` (same shape as summary). */
export function getShippingAddressLines(order) {
  const sa = order?.shippingAddress ?? order?.shipping_address;
  if (!sa || typeof sa !== "object") return [];
  const lines = [];
  if (sa.name) lines.push(String(sa.name).trim());
  const street = [sa.address, sa.address2].filter(Boolean).join(" ").trim();
  if (street) lines.push(street);
  const cityLine = [sa.city, sa.state, sa.postal_code ?? sa.postalCode]
    .filter(Boolean)
    .join(", ")
    .trim();
  if (cityLine) lines.push(cityLine);
  if (sa.country) lines.push(String(sa.country).trim());
  return lines;
}

/**
 * Customer column: prefers explicit last name fields; otherwise last token of shipping name.
 */
export function getOrderCustomerDisplayName(order) {
  const last =
    order?.customerLastName ??
    order?.customer_last_name ??
    order?.metadata?.customerLastName ??
    order?.metadata?.customer_last_name;
  if (last != null && String(last).trim() !== "") return String(last).trim();
  const full =
    order?.customerName ??
    order?.customer_name ??
    order?.shippingAddress?.name ??
    order?.shipping_address?.name;
  if (full == null || String(full).trim() === "") return "—";
  const parts = String(full).trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : parts[0];
}

/** Map API status string to STATUS_COLORS key (handles `PENDING` vs `Pending`). */
export function orderStatusColorClass(status, statusColors) {
  const s = String(status ?? "").trim();
  if (!s) return "text-slate-600";
  const titled =
    s.length <= 1
      ? s.toUpperCase()
      : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return (
    statusColors[s] ??
    statusColors[titled] ??
    statusColors[s.toUpperCase()] ??
    "text-slate-600"
  );
}

/** Maps API order record to dashboard / order card UI shape. */
export function mapApiOrder(raw) {
  const total = computeOrderTotal(raw);
  const orderNumber =
    raw?.orderNumber ?? raw?.order_number ?? raw?.orderNo ?? "—";
  const paymentStatus =
    raw?.paymentStatus ??
    raw?.payment_details?.paymentStatus ??
    raw?.paymentDetails?.paymentStatus ??
    raw?.payment_details?.status ??
    raw?.paymentDetails?.status;

  const shipRaw =
    raw?.shipDate ??
    raw?.shippedAt ??
    raw?.ship_date ??
    raw?.estimatedShipDate ??
    raw?.estimated_ship_date;

  const poRaw = raw?.poNumber ?? raw?.po_number ?? raw?.poNo ?? "";

  const typeRaw = raw?.orderType ?? raw?.order_type ?? "";

  return {
    id: String(raw?._id ?? raw?.id ?? orderNumber),
    orderNumber,
    status: raw?.status ?? raw?.orderStatus ?? "—",
    orderedAt: formatOrderedAt(
      raw?.orderedAt ?? raw?.createdAt ?? raw?.orderDate ?? raw?.dateOrdered,
    ),
    shipDate:
      shipRaw != null && shipRaw !== "" ? formatOrderedAt(shipRaw) : "—",
    poNumber: poRaw === "" ? "—" : String(poRaw),
    total,
    onlineOrder: formatOnlineOrderDisplay(raw),
    orderType: typeRaw === "" ? "—" : String(typeRaw),
    paymentStatus:
      paymentStatus != null && paymentStatus !== "" ? paymentStatus : null,
  };
}
