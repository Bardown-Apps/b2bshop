import { BRANDS } from '@/constants/navigation'

const doubled = [...BRANDS, ...BRANDS]

const BrandBar = () => (
  <section className="bg-slate-50 border-y border-slate-100 py-5 md:py-7 overflow-hidden">
    <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
      {doubled.map((brand, i) => (
        <span
          key={`${brand.name}-${i}`}
          className="mx-6 sm:mx-10 md:mx-16 inline-flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-red-600 transition-colors duration-300 uppercase tracking-[0.2em] cursor-pointer shrink-0 select-none"
        >
          <img
            src={brand.logo}
            alt=""
            className="h-6 w-6 sm:h-7 sm:w-7 object-contain opacity-90"
            loading="lazy"
          />
          {brand.name}
        </span>
      ))}
    </div>
  </section>
)

export default BrandBar
