import { useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Images from "@/pages/product/Images";
import Info from "@/pages/product/Info";
import BulkOrder from "@/pages/product/BulkOrder";
import { classNames } from "@/utils/classNames";
import moment from "moment";
import ArrivalEstimation from "@/components/ArrivalEstimation";
import { TeamOrderFormDialog } from "./TeamOrderFormDialog";

const Wrapper = ({ product, setProduct }) => {
  const [tab, setTab] = useState(0);
  const [teamOrderFormOpen, setTeamOrderFormOpen] = useState(false);
  const { shopCurrency, b2bShop } = useSelector((s) => s?.shop);

  const isSponsorLogo = product?.decorations?.find(
    (d) => d?.title === "Sponsor Logo",
  );

  const packageProduct = product?.packageProduct;

  const tabs = packageProduct
    ? [{ name: "Single Order" }]
    : [{ name: "Single Order" }, { name: "Team Order" }];

  let customFieldPrice = 0;

  for (let index = 0; index < product?.customFields?.length; index++) {
    const customField = product?.customFields[index];

    if (customField?.value) {
      customFieldPrice += Number(customField?.fieldPrice);
    }
  }

  for (let index = 0; index < product?.decorations?.length; index++) {
    const decoration = product?.decorations[index];
    if (decoration?.customDecorationUrl) {
      customFieldPrice += Number(decoration?.price);
    }
  }

  const estimeArrivalDate = product?.estimeArrivalDate;
  const startDate = moment.unix(estimeArrivalDate?.startDate);
  const endDate = moment.unix(estimeArrivalDate?.endDate);

  return (
    <div className="animate-fade-up" style={{ animationDuration: "0.35s" }}>
      <div className="mx-auto">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
            <Images product={product} setProduct={setProduct} />

            <div>
              <div className="mb-5">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {product.name}
                </h1>

                <div className="mt-3">
                  {Number(product.price) > 0 && (
                    <p className="text-2xl font-semibold tracking-tight text-slate-800">
                      {isNaN(Number(product.price))
                        ? product.price
                        : `$${(
                            Number(product.price) + customFieldPrice
                          ).toFixed(2)} ${shopCurrency}`}
                    </p>
                  )}
                </div>
              </div>

              {startDate && endDate && (
                <div className="mt-4">
                  <ArrivalEstimation estimeArrivalDate={estimeArrivalDate} />
                </div>
              )}

              {/* <div className="grid grid-cols-1 sm:hidden relative">
                <select
                  defaultValue={tabs[tab].name}
                  onChange={(e) => {
                    setTab(tabs.findIndex((t) => t.name === e.target.value));
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-base text-slate-900 shadow-sm outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-200"
                >
                  {tabs.map((tab) => (
                    <option key={tab.name}>{tab.name}</option>
                  ))}
                </select>
              </div>

              <div className="hidden sm:block">
                <div className="-mb-px flex items-center justify-between gap-4">
                  <nav aria-label="Tabs" className="flex flex-1 gap-2 pb-1">
                    {tabs.map((t, index) => (
                      <div
                        key={t.name}
                        onClick={() => setTab(index)}
                        className={classNames(
                          "flex-1 max-w-[130px] rounded-md border px-3 py-2.5 text-center text-sm font-medium cursor-pointer relative whitespace-nowrap transition-all duration-200",
                        )}
                        style={{
                          color: tab === index ? "#ffffff" : "#334155",
                          borderColor: tab === index ? "#4f46e5" : "#cbd5e1",
                          background: tab === index ? "#4f46e5" : "#ffffff",
                        }}
                      >
                        {t.name}
                        {t.isNew && (
                          <span className="absolute -top-1 -right-1 inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white">
                            New
                          </span>
                        )}
                      </div>
                    ))}
                  </nav>
                  {b2bShop && (
                    <div className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setTeamOrderFormOpen(true)}
                        className="rounded-md px-3 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          backgroundColor: "#4f46e5",
                          color: "#ffffff",
                        }}
                      >
                        Order Form
                      </button>
                    </div>
                  )}
                </div>
              </div> */}

              <div className="mt-6">
                {/* {tabs[tab]?.name === "Single Order" && ( */}
                <Info product={product} setProduct={setProduct} />
                {/* )}
                {tabs[tab]?.name === "Team Order" && (
                  <BulkOrder product={product} setProduct={setProduct} />
                )} */}
              </div>

              <TeamOrderFormDialog
                open={teamOrderFormOpen}
                onClose={() => setTeamOrderFormOpen(false)}
                product={product}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickShop = ({ product, setProduct, isModal = false }) => {
  if (isModal) {
    return (
      <Dialog
        open={!!product}
        onClose={() => setProduct(undefined)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <DialogPanel
          transition
          className="fixed inset-10 transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in w-auto sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-auto"
        >
          <Wrapper product={product} setProduct={setProduct} />
        </DialogPanel>
      </Dialog>
    );
  }

  return <Wrapper product={product} setProduct={setProduct} />;
};

export default QuickShop;
