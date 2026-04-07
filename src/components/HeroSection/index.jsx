import { HERO_STATS } from '@/constants/navigation'
import heroBg from '@/assets/hero-bg.png'

const HeroSection = ({ onSignIn }) => (
  <section className="relative bg-slate-950 text-white overflow-hidden min-h-[360px] sm:min-h-[420px] md:min-h-[520px] flex items-center">
    <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover object-[center_40%]" />
    <div className="absolute inset-0 bg-slate-950/70" />
    <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />

    <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">
      <div className="flex-1 text-center md:text-left">
        <div className="inline-block bg-red-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-4 md:mb-6">
          5-Day Freestyle Sublimation
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3 md:mb-4 leading-none">
          More Flex.<br />
          <span className="text-red-500">Less Wait.</span>
        </h1>
        <p className="text-sm sm:text-lg text-slate-300 mb-2 md:mb-3">
          <strong className="text-white">MORE</strong> styles.{' '}
          <strong className="text-white">MORE</strong> designs.{' '}
          <strong className="text-white">MORE</strong> choice.
        </p>
        <p className="text-xs sm:text-base text-slate-400 mb-6 md:mb-8">
          Your custom sublimation unleashed in just 5 days.
        </p>
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <button
            onClick={onSignIn}
            className="px-6 sm:px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-900/40 transition-all hover:-translate-y-0.5 text-xs sm:text-sm uppercase tracking-wide cursor-pointer"
          >
            Sign In to Order
          </button>
          <a
            href="#categories"
            className="px-6 sm:px-8 py-3 border border-white/30 text-white hover:bg-white/10 font-semibold rounded-lg transition-all text-xs sm:text-sm uppercase tracking-wide"
          >
            Browse Catalogue
          </a>
        </div>
      </div>

      <div className="flex flex-row md:flex-col gap-3 md:gap-4 shrink-0">
        {HERO_STATS.map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-center backdrop-blur-sm flex-1 md:flex-none">
            <p className="text-xl sm:text-3xl font-black text-red-400">{s.num}</p>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default HeroSection
