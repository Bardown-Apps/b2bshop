import { useState } from 'react'
import { Search, ShoppingCart } from 'lucide-react'
import { CATEGORIES, PRODUCTS } from '@/constants/clubStore'
import StoreFilters from './StoreFilters'
import StoreProductCard from './StoreProductCard'

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-5">Buy Your Gear</h2>

      <div className="flex items-center gap-2 flex-wrap mb-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${
              activeCategory === cat
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <StoreFilters />
        <div className="flex-1 min-w-0">
          <div className="flex items-center border border-slate-300 rounded-lg bg-white px-3 py-2 mb-5 focus-within:ring-2 focus-within:ring-slate-300 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
              <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No products match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <StoreProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductGrid
