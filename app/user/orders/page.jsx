"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { apiFetch } from "@/utils/api";
import AccountNav from "@/components/AccountNav";

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Processing",
  "In transit",
  "Delivered",
  "Cancelled",
];

const formatMoney = (value, currency = "INR") =>
  `${currency === "INR" ? "₹" : currency} ${Number(value ?? 0) || 0}`;

const normalizeOrder = (order) => ({
  id: order.id || order.order_id,
  date: order.placed_on || order.date || order.created_at || "",
  status: order.status || "Processing",
  payment_status: order.payment_status || "",
  total: order.total ?? order.amount ?? 0,
  currency: order.currency || "INR",
  items_count: order.items_count ?? order.items?.length ?? 0,
  product_name: order.product_name || "",
  product_variant: order.product_variant || order.variant_name || "",
});

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    total_pages: 1,
    total_items: 0,
  });
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login?next=/user/orders");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    let active = true;

    const loadOrders = async () => {
      setLoadingOrders(true);
      setError("");
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "10",
        });
        if (status !== "All") params.set("status", status.toLowerCase());
        const data = await apiFetch(`/orders?${params.toString()}`);
        if (!active) return;

        const payload = data?.data || data || {};
        const items = Array.isArray(payload?.items) ? payload.items : [];
        setOrders(items.map(normalizeOrder));
        setPagination(
          payload?.pagination || {
            page,
            total_pages: 1,
            total_items: items.length,
          },
        );
      } catch (err) {
        if (active) {
          setError(err?.message || "Failed to load orders.");
          setOrders([]);
          setPagination({ page: 1, total_pages: 1, total_items: 0 });
        }
      } finally {
        if (active) setLoadingOrders(false);
      }
    };

    loadOrders();
    return () => {
      active = false;
    };
  }, [loading, isAuthenticated, page, status]);

  const visibleOrders = useMemo(
    () =>
      orders.filter((order) => {
        const query = search.toLowerCase();
        const matchesSearch =
          !query ||
          String(order.id).toLowerCase().includes(query) ||
          order.product_name.toLowerCase().includes(query) ||
          order.product_variant.toLowerCase().includes(query);
        const matchesFrom = !dateFrom || String(order.date) >= dateFrom;
        const matchesTo = !dateTo || String(order.date) <= dateTo;
        return matchesSearch && matchesFrom && matchesTo;
      }),
    [orders, search, dateFrom, dateTo],
  );

  const resetFilters = () => {
    setStatus("All");
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <main className="user-account-page min-h-screen bg-white text-black mt-14">
      <section className="site-container py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-md uppercase tracking-[0.094em] text-black/60">
              My account
            </p>
            <h1
              className="mt-3 text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-basker)" }}
            >
              Orders
            </h1>
          </div>
          <Link
            href="/shop"
            className="self-start text-md font-semibold text-[#52653b] hover:underline inline-flex items-center gap-2"
          >
            Continue shopping <span aria-hidden="true">&rsaquo;</span>
          </Link>
        </div>

        <AccountNav />

        <div className="mt-10 rounded-lg border border-[#dfe5d8] bg-[#f3f6ef] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[200px_220px_220px_1fr] lg:gap-4">
              <div>
                <label className="text-md uppercase tracking-[0.12em] text-black/50">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-md outline-none focus:border-black"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-md uppercase tracking-[0.12em] text-black/50">
                  From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-md outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-md uppercase tracking-[0.12em] text-black/50">
                  To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-md outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-md uppercase tracking-[0.12em] text-black/50">
                  Search
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search order ID or product..."
                  className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-md outline-none focus:border-black"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-sm border border-black/40 px-4 py-2 text-md font-semibold uppercase tracking-[0.2em] text-black hover:border-black"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-[#dfe5d8] bg-[#f3f6ef] p-6">
          <div className="flex items-center justify-between">
            <p className="text-md uppercase tracking-[0.12em] text-black/60">
              All orders
            </p>
            <p className="text-md text-black/50">
              {pagination.total_items} orders
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-md uppercase tracking-[0.08em] text-red-700">
              {error}
            </div>
          )}

          {loadingOrders ? (
            <p className="mt-6 text-md text-black/60">Loading orders...</p>
          ) : visibleOrders.length === 0 ? (
            <p className="mt-6 text-md text-black/60">
              No orders found for these filters.
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {visibleOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/user/orders/${order.id || order.order_id}`}
                  className="rounded-md border border-[#dfe5d8] bg-white p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between hover:border-[#7d904e] transition cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-md font-semibold">
                      {order.id || order.order_id}
                    </p>
                    <p className="text-md text-black/50">
                      {order.date || order.created_at}
                    </p>
                    <p className="mt-1 text-md text-black/60">
                      {order.product_name || "Order item"}
                      {order.product_variant
                        ? ` - ${order.product_variant}`
                        : ""}
                      {order.items_count
                        ? ` (${order.items_count} item${order.items_count > 1 ? "s" : ""})`
                        : ""}
                    </p>
                  </div>
                  <div className="text-md text-black/60 md:text-center">
                    <p>{order.status || "Processing"}</p>
                    {order.payment_status && (
                      <p className="text-md text-black/45">
                        Payment: {order.payment_status}
                      </p>
                    )}
                  </div>
                  <div className="text-md font-semibold">
                    {formatMoney(order.total || order.amount, order.currency)}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {pagination.total_pages > 1 && (
            <div className="mt-8 flex items-center justify-between text-md text-black/60">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="rounded-sm border border-black/10 px-4 py-2 text-md uppercase tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.total_pages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(pagination.total_pages, prev + 1))
                }
                disabled={page >= pagination.total_pages}
                className="rounded-sm border border-black/10 px-4 py-2 text-md uppercase tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
