import { useState } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import routes from "@/constants/routes";
import { LogOut, Search, User, Menu, X } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import ProtectedNav from "./ProtectedNav";
import DashboardSidebar from "@/components/DashboardSidebar";
import Footer from "@/components/Footer";

const ProtectedLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate(routes.home);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AnnouncementBar />

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center">
            <img
              src="https://res.cloudinary.com/dn0taoeju/image/upload/v1772220234/ShopTeamVault/Shops/3bebbce2-c465-4a18-8058-dad5dce8d0bb/ShopLogo/SFS_Logo_Vertical_Adrenalin_White_1000px_2023-08-28-15-39-46_cjvtcw.jpg"
              alt="Adrenalin Source for Sports"
              className="h-12 w-auto rounded-md object-contain bg-slate-900 p-1"
              loading="lazy"
            />
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
              to="/"
              className="text-2xl font-bold tracking-tight text-slate-900 hover:text-red-600 transition-colors"
            >
              BD/BARDOWN
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">
                Adrenalin Manager
              </span>
            </div>
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
          <div
            className={`lg:hidden fixed top-0 left-0 z-30 h-full w-72 bg-slate-50 shadow-2xl pt-20 px-4 pb-6 overflow-y-auto transition-transform duration-300 ease-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <DashboardSidebar
              collapsed={collapsed}
              onToggleCollapse={() => setCollapsed(!collapsed)}
            />
          </div>

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
