import Slider from "react-slick";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFieldArray } from "react-hook-form";
import {
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { setCartItemsCount, setItems } from "@/features/cart/cartSlice";
import ArrivalEstimation from "@/components/ArrivalEstimation";
import Button from "@/components/Button";
import { Cart } from "@/constants/routes";
import OrderPreviewDialog from "./OrderPreviewDialog";

const OrderSummary = ({
  control,
  deleteProductFromCart,
  getSubTotal,
  total,
  shippingFeeRuleAmount,
  watch,
  shippingRates,
  discountAmount,
  applicalbleRule,
  rules,
  setValue,
  appliedDiscountRule,
  setAppliedDiscountRule,
  appliedProductDiscountRules = [],
  addAppliedProductDiscountRule,
  removeAppliedProductDiscountRule,
  creditAmount,
  creditleft,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authToken = useSelector((s) => s?.auth?.token);

  const { itemsCount, items } = useSelector((s) => s.cart);
  const shop = useSelector((s) => s.shop);

  const { fields, remove } = useFieldArray({ control, name: "products" });
  const shippingTaxValuePercentage = watch("shippingTaxValuePercentage");
  const shippingTaxValue = watch("shippingTaxValue");
  const couponCode = watch("couponCode") || "";

  const hasDiscount = discountAmount > 0;

  const [isOrderPreviewOpen, setIsOrderPreviewOpen] = useState(false);
  const [orderPreviewSearch, setOrderPreviewSearch] = useState("");

  const discountRules = rules?.discountRules || [];

  const normalizeDiscountRuleId = (rule) => {
    const raw = rule?._id ?? rule?.id;
    if (raw == null || raw === "") return null;
    if (typeof raw === "object" && raw !== null && "$oid" in raw) {
      return String(raw.$oid);
    }
    return String(raw);
  };

  /** Same promotion even when API omits id on one payload or uses BSON shape */
  const discountRulesSemanticallyEqual = (a, b) => {
    if (!a || !b) return false;
    if (a.discountBased !== b.discountBased) return false;
    if (Number(a.discountPercentage ?? NaN) !== Number(b.discountPercentage ?? NaN)) {
      return false;
    }
    const keyA = String(a.keyword ?? "").trim().toUpperCase();
    const keyB = String(b.keyword ?? "").trim().toUpperCase();
    return keyA === keyB;
  };

  const discountRulesMatch = (a, b) => {
    if (!a || !b) return false;
    const idA = normalizeDiscountRuleId(a);
    const idB = normalizeDiscountRuleId(b);
    if (idA != null && idB != null) return idA === idB;
    return discountRulesSemanticallyEqual(a, b);
  };

  const getRuleProductIds = (rule) => {
    return Array.isArray(rule?.prodIds)
      ? rule.prodIds
      : rule?.prodId
        ? [rule.prodId]
        : [];
  };

  const getRuleProductNames = (rule) => {
    const qualifyingIds = getRuleProductIds(rule);
    if (qualifyingIds.length === 0) return [];

    const namesFromItems = Array.isArray(items)
      ? items
          .filter((item) => qualifyingIds.includes(item?.prodId))
          .map((item) => ({ name: item?.name, prodId: item?.prodId }))
          .filter(Boolean)
      : [];

    return namesFromItems;
  };

  // Only products that are in the rule AND in cart with qty >= min (applicable = discount applies to these)
  const getApplicableProductNamesForRule = (rule) => {
    const { productQuantitiesById } = calculateTotals();
    const qualifyingIds = getRuleProductIds(rule);
    const minQty = Number(rule?.keyword) || 1;
    if (qualifyingIds.length === 0) return [];

    return (Array.isArray(items) ? items : [])
      .filter(
        (item) =>
          qualifyingIds.includes(item?.prodId) &&
          (productQuantitiesById?.[item?.prodId] || 0) >= minQty,
      )
      .map((item) => ({ name: item?.name, prodId: item?.prodId }))
      .filter(Boolean);
  };

  const getDiscountRuleDescription = (rule) => {
    const discountType = rule?.discountBased;
    const keyword = rule?.keyword;
    const percentage = rule?.discountPercentage;

    switch (discountType) {
      case "quantity": {
        return `Order ${keyword}+ items to get ${percentage}% off`;
      }
      case "subTotal": {
        return `Spend $${keyword}+ to get ${percentage}% off`;
      }
      case "weight": {
        return `Order ${keyword}+ pounds to get ${percentage}% off`;
      }
      case "product": {
        const products = getRuleProductNames(rule);
        const productNames =
          products?.map((p) => p?.name).filter(Boolean) || [];
        const baseText =
          productNames.length > 0
            ? `Buy ${productNames.join(", ")}`
            : "Buy qualifying product(s)";

        const minQty = Number(rule?.keyword) || 1;
        const qtyText = minQty > 1 ? ` (${minQty}+ items each)` : "";

        return `${baseText}${qtyText} to get ${percentage}% off`;
      }
      case "coupon": {
        return `Use coupon code "${keyword}" to get ${percentage}% off`;
      }
      default: {
        return `Get ${percentage}% off`;
      }
    }
  };

  // Calculate totals for discount condition checks
  const calculateTotals = () => {
    let totalQuantity = 0;
    let totalWeight = 0;
    const subtotal = getSubTotal();
    const productQuantitiesById = {};

    fields?.forEach((product) => {
      const qty = Number(product?.orderedCombination?.qty) || 0;
      totalQuantity += qty;

      let weight = 0;
      if (product?.orderedCombination?.weight) {
        weight = Number(product?.orderedCombination?.weight) || 0;
      } else if (product?.variantsCombinations?.length > 0) {
        const variant = product?.variantsCombinations?.find(
          (v) => v?.name === product?.orderedCombination?.name,
        );
        weight = Number(variant?.weight) || 0;
      }
      totalWeight += weight * qty;

      const productId =
        product?.prodId ||
        product?.productId ||
        product?.id ||
        product?.orderedCombination?.productId;

      if (productId) {
        productQuantitiesById[productId] =
          (productQuantitiesById[productId] || 0) + qty;
      }
    });

    return { totalQuantity, totalWeight, subtotal, productQuantitiesById };
  };

  // Check if a discount rule condition is fulfilled
  const isDiscountConditionMet = (rule) => {
    const { totalQuantity, totalWeight, subtotal, productQuantitiesById } =
      calculateTotals();
    const keyword = Number(rule?.keyword) || 0;
    const discountType = rule?.discountBased;

    switch (discountType) {
      case "quantity": {
        return totalQuantity >= keyword;
      }
      case "subTotal": {
        return subtotal >= keyword;
      }
      case "weight": {
        return totalWeight >= keyword;
      }
      case "product": {
        const qualifyingProdIds = getRuleProductIds(rule);
        if (qualifyingProdIds.length === 0) return false;

        const minQty = Number(rule?.keyword) || 1;

        for (const prodId of qualifyingProdIds) {
          const qty = productQuantitiesById?.[prodId] || 0;
          if (qty >= minQty) return true;
        }
        return false;
      }
      case "coupon": {
        // For coupon discounts, always allow applying if rule exists (code will be set on apply)
        // If already applied, check if the coupon code matches from form state
        if (discountRulesMatch(appliedDiscountRule, rule)) {
          const couponToCheck = couponCode;
          return (
            couponToCheck &&
            couponToCheck.trim().toUpperCase() === rule?.keyword?.toUpperCase()
          );
        }
        // If not applied yet, allow applying (code will be set automatically)
        return true;
      }
      default: {
        return false;
      }
    }
  };

  // Check if a discount is currently applied
  const isDiscountApplied = (rule) => {
    if (rule?.discountBased === "product") {
      return (appliedProductDiscountRules || []).some((r) =>
        discountRulesMatch(r, rule),
      );
    }
    return discountRulesMatch(appliedDiscountRule, rule);
  };

  // Get reason why discount condition is not met
  const getDiscountReason = (rule) => {
    const { totalQuantity, totalWeight, subtotal, productQuantitiesById } =
      calculateTotals();
    const keyword = Number(rule?.keyword) || 0;
    const discountType = rule?.discountBased;

    switch (discountType) {
      case "quantity": {
        if (totalQuantity < keyword) {
          const needed = keyword - totalQuantity;
          return `You need ${needed} more item${
            needed > 1 ? "s" : ""
          } to qualify (Currently: ${totalQuantity} item${
            totalQuantity !== 1 ? "s" : ""
          }, Required: ${keyword}+)`;
        }
        return null;
      }
      case "subTotal": {
        if (subtotal < keyword) {
          const needed = (keyword - subtotal).toFixed(2);
          return `You need $${needed} more to qualify (Current: $${subtotal.toFixed(
            2,
          )}, Required: $${keyword}+)`;
        }
        return null;
      }
      case "weight": {
        if (totalWeight < keyword) {
          const needed = (keyword - totalWeight).toFixed(2);
          return `You need ${needed} more pound${
            parseFloat(needed) > 1 ? "s" : ""
          } to qualify (Current: ${totalWeight.toFixed(
            2,
          )} lbs, Required: ${keyword}+ lbs)`;
        }
        return null;
      }
      case "product": {
        const qualifyingProdIds = getRuleProductIds(rule);
        if (qualifyingProdIds.length === 0) {
          return "This discount is not configured with any qualifying products";
        }

        const minQty = Number(rule?.minQty || rule?.keyword) || 1;
        const productNames =
          getRuleProductNames(rule)
            ?.map((p) => p?.name)
            .filter(Boolean) || [];
        const productLabel =
          productNames.length > 0
            ? productNames.join(", ")
            : "qualifying product(s)";

        const hasAnyQualifying = qualifyingProdIds.some(
          (id) => (productQuantitiesById?.[id] || 0) >= minQty,
        );
        if (hasAnyQualifying) return null;

        return `Add ${productLabel} (${minQty}+ items each) to qualify`;
      }
      case "coupon": {
        if (
          !couponCode ||
          couponCode.trim().toUpperCase() !== rule?.keyword?.toUpperCase()
        ) {
          return `Click "Apply" to use coupon code "${rule?.keyword}" for ${rule?.discountPercentage}% off`;
        }
        return null;
      }
      default: {
        return "This discount cannot be applied";
      }
    }
  };

  // Handle apply discount
  const handleApplyDiscount = (rule) => {
    const canApply =
      rule?.discountBased === "coupon" || isDiscountConditionMet(rule);

    if (!canApply) return;

    if (rule?.discountBased === "product") {
      addAppliedProductDiscountRule?.(rule);
    } else {
      setAppliedDiscountRule(rule);
      setValue("appliedDiscountRule", rule);
      if (rule?.discountBased === "coupon" && rule?.keyword) {
        setValue("couponCode", rule.keyword.toUpperCase());
      }
    }
  };

  // Handle remove discount (optional rule: when provided, remove that rule only; otherwise clear all discounts)
  const handleRemoveDiscount = (rule) => {
    if (rule?.discountBased === "product") {
      removeAppliedProductDiscountRule?.(rule);
    } else if (rule) {
      setAppliedDiscountRule(null);
      setValue("appliedDiscountRule", null);
      setValue("couponCode", "");
    } else {
      setAppliedDiscountRule(null);
      setValue("appliedDiscountRule", null);
      setValue("couponCode", "");
      setValue("appliedProductDiscountRules", []);
    }
  };

  // Subtotal for applicable products only. Use total qty per productId (same prodId in multiple line items = qty summed).
  const getQualifyingProductSubtotal = (rule) => {
    if (rule?.discountBased !== "product") return 0;
    const { productQuantitiesById } = calculateTotals();
    const qualifyingProdIds = getRuleProductIds(rule);
    const minQty = Number(rule?.keyword) || 1;
    if (qualifyingProdIds.length === 0) return 0;

    let qualifyingSubtotal = 0;
    fields?.forEach((product) => {
      const productId =
        product?.prodId ||
        product?.productId ||
        product?.id ||
        product?.orderedCombination?.productId;
      if (!productId || !qualifyingProdIds.includes(productId)) return;

      const totalQtyForProduct = productQuantitiesById?.[productId] || 0;
      if (totalQtyForProduct < minQty) return;

      const oc = product?.orderedCombination;
      qualifyingSubtotal +=
        Number(oc?.subTotal || 0) + Number(oc?.taxValue || 0);

      const decorations = product?.decorations?.filter(
        (d) => !!d?.customDecorationUrl,
      );
      const totalSetupCost =
        decorations?.reduce((acc, d) => acc + Number(d?.setUpCost), 0) || 0;
      const setUpCostTax =
        (totalSetupCost * Number(oc?.taxValuePercentage || 0)) / 100 || 0;
      qualifyingSubtotal += totalSetupCost + setUpCostTax;
    });
    return Number(qualifyingSubtotal.toFixed(2));
  };

  // Calculate potential savings for a discount rule
  const calculatePotentialSavings = (rule) => {
    const discountType = rule?.discountBased;

    // "product" type: discount applies only to qualifying product(s), not whole order
    if (discountType === "product") {
      const qualifyingSubtotal = getQualifyingProductSubtotal(rule);
      if (rule?.discountPercentage) {
        const discountPercentage = Number(rule.discountPercentage) || 0;
        return Number(
          ((qualifyingSubtotal * discountPercentage) / 100).toFixed(2),
        );
      }
      if (rule?.discountValue) {
        return Math.min(Number(rule.discountValue) || 0, qualifyingSubtotal);
      }
      return 0;
    }

    const subtotal = getSubTotal();
    if (rule?.discountPercentage) {
      const discountPercentage = Number(rule.discountPercentage) || 0;
      return Number(((subtotal * discountPercentage) / 100).toFixed(2));
    } else if (rule?.discountValue) {
      return Number(rule.discountValue) || 0;
    }
    return 0;
  };

  // Get the best discount (highest savings) based on discount percentage
  const getBestDiscount = () => {
    // Calculate potential savings for all discounts (regardless of conditions)
    const allDiscounts = discountRules
      .map((rule) => ({
        rule,
        savings: calculatePotentialSavings(rule),
        discountPercentage: Number(rule?.discountPercentage) || 0,
      }))
      .sort((a, b) => {
        // First sort by savings amount (highest first)
        if (b.savings !== a.savings) {
          return b.savings - a.savings;
        }
        // If savings are equal, sort by discount percentage (highest first)
        return b.discountPercentage - a.discountPercentage;
      });

    return allDiscounts.length > 0 ? allDiscounts[0] : null;
  };

  const bestDiscount = getBestDiscount();

  return (
    <div className="mt-10 lg:mt-0">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
        <button
          type="button"
          onClick={() => setIsOrderPreviewOpen(true)}
          className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm hover:opacity-90"
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
          }}
        >
          Order preview
        </button>
      </div>

      <OrderPreviewDialog
        isOpen={isOrderPreviewOpen}
        onClose={() => setIsOrderPreviewOpen(false)}
        orderPreviewSearch={orderPreviewSearch}
        setOrderPreviewSearch={setOrderPreviewSearch}
        fields={fields}
        accentBgColor="#000000"
        accentTextColor="#ffffff"
      />

      {creditAmount ? (
        <div
          className="my-3 rounded-xl border p-4 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(236,72,153,0.16) 45%, rgba(16,185,129,0.16) 100%)",
            borderColor: "rgba(99,102,241,0.35)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <InformationCircleIcon
                aria-hidden="true"
                className="size-5"
                style={{ color: "#111827" }}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
                Available credit
              </p>
              <p className="mt-1 text-sm text-slate-700">
                You can apply{" "}
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold shadow-sm"
                  style={{
                    background:
                      "linear-gradient(90deg, #000000 0%, #ec4899 50%, #14b8a6 100%)",
                    color: "#fff",
                  }}
                >
                  ${Number(creditAmount)?.toFixed(2)}
                </span>{" "}
                on this order.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <h3 className="sr-only">Items in your cart</h3>
        <ul role="list" className="divide-y divide-gray-200">
          {fields?.map((product, productIdx) => {
            const isOrderFormItem = !!product?.orderForm;
            const decorations = !isOrderFormItem
              ? product?.decorations?.filter((d) => !!d?.customDecorationUrl)
              : [];

            const totalSetupCost =
              decorations?.reduce((acc, d) => acc + Number(d?.setUpCost), 0) ||
              0;

            const setUpCostTax = !isOrderFormItem
              ? (totalSetupCost *
                  product?.orderedCombination?.taxValuePercentage) /
                  100 || 0
              : 0;

            const orderFormTeams = product?.orderForm?.teams || [];
            const orderFormCombinationsCount = orderFormTeams.reduce(
              (acc, team) => acc + (team?.orderCombinations?.length || 0),
              0,
            );

            const getOrderFormSubTotal = () => {
              if (!product?.orderForm?.teams?.length) return 0;
              let sum = 0;
              for (const team of product.orderForm.teams) {
                for (const combo of team?.orderCombinations || []) {
                  sum += Number(combo?.subTotal || 0);
                }
              }
              return sum;
            };

            const orderFormSubTotal = getOrderFormSubTotal();
            const orderFormTaxValue = Number(product?.orderForm?.taxValue || 0);
            const orderFormTaxPercentage = Number(
              product?.orderForm?.taxValuePercentage || 0,
            );
            const orderFormLineTotal = orderFormSubTotal + orderFormTaxValue;

            return (
              <li key={product.id} className="flex px-4 py-6 sm:px-6">
                <div className="flex-shrink-0">
                  <img
                    alt={product.name}
                    src={product.defaultImageUrl}
                    className="w-20 rounded-md"
                  />
                </div>

                <div className="ml-6 flex flex-1 flex-col">
                  <div className="flex">
                    <div className="min-w-0 flex-1">
                      {isOrderFormItem ? (
                        <>
                          <h4 className="text-sm">{product.name}</h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Team order form — {orderFormCombinationsCount} item
                            {orderFormCombinationsCount === 1 ? "" : "s"}
                          </p>
                        </>
                      ) : product?.attachedProductsSelection?.length > 0 ? (
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm">{product.name}</h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {product.orderedCombination.name}
                            </p>
                          </div>
                          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Attached Products
                            </p>
                            <div className="mt-3 space-y-3">
                              {product?.attachedProductsSelection?.map(
                                (group, groupIdx) => (
                                  <div
                                    key={group?.id || `${groupIdx}`}
                                    className="rounded-lg border border-gray-200 bg-white p-3"
                                  >
                                    <p className="text-sm font-medium text-gray-900">
                                      {group?.name || "Attached Product"}
                                    </p>
                                    {group?.variants?.length ? (
                                      <dl className="mt-2 space-y-1 text-xs text-gray-500">
                                        {group?.variants?.map((variant, i) => (
                                          <div
                                            key={`${group?.id || groupIdx}_${
                                              variant?.variant || i
                                            }`}
                                            className="flex items-center justify-between"
                                          >
                                            <dt className="font-medium text-gray-600">
                                              {variant?.variant}
                                            </dt>
                                            <dd className="text-gray-900">
                                              {variant?.selected || "—"}
                                            </dd>
                                          </div>
                                        ))}
                                      </dl>
                                    ) : (
                                      <p className="mt-2 text-xs text-gray-400">
                                        No variant selections
                                      </p>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h4 className="text-sm">{product.name}</h4>
                          {!isOrderFormItem && (
                            <p className="mt-1 text-sm text-gray-500">
                              {product.orderedCombination.name}
                            </p>
                          )}
                          {product?.estimeArrivalDate && (
                            <div className="mt-1">
                              <ArrivalEstimation
                                estimeArrivalDate={product?.estimeArrivalDate}
                                size="xs"
                              />
                            </div>
                          )}
                          <p className="mt-1 text-sm text-gray-500">
                            {product.size}
                          </p>

                          {decorations
                            ?.filter((s) => !!s?.customDecorationUrl)
                            .map((d) => (
                              <div
                                key={d?.name}
                                className="border border-dashed border-gray-500 rounded-lg p-2 mb-1"
                              >
                                <p className="mt-1 text-xs text-gray-500">
                                  Custom Decoration: {d?.location} | {d?.name}
                                  &nbsp;
                                  <a
                                    className="underline text-[#000]"
                                    // style={{
                                    // }}
                                    href={d?.customDecorationUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    (Artfile)
                                  </a>
                                </p>
                                {d?.notes && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    Notes: {d?.notes}
                                  </p>
                                )}
                              </div>
                            ))}
                        </>
                      )}
                    </div>

                    <div className="ml-4  flex gap-2 items-center">
                      {/* <Button
                        onClick={() => {
                          if (authToken) {
                            deleteProductFromCart(product);
                          } else {
                            dispatch(
                              setItems({
                                items: items.filter((p, i) => i !== productIdx),
                              })
                            );

                            dispatch(
                              setCartItemsCount({ count: itemsCount - 1 })
                            );
                          }

                          remove(productIdx);
                        }}
                      >
                        <span className="sr-only">Remove</span>
                        <TrashIcon aria-hidden="true" className="h-5 w-5" />
                      </Button> */}
                      <Button
                        onClick={() => {
                          navigate(Cart.path);
                        }}
                      >
                        <PencilIcon aria-hidden="true" className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {product.customFields?.map(
                    (f, i) =>
                      f.value && (
                        <div className="mt-1 flex text-sm" key={i}>
                          <p className="text-gray-500">
                            {f.fieldName} : {f.value}
                          </p>
                        </div>
                      ),
                  )}

                  <div className="flex flex-1 items-end justify-between mt-2">
                    {!isOrderFormItem && (
                      <>
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          Unit Price
                        </p>
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          ${product.orderedCombination.unitPrice.toFixed(2)}
                        </p>
                      </>
                    )}
                  </div>

                  {!isOrderFormItem && (
                    <>
                      <div className="flex flex-1 items-end justify-between">
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          Quantity
                        </p>
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          {product.orderedCombination.qty}
                        </p>
                      </div>

                      {decorations?.length > 0 && (
                        <div className="flex flex-1 items-end justify-between">
                          <p className="mt-1 text-sm font-normal text-gray-900">
                            Setup Cost (Per Line Item Cost)
                          </p>
                          <p className="mt-1 text-sm font-normal text-gray-900">
                            ${totalSetupCost.toFixed(2)}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-1 items-end justify-between">
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          Sub Total
                        </p>
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          $
                          {(
                            product.orderedCombination.subTotal + totalSetupCost
                          ).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-1 items-end justify-between">
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          Tax ({product?.orderedCombination?.taxValuePercentage}
                          %)
                        </p>
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          $
                          {(
                            product?.orderedCombination?.taxValue + setUpCostTax
                          )?.toFixed(2)}
                        </p>
                      </div>
                    </>
                  )}

                  {isOrderFormItem && (
                    <>
                      <div className="flex flex-1 items-end justify-between">
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          Sub Total
                        </p>
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          ${orderFormSubTotal.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between">
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          Tax ({orderFormTaxPercentage}%)
                        </p>
                        <p className="mt-1 text-sm font-normal text-gray-900">
                          ${orderFormTaxValue.toFixed(2)}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex flex-1 items-end justify-between">
                    <p className="mt-1 text-sm font-normal text-gray-900">
                      Line Item Total
                    </p>
                    <p className="mt-1 text-sm font-normal text-gray-900">
                      $
                      {isOrderFormItem
                        ? orderFormLineTotal.toFixed(2)
                        : Number(
                            (product.orderedCombination.subTotal || 0) +
                              (product?.orderedCombination?.taxValue || 0) +
                              totalSetupCost +
                              setUpCostTax,
                          ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
          {discountRules.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Available Discounts
                </h3>
                {hasDiscount && (
                  <Button onClick={handleRemoveDiscount} size="sm">
                    Remove Discount
                  </Button>
                )}
              </div>
              <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                <div className="hidden md:grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700">
                  <span>Discount</span>
                  <span className="text-right"></span>
                </div>
                <div className="divide-y divide-gray-200">
                  {discountRules.map((rule, index) => {
                    const isConditionMet = isDiscountConditionMet(rule);
                    const isApplied = isDiscountApplied(rule);

                    const isCoupon = rule?.discountBased === "coupon";
                    // For coupon discounts, allow applying even if condition not met (code will be set on apply)
                    const canApply = isCoupon || isConditionMet;
                    const reasonMessage =
                      !canApply && !isApplied ? getDiscountReason(rule) : null;
                    const potentialSavings = calculatePotentialSavings(rule);
                    const isBestDiscount =
                      bestDiscount &&
                      discountRulesMatch(bestDiscount.rule, rule);
                    const isBestButNotApplied = isBestDiscount && !isApplied;

                    return (
                      <div
                        key={rule?._id || index}
                        className="px-3 py-3 md:px-4 md:py-3"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3 md:gap-4 items-center">
                          <div className="space-y-2 flex flex-col justify-center">
                            {isBestButNotApplied && (
                              <div
                                className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold"
                                style={{
                                  backgroundColor: "#000000",
                                  color: "#ffffff",
                                }}
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                  />
                                </svg>
                                <span>
                                  Best Deal - Save $
                                  {potentialSavings.toFixed(2)}
                                </span>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                                style={{
                                  color: "#ffffff",
                                  backgroundColor: "#000000",
                                }}
                              >
                                {rule?.discountPercentage}% OFF
                              </span>
                              <span className="text-xs font-semibold text-green-700">
                                Save ${potentialSavings.toFixed(2)}
                              </span>
                              {isApplied && (
                                <span className="text-xs text-green-700 font-medium">
                                  ✓ Active
                                </span>
                              )}
                            </div>

                            <p className="text-xs md:text-sm font-medium text-gray-900">
                              {rule?.discountBased === "product"
                                ? (() => {
                                    const applicable =
                                      getApplicableProductNamesForRule(rule);
                                    const names =
                                      applicable
                                        ?.map((p) => p?.name)
                                        .filter(Boolean) || [];
                                    const uniqueNames = [...new Set(names)];
                                    if (uniqueNames.length > 0) {
                                      return `${
                                        rule?.discountPercentage
                                      }% off on: ${uniqueNames.join(", ")}`;
                                    }
                                    return getDiscountRuleDescription(rule);
                                  })()
                                : getDiscountRuleDescription(rule)}
                            </p>

                            {reasonMessage && (
                              <div className="mt-1 rounded-md bg-amber-50 border border-amber-200 p-2">
                                <div className="flex items-start gap-2">
                                  <svg
                                    className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <p className="text-xs font-medium text-amber-800 leading-relaxed">
                                    {reasonMessage}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-start md:items-end justify-center gap-1 md:gap-2">
                            <div className="flex items-center justify-start md:justify-end gap-2">
                              {isApplied ? (
                                <Button
                                  type="button"
                                  onClick={() => handleRemoveDiscount(rule)}
                                >
                                  Remove
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleApplyDiscount(rule)}
                                  disabled={!canApply}
                                >
                                  {isBestButNotApplied
                                    ? "Apply Best Deal"
                                    : "Apply"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {hasDiscount && (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-red-400">
                {appliedProductDiscountRules?.length > 0 && !applicalbleRule
                  ? "Discounts"
                  : `Discount${
                      applicalbleRule?.discountPercentage != null
                        ? ` (${applicalbleRule.discountPercentage}%)`
                        : ""
                    }`}
              </dt>
              <dd className="text-sm font-medium text-red-400">
                -${discountAmount?.toFixed(2)}&nbsp;{shop?.shopCurrency}
              </dd>
            </div>
          )}

          <div className="flex items-center justify-between">
            <dt className="text-sm">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900">
              ${(getSubTotal() - discountAmount)?.toFixed(2)}&nbsp;
              {shop?.shopCurrency}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-sm">Shipping + Handling</p>
              {shippingRates?.serviceName && (
                <p className="text-sm text-gray-500 font-normal italic">
                  ({shippingRates?.serviceName} - {shippingRates?.weight}
                  &nbsp;pounds)
                </p>
              )}
            </div>

            <dd className="text-sm font-medium text-gray-900">
              ${Number(shippingFeeRuleAmount)?.toFixed(2)}&nbsp;
              {shop?.shopCurrency}
            </dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-sm">
              Shipping Tax ({shippingTaxValuePercentage}%)
            </dt>
            <dd className="text-sm font-medium text-gray-900">
              ${shippingTaxValue?.toFixed(2)}&nbsp;{shop?.shopCurrency}
            </dd>
          </div>

          {creditAmount ? (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <dt className="text-base font-medium">Credit Amount</dt>
              <dd className="text-base font-medium text-gray-900">
                ${Number(creditAmount)?.toFixed(2)}
              </dd>
            </div>
          ) : null}

          {creditAmount ? (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <dt className="text-base font-medium">Credit Used</dt>
              <dd className="text-base font-medium text-gray-900">
                ${Number(creditAmount - creditleft())?.toFixed(2)}
              </dd>
            </div>
          ) : null}

          {creditAmount ? (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <dt className="text-base font-medium">Credit Left</dt>
              <dd className="text-base font-medium text-gray-900">
                ${Number(creditleft())?.toFixed(2)}
              </dd>
            </div>
          ) : null}

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <dt className="text-base font-medium">Total Paid</dt>
            <dd className="text-base font-medium text-gray-900">
              ${Number(total) <= 0 ? 0 : total.toFixed(2)}
            </dd>
          </div>

          {shop?.customPayment?.value && (
            <div className="flex items-center justify-between pt-2">
              <dt className="text-base font-medium">
                Payment Required ({shop?.customPayment?.paymentPercentage}%)
              </dt>
              <dd className="text-base font-medium text-gray-900">
                $
                {(
                  Number(total) *
                  (Number(shop?.customPayment?.paymentPercentage) / 100)
                ).toFixed(2)}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default OrderSummary;
