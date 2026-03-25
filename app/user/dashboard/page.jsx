"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const stats = [
    { label: "Total orders", value: "14" },
    { label: "Active subscriptions", value: "2" },
    { label: "Loyalty points", value: "1,240" },
    { label: "Saved blends", value: "6" },
  ];

  const recentOrders = [
    {
      id: "TKC-1042",
      date: "Mar 12, 2026",
      status: "Delivered",
      total: "Rs. 1,499",
    },
    {
      id: "TKC-1037",
      date: "Feb 28, 2026",
      status: "In transit",
      total: "Rs. 899",
    },
    {
      id: "TKC-1029",
      date: "Feb 10, 2026",
      status: "Delivered",
      total: "Rs. 2,120",
    },
  ];

  const subscriptions = [
    {
      name: "Signature Kahwa",
      cadence: "Every 2 weeks",
      next: "Mar 22, 2026",
    },
    {
      name: "Seasonal Harvest Box",
      cadence: "Monthly",
      next: "Apr 05, 2026",
    },
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login?next=/user/dashboard");
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
                Dashboard
              </h1>
            </div>
            <button className="self-start rounded-full border border-black/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black">
              View orders
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-black/10 bg-black/5 p-5"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                  {stat.label}
                </p>
                <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                    Recent orders
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">Latest activity</h2>
                </div>
                <button className="rounded-full border border-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black">
                  View all
                </button>
              </div>
              <div className="mt-6 grid gap-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-black/10 bg-black/5 p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
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

            <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                Subscriptions
              </p>
              <div className="mt-4 grid gap-4">
                {subscriptions.map((plan) => (
                  <div
                    key={plan.name}
                    className="rounded-2xl border border-black/10 bg-black/5 p-4"
                  >
                    <p className="text-sm font-semibold">{plan.name}</p>
                    <p className="mt-2 text-xs text-black/60">{plan.cadence}</p>
                    <p className="mt-1 text-xs text-black/60">
                      Next delivery: {plan.next}
                    </p>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full rounded-full border border-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white">
                Manage subscriptions
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
