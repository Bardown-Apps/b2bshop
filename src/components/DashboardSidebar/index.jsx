import { NavLink, useLocation } from "react-router-dom";
import { Building2, ChevronsLeft, ChevronsRight } from "lucide-react";
import { PROFILE, SIDEBAR_LINKS } from "@/constants/dashboard";
import { useSelector } from "react-redux";

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
}) => {
  const base = collapsed
    ? "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
    : "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200";
  const activeClasses = "bg-slate-900 text-white shadow-sm";
  const inactiveClasses =
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  const content = collapsed ? (
    <Icon className="w-[16px] h-[16px]" />
  ) : (
    <>
      <Icon className="w-[18px] h-[18px] shrink-0" />
      <span className="truncate">{label}</span>
    </>
  );

  if (href === "#") {
    return (
      <span
        className={`${base} ${inactiveClasses} cursor-default opacity-40`}
        title={collapsed ? label : undefined}
      >
        {content}
      </span>
    );
  }

  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={`${base} ${active ? activeClasses : inactiveClasses}`}
      title={collapsed ? label : undefined}
    >
      {content}
    </NavLink>
  );
};

const DashboardSidebar = ({ onNavigate, collapsed, onToggleCollapse }) => {
  const { pathname } = useLocation();
  const isCollapsible = typeof onToggleCollapse === "function";
  const { user } = useSelector((state) => state.auth);

  return (
    <aside
      className={`shrink-0 transition-all duration-300 ease-out ${collapsed ? "w-full lg:w-[52px]" : "w-full lg:w-60"}`}
    >
      <div className={`space-y-3 ${collapsed ? "lg:space-y-2" : ""}`}>
        {/* Profile card */}
        {!collapsed && (
          <div
            className={`bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center overflow-hidden transition-all duration-300 ${
              collapsed ? "px-2 py-3" : "px-5 py-6"
            }`}
          >
            {!collapsed && (
              <>
                <h3 className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                  {user?.companyName}
                </h3>
                <span className="mt-1.5 inline-block text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
                  {user?.accountNumber}
                </span>
              </>
            )}
          </div>
        )}

        {/* Nav links */}
        <nav
          className={`bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 ${
            collapsed ? "py-2 px-1.5" : "py-3"
          }`}
        >
          {SIDEBAR_LINKS.map(({ group, items }, idx) => (
            <div key={group}>
              {idx > 0 && (
                <hr
                  className={`border-slate-100 ${collapsed ? "my-1.5 mx-1" : "my-2 mx-4"}`}
                />
              )}
              {!collapsed && (
                <div className="px-4 pt-3 pb-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                    {group}
                  </p>
                </div>
              )}
              <ul
                className={`space-y-0.5 ${collapsed ? "flex flex-col items-center" : "px-2"}`}
              >
                {items.map(({ label, icon, href }) => (
                  <li key={label}>
                    <SidebarLink
                      href={href}
                      icon={icon}
                      label={label}
                      active={pathname === href}
                      collapsed={collapsed}
                      onClick={onNavigate}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        {isCollapsible && (
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex w-full items-center justify-center gap-2 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all duration-200 cursor-pointer ${
              collapsed ? "py-2" : "py-2.5"
            }`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronsRight className="w-3.5 h-3.5" />
            ) : (
              <>
                <ChevronsLeft className="w-3.5 h-3.5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
