import { computeOrderTotal, formatOrderListMoney } from "@/utils/b2bOrders";

const money = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "-";
  return `$${Number(value).toFixed(2)}`;
};

const OrderSummary = ({ order }) => {
  if (!order) return null;
  const pd = order?.paymentDetails ?? order?.payment_details ?? {};
  const shippingCost = Number(pd.shippingCost ?? pd.shipping_cost ?? 0);
  const shippingTax = Number(pd.shippingTaxValue ?? pd.shipping_tax_value ?? 0);
  const rawOrderTotal = Number(pd.orderTotal ?? pd.order_total ?? 0);
  const subTotal = pd.subTotal ?? pd.sub_total;
  const creditAmount = pd.creditAmount ?? pd.credit_amount;
  const creditLeftRaw = pd.creditLeft ?? pd.credit_left;
  const creditLeft = Math.max(0, Number(creditLeftRaw || 0));
  const displayTotal = computeOrderTotal(order);
  const orderedItemsCount = Array.isArray(order?.orderedItems)
    ? order.orderedItems.length
    : 0;
  const paidFromRecords = Array.isArray(order?.paymentRecord)
    ? order.paymentRecord.reduce(
        (sum, record) => sum + Number(record?.amountPaid || 0),
        0,
      )
    : 0;
  const paidFromPercentage = order?.customPayment?.value
    ? (rawOrderTotal * Number(order?.customPayment?.paymentPercentage || 0)) /
      100
    : 0;
  const paidAmount = paidFromRecords > 0 ? paidFromRecords : paidFromPercentage;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        Order Summary
      </h2>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Line Items</span>
          <span className="font-medium text-slate-900">
            {orderedItemsCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-medium text-slate-900">{money(subTotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Shipping</span>
          <span className="font-medium text-slate-900">
            {money(shippingCost)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Shipping Tax</span>
          <span className="font-medium text-slate-900">
            {money(shippingTax)}
          </span>
        </div>
        {creditAmount ? (
          <div className="flex items-center justify-between border-t border-slate-200 pt-2">
            <span className="text-slate-600">Credit Amount</span>
            <span className="font-medium text-slate-900">
              -{money(creditAmount)}
            </span>
          </div>
        ) : null}
        {creditLeftRaw ? (
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Credit Left</span>
            <span className="font-medium text-slate-900">
              {money(creditLeft)}
            </span>
          </div>
        ) : null}

        <div className="border-t border-slate-200 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800">Total</span>
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {formatOrderListMoney(displayTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
