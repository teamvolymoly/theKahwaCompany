"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ShopNowButton from "@/components/ShopNowButton";

const items = [
  { image: "/products/tin/BLTIN1.png", text: "Blue Lotus" },
  { image: "/products/tin/HLTIN1.png", text: "Honey Lemon" },
  { image: "/products/tin/OTTIN1.png", text: "Orange Tulsi" },
  { image: "/products/tin/KLTIN1.png", text: "Kashmiri Lavender" },
  { image: "/products/tin/MLTIN1.png", text: "Mint Lemongrass" },
];

export default function AnimGsapPage() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const metricsRef = useRef({
    width: 0,
    height: 0,
    cardWidth: 0,
    cardHeight: 0,
    gap: 0,
    step: 0,
    total: 0,
  });
  const offsetRef = useRef(0);
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startOffset: 0,
    velocity: 0,
    lastX: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardsRef.current;
    if (!container || !cards.length) return;

    const setup = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const gap = width < 640 ? 18 : width < 1024 ? 24 : 32;
      const cardWidth = Math.max(220, (width - gap * 2) / 3);
      const cardHeight = cardWidth * 1.35;
      const step = cardWidth + gap;
      const total = cards.length * step;

      metricsRef.current = {
        width,
        height,
        cardWidth,
        cardHeight,
        gap,
        step,
        total,
      };

      cards.forEach((card, i) => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        card.dataset.baseX = String(i * step);
      });
    };

    setup();
    const onResize = () => setup();
    window.addEventListener("resize", onResize);

    const speed = 0.6; // px per tick
    const update = () => {
      const { width, cardWidth, step, total } = metricsRef.current;
      if (!total) return;
      if (!dragRef.current.isDown) {
        offsetRef.current = (offsetRef.current + speed) % total;
        dragRef.current.velocity *= 0.95;
        if (Math.abs(dragRef.current.velocity) > 0.01) {
          offsetRef.current =
            (offsetRef.current + dragRef.current.velocity) % total;
        }
      }
      const center = width / 2;
      const curveDepth = Math.min(80, width * 0.08);
      const maxRotate = 8;

      cards.forEach((card) => {
        const baseX = Number(card.dataset.baseX || 0);
        let x = baseX - offsetRef.current;
        if (x < -step) x += total;
        if (x > total - step) x -= total;

        const mid = x + cardWidth / 2;
        const dist = (mid - center) / center;
        const curve = -curveDepth * (1 - Math.min(1, Math.abs(dist))) ** 2;
        const rotate = dist * maxRotate;
        const scale = 1 - Math.min(0.18, Math.abs(dist) * 0.12);

        gsap.set(card, {
          x,
          y: curve,
          rotation: rotate,
          scale,
          transformOrigin: "center center",
        });
      });
    };

    gsap.ticker.add(update);

    const onPointerDown = (e) => {
      dragRef.current.isDown = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.lastX = e.clientX;
      dragRef.current.startOffset = offsetRef.current;
      container.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e) => {
      if (!dragRef.current.isDown) return;
      const dx = e.clientX - dragRef.current.startX;
      offsetRef.current = dragRef.current.startOffset - dx;
      dragRef.current.velocity = dragRef.current.lastX - e.clientX;
      dragRef.current.lastX = e.clientX;
    };
    const onPointerUp = () => {
      dragRef.current.isDown = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerUp);
    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerUp);
    };
  }, []);

  const galleryItems = [...items, ...items];

  return (
    <div
      className="relative w-full min-h-screen bg-center bg-cover flex flex-col justify-end items-center gap-4"
      style={{
        backgroundImage: "url('/bg/beautiful-view-mountains-sunny-day.jpg')",
      }}
    >
      <div className="text-center mt-10 flex flex-col gap-4 max-w-3xl">
        <div className="font-(family-name:--font-basker) uppercase text-5xl mt-10 mb-10">
          <h2 className="mb-2">Where tradition</h2>
          <h2>meets imagination</h2>
        </div>
        <p className="font-thin text-xl">
          Experience a Magical variety of Kahwa with different flavor and and
          contribute to a social cause
        </p>
      </div>

      <section
        ref={containerRef}
        className="relative w-full bg-gradient-to-t from-white to-transparent h-[60vh] min-h-[420px] sm:h-[62vh] md:h-[65vh] lg:h-[125vh] 2xl:h-[72vh] overflow-hidden"
      >
        <div
          ref={trackRef}
          className="absolute left-0 top-1/2 -translate-y-1/2"
        >
          {galleryItems.map((item, i) => (
            <article
              key={`${item.text}-${i}`}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-end"
            >
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={item.image}
                  alt={item.text}
                  className="max-h-full max-w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
                />
              </div>
              <div className="mt-6">
                <ShopNowButton />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
