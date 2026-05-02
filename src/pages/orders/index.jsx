import { useEffect, useMemo, useState } from "react";
import { Search, Package, ChevronDown } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";
import { ORDER } from "@/constants/services";
import usePost from "@/hooks/usePost";
import {
  extractOrdersListMeta,
  getOrderCustomerDisplayName,
  getShippingAddressLines,
} from "@/utils/b2bOrders";
import { ORDER_STATUS_FILTERS } from "@/constants/orders";
import OrderCard from "./OrderCard";

const PAGE_SIZE = 10;

const Orders = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { mutateAsync } = usePost();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const skip = (page - 1) * PAGE_SIZE;
        const body = {
          take: PAGE_SIZE,
          skip,
          status: statusFilter,
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
        };

        const { data } = await mutateAsync({
          url: ORDER,
          data: body,
        });

        if (cancelled) return;

        const { list, total } = extractOrdersListMeta(data);
        setOrders(list);
        setTotalCount(total);
      } catch (e) {
        if (!cancelled) {
          setOrders([]);
          setTotalCount(null);
          setError(e?.message ?? "Could not load orders.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [mutateAsync, page, debouncedSearch, statusFilter]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      const hay = [
        o.orderNumber,
        o.poNumber ?? o.po_number ?? o.poNo,
        o.orderType ?? o.order_type,
        o.status ?? o.orderStatus,
        getOrderCustomerDisplayName(o),
        ...getShippingAddressLines(o),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [orders, search]);

  const canGoPrev = page > 1 && !loading;
  const canGoNext =
    !loading &&
    (totalCount != null
      ? page * PAGE_SIZE < totalCount
      : orders.length === PAGE_SIZE);

  const rangeLabel =
    totalCount != null && orders.length > 0
      ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, totalCount)} of ${totalCount}`
      : totalCount != null && orders.length === 0
        ? `No results (page ${page})`
        : orders.length > 0
          ? `Page ${page}`
          : null;

  return (
    <div>
      <h1 className="text-sm font-bold text-slate-700 uppercase tracking-widest border-b border-slate-200 pb-3 mb-6">
        My Orders
      </h1>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden flex-1 min-w-48 max-w-sm focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order, Invoice, or PO No."
            className="flex-1 px-3 py-2.5 text-sm text-slate-800 outline-none"
          />
          <button
            type="button"
            className="px-3 py-2.5 bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none border border-slate-200 rounded-lg bg-white pl-3 pr-8 py-2.5 text-sm text-slate-700 cursor-pointer outline-none focus:ring-2 focus:ring-blue-200 transition-all min-w-44"
            aria-label="Order status"
          >
            {ORDER_STATUS_FILTERS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {(search || statusFilter !== "pending") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("pending");
            }}
            className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="h-32 md:h-28 rounded-xl bg-slate-200/70 animate-pulse border border-slate-100"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <AnimateIn className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            {search ? "No orders match your search." : "No orders found."}
          </p>
        </AnimateIn>
      ) : (
        <>
          <div className="space-y-4">
            {filtered.map((order, i) => (
              <AnimateIn
                key={String(order._id ?? order.id ?? order.orderNumber ?? i)}
                delay={i * 0.06}
              >
                <OrderCard order={order} />
              </AnimateIn>
            ))}
          </div>

          {(orders.length > 0 || page > 1) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-8 pt-6 border-t border-slate-200">
              {rangeLabel ? (
                <p className="text-sm text-slate-500">{rangeLabel}</p>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!canGoPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600 tabular-nums px-2">
                  Page {page}
                  {totalCount != null
                    ? ` / ${Math.max(1, Math.ceil(totalCount / PAGE_SIZE))}`
                    : ""}
                </span>
                <button
                  type="button"
                  disabled={!canGoNext}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
