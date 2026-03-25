"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: 101,
      name: "Kashmiri Kahwa Premium Green Tea",
      variant: "30 Bags",
      price: 499,
      qty: 1,
      image: "/products/tin/BLTIN1.png",
    },
    {
      id: 104,
      name: "Kahwa Sampler Set",
      variant: "Sampler Box",
      price: 799,
      qty: 2,
      image: "/products/tin/KLTIN1.png",
    },
  ]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items],
  );
  const shipping = subtotal > 999 ? 0 : 120;
  const total = subtotal + shipping;

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    localStorage.setItem("cart_count", String(count));
    window.dispatchEvent(new Event("cartchange"));
  }, [items]);

  return (
    <main className="min-h-screen bg-white text-black">
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
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            {items.length === 0 ? (
              <p className="text-black/60">Your cart is empty.</p>
            ) : (
              <div className="grid gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-center"
                  >
                    <div className="h-24 w-24 overflow-hidden rounded-2xl bg-black/5 p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold">{item.name}</h3>
                      <p className="mt-2 text-sm text-black/60">
                        {item.variant}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="mt-3 text-xs uppercase tracking-[0.2em] text-black/50 hover:text-black"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 rounded-full border border-black/10 px-4 py-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          className="text-lg"
                        >
                          -
                        </button>
                        <span className="text-sm">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="text-lg"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm font-semibold">
                        Rs.{item.price * item.qty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">
              Order summary
            </p>
            <div className="mt-6 grid gap-3 text-sm text-black/70">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>Rs.{subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `Rs.${shipping}`}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-3 text-black font-semibold">
                <span>Total</span>
                <span>Rs.{total}</span>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs uppercase tracking-[0.3em] text-black/50">
                Promo code
              </label>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="KAHWA10"
                  className="flex-1 rounded-full border border-black/20 px-4 py-2 text-sm outline-none focus:border-black"
                />
                <button className="rounded-full border border-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                  Apply
                </button>
              </div>
            </div>
            <Link href="/checkout">
              <button className="mt-8 w-full rounded-full bg-black px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white">
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
