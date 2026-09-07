import { SectionHeading } from "./section-heading";
import worldSoftware from "@/assets/world-software.jpg";
import worldAi from "@/assets/world-ai.jpg";
import worldDesign from "@/assets/world-design.jpg";
import worldGaming from "@/assets/world-gaming.jpg";
import worldHosting from "@/assets/world-hosting.jpg";
import worldCreator from "@/assets/world-creator.jpg";
import worldEducation from "@/assets/world-education.jpg";

const worlds = [
  { name: "Software & Development", note: "Script, template, source code", image: worldSoftware },
  { name: "AI & Automation", note: "Prompt, agent, workflow", image: worldAi },
  { name: "Design & Creative", note: "UI kit, brand, ilustrasi", image: worldDesign },
  { name: "Gaming", note: "Akun, item, layanan game", image: worldGaming },
  { name: "Hosting & Infrastructure", note: "VPS, hosting, server", image: worldHosting },
  { name: "Creator & Streaming", note: "Aset kreator & konten", image: worldCreator },
  { name: "Digital Knowledge", note: "Ebook, kelas, panduan", image: worldEducation },
];

export function OrphicWorlds() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Orphic Worlds"
          title="Masuk ke dunia yang kamu butuhkan."
          description="Setiap dunia membawa katalog, kurasi, dan penjual terbaiknya sendiri."
        />
      </div>

      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-auto md:mt-14 md:max-w-7xl md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-10 [&::-webkit-scrollbar]:hidden">
        {worlds.map((world, index) => (
          <button
            key={world.name}
            type="button"
            className={`group relative aspect-[3/4] w-[68vw] shrink-0 snap-start overflow-hidden rounded-2xl text-left sm:w-[46vw] md:aspect-auto md:w-auto ${
              index === 0
                ? "md:col-span-2 md:row-span-2 md:min-h-[30rem]"
                : index === worlds.length - 1
                  ? "md:col-span-2 md:min-h-[14.5rem]"
                  : "md:min-h-[14.5rem]"
            }`}
          >
            <img
              src={world.image}
              alt={world.name}
              loading="lazy"
              width={1024}
              height={1280}
              className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-orphic)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <h3 className="orphic-display text-base text-foreground md:text-lg">{world.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{world.note}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
