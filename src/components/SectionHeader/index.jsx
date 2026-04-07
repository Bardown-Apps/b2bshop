import { ChevronRight } from 'lucide-react'

const SectionHeader = ({ title, subtitle, actionLabel, onAction }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 md:mb-8">
    <div>
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
      {subtitle && <p className="text-slate-500 text-xs sm:text-sm mt-1">{subtitle}</p>}
    </div>
    {actionLabel && (
      <button
        onClick={onAction}
        className="text-sm text-red-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
      >
        {actionLabel} <ChevronRight className="w-4 h-4" />
      </button>
    )}
  </div>
)

export default SectionHeader
