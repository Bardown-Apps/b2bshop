import { User, Mail, Phone } from 'lucide-react'
import { PROFILE } from '@/constants/dashboard'

const { salesRep } = PROFILE

const SalesRepCard = () => (
  <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
        <User className="w-4 h-4 text-slate-500" />
      </div>
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Your Sales Representative</h2>
    </div>
    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
      <span className="font-bold text-slate-900">{salesRep.name}</span>
      <a href={`mailto:${salesRep.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
        <Mail className="w-3.5 h-3.5" /> {salesRep.email}
      </a>
      <span className="text-slate-600 flex items-center gap-1">
        <Phone className="w-3.5 h-3.5" /> {salesRep.phone}
      </span>
    </div>
  </div>
)

export default SalesRepCard
