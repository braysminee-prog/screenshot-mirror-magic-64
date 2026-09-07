import { useState } from "react";
import { availableVouchers, formatRupiah, type Summary } from "@/lib/orphic-cart";

export function OrderSummary({
  summary,
  itemCount,
  voucherCode,
  onVoucherChange,
  editableVoucher = false,
}: {
  summary: Summary;
  itemCount: number;
  voucherCode: string;
  onVoucherChange: (code: string) => void;
  editableVoucher?: boolean;
}) {
  const [draft, setDraft] = useState(voucherCode);
  const { voucher } = summary;

  return (
    <section aria-label="Ringkasan pesanan">
      <p className="orphic-eyebrow">Ringkasan</p>

      {editableVoucher ? (
        <div className="mt-5 border-b border-hairline pb-6">
          <label className="block text-[11.5px] text-muted-foreground" htmlFor="voucher">
            Voucher
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="voucher"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Masukkan kode"
              className="min-w-0 flex-1 rounded-full border border-hairline bg-surface px-4 py-2.5 text-[13px] uppercase text-foreground outline-none transition-colors duration-300 placeholder:normal-case placeholder:text-muted-foreground/60 focus:border-primary/50"
            />
            {voucher.status === "applied" ? (
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  onVoucherChange("");
                }}
                className="shrink-0 rounded-full border border-hairline px-4 py-2.5 text-[12px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Hapus
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onVoucherChange(draft)}
                className="shrink-0 rounded-full border border-hairline px-4 py-2.5 text-[12px] text-foreground/85 transition-colors duration-300 hover:border-foreground/25"
              >
                Pakai
              </button>
            )}
          </div>

          {voucher.status === "none" ? (
            <p className="mt-2.5 text-[11.5px] text-muted-foreground/80">
              Tersedia di prototipe: {availableVouchers.map((v) => v.code).join(" · ")}
            </p>
          ) : null}
          {voucher.status === "applied" ? (
            <p className="mt-2.5 text-[11.5px] text-seller-foreground">
              {voucher.code} aktif — {voucher.label}
            </p>
          ) : null}
          {voucher.status === "invalid" ||
          voucher.status === "expired" ||
          voucher.status === "not-applicable" ? (
            <p className="mt-2.5 text-[11.5px] text-destructive">{voucher.message}</p>
          ) : null}
        </div>
      ) : voucher.status === "applied" ? (
        <p className="mt-4 text-[11.5px] text-seller-foreground">
          Voucher {voucher.code} — {voucher.label}
        </p>
      ) : null}

      <dl className="mt-6 space-y-3 text-[13px]">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">Subtotal ({itemCount} item)</dt>
          <dd className="text-foreground/90">{formatRupiah(summary.subtotal)}</dd>
        </div>
        {summary.discount > 0 ? (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">Diskon</dt>
            <dd className="text-seller-foreground">− {formatRupiah(summary.discount)}</dd>
          </div>
        ) : null}
        {summary.fee > 0 ? (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">Biaya layanan</dt>
            <dd className="text-foreground/90">+ {formatRupiah(summary.fee)}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
        <span className="text-[12.5px] text-muted-foreground">Total</span>
        <span className="orphic-display text-[1.4rem] tracking-normal text-foreground">
          {formatRupiah(summary.total)}
        </span>
      </div>
    </section>
  );
}
