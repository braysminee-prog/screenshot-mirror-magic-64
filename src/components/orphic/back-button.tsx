import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackButton({
  fallback,
  label = "Kembali",
  className = "",
}: {
  /** Route used when there is no in-app history to return to. */
  fallback: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
        if (idx > 0) {
          router.history.back();
        } else {
          router.navigate({ to: fallback });
        }
      }}
      className={`inline-flex items-center gap-2 text-[12.5px] text-muted-foreground transition-colors duration-300 hover:text-foreground ${className}`}
    >
      <ArrowLeft className="size-4" strokeWidth={1.5} />
      {label}
    </button>
  );
}
