import { User } from 'lucide-react'
import DashboardCard from '@/components/DashboardCard'
import { PROFILE } from '@/constants/dashboard'

const SalesRepSection = () => (
  <DashboardCard className="p-6 md:p-8 flex items-center gap-6">
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center shrink-0">
      <User className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        Sales Representative
      </h3>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <p className="text-base font-bold text-slate-900">{PROFILE.salesRep.name}</p>
        <div className="flex items-center gap-4 text-sm">
          <a href={`mailto:${PROFILE.salesRep.email}`} className="text-red-600 font-medium hover:underline">
            {PROFILE.salesRep.email}
          </a>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">{PROFILE.salesRep.phone}</span>
        </div>
      </div>
    </div>
  </DashboardCard>
)

export default SalesRepSection
