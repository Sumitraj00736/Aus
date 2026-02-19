import { useEffect } from 'react';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

interface SmoothScrollProps {
  scrollSpeed?: number; // higher = faster
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ scrollSpeed = 1.2 }) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (prefersReducedMotion || !isFinePointer) return;

    let current = window.scrollY;
    let target = current;
    let lastTime = performance.now();
    let rafId: number;

    const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000; // seconds
      lastTime = time;

      const delta = target - current;

      // Time-based movement: scrollSpeed = pixels per second
      current += delta * Math.min(scrollSpeed * deltaTime * 60, 1);

      window.scrollTo(0, current);

      if (Math.abs(delta) > 0.5) rafId = requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey) return;
      if (Math.abs(e.deltaY) < 0.01) return;

      e.preventDefault();
      target = clamp(target + e.deltaY * 2, 0, maxScroll()); // increase multiplier for faster scroll
      rafId = requestAnimationFrame(animate);
    };

    const onResize = () => {
      target = clamp(target, 0, maxScroll());
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, [scrollSpeed]);

  return null;
};

export default SmoothScroll;
