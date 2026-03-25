"use client";

import { Autoplay, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

export default function AddBar() {
  const messages = [
    "SUBSCRIBE & GET 15% OFF EVERY ORDER + FREE SHIPPING",
    "FREE SHIPPING on orders over GBP 25",
    "SUBSCRIBE & GET 15% OFF EVERY ORDER",
  ];

  return (
    <div className="bg-black text-white text-[10px] tracking-wide py-1 overflow-hidden sm:text-[11px] md:text-xs">
      <div className="container mx-auto px-3 sm:px-4">
        <Swiper
          modules={[Autoplay, A11y]}
          slidesPerView="auto"
          spaceBetween={60}
          loop={true}
          speed={8000} // controls scroll speed (higher = slower movement)
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          allowTouchMove={false}
          className="whitespace-nowrap"
        >
          {[...messages, ...messages].map((msg, i) => (
            <SwiperSlide key={i} className="!w-auto font-medium cursor-pointer">
              {msg}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
