import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MapPin, Plus, ChevronDown } from "lucide-react";
import { SHIPPING_ADDRESSES } from "@/constants/shippingAddresses";
import { ADDRESSES } from "@/constants/services";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import usePatch from "@/hooks/usePatch";
import useDelete from "@/hooks/useDelete";
import useCountries from "@/hooks/useCountries";
import AnimateIn from "@/components/AnimateIn";
import CollapsiblePanel from "@/components/CollapsiblePanel";
import AddressCard from "./AddressCard";

const inputClass =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all";

const normalizeAddressesPayload = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.addresses)) return data.addresses;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  return [];
};

const mapAddressForCard = (raw, index) => {
  const id =
    raw?._id ??
    raw?.id ??
    raw?.addressId ??
    raw?.shippingId ??
    `address-${index}`;
  const label =
    raw?.label ?? raw?.title ?? raw?.shippingId ?? "Shipping Address";
  const fullName = [raw?.firstName, raw?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const name =
    fullName ||
    raw?.name ||
    raw?.company ||
    raw?.companyName ||
    raw?.recipientName ||
    "—";
  const line1 = raw?.street ?? raw?.address ?? raw?.address1 ?? "";
  const line2 = raw?.address2 ?? "";
  const street = [line1, line2].filter(Boolean).join(", ").trim() || "—";
  const city = raw?.city ?? "—";
  const state = raw?.state ?? raw?.province ?? "—";
  const zip =
    raw?.zip ?? raw?.zipCode ?? raw?.postalCode ?? raw?.postal_code ?? "—";
  const country = raw?.country ?? "United States";
  const phone = raw?.phone ?? raw?.phoneNumber ?? "—";
  const isDefault =
    Boolean(raw?.isDefault) ||
    String(raw?.defaultAddress ?? "").toLowerCase() === "yes";

  return {
    id: String(id),
    addressId: String(id),
    shippingId: raw?.shippingId ? String(raw.shippingId) : "",
    userId: raw?.userId ? String(raw.userId) : "",
    adminId: raw?.adminId ? String(raw.adminId) : "",
    label: String(label),
    firstName: String(raw?.firstName ?? "").trim(),
    lastName: String(raw?.lastName ?? "").trim(),
    name: String(name),
    address: String(line1 || ""),
    address2: String(line2 || ""),
    street: String(street),
    city: String(city),
    state: String(state),
    zip: String(zip),
    postal_code: String(
      raw?.postal_code ?? raw?.postalCode ?? raw?.zipCode ?? raw?.zip ?? "",
    ),
    country: String(country),
    phone: String(phone),
    isDefault,
  };
};

const ShippingAddresses = () => {
  const auth = useSelector((s) => s?.auth || {});
  const user = auth?.user || {};
  const [addresses, setAddresses] = useState(SHIPPING_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [editingAddressId, setEditingAddressId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Canada",
  });

  const { mutateAsync } = usePost();
  const { mutate: addAddress, isLoading: isSaving } = usePut(ADDRESSES);
  const { mutate: patchAddress, isLoading: isPatching } = usePatch(ADDRESSES);
  const { mutate: deleteAddress } = useDelete(ADDRESSES);
  const { data: countries = [], isFetching: isCountriesFetching } = useCountries();

  const stateOptions =
    countries.find((c) => c?.name === newAddress.country)?.states || [];

  const resetAddressForm = () => {
    setNewAddress({
      firstName: "",
      lastName: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Canada",
    });
    setEditingAddressId("");
    setSaveError("");
  };

  useEffect(() => {
    let cancelled = false;

    const loadAddresses = async () => {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await mutateAsync({
          url: ADDRESSES,
          data: {},
        });
        if (cancelled) return;
        const list = normalizeAddressesPayload(data).map(mapAddressForCard);
        setAddresses(list);
      } catch (e) {
        if (!cancelled) {
          setAddresses([]);
          setError(
            e?.response?.data?.message ??
              e?.message ??
              "Could not load addresses.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadAddresses();
    return () => {
      cancelled = true;
    };
  }, [mutateAsync]);

  const handleSetDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleRemove = (id) => {
    const target = addresses.find((a) => a.id === id);
    if (!target) return;
    if (!target.shippingId) {
      setSaveError("Unable to delete address. Missing shippingId.");
      return;
    }

    const doDelete = async () => {
      setIsDeleting(true);
      setSaveError("");
      try {
        await deleteAddress({
          _id: target.addressId ?? target.id,
          addressId: target.addressId ?? target.id,
          shippingId: target.shippingId,
          userId: target.userId || user?.userId || user?._id || user?.id,
          adminId:
            target.adminId || user?.adminId || user?.admin?._id || user?.admin?.id,
        });
        const { data } = await mutateAsync({ url: ADDRESSES, data: {} });
        setAddresses(normalizeAddressesPayload(data).map(mapAddressForCard));
      } catch (e) {
        setSaveError(
          e?.response?.data?.message ??
            e?.message ??
            "Could not delete address. Please try again.",
        );
      } finally {
        setIsDeleting(false);
      }
    };

    void doDelete();
  };

  const handleEdit = (address) => {
    setShowForm(true);
    setEditingAddressId(address.id);
    setSaveError("");
    setNewAddress({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      address: address.address || "",
      address2: address.address2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || address.zip || "",
      country: address.country || "Canada",
    });
  };

  const handleNewAddressChange = (field, value) => {
    setNewAddress((prev) => {
      if (field === "country") {
        return { ...prev, country: value, state: "" };
      }
      return { ...prev, [field]: value };
    });
    setSaveError("");
  };

  const handleSaveAddress = async () => {
    const required = [
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "postal_code",
      "country",
    ];
    const missing = required.some((k) => !String(newAddress[k] ?? "").trim());
    if (missing) {
      setSaveError("Please fill all required fields.");
      return;
    }

    const userId = user?.userId ?? user?._id ?? user?.id;
    const adminId = user?.adminId ?? user?.admin?._id ?? user?.admin?.id;
    if (!userId || !adminId) {
      setSaveError("Unable to add address. Missing user or admin details.");
      return;
    }

    const payload = {
      firstName: newAddress.firstName.trim(),
      lastName: newAddress.lastName.trim(),
      address: newAddress.address.trim(),
      address2: newAddress.address2.trim(),
      city: newAddress.city.trim(),
      state: newAddress.state.trim(),
      postal_code: newAddress.postal_code.trim(),
      country: newAddress.country.trim(),
      userId,
      adminId,
    };

    try {
      if (editingAddressId) {
        const target = addresses.find((a) => a.id === editingAddressId);
        if (!target?.shippingId) {
          setSaveError("Unable to update address. Missing shippingId.");
          return;
        }
        await patchAddress({
          ...payload,
          _id: target?.addressId ?? editingAddressId,
          addressId: target?.addressId ?? editingAddressId,
          shippingId: target.shippingId,
          isDelete: false,
        });
      } else {
        await addAddress(payload);
      }
      const { data } = await mutateAsync({ url: ADDRESSES, data: {} });
      setAddresses(normalizeAddressesPayload(data).map(mapAddressForCard));
      setShowForm(false);
      resetAddressForm();
    } catch (e) {
      setSaveError(
        e?.response?.data?.message ??
          e?.message ??
          "Could not save address. Please try again.",
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
        <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
          Shipping Addresses
        </h1>
        <span className="text-xs text-slate-500">
          {addresses.length} {addresses.length === 1 ? "address" : "addresses"}{" "}
          on file
        </span>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      <CollapsiblePanel open={showForm}>
        <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-5">
            {editingAddressId ? "Edit Shipping Address" : "Add a Shipping Address"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                First Name
              </label>
              <input
                type="text"
                placeholder="First name"
                className={inputClass}
                value={newAddress.firstName}
                onChange={(e) =>
                  handleNewAddressChange("firstName", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last name"
                className={inputClass}
                value={newAddress.lastName}
                onChange={(e) =>
                  handleNewAddressChange("lastName", e.target.value)
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Address 1
              </label>
              <input
                type="text"
                placeholder="Address line 1"
                className={inputClass}
                value={newAddress.address}
                onChange={(e) => handleNewAddressChange("address", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Address 2
              </label>
              <input
                type="text"
                placeholder="Apartment, suite, unit"
                className={inputClass}
                value={newAddress.address2}
                onChange={(e) => handleNewAddressChange("address2", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Country
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                  value={newAddress.country}
                  onChange={(e) => handleNewAddressChange("country", e.target.value)}
                  disabled={isCountriesFetching}
                >
                  <option value="">Select</option>
                  {countries.map((country) => (
                    <option key={country?.name} value={country?.name}>
                      {country?.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                State
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                  value={newAddress.state}
                  onChange={(e) => handleNewAddressChange("state", e.target.value)}
                  disabled={!newAddress.country || isCountriesFetching}
                >
                  <option value="">Select</option>
                  {stateOptions.map((s) => (
                    <option key={s?.name} value={s?.name}>
                      {s?.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                City
              </label>
              <input
                type="text"
                placeholder="City"
                className={inputClass}
                value={newAddress.city}
                onChange={(e) => handleNewAddressChange("city", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                ZIP Code
              </label>
              <input
                type="text"
                placeholder="ZIP"
                maxLength={20}
                className={inputClass}
                value={newAddress.postal_code}
                onChange={(e) =>
                  handleNewAddressChange("postal_code", e.target.value)
                }
              />
            </div>
          </div>
          {saveError ? (
            <p className="text-sm text-red-600 mt-3" role="alert">
              {saveError}
            </p>
          ) : null}
          <div className="flex items-center gap-3 mt-5">
            <button
              type="button"
              onClick={handleSaveAddress}
              disabled={isSaving || isPatching || isDeleting}
              className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving || isPatching
                ? "Saving..."
                : editingAddressId
                  ? "Update Address"
                  : "Save Address"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                resetAddressForm();
              }}
              className="px-4 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </CollapsiblePanel>

      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-slate-200/70 animate-pulse border border-slate-100"
            />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <AnimateIn className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            No shipping addresses yet. Add one to get started.
          </p>
        </AnimateIn>
      ) : (
        <div className="space-y-4">
          {addresses.map((address, i) => (
            <AnimateIn key={address.id} delay={i * 0.06}>
              <AddressCard
                address={address}
                onEdit={handleEdit}
                onRemove={handleRemove}
                isBusy={isSaving || isPatching || isDeleting}
              />
            </AnimateIn>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShippingAddresses;
