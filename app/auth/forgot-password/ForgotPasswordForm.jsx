"use client";

import { useState } from "react";
import { apiFetch } from "@/utils/api";

export default function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const email = new FormData(event.currentTarget).get("email").trim();
    setError("");
    setSent(false);

    // Set this to the backend's confirmed reset-request route before enabling delivery.
    const endpoint = process.env.NEXT_PUBLIC_PASSWORD_RESET_ENDPOINT;
    if (!endpoint) {
      setError("Password reset is currently unavailable. Please try again later.");
      return;
    }

    setPending(true);
    try {
      await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email }),
      }, { retry: false });
      setSent(true);
    } catch {
      setError("We couldn’t send your reset request. Please try again later.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="mx-auto w-full md:w-[68%]" onSubmit={handleSubmit} aria-busy={pending}>
      <label htmlFor="reset-email" className="mb-2 block text-base">
        Email address <span className="text-red-600" aria-hidden="true">*</span>
      </label>
      <input
        id="reset-email"
        name="email"
        type="email"
        autoComplete="email"
        required
        disabled={pending}
        onChange={() => { setError(""); setSent(false); }}
        aria-describedby={error || sent ? "reset-feedback" : undefined}
        placeholder="Enter your email address..."
        className="h-[50px] w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 text-base text-[#252a23] placeholder:text-[#a5aaa2] focus:border-[#52653b] focus:outline-2 focus:outline-offset-2 focus:outline-[#52653b] disabled:opacity-70"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#52653b] px-5 text-base font-semibold text-[#f1f4ec] transition-colors hover:bg-[#6b7f42] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#52653b] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Sending…" : "Send"}
      </button>
      {(error || sent) && (
        <p id="reset-feedback" role={error ? "alert" : "status"} className={`mt-4 text-sm ${error ? "text-red-700" : "text-[#344823]"}`}>
          {error || "If an account exists for this email address, you’ll receive password reset instructions shortly."}
        </p>
      )}
    </form>
  );
}
