import { NavLink, useLocation } from "react-router-dom";
import { DASHBOARD_NAV } from "@/constants/dashboard";

const ProtectedNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center gap-1 overflow-x-auto">
        {DASHBOARD_NAV.map(({ label, href }) => (
          <NavLink
            key={label}
            to={href}
            className={`relative px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              pathname === href
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
            {pathname === href && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-slate-900 rounded-full" />
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default ProtectedNav;
