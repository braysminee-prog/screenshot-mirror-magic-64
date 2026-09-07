import { ArrowRight, ShieldCheck } from "lucide-react";
import heroImage from "@/assets/hero-orphic.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden md:min-h-[92vh]">
      <img
        src={heroImage}
        alt="Lanskap digital sinematik Orphic"
        width={1536}
        height={1920}
        className="absolute inset-0 size-full object-cover object-[68%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-28 pt-28 md:min-h-[92vh] md:px-10 md:pb-32">
        <div className="max-w-xl orphic-rise">
          <p className="orphic-eyebrow">Digital Marketplace</p>
          <h1 className="orphic-display mt-5 text-[2.6rem] text-foreground sm:text-6xl md:text-7xl">
            Temukan Dunia
            <br />
            Digitalmu.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground md:text-base">
            Produk digital, layanan, dan pengalaman pilihan dalam satu ruang.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              type="button"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-transform duration-300 ease-[var(--ease-orphic)] hover:-translate-y-0.5"
            >
              Jelajahi Orphic
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </button>

            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <ShieldCheck className="size-4 text-primary/80" strokeWidth={1.5} />
              Orphic Protected
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
