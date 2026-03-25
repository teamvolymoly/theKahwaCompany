"use client";
import CircularGallery from "@/components/CircularGallery";
import React from "react";

const page = () => {
  return (
    <>
      <div style={{ height: "600px", position: "relative" }}>
        <CircularGallery
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollSpeed={2.5}
          scrollEase={0.07}
        />
      </div>
    </>
  );
};

export default page;
