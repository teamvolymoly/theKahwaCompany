"use client";

import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-white text-black mt-12">
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-black/60">
          Payment complete
        </p>
        <h1
          className="mt-4 text-3xl md:text-4xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Thank you for your order
        </h1>
        <p className="mt-4 text-sm text-black/60">
          Your payment was successful. A confirmation email has been sent.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/user/orders"
            className="rounded-full border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black"
          >
            View orders
          </Link>
          <Link
            href="/shop"
            className="rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
