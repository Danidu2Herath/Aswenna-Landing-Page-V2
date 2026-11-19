/** Shared helpers - the vanilla build's util.js, typed. */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

const motionQuery =
  typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

/** Live reduced-motion preference - read at call time, never cached. */
export const prefersReducedMotion = () => Boolean(motionQuery?.matches);

/** True on a device whose primary pointer is coarse, i.e. a touch screen. */
export const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

/** Runs `fn` at most once per animation frame. */
export function rafThrottle<A extends unknown[]>(fn: (...args: A) => void) {
  let frame = 0;
  return (...args: A) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      fn(...args);
    });
  };
}

/** Document-space top of an element, independent of positioned ancestors. */
export const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

/** Scroll behaviour that honours the motion preference. */
export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? "auto" : "smooth");

export const pad2 = (n: number) => String(n).padStart(2, "0");
