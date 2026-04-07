import { Package } from 'lucide-react'
import { STATUS_COLORS } from '@/constants/orders'
import OrderActions from './OrderActions'

const DetailCell = ({ label, children, className = '' }) => (
  <div>
    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
    <p className={`text-sm text-slate-800 ${className}`}>{children}</p>
  </div>
)

const OrderCard = ({ order }) => {
  const color = STATUS_COLORS[order.status] ?? 'text-slate-600'

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-stretch sm:divide-x divide-slate-200">
        <div className="flex-1 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-slate-500" />
            <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{order.status}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
            <DetailCell label="Order Number">
              <span className="text-blue-600 font-medium hover:underline cursor-pointer">{order.orderNumber}</span>
            </DetailCell>
            <DetailCell label="Order Date">{order.orderedAt}</DetailCell>
            <DetailCell label="PO Number">{order.poNumber}</DetailCell>
            <DetailCell label="Total" className="text-blue-600 font-bold">C${order.total.toFixed(2)}</DetailCell>
            <DetailCell label="Online Order">{order.onlineOrder}</DetailCell>
            <DetailCell label="Ship Date">{order.shipDate}</DetailCell>
            <DetailCell label="Order Type">{order.orderType}</DetailCell>
          </div>
        </div>
        <OrderActions />
      </div>
    </div>
  )
}

export default OrderCard
