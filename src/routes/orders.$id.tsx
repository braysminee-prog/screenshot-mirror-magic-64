import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { BackButton } from "@/components/orphic/back-button";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import { OrderStatusBadge, OwnerLine } from "@/components/orphic/orders/order-status-badge";
import {
  formatRupiah,
  getOrder,
  type Order,
  type OrderAction,
  type OrderStage,
} from "@/lib/orphic-orders";

export const Route = createFileRoute("/orders/$id")({
  loader: ({ params }) => {
    const order = getOrder(params.id);
    if (!order) throw notFound();
    return { order };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Pesanan tidak ditemukan — Orphic" }, { name: "robots", content: "noindex" }],
      };
    }
    const t = `Pesanan ${loaderData.order.id} — Orphic`;
    const d = `${loaderData.order.items[0]!.name} · ${loaderData.order.status.label}`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  notFoundComponent: OrderNotFound,
  component: OrderDetailPage,
});

function OrderNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="pb-28 pt-20 md:pt-28">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <BackButton fallback="/orders" label="Kembali" />
          <p className="orphic-display mt-8 text-[1.4rem] text-foreground">
            Pesanan tidak ditemukan
          </p>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
            Nomor pesanan ini tidak ada pada data prototipe.
          </p>
          <Link
            to="/orders"
            className="mt-7 inline-block rounded-full bg-primary px-6 py-3.5 text-[13px] font-medium text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
          >
            Lihat semua pesanan
          </Link>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

