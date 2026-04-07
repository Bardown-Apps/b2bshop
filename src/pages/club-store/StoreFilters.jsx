import { useState } from 'react'
import { SlidersHorizontal, Plus, Minus } from 'lucide-react'
import { FILTER_OPTIONS } from '@/constants/clubStore'

const FilterGroup = ({ label, options }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-slate-200 py-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-sm font-semibold text-slate-800 cursor-pointer">
        {label}
        {open ? <Minus className="w-4 h-4 text-slate-400" /> : <Plus className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="mt-3 space-y-2 pl-1">
          {label === 'Price Range' ? (
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min" className="w-full px-2 py-1 border border-slate-300 rounded text-sm outline-none focus:ring-1 focus:ring-slate-400" />
              <span className="text-slate-400">–</span>
              <input type="number" placeholder="Max" className="w-full px-2 py-1 border border-slate-300 rounded text-sm outline-none focus:ring-1 focus:ring-slate-400" />
            </div>
          ) : (
            options?.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 accent-slate-900" />
                {item}
              </label>
            ))
          )}
        </div>
      )}
    </div>
  )
}

const FILTERS = ['Clubs', 'Size', 'Color', 'Price Range']

const StoreFilters = () => (
  <aside className="w-44 shrink-0 hidden md:block">
    <div className="flex items-center gap-2 mb-3">
      <SlidersHorizontal className="w-4 h-4 text-slate-500" />
      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Filters</span>
    </div>
    {FILTERS.map((label) => (
      <FilterGroup key={label} label={label} options={FILTER_OPTIONS[label]} />
    ))}
  </aside>
)

export default StoreFilters
