import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import moment from "moment";
import AnimateIn from "@/components/AnimateIn";
import AccountSummary from "./AccountSummary";
import SalesRepCard from "./SalesRepCard";
import CompanyForm from "./CompanyForm";
import ContactInfoForm from "./ContactInfoForm";

const Account = () => {
  const { user } = useSelector((state) => state.auth);
  const [saved, setSaved] = useState(false);
  const defaultValues = useMemo(() => {
    const createdDate = Number(user?.createdDate);

    return {
      companyName: user?.companyName || "",
      address: user?.address?.addressLine1 || user?.address?.street || "",
      city: user?.address?.city || "",
      province: user?.address?.state || user?.address?.province || "",
      postalCode: user?.address?.zipCode || user?.address?.postalCode || "",
      country: user?.address?.country || "",
      email: user?.email || "",
      phone: user?.contactNumber || user?.phoneNumber || "",
      customerSince: createdDate
        ? moment.unix(createdDate).format("MMM DD,YYYY")
        : "",
      accountNumber: user?.accountNumber || "",
    };
  }, [user]);
  const methods = useForm({ defaultValues });

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

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
