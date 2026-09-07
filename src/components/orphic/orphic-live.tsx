import { useEffect, useRef } from "react";

const activities = [
  { text: "Raka baru saja membeli VPS 4GB", meta: "Hosting & Infrastructure" },
  { text: "NexusStore mendapat rating 5.0", meta: "Penilaian penjual" },
  { text: "Anya membeli Script PHP", meta: "Software & Development" },
  { text: "Dimas menulis ulasan untuk Aurora UI Kit", meta: "Design & Creative" },
  { text: "Sinta membeli Top Up 86 Diamonds", meta: "Gaming & Top Up" },
  { text: "Kirana Studio menyelesaikan pesanan logo", meta: "Services" },
  { text: "Bima membeli Template Notion Pro", meta: "Productivity" },
  { text: "Aurora UI Kit mendapat pembeli baru", meta: "Design & Creative" },
];

const CYCLE_MS = 4200;
const RESUME_MS = 6000;
const ITEM_H = 72;

export function OrphicLive() {
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const resumeRef = useRef<number | null>(null);

  useEffect(() => {
    const step = () => {
      const track = trackRef.current;
      if (!track) return;
      indexRef.current += 1;
      if (indexRef.current >= activities.length) {
        // Seamless loop: list is duplicated, jump back without animation
        indexRef.current = 1;
        track.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
      track.scrollTo({ top: indexRef.current * ITEM_H, behavior: "smooth" });
    };

    const start = () => {
      stop();
      timerRef.current = window.setInterval(step, CYCLE_MS);
    };
    const stop = () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };

    const onInteract = () => {
      stop();
      if (resumeRef.current) window.clearTimeout(resumeRef.current);
      resumeRef.current = window.setTimeout(() => {
        const track = trackRef.current;
        if (track) {
          indexRef.current = Math.round(track.scrollTop / ITEM_H);
        }
        start();
      }, RESUME_MS);
    };

    const track = trackRef.current;
    start();
    track?.addEventListener("pointerdown", onInteract, { passive: true });
    track?.addEventListener("wheel", onInteract, { passive: true });
    track?.addEventListener("touchmove", onInteract, { passive: true });

    return () => {
      stop();
      if (resumeRef.current) window.clearTimeout(resumeRef.current);
      track?.removeEventListener("pointerdown", onInteract);
      track?.removeEventListener("wheel", onInteract);
      track?.removeEventListener("touchmove", onInteract);
    };
  }, []);

  const rows = [...activities, ...activities];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-hairline bg-card/40 px-6 py-14 md:px-14 md:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/8 to-transparent" />

          <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
            <div>
              <p className="orphic-eyebrow">See real activity</p>
              <h2 className="orphic-display mt-3 text-[1.75rem] text-foreground md:text-4xl">
                Orphic Live
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Aktivitas marketplace yang sedang berjalan di dalam Orphic.
              </p>
            </div>

            <div
              ref={trackRef}
              className="relative max-h-[216px] touch-pan-y overflow-y-auto md:max-w-md md:flex-1"
              style={{ scrollbarWidth: "none" }}
              aria-live="polite"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-card/90 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-card/90 to-transparent" />
              {rows.map((activity, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-center border-b border-hairline/60 last:border-0"
                  style={{ height: ITEM_H }}
                >
                  <p className="orphic-display text-base leading-snug text-foreground md:text-lg">
                    {activity.text}
                  </p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {activity.meta}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="relative mt-10 text-[11px] text-muted-foreground/70">
            Data aktivitas pada tampilan ini masih contoh untuk prototipe visual.
          </p>
        </div>
      </div>
    </section>
  );
}
