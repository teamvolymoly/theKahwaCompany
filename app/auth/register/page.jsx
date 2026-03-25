"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSuccess("Registration successful. Redirecting to login...");
      router.push("/auth/login");
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-white text-black">
        <section className="max-w-5xl mx-auto px-6 py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-black/60">
                Create account
              </p>
              <h1
                className="mt-3 text-4xl lg:text-5xl leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Join the tea club
              </h1>
              <p className="mt-4 text-base text-black/60">
                Get early access to seasonal blends, member-only offers, and
                curated tasting notes.
              </p>

              <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-black/50">
                  What you get
                </p>
                <ul className="mt-4 space-y-3 text-sm text-black/60">
                  <li>Priority access to new harvests</li>
                  <li>Guided brewing tips from our tea master</li>
                  <li>Exclusive loyalty rewards</li>
                </ul>
              </div>
            </div>

            <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_22px_60px_rgba(0,0,0,0.08)]">
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-black/60">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="mt-2 w-full rounded-full border border-black/20 px-5 py-3 text-sm outline-none focus:border-black"
                    placeholder="Test Customer"
                  />
                </div>

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
                  <label className="text-xs uppercase tracking-[0.3em] text-black/60">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    required
                    className="mt-2 w-full rounded-full border border-black/20 px-5 py-3 text-sm outline-none focus:border-black"
                    placeholder="9999999999"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-black/60">
                    Password
                  </label>
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

                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-black/60">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={form.password_confirmation}
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
                  disabled={loading}
                  className="w-full rounded-full bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Creating..." : "Create account"}
                </button>
                <p className="text-center text-xs uppercase tracking-[0.3em] text-black/60">
                  Already a member?{" "}
                  <a
                    href="/auth/login"
                    className="font-semibold text-black hover:underline"
                  >
                    Sign in
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
