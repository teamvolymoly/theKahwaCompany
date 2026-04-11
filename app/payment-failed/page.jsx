"use client";

import Link from "next/link";

export default function PaymentFailedPage() {
  const order = {
    id: "TKC-2049",
    attemptedOn: "April 11, 2026",
    paymentMethod: "Razorpay • UPI",
    total: "₹ 1,298",
    email: "customer@example.com",
    phone: "+91 98765 43210",
    failureReason: "Payment authorization failed. Please try again.",
  };
  const items = [
    {
      id: 101,
      name: "Kashmiri Kahwa",
      variant: "30 Tea Bags",
      qty: 1,
      price: "₹ 499",
      image: "/products/tin/BLTIN1.png",
    },
    {
      id: 104,
      name: "Kahwa Sampler Set",
      variant: "Sampler Box",
      qty: 1,
      price: "₹ 799",
      image: "/products/tin/KLTIN1.png",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-black mt-12">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[0.4em] text-black/60">
          Payment failed
        </p>
        <h1
          className="mt-4 text-3xl md:text-4xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          We couldn't process your payment
        </h1>
        <p className="mt-4 text-sm text-black/60">
          Please try again or use a different payment method.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-sm border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
              Payment attempt
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-black/70">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Order ID
                </p>
                <p className="mt-1 font-semibold text-black">{order.id}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Attempted on
                </p>
                <p className="mt-1 font-semibold text-black">
                  {order.attemptedOn}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Payment
                </p>
                <p className="mt-1 font-semibold text-black">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Amount
                </p>
                <p className="mt-1 font-semibold text-black">{order.total}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Email
                </p>
                <p className="mt-1">{order.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Phone
                </p>
                <p className="mt-1">{order.phone}</p>
              </div>
            </div>
            <div className="mt-6 rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {order.failureReason}
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/checkout"
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
          </div>

          <div className="rounded-sm border border-black/10 bg-gray-50 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
              Items in this order
            </p>
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b border-black/10 pb-4"
                >
                  <div className="h-14 w-14 rounded-sm bg-white p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-black">
                      {item.name}
                    </p>
                    <p className="text-xs text-black/60">{item.variant}</p>
                    <p className="text-xs text-black/60">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold text-black">
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-black/50">
              Your order is reserved. Complete payment within 30 minutes to
              avoid cancellation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
