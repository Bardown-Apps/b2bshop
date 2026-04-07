const ProductCard = ({ product, onClick }) => (
  <button
    onClick={onClick}
    className="group text-left border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-red-200 transition-all duration-200 cursor-pointer"
  >
    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
      <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">Photo</span>
      {product.tag && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {product.tag}
        </span>
      )}
    </div>
    <div className="p-3">
      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-0.5">{product.brand}</p>
      <p className="text-xs font-bold text-slate-900 leading-tight mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
        {product.name}
      </p>
      <p className="text-[10px] text-slate-400">{product.sku}</p>
      <p className="text-sm font-black text-slate-900 mt-1">{product.price}</p>
    </div>
  </button>
)

export default ProductCard
