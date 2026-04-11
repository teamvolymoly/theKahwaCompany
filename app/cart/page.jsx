"use client";

import { Delete, DeleteIcon, Trash2, X } from "lucide-react";
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
  const freeShippingThreshold = 500;
  const shipping = subtotal > freeShippingThreshold ? 0 : 120;
  const total = subtotal + shipping;
  const amountForFreeShipping =
    subtotal > freeShippingThreshold
      ? 0
      : Math.max(0, freeShippingThreshold + 1 - subtotal);

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
            {items.length === 0 ? (
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
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 ">
                      <h3 className="text-base font-semibold">{item.name}</h3>
                      <p className="mt-2 text-sm text-black/60">
                        {item.variant}
                      </p>
                    
                    </div>
                      
                    <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className=" text-xs uppercase tracking-[0.08em] text-black/70 hover:text-black flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={15} /> 
                      </button>
                      <div className="flex items-center gap-3 rounded-sm border border-black/10 px-4 py-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          className="text-lg cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="text-lg cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm font-semibold">
                        ₹ {item.price * item.qty}
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
            <div className="mt-4 rounded-sm border border-dashed border-black/20 bg-black/5 px-4 py-3 text-xs uppercase tracking-[0.08em] text-black/70">
              {subtotal > freeShippingThreshold
                ? "You got free delivery."
                : `Add ₹ ${amountForFreeShipping} more for free delivery above ₹ ${freeShippingThreshold}.`}
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
