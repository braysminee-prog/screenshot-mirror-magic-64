import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { BackButton } from "@/components/orphic/back-button";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import { OrderCard, OrderCardSkeleton } from "@/components/orphic/orders/order-card";
import { filterOrders, orderFilters, orders, type OrderFilter } from "@/lib/orphic-orders";

const title = "Pesanan — Orphic";
const description =
  "Lihat status pesanan digital kamu di Orphic: produk digital, jasa, VPS, akun game, top up, membership, dan lisensi.";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

type LoadState = "loading" | "ready" | "error";

function OrdersPage() {
  const [state, setState] = useState<LoadState>("loading");
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [attempt, setAttempt] = useState(0);
  const [forceError, setForceError] = useState(false);

  useEffect(() => {
    setState("loading");
    const timer = setTimeout(() => setState(forceError ? "error" : "ready"), 450);
    return () => clearTimeout(timer);
  }, [attempt, forceError]);

  const visible = useMemo(() => filterOrders(orders, filter), [filter]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        orderFilters.map((f) => [f.key, filterOrders(orders, f.key).length]),
      ) as Record<OrderFilter, number>,
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pb-28 pt-20 md:pt-28">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <BackButton fallback="/" label="Kembali" />

          <p className="orphic-eyebrow mt-6">Pesanan</p>
          <h1 className="orphic-display mt-3 text-[1.7rem] leading-tight text-foreground md:text-[2.3rem]">
            Riwayat pembelian
          </h1>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
            Semua pesanan pada prototipe ini adalah data contoh. Tidak ada pemenuhan, pembayaran,
            atau pengiriman nyata.
          </p>

          <div className="mt-8 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
            <div
              role="tablist"
              aria-label="Filter pesanan"
              className="flex w-max gap-2 md:w-auto md:flex-wrap"
            >
              {orderFilters.map((f) => {
                const active = f.key === filter;
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(f.key)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-[12px] transition-colors duration-300 ${
                      active
                        ? "border-primary/55 bg-primary/[0.07] text-primary"
                        : "border-hairline text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                    }`}
                  >
                    {f.label}
                    <span className="ml-1.5 text-[10.5px] text-muted-foreground/70">
                      {counts[f.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-hairline px-4 py-3.5">
            <ShieldCheck className="mt-0.5 size-[16px] shrink-0 text-primary" strokeWidth={1.5} />
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              <span className="text-foreground">Orphic Protected</span> — setiap pesanan dipantau
              sampai produk diterima sesuai deskripsi.
            </p>
          </div>

          {state === "loading" ? (
            <ul className="mt-6 border-t border-hairline">
              {[0, 1, 2].map((i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </ul>
          ) : state === "error" ? (
            <div className="mt-10 max-w-md border-t border-hairline pt-10">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="mt-0.5 size-[17px] shrink-0 text-destructive"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="orphic-display text-[1.2rem] text-foreground">
                    Pesanan gagal dimuat
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    Terjadi gangguan saat memuat daftar pesanan. Coba muat ulang.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForceError(false);
                      setAttempt((a) => a + 1);
                    }}
                    className="mt-6 rounded-full bg-primary px-6 py-3.5 text-[13px] font-medium text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
                  >
                    Coba lagi
                  </button>
                </div>
              </div>
            </div>
          ) : visible.length === 0 ? (
            <div className="mt-10 max-w-md border-t border-hairline pt-10">
              <p className="orphic-display text-[1.35rem] text-foreground">Belum ada pesanan</p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                Tidak ada pesanan pada filter ini. Coba filter lain atau jelajahi produk Orphic.
              </p>
              <Link
                to="/search"
                className="mt-7 inline-block rounded-full bg-primary px-6 py-3.5 text-[13px] font-medium text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
              >
                Jelajahi produk
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-6 border-t border-hairline">
                {visible.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  setForceError(true);
                  setAttempt((a) => a + 1);
                }}
                className="mt-8 text-[11px] text-muted-foreground/60 transition-colors duration-300 hover:text-muted-foreground"
              >
                Simulasi gagal memuat (prototipe)
              </button>
            </>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
