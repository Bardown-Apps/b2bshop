import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Package, ChevronRight } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import InfoLabel from "@/components/InfoLabel";
import routes from "@/constants/routes";
import { ORDER } from "@/constants/services";
import usePost from "@/hooks/usePost";
import { useSelector } from "react-redux";
import { mapApiOrder, normalizeOrdersPayload } from "@/utils/b2bOrders";

const STATUS_STYLES = {
  Shipped: "bg-blue-500 text-blue-600",
  Processing: "bg-blue-500 text-blue-600",
  Delivered: "bg-emerald-500 text-emerald-600",
  Pending: "bg-amber-500 text-amber-600",
  Cancelled: "bg-red-500 text-red-600",
};

/** Pill styles keyed by common payment labels (API may vary). */
const PAYMENT_STATUS_STYLES = {
  Paid: "bg-emerald-100 text-emerald-800 ring-emerald-600/15",
  Captured: "bg-emerald-100 text-emerald-800 ring-emerald-600/15",
  Completed: "bg-emerald-100 text-emerald-800 ring-emerald-600/15",
  Pending: "bg-amber-100 text-amber-900 ring-amber-600/20",
  Unpaid: "bg-amber-100 text-amber-900 ring-amber-600/20",
  Authorized: "bg-blue-100 text-blue-800 ring-blue-600/15",
  Failed: "bg-red-100 text-red-800 ring-red-600/15",
  Declined: "bg-red-100 text-red-800 ring-red-600/15",
  Refunded: "bg-slate-200 text-slate-800 ring-slate-500/15",
  PartiallyPaid: "bg-violet-100 text-violet-800 ring-violet-600/15",
};

const StatusDot = ({ status }) => {
  const color = STATUS_STYLES[status] ?? "bg-slate-400 text-slate-600";
  const [dotBg, textColor] = color.split(" ");
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${dotBg}`} />
      <span
        className={`text-xs font-semibold uppercase tracking-wider ${textColor}`}
      >
        {status}
      </span>
    </div>
  );
};

const PaymentStatusBadge = ({ paymentStatus }) => {
  if (paymentStatus == null || paymentStatus === "" || paymentStatus === "—") {
    return null;
  }
  const label =
    typeof paymentStatus === "string" ? paymentStatus : String(paymentStatus);
  const normalized = label.replace(/\s+/g, "").replace(/_/g, "") || label;
  const ringClasses =
    PAYMENT_STATUS_STYLES[label] ??
    PAYMENT_STATUS_STYLES[normalized] ??
    "bg-slate-100 text-slate-700 ring-slate-500/10";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${ringClasses}`}
      title="Payment status"
    >
      {label}
    </span>
  );
};

const OrderStatusBadges = ({ status, paymentStatus }) => (
  <div className="flex flex-wrap items-center gap-2">
    <StatusDot status={status} />
    <PaymentStatusBadge paymentStatus={paymentStatus} />
  </div>
);

const AccountInfoSection = () => {
  const { user } = useSelector((state) => state.auth);
  const { mutateAsync } = usePost();
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setOrdersLoading(true);
      try {
        const { data } = await mutateAsync({
          url: ORDER,
          data: { take: 2, skip: 0 },
        });
        if (!cancelled) {
          setRecentOrders(
            normalizeOrdersPayload(data).map((raw) => {
              const o = mapApiOrder(raw);
              return {
                id: o.id,
                orderNumber: o.orderNumber,
                status: o.status,
                orderedAt: o.orderedAt,
                total: o.total,
                paymentStatus: o.paymentStatus,
              };
            }),
          );
        }
      } catch {
        if (!cancelled) setRecentOrders([]);
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [mutateAsync]);

  return (
    <DashboardCard>
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        <div className="p-6 md:p-8">
          <InfoLabel icon={Building2}>Account Number</InfoLabel>
          <div className="space-y-1">
            <p className="text-sm text-slate-500 font-medium">PRIMARY:</p>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {user?.accountNumber?.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <InfoLabel icon={Building2}>Company Name</InfoLabel>
          <p className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
            {user?.companyName}
          </p>
        </div>

        <div className="p-6 md:p-8 bg-slate-50/50">
          <InfoLabel icon={Package}>Most Recent Orders</InfoLabel>
          {ordersLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-24 rounded-xl bg-slate-200/80" />
              <div className="h-24 rounded-xl bg-slate-200/80" />
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-slate-300 transition-colors duration-200"
                >
                  <div className="space-y-1">
                    <OrderStatusBadges
                      status={order.status}
                      paymentStatus={order.paymentStatus}
                    />
                    <p className="text-sm font-medium text-slate-900">
                      Order # {order.orderNumber}
                    </p>
                    <p className="text-xs text-slate-500">
                      Ordered {order.orderedAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Total
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      $
                      {Number.isFinite(Number(order.total))
                        ? Number(order.total).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                </div>
              ))}
              <Link
                to={routes.orders}
                className="w-full mt-2 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                VIEW ALL <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
              <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No recent orders found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};

export default AccountInfoSection;
