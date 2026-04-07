export const NAV = [
  { label: "NEW", href: "#new" },
  {
    label: "CATEGORIES",
    children: {
      Tops: [
        "T-Shirts",
        "Polos",
        "Sweatshirts & Hoodies",
        "Tanks & Sleeveless",
        "Long Sleeves",
        "Pullovers",
      ],
      Bottoms: ["Shorts", "Pants & Joggers", "Leggings", "Skirts & Skorts"],
      Outerwear: ["Jackets", "Vests", "Windbreakers", "Puffers & Parkas"],
      Headwear: ["Caps & Hats", "Beanies", "Visors", "Buckets"],
      "Bags & Accessories": [
        "Backpacks",
        "Duffle Bags",
        "Socks",
        "Gloves & Mittens",
      ],
    },
  },
  {
    label: "BRANDS",
    children: {
      Popular: ["Holloway", "High Five", "Russell Athletic"],
      Performance: ["Augusta Sportswear", "Badger Sport", "Alleson Athletic"],
      Headwear: ["Pacific Headwear", "Richardson", "Outdoor Cap"],
    },
  },
  {
    label: "SPORT",
    children: {
      "Team Sports": [
        "Baseball",
        "Basketball",
        "Football",
        "Soccer",
        "Volleyball",
      ],
      Individual: ["Tennis", "Track & Field", "Wrestling", "Golf"],
      Outdoor: ["Lacrosse", "Rugby", "Hockey", "Softball"],
    },
  },
  {
    label: "CLUBS",
    items: [
      "Club Packages",
      "Team Uniforms",
      "Practice Gear",
      "Fan Wear",
      "Custom Orders",
    ],
  },
  {
    label: "CATALOGUES",
    items: [
      "Spring/Summer 2025",
      "Fall/Winter 2025",
      "Digital Catalogue",
      "Custom/Sublimation Guide",
    ],
  },
  { label: "CORPORATE", href: "#corporate" },
  { label: "HEADWEAR", href: "#headwear" },
  { label: "SUBLIMATION", href: "#sublimation" },
];

export const BRANDS = [
  "Holloway",
  "High Five",
  "Russell Athletic",
  "Augusta Sportswear",
  "Pacific Headwear",
  "Badger Sport",
];

export const CATEGORIES = [
  {
    name: "Tops",
    desc: "T-shirts, Polos, Hoodies & more",
    bg: "from-blue-900 to-blue-700",
  },
  {
    name: "Bottoms",
    desc: "Shorts, Pants, Joggers",
    bg: "from-slate-800 to-slate-600",
  },
  {
    name: "Outerwear",
    desc: "Jackets, Vests, Puffers",
    bg: "from-zinc-800 to-zinc-600",
  },
  {
    name: "Headwear",
    desc: "Caps, Beanies, Visors",
    bg: "from-neutral-800 to-neutral-600",
  },
  {
    name: "Bags",
    desc: "Backpacks, Duffles & more",
    bg: "from-stone-800 to-stone-600",
  },
  {
    name: "Sport",
    desc: "Full sport collections",
    bg: "from-red-900 to-red-700",
  },
];

export const TRENDING = [
  {
    name: "Jackson Way Hoodie",
    sku: "#229576",
    price: "$60.00",
    brand: "Holloway",
    tag: "NEW",
  },
  {
    name: "Legend Tech Full-Zip Fleece Jacket",
    sku: "#R25TFM",
    price: "$110.40",
    brand: "Russell Athletic",
    tag: "NEW",
  },
  {
    name: "Legend Short Sleeve Pullover",
    sku: "#R21DSM",
    price: "$72.10",
    brand: "Russell Athletic",
    tag: "NEW",
  },
  {
    name: "Heritage Prep Crew",
    sku: "#223527",
    price: "$63.00",
    brand: "Holloway",
    tag: "NEW",
  },
  {
    name: "Cold Secure Puffer Vest",
    sku: "#226420",
    price: "$68.00",
    brand: "Holloway",
    tag: "NEW",
  },
  {
    name: "Octane Soccer Jersey",
    sku: "#322240",
    price: "$22.00",
    brand: "Augusta Sportswear",
    tag: "NEW",
  },
];

export const QUICK_LINKS = [
  "Shop Corporate",
  "Shop Sport",
  "Shop Weekender",
  "Custom Sublimation",
  "View Catalogues",
  "Club Packages",
];

export const HERO_STATS = [
  { num: "5", label: "Day Sublimation" },
  { num: "1000+", label: "Products Available" },
  { num: "6", label: "Premium Brands" },
];

export const FOOTER_LINKS = {
  Shop: [
    "New Arrivals",
    "Categories",
    "Brands",
    "Sport",
    "Corporate",
    "Sublimation",
  ],
  Support: ["Contact Us", "FAQ", "Shipping Info", "Returns", "Size Guide"],
  Company: ["About Us", "Careers", "Press", "Blog"],
};
