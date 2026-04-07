import { useLocation } from 'react-router-dom'
import { DASHBOARD_NAV } from '@/constants/dashboard'

const ProtectedNav = () => {
  const { pathname } = useLocation()

  return (
    <nav className="border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center gap-1 overflow-x-auto">
        {DASHBOARD_NAV.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              pathname === href
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default ProtectedNav
