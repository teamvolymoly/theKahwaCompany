"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const profile = {
    name: "Wendy Rose",
    email: "wendy.rose@thekahwacompany.com",
    phone: "+91 95822 51241",
    location: "Srinagar, Kashmir",
    memberSince: "January 2022",
    loyaltyTier: "Kahwa Circle",
  };

  const addresses = [
    {
      id: 1,
      label: "Home",
      line1: "House 18, Boulevard Road",
      line2: "Dal Lake",
      city: "Srinagar",
      zip: "190001",
    },
    {
      id: 2,
      label: "Studio",
      line1: "42 Heritage Lane",
      line2: "Old City",
      city: "Srinagar",
      zip: "190002",
    },
  ];

  const preferences = [
    "Prefers saffron-forward blends",
    "Weekly delivery on Fridays",
    "Paperless invoices enabled",
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login?next=/user/profile");
    }
  }, [loading, isAuthenticated, router]);

  return (
    <>
      <main className="min-h-screen bg-white text-black">
        <section className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-black/60">
                My account
              </p>
              <h1
                className="mt-3 text-3xl md:text-4xl font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Profile overview
              </h1>
            </div>
            <button className="self-start rounded-full border border-black/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black">
              Edit profile
            </button>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-sm text-black/60">{profile.email}</p>
                  <p className="text-sm text-black/60">{profile.phone}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                    Location
                  </p>
                  <p className="mt-2 text-sm">{profile.location}</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                    Member since
                  </p>
                  <p className="mt-2 text-sm">{profile.memberSince}</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                    Loyalty tier
                  </p>
                  <p className="mt-2 text-sm">{profile.loyaltyTier}</p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                    Preferred contact
                  </p>
                  <p className="mt-2 text-sm">Email</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                Preferences
              </p>
              <div className="mt-4 grid gap-3 text-sm text-black/70">
                {preferences.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-black/10 bg-black/5 px-4 py-3"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                  Saved addresses
                </p>
                <h2 className="mt-2 text-xl font-semibold">Delivery details</h2>
              </div>
              <button className="self-start rounded-full border border-black/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black">
                Add new address
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-2xl border border-black/10 bg-black/5 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                    {address.label}
                  </p>
                  <p className="mt-2 text-sm">{address.line1}</p>
                  <p className="text-sm">{address.line2}</p>
                  <p className="text-sm">
                    {address.city}, {address.zip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
