'use client';

import clsx from 'clsx';
import { useRef, useEffect, useMemo, useState } from 'react';
import { useVisibleCount } from '@/hooks/useMedia';

type Item = { id: string; title: string; description?: string };

type Variant = 'flag' | 'practice'; // flag = red, practice = green

interface Props {
  items: Item[];
  ariaLabel: string;
  variant: Variant;
  autoInterval?: number; // ms, default 1500
  className?: string;
}

export default function CarouselMulti({
  items,
  ariaLabel,
  variant,
  autoInterval = 1500,
  className,
}: Props) {
  const visibleCount = useVisibleCount(); // 1/2/3 responsive
  const [index, setIndex] = useState(0); // leftmost visible item
  const [isPaused, setIsPaused] = useState(false); // Track pause state
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const prefReduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const coolDownRef = useRef<number | null>(null);

  const maxIndex = Math.max(0, items.length - visibleCount);

  const resetCoolDown = () => {
    coolDownRef.current = null;
    setIsPaused(false);
  };

  const goTo = (i: number) => {
    const next = ((i % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);
    setIndex(next);
    // cooldown after manual interaction (8s)
    if (coolDownRef.current) window.clearTimeout(coolDownRef.current);
    coolDownRef.current = window.setTimeout(() => resetCoolDown(), 8000);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Programmatic scroll using scroll-snap
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const child = vp.children[index] as HTMLElement | undefined;
    if (child) {
      vp.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
    }
  }, [index, visibleCount]);

  // Autoplay
  useEffect(() => {

    if (
      items.length <= visibleCount ||
      prefReduced ||
      coolDownRef.current ||
      isPaused
    )
      return;

    const id = window.setInterval(
      () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
      autoInterval
    );
    return () => window.clearInterval(id);
  }, [
    autoInterval,
    items.length,
    visibleCount,
    prefReduced,
    index,
    maxIndex,
    isPaused,
  ]);

  // Pause on focus/hover

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

  const accent =
    variant === 'flag'
      ? {
          ring: 'focus:ring-red-500',
          border: 'border-red-200',
          title: 'text-red-700',
          dotActive: 'bg-red-600 border-red-600',
        }
      : {
          ring: 'focus:ring-green-500',
          border: 'border-green-200 ',
          title: 'text-green-700 ',
          dotActive: 'bg-green-600 border-green-600',
        };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className={clsx('relative w-full', className)}
    >
      {/* Viewport */}
      <div
        ref={viewportRef}
        className={clsx(
          'flex snap-x snap-mandatory overflow-hidden gap-4',
          'rounded-lg'
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-live="polite"
      >
        {items.map((it, i) => (
          <article
            key={it.id ?? i}
            className={clsx(
              'snap-start shrink-0',
              'basis-full md:basis-1/2 lg:basis-1/3', // 1 | 2 | 3 visible
              'rounded-lg border bg-white p-4 shadow-sm transition-colors',
              accent.border
            )}
          >
            <h3 className={clsx('text-base font-semibold', accent.title)}>
              {it.title}
            </h3>
            {it.description && (
              <p className="mt-1 text-sm text-gray-700 ">{it.description}</p>
            )}
          </article>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            onFocus={() => setIsPaused(true)}
            onBlur={resetCoolDown}
            className={clsx(
              'inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-gray-900',
              'hover:bg-neutral-50 focus:outline-none focus:ring-2',
              accent.ring
            )}
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            onFocus={() => setIsPaused(true)}
            onBlur={resetCoolDown}
            className={clsx(
              'inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-gray-900',
              'hover:bg-neutral-50 focus:outline-none focus:ring-2',
              accent.ring
            )}
          >
            →
          </button>
        </div>

        {/* Dots for each starting index (full frames) */}
        <div className="flex items-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to position ${i + 1}`}
              aria-current={i === index ? 'true' : 'false'}
              onClick={() => setIndex(i)}
              onFocus={() => setIsPaused(true)}
              onBlur={resetCoolDown}
              className={clsx(
                'h-2.5 w-2.5 rounded-full border transition-colors focus:outline-none focus:ring-2 cursor-pointer',
                'border-neutral-400',
                i === index && accent.dotActive,
                accent.ring
              )}
            />
          ))}
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        {isPaused ? (
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
            Auto-rotation paused
          </span>
        ) : (
          'Tip: hover or focus controls to pause auto-rotation.'
        )}
      </p>
    </section>
  );
}
