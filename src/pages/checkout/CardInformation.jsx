import { useState } from "react";
import Button from "@/components/Button";
import { useSelector } from "react-redux";
import { PayPalButtons } from "@paypal/react-paypal-js";
import usePost from "@/hooks/usePost";
// import { mountAirwallexCard } from "./airwallexCardInstance";
import {
  // PAYPAL_CAPTURE_ORDER,
  PAYPAL_CREATE_ORDER,
} from "@/constants/services";

const CardInformation = ({
  isValid,
  watch,
  setValue,
  total,
  loading,
  onSubmitPaypal,
  shippingFeeRuleAmount,
  shippingTaxValue,
  creditAmount,
  discountAmount,
}) => {
  const { mutateAsync } = usePost();
  const shop = useSelector((s) => s.shop);
  const selectedShippingWay = watch("selectedShippingWay");
  const agreeTerms = watch("agreeTerms");
  const [paypalLoading, setPaypalLoading] = useState(false);
  // const [airwallexLoading, setAirwallexLoading] = useState(false);
  // const [airwallexError, setAirwallexError] = useState(null);

  const team = watch("selectedTeam");
  const firstName = watch("userName");
  const lastName = watch("userLastName");
  const email = watch("email");
  const phone = watch("phone");
  const products = watch("products");
  const appliedProductDiscountRules =
    watch("appliedProductDiscountRules") || [];

  const discountedProductIdsSet = new Set();
  appliedProductDiscountRules.forEach((rule) => {
    if (Array.isArray(rule?.prodIds)) {
      rule.prodIds.forEach((id) => {
        if (id) discountedProductIdsSet.add(id);
      });
    } else if (rule?.prodId) {
      discountedProductIdsSet.add(rule.prodId);
    }
  });

  // const airwallexConfig = useMemo(() => shop?.airwallex, [shop]);

  // const hasAirwallexData = !!(
  //   airwallexConfig &&
  //   airwallexConfig?.clientId &&
  //   airwallexConfig?.token
  // );
  // const airwallexContainerId = "airwallex-card-container";

  const valid = isValid && !!selectedShippingWay && !!agreeTerms;
  const trimmedFirstName = String(firstName || "").trim();
  const trimmedLastName = String(lastName || "").trim();
  const trimmedEmail = String(email || "").trim();
  const trimmedPhone = String(phone || "").trim();
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const phonePattern = /^\+?\d{10,15}$/;

  const paypalValid =
    !!isValid &&
    !!selectedShippingWay &&
    !!trimmedFirstName &&
    (shop?.teamSelection ? !!team : true) &&
    !!trimmedLastName &&
    emailPattern.test(trimmedEmail) &&
    phonePattern.test(trimmedPhone) &&
    !!agreeTerms;

  // useEffect(() => {
  //   let cleanup = () => {};
  //   let isMounted = true;

  //   if (!hasAirwallexData) {
  //     setAirwallexLoading(false);
  //     setAirwallexError(null);
  //     return cleanup;
  //   }

  //   setAirwallexLoading(true);
  //   setAirwallexError(null);

  //   mountAirwallexCard({
  //     containerId: airwallexContainerId,
  //     airwallexConfig,
  //     onReady: () => {
  //       if (isMounted) {
  //         setAirwallexLoading(false);
  //       }
  //     },
  //     onError: (error) => {
  //       if (isMounted) {
  //         setAirwallexLoading(false);
  //         setAirwallexError(error);
  //       }
  //     },
  //   }).then((destroy) => {
  //     cleanup = destroy || (() => {});
  //   });

  //   return () => {
  //     isMounted = false;
  //     cleanup();
  //   };
  // }, [airwallexConfig, hasAirwallexData]);

  return (
    <div className="mt-4">
      {Number(shop?.customPayment?.paymentPercentage) === 0 &&
      shop?.customPayment?.value ? null : (
        <h2 className="text-lg font-medium text-gray-900">Card information</h2>
      )}

      {shop?.paypal?.clientId &&
        shop?.paypal?.clientSecret &&
        (!shop?.customPayment?.value ||
          (shop?.customPayment?.value &&
            Number(shop?.customPayment?.paymentPercentage) > 0)) &&
        Number(total) > 0 && (
          <div
            className={`mt-4 relative ${
              !paypalValid || paypalLoading
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          >
            {paypalLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                  style={{
                    borderColor: "#000000",
                  }}
                ></div>
              </div>
            )}
            <PayPalButtons
              disabled={!paypalValid || paypalLoading}
              fundingSource="card"
              createOrder={async () => {
                try {
                  setPaypalLoading(true);

                  const paymentPercentageRaw = Number(
                    shop?.customPayment?.paymentPercentage,
                  );
                  const shouldApplyPaymentPercentage =
                    !!shop?.customPayment?.value &&
                    !Number.isNaN(paymentPercentageRaw) &&
                    paymentPercentageRaw >= 0;
                  const paymentMultiplier = shouldApplyPaymentPercentage
                    ? paymentPercentageRaw / 100
                    : 1;

                  const discountEligibleFlags =
                    products?.map((i) => {
                      const productId =
                        i?.prodId ||
                        i?.productId ||
                        i?.id ||
                        i?.orderedCombination?.productId;
                      if (!discountedProductIdsSet.size) {
                        return true;
                      }
                      if (!productId) return false;
                      return discountedProductIdsSet.has(productId);
                    }) || [];

                  // Calculate product items with decorations
                  const productTotals =
                    products?.map((i) => {
                      const orderedCombination = i?.orderedCombination;
                      let itemTotal =
                        Number(orderedCombination?.subTotal || 0) +
                        Number(orderedCombination?.taxValue || 0);
                      const decorations = i?.decorations?.filter(
                        (d) => !!d?.customDecorationUrl,
                      );
                      const totalSetupCost =
                        decorations?.reduce(
                          (acc, d) => acc + Number(d?.setUpCost || 0),
                          0,
                        ) || 0;
                      const setUpCostTax =
                        (totalSetupCost *
                          (orderedCombination?.taxValuePercentage || 0)) /
                          100 || 0;
                      itemTotal += totalSetupCost + setUpCostTax;
                      if (shouldApplyPaymentPercentage) {
                        itemTotal *= paymentMultiplier;
                      }
                      return itemTotal;
                    }) || [];
                  const totalProductAmount = productTotals.reduce(
                    (sum, t) => sum + t,
                    0,
                  );
                  const rawCredit = Number(creditAmount) || 0;
                  const creditToApply =
                    rawCredit *
                    (shouldApplyPaymentPercentage ? paymentMultiplier : 1);

                  let productItems =
                    products?.map((i, idx) => {
                      const orderedCombination = i?.orderedCombination;
                      const qty = Number(orderedCombination?.qty) || 1;
                      const itemTotal = productTotals[idx] ?? 0;
                      const creditShare =
                        totalProductAmount > 0
                          ? (creditToApply * itemTotal) / totalProductAmount
                          : 0;
                      // Calculate unit amount (total minus credit share, per unit)
                      const unitAmount =
                        qty > 0
                          ? (itemTotal - creditShare) / qty
                          : itemTotal - creditShare;

                      return {
                        name: `${i?.name} - ${orderedCombination?.name}`,
                        qty: qty,
                        unit_amount: Number(unitAmount.toFixed(2)),
                      };
                    }) || [];

                  // Apply discount across valid (discounted) items only
                  const numericDiscount = Number(discountAmount) || 0;
                  if (numericDiscount > 0 && productItems.length > 0) {
                    const discountScaled =
                      numericDiscount *
                      (shouldApplyPaymentPercentage ? paymentMultiplier : 1);

                    let discountableTotal = 0;
                    let allTotal = 0;

                    for (let idx = 0; idx < productItems.length; idx++) {
                      const item = productItems[idx];
                      const lineTotal =
                        (Number(item.unit_amount) || 0) *
                        (Number(item.qty) || 0);
                      allTotal += lineTotal;

                      if (
                        !discountedProductIdsSet.size ||
                        discountEligibleFlags[idx]
                      ) {
                        discountableTotal += lineTotal;
                      }
                    }

                    const baseTotal = discountedProductIdsSet.size
                      ? discountableTotal
                      : allTotal;

                    const maxDiscount = Math.min(
                      discountScaled,
                      Math.max(baseTotal, 0),
                    );

                    if (baseTotal > 0 && maxDiscount > 0) {
                      const scale = (baseTotal - maxDiscount) / baseTotal;

                      productItems = productItems.map((item, idx) => {
                        const lineTotal =
                          (Number(item.unit_amount) || 0) *
                          (Number(item.qty) || 0);

                        if (
                          discountedProductIdsSet.size &&
                          !discountEligibleFlags[idx]
                        ) {
                          // Non-discounted item: leave as is
                          return item;
                        }

                        if (lineTotal <= 0) {
                          return item;
                        }

                        const newLineTotal = Number(
                          (lineTotal * scale).toFixed(2),
                        );
                        const qty = Number(item.qty) || 1;
                        const newUnit = newLineTotal / qty;

                        return {
                          ...item,
                          unit_amount: Number(newUnit.toFixed(2)),
                        };
                      });
                    }
                  }

                  // Build items: products + shipping + tax
                  // Build items: products + shipping + tax
                  const items = [...productItems];

                  if (shippingFeeRuleAmount > 0) {
                    items.push({
                      name: "Shipping",
                      qty: 1,
                      unit_amount: Number(
                        (
                          shippingFeeRuleAmount *
                          (shouldApplyPaymentPercentage ? paymentMultiplier : 1)
                        ).toFixed(2),
                      ),
                    });
                  }

                  // Add shipping tax as a separate line item if applicable
                  if (shippingTaxValue > 0) {
                    items.push({
                      name: "Shipping Tax",
                      qty: 1,
                      unit_amount: Number(
                        (
                          shippingTaxValue *
                          (shouldApplyPaymentPercentage ? paymentMultiplier : 1)
                        ).toFixed(2),
                      ),
                    });
                  }

                  // Ensure sum of items matches UI total (after discounts, credit, and custom payment)
                  const uiBaseTotal =
                    Number(total) - (Number.isNaN(Number(total)) ? 0 : 0); // total already includes discount & credit
                  const targetTotal = shouldApplyPaymentPercentage
                    ? Number(
                        (
                          uiBaseTotal *
                          (paymentPercentageRaw > 0
                            ? paymentPercentageRaw / 100
                            : 1)
                        ).toFixed(2),
                      )
                    : Number(Number(total).toFixed(2));

                  const currentItemsTotal = items.reduce(
                    (sum, item) =>
                      sum +
                      (Number(item.unit_amount) || 0) * (Number(item.qty) || 0),
                    0,
                  );

                  const delta = Number(
                    (targetTotal - currentItemsTotal).toFixed(2),
                  );

                  if (Math.abs(delta) >= 0.01) {
                    // Prefer to adjust a discounted item; fallback to last item
                    let adjustIndex = -1;
                    if (discountedProductIdsSet.size) {
                      for (let idx = productItems.length - 1; idx >= 0; idx--) {
                        if (discountEligibleFlags[idx]) {
                          adjustIndex = idx;
                          break;
                        }
                      }
                    }
                    if (adjustIndex === -1) {
                      adjustIndex = items.length - 1;
                    }

                    if (adjustIndex >= 0 && items[adjustIndex]) {
                      const item = items[adjustIndex];
                      const qty = Number(item.qty) || 1;
                      const lineDelta = delta;
                      const unitDelta = lineDelta / qty;
                      const newUnitAmount = Number(
                        ((Number(item.unit_amount) || 0) + unitDelta).toFixed(
                          2,
                        ),
                      );

                      items[adjustIndex] = {
                        ...item,
                        unit_amount: newUnitAmount,
                      };
                    }
                  }

                  const { data } = await mutateAsync({
                    url: PAYPAL_CREATE_ORDER,
                    data: {
                      items,
                      currency: shop?.shopCurrency,
                    },
                  });
                  setPaypalLoading(false);
                  return data?.id;
                } catch (error) {
                  setPaypalLoading(false);

                  throw error;
                }
              }}
              onApprove={async (values) => {
                await onSubmitPaypal(values);
              }}
              onCancel={() => {
                setPaypalLoading(false);
              }}
              onError={(err) => {
                setPaypalLoading(false);
                console.error(err);
                alert("Payment error. Please try again.");
              }}
            />
          </div>
        )}

      {shop?.customPayment?.value && (
        <div className="border-t border-gray-200 pt-5">
          <p className="text-sm text-gray-500">
            Payment Required ($
            {(
              Number(total) *
              (Number(shop?.customPayment?.paymentPercentage) / 100)
            ).toFixed(2)}
            &nbsp;{shop?.shopCurrency})
          </p>
        </div>
      )}

      {((shop?.customPayment?.value &&
        Number(shop?.customPayment?.paymentPercentage) === 0 &&
        shop?.customPayment?.value) ||
        Number(total) <= 0) && (
        <div className="border-t border-gray-200 pt-5">
          <Button
            type="submit"
            disabled={!valid}
            className="w-full"
            isLoading={loading}
          >
            Submit Order
          </Button>
        </div>
      )}

      {Number(shop?.customPayment?.paymentPercentage) !== 0 &&
        shop?.customPayment?.value &&
        Number(total) > 0 && (
          <div className="border-t border-gray-200 pt-5">
            <Button
              type="submit"
              disabled={!valid}
              className="w-full"
              isLoading={loading}
            >
              Pay&nbsp; $
              {(
                Number(total) *
                (Number(shop?.customPayment?.paymentPercentage) / 100)
              ).toFixed(2)}
              &nbsp;{shop?.shopCurrency}
            </Button>
          </div>
        )}

      {!shop?.customPayment?.value && Number(total) > 0 && (
        <div className="border-t border-gray-200 pt-5">
          <Button
            type="submit"
            disabled={!valid}
            className="w-full"
            isLoading={loading}
          >
            Pay&nbsp;
            {`$${total.toFixed(2)}`}
            &nbsp;{shop?.shopCurrency}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CardInformation;
