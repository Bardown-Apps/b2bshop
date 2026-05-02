import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Radio, RadioGroup } from "@headlessui/react";

import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/Button";
import {
  // Login,
  ContactUs,
} from "@/constants/routes";
import {
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useCart from "@/pages/cart/useCart";
import isShopEnabled from "@/utils/enabledShopOn";
import { setCartItemsCount, setItems } from "@/features/cart/cartSlice";
import ProductAddedDialog from "@/pages/product/ProductAddedDialog";
import Decorations from "@/pages/product/Decorations";
import { classNames } from "@/utils/classNames";

const icons = {
  badge: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
      />
    </svg>
  ),
  thumb: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
      />
    </svg>
  ),
  truck: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
      />
    </svg>
  ),
};

const FeatureBadge = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-4">
      <span
        className="inline-flex items-center justify-center rounded-xl w-14 h-14"
        style={{
          backgroundColor: "#0f172a",
        }}
      >
        <span style={{ color: "#ffffff" }}>{icons[icon]}</span>
      </span>
      <span className="text-slate-900 text-xs font-bold whitespace-pre-line">
        {text}
      </span>
    </div>
  );
};

const Variants = ({ product, setProduct, isBulkOrder }) => {
  const dispatch = useDispatch();
  const { itemsCount, items } = useSelector((s) => s?.cart || {});
  const { addToCart, loading } = useCart();
  const shop = useSelector((s) => s?.shop);
  const navigate = useNavigate();
  const { authToken } = useSelector((s) => s?.auth?.user || {});
  const [variants, setVariants] = useState([]);
  const [qty, setQty] = useState(
    product?.minimumQuantity ? Number(product?.minimumQuantity) : 1,
  );

  const [qtyError, setQtyError] = useState("");
  const [sizes, setSizes] = useState([]);
  const [attachedVariantGroups, setAttachedVariantGroups] = useState([]);
  const isShopLive = isShopEnabled(shop?.enableShopOn);
  const isShopActive = shop?.active;
  const [productAddedDialog, setProductAddedDialog] = useState(false);
  const subTotal = Number(product?.price);
  const prevVariantCombinationRef = useRef("");
  const prevPriceRef = useRef("");
  const hasAttachedVariantSections =
    Array.isArray(product?.attachedProducts) &&
    product?.attachedProducts?.length > 0;
  // const baseProductName = product?.name || "Primary Product";
  const sizeColorVariants = (variants || [])
    .filter((v) => v?.variant === "Color" || v?.variant === "Size")
    .sort((a, b) => {
      if (a?.variant === b?.variant) return 0;
      if (a?.variant === "Size") return -1;
      if (b?.variant === "Size") return 1;
      return 0;
    });
  const baseSizeColorVariants = sizeColorVariants?.filter((variant) => {
    if (!variant) return false;
    if (
      hasAttachedVariantSections &&
      (variant?.variant === "Color" || variant?.variant === "Size")
    ) {
      return false;
    }
    return true;
  });
  const shouldRenderBaseSizeColor = baseSizeColorVariants?.length > 0;
  const hasAttachedSizeVariants = attachedVariantGroups?.some((group) =>
    group?.variants?.some((variant) => variant?.variant === "Size"),
  );
  const hasAttachedColorVariants = attachedVariantGroups?.some((group) =>
    group?.variants?.some((variant) => variant?.variant === "Color"),
  );

  const inventory = product?.inventory;
  // const lowLevelThreshold = product?.lowLevelThreshold || 0;
  const customFields = Array.isArray(product?.customFields)
    ? product?.customFields
    : [];
  const actionColumnWidth = "5.25rem";
  const gridTemplateColumns = customFields?.length
    ? `repeat(${customFields?.length}, minmax(6rem, 1fr)) minmax(4.5rem, 0.6fr) minmax(3.5rem, 0.45fr) minmax(${actionColumnWidth}, ${actionColumnWidth})`
    : `minmax(4.5rem, 0.6fr) minmax(3.5rem, 0.45fr) minmax(${actionColumnWidth}, ${actionColumnWidth})`;

  const isOutOfStockInventory = () => {
    if (hasAttachedVariantSections && product?.attachedProducts?.length > 0) {
      for (let i = 0; i < product.attachedProducts.length; i++) {
        const attached = product.attachedProducts[i];
        const attachedProduct = attached?.product || attached;

        // Get the product ID to match with attachedVariantGroups
        const productId =
          attachedProduct?.prodId ||
          attachedProduct?.productId ||
          `attached-${i}`;

        // Find the corresponding group in attachedVariantGroups
        const variantGroup = attachedVariantGroups?.find(
          (group) => group?.id === productId,
        );

        // Check if attached product has inventory tracking enabled
        if (!attached?.makeVariantUnavailable && !shop?.trackInventory) {
          return false;
        }

        const attachedInventory = attached?.inventory;

        if (!attachedInventory || !Array.isArray(attachedInventory)) {
          return false; // No inventory data means out of stock
        }

        // Get selected values from attachedVariantGroups, not from attached?.variants
        const selectedColor = variantGroup?.variants?.find(
          (variant) => variant?.variant === "Color",
        )?.selected;

        const selectedSize = variantGroup?.variants?.find(
          (variant) => variant?.variant === "Size",
        )?.selected;

        if (!selectedColor || !selectedSize) {
          return false;
        }

        // Use attached product's inventory, not base product's inventory
        const inventoryItem = attachedInventory.find(
          (item) => item.color === selectedColor && item.size === selectedSize,
        );

        // If no inventory item found or insufficient quantity, this product is out of stock
        if (!inventoryItem?.count || inventoryItem?.count < Number(qty)) {
          return inventoryItem;
        }
      }

      // All attached products have sufficient inventory
      return false;
    }
  };

  // Function to check if selected color and size combination is out of stock

  const isOutOfStock = () => {
    if (hasAttachedVariantSections && product?.attachedProducts?.length > 0) {
      for (let i = 0; i < product.attachedProducts.length; i++) {
        const attached = product.attachedProducts[i];
        const attachedProduct = attached?.product || attached;

        // Get the product ID to match with attachedVariantGroups
        const productId =
          attachedProduct?.prodId ||
          attachedProduct?.productId ||
          `attached-${i}`;

        // Find the corresponding group in attachedVariantGroups
        const variantGroup = attachedVariantGroups?.find(
          (group) => group?.id === productId,
        );

        // Check if attached product has inventory tracking enabled
        if (!attached?.makeVariantUnavailable && !shop?.trackInventory) {
          return false;
        }

        const attachedInventory = attached?.inventory;

        if (!attachedInventory || !Array.isArray(attachedInventory)) {
          return false; // No inventory data means out of stock
        }

        // Get selected values from attachedVariantGroups, not from attached?.variants
        const selectedColor = variantGroup?.variants?.find(
          (variant) => variant?.variant === "Color",
        )?.selected;

        const selectedSize = variantGroup?.variants?.find(
          (variant) => variant?.variant === "Size",
        )?.selected;

        if (!selectedColor || !selectedSize) {
          return false;
        }

        // Use attached product's inventory, not base product's inventory
        const inventoryItem = attachedInventory.find(
          (item) => item.color === selectedColor && item.size === selectedSize,
        );

        // If no inventory item found or insufficient quantity, this product is out of stock
        if (!inventoryItem?.count || inventoryItem?.count < Number(qty)) {
          return true;
        }
      }

      // All attached products have sufficient inventory
      return false;
    } else {
      if (!product?.makeVariantUnavailable || !shop?.trackInventory) {
        return false;
      }

      if (!inventory || !Array.isArray(inventory)) {
        return false;
      }

      const selectedColor = variants?.find(
        (v) => v?.variant === "Color",
      )?.selected;

      const selectedSize = variants?.find(
        (v) => v?.variant === "Size",
      )?.selected;

      if (!selectedColor || !selectedSize) {
        return false;
      }

      const inventoryItem = inventory.find(
        (item) => item.color === selectedColor && item.size === selectedSize,
      );

      if (!inventoryItem) {
        return true; // If no inventory found for this combination, consider it out of stock
      }

      // return inventoryItem.count <= lowLevelThreshold;
      return !inventoryItem.count || inventoryItem.count < Number(qty);
    }
  };

  const sizeVariants = product?.variants?.find((v) => v?.variant === "Size");

  const variantCombination = variants
    ?.map((v) => {
      return v?.selected;
    })
    ?.join(" | ");

  useEffect(() => {
    const selectedVariant = product?.variantsCombinations?.find(
      (v) => v?.name === variantCombination,
    );

    setProduct({ ...product, variantCombinationImage: selectedVariant?.image });
  }, [variantCombination]);

  useEffect(() => {
    if (!variants?.length && product.variants) {
      setVariants(
        product.variants?.map((v) => {
          if (v?.variant === "Team") {
            const teamValues = [{ value: "Select Team" }, ...v.values];
            return { ...v, values: teamValues, selected: "Select Team" };
          }
          return { ...v, selected: v?.values[0].value };
        }),
      );
    }
  }, [variants, product.variants, product]);

  useEffect(() => {
    if (!hasAttachedVariantSections) {
      setAttachedVariantGroups([]);
      return;
    }

    setAttachedVariantGroups((prevGroups) => {
      const nextGroups =
        product?.attachedProducts?.map((attached, index) => {
          const attachedProduct = attached?.product || attached;
          const productId =
            attachedProduct?.prodId ||
            attachedProduct?.productId ||
            `attached-${index}`;
          const existingGroup = prevGroups?.find(
            (group) => group?.id === productId,
          );
          const label =
            attachedProduct?.name ||
            attached?.name ||
            attachedProduct?.productName ||
            `Attached Product ${index + 1}`;

          const normalizedVariants = (attachedProduct?.variants || []).map(
            (variant) => {
              const previousVariant = existingGroup?.variants?.find(
                (v) => v?.variant === variant?.variant,
              );

              return {
                ...variant,
                selected:
                  previousVariant?.selected ||
                  variant?.selected ||
                  variant?.values?.[0]?.value ||
                  "",
              };
            },
          );

          return {
            id: productId,
            name: label,
            variants: normalizedVariants,
          };
        }) || [];

      return nextGroups;
    });
  }, [product?.attachedProducts, hasAttachedVariantSections]);

  useEffect(() => {
    if (!variants?.length) {
      return;
    }

    const colorVariant = variants.find(
      (variant) => variant?.variant === "Color",
    );

    const remVariant = variants.find(
      (variant) => variant?.variant !== "Color" && variant?.variant !== "Size",
    );

    if (!colorVariant || !remVariant) {
      return;
    }

    const colorSelectedValue = colorVariant.values?.find(
      (value) => value?.value === colorVariant.selected,
    );
    const remSelectedValue = remVariant.values?.find(
      (value) => value?.value === remVariant.selected,
    );

    const colorNextImgUrl = colorSelectedValue?.imgUrl || null;
    const remNextImgUrl = remSelectedValue?.imgUrl || null;

    setProduct((prev) => {
      if (
        prev?.colorVariantImgUrl === colorNextImgUrl &&
        prev?.variantImgUrl === remNextImgUrl
      ) {
        return prev;
      }

      return {
        ...prev,
        colorVariantImgUrl: colorNextImgUrl,
        variantImgUrl: remNextImgUrl,
      };
    });
  }, [variants, setProduct]);

  useEffect(() => {
    const sizeVariants = product?.variants?.find((v) => v?.variant === "Size");
    const values = sizeVariants?.values;

    if (
      !sizes?.length &&
      product?.variants &&
      !!sizeVariants &&
      isBulkOrder &&
      Array.isArray(values) &&
      values.length > 0
    ) {
      const cfSource = Array.isArray(product?.customFields)
        ? product.customFields
        : [];

      setSizes(
        values.map((v) => ({
          value: v?.value ?? "",
          qty: 0,
          customFields: cfSource.map((cf) => ({ ...cf, value: "" })),
        })),
      );
    }
  }, [variants, product.variants, product, isBulkOrder, sizes]);

  const handleBaseColorChange = (variant, value) => {
    const name = variant?.variant;
    setVariants((prev) =>
      prev?.map((item) =>
        item.variant !== name ? item : { ...item, selected: value },
      ),
    );

    const selectedValue = variant?.values?.find(
      (colorValue) => colorValue?.value === value,
    );

    setProduct((prev) => ({
      ...prev,
      colorVariantImgUrl: selectedValue?.imgUrl || null,
    }));
  };

  const handleBaseSizeChange = (variant, value) => {
    const name = variant?.variant;
    setVariants((prev) =>
      prev?.map((item) =>
        item.variant !== name ? item : { ...item, selected: value },
      ),
    );
  };

  const handleAttachedVariantSelection = (groupId, variantName, value) => {
    setAttachedVariantGroups((prev) =>
      prev?.map((group) => {
        if (group?.id !== groupId) {
          return group;
        }

        return {
          ...group,
          variants: group?.variants?.map((variant) =>
            variant?.variant === variantName
              ? { ...variant, selected: value }
              : variant,
          ),
        };
      }),
    );
  };

  const renderColorOptions = (variant, onChange) => {
    if (!variant) return null;
    const values = variant?.values;
    const selected = variant?.selected;

    return (
      <fieldset aria-label="Choose a color" className="mt-2">
        <RadioGroup
          value={selected}
          onChange={(value) => {
            onChange(value);
          }}
          className="flex items-center gap-x-3"
        >
          {values?.map((v) => (
            <Radio
              key={v?.value}
              value={v?.value}
              className={classNames(
                selected === v?.value,
                "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1 ",
              )}
            >
              <span
                style={{
                  backgroundColor: v?.colorCode,
                }}
                className={classNames(
                  "size-8 rounded-full border border-black/10",
                )}
              />
            </Radio>
          ))}
        </RadioGroup>
      </fieldset>
    );
  };

  const renderSizeOptions = (variant, onChange) => {
    if (!variant) return null;
    const values = variant?.values;
    const selected = variant?.selected;

    return (
      <fieldset aria-label="Choose a size" className="mt-2">
        <RadioGroup
          value={selected}
          onChange={(value) => onChange(value)}
          className="grid grid-cols-3 gap-3 sm:grid-cols-4"
        >
          {values?.map((v) => (
            <Radio
              key={v?.value}
              value={v?.value}
              className={classNames(
                "flex items-center justify-center rounded-md border border-gray-200 bg-white px-2 py-2 text-xs font-medium uppercase text-gray-900 hover:bg-gray-50 data-[checked]:border-transparent  data-[checked]:text-white data-[focus]:ring-2  data-[focus]:ring-offset-2  sm:flex-1 data-[checked]:hover:bg-slate-800 data-[focus]:ring-slate-700 data-[checked]:bg-slate-900 cursor-pointer",
              )}
              style={{
                color: v?.value === selected ? "#ffffff" : "inherit",
                backgroundColor: v?.value === selected ? "#0f172a" : "inherit",
              }}
            >
              {v?.value}
            </Radio>
          ))}
        </RadioGroup>
      </fieldset>
    );
  };

  const renderAttachedVariantSections = (type) => {
    if (!hasAttachedVariantSections) return null;

    const sections = attachedVariantGroups
      ?.map((group) => {
        const variant = group?.variants?.find((v) => v?.variant === type);

        if (!variant) {
          return null;
        }

        const label = `${group?.name || "Attached Product"} - ${type}: ${
          variant?.selected || ""
        }`;

        if (type === "Color") {
          return (
            <div key={`${group?.id}_${type}`} className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">{label}</h3>
              </div>
              {renderColorOptions(variant, (value) =>
                handleAttachedVariantSelection(
                  group?.id,
                  variant?.variant,
                  value,
                ),
              )}
            </div>
          );
        }

        if (type === "Size") {
          return (
            <div key={`${group?.id}_${type}`} className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">{label}</h3>
              </div>
              {renderSizeOptions(variant, (value) =>
                handleAttachedVariantSelection(
                  group?.id,
                  variant?.variant,
                  value,
                ),
              )}
            </div>
          );
        }

        return null;
      })
      ?.filter(Boolean);

    if (!sections?.length) {
      return null;
    }

    return <>{sections}</>;
  };

  const renderRemainingVariants = () => {
    return (
      variants?.filter((v) => v?.variant !== "Color" && v?.variant !== "Size")
        ?.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {variants
            ?.filter((v) => v?.variant !== "Color" && v?.variant !== "Size")
            .map((variant, i) => {
              return (
                <Listbox
                  value={variant.selected || ""}
                  onChange={(c) => {
                    setVariants(
                      variants?.map((v) => {
                        if (v.variant !== variant.variant) {
                          return { ...v };
                        }

                        return {
                          ...v,
                          selected: c,
                        };
                      }),
                    );

                    const selectedValue = variant?.values?.find(
                      (value) => value?.value === c,
                    );

                    setProduct((prev) => ({
                      ...prev,
                      variantImgUrl: selectedValue?.imgUrl || null,
                    }));
                  }}
                  key={`${variant.variant}_${i}`}
                >
                  <div>
                    <Label className="block text-sm font-medium leading-6 text-gray-900">
                      {variant?.fieldRequired === "yes" && (
                        <span className="text-red-500">*&nbsp;</span>
                      )}
                      Select&nbsp;
                      {variant.variant}
                      {variant?.fieldRequired === "yes" && (
                        <span className="text-red-500">
                          &nbsp;-&nbsp;Required field
                        </span>
                      )}
                    </Label>
                    <div className="relative mt-2">
                      <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 sm:text-sm sm:leading-6">
                        <span className="block truncate">
                          {variant.selected}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-400"
                          />
                        </span>
                      </ListboxButton>

                      <ListboxOptions
                        transition
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                      >
                        {variant.values.map((value, j) => (
                          <ListboxOption
                            key={`${value.value}_${j}`}
                            value={value.value}
                            className="group relative cursor-default select-none py-2 pl-3 pr-9"
                            style={{
                              color: "#000",
                            }}
                          >
                            <span className="block truncate font-normal group-data-[selected]:font-semibold">
                              {value.value}
                            </span>

                            <span
                              className="absolute inset-y-0 right-0 flex items-center pr-4 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden"
                              style={{
                                color: "#000",
                              }}
                            >
                              <CheckIcon
                                aria-hidden="true"
                                className="h-5 w-5"
                                style={{
                                  color: "#0f172a",
                                }}
                              />
                            </span>
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </div>
                </Listbox>
              );
            })}
        </div>
      )
    );
  };

  useEffect(() => {
    if (
      variantCombination &&
      (prevVariantCombinationRef.current !== variantCombination ||
        prevPriceRef.current !== product?.price)
    ) {
      const selected = product?.variantsCombinations?.find(
        (v) => v?.name === variantCombination,
      );

      if (selected && selected?.price !== product?.price) {
        setProduct({
          ...product,
          price: selected?.price,
          variantCombinationImage: selected?.image,
        });
      }

      prevVariantCombinationRef.current = variantCombination;
      prevPriceRef.current = selected?.price || product?.price;
    }
  }, [variantCombination, product?.variantsCombinations]);

  // Validate quantity when product or minimumQuantity changes
  useEffect(() => {
    if (qty && !isNaN(Number(qty)) && Number(qty) > 0) {
      if (
        product?.minimumQuantity &&
        Number(qty) < Number(product?.minimumQuantity)
      ) {
        setQtyError(`Minimum quantity is ${product.minimumQuantity}`);
      } else {
        setQtyError("");
      }
    }
  }, [product?.minimumQuantity, qty]);

  const teamVariant = variants?.find((v) => v?.variant === "Team");

  // Helper function to check if required variants are selected
  const hasRequiredVariantsSelected = () => {
    return !variants?.some(
      (variant) =>
        variant?.fieldRequired === "yes" &&
        (!variant?.selected || variant?.selected === "Select Team"),
    );
  };

  return (
    <div>
      {isBulkOrder && (
        <>
          {renderRemainingVariants()}
          {!hasAttachedVariantSections && (
            <div className="my-4 py-4 flex flex-col gap-4">
              {variants
                ?.filter((v) => v?.variant === "Color")
                .map((variant) => {
                  const selected = variant?.selected;
                  const name = variant?.variant;
                  const sectionTitle = `${name}: ${selected}`;

                  return (
                    <div key={name}>
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">
                          {sectionTitle}
                        </h2>
                      </div>

                      {name === "Color" &&
                        renderColorOptions(variant, (value) =>
                          handleBaseColorChange(variant, value),
                        )}
                    </div>
                  );
                })}
            </div>
          )}

          {hasAttachedVariantSections && (
            <div className="my-4 py-4 flex flex-col gap-6">
              {hasAttachedSizeVariants && (
                <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-base font-medium text-gray-900">
                    Attached Product Sizes
                  </h3>
                  {renderAttachedVariantSections("Size")}
                </div>
              )}

              {hasAttachedColorVariants && (
                <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-base font-medium text-gray-900">
                    Attached Product Colors
                  </h3>
                  {renderAttachedVariantSections("Color")}
                </div>
              )}
            </div>
          )}

          {sizes?.length > 0 && (
            <div className="my-4 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="text-lg font-medium text-gray-900">
                  Team Order
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="w-full overflow-hidden rounded-lg border border-gray-200">
                  <div
                    className="grid items-center gap-4 px-4 py-2 text-xs font-semibold min-w-0"
                    style={{
                      gridTemplateColumns,
                      backgroundColor: "#0f172a",
                      color: "#ffffff",
                    }}
                  >
                    {customFields?.map((c, i) => (
                      <div
                        key={`sizes_header_custom_${i}`}
                        className="flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{c?.fieldName}</span>
                        {c?.fieldRequired === "yes" && (
                          <span className="flex-none text-red-500 font-semibold">
                            *
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="truncate">SIZE</div>
                    <div className="truncate">QTY</div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSizes((prev) => {
                            const lastSize = prev?.[prev.length - 1];
                            const nextCustomFields =
                              lastSize?.customFields?.length > 0
                                ? lastSize?.customFields?.map((cf) => ({
                                    ...cf,
                                  }))
                                : customFields?.map((cf) => ({ ...cf }));

                            return [
                              ...(prev || []),
                              {
                                value:
                                  lastSize?.value ??
                                  sizeVariants?.values?.[0]?.value ??
                                  "",
                                qty: 0,
                                customFields: nextCustomFields?.map((cf) => ({
                                  ...cf,
                                  value: "",
                                })),
                              },
                            ];
                          });
                        }}
                        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold shadow-sm hover:opacity-90 border border-slate-300"
                        style={{
                          backgroundColor: "#ffffff",
                          color: "#0f172a",
                        }}
                        title="Add new size"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                        <span className="whitespace-nowrap">ADD</span>
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200 bg-white">
                    {sizes?.map((size, index) => {
                      return (
                        <div
                          key={`${size?.value}_${index}`}
                          className="grid items-center gap-4 px-4 py-3 hover:bg-gray-50 min-w-0"
                          style={{ gridTemplateColumns }}
                        >
                          {customFields?.map((c, i) => {
                            const rowCf = size?.customFields?.[i];
                            return (
                              <input
                                key={`size_${index}_custom_${i}`}
                                style={{ minWidth: 0 }}
                                maxLength={
                                  c?.fieldMaxChar
                                    ? Number(c?.fieldMaxChar)
                                    : 100
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    c?.fieldMaxChar &&
                                    value.length > Number(c?.fieldMaxChar)
                                  ) {
                                    return;
                                  }

                                  setSizes((prev) =>
                                    prev?.map((s, j) => {
                                      if (j !== index) return s;
                                      return {
                                        ...s,
                                        customFields: s?.customFields?.map(
                                          (d, k) => {
                                            if (k !== i) return d;
                                            return { ...d, value };
                                          },
                                        ),
                                      };
                                    }),
                                  );
                                }}
                                required={c?.fieldRequired === "yes"}
                                type={c?.fieldType || "text"}
                                value={rowCf?.value || ""}
                                placeholder={`Enter ${c?.fieldName}`}
                                className="min-w-0 block w-full max-w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-800 sm:text-sm sm:leading-6 px-3"
                              />
                            );
                          })}

                          <div className="min-w-0">
                            <select
                              className="block w-full max-w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-800 sm:text-sm sm:leading-6"
                              value={size?.value || ""}
                              onChange={(e) => {
                                const nextValue = e.target.value;
                                setSizes((prev) =>
                                  prev?.map((s, j) =>
                                    j === index
                                      ? { ...s, value: nextValue }
                                      : s,
                                  ),
                                );
                              }}
                            >
                              {sizeVariants?.values?.map((option) => {
                                const selectedColor = variants?.find(
                                  (v) => v?.variant === "Color",
                                )?.selected;
                                const shouldCheckSizeStock =
                                  product?.makeVariantUnavailable &&
                                  shop?.trackInventory &&
                                  Array.isArray(inventory) &&
                                  !!selectedColor;
                                const sizeInventoryItem = shouldCheckSizeStock
                                  ? inventory.find(
                                      (item) =>
                                        item?.color === selectedColor &&
                                        item?.size === option?.value,
                                    )
                                  : null;
                                const isSizeOutOfStock = shouldCheckSizeStock
                                  ? !sizeInventoryItem?.count
                                  : false;

                                return (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                    disabled={isSizeOutOfStock}
                                  >
                                    {option.value}
                                    {shouldCheckSizeStock
                                      ? isSizeOutOfStock
                                        ? " - Out of Stock"
                                        : ""
                                      : ""}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <div className="min-w-0">
                            <input
                              type="number"
                              min="0"
                              value={size?.qty || 0}
                              onChange={(e) => {
                                const nextQty = parseInt(e.target.value);
                                if (Number.isNaN(nextQty) || nextQty < 0) {
                                  return;
                                }
                                setSizes((prev) =>
                                  prev?.map((s, j) =>
                                    j === index ? { ...s, qty: nextQty } : s,
                                  ),
                                );
                              }}
                              className="block w-full max-w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-800 sm:text-sm sm:leading-6 px-3"
                              placeholder="Enter quantity"
                            />
                          </div>

                          <div className="flex w-full justify-end pr-1">
                            <button
                              type="button"
                              onClick={() => {
                                const clonedCustomFields =
                                  size?.customFields?.map((cf) => ({
                                    ...cf,
                                  })) || [];

                                const clonedRow = {
                                  value: size?.value ?? "",
                                  qty: Number(size?.qty ?? 0),
                                  customFields: clonedCustomFields,
                                };

                                setSizes((prev) => {
                                  const safePrev = prev || [];
                                  return [
                                    ...safePrev.slice(0, index + 1),
                                    clonedRow,
                                    ...safePrev.slice(index + 1),
                                  ];
                                });
                              }}
                              className="p-1 rounded-full hover:bg-gray-100"
                              style={{
                                color: "#0f172a",
                              }}
                              title="Clone row"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-5 w-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 6.75h8.5a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5h-8.5a1.5 1.5 0 0 1-1.5-1.5v-8.5a1.5 1.5 0 0 1 1.5-1.5Z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5.25 17.25h-.75A1.5 1.5 0 0 1 3 15.75V7.5A1.5 1.5 0 0 1 4.5 6h.75"
                                />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSizes((prev) =>
                                  prev?.filter((_, j) => j !== index),
                                );
                              }}
                              className="p-1 rounded-full hover:bg-red-100 text-red-600"
                              title="Delete size"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-5 w-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!isBulkOrder && (
        <>
          {shouldRenderBaseSizeColor && (
            <div className="my-4 py-4 flex flex-col gap-4">
              {baseSizeColorVariants?.map((variant) => {
                const selected = variant?.selected;
                const name = variant?.variant;
                const baseSectionTitle = `${name}: ${selected}`;

                return (
                  <div key={name}>
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900">
                        {baseSectionTitle}
                      </h2>
                    </div>

                    {name === "Size" &&
                      renderSizeOptions(variant, (value) =>
                        handleBaseSizeChange(variant, value),
                      )}

                    {name === "Color" &&
                      renderColorOptions(variant, (value) =>
                        handleBaseColorChange(variant, value),
                      )}
                  </div>
                );
              })}
            </div>
          )}

          {hasAttachedVariantSections && (
            <div className="my-4 py-4 flex flex-col gap-6">
              {hasAttachedSizeVariants && (
                <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-base font-medium text-gray-900">
                    Attached Product Sizes
                  </h3>
                  {renderAttachedVariantSections("Size")}
                </div>
              )}

              {hasAttachedColorVariants && (
                <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-base font-medium text-gray-900">
                    Attached Product Colors
                  </h3>
                  {renderAttachedVariantSections("Color")}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {renderRemainingVariants()}

            {product?.customFields?.map((c, i) => {
              return (
                <div key={`customField${i}`}>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    {c?.fieldRequired === "yes" && (
                      <span className="text-red-500">*&nbsp;</span>
                    )}
                    {c?.fieldName} ($
                    {Number(c?.fieldPrice || 0)}&nbsp;
                    {shop?.shopCurrency})
                    {c?.fieldRequired === "yes" && (
                      <span className="text-red-500 font-semibold">
                        &nbsp; - Required {c?.fieldName}
                      </span>
                    )}
                  </label>

                  {c?.fieldMaxChar && (
                    <label className="block text-xs font-medium leading-6 text-gray-500 italic">
                      (Max. {c?.fieldMaxChar} characters allowed)
                    </label>
                  )}

                  <div className="mt-2">
                    <input
                      maxLength={
                        c?.fieldMaxChar ? Number(c?.fieldMaxChar) : 100
                      }
                      onChange={(e) => {
                        const value = e.target.value;

                        if (
                          c?.fieldMaxChar &&
                          value.length > Number(c?.fieldMaxChar)
                        ) {
                          return;
                        }

                        setProduct({
                          ...product,
                          customFields: product.customFields?.map((d, j) => {
                            if (i !== j) return { ...d };
                            return { ...d, value };
                          }),
                        });
                      }}
                      required={c?.fieldRequired === "yes"}
                      type={c?.fieldType || "text"}
                      value={c?.value || ""}
                      placeholder={`Please enter ${c?.fieldName}`}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-800 sm:text-sm sm:leading-6 px-3"
                    />
                  </div>
                </div>
              );
            })}

            {/* {isShopLive && isShopActive && ( */}
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Quantity{" "}
                <span className="text-xs text-gray-500">
                  (Min Qty: {product?.minimumQuantity || 1})
                </span>
              </label>
              <div className="mt-2">
                <Input
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Allow empty input for user to clear and re-enter
                    if (inputValue === "") {
                      setQty("");
                      setQtyError("Please enter a quantity");
                      return;
                    }

                    // Allow negative sign while typing
                    if (inputValue === "-") {
                      setQty(inputValue);
                      setQtyError("Please enter a valid quantity");
                      return;
                    }

                    const newValue = parseInt(inputValue, 10);
                    if (!isNaN(newValue)) {
                      // Allow any positive number to be entered
                      setQty(newValue);

                      // Validate against minimumQuantity
                      if (newValue <= 0) {
                        setQtyError("Please enter a valid quantity");
                      } else if (
                        product?.minimumQuantity &&
                        newValue < Number(product?.minimumQuantity)
                      ) {
                        setQtyError(
                          `Minimum quantity is ${product.minimumQuantity}`,
                        );
                      } else {
                        setQtyError("");
                      }
                    } else {
                      // Invalid input (not a number)
                      setQty(inputValue);
                      setQtyError("Please enter a valid quantity");
                    }
                  }}
                  type="number"
                  value={qty}
                  placeholder="Please enter quantity"
                  className={`block w-full rounded-lg bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-inset transition-all duration-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset ${
                    qtyError
                      ? "ring-red-300 focus:ring-red-500"
                      : "ring-slate-300 focus:ring-slate-800"
                  }`}
                />
                {qtyError && (
                  <p className="mt-1 text-sm text-red-600">{qtyError}</p>
                )}
              </div>
            </div>
            {/* )} */}
          </div>
        </>
      )}

      {!isBulkOrder && (
        <Decorations product={product} setProduct={setProduct} />
      )}

      {/* {isShopLive && isShopActive && ( */}
      <div className="mt-10 flex">
        {isNaN(Number(product.price)) ? (
          <Button className="w-full" onClick={() => navigate(ContactUs.path)}>
            Contact us
          </Button>
        ) : (
          <Button
            isLoading={loading}
            className="w-full"
            disabled={
              // isOutOfStock()
              //   ? true
              //   : isBulkOrder
              //     ? !sizes?.find((s) => s?.qty > 0) ||
              //       sizes?.some((size) =>
              //         size?.customFields?.some(
              //           (cf) => cf?.fieldRequired === "yes" && !cf?.value,
              //         ),
              //       )
              //     :
              teamVariant?.selected === "Select Team" ||
              product?.customFields?.some(
                (cf) => cf?.fieldRequired === "yes" && !cf?.value,
              ) ||
              !hasRequiredVariantsSelected() ||
              isOutOfStock() ||
              !qty ||
              qty === "" ||
              isNaN(Number(qty)) ||
              Number(qty) <= 0 ||
              (product?.minimumQuantity &&
                Number(qty) < Number(product?.minimumQuantity)) ||
              !!qtyError
            }
            onClick={async () => {
              if (isBulkOrder) {
                const filteredSizes = sizes?.filter((s) => s?.qty > 0);
                let payloadArray = [];

                try {
                  const cartPromises = filteredSizes.map(async (size) => {
                    let variantCombination = [];
                    const variantkeyCombinations = {};

                    variantkeyCombinations["Size"] = size?.value;
                    variantCombination.push(size?.value);

                    for (let j = 0; j < variants.length; j++) {
                      const variant = variants[j];
                      const value = variant?.selected;

                      if (variant.variant === "Size") continue;

                      variantCombination.push(value);
                      variantkeyCombinations[variant.variant] = value;
                    }

                    let customFieldPrice = 0;

                    for (
                      let index = 0;
                      index < size?.customFields?.length;
                      index++
                    ) {
                      const customField = size?.customFields[index];

                      if (customField?.value) {
                        customFieldPrice += Number(customField?.fieldPrice);
                      }
                    }

                    let price = Number(subTotal + customFieldPrice);

                    const decorations = product?.decorations?.filter(
                      (d) => !!d?.customDecorationUrl,
                    );

                    if (decorations?.length > 0) {
                      for (let index = 0; index < decorations.length; index++) {
                        price += Number(decorations[index]?.price);
                      }
                    }

                    const payload = {
                      ...product,
                      customFields: size?.customFields,
                      orderedCombination: {
                        ...variantkeyCombinations,
                        name: variantCombination.join(" | "),
                        qty: Number(size?.qty),
                        unitPrice: price,
                        subTotal: price * Number(size?.qty),
                      },
                    };
                    payloadArray.push(payload);

                    if (!authToken) {
                      // setProductAddedDialog(payload);

                      return;
                    }

                    return await addToCart(payload);
                  });

                  await Promise.all(cartPromises);

                  if (!authToken) {
                    dispatch(setItems({ items: [...items, ...payloadArray] }));
                    dispatch(
                      setCartItemsCount({
                        count: itemsCount + payloadArray?.length,
                      }),
                    );
                  }
                  setProductAddedDialog(payloadArray);
                } catch (error) {
                  console.error("Error adding items to cart:", error);
                  // Handle error appropriately
                }
              } else {
                let variantCombination = [];
                const variantkeyCombinations = {};

                for (let index = 0; index < variants.length; index++) {
                  const variant = variants[index];
                  const value = variant?.selected;

                  variantCombination.push(value);
                  variantkeyCombinations[variant.variant] = value;
                }

                let customFieldPrice = 0;

                for (
                  let index = 0;
                  index < product?.customFields?.length;
                  index++
                ) {
                  const customField = product?.customFields[index];

                  if (customField?.value) {
                    customFieldPrice += Number(customField?.fieldPrice);
                  }
                }

                let price = Number(subTotal + customFieldPrice);

                const decorations = product?.decorations?.filter(
                  (d) => !!d?.customDecorationUrl,
                );

                if (decorations?.length > 0) {
                  for (let index = 0; index < decorations.length; index++) {
                    price += Number(decorations[index]?.price);
                  }
                }

                const attachedProductsSelection =
                  product?.attachedProducts?.length > 0
                    ? attachedVariantGroups
                        ?.map((group) => {
                          const selectedVariants =
                            group?.variants?.map(({ variant, selected }) => ({
                              variant,
                              selected,
                            })) || [];

                          if (!selectedVariants.length) {
                            return null;
                          }

                          return {
                            id: group?.id,
                            name: group?.name,
                            variants: selectedVariants,
                          };
                        })
                        ?.filter(Boolean)
                    : [];

                const payload = {
                  ...product,
                  orderedCombination: {
                    ...variantkeyCombinations,
                    name: variantCombination.join(" | "),
                    qty: Number(qty),
                    unitPrice: price,
                    subTotal: price * Number(qty),
                  },
                  ...(attachedProductsSelection?.length
                    ? { attachedProductsSelection }
                    : {}),
                };

                if (!authToken) {
                  dispatch(setItems({ items: [...items, payload] }));
                  dispatch(setCartItemsCount({ count: itemsCount + 1 }));
                  setProductAddedDialog(payload);
                  return;
                }

                await addToCart(payload);
                setProductAddedDialog(payload);
              }
            }}
          >
            {/* {isOutOfStock()
                ? `Out of Stock${
                    product?.productCode === "BUNDLE" ||
                    product?.productCode === "Bundle"
                      ? ` - ${isOutOfStockInventory()?.color} | ${
                          isOutOfStockInventory()?.size
                        }`
                      : ` - ${
                          variants?.find((v) => v?.variant === "Color")
                            ?.selected
                        } | ${
                          variants?.find((v) => v?.variant === "Size")?.selected
                        }`
                  }`
                : "Add to bag"} */}
            Add to bag
          </Button>
        )}
      </div>
      {/* )} */}

      {(shop?.showProductFeatures ||
        shop?.showProductFeatures === undefined) && (
        <div className="flex justify-between mt-10">
          <FeatureBadge icon="badge" text={"5-STAR\nSERVICE"} />
          <FeatureBadge icon="thumb" text={"100%\nPERFORMANCE\nGUARANTEE"} />
          <FeatureBadge icon="truck" text={"FAST\nSHIPPING"} />
        </div>
      )}

      {productAddedDialog && (
        <ProductAddedDialog
          open={!!productAddedDialog}
          setOpen={setProductAddedDialog}
          product={product}
          qty={qty}
          payload={productAddedDialog}
          isBulkOrder={isBulkOrder}
        />
      )}
    </div>
  );
};

export default Variants;
