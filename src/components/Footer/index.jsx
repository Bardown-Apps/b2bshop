import { FOOTER_LINKS } from '@/constants/navigation'

const Footer = () => (
  <footer className="bg-slate-950 text-white">
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <h4 className="text-lg font-bold tracking-tight mb-3 md:mb-4">B2BShop</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your trusted B2B wholesale partner for premium sportswear and athletic apparel.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h5 className="text-sm font-bold uppercase tracking-wider mb-3 md:mb-4">{title}</h5>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} B2BShop. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
