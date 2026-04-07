export const ACCOUNT_USERS = [
  {
    id: "1",
    name: "Michael Torres",
    email: "m.torres@apexsports.com",
    role: "Admin",
    status: "Active",
    addedAt: "January 12, 2025",
    lastLogin: "April 6, 2026",
  },
  {
    id: "2",
    name: "Jessica Lin",
    email: "j.lin@apexsports.com",
    role: "Buyer",
    status: "Active",
    addedAt: "March 5, 2025",
    lastLogin: "April 4, 2026",
  },
  {
    id: "3",
    name: "David Patel",
    email: "d.patel@apexsports.com",
    role: "Viewer",
    status: "Active",
    addedAt: "June 20, 2025",
    lastLogin: "March 28, 2026",
  },
  {
    id: "4",
    name: "Sarah Kim",
    email: "s.kim@apexsports.com",
    role: "Buyer",
    status: "Invited",
    addedAt: "April 1, 2026",
    lastLogin: "—",
  },
  {
    id: "5",
    name: "Robert Chen",
    email: "r.chen@apexsports.com",
    role: "Viewer",
    status: "Deactivated",
    addedAt: "August 15, 2024",
    lastLogin: "December 10, 2025",
  },
];

export const USER_STATUS_STYLES = {
  Active: "bg-green-50 text-green-700 border-green-200",
  Invited: "bg-amber-50 text-amber-700 border-amber-200",
  Deactivated: "bg-slate-100 text-slate-500 border-slate-200",
};

export const USER_ROLES = {
  Admin: "Full access to orders, account settings, and user management",
  Buyer: "Can browse, place orders, and view order history",
  Viewer: "Read-only access to catalogue and order history",
};

export const USER_FILTERS = ["All Users", "Active", "Invited", "Deactivated"];
