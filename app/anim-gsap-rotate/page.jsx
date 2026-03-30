"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import ShopNowButton from "@/components/ShopNowButton";

const items = [
  { image: "/products/tin/BLTIN1.png", text: "Blue Lotus" },
  { image: "/products/tin/HLTIN1.png", text: "Honey Lemon" },
  { image: "/products/tin/OTTIN1.png", text: "Orange Tulsi" },
  { image: "/products/tin/KLTIN1.png", text: "Kashmiri Lavender" },
  { image: "/products/tin/MLTIN1.png", text: "Mint Lemongrass" },
];

export default function AnimGsapRotatePage() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const proxyRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(Draggable);
    const container = containerRef.current;
    const track = trackRef.current;
    const cards = cardsRef.current;
    const proxy = proxyRef.current;
    if (!container || !track || !cards.length || !proxy) return;

    let draggable;
    const setup = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const gap = width < 640 ? 16 : width < 1024 ? 22 : 28;
      const cardWidth = Math.max(200, (width - gap * 2) / 3);
      const cardHeight = cardWidth * 1.35;
      const angleStep = 12;
      const radians = (angleStep * Math.PI) / 180;
      const radius = (cardWidth + gap) / (2 * Math.sin(radians / 2));

      cards.forEach((card, i) => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        const angle = i * angleStep;
        // Flip curve direction by mirroring the rotation/transform origin.
        gsap.set(card, {
          rotation: -angle,
          x: -radius,
          transformOrigin: `${radius}px center`,
        });
      });

      gsap.set(track, {
        xPercent: -50,
        yPercent: -50,
        rotation: proxy._rotation || 0,
      });

      if (draggable) draggable.kill();
      draggable = Draggable.create(proxy, {
        type: "rotation",
        inertia: false,
        bounds: {
          minRotation: -(angleStep * (items.length - 1)),
          maxRotation: 0,
        },
        onDrag: () => {
          gsap.set(track, { rotation: proxy._rotation || 0 });
        },
        onRelease: () => {
          const snap = gsap.utils.snap(angleStep);
          const target = snap(proxy._rotation || 0);
          gsap.to(proxy, {
            rotation: target,
            duration: 0.5,
            ease: "power3.out",
            onUpdate: () => {
              gsap.set(track, { rotation: proxy._rotation || 0 });
            },
          });
        },
      })[0];
    };

    setup();
    window.addEventListener("resize", setup);
    return () => {
      window.removeEventListener("resize", setup);
      if (draggable) draggable.kill();
    };
  }, []);

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
        className="relative w-full bg-gradient-to-t from-white to-transparent h-[60vh] min-h-[420px] sm:h-[62vh] md:h-[65vh] lg:h-[70vh] 2xl:h-[72vh] "
      >
        <div ref={proxyRef} className="hidden" />
        <div
          ref={trackRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {items.map((item, i) => (
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
