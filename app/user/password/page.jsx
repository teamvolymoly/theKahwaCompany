"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { apiFetch } from "@/utils/api";
import AccountNav from "@/components/AccountNav";

export default function PasswordPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const pushToast = (message, type = "success") => {
    window.dispatchEvent(
      new CustomEvent("toast", {
        detail: { message, type },
      }),
    );
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login?next=/user/password");
    }
  }, [loading, isAuthenticated, router]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
    setSuccess("");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.current_password) {
      nextErrors.current_password = "Current password is required.";
    }
    if (!form.password || form.password.length < 8) {
      nextErrors.password = "New password must be at least 8 characters.";
    }
    if (!form.password_confirmation) {
      nextErrors.password_confirmation = "Please confirm your new password.";
    } else if (form.password_confirmation !== form.password) {
      nextErrors.password_confirmation =
        "Password confirmation does not match.";
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      pushToast("Please fix the highlighted password fields.", "error");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccess("Password changed successfully.");
      pushToast("Password changed successfully.", "success");
      setForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      setFieldErrors({});
    } catch (err) {
      const message = err?.message || "Unable to change password.";
      setError(message);
      pushToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="user-account-page min-h-screen bg-white text-black mt-10 sm:mt-12">
      <section className="site-container py-10 sm:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-md uppercase tracking-[0.094em] text-black/60">
              My account
            </p>
            <h1
              className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-basker)" }}
            >
              Change password
            </h1>
          </div>
          <Link
            href="/user/profile"
            className="self-start rounded-md border border-[#52653b] px-5 py-2 text-md font-semibold uppercase tracking-[0.12em] text-[#52653b] hover:bg-[#52653b] hover:text-white"
          >
            Back to profile
          </Link>
        </div>

        <AccountNav />

        <div className="mt-8 sm:mt-10 rounded-lg border border-[#dfe5d8] bg-[#f3f6ef] p-6 sm:p-8">
          <form onSubmit={onSubmit} className="grid gap-5">
            <div>
              <label className="text-md uppercase tracking-[0.12em] text-black/50">
                Current password
              </label>
              <input
                type="password"
                name="current_password"
                value={form.current_password}
                onChange={onChange}
                autoComplete="current-password"
                className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-md outline-none focus:border-black"
                placeholder="Enter current password"
              />
              {fieldErrors.current_password && (
                <p className="mt-2 text-md text-red-600">
                  {fieldErrors.current_password}
                </p>
              )}
            </div>

            <div>
              <label className="text-md uppercase tracking-[0.12em] text-black/50">
                New password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                autoComplete="new-password"
                className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-md outline-none focus:border-black"
                placeholder="Enter new password"
              />
              {fieldErrors.password && (
                <p className="mt-2 text-md text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <label className="text-md uppercase tracking-[0.12em] text-black/50">
                Confirm new password
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={onChange}
                autoComplete="new-password"
                className="mt-2 w-full rounded-sm border border-black/20 px-3 py-2 text-md outline-none focus:border-black"
                placeholder="Confirm new password"
              />
              {fieldErrors.password_confirmation && (
                <p className="mt-2 text-md text-red-600">
                  {fieldErrors.password_confirmation}
                </p>
              )}
            </div>

            {error && <p className="text-md text-red-600">{error}</p>}
            {success && <p className="text-md text-green-700">{success}</p>}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md border border-[#52653b] bg-[#52653b] px-5 py-2.5 text-md font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#6B7F42] disabled:opacity-70"
              >
                {saving ? "Saving..." : "Update password"}
              </button>
              <Link
                href="/user/profile"
                className="rounded-sm border border-black/30 px-5 py-2 text-md font-semibold uppercase tracking-[0.2em] text-black hover:border-black"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
