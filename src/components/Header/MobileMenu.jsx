import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { NAV } from '@/constants/navigation'

const MobileNavItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = item.children || item.items

  if (!hasChildren) {
    return (
      <a href={item.href ?? '#'} className="block py-3 text-sm font-semibold text-slate-800 hover:text-red-600">
        {item.label}
      </a>
    )
  }

  const subItems = item.children ? Object.entries(item.children) : item.items?.map((i) => [i, null]) ?? []

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-slate-800 hover:text-red-600 cursor-pointer"
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="pl-4 pb-2 space-y-1">
          {subItems.map(([key, values]) =>
            values ? (
              <div key={key} className="mb-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{key}</p>
                {values.map((v) => (
                  <a key={v} href="#" className="block py-1.5 text-sm text-slate-600 hover:text-red-600">{v}</a>
                ))}
              </div>
            ) : (
              <a key={key} href="#" className="block py-1.5 text-sm text-slate-600 hover:text-red-600">{key}</a>
            )
          )}
        </div>
      )}
    </div>
  )
}

const MobileMenu = ({ onSignIn }) => (
  <div className="md:hidden border-t border-slate-100 bg-white shadow-lg max-h-[80vh] overflow-y-auto">
    <nav className="px-4 py-2 divide-y divide-slate-100">
      {NAV.map((item) => (
        <MobileNavItem key={item.label} item={item} />
      ))}
      <div className="pt-4 pb-2">
        <button onClick={onSignIn} className="w-full py-3 bg-red-600 text-white font-bold rounded-lg text-sm cursor-pointer">
          Sign In to B2B Portal
        </button>
      </div>
    </nav>
  </div>
)

export default MobileMenu
