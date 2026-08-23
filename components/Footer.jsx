"use client";

"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const trustItems = [
  {
    label: "Natural Ingredients",
    image: "/icons/svg_footer_icons/Natural Ingredients.svg",
  },
  {
    label: "No Artificial Coloring",
    image: "/icons/svg_footer_icons/Artificial.svg",
  },
  {
    label: "Fresh Aroma",
    image: "/icons/svg_footer_icons/FreshAroma.svg",
  },
  {
    label: "Small Batch Blends",
    image: "/icons/svg_footer_icons/Smallblends.svg",
  },
  {
    label: "Made in India",
    image: "/icons/svg_footer_icons/MadeinIndia.svg",
  },
];

const footerGroups = [
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      // { label: "Track Your Order", href: "/track-order" },
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
    image: "/icons/main_footer_icon/Fb.svg",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/thekahwacompany/",
    image: "/icons/main_footer_icon/Insta.svg",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@thekahwacompany?si=68vWrtaCn4j7srDU",
    image: "/icons/main_footer_icon/YT.svg",
  },
];

export default function Footer() {
  const promisesSliderRef = useRef(null);
  const [activePromise, setActivePromise] = useState(0);

  const handlePromisesScroll = () => {
    const slider = promisesSliderRef.current;
    if (!slider) return;
    const slideWidth = slider.scrollWidth / trustItems.length;
    setActivePromise(
      Math.min(
        trustItems.length - 1,
        Math.max(0, Math.round(slider.scrollLeft / slideWidth)),
      ),
    );
  };

  return (
    <footer className="relative mb-[216] md:mb-[316]">
      <div className="kahwa-footer__content">
        <section
          className="border-y border-[#f1f4ec] bg-[#f1f4ec]"
          aria-label="Our product promises"
        >
          <div
            ref={promisesSliderRef}
            onScroll={handlePromisesScroll}
            className="footer-promises__slider site-container flex snap-x snap-mandatory overflow-x-auto pb-5 pt-8 sm:grid sm:grid-cols-3 sm:gap-x-4 sm:gap-y-8 sm:overflow-visible sm:py-8 lg:grid-cols-5 lg:py-9"
          >
            {trustItems.map((item) => (
              <div
                key={item.label}
                className="group flex w-full shrink-0 snap-center flex-col items-center justify-start text-center sm:w-auto"
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
          <div
            className="mx-auto mb-6 flex w-[140px] gap-1.5 sm:hidden"
            aria-label={`Promise ${activePromise + 1} of ${trustItems.length}`}
          >
            {trustItems.map((item, index) => (
              <span
                key={`${item.label}-pagination`}
                className={`h-px flex-1 transition-colors ${
                  activePromise === index ? "bg-[#52653b]" : "bg-[#cbd1c3]"
                }`}
              />
            ))}
          </div>
        </section>

        <div className="bg-[#4b6038] text-[#DDE2D3]">
          <div className="site-container py-12 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
              <div className="order-2 grid grid-cols-2 gap-x-8 gap-y-9 sm:order-1 sm:grid-cols-3 sm:gap-8">
                {footerGroups.map((group) => (
                  <div key={group.title}>
                    <h2 className="font-(family-name:--font-basker) text-xl uppercase tracking-[0.04em] text-[#DDE2D3]">
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

              <div className="order-1 flex justify-end sm:order-2">
                <div className="w-full sm:w-fit lg:pl-4">
                  <h2 className="font-(family-name:--font-basker) text-xl uppercase tracking-[0.03em] text-[#DDE2D3]">
                    Join the Kahwa Circle
                  </h2>
                  <p className="mt-3 text-base text-white/70">
                    Stay updated with exclusive blends, stories and offers.
                  </p>
                  <form className="mt-5 flex h-12 w-full max-w-md items-center rounded-md bg-[#667d45] p-1.5 ">
                    <label htmlFor="footer-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="footer-email"
                      type="email"
                      required
                      placeholder="Email"
                      className="h-full min-w-0 flex-1 border-0 bg-transparent px-2.5 text-base text-white outline-none ring-0 placeholder:text-white/55 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:border-0 active:outline-none"
                    />
                    <button
                      type="submit"
                      className="h-full cursor-pointer rounded-sm bg-[#74894d] px-3  text-base font-normal text-[#e5e8df] transition hover:bg-[#829957]"
                    >
                      Subscribe
                    </button>
                  </form>

                  <div className="mt-7 flex items-center gap-2 sm:mt-5">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.label}
                        className={`h-10 w-10 md:h-8 md:w-8 items-center justify-center transition hover:opacity-80 ${
                          link.label === "Pinterest" || link.label === "X"
                            ? "flex sm:hidden"
                            : "flex"
                        }`}
                      >
                        <img
                          src={link.image}
                          alt=""
                          className="h-13 w-13 object-contain"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-9 max-w-4xl text-[13px] md:text-sm text-white/55 sm:mt-11 font-thin">
              The Kahwa Company&apos;s products are crafted for wellness and
              enjoyment, not for medical use. They are not intended to diagnose,
              treat, or cure any condition. Please consult a healthcare
              professional for any medical advice or concerns.
            </p>

            <div className="mt-5 flex flex-col gap-3 text-base normal-case text-white/70 sm:mt-8 sm:flex-row sm:items-center sm:justify-between uppercase">
              <p>The Kahwa Company © 2026 · All rights reserved</p>
              <p className="flex items-center gap-2 ">
                <span className="sm:hidden">Designed by</span>
                <span className="hidden sm:inline">Website by</span>
                <a
                  href="https://volymoly.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex opacity-80 transition hover:opacity-100"
                  aria-label="Website by Volymoly"
                >
                  <img
                    src="/logo/volymoly_logo.svg"
                    alt="Volymoly"
                    className="h-auto w-[88px]"
                  />
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
        <p
          className="pointer-events-none absolute inset-x-4 bottom-0 z-10 flex h-[220px] flex-col items-center justify-center text-center text-[24px] uppercase leading-[1.08] text-[#f5f2e9] sm:h-[316px] sm:text-[clamp(1.75rem,3vw,2.5rem)]"
          style={{
            fontFamily: "var(--font-basker)",
            textShadow: "0 2px 14px rgba(0, 0, 0, 0.55)",
          }}
          aria-hidden="true"
        >
          <span>Where Tradition</span>
          <span>Meets Imagination</span>
        </p>
      </div>
    </footer>
  );
}
