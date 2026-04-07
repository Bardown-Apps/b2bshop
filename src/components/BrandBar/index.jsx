import { BRANDS } from '@/constants/navigation'

const doubled = [...BRANDS, ...BRANDS]

const BrandBar = () => (
  <section className="bg-slate-50 border-y border-slate-100 py-5 md:py-7 overflow-hidden">
    <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
      {doubled.map((brand, i) => (
        <span
          key={`${brand}-${i}`}
          className="mx-6 sm:mx-10 md:mx-16 text-xs sm:text-sm font-bold text-slate-500 hover:text-red-600 transition-colors duration-300 uppercase tracking-[0.2em] cursor-pointer shrink-0 select-none"
        >
          {brand}
        </span>
      ))}
    </div>
  </section>
)

export default BrandBar
