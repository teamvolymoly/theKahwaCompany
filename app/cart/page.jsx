"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/utils/api";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0,
    free_shipping_threshold: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/cart");
      const nextItems = Array.isArray(data?.items) ? data.items : [];
      const normalized = nextItems.map((item) => ({
        ...item,
        variant_id: item.variant_id || item.id,
      }));
      setItems(normalized);
      setSummary(
        data?.summary || {
          subtotal: 0,
          shipping: 0,
          total: 0,
          free_shipping_threshold: 0,
        },
      );
    } catch (err) {
      setError(err?.message || "Failed to load cart.");
      setItems([]);
      setSummary({
        subtotal: 0,
        shipping: 0,
        total: 0,
        free_shipping_threshold: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const subtotal = useMemo(
    () => summary.subtotal ?? 0,
    [summary.subtotal],
  );
  const freeShippingThreshold = summary.free_shipping_threshold ?? 0;
  const shipping = summary.shipping ?? 0;
  const total = summary.total ?? subtotal + shipping;
  const amountForFreeShipping =
    freeShippingThreshold > 0 && subtotal < freeShippingThreshold
      ? Math.max(0, freeShippingThreshold + 1 - subtotal)
      : 0;

  const updateQty = async (item, delta) => {
    if (actionLoading) return;
    const nextQty = Math.max(1, (item.quantity || 1) + delta);
    setActionLoading(true);
    setError("");
    try {
      await apiFetch("/cart", {
        method: "POST",
        body: JSON.stringify({
          variant_id: item.variant_id || item.id,
          quantity: nextQty,
        }),
      });
      await loadCart();
    } catch (err) {
      setError(err?.message || "Unable to update quantity.");
    } finally {
      setActionLoading(false);
    }
  };

  const removeItem = async (item) => {
    if (actionLoading) return;
    setActionLoading(true);
    setError("");
    try {
      await apiFetch("/cart", {
        method: "POST",
        body: JSON.stringify({
          variant_id: item.variant_id || item.id,
          quantity: 0,
        }),
      });
      await loadCart();
    } catch (err) {
      setError(err?.message || "Unable to remove item.");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    localStorage.setItem("cart_count", String(count));
    window.dispatchEvent(new Event("cartchange"));
  }, [items]);

  return (
    <main className="min-h-screen bg-white text-black mt-12">
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-black/60">
              Shopping cart
            </p>
            <h1
              className="mt-3 text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Cart
            </h1>
          </div>
          <Link
            href="/shop"
            className="self-start text-xs font-semibold uppercase tracking-[0.2em] text-black/60 hover:text-black inline-flex items-center gap-2"
          >
            Continue shopping <span aria-hidden="true">›</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-sm border border-black/10 bg-white p-6 shadow-sm">
            {loading ? (
              <p className="text-black/60">Loading your cart...</p>
            ) : items.length === 0 ? (
              <p className="text-black/60">Your cart is empty.</p>
            ) : (
              <div className="grid gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-center"
                  >
                    <div className="h-24 w-24 overflow-hidden rounded-sm bg-black/5 p-3">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 ">
                      <h3 className="text-base font-semibold">
                        {item.product_name}
                      </h3>
                      <p className="mt-2 text-sm text-black/60">
                        {item.variant_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        disabled={actionLoading}
                        className=" text-xs uppercase tracking-[0.08em] text-black/70 hover:text-black flex items-center gap-1 cursor-pointer disabled:opacity-60"
                      >
                        <Trash2 size={15} />
                      </button>
                      <div className="flex items-center gap-3 rounded-sm border border-black/10 px-4 py-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item, -1)}
                          disabled={actionLoading}
                          className="text-lg cursor-pointer disabled:opacity-60"
                        >
                          -
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item, 1)}
                          disabled={actionLoading}
                          className="text-lg cursor-pointer disabled:opacity-60"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm font-semibold">
                        ₹ {item.subtotal ?? item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-sm border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.08em] text-black/50">
              Order summary
            </p>
            {error && (
              <div className="mt-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-xs uppercase tracking-[0.08em] text-red-700">
                {error}
              </div>
            )}
            <div className="mt-4 rounded-sm border border-dashed border-black/20 bg-black/5 px-4 py-3 text-xs uppercase tracking-[0.08em] text-black/70">
              {freeShippingThreshold > 0 && subtotal >= freeShippingThreshold
                ? "You got free delivery."
                : freeShippingThreshold > 0
                  ? `Add ₹ ${amountForFreeShipping} more for free delivery above ₹ ${freeShippingThreshold}.`
                  : "Shipping will be calculated at checkout."}
            </div>
            <div className="mt-6 grid gap-3 text-sm text-black/70">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>₹ {subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹ ${shipping}`}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-3 text-black font-semibold">
                <span>Total</span>
                <span>₹ {total}</span>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs uppercase tracking-[0.08em] text-black/50">
                Coupon code
              </label>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="KAHWA10"
                  className="flex-1 rounded-sm border  border-black/20 px-4 py-2 text-sm outline-none focus:border-black"
                />
                <button className="rounded-sm border border-black/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-black cursor-pointer hover:bg-black hover:text-white transition">
                  Apply
                </button>
              </div>
            </div>
            <Link href="/checkout">
              <button className="mt-8 w-full rounded-full bg-black px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white cursor-pointer hover:bg-black/90 transition">
                Proceed to checkout
              </button>
            </Link>
            <p className="mt-4 text-xs text-black/50">
              Taxes and shipping are calculated at checkout.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
