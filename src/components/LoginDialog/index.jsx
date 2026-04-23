import { useState } from "react";
import { useForm } from "react-hook-form";
import Dialog from "@/components/Dialog";
import FieldError from "@/components/FieldError";
import { login } from "@/services/authService";

const LoginDialog = ({ open, onClose, onSuccess }) => {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    setError("");
    try {
      const data = await login(values);
      onSuccess(data);
      reset();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <span className="flex w-full justify-center">
          <img
            src="https://www.gobardown.com/cdn/shop/files/bardown_BD_logo_160x.png?v=1682392618"
            alt="BD/BARDOWN"
            className="h-8 w-auto object-contain"
            loading="lazy"
          />
        </span>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="adrenalin@test.com"
            {...register("email", { required: "Email is required" })}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all duration-200 ${
              errors.email ? "border-red-400" : "border-slate-200"
            }`}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="password"
            {...register("password", { required: "Password is required" })}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all duration-200 ${
              errors.password ? "border-red-400" : "border-slate-200"
            }`}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <FieldError message={error} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-lg text-sm uppercase tracking-wide transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
