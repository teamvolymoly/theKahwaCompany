"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { apiFetch } from "@/utils/api";
import ProductCard from "@/components/ProductCard";

const toCategoryParam = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ShopClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    price_range: { min: 0, max: 2000 },
    rating_options: [],
    tags: [],
    caffeine: [],
    collections: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCaffeine, setSelectedCaffeine] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [ratingMin, setRatingMin] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total_items: 0,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFilter, setOpenFilter] = useState("price");
  const [sortOpen, setSortOpen] = useState(false);
  const categoryParam = useMemo(
    () => searchParams.get("category"),
    [searchParams],
  );
  const searchParam = useMemo(() => searchParams.get("search"), [searchParams]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await apiFetch("/products/filters");
        const nextFilters = {
          categories: data?.categories || [],
          subcategories: data?.subcategories || [],
          price_range: data?.price_range || { min: 0, max: 2000 },
          rating_options: data?.rating_options || [],
          tags: data?.tags || [],
          caffeine: data?.caffeine || [],
          collections: data?.collections || [],
        };
        setFilters(nextFilters);
        setPriceRange([nextFilters.price_range.min, nextFilters.price_range.max]);
      } catch (err) {
        setFilters({
          categories: [],
          subcategories: [],
          price_range: { min: 0, max: 2000 },
          rating_options: [],
          tags: [],
          caffeine: [],
          collections: [],
        });
        setPriceRange([0, 2000]);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    if (searchParam && searchTerm === "") {
      setSearchTerm(searchParam.replace(/-/g, " "));
      setPage(1);
    }
  }, [searchParam, searchTerm]);

  useEffect(() => {
    if (!categoryParam || filters.categories.length === 0) return;
    const normalized = toCategoryParam(categoryParam);
    const match = filters.categories.find((c) => {
      if (String(c.id) === categoryParam) return true;
      if (c.slug && toCategoryParam(c.slug) === normalized) return true;
      return toCategoryParam(c.name) === normalized;
    });
    if (match) {
      setSelectedCategory(match.slug || String(match.id));
    }
  }, [categoryParam, filters.categories]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (searchTerm) params.set("search", searchTerm);
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedSubcategory) params.set("subcategory", selectedSubcategory);
        if (priceRange[0] > 0) params.set("price_min", String(priceRange[0]));
        if (priceRange[1] > 0) params.set("price_max", String(priceRange[1]));
        if (ratingMin) params.set("rating_min", String(ratingMin));
        if (inStockOnly) params.set("in_stock", "true");
        if (selectedTag) params.set("tag", selectedTag);
        if (selectedCaffeine) params.set("caffeine", selectedCaffeine);
        if (selectedCollection) params.set("collection", selectedCollection);
        if (sort === "price-low") params.set("sort", "price_asc");
        if (sort === "price-high") params.set("sort", "price_desc");
        if (sort === "rating") params.set("sort", "rating_desc");
        if (sort === "newest") params.set("sort", "newest");

        const data = await apiFetch(`/products?${params.toString()}`);
        const items = Array.isArray(data?.items) ? data.items : [];
        const normalized = items.map((item) => {
          const images = Array.isArray(item.images)
            ? item.images
            : (item.images
                ? Object.values(item.images).filter(Boolean)
                : []
              ).map((url, index) => ({
                id: `img-${item.id}-${index}`,
                image_url: url,
              }));
          return {
            ...item,
            images,
            oldPrice: item.compare_price,
          };
        });
        setProducts(normalized);
        setFilteredProducts(normalized);
        setPagination(
          data?.pagination || {
            page,
            limit,
            total_items: normalized.length,
            total_pages: 1,
          },
        );
      } catch (err) {
        setError(err?.message || "Failed to load products.");
        setProducts([]);
        setFilteredProducts([]);
        setPagination({ page: 1, limit, total_items: 0, total_pages: 1 });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [
    page,
    limit,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    priceRange,
    ratingMin,
    inStockOnly,
    selectedTag,
    selectedCaffeine,
    selectedCollection,
    sort,
  ]);

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedTag("");
    setSelectedCaffeine("");
    setSelectedCollection("");
    setRatingMin("");
    setInStockOnly(false);
    setPriceRange([filters.price_range.min, filters.price_range.max]);
    setSearchTerm("");
    setSort("default");
    setPage(1);
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
                        min={filters.price_range.min}
                        max={filters.price_range.max}
                        value={priceRange[1]}
                        onChange={(e) => {
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value, 10),
                          ]);
                          setPage(1);
                        }}
                        className="w-full accent-[#6a716a] h-1"
                      />
                      <div className="mt-2 flex justify-between text-xs text-black/70">
                        <span>₹ {priceRange[0]}</span>
                        <span>₹ {priceRange[1]}</span>
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
                      {filters.categories.map((c) => {
                        const value = c.slug || String(c.id);
                        return (
                          <label
                            key={value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="category"
                              checked={selectedCategory === value}
                              onChange={() => {
                                setSelectedCategory(value);
                                setSelectedSubcategory("");
                                setPage(1);
                              }}
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
                        );
                      })}
                      {filters.categories.length === 0 && (
                        <p className="text-xs text-black/40">
                          No categories available.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-b border-black/10 pb-6">
                  <button
                    type="button"
                    onClick={() => toggleFilter("subcategory")}
                    className="flex w-full items-center justify-between text-sm font-semibold text-[#1c2230]"
                  >
                    <span>Form</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`text-[#1c2230] transition ${openFilter === "subcategory" ? "rotate-180" : ""}`}
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
                  {openFilter === "subcategory" && (
                    <div className="mt-4 space-y-2 text-sm text-black/70">
                      {filters.subcategories
                        .filter((s) => {
                          if (!selectedCategory) return true;
                          if (String(s.category_id) === selectedCategory)
                            return true;
                          const categoryMatch = filters.categories.find(
                            (c) => String(c.id) === String(s.category_id),
                          );
                          if (!categoryMatch) return false;
                          return (
                            (categoryMatch.slug &&
                              categoryMatch.slug === selectedCategory) ||
                            toCategoryParam(categoryMatch.name) ===
                              toCategoryParam(selectedCategory)
                          );
                        })
                        .map((s) => {
                          const value = s.slug || String(s.id);
                          return (
                            <label
                              key={value}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="subcategory"
                                checked={selectedSubcategory === value}
                                onChange={() => {
                                  setSelectedSubcategory(value);
                                  setPage(1);
                                }}
                                className="accent-[#6a716a]"
                              />
                              <span>{s.name}</span>
                            </label>
                          );
                        })}
                      {filters.subcategories.length === 0 && (
                        <p className="text-xs text-black/40">
                          No subcategories available.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-b border-black/10 pb-6">
                  <button
                    type="button"
                    onClick={() => toggleFilter("form")}
                    className="flex w-full items-center justify-between text-sm font-semibold text-[#1c2230]"
                  >
                    <span>Tags</span>
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
                    <div className="mt-4 space-y-2 text-sm text-black/70">
                      {filters.tags.map((tag) => (
                        <label
                          key={tag}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="tag"
                            checked={selectedTag === tag}
                            onChange={() => {
                              setSelectedTag(tag);
                              setPage(1);
                            }}
                            className="accent-[#6a716a]"
                          />
                          <span>{tag}</span>
                        </label>
                      ))}
                      {filters.tags.length === 0 && (
                        <p className="text-xs text-black/40">
                          No tags available.
                        </p>
                      )}
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
                    <div className="mt-4 space-y-2 text-sm text-black/70">
                      {filters.caffeine.map((level) => (
                        <label
                          key={level}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="caffeine"
                            checked={selectedCaffeine === level}
                            onChange={() => {
                              setSelectedCaffeine(level);
                              setPage(1);
                            }}
                            className="accent-[#6a716a]"
                          />
                          <span className="capitalize">{level}</span>
                        </label>
                      ))}
                      {filters.caffeine.length === 0 && (
                        <p className="text-xs text-black/40">
                          No caffeine options.
                        </p>
                      )}
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
                    <div className="mt-4 space-y-2 text-sm text-black/70">
                      {filters.collections.map((collection) => (
                        <label
                          key={collection}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="collection"
                            checked={selectedCollection === collection}
                            onChange={() => {
                              setSelectedCollection(collection);
                              setPage(1);
                            }}
                            className="accent-[#6a716a]"
                          />
                          <span>{collection}</span>
                        </label>
                      ))}
                      {filters.collections.length === 0 && (
                        <p className="text-xs text-black/40">
                          No collections available.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-b border-black/10 pb-6">
                  <button
                    type="button"
                    onClick={() => toggleFilter("rating")}
                    className="flex w-full items-center justify-between text-sm font-semibold text-[#1c2230]"
                  >
                    <span>Rating</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`text-[#1c2230] transition ${openFilter === "rating" ? "rotate-180" : ""}`}
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
                  {openFilter === "rating" && (
                    <div className="mt-4 space-y-2 text-sm text-black/70">
                      {filters.rating_options.map((rate) => (
                        <label
                          key={rate}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="rating"
                            checked={String(ratingMin) === String(rate)}
                            onChange={() => {
                              setRatingMin(String(rate));
                              setPage(1);
                            }}
                            className="accent-[#6a716a]"
                          />
                          <span>{rate}+ stars</span>
                        </label>
                      ))}
                      {filters.rating_options.length === 0 && (
                        <p className="text-xs text-black/40">
                          No rating filters.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-black/70">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setPage(1);
                    }}
                    className="accent-[#6a716a]"
                  />
                  <span>In stock only</span>
                </div>

                <div>
                  <div className="text-sm font-semibold text-[#1c2230]">
                    Search
                  </div>
                  <input
                    type="text"
                    placeholder="Search teas..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="mt-3 w-full border-b border-black/20 px-1 py-2 text-sm outline-none placeholder:text-black/40"
                  />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="mb-8 mt-[2px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-black/60">
                  Showing {filteredProducts.length} of{" "}
                  {pagination.total_items} products
                </p>
                <div className="flex items-center gap-3 text-sm text-[#4e5a50]">
                  <span className="font-semibold">Sort By:</span>
                  <div className="relative group">
                    <select
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value);
                        setPage(1);
                      }}
                      onFocus={() => setSortOpen(true)}
                      onBlur={() => setSortOpen(false)}
                      onMouseDown={() => setSortOpen(true)}
                      className="appearance-none bg-transparent pr-8 text-sm font-semibold text-[#1c2230] focus:outline-none"
                    >
                      <option value="default">Default sorting</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="newest">Newest</option>
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

              {error && (
                <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading && (
                  <div className="col-span-full text-sm text-black/60">
                    Loading products...
                  </div>
                )}
                {!loading && filteredProducts.length === 0 && (
                  <div className="col-span-full text-sm text-black/60">
                    No products found for these filters.
                  </div>
                )}
                {!loading &&
                  filteredProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
              </div>

              {pagination.total_pages > 1 && (
                <div className="mt-10 flex items-center justify-between text-sm text-black/60">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page <= 1}
                    className="rounded-sm border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(pagination.total_pages, prev + 1),
                      )
                    }
                    disabled={page >= pagination.total_pages}
                    className="rounded-sm border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
