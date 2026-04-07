import { BadgePercent, Wallet } from 'lucide-react'
import DashboardCard from '@/components/DashboardCard'
import InfoLabel from '@/components/InfoLabel'
import { PROFILE } from '@/constants/dashboard'

const StatusSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <DashboardCard className="p-6 md:p-8 flex flex-col justify-center items-center text-center">
      <InfoLabel icon={BadgePercent}>Discount Status</InfoLabel>
      <div className="px-6 py-2.5 bg-amber-100/80 text-amber-800 border border-amber-200/50 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm">
        {PROFILE.discountStatus}
      </div>
    </DashboardCard>

    <DashboardCard className="p-6 md:p-8 flex flex-col justify-center items-center text-center">
      <InfoLabel icon={Wallet}>Eligible Payment</InfoLabel>
      <p className="text-lg font-bold text-slate-900">{PROFILE.eligiblePayment}</p>
    </DashboardCard>
  </div>
)

export default StatusSection
