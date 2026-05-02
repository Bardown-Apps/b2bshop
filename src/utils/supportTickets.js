import moment from "moment";

/** Normalize list payloads (array or common wrappers). */
export function normalizeTicketsPayload(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.tickets)) return data.tickets;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

/** Total row count for pagination when API returns a wrapper object. */
export function extractTicketsListMeta(data) {
  const list = normalizeTicketsPayload(data);
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

function formatTicketDate(value) {
  if (value == null || value === "") return "—";
  if (typeof value === "number") {
    return moment.unix(value).format("MMM D, YYYY");
  }
  const s = String(value).trim();
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    const d = n > 1e12 ? moment(n) : moment.unix(n);
    return d.isValid() ? d.format("MMM D, YYYY") : s;
  }
  const m = moment(value);
  return m.isValid() ? m.format("MMM D, YYYY") : s;
}

/** Map API row to props expected by `TicketCard`. */
export function mapTicketRowForCard(raw, index) {
  const id = raw._id ?? raw.id ?? index;
  const ticketNumber = raw.ticketId ?? raw.ticketNumber ?? raw.ticket_number;
  const subject = raw.subject ?? raw.title ?? "—";
  const status = raw.status ?? "Open";

  const orderRaw = raw.orderNumber;
  const orderNumber =
    orderRaw != null && orderRaw !== "" ? String(orderRaw) : "—";
  const message = raw.message;
  const lastUpdated = raw?.lastUpdated;
  return {
    id: String(id),
    ticketNumber: ticketNumber != null ? String(ticketNumber) : "—",
    subject: String(subject),
    status: String(status),

    createdAt: formatTicketDate(raw.createdAt ?? raw.created_at ?? raw.created),
    updatedAt: formatTicketDate(raw.updatedAt ?? raw.updated_at ?? raw.updated),
    orderNumber,
    message,
    ticketId:
      raw.ticketId ?? raw.ticket_id ?? raw.ticketNumber ?? raw.ticket_number,
    userId: raw.userId ?? raw.user_id,
    adminId: raw.adminId ?? raw.admin_id,
    rawCreatedAt: raw.createdAt ?? raw.created_at ?? raw.created ?? null,
    lastUpdated,
  };
}
