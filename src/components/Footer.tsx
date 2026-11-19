import Icon from "./Icon";
import { contactDetails, footer, site } from "../data/content";
import { useI18n } from "../i18n";
import { prefersReducedMotion } from "../lib/util";

/**
 * The footer.
 *
 * Four bands, in the order a reader wants them: who this is and one way in,
 * then the links, then the address written large enough to actually use, then
 * the name and the small print.
 *
 * No paragraph restating what Aswenna is - the page above has just spent
 * twenty sections on that - and no photograph behind the wordmark; the name
 * is the picture.
 */
export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        {/* ------------------------------------------- brand + the columns */}
        <div className="footer__top">
          <div className="footer__brand">
            <a className="footer__logo" href="#top">
              <img src="/images/logos/aswenna-logo.webp" alt={site.name} width={480} height={193} />
            </a>
            <p className="footer__tagline">{t("footer.tagline", footer.tagline)}</p>
            <a className="footer__cta" href={footer.cta.href}>
              {t("footer.cta.label", footer.cta.label)}
              <Icon name="arrow-up-right" />
            </a>
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
          </nav>
        </div>

        {/* --------------------------------------------------- get in touch */}
        <div className="footer__touch">
          <div className="footer__touch-main">
            <span className="footer__touch-label">{t("footer.getInTouch", footer.getInTouch)}</span>
            <a className="footer__email" href={`mailto:${contactDetails.email}`}>
              {contactDetails.email}
              <Icon name="arrow-up-right" />
            </a>
            <ul className="footer__phones">
              {contactDetails.phones.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href}>{phone.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <p className="footer__invite">
            {footer.invite.map((line, i) => (
              <span key={line}>{t(`footer.invite.${i}`, line)}</span>
            ))}
          </p>

          <p className="footer__status">{t("footer.status", footer.status)}</p>
        </div>

        {/* ------------------------------------------------------- the name */}
        <span className="footer__wordmark" aria-hidden="true">
          {site.name}
        </span>

        {/* ------------------------------------------------------ small print */}
        <div className="footer__bottom">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <span className="footer__by">
            {t("footer.parentLine", footer.parentLine)}
          </span>
          <button
            type="button"
            className="footer__up"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })
            }
          >
            {t("footer.backToTop", footer.backToTop)}
            <Icon name="arrow-up" />
          </button>
        </div>
      </div>
    </footer>
  );
}
