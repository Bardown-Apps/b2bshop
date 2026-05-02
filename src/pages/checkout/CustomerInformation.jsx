import { useEffect, useState } from "react";
import ShippingInformation from "@/pages/checkout/ShiipingInformation";
import ContactInformation from "@/pages/checkout/ContactInformation";
import CardInformation from "@/pages/checkout/CardInformation";
import EnabledShopOn from "@/components/EnabledShopOn";
import { useSelector } from "react-redux";
import TeamSelection from "@/pages/checkout/TeamSelection";
import BillToInformation from "@/pages/checkout/BillingAddress";
import TermsDialog from "@/components/TermsDialog";
import PrivacyPolicyDialog from "@/components/PrivacyPolicyDialog";
import Input from "@/components/Input";

const CustomerInformation = ({
  control,
  isValid,
  watch,
  setValue,
  total,
  loading,
  countries,
  products,
  // getShippingRates,
  onPOOrderSubmit,
  onSubmit,
  onSubmitPaypal,
  shippingFeeRuleAmount,
  creditAmount,
  discountAmount,
}) => {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const {
    shopClosingOn,
    shippingWays,
    teamSelection,
    teams,
    globalTeamSelectionCustomName,
    paypal,
    dataCollection,
  } = useSelector((s) => s?.shop);

  const isShipTrue = shippingWays?.find((s) => s?.value);
  const dynamicDataCollection = Array.isArray(dataCollection)
    ? dataCollection.filter((field) => !!field?.label)
    : [];

  useEffect(() => {
    if (!dynamicDataCollection.length) {
      return;
    }

    const currentFormDataCollection = watch("dataCollection") || [];
    const mappedDataCollection = dynamicDataCollection.map((field, index) => ({
      ...field,
      value: currentFormDataCollection?.[index]?.value || "",
    }));

    setValue("dataCollection", mappedDataCollection);
  }, [dataCollection]);

  return (
    <div>
      {teams?.length > 0 && (
        <TeamSelection
          control={control}
          teams={teams}
          teamSelection={teamSelection}
          watch={watch}
          globalTeamSelectionCustomName={globalTeamSelectionCustomName}
        />
      )}

      {dynamicDataCollection.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4 pb-4">
          {dynamicDataCollection.map((field, index) => {
            const label = field?.label || `Field ${index + 1}`;
            const maxCharacters = Number(field?.maxCharacters) || undefined;
            const isNumberType = field?.type === "number";

            return (
              <div key={`${label}-${index}`} className="sm:col-span-1">
                <Input
                  name={`dataCollection.${index}.value`}
                  label={label}
                  type={field?.type || "text"}
                  control={control}
                  required={!!field?.required}
                  maxLength={maxCharacters}
                  inputMode={isNumberType ? "numeric" : undefined}
                  rules={{
                    required: field?.required ? `${label} is required` : false,
                    validate: (value) => {
                      const normalizedValue =
                        value === undefined || value === null
                          ? ""
                          : String(value);

                      if (
                        field?.required &&
                        normalizedValue.trim().length === 0
                      ) {
                        return `${label} is required`;
                      }

                      if (isNumberType && /[^0-9]/.test(normalizedValue)) {
                        return `${label} must contain only numbers`;
                      }

                      if (
                        maxCharacters &&
                        normalizedValue.length > Number(maxCharacters)
                      ) {
                        return `${label} must be ${maxCharacters} characters or less`;
                      }

                      return true;
                    },
                  }}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            );
          })}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm pb-4 mb-4">
        <h2 className="text-base font-semibold text-slate-800">
          Custom PO Number
        </h2>

        <div className="mt-4 max-w-md">
          <label
            htmlFor="checkout-po-number"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            PO number
          </label>
          <Input
            id="checkout-po-number"
            name="poNumber"
            control={control}
            placeholder="Enter PO number"
            autoComplete="off"
          />
        </div>
      </section>

      <ContactInformation control={control} setValue={setValue} />

      {!paypal && (
        <BillToInformation
          control={control}
          countries={countries}
          watch={watch}
          setValue={setValue}
          products={products}
          // getShippingRates={getShippingRates}
        />
      )}

      {!!isShipTrue && (
        <ShippingInformation
          control={control}
          countries={countries}
          watch={watch}
          setValue={setValue}
          products={products}
          // getShippingRates={getShippingRates}
        />
      )}

      {!!shopClosingOn && (
        <div className=" border-t border-gray-200 pt-8 pb-4">
          <EnabledShopOn shopClosingOn={shopClosingOn} />
        </div>
      )}

      <div className="border-t border-gray-200 pt-6 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-6 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                type="checkbox"
                id="agree-terms-privacy"
                checked={watch("agreeTerms") === true}
                onChange={(e) => setValue("agreeTerms", e.target.checked)}
                className="col-start-1 row-start-1 h-4 w-4 cursor-pointer accent-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2"
              />
            </div>
          </div>

          <label
            htmlFor="agree-terms-privacy"
            className="text-sm text-gray-700 leading-6 cursor-pointer"
          >
            I agree to{" "}
            <button
              type="button"
              className="underline text-gray-900 font-medium"
              onClick={() => setTermsOpen(true)}
            >
              Terms & Conditions
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="underline text-gray-900 font-medium"
              onClick={() => setPrivacyOpen(true)}
            >
              Privacy Policy
            </button>
          </label>
        </div>
      </div>

      <TermsDialog open={termsOpen} onClose={setTermsOpen} />
      <PrivacyPolicyDialog open={privacyOpen} onClose={setPrivacyOpen} />

      {!!isShipTrue && (
        <CardInformation
          isValid={isValid}
          watch={watch}
          setValue={setValue}
          total={total}
          loading={loading}
          onPOOrderSubmit={onPOOrderSubmit}
          onSubmit={onSubmit}
          onSubmitPaypal={onSubmitPaypal}
          shippingFeeRuleAmount={shippingFeeRuleAmount}
          shippingTaxValue={watch("shippingTaxValue")}
          creditAmount={creditAmount}
          discountAmount={discountAmount}
        />
      )}
    </div>
  );
};

export default CustomerInformation;
