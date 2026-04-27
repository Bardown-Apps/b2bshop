import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const NavDropdown = ({ label, children, items, isActive = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="static"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`flex items-center gap-1 text-sm font-semibold tracking-wide transition-colors py-4 px-1 border-b-2 cursor-pointer ${
          isActive
            ? "text-red-600 border-red-600"
            : "text-slate-800 border-transparent hover:text-red-600 hover:border-red-600"
        }`}
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className="absolute left-0 right-0 top-full z-50 bg-white border-t border-slate-100 shadow-xl transition-all duration-200 ease-out origin-top"
        style={{
          opacity: open ? 1 : 0,
          transform: open
            ? "scaleY(1) translateY(0)"
            : "scaleY(0.97) translateY(-4px)",
          pointerEvents: open ? "auto" : "none",
          visibility: open ? "visible" : "hidden",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          {children ? (
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-8">
              {Object.entries(children).map(([group, subitems]) => (
                <div key={group}>
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    {group}
                  </p>
                  <ul className="space-y-2">
                    {subitems.map((item) => {
                      const isBrand =
                        typeof item === "object" &&
                        item !== null &&
                        "name" in item;
                      const key = item;
                      const to = item.href ? item.href : "/";

                      return (
                        <li key={key}>
                          <Link
                            to={to}
                            className={`text-sm text-slate-500 hover:text-red-600 transition-colors ${isBrand ? "flex items-center gap-2" : ""}`}
                          >
                            {isBrand && item.logo && (
                              <img
                                src={item.logo}
                                alt=""
                                className="h-6 w-6 object-contain shrink-0"
                                loading="lazy"
                              />
                            )}
                            {isBrand ? item.name : item}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-10 gap-y-3">
              {items?.map((item) => {
                const isBrand =
                  typeof item === "object" && item !== null && "name" in item;
                const key = isBrand ? item.name : item;
                return (
                  <Link
                    key={key}
                    to={isBrand && item.href ? item.href : "/"}
                    className={`text-sm text-slate-500 hover:text-red-600 transition-colors ${isBrand ? "flex items-center gap-2" : ""}`}
                  >
                    {isBrand && (
                      <img
                        src={item.logo}
                        alt=""
                        className="h-7 w-7 object-contain shrink-0"
                        loading="lazy"
                      />
                    )}
                    {isBrand ? item.name : item}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavDropdown;
