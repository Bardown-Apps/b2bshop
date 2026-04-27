import { useEffect } from "react";
import { useSelector } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CustomerInformation from "@/pages/checkout/CustomerInformation";
import OrderSummary from "@/pages/checkout/OrderSummary";
import useCheckout from "@/pages/checkout/useCheckout";
import useCart from "@/pages/cart/useCart";
import EmptyState from "@/components/EmptyState";

const Checkout = () => {
  const {
    control,
    handleSubmit,
    onSubmit,
    isValid,
    watch,
    setValue,
    getSubTotal,
    total,
    shippingFeeRuleAmount,
    loading,
    countries,
    rules,
    isCountriesFetching,
    isRulesFetching,
    updateProducts,
    getValues,
    // getShippingRates,
    shippingRates,
    onPOOrderSubmit,
    onSubmitPaypal,
    discountAmount,
    applicalbleRule,
    appliedDiscountRule,
    setAppliedDiscountRule,
    appliedProductDiscountRules,
    addAppliedProductDiscountRule,
    removeAppliedProductDiscountRule,
    creditAmount,
    creditleft,
  } = useCheckout();

  const country = watch("country");
  const state = watch("state");
  const products = watch("products");
  const shippingProperty = watch("shippingProperty");
  const authToken = useSelector((s) => s?.auth?.token);
  const { items } = useSelector((s) => s.cart);

  const { fetchCartData, deleteProductFromCart } = useCart();

  const { customPayment } = useSelector((s) => s.shop);
  const paypalClientId = useSelector((s) => s?.shop?.paypal?.clientId);

  const getCartData = async () => {
    let data;

    if (authToken) {
      data = await fetchCartData();
    } else {
      data = items;
    }

    if (data?.length > 0) {
      updateProducts(data);

      if (countries?.length > 0) {
        setValue("country", countries[1].name);
        setValue("state", countries[1].states[0]?.name);
      }
    }
  };

  useEffect(() => {
    if (countries && rules) {
      getCartData();
      document.title = "Checkout";
    }
  }, [countries, rules]);

  useEffect(() => {
    if (country && state && products?.length > 0) {
      const currentProducts = getValues("products");
      updateProducts(currentProducts);
    }
  }, [country, state, shippingProperty]);

  if (isCountriesFetching || isRulesFetching) return null;

  if (!products?.length) {
    return (
      <div className="mt-3">
        <EmptyState
          title="Cart is empty"
          description="Please add products in cart"
          plusTitle="Add Products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <h1 className="sr-only">Checkout</h1>

        <PayPalScriptProvider options={{ clientId: paypalClientId || "test" }}>
          <form
            className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
            onSubmit={
              (customPayment?.paymentPercentage == "0" &&
                customPayment?.value) ||
              Number(total) <= 0
                ? handleSubmit(onPOOrderSubmit)
                : handleSubmit(onSubmit)
            }
          >
            <CustomerInformation
              control={control}
              isValid={isValid}
              watch={watch}
              setValue={setValue}
              total={total}
              loading={loading}
              countries={countries?.slice(1)}
              products={products}
              // getShippingRates={getShippingRates}
              onPOOrderSubmit={onPOOrderSubmit}
              onSubmit={onSubmit}
              onSubmitPaypal={onSubmitPaypal}
              shippingFeeRuleAmount={shippingFeeRuleAmount}
              creditAmount={creditAmount}
              discountAmount={discountAmount}
            />

            <OrderSummary
              control={control}
              deleteProductFromCart={deleteProductFromCart}
              getSubTotal={getSubTotal}
              total={total}
              shippingFeeRuleAmount={shippingFeeRuleAmount}
              watch={watch}
              rules={rules}
              setValue={setValue}
              shippingRates={shippingRates}
              discountAmount={discountAmount}
              applicalbleRule={applicalbleRule}
              appliedDiscountRule={appliedDiscountRule}
              setAppliedDiscountRule={setAppliedDiscountRule}
              appliedProductDiscountRules={appliedProductDiscountRules}
              addAppliedProductDiscountRule={addAppliedProductDiscountRule}
              removeAppliedProductDiscountRule={
                removeAppliedProductDiscountRule
              }
              creditAmount={creditAmount}
              creditleft={creditleft}
            />
          </form>
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default Checkout;
