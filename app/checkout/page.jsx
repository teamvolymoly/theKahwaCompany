"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import { Pencil, Trash2, MapPin, User, Trash } from "lucide-react";

export default function CheckoutPage() {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
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
  const orderItems = [
    {
      id: 101,
      name: "Kashmiri Kahwa",
      variant: "30 Tea Bags",
      qty: 1,
      price: 499,
      image: "/products/tin/BLTIN1.png",
    },
    {
      id: 104,
      name: "Kahwa Sampler Set",
      variant: "Sampler Box",
      qty: 1,
      price: 799,
      image: "/products/tin/KLTIN1.png",
    },
  ];
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const shippingFee = subtotal > 500 ? 0 : 120;
  const taxes = 0;
  const total = subtotal + shippingFee + taxes;

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoadingAddresses(true);
      setAddressError("");
      try {
        const [profileRes, addressRes] = await Promise.all([
          apiFetch("/auth/profile"),
          apiFetch("/addresses"),
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
      } catch (err) {
        if (!active) return;
        setAddressError(err?.message || "Failed to load addresses.");
      } finally {
        if (active) setLoadingAddresses(false);
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

  const handlePayNow = async () => {
    setPaymentError("");
    if (!selectedAddressId) {
      setPaymentError("Please select a delivery address.");
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
      // TODO: replace amount with live cart total from backend
      const orderPayload = {
        amount: 1499,
        currency: "INR",
        address_id: selectedAddressId,
        contact: deliveryPhone || profile.phone,
        name: profile.name,
        email: profile.email,
      };
      const order = await apiFetch("/razorpay/order", {
        method: "POST",
        body: JSON.stringify(orderPayload),
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order?.amount,
        currency: order?.currency || "INR",
        name: "The Kahwa Company",
        description: "Order payment",
        order_id: order?.id || order?.order_id,
        prefill: {
          name: profile.name,
          email: profile.email,
          contact: profile.phone,
        },
        notes: {
          address_id: String(selectedAddressId),
        },
        handler: async (response) => {
          try {
            await apiFetch("/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            window.location.href = "/payment-success";
          } catch (err) {
            setPaymentError(err?.message || "Payment verification failed.");
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
      razorpay.on("payment.failed", (resp) => {
        setPaymentError(
          resp?.error?.description || "Payment failed. Please try again.",
        );
        setProcessingPayment(false);
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
    <main className="min-h-screen bg-white text-black mt-14">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.09em] text-black/60">
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
            className="self-start text-xs font-semibold uppercase tracking-[0.08em] text-black/60 hover:text-black inline-flex items-center gap-2"
          >
            Back to cart <span aria-hidden="true">›</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-sm border border-black/10 bg-white p-6 sm:p-8 shadow-sm h-fit">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-black/70">
                <User className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                  Shipping information
                </p>
                <p className="text-sm text-black/60">
                  Confirm your contact details and choose an address.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="rounded-sm border border-black/10 bg-gray-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-black/50">
                    Name
                  </p>
                  <p className="mt-2 text-sm font-medium text-black">
                    {profile.name || "—"}
                  </p>
                </div>
                <div className="rounded-sm border border-black/10 bg-gray-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-black/50">
                    Email
                  </p>
                  <p className="mt-2 text-sm font-medium text-black">
                    {profile.email || "—"}
                  </p>
                </div>
                <div className="rounded-sm border border-black/10 bg-gray-50 p-4 h-fit">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-black/50">
                    Phone
                  </p>
                  <p className="mt-2 text-sm font-medium text-black">
                    {profile.phone || "—"}
                  </p>
                </div>
                <div className="rounded-sm border border-black/10 bg-gray-50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-black/50">
                    Delivery phone
                  </p>
                  {deliveryPhone ? (
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium text-black">
                        {deliveryPhone}
                      </span>
                      <div className="flex gap-2 text-[11px] uppercase tracking-[0.08em] text-black/60">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDeliveryPhone(true);
                            setDeliveryPhoneDraft(deliveryPhone);
                          }}
                          className="rounded-sm border border-black/20 px-2.5 py-1 hover:border-black/60 cursor-pointer inline-flex items-center gap-2"
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
                      className="mt-2 rounded-sm border border-black/20 px-3 py-1.5 text-xs uppercase tracking-[0.08em] text-black/70 hover:border-black/60 cursor-pointer"
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
                        className="w-full rounded-sm border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                      />
                      <div className="flex gap-2 text-[11px] uppercase tracking-[0.08em] text-black/60">
                        <button
                          type="button"
                          onClick={() => {
                            setDeliveryPhone(deliveryPhoneDraft);
                            setEditingDeliveryPhone(false);
                          }}
                          className="rounded-sm border border-black/60 px-3 py-1.5 text-black hover:border-black cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDeliveryPhone(false);
                            setDeliveryPhoneDraft(deliveryPhone);
                          }}
                          className="rounded-sm border border-black/20 px-3 py-1.5 text-black/60 hover:border-black/60 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mt-8 border-t border-black/10 pt-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-black/60" />
                    <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                      Select address
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openAddAddress}
                    className="rounded-sm border border-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black hover:border-black cursor-pointer"
                  >
                    Add new address
                  </button>
                </div>

                {addressFormOpen && (
                  <form
                    onSubmit={handleSaveAddress}
                    className="rounded-sm border border-black/10 bg-gray-50 p-5 mt-6"
                  >
                    <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                      {addressForm.id ? "Edit address" : "Add address"}
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.08em] text-black/50">
                          Label
                        </label>
                        <input
                          type="text"
                          name="label"
                          value={addressForm.label}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                          placeholder="Home / Office"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.08em] text-black/50">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={addressForm.country}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs uppercase tracking-[0.08em] text-black/50">
                          Address line 1
                        </label>
                        <input
                          type="text"
                          name="address_line1"
                          value={addressForm.address_line1}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs uppercase tracking-[0.08em] text-black/50">
                          Address line 2
                        </label>
                        <input
                          type="text"
                          name="address_line2"
                          value={addressForm.address_line2}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.08em] text-black/50">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.08em] text-black/50">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={addressForm.state}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.08em] text-black/50">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={addressForm.pincode}
                          onChange={handleAddressChange}
                          className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                          required
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-black/60 md:col-span-2">
                        <input
                          type="checkbox"
                          name="is_default"
                          checked={addressForm.is_default}
                          onChange={handleAddressChange}
                          className="accent-black"
                        />
                        Set as default
                      </label>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={addressSaving}
                        className="rounded-sm border border-black/60 bg-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-black/90 cursor-pointer"
                      >
                        {addressSaving ? "Saving..." : "Save address"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddressFormOpen(false)}
                        className="rounded-sm border border-black/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black hover:border-black cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {addressError && (
                  <p className="mt-3 text-xs text-red-600">{addressError}</p>
                )}
                {loadingAddresses ? (
                  <p className="mt-4 text-sm text-black/60">
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
                              ? "border-black/20 bg-gray-50"
                              : "border-black/10 bg-white hover:border-black/30"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                checked={isSelected}
                                readOnly
                              />
                              <p className="text-xs uppercase tracking-[0.08em] text-black/50">
                                {address.label || "Address"}
                              </p>
                            </div>
                            {address.is_default && (
                              <span className="rounded-sm border border-[#7a8177]/40 bg-[#7a8177]/10 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[#4e5a50]">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-black/80">
                            {address.address_line1}
                          </p>
                          <p className="text-sm text-black/70">
                            {address.address_line2}
                          </p>
                          <p className="text-sm text-black/70">
                            {address.city}, {address.state} {address.pincode}
                          </p>
                          <p className="text-sm text-black/70">
                            {address.country}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.08em] text-black/60">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditAddress(address);
                              }}
                              className="rounded-sm border border-black/20 px-2.5 py-1.5 hover:border-black/60 cursor-pointer inline-flex items-center gap-2"
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
                                className="rounded-sm border border-black/20 px-3 py-1.5 hover:border-black/60 cursor-pointer"
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
                  <p className="mt-4 text-sm text-black/60">
                    No saved addresses yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-black/10 bg-gray-50 p-6 sm:p-8 h-fit">
            <p className="text-xs uppercase tracking-[0.09em] text-black/50">
              Order summary
            </p>
            <div className="mt-5 space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b border-black/10 pb-4"
                >
                  <div className="h-14 w-14 overflow-hidden rounded-sm bg-white p-2">
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
                    ₹ {item.price * item.qty}
                  </p>
                </div>
              ))}
            </div>
            {selectedAddressId && (
              <div className="mt-5 rounded-sm border border-black/10 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  Deliver to
                </p>
                {(() => {
                  const address = addresses.find(
                    (item) => item.id === selectedAddressId,
                  );
                  if (!address) return null;
                  return (
                    <div className="mt-2 text-sm text-black/70">
                      <p className="font-semibold text-black">
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
            <div className="mt-4 space-y-3 text-sm text-black/70">
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
              <div className="flex items-center justify-between border-t border-black/10 pt-3 text-black font-semibold">
                <span>Total</span>
                <span>₹ {total}</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-black/50">
              By placing this order you agree to the Terms & Conditions.
            </p>
            {paymentError && (
              <p className="mt-4 text-xs text-red-600">{paymentError}</p>
            )}
            <button
              type="button"
              onClick={handlePayNow}
              disabled={processingPayment}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.01em] text-white hover:bg-black/90 transition disabled:opacity-60 cursor-pointer"
            >
              {processingPayment ? "Processing..." : "Pay now"}
            </button>

            <div className="mt-6 rounded-sm border border-black/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                Secure payment
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="px-3 py-2 bg-gray-50 rounded-sm">
                  <img
                    src="/icons/payment/razorpay-icon.png"
                    alt="Razorpay"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <div className="px-3 py-2 bg-gray-50 rounded-sm">
                  <img
                    src="/icons/payment/upi-icon.png"
                    alt="UPI"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <div className="px-3 py-2 bg-gray-50 rounded-sm">
                  <img
                    src="/icons/payment/icons8-card-100.png"
                    alt="Cards"
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>
              <p className="mt-4 text-sm text-black/60">
                Click Pay Now to open the Razorpay secure payment window.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
