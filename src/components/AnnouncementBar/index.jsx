import { useEffect, useState } from 'react'

const messages = [
  'Free Shipping on Orders Over $300',
  'New Season Drop — Shop the Latest Arrivals',
  '5-Day Custom Sublimation — Order Now',
]

const AnnouncementBar = () => {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % messages.length)
        setVisible(true)
      }, 400)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white text-center py-2.5 px-4 text-[10px] sm:text-xs font-semibold tracking-widest uppercase relative overflow-hidden">
      <span
        className={`inline-block transition-all duration-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
      >
        {messages[idx]}&nbsp;|&nbsp;
        <a href="#" className="underline hover:text-red-400 transition-colors">
          Learn More
        </a>
      </span>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-4">
        {['Facebook', 'Instagram', 'X'].map((s) => (
          <a key={s} href="#" className="text-white/50 hover:text-white text-xs transition-colors duration-200">
            {s}
          </a>
        ))}
      </div>
    </div>
  )
}

export default AnnouncementBar
