"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import {
  Check,
  ChevronDown,
  Leaf,
  Minus,
  Package,
  Plus,
  ShoppingBag,
} from "lucide-react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

const galleryImages = [
  {
    src: "/bg/TKC Website Images/Kashmiri Image.png",
    alt: "Kashmiri Kahwa tea presentation",
  },
  {
    src: "/products/amazon/Resizing_Amazon3.png",
    alt: "Kashmiri Kahwa tea tin",
  },
  {
    src: "/products/amazon/Resizing_Amazon4.png",
    alt: "Kashmiri Kahwa tea ingredients",
  },
  {
    src: "/products/amazon/Resizing_Amazon5.png",
    alt: "Kashmiri Kahwa tea pack",
  },
  { src: "/bg/TKC Website Images/Products Image.png", alt: "Tea collection" },
];

const formats = [
  { id: "100g", label: "100 g", detail: "Loose leaf tin", icon: Package },
  { id: "20bags", label: "20 bags", detail: "Tea bags", icon: ShoppingBag },
  { id: "200g", label: "200 g", detail: "Loose leaf pouch", icon: Leaf },
  {
    id: "500g",
    label: "500 g",
    detail: "Value pouch",
    icon: Leaf,
    offer: "15% OFF",
  },
];

export default function TestProductPage() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState("Description");
  const [selectedFormat, setSelectedFormat] = useState("100g");
  const [quantity, setQuantity] = useState(1);

  return (
    <main className="bg-[#faf9f4] pt-[70px] text-[#24231f]">
      <section className="site-container py-7 sm:py-10 lg:py-14">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm text-[#77766f]"
        >
          <span>Home</span>
          <span aria-hidden="true">/</span>
          <span>Black tea</span>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-[#24231f]">Kashmiri Kahwa</span>
        </nav>

        <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,.85fr)] xl:gap-16">
          <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,1fr)] md:items-stretch">
            <div className="relative aspect-square min-h-0 overflow-hidden rounded-md bg-[#e9e3d8]">
              <span className="absolute left-5 top-5 z-10 rounded bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#695d49]">
                BEST SELLER
              </span>
              <Swiper
                spaceBetween={10}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                modules={[FreeMode, Thumbs]}
                className="!h-full !w-full"
              >
                {galleryImages.map((image) => (
                  <SwiperSlide key={image.src} className="bg-[#e9e3d8]">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={0}
              slidesPerView={5}
              breakpoints={{ 768: { direction: "vertical", slidesPerView: 5 } }}
              freeMode
              watchSlidesProgress
              modules={[FreeMode, Thumbs]}
              className="aspect-[5/1] w-full min-h-0 md:h-full md:aspect-auto"
            >
              {galleryImages.map((image) => (
                <SwiperSlide
                  key={`thumb-${image.src}`}
                  className="h-full overflow-hidden p-1 opacity-55 [&.swiper-slide-thumb-active]:opacity-100"
                >
                  <img
                    src={image.src}
                    alt=""
                    className="h-full w-full rounded-md object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="xl:pt-1">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#dedbd2] pb-5">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#6d7651]">
                  The Kahwa Co.
                </p>
                <h1 className="mt-2 font-basker text-4xl leading-none sm:text-5xl">
                  Kashmiri Kahwa
                </h1>
                <p className="mt-3 text-base text-[#4e4c46]">
                  Green tea · Saffron · Almond · Rose petals
                </p>
              </div>
              <div className="flex items-center gap-1 pt-1 text-sm font-medium">
                <span className="flex text-[#b38418]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <img
                      key={index}
                      src="/icons/starfill.svg"
                      alt=""
                      className="h-4 w-4"
                    />
                  ))}
                </span>
                <span>4.8</span>
                <span className="text-[#77766f]">(1,409)</span>
              </div>
            </div>

            <div className="flex items-end gap-3 py-5">
              <span className="text-2xl font-semibold">₹ 499</span>
              <span className="pb-0.5 text-sm text-[#77766f]">₹ 4.99 / g</span>
            </div>

            <div className="rounded-xl bg-[#eeece5] p-5">
              <div className="flex gap-5 overflow-x-auto border-b border-[#d6d3ca] text-sm font-medium">
                {["Description", "Ingredients", "Brewing tips"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 border-b-2 pb-3 ${activeTab === tab ? "border-[#282721] text-[#282721]" : "border-transparent text-[#716f67]"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {activeTab === "Description" && (
                <div className="space-y-3 pt-4 text-sm leading-6 text-[#45443e]">
                  <p className="flex gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#637743]" />A
                    fragrant, golden cup inspired by the valleys of Kashmir.
                  </p>
                  <p className="flex gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#637743]" />
                    Warm spices and floral notes with a smooth green tea finish.
                  </p>
                  <p className="flex gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#637743]" />
                    Naturally uplifting, perfect for slow morning rituals.
                  </p>
                </div>
              )}
              {activeTab === "Ingredients" && (
                <p className="pt-4 text-sm leading-6 text-[#45443e]">
                  Green tea, saffron, almond flakes, cardamom, cinnamon, rose
                  petals and natural flavours.
                </p>
              )}
              {activeTab === "Brewing tips" && (
                <p className="pt-4 text-sm leading-6 text-[#45443e]">
                  Steep one teaspoon in freshly boiled water for 2–3 minutes.
                  Add honey and a few almond flakes to serve.
                </p>
              )}
              <button
                type="button"
                className="mt-4 flex items-center gap-1 text-sm font-semibold underline underline-offset-4"
              >
                See more <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#6e6c64]">
                Choose your format ·{" "}
                <span className="normal-case tracking-normal text-[#24231f]">
                  100 g loose leaf tin
                </span>
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {formats.map(({ id, label, detail, icon: Icon, offer }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedFormat(id)}
                    className={`relative flex min-h-28 flex-col items-center justify-center rounded-md border px-2 text-center ${selectedFormat === id ? "border-[#24231f] bg-white" : "border-[#d9d6cd] bg-[#faf9f4] hover:border-[#89867d]"}`}
                  >
                    <Icon className="mb-2 h-5 w-5 text-[#5b604f]" />
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="text-xs text-[#65635c]">{detail}</span>
                    {offer && (
                      <span className="absolute bottom-2 rounded-full bg-[#cf3650] px-2 py-0.5 text-[10px] font-bold text-white">
                        {offer}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-[#4b4a43]">
              <span className="h-2 w-2 rounded-full bg-[#57a657]" />
              Estimated delivery <strong>Friday, 21 August</strong>
            </p>
            <div className="mt-3 flex gap-3">
              <div className="flex h-12 items-center rounded-full border border-[#3e3d38] bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="grid h-full w-11 place-items-center"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="grid h-full w-11 place-items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                className="flex h-12 flex-1 items-center justify-between rounded-full bg-[#30302d] px-6 text-sm font-bold text-white hover:bg-[#4b4b45]"
              >
                <span>ADD TO BASKET</span>
                <span>₹ {499 * quantity}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
