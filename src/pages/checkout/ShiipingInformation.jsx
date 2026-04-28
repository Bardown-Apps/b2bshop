import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Input from "@/components/Input";
import Select from "@/components/Select";

const ShippingInformation = ({
  control,
  countries,
  watch,
  setValue,
  getShippingRates,
}) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((s) => s?.auth?.user || {});

  const country = watch("country");
  // const postalCode = watch("postalCode");

  const selectedShippingWay = watch("selectedShippingWay");

  const { shippingWays, shipStationConnection } = useSelector((s) => s?.shop);

  const isMultipleAddressSelected = !!shippingWays?.find((s) =>
    s?.name?.includes("Multiple Address"),
  )?.value;

  const oneAddress = shippingWays?.find((s) =>
    s?.name?.includes("One Address"),
  );

  const pickUp = shippingWays?.find((s) => s?.name?.includes("Pickup"));
  const isPickupMultipleLocation = !!pickUp?.isMultipleLocation;
  const pickupLocations = pickUp?.pickupLocations ?? [];

  useEffect(() => {
    setValue("postalCode", "");
  }, [country, setValue]);

  // Set default values for select fields
  useEffect(() => {
    setValue("country", "");
    setValue("state", "");
  }, [setValue]);

  // When only one shipping method is available, select it by default
  useEffect(() => {
    const hasOneAddress = !!oneAddress?.value;
    const hasPickup = !!pickUp?.value;
    const hasMultiple = isMultipleAddressSelected;
    const optionCount = [hasOneAddress, hasPickup, hasMultiple].filter(
      Boolean,
    ).length;

    if (optionCount !== 1) return;

    if (hasOneAddress && selectedShippingWay !== oneAddress?.name) {
      setValue("addressLine1", oneAddress?.address);
      setValue("country", oneAddress?.country);
      setValue("state", oneAddress?.state);
      setValue("shippingWayShipFee", Number(oneAddress?.price));
      setValue("shippingProperty", oneAddress);
      setValue("selectedShippingWay", oneAddress?.name);
    } else if (
      hasPickup &&
      !isPickupMultipleLocation &&
      selectedShippingWay !== pickUp?.name
    ) {
      setValue("addressLine1", pickUp?.address);
      setValue("country", pickUp?.country);
      setValue("state", pickUp?.state);
      setValue("shippingWayShipFee", Number(pickUp?.price));
      setValue("shippingProperty", pickUp);
      setValue("selectedShippingWay", pickUp?.name);
    } else if (
      hasPickup &&
      isPickupMultipleLocation &&
      pickupLocations?.length > 0
    ) {
      const location = pickupLocations[0];
      const locationId = location?.id ?? location?.name ?? "location-0";
      const isFirstSelected =
        selectedShippingWay === pickUp?.name &&
        (watch("shippingProperty")?.id === locationId ||
          watch("shippingProperty")?.address === location?.address);
      if (!isFirstSelected) {
        setValue("addressLine1", location?.address);
        setValue("country", location?.country);
        setValue("state", location?.state);
        setValue("shippingWayShipFee", Number(location?.price ?? 0));
        setValue("shippingProperty", {
          ...location,
          id: locationId,
          parentPickUp: pickUp,
        });
        setValue("selectedShippingWay", pickUp?.name);
      }
    } else if (hasMultiple && selectedShippingWay !== "ShipToMyAddress") {
      setValue("selectedShippingWay", "ShipToMyAddress");
      setValue(
        "shippingProperty",
        { name: "Ship to my address" },
        { shouldValidate: true },
      );
      if (user?.shippingAddress) {
        setValue("addressLine1", user?.shippingAddress?.address);
        setValue("addressLine2", user?.shippingAddress?.address2);
        setValue("country", user?.shippingAddress?.country);
        setValue("state", user?.shippingAddress?.state);
        setValue("city", user?.shippingAddress?.city);
        setValue("postalCode", user?.shippingAddress?.postal_code);
      } else {
        setValue("addressLine1", "");
        setValue("addressLine2", "");
        setValue("country", "Canada");
        setValue("state", "Ontario");
        setValue("city", "");
        setValue("postalCode", "");
      }
      setValue("shippingWayShipFee", -1);
    }
  }, [
    oneAddress,
    pickUp,
    isMultipleAddressSelected,
    isPickupMultipleLocation,
    pickupLocations,
    selectedShippingWay,
    setValue,
    user?.shippingAddress,
    watch,
  ]);

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="pb-4 text-base font-semibold text-slate-800">
        Select shipping method
      </h2>

      {!!oneAddress?.value && (
        <div className="mb-3 flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex h-6 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                type="checkbox"
                checked={selectedShippingWay === oneAddress?.name}
                onChange={() => {
                  setValue("addressLine1", oneAddress?.address);
                  setValue("country", oneAddress?.country);
                  setValue("state", oneAddress?.state);
                  setValue("shippingWayShipFee", Number(oneAddress?.price));
                  setValue("shippingProperty", oneAddress);
                  setValue("selectedShippingWay", oneAddress?.name);
                }}
                className="col-start-1 row-start-1 h-4 w-4 cursor-pointer accent-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  borderColor: "#000000",
                }}
              />
            </div>
          </div>
          <div className="text-sm/6">
            <label className="font-medium text-slate-900">
              Ship to {oneAddress?.person} (${oneAddress?.price})
            </label>
            <p className="text-slate-500">{oneAddress?.address}</p>
            <p className="text-slate-500">
              {oneAddress?.state}, {oneAddress?.country}
            </p>
          </div>
        </div>
      )}

      {!!pickUp?.value && !isPickupMultipleLocation && (
        <div className="mb-3 flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex h-6 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                type="checkbox"
                className="col-start-1 row-start-1 h-4 w-4 cursor-pointer accent-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  borderColor: "#000000",
                }}
                checked={selectedShippingWay === pickUp?.name}
                onChange={() => {
                  setValue("addressLine1", pickUp?.address);
                  setValue("country", pickUp?.country);
                  setValue("state", pickUp?.state);
                  setValue("shippingWayShipFee", Number(pickUp?.price));
                  setValue("shippingProperty", pickUp);
                  setValue("selectedShippingWay", pickUp?.name);
                }}
              />
            </div>
          </div>
          <div className="text-sm/6">
            <label className="font-medium text-slate-900">
              Pickup from {pickUp?.person} (${Number(pickUp?.price).toFixed(2)})
            </label>
            <p className="text-slate-500">{pickUp?.address}</p>
            <p className="text-slate-500">
              {pickUp?.state}, {pickUp?.country}
            </p>
          </div>
        </div>
      )}

      {!!pickUp?.value && isPickupMultipleLocation && (
        <>
          <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-sm font-medium text-slate-900">
              Pickup – Select a location
            </p>
            {pickupLocations.map((location, index) => {
              const locationId =
                location?.id ?? location?.name ?? `location-${index}`;
              const isThisLocationSelected =
                selectedShippingWay === pickUp?.name &&
                (watch("shippingProperty")?.id === locationId ||
                  watch("shippingProperty")?.address === location?.address);
              return (
                <div
                  key={locationId}
                  className="mb-3 flex gap-3 rounded-md border border-slate-200 bg-white p-2"
                >
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        type="radio"
                        name="pickup-location"
                        className="col-start-1 row-start-1 h-4 w-4 cursor-pointer accent-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{
                          borderColor: "#000000",
                        }}
                        checked={isThisLocationSelected}
                        onChange={() => {
                          setValue("addressLine1", location?.address);
                          setValue("country", location?.country);
                          setValue("state", location?.state);
                          setValue(
                            "shippingWayShipFee",
                            Number(location?.price ?? 0),
                          );
                          setValue("shippingProperty", {
                            ...location,
                            id: locationId,
                            parentPickUp: pickUp,
                          });
                          setValue("selectedShippingWay", pickUp?.name);
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm/6">
                    <label className="font-medium text-slate-900">
                      {location?.person ??
                        location?.name ??
                        `Location ${index + 1}`}{" "}
                      ( ${Number(location?.price ?? 0).toFixed(2)})
                    </label>
                    <p className="text-slate-500">{location?.address}</p>
                    <p className="text-slate-500">
                      {location?.state}, {location?.country}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {isMultipleAddressSelected && (
        <div className="mb-3 flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex h-6 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                type="checkbox"
                className="col-start-1 row-start-1 h-4 w-4 cursor-pointer accent-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  borderColor: "#000000",
                }}
                checked={selectedShippingWay === "ShipToMyAddress"}
                onChange={() => {
                  setValue("selectedShippingWay", "ShipToMyAddress");
                  setValue(
                    "shippingProperty",
                    { name: "Ship to my address" },
                    { shouldValidate: true },
                  );

                  if (user?.shippingAddress) {
                    setValue("addressLine1", user?.shippingAddress?.address);
                    setValue("addressLine2", user?.shippingAddress?.address2);
                    setValue("country", user?.shippingAddress?.country);
                    setValue("state", user?.shippingAddress?.state);
                    setValue("city", user?.shippingAddress?.city);
                    setValue("postalCode", user?.shippingAddress?.postal_code);
                  } else {
                    setValue("addressLine1", "");
                    setValue("addressLine2", "");
                    setValue("country", "Canada");
                    setValue("state", "Ontario");
                    setValue("city", "");
                    setValue("postalCode", "");
                  }

                  setValue("shippingWayShipFee", -1);
                }}
              />
            </div>
          </div>
          <div className="text-sm/6">
            <label className="font-medium text-slate-900">
              Ship to my address
            </label>
          </div>
        </div>
      )}

      {isMultipleAddressSelected &&
        selectedShippingWay === "ShipToMyAddress" && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                name="name"
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
              name="addressLine1"
              label="Address Line1"
              control={control}
              required
              rules={{
                required: "Address Line1 is required",
                validate: (value) =>
                  value.trim() !== "" || "Address Line1 cannot be empty",
              }}
              placeholder="Enter Address Line1"
            />

            <Input
              name="addressLine2"
              label="Address Line2"
              control={control}
              placeholder="Enter Address Line2"
            />

            <Select
              control={control}
              name="country"
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
              name="state"
              label="State"
              control={control}
              required
              rules={{
                required: "State is required",
              }}
              placeholder="Enter State"
              options={countries
                ?.find((c) => c.name === country)
                ?.states?.map((s) => ({
                  value: s?.name,
                  label: s?.name,
                }))}
            />

            <Input
              name="city"
              label="City"
              control={control}
              required
              rules={{
                required: "City is required",
                validate: (value) =>
                  value.trim() !== "" || "City cannot be empty",
              }}
              placeholder="Enter City"
            />

            <Input
              name="postalCode"
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
        )}

      {/* {countryError && (
        <div className="rounded-md bg-red-50 p-4  text-left relative border">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon
                aria-hidden="true"
                className="h-5 w-5 text-red-400"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Note: Shipping service is not available in selected country.
              </h3>
            </div>
          </div>
        </div>
      )} */}

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
    </section>
  );
};

export default ShippingInformation;
