import { ShoppingCart } from 'lucide-react'

const StoreProductCard = ({ product }) => (
  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-all group">
    <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
      <ShoppingCart className="w-10 h-10 text-slate-300" />
      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide cursor-pointer">
          Quick Add
        </button>
      </div>
    </div>
    <div className="p-3">
      <p className="text-[11px] text-slate-400 font-medium mb-0.5">{product.club}</p>
      <p className="text-sm font-bold text-slate-900 leading-snug mb-1 group-hover:text-red-600 transition-colors">
        {product.name}
      </p>
      <p className="text-[11px] text-slate-500 mb-1">{product.color}</p>
      <p className="text-sm font-black text-slate-900">{product.price}</p>
    </div>
  </div>
)

export default StoreProductCard
