const OrderActions = () => (
  <div className="flex flex-col gap-2 p-4 md:p-5 justify-center bg-slate-50/50 min-w-40">
    <button className="px-4 py-2.5 border border-slate-200 text-xs font-bold uppercase text-slate-700 rounded-lg hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 text-center cursor-pointer">
      Reorder
    </button>
    <button className="px-4 py-2.5 border border-slate-200 text-xs font-bold uppercase text-slate-700 rounded-lg hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 text-center cursor-pointer">
      Track Order
    </button>
    <button className="px-4 py-2.5 bg-slate-900 text-xs font-bold uppercase text-white rounded-lg hover:bg-slate-800 transition-colors text-center cursor-pointer">
      Order Details
    </button>
    <div className="flex flex-col gap-1.5 pt-1">
      <button className="text-xs text-slate-500 hover:text-red-600 text-left cursor-pointer transition-colors">SUBMIT SUPPORT TICKET ↗</button>
      <button className="text-xs text-slate-500 hover:text-red-600 text-left cursor-pointer transition-colors">CHAT WITH CUSTOMER SERVICE ↗</button>
    </div>
  </div>
)

export default OrderActions
