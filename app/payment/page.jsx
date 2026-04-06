"use client";

import Link from "next/link";

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-white text-black mt-12">
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-black/60">
              Checkout
            </p>
            <h1
              className="mt-3 text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Payment
            </h1>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">
              Billing details
            </p>
            <div className="mt-6 grid gap-4">
              <input
                className="rounded-full border border-black/20 px-4 py-3 text-sm"
                placeholder="Name on card"
              />
              <input
                className="rounded-full border border-black/20 px-4 py-3 text-sm"
                placeholder="Card number"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-full border border-black/20 px-4 py-3 text-sm"
                  placeholder="MM/YY"
                />
                <input
                  className="rounded-full border border-black/20 px-4 py-3 text-sm"
                  placeholder="CVC"
                />
              </div>
              <Link
                href="/payment-success"
                className="rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white text-center"
              >
                Pay now
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-black/5 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">
              Order summary
            </p>
            <div className="mt-4 space-y-3 text-sm text-black/70">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>₹ 1,499</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-3 text-black font-semibold">
                <span>Total</span>
                <span>₹ 1,499</span>
              </div>
            </div>
            <Link
              href="/cart"
              className="mt-6 inline-flex text-xs font-semibold uppercase tracking-[0.2em] text-black/60 hover:text-black"
            >
              Back to cart
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
