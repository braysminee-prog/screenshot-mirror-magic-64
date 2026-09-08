import { Link } from "@tanstack/react-router";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { OrderStatusBadge, OwnerLine } from "@/components/orphic/orders/order-status-badge";
import { formatRupiah, type Order } from "@/lib/orphic-orders";

export function OrderCard({ order }: { order: Order }) {
  const first = order.items[0]!;
  const extra = order.items.length - 1;

  return (
    <li>
      <Link
        to="/orders/$id"
        params={{ id: order.id }}
        className="group flex gap-4 border-b border-hairline py-6 transition-colors duration-300 hover:bg-surface/40"
      >
        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-card md:size-20">
          <img
            src={first.image}
            alt={first.name}
            loading="lazy"
            width={160}
            height={160}
            className="size-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <OwnerLine
              official={order.official}
              sellerHandle={order.sellerHandle}
              promotedBy={order.promotedBy}
            />
          </div>

          <p className="mt-2 truncate text-[13.5px] leading-snug text-foreground">{first.name}</p>
          {extra > 0 ? (
            <p className="mt-1 text-[11.5px] text-muted-foreground">+{extra} item lainnya</p>
          ) : null}

          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            {first.kindLabel}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <OrderStatusBadge status={order.status} />
            <span className="text-[11.5px] text-muted-foreground">{order.purchasedLabel}</span>
          </div>

          <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground/85">
            {order.status.message}
          </p>

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="orphic-display text-[14.5px] tracking-normal text-foreground">
              {formatRupiah(order.snapshot.total)}
            </span>
            <span className="flex items-center gap-1 text-[11.5px] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              Detail
              <ChevronRight className="size-[14px]" strokeWidth={1.5} />
            </span>
          </div>

          {order.protectedNote ? (
            <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground/80">
              <ShieldCheck className="mt-[1px] size-[13px] shrink-0 text-primary" strokeWidth={1.5} />
              Orphic Protected — {order.protectedNote}
            </p>
          ) : null}

          <p className="mt-2 text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground/55">
            {order.id}
          </p>
        </div>
      </Link>
    </li>
  );
}

export function OrderCardSkeleton() {
  return (
    <li className="flex gap-4 border-b border-hairline py-6">
      <div className="size-16 shrink-0 animate-pulse rounded-2xl bg-surface md:size-20" />
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="h-3 w-24 animate-pulse rounded-full bg-surface" />
        <div className="h-3.5 w-3/5 animate-pulse rounded-full bg-surface" />
        <div className="h-3 w-2/5 animate-pulse rounded-full bg-surface" />
        <div className="h-3 w-28 animate-pulse rounded-full bg-surface" />
      </div>
    </li>
  );
}
