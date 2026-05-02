import { useState } from "react";
import moment from "moment";
import { TicketIcon, Calendar, Package } from "lucide-react";
import { TICKET_STATUS_STYLES } from "@/constants/tickets";
import Dialog from "@/components/Dialog";

const TicketCard = ({ ticket }) => {
  const [showDetails, setShowDetails] = useState(false);
  const statusStyle = TICKET_STATUS_STYLES[ticket.status] ?? "";

  const detailBlock = (label, value) => (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-sm text-slate-800 break-all">{value || "—"}</p>
    </div>
  );

  return (
    <>
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <TicketIcon className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-sm font-bold text-blue-600">
                {ticket.ticketNumber}
              </span>
            </div>

            <div
              className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusStyle}`}
            >
              {ticket.status}
            </div>
          </div>

          <h3 className="text-sm font-medium text-slate-800 mb-3">
            {ticket.subject}
          </h3>

          <div className="flex items-center gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Opened {ticket.createdAt}
            </span>
            {ticket.orderNumber !== "—" && (
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                {ticket.orderNumber}
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 px-5 md:px-6 py-3 flex items-center justify-between">
          {ticket.lastUpdated ? (
            <span className="text-xs text-slate-500">
              Last updated{" "}
              {moment.unix(ticket.lastUpdated).format("MMM DD, YYYY")}
            </span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>

      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        title={`Ticket ${ticket.ticketNumber}`}
        panelClassName="max-w-2xl"
      >
        <div className="space-y-4">
          {detailBlock("Subject", ticket.subject)}
          {detailBlock("Order Number", ticket.orderNumber)}
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
              Message
            </p>
            <p className="text-sm text-slate-800 whitespace-pre-wrap wrap-break-word">
              {ticket.message || "—"}
            </p>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default TicketCard;
