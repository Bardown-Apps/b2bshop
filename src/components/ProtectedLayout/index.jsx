import { useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import routes from '@/constants/routes'
import { LogOut, Search, User, Menu, X } from 'lucide-react'
import AnnouncementBar from '@/components/AnnouncementBar'
import ProtectedNav from './ProtectedNav'
import DashboardSidebar from '@/components/DashboardSidebar'
import Footer from '@/components/Footer'

const ProtectedLayout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate(routes.home)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <AnnouncementBar />

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center w-60 bg-slate-100 border border-slate-200 rounded-md px-3 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 w-full" />
          </div>

          <button className="lg:hidden p-2 text-slate-600 cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex-1 flex justify-center">
            <a href="/" className="text-2xl font-bold tracking-tight text-slate-900 hover:text-red-600 transition-colors">
              B2BShop
            </a>
          </div>

          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-600 hidden sm:block" />
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
        <ProtectedNav />
      </header>

      <div className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col lg:flex-row gap-6 md:gap-8">
          {sidebarOpen && (
            <div className="lg:hidden">
              <DashboardSidebar />
            </div>
          )}
          <div className="hidden lg:block">
            <DashboardSidebar />
          </div>
          <main className="flex-1 min-w-0"><Outlet /></main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProtectedLayout
