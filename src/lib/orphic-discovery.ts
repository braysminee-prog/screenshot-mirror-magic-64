import productVps from "@/assets/product-vps.jpg";
import productScript from "@/assets/product-script.jpg";
import productUikit from "@/assets/product-uikit.jpg";
import productPrompt from "@/assets/product-prompt.jpg";
import productAccount from "@/assets/product-account.jpg";
import productNotion from "@/assets/product-notion.jpg";
import worldSoftware from "@/assets/world-software.jpg";
import worldAi from "@/assets/world-ai.jpg";
import worldDesign from "@/assets/world-design.jpg";
import worldGaming from "@/assets/world-gaming.jpg";
import worldHosting from "@/assets/world-hosting.jpg";
import worldCreator from "@/assets/world-creator.jpg";

export type CategoryKey = "hosting" | "software" | "ai" | "design" | "gaming" | "services";

export type Category = {
  key: CategoryKey;
  name: string;
  blurb: string;
  image: string;
  subcategories: string[];
  productTypes: string[];
  filters: { label: string; options: string[] }[];
  sorts: string[];
};

export const categories: Category[] = [
  {
    key: "hosting",
    name: "Hosting & Infrastructure",
    blurb: "Server, VPS, dan infrastruktur cloud dari penjual terverifikasi.",
    image: worldHosting,
    subcategories: ["VPS", "Hosting", "Server", "Cloud Infrastructure"],
    productTypes: ["VPS NVMe", "Shared Hosting", "Dedicated Server", "Object Storage"],
    filters: [
      { label: "Tipe Server", options: ["VPS", "Dedicated", "Cloud"] },
      { label: "RAM", options: ["2GB", "4GB", "8GB", "16GB"] },
      { label: "Storage", options: ["NVMe", "SSD", "HDD"] },
      { label: "Region", options: ["Indonesia", "Singapore", "Global"] },
      { label: "Billing", options: ["Bulanan", "Tahunan"] },
    ],
    sorts: ["Relevan", "Terbaru", "Harga Terendah", "Harga Tertinggi", "Terlaris"],
  },
  {
    key: "software",
    name: "Software & Development",
    blurb: "Script, template, dan source code siap pakai.",
    image: worldSoftware,
    subcategories: ["Script", "Template", "Source Code", "Plugin"],
    productTypes: ["PHP Script", "WordPress Theme", "Mobile App", "SaaS Boilerplate"],
    filters: [
      { label: "Platform", options: ["PHP", "Laravel", "WordPress", "React"] },
      { label: "Lisensi", options: ["Personal", "Commercial", "Extended"] },
      { label: "Tipe File", options: ["ZIP", "Repository", "Installer"] },
      { label: "Harga", options: ["Di bawah Rp100rb", "Rp100rb–500rb", "Di atas Rp500rb"] },
    ],
    sorts: ["Relevan", "Terbaru", "Harga Terendah", "Harga Tertinggi", "Terlaris"],
  },
  {
    key: "ai",
    name: "AI & Automation",
    blurb: "Prompt, agent, dan workflow otomatis yang sudah teruji.",
    image: worldAi,
    subcategories: ["Prompt Pack", "Agent", "Workflow", "AI Tools"],
    productTypes: ["Prompt Library", "n8n Workflow", "Custom GPT", "Automation Kit"],
    filters: [
      { label: "Model", options: ["GPT", "Claude", "Gemini", "Open Source"] },
      { label: "Format", options: ["Prompt", "Workflow", "Template"] },
      { label: "Harga", options: ["Di bawah Rp100rb", "Rp100rb–500rb"] },
    ],
    sorts: ["Relevan", "Terbaru", "Harga Terendah", "Terlaris"],
  },
  {
    key: "design",
    name: "Design & Creative",
    blurb: "UI kit, aset brand, dan ilustrasi berkualitas studio.",
    image: worldDesign,
    subcategories: ["UI Kit", "Brand Asset", "Ilustrasi", "Mockup"],
    productTypes: ["Figma Kit", "Icon Set", "Font", "Presentation"],
    filters: [
      { label: "Tools", options: ["Figma", "Adobe", "Sketch"] },
      { label: "Tipe File", options: ["FIG", "PSD", "SVG", "AI"] },
      { label: "Lisensi", options: ["Personal", "Commercial"] },
    ],
    sorts: ["Relevan", "Terbaru", "Harga Terendah", "Terlaris"],
  },
  {
    key: "gaming",
    name: "Gaming",
    blurb: "Akun, item, dan layanan game dengan alur khusus.",
    image: worldGaming,
    subcategories: ["Game Account", "Item", "Joki & Layanan"],
    productTypes: ["Akun Mobile Legends", "Akun Genshin", "Boosting", "Item Bundle"],
    filters: [
      { label: "Game", options: ["Mobile Legends", "Free Fire", "PUBG Mobile", "Valorant"] },
      { label: "Rank", options: ["Epic", "Legend", "Mythic", "Immortal"] },
      { label: "Level", options: ["< 50", "50–100", "> 100"] },
      { label: "Region", options: ["Indonesia", "Asia", "Global"] },
    ],
    sorts: ["Relevan", "Terbaru", "Harga Terendah", "Harga Tertinggi"],
  },
  {
    key: "services",
    name: "Digital Services",
    blurb: "Layanan digital yang dikerjakan langsung oleh seller.",
    image: worldCreator,
    subcategories: ["Setup & Instalasi", "Konsultasi", "Maintenance"],
    productTypes: ["Server Setup", "Audit", "Support Bulanan"],
    filters: [
      { label: "Durasi", options: ["Sekali kerja", "Bulanan"] },
      { label: "Waktu Kerja", options: ["< 24 jam", "1–3 hari", "> 3 hari"] },
    ],
    sorts: ["Relevan", "Terbaru", "Harga Terendah", "Terlaris"],
  },
];

