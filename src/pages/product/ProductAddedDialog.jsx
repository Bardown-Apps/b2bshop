import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import routes, { Checkout, Home } from "@/constants/routes";

const ProductAddedDialog = ({
  open,
  setOpen,
  product,
  payload,
  isBulkOrder,
}) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <DialogTitle
                as="h3"
                className="text-base font-semibold text-gray-900 p-3 border-b border-gray-300"
              >
                You have just added
              </DialogTitle>
              {isBulkOrder ? (
                <div className="mt-2 flex p-3">
                  <img
                    src={product?.defaultImageUrl}
                    className="w-24 h-24 border border-gray-300 p-2"
                  />

                  <div className="w-full">
                    <p className="text-xl text-gray-900 w-full pl-4">
                      {product?.name}
                    </p>
                    {payload?.map((p) => (
                      <div
                        key={p?.name}
                        className="mt-4 border-dashed border border-gray-300 ml-4 p-2 rounded-md"
                      >
                        <p className="text-md text-gray-500 w-full ">
                          Variant: {p?.orderedCombination?.name}
                        </p>
                        <p className="text-md text-gray-500 w-full">
                          Quantity: {p?.orderedCombination?.qty}
                        </p>

                        {p?.customFields?.map((c) => {
                          if (!c?.value) return null;

                          return (
                            <p
                              key={c?.value}
                              className="text-md text-gray-500 w-full"
                            >
                              {c?.fieldName}: {c?.value}
                            </p>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex p-3">
                  <img
                    src={product?.defaultImageUrl}
                    className="w-24 border border-gray-300 p-2"
                  />
                  <div>
                    <p className="text-xl text-gray-900 w-full pl-4">
                      {product?.name}
                    </p>
                    <p className="text-md text-gray-500 w-full pl-4">
                      Variant: {payload?.orderedCombination?.name}
                    </p>
                    <p className="text-md text-gray-500 w-full pl-4">
                      Quantity: {payload?.orderedCombination?.qty}
                    </p>

                    {payload?.customFields?.map((c) => {
                      if (!c?.value) return null;

                      return (
                        <p
                          key={c?.value}
                          className="text-md text-gray-500 w-full pl-4"
                        >
                          {c?.fieldName}: {c?.value}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3 p-3">
              <button
                type="button"
                onClick={() => {
                  navigate(Checkout.path);
                }}
                className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:col-start-2"
              >
                Checkout
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate(routes.clubStore);
                }}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-black sm:col-start-1 sm:mt-0"
              >
                Continue Shopping
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductAddedDialog;
