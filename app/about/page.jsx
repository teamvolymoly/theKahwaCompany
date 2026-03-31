"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-black mt-12">
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-black/60">
              Our Story
            </p>
            <h1
              className="mt-3 text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The Kahwa Company
            </h1>
          </div>
          <Link
            href="/shop"
            className="self-start text-xs font-semibold uppercase tracking-[0.2em] text-black/60 hover:text-black inline-flex items-center gap-2"
          >
            Explore blends <span aria-hidden="true">{" > "}</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">A ritual from Kashmir</h2>
            <p className="mt-4 text-sm text-black/60">
              Kahwa is more than a tea - it's a tradition. We source fine green
              tea leaves, saffron, and whole spices to craft blends that honor
              Kashmiri hospitality while feeling modern and uplifting.
            </p>
            <p className="mt-4 text-sm text-black/60">
              Every batch is blended in small lots for aroma, balance, and
              clarity. From classic saffron notes to contemporary infusions, our
              mission is to make kahwa a daily ritual.
            </p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-black/5 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">
              Our values
            </p>
            <ul className="mt-4 grid gap-3 text-sm text-black/70">
              <li>Small-batch blending</li>
              <li>Ethical sourcing</li>
              <li>Elegant gifting and packaging</li>
              <li>Transparent ingredients</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
