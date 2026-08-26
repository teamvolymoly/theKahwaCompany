"use client";

import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, FreeMode, Keyboard } from "swiper/modules";
import ShopNowButton from "@/components/ShopNowButton";
import Link from "next/link";
import { apiFetch } from "@/utils/api";

import "swiper/css";
import "swiper/css/free-mode";

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
    slug: "kashmiri-kahwa",
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
      className="relative isolate flex min-h-[760px] w-full flex-col items-center justify-start bg-cover bg-center sm:min-h-[900px] md:min-h-[1000px] lg:min-h-[1120px] xl:min-h-[1240px]"
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
          className="relative mt-8 h-[440px] max-h-[980px] w-full overflow-hidden bg-gradient-to-t from-white via-white/70 to-transparent sm:h-[560px] md:h-[680px] lg:h-[800px] xl:h-[900px]"
          aria-label="Product carousel"
        >
          <Swiper
            modules={[A11y, FreeMode, Keyboard]}
            className="h-full w-full"
            slidesPerView={1.5}
            spaceBetween={8}
            centeredSlides
            loop={sliderItems.length > 1}
            loopAdditionalSlides={sliderItems.length}
            grabCursor
            freeMode={{
              enabled: true,
              momentum: true,
              momentumRatio: 0.7,
              sticky: true,
            }}
            keyboard={{ enabled: true }}
            speed={400}
            slideToClickedSlide
            breakpoints={{
              640: { slidesPerView: 2.2, spaceBetween: 16 },
              768: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {sliderItems.map((item, index) => (
              <SwiperSlide
                key={`${item.slug || item.text}-${index}`}
                className="!flex items-start justify-center pt-6 transition-[scale,opacity] duration-500 ease-out [&.swiper-slide-active]:scale-105 [&:not(.swiper-slide-active)]:scale-90 [&:not(.swiper-slide-active)]:opacity-80 sm:pt-8 md:pt-10"
              >
                <article
                  className="flex h-[78%] max-w-full aspect-[3/4] flex-col items-center justify-end"
                  aria-label={item.text}
                >
                  <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.text}
                      className="max-h-full max-w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
                      draggable={false}
                    />
                  </div>
                  <p className="mb-1 mt-1 text-center text-md font-medium uppercase tracking-wide text-black opacity-80 md:text-xl">
                    {item.text}
                  </p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      ) : (
        <div className="mt-8 flex h-[440px] w-full items-center justify-center text-md text-black/60 sm:h-[560px] md:h-[680px] lg:h-[800px] xl:h-[900px]">
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
