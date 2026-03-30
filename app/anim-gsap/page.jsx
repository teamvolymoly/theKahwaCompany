"use client";

import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import ShopNowButton from "@/components/ShopNowButton";
import Link from "next/link";

const ITEMS = [
  { image: "/products/tin/BLTIN1.png", text: "Blue Lotus" },
  { image: "/products/tin/HLTIN1.png", text: "Honey Lemon" },
  { image: "/products/tin/OTTIN1.png", text: "Orange Tulsi" },
  { image: "/products/tin/KLTIN1.png", text: "Kashmiri Lavender" },
  { image: "/products/tin/MLTIN1.png", text: "Mint Lemongrass" },
];

// Triple-clone for seamless infinite loop
const GALLERY_ITEMS = [...ITEMS, ...ITEMS, ...ITEMS];
const COUNT = GALLERY_ITEMS.length;

export default function AnimGsapPage() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const stateRef = useRef({
    offset: 0,
    step: 0,
    total: 0,
    cardWidth: 0,
    containerWidth: 0,
    drag: { isDown: false, startX: 0, startOffset: 0, velocity: 0, lastX: 0 },
    basePositions: [],
  });

  const galleryItems = useMemo(() => GALLERY_ITEMS, []);

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!container || cards.length !== COUNT) return;

    cards.forEach((card) => {
      card.style.willChange = "transform";
    });

    // 🔥 COMPUTE LAYOUT
    const compute = () => {
      const W = container.clientWidth;

      const outerGap = W < 640 ? 8 : W < 1024 ? 12 : 16;
      const innerGap = W < 640 ? 4 : W < 1024 ? 8 : 12;

      // ✅ Better scaling for large screens
      const cardsVisible =
        W < 640 ? 1.5 : W < 1024 ? 2.5 : W < 1440 ? 3 : W < 1920 ? 4 : 5;

      const maxCardWidth = 320;

      const rawCardWidth =
        (W - outerGap * 2 - innerGap * (cardsVisible - 1)) / cardsVisible;

      const cardWidth = Math.min(rawCardWidth, maxCardWidth);

      const step = cardWidth + innerGap;
      const total = COUNT * step;

      const centerSet = ITEMS.length;

      // ✅ Fixed centering
      const centreOffset = centerSet * step - (W - cardWidth) / 2;

      const state = stateRef.current;
      state.cardWidth = cardWidth;
      state.step = step;
      state.total = total;
      state.containerWidth = W;
      state.offset = centreOffset;

      state.basePositions = cards.map((_, i) => i * step);

      cards.forEach((card) => {
        card.style.width = `${cardWidth}px`;
      });
    };

    compute();

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(compute, 60);
    };

    window.addEventListener("resize", onResize);

    // 🔥 GSAP TICKER
    const FRICTION = 0.93;

    const tick = () => {
      const state = stateRef.current;
      const { step, total, cardWidth, containerWidth, drag, basePositions } =
        state;

      if (!total) return;

      if (!drag.isDown) {
        state.offset += drag.velocity;
        drag.velocity *= FRICTION;
        if (Math.abs(drag.velocity) < 0.01) drag.velocity = 0;
      }

      state.offset = ((state.offset % total) + total) % total;

      const center = containerWidth / 2;

      // ✅ Curve based on card size (not screen)
      const CURVE_DEPTH = Math.min(60, cardWidth * 0.25);

      const MAX_ROTATE = 5;
      const MAX_SCALE_LOSS = 0.12;

      for (let i = 0; i < COUNT; i++) {
        const card = cards[i];

        let x = basePositions[i] - state.offset;

        if (x < -step) x += total;
        else if (x > total - step) x -= total;

        const mid = x + cardWidth / 2;
        const dist = (mid - center) / center;
        const absDist = Math.abs(dist);

        const t = Math.max(0, 1 - absDist * 0.9);
        const y = -CURVE_DEPTH * t * t;

        const rotation = dist * MAX_ROTATE;
        const scale = 1 - Math.min(MAX_SCALE_LOSS, absDist * 0.1);

        gsap.set(card, {
          x,
          y,
          rotation,
          scale,
          transformOrigin: "50% 100%",
        });
      }
    };

    gsap.ticker.add(tick);

    // 🔥 DRAG
    const onPointerDown = (e) => {
      const drag = stateRef.current.drag;
      drag.isDown = true;
      drag.startX = e.clientX;
      drag.lastX = e.clientX;
      drag.startOffset = stateRef.current.offset;
      drag.velocity = 0;
      container.setPointerCapture(e.pointerId);
      container.style.cursor = "grabbing";
    };

    const onPointerMove = (e) => {
      const drag = stateRef.current.drag;
      if (!drag.isDown) return;

      const dx = e.clientX - drag.startX;
      stateRef.current.offset = drag.startOffset - dx;

      drag.velocity = drag.lastX - e.clientX;
      drag.lastX = e.clientX;
    };

    const onPointerUp = () => {
      stateRef.current.drag.isDown = false;
      container.style.cursor = "grab";
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    container.style.cursor = "grab";

    return () => {
      gsap.ticker.remove(tick);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);

      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);

      cards.forEach((card) => (card.style.willChange = "auto"));
    };
  }, []);

  return (
    <div
      className="relative w-full min-h-screen lg:max-h-[1080px]  bg-center bg-cover flex flex-col justify-end items-center gap-4"
      style={{
        backgroundImage: "url('/bg/beautiful-view-mountains-sunny-day.jpg')",
      }}
    >
      {/* Hero */}
      <div className="text-center mt-34 flex flex-col gap-4 max-w-3xl px-4">
        <div className="uppercase text-4xl md:text-5xl mt-10 mb-10">
          <h2 className="mb-2">Where tradition</h2>
          <h2>meets imagination</h2>
        </div>

        <p className="font-thin text-xl">
          Experience a Magical variety of Kahwa with different flavors
        </p>
      </div>

      {/* Carousel */}
      <section
        ref={containerRef}
        className="
          relative w-full max-w-[1600px] mx-auto
          overflow-hidden select-none touch-pan-y
          bg-gradient-to-t from-white to-transparent
          h-[600px] md:h-[700px] lg:h-[800px]
        "
      >
        {galleryItems.map((item, i) => (
          <article
            key={`${item.text}-${i}`}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
            className="
              absolute left-0
              top-1/2 -translate-y-1/2
              flex flex-col items-center justify-end
              aspect-[3/4]
            "
          >
            <div className="flex h-full w-full items-center justify-center">
              <img
                src={item.image}
                alt={item.text}
                className="max-h-full max-w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
                draggable={false}
              />
            </div>

            <p className="mt-2 mb-1 text-sm font-medium opacity-80">
              {item.text}
            </p>

            <Link href="#">
              <ShopNowButton />
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
