const AnnouncementBar = () => (
  <div className="bg-black text-white text-center py-2 px-4 text-[10px] sm:text-xs font-semibold tracking-widest uppercase relative">
    <span>Free Shipping on Orders Over $300&nbsp;|&nbsp;</span>
    <a href="#" className="underline hover:text-slate-300">Learn More</a>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-3">
      <a href="#" className="text-white/70 hover:text-white text-xs">Facebook</a>
      <a href="#" className="text-white/70 hover:text-white text-xs">Instagram</a>
      <a href="#" className="text-white/70 hover:text-white text-xs">X</a>
    </div>
  </div>
)

export default AnnouncementBar
