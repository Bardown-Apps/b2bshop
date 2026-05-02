import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import Input from "@/components/Input";
import usePost from "@/hooks/usePost";
import useRunOnOpenOnce from "@/hooks/useRunOnOpenOnce";
import { SALES_REP } from "@/constants/services";

const ContactInformation = ({ control, setValue }) => {
  const auth = useSelector((s) => s?.auth);
  const authToken = auth?.token;
  const salesReps = auth?.user?.salesReps;
  const { mutateAsync } = usePost();
  const [isSalesRepDialogOpen, setIsSalesRepDialogOpen] = useState(false);
  const [salesRepOptions, setSalesRepOptions] = useState([]);
  const [selectedSalesRepIndex, setSelectedSalesRepIndex] = useState(-1);
  const [isSalesRepLoading, setIsSalesRepLoading] = useState(false);
  const [salesRepError, setSalesRepError] = useState("");

  const loadSalesReps = useCallback(async () => {
    setIsSalesRepLoading(true);
    setSalesRepError("");

    try {
      const { data } = await mutateAsync({
        url: SALES_REP,
        data: {},
      });
      const apiSalesReps = Array.isArray(data)
        ? data
        : Array.isArray(data?.salesReps)
          ? data.salesReps
          : Array.isArray(data?.data)
            ? data.data
            : [];
      const mergedSalesReps = apiSalesReps.length
        ? apiSalesReps
        : salesReps || [];
      setSalesRepOptions(mergedSalesReps);
      setSelectedSalesRepIndex(-1);
    } catch (error) {
      setSalesRepError("Unable to fetch sales reps. Please try again.");
    } finally {
      setIsSalesRepLoading(false);
    }
  }, [mutateAsync, salesReps]);

  useRunOnOpenOnce({
    isOpen: isSalesRepDialogOpen,
    onOpen: loadSalesReps,
  });

  const onSelectSalesRep = () => {
    const selectedSalesRep = salesRepOptions?.[selectedSalesRepIndex];
    if (!selectedSalesRep) {
      return;
    }

    const firstName = selectedSalesRep?.name || selectedSalesRep?.nme || "";
    const lastName =
      selectedSalesRep?.lastName || selectedSalesRep?.lname || "";
    const phoneNumber =
      selectedSalesRep?.phoneNumber || selectedSalesRep?.phone || "";
    const salesRepEmail = selectedSalesRep?.email || "";

    setValue("userName", firstName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("userLastName", lastName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("phone", phoneNumber, { shouldDirty: true, shouldValidate: true });
    setValue("salesRepEmail", salesRepEmail, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setIsSalesRepDialogOpen(false);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-800">
          Contact information
        </h2>
        <button
          type="button"
          onClick={() => setIsSalesRepDialogOpen(true)}
          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Select Sales Rep
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          name="userName"
          label="First Name"
          control={control}
          required
          rules={{
            required: "First Name is required",
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return "First Name is required";
              }
              return true;
            },
          }}
          placeholder="Enter your first name"
        />
        <Input
          name="userLastName"
          label="Last Name"
          control={control}
          required
          rules={{
            required: "Last Name is required",
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return "Last Name is required";
              }
              return true;
            },
          }}
          placeholder="Enter your last name"
        />

        <Input
          name="email"
          label="Email"
          type="email"
          control={control}
          disabled={!!authToken}
          required
          rules={{
            required: "Email is required",
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return "Email is required";
              }
              return true;
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          placeholder="Enter email"
        />

        <Input
          name="phone"
          label="Phone"
          type="number"
          control={control}
          required
          rules={{
            required: "Phone is required",
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return "Phone is required";
              }
              return true;
            },
            pattern: {
              value: /^\+?\d{10,15}$/,
              message: "Invalid phone number",
            },
          }}
          placeholder="Enter phone"
        />

        <Input
          name="salesRepEmail"
          label="Sales Rep Email"
          type="email"
          control={control}
          required
          rules={{
            required: "Email is required",
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return "Email is required";
              }
              return true;
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          placeholder="Enter Sales Rep Email"
        />
      </div>
      {isSalesRepDialogOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/55 px-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsSalesRepDialogOpen(false);
              }
            }}
          >
            <div
              className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-label="Select Sales Rep"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-800">
                  Select Sales Rep
                </h3>
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-700"
                  onClick={() => setIsSalesRepDialogOpen(false)}
                  aria-label="Close sales rep dialog"
                >
                  &times;
                </button>
              </div>

              <div className="max-h-80 overflow-auto px-4 py-3">
                {isSalesRepLoading && (
                  <p className="text-sm text-slate-500">
                    Loading sales reps...
                  </p>
                )}

                {!isSalesRepLoading && salesRepError && (
                  <p className="text-sm text-red-600">{salesRepError}</p>
                )}

                {!isSalesRepLoading &&
                  !salesRepError &&
                  salesRepOptions.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No sales reps available.
                    </p>
                  )}

                {!isSalesRepLoading &&
                  !salesRepError &&
                  salesRepOptions.length > 0 && (
                    <ul className="space-y-2">
                      {salesRepOptions.map((rep, index) => (
                        <li
                          key={`${rep?.email || rep?.name || "rep"}-${index}`}
                        >
                          <button
                            type="button"
                            className={`w-full rounded-md border px-3 py-2 text-left transition ${
                              selectedSalesRepIndex === index
                                ? "border-slate-800 bg-slate-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() => setSelectedSalesRepIndex(index)}
                          >
                            <p className="text-sm font-medium text-slate-800">
                              {rep?.name || rep?.nme || "Unnamed Sales Rep"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {rep?.email || "No email"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {rep?.phoneNumber || rep?.phone || "No phone"}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3">
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsSalesRepDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={selectedSalesRepIndex < 0}
                  onClick={onSelectSalesRep}
                >
                  Select
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};

export default ContactInformation;
