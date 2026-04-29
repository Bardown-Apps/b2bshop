import { Routes, Route } from "react-router-dom";
import routes from "@/constants/routes";
import Home from "@pages/home";
import Catalogues from "@/pages/catalogues";
import SportsCatalogue from "@/pages/sports-catalogue";
import HeadwearCatalogue from "@/pages/headwear-catalogue";
import ApparelCatalogue from "@/pages/apparel-catalogue";
import Dashboard from "@pages/dashboard";
import ClubStore from "@/pages/club-store";
import Product from "@/pages/product";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Summary from "@/pages/summary";
import Account from "@/pages/account";
import Orders from "@/pages/orders";
import Support from "@/pages/support";
import FreestyleSublimation from "@/pages/freestyle-sublimation";
import ArtLibrary from "@/pages/art-library";
import FreestyleHeadwear from "@/pages/freestyle-headwear";
import FreestyleDigitalPrint from "@/pages/freestyle-digital-print";
import SupportTickets from "@/pages/support-tickets";
import AccountUsers from "@/pages/account-users";
import SavedCards from "@/pages/saved-cards";
import ShippingAddresses from "@/pages/shipping-addresses";
import Security from "@/pages/security";
import ComingSoonPage from "@/pages/coming-soon";
import GraphicsRequests from "@/pages/graphics-requests";
import GraphicsJobForm from "@/pages/graphics-requests/JobForm";
import FAQ from "@/pages/faqs";
import Announcements from "@/pages/announcements";
import OrderForm from "@/pages/order-form";
import CreateLookBook from "@/pages/create-look-book";
import PublicRoute from "@/routes/PublicRoute";
import PrivateRoute from "@/routes/PrivateRoute";
import ProtectedLayout from "@/components/ProtectedLayout";
import PublicLayout from "@/components/PublicLayout";

const AppRoutes = () => (
  <Routes>
    <Route
      element={
        <PublicRoute>
          <PublicLayout />
        </PublicRoute>
      }
    >
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.catalogues} element={<Catalogues />} />
      <Route path={routes.brandCatalogues} element={<Catalogues />} />
      <Route path={routes.sportsCatalogue} element={<SportsCatalogue />} />
      <Route path={routes.headwearCatalogue} element={<HeadwearCatalogue />} />
      <Route path={routes.apparelCatalogue} element={<ApparelCatalogue />} />
    </Route>

    <Route element={<PrivateRoute />}>
      <Route element={<ProtectedLayout />}>
        <Route path={routes.dashboard} element={<Dashboard />} />
        <Route path={routes.clubStore} element={<ClubStore />} />
        <Route path={routes.product} element={<Product />} />
        <Route path={routes.cart} element={<Cart />} />
        <Route path={routes.checkout} element={<Checkout />} />
        <Route path={routes.account} element={<Account />} />
        <Route path={routes.orders} element={<Orders />} />
        <Route path={routes.support} element={<Support />} />
        <Route
          path={routes.freestyleSublimation}
          element={<FreestyleSublimation />}
        />
        <Route path={routes.artLibrary} element={<ArtLibrary />} />
        <Route
          path={routes.freestyleHeadwear}
          element={<FreestyleHeadwear />}
        />
        <Route
          path={routes.freestyleDigitalPrint}
          element={<FreestyleDigitalPrint />}
        />
        <Route path={routes.supportTickets} element={<SupportTickets />} />
        <Route path={routes.accountUsers} element={<AccountUsers />} />
        <Route path={routes.savedCards} element={<SavedCards />} />
        <Route
          path={routes.shippingAddresses}
          element={<ShippingAddresses />}
        />
        <Route path={routes.security} element={<Security />} />
        <Route path={routes.comingSoon} element={<ComingSoonPage />} />
        <Route path={routes.graphicRequest} element={<GraphicsRequests />} />
        <Route
          path={routes.graphicsRequestNew}
          element={<GraphicsJobForm mode="add" />}
        />
        <Route
          path={routes.graphicsRequestEdit}
          element={<GraphicsJobForm mode="edit" />}
        />
        <Route path={routes.faqs} element={<FAQ />} />
        <Route path={routes.announcements} element={<Announcements />} />
        <Route path={routes.orderForm} element={<OrderForm />} />
        <Route path={routes.createLookBook} element={<CreateLookBook />} />
        <Route path={routes.summaryOrder()} element={<Summary />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
