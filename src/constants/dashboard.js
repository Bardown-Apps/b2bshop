import {
  LayoutDashboard,
  Package,
  Paintbrush,
  CircleHelp,
  Megaphone,
  ClipboardList,
  BookOpen,
  Image,
  Crown,
  Printer,
  Store,
} from "lucide-react";
import routes from "./routes";

export const PROFILE = {
  customerSince: "04/07/2026",
  discountStatus: "Gold Tier",
  eligiblePayment: "Net 30",

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

export const getDashboardNav = (clubs = []) => [
  {
    label: "CLUB STORE",
    href: routes.clubStore,
    children: {
      "": [
        ...clubs.map((club) => {
          const teamName = club?.clubName;

          return {
            name: teamName,
            href: `${routes.clubStore}?team=${encodeURIComponent(teamName)}`,
          };
        }),
      ].filter((item) => Boolean(item.name) || item.href === routes.clubStore),
    },
  },
  { label: "DASHBOARD", href: routes.dashboard, active: true },
  {
    label: "ACCOUNT",

    children: {
      "": [
        { name: "My Account", href: routes.account },
        {
          name: "Password & Security",
          href: routes.security,
        },
        {
          name: "Shipping Addresses",
          href: routes.shippingAddresses,
        },
        {
          name: "Saved Credit Cards",

          href: routes.savedCards,
        },
        { name: "Account Users", href: routes.accountUsers },
      ],
    },
  },
  { label: "ORDERS", href: routes.orders },
  {
    label: "SUPPORT",
    children: {
      "": [
        { name: "Support", href: routes.support },
        { name: "My Support Tickets", href: routes.supportTickets },
      ],
    },
  },
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

  {
    group: "MY FREESTYLE STYLE OPTIONS",
    items: [
      {
        label: "Graphic Request",
        icon: Paintbrush,
        href: routes.graphicRequest,
      },
      { label: "FAQ", icon: CircleHelp, href: routes.faq },
      {
        label: "Announcements",
        icon: Megaphone,
        href: routes.announcements,
      },
      {
        label: "Order Form",
        icon: ClipboardList,
        href: routes.orderForm,
      },

      {
        label: "Create Look Book",
        icon: BookOpen,
        href: routes.createLookBook,
      },
    ],
  },
];
