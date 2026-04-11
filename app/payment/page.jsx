"use client";

import Link from "next/link";

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-white text-black mt-12">
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-black/60">
          Checkout
        </p>
        <h1
          className="mt-3 text-3xl md:text-4xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Payment moved to checkout
        </h1>
        <p className="mt-4 text-sm text-black/60">
          Please complete your payment from the checkout page.
        </p>
        <Link
          href="/checkout"
          className="mt-6 inline-flex rounded-full border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white"
        >
          Go to checkout
        </Link>
      </section>
    </main>
  );
}
