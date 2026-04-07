"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const stats = [
    { label: "Total orders", value: "14" },
    { label: "Orders in transit", value: "2" },
    { label: "Delivered orders", value: "11" },
    { label: "Amount spent", value: "₹ 12,840" },
  ];

  const recentOrders = [
    {
      id: "TKC-1042",
      date: "Mar 12, 2026",
      status: "Delivered",
      total: "₹  1,499",
    },
    {
      id: "TKC-1037",
      date: "Feb 28, 2026",
      status: "In transit",
      total: "₹  899",
    },
    {
      id: "TKC-1029",
      date: "Feb 10, 2026",
      status: "Delivered",
      total: "₹  2,120",
    },
  ];

  const addresses = [
    {
      id: 1,
      label: "Home",
      address_line1: "House 18, Boulevard Road",
      address_line2: "Dal Lake",
      city: "Srinagar",
      state: "Kashmir",
      pincode: "190001",
      country: "India",
      is_default: true,
    },
    {
      id: 2,
      label: "Studio",
      address_line1: "42 Heritage Lane",
      address_line2: "Old City",
      city: "Srinagar",
      state: "Kashmir",
      pincode: "190002",
      country: "India",
      is_default: false,
    },
  ];
  const defaultAddress =
    addresses.find((address) => address.is_default) || addresses[0];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login?next=/user/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  return (
    <>
      <main className="min-h-screen bg-white text-black mt-14">
        <section className="container max-w-7xl mx-auto px-6 md:px-12 py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.094em] text-black/60">
                My account
              </p>
              <h1
                className="mt-3 text-3xl md:text-4xl font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Dashboard
              </h1>
            </div>
            <button className="self-start rounded-sm border border-black/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black cursor-pointer">
              View orders
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-sm shadow-sm bg-gray-50 p-5"
              >
                <p className="text-xs uppercase tracking-[0.093em] text-black/80">
                  {stat.label}
                </p>
                <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className=" py-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.093em] text-black/80">
                    Recent orders
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Latest activity
                  </h2>
                </div>
                <button className="rounded-sm border border-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black cursor-pointer">
                  View all
                </button>
              </div>
              <div className="mt-6 grid gap-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-sm shadow-sm bg-gray-50 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold">{order.id}</p>
                      <p className="text-xs text-black/50">{order.date}</p>
                    </div>
                    <div className="text-sm text-black/60">{order.status}</div>
                    <div className="text-sm font-semibold">{order.total}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-6">
              <p className="text-xs uppercase tracking-[0.093em] text-black/80">
                Saved address
              </p>
              {defaultAddress ? (
                <div className="mt-4 rounded-sm shadow-sm bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-[0.093em] text-black/70">
                    {defaultAddress.label}
                  </p>
                  <p className="mt-2 text-sm">{defaultAddress.address_line1}</p>
                  <p className="text-sm">{defaultAddress.address_line2}</p>
                  <p className="text-sm">
                    {defaultAddress.city}, {defaultAddress.state}{" "}
                    {defaultAddress.pincode}
                  </p>
                  <p className="text-sm">{defaultAddress.country}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-black/60">
                  No saved addresses yet.
                </p>
              )}
              <Link href="/user/profile">
                <button className="mt-6 w-full rounded-sm border border-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white cursor-pointer">
                  Manage addresses
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
