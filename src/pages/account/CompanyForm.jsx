import { Building2 } from 'lucide-react'
import FormField from '@/components/FormField'

const CompanyForm = ({ form, onChange }) => (
  <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
      <Building2 className="w-4 h-4 text-slate-400" />
      <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Company Information</h2>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="md:col-span-2">
        <FormField label="Company Name" name="companyName" value={form.companyName} onChange={onChange} />
      </div>
      <FormField label="Street Address" name="address" value={form.address} onChange={onChange} />
      <FormField label="City" name="city" value={form.city} onChange={onChange} />
      <FormField label="Province / State" name="province" value={form.province} onChange={onChange} />
      <FormField label="Postal Code" name="postalCode" value={form.postalCode} onChange={onChange} />
      <FormField label="Country" name="country" value={form.country} onChange={onChange} />
    </div>
  </div>
)

export default CompanyForm
