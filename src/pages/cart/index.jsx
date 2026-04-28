import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFieldArray } from "react-hook-form";
import {
  XMarkIcon as XMarkIconMini,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import Button from "@/components/Button";
import Input from "@/components/Input";
import useCart from "@/pages/cart/useCart";
import EmptyState from "@/components/EmptyState";
import { setItems, setCartItemsCount } from "@/features/cart/cartSlice";
import { SummarySheetModal } from "@/components/QuickShop/TeamOrderForm/SummarySheetModal";

const Cart = () => {
  const dispatch = useDispatch();
  const authToken = useSelector((s) => s?.auth?.token);
  const { items, itemsCount } = useSelector((s) => s.cart);
  const {
    control,
    handleSubmit,
    onSubmit,
    fetchCartData,
    setValue,
    isValid,
    deleteProductFromCart,
    watch,
    updateCart,
  } = useCart();
  const { shopCurrency } = useSelector((s) => s?.shop);
  const products = watch("products");

  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const [summarySheetData, setSummarySheetData] = useState({
    teams: [],
    colorOptions: [],
    sizeOptions: [],
  });
  const qtyUpdateTimersRef = useRef({});

  const { fields, remove } = useFieldArray({ control, name: "products" });

  const getCartData = async () => {
    if (authToken) {
      const data = await fetchCartData();
      setValue("products", data);
    } else {
      setValue("products", items);
    }
  };

  useEffect(() => {
    getCartData();
  }, [authToken]);

  useEffect(() => {
    const subscription = watch(async (value, { name, type }) => {
      if (type === "change" && name.endsWith(".qty")) {
        const [, index, field] = name.split(".");

        if (field === "orderedCombination") {
          const orderedCombination =
            value.products[parseInt(index)].orderedCombination;

          const cartProdId = value.products[parseInt(index)].cartProdId;

          const qty = parseInt(orderedCombination.qty);

          if (qty <= 0) return;

          const timerKey = `${cartProdId || index}`;
          if (qtyUpdateTimersRef.current[timerKey]) {
            clearTimeout(qtyUpdateTimersRef.current[timerKey]);
          }

          qtyUpdateTimersRef.current[timerKey] = setTimeout(async () => {
            const itemPayload = value.products[parseInt(index)] || {};
            const payload = {
              ...itemPayload,
              orderedCombination: {
                ...(itemPayload?.orderedCombination || {}),
                qty,
                subTotal: parseInt(orderedCombination.unitPrice) * qty,
              },
            };

            if (authToken) {
              await updateCart(payload);
              await getCartData();
            } else {
              const newItems = items?.map((item, j) => {
                if (Number(index) === j) {
                  return {
                    ...item,
                    orderedCombination: {
                      ...item.orderedCombination,
                      ...payload.orderedCombination,
                    },
                  };
                }
                return { ...item };
              });
              dispatch(
                setItems({
                  items: newItems,
                }),
              );
            }

            delete qtyUpdateTimersRef.current[timerKey];
          }, 350);
        }
      }
    });
    return () => {
      Object.values(qtyUpdateTimersRef.current).forEach((timerId) => {
        clearTimeout(timerId);
      });
      qtyUpdateTimersRef.current = {};
      subscription.unsubscribe();
    };
  }, [watch]);

  const getOrderFormSubTotal = (product) => {
    const of = product?.orderForm;
    if (!of?.teams?.length) return 0;
    let sum = 0;
    for (const team of of.teams) {
      for (const combo of team?.orderCombinations || []) {
        sum += Number(combo?.subTotal || 0);
      }
    }
    return sum;
  };

  const getSubTotal = () => {
    let subTotal = 0;

    if (authToken) {
      for (let i = 0; i < fields.length; i++) {
        const product = fields[i];
        if (product?.orderForm) {
          subTotal += getOrderFormSubTotal(product);
        } else if (product?.orderedCombination) {
          subTotal += Number(product.orderedCombination.subTotal || 0);
        }
      }
    } else {
      for (let i = 0; i < items.length; i++) {
        const product = items[i];
        if (product?.orderForm) {
          subTotal += getOrderFormSubTotal(product);
        } else if (product?.orderedCombination) {
          subTotal += Number(product.orderedCombination.subTotal || 0);
        }
      }
    }

    return subTotal;
  };

  const handleOpenSummarySheet = (product) => {
    const of = product?.orderForm;
    if (!of?.teams?.length) return;

    const colorSet = new Set();
    const sizeSet = new Set();

    for (const team of of.teams || []) {
      for (const combo of team?.orderCombinations || []) {
        if (combo?.Color) {
          colorSet.add(String(combo.Color));
        }
        if (combo?.Size) {
          sizeSet.add(String(combo.Size));
        }
      }
    }

    const colorOptions = Array.from(colorSet).map((value) => ({
      value,
      label: value,
    }));
    const sizeOptions = Array.from(sizeSet).map((value) => ({
      value,
      label: value,
    }));

    if (!colorOptions.length || !sizeOptions.length) return;

    setSummarySheetData({
      teams: of.teams || [],
      colorOptions,
      sizeOptions,
    });
    setSummarySheetOpen(true);
  };

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
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl pt-5">
        Shopping Cart
      </h1>

      <form
        className="mt-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <h2
            id="cart-heading"
            className="text-lg font-medium text-gray-900 mb-8"
          >
            Items in your shopping cart
          </h2>

          <ul
            role="list"
            className="divide-y divide-gray-200 border-b border-t border-gray-200"
          >
            {fields.map((product, productIdx) => {
              const isOrderFormItem = !!product?.orderForm;
              const lineSubTotal = isOrderFormItem
                ? getOrderFormSubTotal(product)
                : Number(product?.orderedCombination?.subTotal || 0);
              const orderFormTeams = product?.orderForm?.teams || [];
              const totalCombinations = orderFormTeams.reduce(
                (acc, team) => acc + (team?.orderCombinations?.length || 0),
                0,
              );

              return (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="shrink-0">
                    <img
                      alt={product.name}
                      src={product.defaultImageUrl}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <a
                              href={product.href}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {product.name}
                            </a>
                          </h3>
                        </div>

                        <div className="mt-1 flex text-sm">
                          {!isOrderFormItem ? (
                            <p className="text-gray-500">
                              {product.orderedCombination.name}
                            </p>
                          ) : (
                            <div>
                              <button
                                type="button"
                                className="text-gray-500 underline"
                                onClick={() => handleOpenSummarySheet(product)}
                              >
                                Team order form — {totalCombinations} item
                                {totalCombinations === 1 ? "" : "s"}
                              </button>
                            </div>
                          )}
                        </div>

                        {!isOrderFormItem &&
                          product.customFields?.map(
                            (f, i) =>
                              f.value && (
                                <div className="mt-1 flex text-sm" key={i}>
                                  <p className="text-gray-500">
                                    {f.fieldName} : {f.value}
                                  </p>
                                </div>
                              ),
                          )}

                        {!isOrderFormItem &&
                          product?.decorations
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
                                    className="underline"
                                    href={d?.customDecorationUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#111827" }}
                                  >
                                    (Art)
                                  </a>
                                </p>
                                {d?.notes && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    Notes: {d?.notes}
                                  </p>
                                )}
                              </div>
                            ))}

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {isOrderFormItem ? (
                            <>
                              ${lineSubTotal.toFixed(2)}&nbsp;
                              {shopCurrency}
                            </>
                          ) : (
                            <>
                              ${product.orderedCombination.unitPrice}&nbsp;
                              {shopCurrency}
                            </>
                          )}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        {!isOrderFormItem ? (
                          <>
                            <label
                              htmlFor={`quantity-${productIdx}`}
                              className="sr-only"
                            >
                              Quantity, {product.name}
                            </label>

                            <div className="w-28">
                              <Input
                                control={control}
                                placeholder="Qty"
                                type="number"
                                name={`products.${productIdx}.orderedCombination.qty`}
                                required
                                rules={{
                                  required: "Field is required",
                                  validate: (v) => {
                                    if (Number(v) < 1) {
                                      return `Minimum value is 1`;
                                    }

                                    return true;
                                  },
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Quantities are per size/color in the team order
                            form.
                          </p>
                        )}

                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            onClick={async () => {
                              if (authToken) {
                                await deleteProductFromCart(product);
                              } else {
                                dispatch(
                                  setItems({
                                    items: items.filter(
                                      (p, i) => i !== productIdx,
                                    ),
                                  }),
                                );

                                dispatch(
                                  setCartItemsCount({
                                    count: itemsCount - 1,
                                  }),
                                );
                              }

                              remove(productIdx);
                            }}
                          >
                            <span className="sr-only">Remove</span>
                            <XMarkIconMini
                              aria-hidden="true"
                              className="h-5 w-5"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
        >
          <h2
            id="summary-heading"
            className="text-lg font-medium text-gray-900"
          >
            Order summary
          </h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">
                ${getSubTotal()?.toFixed(2)}
              </dd>
            </div>

            <div className="rounded-md bg-yellow-50 p-4 mt-4 text-left relative border">
              <div className="flex">
                <div className="shrink-0">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-yellow-400"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Note: Shipping Price and tax will be calculated on checkout
                    page
                  </h3>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">
                Order total
              </dt>
              <dd className="text-base font-medium text-gray-900">
                ${getSubTotal()?.toFixed(2)}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={!fields?.length || !isValid}
              className="w-full rounded-md border border-transparent  px-4 py-3 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2  focus:ring-offset-2 "
              style={{
                backgroundColor: "#000000",
              }}
            >
              Checkout
            </Button>
          </div>
        </section>
      </form>
      <SummarySheetModal
        open={summarySheetOpen}
        onClose={() => setSummarySheetOpen(false)}
        teams={summarySheetData.teams}
        colorOptions={summarySheetData.colorOptions}
        sizeOptions={summarySheetData.sizeOptions}
      />
    </main>
  );
};

export default Cart;
