import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/lib/orphic-discovery";

export function FilterControls({
  category,
  active,
  onToggle,
  onClear,
  sort,
  onSort,
  count,
}: {
  category: Category;
  active: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  sort: string;
  onSort: (value: string) => void;
  count: number;
}) {
  const [drawer, setDrawer] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[12px] text-muted-foreground">
          {count} produk · {category.name}
        </p>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              aria-expanded={sortOpen}
              className="inline-flex h-10 items-center gap-2 rounded-full orphic-glass px-4 text-[12.5px] text-foreground/85 transition-colors duration-300 hover:text-foreground"
            >
              {sort}
              <ChevronDown
                className={`size-[15px] transition-transform duration-300 ${sortOpen ? "rotate-180" : ""}`}
                strokeWidth={1.5}
              />
            </button>
            {sortOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-52 overflow-hidden rounded-2xl orphic-glass">
                {category.sorts.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onSort(option);
                      setSortOpen(false);
                    }}
                    className={`block w-full px-5 py-3 text-left text-[13px] transition-colors duration-200 hover:bg-foreground/5 ${
                      option === sort ? "text-primary" : "text-foreground/85"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full orphic-glass px-4 text-[12.5px] text-foreground/85 transition-colors duration-300 hover:text-foreground lg:hidden"
          >
            <SlidersHorizontal className="size-[15px]" strokeWidth={1.5} />
            Filter
            {active.length ? (
              <span className="flex size-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {active.length}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {active.length ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {active.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onToggle(chip)}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11.5px] text-foreground/90 transition-colors duration-300 hover:bg-primary/15"
            >
              {chip}
              <X className="size-3" strokeWidth={2} />
            </button>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="px-1 text-[11.5px] text-muted-foreground underline-offset-4 transition-colors duration-300 hover:text-foreground hover:underline"
          >
            Hapus semua
          </button>
        </div>
      ) : null}

      {drawer ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup filter"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-3xl border-t border-hairline bg-background px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6">
            <div className="flex items-center justify-between">
              <h3 className="orphic-display text-lg text-foreground">Filter</h3>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Tutup"
                className="flex size-9 items-center justify-center rounded-full orphic-glass text-foreground/80"
              >
                <X className="size-[17px]" strokeWidth={1.5} />
              </button>
            </div>

            <FilterGroups category={category} active={active} onToggle={onToggle} />

            <div className="sticky bottom-0 mt-8 bg-background pb-2 pt-4">
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="h-12 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground"
              >
                Tampilkan {count} produk
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function FilterGroups({
  category,
  active,
  onToggle,
}: {
  category: Category;
  active: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="mt-6 space-y-7">
      {category.filters.map((group) => (
        <div key={group.label}>
          <p className="orphic-eyebrow">{group.label}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.options.map((option) => {
              const on = active.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onToggle(option)}
                  aria-pressed={on}
                  className={`rounded-full border px-3.5 py-1.5 text-[12px] transition-colors duration-300 ${
                    on
                      ? "border-primary/40 bg-primary/12 text-foreground"
                      : "border-hairline text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
