import { ChevronRight } from 'lucide-react'
import useInView from '@/hooks/useInView'

const SectionHeader = ({ title, subtitle, actionLabel, onAction }) => {
  const [ref, inView] = useInView({ threshold: 0.3 })

  return (
    <div
      ref={ref}
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 md:mb-10 ${
        inView ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-500 text-sm sm:text-base mt-1.5 leading-relaxed">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="text-sm text-red-600 font-semibold hover:text-red-700 flex items-center gap-1 cursor-pointer shrink-0 group transition-colors"
        >
          {actionLabel}
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  )
}

export default SectionHeader
