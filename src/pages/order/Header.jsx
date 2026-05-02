import moment from "moment";
import { getShippingAddressLines } from "@/utils/b2bOrders";

const Header = ({ order }) => {
  if (!order) return null;
  const createdAt = order?.createdAt
    ? moment.unix(Number(order.createdAt)).format("MMM DD, YYYY")
    : "-";
  const shippingLines = getShippingAddressLines(order);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs uppercase text-slate-500">Order Number</p>
          <p className="text-sm font-semibold text-slate-900">
            {order?.orderNumber || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Created</p>
          <p className="text-sm text-slate-700">{createdAt}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Payment Status</p>
          <p className="text-sm text-slate-700">
            {order?.paymentStatus || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Order Status</p>
          <p className="text-sm text-slate-700">
            {order?.status?.toUpperCase() || "-"}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-xs uppercase text-slate-500 mb-2">Shipping Address</p>
        {shippingLines.length === 0 ? (
          <p className="text-sm text-slate-700">—</p>
        ) : (
          <address className="text-sm text-slate-800 not-italic leading-snug space-y-0.5">
            {shippingLines.map((line, idx) => (
              <span key={`${idx}-${line}`} className="block">
                {line}
              </span>
            ))}
          </address>
        )}
      </div>
    </section>
  );
};

export default Header;
