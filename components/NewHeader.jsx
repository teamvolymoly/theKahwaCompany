"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Squash as Hamburger, Squash } from "hamburger-react";
import { apiFetch } from "@/utils/api";

const toCategoryParam = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function NewHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
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
  const [headerCategories, setHeaderCategories] = useState([]);
  const closeShopDropdown = () => setIsShopOpen(false);

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

  useEffect(() => {
    const loadHeader = async () => {
      try {
        const data = await apiFetch("/header");
        const items = Array.isArray(data) ? data : [];
        const normalized = items.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug || toCategoryParam(cat.name || "category"),
          subcategories: Array.isArray(cat.subcategories)
            ? cat.subcategories.map((sub) => ({
                id: sub.id,
                name: sub.name,
                slug: sub.slug || toCategoryParam(sub.name || "subcategory"),
              }))
            : [],
        }));
        setHeaderCategories(normalized);
      } catch (e) {
        setHeaderCategories([]);
      }
    };
    loadHeader();
  }, []);

  return (
    <header
      className={`w-full absolute top-0 z-50 border-b border-gray-200 ${
        isHome ? "bg-transparent border-none" : "bg-white"
      } text-gray-900`}
    >
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

      <div>
        <div
          className={`relative ${
            isHome ? "bg-transparent" : "bg-white"
          } ${isHome ? "backdrop-blur-sm" : ""}`}
        >
          {isHome && (
            <div
              className={`pointer-events-none absolute inset-0 bg-white ${
                isShopOpen ? "opacity-100" : "opacity-0"
              }`}
              style={{ zIndex: 1 }}
            />
          )}
          <div className="relative z-10 container mx-auto px-4 lg:px-8">
            <div className="relative flex items-center justify-between py-4 lg:py-4">
              <div className="flex items-center gap-3 lg:gap-4">
                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center rounded border border-gray-300 p-2"
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
                <div className="hidden md:inline-flex items-center cursor-pointer">
                  {/* <MenuButton
                  isOpen={isShopOpen}
                  onToggle={() => setIsShopOpen((prev) => !prev)}
                /> */}
                  <Squash
                    toggled={isShopOpen}
                    toggle={setIsShopOpen}
                    size={20}
                    color="#000"
                  />
                  <p className="text-base lg:text-lg font-slime text-black">
                    SHOP
                  </p>
                </div>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 leading-none">
                <Link href="/">
                  <img
                    src="/logo/LOGO_TKC-02.png"
                    alt="Logo"
                    className="h-12 w-auto object-contain cursor-pointer sm:h-14 lg:h-16"
                  />
                </Link>
              </div>

              {/* Search, login/profile, cart */}
              <div className="flex items-center gap-3 lg:gap-4">
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center justify-center cursor-pointer"
                  aria-label="Search"
                >
                  <img
                    src="/icons/search.svg"
                    className="h-8 w-8 lg:h-9 lg:w-9"
                    alt="Search"
                  />
                </button>

                <div
                  className="relative hidden sm:flex items-center"
                  ref={profileRef}
                  onMouseEnter={() => {
                    if (isAuthenticated) setIsProfileOpen(true);
                  }}
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 py-2 cursor-pointer"
                    aria-expanded={isProfileOpen}
                    aria-haspopup={isAuthenticated ? "menu" : undefined}
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push("/auth/login");
                        return;
                      }
                      setIsProfileOpen((prev) => !prev);
                    }}
                  >
                    <img
                      src="/icons/user.svg"
                      className="h-8 w-8 lg:h-9 lg:w-9"
                      alt="Profile"
                    />
                  </button>
                  {isAuthenticated ? (
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
                  ) : null}
                </div>

                <Link
                  href="/cart"
                  className="relative inline-flex items-center justify-center cursor-pointer"
                  aria-label="Cart"
                >
                  <img
                    src="/icons/shop.svg"
                    className="h-8 w-8 lg:h-9 lg:w-9"
                    alt="Cart"
                  />
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FFBF00] px-1 text-[10px] font-semibold text-black">
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
                  <Link
                    href="/"
                    className="hover:text-gray-700"
                    onClick={closeShopDropdown}
                  >
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
                    <div className="mt-3 grid gap-4 text-gray-700">
                      {headerCategories.length === 0 && (
                        <Link
                          href="/shop"
                          className="hover:text-gray-900"
                          onClick={closeShopDropdown}
                        >
                          Shop all
                        </Link>
                      )}
                      {headerCategories.map((category) => (
                        <div key={category.slug} className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {category.name}
                          </p>
                          <Link
                            href={`/shop?category=${category.slug}`}
                            className="hover:text-gray-900"
                            onClick={closeShopDropdown}
                          >
                            All {category.name}
                          </Link>
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/shop?category=${category.slug}&subcategory=${sub.slug}`}
                              className="hover:text-gray-900"
                              onClick={closeShopDropdown}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
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
                    <div className="mt-3 text-gray-700">
                      Products coming soon
                    </div>
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
                  ) : null}
                </nav>
              </div>
            </div>
          </div>
          {/* Dropdown Menu  */}
          <div
            className={` w-full bg-gray-200 transition duration-150 ${
              isShopOpen ? "block" : "hidden"
            }`}
            style={{ position: "relative", zIndex: 20 }}
          >
            <div className=" border border-gray-200 bg-white shadow-xl">
              <div className="container mx-auto px-4 px-10 py-8">
                <div className=" flex flex-col gap-10 lg:flex-row">
                  <div className="flex-1 max-h-[360px] overflow-y-auto pr-4">
                    <div className="grid grid-cols-2 gap-8 text-sm">
                      {headerCategories.length === 0 && (
                        <div>
                          <p className="mb-4 text-base font-semibold text-gray-900">
                            Shop
                          </p>
                          <ul className="space-y-2 text-gray-700">
                            <li>
                              <Link
                                href="/shop"
                                className="hover:text-gray-900"
                                onClick={closeShopDropdown}
                              >
                                Shop all
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                      {headerCategories.map((category) => (
                        <div key={category.slug}>
                          <p className="mb-4 text-base font-semibold text-gray-900">
                            {category.name}
                          </p>
                          <ul className="space-y-2 text-gray-700">
                            <li>
                              <Link
                                href={`/shop?category=${category.slug}`}
                                className="hover:text-gray-900"
                                onClick={closeShopDropdown}
                              >
                                All {category.name}
                              </Link>
                            </li>
                            {category.subcategories.map((sub) => (
                              <li key={sub.slug}>
                                <Link
                                  href={`/shop?category=${category.slug}&subcategory=${sub.slug}`}
                                  className="hover:text-gray-900"
                                  onClick={closeShopDropdown}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full shrink-0 lg:w-[340px]">
                    <p className="mb-5 text-base font-semibold text-gray-900">
                      Bestsellers
                    </p>
                    <Link
                      href="/shop?search=kashmiri-kahwa"
                      className="relative block w-[340px] h-[340px] overflow-hidden rounded-sm"
                      onClick={closeShopDropdown}
                    >
                      <img
                        src="/products/amazon/Resizing_Amazon5.png"
                        alt="Kashmiri Kahwa"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105 "
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
