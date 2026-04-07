import { QUICK_LINKS } from '@/constants/navigation'

const QuickLinks = ({ onAction }) => (
  <section className="py-6 md:py-10 bg-white border-y border-slate-100">
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-wrap gap-2 sm:gap-4 justify-center">
      {QUICK_LINKS.map((label) => (
        <button
          key={label}
          onClick={onAction}
          className="px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-full text-xs sm:text-sm hover:border-red-600 hover:text-red-600 transition-all cursor-pointer"
        >
          {label}
        </button>
      ))}
    </div>
  </section>
)

export default QuickLinks
