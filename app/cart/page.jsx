"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { apiFetch } from "@/utils/api";

const EMPTY_SUMMARY = {
  subtotal: 0,
  shipping: 0,
  tax: 0,
  discount_amount: 0,
  total: 0,
  final_total: 0,
  currency: "INR",
  free_shipping_threshold: 0,
};

const normalizeCartItem = (item) => {
  const variant = item?.variant || {};
  const product = variant?.product || {};
  const primaryImage =
    variant?.primaryImage || product?.primaryImage || product?.image || {};
  const quantity = Number(item?.quantity ?? item?.qty ?? 0) || 0;
  const unitPrice =
    Number(item?.price ?? item?.unit_price ?? variant?.price ?? 0) || 0;

  return {
    ...item,
    cart_item_id: item?.id || item?.cart_item_id || item?.cart_id || null,
    variant_id: item?.variant_id || variant?.id || null,
    quantity,
    price: unitPrice,
    subtotal:
      Number(item?.line_total ?? item?.subtotal ?? unitPrice * quantity) || 0,
    product_name: item?.product_name || item?.name || product?.name || "",
    variant_name:
      item?.variant_name ||
      (typeof item?.variant === "string" ? item.variant : "") ||
      variant?.variant_name ||
      variant?.name ||
      "",
    product_image:
      item?.product_image ||
      item?.image ||
      primaryImage?.image_url ||
      primaryImage?.url ||
      product?.image_url ||
      "",
  };
};

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [coupon, setCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState("");

  const hydrateCart = useCallback((payload) => {
    const cart = payload?.items ? payload : payload?.data || {};
    const nextItems = Array.isArray(cart?.items) ? cart.items : [];
    setItems(nextItems.map(normalizeCartItem));
    setSummary({ ...EMPTY_SUMMARY, ...(cart?.summary || {}) });
    setCoupon(cart?.coupon || null);
    setCouponCode(cart?.coupon?.code || "");
  }, []);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      hydrateCart(await apiFetch("/cart"));
    } catch (loadError) {
      setError(loadError?.message || "Failed to load cart.");
      setItems([]);
      setSummary(EMPTY_SUMMARY);
      setCoupon(null);
      setCouponCode("");
    } finally {
      setLoading(false);
    }
  }, [hydrateCart]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    localStorage.setItem("cart_count", String(count));
    window.dispatchEvent(new Event("cartchange"));
  }, [items]);

  const subtotal = useMemo(() => summary.subtotal ?? 0, [summary.subtotal]);
  const freeShippingThreshold = summary.free_shipping_threshold ?? 0;
  const shipping = summary.shipping ?? 0;
  const discount = summary.discount_amount ?? 0;
  const finalTotal = summary.final_total ?? 0;
  const total =
    discount > 0 || finalTotal > 0 || subtotal === 0
      ? finalTotal
      : (summary.total ?? subtotal + shipping);
  const amountForFreeShipping =
    freeShippingThreshold > 0 && subtotal < freeShippingThreshold
      ? Math.max(0, freeShippingThreshold + 1 - subtotal)
      : 0;

  const updateQty = async (item, delta) => {
    if (actionLoading) return;
    const itemId = item.cart_item_id || item.id;
    if (!itemId) {
      setError("Unable to update quantity.");
      return;
    }

    setActionLoading(true);
    setError("");
    try {
      await apiFetch(`/cart/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity: Math.max(1, item.quantity + delta) }),
      });
      await loadCart();
    } catch (updateError) {
      setError(updateError?.message || "Unable to update quantity.");
    } finally {
      setActionLoading(false);
    }
  };

  const removeItem = async (item) => {
    if (actionLoading) return;
    const itemId = item.cart_item_id || item.id;
    if (!itemId) {
      setError("Unable to remove item.");
      return;
    }

    setActionLoading(true);
    setError("");
    try {
      await apiFetch(`/cart/${itemId}`, { method: "DELETE" });
      await loadCart();
    } catch (removeError) {
      setError(removeError?.message || "Unable to remove item.");
    } finally {
      setActionLoading(false);
    }
  };

  const applyCoupon = async (event) => {
    event.preventDefault();
    if (couponLoading) return;
    const code = couponCode.trim();
    if (!code) {
      setError("Please enter a coupon code.");
      setCouponMessage("");
      return;
    }

    setCouponLoading(true);
    setError("");
    setCouponMessage("");
    try {
      await apiFetch("/api/coupons/apply", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      await loadCart();
      setCouponMessage("Coupon applied.");
    } catch (couponError) {
      setError(couponError?.message || "Unable to apply coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = async () => {
    if (couponLoading) return;
    setCouponLoading(true);
    setError("");
    setCouponMessage("");
    try {
      await apiFetch("/api/coupons/remove", {
        method: "POST",
        body: JSON.stringify({}),
      });
      await loadCart();
      setCoupon(null);
      setCouponCode("");
      setCouponMessage("Coupon removed.");
    } catch (couponError) {
      setError(couponError?.message || "Unable to remove coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <main className="min-h-[650px] overflow-x-hidden bg-[#fdfefb] pt-[70px] text-[#1f241c]">
      <section className="site-container pb-[86px] pt-16 sm:pt-[86px]">
        <h1
          className="text-4xl font-normal uppercase leading-none text-[#344823]"
          style={{ fontFamily: "var(--font-basker)" }}
        >
          Cart
        </h1>

        <div className="mt-10 grid items-start gap-5 lg:grid-cols-[minmax(0,2.05fr)_minmax(330px,1fr)]">
          <section className="min-h-[405px] rounded-lg bg-[#f3f6ef] px-5 py-7 sm:px-8">
            {loading ? (
              <p className="py-12 text-center text-[#6f756a]">
                Loading your cart…
              </p>
            ) : items.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <p className="font-basker text-2xl text-[#3f532b]">
                  Your cart is empty.
                </p>
                <Link
                  href="/shop"
                  className="mt-5 border border-[#617447] px-6 py-2.5 text-md text-[#52633d] transition hover:bg-[#e7ecdf]"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="hidden grid-cols-[minmax(0,1fr)_90px_150px_38px_92px] items-center gap-4 px-1 pb-4 text-base uppercase lg:grid">
                  <span className="pl-[110px]">Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span aria-hidden="true" />
                  <span>Subtotal</span>
                </div>

                <div className="divide-y divide-[#dce0d8]">
                  {items.map((item) => (
                    <article
                      key={item.cart_item_id || item.id}
                      className="relative grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_90px_150px_38px_92px] lg:items-center lg:gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-5">
                        <div className="h-[90px] w-[90px] shrink-0 overflow-hidden rounded bg-white">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-md text-[#8b9086]">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 pr-8 lg:pr-0">
                          <h2 className="font-basker text-xl uppercase leading-tight">
                            {item.product_name}
                          </h2>
                          {item.variant_name ? (
                            <p className="mt-2 text-md">{item.variant_name}</p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-base lg:block">
                        <span className="text-base uppercase text-[#73786f] lg:hidden">
                          Price
                        </span>
                        <span>₹{item.price}</span>
                      </div>

                      <div className="flex items-center justify-between lg:block">
                        <span className="text-base uppercase text-[#73786f] lg:hidden">
                          Quantity
                        </span>
                        <div className="grid h-9 w-[122px] grid-cols-3 overflow-hidden rounded border border-[#d6dad2] bg-white text-base">
                          <button
                            type="button"
                            onClick={() => updateQty(item, -1)}
                            disabled={actionLoading || item.quantity <= 1}
                            className="cursor-pointer transition hover:bg-[#edf0e9] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Decrease ${item.product_name} quantity`}
                          >
                            −
                          </button>
                          <span className="flex items-center justify-center border-x border-[#d6dad2]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item, 1)}
                            disabled={actionLoading}
                            className="cursor-pointer transition hover:bg-[#edf0e9] disabled:opacity-40"
                            aria-label={`Increase ${item.product_name} quantity`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        disabled={actionLoading}
                        className="absolute right-0 top-7 cursor-pointer text-[#9b9e98] transition hover:text-[#4d5e39] disabled:opacity-40 lg:static"
                        aria-label={`Remove ${item.product_name}`}
                      >
                        <X className="h-6 w-6" strokeWidth={1.5} />
                      </button>

                      <div className="flex items-center justify-between text-base lg:block">
                        <span className="text-base uppercase text-[#73786f] lg:hidden">
                          Subtotal
                        </span>
                        <span>
                          ₹{item.subtotal ?? item.price * item.quantity}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>

          <aside className="rounded-lg bg-[#f3f6ef] px-6 py-7 sm:px-8">
            <h2 className="text-[28px] font-semibold leading-none text-[#344823]">
              Cart totals
            </h2>

            {error ? (
              <p className="mt-5 rounded bg-[#f8e8e4] px-4 py-3 text-md text-[#8b352b]">
                {error}
              </p>
            ) : null}

            <div className="mt-7 rounded bg-[#e5e9df] px-4 py-3 text-md text-[#454a42]">
              {freeShippingThreshold > 0 && subtotal >= freeShippingThreshold
                ? "You got FREE delivery."
                : freeShippingThreshold > 0
                  ? `Add ₹${amountForFreeShipping} more to get FREE delivery on orders above ₹${freeShippingThreshold}.`
                  : "Shipping will be calculated at checkout."}
            </div>

            <form
              className="mt-6 grid grid-cols-[minmax(0,1fr)_110px] gap-3 sm:grid-cols-[minmax(0,1fr)_118px]"
              onSubmit={applyCoupon}
            >
              <input
                aria-label="Coupon code"
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                disabled={couponLoading || Boolean(coupon)}
                className="min-w-0 flex-1 rounded-lg border border-[#7d904e] bg-transparent px-4 py-2.5 text-base outline-none placeholder:text-[#747970] focus:border-[#52653b]"
              />
              <button
                type={coupon ? "button" : "submit"}
                onClick={coupon ? removeCoupon : undefined}
                disabled={couponLoading}
                className="rounded-lg bg-[#52653b] px-4 py-2.5 text-base text-white transition hover:bg-[#6B7F42] disabled:opacity-50"
              >
                {coupon
                  ? couponLoading
                    ? "Removing"
                    : "Remove"
                  : couponLoading
                    ? "Applying"
                    : "Apply"}
              </button>
            </form>
            {couponMessage ? (
              <p className="mt-2 text-md text-[#52633d]">{couponMessage}</p>
            ) : null}

            <dl className="mt-7 space-y-3 text-base">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>₹{subtotal}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? "Free" : `₹${shipping}`}</dd>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between text-[#52633d]">
                  <dt>Discount</dt>
                  <dd>− ₹{discount}</dd>
                </div>
              ) : null}
              <div className="flex justify-between pt-1 text-[22px]">
                <dt>Total</dt>
                <dd>₹{total}</dd>
              </div>
            </dl>

            {items.length ? (
              <Link
                href="/checkout"
                className="mt-9 flex h-11 w-full items-center justify-center rounded-lg bg-[#52653b] text-base font-semibold text-white transition hover:bg-[#6B7F42]"
              >
                Proceed To Checkout
              </Link>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}
