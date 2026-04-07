import { useFormContext } from 'react-hook-form'
import FieldError from '@/components/FieldError'

const FormField = ({ label, name, type = 'text', readOnly = false, rules }) => {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        readOnly={readOnly}
        {...register(name, readOnly ? undefined : rules)}
        className={`w-full px-3 py-2 border rounded text-sm text-slate-800 outline-none transition-all duration-200 ${
          readOnly
            ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-default'
            : errors[name]
              ? 'bg-white border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400'
              : 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400'
        }`}
      />
      <FieldError message={errors[name]?.message} />
    </div>
  )
}

export default FormField
