export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-lg">
      {eyebrow ? <p className="orphic-eyebrow">{eyebrow}</p> : null}
      <h2 className="orphic-display mt-3 text-[1.75rem] text-foreground md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
