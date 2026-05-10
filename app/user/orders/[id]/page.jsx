"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { jsPDF } from "jspdf";
import { useAuth } from "@/app/context/AuthContext";
import { apiFetch } from "@/utils/api";

const formatMoney = (value, currency = "INR") =>
  `${currency === "INR" ? "₹" : currency} ${Number(value ?? 0) || 0}`;

const emptyAddress = {
  label: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
};

const normalizeOrderDetail = (payload, orderId) => {
  const data = payload?.data || payload || {};
  const order = data.order || data;
  const customer = data.customer || {};
  const invoice = data.invoice || {};
  const shippingAddress =
    data.shipping_address || order.shipping_address || emptyAddress;
  const items = data.items || order.items || [];
  const currency = order.currency || "INR";

  return {
    id: order.id || order.order_id || orderId,
    placed_on: order.placed_on || order.date || order.created_at || "",
    status: order.status || "Processing",
    payment_status: order.payment_status || "",
    payment_method: order.payment_method || "Online",
    delivered_date: order.delivered_date || order.delivery_date || "",
    subtotal: order.subtotal ?? data.summary?.subtotal ?? 0,
    shipping: order.shipping ?? data.summary?.shipping ?? 0,
    tax: order.tax ?? data.summary?.tax ?? 0,
    discount: order.discount ?? data.summary?.discount ?? 0,
    total: order.total ?? data.summary?.total ?? 0,
    currency,
    customer: {
      name: customer.name || order.customer_name || "",
      email: customer.email || order.email || "",
      phone: customer.phone || order.phone || "",
    },
    items: items.map((item) => ({
      id: item.id || item.variant_id || item.product_id,
      product_name: item.product_name || item.name || "",
      variant_name: item.variant_name || item.variant || "",
      quantity: item.quantity || item.qty || 0,
      price: item.price ?? 0,
      line_total:
        item.line_total ?? (item.price ?? 0) * (item.quantity || item.qty || 1),
      image: item.image || item.product_image || "",
    })),
    shipping_address: {
      label: shippingAddress.label || "",
      address_line1:
        shippingAddress.address_line1 || shippingAddress.line1 || "",
      address_line2:
        shippingAddress.address_line2 || shippingAddress.line2 || "",
      city: shippingAddress.city || "",
      state: shippingAddress.state || "",
      pincode: shippingAddress.pincode || shippingAddress.postal_code || "",
      country: shippingAddress.country || "",
    },
    invoice: {
      number: invoice.number || order.invoice_number || `INV-${orderId || ""}`,
      issued_on: invoice.issued_on || order.placed_on || order.created_at || "",
      seller: "The Kahwa Company",
    },
  };
};

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-[0.08em] text-black/50">{label}</p>
    <p className="mt-1 text-sm font-semibold text-black">{value || "-"}</p>
  </div>
);

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { isAuthenticated, loading } = useAuth();

  const [order, setOrder] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/auth/login?next=/user/orders/${id}`);
    }
  }, [loading, isAuthenticated, router, id]);

  useEffect(() => {
    if (!id || loading || !isAuthenticated) return;
    let active = true;

    const loadOrder = async () => {
      setLoadingOrder(true);
      setError("");
      try {
        const data = await apiFetch(`/orders/${encodeURIComponent(id)}`);
        if (active) setOrder(normalizeOrderDetail(data, id));
      } catch (err) {
        if (active) {
          setError(err?.message || "Failed to load order.");
          setOrder(null);
        }
      } finally {
        if (active) setLoadingOrder(false);
      }
    };

    loadOrder();
    return () => {
      active = false;
    };
  }, [id, loading, isAuthenticated]);

  const fetchImageAsDataURL = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;

    const logoDataUrl = await fetchImageAsDataURL("/logo/LOGO_TKC-02.png");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    doc.addImage(logoDataUrl, "PNG", 40, y, 80, 40);
    doc.setFontSize(16);
    doc.text("Invoice", pageWidth - 40, y + 18, { align: "right" });
    doc.setFontSize(10);
    doc.text(`Invoice ID: ${order.invoice.number}`, pageWidth - 40, y + 34, {
      align: "right",
    });
    y += 70;

    doc.setFontSize(11);
    doc.text(`Seller: ${order.invoice.seller}`, 40, y);
    doc.text(`Issued on: ${order.invoice.issued_on}`, pageWidth - 40, y, {
      align: "right",
    });
    y += 32;

    doc.setDrawColor(0);
    doc.line(40, y, pageWidth - 40, y);
    y += 20;

    doc.setFontSize(11);
    doc.text("Bill To:", 40, y);
    doc.text(order.customer.name || "-", 40, y + 14);
    doc.text(order.customer.email || "-", 40, y + 28);
    doc.text(order.customer.phone || "-", 40, y + 42);
    doc.text(`Order ID: ${order.id}`, pageWidth - 40, y, { align: "right" });
    doc.text(`Payment: ${order.payment_method}`, pageWidth - 40, y + 14, {
      align: "right",
    });
    doc.text(
      `Payment status: ${order.payment_status || "-"}`,
      pageWidth - 40,
      y + 28,
      {
        align: "right",
      },
    );
    y += 64;

    doc.setFontSize(12);
    doc.text("Items", 40, y);
    y += 16;
    doc.setFontSize(10);
    order.items.forEach((item) => {
      doc.text(
        `${item.product_name} (${item.variant_name}) x${item.quantity}`,
        40,
        y,
      );
      doc.text(
        formatMoney(item.line_total, order.currency),
        pageWidth - 40,
        y,
        {
          align: "right",
        },
      );
      y += 16;
    });
    y += 6;

    doc.line(40, y, pageWidth - 40, y);
    y += 16;
    doc.text(
      `Subtotal: ${formatMoney(order.subtotal, order.currency)}`,
      pageWidth - 40,
      y,
      {
        align: "right",
      },
    );
    y += 14;
    doc.text(
      `Shipping: ${formatMoney(order.shipping, order.currency)}`,
      pageWidth - 40,
      y,
      {
        align: "right",
      },
    );
    y += 14;
    doc.text(
      `Tax: ${formatMoney(order.tax, order.currency)}`,
      pageWidth - 40,
      y,
      {
        align: "right",
      },
    );
    y += 14;
    doc.text(
      `Discount: ${formatMoney(order.discount, order.currency)}`,
      pageWidth - 40,
      y,
      {
        align: "right",
      },
    );
    y += 18;
    doc.setFontSize(12);
    doc.text(
      `Total: ${formatMoney(order.total, order.currency)}`,
      pageWidth - 40,
      y,
      {
        align: "right",
      },
    );
    y += 24;

    doc.setFontSize(11);
    doc.text("Deliver To:", 40, y);
    doc.setFontSize(10);
    doc.text(order.shipping_address.label || "-", 40, y + 14);
    doc.text(order.shipping_address.address_line1 || "-", 40, y + 28);
    doc.text(order.shipping_address.address_line2 || "-", 40, y + 42);
    doc.text(
      `${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.pincode}`,
      40,
      y + 56,
    );
    doc.text(order.shipping_address.country || "-", 40, y + 70);

    doc.save(`${order.invoice.number}.pdf`);
  };

  if (loadingOrder) {
    return (
      <main className="min-h-screen bg-white text-black mt-14">
        <section className="container max-w-5xl mx-auto px-6 md:px-12 py-14">
          <p className="text-sm text-black/60">Loading order details...</p>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-white text-black mt-14">
        <section className="container max-w-5xl mx-auto px-6 md:px-12 py-14">
          <p className="text-sm text-red-600">{error || "Order not found."}</p>
          <Link
            href="/user/orders"
            className="mt-6 inline-flex rounded-sm border border-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black"
          >
            Back to orders
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black mt-14">
      <section className="container max-w-5xl mx-auto px-6 md:px-12 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.094em] text-black/60">
              My account
            </p>
            <h1
              className="mt-3 text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Order {order.id}
            </h1>
            <p className="mt-2 text-sm text-black/50">
              {order.placed_on} - {order.status}
            </p>
          </div>
          <Link
            href="/user/orders"
            className="self-start rounded-sm border border-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black"
          >
            Back to orders
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-sm border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.08em] text-black/50">
              Order details
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <DetailItem label="Order ID" value={order.id} />
              <DetailItem label="Placed on" value={order.placed_on} />
              <DetailItem label="Status" value={order.status} />
              <DetailItem label="Delivered date" value={order.delivered_date} />
              <DetailItem label="Payment method" value={order.payment_method} />
              <DetailItem label="Payment status" value={order.payment_status} />
              <DetailItem label="Currency" value={order.currency} />
              <DetailItem
                label="Total"
                value={formatMoney(order.total, order.currency)}
              />
            </div>

            <div className="mt-6 rounded-sm border border-black/10 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                Customer
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <DetailItem label="Name" value={order.customer.name} />
                <DetailItem label="Email" value={order.customer.email} />
                <DetailItem label="Phone" value={order.customer.phone} />
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-black/10 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                Shipping address
              </p>
              <div className="mt-3 text-sm text-black/70">
                <p className="font-semibold text-black">
                  {order.shipping_address.label || "-"}
                </p>
                <p>{order.shipping_address.address_line1 || "-"}</p>
                {order.shipping_address.address_line2 && (
                  <p>{order.shipping_address.address_line2}</p>
                )}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{" "}
                  {order.shipping_address.pincode}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-black/10 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                    Invoice
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {order.invoice.number}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setInvoiceOpen(true)}
                    className="rounded-full border border-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black hover:bg-black hover:text-white"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadInvoice}
                    className="rounded-full border border-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black hover:bg-black hover:text-white"
                  >
                    Download
                  </button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-black/70">
                <div className="flex items-center justify-between">
                  <span>Issued on</span>
                  <span>{order.invoice.issued_on || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatMoney(order.subtotal, order.currency)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{formatMoney(order.shipping, order.currency)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>{formatMoney(order.tax, order.currency)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span>- {formatMoney(order.discount, order.currency)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-black/10 pt-3 font-semibold text-black">
                  <span>Total</span>
                  <span>{formatMoney(order.total, order.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-black/10 bg-gray-50 p-6 h-fit">
            <p className="text-xs uppercase tracking-[0.08em] text-black/50">
              Items in this order
            </p>
            <div className="mt-4 space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={item.id || `${item.product_name}-${index}`}
                  className="flex items-center gap-4 border-b border-black/10 pb-4"
                >
                  <div className="h-16 w-16 rounded-sm bg-white p-2">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="h-full w-full object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-black">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-black/60">{item.variant_name}</p>
                    <p className="text-xs text-black/60">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-xs text-black/50">
                      Unit: {formatMoney(item.price, order.currency)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-black">
                    {formatMoney(item.line_total, order.currency)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/user/orders"
                className="rounded-full border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-black"
              >
                View orders
              </Link>
              <Link
                href="/shop"
                className="rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {invoiceOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl rounded-sm bg-white p-6 shadow-lg">
            <button
              type="button"
              onClick={() => setInvoiceOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.08em] text-black/70 hover:border-black"
            >
              Close
            </button>
            <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4 pr-20">
              <img
                src="/logo/LOGO_TKC-02.png"
                alt="The Kahwa Company"
                className="h-10 w-auto object-contain"
              />
              <div className="text-right">
                <p className="text-sm font-semibold">Invoice</p>
                <p className="text-xs text-black/60">{order.invoice.number}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-black/70">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                  Seller
                </p>
                <p className="mt-1 font-semibold text-black">
                  {order.invoice.seller}
                </p>
                <p className="text-xs text-black/60">
                  Issued on {order.invoice.issued_on || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                  Bill to
                </p>
                <p className="mt-1 font-semibold text-black">
                  {order.customer.name || "-"}
                </p>
                <p>{order.customer.email || "-"}</p>
                <p className="text-xs text-black/60">
                  {order.customer.phone || "-"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-black/70">
              {order.items.map((item, index) => (
                <div
                  key={`invoice-${item.id || index}`}
                  className="flex items-center justify-between border-b border-black/10 pb-2"
                >
                  <span>
                    {item.product_name} ({item.variant_name}) x {item.quantity}
                  </span>
                  <span>{formatMoney(item.line_total, order.currency)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 text-sm text-black/70">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(order.subtotal, order.currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{formatMoney(order.shipping, order.currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>{formatMoney(order.tax, order.currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span>- {formatMoney(order.discount, order.currency)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-2 font-semibold text-black">
                <span>Total</span>
                <span>{formatMoney(order.total, order.currency)}</span>
              </div>
            </div>
            <div className="mt-4 rounded-sm border border-black/10 bg-black/5 p-3 text-xs text-black/60">
              Order status: {order.status} | Payment:{" "}
              {order.payment_status || "-"} | Delivered:{" "}
              {order.delivered_date || "-"}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
