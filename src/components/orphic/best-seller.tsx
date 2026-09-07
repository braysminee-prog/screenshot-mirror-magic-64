import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { SellerSignature } from "./seller-signature";
import productVps from "@/assets/product-vps.jpg";
import productScript from "@/assets/product-script.jpg";
import productUikit from "@/assets/product-uikit.jpg";
import productPrompt from "@/assets/product-prompt.jpg";
import productAccount from "@/assets/product-account.jpg";
import productNotion from "@/assets/product-notion.jpg";

type Product = {
  id: string;
  detailId: string;
  name: string;
  price: string;
  rating: number;
  sold: string;
  seller: string;
  image: string;
  soldOut?: boolean;
};

const products: Product[] = [
  {
    id: "vps",
    detailId: "vps-4gb",
    name: "VPS 4GB NVMe — Singapore",
    price: "Rp 149.000",
    rating: 4.9,
    sold: "1.2rb terjual",
    seller: "@nexusstore",
    image: productVps,
  },
  {
    id: "script",
    detailId: "php-script",
    name: "Script PHP Marketplace",
    price: "Rp 385.000",
    rating: 4.8,
    sold: "612 terjual",
    seller: "@codeforge",
    image: productScript,
  },
  {
    id: "uikit",
    detailId: "figma-kit",
    name: "Aurora UI Kit — Figma",
    price: "Rp 219.000",
    rating: 5.0,
    sold: "340 terjual",
    seller: "@studioalba",
    image: productUikit,
  },
  {
    id: "prompt",
    detailId: "ai-workflow",
    name: "Prompt Pack Produktivitas",
    price: "Rp 79.000",
    rating: 4.7,
    sold: "2.4rb terjual",
    seller: "@aivault",
    image: productPrompt,
  },
  {
    id: "account",
    detailId: "ml-account",
    name: "Akun Mobile Legends Mythic",
    price: "Rp 1.250.000",
    rating: 4.9,
    sold: "38 terjual",
    seller: "@arenashop",
    image: productAccount,
    soldOut: true,
  },
  {
    id: "notion",
    detailId: "wp-theme",
    name: "Notion Business OS",
    price: "Rp 129.000",
    rating: 4.8,
    sold: "870 terjual",
    seller: "@planlab",
    image: productNotion,
  },
];

function ProductTile({ product }: { product: Product }) {
  const [loved, setLoved] = useState(false);

  return (
    <article className="group relative">
      <Link
        to="/product/$id"
        params={{ id: product.detailId }}
        className="block focus-visible:outline-none"
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-card">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className={`size-full object-cover transition-transform duration-700 ease-[var(--ease-orphic)] group-hover:scale-[1.03] ${
              product.soldOut ? "opacity-45 saturate-50" : ""
            }`}
          />

          {product.soldOut ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full orphic-glass px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/90">
                Sold Out
              </span>
            </div>
          ) : null}
        </div>

        <div className="px-0.5 pt-3">
          <h3 className="line-clamp-2 text-[13.5px] leading-snug text-foreground md:text-sm">
            {product.name}
          </h3>
          <p className="orphic-display mt-2 text-[15px] tracking-normal text-foreground">
            {product.price}
          </p>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="size-3 fill-primary text-primary" strokeWidth={1.5} />
              {product.rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span>{product.sold}</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="truncate text-[11.5px] text-muted-foreground">{product.seller}</span>
            <SellerSignature />
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => setLoved((v) => !v)}
        aria-label={loved ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        aria-pressed={loved}
        className="absolute right-2.5 top-2.5 z-10 flex size-9 items-center justify-center rounded-full orphic-glass text-foreground/80 transition-colors duration-300 hover:text-foreground"
      >
        <Heart
          className={`size-[17px] transition-colors duration-300 ${
            loved ? "fill-destructive text-destructive" : ""
          }`}
          strokeWidth={1.5}
        />
      </button>
    </article>
  );
}

export function BestSeller() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Kurasi"
          title="Best Seller"
          description="Pilihan yang paling banyak dicari."
        />

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 md:grid-cols-3 md:gap-x-8 lg:gap-x-10">
          {products.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
