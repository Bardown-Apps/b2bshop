import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import usePost from "@/hooks/usePost";
import { generateShortUuid, generateUniquePassword } from "@/utils/uuid";
import { Summary } from "@/constants/routes";
import useCart from "@/pages/cart/useCart";
import {
  CRYPTO_KEY,
  PAYPAL_CAPTURE_ORDER,
  // SHIPPING_RATES,
  USER_CREDIT_AMOUNT,
  PO_ORDER_SUBMIT,
} from "@/constants/services";
import { login as setUser } from "@/store/slices/authSlice";
import useUserCreditAmount from "@/hooks/useUserCreditAmount";
import useCountries from "@/hooks/useCountries";
import useRules from "@/hooks/useRules";

const useCheckout = () => {
  const navigate = useNavigate();
  const [shippingRates, setShippingRates] = useState(null);
  const auth = useSelector((s) => s?.auth || {});
  const userState = { ...(auth?.user || {}), authToken: auth?.token || null };
  const salesRepName = auth?.user?.salesReps?.[0]?.name || "";
  const salesRepLastName = auth?.user?.salesReps?.[0]?.lastName || "";
  const salesRepPhone = auth?.user?.salesReps?.[0]?.phoneNumber || "";
  const salesRepEmail = auth?.user?.salesReps?.[0]?.email || "";
  const { data: creditAmount } = useUserCreditAmount();
  const { name, email, phone } = userState;
  const {
    shopName,
    shippingWays,
    shipStationConnection,
    customPayment,
    shopCurrency,
  } = useSelector((state) => state.shop);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { mutateAsync } = usePost();
  const { fetchCartData } = useCart();

  const saveSummaryOrderSnapshot = (orderNumber, metadata) => {
    if (!orderNumber || !metadata) return;
    const summaryOrder = {
      orderNumber,
      orderedItems: metadata?.orderedItems || [],
      paymentDetails: metadata?.paymentDetails || {},
      shippingAddress: metadata?.shippingAddress || {},
      billingAddress: metadata?.billingAddress || {},
    };
    sessionStorage.setItem(
      `summary-order-${orderNumber}`,
      JSON.stringify(summaryOrder),
    );
  };

  const getShippingRates = async (postalCode) => {
    let totatlWeight = 0;

    for (let index = 0; index < products?.length; index++) {
      const product = products[index];
      const orderedCombination = product?.orderedCombination;
      let weight = 0;

      if (orderedCombination?.weight) {
        weight +=
          Number(orderedCombination?.qty) * Number(orderedCombination?.weight);
      } else {
        weight +=
          Number(orderedCombination?.qty) *
          Number(
            product?.variantsCombinations?.find(
              (v) => v?.name === product?.orderedCombination?.name,
            )?.weight,
          );
      }

      if (!weight) {
        return;
      }

      totatlWeight += weight;
    }

    const payload = {
      apiKey: shipStationConnection?.apiKey,
      apiSecret: shipStationConnection?.apiSecret,
      code: shipStationConnection?.selectedCarrier?.code,
      country: countries?.find((c) => c?.name === country)?.code2,
      postalCode,
      weight: totatlWeight,
      markup: shipStationConnection?.markUpPercentage,
    };

    // const { data } = await mutateAsync({
    //   url: SHIPPING_RATES,
    //   data: payload,
    // });

    // if (data?.finalShippingPrice) {
    //   setShippingRates(data);
    // }

    // setShippingRates(data);
  };

  const { data: countries, isFetching: isCountriesFetching } = useCountries();
  const { data: rules, isFetching: isRulesFetching } = useRules();

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { isValid },
    watch,
  } = useForm({
    mode: "all",
    defaultValues: {
      products: [],
      name: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      country:
        shippingWays?.find((s) => s?.name === "Pickup" && s?.value)?.country ||
        "",
      state:
        shippingWays?.find((s) => s?.name === "Pickup" && s?.value)?.state ||
        "",
      postalCode: "",
      phone: phone || salesRepPhone,
      shippingTaxValuePercentage: 0,
      shippingTaxValue: 0,
      shippingWayShipFee: -1,
      userName: salesRepName,
      userLastName: salesRepLastName,
      selectedShippingWay: "",
      appliedDiscountRule: null,
      appliedProductDiscountRules: [],
      couponCode: "",
      salesRepEmail: salesRepEmail,
    },
  });

  const shippingProperty = watch("shippingProperty");
  const shippingWayShipFee = getValues("shippingWayShipFee");
  const formName = getValues("name");
  const formUserName = getValues("userName");
  const formUserLastName = getValues("userLastName");
  const formEmail = getValues("email");
  const formPhone = getValues("phone");
  const products = getValues("products");
  const country = watch("country");
  const state = watch("state");
  const shippingTaxValue = watch("shippingTaxValue");
  const shippingTaxValuePercentage = watch("shippingTaxValuePercentage");

  useEffect(() => {
    if (name && !formEmail && !formUserName && !formUserLastName) {
      setValue("name", name);
      setValue("userName", name);
      setValue("userLastName", name);
    }
  }, [formEmail, name, setValue, formUserName, formUserLastName]);

  useEffect(() => {
    if (email && !formEmail) {
      setValue("email", email);
    }
  }, [formEmail, email]);

  useEffect(() => {
    if (phone && !formPhone) {
      setValue("phone", phone);
    }
  }, [formPhone, phone]);

  const onSubmitPaypal = async (values) => {
    const name = getValues("userName");
    const email = getValues("email");
    const addressLine1 = getValues("addressLine1");
    const addressLine2 = getValues("addressLine2");
    const city = getValues("city");
    const state = getValues("state");
    const postalCode = getValues("postalCode");
    const country = getValues("country");
    const phone = getValues("phone");
    const selectedTeam = getValues("selectedTeam");
    const shippingProperty = getValues("shippingProperty");

    const newTotal = customPayment?.paymentPercentage
      ? Number(
          (getSubTotal() + shippingFeeRuleAmount + shippingTaxValue) *
            (customPayment?.paymentPercentage / 100),
        )
      : total;

    let signUpEmail = "";
    let signUpName = "";
    let userData = null;

    setLoading(true);

    const orderNumber = generateShortUuid(6);

    const payload = {
      orderID: values.orderID,
      shopName,
      shopUrl: `https://${window.location.hostname}`,
      amount: newTotal * 100,
      // amount: total * 100,
      email: email || signUpEmail,
      name: name || signUpName,
      shippingAddress: {
        name: name || signUpName,
        address: addressLine1,
        address2: addressLine2,
        city: city,
        state: state,
        postal_code: postalCode,
        country: country,
      },
      billingAddress: {
        name: name || signUpName,
        address: addressLine1,
        address2: addressLine2,
        city: city,
        state: state,
        postal_code: postalCode,
        country: country,
      },
      orderNumber,
      metadata: {
        orderNumber,
        dataCollection: getValues("dataCollection"),
        shopCurrency,
        customPayment,
        phone: phone,
        paymentStatus: customPayment?.value ? "Pending" : "Paid",
        selectedTeam: selectedTeam,
        appliedDiscountRule: getValues("appliedDiscountRule"),
        appliedProductDiscountRules:
          getValues("appliedProductDiscountRules") || [],
        customerEmail: email,
        customerName: name,
        customerLastName: formUserLastName,
        shippingProperty: shippingProperty,

        orderedItems: products,
        attachedProductsSelection:
          products
            ?.map((product) =>
              product?.attachedProductsSelection?.length
                ? {
                    productId: product?.id,
                    attachedProductsSelection:
                      product?.attachedProductsSelection,
                  }
                : null,
            )
            ?.filter(Boolean) || [],
        shippingAddress: {
          name: name || signUpName,
          address: addressLine1,
          address2: addressLine2,
          city: city,
          state: state,
          postal_code: postalCode,
          country: country,
        },
        billingAddress: {
          name: name || signUpName,
          address: addressLine1,
          address2: addressLine2,
          city: city,
          state: state,
          postal_code: postalCode,
          country: country,
        },
        billToAddress: {
          name: name || signUpName,
          address: addressLine1,
          address2: addressLine2,
          city: city,
          state: state,
          postal_code: postalCode,
          country: country,
        },
        sameBillingShipping: true,
        shippingService: "Standard",
        selectedDeliveryMethod: "Standard",
        paymentDetails: {
          subTotal: getSubTotal(),
          taxEstimate: Number(tax.toFixed(2)),
          orderTotal: total,
          totalWeight: "",
          shippingCost: shippingFeeRuleAmount,
          shippingTaxValuePercentage,
          shippingTaxValue,
          creditAmount: Number(creditAmount),
          creditLeft: 0,
        },
      },
    };

    const { data: response } = await mutateAsync({
      url: PAYPAL_CAPTURE_ORDER,
      data: payload,
    });

    if (response?.success) {
      await updateCreditLeft(false);
    }

    setLoading(true);

    setLoading(false);

    if (response?.status === "succeeded") {
      saveSummaryOrderSnapshot(orderNumber, payload?.metadata);
      navigate(`${Summary.path}/${orderNumber}`);
    }
  };

  const onSubmit = async (values) => {
    values?.preventDefault?.();
    alert(
      "Card checkout is unavailable. Please complete payment using PayPal.",
    );
  };

  const onPOOrderSubmit = async (values) => {
    const newTotal = customPayment?.paymentPercentage
      ? Number(
          (getSubTotal() + shippingFeeRuleAmount + shippingTaxValue) *
            (customPayment?.paymentPercentage / 100),
        )
      : total;

    setLoading(true);

    let signUpEmail = "";
    let signUpName = "";
    // let signUpLastName = "";
    let userData = null;

    if (
      !values.shippingProperty.name &&
      !values?.shippingProperty?.parentPickUp?.name
    ) {
      alert("Please select a shipping method!!");
      setLoading(false);
      return;
    }

    if (
      values.name == undefined ||
      values.addressLine1 == undefined ||
      values.country == undefined ||
      values.state == undefined
    ) {
      alert("Please enter shipping address!!");
      setLoading(false);
      return;
    }

    setLoading(true);

    const orderNumber = generateShortUuid(6);

    const poMetadata = {
      dataCollection: getValues("dataCollection"),
      paymentStatus: "Pending",
      customPayment,
      attachedProductsSelection:
        products
          ?.map((product) =>
            product?.attachedProductsSelection?.length
              ? {
                  productId: product?.id,
                  attachedProductsSelection: product?.attachedProductsSelection,
                }
              : null,
          )
          ?.filter(Boolean) || [],
      selectedTeam: values?.selectedTeam,
      appliedDiscountRule: getValues("appliedDiscountRule"),
      appliedProductDiscountRules:
        getValues("appliedProductDiscountRules") || [],
      customerEmail: email || signUpEmail,
      customerName: name || signUpName,
      customerLastName: formUserLastName,
      shippingProperty: values.shippingProperty?.parentPickUp
        ? values.shippingProperty?.parentPickUp
        : values.shippingProperty,
      orderedItems: products,
      shippingAddress: {
        name: values.name,
        address: values.addressLine1,
        address2: values.addressLine2,
        city: values.city,
        state: values.state,
        postal_code: values.postalCode,
        country: values.country,
      },
      billingAddress: {
        name: values.name,
        address: values.addressLine1,
        address2: values.addressLine2,
        city: values.city,
        state: values.state,
        postal_code: values.postalCode,
        country: values.country,
      },
      billToAddress: {
        name: values.billToName,
        address: values.billToAddress,
        address2: values.billToAddress2,
        city: values.billToCity,
        state: values.billToState,
        postal_code: values.billToPostalCode,
        country: values.billToCountry,
      },
      sameBillingShipping: true,
      shippingService: "Standard",
      selectedDeliveryMethod: "Standard",
      paymentDetails: {
        subTotal: getSubTotal(),
        taxEstimate: Number(tax.toFixed(2)),
        orderTotal: total,
        totalWeight: "",
        shippingCost: shippingFeeRuleAmount,
        shippingTaxValuePercentage,
        shippingTaxValue,
        creditAmount: Number(creditAmount),
        creditLeft: creditleft(),
      },
    };

    const { data } = await mutateAsync({
      url: PO_ORDER_SUBMIT,
      data: {
        orderNumber,
        paymentMethodId: "",
        orderType: "PO Order",
        // amount: newTotal * 100,
        amount: 0,
        email: email || signUpEmail,
        name: name || signUpName,
        shippingAddress: {
          name: values.name,
          address: values.addressLine1,
          address2: values.addressLine2,
          city: values.city,
          state: values.state,
          postal_code: values.postalCode,
          country: values.country,
        },
        billingAddress: {
          name: values.name,
          address: values.addressLine1,
          address2: values.addressLine2,
          city: values.city,
          state: values.state,
          postal_code: values.postalCode,
          country: values.country,
        },
        metadata: poMetadata,
        orderNumber,
      },
    });

    if (data?.success) {
      await updateCreditLeft(true);
    }

    await fetchCartData();

    setLoading(false);

    if (data?.status == "success") {
      saveSummaryOrderSnapshot(orderNumber, data?.metadata || poMetadata);
      navigate(`${Summary.path}/${orderNumber}`);
    } else {
      alert("Server error, please try again later!!");
    }
  };

  const getSubTotal = () => {
    let subTotal = 0;

    for (let i = 0; i < products?.length; i++) {
      const product = products[i];

      // Team order form items: aggregate subtotal + tax from nested combinations.
      if (product?.orderForm) {
        const of = product.orderForm;
        if (of?.teams?.length) {
          for (const team of of.teams) {
            for (const combo of team?.orderCombinations || []) {
              subTotal += Number(combo?.subTotal || 0);
            }
          }
        }
        subTotal += Number(of?.taxValue || 0);
        continue;
      }

      const orderedCombination = product?.orderedCombination;
      if (!orderedCombination) continue;

      subTotal += orderedCombination.subTotal + orderedCombination.taxValue;

      const decorations = product.decorations?.filter(
        (d) => !!d?.customDecorationUrl,
      );

      const totalSetupCost =
        decorations?.reduce((acc, d) => acc + Number(d?.setUpCost), 0) || 0;

      const setUpCostTax =
        (totalSetupCost * orderedCombination?.taxValuePercentage) / 100 || 0;

      subTotal += totalSetupCost + setUpCostTax;
    }

    return Number(subTotal.toFixed(2));
  };

  const appliedDiscountRule = watch("appliedDiscountRule");
  const appliedProductDiscountRules =
    watch("appliedProductDiscountRules") || [];
  const productsWatched = watch("products");
  const couponCodeWatched = watch("couponCode") || "";

  const getRuleProductIds = (rule) =>
    Array.isArray(rule?.prodIds)
      ? rule.prodIds
      : rule?.prodId
        ? [rule.prodId]
        : [];

  const getCheckoutTotals = () => {
    let totalQuantity = 0;
    let totalWeight = 0;
    const productQuantitiesById = {};
    const prods = getValues("products") || [];
    for (let i = 0; i < prods?.length; i++) {
      const product = prods[i];
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
    }
    const subtotal = getSubTotal();
    return {
      totalQuantity,
      totalWeight,
      subtotal,
      productQuantitiesById,
    };
  };

  const isDiscountConditionMet = (rule, totals, couponCode) => {
    const { totalQuantity, totalWeight, subtotal, productQuantitiesById } =
      totals || getCheckoutTotals();
    const keyword = Number(rule?.keyword) || 0;
    const discountType = rule?.discountBased;

    switch (discountType) {
      case "quantity":
        return totalQuantity >= keyword;
      case "subTotal":
        return subtotal >= keyword;
      case "weight":
        return totalWeight >= keyword;
      case "product": {
        const qualifyingProdIds = getRuleProductIds(rule);
        if (qualifyingProdIds.length === 0) return false;
        const minQty = Number(rule?.keyword) || 1;
        for (const prodId of qualifyingProdIds) {
          if ((productQuantitiesById?.[prodId] || 0) >= minQty) return true;
        }
        return false;
      }
      case "coupon":
        return (
          !!couponCode?.trim() &&
          couponCode.trim().toUpperCase() === rule?.keyword?.toUpperCase()
        );
      default:
        return false;
    }
  };

  const getPotentialSavingsForRule = (rule) => {
    if (rule?.discountBased === "product") {
      const qualifyingSubtotal = getQualifyingProductSubtotal(rule);
      if (rule?.discountPercentage) {
        return Number(
          (
            (qualifyingSubtotal * (Number(rule.discountPercentage) || 0)) /
            100
          ).toFixed(2),
        );
      }
      if (rule?.discountValue) {
        return Math.min(Number(rule.discountValue) || 0, qualifyingSubtotal);
      }
      return 0;
    }
    const subtotal = getSubTotal();
    if (rule?.discountPercentage) {
      return Number(
        ((subtotal * (Number(rule.discountPercentage) || 0)) / 100).toFixed(2),
      );
    }
    if (rule?.discountValue) return Number(rule.discountValue) || 0;
    return 0;
  };

  useEffect(() => {
    const discountRules = rules?.discountRules || [];
    const prods = getValues("products") || [];
    if (!discountRules.length || !prods?.length) return;

    const totals = getCheckoutTotals();
    const couponCode = getValues("couponCode") || "";

    const nonProductRules = discountRules.filter(
      (r) => r?.discountBased !== "product",
    );
    const validNonProduct = nonProductRules.filter((rule) =>
      isDiscountConditionMet(rule, totals, couponCode),
    );
    const bestNonProduct = validNonProduct.length
      ? validNonProduct.sort(
          (a, b) =>
            getPotentialSavingsForRule(b) - getPotentialSavingsForRule(a),
        )[0]
      : null;

    const productRules = discountRules.filter(
      (r) => r?.discountBased === "product",
    );
    const validProductRules = productRules.filter((rule) =>
      isDiscountConditionMet(rule, totals, couponCode),
    );

    setValue("appliedDiscountRule", bestNonProduct);
    setValue("appliedProductDiscountRules", validProductRules);
    if (bestNonProduct?.discountBased === "coupon" && bestNonProduct?.keyword) {
      setValue("couponCode", bestNonProduct.keyword.toUpperCase());
    }
  }, [
    rules?.discountRules,
    productsWatched,
    couponCodeWatched,
    setValue,
    getValues,
  ]);

  const getApplicableRule = () => {
    if (appliedDiscountRule) {
      return appliedDiscountRule;
    }
    return null;
  };

  const getQualifyingProductSubtotal = (rule) => {
    if (rule?.discountBased !== "product") return 0;
    const qualifyingProdIds = Array.isArray(rule?.prodIds)
      ? rule.prodIds
      : rule?.prodId
        ? [rule.prodId]
        : [];
    const minQty = Number(rule?.keyword) || 1;
    if (qualifyingProdIds.length === 0) return 0;

    const productQuantitiesById = {};
    for (let i = 0; i < products?.length; i++) {
      const product = products[i];
      const productId =
        product?.prodId ||
        product?.productId ||
        product?.id ||
        product?.orderedCombination?.productId;
      if (productId) {
        const qty = Number(product?.orderedCombination?.qty) || 0;
        productQuantitiesById[productId] =
          (productQuantitiesById[productId] || 0) + qty;
      }
    }

    let qualifyingSubtotal = 0;
    for (let i = 0; i < products?.length; i++) {
      const product = products[i];
      const productId =
        product?.prodId ||
        product?.productId ||
        product?.id ||
        product?.orderedCombination?.productId;
      if (!productId || !qualifyingProdIds.includes(productId)) continue;

      const totalQtyForProduct = productQuantitiesById[productId] || 0;
      if (totalQtyForProduct < minQty) continue;

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
    }
    return Number(qualifyingSubtotal.toFixed(2));
  };

  const calculateDiscount = () => {
    let totalDiscount = 0;

    // Discount from single applied rule (coupon, quantity, subTotal, weight)
    const applicableRule = getApplicableRule();
    if (applicableRule && applicableRule?.discountBased !== "product") {
      const subtotal = getSubTotal();
      if (applicableRule?.discountPercentage) {
        const discountPercentage =
          Number(applicableRule.discountPercentage) || 0;
        totalDiscount += Number(
          ((subtotal * discountPercentage) / 100).toFixed(2),
        );
      } else if (applicableRule?.discountValue) {
        totalDiscount += Number(applicableRule.discountValue) || 0;
      }
    }

    // Discount from each applied product rule (multiple product discounts allowed)
    for (const rule of appliedProductDiscountRules) {
      const qualifyingSubtotal = getQualifyingProductSubtotal(rule);
      if (rule?.discountPercentage) {
        const discountPercentage = Number(rule.discountPercentage) || 0;
        totalDiscount += Number(
          ((qualifyingSubtotal * discountPercentage) / 100).toFixed(2),
        );
      } else if (rule?.discountValue) {
        totalDiscount += Math.min(
          Number(rule.discountValue) || 0,
          qualifyingSubtotal,
        );
      }
    }

    return Number(totalDiscount.toFixed(2));
  };

  const discountAmount = calculateDiscount();

  const shippingFeeRule =
    shippingProperty?.name === "Ship to my address"
      ? shipStationConnection && shippingRates?.finalShippingPrice
        ? { amount: Number(shippingRates?.finalShippingPrice) }
        : rules?.shippingRules?.find(
            (s) => s?.country === country && s?.state === state,
          ) || rules?.shippingRules?.find((s) => s?.country === "All")
      : rules?.shippingRules?.find(
          (s) => s?.country === country && s?.state === state,
        );

  const calculateHandlingFees = () => {
    if (shippingRates?.finalShippingPrice) {
      return 0;
    }

    const totalQty = products?.reduce(
      (acc, product) => acc + Number(product?.orderedCombination?.qty),
      0,
    );

    if (totalQty === 1) {
      return 0;
    }

    const rule =
      rules?.shippingRules?.find(
        (s) => s?.country === country && s?.state === state,
      ) || rules?.shippingRules?.find((s) => s?.country === "All");

    if (
      shippingProperty?.name?.includes("Pickup") ||
      shippingProperty?.name?.includes("One Address")
    ) {
      return 0;
    }

    if (rule) {
      const handlingFees = Number(rule?.handlingFees);

      let qty = 0;

      for (let i = 0; i < products?.length; i++) {
        const orderedCombination = products[i].orderedCombination;
        qty += Number(orderedCombination?.qty) || 0;
      }

      if (qty > 1) {
        return (qty - 1) * handlingFees;
      }

      return handlingFees;
    }

    return 0;
  };

  let shippingFeeRuleAmount =
    shippingWayShipFee >= 0
      ? shippingWayShipFee + calculateHandlingFees()
      : (Number(shippingFeeRule?.amount.toFixed(2)) || 0) +
        calculateHandlingFees();

  const tax = (getSubTotal() + shippingFeeRuleAmount) / 100;

  const total = Number(
    (
      getSubTotal() -
      discountAmount +
      shippingFeeRuleAmount +
      shippingTaxValue -
      (creditAmount ? Number(creditAmount) : 0)
    ).toFixed(2),
  );

  const creditleft = () => {
    if (Number(creditAmount) > 0) {
      const total =
        getSubTotal() -
        Number(discountAmount) +
        Number(shippingFeeRuleAmount) +
        Number(shippingTaxValue);

      const result = Number(creditAmount) - total;

      return result < 0 ? 0 : result;
    }

    return 0;
  };

  const updateProducts = (p) => {
    const updatedProducts = [...p];
    const taxRules = rules?.taxRules;
    const taxBasedProducts = taxRules?.filter((p) => p?.taxBased === "product");
    const taxBasedSizes = taxRules?.filter((p) => p?.taxBased === "size");

    const taxBasedCountries = taxRules?.filter(
      (p) => p?.taxBased === "country",
    );

    for (let index = 0; index < updatedProducts.length; index++) {
      let product = updatedProducts[index];

      if (!product?.orderedCombination) {
        continue;
      }

      let taxBasedProduct = taxBasedSizes?.filter(
        (p) =>
          product?.orderedCombination?.Size?.includes(p?.keyword) &&
          country === p?.country &&
          state === p?.state,
      );

      if (taxBasedProduct?.length > 1) {
        taxBasedProduct = _.maxBy(taxBasedProduct, "weight");
      } else {
        taxBasedProduct = taxBasedProduct[0];
      }

      const value = taxBasedProduct?.taxValue || 0;

      const updatedProduct = {
        ...product,
        orderedCombination: {
          ...product.orderedCombination,
          taxValuePercentage: value,
          taxValue: (product?.orderedCombination.subTotal * value) / 100 || 0,
        },
      };

      updatedProducts[index] = updatedProduct;
    }

    // loop for to check product name.
    for (let index = 0; index < updatedProducts.length; index++) {
      let product = updatedProducts[index];

      if (!product?.orderedCombination) {
        continue;
      }

      if (!product?.orderedCombination?.taxValuePercentage) {
        let taxBasedProduct = taxBasedProducts?.filter(
          (p) =>
            product?.name?.includes(p?.keyword) &&
            country === p?.country &&
            state === p?.state,
        );

        if (taxBasedProduct?.length > 1) {
          taxBasedProduct = _.maxBy(taxBasedProduct, "weight");
        } else {
          taxBasedProduct = taxBasedProduct[0];
        }

        const value = taxBasedProduct?.taxValue || 0;

        const updatedProduct = {
          ...product,
          orderedCombination: {
            ...product.orderedCombination,
            taxValuePercentage: value,
            taxValue: (product?.orderedCombination.subTotal * value) / 100 || 0,
          },
        };

        updatedProducts[index] = updatedProduct;
      }
    }

    // loop for to check left over products.
    for (let index = 0; index < updatedProducts.length; index++) {
      let product = updatedProducts[index];

      if (!product?.orderedCombination) {
        continue;
      }

      if (!product?.orderedCombination?.taxValuePercentage) {
        let taxBasedCountry = taxBasedCountries?.find(
          (p) => p?.country === country && p?.state === state,
        );

        if (!taxBasedCountry) {
          taxBasedCountry = taxBasedCountries?.find(
            (p) => p?.country === "All",
          );
        }

        const value = taxBasedCountry?.taxValue || 0;

        setValue("shippingTaxValuePercentage", Number(value.toFixed(2)));
        setValue(
          "shippingTaxValue",
          Number(((shippingFeeRuleAmount * value) / 100).toFixed(2)) || 0,
        );

        const updatedProduct = {
          ...product,
          orderedCombination: {
            ...product.orderedCombination,
            taxValuePercentage: value,
            taxValue: Number(
              (
                (product?.orderedCombination.subTotal * value) / 100 || 0
              ).toFixed(2),
            ),
          },
        };

        updatedProducts[index] = updatedProduct;
      } else {
        const p = taxRules?.find(
          (t) =>
            t?.country === country &&
            t?.state === state &&
            t?.taxBased === "country",
        );
        setValue("shippingTaxValuePercentage", Number(p?.taxValue));
        setValue(
          "shippingTaxValue",
          Number(((shippingFeeRuleAmount * p?.taxValue) / 100).toFixed(2)) || 0,
        );

        // const updatedProduct = {
        //   ...product,
        //   orderedCombination: {
        //     ...product.orderedCombination,
        //     taxValuePercentage: p?.taxValue,
        //     taxValue: Number(
        //       (
        //         (product?.orderedCombination.subTotal * p?.taxValue) / 100 || 0
        //       ).toFixed(2)
        //     ),
        //   },
        // };

        // updatedProducts[index] = updatedProduct;
      }
    }

    // Apply tax to orderForm (team order) products: resolve rate (size → product → country), store on orderForm
    for (let index = 0; index < updatedProducts.length; index++) {
      let product = updatedProducts[index];
      if (!product?.orderForm || product?.orderedCombination) continue;

      let orderFormSubTotal = 0;
      for (const team of product.orderForm.teams || []) {
        for (const combo of team?.orderCombinations || []) {
          orderFormSubTotal += Number(combo?.subTotal || 0);
        }
      }

      let taxValuePercentage = 0;

      const firstComboWithSize = (() => {
        for (const team of product.orderForm.teams || []) {
          for (const combo of team?.orderCombinations || []) {
            if (combo?.Size != null && String(combo.Size).trim() !== "")
              return combo;
          }
        }
        return null;
      })();

      if (firstComboWithSize?.Size && taxBasedSizes?.length) {
        let bySize = taxBasedSizes.filter(
          (r) =>
            firstComboWithSize.Size?.includes(r?.keyword) &&
            country === r?.country &&
            state === r?.state,
        );
        if (bySize?.length > 1) bySize = _.maxBy(bySize, "weight");
        else bySize = bySize?.[0];
        taxValuePercentage = Number(bySize?.taxValue) || 0;
      }
      if (!taxValuePercentage && taxBasedProducts?.length) {
        let byProduct = taxBasedProducts.filter(
          (r) =>
            product?.name?.includes(r?.keyword) &&
            country === r?.country &&
            state === r?.state,
        );
        if (byProduct?.length > 1) byProduct = _.maxBy(byProduct, "weight");
        else byProduct = byProduct?.[0];
        taxValuePercentage = Number(byProduct?.taxValue) || 0;
      }
      if (!taxValuePercentage && taxBasedCountries?.length) {
        let taxBasedCountry =
          taxBasedCountries.find(
            (r) => r?.country === country && r?.state === state,
          ) || taxBasedCountries.find((r) => r?.country === "All");
        taxValuePercentage = Number(taxBasedCountry?.taxValue) || 0;
        setValue(
          "shippingTaxValuePercentage",
          Number(taxValuePercentage.toFixed(2)),
        );
        setValue(
          "shippingTaxValue",
          Number(
            ((shippingFeeRuleAmount * taxValuePercentage) / 100).toFixed(2),
          ) || 0,
        );
      }

      const taxValue =
        Number(((orderFormSubTotal * taxValuePercentage) / 100).toFixed(2)) ||
        0;

      updatedProducts[index] = {
        ...product,
        orderForm: {
          ...product.orderForm,
          taxValuePercentage,
          taxValue,
        },
      };
    }

    if (!_.isEqual(p, updatedProducts)) {
      setValue("products", updatedProducts);
    }
  };

  const applicalbleRule = getApplicableRule();

  const setAppliedDiscountRule = (rule) => {
    setValue("appliedDiscountRule", rule);
  };

  const addAppliedProductDiscountRule = (rule) => {
    const current = getValues("appliedProductDiscountRules") || [];
    if (current.some((r) => r?._id === rule?._id)) return;
    setValue("appliedProductDiscountRules", [...current, rule]);
  };

  const removeAppliedProductDiscountRule = (rule) => {
    const current = getValues("appliedProductDiscountRules") || [];
    setValue(
      "appliedProductDiscountRules",
      current.filter((r) => r?._id !== rule?._id),
    );
  };

  const updateCreditLeft = async (isPoOrder = false) => {
    await mutateAsync({
      url: USER_CREDIT_AMOUNT,
      data: {
        // creditLeft: isPoOrder ? creditleft()?.toString() : "0",
        // email: email,
      },
    });
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isValid,
    watch,
    setValue,
    getSubTotal,
    total,
    tax,
    loading,
    countries,
    rules,
    isCountriesFetching,
    isRulesFetching,
    shippingFeeRuleAmount,
    updateProducts,
    getValues,
    getShippingRates,
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
  };
};

export default useCheckout;
