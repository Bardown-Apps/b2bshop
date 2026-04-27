import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import useSummary from "@/pages/summary/useSummary";
import routes, { ContactUs, Home } from "@/constants/routes";
import Banner from "@/assets/summary.jpg";

const Summary = () => {
  const params = useParams();
  const {
    customPayment,
    shopCurrency,
    thanksLink,
    thanksTitle,
    orderThanksScreenImage,
    logoImg,
  } = useSelector((s) => s.shop);
  const pendingRequests = useSelector((s) => s?.network?.pendingRequests || 0);
  const { fetchOrderDetails, order } = useSummary();
  const visible = pendingRequests > 0;
  const formatMoney = (value) => Number(value || 0).toFixed(2);

  const getOrderDetails = () => {
    fetchOrderDetails(params.orderNumber);
    document.title = `#${params.orderNumber} Summary`;
  };

  useEffect(() => {
    if (!order && params.orderNumber) getOrderDetails();
  }, [order, params.orderNumber]);

  if (visible) return null;

  if (!order && !visible) {
    return (
      <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-slate-700">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to={Home.path}
              className="rounded-md bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Go back home
            </Link>
            <Link
              to={ContactUs.path}
              className="text-sm font-semibold text-gray-900"
            >
              Contact support <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative lg:min-h-full">
      <div className="h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <img
          alt="order-summary-image"
          src={Banner}
          className="h-full w-full object-contain object-center"
        />
      </div>

      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <h1 className="text-sm font-medium text-slate-700">
              Payment successful
            </h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thanks for ordering
            </p>
            <p className="mt-2 text-base text-gray-500">
              We appreciate your order, we’re currently processing it.
            </p>

            {thanksLink && thanksTitle && (
              <div className="mb-6 mt-4 flex w-full items-center justify-between rounded-lg bg-slate-900 px-3 py-3 text-md font-semibold text-white">
                <a
                  href={thanksLink}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {thanksTitle}
                </a>
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </div>
            )}

            <ul
              role="list"
              className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
            >
              {order?.orderedItems?.map((product) => (
                <li key={product.id} className="flex py-4">
                  <div className="shrink-0">
                    <img
                      alt={product.name}
                      src={product.defaultImageUrl}
                      className="w-20 rounded-md"
                    />
                  </div>

                  <div className="ml-6 flex flex-1 flex-col">
                    <div className="flex">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm">{product.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.orderedCombination.name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.size}
                        </p>

                        {product?.decorations
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
                                  className="underline text-slate-700"
                                  href={d?.customDecorationUrl}
                                  target="_blank"
                                  rel="noreferrer"
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
                      <p className="mt-1 text-sm font-normal text-gray-900">
                        Unit Price
                      </p>
                      <p className="mt-1 text-sm font-normal text-gray-900">
                        ${formatMoney(product?.orderedCombination?.unitPrice)}
                      </p>
                    </div>

                    <div className="flex flex-1 items-end justify-between">
                      <p className="mt-1 text-sm font-normal text-gray-900">
                        Quantity
                      </p>
                      <p className="mt-1 text-sm font-normal text-gray-900">
                        {product.orderedCombination.qty}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between">
                      <p className="mt-1 text-sm font-normal text-gray-900">
                        Sub Total
                      </p>
                      <p className="mt-1 text-sm font-normal text-gray-900">
                        ${formatMoney(product?.orderedCombination?.subTotal)}
                      </p>
                    </div>

                    <div className="flex flex-1 items-end justify-between">
                      <p className="mt-1 text-sm font-normal text-gray-900">
                        Tax ({product?.orderedCombination?.taxValuePercentage}%)
                      </p>
                      <p className="mt-1 text-sm font-normal text-gray-900">
                        ${formatMoney(product?.orderedCombination?.taxValue)}
                      </p>
                    </div>

                    <div className="flex flex-1 items-end justify-between">
                      <p className="mt-1 text-sm font-normal text-gray-900">
                        Line Item Total
                      </p>
                      <p className="mt-1 text-sm font-normal text-gray-900">
                        $
                        {Number(
                          product.orderedCombination.subTotal +
                            product?.orderedCombination?.taxValue,
                        )?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-gray-900">
                  ${formatMoney(order?.paymentDetails?.subTotal)}&nbsp;
                  {shopCurrency}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="text-gray-900">
                  ${formatMoney(order?.paymentDetails?.shippingCost)}&nbsp;
                  {shopCurrency}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt>
                  Shipping Taxes (
                  {order?.paymentDetails?.shippingTaxValuePercentage}%)
                </dt>
                <dd className="text-gray-900">
                  ${order?.paymentDetails?.shippingTaxValue}&nbsp;{shopCurrency}
                </dd>
              </div>

              {order?.paymentDetails?.creditAmount ? (
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Credit Amount</dt>
                  <dd className="text-base">
                    -${Number(order?.paymentDetails?.creditAmount)?.toFixed(2)}
                  </dd>
                </div>
              ) : null}

              {order?.paymentDetails?.creditLeft ? (
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Credit Left</dt>
                  <dd className="text-base">
                    ${Number(order?.paymentDetails?.creditLeft)?.toFixed(2)}
                  </dd>
                </div>
              ) : null}

              <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                <dt className="text-base">Total</dt>
                <dd className="text-base">
                  $
                  {Number(order?.paymentDetails?.orderTotal) < 0
                    ? 0
                    : formatMoney(order?.paymentDetails?.orderTotal)}
                </dd>
              </div>

              {customPayment?.value ? (
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Pending Payment</dt>
                  <dd className="text-base">
                    $
                    {Number(order?.paymentDetails?.orderTotal) -
                      Number(order?.paymentDetails?.orderTotal).toFixed(2) *
                        (customPayment?.paymentPercentage / 100)}
                  </dd>
                </div>
              ) : null}
            </dl>

            <dl className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
              <div>
                <dt className="font-medium text-gray-900">Shipping Address</dt>
                <dd className="mt-2">
                  <address className="not-italic">
                    <span className="block">
                      {order?.shippingAddress?.name}
                    </span>
                    <span className="block">
                      {order?.shippingAddress?.address}&nbsp;
                      {order?.shippingAddress?.address2}
                    </span>
                    <span className="block">
                      {order?.shippingAddress?.city
                        ? order?.shippingAddress?.city + ","
                        : ""}
                      &nbsp;
                      {order?.shippingAddress?.state
                        ? order?.shippingAddress?.state + ","
                        : ""}
                      &nbsp;
                      {order?.shippingAddress?.postal_code}
                      &nbsp;
                      {order?.shippingAddress?.country}
                    </span>
                  </address>
                </dd>
              </div>
            </dl>

            <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <Link
                to={routes.clubStore}
                className="text-sm font-medium text-slate-700"
              >
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
