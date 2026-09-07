import productVps from "@/assets/product-vps.jpg";
import productScript from "@/assets/product-script.jpg";
import productUikit from "@/assets/product-uikit.jpg";
import productPrompt from "@/assets/product-prompt.jpg";
import productAccount from "@/assets/product-account.jpg";
import productNotion from "@/assets/product-notion.jpg";
import worldHosting from "@/assets/world-hosting.jpg";
import worldGaming from "@/assets/world-gaming.jpg";
import worldSoftware from "@/assets/world-software.jpg";
import worldDesign from "@/assets/world-design.jpg";
import worldAi from "@/assets/world-ai.jpg";
import worldCreator from "@/assets/world-creator.jpg";

/**
 * Prototype content only. None of this represents real listings,
 * real sellers, or real transactions.
 */

export type DetailKind = "hosting" | "file" | "service" | "game-account" | "official-topup";

export type VariantOption = {
  id: string;
  name: string;
  note: string;
  price: string;
};

export type DetailReview = {
  name: string;
  initials: string;
  rating: number;
  date: string;
  body: string;
};

export type ProductDetail = {
  id: string;
  kind: DetailKind;
  breadcrumb: string[];
  name: string;
  tagline: string;
  gallery: string[];
  price: string;
  oldPrice?: string;
  promo?: string;
  priceNote: string;
  rating: number;
  reviews: number;
  sold: string;
  status: string;
  stock?: string;
  soldOut?: boolean;
  seller?: { handle: string; name: string; since: string; response: string };
  official?: boolean;
  promotedBy?: string;
  attributes: { label: string; value: string }[];
  variants?: { label: string; hint?: string; options: VariantOption[] };
  requiresAccountId?: boolean;
  fulfillment: { title: string; body: string };
  protectedNote: string;
  sections: { title: string; body: string[] }[];
  reviewList: DetailReview[];
  ratingBreakdown: { stars: number; percent: number }[];
  actions: ("buy" | "cart")[];
  related: string[];
};

const commonBreakdown = [
  { stars: 5, percent: 86 },
  { stars: 4, percent: 10 },
  { stars: 3, percent: 3 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 0 },
];

