const ProductCard = ({ product, onClick, className = '', style }) => (
  <button
    onClick={onClick}
    style={style}
    className={`group text-left border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-red-200 transition-all duration-300 cursor-pointer hover:-translate-y-1 ${className}`}
  >
    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
      <span className="text-slate-300 text-xs font-bold uppercase tracking-wider group-hover:scale-110 transition-transform duration-500">
        Photo
      </span>
      {product.tag && (
        <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {product.tag}
        </span>
      )}
    </div>
    <div className="p-4">
      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-1.5 group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
        {product.name}
      </p>
      <p className="text-[10px] text-slate-500">{product.sku}</p>
      <p className="text-sm font-black text-slate-900 mt-2">{product.price}</p>
    </div>
  </button>
)

export default ProductCard
