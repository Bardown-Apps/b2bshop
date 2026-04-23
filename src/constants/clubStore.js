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
  const dynamicClubNames = clubs
    .map((club) => club?.clubName?.trim())
    .filter(Boolean);

  const allClubs =
    dynamicClubNames.length > 0 ? dynamicClubNames : DEFAULT_CLUBS;
  return [...new Set(allClubs)];
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
