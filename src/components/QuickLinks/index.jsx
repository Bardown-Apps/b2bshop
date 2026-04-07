import { QUICK_LINKS } from '@/constants/navigation'
import useInView from '@/hooks/useInView'

const QuickLinks = ({ onAction }) => {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <section className="py-10 md:py-14 bg-white border-y border-slate-100">
      <div ref={ref} className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-wrap gap-3 sm:gap-4 justify-center">
        {QUICK_LINKS.map((label, i) => (
          <button
            key={label}
            onClick={onAction}
            className={`px-5 sm:px-7 py-2.5 sm:py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-full text-xs sm:text-sm hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 cursor-pointer hover:shadow-sm ${
              inView ? 'animate-scale-in' : 'opacity-0'
            }`}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}

export default QuickLinks
