"use client";

import Link from "next/link";

const trustItems = [
  {
    label: "Natural Ingredients",
    image: "/icons/ft/Natural Ingredients.png",
  },
  {
    label: "No Artificial Coloring",
    image: "/icons/ft/Artificial.png",
  },
  {
    label: "Fresh Aroma",
    image: "/icons/ft/FreshAroma.png",
  },
  {
    label: "Small Batch Blends",
    image: "/icons/ft/Smallblends.png",
  },
  {
    label: "Made in India",
    image: "/icons/ft/MadeinIndia.png",
  },
];

const footerGroups = [
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Track Your Order", href: "/track-order" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Shipping Policy", href: "/shipping" },
    ],
  },
  {
    title: "Products",
    links: [{ label: "Shop All", href: "/shop" }],
  },
  {
    title: "Learn",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Articles", href: "/blogs" },
    ],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61582187630712",
    path: "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/thekahwacompany/",
    path: "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9A3.5 3.5 0 0 0 20 16.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm4.5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm4.75-2.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z",
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/",
    path: "M12 2a10 10 0 0 0-3.6 19.3c-.05-.8-.1-2 .02-2.9.1-.8.7-3.5.7-3.5s-.18-.35-.18-.86c0-.8.46-1.4 1.03-1.4.49 0 .72.37.72.81 0 .49-.31 1.23-.47 1.91-.13.58.28 1.05.84 1.05 1 0 1.76-1.05 1.76-2.56 0-1.34-.96-2.28-2.34-2.28-1.6 0-2.55 1.2-2.55 2.44 0 .49.19 1.01.42 1.29.05.05.05.1.04.17l-.18.66c-.03.1-.1.13-.22.08-.82-.38-1.33-1.58-1.33-2.54 0-2.07 1.5-3.97 4.34-3.97 2.28 0 4.06 1.62 4.06 3.78 0 2.26-1.43 4.08-3.41 4.08-.66 0-1.28-.34-1.49-.75l-.41 1.56c-.15.58-.55 1.31-.82 1.75A10 10 0 1 0 12 2z",
  },
  {
    label: "X",
    href: "https://x.com/",
    path: "M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.27-8.31L3 2h6.4l4.42 5.84L18.9 2zm-1.1 17.84h1.73L8.46 4.05H6.6L17.8 19.84z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@thekahwacompany?si=68vWrtaCn4j7srDU",
    path: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58zM10 15.5v-7l6 3.5-6 3.5z",
  },
];

export default function Footer() {
  return (
    <footer className="kahwa-footer">
      <div className="kahwa-footer__content">
        <section
          className="border-y border-[#dfe5d8] bg-[#f1f4ec]"
          aria-label="Our product promises"
        >
        <div className="mx-auto grid w-full max-w-[1120px] grid-cols-2 gap-x-4 gap-y-8 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:grid-cols-5 lg:py-9">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="group flex flex-col items-center justify-start text-center"
            >
              <img
                src={item.image}
                alt=""
                className="h-12 w-12 object-contain transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-105 sm:h-14 sm:w-14"
              />
              <p className="mt-2 text-base font-medium text-[#4f5948]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
        </section>

        <div className="bg-[#4b6038] text-[#f5f2e9]">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-12 sm:px-6 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h2 className="font-(family-name:--font-basker) text-xl uppercase tracking-[0.04em] text-[#f0eadc]">
                    {group.title}
                  </h2>
                  <nav className="mt-4 flex flex-col gap-2.5">
                    {group.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="w-fit text-base text-white/70 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            <div className="lg:pl-4">
              <h2 className="font-(family-name:--font-basker) text-xl uppercase tracking-[0.03em] text-[#f0eadc]">
                Join the Kahwa Circle
              </h2>
              <p className="mt-3 text-base text-white/70">
                Stay updated with exclusive blends, stories and offers.
              </p>
              <form className="mt-5 flex max-w-md overflow-hidden rounded-md bg-[#667d45]">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="Email"
                  className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-base text-white outline-none placeholder:text-white/55"
                />
                <button
                  type="submit"
                  className="cursor-pointer bg-[#7f9655] px-5 py-2.5 text-base font-medium text-white transition hover:bg-[#8ca45f]"
                >
                  Subscribe
                </button>
              </form>

              <div className="mt-5 flex items-center gap-2.5">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-white/45 text-white/75 transition hover:border-white hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d={link.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-11 max-w-4xl text-base leading-relaxed text-white/55">
            The Kahwa Company&apos;s products are crafted for wellness and
            enjoyment, not for medical use. They are not intended to diagnose,
            treat, or cure any condition. Please consult a healthcare
            professional for any medical advice or concerns.
          </p>

          <div className="mt-8 flex flex-col gap-3 text-base text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>The Kahwa Company © 2026 · All rights reserved</p>
            <p>
              Designed by{" "}
              <a
                href="https://volymoly.com"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                Volymoly
              </a>
            </p>
          </div>
          </div>
        </div>
      </div>

      <div
        role="img"
        aria-label="Where tradition meets imagination"
        className="kahwa-footer__fixed"
      >
        <div className="kahwa-footer__fixed-art" />
      </div>
    </footer>
  );
}
