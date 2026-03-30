"use client";
import CircularGallery from "@/components/CircularGallery";
import ShopNowButton from "@/components/ShopNowButton";
import React from "react";

const page = () => {
  const galleryItems = [
    { image: "/products/tin/BLTIN1.png", text: "Blue Lotus" },
    { image: "/products/tin/HLTIN1.png", text: "Honey Lemon" },
    { image: "/products/tin/OTTIN1.png", text: "Orange Tulsi" },
    { image: "/products/tin/KLTIN1.png", text: "Kashmiri Lavender" },
    { image: "/products/tin/MLTIN1.png", text: "Mint Lemongrass" },
  ];

  return (
    <div
      className="relative w-full min-h-screen bg-center bg-cover flex flex-col justify-end items-center gap-4"
      style={{
        backgroundImage: "url('/bg/beautiful-view-mountains-sunny-day.jpg')",
      }}
    >
      <div className="text-center mt-35 flex flex-col gap-4 max-w-3xl">
        <div className="font-(family-name:--font-basker) uppercase text-5xl mt-10 mb-10">
          <h2 className="mb-2">Where tradition</h2>
          <h2>meets imagination</h2>
        </div>
        <p className="font-thin text-xl">
          Experience a Magical variety of Kahwa with different flavor and and
          contribute to a social cause{" "}
        </p>

        {/* <ShopNowButton /> */}
      </div>

      <div
        className="bg-gradient-to-t from-white to-transparent w-full"
        style={{
          height: "850px",
          position: "relative",
        }}
      >
        <CircularGallery
          items={galleryItems}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollSpeed={2.5}
          scrollEase={0.07}
          visibleItems={3}
          itemAspect={1.6}
          gap={1.6}
        />
      </div>
    </div>
  );
};

export default page;
