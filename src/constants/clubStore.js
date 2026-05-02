import {
  ShoppingCart,
  RefreshCw,
  Archive,
  ImageIcon,
  HelpCircle,
  Megaphone,
  ClipboardList,
  BookOpen,
} from "lucide-react";

export const ACTIONS = [
  { label: "New Order", icon: ShoppingCart },
  { label: "WIP", icon: RefreshCw },
  { label: "Historical", icon: Archive },
  { label: "Graphics Requests", icon: ImageIcon },
  { label: "FAQs", icon: HelpCircle },
  { label: "Announcements", icon: Megaphone },
  { label: "Order Form", icon: ClipboardList },
  { label: "Create Look Book", icon: BookOpen },
];

export const CATEGORIES = [
  "All",
  "Tops",
  "Headwear",
  "Accessories",
  "Bottoms",
  "Uniforms",
  "Summer Jerseys",
  "Archive",
];

const DEFAULT_CLUBS = [
  "Bow Valley Flames",
  "Cochrane Rockies",
  "Calgary Flames Jr.",
];

export const getClubOptions = (clubs = []) => {
  const dynamicClubs = clubs
    .map((club) => {
      const name = club?.clubName?.trim();
      const logo =
        club?.logo ||
        club?.clubLogo ||
        club?.clubLogoUrl ||
        club?.logoUrl ||
        "";

      return name ? { name, logo } : null;
    })
    .filter(Boolean);

  if (dynamicClubs.length > 0) {
    const uniqueClubs = new Map();
    dynamicClubs.forEach((club) => {
      if (!uniqueClubs.has(club.name)) {
        uniqueClubs.set(club.name, club);
      }
    });

    return Array.from(uniqueClubs.values());
  }

  return DEFAULT_CLUBS.map((name) => ({ name, logo: "" }));
};

const DEFAULT_SIZES = ["S", "M", "L", "XL", "2XL", "Youth"];

const DEFAULT_COLORS = ["Black", "Red", "White", "Navy", "Red/Black"];

const variantEntryValue = (item) => {
  if (typeof item === "string") return item?.trim() || "";
  const v = item?.value;
  return typeof v === "string" ? v.trim() : "";
};

const valuesFromVariant = (product, variantName) => {
  const values = product?.variants?.find(
    (v) => v?.variant === variantName,
  )?.values;
  return Array.isArray(values) ? values : [];
};

/** Unique size labels across products (Size variant), sorted for stable UI. */
export const getSizeOptionsFromProducts = (products = []) => {
  const seen = new Set();
  for (const product of products) {
    for (const item of valuesFromVariant(product, "Size")) {
      const label = variantEntryValue(item);
      if (label) seen.add(label);
    }
  }
  return Array.from(seen).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );
};

/** Unique color labels across products (Color variant), sorted for stable UI. */
export const getColorOptionsFromProducts = (products = []) => {
  const seen = new Set();
  for (const product of products) {
    for (const item of valuesFromVariant(product, "Color")) {
      const label = variantEntryValue(item);
      if (label) seen.add(label);
    }
  }
  return Array.from(seen).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
};

export const getFilterOptions = (clubs = [], products = []) => {
  const sizes = getSizeOptionsFromProducts(products);
  const colors = getColorOptionsFromProducts(products);

  return {
    Clubs: getClubOptions(clubs),
    Size: sizes.length > 0 ? sizes : DEFAULT_SIZES,
    Color: colors.length > 0 ? colors : DEFAULT_COLORS,
  };
};

export const FILTER_OPTIONS = getFilterOptions();

export const ACTION_DESCRIPTIONS = {
  "New Order": "Start a new order by browsing the catalogue below.",
  WIP: "Your work-in-progress orders will appear here.",
  Historical: "Your past completed orders will appear here.",
  "Graphics Requests": "Submit a graphics or artwork request here.",
  FAQs: "Frequently asked questions will appear here.",
  Announcements: "No new announcements at this time.",
  "Order Form": "Download or fill out your order form below.",
};
