"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";

const formatMoney = (value) => {
  if (typeof value === "string") return value;
  return `₹ ${Number(value ?? 0) || 0}`;
};

const normalizeFailedPaymentDetails = (payload, orderId) => {
  const data = payload?.data || payload || {};
  const payment = data.payment || data.order || data;
  const customer = data.customer || {};
  const totals = data.totals || data.summary || data.bill || payment;
  const products = data.items || data.products || data.order_items || [];
  const total =
    totals.final_total ?? totals.total ?? payment.total ?? payment.amount;

  return {
    order: {
      id:
        payment.payment_attempt_id ||
        payment.id ||
        payment.razorpay_order_id ||
        orderId ||
        "Payment attempt",
      razorpayOrderId: payment.razorpay_order_id || "",
      attemptedOn:
        payment.attempted_at || payment.created_at || payment.date || "",
      paymentMethod: payment.payment_method || "Razorpay",
      total: formatMoney(total),
      email: customer.email || payment.email || data.email || "",
      phone:
        customer.phone ||
        payment.contact ||
        payment.phone ||
        data.contact ||
        data.phone ||
        "",
      failureReason:
        data.failure_reason ||
        payment.failure_reason ||
        data.message ||
        "Payment authorization failed. Please try again.",
    },
    items: products.map((item) => ({
      id: item.id || item.variant_id,
      name: item.product_name || item.name || "",
      variant: item.variant_name || item.variant || "",
      qty: item.quantity || item.qty || 0,
      price: formatMoney(item.line_total ?? item.price),
      image: item.image || item.product_image || "",
    })),
  };
};

export default function PaymentFailedPage() {
  const [order, setOrder] = useState({
    id: "TKC-2049",
    attemptedOn: "April 11, 2026",
    paymentMethod: "Razorpay • UPI",
    total: "₹ 1,298",
    email: "customer@example.com",
    phone: "+91 98765 43210",
    failureReason: "Payment authorization failed. Please try again.",
  });
  const [items, setItems] = useState([
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
  ]);

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentAttemptId =
      params.get("payment_attempt_id") || params.get("order_id");
    if (!paymentAttemptId) {
      setLoadingDetails(false);
      setDetailsError("Payment attempt id is missing.");
      return;
    }

    const loadPaymentDetails = async () => {
      setLoadingDetails(true);
      setDetailsError("");
      try {
        const payload = await apiFetch(`/payments/failed/${paymentAttemptId}`);
        const details = normalizeFailedPaymentDetails(
          payload,
          paymentAttemptId,
        );
        setOrder(details.order);
        setItems(details.items);
      } catch (err) {
        setDetailsError(err?.message || "Unable to load payment details.");
      } finally {
        setLoadingDetails(false);
      }
    };

    loadPaymentDetails();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black mt-12">
      <section className="site-container py-16">
        <p className="text-md uppercase tracking-[0.4em] text-black/60">
          Payment failed
        </p>
        <h1
          className="mt-4 text-3xl md:text-4xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          We couldn&apos;t process your payment
        </h1>
        <p className="mt-4 text-md text-black/60">
          Please try again or use a different payment method.
        </p>
        {loadingDetails && (
          <p className="mt-4 text-md text-black/60">Loading order details...</p>
        )}
        {detailsError && (
          <p className="mt-4 text-md text-red-600">{detailsError}</p>
        )}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-sm border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-md uppercase tracking-[0.2em] text-black/50">
              Payment attempt
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-md text-black/70">
              <div>
                <p className="text-md uppercase tracking-[0.2em] text-black/50">
                  Attempt ID
                </p>
                <p className="mt-1 font-semibold text-black">{order.id}</p>
              </div>
              {order.razorpayOrderId && (
                <div>
                  <p className="text-md uppercase tracking-[0.2em] text-black/50">
                    Razorpay order
                  </p>
                  <p className="mt-1 font-semibold text-black">
                    {order.razorpayOrderId}
                  </p>
                </div>
              )}
              <div>
                <p className="text-md uppercase tracking-[0.2em] text-black/50">
                  Attempted on
                </p>
                <p className="mt-1 font-semibold text-black">
                  {order.attemptedOn}
                </p>
              </div>
              <div>
                <p className="text-md uppercase tracking-[0.2em] text-black/50">
                  Payment
                </p>
                <p className="mt-1 font-semibold text-black">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-md uppercase tracking-[0.2em] text-black/50">
                  Amount
                </p>
                <p className="mt-1 font-semibold text-black">{order.total}</p>
              </div>
              <div>
                <p className="text-md uppercase tracking-[0.2em] text-black/50">
                  Email
                </p>
                <p className="mt-1">{order.email}</p>
              </div>
              <div>
                <p className="text-md uppercase tracking-[0.2em] text-black/50">
                  Phone
                </p>
                <p className="mt-1">{order.phone}</p>
              </div>
            </div>
            <div className="mt-6 rounded-sm border border-red-200 bg-red-50 p-4 text-md text-red-700">
              {order.failureReason}
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/checkout"
                className="rounded-full bg-black px-6 py-3 text-md font-semibold uppercase tracking-[0.3em] text-white"
              >
                Retry payment
              </Link>
              <Link
                href="/cart"
                className="rounded-full border border-black px-6 py-3 text-md font-semibold uppercase tracking-[0.3em] text-black"
              >
                Back to cart
              </Link>
            </div>
          </div>

          <div className="rounded-sm border border-black/10 bg-gray-50 p-6 shadow-sm">
            <p className="text-md uppercase tracking-[0.2em] text-black/50">
              Items in this payment attempt
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
                    <p className="text-md font-semibold text-black">
                      {item.name}
                    </p>
                    <p className="text-md text-black/60">{item.variant}</p>
                    <p className="text-md text-black/60">Qty: {item.qty}</p>
                  </div>
                  <p className="text-md font-semibold text-black">
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-md text-black/50">
              Your cart is still available. Retry payment when you are ready.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
