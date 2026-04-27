import { useState } from "react";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { PhotoIcon, DocumentIcon } from "@heroicons/react/24/outline";
import Button from "@/components/Button";
import { classNames } from "@/utils/classNames";
import openCloudinaryWidget from "@/utils/cloudinary";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";

const isFileType = (url, extensions) => {
  if (!url) return false;
  return extensions.some((ext) =>
    url.toLowerCase().endsWith(`.${ext.toLowerCase()}`),
  );
};

const FilePreview = ({ url }) => {
  const isPdf = isFileType(url, ["pdf"]);
  const isDst = isFileType(url, ["dst"]);
  const isAi = isFileType(url, ["ai"]);
  const isFilePreview = isPdf || isDst || isAi;

  if (!isFilePreview) {
    return (
      <img
        src={url}
        alt="Uploaded decoration"
        className="w-full h-full object-contain border bg-gray-50"
      />
    );
  }

  let fileType = "";
  if (isPdf) fileType = "PDF";
  if (isDst) fileType = "DST";
  if (isAi) fileType = "AI";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center border bg-gray-50 space-y-4">
      <DocumentIcon className="w-20 h-20 text-gray-400" />
      <div className="text-lg font-medium text-gray-900">{fileType} File</div>
    </div>
  );
};

const Decorations = ({ product, setProduct }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { shopCurrency } = useSelector((s) => s?.shop);
  const userId = useSelector(
    (s) => s?.auth?.user?.userId || s?.auth?.user?._id || "unknown-user",
  );
  if (!product?.decorations?.length) return null;

  const title =
    product?.decorations?.find((d) => d?.title)?.title || "Customizations";

  return (
    <Disclosure
      as="div"
      className="border-b border-t border-gray-200 py-6 mt-6"
    >
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-gray-400 hover:text-gray-500">
          <div className="relative">
            <span className="text-lg font-medium text-gray-900">{title}</span>
            <span className="absolute -top-1 -right-10 inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white">
              New
            </span>
          </div>

          <span className="ml-6 flex items-center">
            <PlusIcon
              aria-hidden="true"
              className="size-6 group-data-[open]:hidden"
            />
            <MinusIcon
              aria-hidden="true"
              className="size-6 group-[&:not([data-open])]:hidden"
            />
          </span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel className="pt-6">
        <div>
          <nav aria-label="Tabs" className="flex space-x-4">
            {product?.decorations.map((tab, index) => (
              <div
                key={tab.name}
                onClick={() => setTabIndex(index)}
                className={classNames(
                  index === tabIndex ? `font-bold` : "cursor-pointer",
                  `rounded-md px-3 py-2 text-sm font-medium border border-gray-300`,
                )}
                style={{
                  color: index === tabIndex ? "#ffffff" : "inherit",
                  backgroundColor: index === tabIndex ? "#000000" : "inherit",
                }}
              >
                {tab.location}
              </div>
            ))}
          </nav>

          <div className="mt-6 border rounded-lg p-6 bg-white shadow-sm">
            <div>
              {/* Image Preview Section */}

              {product?.decorations && product?.decorations[tabIndex] && (
                <p className="text-black pb-2">
                  {product?.decorations[tabIndex]?.name} : $
                  {Number(product?.decorations[tabIndex]?.price)?.toFixed(2)}{" "}
                  {shopCurrency} will be added
                </p>
              )}

              {product?.decorations &&
                product?.decorations[tabIndex]?.setUpCost && (
                  <p className="text-black pb-2">
                    Setup Cost : $
                    {Number(product?.decorations[tabIndex]?.setUpCost)?.toFixed(
                      2,
                    )}{" "}
                    {shopCurrency} will be added at checkout
                  </p>
                )}

              {product?.decorations[tabIndex]?.customDecorationUrl ? (
                <div className="relative group">
                  <div className="relative w-full h-64 overflow-hidden rounded-lg">
                    <FilePreview
                      url={product.decorations[tabIndex].customDecorationUrl}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    <button
                      onClick={() => {
                        setProduct({
                          ...product,
                          decorations: product.decorations.map((d, j) =>
                            tabIndex === j
                              ? { ...d, customDecorationUrl: null }
                              : d,
                          ),
                        });
                      }}
                      className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 bg-gray-50">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex justify-center flex-col items-center">
                    <Button
                      onClick={async () => {
                        openCloudinaryWidget({
                          clientAllowedFormats:
                            product?.decorations[tabIndex].fileTypes,
                          maxFileSize:
                            Number(product?.decorations[tabIndex].maxSize) *
                            1000000,
                          folder: `B2BLab/${userId}/CustomDecoration/${product?.prodId}`,
                          cb: async (v) => {
                            setProduct({
                              ...product,
                              decorations: product?.decorations?.map((d, j) => {
                                if (tabIndex !== j) return { ...d };
                                return {
                                  ...d,
                                  customDecorationUrl: v?.secure_url,
                                };
                              }),
                            });
                          },
                        });
                      }}
                      className="mt-2"
                    >
                      Upload
                    </Button>
                    <p className="mt-2 text-sm text-gray-500">
                      Maximum size{" "}
                      {Number(product?.decorations[tabIndex].maxSize)} MB
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supported formats:{" "}
                      {product?.decorations[tabIndex].fileTypes.join(", ")}
                    </p>
                  </div>
                </div>
              )}

              <textarea
                className="w-full h-24  border-gray-300 rounded-lg p-2 mt-4"
                value={product?.decorations[tabIndex]?.notes}
                placeholder="Notes"
                onChange={(e) => {
                  setProduct({
                    ...product,
                    decorations: product.decorations.map((d, j) =>
                      tabIndex === j ? { ...d, notes: e.target.value } : d,
                    ),
                  });
                }}
              />
            </div>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Decorations;
