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

const DEFAULT_PRICE_RANGE = { min: 0, max: 2000 };

const SORT_OPTIONS = [
  { value: "default", label: "Default sorting" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

const normalizePriceRange = (range) => {
  const max = Number(range?.max ?? DEFAULT_PRICE_RANGE.max);
  return {
    min: 0,
    max: Number.isFinite(max) && max > 0 ? max : DEFAULT_PRICE_RANGE.max,
  };
};

export default function ShopClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    price_range: DEFAULT_PRICE_RANGE,
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
  const [priceRange, setPriceRange] = useState([
    DEFAULT_PRICE_RANGE.min,
    DEFAULT_PRICE_RANGE.max,
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const limit = 12;
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const categoryParam = useMemo(
    () => searchParams.get("category"),
    [searchParams],
  );
  const searchParam = useMemo(() => searchParams.get("search"), [searchParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await apiFetch("/products/filters");
        const nextFilters = {
          categories: data?.categories || [],
          subcategories: data?.subcategories || [],
          price_range: normalizePriceRange(data?.price_range),
          rating_options: data?.rating_options || [],
          tags: data?.tags || [],
          caffeine: data?.caffeine || [],
          collections: data?.collections || [],
        };
        setFilters(nextFilters);
        setPriceRange([
          nextFilters.price_range.min,
          nextFilters.price_range.max,
        ]);
      } catch (err) {
        setFilters({
          categories: [],
          subcategories: [],
          price_range: DEFAULT_PRICE_RANGE,
          rating_options: [],
          tags: [],
          caffeine: [],
          collections: [],
        });
        setPriceRange([DEFAULT_PRICE_RANGE.min, DEFAULT_PRICE_RANGE.max]);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    if (searchParam && searchTerm === "") {
      const nextSearch = searchParam.replace(/-/g, " ");
      setSearchTerm(nextSearch);
      setDebouncedSearchTerm(nextSearch.trim());
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
      setPage(1);
    }
  }, [categoryParam, filters.categories]);

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategory) return filters.subcategories;
    return filters.subcategories.filter((s) => {
      if (String(s.category_id) === selectedCategory) return true;
      const categoryMatch = filters.categories.find(
        (c) => String(c.id) === String(s.category_id),
      );
      if (!categoryMatch) return false;
      return (
        (categoryMatch.slug && categoryMatch.slug === selectedCategory) ||
        toCategoryParam(categoryMatch.name) === toCategoryParam(selectedCategory)
      );
    });
  }, [filters.categories, filters.subcategories, selectedCategory]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedSubcategory) params.set("subcategory", selectedSubcategory);
        if (priceRange[0] > filters.price_range.min) {
          params.set("price_min", String(priceRange[0]));
        }
        if (priceRange[1] < filters.price_range.max) {
          params.set("price_max", String(priceRange[1]));
        }
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
        setPagination({ page: 1, limit, total_items: 0, total_pages: 1 });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [
    page,
    limit,
    debouncedSearchTerm,
    selectedCategory,
    selectedSubcategory,
    priceRange,
    ratingMin,
    inStockOnly,
    selectedTag,
    selectedCaffeine,
    selectedCollection,
    sort,
    filters.price_range.min,
    filters.price_range.max,
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
    setDebouncedSearchTerm("");
    setSort("default");
    setPage(1);
  };

  const toggleFilter = (key) => {
    setOpenFilter((current) => (current === key ? null : key));
  };

  const filterControls = (
    <>
      <div className="flex items-center justify-between lg:gap-6">
        <h3 className="text-lg font-semibold text-[#4e5a50]">Filters</h3>
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
                  setPriceRange([priceRange[0], parseInt(e.target.value, 10)]);
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
              {filteredSubcategories.map((s) => {
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
              {filteredSubcategories.length === 0 && (
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
                <p className="text-xs text-black/40">No tags available.</p>
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
                <p className="text-xs text-black/40">No caffeine options.</p>
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
                <p className="text-xs text-black/40">No rating filters.</p>
              )}
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-black/70">
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
        </label>

        <div>
          <div className="text-sm font-semibold text-[#1c2230]">Search</div>
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
    </>
  );

  return (
    <>
      <section className="mt-12 mb-20 w-full h-[280px] ">
        <img
          src="/products/W7.png"
          alt="Adv_1"
          className="w-full h-full object-cover object-center"
        />
      </section>
      <main className="container mx-auto bg-white pb-16 text-black lg:pb-0">
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
            <div className="hidden w-full lg:block lg:w-72">
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
                      {filteredSubcategories.map((s) => {
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
                      {filteredSubcategories.length === 0 && (
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
                  Showing {products.length} of{" "}
                  {pagination.total_items} products
                </p>
                <div className="hidden items-center gap-3 text-sm text-[#4e5a50] lg:flex">
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
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
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
                {!loading && products.length === 0 && (
                  <div className="col-span-full text-sm text-black/60">
                    No products found for these filters.
                  </div>
                )}
                {!loading &&
                  products.map((p) => (
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

      <div className="fixed inset-x-0 bottom-0 z-40 grid h-12 grid-cols-2 border-t border-white/10 bg-gradient-to-r from-[#7a8177] to-[#5f665e] text-white shadow-[0_-6px_18px_rgba(28,34,48,0.16)] lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center justify-center gap-2 border-r border-white/20 text-xs font-semibold tracking-[0.02em]"
          aria-label="Open filters"
        >
          <span aria-hidden="true">≡</span>
          <span>Filter By</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileSortOpen(true)}
          className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.02em]"
          aria-label="Open sorting"
        >
          <span aria-hidden="true">↕</span>
          <span>Sort By</span>
        </button>
      </div>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c2230]/35 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close filters"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-sm border-t border-[#6a716a]/20 bg-[#fafafa] px-5 pb-24 pt-5 text-black shadow-[0_-12px_32px_rgba(28,34,48,0.18)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-base font-semibold text-[#4e5a50]">
                Filter By
              </p>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex h-8 w-8 items-center justify-center text-xl leading-none text-black/60"
                aria-label="Close filters"
              >
                ×
              </button>
            </div>
            {filterControls}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 h-11 w-full bg-gradient-to-r from-[#7a8177] to-[#6a716a] text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:from-[#5f665e] hover:to-[#525a53]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {mobileSortOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c2230]/35 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close sorting"
            onClick={() => setMobileSortOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-sm border-t border-[#6a716a]/20 bg-[#fafafa] px-5 pb-24 pt-5 text-black shadow-[0_-12px_32px_rgba(28,34,48,0.18)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-base font-semibold text-[#4e5a50]">Sort By</p>
              <button
                type="button"
                onClick={() => setMobileSortOpen(false)}
                className="flex h-8 w-8 items-center justify-center text-xl leading-none text-black/60"
                aria-label="Close sorting"
              >
                ×
              </button>
            </div>
            <div className="space-y-1">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSort(option.value);
                    setPage(1);
                    setMobileSortOpen(false);
                  }}
                  className={`flex h-11 w-full items-center justify-between border-b border-black/10 text-left text-sm ${
                    sort === option.value
                      ? "font-semibold text-[#4e5a50]"
                      : "text-black/70"
                  }`}
                >
                  <span>{option.label}</span>
                  {sort === option.value && <span aria-hidden="true">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
