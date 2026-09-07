import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { productDetails, type DetailKind, type ProductDetail } from "@/lib/orphic-product-detail";

/**
 * Prototype cart state only. No real orders, payments, or inventory.
 * State persists for the browser session so navigation keeps context.
 */

export type CartConfig = { userId?: string; server?: string };

export type CartItem = {
  key: string;
  productId: string;
  kind?: DetailKind | undefined;
  variantId?: string | undefined;
  quantity: number;
  config: CartConfig;
  selected: boolean;
};

export type ItemIssue = "sold-out" | "unavailable" | "invalid-config" | null;

export type ResolvedItem = {
  item: CartItem;
  detail: ProductDetail;
  variantName?: string | undefined;
  variantNote?: string | undefined;
  unitPrice: number;
  lineTotal: number;
  quantitySupported: boolean;
  issue: ItemIssue;
  issueText?: string | undefined;
  ownerKey: string;
  ownerLabel: string;
  official: boolean;
  promotedBy?: string | undefined;
  attributes: { label: string; value: string }[];
};

export function parseRupiah(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function formatRupiah(value: number): string {
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
}

export function quantitySupportedFor(kind: DetailKind): boolean {
  // Unique listings and Official Top Up follow their own product logic.
  return kind === "hosting" || kind === "file" || kind === "service";
}

/** Product-type relevant attributes shown in Cart and Checkout. */
export function contextAttributes(detail: ProductDetail): { label: string; value: string }[] {
  const pick = (labels: string[]) =>
    labels
      .map((l) => detail.attributes.find((a) => a.label.toLowerCase() === l.toLowerCase()))
      .filter((a): a is { label: string; value: string } => Boolean(a));

  switch (detail.kind) {
    case "hosting":
      return pick(["vCPU", "RAM", "Storage", "Region"]).slice(0, 4);
    case "file":
      return pick(["Format file", "Tipe File", "Lisensi", "Platform", "Tools"]).slice(0, 3);
    case "service":
      return pick(["Paket", "Cakupan", "Waktu Kerja", "Durasi", "Revisi", "Estimasi"]).slice(0, 3);
    case "game-account":
      return pick(["Game", "Rank", "Level", "Region", "Server"]).slice(0, 4);
    case "official-topup":
      return pick(["Penyedia", "Metode", "Estimasi"]).slice(0, 3);
    default:
      return detail.attributes.slice(0, 3);
  }
}

function itemKey(productId: string, variantId: string | undefined, config: CartConfig) {
  return [productId, variantId ?? "-", config.userId ?? "", config.server ?? ""].join("|");
}

export function resolveItem(item: CartItem): ResolvedItem | null {
  const detail = productDetails[item.productId];
  if (!detail) return null;

  const variant = detail.variants?.options.find((o) => o.id === item.variantId);
  const unitPrice = parseRupiah(variant?.price ?? detail.price);
  const quantitySupported = quantitySupportedFor(detail.kind);
  const quantity = quantitySupported ? item.quantity : 1;

  let issue: ItemIssue = null;
  let issueText: string | undefined;

  if (detail.soldOut) {
    issue = "sold-out";
    issueText = "Listing ini sudah terjual dan tidak bisa dilanjutkan ke checkout.";
  } else if (detail.variants && !variant) {
    issue = "invalid-config";
    issueText = "Varian belum dipilih. Buka produk untuk memilih varian.";
  } else if (detail.requiresAccountId && (!item.config.userId?.trim() || !item.config.server?.trim())) {
    issue = "invalid-config";
    issueText = "User ID dan Server wajib diisi sebelum lanjut.";
  } else if (!detail.actions.length) {
    issue = "unavailable";
    issueText = "Produk ini sedang tidak bisa dipesan.";
  }

  return {
    item,
    detail,
    variantName: variant?.name,
    variantNote: variant?.note,
    unitPrice,
    lineTotal: unitPrice * quantity,
    quantitySupported,
    issue,
    issueText,
    ownerKey: detail.official ? "official" : (detail.seller?.handle ?? "orphic"),
    ownerLabel: detail.official ? "Orphic Official" : (detail.seller?.handle ?? "Orphic"),
    official: Boolean(detail.official),
    promotedBy: detail.promotedBy,
    attributes: contextAttributes(detail),
  };
}

/* ---------------- Voucher ---------------- */

export type VoucherState =
  | { status: "none" }
  | { status: "applied"; code: string; label: string; amount: number }
  | { status: "invalid"; code: string; message: string }
  | { status: "expired"; code: string; message: string }
  | { status: "not-applicable"; code: string; message: string };

export const availableVouchers = [
  { code: "ORPHIC10", label: "Diskon 10% (maks Rp 50.000)", min: 100_000 },
  { code: "NEXUS25", label: "Potongan Rp 25.000", min: 200_000 },
];

export function evaluateVoucher(code: string, subtotal: number): VoucherState {
  const c = code.trim().toUpperCase();
  if (!c) return { status: "none" };
  if (c === "KADALUARSA" || c === "EXPIRED") {
    return { status: "expired", code: c, message: "Voucher ini sudah kedaluwarsa." };
  }
  const found = availableVouchers.find((v) => v.code === c);
  if (!found) {
    return { status: "invalid", code: c, message: "Kode voucher tidak dikenali." };
  }
  if (subtotal < found.min) {
    return {
      status: "not-applicable",
      code: c,
      message: `Voucher berlaku untuk subtotal minimal ${formatRupiah(found.min)}.`,
    };
  }
  const amount =
    found.code === "ORPHIC10" ? Math.min(Math.round(subtotal * 0.1), 50_000) : 25_000;
  return { status: "applied", code: found.code, label: found.label, amount };
}

export const SERVICE_FEE = 2500;

/* ---------------- Context ---------------- */

type CartContextValue = {
  items: CartItem[];
  resolved: ResolvedItem[];
  count: number;
  addItem: (input: {
    productId: string;
    variantId?: string | undefined;
    config?: CartConfig | undefined;
    quantity?: number | undefined;
  }) => CartItem;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  setSelected: (key: string, selected: boolean) => void;
  selectAll: (selected: boolean) => void;
  updateConfig: (key: string, config: CartConfig) => void;
  clearSelected: () => void;
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  directItemKey: string | null;
  setDirectItemKey: (key: string | null) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "orphic-cart-v4";

const seedItems: CartItem[] = [
  {
    key: itemKey("vps-4gb", "m", {}),
    productId: "vps-4gb",
    variantId: "m",
    quantity: 1,
    config: {},
    selected: true,
  },
  {
    key: itemKey("figma-kit", undefined, {}),
    productId: "figma-kit",
    quantity: 1,
    config: {},
    selected: true,
  },
  {
    key: itemKey("topup-ml", "d172", {}),
    productId: "topup-ml",
    variantId: "d172",
    quantity: 1,
    config: {},
    selected: false,
  },
  {
    key: itemKey("ml-account", undefined, {}),
    productId: "ml-account",
    quantity: 1,
    config: {},
    selected: false,
  },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(seedItems);
  const [voucherCode, setVoucherCode] = useState("");
  const [directItemKey, setDirectItemKey] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items?: CartItem[]; voucherCode?: string };
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (typeof parsed.voucherCode === "string") setVoucherCode(parsed.voucherCode);
      }
    } catch {
      /* prototype state only */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items, voucherCode }));
    } catch {
      /* prototype state only */
    }
  }, [items, voucherCode, hydrated]);

  const addItem = useCallback<CartContextValue["addItem"]>((input) => {
    const config = input.config ?? {};
    const detail = productDetails[input.productId];
    const mergeable = detail ? quantitySupportedFor(detail.kind) : false;
    const key = itemKey(input.productId, input.variantId, config);
    const next: CartItem = {
      key,
      productId: input.productId,
      variantId: input.variantId,
      quantity: input.quantity ?? 1,
      config,
      selected: true,
    };

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, selected: true, quantity: mergeable ? i.quantity + (input.quantity ?? 1) : 1 }
            : i,
        );
      }
      return [...prev, next];
    });

    return next;
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const resolved = items
      .map(resolveItem)
      .filter((r): r is ResolvedItem => Boolean(r));

    return {
      items,
      resolved,
      count: items.length,
      addItem,
      removeItem: (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
      setQuantity: (key, quantity) =>
        setItems((prev) =>
          prev.map((i) => (i.key === key ? { ...i, quantity: Math.min(9, Math.max(1, quantity)) } : i)),
        ),
      setSelected: (key, selected) =>
        setItems((prev) => prev.map((i) => (i.key === key ? { ...i, selected } : i))),
      selectAll: (selected) => setItems((prev) => prev.map((i) => ({ ...i, selected }))),
      updateConfig: (key, config) =>
        setItems((prev) =>
          prev.map((i) => (i.key === key ? { ...i, config: { ...i.config, ...config } } : i)),
        ),
      clearSelected: () => setItems((prev) => prev.filter((i) => !i.selected)),
      voucherCode,
      setVoucherCode,
      directItemKey,
      setDirectItemKey,
    };
  }, [items, addItem, voucherCode, directItemKey]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export type Summary = {
  subtotal: number;
  discount: number;
  fee: number;
  total: number;
  voucher: VoucherState;
};

export function buildSummary(items: ResolvedItem[], voucherCode: string): Summary {
  const subtotal = items.reduce((sum, r) => sum + r.lineTotal, 0);
  const voucher = evaluateVoucher(voucherCode, subtotal);
  const discount = voucher.status === "applied" ? voucher.amount : 0;
  const fee = subtotal > 0 ? SERVICE_FEE : 0;
  return { subtotal, discount, fee, total: Math.max(0, subtotal - discount + fee), voucher };
}
