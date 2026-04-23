import { Building2, Shield } from "lucide-react";
import { useSelector } from "react-redux";

const AccountSummary = () => {
  const { user } = useSelector((state) => state.auth);
  const cards = [
    {
      label: "Account Number",
      value: user?.accountNumber || "-",
      icon: Building2,
      bg: "bg-blue-50",
      color: "text-blue-500",
    },
    {
      label: "Role",
      value: user?.role || "-",
      icon: Shield,
      bg: "bg-amber-50",
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, bg, color }) => (
        <div
          key={label}
          className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
        >
          <div
            className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center mb-3`}
          >
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-base font-bold text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default AccountSummary;
