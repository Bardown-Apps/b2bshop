import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import routes from '@/constants/routes'
import AnnouncementBar from '@/components/AnnouncementBar'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import BrandBar from '@/components/BrandBar'
import CategoryGrid from '@/components/CategoryGrid'
import QuickLinks from '@/components/QuickLinks'
import TrendingSection from '@/components/TrendingSection'
import Footer from '@/components/Footer'
import LoginDialog from '@/components/LoginDialog'

const Home = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [loginOpen, setLoginOpen] = useState(false)

  const openLogin = () => setLoginOpen(true)

  const handleLoginSuccess = (data) => {
    dispatch(login(data))
    setLoginOpen(false)
    navigate(routes.dashboard)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <AnnouncementBar />
      <Header onSignIn={openLogin} />
      <HeroSection onSignIn={openLogin} />
      <BrandBar />
      <CategoryGrid onAction={openLogin} />
      <QuickLinks onAction={openLogin} />
      <TrendingSection onAction={openLogin} />
      <Footer />
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={handleLoginSuccess} />
    </div>
  )
}

export default Home
