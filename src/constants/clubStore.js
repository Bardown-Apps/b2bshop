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

export const getFilterOptions = (clubs = []) => ({
  Clubs: getClubOptions(clubs),
  Size: ["S", "M", "L", "XL", "2XL", "Youth"],
  Color: ["Black", "Red", "White", "Navy", "Red/Black"],
});

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
