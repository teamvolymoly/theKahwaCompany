"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

const shopLinks = [
  {
    label: "Kahwa Loose Leaf",
    items: [
      "All Kahwa Loose Leaf",
      "Kashmiri Kahwa",
      "Hibiscus Kahwa",
      "Blue Kahwa",
      "Mint Kahwa",
      "Oolong Kahwa",
    ],
  },
  {
    label: "Kahwa Bags",
    items: [
      "All Kahwa Bags",
      "Kashmiri Kahwa",
      "Hibiscus Kahwa",
      "Blue Kahwa",
      "Mint Kahwa",
      "Oolong Kahwa",
    ],
  },
  {
    label: "Teaware",
    items: ["All", "Loose kahwa infusers", "Travel mugs and bottles"],
  },
];

const toCategoryParam = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isGiftsOpen, setIsGiftsOpen] = useState(false);
  const [isReadOpen, setIsReadOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { isAuthenticated, user, loading, authLoading, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  useEffect(() => {
    const syncCartCount = () => {
      const stored = localStorage.getItem("cart_count");
      setCartCount(stored ? Number(stored) : 0);
    };
    syncCartCount();
    window.addEventListener("storage", syncCartCount);
    window.addEventListener("cartchange", syncCartCount);
    return () => {
      window.removeEventListener("storage", syncCartCount);
      window.removeEventListener("cartchange", syncCartCount);
    };
  }, []);

  return (
    <header className="bg-white/0 text-gray-900 w-full absolute top-0 z-50">
      {isOfferOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 cursor-pointer"
              aria-label="Close offer"
              onClick={() => setIsOfferOpen(false)}
            >
              <svg
                className="w-7 h-7 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="black"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
              Welcome offer
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-gray-900">
              Get first dibs on new Kahwa drops
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Join our newsletter or WhatsApp list for early access and launch
              offers.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-black px-4 py-2 text-sm font-semibold text-black hover:bg-black hover:text-white"
              >
                Join Newsletter
              </button>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/80"
              >
                WhatsApp Updates
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
              <div
                className="relative group"
                onMouseEnter={() => setIsShopOpen(true)}
                onMouseLeave={() => setIsShopOpen(false)}
              >
                <Link
                  href="/shop"
                  className="flex items-center gap-2 hover:text-gray-700"
                  aria-expanded={isShopOpen}
                  onClick={() => setIsShopOpen((prev) => !prev)}
                >
                  Shop
                  <svg
                    viewBox="0 0 20 20"
                    className="h-3 w-3"
                    fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
                  </svg>
                </Link>

                <div
                  className={`absolute left-1/2 top-8 z-40 w-[95vw] -translate-x-[45%] transition duration-150 ${
                    isShopOpen ? "visible opacity-100" : "invisible opacity-0"
                  }`}
                >
                  <div className="mt-5 border border-gray-200 bg-white shadow-xl">
                    <div className="px-6 py-8">
                      <div className="flex flex-col gap-10 lg:flex-row">
                        <div className="flex-1 max-h-[360px] overflow-y-auto pr-4">
                          {/* <div className="mb-6 flex items-center gap-6 text-sm font-semibold text-gray-900">
                            <Link href="/shop" className="hover:text-gray-700">
                              Bestsellers
                            </Link>
                            <Link href="/shop" className="hover:text-gray-700">
                              Samplers
                            </Link>
                          </div> */}
                          <div className="grid grid-cols-2 gap-8 text-sm">
                            {shopLinks.map((group) => (
                              <div key={group.label}>
                                <p className="mb-4 text-base font-semibold">
                                  {group.label}
                                </p>
                                <ul className="space-y-2 text-gray-700">
                                  {group.items.map((item) => (
                                    <li key={item}>
                                      <Link
                                        href={`/shop?category=${toCategoryParam(
                                          item,
                                        )}`}
                                        className="hover:text-gray-900"
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="w-full shrink-0 lg:w-[420px]">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                            <Link
                              href="/shop?search=kashmiri-kahwa"
                              className="overflow-hidden rounded-xl border border-gray-200"
                            >
                              <img
                                src="/products/W1.png"
                                alt="Kashmiri Kahwa"
                                className="h-40 w-full object-cover"
                              />
                              <div className="px-4 py-3 text-sm font-semibold">
                                Bestsellers
                              </div>
                            </Link>
                            <Link
                              href="/shop?search=sampler"
                              className="overflow-hidden rounded-xl border border-gray-200"
                            >
                              <img
                                src="/products/W2.png"
                                alt="Sampler set"
                                className="h-40 w-full object-cover"
                              />
                              <div className="px-4 py-3 text-sm font-semibold">
                                Samplers
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="relative group"
                onMouseEnter={() => setIsGiftsOpen(true)}
                onMouseLeave={() => setIsGiftsOpen(false)}
              >
                <Link
                  href="/shop?category=gifts"
                  className="flex items-center gap-2 hover:text-gray-700"
                  aria-expanded={isGiftsOpen}
                  onClick={() => setIsGiftsOpen((prev) => !prev)}
                >
                  Gifts
                  <svg
                    viewBox="0 0 20 20"
                    className="h-3 w-3"
                    fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
                  </svg>
                </Link>
                <div
                  className={`absolute left-0 top-full z-40 w-64 transition duration-150 ${
                    isGiftsOpen ? "visible opacity-100" : "invisible opacity-0"
                  }`}
                >
                  <div className="mt-5 border border-gray-200 bg-white shadow-xl">
                    <div className="px-5 py-4 text-sm text-gray-700">
                      Products coming soon
                    </div>
                  </div>
                </div>
              </div>
              {/* <Link href="/#bulk-inquiry" className="hover:text-gray-700">
                Bulk Inquiry
              </Link>
              <div
                className="relative group"
                onMouseEnter={() => setIsReadOpen(true)}
                onMouseLeave={() => setIsReadOpen(false)}
              >
                <Link
                  href="/#blog"
                  className="flex items-center gap-2 hover:text-gray-700"
                  aria-expanded={isReadOpen}
                  onClick={() => setIsReadOpen((prev) => !prev)}
                >
                  Read
                  <svg
                    viewBox="0 0 20 20"
                    className="h-3 w-3"
                    fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
                  </svg>
                </Link>
                <div
                  className={`absolute left-0 top-full z-40 w-56 transition duration-150 ${
                    isReadOpen ? "visible opacity-100" : "invisible opacity-0"
                  }`}
                >
                  <div className="mt-5 border border-gray-200 bg-white shadow-xl">
                    <div className="px-5 py-4 text-sm">
                      <ul className="space-y-2 text-gray-700">
                        <li>
                          <Link href="/about" className="hover:text-gray-900">
                            Our Story
                          </Link>
                        </li>
                        <li>
                          <Link href="/#blog" className="hover:text-gray-900">
                            Blog
                          </Link>
                        </li>
                        <li>
                          <Link href="/#blog" className="hover:text-gray-900">
                            Press
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact" className="hover:text-gray-900">
                            Contact Us
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div> */}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center rounded border border-gray-300 p-2"
                aria-label="Open menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <div className="leading-none">
                <Link href="/">
                  <img
                    src="/logo/LOGO_TKC-02.png"
                    alt="Logo"
                    className="h-14 w-auto object-contain cursor-pointer sm:h-16 lg:h-20"
                  />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="hidden sm:inline-flex items-center justify-center cursor-pointer"
                aria-label="Search"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              {!loading && isAuthenticated ? (
                <div
                  className="relative hidden sm:flex items-center"
                  ref={profileRef}
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-800 hover:border-gray-900"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="menu"
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                  >
                    {user?.full_name || "Profile"}
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3 w-3"
                      fill="currentColor"
                    >
                      <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
                    </svg>
                  </button>
                  <div
                    className={`absolute right-0 top-full z-40 w-44 rounded-xl border border-gray-200 bg-white shadow-xl transition ${
                      isProfileOpen
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                    }`}
                  >
                    <div className="py-2 text-sm text-gray-700">
                      <Link
                        href="/user/profile"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/user/dashboard"
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut || authLoading}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-50 disabled:opacity-70 text-red-600"
                      >
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : !loading ? (
                <Link
                  href="/auth/login"
                  className="hidden sm:inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-800 hover:border-gray-900"
                >
                  Login
                </Link>
              ) : null}
              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center cursor-pointer"
                aria-label="Cart"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FFBF00] px-1 text-[10px] font-semibold text-black">
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>

          <div
            className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
              isOpen ? "max-h-[760px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-4 text-sm font-medium">
                <Link href="/" className="hover:text-gray-700">
                  Home
                </Link>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between hover:text-gray-700">
                    Shop
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3 w-3 transition group-open:rotate-180"
                      fill="currentColor"
                    >
                      <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
                    </svg>
                  </summary>
                  <div className="mt-3 grid gap-3 text-gray-700">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Bestsellers
                    </p>
                    <Link href="/shop" className="hover:text-gray-900">
                      Samplers
                    </Link>
                    <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Kahwa Loose Leaf
                    </p>
                    {shopLinks[0].items.map((item) => (
                      <Link
                        key={item}
                        href={`/shop?category=${toCategoryParam(item)}`}
                        className="hover:text-gray-900"
                      >
                        {item}
                      </Link>
                    ))}
                    <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Kahwa Bags
                    </p>
                    {shopLinks[1].items.map((item) => (
                      <Link
                        key={item}
                        href={`/shop?category=${toCategoryParam(item)}`}
                        className="hover:text-gray-900"
                      >
                        {item}
                      </Link>
                    ))}
                    <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Teaware
                    </p>
                    {shopLinks[2].items.map((item) => (
                      <Link
                        key={item}
                        href={`/shop?category=${toCategoryParam(item)}`}
                        className="hover:text-gray-900"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between hover:text-gray-700">
                    Gifts
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3 w-3 transition group-open:rotate-180"
                      fill="currentColor"
                    >
                      <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
                    </svg>
                  </summary>
                  <div className="mt-3 text-gray-700">Products coming soon</div>
                </details>
                <Link href="/#bulk-inquiry" className="hover:text-gray-700">
                  Bulk Inquiry
                </Link>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between hover:text-gray-700">
                    Read
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3 w-3 transition group-open:rotate-180"
                      fill="currentColor"
                    >
                      <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
                    </svg>
                  </summary>
                  <div className="mt-3 grid gap-3 text-gray-700">
                    <Link href="/#about" className="hover:text-gray-900">
                      Our Story
                    </Link>
                    <Link href="/#blog" className="hover:text-gray-900">
                      Blog
                    </Link>
                    <Link href="/#blog" className="hover:text-gray-900">
                      Press
                    </Link>
                  </div>
                </details>
                {!loading && isAuthenticated ? (
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href="/user/profile"
                      className="block py-2 text-gray-700 hover:text-gray-900"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/user/dashboard"
                      className="block py-2 text-gray-700 hover:text-gray-900"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut || authLoading}
                      className="w-full text-left py-2 text-red-600 disabled:opacity-70"
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                ) : !loading ? (
                  <Link
                    href="/auth/login"
                    className="pt-4 border-t border-gray-200 text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Link>
                ) : null}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
