import {
  LayoutDashboard,
  ShieldCheck,
  MapPin,
  CreditCard,
  Users,
  HeadsetIcon,
  Package,
  Paintbrush,
  Image,
  Crown,
  Printer,
  Store,
} from "lucide-react";
import routes from "./routes";

export const PROFILE = {
  accountNumber: "ACC-2847",
  companyName: "Adrenalin SFS",
  customerSince: "04/07/2026",
  discountStatus: "Gold Tier",
  eligiblePayment: "Net 30",
  salesRep: {
    name: "Sarah Johnson",
    email: "sarah.j@b2bshop.com",
    phone: "(555) 234-5678",
  },
  address: {
    street: "1234 Commerce Blvd, Suite 200",
    city: "Portland",
    province: "OR",
    postalCode: "97201",
    country: "United States",
  },
  contact: {
    email: "orders@apexsports.com",
    phone: "(555) 987-6543",
  },
};

export const RECENT_ORDERS = [
  {
    id: "1",
    orderNumber: "ORD-10482",
    status: "Shipped",
    orderedAt: "03/28/2026",
    total: 1284.5,
  },
  {
    id: "2",
    orderNumber: "ORD-10471",
    status: "Delivered",
    orderedAt: "03/15/2026",
    total: 756.0,
  },
];

export const DASHBOARD_NAV = [
  { label: "CLUB STORE", href: routes.clubStore },
  { label: "DASHBOARD", href: routes.dashboard, active: true },
  { label: "MY ACCOUNT", href: routes.account },
  { label: "ORDERS", href: routes.orders },
  { label: "SUPPORT", href: routes.support },
];

export const SIDEBAR_LINKS = [
  {
    group: "CLUB STORE",
    items: [{ label: "Club Store", icon: Store, href: routes.clubStore }],
  },
  {
    group: "MY ACCOUNT",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: routes.dashboard },
      {
        label: "Password & Security",
        icon: ShieldCheck,
        href: routes.security,
      },
      {
        label: "Shipping Addresses",
        icon: MapPin,
        href: routes.shippingAddresses,
      },
      {
        label: "Saved Credit Cards",
        icon: CreditCard,
        href: routes.savedCards,
      },
      { label: "Account Users", icon: Users, href: routes.accountUsers },
      {
        label: "My Support Tickets",
        icon: HeadsetIcon,
        href: routes.supportTickets,
      },
    ],
  },
  {
    group: "ORDERS",
    items: [{ label: "My Orders", icon: Package, href: routes.orders }],
  },
  {
    group: "MY FREESTYLE DESIGNS",
    items: [
      {
        label: "FreeStyle Sublimation",
        icon: Paintbrush,
        href: routes.freestyleSublimation,
      },
      { label: "My Art Library", icon: Image, href: routes.artLibrary },
      {
        label: "FreeStyle Headwear",
        icon: Crown,
        href: routes.freestyleHeadwear,
      },
      {
        label: "FreeStyle DigitalPrint",
        icon: Printer,
        href: routes.freestyleDigitalPrint,
      },
    ],
  },
];
