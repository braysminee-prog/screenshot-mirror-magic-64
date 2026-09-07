import { useEffect, useRef, useState } from "react";

export function MediaGallery({
  images,
  alt,
  soldOut,
}: {
  images: string[];
  alt: string;
  soldOut?: boolean;
}) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    function onScroll() {
      const node = trackRef.current;
      if (!node) return;
      const index = Math.round(node.scrollLeft / node.clientWidth);
      setActive((prev) => (prev === index ? prev : index));
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(index: number) {
    const el = trackRef.current;
    setActive(index);
    if (el) el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="orphic-rise">
      <div className="relative overflow-hidden rounded-3xl bg-card">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={`${alt} — media ${i + 1}`}
              width={1280}
              height={1280}
              loading={i === 0 ? "eager" : "lazy"}
              className={`aspect-square w-full shrink-0 snap-center object-cover md:aspect-[4/3] ${
                soldOut ? "opacity-45 saturate-50" : ""
              }`}
            />
          ))}
        </div>

        {soldOut ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="orphic-glass rounded-full px-5 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-foreground/90">
              Sold Out
            </span>
          </div>
        ) : null}

        {images.length > 1 ? (
          <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 md:hidden">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === active ? "w-5 bg-foreground/85" : "w-1.5 bg-foreground/35"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-4 hidden gap-3 md:flex">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Lihat media ${i + 1}`}
              aria-current={i === active}
              className={`size-20 overflow-hidden rounded-xl border transition-colors duration-300 ${
                i === active ? "border-primary/60" : "border-hairline hover:border-foreground/25"
              }`}
            >
              <img src={src} alt="" width={160} height={160} className="size-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
