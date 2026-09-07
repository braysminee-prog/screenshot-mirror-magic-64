const steps = [
  { key: "cart", label: "Keranjang" },
  { key: "checkout", label: "Checkout" },
  { key: "payment", label: "Pembayaran" },
  { key: "success", label: "Selesai" },
] as const;

export function CheckoutSteps({ current }: { current: "cart" | "checkout" }) {
  const activeIndex = steps.findIndex((s) => s.key === current);

  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.18em]">
      {steps.map((step, i) => (
        <li key={step.key} className="flex items-center gap-3">
          {i > 0 ? <span className="text-muted-foreground/35">/</span> : null}
          <span
            aria-current={i === activeIndex ? "step" : undefined}
            className={
              i === activeIndex
                ? "text-primary"
                : i < activeIndex
                  ? "text-foreground/70"
                  : "text-muted-foreground/50"
            }
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
