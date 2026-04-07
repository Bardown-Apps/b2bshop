export const TICKETS = [
  {
    id: "1",
    ticketNumber: "TK-10301",
    subject: "Missing items in order OO50778955",
    status: "Open",
    priority: "High",
    createdAt: "April 3, 2026",
    updatedAt: "April 5, 2026",
    orderNumber: "OO50778955",
  },
  {
    id: "2",
    ticketNumber: "TK-10287",
    subject: "Request for invoice copy — March orders",
    status: "In Progress",
    priority: "Medium",
    createdAt: "March 28, 2026",
    updatedAt: "April 1, 2026",
    orderNumber: "—",
  },
  {
    id: "3",
    ticketNumber: "TK-10254",
    subject: "Wrong size shipped for sublimation jerseys",
    status: "Resolved",
    priority: "High",
    createdAt: "March 15, 2026",
    updatedAt: "March 22, 2026",
    orderNumber: "OO43331216",
  },
  {
    id: "4",
    ticketNumber: "TK-10210",
    subject: "Update shipping address on file",
    status: "Closed",
    priority: "Low",
    createdAt: "February 20, 2026",
    updatedAt: "February 22, 2026",
    orderNumber: "—",
  },
  {
    id: "5",
    ticketNumber: "TK-10198",
    subject: "Discount not applied on club package",
    status: "Closed",
    priority: "Medium",
    createdAt: "February 10, 2026",
    updatedAt: "February 14, 2026",
    orderNumber: "OO29871034",
  },
];

export const TICKET_STATUS_STYLES = {
  Open: "bg-amber-50 text-amber-700 border-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Resolved: "bg-green-50 text-green-700 border-green-200",
  Closed: "bg-slate-50 text-slate-500 border-slate-200",
};

export const TICKET_PRIORITY_STYLES = {
  High: "text-red-600",
  Medium: "text-amber-600",
  Low: "text-slate-500",
};

export const TICKET_FILTERS = ["All Tickets", "Open", "In Progress", "Resolved", "Closed"];
