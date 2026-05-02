import { useSelector } from "react-redux";
import { Wallet } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import InfoLabel from "@/components/InfoLabel";

const StatusSection = () => {
  const { user } = useSelector((state) => state.auth);
  const creditAvailable = user?.creditAmount;
  const paymentTerms = user?.paymentTerms || "NA";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DashboardCard className="p-6 md:p-8 flex flex-col justify-center items-center text-center">
        <InfoLabel icon={Wallet}>Credit Available</InfoLabel>
        <div className="px-6 py-2.5 bg-amber-100/80 text-amber-800 border border-amber-200/50 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm">
          ${Number(creditAvailable)?.toFixed(2)} CAD
        </div>
      </DashboardCard>

      <DashboardCard className="p-6 md:p-8 flex flex-col justify-center items-center text-center">
        <InfoLabel icon={Wallet}>Payment Terms</InfoLabel>
        <p className="text-xl font-bold text-slate-900">{paymentTerms}</p>
      </DashboardCard>
    </div>
  );
};

export default StatusSection;
