import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import { PROFILE } from "@/constants/dashboard";
import AnimateIn from "@/components/AnimateIn";
import AccountSummary from "./AccountSummary";
import SalesRepCard from "./SalesRepCard";
import CompanyForm from "./CompanyForm";
import ContactInfoForm from "./ContactInfoForm";

const defaultValues = {
  companyName: PROFILE.companyName,
  address: PROFILE.address.street,
  city: PROFILE.address.city,
  province: PROFILE.address.province,
  postalCode: PROFILE.address.postalCode,
  country: PROFILE.address.country,
  email: PROFILE.contact.email,
  phone: PROFILE.contact.phone,
  customerSince: PROFILE.customerSince,
  accountNumber: PROFILE.accountNumber,
};

const Account = () => {
  const [saved, setSaved] = useState(false);
  const methods = useForm({ defaultValues });

  const onSubmit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl"
      >
        <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-3">
          My Account
        </h1>

        <AnimateIn>
          <AccountSummary />
        </AnimateIn>
        <AnimateIn delay={0.08}>
          <SalesRepCard />
        </AnimateIn>
        <AnimateIn delay={0.12}>
          <CompanyForm />
        </AnimateIn>
        <AnimateIn delay={0.16}>
          <ContactInfoForm />
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-8 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all duration-200 flex items-center gap-2 cursor-pointer hover:shadow-md"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saved
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </AnimateIn>
      </form>
    </FormProvider>
  );
};

export default Account;
