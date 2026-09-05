"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AccountNav from "@/components/AccountNav";
import AccountAddresses from "@/components/AccountAddresses";

export default function AddressesPage() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();
  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/auth/login?next=/user/addresses");
  }, [loading, isAuthenticated, router]);

  return (
    <main className="bg-[#fdfefb] pt-[88px] text-[#252a23]">
      <section className="site-container pb-20 pt-12 md:pt-20">
        <h1 className="font-basker text-[28px] font-normal uppercase leading-[1.2] text-[#344823] md:text-4xl">Address</h1>
        {loading || !isAuthenticated ? <p role="status" className="mt-11">Loading your account…</p> : (
          <div className="mt-8 rounded-lg bg-[#f1f4ec] p-4 md:mt-11 md:p-6">
            <AccountNav appearance="panel" />
            <AccountAddresses />
          </div>
        )}
      </section>
    </main>
  );
}
