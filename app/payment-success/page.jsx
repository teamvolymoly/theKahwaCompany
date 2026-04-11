"use client";

import { useState } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";

export default function PaymentSuccessPage() {
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const order = {
    id: "TKC-2049",
    placedOn: "April 11, 2026",
    paymentMethod: "Razorpay • UPI",
    total: "₹ 1,298",
    email: "customer@example.com",
    phone: "+91 98765 43210",
  };
  const delivery = {
    estimate: "April 15, 2026",
    window: "10 AM - 7 PM",
    address: {
      label: "Home",
      line1: "House 18, Boulevard Road",
      line2: "Dal Lake",
      city: "Srinagar",
      state: "Kashmir",
      pincode: "190001",
      country: "India",
    },
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
  const bill = {
    invoiceId: "INV-2049",
    issuedOn: "April 11, 2026",
    seller: "The Kahwa Company",
    gst: "GSTIN: 01ABCDE1234F1Z5",
    subtotal: "₹ 1,298",
    shipping: "₹ 0",
    taxes: "₹ 0",
    total: "₹ 1,298",
  };

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
    const logoDataUrl = await fetchImageAsDataURL("/logo/LOGO_TKC-02.png");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    doc.addImage(logoDataUrl, "PNG", 40, y, 80, 40);
    doc.setFontSize(16);
    doc.text("Invoice", pageWidth - 40, y + 18, { align: "right" });
    doc.setFontSize(10);
    doc.text(`Invoice ID: ${bill.invoiceId}`, pageWidth - 40, y + 34, {
      align: "right",
    });
    y += 70;

    doc.setFontSize(11);
    doc.text(`Seller: ${bill.seller}`, 40, y);
    doc.text(bill.gst, 40, y + 14);
    doc.text(`Issued on: ${bill.issuedOn}`, pageWidth - 40, y, {
      align: "right",
    });
    y += 36;

    doc.setDrawColor(0);
    doc.line(40, y, pageWidth - 40, y);
    y += 20;

    doc.setFontSize(11);
    doc.text("Bill To:", 40, y);
    doc.text(order.email, 40, y + 14);
    doc.text(order.phone, 40, y + 28);
    doc.text(`Order ID: ${order.id}`, pageWidth - 40, y, { align: "right" });
    doc.text(`Payment: ${order.paymentMethod}`, pageWidth - 40, y + 14, {
      align: "right",
    });
    y += 50;

    doc.setFontSize(12);
    doc.text("Items", 40, y);
    y += 16;
    doc.setFontSize(10);
    items.forEach((item) => {
      doc.text(`${item.name} (${item.variant}) x${item.qty}`, 40, y);
      doc.text(item.price, pageWidth - 40, y, { align: "right" });
      y += 16;
    });
    y += 6;

    doc.line(40, y, pageWidth - 40, y);
    y += 16;
    doc.text(`Subtotal: ${bill.subtotal}`, pageWidth - 40, y, {
      align: "right",
    });
    y += 14;
    doc.text(`Shipping: ${bill.shipping}`, pageWidth - 40, y, {
      align: "right",
    });
    y += 14;
    doc.text(`Taxes: ${bill.taxes}`, pageWidth - 40, y, {
      align: "right",
    });
    y += 18;
    doc.setFontSize(12);
    doc.text(`Total: ${bill.total}`, pageWidth - 40, y, {
      align: "right",
    });
    y += 24;

    doc.setFontSize(11);
    doc.text("Deliver To:", 40, y);
    doc.setFontSize(10);
    doc.text(delivery.address.label, 40, y + 14);
    doc.text(delivery.address.line1, 40, y + 28);
    doc.text(delivery.address.line2, 40, y + 42);
    doc.text(
      `${delivery.address.city}, ${delivery.address.state} ${delivery.address.pincode}`,
      40,
      y + 56,
    );
    doc.text(delivery.address.country, 40, y + 70);

    doc.save(`${bill.invoiceId}.pdf`);
  };

  return (
    <main className="min-h-screen bg-white text-black mt-12">
      <section className="max-w-5xl mx-auto px-6 py-16">
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
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-sm border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.08em] text-black/50">
              Order confirmation
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-black/70">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                  Order ID
                </p>
                <p className="mt-1 font-semibold text-black">{order.id}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                  Placed on
                </p>
                <p className="mt-1 font-semibold text-black">
                  {order.placedOn}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                  Payment
                </p>
                <p className="mt-1 font-semibold text-black">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                  Total paid
                </p>
                <p className="mt-1 font-semibold text-black">{order.total}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                  Email
                </p>
                <p className="mt-1">{order.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                  Phone
                </p>
                <p className="mt-1">{order.phone}</p>
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-black/10 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                Expected delivery
              </p>
              <p className="mt-2 text-sm text-black/70">
                {delivery.estimate} • {delivery.window}
              </p>
              <div className="mt-3 text-sm text-black/70">
                <p className="font-semibold text-black">
                  {delivery.address.label}
                </p>
                <p>{delivery.address.line1}</p>
                <p>{delivery.address.line2}</p>
                <p>
                  {delivery.address.city}, {delivery.address.state}{" "}
                  {delivery.address.pincode}
                </p>
                <p>{delivery.address.country}</p>
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-black/10 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                    Invoice
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {bill.invoiceId}
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
                  <span>{bill.issuedOn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{bill.subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{bill.shipping}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Taxes</span>
                  <span>{bill.taxes}</span>
                </div>
                <div className="flex items-center justify-between border-t border-black/10 pt-3 font-semibold text-black">
                  <span>Total</span>
                  <span>{bill.total}</span>
                </div>
                <div className="text-xs text-black/50">
                  {bill.seller} • {bill.gst}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-black/10 bg-gray-50 p-6 h-fit">
            <p className="text-xs uppercase tracking-[0.08em] text-black/50">
              Items in your order
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
            <div className="flex items-center gap-4 border-b border-black/10 pb-4">
              <img
                src="/logo/LOGO_TKC-02.png"
                alt="The Kahwa Company"
                className="h-10 w-auto object-contain"
              />
              <div className="text-right">
                <p className="text-sm font-semibold">Invoice</p>
                <p className="text-xs text-black/60">{bill.invoiceId}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-black/70">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                  Seller
                </p>
                <p className="mt-1 font-semibold text-black">{bill.seller}</p>
                <p className="text-xs text-black/60">{bill.gst}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                  Bill to
                </p>
                <p className="mt-1">{order.email}</p>
                <p className="text-xs text-black/60">{order.phone}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-black/70">
              {items.map((item) => (
                <div
                  key={`invoice-${item.id}`}
                  className="flex items-center justify-between border-b border-black/10 pb-2"
                >
                  <span>
                    {item.name} ({item.variant}) × {item.qty}
                  </span>
                  <span>{item.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 text-sm text-black/70">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{bill.subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{bill.shipping}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Taxes</span>
                <span>{bill.taxes}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-2 font-semibold text-black">
                <span>Total</span>
                <span>{bill.total}</span>
              </div>
            </div>
            <div className="mt-4 rounded-sm border border-black/10 bg-black/5 p-3 text-xs text-black/60">
              Expected delivery: {delivery.estimate} • {delivery.window}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
