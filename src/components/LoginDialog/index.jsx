import { useState } from "react";
import { useForm } from "react-hook-form";
import Dialog from "@/components/Dialog";
import FieldError from "@/components/FieldError";
import { fakeLogin } from "@/services/authService";

const LoginDialog = ({ open, onClose, onSuccess }) => {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "adrenalin@test.com", password: "password" },
  });

  const onSubmit = async (values) => {
    setError("");
    try {
      const data = await fakeLogin(values);
      onSuccess(data);
      reset();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Sign In to BD/BARDOWN">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FieldError message={error} />
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-lg text-sm uppercase tracking-wide transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
