import { Controller } from "react-hook-form";

const Input = ({
  control,
  name,
  rules,
  required,
  className = "",
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={required ? { required: "Field is required", ...rules } : rules}
      render={({ field }) => (
        <input
          {...field}
          {...props}
          className={`block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/20 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 ${className}`}
        />
      )}
    />
  );
};

export default Input;
