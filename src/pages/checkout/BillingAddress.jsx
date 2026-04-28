import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Input from "@/components/Input";
import Select from "@/components/Select";

const BillingAddress = ({
  control,
  countries,
  watch,
  setValue,
  // getShippingRates,
}) => {
  const [loading, setLoading] = useState(false);

  const country = watch("billToCountry");
  // const postalCode = watch("postalCode");

  const { shipStationConnection } = useSelector((s) => s?.shop);

  useEffect(() => {
    setValue("postalCode", "");
  }, [country, setValue]);

  // Set default values for select fields
  useEffect(() => {
    setValue("billToCountry", "");
    setValue("billToState", "");
  }, [setValue]);

  return (
    <div className="mt-4 border-t border-gray-200 pt-8">
      <h2 className="text-lg font-medium text-gray-900 pb-4">
        Billing Address
      </h2>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4">
        <div className="sm:col-span-2">
          <Input
            name="billToName"
            label="Name"
            control={control}
            required
            rules={{
              required: "Name is required",
              validate: (value) =>
                value.trim() !== "" || "Name cannot be empty",
            }}
            placeholder="Enter your name"
          />
        </div>

        <Input
          name="billToAddress"
          label="Address Line 1"
          control={control}
          required
          rules={{
            required: "Address is required",
            validate: (value) =>
              value.trim() !== "" || "Address cannot be empty",
          }}
          placeholder="Enter Address Line 1"
        />

        <Input
          name="billToAddress2"
          label="Address Line 2"
          control={control}
          placeholder="Enter Address Line 2"
        />

        <Select
          control={control}
          name="billToCountry"
          label="Country"
          placeholder="Select Country"
          options={countries?.map((c) => ({
            value: c?.name,
            label: c?.name,
          }))}
          required
          rules={{
            required: "Country is required",
          }}
        />

        <Select
          name="billToState"
          label="State"
          control={control}
          required
          rules={{
            required: "State is required",
          }}
          placeholder="Select State"
          options={countries
            ?.find((c) => c.name === country)
            ?.states?.map((s) => ({
              value: s?.name,
              label: s?.name,
            }))}
        />

        <Input
          name="billToCity"
          label="City"
          control={control}
          required
          rules={{
            required: "City is required",
            validate: (value) => value.trim() !== "" || "City cannot be empty",
          }}
          placeholder="Enter City"
        />

        <Input
          name="billToPostalCode"
          label="Postal Code"
          control={control}
          required
          rules={{
            required: "Postal Code is required",
            validate: (value) =>
              value.trim() !== "" || "Postal Code cannot be empty",
          }}
          placeholder="Enter Postal Code"
          onBlur={async (e) => {
            const value = e.target.value.trim();

            if (value.length >= 5 && !!shipStationConnection && !!country) {
              setLoading(true);
              // await getShippingRates(value);
              setLoading(false);
            }
          }}
        />
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div
            className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2"
            style={{
              borderColor: "#000000",
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default BillingAddress;
