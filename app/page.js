"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { apiFetch } from "@/utils/api";
import { normalizeBlogList } from "@/utils/blogs";
import {
  extractProductItems,
  normalizeProductListItem,
} from "@/utils/products";

const fallbackArticles = [
  {
    id: "hibiscus-guide",
    title: "Factors to Consider When Choosing Hibiscus Kahwa",
    excerpt:
      "Choosing the best chamomile tea comes down to eight key factors: ingredient quality, whole flowers over powder, organic where possible, and origin.",
    href: "/blogs",
    image: "/bg/TKC Website Images/Products Image.png",
  },
  {
    id: "kashmiri-immunity",
    title: "Immunity-Boosting Tea: Add To New Kashmiri Kahwa",
    excerpt:
      "Discover a comforting blend with aromatic botanicals and traditional spices, crafted for a mindful everyday ritual.",
    href: "/blogs",
    image: "/bg/TKC Website Images/Kashmiri Image.png",
  },
  {
    id: "hibiscus-factors",
    title: "Factors to Consider When Choosing Hibiscus Kahwa",
    excerpt:
      "Learn how ingredients, freshness, aroma, and careful small-batch blending shape a beautifully balanced cup.",
    href: "/blogs",
    image: "/bg/TKC Website Images/Hibiscus Image.png",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [blogPosts, setBlogPosts] = useState(fallbackArticles);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await apiFetch("/products?limit=8");
        const items = extractProductItems(data);
        if (active) setProducts(items.map(normalizeProductListItem));
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoadingProducts(false);
      }
    };

    const loadBlogs = async () => {
      try {
        const data = await apiFetch("/home/blogs");
        const items = normalizeBlogList(data).slice(0, 3);
        if (active && items.length) setBlogPosts(items);
      } catch {
        // The designed fallback articles remain visible when the API is unavailable.
      }
    };

    loadProducts();
    loadBlogs();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="bg-white text-[#20251d]">
      <HeroSection />

      <section
        className="pt-28 sm:pt-36 lg:pt-40"
        aria-labelledby="blends-title"
      >
        <div className="site-container">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2
              id="blends-title"
              className="font-(family-name:--font-basker) text-4xl uppercase leading-none tracking-[0.01em] text-[#252a22]"
            >
              Must Have Blends
            </h2>
            <div className="mb-0.5 flex items-center justify-center gap-2">
              <Link
                href="/shop"
                className="text-md font-medium text-[#586f34] hover:underline  underline-offset-3 sm:text-base"
              >
                View all Blends
              </Link>
              <img
                src="/icons/VectorRight.svg"
                alt=""
                className="h-3.5 w-2 object-contain"
              />
            </div>
          </div>

          <Link
            href="/shop"
            aria-label="Discover our must-have Kahwa blends"
            className="group relative block h-[220px] overflow-hidden rounded-md sm:h-auto sm:aspect-[4.25/1]"
          >
            <img
              src="/bg/banner.png"
              alt=""
              className="block h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 flex items-center px-5 sm:px-8 lg:px-12">
              <div className="max-w-[430px] text-[#393735]">
                <h3 className="text-2xl font-bold leading-[1.08] sm:text-3xl lg:text-[32px]">
                  Exquisite Taste,
                  <span className="block">Refreshing Blends.</span>
                </h3>
                <p className="mt-2 text-base text-[#6f6965]">
                  Traditional Kahwa Blends You Must Try.
                </p>
                <span className="mt-4 flex w-fit items-center gap-2 text-base font-semibold hover:underline  underline-offset-3">
                  <span>Discover More</span>
                  <img
                    src="/icons/VectorRight.svg"
                    alt=""
                    className="h-3.5 w-2 object-contain"
                  />
                </span>
              </div>
            </div>
          </Link>

          <div className="homepage-products mt-4 grid grid-flow-col gap-3.5 overflow-x-auto pb-3">
            {loadingProducts
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`product-loading-${index}`}
                    className="h-[350px] animate-pulse rounded-sm border border-[#e8ecdf] bg-[#f1f4ec]"
                    aria-hidden="true"
                  />
                ))
              : null}

            {!loadingProducts && products.length === 0 ? (
              <div className="col-span-full rounded-sm border border-[#e8ecdf] bg-[#f7f9f3] p-8 text-md text-[#626a5b]">
                No products are available right now.
              </div>
            ) : null}

            {!loadingProducts
              ? products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="homepage"
                  />
                ))
              : null}
          </div>
        </div>

        <div className="mt-12 h-48 bg-[#f1f4ec] sm:h-64 lg:h-80" />
      </section>

      <section
        className="bg-white py-14 sm:py-18 lg:py-20"
        aria-labelledby="articles-title"
      >
        <div className="site-container">
          <div className="mb-7 flex items-end justify-between gap-6">
            <h2
              id="articles-title"
              className="font-(family-name:--font-basker) text-4xl uppercase tracking-[0.01em] text-[#30352c]"
            >
              Latest Articles
            </h2>
            <div className="mb-1 flex items-center justify-center gap-2">
              <Link
                href="/blogs"
                className="text-[11px] font-medium text-[#52633c] hover:underline  underline-offset-3 sm:text-md"
              >
                View all Articles
              </Link>
              <img
                src="/icons/VectorRight.svg"
                alt=""
                className="h-3.5 w-2 object-contain"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, index) => (
              <Link
                key={post.id || `${post.title}-${index}`}
                href={post.href || "/blogs"}
                className="group overflow-hidden rounded-md bg-[#f1f4ec] p-2 transition hover:-translate-y-0.5"
              >
                <div className="aspect-[1.85/1] overflow-hidden rounded">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#e3e8db]" />
                  )}
                </div>
                <div className="px-1 pb-3 pt-3">
                  <h3 className="text-lg font-semibold leading-snug text-[#23281f]">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 text-sm">
                    {String(post.excerpt || "").length > 130
                      ? `${String(post.excerpt).slice(0, 127).trim()}...`
                      : post.excerpt}{" "}
                    <span className="inline-block text-base font-medium text-[#52633c] underline  underline-offset-3">
                      Read More
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .homepage-products {
          grid-auto-columns: minmax(220px, 78vw);
          scrollbar-width: none;
        }

        .homepage-products::-webkit-scrollbar {
          display: none;
        }

        @media (min-width: 640px) {
          .homepage-products {
            grid-auto-columns: calc((100% - 14px) / 2);
          }
        }

        @media (min-width: 768px) {
          .homepage-products {
            grid-auto-columns: calc((100% - 28px) / 3);
          }
        }

        @media (min-width: 1024px) {
          .homepage-products {
            grid-auto-columns: calc((100% - 42px) / 4);
          }
        }
      `}</style>
    </main>
  );
}
