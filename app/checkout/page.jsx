"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import { Pencil, Trash2, MapPin, User, Trash } from "lucide-react";

const EMPTY_TOTALS = {
  subtotal: 0,
  shipping: 0,
  tax: 0,
  discount_amount: 0,
  total: 0,
  final_total: 0,
  currency: "INR",
  free_shipping_threshold: 0,
};

const normalizeCheckoutItem = (item) => {
  const quantity = Number(item?.quantity ?? item?.qty ?? 0) || 0;
  const price = Number(item?.price ?? 0) || 0;

  return {
    id: item?.id,
    variant_id: item?.variant_id,
    name: item?.product_name || item?.name || "",
    variant: item?.variant_name || item?.variant || "",
    qty: quantity,
    price,
    line_total: Number(item?.line_total ?? price * quantity) || 0,
    image: item?.image || "",
  };
};

export default function CheckoutPage() {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [totals, setTotals] = useState(EMPTY_TOTALS);
  const [checkoutLoading, setCheckoutLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [editingDeliveryPhone, setEditingDeliveryPhone] = useState(false);
  const [deliveryPhoneDraft, setDeliveryPhoneDraft] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressForm, setAddressForm] = useState({
    id: null,
    label: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    is_default: false,
  });
  const orderItems = checkoutItems;
  const subtotal = totals.subtotal ?? 0;
  const shippingFee = totals.shipping ?? 0;
  const taxes = totals.tax ?? 0;
  const discount = totals.discount_amount ?? 0;
  const total =
    totals.final_total ??
    totals.total ??
    subtotal + shippingFee + taxes - discount;

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoadingAddresses(true);
      setCheckoutLoading(true);
      setAddressError("");
      setCheckoutError("");
      try {
        const [profileRes, addressRes, checkoutRes] = await Promise.all([
          apiFetch("/auth/profile"),
          apiFetch("/addresses"),
          apiFetch("/checkout"),
        ]);
        if (!active) return;
        setProfile({
          name: profileRes?.name || "",
          email: profileRes?.email || "",
          phone: profileRes?.phone || "",
        });
        setDeliveryPhone(profileRes?.phone || "");
        setDeliveryPhoneDraft(profileRes?.phone || "");
        const list = Array.isArray(addressRes)
          ? addressRes
          : Array.isArray(addressRes?.data)
            ? addressRes.data
            : [];
        setAddresses(list);
        const defaultAddress = list.find((item) => item.is_default) || list[0];
        setSelectedAddressId(defaultAddress?.id ?? null);
        if (!list.length) setAddressFormOpen(true);
        const checkout = checkoutRes?.products
          ? checkoutRes
          : checkoutRes?.data || {};
        setCheckoutItems(
          Array.isArray(checkout?.products)
            ? checkout.products.map(normalizeCheckoutItem)
            : [],
        );
        setTotals({
          ...EMPTY_TOTALS,
          ...(checkout?.totals || {}),
        });
      } catch (err) {
        if (!active) return;
        setAddressError(err?.message || "Failed to load checkout details.");
        setCheckoutError(err?.message || "Failed to load checkout details.");
      } finally {
        if (active) {
          setLoadingAddresses(false);
          setCheckoutLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const normalizePaymentAttempt = (payload) => {
    const data = payload?.data || payload || {};
    const rawId = data.id || data.order?.id || "";
    const rawOrderId =
      data.razorpay_order_id ||
      data.razorpayOrderId ||
      data.razorpay_order?.id ||
      data.razorpayOrder?.id ||
      data.order_id;
    const razorpayOrderId =
      rawOrderId ||
      (String(rawId).startsWith("order_") ? rawId : "") ||
      data.razorpay?.order_id ||
      "";
    const paymentAttemptId =
      data.payment_attempt_id ||
      data.paymentAttemptId ||
      data.payment_attempt?.id ||
      data.payment?.payment_attempt_id ||
      data.payment?.id ||
      (typeof data.payment_attempt !== "object" ? data.payment_attempt : "") ||
      data.attempt_id ||
      data.payment_id ||
      data.order_id ||
      (!String(rawId).startsWith("order_") ? rawId : "");

    return {
      ...data,
      payment_attempt_id: paymentAttemptId,
      razorpay_order_id: razorpayOrderId,
      amount: data.amount || data.razorpay?.amount,
      currency: data.currency || data.razorpay?.currency || "INR",
      key: data.key || data.razorpay_key || data.key_id,
    };
  };

  const getOrderQuery = (orderId) =>
    orderId ? `?order_id=${encodeURIComponent(orderId)}` : "";

  const getPaymentAttemptQuery = (paymentAttemptId) =>
    paymentAttemptId
      ? `?payment_attempt_id=${encodeURIComponent(paymentAttemptId)}`
      : "";

  const logPaymentFailure = async (attempt, failure = {}) => {
    if (!attempt?.payment_attempt_id) return;
    await apiFetch("/razorpay/failure", {
      method: "POST",
      body: JSON.stringify({
        payment_attempt_id: attempt.payment_attempt_id,
        razorpay_order_id: attempt.razorpay_order_id,
        razorpay_payment_id:
          failure?.metadata?.payment_id || failure?.payment_id || "",
        code: failure?.code || "",
        reason: failure?.reason || failure?.description || "Payment failed",
        description: failure?.description || failure?.message || "",
      }),
    });
  };

  const tryLogPaymentFailure = async (attempt, failure) => {
    try {
      await logPaymentFailure(attempt, failure);
    } catch {
      // Keep the user moving to the failed-payment page even if status logging fails.
    }
  };

  const redirectPaymentSuccess = (orderId) => {
    window.location.href = `/payment-success${getOrderQuery(orderId)}`;
  };

  const redirectPaymentFailed = (paymentAttemptId) => {
    window.location.href = `/payment-failed${getPaymentAttemptQuery(
      paymentAttemptId,
    )}`;
  };

  const handlePayNow = async () => {
    setPaymentError("");
    if (!selectedAddressId) {
      setPaymentError("Please select a delivery address.");
      return;
    }
    if (!orderItems.length || total <= 0) {
      setPaymentError("Your cart is empty.");
      return;
    }
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      setPaymentError("Razorpay key is missing.");
      return;
    }
    setProcessingPayment(true);
    const ready = await loadRazorpay();
    if (!ready) {
      setPaymentError("Razorpay SDK failed to load. Please try again.");
      setProcessingPayment(false);
      return;
    }
    try {
      const orderPayload = {
        amount: total,
        currency: totals.currency || "INR",
        address_id: selectedAddressId,
        contact: deliveryPhone || profile.phone,
        name: profile.name,
        email: profile.email,
      };
      const attemptResponse = await apiFetch("/razorpay/order", {
        method: "POST",
        body: JSON.stringify(orderPayload),
      });
      const attempt = normalizePaymentAttempt(attemptResponse);
      if (!attempt?.razorpay_order_id || !attempt?.payment_attempt_id) {
        const keys = Object.keys(
          attemptResponse?.data || attemptResponse || {},
        );
        throw new Error(
          `Payment attempt response is missing ${
            !attempt?.razorpay_order_id
              ? "razorpay_order_id"
              : "payment_attempt_id"
          }. Response keys: ${keys.join(", ") || "none"}.`,
        );
      }

      const options = {
        key: attempt?.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: attempt?.amount,
        currency: attempt?.currency || "INR",
        name: "The Kahwa Company",
        description: "Order payment",
        order_id: attempt?.razorpay_order_id,
        prefill: {
          name: profile.name,
          email: profile.email,
          contact: deliveryPhone || profile.phone,
        },
        notes: {
          address_id: String(selectedAddressId),
          payment_attempt_id: String(attempt.payment_attempt_id),
        },
        handler: async (response) => {
          try {
            const verified = await apiFetch("/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                payment_attempt_id: attempt.payment_attempt_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const realOrderId =
              verified?.order_id ||
              verified?.data?.order_id ||
              verified?.order?.id ||
              attempt.order_id;
            if (!realOrderId) {
              throw new Error(
                "Order id is missing after payment verification.",
              );
            }
            localStorage.setItem("cart_count", "0");
            window.dispatchEvent(new Event("cartchange"));
            redirectPaymentSuccess(realOrderId);
          } catch (err) {
            setPaymentError(err?.message || "Payment verification failed.");
            await tryLogPaymentFailure(attempt, {
              reason: "Payment verification failed",
              description: err?.message || "",
            });
            redirectPaymentFailed(attempt.payment_attempt_id);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
          },
        },
        theme: {
          color: "#4e5a50",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", async (resp) => {
        setPaymentError(
          resp?.error?.description || "Payment failed. Please try again.",
        );
        setProcessingPayment(false);
        await tryLogPaymentFailure(attempt, resp?.error || {});
        redirectPaymentFailed(attempt.payment_attempt_id);
      });
      razorpay.open();
    } catch (err) {
      setPaymentError(err?.message || "Unable to initiate payment.");
      setProcessingPayment(false);
    }
  };

  const openAddAddress = () => {
    setAddressForm({
      id: null,
      label: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      is_default: false,
    });
    setAddressFormOpen(true);
  };

  const openEditAddress = (address) => {
    setAddressForm({
      id: address.id,
      label: address.label || "",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
      is_default: !!address.is_default,
    });
    setAddressFormOpen(true);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressSaving(true);
    setAddressError("");
    try {
      let savedAddress = null;
      if (addressForm.id) {
        savedAddress = await apiFetch(`/addresses/${addressForm.id}`, {
          method: "PUT",
          body: JSON.stringify(addressForm),
        });
        setAddresses((prev) =>
          prev.map((item) =>
            item.id === savedAddress.id ? savedAddress : item,
          ),
        );
      } else {
        savedAddress = await apiFetch("/addresses", {
          method: "POST",
          body: JSON.stringify(addressForm),
        });
        setAddresses((prev) => [savedAddress, ...prev]);
      }
      if (savedAddress?.is_default) {
        setAddresses((prev) =>
          prev.map((item) => ({
            ...item,
            is_default: item.id === savedAddress.id,
          })),
        );
      }
      setSelectedAddressId(savedAddress?.id ?? selectedAddressId);
      setAddressFormOpen(false);
    } catch (err) {
      setAddressError(err?.message || "Address save failed.");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await apiFetch(`/addresses/${id}/set-default`, { method: "POST" });
      setAddresses((prev) =>
        prev.map((item) => ({
          ...item,
          is_default: item.id === id,
        })),
      );
    } catch (err) {
      setAddressError(err?.message || "Default update failed.");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await apiFetch(`/addresses/${id}`, { method: "DELETE" });
      setAddresses((prev) => prev.filter((item) => item.id !== id));
      if (selectedAddressId === id) {
        const next = addresses.find((item) => item.id !== id);
        setSelectedAddressId(next?.id ?? null);
      }
    } catch (err) {
      setAddressError(err?.message || "Address delete failed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f9f3] pt-[70px] text-[#252923]">
      <section className="site-container py-10 lg:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            {/* <p className="text-md uppercase tracking-[0.09em] text-[#667a49]">
              Checkout
            </p> */}
            <h1 className="mt-2 font-basker text-3xl text-center md:text-left  uppercase leading-none text-[#344823] md:text-4xl">
              Delivery details
            </h1>
          </div>
          <Link
            href="/cart"
            className="hidden md:inline-flex self-start items-center gap-2 text-md font-medium text-[#52633c] hover:underline underline-offset-3 sm:text-base"
          >
            Back to Cart
            <img
              src="/icons/VectorRight.svg"
              alt=""
              className="h-3.5 w-2 object-contain"
            />
          </Link>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)] lg:gap-8">
          <div className="h-fit rounded-lg border border-[#dfe2da] bg-white p-5 shadow-[0_10px_30px_rgba(60,79,43,0.06)] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7ecdf] text-[#52653b]">
                <User className="h-4 w-4" />
              </span>
              <div>
                <p className="text-md font-semibold uppercase  text-[#344823]">
                  Shipping information
                </p>
                <p className="text-md text-[#687067]">
                  Confirm your contact details and choose an address.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="rounded-md border border-[#dfe2da] bg-[#f7f9f3] p-4">
                  <p className="text-[11px] uppercase  text-[#737b70]">Name</p>
                  <p className="mt-2 text-md font-medium text-[#252923]">
                    {profile.name || "—"}
                  </p>
                </div>
                <div className="rounded-md border border-[#dfe2da] bg-[#f7f9f3] p-4">
                  <p className="text-[11px] uppercase  text-[#737b70]">Email</p>
                  <p className="mt-2 text-md font-medium text-[#252923]">
                    {profile.email || "—"}
                  </p>
                </div>
                <div className="h-fit rounded-md border border-[#dfe2da] bg-[#f7f9f3] p-4">
                  <p className="text-[11px] uppercase  text-[#737b70]">Phone</p>
                  <p className="mt-2 text-md font-medium text-[#252923]">
                    {profile.phone || "—"}
                  </p>
                </div>
                <div className="rounded-md border border-[#dfe2da] bg-[#f7f9f3] p-4">
                  <p className="text-[11px] uppercase  text-[#737b70]">
                    Delivery phone
                  </p>
                  {deliveryPhone ? (
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="text-md font-medium text-[#252923]">
                        {deliveryPhone}
                      </span>
                      <div className="flex gap-2 text-[11px] uppercase  text-[#52653b]">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDeliveryPhone(true);
                            setDeliveryPhoneDraft(deliveryPhone);
                          }}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-[#aeb9a1] px-2.5 py-1 hover:border-[#667a49]"
                        >
                          <Pencil className="h-2.5 w-2.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeliveryPhone("");
                            setDeliveryPhoneDraft("");
                            setEditingDeliveryPhone(false);
                          }}
                          className="rounded-sm border border-red-500/60 px-2.5 py-1 text-red-600 hover:border-red-600 cursor-pointer inline-flex items-center gap-2"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDeliveryPhone(true);
                        setDeliveryPhoneDraft("");
                      }}
                      className="mt-2 cursor-pointer rounded-sm border border-[#aeb9a1] px-3 py-1.5 text-sm uppercase  text-[#52653b] hover:border-[#667a49]"
                    >
                      Add delivery phone
                    </button>
                  )}
                  {editingDeliveryPhone && (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={deliveryPhoneDraft}
                        onChange={(e) =>
                          setDeliveryPhoneDraft(
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        placeholder="Alternate number"
                        className="w-full rounded-md border border-[#cfd6c8] bg-white px-3 py-2 text-md outline-none focus:border-[#667a49]"
                      />
                      <div className="flex gap-2 text-[11px] uppercase  text-[#52653b]">
                        <button
                          type="button"
                          onClick={() => {
                            setDeliveryPhone(deliveryPhoneDraft);
                            setEditingDeliveryPhone(false);
                          }}
                          className="cursor-pointer rounded-sm border border-[#52653b] px-3 py-1.5 text-[#52653b] hover:bg-[#f1f4ec]"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDeliveryPhone(false);
                            setDeliveryPhoneDraft(deliveryPhone);
                          }}
                          className="cursor-pointer rounded-sm border border-[#aeb9a1] px-3 py-1.5 text-[#667061] hover:border-[#667a49]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#dfe2da] pt-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#52653b]" />
                    <p className="text-md font-semibold uppercase  text-[#344823]">
                      Select address
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openAddAddress}
                    className="rounded-md border border-[#6b7f42] px-4 py-2 text-md font-semibold uppercase  text-[#52653b] hover:bg-[#f1f4ec]"
                  >
                    Add new address
                  </button>
                </div>

                {addressFormOpen && (
                  <form
                    onSubmit={handleSaveAddress}
                    className="mt-6 rounded-md border border-[#dfe2da] bg-[#f7f9f3] p-5"
                  >
                    <p className="text-md uppercase  text-[#737b70]">
                      {addressForm.id ? "Edit address" : "Add address"}
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-md uppercase  text-[#737b70]">
                          Label
                        </label>
                        <input
                          type="text"
                          name="label"
                          value={addressForm.label}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-md border border-[#cfd6c8] bg-white px-3 py-2 text-md outline-none focus:border-[#667a49]"
                          placeholder="Home / Office"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-md uppercase  text-[#737b70]">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={addressForm.country}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-md border border-[#cfd6c8] bg-white px-3 py-2 text-md outline-none focus:border-[#667a49]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-md uppercase  text-[#737b70]">
                          Address line 1
                        </label>
                        <input
                          type="text"
                          name="address_line1"
                          value={addressForm.address_line1}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-md border border-[#cfd6c8] bg-white px-3 py-2 text-md outline-none focus:border-[#667a49]"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-md uppercase  text-[#737b70]">
                          Address line 2
                        </label>
                        <input
                          type="text"
                          name="address_line2"
                          value={addressForm.address_line2}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-md border border-[#cfd6c8] bg-white px-3 py-2 text-md outline-none focus:border-[#667a49]"
                        />
                      </div>
                      <div>
                        <label className="text-md uppercase  text-[#737b70]">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-md border border-[#cfd6c8] bg-white px-3 py-2 text-md outline-none focus:border-[#667a49]"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-md uppercase  text-[#737b70]">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={addressForm.state}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-md border border-[#cfd6c8] bg-white px-3 py-2 text-md outline-none focus:border-[#667a49]"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-md uppercase  text-[#737b70]">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={addressForm.pincode}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-md border border-[#cfd6c8] bg-white px-3 py-2 text-md outline-none focus:border-[#667a49]"
                          required
                        />
                      </div>
                      <label className="flex items-center gap-2 text-md uppercase  text-[#667061] md:col-span-2">
                        <input
                          type="checkbox"
                          name="is_default"
                          checked={addressForm.is_default}
                          onChange={handleAddressChange}
                          className="accent-[#52653b]"
                        />
                        Set as default
                      </label>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={addressSaving}
                        className="rounded-md bg-[#52653b] px-5 py-2 text-md font-semibold uppercase  text-white hover:bg-[#6b7f42]"
                      >
                        {addressSaving ? "Saving..." : "Save address"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddressFormOpen(false)}
                        className="rounded-md border border-[#aeb9a1] px-5 py-2 text-md font-semibold uppercase  text-[#52653b] hover:bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {addressError && (
                  <p className="mt-3 text-md text-red-600">{addressError}</p>
                )}
                {loadingAddresses ? (
                  <p className="mt-4 text-md text-[#667061]">
                    Loading addresses...
                  </p>
                ) : addresses.length ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-1">
                    {addresses.map((address) => {
                      const isSelected = selectedAddressId === address.id;
                      return (
                        <div
                          key={address.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedAddressId(address.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setSelectedAddressId(address.id);
                            }
                          }}
                          className={`rounded-sm border p-4 text-left transition cursor-pointer ${
                            isSelected
                              ? "border-[#667a49] bg-[#f1f4ec]"
                              : "border-[#dfe2da] bg-white hover:border-[#aeb9a1]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                checked={isSelected}
                                readOnly
                              />
                              <p className="text-md uppercase  text-[#737b70]">
                                {address.label || "Address"}
                              </p>
                            </div>
                            {address.is_default && (
                              <span className="rounded-sm border border-[#7a8177]/40 bg-[#7a8177]/10 px-2 py-1 text-[10px] uppercase  text-[#4e5a50]">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-md text-[#252923]">
                            {address.address_line1}
                          </p>
                          <p className="text-md text-[#667061]">
                            {address.address_line2}
                          </p>
                          <p className="text-md text-[#667061]">
                            {address.city}, {address.state} {address.pincode}
                          </p>
                          <p className="text-md text-[#667061]">
                            {address.country}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase  text-[#52653b]">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditAddress(address);
                              }}
                              className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-[#aeb9a1] px-2.5 py-1.5 hover:border-[#667a49]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address.id);
                              }}
                              className="rounded-sm border border-red-500/60 px-2.5 py-1.5 text-red-600 hover:border-red-600 cursor-pointer inline-flex items-center gap-2"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                            {!address.is_default && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetDefault(address.id);
                                }}
                                className="cursor-pointer rounded-sm border border-[#aeb9a1] px-3 py-1.5 hover:border-[#667a49]"
                              >
                                Make default
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-md text-[#667061]">
                    No saved addresses yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-lg border border-[#dfe2da] bg-[#f1f4ec] p-5 shadow-[0_10px_30px_rgba(60,79,43,0.06)] sm:p-7 lg:sticky lg:top-24">
            <p className="font-basker text-[28px] uppercase leading-none text-[#344823]">
              Order summary
            </p>
            <div className="mt-5 space-y-4">
              {checkoutLoading ? (
                <p className="text-md text-[#667061]">Loading order...</p>
              ) : orderItems.length ? (
                orderItems.map((item) => (
                  <div
                    key={`${item.id}-${item.variant_id}`}
                    className="flex items-center gap-4 border-b border-[#d8dfd1] pb-4"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-md bg-white p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-md font-semibold text-[#252923]">
                        {item.name}
                      </p>
                      <p className="text-md text-[#667061]">{item.variant}</p>
                      <p className="text-md text-[#667061]">Qty: {item.qty}</p>
                    </div>
                    <p className="text-md font-semibold text-[#344823]">
                      ₹ {item.line_total}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-md text-[#667061]">Your cart is empty.</p>
              )}
            </div>
            {checkoutError && (
              <p className="mt-4 text-md text-red-600">{checkoutError}</p>
            )}
            {selectedAddressId && (
              <div className="mt-5 rounded-md border border-[#d8dfd1] bg-white p-4">
                <p className="text-md uppercase  text-[#737b70]">Deliver to</p>
                {(() => {
                  const address = addresses.find(
                    (item) => item.id === selectedAddressId,
                  );
                  if (!address) return null;
                  return (
                    <div className="mt-2 text-md text-[#626a5b]">
                      <p className="font-semibold text-[#344823]">
                        {address.label || "Address"}
                      </p>
                      <p>{address.address_line1}</p>
                      <p>{address.address_line2}</p>
                      <p>
                        {address.city}, {address.state} {address.pincode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  );
                })()}
              </div>
            )}
            <div className="mt-5 space-y-3 text-md text-[#626a5b]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>₹ {subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : `₹ ${shippingFee}`}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Taxes</span>
                <span>{taxes === 0 ? "₹ 0" : `₹ ${taxes}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span>{`- ₹ ${discount}`}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-[#cfd8c5] pt-4 font-semibold text-[#344823]">
                <span className="text-lg">Total</span>
                <span className="text-xl">₹ {total}</span>
              </div>
            </div>

            <p className="mt-4 text-md text-[#737b70]">
              By placing this order you agree to the Terms & Conditions.
            </p>
            {paymentError && (
              <p className="mt-4 text-md text-red-600">{paymentError}</p>
            )}
            <button
              type="button"
              onClick={handlePayNow}
              disabled={
                processingPayment || checkoutLoading || !orderItems.length
              }
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#52653b] px-6 py-3 text-md uppercase tracking-[0.04em] text-white hover:bg-[#6b7f42] disabled:opacity-60"
            >
              {processingPayment ? "Processing..." : "Pay now"}
            </button>

            <div className="mt-6 rounded-md border border-[#d8dfd1] bg-white p-5">
              <p className="text-md uppercase  text-[#737b70]">
                Secure payment
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="rounded-md px-3 py-2">
                  <img
                    src="/icons/payment/razorpay-icon.png"
                    alt="Razorpay"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <div className="rounded-md px-3 py-2">
                  <img
                    src="/icons/payment/upi-icon.png"
                    alt="UPI"
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>
              <p className="mt-4 text-sm text-[#687067]">
                Click Pay Now to open the Razorpay secure payment window.
              </p>
            </div>
          </aside>
        </div>
        <div className="flex justify-center md:hidden mt-5 ">
          <Link
            href="/cart"
            className="inline-flex self-start items-center gap-2 text-md font-medium text-[#52633c] hover:underline underline-offset-3 sm:text-base"
          >
            Back to Cart
            <img
              src="/icons/VectorRight.svg"
              alt=""
              className="h-3.5 w-2 object-contain"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
