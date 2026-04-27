import { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Variants from "@/pages/product/Variants";
// import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { classNames } from "@/utils/classNames";
import { useSelector } from "react-redux";

const BulkOrder = ({ product, setProduct }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const sizeChart = product?.sizeChart;
  const hasSizeChart = Array.isArray(sizeChart)
    ? sizeChart.length > 0
    : !!sizeChart;
  const tabs = hasSizeChart
    ? [{ name: "Description" }, { name: "Sizing Details" }]
    : [{ name: "Description" }];
  const activeTabIndex = Math.min(tabIndex, tabs.length - 1);
  return (
    <div
      className="mt-8 space-y-8 animate-fade-up"
      style={{ animationDuration: "0.45s" }}
    >
      <Variants product={product} setProduct={setProduct} isBulkOrder={true} />

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 id="details-heading" className="sr-only">
          Additional details
        </h2>

        <div className="divide-y divide-slate-200 border-t border-slate-200">
          {product.details.map((detail, i) => (
            <Disclosure key={`${detail.name}_${i}`} as="div">
              <h3>
                <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                  <span
                    className="text-sm font-medium text-gray-900"
                    style={{
                      color: "#ffffff",
                    }}
                  >
                    {detail.detail}
                  </span>
                  <span className="ml-6 flex items-center">
                    <PlusIcon
                      aria-hidden="true"
                      className="block h-6 w-6 group-data-[open]:hidden"
                      style={{
                        color: "#ffffff",
                      }}
                    />
                    <MinusIcon
                      aria-hidden="true"
                      className="hidden h-6 w-6 group-data-[open]:block"
                      style={{
                        color: "#ffffff",
                      }}
                    />
                  </span>
                </DisclosureButton>
              </h3>
              <DisclosurePanel className="prose prose-sm pb-6">
                <ul role="list">
                  {detail.values.map((item, j) => (
                    <li key={`${item.value}_${j}`}>{item.value}</li>
                  ))}
                </ul>
              </DisclosurePanel>
            </Disclosure>
          ))}
        </div>
      </section>

      {hasSizeChart ? (
        <div>
          <div>
            <nav aria-label="Tabs" className="flex space-x-3">
              {tabs.map((tab, index) => (
                <div
                  key={tab.name}
                  onClick={() => setTabIndex(index)}
                  className={classNames(
                    "cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200",
                    index === activeTabIndex
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-800",
                  )}
                >
                  {tab.name}
                </div>
              ))}
            </nav>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              {activeTabIndex === 0 && (
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                  className="space-y-6 text-base text-slate-700"
                />
              )}

              {activeTabIndex === 1 && (
                <img
                  src={Array.isArray(sizeChart) ? sizeChart[0] : sizeChart}
                  className="w-auto"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="space-y-6 text-base text-slate-700"
          />
        </div>
      )}
    </div>
  );
};

export default BulkOrder;
