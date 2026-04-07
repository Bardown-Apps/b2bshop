import { Building2, BadgePercent, Wallet } from 'lucide-react'
import { PROFILE } from '@/constants/dashboard'

const cards = [
  { label: 'Account Number', value: PROFILE.accountNumber, icon: Building2, bg: 'bg-blue-50', color: 'text-blue-500' },
  { label: 'Discount Status', value: PROFILE.discountStatus, icon: BadgePercent, bg: 'bg-amber-50', color: 'text-amber-500' },
  { label: 'Payment Terms', value: PROFILE.eligiblePayment, icon: Wallet, bg: 'bg-green-50', color: 'text-green-500' },
]

const AccountSummary = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {cards.map(({ label, value, icon: Icon, bg, color }) => (
      <div key={label} className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col items-center text-center shadow-sm">
        <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center mb-3`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-base font-bold text-slate-900">{value}</p>
      </div>
    ))}
  </div>
)

export default AccountSummary
