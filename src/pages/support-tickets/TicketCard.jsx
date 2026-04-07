import { TicketIcon, AlertCircle, Calendar, Package } from 'lucide-react'
import { TICKET_STATUS_STYLES, TICKET_PRIORITY_STYLES } from '@/constants/tickets'

const TicketCard = ({ ticket }) => {
  const statusStyle = TICKET_STATUS_STYLES[ticket.status] ?? ''
  const priorityStyle = TICKET_PRIORITY_STYLES[ticket.priority] ?? ''

  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <TicketIcon className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-sm font-bold text-blue-600">{ticket.ticketNumber}</span>
            <span className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusStyle}`}>
              {ticket.status}
            </span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium shrink-0 ${priorityStyle}`}>
            <AlertCircle className="w-3.5 h-3.5" />
            {ticket.priority}
          </div>
        </div>

        <h3 className="text-sm font-medium text-slate-800 mb-3">{ticket.subject}</h3>

        <div className="flex items-center gap-5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Opened {ticket.createdAt}
          </span>
          {ticket.orderNumber !== '—' && (
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              {ticket.orderNumber}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 md:px-6 py-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">Last updated {ticket.updatedAt}</span>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
          View Details
        </button>
      </div>
    </div>
  )
}

export default TicketCard
