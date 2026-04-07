import brand1 from "@/assets/100MPH.png";
import brand2 from "@/assets/Bardown.png";
import brand3 from "@/assets/BardownLax.png";
import routes from "@/constants/routes";

const CATALOGUES = [
  {
    name: "Bardown Hockey Catalogue 2026",
    brand: "Bardown",
    sport: "Hockey",
    logo: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578397/B2B%20Store/Brands/Bardown_aiwt4a.png",
    category: "",
    link: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578539/B2B%20Store/Cataloges/Bardown_Hockey_Catalogue_2026_3_rf0eqi.pdf",
  },
  {
    name: "Bardown Lacrosse Catalogue 2026",
    brand: "BardownLAX",
    sport: "Lacrosse",
    logo: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578398/B2B%20Store/Brands/BardownLax_ox5fhm.png",
    category: "",
    link: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578692/B2B%20Store/Cataloges/Bardown_Lacrosse_Catalogue_2026_1_g8ugtz.pdf",
  },
  {
    name: "100 MPH Baseball Catalogue 2026",
    brand: "100 MPH",
    logo: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578398/B2B%20Store/Brands/100MPH_evtqvm.png",
    sport: "Baseball",
    category: "",
    link: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578543/B2B%20Store/Cataloges/100_MPH_Baseball_Catalogue_2026_1_fdfmfh.pdf",
  },
  {
    name: "Bardown Headwear & Accessories Catalogue 2026",
    brand: "Bardown",
    logo: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578397/B2B%20Store/Brands/Bardown_aiwt4a.png",
    sport: "",
    category: "Headwear & Accessories",
    link: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578540/B2B%20Store/Cataloges/Bardown_Headwear_Accessories_Catalogue_2026_2_rqh2mh.pdf",
  },
  {
    name: "Bardown Apparel Catalogue 2026",
    brand: "Bardown",
    sport: "",
    logo: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578397/B2B%20Store/Brands/Bardown_aiwt4a.png",
    category: "Apparel",
    link: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578535/B2B%20Store/Cataloges/Bardown_Apparel_Catalogue_2026_3_wkjdzu.pdf",
  },
  {
    name: "Bardown Collegiate Catalogue 2026",
    brand: "Bardown",
    logo: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578397/B2B%20Store/Brands/Bardown_aiwt4a.png",
    sport: "",
    category: "Collegiate",
    link: "https://res.cloudinary.com/dn0taoeju/image/upload/v1775578546/B2B%20Store/Cataloges/Bardown_Collegiate-catalogue-2026_1_z40pba.pdf",
  },
];

const BRANDS_WITH_LOGOS = [
  {
    name: "Bardown",
    logo: brand2,
    href: routes.brandCatalogue("bardown"),
  },
  {
    name: "BardownLAX",
    logo: brand3,
    href: routes.brandCatalogue("bardownlax"),
  },
  {
    name: "100 MPH",
    logo: brand1,
    href: routes.brandCatalogue("100-mph"),
  },
];

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
    items: BRANDS_WITH_LOGOS,
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
    href: "/catalogues",
  },
  { label: "CORPORATE", href: "#corporate" },
  { label: "HEADWEAR", href: "#headwear" },
  { label: "SUBLIMATION", href: "#sublimation" },
];

export const BRANDS = BRANDS_WITH_LOGOS;
export { CATALOGUES };

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
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=400&fit=crop&crop=center",
  },
  {
    name: "Legend Tech Full-Zip Fleece Jacket",
    sku: "#R25TFM",
    price: "$110.40",
    brand: "Russell Athletic",
    tag: "NEW",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop",
  },
  {
    name: "Legend Short Sleeve Pullover",
    sku: "#R21DSM",
    price: "$72.10",
    brand: "Russell Athletic",
    tag: "NEW",
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop",
  },
  {
    name: "Heritage Prep Crew",
    sku: "#223527",
    price: "$63.00",
    brand: "Holloway",
    tag: "NEW",
    image:
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=400&fit=crop",
  },
  {
    name: "Cold Secure Puffer Vest",
    sku: "#226420",
    price: "$68.00",
    brand: "Holloway",
    tag: "NEW",
    image:
      "https://images.unsplash.com/photo-1609873814058-a8928924184a?w=400&h=400&fit=crop",
  },
  {
    name: "Octane Soccer Jersey",
    sku: "#322240",
    price: "$22.00",
    brand: "Augusta Sportswear",
    tag: "NEW",
    image:
      "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=400&h=400&fit=crop",
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
