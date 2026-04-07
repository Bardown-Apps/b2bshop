import { Building2 } from 'lucide-react'
import FormField from '@/components/FormField'

const CompanyForm = () => (
  <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
      <Building2 className="w-4 h-4 text-slate-500" />
      <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wide">Company Information</h2>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="md:col-span-2">
        <FormField label="Company Name" name="companyName" rules={{ required: 'Company name is required' }} />
      </div>
      <FormField label="Street Address" name="address" rules={{ required: 'Address is required' }} />
      <FormField label="City" name="city" rules={{ required: 'City is required' }} />
      <FormField label="Province / State" name="province" />
      <FormField label="Postal Code" name="postalCode" rules={{ required: 'Postal code is required' }} />
      <FormField label="Country" name="country" rules={{ required: 'Country is required' }} />
    </div>
  </div>
)

export default CompanyForm
