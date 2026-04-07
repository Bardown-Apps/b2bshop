import { Routes, Route } from 'react-router-dom'
import routes from '@/constants/routes'
import Home from '@pages/home'
import Dashboard from '@pages/dashboard'
import ClubStore from '@/pages/club-store'
import Account from '@/pages/account'
import Orders from '@/pages/orders'
import Support from '@/pages/support'
import FreestyleSublimation from '@/pages/freestyle-sublimation'
import ArtLibrary from '@/pages/art-library'
import FreestyleHeadwear from '@/pages/freestyle-headwear'
import FreestyleDigitalPrint from '@/pages/freestyle-digital-print'
import SupportTickets from '@/pages/support-tickets'
import AccountUsers from '@/pages/account-users'
import SavedCards from '@/pages/saved-cards'
import ShippingAddresses from '@/pages/shipping-addresses'
import Security from '@/pages/security'
import PublicRoute from '@/routes/PublicRoute'
import PrivateRoute from '@/routes/PrivateRoute'
import ProtectedLayout from '@/components/ProtectedLayout'

const AppRoutes = () => (
  <Routes>
    <Route path={routes.home} element={<PublicRoute><Home /></PublicRoute>} />

    <Route element={<PrivateRoute />}>
      <Route element={<ProtectedLayout />}>
        <Route path={routes.dashboard} element={<Dashboard />} />
        <Route path={routes.clubStore} element={<ClubStore />} />
        <Route path={routes.account} element={<Account />} />
        <Route path={routes.orders} element={<Orders />} />
        <Route path={routes.support} element={<Support />} />
        <Route path={routes.freestyleSublimation} element={<FreestyleSublimation />} />
        <Route path={routes.artLibrary} element={<ArtLibrary />} />
        <Route path={routes.freestyleHeadwear} element={<FreestyleHeadwear />} />
        <Route path={routes.freestyleDigitalPrint} element={<FreestyleDigitalPrint />} />
        <Route path={routes.supportTickets} element={<SupportTickets />} />
        <Route path={routes.accountUsers} element={<AccountUsers />} />
        <Route path={routes.savedCards} element={<SavedCards />} />
        <Route path={routes.shippingAddresses} element={<ShippingAddresses />} />
        <Route path={routes.security} element={<Security />} />
      </Route>
    </Route>
  </Routes>
)

export default AppRoutes
