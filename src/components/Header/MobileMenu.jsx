import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { NAV } from '@/constants/navigation'

const MobileNavItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false)
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)
  const hasChildren = item.children || item.items

  useEffect(() => {
    if (contentRef.current) {
      setHeight(expanded ? contentRef.current.scrollHeight : 0)
    }
  }, [expanded])

  if (!hasChildren) {
    return (
      <a href={item.href ?? '#'} className="block py-3 text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors">
        {item.label}
      </a>
    )
  }

  const subItems = item.children ? Object.entries(item.children) : item.items?.map((i) => [i, null]) ?? []

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-slate-800 hover:text-red-600 cursor-pointer transition-colors"
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
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
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{key}</p>
                {values.map((v) => (
                  <a key={v} href="#" className="block py-1.5 text-sm text-slate-600 hover:text-red-600 transition-colors">{v}</a>
                ))}
              </div>
            ) : (
              <a key={key} href="#" className="block py-1.5 text-sm text-slate-600 hover:text-red-600 transition-colors">{key}</a>
            )
          )}
        </div>
      </div>
    </div>
  )
}

const MobileMenu = ({ onSignIn }) => (
  <div className="md:hidden border-t border-slate-100 bg-white shadow-lg max-h-[80vh] overflow-y-auto animate-fade-up" style={{ animationDuration: '0.25s' }}>
    <nav className="px-4 py-2 divide-y divide-slate-100">
      {NAV.map((item) => (
        <MobileNavItem key={item.label} item={item} />
      ))}
      <div className="pt-4 pb-2">
        <button onClick={onSignIn} className="w-full py-3 bg-red-600 text-white font-bold rounded-lg text-sm cursor-pointer hover:bg-red-700 transition-colors">
          Sign In to B2B Portal
        </button>
      </div>
    </nav>
  </div>
)

export default MobileMenu
