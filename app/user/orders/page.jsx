"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Processing",
  "In transit",
  "Delivered",
  "Cancelled",
];

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
  const fallbackOrders = [
    {
      id: "TKC-1042",
      date: "2026-03-12",
      status: "Delivered",
      total: 1499,
      product_name: "Kashmiri Kahwa",
    },
    {
      id: "TKC-1037",
      date: "2026-02-28",
      status: "In transit",
      total: 899,
      product_name: "Kahwa Sampler Set",
    },
    {
      id: "TKC-1029",
      date: "2026-02-10",
      status: "Delivered",
      total: 2120,
      product_name: "Saffron Kahwa",
    },
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login?next=/user/orders");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    setOrders(fallbackOrders);
    setPagination({
      page: 1,
      total_pages: 1,
      total_items: fallbackOrders.length,
    });
  }, []);

  const resetFilters = () => {
    setStatus("All");
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-white text-black mt-14">
      <section className="container max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.094em] text-black/60">
              My account
            </p>
            <h1
              className="mt-3 text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Orders
            </h1>
          </div>
          <Link
            href="/shop"
            className="self-start text-xs font-semibold uppercase tracking-[0.2em] text-black/60 hover:text-black inline-flex items-center gap-2"
          >
            Continue shopping <span aria-hidden="true">›</span>
          </Link>
        </div>

        <div className="mt-10 rounded-sm border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[200px_220px_220px_1fr] lg:gap-4">
              <div>
                <label className="text-xs uppercase tracking-[0.12em] text-black/50">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.12em] text-black/50">
                  From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.12em] text-black/50">
                  To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.12em] text-black/50">
                  Search
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search order ID..."
                  className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-sm border border-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-sm border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.12em] text-black/60">
              All orders
            </p>
            <p className="text-xs text-black/50">
              {pagination.total_items} orders
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-xs uppercase tracking-[0.08em] text-red-700">
              {error}
            </div>
          )}

          {loadingOrders ? (
            <p className="mt-6 text-sm text-black/60">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="mt-6 text-sm text-black/60">
              No orders found for these filters.
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/user/orders/${order.id || order.order_id}`}
                  className="rounded-sm border border-black/10 bg-gray-50 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between hover:border-black/40 transition cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {order.id || order.order_id}
                    </p>
                    <p className="text-xs text-black/50">
                      {order.date || order.created_at}
                    </p>
                    {order.product_name && (
                      <p className="text-xs text-black/60">
                        {order.product_name}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-black/60">
                    {order.status || "Processing"}
                  </div>
                  <div className="text-sm font-semibold">
                    ₹ {order.total || order.amount || 0}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {pagination.total_pages > 1 && (
            <div className="mt-8 flex items-center justify-between text-sm text-black/60">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="rounded-sm border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-50"
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
                className="rounded-sm border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-50"
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
