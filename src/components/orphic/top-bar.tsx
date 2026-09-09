import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/orphic-cart";

const menuItems = [
  { label: "Beranda", to: "/" },
  { label: "Pencarian", to: "/search" },
  { label: "Keranjang", to: "/cart" },
  { label: "Pesanan", to: "/orders" },
  { label: "Dompet", to: undefined },
  { label: "Komunitas", to: undefined },
  { label: "Shorts", to: undefined },
  { label: "Profil", to: undefined },
] as const;

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();


  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10 md:py-6">
          <button
            type="button"
            aria-label="Buka menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="flex size-10 items-center justify-center rounded-full orphic-glass text-foreground/85 transition-colors duration-300 hover:text-foreground"
          >
            <Menu className="size-[18px]" strokeWidth={1.5} />
          </button>

          <span className="orphic-display select-none text-[15px] tracking-[0.34em] text-foreground/90">
            ORPHIC
          </span>

          <div className="flex items-center gap-2">
            <Link
              to="/search"
              aria-label="Cari di Orphic"
              className="flex size-10 items-center justify-center rounded-full orphic-glass text-foreground/85 transition-colors duration-300 hover:text-foreground"
            >
              <Search className="size-[18px]" strokeWidth={1.5} />
            </Link>
            <Link
              to="/cart"
              aria-label={
                count > 0 ? `Keranjang, ${count} item` : "Keranjang, kosong"
              }
              className="relative flex size-10 items-center justify-center rounded-full orphic-glass text-foreground/85 transition-colors duration-300 hover:text-foreground"
            >
              <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
              {count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex size-[17px] items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {count > 9 ? "9+" : count}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              aria-label="Notifikasi, 3 belum dibaca"
              className="relative flex size-10 items-center justify-center rounded-full orphic-glass text-foreground/85 transition-colors duration-300 hover:text-foreground"
            >
              <Bell className="size-[18px]" strokeWidth={1.5} />
              <span className="absolute -right-0.5 -top-0.5 flex size-[17px] items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu utama">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />
          <div className="orphic-rise absolute inset-y-0 left-0 flex w-[280px] flex-col border-r border-hairline bg-card px-8 py-6">
            <div className="flex items-center justify-between">
              <span className="orphic-display text-[13px] tracking-[0.34em] text-foreground/90">
                ORPHIC
              </span>
              <button
                type="button"
                aria-label="Tutup menu"
                onClick={() => setMenuOpen(false)}
                className="flex size-10 items-center justify-center rounded-full orphic-glass text-foreground/85 transition-colors duration-300 hover:text-foreground"
              >
                <X className="size-[18px]" strokeWidth={1.5} />
              </button>
            </div>

            <nav aria-label="Menu utama" className="mt-12 flex flex-col gap-1">
              {menuItems.map(({ label, to }) =>
                to !== undefined ? (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className="orphic-display rounded-xl px-3 py-3 text-lg text-foreground transition-colors duration-300 hover:bg-surface hover:text-primary"
                  >
                    {label}
                  </Link>
                ) : (
                  <span
                    key={label}
                    className="orphic-display flex items-center justify-between rounded-xl px-3 py-3 text-lg text-muted-foreground/70"
                  >
                    {label}
                    <span className="text-[10px] uppercase tracking-[0.2em]">Segera</span>
                  </span>
                ),
              )}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
