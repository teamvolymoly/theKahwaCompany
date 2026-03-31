"use client";

import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white text-black mt-12">
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-black/60">
              Checkout
            </p>
            <h1
              className="mt-3 text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Delivery details
            </h1>
          </div>
          <Link
            href="/cart"
            className="self-start text-xs font-semibold uppercase tracking-[0.2em] text-black/60 hover:text-black inline-flex items-center gap-2"
          >
            Back to cart <span aria-hidden="true">›</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">
              Shipping information
            </p>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-full border border-black/20 px-4 py-3 text-sm"
                  placeholder="First name"
                />
                <input
                  className="rounded-full border border-black/20 px-4 py-3 text-sm"
                  placeholder="Last name"
                />
              </div>
              <input
                className="rounded-full border border-black/20 px-4 py-3 text-sm"
                placeholder="Email address"
              />
              <input
                className="rounded-full border border-black/20 px-4 py-3 text-sm"
                placeholder="Phone number"
              />
              <input
                className="rounded-full border border-black/20 px-4 py-3 text-sm"
                placeholder="Address line 1"
              />
              <input
                className="rounded-full border border-black/20 px-4 py-3 text-sm"
                placeholder="Address line 2"
              />
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  className="rounded-full border border-black/20 px-4 py-3 text-sm"
                  placeholder="City"
                />
                <input
                  className="rounded-full border border-black/20 px-4 py-3 text-sm"
                  placeholder="State"
                />
                <input
                  className="rounded-full border border-black/20 px-4 py-3 text-sm"
                  placeholder="Postal code"
                />
              </div>
              <Link
                href="/payment"
                className="rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white text-center"
              >
                Continue to payment
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
                <span>Rs. 1,499</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-3 text-black font-semibold">
                <span>Total</span>
                <span>Rs. 1,499</span>
              </div>
            </div>
            <p className="mt-6 text-xs text-black/50">
              By placing this order you agree to the Terms & Conditions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
