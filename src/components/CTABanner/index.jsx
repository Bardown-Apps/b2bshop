import useInView from '@/hooks/useInView'

const CTABanner = ({ onAction }) => {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <div
      ref={ref}
      className={`mt-10 md:mt-16 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl md:rounded-3xl p-8 sm:p-10 md:p-14 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-6 md:gap-8 ${
        inView ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      <div>
        <h3 className="text-xl sm:text-3xl font-black mb-2 md:mb-3 leading-tight">
          Ready to place a wholesale order?
        </h3>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Sign in to access pricing, manage orders, and view your account.
        </p>
      </div>
      <button
        onClick={onAction}
        className="shrink-0 w-full sm:w-auto px-10 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 text-xs sm:text-sm uppercase tracking-wide shadow-lg shadow-red-900/40 hover:shadow-xl hover:shadow-red-900/50 hover:-translate-y-0.5 cursor-pointer"
      >
        Sign In to B2B Portal
      </button>
    </div>
  )
}

export default CTABanner
