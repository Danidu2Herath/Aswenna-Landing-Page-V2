import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useI18n } from "../i18n";
import { nav, site, ui } from "../data/content";
import { rafThrottle } from "../lib/util";

/**
 * The floating header.
 *
 * Two independent states:
 *   `header--stuck`      - past the first scroll, so it tightens and frosts.
 *   `header--over-dark`  - the bar is currently sitting over one of the dark
 *                          sections, so it drops the light glass for a dark,
 *                          mostly transparent treatment with light text.
 *
 * The second one exists because a light glass panel over a dark photograph
 * reads as a smear; over the pale sage page it barely reads at all. Measuring
 * what is actually underneath is the only way to get both right.
 */
export default function Header() {
  const { t } = useI18n();
  const [stuck, setStuck] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  /* ------------------------------------------- scroll state + dark probe */
  useEffect(() => {
    const onScroll = rafThrottle(() => {
      setStuck(window.scrollY > 24);

      const header = headerRef.current;
      if (!header) return;
      const band = header.getBoundingClientRect();
      // Probe the middle of the bar: a section counts as "under" the header
      // when it covers that line.
      const line = band.top + band.height / 2;
      const dark = document.querySelectorAll<HTMLElement>("[data-dark]");
      let hit = false;
      for (const el of dark) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom >= line) {
          hit = true;
          break;
        }
      }
      setOverDark(hit);
    });

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* ------------------------------------------------------- mobile menu */
  useEffect(() => {
    document.body.classList.toggle("is-locked", menuOpen);
    return () => document.body.classList.remove("is-locked");
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    // Resizing past the breakpoint must not leave the menu stuck open.
    const onResize = rafThrottle(() => {
      if (window.innerWidth > 1180) setMenuOpen(false);
    });
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const classes = [
    "header",
    stuck ? "header--stuck" : "",
    overDark ? "header--over-dark" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <a className="skip-link" href="#main">
        {t("ui.skipToContent", ui.skipToContent)}
      </a>

      <header className={classes} ref={headerRef}>
        <div className="header__inner container">
          <a className="brand" href="#top" aria-label={`${site.name} home`}>
            {/* Two files, one shown at a time. Over the hero photograph the
                bar has no surface and the wordmark would be dark green ink on
                a dark field, so the reversed logo takes over there. The <a>
                carries the accessible name, so both images are decorative. */}
            <img
              className="brand__logo brand__logo--ink"
              src="/images/logos/aswenna-logo.webp"
              alt=""
              width={480}
              height={193}
            />
            <img
              className="brand__logo brand__logo--reversed"
              src="/images/logos/aswenna-logo-white.webp"
              alt=""
              width={480}
              height={193}
            />
          </a>

          <nav className="header__nav" aria-label={t("ui.primaryNav", ui.primaryNav)}>
            <ul>
              {nav.map((item, i) => (
                <li key={item.href}>
                  <a href={item.href}>{t(`nav.${i}.label`, item.label)}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <a className="btn btn--primary header__cta" href="#contact">
              <span>{t("ui.getStarted", ui.getStarted)}</span>
              <Icon name="arrow-right" />
            </a>
            <button
              type="button"
              className="header__burger"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? t("ui.closeMenu", ui.closeMenu) : t("ui.openMenu", ui.openMenu)}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name="menu" className="burger__open" />
              <Icon name="x" className="burger__close" />
            </button>
          </div>
        </div>

        <div
          className={`mobile-nav${menuOpen ? " is-open" : ""}`}
          id="mobile-nav"
          hidden={!menuOpen}
          onClick={(event) => {
            // Any link closes the menu, so the page is never left scroll-locked.
            if ((event.target as HTMLElement).closest("a")) setMenuOpen(false);
          }}
        >
          <ul>
            {nav.map((item, i) => (
              <li key={item.href}>
                <a href={item.href}>
                  {t(`nav.${i}.label`, item.label)}
                  <Icon name="arrow-right" />
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--primary btn--lg" href="#contact">
            {t("ui.getStarted", ui.getStarted)}
          </a>
        </div>
      </header>
    </>
  );
}
