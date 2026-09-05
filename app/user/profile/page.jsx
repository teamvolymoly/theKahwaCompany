"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { apiFetch } from "@/utils/api";
import AccountNav from "@/components/AccountNav";
import styles from "./profile.module.css";

const fields = [
  { name: "name", label: "Name", type: "text", placeholder: "Enter your name..." },
  { name: "email", label: "Email address", type: "email", placeholder: "Enter your email address..." },
  { name: "phone", label: "Phone", type: "tel", placeholder: "Enter your phone number..." },
];

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading, reloadUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/auth/login?next=/user/profile");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    let active = true;
    apiFetch("/auth/profile").then(data => {
      if (!active) return;
      setForm({ name: data?.name ?? "", email: data?.email ?? "", phone: data?.phone ?? "" });
      setLoaded(true);
    }).catch(() => {
      if (active) setError("Unable to load your personal information. Please refresh to try again.");
    }).finally(() => { if (active) setFetching(false); });
    return () => { active = false; };
  }, [loading, isAuthenticated]);

  async function handleSave(event) {
    event.preventDefault();
    if (saving || !loaded) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await apiFetch("/auth/profile", { method: "PUT", body: JSON.stringify(form) });
      setForm(previous => ({ name: updated?.name ?? previous.name, email: updated?.email ?? previous.email, phone: updated?.phone ?? previous.phone }));
      await reloadUser();
      setSuccess("Your personal information has been saved.");
    } catch {
      setError("Unable to save your personal information. Please try again.");
    } finally { setSaving(false); }
  }

  return (
    <main className={`${styles.page} bg-[#fdfefb] pt-[88px] text-[#252a23]`}>
      <section className="site-container pb-20 pt-12 md:pt-20">
        <h1 className="font-basker text-[28px] font-normal uppercase leading-[1.2] text-[#344823] md:text-4xl">My Personal Informations</h1>
        {loading || !isAuthenticated ? <p role="status" className="mt-11">Loading your account…</p> : (
          <div className="mt-8 rounded-lg bg-[#f1f4ec] p-4 md:mt-11 md:p-6">
            <AccountNav appearance="panel" />
            <form id="personal-information" onSubmit={handleSave} aria-busy={fetching || saving} className="mx-auto w-full py-8 md:w-[68%] md:py-10">
              {fetching && <p role="status" className="mb-4">Loading personal information…</p>}
              <fieldset disabled={fetching || saving || !loaded} className="space-y-5 disabled:opacity-70">
                {fields.map(field => (
                  <div key={field.name}>
                    <label htmlFor={`profile-${field.name}`} className="mb-2 block text-base">{field.label}</label>
                    <input id={`profile-${field.name}`} name={field.name} type={field.type} autoComplete={field.name} placeholder={field.placeholder} value={form[field.name]}
                      onChange={event => { setForm(previous => ({ ...previous, [field.name]: event.target.value })); setError(""); setSuccess(""); }} className="w-full" />
                  </div>
                ))}
                <button type="submit" className="h-12 w-full cursor-pointer rounded-lg bg-[#52653b] text-base font-semibold text-white hover:bg-[#6b7f42] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#52653b] disabled:cursor-wait">{saving ? "Saving…" : "Save"}</button>
              </fieldset>
              {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
              {success && <p role="status" className="mt-4 text-sm text-[#344823]">{success}</p>}
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
