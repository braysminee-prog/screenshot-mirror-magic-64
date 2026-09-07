import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { SellerSignature } from "../seller-signature";
import type { Product } from "@/lib/orphic-discovery";

export function ProductCard({ product }: { product: Product }) {
  const [loved, setLoved] = useState(false);

  return (
    <article className="group relative">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
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
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            {product.type}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-[13.5px] leading-snug text-foreground md:text-sm">
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

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-2xl bg-card" />
      <div className="mt-3 h-3 w-3/4 rounded-full bg-card" />
      <div className="mt-2.5 h-3 w-1/3 rounded-full bg-card" />
    </div>
  );
}