export type Product = {
  id: string;
  name: string;
  price: string;
  rating: number;
  sold: string;
  seller: string;
  image: string;
  category: CategoryKey;
  type: string;
  soldOut?: boolean;
};

export const products: Product[] = [
  {
    id: "vps-4gb",
    name: "VPS 4GB NVMe — Indonesia",
    price: "Rp 149.000",
    rating: 4.9,
    sold: "1.2rb terjual",
    seller: "@nexusstore",
    image: productVps,
    category: "hosting",
    type: "VPS NVMe",
  },
  {
    id: "vps-8gb",
    name: "VPS 8GB NVMe — Singapore",
    price: "Rp 289.000",
    rating: 4.8,
    sold: "480 terjual",
    seller: "@cloudlab",
    image: productVps,
    category: "hosting",
    type: "VPS NVMe",
  },
  {
    id: "php-script",
    name: "Premium PHP Script Marketplace",
    price: "Rp 385.000",
    rating: 4.8,
    sold: "612 terjual",
    seller: "@digitalhub",
    image: productScript,
    category: "software",
    type: "PHP Script",
  },
  {
    id: "wp-theme",
    name: "WordPress Theme — Studio",
    price: "Rp 249.000",
    rating: 4.7,
    sold: "301 terjual",
    seller: "@digitalhub",
    image: productNotion,
    category: "software",
    type: "WordPress Theme",
  },
  {
    id: "ai-workflow",
    name: "AI Automation Workflow Pack",
    price: "Rp 179.000",
    rating: 4.9,
    sold: "930 terjual",
    seller: "@nexusstore",
    image: productPrompt,
    category: "ai",
    type: "n8n Workflow",
  },
  {
    id: "figma-kit",
    name: "Figma UI Kit — Aurora",
    price: "Rp 219.000",
    rating: 5,
    sold: "340 terjual",
    seller: "@cloudlab",
    image: productUikit,
    category: "design",
    type: "Figma Kit",
  },
  {
    id: "ml-account",
    name: "Akun Mobile Legends Mythic",
    price: "Rp 1.250.000",
    rating: 4.9,
    sold: "38 terjual",
    seller: "@nexusstore",
    image: productAccount,
    category: "gaming",
    type: "Akun Mobile Legends",
    soldOut: true,
  },
  {
    id: "server-setup",
    name: "Setup & Hardening Server Produksi",
    price: "Rp 450.000",
    rating: 4.8,
    sold: "126 terjual",
    seller: "@cloudlab",
    image: worldHosting,
    category: "services",
    type: "Server Setup",
  },
];

export const suggestedSearches = [
  "VPS 4GB",
  "Game Account Mobile Legends",
  "Script PHP",
  "Hosting murah",
  "AI Tools",
  "Figma UI Kit",
  "@nexusstore",
];

export type Suggestion = { label: string; kind: "Produk" | "Kategori" | "Seller" | "Game" | "Layanan" };

export const suggestionPool: Suggestion[] = [
  { label: "VPS 4GB", kind: "Produk" },
  { label: "VPS 8GB NVMe", kind: "Produk" },
  { label: "Hosting VPS", kind: "Kategori" },
  { label: "VPS Indonesia", kind: "Produk" },
  { label: "Hosting & Infrastructure", kind: "Kategori" },
  { label: "Script PHP Marketplace", kind: "Produk" },
  { label: "WordPress Theme", kind: "Produk" },
  { label: "AI Automation Workflow", kind: "Produk" },
  { label: "Figma UI Kit", kind: "Produk" },
  { label: "Mobile Legends", kind: "Game" },
  { label: "Free Fire", kind: "Game" },
  { label: "Setup Server Produksi", kind: "Layanan" },
  { label: "@nexusstore", kind: "Seller" },
  { label: "@cloudlab", kind: "Seller" },
  { label: "@digitalhub", kind: "Seller" },
];

export const topUpTitles = [
  "Mobile Legends",
  "Free Fire",
  "PUBG Mobile",
  "Valorant",
  "Roblox",
  "Genshin Impact",
];
