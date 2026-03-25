"use client";

import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-black/60">
          Payment failed
        </p>
        <h1
          className="mt-4 text-3xl md:text-4xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          We couldn’t process your payment
        </h1>
        <p className="mt-4 text-sm text-black/60">
          Please try again or use a different payment method.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/payment"
            className="rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white"
          >
            Retry payment
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black"
          >
            Back to cart
          </Link>
        </div>
      </section>
    </main>
  );
}
