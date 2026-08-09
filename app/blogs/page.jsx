"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { apiFetch } from "@/utils/api";
import { normalizeBlogPagination } from "@/utils/blogs";

const initialPagination = {
  currentPage: 1,
  lastPage: 1,
  from: 0,
  to: 0,
  total: 0,
  hasNext: false,
  hasPrev: false,
};

function ArticleMeta({ post }) {
  return (
    <div className="space-y-1 text-[12px] uppercase font-thin leading-tight text-[#8a8f86]">
      {post.date ? <p>{post.date}</p> : null}
      <p className="normal-case text-[#191919] mt-2">
        Estimated Read Time: {post.read || "Quick read"}
      </p>
    </div>
  );
}

function ReadMore() {
  return (
    <span className="mt-auto flex h-11 w-full items-center justify-center rounded-md bg-[#52653b] text-md font-semibold text-white transition-colors group-hover:bg-[#6B7F42]">
      Read More
    </span>
  );
}

function FeaturedArticle({ post }) {
  return (
    <Link
      href={post.href}
      className="group grid gap-4 rounded-lg bg-[#f1f4ec] p-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]"
    >
      <div className="h-[300px] overflow-hidden rounded-md bg-[#e7ebe2] sm:h-[360px] lg:h-[310px]">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <div className="h-full w-full bg-[#e4e9df]" />
        )}
      </div>

      <div className="flex min-h-[310px] flex-col rounded-md bg-white px-6 py-6 sm:px-7 lg:h-[310px] lg:min-h-0 lg:py-5">
        <ArticleMeta post={post} />
        <h2 className="mt-4 line-clamp-3 text-xl font-semibold leading-[1.2] text-[#242822]">
          {post.title}
        </h2>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-md leading-[1.4] text-[#444940]">
            {post.excerpt}...
          </p>
        ) : null}
        <div className="mt-4 flex flex-1 items-end">
          <ReadMore />
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ post }) {
  return (
    <Link
      href={post.href}
      className="group flex min-h-0 flex-col rounded-lg bg-[#f1f4ec] p-4"
    >
      <div className="aspect-[1.42/1] overflow-hidden rounded-md bg-[#e4e9df]">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
        ) : (
          <div className="h-full w-full bg-[#e4e9df]" />
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <ArticleMeta post={post} />
        <h2 className="mt-5 line-clamp-2 text-xl font-semibold leading-[1.2] text-[#242822]">
          {post.title}
        </h2>
        {post.excerpt ? (
          <p className="mt-5 line-clamp-3 text-md leading-[1.42] text-[#444940]">
            {post.excerpt}...
          </p>
        ) : null}
        <div className="mt-6 flex flex-1 items-end">
          <ReadMore />
        </div>
      </div>
    </Link>
  );
}

function ArticleSkeleton({ featured = false }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#f1f4ec] ${featured ? "h-[390px]" : "h-[510px]"}`}
    />
  );
}

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") || "");
  }, []);

  useEffect(() => {
    if (query === null) return;
    let active = true;

    const loadPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (query) params.set("q", query);
        const data = await apiFetch(`/blog-posts?${params.toString()}`);
        const normalized = normalizeBlogPagination(data);
        if (!active) return;
        setPosts(normalized.posts);
        setPagination(normalized);
      } catch (loadError) {
        if (!active) return;
        setPosts([]);
        setPagination(initialPagination);
        setError(loadError?.message || "Unable to load articles.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPosts();
    return () => {
      active = false;
    };
  }, [page, query]);

  const pageNumbers = useMemo(() => {
    if (pagination.lastPage <= 1) return [];
    if (pagination.lastPage <= 7) {
      return Array.from(
        { length: pagination.lastPage },
        (_, index) => index + 1,
      );
    }

    const values = [1];
    const start = Math.max(2, pagination.currentPage - 1);
    const end = Math.min(pagination.lastPage - 1, pagination.currentPage + 1);
    if (start > 2) values.push("ellipsis-start");
    for (let value = start; value <= end; value += 1) values.push(value);
    if (end < pagination.lastPage - 1) values.push("ellipsis-end");
    values.push(pagination.lastPage);
    return values;
  }, [pagination.currentPage, pagination.lastPage]);

  const articleGroups = useMemo(() => {
    const groups = [];
    for (let index = 0; index < posts.length; index += 4) {
      groups.push({
        featured: posts[index],
        cards: posts.slice(index + 1, index + 4),
      });
    }
    return groups;
  }, [posts]);

  const changePage = (nextPage) => {
    if (loading || nextPage < 1 || nextPage > pagination.lastPage) return;
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="bg-[#fdfefb] pt-[70px] text-[#20241e]">
      <section className="site-container pb-16 pt-14 sm:pb-20 sm:pt-[76px] lg:pb-[88px]">
        <h1
          className="text-4xl font-normal uppercase leading-none text-[#344823]"
          style={{ fontFamily: "var(--font-basker)" }}
        >
          Articles
        </h1>

        {error ? (
          <p className="mt-10 rounded-lg bg-[#f8e8e4] px-5 py-4 text-md text-[#8b352b]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-12 space-y-10">
            <ArticleSkeleton featured />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <ArticleSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : null}

        {!loading && !error && posts.length === 0 ? (
          <div className="mt-12 rounded-lg bg-[#f1f4ec] px-6 py-20 text-center">
            <p className="font-serif text-2xl text-[#3f532b]">
              No articles are available right now.
            </p>
          </div>
        ) : null}

        {!loading && !error && posts.length ? (
          <div className="mt-12 space-y-10">
            {articleGroups.map((group) => (
              <div key={group.featured.id} className="space-y-10">
                <FeaturedArticle post={group.featured} />
                {group.cards.length ? (
                  <div className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {group.cards.map((post) => (
                      <ArticleCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {!loading && pagination.lastPage > 1 ? (
          <nav
            className="mt-12 flex items-center justify-center gap-3 text-md text-[#777c73]"
            aria-label="Article pages"
          >
            <button
              type="button"
              onClick={() => changePage(page - 1)}
              disabled={!pagination.hasPrev}
              className="px-1 disabled:opacity-30"
              aria-label="Previous page"
            >
              ←
            </button>
            {pageNumbers.map((value) =>
              typeof value === "number" ? (
                <button
                  key={value}
                  type="button"
                  onClick={() => changePage(value)}
                  className={`min-w-5 border-b pb-0.5 ${pagination.currentPage === value ? "border-[#53663c] text-[#344823]" : "border-transparent hover:border-[#9ba68c]"}`}
                  aria-current={
                    pagination.currentPage === value ? "page" : undefined
                  }
                >
                  {value}
                </button>
              ) : (
                <span key={value}>…</span>
              ),
            )}
            <button
              type="button"
              onClick={() => changePage(page + 1)}
              disabled={!pagination.hasNext}
              className="px-1 disabled:opacity-30"
              aria-label="Next page"
            >
              →
            </button>
          </nav>
        ) : null}
      </section>
    </main>
  );
}
