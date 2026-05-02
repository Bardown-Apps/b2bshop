import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Phone, Save } from "lucide-react";
import FieldError from "@/components/FieldError";

const ContactForm = ({ initialEmail = "", initialPhone = "" }) => {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: initialEmail, phone: initialPhone },
  });

  const onSubmit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Email
        </label>
        <div
          className={`flex items-center border rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-red-300 transition-all duration-200 ${
            errors.email ? "border-red-400" : "border-slate-200"
          }`}
        >
          <Mail className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="bg-transparent outline-none text-sm text-slate-900 w-full"
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Phone
        </label>
        <div
          className={`flex items-center border rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-red-300 transition-all duration-200 ${
            errors.phone ? "border-red-400" : "border-slate-200"
          }`}
        >
          <Phone className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          <input
            type="tel"
            {...register("phone", { required: "Phone is required" })}
            className="bg-transparent outline-none text-sm text-slate-900 w-full"
          />
        </div>
        <FieldError message={errors.phone?.message} />
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
      >
        <Save className="w-4 h-4" />
        {saved ? "Saved!" : "Update Contact Info"}
      </button>
    </form>
  );
};

export default ContactForm;
