import NavDropdown from "@/components/NavDropdown";
import routes from "@/constants/routes";
import { NAV } from "@/constants/navigation";
import { NavLink, useLocation } from "react-router-dom";

const NavBar = () => {
  const { pathname, hash, search } = useLocation();
  const hasSportQuery = Boolean(new URLSearchParams(search).get("sport"));

  return (
    <div className="hidden md:block border-t border-slate-100 relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center gap-6">
        {NAV.map((item) => {
          if (item.children || item.items) {
            const isDropdownActive =
              item.label === "SPORTS"
                ? pathname === routes.sportsCatalogue && hasSportQuery
                : item.label === "HEADWEAR"
                  ? pathname === routes.headwearCatalogue
                : item.label === "APPAREL"
                  ? pathname === routes.apparelCatalogue
                : false;

            return (
              <NavDropdown
                key={item.label}
                label={item.label}
                children={item.children}
                items={item.items}
                isActive={isDropdownActive}
              />
            );
          }

          const href = item.href || "/";
          const isHashLink = href.startsWith("#");

          if (isHashLink) {
            const isHashActive = pathname === "/" && hash === href;

            return (
              <a
                key={item.label}
                href={href}
                className={`text-sm font-semibold tracking-wide py-4 px-1 border-b-2 whitespace-nowrap transition-colors ${
                  isHashActive
                    ? "text-red-600 border-red-600"
                    : "text-slate-700 border-transparent hover:text-red-600 hover:border-red-600"
                }`}
              >
                {item.label}
              </a>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={href}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide py-4 px-1 border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-red-600 border-red-600"
                    : "text-slate-700 border-transparent hover:text-red-600 hover:border-red-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default NavBar;
