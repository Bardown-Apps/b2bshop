import { Controller } from "react-hook-form";

const Select = ({
  control,
  name,
  label,
  options = [],
  placeholder = "Select",
  rules,
  required,
}) => {
  return (
    <div className="w-full">
      {label ? (
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <Controller
        control={control}
        name={name}
        rules={required ? { required: "Field is required", ...rules } : rules}
        render={({ field }) => (
          <select
            {...field}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/20"
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={`${option?.value}`} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
};

export default Select;