function OrderDetailPage() {
  const { order } = Route.useLoaderData();
  const [note, setNote] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="pb-32 pt-20 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <BackButton fallback="/orders" label="Kembali" />

          <p className="orphic-eyebrow mt-6">Detail pesanan</p>
          <h1 className="orphic-display mt-3 text-[1.5rem] leading-tight text-foreground md:text-[2rem]">
            {order.id}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <OrderStatusBadge status={order.status} />
            <span className="text-[12px] text-muted-foreground">
              Dibeli {order.purchasedLabel}
            </span>
          </div>
          <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">
            {order.status.message}
          </p>

          <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16">
            <div>
              <section>
                <p className="orphic-eyebrow">Produk</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <OwnerLine
                    official={order.official}
                    sellerHandle={order.sellerHandle}
                    promotedBy={order.promotedBy}
                  />
                  {order.sellerName ? (
                    <span className="text-[11.5px] text-muted-foreground/80">
                      {order.sellerName}
                    </span>
                  ) : null}
                </div>

                <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
                  {order.items.map((item) => (
                    <li key={item.name} className="flex gap-4 py-6">
                      <div className="size-16 shrink-0 overflow-hidden rounded-2xl bg-card">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          width={160}
                          height={160}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] leading-snug text-foreground">{item.name}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                          {item.kindLabel}
                        </p>
                        <dl className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-muted-foreground">
                          {item.config.map((c) => (
                            <div key={c.label} className="flex gap-1.5">
                              <dt className="text-muted-foreground/70">{c.label}:</dt>
                              <dd className="text-foreground/85">{c.value}</dd>
                            </div>
                          ))}
                          <div className="flex gap-1.5">
                            <dt className="text-muted-foreground/70">Jumlah:</dt>
                            <dd className="text-foreground/85">{item.quantity}</dd>
                          </div>
                        </dl>
                        <div className="mt-3 flex items-center justify-between gap-4">
                          <span className="orphic-display text-[14px] tracking-normal text-foreground">
                            {formatRupiah(item.unitPrice * item.quantity)}
                          </span>
                          {item.productId ? (
                            <Link
                              to="/product/$id"
                              params={{ id: item.productId }}
                              className="text-[11.5px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                            >
                              Lihat produk
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-12">
                <p className="orphic-eyebrow">Progres</p>
                <ol className="mt-5 space-y-4">
                  {order.stages.map((stage) => (
                    <StageRow key={stage.label} stage={stage} />
                  ))}
                </ol>
              </section>

              <section className="mt-12">
                <p className="orphic-eyebrow">{order.fulfillment.title}</p>
                <dl className="mt-5 space-y-3 border-t border-hairline pt-5 text-[13px]">
                  {order.fulfillment.rows.map((row) => (
                    <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-3">
                      <dt className="text-muted-foreground">{row.label}</dt>
                      <dd className="text-foreground/90">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-[11.5px] leading-relaxed text-muted-foreground/80">
                  {order.fulfillment.note}
                </p>
              </section>

              {order.issue ? (
                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-destructive/40 px-4 py-3.5">
                  <AlertCircle
                    className="mt-0.5 size-[16px] shrink-0 text-destructive"
                    strokeWidth={1.5}
                  />
                  <p className="text-[12.5px] leading-relaxed text-foreground">{order.issue}</p>
                </div>
              ) : null}

              <section className="mt-12">
                <p className="orphic-eyebrow">Riwayat</p>
                <ol className="mt-5 space-y-4 border-l border-hairline pl-5">
                  {order.timeline.map((entry) => (
                    <li key={entry.label + entry.time} className="relative">
                      <span className="absolute -left-[23px] top-[6px] size-[7px] rounded-full bg-muted-foreground/50" />
                      <p className="text-[13px] text-foreground/90">{entry.label}</p>
                      <p className="mt-0.5 text-[11.5px] text-muted-foreground">{entry.time}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="mt-12 lg:mt-0">
              <div className="lg:sticky lg:top-28">
                <section>
                  <p className="orphic-eyebrow">Ringkasan pembayaran</p>
                  <dl className="mt-5 space-y-3 text-[13px]">
                    <Row label="Subtotal" value={formatRupiah(order.snapshot.subtotal)} />
                    {order.snapshot.discount > 0 ? (
                      <Row
                        label={`Diskon${order.snapshot.voucher ? ` (${order.snapshot.voucher})` : ""}`}
                        value={`− ${formatRupiah(order.snapshot.discount)}`}
                        tone="seller"
                      />
                    ) : null}
                    {order.snapshot.fee > 0 ? (
                      <Row label="Biaya layanan" value={`+ ${formatRupiah(order.snapshot.fee)}`} />
                    ) : null}
                    <Row label="Metode pembayaran" value={order.snapshot.method} />
                  </dl>
                  <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
                    <span className="text-[12.5px] text-muted-foreground">Total dibayar</span>
                    <span className="orphic-display text-[1.35rem] tracking-normal text-foreground">
                      {formatRupiah(order.snapshot.total)}
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/75">
                    Harga disimpan pada saat pembelian dan tidak berubah.
                  </p>
                </section>

                <div className="mt-6 flex items-start gap-3 border-t border-hairline pt-6">
                  <ShieldCheck className="mt-0.5 size-[17px] shrink-0 text-primary" strokeWidth={1.5} />
                  <div>
                    <p className="text-[13px] text-foreground">Orphic Protected</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                      {order.protectedNote ??
                        "Setiap pesanan didampingi Orphic sampai produk diterima sesuai deskripsi."}
                    </p>
                  </div>
                </div>

                <div className="mt-8 hidden md:block">
                  <ActionList order={order} note={note} setNote={setNote} />
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-10 md:hidden">
            <ActionList order={order} note={note} setNote={setNote} />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function ActionList({
  order,
  note,
  setNote,
}: {
  order: Order;
  note: string;
  setNote: (v: string) => void;
}) {
  const productId = order.items.find((i) => i.productId)?.productId;

  return (
    <div>
      <p className="orphic-eyebrow">Tindakan</p>
      <div className="mt-4 space-y-2.5">
        {order.actions.map((action) => (
          <ActionButton
            key={action.label}
            action={action}
            productId={productId}
            onResult={setNote}
          />
        ))}
        <button
          type="button"
          onClick={() => setNote("Prototipe: bantuan Orphic belum aktif.")}
          className="w-full rounded-full border border-hairline px-6 py-3.5 text-[13px] text-foreground/85 transition-colors duration-300 hover:border-foreground/25"
        >
          {order.official ? "Bantuan Orphic" : "Hubungi penjual"}
        </button>
        <button
          type="button"
          onClick={() => setNote("Prototipe: laporan masalah belum aktif.")}
          className="w-full rounded-full border border-hairline px-6 py-3.5 text-[13px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
          Laporkan masalah
        </button>
      </div>

      {order.helpNote ? (
        <p className="mt-4 text-[11.5px] leading-relaxed text-muted-foreground/80">
          {order.helpNote}
        </p>
      ) : null}
      {note ? (
        <p aria-live="polite" className="mt-4 text-[12px] text-seller-foreground">
          {note}
        </p>
      ) : null}
    </div>
  );
}

function ActionButton({
  action,
  productId,
  onResult,
}: {
  action: OrderAction;
  productId: string | undefined;
  onResult: (v: string) => void;
}) {
  const className =
    action.variant === "primary"
      ? "block w-full rounded-full bg-primary px-6 py-3.5 text-center text-[13px] font-medium text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
      : "block w-full rounded-full border border-hairline px-6 py-3.5 text-center text-[13px] text-foreground/85 transition-colors duration-300 hover:border-foreground/25";

  if (!action.result && productId) {
    return (
      <Link to="/product/$id" params={{ id: productId }} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={action.disabled ?? false}
      onClick={() => onResult(action.result || "Prototipe: tindakan ini belum aktif.")}
      className={`${className} ${action.disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {action.label}
    </button>
  );
}

function StageRow({ stage }: { stage: OrderStage }) {
  const dot =
    stage.state === "done"
      ? "bg-seller"
      : stage.state === "current"
        ? "bg-primary"
        : stage.state === "stopped"
          ? "bg-destructive"
          : "bg-muted-foreground/30";

  const text =
    stage.state === "upcoming" ? "text-muted-foreground/60" : "text-foreground/90";

  return (
    <li className="flex items-center gap-3">
      <span className={`size-[9px] shrink-0 rounded-full ${dot}`} />
      <span className={`text-[13px] ${text}`}>{stage.label}</span>
      {stage.state === "current" ? (
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-primary">Sekarang</span>
      ) : null}
      {stage.state === "stopped" ? (
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-destructive">Berhenti</span>
      ) : null}
    </li>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "seller";
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={tone === "seller" ? "text-seller-foreground" : "text-foreground/90"}>
        {value}
      </dd>
    </div>
  );
}
