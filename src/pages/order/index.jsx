import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ORDER } from "@/constants/services";
import usePost from "@/hooks/usePost";
import usePatch from "@/hooks/usePatch";
import GlobalLoader from "@/components/GlobalLoader";
import Header from "@/pages/order/Header";
import Status from "@/pages/order/Status";
import OrderSummary from "@/pages/order/OrderSummary";
import Invoice from "@/pages/order/Invoice";
import { generateReceiptPdf } from "@/pages/order/generateReceiptPdf";
import { normalizeOrdersPayload } from "@/utils/b2bOrders";

const Order = () => {
  const { mutateAsync } = usePost();
  const { mutate: patchOrder, isLoading: updatingOrder } = usePatch();
  const [orderResponse, setOrderResponse] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const params = useParams();
  const orderNumber = params?.orderNumber;

  const order = useMemo(() => {
    if (!orderResponse) return null;
    const normalized = normalizeOrdersPayload(orderResponse);
    if (normalized.length > 0) return normalized[0];
    const rows = Array.isArray(orderResponse?.data)
      ? orderResponse.data
      : Array.isArray(orderResponse)
        ? orderResponse
        : orderResponse?.data
          ? [orderResponse.data]
          : orderResponse
            ? [orderResponse]
            : [];
    return rows[0] || null;
  }, [orderResponse]);

  const updateOrderDetails = async (payload) => {
    if (!orderNumber) return;

    await patchOrder({ orderNumber, ...payload }, { url: ORDER });
    setReloadToken((value) => value + 1);
  };

  useEffect(() => {
    if (!orderNumber) return;
    let cancelled = false;

    const load = async () => {
      setLoadingOrder(true);
      try {
        const res = await mutateAsync({
          url: ORDER,
          data: { orderNumber },
        });
        if (!cancelled) setOrderResponse(res?.data ?? null);
      } catch {
        if (!cancelled) setOrderResponse(null);
      } finally {
        if (!cancelled) setLoadingOrder(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [mutateAsync, orderNumber, reloadToken]);

  const title = useMemo(
    () => `Order ${order?.orderNumber ? `#${order.orderNumber}` : ""}`.trim(),
    [order],
  );

  const loading = loadingOrder || updatingOrder;

  if (loading && !order) {
    return <GlobalLoader show />;
  }

  return (
    <div>
      <GlobalLoader show={loading && !!order} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-200 pb-6 mb-6">
        <div>
          <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
            {title || "Order"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Order details, status and customer activity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => generateReceiptPdf(order)}
          disabled={!order}
          className="h-10 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 shrink-0"
        >
          Download Receipt
        </button>
      </div>

      {!order ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-600">
          No order found for order number: <strong>{orderNumber}</strong>
        </div>
      ) : (
        <main className="space-y-4">
          <Header order={order} />
          {/* <Status order={order} updateOrderDetails={updateOrderDetails} /> */}
          <Invoice order={order} />
          <OrderSummary order={order} />
        </main>
      )}
    </div>
  );
};

export default Order;
