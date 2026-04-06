"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";
import { apiFetch } from "@/utils/api";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    memberSince: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);

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
    if (!loading && !isAuthenticated) {
      router.push("/auth/login?next=/user/profile");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const load = async () => {
      setProfileLoading(true);
      setAddressLoading(true);
      setProfileError("");
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
          memberSince: profileRes?.created_at
            ? new Date(profileRes.created_at).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })
            : "",
        });
        setProfileForm({
          name: profileRes?.name || "",
          email: profileRes?.email || "",
          phone: profileRes?.phone || "",
        });
        setAddresses(
          Array.isArray(addressRes)
            ? addressRes
            : Array.isArray(addressRes?.data)
              ? addressRes.data
              : [],
        );
      } catch (err) {
        if (!active) return;
        setProfileError(err?.message || "Failed to load profile.");
        setAddressError(err?.message || "Failed to load addresses.");
      } finally {
        if (active) {
          setProfileLoading(false);
          setAddressLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileError("");
    try {
      const updated = await apiFetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(profileForm),
      });
      setProfile((prev) => ({
        ...prev,
        name: updated?.name || prev.name,
        email: updated?.email || prev.email,
        phone: updated?.phone || prev.phone,
      }));
      setProfileEditing(false);
    } catch (err) {
      setProfileError(err?.message || "Profile update failed.");
    } finally {
      setProfileSaving(false);
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
        const updated = await apiFetch(`/addresses/${addressForm.id}`, {
          method: "PUT",
          body: JSON.stringify(addressForm),
        });
        savedAddress = updated;
        setAddresses((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
      } else {
        const created = await apiFetch("/addresses", {
          method: "POST",
          body: JSON.stringify(addressForm),
        });
        savedAddress = created;
        setAddresses((prev) => [created, ...prev]);
      }
      if (savedAddress?.is_default) {
        setAddresses((prev) =>
          prev.map((item) => ({
            ...item,
            is_default: item.id === savedAddress.id,
          })),
        );
      }
      setAddressFormOpen(false);
    } catch (err) {
      setAddressError(err?.message || "Address save failed.");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleRemoveAddress = async (id) => {
    try {
      await apiFetch(`/addresses/${id}`, { method: "DELETE" });
      setAddresses((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setAddressError(err?.message || "Address delete failed.");
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

  return (
    <>
      <main className="min-h-screen bg-white text-black mt-10 sm:mt-12">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.094em] text-black/60">
                My account
              </p>
              <h1
                className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Profile overview
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setProfileEditing((prev) => !prev)}
              className="self-start rounded-sm border border-black/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black cursor-pointer"
            >
              {profileEditing ? "Close edit" : "Edit profile"}
            </button>
          </div>

          <div className="mt-8 sm:mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-sm border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-black text-white flex items-center justify-center text-base sm:text-lg font-semibold">
                  {(profile.name || "User")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {profileLoading ? "Loading..." : profile.name || "—"}
                  </h2>
                  <p className="text-sm text-black/60">
                    {profileLoading ? " " : profile.email || "—"}
                  </p>
                  <p className="text-sm text-black/60">
                    {profileLoading ? " " : profile.phone || "—"}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-sm border border-black/10 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                    Member since
                  </p>
                  <p className="mt-2 text-sm">
                    {profile.memberSince || "—"}
                  </p>
                </div>
                {/* <div className="rounded-sm border border-black/10 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                    Email address
                  </p>
                  <p className="mt-2 text-sm">{profile.email}</p>
                </div> */}
              </div>
            </div>

            <div className="rounded-sm border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
              <p className="text-xs uppercase tracking-[0.093em] text-black/50">
                Account quick links
              </p>
              <div className="mt-4 grid gap-3 text-sm text-black/70">
                <button className="rounded-sm border border-black/10 bg-gray-50 px-4 py-3 text-left hover:border-black/30 cursor-pointer">
                  Order history
                </button>
                {/* <button className="rounded-sm border border-black/10 bg-gray-50 px-4 py-3 text-left hover:border-black/30">
                  Payment methods
                </button> */}
                <button className="rounded-sm border border-black/10 bg-gray-50 px-4 py-3 text-left hover:border-black/30 cursor-pointer">
                  Change password
                </button>
              </div>
            </div>
          </div>

          {profileEditing && (
            <div className="mt-6 rounded-sm border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                Edit profile
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-black/50">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-black/50">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-black/50">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>
              {profileError && (
                <p className="mt-3 text-xs text-red-600">{profileError}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleProfileSave}
                  disabled={profileSaving}
                  className="rounded-sm border border-black/60 bg-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-black/90 cursor-pointer"
                >
                  {profileSaving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setProfileEditing(false)}
                  className="rounded-sm border border-black/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 sm:mt-10 rounded-sm border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.093em] text-black/50">
                  Saved addresses
                </p>
                <h2 className="mt-2 text-lg sm:text-xl font-semibold">
                  Delivery details
                </h2>
              </div>
              <button
                type="button"
                onClick={openAddAddress}
                className="self-start rounded-sm border border-black/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black cursor-pointer"
              >
                Add new address
              </button>
            </div>
            {addressFormOpen && (
              <form
                onSubmit={handleSaveAddress}
                className="mt-6 rounded-sm border border-black/10 bg-white p-5"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  {addressForm.id ? "Edit address" : "Add address"}
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-[0.12em] text-black/50">
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
                    <label className="text-xs uppercase tracking-[0.12em] text-black/50">
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
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase tracking-[0.12em] text-black/50">
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
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase tracking-[0.12em] text-black/50">
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
                    <label className="text-xs uppercase tracking-[0.12em] text-black/50">
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
                    <label className="text-xs uppercase tracking-[0.12em] text-black/50">
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
                    <label className="text-xs uppercase tracking-[0.12em] text-black/50">
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
                  <label className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-black/60 sm:col-span-2">
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
                  <p className="mt-3 text-xs text-red-600">{addressError}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={addressSaving}
                    className="rounded-sm border border-black/60 bg-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-black/90 cursor-pointer"
                  >
                    {addressSaving ? "Saving..." : "Save address"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressFormOpen(false)}
                    className="rounded-sm border border-black/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {addressLoading && (
                <div className="text-sm text-black/60">Loading addresses...</div>
              )}
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-sm border border-black/10 bg-gray-50 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.093em] text-black/70">
                    {address.label || "Address"}
                  </p>
                  {address.is_default && (
                    <span className="mt-2 inline-flex rounded-sm border border-[#7a8177]/40 bg-[#7a8177]/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#4e5a50]">
                      Default
                    </span>
                  )}
                  <p className="mt-2 text-sm">{address.address_line1}</p>
                  <p className="text-sm">{address.address_line2}</p>
                  <p className="text-sm">
                    {address.city}, {address.state} {address.pincode}
                  </p>
                  <p className="text-sm">{address.country}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-black/60">
                    <button
                      type="button"
                      onClick={() => openEditAddress(address)}
                      className="rounded-sm border border-[#7a8177] bg-[#7a8177]/10 px-3 py-1.5 text-[#4e5a50] hover:border-[#4e5a50] hover:bg-[#7a8177]/20 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveAddress(address.id)}
                      className="rounded-sm border border-[#b86b6b] bg-[#b86b6b]/10 px-3 py-1.5 text-[#7a3e3e] hover:border-[#7a3e3e] hover:bg-[#b86b6b]/20 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                    {!address.is_default && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(address.id)}
                        className="rounded-sm border border-black/20 px-3 py-1.5 hover:border-black/60 inline-flex items-center gap-2 cursor-pointer"
                      >
                        Make default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
