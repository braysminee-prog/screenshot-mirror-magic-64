import productVps from "@/assets/product-vps.jpg";
import productUikit from "@/assets/product-uikit.jpg";
import productAccount from "@/assets/product-account.jpg";
import productNotion from "@/assets/product-notion.jpg";
import productScript from "@/assets/product-script.jpg";
import worldGaming from "@/assets/world-gaming.jpg";
import worldHosting from "@/assets/world-hosting.jpg";
import worldEducation from "@/assets/world-education.jpg";
import worldSoftware from "@/assets/world-software.jpg";

/**
 * Prototype order data only. No real orders, fulfillment, payouts,
 * provisioning, or payment processing exists behind this data.
 * Every order keeps a purchase-time snapshot and is never recalculated.
 */

export type OrderKind =
  | "file"
  | "service"
  | "hosting"
  | "game-account"
  | "official-topup"
  | "membership"
  | "license";

export type OrderTone = "active" | "progress" | "neutral" | "attention" | "error";

export type OrderStatus = {
  /** Short label shown to the buyer. */
  label: string;
  tone: OrderTone;
  /** Plain-language answer to "what is happening / what do I do?" */
  message: string;
};

export type OrderFilter = "all" | "processing" | "active" | "completed" | "cancelled";

export type OrderStage = { label: string; state: "done" | "current" | "upcoming" | "stopped" };

export type OrderAction = {
  label: string;
  variant: "primary" | "secondary";
  /** Prototype-only explanation shown after the action is used. */
  result: string;
  disabled?: boolean;
};

export type OrderItem = {
  productId?: string;
  name: string;
  image: string;
  kind: OrderKind;
  kindLabel: string;
  quantity: number;
  unitPrice: number;
  config: { label: string; value: string }[];
};

export type Order = {
  id: string;
  kind: OrderKind;
  filter: OrderFilter;
  purchasedAt: string;
  purchasedLabel: string;
  status: OrderStatus;
  official: boolean;
  sellerHandle?: string;
  sellerName?: string;
  promotedBy?: string;
  items: OrderItem[];
  stages: OrderStage[];
  timeline: { label: string; time: string }[];
  fulfillment: { title: string; note: string; rows: { label: string; value: string }[] };
  /** Purchase-time price snapshot. Never recalculated. */
  snapshot: {
    subtotal: number;
    discount: number;
    voucher?: string;
    fee: number;
    total: number;
    method: string;
  };
  actions: OrderAction[];
  protectedNote?: string;
  issue?: string;
  helpNote?: string;
};

export function formatRupiah(value: number): string {
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
}

export const kindLabels: Record<OrderKind, string> = {
  file: "Produk Digital",
  service: "Jasa Digital",
  hosting: "VPS / Hosting",
  "game-account": "Akun Game",
  "official-topup": "Top Up",
  membership: "Membership",
  license: "Lisensi",
};

export const orderFilters: { key: OrderFilter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "processing", label: "Diproses" },
  { key: "active", label: "Aktif" },
  { key: "completed", label: "Selesai" },
  { key: "cancelled", label: "Dibatalkan" },
];

export const toneClass: Record<OrderTone, string> = {
  active: "border-seller/30 bg-seller/10 text-seller-foreground",
  progress: "border-primary/30 bg-primary/10 text-primary",
  neutral: "border-hairline bg-surface text-muted-foreground",
  attention: "border-foreground/20 bg-surface text-foreground/85",
  error: "border-destructive/40 bg-destructive/10 text-destructive",
};

function stages(labels: string[], currentIndex: number, stopped = false): OrderStage[] {
  return labels.map((label, i) => ({
    label,
    state:
      i < currentIndex
        ? "done"
        : i === currentIndex
          ? stopped
            ? "stopped"
            : "current"
          : "upcoming",
  }));
}

