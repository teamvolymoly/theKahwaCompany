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
  // FIX 1: Store draggable instance in a ref so it persists across re-renders
  const draggableRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(Draggable);

    const container = containerRef.current;
    const track = trackRef.current;
    const proxy = proxyRef.current;

    if (!container || !track || !proxy) return;

    const setup = () => {
      const cards = cardsRef.current.filter(Boolean); // FIX 4: filter out stale/null refs
      if (!cards.length) return;

      const width = container.clientWidth;
      const gap = width < 640 ? 16 : width < 1024 ? 22 : 28;
      const cardWidth = Math.max(180, (width - gap * 2) / 3.5);
      const cardHeight = cardWidth * 1.35;
      const angleStep = 12;
      const radians = (angleStep * Math.PI) / 180;
      const radius = (cardWidth + gap) / (2 * Math.sin(radians / 2));

      // FIX 5: Ensure track has position relative for absolute children
      gsap.set(track, { position: "relative" });

      cards.forEach((card, i) => {
        gsap.set(card, {
          width: cardWidth,
          height: cardHeight,
          rotation: -i * angleStep,
          x: -radius,
          // transformOrigin points to the center of the imaginary circle
          transformOrigin: `${radius}px center`,
        });
      });

      // FIX 3: Remove xPercent/yPercent from gsap.set — centering is handled by
      // Tailwind's left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 classes.
      // Only restore rotation from proxy so position isn't reset on resize.
      const currentRotation = draggableRef.current
        ? draggableRef.current.rotation // FIX 1: use draggable.rotation, not proxy._rotation
        : 0;
      gsap.set(track, { rotation: currentRotation });

      // Kill previous draggable before creating a new one
      if (draggableRef.current) {
        draggableRef.current.kill();
        draggableRef.current = null;
      }

      // FIX 6: Allow rotation in BOTH directions — positive maxRotation so right drag works
      draggableRef.current = Draggable.create(proxy, {
        type: "rotation",
        inertia: false,
        bounds: {
          minRotation: -(angleStep * (items.length - 1)), // -48
          maxRotation: 0,
        },
        // FIX 2: Use draggable.rotation (accessed via 'this' inside callbacks)
        onDrag() {
          gsap.set(track, { rotation: this.rotation });
        },
        onRelease() {
          const snap = gsap.utils.snap(angleStep);
          const target = snap(this.rotation);
          const self = this; // capture 'this' for onUpdate closure

          gsap.to(proxy, {
            rotation: target,
            duration: 0.5,
            ease: "power3.out",
            onUpdate() {
              // FIX 2: read rotation from the draggable instance, not proxy._rotation
              gsap.set(track, { rotation: self.rotation });
            },
          });
        },
      })[0];
    };

    setup();

    const handleResize = () => setup();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // FIX 4: Clean up draggable on unmount
      if (draggableRef.current) {
        draggableRef.current.kill();
        draggableRef.current = null;
      }
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
          Experience a Magical variety of Kahwa with different flavor and
          contribute to a social cause
        </p>
      </div>

      <section
        ref={containerRef}
        className="relative w-full bg-gradient-to-t from-white to-transparent h-[60vh] min-h-[420px] sm:h-[62vh] md:h-[65vh] lg:h-[70vh] 2xl:h-[72vh]"
      >
        {/* Hidden proxy div — Draggable attaches rotation tracking here */}
        <div ref={proxyRef} className="hidden" />

        {/* FIX 3: Keep centering ONLY via Tailwind — no gsap.set xPercent/yPercent */}
        <div
          ref={trackRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {items.map((item, i) => (
            <article
              key={`${item.text}-${i}`}
              ref={(el) => {
                cardsRef.current[i] = el; // FIX 4: straightforward ref assignment
              }}
              // FIX 5: absolute + left-0 needs the parent (track) to have position:relative
              className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-end"
            >
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={item.image}
                  alt={item.text}
                  className="max-h-full max-w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
                  draggable={false} // prevent native drag interfering with GSAP Draggable
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
