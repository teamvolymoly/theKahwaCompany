"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { apiFetch } from "@/utils/api";
import { dummyCategories, dummyProducts } from "@/utils/dummyData";
import ProductCard from "@/components/ProductCard";

const toCategoryParam = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ShopClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(dummyProducts);
  const [categories, setCategories] = useState(dummyCategories);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("default");
  const [openFilter, setOpenFilter] = useState("price");
  const [sortOpen, setSortOpen] = useState(false);
  const categoryParam = useMemo(
    () => searchParams.get("category"),
    [searchParams],
  );
  const searchParam = useMemo(() => searchParams.get("search"), [searchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, c] = await Promise.all([
          apiFetch("/products"),
          apiFetch("/categories"),
        ]);
        const productList = p?.products || p;
        setProducts(
          Array.isArray(productList) && productList.length
            ? productList
            : dummyProducts,
        );
        setCategories(Array.isArray(c) && c.length ? c : dummyCategories);
        setFilteredProducts(
          Array.isArray(productList) && productList.length
            ? productList
            : dummyProducts,
        );
      } catch (err) {
        setProducts(dummyProducts);
        setCategories(dummyCategories);
        setFilteredProducts(dummyProducts);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (searchParam && searchTerm === "") {
      setSearchTerm(searchParam.replace(/-/g, " "));
    }
  }, [searchParam, searchTerm]);

  useEffect(() => {
    if (!categoryParam || categories.length === 0) return;
    const normalized = toCategoryParam(categoryParam);
    const match = categories.find((c) => {
      if (String(c.id) === categoryParam) return true;
      if (c.slug && toCategoryParam(c.slug) === normalized) return true;
      return toCategoryParam(c.name) === normalized;
    });
    if (match) {
      setSelectedCategory(String(match.id));
    }
  }, [categoryParam, categories]);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(
        (p) => p.category_id === parseInt(selectedCategory),
      );
    }
    result = result.filter((p) => {
      const price = p.variants?.[0]?.price || p.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          (a.variants?.[0]?.price || a.price) -
          (b.variants?.[0]?.price || b.price),
      );
    }
    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          (b.variants?.[0]?.price || b.price) -
          (a.variants?.[0]?.price || a.price),
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, priceRange, searchTerm, sort, products]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 2000]);
    setSearchTerm("");
  };

  const toggleFilter = (key) => {
    setOpenFilter((current) => (current === key ? null : key));
  };

  return (
    <>
      <section className="mt-12 mb-20 w-full h-[280px] ">
        <img
          src="/products/W7.png"
          alt="Adv_1"
          className="w-full h-full object-cover object-center"
        />
      </section>
      <main className="container mx-auto bg-white text-black ">
        <div className="max-w-2xl mx-auto mb-8 flex flex-col items-center text-center justify-center gap-3">
          <p
            className="text-4xl uppercase text-[#4e5a50] "
            style={{ fontFamily: "var(--font-basker)" }}
          >
            All Products
          </p>
          <p className="text-[#4e5a50] font-thin text-md max-w-xl">
            Explore a wide range of wellness teas and natural supplements,
            combining traditional herbs with modern nutrition.
          </p>
        </div>
        <div className="container mx-auto px-4 sm:px-8 lg:px-12 py-12">
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-72">
              <div className="flex items-center justify-between lg:gap-6">
                <h3 className="text-lg font-semibold text-[#4e5a50]">
                  Filters
                </h3>
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold uppercase tracking-[0.05em] text-black/50 transition hover:text-black"
                >
                  Clear
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div className="border-b border-black/10 pb-6">
                  <button
                    type="button"
                    onClick={() => toggleFilter("price")}
                    className="flex w-full items-center justify-between text-sm font-semibold text-[#1c2230]"
                  >
                    <span>Price</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`text-[#1c2230] transition ${openFilter === "price" ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {openFilter === "price" && (
                    <div className="mt-2">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full accent-[#6a716a] h-1"
                      />
                      <div className="mt-2 flex justify-between text-xs text-black/70">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-b border-black/10 pb-6">
                  <button
                    type="button"
                    onClick={() => toggleFilter("category")}
                    className="flex w-full items-center justify-between text-sm font-semibold text-[#1c2230]"
                  >
                    <span>Product Type</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`text-[#1c2230] transition ${openFilter === "category" ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {openFilter === "category" && (
                    <div className="mt-4 space-y-2 text-sm text-black/70">
                      {categories.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === c.id.toString()}
                            onChange={() =>
                              setSelectedCategory(c.id.toString())
                            }
                            className="accent-[#6a716a]"
                          />
                          <span>{c.name}</span>
                          <Link
                            href={`/category/${c.slug || c.id}`}
                            className="ml-auto text-[11px] text-black/40 underline"
                          >
                            View
                          </Link>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-b border-black/10 pb-6">
                  <button
                    type="button"
                    onClick={() => toggleFilter("form")}
                    className="flex w-full items-center justify-between text-sm font-semibold text-[#1c2230]"
                  >
                    <span>Form</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`text-[#1c2230] transition ${openFilter === "form" ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {openFilter === "form" && (
                    <div className="mt-4 text-sm text-black/60">
                      Loose Leaf, Tea Bags, Samplers
                    </div>
                  )}
                </div>

                <div className="border-b border-black/10 pb-6">
                  <button
                    type="button"
                    onClick={() => toggleFilter("caffeine")}
                    className="flex w-full items-center justify-between text-sm font-semibold text-[#1c2230]"
                  >
                    <span>Caffeine</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`text-[#1c2230] transition ${openFilter === "caffeine" ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {openFilter === "caffeine" && (
                    <div className="mt-4 text-sm text-black/60">
                      Low, Medium, Caffeine Free
                    </div>
                  )}
                </div>

                <div className="border-b border-black/10 pb-6">
                  <button
                    type="button"
                    onClick={() => toggleFilter("collection")}
                    className="flex w-full items-center justify-between text-sm font-semibold text-[#1c2230]"
                  >
                    <span>Collection</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`text-[#1c2230] transition ${openFilter === "collection" ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {openFilter === "collection" && (
                    <div className="mt-4 text-sm text-black/60">
                      Signature, Wellness, Gifts
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm font-semibold text-[#1c2230]">
                    Search
                  </div>
                  <input
                    type="text"
                    placeholder="Search teas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-3 w-full border-b border-black/20 px-1 py-2 text-sm outline-none placeholder:text-black/40"
                  />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-black/60">
                  Showing {filteredProducts.length} products
                </p>
                <div className="flex items-center gap-3 text-sm text-[#4e5a50]">
                  <span className="font-semibold">Sort By:</span>
                  <div className="relative group">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      onFocus={() => setSortOpen(true)}
                      onBlur={() => setSortOpen(false)}
                      onMouseDown={() => setSortOpen(true)}
                      className="appearance-none bg-transparent pr-8 text-sm font-semibold text-[#1c2230] focus:outline-none"
                    >
                      <option value="default">Default sorting</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`pointer-events-none absolute right-0 top-1 text-[#1c2230] transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
