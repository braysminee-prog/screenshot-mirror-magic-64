export function SellerSignature({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-seller/25 bg-seller/10 px-2 py-[2px] text-[9px] font-medium uppercase tracking-[0.18em] text-seller-foreground ${className}`}
    >
      Seller
    </span>
  );
}
