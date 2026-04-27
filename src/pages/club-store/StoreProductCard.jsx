import { useNavigate } from "react-router-dom";

const StoreProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-lg hover:border-slate-300 transition-all duration-300 group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/product/${product.id}`);
        }
      }}
    >
    <div className="aspect-square bg-slate-100 relative overflow-hidden cursor-pointer">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button className="bg-white text-slate-900 text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-wide cursor-pointer shadow-lg hover:bg-slate-900 hover:text-white transition-colors duration-200">
          Quick Add
        </button>
      </div> */}
    </div>
    <div className="p-4">
      <p className="text-[11px] text-slate-500 font-medium mb-0.5">
        {product.club}
      </p>
      <p className="text-sm font-bold text-slate-900 leading-snug mb-1 group-hover:text-red-600 transition-colors duration-200">
        {product.name}
      </p>
      <p className="text-[11px] text-slate-500 mb-1.5">{product.color}</p>
      <p className="text-sm font-black text-slate-900">{product.price}</p>
    </div>
    </div>
  );
};

export default StoreProductCard;
