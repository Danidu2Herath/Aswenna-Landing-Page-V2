import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, rafThrottle } from "../lib/util";

/** Re-renders when a media query changes. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/** Live `prefers-reduced-motion`, as state. */
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** Fires on scroll and resize, throttled to one animation frame. */
export function useScroll(fn: () => void, deps: unknown[] = []) {
  useEffect(() => {
    const handler = rafThrottle(fn);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** True while `ref` is on screen. */
export function useOnScreen<T extends Element>(
  ref: React.RefObject<T | null>,
  options: IntersectionObserverInit = { threshold: 0.2 },
) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
  return visible;
}

/**
 * A requestAnimationFrame loop that only runs while `active` is true.
 * `fn` receives the delta in milliseconds, capped so a backgrounded tab
 * cannot deliver one enormous step on return.
 */
export function useRafLoop(active: boolean, fn: (dt: number, now: number) => void) {
  const callback = useRef(fn);
  callback.current = fn;

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 80) : 0;
      last = now;
      callback.current(dt, now);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);
}

/** Adds `is-visible` the first time the element is scrolled to. */
export function useRevealOnce<T extends Element>(ref: React.RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}
