import { MapPin } from 'lucide-react'
import DashboardCard from '@/components/DashboardCard'
import InfoLabel from '@/components/InfoLabel'
import ContactForm from '@/components/ContactForm'
import { PROFILE } from '@/constants/dashboard'

const AddressSection = () => (
  <DashboardCard>
    <div className="p-6 md:p-8 border-b border-slate-100">
      <InfoLabel icon={MapPin}>Address &amp; Contact Info</InfoLabel>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
      <div className="p-6 md:p-8 bg-slate-50/30">
        <div className="space-y-1 text-sm text-slate-600 leading-relaxed">
          <p className="font-bold text-base text-slate-900 mb-3">{PROFILE.companyName}</p>
          <p>{PROFILE.address.street}</p>
          <p>{PROFILE.address.city}, {PROFILE.address.province}</p>
          <p>{PROFILE.address.postalCode}</p>
          <p>{PROFILE.address.country}</p>
        </div>
      </div>
      <div className="p-6 md:p-8">
        <ContactForm initialEmail={PROFILE.contact.email} initialPhone={PROFILE.contact.phone} />
      </div>
    </div>
  </DashboardCard>
)

export default AddressSection
