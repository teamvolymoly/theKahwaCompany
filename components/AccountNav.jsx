"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const accountLinks = [
  { href: "/user/dashboard", label: "My Account" },
  { href: "/user/profile", label: "My Personal Informations" },
  { href: "/user/orders", label: "Orders" },
  { href: "/user/addresses", label: "Addresses" },
  { href: "/user/password", label: "Change Password" },
];

export default function AccountNav({ appearance = "default" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, authLoading } = useAuth();

  if (appearance === "panel") {
    const links = [
      { href: "/user/dashboard", label: "My Account" },
      { href: "/user/profile", label: "My Personal Informations" },
      { href: "/user/orders", label: "Orders" },
      { href: "/user/addresses", label: "Addresses" },
      { href: "/user/password", label: "Change Password" },
    ];
    const pill = "rounded-full border px-5 py-1.5 text-base leading-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#52653b]";
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dce1d6] pb-6">
        <nav aria-label="Account navigation" className="flex flex-wrap gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}
              className={`${pill} ${pathname === link.href ? "border-[#718548] bg-[#718548] text-white" : "border-[#b5c19d] bg-[#fdfefb] text-[#718548] hover:bg-[#e7ecdf]"}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" disabled={authLoading} onClick={async () => { await logout(); router.replace("/auth/login"); }}
          className={`${pill} cursor-pointer border-[#4c5d38] bg-[#4c5d38] text-white hover:bg-[#637846] disabled:opacity-70`}>
          {authLoading ? "Logging out…" : "Log Out"}
        </button>
      </div>
    );
  }

  return (
    <nav
      aria-label="Account navigation"
      className="mt-7 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {accountLinks.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/user/orders" && pathname.startsWith("/user/orders/"));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition sm:text-base ${
              isActive
                ? "border-[#52653b] bg-[#52653b] text-white"
                : "border-[#cfd8c5] bg-white text-[#52653b] hover:border-[#7d904e]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
