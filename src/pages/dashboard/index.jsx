import AnimateIn from '@/components/AnimateIn'
import AccountInfoSection from './AccountInfoSection'
import StatusSection from './StatusSection'
import SalesRepSection from './SalesRepSection'
import AddressSection from './AddressSection'

const Dashboard = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Dashboard</h1>
    </div>

    <AnimateIn delay={0}>
      <AccountInfoSection />
    </AnimateIn>
    <AnimateIn delay={0.1}>
      <StatusSection />
    </AnimateIn>
    <AnimateIn delay={0.15}>
      <SalesRepSection />
    </AnimateIn>
    <AnimateIn delay={0.2}>
      <AddressSection />
    </AnimateIn>
  </div>
)

export default Dashboard
