"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/utils/api";

const addressButton =
  "inline-flex min-h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium normal-case tracking-normal transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52653b] disabled:cursor-wait disabled:opacity-60";
export default function AccountAddresses({ summary = false }) {
  const editorRef = useRef(null);
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(true);
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

  useEffect(() => {
    let active = true;
    apiFetch("/addresses")
      .then((data) => {
        if (active)
          setAddresses(
            Array.isArray(data)
              ? data
              : Array.isArray(data?.data)
                ? data.data
                : [],
          );
      })
      .catch(() => {
        if (active)
          setAddressError("Unable to load addresses. Please try again later.");
      })
      .finally(() => {
        if (active) setAddressLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const emptyAddress = {
    id: null,
    label: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    is_default: false,
  };
  const openAddAddress = () => {
    setAddressError("");
    setAddressForm(emptyAddress);
    setAddressFormOpen(true);
  };
  const openEditAddress = (address) => {
    setAddressError("");
    setAddressForm(
      Object.fromEntries(
        Object.entries(emptyAddress).map(([key, fallback]) => [
          key,
          address[key] ?? fallback,
        ]),
      ),
    );
    setAddressFormOpen(true);
  };
  const handleAddressChange = ({ target }) =>
    setAddressForm((previous) => ({
      ...previous,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    }));
  async function handleSaveAddress(event) {
    event.preventDefault();
    if (addressSaving) return;
    setAddressSaving(true);
    setAddressError("");
    try {
      const saved = await apiFetch(
        addressForm.id ? "/addresses/" + addressForm.id : "/addresses",
        {
          method: addressForm.id ? "PUT" : "POST",
          body: JSON.stringify(addressForm),
        },
      );
      if (!saved?.id) throw new Error("Invalid address response");
      setAddresses((previous) => {
        const next = addressForm.id
          ? previous.map((item) => (item.id === addressForm.id ? saved : item))
          : [saved, ...previous];
        return saved.is_default
          ? next.map((item) => ({ ...item, is_default: item.id === saved.id }))
          : next;
      });
      setAddressFormOpen(false);
    } catch {
      setAddressError("Unable to save your address. Please try again.");
    } finally {
      setAddressSaving(false);
    }
  }
  async function handleRemoveAddress(id) {
    setAddressError("");
    try {
      await apiFetch("/addresses/" + id, { method: "DELETE" });
      setAddresses((previous) => previous.filter((item) => item.id !== id));
      if (addressForm.id === id) setAddressFormOpen(false);
    } catch {
      setAddressError("Unable to delete this address. Please try again.");
    }
  }
  async function handleSetDefault(id) {
    setAddressError("");
    try {
      await apiFetch("/addresses/" + id + "/set-default", { method: "POST" });
      setAddresses((previous) =>
        previous.map((item) => ({ ...item, is_default: item.id === id })),
      );
    } catch {
      setAddressError(
        "Unable to update the default address. Please try again.",
      );
    }
  }

  useEffect(() => {
    if (summary) return;
    const openFromHash = () => {
      if (window.location.hash === "#add-address") {
        setAddressFormOpen(true);
      }
    };
    const timer = window.setTimeout(openFromHash, 0);
    window.addEventListener("hashchange", openFromHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", openFromHash);
    };
  }, [summary]);

  useEffect(() => {
    if (addressFormOpen && editorRef.current) {
      editorRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
      editorRef.current.querySelector("input")?.focus({ preventScroll: true });
    }
  }, [addressFormOpen, addressForm.id]);

  const defaultAddress =
    addresses.find((item) => item.is_default) || addresses[0];
  const addressText = (address) => (
    <address className="mt-6 mb-6 text-base not-italic leading-[1.4] text-[#80837d]">
      <p>{address.name || address.label}</p>
      <p>{address.address_line1}</p>
      {address.address_line2 && <p>{address.address_line2}</p>}
      <p>
        {[address.pincode, address.city, address.state]
          .filter(Boolean)
          .join(" ")}
      </p>
      {address.phone && <p>{address.phone}</p>}
      <p>{address.country}</p>
    </address>
  );
  const textAction =
    "cursor-pointer text-sm normal-case tracking-normal underline underline-offset-3 hover:text-[#6b7f42] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#52653b]";

  if (summary)
    return (
      <article className="flex min-w-0 flex-col rounded-lg bg-[#fdfefb] p-6 md:min-h-[245px]">
        <h2 className="font-basker text-xl uppercase">My Addresses</h2>
        {addressLoading ? (
          <p role="status" className="mt-6">
            Loading addresses…
          </p>
        ) : addressError ? (
          <p role="alert" className="mt-6 text-red-700">
            {addressError}
          </p>
        ) : defaultAddress ? (
          addressText(defaultAddress)
        ) : (
          <p className="my-6 text-[#80837d]">No saved addresses yet.</p>
        )}
        <div className="mt-auto flex justify-between gap-4">
          <Link href="/user/addresses" className={textAction}>
            My Addresses
          </Link>
          <Link href="/user/addresses#add-address" className={textAction}>
            Add
          </Link>
        </div>
      </article>
    );

  return (
    <div id="addresses" className="mt-6">
      {addressError && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          {addressError}
        </p>
      )}
      {addressLoading && (
        <p role="status" className="mb-4">
          Loading addresses…
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {!addressLoading && addresses.length === 0 && (
          <article className="rounded-lg bg-[#fdfefb] p-6 md:min-h-[240px]">
            <h2 className="font-basker text-xl uppercase">My Address</h2>
            <p className="mt-6 text-[#80837d]">No saved addresses yet.</p>
          </article>
        )}
        {addresses.map((address) => (
          <article
            key={address.id}
            className="flex min-w-0 flex-col rounded-lg bg-[#fdfefb] p-6 md:min-h-[240px]"
          >
            <h2 className="font-basker text-xl uppercase">My Address</h2>
            {addressText(address)}
            <div className="mt-auto flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => openEditAddress(address)}
                className={textAction}
              >
                Update
              </button>
              {address.is_default ? (
                <span className="text-xs text-[#718548]">Default</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetDefault(address.id)}
                  className={textAction}
                >
                  Make default
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemoveAddress(address.id)}
                className={textAction + " ml-auto"}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
        <button
          type="button"
          id="add-address"
          onClick={openAddAddress}
          className="flex min-h-[160px] cursor-pointer items-start rounded-lg bg-[#fdfefb] p-6 text-left font-basker text-xl uppercase underline underline-offset-4 hover:text-[#6b7f42] focus-visible:outline-2 focus-visible:outline-[#52653b] md:min-h-[240px]"
        >
          Add a new address
        </button>
      </div>
      {addressFormOpen && (
        <form
          onSubmit={handleSaveAddress}
          ref={editorRef}
          id="address-editor"
          className="mt-6 rounded-lg bg-[#fdfefb] p-6"
        >
          <p className="text-md uppercase tracking-[0.2em] text-black/50">
            {addressForm.id ? "Edit address" : "Add address"}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="address-label" className="text-sm text-[#252a23]">
                Label
              </label>
              <input
                type="text"
                id="address-label"
                name="label"
                value={addressForm.label}
                onChange={handleAddressChange}
                className="mt-2 w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 py-3 text-base outline-none focus:border-[#52653b] focus:ring-1 focus:ring-[#52653b]"
                placeholder="Home / Office"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address-country"
                className="text-sm text-[#252a23]"
              >
                Country
              </label>
              <input
                type="text"
                id="address-country"
                name="country"
                value={addressForm.country}
                onChange={handleAddressChange}
                className="mt-2 w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 py-3 text-base outline-none focus:border-[#52653b] focus:ring-1 focus:ring-[#52653b]"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="address-address_line1"
                className="text-sm text-[#252a23]"
              >
                Address line 1
              </label>
              <input
                type="text"
                id="address-address_line1"
                name="address_line1"
                value={addressForm.address_line1}
                onChange={handleAddressChange}
                className="mt-2 w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 py-3 text-base outline-none focus:border-[#52653b] focus:ring-1 focus:ring-[#52653b]"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="address-address_line2"
                className="text-sm text-[#252a23]"
              >
                Address line 2
              </label>
              <input
                type="text"
                id="address-address_line2"
                name="address_line2"
                value={addressForm.address_line2}
                onChange={handleAddressChange}
                className="mt-2 w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 py-3 text-base outline-none focus:border-[#52653b] focus:ring-1 focus:ring-[#52653b]"
              />
            </div>
            <div>
              <label htmlFor="address-city" className="text-sm text-[#252a23]">
                City
              </label>
              <input
                type="text"
                id="address-city"
                name="city"
                value={addressForm.city}
                onChange={handleAddressChange}
                className="mt-2 w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 py-3 text-base outline-none focus:border-[#52653b] focus:ring-1 focus:ring-[#52653b]"
                required
              />
            </div>
            <div>
              <label htmlFor="address-state" className="text-sm text-[#252a23]">
                State
              </label>
              <input
                type="text"
                id="address-state"
                name="state"
                value={addressForm.state}
                onChange={handleAddressChange}
                className="mt-2 w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 py-3 text-base outline-none focus:border-[#52653b] focus:ring-1 focus:ring-[#52653b]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address-pincode"
                className="text-sm text-[#252a23]"
              >
                Pincode
              </label>
              <input
                type="text"
                id="address-pincode"
                name="pincode"
                value={addressForm.pincode}
                onChange={handleAddressChange}
                className="mt-2 w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 py-3 text-base outline-none focus:border-[#52653b] focus:ring-1 focus:ring-[#52653b]"
                required
              />
            </div>
            <label className="flex items-center gap-2 text-md uppercase tracking-[0.12em] text-black/60 sm:col-span-2">
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
          {addressError && (
            <p className="mt-3 text-md text-red-600">{addressError}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={addressSaving}
              className={`${addressButton} border-[#52653b] bg-[#52653b] text-white hover:bg-[#6b7f42]`}
            >
              {addressSaving ? "Saving..." : "Save address"}
            </button>
            <button
              type="button"
              onClick={() => setAddressFormOpen(false)}
              className={`${addressButton} border-[#d6dcd0] text-[#52604a] hover:bg-[#f1f4ec]`}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
