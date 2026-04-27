import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import routes from "@/constants/routes";
import {
  LogOut,
  Search,
  User,
  Menu,
  X,
  Store,
  ShoppingCart,
} from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import ProtectedNav from "./ProtectedNav";
// import DashboardSidebar from "@/components/DashboardSidebar";
import Footer from "@/components/Footer";

const ProtectedLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state?.cart?.itemsCount || 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate(routes.home);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AnnouncementBar />

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div
            className="hidden md:flex items-center cursor-pointer"
            onClick={() => navigate(routes.clubStore)}
          >
            {user?.companyLogo ? (
              <img
                src={user?.companyLogo}
                alt="Adrenalin Source for Sports"
                className="h-14 w-auto rounded-md object-contain bg-slate-900 p-1"
                loading="lazy"
              />
            ) : (
              <div className="h-10 w-10 rounded-md bg-slate-900 text-white flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center w-60 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-300 transition-all">
            <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-500 w-full"
            />
          </div>

          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 flex justify-center">
            <Link
              to={routes.clubStore}
              className="text-2xl font-bold tracking-tight text-slate-900 hover:text-red-600 transition-colors"
            >
              <img
                src="https://www.gobardown.com/cdn/shop/files/bardown_BD_logo_160x.png?v=1682392618"
                alt="BD/BARDOWN"
                className="w-auto object-contain"
                loading="lazy"
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">
                {user?.companyName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate(routes.cart)}
              className="relative flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer p-2 rounded-lg hover:bg-slate-100"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingCart className="w-5 h-5" />

              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-semibold leading-none">
                {cartCount || "0"}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors cursor-pointer px-2 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
        <ProtectedNav />
      </header>

      {/* Mobile sidebar overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col lg:flex-row gap-8">
          {/* Mobile sidebar drawer */}
          {/* <div
            className={`lg:hidden fixed top-0 left-0 z-30 h-full w-72 bg-slate-50 shadow-2xl pt-20 px-4 pb-6 overflow-y-auto transition-transform duration-300 ease-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
          </div> */}

          {/* Desktop sidebar */}
          {/* <div className="hidden lg:block">
            <DashboardSidebar
              collapsed={collapsed}
              onToggleCollapse={() => setCollapsed(!collapsed)}
            />
          </div> */}

          <main
            key={location.pathname}
            className="flex-1 min-w-0 animate-fade-up"
            style={{ animationDuration: "0.4s" }}
          >
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProtectedLayout;
