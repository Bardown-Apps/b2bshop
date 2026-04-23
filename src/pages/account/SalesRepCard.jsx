import { User, Mail, Phone } from "lucide-react";
import { PROFILE } from "@/constants/dashboard";
import { useSelector } from "react-redux";

const SalesRepCard = () => {
  const { user } = useSelector((state) => state.auth);
  const salesReps = user?.salesReps;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <User className="w-4 h-4 text-slate-500" />
        </div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Your Sales Representative
        </h2>
      </div>
      {salesReps?.map((s) => (
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <span className="font-bold text-slate-900">{s.name}</span>
          <a
            href={`mailto:${s.email}`}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" /> {s.email}
          </a>
          <span className="text-slate-600 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> {s.phoneNumber}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SalesRepCard;
