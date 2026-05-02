import { Link } from "react-router-dom";
import routes from "@/constants/routes";
import { STATUS_COLORS } from "@/constants/orders";
import {
  computeOrderTotal,
  formatOrderedAt,
  formatOrderListMoney,
  getOrderCustomerDisplayName,
  getShippingAddressLines,
  orderStatusColorClass,
} from "@/utils/b2bOrders";

const Label = ({ children }) => (
  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
    {children}
  </p>
);

const OrderCard = ({ order }) => {
  const status = order.status ?? order.orderStatus ?? "—";
  const statusColor = orderStatusColorClass(status, STATUS_COLORS);
  const orderNumber = order.orderNumber ?? "—";
  const orderedAtRaw =
    order.orderedAt ??
    order.createdAt ??
    order.orderDate ??
    order.dateOrdered;

  const shipRaw =
    order.shipDate ??
    order.shippedAt ??
    order.ship_date ??
    order.estimatedShipDate ??
    order.estimated_ship_date;
  const shipDisplay =
    shipRaw != null && shipRaw !== "" ? formatOrderedAt(shipRaw) : "—";

  const orderTypeRaw = order.orderType ?? order.order_type;
  const orderTypeDisplay =
    orderTypeRaw != null && orderTypeRaw !== ""
      ? String(orderTypeRaw)
      : "—";

  const customerName = getOrderCustomerDisplayName(order);
  const addressLines = getShippingAddressLines(order);
  const total = computeOrderTotal(order);

  const detailsTo =
    orderNumber !== "—"
      ? routes.orderDetailsPath(encodeURIComponent(String(orderNumber)))
      : routes.orders;

  return (
    <div className="border border-slate-200 rounded-xl bg-white px-4 py-5 md:px-6 md:py-5 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between xl:gap-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-x-10 lg:gap-x-12 xl:flex-1 xl:flex-nowrap xl:justify-between">
          {/* Status + order number */}
          <div className="min-w-[7rem] shrink-0">
            <p
              className={`text-xs font-bold uppercase tracking-wider ${statusColor}`}
            >
              {status}
            </p>
            <div className="mt-4">
              <Label>Order Number</Label>
              <Link
                to={detailsTo}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                {orderNumber}
              </Link>
            </div>
          </div>

          {/* Order date + ship date */}
          <div className="flex gap-10 sm:gap-12 shrink-0">
            <div>
              <Label>Order Date</Label>
              <p className="text-sm text-slate-800">
                {formatOrderedAt(orderedAtRaw)}
              </p>
            </div>
            <div>
              <Label>Ship Date</Label>
              <p className="text-sm text-slate-800">{shipDisplay}</p>
            </div>
          </div>

          {/* Customer */}
          <div className="min-w-[5rem] shrink-0">
            <Label>Customer</Label>
            <p className="text-sm text-slate-800">{customerName}</p>
          </div>

          {/* Order type + shipping */}
          <div className="min-w-[12rem] flex-1 max-w-md">
            <div className="mb-4">
              <Label>Order Type</Label>
              <p className="text-sm text-slate-800">{orderTypeDisplay}</p>
            </div>
            <div>
              <Label>Shipping Address</Label>
              {addressLines.length === 0 ? (
                <p className="text-sm text-slate-800">—</p>
              ) : (
                <address className="text-sm text-slate-800 not-italic leading-snug space-y-0.5">
                  {addressLines.map((line, idx) => (
                    <span key={`${idx}-${line}`} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="shrink-0 xl:text-right">
            <Label>Total</Label>
            <p className="text-lg font-bold text-slate-900 tabular-nums">
              {formatOrderListMoney(total)}
            </p>
          </div>
        </div>

        <div className="flex xl:items-start xl:shrink-0 border-t border-slate-200 pt-5 xl:border-t-0 xl:border-l xl:border-slate-200 xl:pt-1 xl:pl-8">
          <Link
            to={detailsTo}
            className="inline-flex w-full xl:w-auto justify-center px-5 py-2.5 rounded-lg bg-slate-900 text-xs font-bold uppercase tracking-wide text-white hover:bg-slate-800 transition-colors text-center"
          >
            Order Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
