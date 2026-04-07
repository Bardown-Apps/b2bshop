import { MapPin } from 'lucide-react'
import FormField from '@/components/FormField'

const ContactInfoForm = () => (
  <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
      <MapPin className="w-4 h-4 text-slate-500" />
      <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Contact Information</h2>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
      <FormField label="Email" name="email" type="email" rules={{ required: 'Email is required' }} />
      <FormField label="Phone" name="phone" type="tel" rules={{ required: 'Phone is required' }} />
      <FormField label="Customer Since" name="customerSince" readOnly />
      <FormField label="Account Number" name="accountNumber" readOnly />
    </div>
  </div>
)

export default ContactInfoForm
