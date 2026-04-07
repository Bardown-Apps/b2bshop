import { CATEGORIES } from '@/constants/navigation'
import SectionHeader from '@/components/SectionHeader'

const CategoryGrid = ({ onAction }) => (
  <section id="categories" className="py-10 md:py-16 bg-slate-50">
    <div className="max-w-[1400px] mx-auto px-4 md:px-8">
      <SectionHeader
        title="Shop by Category"
        subtitle="Browse our full wholesale collection"
        actionLabel="View All"
        onAction={onAction}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={onAction}
            className={`bg-gradient-to-br ${cat.bg} text-white rounded-xl p-4 sm:p-5 text-left hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer`}
          >
            <p className="text-xs sm:text-sm font-black uppercase tracking-wide mb-1">{cat.name}</p>
            <p className="text-[10px] sm:text-xs text-white/60 group-hover:text-white/80 transition-colors">{cat.desc}</p>
          </button>
        ))}
      </div>
    </div>
  </section>
)

export default CategoryGrid
