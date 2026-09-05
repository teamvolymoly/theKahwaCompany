"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import AccountAddresses from "@/components/AccountAddresses";
import AccountNav from "@/components/AccountNav";

const card = "flex min-w-0 flex-col rounded-lg bg-[#fdfefb] p-6 md:min-h-[245px]";
const action = "w-fit text-base underline underline-offset-3 hover:text-[#6b7f42] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#52653b]";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/auth/login?next=/user/dashboard");
  }, [loading, isAuthenticated, router]);

  return (
    <main className="bg-[#fdfefb] pt-[88px] text-[#252a23]">
      <section className="site-container pb-20 pt-12 md:pt-20">
        <h1 className="font-basker text-[28px] font-normal uppercase leading-[1.2] text-[#344823] md:text-4xl">My account</h1>
        {loading || !isAuthenticated ? (
          <p role="status" className="mt-11 rounded-lg bg-[#f1f4ec] p-6">Loading your account…</p>
        ) : (
          <div className="mt-8 rounded-lg bg-[#f1f4ec] p-4 md:mt-11 md:p-6">
            <AccountNav appearance="panel" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className={card}>
                <h2 className="font-basker text-xl font-normal uppercase">My Personal Informations</h2>
                <div className="mb-6 mt-6 break-words text-base leading-[1.5]">
                  <p>{user?.name || "Your account"}</p>
                  <p className="text-[#80837d]">{user?.email}</p>
                  <p className="text-[#80837d]">{user?.phone}</p>
                </div>
                <Link href="/user/profile" className={`${action} mt-auto`}>Edit My Personal Informations</Link>
              </article>
              <AccountAddresses summary />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
