import { useEffect, useRef } from "react";
import { clamp01, isTouch, prefersReducedMotion, rafThrottle } from "../lib/util";

const RIPPLE_MS = 900;
const PULSE_MS = 1400;

type Node = { x: number; y: number; rx: number; ry: number; vx: number; vy: number; r: number; wake: number };

/** Reads the mesh's look out of the stylesheet, so colours stay in one place. */
function readTheme(el: Element) {
  const cs = getComputedStyle(el);
  const str = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
  const num = (n: string, f: number) => {
    const v = Number.parseFloat(cs.getPropertyValue(n));
    return Number.isFinite(v) ? v : f;
  };
  return {
    nodeRgb: str("--mesh-node-rgb", "29, 78, 43"),
    linkRgb: str("--mesh-link-rgb", "47, 124, 71"),
    activeRgb: str("--mesh-active-rgb", "47, 124, 71"),
    glowRgb: str("--mesh-glow-rgb", "47, 124, 71"),
    nodeAlpha: num("--mesh-node-alpha", 0.38),
    linkAlpha: num("--mesh-link-alpha", 0.26),
    activeAlpha: num("--mesh-active-alpha", 0.85),
    glowAlpha: num("--mesh-glow-alpha", 0.14),
    density: num("--mesh-density", 15000),
    linkDist: num("--mesh-link-dist", 146),
    reach: num("--mesh-reach", 265),
    pull: num("--mesh-pull", 20),
    pulseMs: num("--mesh-pulse-ms", 1500),
  };
}

/**
 * The page backdrop: the photograph under a scrim that eases back as you
 * scroll, a faint dot grid, and a sensor mesh on a canvas over them.
 *
 * The cursor behaves like a village gateway - nodes near it wake, lean in and
 * link back. With reduced motion or on a touch device a single static frame is
 * drawn and no animation loop ever starts.
 */