export const orders: Order[] = [
  {
    id: "ORP-2026-000184",
    kind: "file",
    filter: "processing",
    purchasedAt: "2026-09-07T14:32:00+07:00",
    purchasedLabel: "7 Sep 2026, 14:32",
    status: {
      label: "Siap diunduh",
      tone: "active",
      message: "File sudah dikirim penjual. Kamu bisa mengunduhnya sekarang.",
    },
    official: false,
    sellerHandle: "@cloudlab",
    sellerName: "Cloud Lab",
    items: [
      {
        productId: "figma-kit",
        name: "Figma UI Kit — Aurora",
        image: productUikit,
        kind: "file",
        kindLabel: kindLabels.file,
        quantity: 1,
        unitPrice: 185_000,
        config: [
          { label: "Versi", value: "v2.4" },
          { label: "Format file", value: ".fig" },
          { label: "Lisensi", value: "Commercial" },
        ],
      },
    ],
    stages: stages(["Dipesan", "Menunggu pengiriman", "Siap", "Selesai"], 2),
    timeline: [
      { label: "Pesanan dibuat", time: "7 Sep, 14:32" },
      { label: "Pembayaran dikonfirmasi", time: "7 Sep, 14:33" },
      { label: "File dikirim penjual", time: "7 Sep, 14:41" },
    ],
    fulfillment: {
      title: "Pengiriman file",
      note: "Tautan unduhan pada prototipe ini bersifat contoh dan tidak mengunduh file nyata.",
      rows: [
        { label: "Ukuran", value: "184 MB" },
        { label: "Versi", value: "v2.4" },
        { label: "Dikirim", value: "7 Sep 2026, 14:41" },
      ],
    },
    snapshot: {
      subtotal: 185_000,
      discount: 18_500,
      voucher: "ORPHIC10",
      fee: 2_500,
      total: 169_000,
      method: "Dompet Orphic",
    },
    actions: [
      { label: "Unduh", variant: "primary", result: "Prototipe: unduhan file belum aktif." },
      { label: "Lihat produk", variant: "secondary", result: "" },
    ],
    protectedNote: "Dana ditahan sampai file diterima sesuai deskripsi.",
  },
  {
    id: "ORP-2026-000181",
    kind: "service",
    filter: "processing",
    purchasedAt: "2026-09-06T10:12:00+07:00",
    purchasedLabel: "6 Sep 2026, 10:12",
    status: {
      label: "Sedang dikerjakan",
      tone: "progress",
      message: "Penjual sedang mengerjakan pesananmu. Tidak ada tindakan yang diperlukan sekarang.",
    },
    official: false,
    sellerHandle: "@cloudlab",
    sellerName: "Cloud Lab",
    items: [
      {
        productId: "server-setup",
        name: "Setup & Hardening Server Produksi",
        image: worldHosting,
        kind: "service",
        kindLabel: kindLabels.service,
        quantity: 1,
        unitPrice: 750_000,
        config: [
          { label: "Paket", value: "Standard" },
          { label: "Waktu Kerja", value: "2–3 hari" },
          { label: "Revisi", value: "2x" },
        ],
      },
    ],
    stages: stages(
      ["Pesanan diterima", "Menunggu penjual", "Dikerjakan", "Dikirim", "Selesai"],
      2,
    ),
    timeline: [
      { label: "Pesanan dibuat", time: "6 Sep, 10:12" },
      { label: "Pembayaran dikonfirmasi", time: "6 Sep, 10:13" },
      { label: "Penjual menerima pesanan", time: "6 Sep, 11:02" },
      { label: "Pengerjaan dimulai", time: "6 Sep, 13:20" },
    ],
    fulfillment: {
      title: "Progres pengerjaan",
      note: "Catatan penjual ditampilkan sebagai contoh prototipe.",
      rows: [
        { label: "Kebutuhan dikirim", value: "Akses staging + domain" },
        { label: "Langkah berikutnya", value: "Penjual mengirim hasil untuk ditinjau" },
        { label: "Estimasi selesai", value: "8 Sep 2026" },
      ],
    },
    snapshot: {
      subtotal: 750_000,
      discount: 0,
      fee: 2_500,
      total: 752_500,
      method: "Virtual Account",
    },
    actions: [
      { label: "Lihat pengerjaan", variant: "primary", result: "Prototipe: ruang pengerjaan belum aktif." },
      { label: "Hubungi bantuan", variant: "secondary", result: "Prototipe: bantuan belum aktif." },
    ],
    protectedNote: "Dana ditahan sampai hasil pekerjaan diterima.",
  },
  {
    id: "ORP-2026-000179",
    kind: "hosting",
    filter: "processing",
    purchasedAt: "2026-09-06T08:45:00+07:00",
    purchasedLabel: "6 Sep 2026, 08:45",
    status: {
      label: "Sedang disiapkan",
      tone: "progress",
      message: "Server sedang disiapkan. Informasi akses muncul setelah siap.",
    },
    official: false,
    sellerHandle: "@nexusstore",
    sellerName: "Nexus Store",
    items: [
      {
        productId: "vps-4gb",
        name: "VPS Cloud 4GB — NVMe Performance",
        image: productVps,
        kind: "hosting",
        kindLabel: kindLabels.hosting,
        quantity: 1,
        unitPrice: 149_000,
        config: [
          { label: "Paket", value: "4 GB / 2 vCPU" },
          { label: "Storage", value: "80 GB NVMe" },
          { label: "Region", value: "Singapore" },
          { label: "Durasi", value: "30 hari" },
        ],
      },
    ],
    stages: stages(["Pesanan diterima", "Disiapkan", "Siap", "Aktif"], 1),
    timeline: [
      { label: "Pesanan dibuat", time: "6 Sep, 08:45" },
      { label: "Pembayaran dikonfirmasi", time: "6 Sep, 08:46" },
      { label: "Penyiapan server dimulai", time: "6 Sep, 08:52" },
    ],
    fulfillment: {
      title: "Status layanan",
      note: "Data server pada prototipe ini adalah contoh dan bukan server nyata.",
      rows: [
        { label: "Status server", value: "Menunggu penyiapan" },
        { label: "Akses", value: "Muncul setelah server siap" },
        { label: "Masa aktif", value: "Dimulai saat server siap" },
      ],
    },
    snapshot: {
      subtotal: 149_000,
      discount: 0,
      fee: 2_500,
      total: 151_500,
      method: "QRIS",
    },
    actions: [
      { label: "Lihat status layanan", variant: "primary", result: "Prototipe: panel layanan belum aktif." },
    ],
    protectedNote: "Dana ditahan sampai layanan aktif sesuai deskripsi.",
  },
  {
    id: "ORP-2026-000176",
    kind: "game-account",
    filter: "processing",
    purchasedAt: "2026-09-05T21:04:00+07:00",
    purchasedLabel: "5 Sep 2026, 21:04",
    status: {
      label: "Menunggu serah terima",
      tone: "attention",
      message: "Penjual akan memulai serah terima akun. Ikuti langkah di halaman serah terima.",
    },
    official: false,
    sellerHandle: "@nexusstore",
    sellerName: "Nexus Store",
    items: [
      {
        productId: "ml-account",
        name: "Akun Mobile Legends — Mythic Glory",
        image: productAccount,
        kind: "game-account",
        kindLabel: kindLabels["game-account"],
        quantity: 1,
        unitPrice: 1_450_000,
        config: [
          { label: "Game", value: "Mobile Legends" },
          { label: "Rank", value: "Mythic Glory" },
          { label: "Region", value: "Indonesia" },
          { label: "Listing", value: "ML-MG-0142" },
        ],
      },
    ],
    stages: stages(
      ["Pembayaran dikonfirmasi", "Menunggu serah terima", "Serah terima", "Selesai"],
      1,
    ),
    timeline: [
      { label: "Pesanan dibuat", time: "5 Sep, 21:04" },
      { label: "Pembayaran dikonfirmasi", time: "5 Sep, 21:05" },
      { label: "Penjual dihubungi", time: "5 Sep, 21:20" },
    ],
    fulfillment: {
      title: "Serah terima akun",
      note: "Lakukan serah terima hanya di dalam Orphic. Jangan bertukar data akun di luar platform.",
      rows: [
        { label: "Status serah terima", value: "Menunggu penjual" },
        { label: "Langkah kamu", value: "Siapkan email pribadi untuk penggantian data" },
        { label: "Keamanan", value: "Data akun tidak pernah ditampilkan penuh di prototipe" },
      ],
    },
    snapshot: {
      subtotal: 1_450_000,
      discount: 25_000,
      voucher: "NEXUS25",
      fee: 2_500,
      total: 1_427_500,
      method: "Virtual Account",
    },
    actions: [
      { label: "Lihat serah terima", variant: "primary", result: "Prototipe: ruang serah terima belum aktif." },
      { label: "Hubungi bantuan", variant: "secondary", result: "Prototipe: bantuan belum aktif." },
    ],
    protectedNote: "Dana ditahan sampai serah terima akun selesai dan terverifikasi.",
  },
  {
    id: "ORP-2026-000174",
    kind: "official-topup",
    filter: "processing",
    purchasedAt: "2026-09-05T19:58:00+07:00",
    purchasedLabel: "5 Sep 2026, 19:58",
    status: {
      label: "Diproses",
      tone: "progress",
      message: "Top up sedang diproses Orphic. Diamond masuk otomatis ke akun game.",
    },
    official: true,
    promotedBy: "@nexusstore",
    items: [
      {
        productId: "topup-ml",
        name: "Top Up Mobile Legends — Diamonds",
        image: worldGaming,
        kind: "official-topup",
        kindLabel: kindLabels["official-topup"],
        quantity: 1,
        unitPrice: 41_000,
        config: [
          { label: "Game", value: "Mobile Legends" },
          { label: "Player ID", value: "128455321" },
          { label: "Server", value: "2145" },
          { label: "Nominal", value: "172 Diamonds" },
        ],
      },
    ],
    stages: stages(["Pembayaran dikonfirmasi", "Diproses", "Terkirim", "Selesai"], 1),
    timeline: [
      { label: "Pesanan dibuat", time: "5 Sep, 19:58" },
      { label: "Pembayaran dikonfirmasi", time: "5 Sep, 19:58" },
      { label: "Pengiriman diamond dimulai", time: "5 Sep, 19:59" },
    ],
    fulfillment: {
      title: "Status transaksi",
      note: "Dipenuhi langsung oleh Orphic Official. Tidak ada penjual pihak ketiga pada pesanan ini.",
      rows: [
        { label: "Tujuan", value: "128455321 (2145)" },
        { label: "Nominal", value: "172 Diamonds" },
        { label: "Estimasi", value: "Kurang dari 5 menit" },
      ],
    },
    snapshot: { subtotal: 41_000, discount: 0, fee: 2_500, total: 43_500, method: "Dompet Orphic" },
    actions: [
      { label: "Lihat status transaksi", variant: "primary", result: "Prototipe: status realtime belum aktif." },
    ],
    protectedNote: "Transaksi Official dijamin Orphic. Gagal kirim otomatis dikembalikan.",
  },
  {
    id: "ORP-2026-000168",
    kind: "membership",
    filter: "active",
    purchasedAt: "2026-08-21T09:15:00+07:00",
    purchasedLabel: "21 Agu 2026, 09:15",
    status: {
      label: "Aktif",
      tone: "active",
      message: "Membership kamu aktif dan bisa digunakan sampai tanggal berakhir.",
    },
    official: true,
    items: [
      {
        name: "Orphic Creator Membership — 6 Bulan",
        image: worldEducation,
        kind: "membership",
        kindLabel: kindLabels.membership,
        quantity: 1,
        unitPrice: 480_000,
        config: [
          { label: "Tipe", value: "Creator" },
          { label: "Durasi", value: "6 bulan" },
          { label: "Mulai", value: "21 Agu 2026" },
          { label: "Berakhir", value: "21 Feb 2027" },
        ],
      },
    ],
    stages: stages(["Dibeli", "Diaktifkan", "Aktif", "Berakhir"], 2),
    timeline: [
      { label: "Pesanan dibuat", time: "21 Agu, 09:15" },
      { label: "Pembayaran dikonfirmasi", time: "21 Agu, 09:16" },
      { label: "Akses diaktifkan", time: "21 Agu, 09:18" },
    ],
    fulfillment: {
      title: "Status akses",
      note: "Akses membership pada prototipe ini bersifat contoh.",
      rows: [
        { label: "Status", value: "Aktif" },
        { label: "Sisa masa aktif", value: "167 hari" },
        { label: "Perpanjangan", value: "Manual" },
      ],
    },
    snapshot: { subtotal: 480_000, discount: 0, fee: 2_500, total: 482_500, method: "Dompet Orphic" },
    actions: [
      { label: "Lihat akses", variant: "primary", result: "Prototipe: halaman akses belum aktif." },
      { label: "Perpanjang", variant: "secondary", result: "Prototipe: perpanjangan belum aktif." },
    ],
  },
  {
    id: "ORP-2026-000165",
    kind: "license",
    filter: "active",
    purchasedAt: "2026-08-18T16:40:00+07:00",
    purchasedLabel: "18 Agu 2026, 16:40",
    status: {
      label: "Kunci siap",
      tone: "active",
      message: "Kunci lisensi sudah tersedia dan siap diaktifkan.",
    },
    official: false,
    sellerHandle: "@digitalhub",
    sellerName: "Digital Hub",
    items: [
      {
        productId: "php-script",
        name: "Premium PHP Script Marketplace",
        image: productScript,
        kind: "license",
        kindLabel: kindLabels.license,
        quantity: 1,
        unitPrice: 385_000,
        config: [
          { label: "Lisensi", value: "Commercial" },
          { label: "Domain", value: "1 domain produksi" },
          { label: "Dukungan", value: "6 bulan" },
        ],
      },
    ],
    stages: stages(["Dibeli", "Kunci siap", "Diaktifkan", "Selesai"], 1),
    timeline: [
      { label: "Pesanan dibuat", time: "18 Agu, 16:40" },
      { label: "Pembayaran dikonfirmasi", time: "18 Agu, 16:41" },
      { label: "Kunci lisensi disiapkan", time: "18 Agu, 16:44" },
    ],
    fulfillment: {
      title: "Kunci lisensi",
      note: "Kunci contoh untuk prototipe. Bukan kunci lisensi nyata.",
      rows: [
        { label: "Kunci", value: "DEMO-XXXX-XXXX-2026" },
        { label: "Status aktivasi", value: "Belum diaktifkan" },
        { label: "Cara aktivasi", value: "Masukkan kunci di panel produk penjual" },
      ],
    },
    snapshot: { subtotal: 385_000, discount: 0, fee: 2_500, total: 387_500, method: "Virtual Account" },
    actions: [
      { label: "Lihat lisensi", variant: "primary", result: "Prototipe: panel lisensi belum aktif." },
      { label: "Petunjuk aktivasi", variant: "secondary", result: "Prototipe: petunjuk lengkap belum tersedia." },
    ],
  },
  {
    id: "ORP-2026-000151",
    kind: "file",
    filter: "completed",
    purchasedAt: "2026-08-02T11:05:00+07:00",
    purchasedLabel: "2 Agu 2026, 11:05",
    status: {
      label: "Selesai",
      tone: "neutral",
      message: "Pesanan selesai. File tetap bisa diunduh dari halaman ini.",
    },
    official: false,
    sellerHandle: "@digitalhub",
    sellerName: "Digital Hub",
    items: [
      {
        productId: "wp-theme",
        name: "WordPress Theme — Studio",
        image: productNotion,
        kind: "file",
        kindLabel: kindLabels.file,
        quantity: 1,
        unitPrice: 320_000,
        config: [
          { label: "Versi", value: "v1.8" },
          { label: "Format file", value: ".zip" },
        ],
      },
    ],
    stages: stages(["Dipesan", "Menunggu pengiriman", "Siap", "Selesai"], 3),
    timeline: [
      { label: "Pesanan dibuat", time: "2 Agu, 11:05" },
      { label: "Pembayaran dikonfirmasi", time: "2 Agu, 11:06" },
      { label: "File dikirim penjual", time: "2 Agu, 11:12" },
      { label: "Pesanan selesai", time: "5 Agu, 09:00" },
    ],
    fulfillment: {
      title: "Hasil pesanan",
      note: "Riwayat pembelian tetap tersimpan setelah pesanan selesai.",
      rows: [
        { label: "Selesai pada", value: "5 Agu 2026, 09:00" },
        { label: "Versi diterima", value: "v1.8" },
      ],
    },
    snapshot: { subtotal: 320_000, discount: 0, fee: 2_500, total: 322_500, method: "QRIS" },
    actions: [
      { label: "Unduh ulang", variant: "primary", result: "Prototipe: unduhan file belum aktif." },
    ],
  },
  {
    id: "ORP-2026-000140",
    kind: "hosting",
    filter: "cancelled",
    purchasedAt: "2026-07-24T20:31:00+07:00",
    purchasedLabel: "24 Jul 2026, 20:31",
    status: {
      label: "Dibatalkan",
      tone: "neutral",
      message: "Pesanan dibatalkan sebelum layanan disiapkan. Tidak ada yang perlu kamu lakukan.",
    },
    official: false,
    sellerHandle: "@cloudlab",
    sellerName: "Cloud Lab",
    items: [
      {
        productId: "vps-8gb",
        name: "VPS Cloud 8GB — Singapore",
        image: worldSoftware,
        kind: "hosting",
        kindLabel: kindLabels.hosting,
        quantity: 1,
        unitPrice: 289_000,
        config: [
          { label: "Paket", value: "8 GB / 4 vCPU" },
          { label: "Durasi", value: "30 hari" },
        ],
      },
    ],
    stages: stages(["Pesanan diterima", "Disiapkan", "Siap", "Aktif"], 1, true),
    timeline: [
      { label: "Pesanan dibuat", time: "24 Jul, 20:31" },
      { label: "Pesanan dibatalkan", time: "24 Jul, 21:10" },
    ],
    fulfillment: {
      title: "Pembatalan",
      note: "Pesanan dibatalkan atas permintaan pembeli sebelum layanan disiapkan.",
      rows: [
        { label: "Dibatalkan pada", value: "24 Jul 2026, 21:10" },
        { label: "Dana", value: "Dikembalikan ke Dompet (contoh prototipe)" },
      ],
    },
    snapshot: { subtotal: 289_000, discount: 0, fee: 2_500, total: 291_500, method: "Dompet Orphic" },
    actions: [{ label: "Beli lagi", variant: "secondary", result: "" }],
    helpNote: "Butuh penjelasan pembatalan? Hubungi bantuan Orphic.",
  },
  {
    id: "ORP-2026-000133",
    kind: "official-topup",
    filter: "cancelled",
    purchasedAt: "2026-07-19T18:12:00+07:00",
    purchasedLabel: "19 Jul 2026, 18:12",
    status: {
      label: "Gagal",
      tone: "error",
      message: "Top up gagal dikirim karena Player ID tidak ditemukan. Dana sudah dikembalikan.",
    },
    official: true,
    items: [
      {
        productId: "topup-ml",
        name: "Top Up Mobile Legends — Diamonds",
        image: worldGaming,
        kind: "official-topup",
        kindLabel: kindLabels["official-topup"],
        quantity: 1,
        unitPrice: 21_000,
        config: [
          { label: "Game", value: "Mobile Legends" },
          { label: "Player ID", value: "129900001" },
          { label: "Server", value: "1102" },
          { label: "Nominal", value: "86 Diamonds" },
        ],
      },
    ],
    stages: stages(["Pembayaran dikonfirmasi", "Diproses", "Terkirim", "Selesai"], 1, true),
    timeline: [
      { label: "Pesanan dibuat", time: "19 Jul, 18:12" },
      { label: "Pembayaran dikonfirmasi", time: "19 Jul, 18:12" },
      { label: "Pengiriman gagal", time: "19 Jul, 18:14" },
      { label: "Dana dikembalikan", time: "19 Jul, 18:20" },
    ],
    fulfillment: {
      title: "Masalah pemenuhan",
      note: "Player ID tidak ditemukan di server tujuan, sehingga diamond tidak bisa dikirim.",
      rows: [
        { label: "Tujuan", value: "129900001 (1102)" },
        { label: "Status dana", value: "Dikembalikan (contoh prototipe)" },
      ],
    },
    snapshot: { subtotal: 21_000, discount: 0, fee: 2_500, total: 23_500, method: "Dompet Orphic" },
    actions: [
      { label: "Pesan ulang", variant: "primary", result: "" },
      { label: "Hubungi bantuan", variant: "secondary", result: "Prototipe: bantuan belum aktif." },
    ],
    issue: "Player ID tidak ditemukan. Periksa Player ID dan Server sebelum memesan ulang.",
  },
  {
    id: "ORP-2026-000118",
    kind: "membership",
    filter: "completed",
    purchasedAt: "2026-02-11T13:22:00+07:00",
    purchasedLabel: "11 Feb 2026, 13:22",
    status: {
      label: "Berakhir",
      tone: "attention",
      message: "Masa akses sudah berakhir. Perpanjang bila ingin mengaktifkan kembali.",
    },
    official: true,
    items: [
      {
        name: "Orphic Learning Access — 3 Bulan",
        image: worldEducation,
        kind: "membership",
        kindLabel: kindLabels.membership,
        quantity: 1,
        unitPrice: 210_000,
        config: [
          { label: "Tipe", value: "Learning" },
          { label: "Mulai", value: "11 Feb 2026" },
          { label: "Berakhir", value: "11 Mei 2026" },
        ],
      },
    ],
    stages: stages(["Dibeli", "Diaktifkan", "Aktif", "Berakhir"], 3),
    timeline: [
      { label: "Pesanan dibuat", time: "11 Feb, 13:22" },
      { label: "Akses diaktifkan", time: "11 Feb, 13:25" },
      { label: "Akses berakhir", time: "11 Mei, 00:00" },
    ],
    fulfillment: {
      title: "Status akses",
      note: "Akses tidak lagi aktif.",
      rows: [
        { label: "Status", value: "Berakhir" },
        { label: "Berakhir pada", value: "11 Mei 2026" },
      ],
    },
    snapshot: { subtotal: 210_000, discount: 0, fee: 2_500, total: 212_500, method: "QRIS" },
    actions: [{ label: "Perpanjang", variant: "primary", result: "Prototipe: perpanjangan belum aktif." }],
  },
];

export function getOrder(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function filterOrders(list: Order[], filter: OrderFilter): Order[] {
  return filter === "all" ? list : list.filter((o) => o.filter === filter);
}

export function ownerLabel(order: Order): string {
  return order.official ? "ORPHIC OFFICIAL" : (order.sellerHandle ?? "@orphic");
}
