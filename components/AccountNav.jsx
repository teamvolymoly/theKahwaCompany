"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const accountLinks = [
  { href: "/user/dashboard", label: "Dashboard" },
  { href: "/user/profile", label: "Profile" },
  { href: "/user/orders", label: "Orders" },
  { href: "/user/password", label: "Password" },
];

export default function AccountNav() {
  const pathname = usePathname();

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
