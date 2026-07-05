"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import {
  EMPTY_REVIEW_FORM,
  buildReviewFormData,
  extractEligibleReviewItems,
} from "@/utils/reviews";

const formatMoney = (value, currency = "INR") =>
  `${currency === "INR" ? "₹" : currency} ${Number(value ?? 0) || 0}`;

const normalizeOrder = (order, currency = "INR") => ({
  id: order.id || order.order_id,
  date: order.placed_on || order.date || order.created_at || "",
  status: order.status || "Processing",
  payment_status: order.payment_status || "",
  total: formatMoney(order.total ?? order.amount, order.currency || currency),
  product_name: order.product_name || "",
  product_variant: order.product_variant || order.variant_name || "",
  items_count: order.items_count ?? order.items?.length ?? 0,
});

const isPaidDeliveredOrder = (order) =>
  String(order?.status || "").toLowerCase() === "delivered" &&
  (!order?.payment_status ||
    String(order.payment_status).toLowerCase() === "paid");

const ReviewModal = ({
  form,
  item,
  loading,
  message,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-sm bg-white p-6 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.08em] text-black/70 hover:border-black"
        >
          Close
        </button>
        <p className="text-xs uppercase tracking-[0.12em] text-black/50">
          Product review
        </p>
        <h2 className="mt-2 pr-16 text-xl font-semibold text-black">
          {item.product_name}
        </h2>
        <p className="mt-1 text-sm text-black/55">{item.variant_name}</p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.12em] text-black/50">
              Rating
            </label>
            <select
              name="rating"
              value={form.rating}
              onChange={onChange}
              className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} star{rating > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.12em] text-black/50">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Loved it"
              className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.12em] text-black/50">
              Comment
            </label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={onChange}
              required
              rows={5}
              placeholder="Tell us what you thought."
              className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.12em] text-black/50">
              Images optional
            </label>
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={onChange}
              className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.08em] file:text-white"
            />
            {form.images?.length > 0 && (
              <p className="mt-2 text-xs text-black/50">
                {form.images.length} image{form.images.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
          {message && <p className="text-sm text-black/60">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Submit review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [stats, setStats] = useState([
    { label: "Total orders", value: "0" },
    { label: "Orders in transit", value: "0" },
    { label: "Delivered orders", value: "0" },
    { label: "Amount spent", value: "₹ 0" },
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [reviewItems, setReviewItems] = useState([]);
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewForm, setReviewForm] = useState(EMPTY_REVIEW_FORM);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const defaultAddress =
    addresses.find((address) => address.is_default) || addresses[0];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login?next=/user/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    let active = true;

    const loadDashboard = async () => {
      setDashboardLoading(true);
      setDashboardError("");
      try {
        const [dashboardRes, addressRes, ordersRes, reviewsRes] = await Promise.all([
          apiFetch("/user/dashboard"),
          apiFetch("/addresses"),
          apiFetch("/orders?page=1&limit=5"),
          apiFetch("/reviews/eligible").catch(() => null),
        ]);
        if (!active) return;

        const dashboard = dashboardRes?.data || dashboardRes || {};
        const ordersPayload = ordersRes?.data || ordersRes || {};
        const nextStats = dashboard.stats || {};
        const currency = nextStats.currency || "INR";
        const orderItems = Array.isArray(ordersPayload.items)
          ? ordersPayload.items
          : dashboard.recent_orders || [];

        setStats([
          { label: "Total orders", value: String(nextStats.total_orders ?? orderItems.length ?? 0) },
          {
            label: "Orders in transit",
            value: String(nextStats.active_orders ?? 0),
          },
          {
            label: "Delivered orders",
            value: String(nextStats.delivered_orders ?? 0),
          },
          {
            label: "Amount spent",
            value: formatMoney(nextStats.total_spent, currency),
          },
        ]);
        setRecentOrders(orderItems.slice(0, 5).map((order) => normalizeOrder(order, currency)));
        const eligibleItems = extractEligibleReviewItems(reviewsRes);
        setReviewItems(
          eligibleItems
            .filter((item) => item.can_review)
            .slice(0, 4),
        );
        setAddresses(Array.isArray(addressRes) ? addressRes : addressRes?.data || []);
      } catch (err) {
        if (active) {
          setDashboardError(err?.message || "Failed to load dashboard.");
        }
      } finally {
        if (active) setDashboardLoading(false);
      }
    };

    loadDashboard();
    return () => {
      active = false;
    };
  }, [loading, isAuthenticated]);

  const openReviewModal = (item) => {
    setReviewItem(item);
    setReviewForm(EMPTY_REVIEW_FORM);
    setReviewMessage("");
  };

  const handleReviewChange = (event) => {
    const { name, value, files } = event.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]:
        name === "rating"
          ? Number(value)
          : name === "images"
            ? Array.from(files || [])
            : value,
    }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!reviewItem?.order_item_id) return;
    setReviewSaving(true);
    setReviewMessage("");
    try {
      const formData = buildReviewFormData(
        reviewItem.order_item_id,
        reviewForm,
      );
      await apiFetch("/reviews", {
        method: "POST",
        body: formData,
      });
      setReviewItems((prev) =>
        prev.filter((item) => item.order_item_id !== reviewItem.order_item_id),
      );
      setReviewMessage("Review submitted. It will appear after approval.");
    } catch (err) {
      const message = err?.message || "Unable to save review.";
      setReviewMessage(
        message.toLowerCase().includes("not found")
          ? "Review API is not available on the live server yet. Please confirm /api/reviews is deployed."
          : message,
      );
    } finally {
      setReviewSaving(false);
    }
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
              Dashboard
            </h1>
          </div>
          <Link
            href="/user/orders"
            className="self-start rounded-sm border border-black/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black cursor-pointer"
          >
            View orders
          </Link>
        </div>

        {dashboardError && (
          <p className="mt-6 text-sm text-red-600">{dashboardError}</p>
        )}
        {dashboardLoading && (
          <p className="mt-6 text-sm text-black/60">Loading dashboard...</p>
        )}

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-sm shadow-sm bg-gray-50 p-5">
              <p className="text-xs uppercase tracking-[0.093em] text-black/80">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-sm border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.093em] text-black/80">
                  Give review
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  Delivered items waiting for feedback
                </h2>
              </div>
              <Link
                href="/user/orders"
                className="self-start rounded-sm border border-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black"
              >
                View delivered orders
              </Link>
            </div>
            {reviewItems.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {reviewItems.map((item) => (
                  <div
                    key={item.order_item_id}
                    className="rounded-sm border border-black/10 bg-gray-50 p-4"
                  >
                    <div className="flex gap-3">
                      <div className="h-16 w-16 shrink-0 rounded-sm bg-white p-2">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.product_name}
                            className="h-full w-full object-contain"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-black">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-black/60">
                          {item.variant_name}
                        </p>
                        <p className="mt-1 text-xs text-black/45">
                          Delivered {item.delivered_date || "-"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openReviewModal(item)}
                      className="mt-4 w-full rounded-full border border-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black hover:bg-black hover:text-white"
                    >
                      Give review
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-black/60">
                Delivered products that can be reviewed will appear here. You can also open any delivered order to review its items.
              </p>
            )}
          </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.093em] text-black/80">
                  Recent orders
                </p>
                <h2 className="mt-2 text-xl font-semibold">Latest activity</h2>
              </div>
              <Link
                href="/user/orders"
                className="rounded-sm border border-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black cursor-pointer"
              >
                View all
              </Link>
            </div>
            <div className="mt-6 grid gap-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/user/orders/${order.id}`}
                  className="rounded-sm shadow-sm bg-gray-50 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between hover:border-black/30 border border-transparent transition cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{order.id}</p>
                    <p className="text-xs text-black/50">{order.date}</p>
                    <p className="mt-1 text-xs text-black/60">
                      {order.product_name || "Order item"}
                      {order.product_variant ? ` - ${order.product_variant}` : ""}
                      {order.items_count
                        ? ` (${order.items_count} item${order.items_count > 1 ? "s" : ""})`
                        : ""}
                    </p>
                  </div>
                  <div className="text-sm text-black/60 md:text-center">
                    <p>{order.status}</p>
                    {order.payment_status && (
                      <p className="text-xs text-black/45">
                        Payment: {order.payment_status}
                      </p>
                    )}
                    {isPaidDeliveredOrder(order) && (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-black">
                        Give review
                      </p>
                    )}
                  </div>
                  <div className="text-sm font-semibold">{order.total}</div>
                </Link>
              ))}
              {!dashboardLoading && recentOrders.length === 0 && (
                <p className="text-sm text-black/60">No recent orders yet.</p>
              )}
            </div>
          </div>

          <div className="py-6">
            <p className="text-xs uppercase tracking-[0.093em] text-black/80">
              Saved address
            </p>
            {defaultAddress ? (
              <div className="mt-4 rounded-sm shadow-sm bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.093em] text-black/70">
                  {defaultAddress.label}
                </p>
                <p className="mt-2 text-sm">{defaultAddress.address_line1}</p>
                <p className="text-sm">{defaultAddress.address_line2}</p>
                <p className="text-sm">
                  {defaultAddress.city}, {defaultAddress.state}{" "}
                  {defaultAddress.pincode}
                </p>
                <p className="text-sm">{defaultAddress.country}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-black/60">
                No saved addresses yet.
              </p>
            )}
            <Link href="/user/profile">
              <button className="mt-6 w-full rounded-sm border border-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white cursor-pointer">
                Manage addresses
              </button>
            </Link>
          </div>
        </div>
      </section>
      <ReviewModal
        form={reviewForm}
        item={reviewItem}
        loading={reviewSaving}
        message={reviewMessage}
        onChange={handleReviewChange}
        onClose={() => setReviewItem(null)}
        onSubmit={handleReviewSubmit}
      />
    </main>
  );
}
