const routes = {
  home: "/",
  catalogues: "/catalogues",
  sportsCatalogue: "/sports-catalogue",
  headwearCatalogue: "/headwear-catalogue",
  apparelCatalogue: "/apparel-catalogue",
  brandCatalogues: "/catalogues/brand/:brandSlug",
  brandCatalogue: (brandSlug = ":brandSlug") =>
    `/catalogues/brand/${brandSlug}`,
  dashboard: "/dashboard",
  clubStore: "/club-store",
  product: "/product/:prodId",
  productDetails: (prodId = ":prodId") => `/product/${prodId}`,
  account: "/account",
  orders: "/orders",
  support: "/support",
  freestyleSublimation: "/freestyle-sublimation",
  artLibrary: "/art-library",
  freestyleHeadwear: "/freestyle-headwear",
  freestyleDigitalPrint: "/freestyle-digital-print",
  supportTickets: "/support-tickets",
  accountUsers: "/account-users",
  savedCards: "/saved-cards",
  shippingAddresses: "/shipping-addresses",
  security: "/security",
  comingSoon: "/coming-soon",
  graphicRequest: "/graphic-request",
  graphicsRequestNew: "/graphic-request/new",
  graphicsRequestEdit: "/graphic-request/:id",
  faqs: "/faqs",
  announcements: "/announcements",
  createLookBook: "/create-look-book",
  checkout: "/checkout",
  contactUs: "/contact-us",
  cart: "/cart",
  summary: "/summary",
  summaryOrder: (orderNumber = ":orderNumber") => `/summary/${orderNumber}`,
};

export const Home = { path: routes.home };
export const Checkout = { path: routes.checkout };
export const Product = { path: routes.product };
export const ContactUs = { path: routes.contactUs };
export const Cart = { path: routes.cart };
export const Summary = { path: routes.summary };
export const GraphicsRequest = { path: routes.graphicRequest };
export const GraphicsJob = {
  new: () => routes.graphicsRequestNew,
  edit: (id = ":id") => `/graphic-request/${id}`,
};

export default routes;
