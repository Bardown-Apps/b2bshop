const CTABanner = ({ onAction }) => (
  <div className="mt-8 md:mt-12 bg-slate-950 text-white rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-4 md:gap-6">
    <div>
      <h3 className="text-lg sm:text-2xl font-black mb-1 md:mb-2">Ready to place a wholesale order?</h3>
      <p className="text-xs sm:text-base text-slate-400">Sign in to access pricing, manage orders, and view your account.</p>
    </div>
    <button
      onClick={onAction}
      className="shrink-0 w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all text-xs sm:text-sm uppercase tracking-wide shadow-lg shadow-red-900/40 cursor-pointer"
    >
      Sign In to B2B Portal
    </button>
  </div>
)

export default CTABanner
