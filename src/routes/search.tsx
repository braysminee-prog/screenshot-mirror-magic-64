import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Gamepad2, Search as SearchIcon, Store } from "lucide-react";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import { SearchField } from "@/components/orphic/discovery/search-field";
import { CategoryOrientation, CategoryRail } from "@/components/orphic/discovery/category-orientation";
import { FilterControls, FilterGroups } from "@/components/orphic/discovery/filter-controls";
import { ProductCard, ProductCardSkeleton } from "@/components/orphic/discovery/product-card";
import {
  categories,
  products,
  suggestedSearches,
  suggestionPool,
  topUpTitles,
  type Category,
} from "@/lib/orphic-discovery";

const title = "Cari & Jelajahi — Orphic";
const description =
  "Temukan produk digital, layanan, akun game, dan seller pilihan lewat pencarian dan kategori kurasi Orphic.";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [focused, setFocused] = useState(false);
  const [categoryKey, setCategoryKey] = useState<string | null>("hosting");
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [productType, setProductType] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(["4GB", "Indonesia"]);
  const [sort, setSort] = useState("Relevan");
  const [loading, setLoading] = useState(false);

  const category: Category = useMemo(
    () => categories.find((c) => c.key === categoryKey) ?? categories[0]!,
    [categoryKey],
  );

  const autocomplete = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^@/, "");
    if (!q) return [];
    return suggestionPool
      .filter((s) => s.label.toLowerCase().replace(/^@/, "").includes(q))
      .slice(0, 6);
  }, [query]);

  const results = useMemo(() => {
    let list = products.filter((p) => p.category === category.key);
    if (productType) list = list.filter((p) => p.type === productType);
    const q = submitted.trim().toLowerCase().replace(/^@/, "");
    if (q) {
      list = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.seller.toLowerCase().replace("@", "").includes(q) ||
          p.type.toLowerCase().includes(q),
      );
    }
    if (sort === "Harga Terendah") list = [...list].sort((a, b) => price(a.price) - price(b.price));
    if (sort === "Harga Tertinggi") list = [...list].sort((a, b) => price(b.price) - price(a.price));
    return list;
  }, [category.key, productType, submitted, sort]);

  useEffect(() => {
    setLoading(true);
    const id = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(id);
  }, [category.key, productType, submitted, sort, activeFilters.length]);

  const idle = !submitted && !query;

  function runSearch(value: string) {
    setQuery(value);
    setSubmitted(value);
    setFocused(false);
  }

  function toggleFilter(value: string) {
    setActiveFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  const sellerMatch = submitted.trim().startsWith("@");

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="mx-auto max-w-7xl px-6 pb-36 pt-24 md:px-10 md:pb-24 md:pt-32">
        <BackButton fallback="/" label="Kembali" />

        <p className="orphic-eyebrow mt-6">Discovery</p>
        <h1 className="orphic-display mt-3 text-[2rem] text-foreground md:text-5xl">
          Cari di Orphic.
        </h1>

        <form
          className="mt-8 max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(query);
          }}
        >
          <SearchField
            value={query}
            onChange={(v) => {
              setQuery(v);
              setFocused(true);
            }}
            onFocus={() => setFocused(true)}
            onClear={() => {
              setQuery("");
              setSubmitted("");
            }}
            suggestions={autocomplete}
            onPick={runSearch}
            open={focused}
          />
        </form>

        {idle ? (
          <section className="mt-10 max-w-2xl">
            <p className="orphic-eyebrow">Saran pencarian</p>
            <ul className="mt-5 divide-y divide-hairline border-y border-hairline">
              {suggestedSearches.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => runSearch(item)}
                    className="flex w-full items-center gap-3 py-3.5 text-left text-[14px] text-foreground/85 transition-colors duration-300 hover:text-foreground"
                  >
                    {item.startsWith("@") ? (
                      <Store className="size-[16px] text-muted-foreground" strokeWidth={1.5} />
                    ) : (
                      <SearchIcon className="size-[16px] text-muted-foreground" strokeWidth={1.5} />
                    )}
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-12">
          <p className="orphic-eyebrow">Kategori</p>
          <div className="mt-4">
            <CategoryRail
              categories={categories}
              selected={category.key}
              onSelect={(key) => {
                setCategoryKey(key);
                setSubcategory(null);
                setProductType(null);
                setActiveFilters([]);
                setSubmitted("");
                setQuery("");
              }}
            />
          </div>
        </div>

        <CategoryOrientation
          category={category}
          subcategory={subcategory}
          onSubcategory={setSubcategory}
          productType={productType}
          onProductType={setProductType}
        />

        {category.key === "gaming" ? (
          <section className="mt-10">
            <p className="orphic-eyebrow">Pilih game</p>
            <div className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
              {topUpTitles.map((game) => (
                <button
                  key={game}
                  type="button"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-hairline px-4 py-2 text-[12.5px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  <Gamepad2 className="size-[15px]" strokeWidth={1.5} />
                  {game}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-12 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <p className="orphic-eyebrow">Filter</p>
            <FilterGroups category={category} active={activeFilters} onToggle={toggleFilter} />
          </aside>

          <div>
            <FilterControls
              category={category}
              active={activeFilters}
              onToggle={toggleFilter}
              onClear={() => setActiveFilters([])}
              sort={sort}
              onSort={setSort}
              count={results.length}
            />

            {sellerMatch && results.length ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-hairline px-5 py-4">
                <Store className="size-[18px] text-primary" strokeWidth={1.5} />
                <div>
                  <p className="text-[13.5px] text-foreground">{submitted.trim()}</p>
                  <p className="text-[11.5px] text-muted-foreground">
                    Profil seller · {results.length} produk aktif
                  </p>
                </div>
              </div>
            ) : null}

            {loading ? (
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : results.length ? (
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:gap-x-10">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-10 border-y border-hairline py-14">
                <h3 className="orphic-display text-xl text-foreground">
                  Belum menemukan yang kamu cari.
                </h3>
                <p className="mt-3 text-[13px] text-muted-foreground">Coba cari:</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["VPS", "Hosting", "Server", "Script PHP"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => runSearch(item)}
                      className="rounded-full border border-hairline px-3.5 py-1.5 text-[12px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!loading && results.length ? (
              <p className="mt-12 text-center text-[11.5px] text-muted-foreground/70">
                Memuat produk lainnya saat kamu menggulir.
              </p>
            ) : null}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function price(value: string) {
  return Number(value.replace(/[^\d]/g, ""));
}
