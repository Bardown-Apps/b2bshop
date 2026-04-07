const InfoLabel = ({ icon: Icon, children }) => (
  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </h3>
)

export default InfoLabel
