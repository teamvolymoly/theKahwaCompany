"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import gsap from "gsap";
import ShopNowButton from "@/components/ShopNowButton";
import Link from "next/link";
import { apiFetch } from "@/utils/api";

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
  const [readyTick, setReadyTick] = useState(0);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const prefersReducedMotion = useRef(false);
  const snapTweenRef = useRef(null);
  const snapTimerRef = useRef(null);
  const snapIntervalRef = useRef(null);

  // Stable mutable refs — no re-renders on change
  const stateRef = useRef({
    offset: 0,
    step: 0,
    total: 0,
    cardWidth: 0,
    containerWidth: 0,
    drag: { isDown: false, startX: 0, startOffset: 0, velocity: 0, lastX: 0 },
    // Cache base positions to avoid per-frame calculation
    basePositions: /** @type {number[]} */ ([]),
  });

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

  // Triple-clone for seamless infinite loop (prev | real | next)
  const galleryItems = useMemo(() => [...items, ...items, ...items], [items]);
  const count = galleryItems.length;

  useEffect(() => {
    cardsRef.current = Array.from({ length: count }, () => null);
  }, [count]);

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardsRef.current.filter(Boolean).slice(0, count);
    if (!apiReady || !container || cards.length !== count) {
      const id = requestAnimationFrame(() =>
        setReadyTick((tick) => tick + 1),
      );
      return () => cancelAnimationFrame(id);
    }

    prefersReducedMotion.current = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;

    // --- Promote all cards to their own GPU layer once ---
    cards.forEach((card) => {
      card.style.willChange = "transform";
    });

    // ─── Metrics ────────────────────────────────────────────────────────────
    const compute = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      // Control outer padding and inner spacing separately for tighter layout
      const outerGap = W < 640 ? 4 : W < 1024 ? 8 : 12;
      const innerGap = W < 640 ? 1 : W < 1024 ? 4 : 6;

      // Responsive visible cards:
      // - small: 1.5 cards
      // - medium: 2.5 cards
      // - large+: ~3.2 cards (slightly smaller cards to prevent bottom overflow)
      const cardsVisible = W < 640 ? 1.5 : W < 1024 ? 2.5 : W < 1280 ? 3 : 3.6;

      const baseCardWidth =
        (W - outerGap * 2 - innerGap * (cardsVisible - 1)) / cardsVisible;
      // Cap card height so the carousel never overflows on large screens
      const maxCardHeight = H * 0.78;
      const maxCardWidth = maxCardHeight * (3 / 4); // aspect-[3/4]
      const cardWidth = Math.min(baseCardWidth, maxCardWidth);
      const positionScale = W < 640 ? 0.93 : W < 1024 ? 0.95 : 0.96;
      const step = (cardWidth + innerGap) * positionScale;
      const total = count * step;

      // Seed offset so the real (middle) set is centred on screen
      const centerSet = items.length; // index of first "real" item
      const centreOffset = centerSet * step - (W / 2 - cardWidth / 2);

      const state = stateRef.current;
      state.drag.velocity = 0;
      state.drag.isDown = false;
      state.cardWidth = cardWidth;
      state.step = step;
      state.total = total;
      state.containerWidth = W;
      state.offset = centreOffset;

      // Pre-compute base X for each card (never changes after resize)
      state.basePositions = cards.map((_, i) => i * step);

      // Set card dimensions via CSS only — no JS height calculation
      cards.forEach((card) => {
        card.style.width = `${cardWidth}px`;
      });
    };

    compute();

    // Debounce resize to avoid thrashing
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(compute, 60);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ─── Ticker ──────────────────────────────────────────────────────────────
    const FRICTION = 0.93;

    const snapToNearest = () => {
      const state = stateRef.current;
      const { step, total, cardWidth, containerWidth } = state;
      if (!step || !total) return;
      const center = containerWidth / 2;
      const rawIndex = Math.round(
        (state.offset + center - cardWidth / 2) / step,
      );
      const targetBase = rawIndex * step;
      let targetOffset = targetBase + cardWidth / 2 - center;
      targetOffset = ((targetOffset % total) + total) % total;

      snapTweenRef.current?.kill();
      snapTweenRef.current = gsap.to(state, {
        offset: targetOffset,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          snapTweenRef.current = null;
          state.drag.velocity = 0;
        },
      });
    };

    const tick = () => {
      const state = stateRef.current;
      const { step, total, cardWidth, containerWidth, drag, basePositions } =
        state;
      if (!total) return;

      // Auto-scroll + inertia when not dragging
      if (!drag.isDown) {
        state.offset += drag.velocity;
        drag.velocity *= FRICTION;
        if (Math.abs(drag.velocity) < 0.01) drag.velocity = 0;
        // Let inertia breathe; snapping is handled after pointer up
      }

      // Keep offset in [0, total) — modulo wrapping
      state.offset = ((state.offset % total) + total) % total;

      const center = containerWidth / 2;
      const CURVE_DEPTH = Math.min(80, containerWidth * 0.07);
      const MAX_ROTATE = 25;
      const MAX_SCALE_LOSS = 0.16;

      for (let i = 0; i < count; i++) {
        const card = cards[i];
        // Shift raw base position by current offset
        let x = basePositions[i] - state.offset;

        // Wrap into the visible window ±1 full set
        if (x < -step) x += total;
        else if (x > total - step) x -= total;

        const mid = x + cardWidth / 2;
        const dist = (mid - center) / center; // -1 … 1 (rough)
        const absDist = Math.abs(dist);

        // Smooth parabolic curve: deepest at centre, flat at edges
        const t = Math.max(0, 1 - absDist * 0.9);
        const y = -CURVE_DEPTH * t * t;
        const rotation =
          dist * MAX_ROTATE * (1 + 0.6 * Math.max(0, 1 - absDist));
        const scale = 1 - Math.min(MAX_SCALE_LOSS, absDist * 0.1);

        // Single gsap.set call per card per frame — minimal overhead
        gsap.set(card, {
          x,
          y,
          rotation,
          scale,
          transformOrigin: "50% 100%", // rotate from bottom for natural arc
        });
      }
    };

    if (!prefersReducedMotion.current) {
      gsap.ticker.add(tick);
    } else {
      tick();
    }

    // ─── Drag ────────────────────────────────────────────────────────────────
    const onPointerDown = (e) => {
      const drag = stateRef.current.drag;
      snapTweenRef.current?.kill();
      snapTweenRef.current = null;
      clearTimeout(snapTimerRef.current);
      clearInterval(snapIntervalRef.current);
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
      if (!prefersReducedMotion.current) {
        clearTimeout(snapTimerRef.current);
        clearInterval(snapIntervalRef.current);
        snapTimerRef.current = setTimeout(() => {
          let checks = 0;
          snapIntervalRef.current = setInterval(() => {
            const { velocity, isDown } = stateRef.current.drag;
            if (isDown) {
              clearInterval(snapIntervalRef.current);
              return;
            }
            if (Math.abs(velocity) < 0.2) {
              clearInterval(snapIntervalRef.current);
              snapToNearest();
            }
            checks += 1;
            if (checks > 12) {
              clearInterval(snapIntervalRef.current);
            }
          }, 80);
        }, 220);
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    container.style.cursor = "grab";

    return () => {
      snapTweenRef.current?.kill();
      snapTweenRef.current = null;
      clearTimeout(snapTimerRef.current);
      clearInterval(snapIntervalRef.current);
      if (!prefersReducedMotion.current) {
        gsap.ticker.remove(tick);
      }
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      cards.forEach((card) => (card.style.willChange = "auto"));
    };
  }, [count, items.length, readyTick, apiReady]);

  const nudge = (dir) => {
    const state = stateRef.current;
    if (!state.step) return;
    state.offset += dir * state.step;
    state.drag.velocity = dir * 6;
  };

  return (
    <div
      className="relative w-full min-h-[680px] md:min-h-[820px] lg:min-h-[980px] xl:min-h-[1080px] bg-center bg-cover flex flex-col justify-end items-center gap-4"
      style={{
        backgroundImage: "url('/bg/beautiful-view-mountains-sunny-day.png')",
      }}
    >
      {/* Hero text */}
      <div className="relative z-10 text-center mt-20 sm:mt-24 lg:mt-28 flex flex-col gap-4 max-w-3xl px-4">
        <div className="font-(family-name:--font-basker) uppercase text-3xl sm:text-4xl md:text-5xl mt-6 mb-6 text-[#1c2230] drop-shadow-sm">
          <h2 className="mb-2">Where tradition</h2>
          <h2>meets imagination</h2>
        </div>
        <p className="font-thin text-base sm:text-lg md:text-xl text-black/80">
          Experience a Magical variety of Kahwa with different flavors and
          contribute to a social cause
        </p>
      </div>      {/* Carousel */}
      {apiReady ? (
        <section
          ref={containerRef}
          className="
            relative w-full overflow-hidden select-none touch-pan-y
            bg-gradient-to-t from-white via-white/70 to-transparent
            h-[420px] sm:h-[520px] md:h-[640px] lg:h-[820px] xl:h-[980px] max-h-[1080px]
          "
          aria-label="Product carousel"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") nudge(1);
            if (e.key === "ArrowRight") nudge(-1);
          }}
        >
          {galleryItems.map((item, i) => (
            <article
              key={`${item.text}-${i}`}
              ref={(el) => {
                cardsRef.current[i] = el || null;
              }}
              className="
                absolute left-0
                top-1/2 -translate-y-1/2
                flex flex-col items-center justify-end
                /* aspect ratio driven by CSS ? no JS height */
                aspect-[3/4]
              "
              aria-label={item.text}
            >
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={item.image}
                  alt={item.text}
                  className="max-h-full max-w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
                  draggable={false}
                />
              </div>
              <p className="mt-1 mb-1 text-md md:text-xl text-black uppercase font-medium tracking-wide opacity-80">
                {item.text}
              </p>
            </article>
          ))}
        </section>
      ) : (
        <div className="h-[420px] sm:h-[520px] md:h-[640px] lg:h-[820px] xl:h-[980px] w-full flex items-center justify-center text-sm text-black/60">
          Loading hero...
        </div>
      )}

      <div className="absolute bottom-0 sm:bottom-0 md:bottom-10 lg:bottom-20 xl:bottom-30 z-10">
        <Link href="/shop" className="cursor-pointer">
          <ShopNowButton className="cursor-pointer" />
        </Link>
      </div>
    </div>
  );
}
