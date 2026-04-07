const OrderActions = () => (
  <div className="flex flex-col gap-2 p-4 justify-center bg-slate-50/50 min-w-40">
    <button className="px-4 py-2 border border-slate-300 text-xs font-bold uppercase text-slate-700 rounded hover:bg-slate-100 transition-colors text-center cursor-pointer">
      Reorder
    </button>
    <button className="px-4 py-2 border border-slate-300 text-xs font-bold uppercase text-slate-700 rounded hover:bg-slate-100 transition-colors text-center cursor-pointer">
      Track Order
    </button>
    <button className="px-4 py-2 bg-blue-600 text-xs font-bold uppercase text-white rounded hover:bg-blue-700 transition-colors text-center cursor-pointer">
      Order Details
    </button>
    <div className="flex flex-col gap-1 pt-1">
      <button className="text-xs text-slate-500 hover:text-blue-600 text-left cursor-pointer">SUBMIT SUPPORT TICKET ↗</button>
      <button className="text-xs text-slate-500 hover:text-blue-600 text-left cursor-pointer">CHAT WITH CUSTOMER SERVICE ↗</button>
    </div>
  </div>
)

export default OrderActions
