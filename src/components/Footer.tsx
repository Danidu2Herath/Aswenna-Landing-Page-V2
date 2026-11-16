import Icon from "./Icon";
import { contactDetails, footer, site } from "../data/content";
import { useI18n } from "../i18n";
import { prefersReducedMotion } from "../lib/util";

/**
 * The footer.
 *
 * Laid out so it seats itself at the bottom of the viewport on a short page
 * (see the flex column on `#app-root` in _base.scss) and reflows rather than
 * shrinking at every width: the link columns are an auto-fit grid, so they go
 * 4 → 2 → 1 on their own instead of waiting for a breakpoint to rescue them.
 */
export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        {/* A last, quiet invitation — the page ends on an action, not on a
            wall of links. */}
        <div className="footer__cta">
          <div>
            <strong>{t("footer.cta.title", footer.cta.title)}</strong>
            <p>{t("footer.cta.text", footer.cta.text)}</p>
          </div>
          <a className="btn btn--light" href="#contact">
            <span>{t("footer.cta.label", footer.cta.label)}</span>
            <Icon name="arrow-right" />
          </a>
        </div>

        <div className="footer__top">
          <div className="footer__brand">
            <a className="footer__logo" href="#top">
              <img src="/images/logos/aswenna-mark.svg" alt="" width={40} height={40} />
              <span>
                <strong>{site.name}</strong>
                <em>{site.title}</em>
              </span>
            </a>
            <p className="footer__blurb">{t("footer.blurb", footer.blurb)}</p>
            <p className="footer__tagline">{t("site.tagline", site.tagline)}</p>
            <p className="footer__parent">
              <Icon name="building" />
              <span>{t("footer.parentLine", footer.parentLine)}</span>
            </p>
          </div>

          <nav className="footer__cols" aria-label="Footer">
            {footer.columns.map((col, ci) => (
              <div className="footer__col" key={col.title}>
                <h3>{t(`footer.columns.${ci}.title`, col.title)}</h3>
                <ul>
                  {col.links.map((link, li) => (
                    <li key={link.href}>
                      <a href={link.href}>{t(`footer.columns.${ci}.links.${li}.label`, link.label)}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="footer__col footer__col--contact">
              <h3>{t("footer.contactTitle", footer.contactTitle)}</h3>
              <ul>
                <li>
                  <a href={`mailto:${contactDetails.email}`}>
                    <Icon name="mail" />
                    {contactDetails.email}
                  </a>
                </li>
                {contactDetails.phones.map((phone) => (
                  <li key={phone.href}>
                    <a href={phone.href}>
                      <Icon name="phone" />
                      {phone.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer__bottom">
          <span className="footer__legal">
            © {year} {site.name} · {site.parent}.{" "}
            <span className="footer__promise">{t("site.promise", site.promise)}</span>
          </span>

          <span className="footer__meta">{t("footer.meta", footer.meta)}</span>

          <button
            type="button"
            className="footer__up"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })
            }
          >
            <span>{t("footer.backToTop", footer.backToTop)}</span>
            <Icon name="arrow-up" />
          </button>
        </div>
      </div>

      <span className="footer__wordmark" aria-hidden="true">
        {site.name}
      </span>
    </footer>
  );
}
