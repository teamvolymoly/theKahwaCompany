"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import {
  dummyCategories,
  dummyProducts,
  dummySubcategories,
} from "@/utils/dummyData";
import ProductCard from "@/components/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [subcats, setSubcats] = useState(dummySubcategories);

  useEffect(() => {
    const load = async () => {
      try {
        const catData = await apiFetch(`/categories/${slug}`);
        const resolvedCategory =
          catData ||
          dummyCategories.find((c) => c.slug === slug || String(c.id) === slug) ||
          dummyCategories[0];
        setCategory(resolvedCategory);

        const subData = await apiFetch(`/categories/${slug}/subcategories`);
        setSubcats(
          Array.isArray(subData) && subData.length ? subData : dummySubcategories
        );

        const all = await apiFetch("/products");
        const list = all?.products || all || [];
        const filtered = Array.isArray(list)
          ? list.filter((p) => p.category_id === resolvedCategory.id)
          : [];
        setProducts(filtered.length ? filtered : dummyProducts.filter((p) => p.category_id === resolvedCategory.id));
      } catch (err) {
        const resolvedCategory =
          dummyCategories.find((c) => c.slug === slug || String(c.id) === slug) ||
          dummyCategories[0];
        setCategory(resolvedCategory);
        setSubcats(dummySubcategories);
        setProducts(dummyProducts.filter((p) => p.category_id === resolvedCategory.id));
      }
    };
    load();
  }, [slug]);

  return (
    <>
      <main className="bg-white text-black">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          {category?.name}
        </h1>
        <p className="text-black/60 max-w-md">{category?.description}</p>

        <div className="flex gap-4 mt-8 flex-wrap">
          {subcats.map((s) => (
            <Link
              href={`/category/${s.slug || s.id}`}
              key={s.id}
              className="bg-black/5 px-6 py-2 rounded-full text-sm text-black/70"
            >
              {s.name}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
      </main>
    </>
  );
}
