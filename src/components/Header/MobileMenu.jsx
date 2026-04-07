import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { NAV } from "@/constants/navigation";

const MobileNavItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const hasChildren = item.children || item.items;

  useEffect(() => {
    if (contentRef.current) {
      setHeight(expanded ? contentRef.current.scrollHeight : 0);
    }
  }, [expanded]);

  if (!hasChildren) {
    return (
      <Link
        to={item.href || "/"}
        className="block py-3 text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  const subItems = item.children
    ? Object.entries(item.children)
    : (item.items?.map((i) => [i, null]) ?? []);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-slate-800 hover:text-red-600 cursor-pointer transition-colors"
      >
        {item.label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-250 ease-out"
        style={{ maxHeight: `${height}px`, opacity: expanded ? 1 : 0 }}
      >
        <div className="pl-4 pb-2 space-y-1">
          {subItems.map(([key, values]) =>
            values ? (
              <div key={key} className="mb-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {key}
                </p>
                {values.map((v) => {
                  const isBrand =
                    typeof v === "object" && v !== null && "name" in v;
                  const key = isBrand ? v.name : v;
                  const to = isBrand && v.href ? v.href : "/";
                  return (
                    <Link
                      key={key}
                      to={to}
                      className="flex items-center gap-2 py-1.5 text-sm text-slate-600 hover:text-red-600 transition-colors"
                    >
                      {isBrand && (
                        <img
                          src={v.logo}
                          alt=""
                          className="h-5 w-5 object-contain shrink-0"
                          loading="lazy"
                        />
                      )}
                      {isBrand ? v.name : v}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Link
                key={typeof key === "object" && key?.name ? key.name : key}
                to={typeof key === "object" && key?.href ? key.href : "/"}
                className="flex items-center gap-2 py-1.5 text-sm text-slate-600 hover:text-red-600 transition-colors"
              >
                {typeof key === "object" && key?.logo ? (
                  <img
                    src={key.logo}
                    alt=""
                    className="h-5 w-5 object-contain shrink-0"
                    loading="lazy"
                  />
                ) : null}
                {typeof key === "object" && key?.name ? key.name : key}
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

const MobileMenu = ({
  onSignIn,
  isAuthenticated,
  userName,
  onDashboard,
  onSignOut,
}) => (
  <div
    className="md:hidden border-t border-slate-100 bg-white shadow-lg max-h-[80vh] overflow-y-auto animate-fade-up"
    style={{ animationDuration: "0.25s" }}
  >
    <nav className="px-4 py-2 divide-y divide-slate-100">
      {isAuthenticated && (
        <div className="py-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Signed in as
          </p>
          <p className="text-sm font-semibold text-slate-900 mt-1">
            {userName}
          </p>
        </div>
      )}
      {NAV.map((item) => (
        <MobileNavItem key={item.label} item={item} />
      ))}
      {!isAuthenticated && (
        <div className="pt-4 pb-2">
          <button
            onClick={onSignIn}
            className="w-full py-3 bg-red-600 text-white font-bold rounded-lg text-sm cursor-pointer hover:bg-red-700 transition-colors"
          >
            Sign In to B2B Portal
          </button>
        </div>
      )}
      {isAuthenticated && (
        <div className="pt-4 pb-2">
          <button
            onClick={onDashboard}
            className="w-full py-3 bg-slate-100 text-slate-800 font-bold rounded-lg text-sm cursor-pointer hover:bg-slate-200 transition-colors"
          >
            Dashboard
          </button>
        </div>
      )}
      {isAuthenticated && (
        <div className="pt-4 pb-2">
          <button
            onClick={onSignOut}
            className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg text-sm cursor-pointer hover:bg-slate-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  </div>
);

export default MobileMenu;
