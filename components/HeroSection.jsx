"use client";

import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, EffectCoverflow, Keyboard } from "swiper/modules";
import ShopNowButton from "@/components/ShopNowButton";
import Link from "next/link";
import { apiFetch } from "@/utils/api";

import "swiper/css";
import "swiper/css/effect-coverflow";

import styles from "./HeroSection.module.css";

const FALLBACK_ITEMS = [
  {
    image: "/products/tin/KLTIN1.png",
    text: "Kashmiri Kahwa",
    slug: "kashmiri-kahwa",
  },
  {
    image: "/products/tin/HLTIN1.png",
    text: "Hibiscus Kahwa",
    slug: "hibiscus-kahwa",
  },
  {
    image: "/products/tin/BLTIN1.png",
    text: "Blue Kahwa",
    slug: "blue-kahwa",
  },
  {
    image: "/products/tin/OTTIN1.png",
    text: "Oolong Kahwa",
    slug: "oolong-kahwa",
  },
  { image: "/products/tin/MLTIN1.png", text: "Mint Kahwa", slug: "mint-kahwa" },
];

export default function HeroSection() {
  const [items, setItems] = useState(FALLBACK_ITEMS);
  const [apiReady, setApiReady] = useState(false);

  // Centered loop mode needs a healthy slide buffer in both directions,
  // especially when desktop displays almost four slides at once.
  const sliderItems = useMemo(() => {
    if (items.length < 2 || items.length >= 10) return items;
    return Array.from(
      { length: Math.ceil(10 / items.length) },
      () => items,
    ).flat();
  }, [items]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setApiReady(false);
      try {
        const data = await apiFetch("/home/hero-sections");
        // const data = null; // TODO: remove after testing
        const mapped = (Array.isArray(data) ? data : [])
          .filter((item) => item?.status !== false)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((item) => ({
            image: item.product_image_url,
            text: item.product_name,
            slug: item.product_slug,
          }));
        if (active && mapped.length) {
          setItems(mapped);
          setApiReady(true);
          return;
        }
      } catch {
        // keep fallback
      }
      if (active) {
        setItems(FALLBACK_ITEMS);
        setApiReady(true);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div
      className={`${styles.hero} relative isolate flex min-h-[760px] w-full flex-col items-center justify-start bg-cover bg-center sm:min-h-[900px] md:min-h-[1000px] lg:min-h-[1120px] xl:min-h-[1240px]`}
      style={{
        backgroundImage: "url('/bg/beautiful-view-mountains-sunny-day.png')",
      }}
    >
      {/* Hero text */}
      <div className="relative z-10 mt-24 flex max-w-4xl flex-col px-4 text-center sm:mt-28 md:mt-32 lg:mt-[150px]">
        <div className="font-(family-name:--font-basker) text-3xl uppercase leading-[1.18] text-[#1c2230] drop-shadow-sm sm:text-4xl lg:text-[40px]">
          <h2>Discover a blend of</h2>
          <h2>botanicals and tradition</h2>
        </div>
        <p className="mt-5 text-lg font-thin leading-[1.35] text-black/80 sm:mt-6 sm:text-xl">
          Thoughtfully crafted with nature&apos;s finest ingredients to bring
          warmth,
          <span className="mt-0 md:block">
            {" "}
            wellness, and mindful rituals to your everyday life.
          </span>
        </p>
      </div>{" "}
      {/* Carousel */}
      {apiReady ? (
        <section
          className={styles.sliderSection}
          aria-label="Product carousel"
        >
          <Swiper
            modules={[A11y, EffectCoverflow, Keyboard]}
            className={styles.slider}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop={sliderItems.length > 1}
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
            {sliderItems.map((item, index) => (
              <SwiperSlide
                key={`${item.slug || item.text}-${index}`}
                className={styles.slide}
              >
                <article
                  className={styles.productCard}
                  aria-label={item.text}
                >
                  <div className={styles.imageFrame}>
                    <img
                      src={item.image}
                      alt={item.text}
                      className={styles.productImage}
                      draggable={false}
                    />
                  </div>
                  <p className={styles.productName}>
                    {item.text}
                  </p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      ) : (
        <div className={styles.loadingState}>
          Loading hero...
        </div>
      )}
      <div className="relative z-10 mb-12 -mt-10 md:absolute md:bottom-[104px] md:mb-0 md:mt-0 lg:bottom-[144px] xl:bottom-[144px]">
        <Link href="/shop" className="cursor-pointer">
          <ShopNowButton className="cursor-pointer" />
        </Link>
      </div>
    </div>
  );
}
