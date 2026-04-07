const FormField = ({ label, value, name, onChange, type = 'text', readOnly = false }) => (
  <div className="space-y-1">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange?.(name, e.target.value)}
      className={`w-full px-3 py-2 border rounded text-sm text-slate-800 outline-none transition-all ${
        readOnly
          ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-default'
          : 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400'
      }`}
    />
  </div>
)

export default FormField
