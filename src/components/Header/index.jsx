import { useState } from 'react'
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react'
import NavBar from '@/components/Header/NavBar'
import MobileMenu from '@/components/Header/MobileMenu'

const Header = ({ onSignIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <div className="hidden md:flex items-center w-60 bg-slate-100 border border-slate-200 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-red-300 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 w-full"
          />
        </div>

        <button className="md:hidden p-2 text-slate-600 cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex-1 flex justify-center">
          <a href="/" className="group">
            <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
              B2BShop
            </span>
          </a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onSignIn}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span className="hidden md:inline">Sign In</span>
          </button>
          <button className="relative p-2 text-slate-600 hover:text-red-600 transition-colors cursor-pointer">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>

      <NavBar />
      {mobileMenuOpen && <MobileMenu onSignIn={onSignIn} />}
    </header>
  )
}

export default Header
