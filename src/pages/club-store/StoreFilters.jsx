import { useRef, useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react'
import { useSelector } from 'react-redux'
import { getFilterOptions } from '@/constants/clubStore'

const CheckboxFilterGroup = ({ label, options, selected, onChange, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0)
    }
  }, [open, selected])

  const toggle = (item) => {
    const next = selected.includes(item)
      ? selected.filter((s) => s !== item)
      : [...selected, item]
    onChange(label, next)
  }

  const count = selected.length

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-slate-800 cursor-pointer group transition-colors hover:text-slate-950"
      >
        <span className="flex items-center gap-2">
          {label}
          {count > 0 && (
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 group-hover:text-slate-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-250 ease-out"
        style={{ maxHeight: `${height}px`, opacity: open ? 1 : 0 }}
      >
        <div ref={contentRef} className="pb-4 space-y-1">
          {options?.map((item) => {
            const isChecked = selected.includes(item)
            return (
              <label
                key={item}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors duration-150 ${
                  isChecked
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(item)}
                  className="w-3.5 h-3.5 rounded border-slate-300 accent-slate-900 cursor-pointer"
                />
                {item}
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const PriceFilterGroup = ({ priceMin, priceMax, onChange }) => {
  const [open, setOpen] = useState(false)
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0)
    }
  }, [open])

  const hasValue = priceMin || priceMax

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-slate-800 cursor-pointer group transition-colors hover:text-slate-950"
      >
        <span className="flex items-center gap-2">
          Price Range
          {hasValue && (
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
              !
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 group-hover:text-slate-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-250 ease-out"
        style={{ maxHeight: `${height}px`, opacity: open ? 1 : 0 }}
      >
        <div ref={contentRef} className="pb-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-slate-500 uppercase mb-1">Min</label>
              <input
                type="number"
                placeholder="$0"
                value={priceMin}
                onChange={(e) => onChange('priceMin', e.target.value)}
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all"
              />
            </div>
            <span className="text-slate-300 mt-4">–</span>
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-slate-500 uppercase mb-1">Max</label>
              <input
                type="number"
                placeholder="$500"
                value={priceMax}
                onChange={(e) => onChange('priceMax', e.target.value)}
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all"
              />
            </div>
          </div>
          {hasValue && (
            <button
              onClick={() => { onChange('priceMin', ''); onChange('priceMax', '') }}
              className="w-full py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Clear Price
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const CHECKBOX_FILTERS = [
  { label: 'Clubs', defaultOpen: true },
  { label: 'Size', defaultOpen: false },
  { label: 'Color', defaultOpen: false },
]

const StoreFilters = ({ filters, onChange, onReset, activeCount }) => {
  const clubs = useSelector((state) => state.clubs.list)
  const filterOptions = useMemo(() => getFilterOptions(clubs), [clubs])

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-[11px] font-medium text-slate-500 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        <div className="px-4">
          {CHECKBOX_FILTERS.map(({ label, defaultOpen }) => (
            <CheckboxFilterGroup
              key={label}
              label={label}
              options={filterOptions[label]}
              selected={filters[label]}
              onChange={onChange}
              defaultOpen={defaultOpen}
            />
          ))}
          <PriceFilterGroup
            priceMin={filters.priceMin}
            priceMax={filters.priceMax}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}

export default StoreFilters
