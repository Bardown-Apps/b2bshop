import AccountInfoSection from './AccountInfoSection'
import StatusSection from './StatusSection'
import SalesRepSection from './SalesRepSection'
import AddressSection from './AddressSection'

const Dashboard = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between mb-2">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Dashboard</h1>
    </div>

    <AccountInfoSection />
    <StatusSection />
    <SalesRepSection />
    <AddressSection />
  </div>
)

export default Dashboard
