"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { apiFetch } from "@/utils/api";

const normalizeOrderDetail = (payload, orderId) => {
  const data = payload?.data || payload || {};
  const order = data.order || data;
  const address = data.shipping_address || order.shipping_address || {};
  const items = data.items || order.items || [];

  return {
    id: order.id || order.order_id || orderId,
    date: order.placed_on || order.date || order.created_at || "",
    ordered_date: order.placed_on || order.ordered_date || order.created_at || "",
    delivery_date:
      order.delivery_date || order.expected_delivery?.date || data.delivery_date || "",
    status: order.status || "Processing",
    payment_method: order.payment_method || "Online",
    payment_status: order.payment_status || "Paid",
    tracking_id: order.tracking_id || "",
    subtotal: order.subtotal ?? data.summary?.subtotal ?? 0,
    shipping: order.shipping ?? data.summary?.shipping ?? 0,
    tax: order.tax ?? data.summary?.tax ?? 0,
    discount: order.discount ?? data.summary?.discount ?? 0,
    total: order.total ?? data.summary?.total ?? 0,
    items,
    shipping_address: address,
  };
};

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { isAuthenticated, loading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/auth/login?next=/user/orders/${id}`);
    }
  }, [loading, isAuthenticated, router, id]);

  useEffect(() => {
    if (!id || loading || !isAuthenticated) return;
    let active = true;

    const loadOrder = async () => {
      setLoadingOrder(true);
      setError("");
      try {
        const data = await apiFetch(`/orders/${encodeURIComponent(id)}`);
        if (active) setOrder(normalizeOrderDetail(data, id));
      } catch (err) {
        if (active) {
          setError(err?.message || "Failed to load order.");
          setOrder(null);
        }
      } finally {
        if (active) setLoadingOrder(false);
      }
    };

    loadOrder();
    return () => {
      active = false;
    };
  }, [id, loading, isAuthenticated]);

  if (loadingOrder) {
    return (
      <main className="min-h-screen bg-white text-black mt-14">
        <section className="container max-w-5xl mx-auto px-6 md:px-12 py-14">
          <p className="text-sm text-black/60">Loading order details...</p>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-white text-black mt-14">
        <section className="container max-w-5xl mx-auto px-6 md:px-12 py-14">
          <p className="text-sm text-red-600">{error || "Order not found."}</p>
          <Link
            href="/user/orders"
            className="mt-6 inline-flex rounded-sm border border-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black"
          >
            Back to orders
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black mt-14">
      <section className="container max-w-5xl mx-auto px-6 md:px-12 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.094em] text-black/60">
              My account
            </p>
            <h1
              className="mt-3 text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Order {order.id}
            </h1>
            <p className="mt-2 text-sm text-black/50">
              {order.ordered_date || order.date} · {order.status}
            </p>
          </div>
          <Link
            href="/user/orders"
            className="self-start rounded-sm border border-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black"
          >
            Back to orders
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-sm border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.12em] text-black/60">
              Order info
            </p>
            <div className="mt-4 grid gap-3 text-sm text-black/70">
              <div className="flex items-center justify-between">
                <span>Ordered on</span>
                <span>{order.ordered_date || order.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery date</span>
                <span>{order.delivery_date || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span>{order.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment</span>
                <span>{order.payment_status || "Paid"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tracking ID</span>
                <span>{order.tracking_id || "—"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.12em] text-black/60">
              Items
            </p>
            <div className="mt-6 grid gap-4">
              {(order.items || []).map((item, index) => (
                <div
                  key={`${item.product_name}-${index}`}
                  className="flex flex-col gap-4 border-b border-black/10 pb-4 md:flex-row md:items-center"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-sm bg-black/5 p-3">
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.product_name}</p>
                    <p className="text-xs text-black/60">{item.variant_name}</p>
                    <p className="text-xs text-black/50">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-semibold">
                    ₹ {item.line_total ?? item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-sm border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.12em] text-black/60">
              Shipping address
            </p>
            <div className="mt-4 text-sm text-black/70">
              <p>{order.shipping_address?.label}</p>
              <p>{order.shipping_address?.address_line1}</p>
              <p>{order.shipping_address?.address_line2}</p>
              <p>
                {order.shipping_address?.city},{" "}
                {order.shipping_address?.state}{" "}
                {order.shipping_address?.pincode}
              </p>
              <p>{order.shipping_address?.country}</p>
            </div>
          </div>

          <div className="rounded-sm border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.12em] text-black/60">
              Summary
            </p>
            <div className="mt-4 grid gap-3 text-sm text-black/70">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>₹ {order.subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{order.shipping ? `₹ ${order.shipping}` : "Free"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>₹ {order.tax}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span>- ₹ {order.discount}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-black/10 pt-3 text-black font-semibold">
                <span>Total</span>
                <span>₹ {order.total}</span>
              </div>
              <div className="mt-2 text-xs text-black/50">
                Payment: {order.payment_method || "Online"}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
