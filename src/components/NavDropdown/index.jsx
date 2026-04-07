import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const NavDropdown = ({ label, children, items }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="static" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className="flex items-center gap-1 text-sm font-semibold tracking-wide text-slate-800 hover:text-red-600 transition-colors py-4 px-1 border-b-2 border-transparent hover:border-red-600 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 bg-white border-t border-slate-100 shadow-xl">
          <div className="max-w-[1400px] mx-auto px-8 py-6">
            {children ? (
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-8">
                {Object.entries(children).map(([group, subitems]) => (
                  <div key={group}>
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">{group}</p>
                    <ul className="space-y-2">
                      {subitems.map((item) => (
                        <li key={item}>
                          <a href="#" className="text-sm text-slate-500 hover:text-red-600 transition-colors">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-x-10 gap-y-2">
                {items?.map((item) => (
                  <a key={item} href="#" className="text-sm text-slate-500 hover:text-red-600 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NavDropdown
