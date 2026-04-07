import NavDropdown from '@/components/NavDropdown'
import { NAV } from '@/constants/navigation'

const NavBar = () => (
  <div className="hidden md:block border-t border-slate-100 relative">
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center gap-6">
      {NAV.map((item) =>
        item.children || item.items ? (
          <NavDropdown key={item.label} label={item.label} children={item.children} items={item.items} />
        ) : (
          <a
            key={item.label}
            href={item.href}
            className={`text-sm font-semibold tracking-wide py-4 px-1 border-b-2 border-transparent hover:border-red-600 whitespace-nowrap transition-colors ${
              item.label === 'NEW' ? 'text-red-600 border-red-600' : 'text-slate-700 hover:text-red-600'
            }`}
          >
            {item.label}
          </a>
        )
      )}
    </div>
  </div>
)

export default NavBar
