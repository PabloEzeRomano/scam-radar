"use client";
import { useMemo } from "react";
import CarouselMulti from "./CarouselMulti";

type DictSection = Record<string, string | undefined>;
type Variant = "flag" | "practice";

function buildSlides(section: DictSection) {
  const out: { id: string; title: string; description?: string }[] = [];
  const idx = new Set<number>();
  Object.keys(section).forEach((k) => {
    const m = /^item(\d+)$/.exec(k);
    if (m) idx.add(Number(m[1]));
  });
  Array.from(idx).sort((a, b) => a - b).forEach((n) => {
    const title = section[`item${n}`] as string | undefined;
    const description = section[`item${n}Desc`] as string | undefined;
    if (title) out.push({ id: `item${n}`, title, description });
  });
  return out;
}

export default function SectionCarousel({
  ariaLabel,
  sectionDict,
  variant,
  intervalMs = 1500,
  className,
}: {
  ariaLabel: string;
  sectionDict: DictSection;
  variant: Variant;
  intervalMs?: number;
  className?: string;
}) {
  const slides = useMemo(() => buildSlides(sectionDict), [sectionDict]);
  return (
    <CarouselMulti
      ariaLabel={ariaLabel}
      items={slides}
      variant={variant}
      autoInterval={intervalMs}
      className={className}
    />
  );
}
