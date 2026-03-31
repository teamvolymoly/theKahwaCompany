﻿"use client";

import Link from "next/link";

import { apiFetch } from "@/utils/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HeroSection from "@/components/HeroSection";

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Home() {
  const dummyCategories = [
    {
      id: "signature-kahwa",
      name: "Signature Kahwa",
      slug: "signature-kahwa",
      description: "Classic blends with saffron, cardamom, and almonds.",
      image: "/products/tin/BLTIN1.png",
    },
    {
      id: "herbal-infusions",
      name: "Herbal Infusions",
      slug: "herbal-infusions",
      description: "Caffeine-free comforts for calm evenings.",
      image: "/products/tin/HLTIN1.png",
    },
    {
      id: "spiced-blends",
      name: "Spiced Blends",
      slug: "spiced-blends",
      description: "Warming notes with cinnamon, clove, and ginger.",
      image: "/products/tin/OTTIN1.png",
    },
    {
      id: "gift-sets",
      name: "Gift Sets",
      slug: "gift-sets",
      description: "Curated kahwa collections for gifting.",
      image: "/products/tin/KLTIN1.png",
    },
    {
      id: "seasonal",
      name: "Seasonal Harvests",
      slug: "seasonal",
      description: "Limited batches inspired by the seasons.",
      image: "/products/tin/MLTIN1.png",
    },
    {
      id: "tea-accessories",
      name: "Tea Accessories",
      slug: "tea-accessories",
      description: "Infusers, mugs, and steeping essentials.",
      image: "/products/W2.png",
    },
  ];
  const [categories, setCategories] = useState(dummyCategories);
  const slides = [
    { title: "Slider 1", image: "./products/W1.png" },
    { title: "Slider 2", image: "./products/W2.png" },
    { title: "Slider 3", image: "./products/W3.png" },
  ];
  const testimonials = [
    {
      name: "Wendy Rose",
      date: "January 2022",
      rating: 5,
      quote:
        "Fast delivery, excellent packaging and high quality product. The tea has a lovely flavour. This is a great place if you are interested in or want to discover teas.",
    },
    {
      name: "Eleonora L.",
      date: "March 2022",
      rating: 5,
      quote:
        "Smooth, aromatic, and perfectly balanced. The saffron notes are just right�warm and comforting.",
    },
    {
      name: "Linda Reid",
      date: "July 2022",
      rating: 5,
      quote:
        "Beautiful presentation and a clean, rich taste. Our guests loved it at our boutique caf�.",
    },
    {
      name: "Camilla V.",
      date: "October 2022",
      rating: 5,
      quote:
        "Exceptional blends and elegant packaging. A premium experience from start to finish.",
    },
  ];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiFetch("/categories");
        if (Array.isArray(data) && data.length) {
          setCategories(data);
        } else {
          setCategories(dummyCategories);
        }
      } catch (e) {
        console.error(e);
        setCategories(dummyCategories);
      }
    };
    loadCategories();
  }, []);
  const products = [
    {
      name: "Kashmiri Kahwa Premium Green Tea",
      subtitle: "30 Pyramid Tea Bags",
      price: "? 499",
      oldPrice: "? 599",
      badge: "10% OFF",
      rating: 4.8,
      reviews: 128,
      image: "./products/tin/BLTIN1.png",
    },
    {
      name: "Saffron & Spices Kahwa Blend",
      subtitle: "With Almonds & Cardamom",
      price: "? 525",
      oldPrice: "? 649",
      badge: "Bestseller",
      rating: 4.7,
      reviews: 96,
      image: "./products/tin/HLTIN1.png",
    },
    {
      name: "Classic Kashmiri Kahwa",
      subtitle: "Traditional Herbal Infusion",
      price: "? 475",
      oldPrice: "? 599",
      badge: "New",
      rating: 4.6,
      reviews: 74,
      image: "./products/tin/OTTIN1.png",
    },
    {
      name: "Kahwa Sampler Set",
      subtitle: "Assorted Signature Blends",
      price: "? 799",
      oldPrice: "? 899",
      badge: "Sampler",
      rating: 4.5,
      reviews: 61,
      image: "./products/tin/KLTIN1.png",
    },
    {
      name: "Mint & Saffron Kahwa",
      subtitle: "Refreshing Evening Brew",
      price: "? 459",
      oldPrice: "? 549",
      badge: "10% OFF",
      rating: 4.4,
      reviews: 52,
      image: "./products/tin/MLTIN1.png",
    },
  ];

  return (
    <>
      <main>
        <HeroSection />
        {/* Hero Section old */}
        {/* <section id="home" className="w-full">
          <Swiper
            modules={[Navigation, Pagination, EffectFade, Autoplay]}
            slidesPerView={1}
            spaceBetween={0}
            navigation
            pagination={{ clickable: true }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            speed={900}
            className="w-full hero-swiper"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.title}>
                <article
                  className="hero-slide relative w-full min-h-[70vh] h-[600px] flex items-center justify-center bg-center bg-cover"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/30" />
                  <div className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-12">
                    <div className="max-w-2xl text-white">
                      <p className="text-xs uppercase tracking-[0.4em] mb-4 sm:text-sm text-[#FFBF00]">
                        {slide.title}
                      </p>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
                        Elevate your kahwa ritual
                      </h1>
                      <p className="text-sm sm:text-base text-white/75 max-w-xl">
                        Small-batch blends crafted with saffron, cardamom, and
                        slow-brewed warmth. Discover signatures and seasonal
                        infusions.
                      </p>
                      <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                          href="/shop"
                          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-black"
                        >
                          Shop blends
                        </Link>
                        <Link
                          href="#about"
                          className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-white hover:border-white"
                        >
                          Our story
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </section> */}

        {/* About Kahwa Section */}
        <section
          id="about"
          className="container mx-auto px-4 py-12 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-stretch"
        >
          <div className="relative min-h-[280px] sm:min-h-[340px] md:min-h-[420px] h-full overflow-hidden rounded-3xl">
            <img
              src="/products/W5.png"
              alt="Kahwa assortment"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-transparent" />
            <div className="absolute left-6 bottom-6 text-white">
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                Craft & Heritage
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                A ritual from Kashmir
              </h3>
            </div>
          </div>

          <div className="relative min-h-[280px] sm:min-h-[340px] md:min-h-[420px] h-full overflow-hidden rounded-3xl border border-black/10 bg-white p-6 md:p-10">
            <div className="absolute right-6 top-6 h-20 w-20 overflow-hidden rounded-full border border-black/10 bg-white">
              <img
                src="/logo/Fevicon%20tkc-2.png"
                alt="TKC"
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="relative z-10 flex h-full flex-col">
              <p className="text-xs uppercase tracking-[0.4em] text-[#FFBF00]">
                About kahwa
              </p>
              <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-black">
                What is Kahwa?
              </h2>
              <p className="mt-4 text-sm md:text-base text-black/70">
                Kahwa is a traditional aromatic tea from the valleys of Kashmir,
                crafted with fine green tea leaves and slow brewed with spices
                like saffron, cardamom, cinnamon and cloves. Known for its
                warmth and calming fragrance, it has been a part of Kashmiri
                hospitality for centuries, served to energise the body, soothe
                the senses and bring people together.
              </p>
              <p className="mt-4 text-sm md:text-base text-black/70">
                At The Kahwa Company, we honour this timeless drink while
                introducing modern, creative flavours that elevate the
                experience. From classic blends to innovative infusions, our
                kahwa is crafted to be both comforting and artisanal, something
                you can enjoy every day in every season.
              </p>
              <div className="mt-auto pt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full border border-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black"
                >
                  Explore blends
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* products section -- 2 */}
        <section id="shop-by-product" className="bg-white">
          <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-black/60 mb-3">
                  Bestselling teas
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold text-black">
                  Bestselling Teas
                </h2>
              </div>
              <Link
                href="/shop"
                className="self-start text-xs font-semibold uppercase tracking-[0.2em] text-black/60 hover:text-black inline-flex items-center gap-2"
              >
                View all products <span aria-hidden="true">�</span>
              </Link>
            </div>

            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={1.1}
              spaceBetween={18}
              // navigation
              // pagination={{ clickable: false }}
              breakpoints={{
                640: { slidesPerView: 2.1, spaceBetween: 22 },
                1024: { slidesPerView: 3.2, spaceBetween: 26 },
                1280: { slidesPerView: 4.6, spaceBetween: 30 },
              }}
              className="kahwa-tiles-swiper mt-10 pb-12"
            >
              {products.map((product, index) => (
                <SwiperSlide key={`tiles-${product.name}`}>
                  <Link
                    href={`/product/${toSlug(product.name)}`}
                    className="group h-full rounded-xl bg-white border border-black/10 p-5 transition  hover:shadow-xl flex flex-col "
                  >
                    <div className="relative rounded-2xl bg-[#f7f7f7] p-4">
                      <span className="absolute left-0 top-0 rounded-md bg-[#FFBF00] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                        {product.badge || "30% OFF"}
                      </span>
                      <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition">
                        <button
                          type="button"
                          className="h-9 w-9 rounded-full bg-white shadow-md flex items-center justify-center"
                          aria-label="Compare"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M7 17l10-10M7 7h10v10" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="h-9 w-9 rounded-full bg-white shadow-md flex items-center justify-center"
                          aria-label="Quick view"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <circle cx="12" cy="12" r="3.2" />
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                          </svg>
                        </button>
                      </div>
                      <div className="relative h-36 sm:h-40 md:h-44 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="absolute h-32 sm:h-36 md:h-40 w-auto object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                        />
                        <img
                          src={
                            product.images?.[1]?.image_url ||
                            product.images?.[0]?.image_url ||
                            product.image
                          }
                          alt={product.name}
                          className="absolute h-32 sm:h-36 md:h-40 w-auto object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs text-[#7aa35a]">
                      {"?????".split("").map((star, i) => (
                        <span key={i}>?</span>
                      ))}
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-black line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-black/60 line-clamp-2">
                      {product.subtitle || product.short_description}
                    </p>
                    <div className="mt-auto pt-4 flex items-center justify-between text-sm text-black/70">
                      <span>
                        Rs.{product.price || product.variants?.[0]?.price} - Rs.
                        {product.oldPrice ||
                          (product.price || product.variants?.[0]?.price) + 200}
                      </span>
                      <span className="relative group/cart inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10">
                        <span className="pointer-events-none absolute -top-9 right-0 whitespace-nowrap rounded-full bg-black px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white opacity-0 transition group-hover/cart:opacity-100">
                          Select options
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M6 6h15l-1.5 9H8L6 6z" />
                          <path d="M6 6H4" />
                          <circle cx="9" cy="20" r="1" />
                          <circle cx="18" cy="20" r="1" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* bulk inquiry */}
        <section
          id="bulk-inquiry"
          className="relative overflow-hidden bg-black bg-center bg-cover"
          style={{ backgroundImage: "url('/products/W7.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/40" />
          <div className="container mx-auto px-4 py-16 md:py-24 relative">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[28px] border border-white/15 bg-white/5 px-6 py-10 text-white backdrop-blur-md md:px-10">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.45em] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                  Bulk inquiry
                </div>
                <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
                  Stock kahwa for cafes, hotels, or events.
                </h2>
                <p className="mt-4 max-w-2xl text-sm md:text-base text-white/70">
                  Tell us your volume, preferred blends, and delivery timeline.
                  We will curate a proposal within 24 hours.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="mailto:hello@thekahwacompany.com"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-black"
                  >
                    Email our team
                  </a>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-white hover:border-white"
                  >
                    Browse catalog
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 text-white/70">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    MOQ friendly
                  </p>
                  <p className="mt-3 text-sm text-white/70">
                    Flexible starting quantities for boutique cafes to large
                    hotel chains.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    Custom blends
                  </p>
                  <p className="mt-3 text-sm text-white/70">
                    Tailored spice profiles, packaging, and gifting notes.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    24h response
                  </p>
                  <p className="mt-3 text-sm text-white/70">
                    Dedicated concierge replies within one business day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Section */}
        <section id="categories" className="bg-white text-black">
          <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-black/60">
                  Browse by category
                </p>
                <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black">
                  Shop by Category
                </h2>
              </div>
              <Link
                href="/shop"
                className="self-start rounded-full border border-black/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:border-black"
              >
                View all
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "/products/W3.png",
                "/products/W4.png",
                "/products/W5.png",
                "/products/W6.png",
                "/products/W7.png",
                "/products/W8.png",
              ]
                .map((image, index) => ({
                  ...((categories.length
                    ? categories
                    : [{ id: "all", name: "All", description: "" }]
                  ).slice(0, 6)[index] || {
                    id: index,
                    name: "Category",
                    description:
                      "Explore the best sellers and seasonal favorites.",
                  }),
                  image,
                }))
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug || category.id}`}
                    className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div
                      className="h-44 bg-center bg-cover"
                      style={{ backgroundImage: `url(${category.image})` }}
                    >
                      <div className="h-full w-full bg-gradient-to-b from-black/10 via-black/30 to-black/80" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-black/60">
                        <span>Category</span>
                        <span>View</span>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-black">
                        {category.name}
                      </h3>
                      <p className="mt-3 text-sm text-black/70 line-clamp-2">
                        {category.description ||
                          "Explore the best sellers and seasonal favorites."}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* products section -- 1 */}
        {/* <section id="blends" className="bg-[#fbf8f2]">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-[#7a634b] mb-3">
                KAHWA BLENDS
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#2f241b]">
                Explore our range
              </h2>
            </div>

            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={1.1}
              spaceBetween={20}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2.1, spaceBetween: 24 },
                1024: { slidesPerView: 3.2, spaceBetween: 28 },
                1280: { slidesPerView: 4, spaceBetween: 32 },
              }}
              className="kahwa-products-swiper pb-12"
            >
              {products.map((product) => (
                <SwiperSlide key={`blend-${product.name}`}>
                  <Link
                    href={`/product/${toSlug(product.name)}`}
                    className="group h-full rounded-3xl bg-white/70 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative rounded-2xl bg-white p-5">
                      <span className="absolute left-4 top-4 rounded-full bg-[#FFBF00] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-black">
                        {product.badge}
                      </span>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="mx-auto h-52 w-auto object-contain transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-5">
                      <div className="flex items-center gap-2 text-xs text-[#FFBF00]">
                        <span className="tracking-[0.2em] uppercase">
                          {product.subtitle}
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-[#2f241b]">
                        {product.name}
                      </h3>
                      <div className="mt-3 flex items-center gap-2 text-sm text-[#7a634b]">
                        <span className="text-[#2f241b] font-semibold">
                          {product.price}
                        </span>
                        <span className="line-through">{product.oldPrice}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-[#7a634b]">
                        <span>{"?".repeat(5)}</span>
                        <span>({product.reviews})</span>
                      </div>
                      <span className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#2f241b] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#2f241b] transition group-hover:bg-[#2f241b] group-hover:text-white">
                        View product
                      </span>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section> */}

        {/* products section -- 3 */}
        {/* <section id="bestsellers" className="bg-white">
          <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#2f241b]">
                Bestselling Teas
              </h2>
              <Link
                href="/shop"
                className="self-start rounded-full border border-[#2f241b] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2f241b]"
              >
                View all products
              </Link>
            </div>

            <Swiper
              modules={[Navigation]}
              slidesPerView={1.1}
              spaceBetween={20}
              navigation
              breakpoints={{
                640: { slidesPerView: 2.1, spaceBetween: 24 },
                1024: { slidesPerView: 3.1, spaceBetween: 28 },
                1280: { slidesPerView: 4, spaceBetween: 32 },
              }}
              className="kahwa-cards-swiper mt-10"
            >
              {products.map((product) => (
                <SwiperSlide key={`cards-${product.name}`}>
                  <Link
                    href={`/product/${toSlug(product.name)}`}
                    className="h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-[#FFBF00] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-black">
                        {product.badge}
                      </span>
                      <button
                        type="button"
                        className="rounded-full border border-gray-200 p-2 text-gray-500"
                        aria-label="Add to wishlist"
                      >
                        ?
                      </button>
                    </div>
                    <div className="mt-6 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-44 w-auto object-contain"
                      />
                    </div>
                    <div className="mt-6">
                      <div className="text-xs text-[#7a634b]">
                        {"?".repeat(5)} ({product.reviews})
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-[#2f241b]">
                        {product.name}
                      </h3>
                      <div className="mt-3 flex items-center gap-2 text-sm text-[#7a634b]">
                        <span className="text-[#2f241b] font-semibold">
                          {product.price}
                        </span>
                        <span className="line-through">{product.oldPrice}</span>
                      </div>
                    </div>
                    <span className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#2f241b] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#1f1711]">
                      View product
                    </span>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section> */}

        {/* Blog section */}
        <section id="blog" className="bg-white">
          <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-black/60">
                  Stories & Sips
                </p>
                <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-black">
                  From our blog
                </h2>
              </div>
              <Link
                href="/#blog"
                className="self-start text-xs font-semibold uppercase tracking-[0.2em] text-black/60 hover:text-black inline-flex items-center gap-2"
              >
                View all blogs <span aria-hidden="true">�</span>
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "The Ritual of Kahwa: A Kashmiri Tradition",
                  date: "March 12, 2026",
                  image: "/products/11.png",
                  excerpt:
                    "A warm introduction to the spices, stories, and hospitality that make kahwa a timeless ritual.",
                  tag: "Culture",
                  author: "Editorial Team",
                  read: "6 min read",
                },
                {
                  title: "How to Brew the Perfect Cup at Home",
                  date: "February 28, 2026",
                  image: "/products/9.png",
                  excerpt:
                    "A simple, step-by-step guide to bring cafe-quality kahwa to your kitchen.",
                  tag: "Brewing",
                  author: "Kahwa Lab",
                  read: "4 min read",
                },
                {
                  title: "Flavour Pairings: Mint, Saffron & Beyond",
                  date: "February 10, 2026",
                  image: "/products/12.png",
                  excerpt:
                    "Explore pairings that elevate the aroma and taste of your favorite blends.",
                  tag: "Pairings",
                  author: "Tea Master",
                  read: "5 min read",
                },
              ].map((post, index) => (
                <Link
                  key={post.title}
                  href="/#blog"
                  className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden bg-[#f2f2f2] h-56">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute left-4 bottom-4 text-white">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                        {post.tag}
                      </span>
                      <div className="mt-2 text-xs text-white/80">
                        {post.date}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-black">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm text-black/60">{post.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between text-xs text-black/50">
                      <span>{post.author}</span>
                      <span>{post.read}</span>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                      Read article <span aria-hidden="true">?</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial section */}
        <section id="testimonials" className="bg-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-black/50">
                What our customer say!
              </p>
            </div>

            <div className="mt-10">
              <Swiper
                modules={[Navigation]}
                slidesPerView={1}
                navigation
                className="testimonials-swiper"
              >
                {testimonials.map((t) => (
                  <SwiperSlide key={t.name}>
                    <div className="mx-auto max-w-3xl text-center">
                      <div className="flex justify-center gap-1 text-[#f59e0b] text-lg">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <span key={i}>?</span>
                        ))}
                      </div>
                      <p className="mt-6 text-xl md:text-2xl text-black/80">
                        ?{t.quote}?
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-black/50">
              {testimonials.map((t) => (
                <div key={t.name} className="text-center">
                  <p className="font-semibold text-black">{t.name}</p>
                  <p className="text-xs text-black/50">{t.date}</p>
                </div>
              ))}
            </div> */}
          </div>
        </section>
      </main>

      <style jsx global>{`
        .kahwa-products-swiper .swiper-button-next,
        .kahwa-products-swiper .swiper-button-prev {
          color: #2f241b;
        }

        .kahwa-products-swiper .swiper-pagination-bullet {
          background: #cbb89f;
          opacity: 1;
        }

        .kahwa-products-swiper .swiper-pagination-bullet-active {
          background: #7a634b;
          width: 18px;
          border-radius: 999px;
        }

        .kahwa-tiles-swiper .swiper-button-next,
        .kahwa-tiles-swiper .swiper-button-prev,
        .kahwa-cards-swiper .swiper-button-next,
        .kahwa-cards-swiper .swiper-button-prev {
          color: #2f241b;
        }

        .kahwa-tiles-swiper .swiper-pagination-bullet,
        .kahwa-cards-swiper .swiper-pagination-bullet {
          background: #d5c6b4;
          opacity: 1;
        }

        .kahwa-tiles-swiper .swiper-pagination-bullet-active,
        .kahwa-cards-swiper .swiper-pagination-bullet-active {
          background: #2f241b;
        }
      `}</style>
    </>
  );
}