export const productDetails: Record<string, ProductDetail> = {
  "vps-4gb": {
    id: "vps-4gb",
    kind: "hosting",
    breadcrumb: ["Hosting & Infrastructure", "VPS", "VPS NVMe"],
    name: "VPS Cloud 4GB — NVMe Performance",
    tagline: "Server pribadi dengan NVMe cepat dan akses root penuh.",
    gallery: [productVps, worldHosting, productNotion],
    price: "Rp 149.000",
    oldPrice: "Rp 199.000",
    promo: "Hemat 25%",
    priceNote: "per bulan · belum termasuk pajak",
    rating: 4.9,
    reviews: 128,
    sold: "1.2rb terjual",
    status: "Tersedia",
    stock: "Kuota provisioning tersisa 18",
    seller: {
      handle: "@nexusstore",
      name: "Nexus Store",
      since: "Bergabung 2023",
      response: "Respons rata-rata di bawah 1 jam",
    },
    attributes: [
      { label: "Tipe", value: "VPS Cloud" },
      { label: "vCPU", value: "2 Core" },
      { label: "RAM", value: "4 GB" },
      { label: "Storage", value: "80 GB NVMe" },
      { label: "Bandwidth", value: "4 TB / bulan" },
      { label: "Region", value: "Jakarta, Indonesia" },
      { label: "Sistem Operasi", value: "Ubuntu · Debian · AlmaLinux" },
      { label: "Akses", value: "Root penuh" },
    ],
    variants: {
      label: "Pilih paket",
      hint: "Spesifikasi berubah mengikuti paket yang dipilih.",
      options: [
        { id: "s", name: "2 GB / 1 vCPU", note: "40 GB NVMe", price: "Rp 89.000" },
        { id: "m", name: "4 GB / 2 vCPU", note: "80 GB NVMe", price: "Rp 149.000" },
        { id: "l", name: "8 GB / 4 vCPU", note: "160 GB NVMe", price: "Rp 289.000" },
      ],
    },
    fulfillment: {
      title: "Provisioning otomatis",
      body: "Server disiapkan otomatis setelah pembayaran. Detail akses dikirim ke email dan halaman pesanan, umumnya dalam 5–15 menit.",
    },
    protectedNote:
      "Pembayaran ditahan Orphic sampai server aktif dan bisa diakses. Jika provisioning gagal, dana kembali penuh.",
    sections: [
      {
        title: "Tentang paket ini",
        body: [
          "Paket VPS untuk aplikasi produksi ringan hingga menengah: API, panel internal, bot, atau website dengan trafik stabil.",
          "Jaringan Jakarta memberi latensi rendah untuk pengguna Indonesia, dengan opsi migrasi region tanpa biaya tambahan.",
        ],
      },
      {
        title: "Yang kamu terima",
        body: [
          "Akses root penuh dengan panel kontrol untuk reboot, reinstall, dan snapshot.",
          "Snapshot mingguan otomatis dan penyimpanan snapshot manual hingga 3 slot.",
          "Bantuan teknis dasar untuk instalasi awal selama 7 hari.",
        ],
      },
      {
        title: "Ketentuan",
        body: [
          "Dilarang digunakan untuk aktivitas ilegal, spam, atau abuse jaringan.",
          "Perpanjangan dilakukan manual setiap bulan melalui halaman pesanan.",
        ],
      },
    ],
    reviewList: [
      {
        name: "Raka P.",
        initials: "RP",
        rating: 5,
        date: "2 minggu lalu",
        body: "Provisioning cepat, dalam sepuluh menit sudah bisa SSH. Disk NVMe terasa jauh lebih responsif dari VPS sebelumnya.",
      },
      {
        name: "Anya S.",
        initials: "AS",
        rating: 5,
        date: "1 bulan lalu",
        body: "Latensi ke Jakarta stabil. Bantuan setup awal jelas dan tidak bertele-tele.",
      },
      {
        name: "Dimas A.",
        initials: "DA",
        rating: 4,
        date: "1 bulan lalu",
        body: "Sudah sesuai spesifikasi. Dokumentasi panel bisa lebih lengkap.",
      },
    ],
    ratingBreakdown: commonBreakdown,
    actions: ["buy", "cart"],
    related: ["vps-8gb", "server-setup", "php-script"],
  },

  "vps-8gb": {
    id: "vps-8gb",
    kind: "hosting",
    breadcrumb: ["Hosting & Infrastructure", "VPS", "VPS NVMe"],
    name: "VPS Cloud 8GB — Singapore",
    tagline: "Kapasitas lebih besar untuk beban kerja global.",
    gallery: [productVps, worldHosting],
    price: "Rp 289.000",
    priceNote: "per bulan · belum termasuk pajak",
    rating: 4.8,
    reviews: 64,
    sold: "480 terjual",
    status: "Tersedia",
    stock: "Kuota provisioning tersisa 7",
    seller: {
      handle: "@cloudlab",
      name: "Cloud Lab",
      since: "Bergabung 2022",
      response: "Respons rata-rata 2 jam",
    },
    attributes: [
      { label: "Tipe", value: "VPS Cloud" },
      { label: "vCPU", value: "4 Core" },
      { label: "RAM", value: "8 GB" },
      { label: "Storage", value: "160 GB NVMe" },
      { label: "Bandwidth", value: "8 TB / bulan" },
      { label: "Region", value: "Singapore" },
    ],
    fulfillment: {
      title: "Provisioning otomatis",
      body: "Server aktif otomatis setelah pembayaran, umumnya dalam 10–20 menit.",
    },
    protectedNote: "Dana ditahan sampai server aktif dan dapat diakses pembeli.",
    sections: [
      {
        title: "Tentang paket ini",
        body: [
          "Cocok untuk aplikasi dengan pengguna lintas negara, container workload, atau database berukuran menengah.",
        ],
      },
      {
        title: "Ketentuan",
        body: ["Perpanjangan manual setiap bulan.", "Tanpa dukungan aplikasi pihak ketiga."],
      },
    ],
    reviewList: [
      {
        name: "Bima H.",
        initials: "BH",
        rating: 5,
        date: "3 minggu lalu",
        body: "Stabil untuk beban kerja container. Uptime sejauh ini tidak bermasalah.",
      },
    ],
    ratingBreakdown: commonBreakdown,
    actions: ["buy", "cart"],
    related: ["vps-4gb", "server-setup"],
  },

  "php-script": {
    id: "php-script",
    kind: "file",
    breadcrumb: ["Software & Development", "Script", "PHP Script"],
    name: "Premium PHP Script Marketplace",
    tagline: "Source code marketplace siap deploy dengan panel admin.",
    gallery: [productScript, worldSoftware, productNotion],
    price: "Rp 385.000",
    oldPrice: "Rp 480.000",
    promo: "Hemat 20%",
    priceNote: "sekali bayar · lisensi 1 proyek",
    rating: 4.8,
    reviews: 92,
    sold: "612 terjual",
    status: "Tersedia",
    seller: {
      handle: "@digitalhub",
      name: "Digital Hub",
      since: "Bergabung 2021",
      response: "Respons rata-rata 3 jam",
    },
    attributes: [
      { label: "Platform", value: "PHP 8.2 · Laravel 11" },
      { label: "Format file", value: "ZIP (source code)" },
      { label: "Ukuran", value: "48 MB" },
      { label: "Lisensi", value: "Commercial · 1 proyek" },
      { label: "Update", value: "Gratis 12 bulan" },
      { label: "Dukungan", value: "6 bulan" },
    ],
    variants: {
      label: "Tipe lisensi",
      options: [
        { id: "personal", name: "Personal", note: "1 proyek non-komersial", price: "Rp 249.000" },
        { id: "commercial", name: "Commercial", note: "1 proyek komersial", price: "Rp 385.000" },
        { id: "extended", name: "Extended", note: "Multi proyek", price: "Rp 890.000" },
      ],
    },
    fulfillment: {
      title: "Unduhan instan",
      body: "Tautan unduhan aktif segera setelah pembayaran dan tetap tersedia di halaman pesanan.",
    },
    protectedNote:
      "File diverifikasi Orphic sebelum dirilis ke pembeli. Laporkan dalam 3 hari jika isi tidak sesuai deskripsi.",
    sections: [
      {
        title: "Tentang produk",
        body: [
          "Source code marketplace multi-vendor dengan alur produk, keranjang, checkout, dan panel admin.",
          "Struktur kode mengikuti konvensi Laravel sehingga mudah dikembangkan lebih lanjut.",
        ],
      },
      {
        title: "Isi paket",
        body: [
          "Source code lengkap beserta file migrasi database.",
          "Dokumentasi instalasi dan konfigurasi environment.",
          "Aset desain dasar untuk halaman publik.",
        ],
      },
      {
        title: "Kebutuhan sistem",
        body: ["PHP 8.2 atau lebih baru.", "MySQL 8 / MariaDB 10.6.", "Composer dan Node.js 20."],
      },
    ],
    reviewList: [
      {
        name: "Anya S.",
        initials: "AS",
        rating: 5,
        date: "3 minggu lalu",
        body: "Struktur kode rapi dan dokumentasinya cukup untuk deploy sendiri.",
      },
      {
        name: "Kirana W.",
        initials: "KW",
        rating: 4,
        date: "2 bulan lalu",
        body: "Fitur sesuai deskripsi. Perlu sedikit penyesuaian untuk pembayaran lokal.",
      },
    ],
    ratingBreakdown: commonBreakdown,
    actions: ["buy", "cart"],
    related: ["wp-theme", "figma-kit", "vps-4gb"],
  },

  "wp-theme": {
    id: "wp-theme",
    kind: "file",
    breadcrumb: ["Software & Development", "Template", "WordPress Theme"],
    name: "WordPress Theme — Studio",
    tagline: "Tema portofolio studio dengan blok editor kustom.",
    gallery: [productNotion, worldSoftware],
    price: "Rp 249.000",
    priceNote: "sekali bayar · lisensi 1 situs",
    rating: 4.7,
    reviews: 41,
    sold: "301 terjual",
    status: "Tersedia",
    seller: {
      handle: "@digitalhub",
      name: "Digital Hub",
      since: "Bergabung 2021",
      response: "Respons rata-rata 3 jam",
    },
    attributes: [
      { label: "Platform", value: "WordPress 6.5+" },
      { label: "Format file", value: "ZIP (tema)" },
      { label: "Lisensi", value: "1 situs" },
      { label: "Update", value: "Gratis 12 bulan" },
    ],
    fulfillment: {
      title: "Unduhan instan",
      body: "File tema bisa diunduh langsung setelah pembayaran.",
    },
    protectedNote: "File diperiksa Orphic sebelum tersedia untuk pembeli.",
    sections: [
      {
        title: "Tentang produk",
        body: ["Tema untuk studio kreatif dengan halaman portofolio, layanan, dan kontak."],
      },
      { title: "Isi paket", body: ["File tema, child theme, dan panduan instalasi."] },
    ],
    reviewList: [
      {
        name: "Sinta R.",
        initials: "SR",
        rating: 5,
        date: "1 bulan lalu",
        body: "Tampilannya bersih dan mudah dikustom lewat block editor.",
      },
    ],
    ratingBreakdown: commonBreakdown,
    actions: ["buy", "cart"],
    related: ["php-script", "figma-kit"],
  },

  "ai-workflow": {
    id: "ai-workflow",
    kind: "file",
    breadcrumb: ["AI & Automation", "Workflow", "n8n Workflow"],
    name: "AI Automation Workflow Pack",
    tagline: "24 workflow n8n siap impor untuk operasional harian.",
    gallery: [productPrompt, worldAi],
    price: "Rp 179.000",
    priceNote: "sekali bayar · penggunaan pribadi & komersial",
    rating: 4.9,
    reviews: 74,
    sold: "930 terjual",
    status: "Tersedia",
    seller: {
      handle: "@nexusstore",
      name: "Nexus Store",
      since: "Bergabung 2023",
      response: "Respons rata-rata di bawah 1 jam",
    },
    attributes: [
      { label: "Format file", value: "JSON · 24 workflow" },
      { label: "Kompatibilitas", value: "n8n 1.4x" },
      { label: "Model", value: "GPT · Claude · Gemini" },
      { label: "Lisensi", value: "Komersial" },
    ],
    fulfillment: {
      title: "Unduhan instan",
      body: "Berkas JSON tersedia segera setelah pembayaran, tinggal diimpor ke n8n.",
    },
    protectedNote: "Isi paket diverifikasi Orphic sebelum dirilis.",
    sections: [
      {
        title: "Tentang produk",
        body: ["Kumpulan workflow untuk ringkasan email, riset, dan pelaporan otomatis."],
      },
      {
        title: "Catatan",
        body: ["Kredensial model AI dan layanan pihak ketiga disiapkan sendiri oleh pembeli."],
      },
    ],
    reviewList: [
      {
        name: "Dimas A.",
        initials: "DA",
        rating: 5,
        date: "2 minggu lalu",
        body: "Impor lancar, tiga workflow langsung dipakai untuk laporan mingguan.",
      },
    ],
    ratingBreakdown: commonBreakdown,
    actions: ["buy", "cart"],
    related: ["php-script", "figma-kit"],
  },

  "figma-kit": {
    id: "figma-kit",
    kind: "file",
    breadcrumb: ["Design & Creative", "UI Kit", "Figma Kit"],
    name: "Figma UI Kit — Aurora",
    tagline: "Sistem desain gelap dengan 320 komponen tertata.",
    gallery: [productUikit, worldDesign],
    price: "Rp 219.000",
    priceNote: "sekali bayar · lisensi komersial",
    rating: 5,
    reviews: 58,
    sold: "340 terjual",
    status: "Tersedia",
    seller: {
      handle: "@cloudlab",
      name: "Cloud Lab",
      since: "Bergabung 2022",
      response: "Respons rata-rata 2 jam",
    },
    attributes: [
      { label: "Tools", value: "Figma" },
      { label: "Format file", value: "FIG" },
      { label: "Komponen", value: "320 komponen" },
      { label: "Lisensi", value: "Komersial" },
    ],
    fulfillment: {
      title: "Akses instan",
      body: "Tautan file Figma dikirim segera setelah pembayaran.",
    },
    protectedNote: "Akses diverifikasi Orphic sebelum diserahkan ke pembeli.",
    sections: [
      {
        title: "Tentang produk",
        body: ["Kit desain dengan token warna, tipografi, dan komponen berbasis auto layout."],
      },
    ],
    reviewList: [
      {
        name: "Kirana W.",
        initials: "KW",
        rating: 5,
        date: "3 minggu lalu",
        body: "Penamaan layer konsisten, langsung enak dipakai di proyek klien.",
      },
    ],
    ratingBreakdown: commonBreakdown,
    actions: ["buy", "cart"],
    related: ["wp-theme", "ai-workflow"],
  },

  "server-setup": {
    id: "server-setup",
    kind: "service",
    breadcrumb: ["Digital Services", "Setup & Instalasi", "Server Setup"],
    name: "Setup & Hardening Server Produksi",
    tagline: "Dikerjakan langsung oleh seller, selesai dalam 1–3 hari.",
    gallery: [worldHosting, worldCreator],
    price: "Rp 450.000",
    priceNote: "sekali kerja · satu server",
    rating: 4.8,
    reviews: 33,
    sold: "126 terjual",
    status: "Menerima pesanan",
    seller: {
      handle: "@cloudlab",
      name: "Cloud Lab",
      since: "Bergabung 2022",
      response: "Respons rata-rata 2 jam",
    },
    attributes: [
      { label: "Jenis", value: "Layanan seller" },
      { label: "Waktu kerja", value: "1–3 hari kerja" },
      { label: "Revisi", value: "2 kali" },
      { label: "Cakupan", value: "1 server" },
    ],
    fulfillment: {
      title: "Dikerjakan oleh seller",
      body: "Setelah pembayaran, seller menghubungi kamu untuk mengumpulkan akses dan kebutuhan. Pekerjaan dimulai setelah data lengkap.",
    },
    protectedNote:
      "Dana ditahan Orphic sampai kamu menyetujui hasil pekerjaan atau masa peninjauan berakhir.",
    sections: [
      {
        title: "Cakupan layanan",
        body: [
          "Instalasi web server, database, dan runtime aplikasi sesuai kebutuhan.",
          "Konfigurasi firewall, SSH key, fail2ban, dan pembaruan otomatis.",
          "Pemasangan sertifikat SSL dan pengujian akhir.",
        ],
      },
      {
        title: "Yang perlu kamu siapkan",
        body: [
          "Akses root ke server yang akan dikonfigurasi.",
          "Domain dan akses DNS bila dibutuhkan SSL.",
        ],
      },
      { title: "Di luar cakupan", body: ["Pengembangan aplikasi dan migrasi data berskala besar."] },
    ],
    reviewList: [
      {
        name: "Bima H.",
        initials: "BH",
        rating: 5,
        date: "1 bulan lalu",
        body: "Komunikasi jelas, selesai dua hari, dokumentasi konfigurasi diberikan.",
      },
    ],
    ratingBreakdown: commonBreakdown,
    actions: ["buy"],
    related: ["vps-4gb", "vps-8gb"],
  },

  "ml-account": {
    id: "ml-account",
    kind: "game-account",
    breadcrumb: ["Gaming", "Game Account", "Akun Mobile Legends"],
    name: "Akun Mobile Legends — Mythic Glory",
    tagline: "Transfer akun dengan pendampingan Orphic Protected.",
    gallery: [productAccount, worldGaming],
    price: "Rp 1.250.000",
    priceNote: "sekali bayar · satu akun",
    rating: 4.9,
    reviews: 12,
    sold: "38 terjual",
    status: "Terjual",
    soldOut: true,
    seller: {
      handle: "@nexusstore",
      name: "Nexus Store",
      since: "Bergabung 2023",
      response: "Respons rata-rata di bawah 1 jam",
    },
    attributes: [
      { label: "Game", value: "Mobile Legends" },
      { label: "Rank", value: "Mythic Glory" },
      { label: "Level", value: "72" },
      { label: "Hero", value: "112 hero" },
      { label: "Skin", value: "48 skin" },
      { label: "Region", value: "Indonesia" },
      { label: "Binding", value: "Moonton · email tersedia" },
    ],
    fulfillment: {
      title: "Serah terima terpandu",
      body: "Data akun tidak diberikan otomatis. Serah terima dilakukan bertahap bersama Orphic: verifikasi pemilik, pelepasan binding, lalu pemindahan ke akun pembeli.",
    },
    protectedNote:
      "Dana ditahan sampai proses pelepasan binding selesai dan pembeli mengonfirmasi akses penuh.",
    sections: [
      {
        title: "Informasi akun",
        body: [
          "Akun dengan riwayat rank stabil dan koleksi skin lengkap pada beberapa role utama.",
          "Tangkapan layar rank, koleksi hero, dan status binding disertakan pada galeri.",
        ],
      },
      {
        title: "Keamanan & serah terima",
        body: [
          "Penjual wajib melepas seluruh binding pihak ketiga sebelum transfer.",
          "Pembeli disarankan mengganti email dan kata sandi segera setelah serah terima.",
          "Percakapan serah terima direkam pada halaman pesanan sebagai bukti.",
        ],
      },
    ],
    reviewList: [
      {
        name: "Raka P.",
        initials: "RP",
        rating: 5,
        date: "2 bulan lalu",
        body: "Serah terima dipandu tahap demi tahap, binding dilepas tanpa kendala.",
      },
    ],
    ratingBreakdown: commonBreakdown,
    actions: [],
    related: ["topup-ml", "vps-4gb"],
  },

  "topup-ml": {
    id: "topup-ml",
    kind: "official-topup",
    breadcrumb: ["Orphic Official", "Top Up", "Mobile Legends"],
    name: "Top Up Mobile Legends — Diamonds",
    tagline: "Layanan resmi Orphic dengan pengiriman otomatis ke ID pemain.",
    gallery: [worldGaming, productAccount],
    price: "Rp 21.000",
    priceNote: "harga mengikuti denominasi yang dipilih",
    rating: 4.9,
    reviews: 2140,
    sold: "58rb terjual",
    status: "Layanan aktif",
    official: true,
    promotedBy: "@nexusstore",
    attributes: [
      { label: "Penyedia", value: "Orphic Official" },
      { label: "Metode", value: "Pengisian otomatis ke ID" },
      { label: "Estimasi", value: "Instan · di bawah 1 menit" },
      { label: "Wilayah", value: "Indonesia" },
    ],
    variants: {
      label: "Pilih denominasi",
      hint: "Harga menyesuaikan denominasi.",
      options: [
        { id: "d86", name: "86 Diamonds", note: "Paling sering dibeli", price: "Rp 21.000" },
        { id: "d172", name: "172 Diamonds", note: "", price: "Rp 41.000" },
        { id: "d257", name: "257 Diamonds", note: "", price: "Rp 61.000" },
        { id: "d706", name: "706 Diamonds", note: "", price: "Rp 165.000" },
      ],
    },
    requiresAccountId: true,
    fulfillment: {
      title: "Pengisian otomatis",
      body: "Diamond masuk otomatis ke ID pemain setelah pembayaran terkonfirmasi, umumnya kurang dari satu menit.",
    },
    protectedNote:
      "Transaksi diproses langsung oleh Orphic. Jika pengisian gagal, dana dikembalikan otomatis ke Dompet.",
    sections: [
      {
        title: "Cara pesan",
        body: [
          "Masukkan User ID dan Server sesuai profil dalam game.",
          "Pilih denominasi, lalu lanjutkan ke pembayaran.",
          "Diamond masuk otomatis tanpa perlu login akun.",
        ],
      },
      {
        title: "Catatan",
        body: ["Pastikan User ID dan Server benar. Pengisian yang sudah masuk tidak bisa dibatalkan."],
      },
    ],
    reviewList: [
      {
        name: "Sinta R.",
        initials: "SR",
        rating: 5,
        date: "3 hari lalu",
        body: "Masuk kurang dari satu menit, tidak perlu login akun.",
      },
      {
        name: "Bima H.",
        initials: "BH",
        rating: 5,
        date: "1 minggu lalu",
        body: "Nominalnya lengkap dan prosesnya sederhana.",
      },
    ],
    ratingBreakdown: commonBreakdown,
    actions: ["buy"],
    related: ["ml-account", "ai-workflow"],
  },
};

export function getProductDetail(id: string): ProductDetail | undefined {
  return productDetails[id];
}
