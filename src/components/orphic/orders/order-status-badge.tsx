import { toneClass, type OrderStatus } from "@/lib/orphic-orders";

export function OrderStatusBadge({
  status,
  className = "",
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-[3px] text-[10.5px] font-medium tracking-[0.06em] ${toneClass[status.tone]} ${className}`}
    >
      {status.label}
    </span>
  );
}

export function OwnerLine({
  official,
  sellerHandle,
  promotedBy,
}: {
  official: boolean;
  sellerHandle?: string | undefined;
  promotedBy?: string | undefined;
}) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      {official ? (
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-[3px] text-[9.5px] font-medium uppercase tracking-[0.2em] text-primary">
          Orphic Official
        </span>
      ) : (
        <>
          <span className="text-[12px] text-muted-foreground">{sellerHandle}</span>
          <span className="inline-flex items-center rounded-full border border-seller/25 bg-seller/10 px-2 py-[2px] text-[9px] font-medium uppercase tracking-[0.18em] text-seller-foreground">
            Seller
          </span>
        </>
      )}
      {official && promotedBy ? (
        <span className="text-[11px] text-muted-foreground/80">Dipromosikan oleh {promotedBy}</span>
      ) : null}
    </span>
  );
}
