"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, EffectCoverflow, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

import styles from "./test-hero-slider.module.css";

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

const LOOP_PRODUCTS = [...PRODUCTS, ...PRODUCTS];

export default function TestHeroPage() {
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

        <div className={styles.sliderSection}>
          <Swiper
            modules={[A11y, EffectCoverflow, Keyboard]}
            className={styles.slider}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop
            loopAdditionalSlides={2}
            keyboard={{ enabled: true, onlyInViewport: true }}
            a11y={{
              enabled: true,
              prevSlideMessage: "Show previous Kahwa",
              nextSlideMessage: "Show next Kahwa",
              slideLabelMessage: "{{index}} of {{slidesLength}}",
            }}
            slideToClickedSlide
            slidesPerView={1.35}
            spaceBetween={24}
            breakpoints={{
              640: { slidesPerView: 2.2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 110,
              modifier: 1.35,
              slideShadows: false,
            }}
            speed={700}
          >
            {LOOP_PRODUCTS.map((product, index) => (
              <SwiperSlide
                key={`${product.slug}-${index}`}
                className={styles.slide}
              >
                <article className={styles.productCard}>
                  <div className={styles.imageFrame}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                      draggable={false}
                    />
                  </div>
                  <h2 className={styles.productName}>
                    {product.name}
                  </h2>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
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
