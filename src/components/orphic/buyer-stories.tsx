import { BadgeCheck, Star } from "lucide-react";
import { SectionHeading } from "./section-heading";

const stories = [
  {
    name: "Raka Pradipta",
    initials: "RP",
    rating: 5,
    product: "VPS 4GB NVMe — Singapore",
    quote:
      "Provisioning selesai kurang dari sepuluh menit dan performanya stabil untuk dua project sekaligus.",
  },
  {
    name: "Anya Salsabila",
    initials: "AS",
    rating: 5,
    product: "Script PHP Marketplace",
    quote:
      "Struktur kodenya rapi dan dokumentasinya jelas. Penjualnya juga responsif saat saya bertanya.",
  },
  {
    name: "Dimas Arya",
    initials: "DA",
    rating: 4,
    product: "Aurora UI Kit — Figma",
    quote: "Komponennya konsisten, langsung saya pakai untuk presentasi klien minggu itu juga.",
  },
];

export function BuyerStories() {
  return (
    <section className="pb-36 pt-20 md:pb-40 md:pt-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Buyer Stories"
          title="Cerita dari pembeli Orphic."
          description="Pengalaman nyata dari mereka yang sudah menjelajahi Orphic."
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:mt-16 md:grid-cols-3">
          {stories.map((story) => (
            <figure key={story.name} className="bg-background p-6 md:p-8">
              <div className="flex items-center gap-1" aria-label={`Rating ${story.rating} dari 5`}>
                {Array.from({ length: story.rating }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-primary text-primary" strokeWidth={1.5} />
                ))}
              </div>

              <blockquote className="mt-5 text-[14.5px] leading-relaxed text-foreground/90">
                “{story.quote}”
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-[11px] tracking-wide text-foreground/80">
                  {story.initials}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[13px] text-foreground">
                    {story.name}
                    <BadgeCheck className="size-3.5 text-primary" strokeWidth={1.75} />
                  </span>
                  <span className="block truncate text-[11.5px] text-muted-foreground">
                    {story.product}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
