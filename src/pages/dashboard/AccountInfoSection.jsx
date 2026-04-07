import { Building2, Package, ChevronRight } from 'lucide-react'
import DashboardCard from '@/components/DashboardCard'
import InfoLabel from '@/components/InfoLabel'
import { PROFILE, RECENT_ORDERS } from '@/constants/dashboard'

const StatusDot = ({ status }) => {
  const color = status === 'Shipped' ? 'bg-blue-500 text-blue-600' : 'bg-emerald-500 text-emerald-600'
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color.split(' ')[0]}`} />
      <span className={`text-xs font-semibold uppercase tracking-wider ${color.split(' ')[1]}`}>{status}</span>
    </div>
  )
}

const AccountInfoSection = () => (
  <DashboardCard>
    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
      <div className="p-6 md:p-8">
        <InfoLabel icon={Building2}>Account Number</InfoLabel>
        <div className="space-y-1">
          <p className="text-sm text-slate-500 font-medium">PRIMARY:</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{PROFILE.accountNumber}</p>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <InfoLabel icon={Building2}>Company Name</InfoLabel>
        <p className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{PROFILE.companyName}</p>
      </div>

      <div className="p-6 md:p-8 bg-slate-50/50">
        <InfoLabel icon={Package}>Most Recent Orders</InfoLabel>
        {RECENT_ORDERS.length > 0 ? (
          <div className="space-y-3">
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-slate-300 transition-colors duration-200">
                <div className="space-y-1">
                  <StatusDot status={order.status} />
                  <p className="text-sm font-medium text-slate-900">Order # {order.orderNumber}</p>
                  <p className="text-xs text-slate-500">Ordered {order.orderedAt}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase">Total</p>
                  <p className="text-sm font-bold text-slate-900">${order.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
            <button className="w-full mt-2 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
              VIEW ALL <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No recent orders found</p>
          </div>
        )}
      </div>
    </div>
  </DashboardCard>
)

export default AccountInfoSection
