"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";

import "swiper/css";

const PRODUCTS = [
  {
    name: "Kashmiri Kahwa",
    image: "/products/tin/KLTIN1.png",
    slug: "kashmiri-kahwa",
  },
  {
    name: "Hibiscus Kahwa",
    image: "/products/tin/HLTIN1.png",
    slug: "hibiscus-kahwa",
  },
  {
    name: "Blue Kahwa",
    image: "/products/tin/BLTIN1.png",
    slug: "blue-kahwa",
  },
  {
    name: "Oolong Kahwa",
    image: "/products/tin/OTTIN1.png",
    slug: "oolong-kahwa",
  },
  {
    name: "Mint Kahwa",
    image: "/products/tin/MLTIN1.png",
    slug: "mint-kahwa",
  },
];

export default function TestHeroPage() {
  const [swiper, setSwiper] = useState(null);

  return (
    <main className="min-h-screen bg-white">
      <section
        className="relative isolate flex min-h-[760px] flex-col overflow-hidden bg-cover bg-center pt-24 sm:min-h-[900px] sm:pt-28 lg:min-h-[980px] lg:pt-36"
        style={{
          backgroundImage: "url('/bg/beautiful-view-mountains-sunny-day.png')",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-white/10 to-white" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
          <h1 className="font-basker text-3xl font-normal uppercase leading-tight text-[#1c2230] sm:text-4xl lg:text-[42px]">
            Discover a blend of
            <span className="block">botanicals and tradition</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-black/75 sm:text-lg">
            Thoughtfully crafted with nature&apos;s finest ingredients to bring
            warmth, wellness, and mindful rituals to your everyday life.
          </p>
        </div>

        <div className="relative z-10 mt-8 h-[430px] w-full sm:mt-10 sm:h-[540px] lg:h-[610px]">
          <Swiper
            modules={[A11y]}
            onSwiper={setSwiper}
            className="h-full w-full"
            slidesPerView={1}
            spaceBetween={12}
            speed={500}
            loop
            grabCursor
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 40 },
            }}
          >
            {PRODUCTS.map((product) => (
              <SwiperSlide
                key={product.slug}
                className="!flex items-center justify-center"
              >
                <article className="flex h-[88%] w-full max-w-[330px] flex-col items-center justify-center">
                  <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full select-none object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.2)]"
                      draggable={false}
                    />
                  </div>
                  <h2 className="mt-4 text-center text-base font-medium uppercase tracking-wide text-[#222820] sm:text-lg">
                    {product.name}
                  </h2>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            aria-label="Previous product"
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#52653b] bg-white/90 text-2xl text-[#52653b] shadow-md transition hover:bg-[#52653b] hover:text-white sm:left-6"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            aria-label="Next product"
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#52653b] bg-white/90 text-2xl text-[#52653b] shadow-md transition hover:bg-[#52653b] hover:text-white sm:right-6"
          >
            →
          </button>
        </div>

        <div className="relative z-10 mx-auto -mt-3 pb-14 sm:mt-0">
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center border border-[#52653b] px-10 font-basker text-lg text-[#3f5130] transition-colors hover:bg-[#52653b] hover:text-white"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  );
}
