import { Search, X } from "lucide-react";
import type { Suggestion } from "@/lib/orphic-discovery";

export function SearchField({
  value,
  onChange,
  onFocus,
  onClear,
  suggestions,
  onPick,
  open,
}: {
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onClear: () => void;
  suggestions: Suggestion[];
  onPick: (s: string) => void;
  open: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex h-13 items-center gap-3 rounded-full orphic-glass px-5 py-3.5 transition-colors duration-300 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/25">
        <Search className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={1.5} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder="Cari produk, layanan, game, atau seller..."
          aria-label="Cari di Orphic"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground/70"
        />
        {value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Hapus pencarian"
            className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <X className="size-[17px]" strokeWidth={1.5} />
          </button>
        ) : null}
      </div>

      {open && suggestions.length > 0 ? (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl orphic-glass">
          <ul>
            {suggestions.map((s) => (
              <li key={s.label}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onPick(s.label)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors duration-200 hover:bg-foreground/5"
                >
                  <span className="truncate text-[13.5px] text-foreground/90">{s.label}</span>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                    {s.kind}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
