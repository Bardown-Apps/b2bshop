import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { DASHBOARD_NAV } from "@/constants/dashboard";

const ProtectedNav = () => {
  const { pathname, search } = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav ref={navRef} className="border-t border-slate-100 relative z-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center gap-1 overflow-x-auto md:overflow-visible">
        {DASHBOARD_NAV.map(({ label, href, children }) => {
          const isActive = pathname === href;
          const hasChildren = Boolean(children);

          if (!hasChildren) {
            return (
              <NavLink
                key={label}
                to={href}
                className={`relative px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-slate-900 rounded-full" />
                )}
              </NavLink>
            );
          }

          const dropdownItems = Object.values(children).flat();
          const isDropdownActive = dropdownItems.some(
            ({ href: optionHref }) => optionHref === `${pathname}${search}`,
          );

          return (
            <div
              key={label}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((current) => (current === label ? null : label))
                }
                className={`relative px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                  isDropdownActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    openDropdown === label ? "rotate-180" : ""
                  }`}
                />
                {isDropdownActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-slate-900 rounded-full" />
                )}
              </button>

              {openDropdown === label && (
                <div className="absolute top-full left-0 min-w-52 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50">
                  {Object.entries(children).map(([group, items]) => (
                    <div key={group}>
                      {group.trim() && (
                        <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          {group}
                        </p>
                      )}
                      {items.map(({ name, href: optionHref }) => {
                        const isOptionActive =
                          optionHref === `${pathname}${search}`;

                        return (
                          <Link
                            key={name}
                            to={optionHref}
                            onClick={() => setOpenDropdown(null)}
                            className={`block px-3 py-2 text-xs font-medium transition-colors ${
                              isOptionActive
                                ? "text-slate-900 bg-slate-100"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                          >
                            {name}
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default ProtectedNav;
