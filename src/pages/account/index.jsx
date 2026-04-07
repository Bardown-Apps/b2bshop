import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { PROFILE } from '@/constants/dashboard'
import AccountSummary from './AccountSummary'
import SalesRepCard from './SalesRepCard'
import CompanyForm from './CompanyForm'
import ContactInfoForm from './ContactInfoForm'

const initialForm = {
  companyName: PROFILE.companyName,
  address: PROFILE.address.street,
  city: PROFILE.address.city,
  province: PROFILE.address.province,
  postalCode: PROFILE.address.postalCode,
  country: PROFILE.address.country,
  email: PROFILE.contact.email,
  phone: PROFILE.contact.phone,
}

const Account = () => {
  const [form, setForm] = useState(initialForm)
  const [saved, setSaved] = useState(false)

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-3">
        My Account
      </h1>

      <AccountSummary />
      <SalesRepCard />
      <CompanyForm form={form} onChange={handleChange} />
      <ContactInfoForm form={form} onChange={handleChange} />

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-8 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saved
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  )
}

export default Account
