import { BRANDS } from '@/constants/navigation'

const BrandBar = () => (
  <section className="bg-white border-y border-slate-100 py-4 md:py-6">
    <div className="max-w-[1400px] mx-auto px-4 md:px-8">
      <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-8 md:gap-16">
        {BRANDS.map((brand) => (
          <span
            key={brand}
            className="text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-widest cursor-pointer"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  </section>
)

export default BrandBar
