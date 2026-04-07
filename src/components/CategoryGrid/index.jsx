import { CATEGORIES } from '@/constants/navigation'
import SectionHeader from '@/components/SectionHeader'
import useInView from '@/hooks/useInView'

const CategoryGrid = ({ onAction }) => {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <section id="categories" className="py-14 md:py-24 bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <SectionHeader
          title="Shop by Category"
          subtitle="Browse our full wholesale collection"
          actionLabel="View All"
          onAction={onAction}
        />
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              onClick={onAction}
              className={`bg-gradient-to-br ${cat.bg} text-white rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 group cursor-pointer ${
                inView ? 'animate-pop-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <p className="text-sm sm:text-base font-black uppercase tracking-wide mb-1.5">{cat.name}</p>
              <p className="text-[11px] sm:text-xs text-white/60 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                {cat.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
