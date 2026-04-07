const routes = {
  home: "/",
  catalogues: "/catalogues",
  brandCatalogues: "/catalogues/brand/:brandSlug",
  brandCatalogue: (brandSlug = ":brandSlug") =>
    `/catalogues/brand/${brandSlug}`,
  dashboard: "/dashboard",
  clubStore: "/club-store",
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
};

export default routes;
