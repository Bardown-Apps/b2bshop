import { useSelector } from "react-redux";
import { MapPin } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import InfoLabel from "@/components/InfoLabel";
import ContactForm from "@/components/ContactForm";

const AddressSection = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <DashboardCard>
      <div className="p-6 md:p-8 border-b border-slate-100">
        <InfoLabel icon={MapPin}>Address &amp; Contact Info</InfoLabel>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        <div className="p-6 md:p-8 bg-slate-50/30">
          <div className="space-y-1 text-sm text-slate-600 leading-relaxed">
            <p className="font-bold text-base text-slate-900 mb-3">
              {user.companyName}
            </p>
            <p>{user?.address?.addressLine1}</p>
            <p>{user?.address?.addressLine2}</p>
            <p>
              {user?.address?.city}, {user?.address?.state}
            </p>
            <p>{user?.address?.zipCode}</p>
            <p>{user?.address?.country}</p>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <ContactForm
            initialEmail={user?.email}
            initialPhone={user?.contactNumber}
          />
        </div>
      </div>
    </DashboardCard>
  );
};

export default AddressSection;
