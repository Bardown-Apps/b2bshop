import { useState } from 'react'
import { Search, Package, ChevronDown } from 'lucide-react'
import { ORDERS } from '@/constants/orders'
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
        <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden flex-1 min-w-48 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order, Invoice, or PO No."
            className="flex-1 px-3 py-2 text-sm text-slate-800 outline-none"
          />
          <button className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center border border-slate-300 rounded bg-white px-3 py-2 text-sm text-slate-700 cursor-pointer gap-2 min-w-36">
          <span>{filter}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-blue-500 hover:text-blue-700 font-medium cursor-pointer">
            Clear Results
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">{search ? 'No orders match your search.' : 'No orders found.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
