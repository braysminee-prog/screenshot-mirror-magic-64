import { ChevronRight } from "lucide-react";
import type { Category } from "@/lib/orphic-discovery";

export function CategoryRail({
  categories,
  selected,
  onSelect,
}: {
  categories: Category[];
  selected: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="-mx-6 flex snap-x gap-2 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const on = selected === category.key;
        return (
          <button
            key={category.key}
            type="button"
            onClick={() => onSelect(category.key)}
            aria-pressed={on}
            className={`shrink-0 snap-start rounded-full border px-4 py-2 text-[12.5px] transition-colors duration-300 ${
              on
                ? "border-primary/40 bg-primary/12 text-foreground"
                : "border-hairline text-muted-foreground hover:text-foreground"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

export function CategoryOrientation({
  category,
  subcategory,
  onSubcategory,
  productType,
  onProductType,
}: {
  category: Category;
  subcategory: string | null;
  onSubcategory: (value: string | null) => void;
  productType: string | null;
  onProductType: (value: string | null) => void;
}) {
  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-hairline">
      <div className="relative">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          width={1024}
          height={512}
          className="h-40 w-full object-cover md:h-56"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            <span>{category.name}</span>
            {subcategory ? (
              <>
                <ChevronRight className="size-3" strokeWidth={1.5} />
                <span className="text-foreground/80">{subcategory}</span>
              </>
            ) : null}
            {productType ? (
              <>
                <ChevronRight className="size-3" strokeWidth={1.5} />
                <span className="text-foreground/80">{productType}</span>
              </>
            ) : null}
          </nav>
          <h2 className="orphic-display mt-2 text-[1.6rem] text-foreground md:text-3xl">
            {category.name}
          </h2>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
            {category.blurb}
          </p>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 md:px-8 md:py-8">
        <div>
          <p className="orphic-eyebrow">Subkategori</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {category.subcategories.map((item) => {
              const on = subcategory === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSubcategory(on ? null : item)}
                  aria-pressed={on}
                  className={`rounded-full border px-3.5 py-1.5 text-[12px] transition-colors duration-300 ${
                    on
                      ? "border-primary/40 bg-primary/12 text-foreground"
                      : "border-hairline text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="orphic-eyebrow">Tipe Produk</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {category.productTypes.map((item) => {
              const on = productType === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onProductType(on ? null : item)}
                  aria-pressed={on}
                  className={`rounded-full border px-3.5 py-1.5 text-[12px] transition-colors duration-300 ${
                    on
                      ? "border-primary/40 bg-primary/12 text-foreground"
                      : "border-hairline text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
