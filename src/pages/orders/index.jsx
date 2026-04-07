import { useState } from 'react'
import { Search, Package, ChevronDown } from 'lucide-react'
import { ORDERS } from '@/constants/orders'
import AnimateIn from '@/components/AnimateIn'
import OrderCard from './OrderCard'

const Orders = () => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL ORDERS')

  const filtered = ORDERS.filter((o) => {
    const q = search.toLowerCase()
    return !q || o.orderNumber.toLowerCase().includes(q)
  })

  return (
    <div>
      <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-3 mb-6">
        My Orders
      </h1>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden flex-1 min-w-48 max-w-sm focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order, Invoice, or PO No."
            className="flex-1 px-3 py-2.5 text-sm text-slate-800 outline-none"
          />
          <button className="px-3 py-2.5 bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center border border-slate-200 rounded-lg bg-white px-3 py-2.5 text-sm text-slate-700 cursor-pointer gap-2 min-w-36">
          <span>{filter}</span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>

        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer transition-colors">
            Clear Results
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <AnimateIn className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">{search ? 'No orders match your search.' : 'No orders found.'}</p>
        </AnimateIn>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, i) => (
            <AnimateIn key={order.id} delay={i * 0.06}>
              <OrderCard order={order} />
            </AnimateIn>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
