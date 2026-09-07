import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Heart,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  Star,
} from "lucide-react";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import { SellerSignature } from "@/components/orphic/seller-signature";
import { MediaGallery } from "@/components/orphic/product/media-gallery";
import { useCart } from "@/lib/orphic-cart";
import { getProductDetail, productDetails, type ProductDetail } from "@/lib/orphic-product-detail";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const detail = getProductDetail(params.id);
    if (!detail) throw notFound();
    return { detail };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Produk tidak tersedia — Orphic" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.detail.name} — Orphic`;
    const description = loaderData.detail.tagline;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { detail } = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const cart = useCart();
  const addedTimer = useRef<number | undefined>(undefined);

  const [variantId, setVariantId] = useState(
    detail.variants ? (detail.variants.options[1]?.id ?? detail.variants.options[0]!.id) : "",
  );
  const [loved, setLoved] = useState(false);
  const [openSection, setOpenSection] = useState(0);
  const [purchase, setPurchase] = useState<"idle" | "loading" | "done">("idle");
  const [userId, setUserId] = useState("");
  const [server, setServer] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => () => window.clearTimeout(addedTimer.current), []);

  const variant = useMemo(
    () => detail.variants?.options.find((o) => o.id === variantId),
    [detail.variants, variantId],
  );
  const price = variant?.price ?? detail.price;
  const related = detail.related
    .map((id) => productDetails[id])
    .filter((p): p is ProductDetail => Boolean(p));

  const needsId = Boolean(detail.requiresAccountId);
  const canBuy = !detail.soldOut && detail.actions.includes("buy");

  function buildConfig() {
    if (needsId && (!userId.trim() || !server.trim())) {
      setError("Masukkan User ID dan Server terlebih dahulu.");
      return null;
    }
    setError("");
    return needsId ? { userId: userId.trim(), server: server.trim() } : {};
  }

  function handleBuy() {
    const config = buildConfig();
    if (!config) return;
    const item = cart.addItem({
      productId: detail.id,
      variantId: detail.variants ? variantId : undefined,
      config,
    });
    cart.setDirectItemKey(item.key);
    setPurchase("loading");
    window.setTimeout(() => {
      setPurchase("done");
      navigate({ to: "/checkout" });
    }, 500);
  }

  function handleAddToCart() {
    const config = buildConfig();
    if (!config) return;
    cart.addItem({
      productId: detail.id,
      variantId: detail.variants ? variantId : undefined,
      config,
    });
    setAdded(true);
    window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setAdded(false), 6000);
  }


  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pb-52 pt-20 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <button
            type="button"
            onClick={() => router.history.back()}
            className="inline-flex items-center gap-2 text-[12.5px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} />
            Kembali
          </button>

          <nav aria-label="Breadcrumb" className="mt-4">
            <ol className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {detail.breadcrumb.map((crumb, i) => (
                <li key={crumb} className="flex items-center gap-2">
                  {i > 0 ? <span className="text-muted-foreground/40">/</span> : null}
                  <span className={i === detail.breadcrumb.length - 1 ? "text-foreground/80" : ""}>
                    {crumb}
                  </span>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <MediaGallery images={detail.gallery} alt={detail.name} soldOut={!!detail.soldOut} />
            </div>

            <div className="mt-8 lg:mt-0">
              {/* Identity */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  {detail.official ? (
                    <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-[3px] text-[9.5px] font-medium uppercase tracking-[0.2em] text-primary">
                      Orphic Official
                    </span>
                  ) : null}
                  <h1 className="orphic-display mt-3 text-[1.55rem] leading-tight text-foreground md:text-[2.1rem]">
                    {detail.name}
                  </h1>
                  <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
                    {detail.tagline}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setLoved((v) => !v)}
                  aria-label={loved ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                  aria-pressed={loved}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-hairline text-foreground/75 transition-colors duration-300 hover:text-foreground"
                >
                  <Heart
                    className={`size-[18px] transition-colors duration-300 ${
                      loved ? "fill-destructive text-destructive" : ""
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 text-foreground/85">
                  <Star className="size-[14px] fill-primary text-primary" strokeWidth={1.5} />
                  {detail.rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span>{detail.reviews} ulasan</span>
                <span className="text-muted-foreground/40">·</span>
                <span>{detail.sold}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className={detail.soldOut ? "text-destructive" : "text-seller-foreground"}>
                  {detail.status}
                </span>
              </div>

              {/* Price */}
              <div className="mt-8 border-y border-hairline py-6">
                <div className="flex flex-wrap items-baseline gap-3">
                  <p className="orphic-display text-[2rem] text-foreground md:text-[2.35rem]">
                    {price}
                  </p>
                  {detail.oldPrice && !variant ? (
                    <span className="text-[13px] text-muted-foreground line-through">
                      {detail.oldPrice}
                    </span>
                  ) : null}
                  {detail.promo && !variant ? (
                    <span className="rounded-full border border-hairline px-2.5 py-[3px] text-[10.5px] uppercase tracking-[0.16em] text-primary">
                      {detail.promo}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-[12px] text-muted-foreground">{detail.priceNote}</p>
                {detail.stock ? (
                  <p className="mt-1 text-[12px] text-muted-foreground/80">{detail.stock}</p>
                ) : null}
              </div>

              {/* Variants */}
              {detail.variants && !detail.soldOut ? (
                <section className="mt-8">
                  <p className="orphic-eyebrow">{detail.variants.label}</p>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {detail.variants.options.map((option) => {
                      const selected = option.id === variantId;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setVariantId(option.id)}
                          aria-pressed={selected}
                          className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors duration-300 active:scale-[0.995] ${
                            selected
                              ? "border-primary/55 bg-primary/[0.07]"
                              : "border-hairline hover:border-foreground/20"
                          }`}
                        >
                          <span>
                            <span className="block text-[13.5px] text-foreground">
                              {option.name}
                            </span>
                            {option.note ? (
                              <span className="mt-0.5 block text-[11.5px] text-muted-foreground">
                                {option.note}
                              </span>
                            ) : null}
                          </span>
                          <span className="shrink-0 text-[12.5px] text-foreground/85">
                            {option.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {detail.variants.hint ? (
                    <p className="mt-3 text-[11.5px] text-muted-foreground/80">
                      {detail.variants.hint}
                    </p>
                  ) : null}
                </section>
              ) : null}

              {/* Top Up account fields */}
              {needsId && !detail.soldOut ? (
                <section className="mt-8">
                  <p className="orphic-eyebrow">Data pemain</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[11.5px] text-muted-foreground">User ID</span>
                      <input
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        inputMode="numeric"
                        placeholder="123456789"
                        className="mt-2 w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-[14px] text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/60 focus:border-primary/50"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11.5px] text-muted-foreground">Server</span>
                      <input
                        value={server}
                        onChange={(e) => setServer(e.target.value)}
                        inputMode="numeric"
                        placeholder="1234"
                        className="mt-2 w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-[14px] text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/60 focus:border-primary/50"
                      />
                    </label>
                  </div>
                </section>
              ) : null}

              {/* Seller / provider */}
              <section className="mt-8 border-t border-hairline pt-6">
                {detail.official ? (
                  <div>
                    <p className="orphic-eyebrow">Penyedia</p>
                    <p className="mt-3 text-[14px] text-foreground">Orphic Official</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">
                      Layanan resmi yang dijalankan langsung oleh Orphic.
                    </p>
                    {detail.promotedBy ? (
                      <p className="mt-3 text-[11.5px] text-muted-foreground/80">
                        Dipromosikan oleh {detail.promotedBy}
                      </p>
                    ) : null}
                  </div>
                ) : detail.seller ? (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="orphic-eyebrow">Penjual</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[14px] text-foreground">{detail.seller.handle}</span>
                        <SellerSignature />
                      </div>
                      <p className="mt-1.5 text-[12px] text-muted-foreground">
                        {detail.seller.since} · {detail.seller.response}
                      </p>
                    </div>
                    <Link
                      to="/search"
                      className="shrink-0 rounded-full border border-hairline px-4 py-2 text-[12px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                      Lihat toko
                    </Link>
                  </div>
                ) : null}
              </section>

              {/* Orphic Protected */}
              <section className="mt-6 flex items-start gap-3 border-t border-hairline pt-6">
                <ShieldCheck className="mt-0.5 size-[17px] shrink-0 text-primary" strokeWidth={1.5} />
                <div>
                  <p className="text-[13px] text-foreground">Orphic Protected</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                    {detail.protectedNote}
                  </p>
                </div>
              </section>

              {/* Fulfillment */}
              <section className="mt-6 border-t border-hairline pt-6">
                <p className="orphic-eyebrow">Pengiriman</p>
                <p className="mt-3 text-[13.5px] text-foreground">{detail.fulfillment.title}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                  {detail.fulfillment.body}
                </p>
              </section>

              {/* Attributes */}
              <section className="mt-6 border-t border-hairline pt-6">
                <p className="orphic-eyebrow">Informasi produk</p>
                <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {detail.attributes.map((attr) => (
                    <div
                      key={attr.label}
                      className="flex items-baseline justify-between gap-4 border-b border-hairline/70 pb-2.5"
                    >
                      <dt className="text-[12px] text-muted-foreground">{attr.label}</dt>
                      <dd className="text-right text-[12.5px] text-foreground/90">{attr.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* Purchase (desktop) */}
              <div className="mt-8 hidden md:block">
                <PurchaseActions
                  detail={detail}
                  purchase={purchase}
                  onBuy={handleBuy}
                  onAddToCart={handleAddToCart}
                  added={added}
                  error={error}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mt-16 max-w-3xl">
            <p className="orphic-eyebrow">Deskripsi</p>
            <div className="mt-5 divide-y divide-hairline border-y border-hairline">
              {detail.sections.map((section, i) => {
                const open = openSection === i;
                return (
                  <div key={section.title}>
                    <button
                      type="button"
                      onClick={() => setOpenSection(open ? -1 : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    >
                      <span className="text-[14px] text-foreground">{section.title}</span>
                      <ChevronDown
                        className={`size-[16px] shrink-0 text-muted-foreground transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>
                    {open ? (
                      <div className="space-y-3 pb-5">
                        {section.body.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Reviews */}
          <section className="mt-16 max-w-3xl">
            <p className="orphic-eyebrow">Ulasan</p>
            <div className="mt-5 flex flex-col gap-8 sm:flex-row sm:items-center">
              <div>
                <p className="orphic-display text-[2.4rem] text-foreground">
                  {detail.rating.toFixed(1)}
                </p>
                <div className="mt-1.5 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-[13px] ${
                        i < Math.round(detail.rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/40"
                      }`}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <p className="mt-2 text-[11.5px] text-muted-foreground">
                  {detail.reviews} ulasan pembeli
                </p>
              </div>

              <div className="flex-1 space-y-1.5">
                {detail.ratingBreakdown.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <span className="w-3 text-[11px] text-muted-foreground">{row.stars}</span>
                    <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-surface">
                      <span
                        className="block h-full rounded-full bg-primary/70"
                        style={{ width: `${row.percent}%` }}
                      />
                    </span>
                    <span className="w-8 text-right text-[11px] text-muted-foreground/70">
                      {row.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ul className="mt-8 divide-y divide-hairline border-t border-hairline">
              {detail.reviewList.map((review) => (
                <li key={review.name + review.date} className="py-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-surface text-[11px] tracking-[0.08em] text-foreground/80">
                      {review.initials}
                    </span>
                    <div>
                      <p className="text-[13px] text-foreground">{review.name}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Star
                            className="size-[11px] fill-primary text-primary"
                            strokeWidth={1.5}
                          />
                          {review.rating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground/40">·</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                    {review.body}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] text-muted-foreground/60">
              Ulasan pada prototipe ini adalah data contoh, bukan aktivitas pembeli sungguhan.
            </p>
          </section>

          {/* Related */}
          {related.length ? (
            <section className="mt-16">
              <p className="orphic-eyebrow">Mungkin relevan</p>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-8">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    to="/product/$id"
                    params={{ id: item.id }}
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-card">
                      <img
                        src={item.gallery[0]}
                        alt={item.name}
                        loading="lazy"
                        width={640}
                        height={640}
                        className={`size-full object-cover transition-transform duration-700 ease-[var(--ease-orphic)] group-hover:scale-[1.03] ${
                          item.soldOut ? "opacity-45 saturate-50" : ""
                        }`}
                      />
                      {item.soldOut ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="orphic-glass rounded-full px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/90">
                            Sold Out
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-[13px] leading-snug text-foreground">
                      {item.name}
                    </h3>
                    <p className="orphic-display mt-1.5 text-[14px] tracking-normal text-foreground">
                      {item.price}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      {/* Sticky purchase (mobile) */}
      <div className="fixed inset-x-0 bottom-[5.5rem] z-30 px-4 md:hidden">
        <div className="orphic-glass rounded-3xl px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="orphic-display truncate text-[17px] tracking-normal text-foreground">
                {detail.soldOut ? "Tidak tersedia" : price}
              </p>
              <p className="truncate text-[10.5px] text-muted-foreground">
                {detail.soldOut ? "Produk sudah terjual" : detail.fulfillment.title}
              </p>
            </div>
            <PurchaseActions
              detail={detail}
              purchase={purchase}
              onBuy={handleBuy}
              onAddToCart={handleAddToCart}
              added={added}
              error=""
              compact
            />
          </div>
          {error ? <p className="mt-2 text-[11px] text-destructive">{error}</p> : null}
          {added ? (
            <div
              role="status"
              className="mt-3 flex items-center justify-between gap-3 border-t border-hairline pt-3"
            >
              <p className="min-w-0 truncate text-[11.5px] text-foreground/85">
                Ditambahkan — {detail.name}
              </p>
              <Link
                to="/cart"
                className="shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-[11.5px] font-medium text-primary-foreground"
              >
                Lihat Keranjang
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      </div>

      <BottomNav />
    </div>
  );
}

function PurchaseActions({
  detail,
  purchase,
  onBuy,
  onAddToCart,
  added = false,
  error,
  compact = false,
}: {
  detail: ProductDetail;
  purchase: "idle" | "loading" | "done";
  onBuy: () => void;
  onAddToCart: () => void;
  added?: boolean;
  error: string;
  compact?: boolean;
}) {
  if (detail.soldOut) {
    if (compact) {
      return (
        <span className="shrink-0 rounded-full border border-hairline px-5 py-3 text-[12.5px] text-muted-foreground">
          Sold Out
        </span>
      );
    }
    return (
      <div className="border-t border-hairline pt-6">
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-full border border-hairline px-6 py-4 text-[13.5px] text-muted-foreground"
        >
          Produk sudah terjual
        </button>
        <p className="mt-3 text-[12px] text-muted-foreground">
          Aktifkan wishlist untuk mendapat kabar bila penjual menyediakan akun serupa.
        </p>
      </div>
    );
  }

  const label =
    purchase === "done" ? "Ke checkout" : purchase === "loading" ? "Memproses" : "Beli Sekarang";

  const button = (
    <button
      type="button"
      onClick={onBuy}
      disabled={purchase === "loading"}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 text-[13.5px] font-medium transition-colors duration-300 ${
        compact ? "shrink-0 py-3" : "w-full py-4"
      } ${
        purchase === "done"
          ? "bg-seller/20 text-seller-foreground"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {purchase === "loading" ? <Loader2 className="size-4 animate-spin" strokeWidth={1.5} /> : null}
      {purchase === "done" ? <Check className="size-4" strokeWidth={1.5} /> : null}
      {label}
    </button>
  );

  if (compact) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        {detail.actions.includes("cart") ? (
          <button
            type="button"
            onClick={onAddToCart}
            aria-label="Tambah ke Keranjang"
            className={`flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
              added
                ? "border-seller/40 text-seller-foreground"
                : "border-hairline text-foreground/85 hover:border-foreground/25"
            }`}
          >
            {added ? (
              <Check className="size-[18px]" strokeWidth={1.5} />
            ) : (
              <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
            )}
          </button>
        ) : null}
        {button}
      </div>
    );
  }


  return (
    <div className="border-t border-hairline pt-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">{button}</div>
        {detail.actions.includes("cart") ? (
          <button
            type="button"
            onClick={onAddToCart}
            className="rounded-full border border-hairline px-6 py-4 text-[13.5px] text-foreground/85 transition-colors duration-300 hover:border-foreground/25"
          >
            Tambah ke Keranjang
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-3 text-[12px] text-destructive">{error}</p> : null}
      {added ? (
        <div
          role="status"
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface px-4 py-3"
        >
          <p className="text-[12.5px] text-foreground/85">
            <span className="text-seller-foreground">Ditambahkan</span> — {detail.name}
          </p>
          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="rounded-full bg-primary px-4 py-2 text-[12px] font-medium text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
            >
              Lihat Keranjang
            </Link>
            <Link
              to="/search"
              className="rounded-full border border-hairline px-4 py-2 text-[12px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
