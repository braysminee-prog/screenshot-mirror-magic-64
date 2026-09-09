import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { BackButton } from "@/components/orphic/back-button";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import { SellerSignature } from "@/components/orphic/seller-signature";
import { CheckoutSteps } from "@/components/orphic/cart/checkout-steps";
import { OrderSummary } from "@/components/orphic/cart/order-summary";
import { buildSummary, formatRupiah, useCart, type ResolvedItem } from "@/lib/orphic-cart";

const paymentMethods = [
  { id: "wallet", label: "Dompet Orphic", note: "Saldo tidak dipotong pada prototipe", icon: Wallet },
  { id: "va", label: "Virtual Account", note: "BCA · BNI · Mandiri", icon: CreditCard },
  { id: "qris", label: "QRIS", note: "Semua aplikasi pembayaran", icon: CreditCard },
];

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Orphic" },
      {
        name: "description",
        content:
          "Tinjau item terpilih, konfigurasi, diskon, dan total sebelum melanjutkan ke tahap pembayaran Orphic.",
      },
      { property: "og:title", content: "Checkout — Orphic" },
      {
        property: "og:description",
        content: "Tinjau pesanan dan metode pembayaran sebelum tahap pembayaran.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState("wallet");
  const [attempted, setAttempted] = useState(false);

  const items = useMemo(() => {
    if (cart.directItemKey) {
      const direct = cart.resolved.find((r) => r.item.key === cart.directItemKey);
      if (direct) return [direct];
    }
    return cart.resolved.filter((r) => r.item.selected);
  }, [cart.resolved, cart.directItemKey]);

  const valid = items.filter((r) => !r.issue);
  const blocked = items.filter((r) => r.issue);
  const summary = buildSummary(valid, cart.voucherCode);
  const canPay = valid.length > 0 && blocked.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pb-52 pt-20 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <BackButton fallback="/cart" label="Kembali" />

          <p className="orphic-eyebrow mt-6">Checkout</p>
          <h1 className="orphic-display mt-3 text-[1.7rem] leading-tight text-foreground md:text-[2.3rem]">
            Tinjau pesanan
          </h1>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
            Ini bukan halaman pembayaran. Periksa detail pesanan sebelum masuk ke tahap pembayaran.
          </p>

          <div className="mt-8">
            <CheckoutSteps current="checkout" />
          </div>

          {items.length === 0 ? (
            <div className="mt-16 max-w-md border-t border-hairline pt-10">
              <p className="orphic-display text-[1.35rem] text-foreground">
                Tidak ada item untuk checkout
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                Pilih dulu produk di keranjang sebelum melanjutkan.
              </p>
              <Link
                to="/cart"
                className="mt-7 inline-block rounded-full bg-primary px-6 py-3.5 text-[13px] font-medium text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
              >
                Buka keranjang
              </Link>
            </div>
          ) : (
            <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-16">
              <div>
                <section>
                  <p className="orphic-eyebrow">Item terpilih</p>
                  <ul className="mt-5 divide-y divide-hairline border-y border-hairline">
                    {items.map((r) => (
                      <ReviewLine key={r.item.key} r={r} />
                    ))}
                  </ul>
                </section>

                {blocked.length ? (
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/40 px-4 py-3.5">
                    <AlertCircle
                      className="mt-0.5 size-[16px] shrink-0 text-destructive"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-[12.5px] text-foreground">
                        {blocked.length} item belum bisa dilanjutkan
                      </p>
                      <ul className="mt-1.5 space-y-1 text-[11.5px] text-muted-foreground">
                        {blocked.map((r) => (
                          <li key={r.item.key}>
                            {r.detail.name} — {r.issueText}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/cart"
                        className="mt-3 inline-block rounded-full border border-hairline px-4 py-2 text-[11.5px] text-foreground/85 transition-colors duration-300 hover:border-foreground/25"
                      >
                        Perbaiki di keranjang
                      </Link>
                    </div>
                  </div>
                ) : null}

                <section className="mt-12">
                  <p className="orphic-eyebrow">Metode pembayaran</p>
                  <p className="mt-2.5 text-[12px] text-muted-foreground">
                    Ditampilkan sebagai gambaran tahap berikutnya. Tidak ada pembayaran nyata dan
                    saldo Dompet tidak dipotong.
                  </p>
                  <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
                    {paymentMethods.map(({ id, label, note, icon: Icon }) => {
                      const selected = id === method;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setMethod(id)}
                          aria-pressed={selected}
                          className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors duration-300 ${
                            selected
                              ? "border-primary/55 bg-primary/[0.07]"
                              : "border-hairline hover:border-foreground/20"
                          }`}
                        >
                          <Icon
                            className="mt-0.5 size-[16px] shrink-0 text-muted-foreground"
                            strokeWidth={1.5}
                          />
                          <span>
                            <span className="block text-[13px] text-foreground">{label}</span>
                            <span className="mt-0.5 block text-[11px] text-muted-foreground">
                              {note}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              <aside className="mt-12 lg:mt-0">
                <div className="lg:sticky lg:top-28">
                  <OrderSummary
                    summary={summary}
                    itemCount={valid.length}
                    voucherCode={cart.voucherCode}
                    onVoucherChange={cart.setVoucherCode}
                  />

                  <div className="mt-6 flex items-start gap-3 border-t border-hairline pt-6">
                    <ShieldCheck
                      className="mt-0.5 size-[17px] shrink-0 text-primary"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-[13px] text-foreground">Orphic Protected</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                        Dana ditahan sampai produk diterima sesuai deskripsi. Jika gagal, dana
                        dikembalikan.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 hidden md:block">
                    <ContinueButton
                      canPay={canPay}
                      attempted={attempted}
                      onClick={() => {
                        setAttempted(true);
                        if (!canPay) return;
                        navigate({ to: "/orders" });
                      }}
                    />
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      {items.length > 0 ? (
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
                onClick={() => {
                  setAttempted(true);
                  if (!canPay) return;
                  navigate({ to: "/orders" });
                }}
                disabled={!canPay}
                className={`shrink-0 rounded-full px-5 py-3 text-[12.5px] font-medium transition-colors duration-300 ${
                  canPay
                    ? "bg-primary text-primary-foreground"
                    : "cursor-not-allowed border border-hairline text-muted-foreground"
                }`}
              >
                Ke Pembayaran
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {canPay
                ? "Tahap pembayaran belum tersedia pada prototipe ini."
                : "Perbaiki item bermasalah di keranjang."}
            </p>
          </div>
        </div>
      ) : null}

      <BottomNav />
    </div>
  );
}

function ContinueButton({
  canPay,
  attempted,
  onClick,
}: {
  canPay: boolean;
  attempted: boolean;
  onClick: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={!canPay}
        className={`w-full rounded-full px-6 py-4 text-[13.5px] font-medium transition-colors duration-300 ${
          canPay
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "cursor-not-allowed border border-hairline text-muted-foreground"
        }`}
      >
        Lanjut ke Pembayaran
      </button>
      <p className="mt-3 text-[12px] text-muted-foreground">
        {canPay
          ? "Pembayaran adalah tahap berikutnya dan belum dibangun pada prototipe ini."
          : "Ada item yang belum valid. Perbaiki dulu di keranjang."}
      </p>
      {attempted && canPay ? (
        <p className="mt-2 text-[12px] text-seller-foreground">
          Prototipe: tahap pembayaran belum aktif.
        </p>
      ) : null}
    </div>
  );
}

function ReviewLine({ r }: { r: ResolvedItem }) {
  const { detail, item } = r;

  return (
    <li className="flex gap-4 py-6">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-card">
        <img
          src={detail.gallery[0]}
          alt={detail.name}
          loading="lazy"
          width={160}
          height={160}
          className="size-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {r.official ? (
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-[3px] text-[9.5px] font-medium uppercase tracking-[0.2em] text-primary">
              Orphic Official
            </span>
          ) : (
            <>
              <span className="text-[12px] text-muted-foreground">{r.ownerLabel}</span>
              <SellerSignature />
            </>
          )}
          {r.official && r.promotedBy ? (
            <span className="text-[11px] text-muted-foreground/80">
              Dipromosikan oleh {r.promotedBy}
            </span>
          ) : null}
        </div>

        <p className="mt-2 text-[13.5px] leading-snug text-foreground">{detail.name}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          {detail.breadcrumb[detail.breadcrumb.length - 1]}
        </p>

        <dl className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-muted-foreground">
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
          {detail.requiresAccountId ? (
            <>
              <div className="flex gap-1.5">
                <dt className="text-muted-foreground/70">User ID:</dt>
                <dd className="text-foreground/85">{item.config.userId || "—"}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-muted-foreground/70">Server:</dt>
                <dd className="text-foreground/85">{item.config.server || "—"}</dd>
              </div>
            </>
          ) : null}
          {r.quantitySupported ? (
            <div className="flex gap-1.5">
              <dt className="text-muted-foreground/70">Jumlah:</dt>
              <dd className="text-foreground/85">{item.quantity}</dd>
            </div>
          ) : null}
        </dl>

        <p className="mt-2 text-[11.5px] text-muted-foreground/85">
          {detail.fulfillment.title} — {detail.fulfillment.body}
        </p>

        <p className="orphic-display mt-3 text-[14.5px] tracking-normal text-foreground">
          {formatRupiah(r.lineTotal)}
        </p>
      </div>
    </li>
  );
}
