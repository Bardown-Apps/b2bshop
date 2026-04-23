import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChevronDown,
  LogOut,
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import NavBar from "@/components/Header/NavBar";
import MobileMenu from "@/components/Header/MobileMenu";
import routes from "@/constants/routes";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

const Header = ({ onSignIn }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const displayName = user?.name || user?.email || "User";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const accountMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGoToDashboard = () => {
    setAccountMenuOpen(false);
    navigate(routes.dashboard);
  };
  const handleLogout = () => {
    dispatch(logout());
    setAccountMenuOpen(false);
    navigate(routes.home);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <div className="hidden md:flex items-center w-60 bg-slate-100 border border-slate-200 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-red-300 transition-all">
          <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-500 w-full"
          />
        </div>

        <button
          className="md:hidden p-2 text-slate-600 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 flex justify-center">
          <Link to="/" className="group">
            <img
              src="https://www.gobardown.com/cdn/shop/files/bardown_BD_logo_160x.png?v=1682392618"
              alt="Adrenalin Source for Sports"
              className="object-contain"
              loading="lazy"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {isAuthenticated ? (
            <div ref={accountMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline text-sm font-semibold">
                  {displayName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    accountMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] min-w-[180px] bg-white border border-slate-200 rounded-lg shadow-lg p-1 z-50">
                  <button
                    type="button"
                    onClick={handleGoToDashboard}
                    className="w-full cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-slate-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Sign In</span>
            </button>
          )}
          <button className="relative p-2 text-slate-600 hover:text-red-600 transition-colors cursor-pointer">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>

      <NavBar />
      {mobileMenuOpen && (
        <MobileMenu
          onSignIn={onSignIn}
          isAuthenticated={isAuthenticated}
          userName={displayName}
          onDashboard={handleGoToDashboard}
          onSignOut={handleLogout}
        />
      )}
    </header>
  );
};

export default Header;
