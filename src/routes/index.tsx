import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/orphic/top-bar";
import { BottomNav } from "@/components/orphic/bottom-nav";
import { Hero } from "@/components/orphic/hero";
import { OrphicWorlds } from "@/components/orphic/orphic-worlds";
import { BestSeller } from "@/components/orphic/best-seller";
import { OrphicLive } from "@/components/orphic/orphic-live";
import { BuyerStories } from "@/components/orphic/buyer-stories";

const title = "Orphic — Marketplace Digital Premium";
const description =
  "Produk digital, layanan, dan pengalaman pilihan dalam satu ruang. Jelajahi dunia digital Orphic.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main>
        <Hero />
        <OrphicWorlds />
        <BestSeller />
        <OrphicLive />
        <BuyerStories />
      </main>
      <BottomNav />
    </div>
  );
}
