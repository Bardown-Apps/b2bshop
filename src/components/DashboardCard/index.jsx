const DashboardCard = ({ children, className = '' }) => (
  <section className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </section>
)

export default DashboardCard
