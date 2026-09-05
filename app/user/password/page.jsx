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
    <main className="bg-[#fdfefb] pt-[88px] text-[#252a23]">
      <section className="site-container pb-20 pt-12 md:pt-20">
        <h1 className="font-basker text-[28px] font-normal uppercase leading-[1.2] text-[#344823] md:text-4xl">
          Change Password
        </h1>
        <div className="mt-8 rounded-lg bg-[#f1f4ec] p-4 md:mt-11 md:p-6">
          <AccountNav appearance="panel" />
          <div className="mx-auto w-full py-8 md:w-[68%] md:py-10">
            <form onSubmit={onSubmit} className="grid gap-5">
              <div>
                <label
                  htmlFor="change-current_password"
                  className="text-base text-[#252a23]"
                >
                  Current password
                </label>
                <input
                  type="password"
                  id="change-current_password"
                  name="current_password"
                  value={form.current_password}
                  onChange={onChange}
                  autoComplete="current-password"
                  className="mt-2 h-[50px] w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 text-base outline-none focus:border-[#52653b] focus:ring-1 focus:ring-[#52653b]"
                  placeholder="Enter current password"
                />
                {fieldErrors.current_password && (
                  <p className="mt-2 text-md text-red-600">
                    {fieldErrors.current_password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="change-password"
                  className="text-base text-[#252a23]"
                >
                  New password
                </label>
                <input
                  type="password"
                  id="change-password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  autoComplete="new-password"
                  className="mt-2 h-[50px] w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 text-base outline-none focus:border-[#52653b] focus:ring-1 focus:ring-[#52653b]"
                  placeholder="Enter new password"
                />
                {fieldErrors.password && (
                  <p className="mt-2 text-md text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="change-password_confirmation"
                  className="text-base text-[#252a23]"
                >
                  Confirm new password
                </label>
                <input
                  type="password"
                  id="change-password_confirmation"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={onChange}
                  autoComplete="new-password"
                  className="mt-2 h-[50px] w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 text-base outline-none focus:border-[#52653b] focus:ring-1 focus:ring-[#52653b]"
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

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md border border-[#52653b] bg-[#52653b] px-5 py-2.5 text-md font-semibold normal-case tracking-normal text-white hover:bg-[#6B7F42] disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Update password"}
                </button>
                <Link
                  href="/user/profile"
                  className="rounded-sm border border-black/30 px-5 py-2 text-md text-center font-semibold normal-case tracking-normal text-black hover:border-black"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