export default function BackgroundTexture() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hostEl = host.current;
    const canvasEl = canvas.current;
    if (!hostEl || !canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    let theme = readTheme(hostEl);
    let nodes: Node[] = [];
    let ripples: { x: number; y: number; born: number }[] = [];
    let pulses: { node: number; born: number }[] = [];
    let lastPulse = 0;
    let w = 0;
    let h = 0;
    let frame = 0;

    let targetX = -9999;
    let targetY = -9999;
    let curX = -9999;
    let curY = -9999;
    let awake = false;

    const animated = () => !isTouch() && !prefersReducedMotion();

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvasEl.width = Math.round(w * dpr);
      canvasEl.height = Math.round(h * dpr);
      canvasEl.style.width = `${w}px`;
      canvasEl.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      theme = readTheme(hostEl);
      pulses = [];
      const count = Math.round(Math.min(Math.max((w * h) / theme.density, 32), 110));
      nodes = Array.from({ length: count }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x,
          y,
          rx: x,
          ry: y,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          r: 1.5 + Math.random() * 1.7,
          wake: 0,
        };
      });
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const { reach, linkDist, pull } = theme;
      const live = awake && curX > -9000;

      if (nodes.length && now - lastPulse > theme.pulseMs) {
        lastPulse = now;
        pulses.push({ node: Math.floor(Math.random() * nodes.length), born: now });
        if (pulses.length > 3) pulses.shift();
      }

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;

        let wake = 0;
        n.rx = n.x;
        n.ry = n.y;
        if (live) {
          const dx = curX - n.x;
          const dy = curY - n.y;
          const d = Math.hypot(dx, dy);
          if (d < reach && d > 0.01) {
            wake = 1 - d / reach; // linear: a quadratic falloff lit too few nodes
            n.rx = n.x + (dx / d) * pull * wake;
            n.ry = n.y + (dy / d) * pull * wake;
          }
        }
        n.wake += (wake - n.wake) * 0.14;
      }

      if (live) {
        const g = ctx.createRadialGradient(curX, curY, 0, curX, curY, reach * 1.7);
        g.addColorStop(0, `rgba(${theme.glowRgb}, ${theme.glowAlpha})`);
        g.addColorStop(1, `rgba(${theme.glowRgb}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(curX - reach * 1.7, curY - reach * 1.7, reach * 3.4, reach * 3.4);
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.rx - b.rx;
          const dy = a.ry - b.ry;
          if (Math.abs(dx) > linkDist || Math.abs(dy) > linkDist) continue;
          const d = Math.hypot(dx, dy);
          if (d > linkDist) continue;
          const closeness = 1 - d / linkDist;
          const lit = Math.max(a.wake, b.wake);
          const alpha = theme.linkAlpha * closeness + theme.linkAlpha * 2.6 * closeness * lit;
          ctx.strokeStyle = `rgba(${lit > 0.05 ? theme.activeRgb : theme.linkRgb}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.rx, a.ry);
          ctx.lineTo(b.rx, b.ry);
          ctx.stroke();
        }
      }

      if (live) {
        for (const n of nodes) {
          if (n.wake < 0.03) continue;
          ctx.strokeStyle = `rgba(${theme.activeRgb}, ${0.55 * n.wake})`;
          ctx.lineWidth = 0.6 + n.wake;
          ctx.beginPath();
          ctx.moveTo(curX, curY);
          ctx.lineTo(n.rx, n.ry);
          ctx.stroke();
        }
        ctx.lineWidth = 1;
      }

      for (const n of nodes) {
        const alpha = theme.nodeAlpha + (theme.activeAlpha - theme.nodeAlpha) * n.wake;
        const radius = n.r * (1 + 0.85 * n.wake);
        ctx.fillStyle = `rgba(${n.wake > 0.05 ? theme.activeRgb : theme.nodeRgb}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(n.rx, n.ry, radius, 0, Math.PI * 2);
        ctx.fill();
        if (n.wake > 0.16) {
          ctx.strokeStyle = `rgba(${theme.activeRgb}, ${0.28 * n.wake})`;
          ctx.beginPath();
          ctx.arc(n.rx, n.ry, radius + 4 + 4 * n.wake, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      if (live) {
        ctx.fillStyle = `rgba(${theme.activeRgb}, 0.55)`;
        ctx.beginPath();
        ctx.arc(curX, curY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(${theme.activeRgb}, 0.22)`;
        ctx.beginPath();
        ctx.arc(curX, curY, 13, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (pulses.length) {
        pulses = pulses.filter((p) => now - p.born < PULSE_MS);
        for (const p of pulses) {
          const n = nodes[p.node];
          if (!n) continue;
          const t = clamp01((now - p.born) / PULSE_MS);
          const eased = 1 - (1 - t) ** 3;
          ctx.strokeStyle = `rgba(${theme.activeRgb}, ${0.4 * (1 - t)})`;
          ctx.lineWidth = 1.4 * (1 - t);
          ctx.beginPath();
          ctx.arc(n.rx, n.ry, 4 + eased * 34, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.lineWidth = 1;
      }

      if (ripples.length) {
        ripples = ripples.filter((r) => now - r.born < RIPPLE_MS);
        for (const r of ripples) {
          // Clicks are stamped with performance.now() while the loop runs on
          // the frame timestamp, which can be a frame earlier - clamp, or the
          // radius goes negative.
          const t = clamp01((now - r.born) / RIPPLE_MS);
          const eased = 1 - (1 - t) ** 2;
          ctx.strokeStyle = `rgba(${theme.activeRgb}, ${0.35 * (1 - t)})`;
          ctx.lineWidth = 2 * (1 - t);
          ctx.beginPath();
          ctx.arc(r.x, r.y, eased * reach * 1.25, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.lineWidth = 1;
      }
    };

    const tick = (now: number) => {
      curX += (targetX - curX) * 0.14;
      curY += (targetY - curY) * 0.14;
      draw(now);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame && animated()) frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    /* --------------------------------------- scroll-linked photo scrim */
    const cs = getComputedStyle(hostEl);
    const scrimTop = Number.parseFloat(cs.getPropertyValue("--bg-photo-scrim-top"));
    const scrimBody = Number.parseFloat(cs.getPropertyValue("--bg-photo-scrim-body"));

    const applyScrim = rafThrottle(() => {
      if (!Number.isFinite(scrimTop) || !Number.isFinite(scrimBody)) return;
      const t = clamp01(window.scrollY / Math.max(window.innerHeight * 0.85, 1));
      const eased = t * t * (3 - 2 * t);
      hostEl.style.setProperty("--bg-photo-scrim", String(scrimTop + (scrimBody - scrimTop) * eased));
    });

    /* ------------------------------------------------------------ events */
    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!awake) {
        awake = true;
        curX = targetX;
        curY = targetY;
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!animated()) return;
      ripples.push({ x: e.clientX, y: e.clientY, born: performance.now() });
      if (ripples.length > 4) ripples.shift();
    };
    const onLeave = () => {
      awake = false;
    };
    const onResize = rafThrottle(() => {
      applyScrim();
      build();
      if (!animated()) draw(performance.now());
    });
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", applyScrim, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    build();
    applyScrim();
    if (animated()) start();
    else draw(performance.now()); // one static frame, no loop

    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", applyScrim);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="bg-texture" ref={host} aria-hidden="true">
      <div className="bg-texture__photo" />
      <div className="bg-texture__scrim" />
      <div className="bg-texture__grid" />
      <canvas className="bg-texture__mesh" ref={canvas} />
    </div>
  );
}
