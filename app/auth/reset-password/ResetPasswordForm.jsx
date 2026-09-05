"use client";

import { useState } from "react";

const fields = [
  { name: "password", label: "New Password" },
  { name: "password_confirmation", label: "Confirm Password" },
];

export default function ResetPasswordForm() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = data.get("password");
    const confirmation = data.get("password_confirmation");
    const nextErrors = {};

    if (password.length < 8) {
      nextErrors.password = "New password must be at least 8 characters.";
    }
    if (confirmation !== password) {
      nextErrors.password_confirmation = "Password confirmation does not match.";
    }
    setErrors(nextErrors);
    setMessage("");
    const firstInvalidField = Object.keys(nextErrors)[0];
    if (firstInvalidField) {
      form.elements.namedItem(firstInvalidField).focus();
      return;
    }

    // TODO: Connect the reset API and its token/email contract here.
    // Do not report success until the backend confirms the password was reset.
    setMessage("Password reset is currently unavailable. Please try again later.");
  }

  return (
    <form className="mx-auto w-full md:w-[68%]" onSubmit={handleSubmit}>
      <div className="space-y-6">
        {fields.map(({ name, label }) => (
          <div key={name}>
            <label htmlFor={`reset-${name}`} className="mb-2 block text-base">
              {label} <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id={`reset-${name}`}
              name={name}
              type="password"
              autoComplete="new-password"
              required
              placeholder="Enter your password..."
              aria-invalid={Boolean(errors[name])}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
              onChange={() => { setErrors({}); setMessage(""); }}
              className="h-[50px] w-full rounded-lg border border-[#c6cbc2] bg-transparent px-4 text-base text-[#252a23] placeholder:text-[#a5aaa2] focus:border-[#52653b] focus:outline-2 focus:outline-offset-2 focus:outline-[#52653b] aria-invalid:border-red-600"
            />
            {errors[name] && (
              <p id={`${name}-error`} role="alert" className="mt-2 text-sm text-red-700">
                {errors[name]}
              </p>
            )}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#52653b] px-5 text-base font-semibold text-[#f1f4ec] transition-colors hover:bg-[#6b7f42] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#52653b]"
      >
        Reset Your Password
      </button>
      {message && (
        <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>
      )}
    </form>
  );
}
