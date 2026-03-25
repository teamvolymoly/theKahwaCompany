"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const { login, authLoading, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    const result = await login({
      email: form.email,
      password: form.password,
    });
    if (result?.ok) {
      setSuccess("Login successful.");
      router.push(next);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-white text-black">
        <section className="max-w-4xl mx-auto px-6 py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-black/60">
                Welcome back
              </p>
              <h1
                className="mt-3 text-4xl lg:text-5xl leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Sign in for your next brew
              </h1>
              <p className="mt-4 text-base text-black/60">
                Access your saved blends, rewards, and recent orders.
              </p>

              <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-black/50">
                  Tea club
                </p>
                <p className="mt-4 text-sm text-black/60">
                  Members get early access to new harvests and exclusive drops.
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_22px_60px_rgba(0,0,0,0.08)]">
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-black/60">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="mt-2 w-full rounded-full border border-black/20 px-5 py-3 text-sm outline-none focus:border-black"
                    placeholder="customer@example.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-[0.3em] text-black/60">
                      Password
                    </label>
                    <a
                      href="/auth/forgot-password"
                      className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/60 hover:text-black"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    required
                    className="mt-2 w-full rounded-full border border-black/20 px-5 py-3 text-sm outline-none focus:border-black"
                    placeholder="password"
                  />
                </div>

                {error && (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-full bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {authLoading ? "Signing in..." : "Sign in"}
                </button>
                <p className="text-center text-xs uppercase tracking-[0.3em] text-black/60">
                  New here?{" "}
                  <a
                    href="/auth/register"
                    className="font-semibold text-black hover:underline"
                  >
                    Create account
                  </a>
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
