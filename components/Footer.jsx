"use client";

import Link from "next/link";

const quickLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Kahwa", href: "/shop?category=kahwa" },
  { label: "Teaware", href: "/shop?category=teaware" },
  { label: "Gifts", href: "/shop?category=gifts" },
  { label: "Offers", href: "/shop?category=offers" },
  { label: "Sampler", href: "/shop?category=sampler" },
];

const supportLinks = [
  { label: "Shipping", href: "/shipping" },
  { label: "Refund", href: "/refund" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact Us", href: "/contact" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Corporate Gifting", href: "/corporate-gifting" },
];

const accountLinks = [
  { label: "Account", href: "/user/profile" },
  { label: "Orders", href: "/user/orders" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/thekahwacompany/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9A3.5 3.5 0 0 0 20 16.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm9.25 2.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61582187630712",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
      </svg>
    ),
  },
  {
    label: "Youtube",
    href: "https://youtube.com/@thekahwacompany?si=68vWrtaCn4j7srDU",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58zM10 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.6 19.3c-.05-.8-.1-2 .02-2.9.1-.8.7-3.5.7-3.5s-.18-.35-.18-.86c0-.8.46-1.4 1.03-1.4.49 0 .72.37.72.81 0 .49-.31 1.23-.47 1.91-.13.58.28 1.05.84 1.05 1 0 1.76-1.05 1.76-2.56 0-1.34-.96-2.28-2.34-2.28-1.6 0-2.55 1.2-2.55 2.44 0 .49.19 1.01.42 1.29a.17.17 0 0 1 .04.17c-.05.19-.16.58-.18.66-.03.1-.1.13-.22.08-.82-.38-1.33-1.58-1.33-2.54 0-2.07 1.5-3.97 4.34-3.97 2.28 0 4.06 1.62 4.06 3.78 0 2.26-1.43 4.08-3.41 4.08-.66 0-1.28-.34-1.49-.75l-.41 1.56c-.15.58-.55 1.31-.82 1.75A10 10 0 1 0 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/the-kahwa-company/about/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h4v1.7c.6-1.1 1.8-2 3.5-2 3 0 4.5 2 4.5 5.1V21h-4v-6.2c0-1.5-.03-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V21H10V9z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1f1711] text-white">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr_1.4fr]">
          <div>
            <img
              src="/logo/LOGO_TKC-02.png"
              alt="The Kahwa Company"
              className="h-14 w-auto object-contain"
            />
            <div className="mt-6 space-y-2 text-sm text-[#d8c8b6]">
              <p>info@thekahwacompany.com</p>
              <p>+91 95822 51241</p>
            </div>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#d8c8b6]">
                Follow us
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#3c2a20] text-[#f3d8c6] transition hover:border-[#f3d8c6] hover:text-white"
                    aria-label={link.label}
                    title={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#d8c8b6]">
                Quick Links
              </p>
              <div className="mt-4 grid gap-2 text-sm text-[#f3d8c6]">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#d8c8b6]">
                Support
              </p>
              <div className="mt-4 grid gap-2 text-sm text-[#f3d8c6]">
                {supportLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#d8c8b6]">
                My Account
              </p>
              <div className="mt-4 grid gap-2 text-sm text-[#f3d8c6]">
                {accountLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d8c8b6]">
              Join the Kahwa Circle
            </p>
            <p className="mt-4 text-sm text-[#f3d8c6]">
              Stay updated with exclusive blends, stories and offers.
            </p>
            <form className="mt-6 flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="E-mail*"
                className="rounded-full border border-[#3c2a20] bg-[#2a1e17] px-4 py-3 text-sm text-white placeholder:text-[#bfae9d] outline-none focus:border-[#f3d8c6]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#f3d8c6] px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f1711]"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-[#bfae9d]">
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
              <span className="h-1 w-1 rounded-full bg-[#6d5a4a]" />
              <Link href="/terms" className="hover:text-white">
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#2d2018] pt-6 text-xs text-[#bfae9d] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright (c) 2026 The Kahwa Company by volymoly</p>
          <div className="flex items-center gap-2">
            <span className="text-[#f3d8c6]">volymoly</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#f3d8c6] text-[10px]">
              v
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
