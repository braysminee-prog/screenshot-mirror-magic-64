import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Check, Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import { SellerSignature } from "@/components/orphic/seller-signature";
import { CheckoutSteps } from "@/components/orphic/cart/checkout-steps";
import { OrderSummary } from "@/components/orphic/cart/order-summary";
import { buildSummary, formatRupiah, useCart, type ResolvedItem } from "@/lib/orphic-cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Keranjang — Orphic" },
      {
        name: "description",
        content:
          "Tinjau produk digital pilihanmu, atur konfigurasi dan jumlah, lalu lanjut ke checkout Orphic.",
      },
      { property: "og:title", content: "Keranjang — Orphic" },
      {
        property: "og:description",
        content: "Tinjau produk, konfigurasi, dan ringkasan biaya sebelum checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [attempted, setAttempted] = useState(false);

  const groups = useMemo(() => {
    const map = new Map<string, ResolvedItem[]>();
    for (const r of cart.resolved) {
      const list = map.get(r.ownerKey) ?? [];
      list.push(r);
      map.set(r.ownerKey, list);
    }
    // Official first, then sellers.
    return [...map.entries()].sort(([a], [b]) =>
      a === "official" ? -1 : b === "official" ? 1 : a.localeCompare(b),
    );
  }, [cart.resolved]);

  const selected = cart.resolved.filter((r) => r.item.selected);
  const validSelected = selected.filter((r) => !r.issue);
  const blockedSelected = selected.filter((r) => r.issue);
  const summary = buildSummary(validSelected, cart.voucherCode);

  const canContinue = validSelected.length > 0 && blockedSelected.length === 0;

  const blockReason =
    cart.resolved.length === 0
      ? "Keranjang masih kosong."
      : selected.length === 0
        ? "Pilih dulu produk yang ingin dibayar."
        : validSelected.length === 0
          ? "Produk yang dipilih belum bisa dilanjutkan. Perbaiki atau hapus item bertanda."
          : blockedSelected.length > 0
            ? "Ada item terpilih yang belum valid. Perbaiki atau hapus dulu."
            : "";

  function handleContinue() {
    setAttempted(true);
    if (!canContinue) return;
    cart.setDirectItemKey(null);
    navigate({ to: "/checkout" });
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pb-52 pt-20 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <p className="orphic-eyebrow">Keranjang</p>
          <h1 className="orphic-display mt-3 text-[1.7rem] leading-tight text-foreground md:text-[2.3rem]">
            Tinjau sebelum lanjut
          </h1>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
            Periksa produk, konfigurasi, dan penjual. Hanya item terpilih yang dibawa ke checkout.
          </p>

          <div className="mt-8">
            <CheckoutSteps current="cart" />
          </div>

          {cart.resolved.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-16">
              <div>
                <div className="flex items-center justify-between border-b border-hairline pb-4">
                  <button
                    type="button"
                    onClick={() => cart.selectAll(selected.length !== cart.resolved.length)}
                    className="inline-flex items-center gap-2.5 text-[12.5px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    <span
                      className={`flex size-[18px] items-center justify-center rounded-[6px] border transition-colors duration-300 ${
                        selected.length === cart.resolved.length
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-hairline"
                      }`}
                    >
                      {selected.length === cart.resolved.length ? (
                        <Check className="size-3" strokeWidth={2} />
                      ) : null}
                    </span>
                    Pilih semua
                  </button>
                  <span className="text-[12px] text-muted-foreground/80">
                    {selected.length} dari {cart.resolved.length} dipilih
                  </span>
                </div>

                <div className="divide-y divide-hairline">
                  {groups.map(([ownerKey, items]) => (
                    <section key={ownerKey} className="py-8">
                      <div className="flex items-center gap-2">
                        {items[0]!.official ? (
                          <>
                            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-[3px] text-[9.5px] font-medium uppercase tracking-[0.2em] text-primary">
                              Orphic Official
                            </span>
                            {items[0]!.promotedBy ? (
                              <span className="text-[11px] text-muted-foreground/80">
                                Dipromosikan oleh {items[0]!.promotedBy}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <>
                            <span className="text-[13.5px] text-foreground">
                              {items[0]!.ownerLabel}
                            </span>
                            <SellerSignature />
                          </>
                        )}
                      </div>

                      <ul className="mt-5 space-y-8">
                        {items.map((r) => (
                          <CartLine key={r.item.key} r={r} />
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>

              <aside className="mt-12 lg:mt-0">
                <div className="lg:sticky lg:top-28">
                  <OrderSummary
                    summary={summary}
                    itemCount={validSelected.length}
                    voucherCode={cart.voucherCode}
                    onVoucherChange={cart.setVoucherCode}
                    editableVoucher
                  />

                  <div className="mt-6 flex items-start gap-3 border-t border-hairline pt-6">
                    <ShieldCheck
                      className="mt-0.5 size-[17px] shrink-0 text-primary"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-[13px] text-foreground">Orphic Protected</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                        Pembayaran ditahan Orphic sampai produk diterima sesuai deskripsi.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 hidden md:block">
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={!canContinue}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[13.5px] font-medium transition-colors duration-300 ${
                        canContinue
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "cursor-not-allowed border border-hairline text-muted-foreground"
                      }`}
                    >
                      Lanjut ke Checkout
                      <ArrowRight className="size-4" strokeWidth={1.5} />
                    </button>
                    {!canContinue ? (
                      <p className="mt-3 text-[12px] text-muted-foreground">{blockReason}</p>
                    ) : null}
                    {attempted && !canContinue ? (
                      <p className="mt-2 text-[12px] text-destructive">
                        Checkout belum bisa dilanjutkan.
                      </p>
                    ) : null}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      {cart.resolved.length > 0 ? (
        <div className="fixed inset-x-0 bottom-[5.5rem] z-30 px-4 md:hidden">
          <div className="orphic-glass rounded-3xl px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10.5px] text-muted-foreground">Total</p>
                <p className="orphic-display truncate text-[17px] tracking-normal text-foreground">
                  {formatRupiah(summary.total)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className={`shrink-0 rounded-full px-5 py-3 text-[12.5px] font-medium transition-colors duration-300 ${
                  canContinue
                    ? "bg-primary text-primary-foreground"
                    : "cursor-not-allowed border border-hairline text-muted-foreground"
                }`}
              >
                Checkout
              </button>
            </div>
            {!canContinue ? (
              <p className="mt-2 text-[11px] text-muted-foreground">{blockReason}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <BottomNav />
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="mt-16 max-w-md border-t border-hairline pt-10">
      <p className="orphic-display text-[1.35rem] text-foreground">Keranjang masih kosong</p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
        Belum ada produk yang ditambahkan. Jelajahi katalog Orphic untuk menemukan produk digital
        yang kamu butuhkan.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          to="/"
          className="rounded-full bg-primary px-6 py-3.5 text-[13px] font-medium text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
        >
          Kembali ke Beranda
        </Link>
        <Link
          to="/search"
          className="rounded-full border border-hairline px-6 py-3.5 text-[13px] text-foreground/85 transition-colors duration-300 hover:border-foreground/25"
        >
          Jelajahi produk
        </Link>
      </div>
    </div>
  );
}

function CartLine({ r }: { r: ResolvedItem }) {
  const cart = useCart();
  const { detail, item } = r;
  const disabled = r.issue === "sold-out" || r.issue === "unavailable";

  return (
    <li className="flex gap-4">
      <button
        type="button"
        onClick={() => cart.setSelected(item.key, !item.selected)}
        disabled={disabled}
        aria-pressed={item.selected}
        aria-label={item.selected ? `Batal pilih ${detail.name}` : `Pilih ${detail.name}`}
        className={`mt-1 flex size-[18px] shrink-0 items-center justify-center rounded-[6px] border transition-colors duration-300 ${
          disabled
            ? "cursor-not-allowed border-hairline opacity-40"
            : item.selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-hairline hover:border-foreground/30"
        }`}
      >
        {item.selected && !disabled ? <Check className="size-3" strokeWidth={2} /> : null}
      </button>

      <Link
        to="/product/$id"
        params={{ id: detail.id }}
        className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-card md:size-24"
      >
        <img
          src={detail.gallery[0]}
          alt={detail.name}
          loading="lazy"
          width={200}
          height={200}
          className={`size-full object-cover ${detail.soldOut ? "opacity-45 saturate-50" : ""}`}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          {detail.breadcrumb[detail.breadcrumb.length - 1]}
        </p>
        <Link
          to="/product/$id"
          params={{ id: detail.id }}
          className="mt-1 block text-[13.5px] leading-snug text-foreground transition-colors duration-300 hover:text-primary md:text-[14.5px]"
        >
          {detail.name}
        </Link>

        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-muted-foreground">
          {r.variantName ? (
            <div className="flex gap-1.5">
              <dt className="text-muted-foreground/70">{detail.variants?.label ?? "Varian"}:</dt>
              <dd className="text-foreground/85">{r.variantName}</dd>
            </div>
          ) : null}
          {r.attributes.map((a) => (
            <div key={a.label} className="flex gap-1.5">
              <dt className="text-muted-foreground/70">{a.label}:</dt>
              <dd className="text-foreground/85">{a.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-2 text-[11.5px] text-muted-foreground/85">{detail.fulfillment.title}</p>

        {detail.requiresAccountId ? (
          <div className="mt-3 grid max-w-sm gap-2.5 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] text-muted-foreground">User ID</span>
              <input
                value={item.config.userId ?? ""}
                onChange={(e) => cart.updateConfig(item.key, { userId: e.target.value })}
                inputMode="numeric"
                placeholder="123456789"
                className="mt-1.5 w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/60 focus:border-primary/50"
              />
            </label>
            <label className="block">
              <span className="text-[11px] text-muted-foreground">Server</span>
              <input
                value={item.config.server ?? ""}
                onChange={(e) => cart.updateConfig(item.key, { server: e.target.value })}
                inputMode="numeric"
                placeholder="1234"
                className="mt-1.5 w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 text-[13px] text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/60 focus:border-primary/50"
              />
            </label>
          </div>
        ) : null}

        {r.issue ? (
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-hairline px-3.5 py-3">
            <AlertCircle
              className={`mt-0.5 size-[15px] shrink-0 ${
                r.issue === "invalid-config" ? "text-primary" : "text-destructive"
              }`}
              strokeWidth={1.5}
            />
            <div>
              <p className="text-[12px] text-foreground">
                {r.issue === "sold-out"
                  ? "Sold Out"
                  : r.issue === "unavailable"
                    ? "Tidak tersedia"
                    : "Konfigurasi belum lengkap"}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
                {r.issueText}
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
          <p className="orphic-display text-[15px] tracking-normal text-foreground">
            {formatRupiah(r.lineTotal)}
          </p>

          <div className="flex items-center gap-2">
            {r.quantitySupported ? (
              <div className="flex items-center gap-1 rounded-full border border-hairline px-1 py-1">
                <button
                  type="button"
                  onClick={() => cart.setQuantity(item.key, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Kurangi jumlah"
                  className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 hover:text-foreground disabled:opacity-40"
                >
                  <Minus className="size-3.5" strokeWidth={1.5} />
                </button>
                <span className="min-w-5 text-center text-[12.5px] text-foreground">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => cart.setQuantity(item.key, item.quantity + 1)}
                  aria-label="Tambah jumlah"
                  className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  <Plus className="size-3.5" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <span className="rounded-full border border-hairline px-3 py-1.5 text-[11px] text-muted-foreground">
                {detail.kind === "game-account" ? "Listing unik · 1" : "Jumlah tetap 1"}
              </span>
            )}

            <Link
              to="/product/$id"
              params={{ id: detail.id }}
              className="rounded-full border border-hairline px-3.5 py-1.5 text-[11.5px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              Ubah
            </Link>

            <button
              type="button"
              onClick={() => cart.removeItem(item.key)}
              aria-label={`Hapus ${detail.name} dari keranjang`}
              className="flex size-8 items-center justify-center rounded-full border border-hairline text-muted-foreground transition-colors duration-300 hover:text-destructive"
            >
              <Trash2 className="size-[14px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
