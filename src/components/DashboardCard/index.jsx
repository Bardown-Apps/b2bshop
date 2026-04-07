const DashboardCard = ({ children, className = "" }) => (
  <section
    className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}
  >
    {children}
  </section>
);

export default DashboardCard;
