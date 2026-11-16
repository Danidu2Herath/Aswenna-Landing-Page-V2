import { useRef, useState } from "react";
import Icon from "./Icon";
import { ui } from "../data/content";
import { useI18n } from "../i18n";
import { prefersReducedMotion } from "../lib/util";
import { useScroll } from "../hooks";

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Back-to-top button. The ring around the arrow fills as you move down the
 * page, so it doubles as a reading-progress indicator.
 */
export default function ToTop() {
  const { t } = useI18n();
  const [shown, setShown] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useScroll(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    if (ring.current) {
      ring.current.style.strokeDasharray = String(CIRCUMFERENCE);
      ring.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
    }
    // Stand down over the footer: the floating button would otherwise sit on
    // top of the contact links, and the footer carries its own back-to-top.
    const footer = document.querySelector(".footer");
    const atFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false;
    setShown(window.scrollY > window.innerHeight * 0.6 && !atFooter);
  });

  const label = t("ui.backToTop", ui.backToTop);

  return (
    <button
      type="button"
      className={`to-top${shown ? " is-shown" : ""}`}
      aria-label={label}
      title={label}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        // Move focus with the view, so keyboard and screen-reader users follow.
        const main = document.getElementById("main");
        if (main) {
          main.setAttribute("tabindex", "-1");
          main.focus({ preventScroll: true });
        }
      }}
    >
      <svg className="to-top__ring" viewBox="0 0 44 44" aria-hidden="true">
        <circle className="to-top__track" cx="22" cy="22" r={RADIUS} />
        <circle className="to-top__progress" cx="22" cy="22" r={RADIUS} ref={ring} />
      </svg>
      <Icon name="arrow-up" className="to-top__arrow" />
    </button>
  );
}
