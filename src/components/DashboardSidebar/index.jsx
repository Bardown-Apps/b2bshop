import { NavLink, useLocation } from "react-router-dom";
import { Building2 } from "lucide-react";
import { PROFILE, SIDEBAR_LINKS } from "@/constants/dashboard";

const SidebarLink = ({ href, icon: Icon, label, active }) => {
  const baseClasses =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150";
  const activeClasses = "bg-slate-900 text-white shadow-sm";
  const inactiveClasses =
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  if (href === "#") {
    return (
      <span
        className={`${baseClasses} ${inactiveClasses} cursor-default opacity-50`}
      >
        <Icon className="w-[18px] h-[18px]" />
        {label}
      </span>
    );
  }

  return (
    <NavLink
      to={href}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      <Icon className="w-[18px] h-[18px]" />
      {label}
    </NavLink>
  );
};

const DashboardSidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="w-full lg:w-60 shrink-0 space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-6 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
          <Building2 className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">
          {PROFILE.companyName}
        </h3>
        <span className="mt-1 inline-block text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5">
          {PROFILE.accountNumber}
        </span>
      </div>

      <nav className="bg-white rounded-2xl border border-slate-200 shadow-sm py-3">
        {SIDEBAR_LINKS.map(({ group, items }, idx) => (
          <div key={group}>
            {idx > 0 && <hr className="border-slate-100 my-2 mx-4" />}
            <div className="px-4 pt-2 pb-4">
              <p className="text-[14px] font-semibold text-slate-400 uppercase tracking-widest">
                {group}
              </p>
            </div>
            <ul className="px-2 space-y-0.5">
              {items.map(({ label, icon, href }) => (
                <li key={label}>
                  <SidebarLink
                    href={href}
                    icon={icon}
                    label={label}
                    active={pathname === href}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
