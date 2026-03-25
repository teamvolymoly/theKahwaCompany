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

  return (
    <>
      <main className="bg-white text-black">
        <div className="container mx-auto px-4 py-12">
          <div className="flex gap-10">
            {/* Sidebar Filters */}
            <div className="w-72 hidden lg:block">
              <h3 className="font-semibold text-xl mb-6">Filters</h3>

              <div className="mb-8">
                <h4 className="uppercase tracking-widest text-black/60 mb-3">
                  Categories
                </h4>
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === c.id.toString()}
                        onChange={() => setSelectedCategory(c.id.toString())}
                      />
                      <span className="text-black/80">{c.name}</span>
                    </label>
                    <Link
                      href={`/category/${c.slug || c.id}`}
                      className="text-xs text-black/60 underline"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <h4 className="uppercase tracking-widest text-black/60 mb-3">
                  Price
                </h4>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full accent-black"
                />
                <div className="flex justify-between text-sm mt-2 text-black/70">
                  <span>Rs.{priceRange[0]}</span>
                  <span>Rs.{priceRange[1]}</span>
                </div>
              </div>

              <input
                type="text"
                placeholder="Search teas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-black/20 px-5 py-3"
              />
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <p className="text-black/70">
                  Showing {filteredProducts.length} products
                </p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-black/20 rounded-full px-5 py-2"
                >
                  <option value="default">Default sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
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
