import { useState } from 'react'
import { Search, TicketIcon, ChevronDown } from 'lucide-react'
import { TICKETS, TICKET_FILTERS } from '@/constants/tickets'
import AnimateIn from '@/components/AnimateIn'
import TicketCard from './TicketCard'

const SupportTickets = () => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All Tickets')

  const filtered = TICKETS.filter((t) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      t.ticketNumber.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.orderNumber.toLowerCase().includes(q)
    const matchesFilter = filter === 'All Tickets' || t.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-3 mb-6">
        My Support Tickets
      </h1>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden flex-1 min-w-48 max-w-sm focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket, subject, or order no."
            className="flex-1 px-3 py-2.5 text-sm text-slate-800 outline-none"
          />
          <button className="px-3 py-2.5 bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none border border-slate-200 rounded-lg bg-white pl-3 pr-8 py-2.5 text-sm text-slate-700 cursor-pointer outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          >
            {TICKET_FILTERS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {(search || filter !== 'All Tickets') && (
          <button
            onClick={() => { setSearch(''); setFilter('All Tickets') }}
            className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <AnimateIn className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
          <TicketIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            {search || filter !== 'All Tickets'
              ? 'No tickets match your search.'
              : 'You haven\'t submitted any tickets yet.'}
          </p>
        </AnimateIn>
      ) : (
        <div className="space-y-4">
          {filtered.map((ticket, i) => (
            <AnimateIn key={ticket.id} delay={i * 0.06}>
              <TicketCard ticket={ticket} />
            </AnimateIn>
          ))}
        </div>
      )}
    </div>
  )
}

export default SupportTickets
