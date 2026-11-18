import { Fragment } from "react";
import Icon from "./Icon";
import { hero, partners } from "../data/content";
import { imgSize } from "../data/imageSizes";
import { useI18n } from "../i18n";

/**
 * Full-bleed photographic hero: the field fills the first screen, a dark
 * scrim keeps white type readable, and the partner marks sit along the
 * bottom edge. `data-dark` tells the header to switch to light ink over it.
 */
export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero" id="top" data-dark>
      <img
        className="hero__bg"
        src={hero.photo}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        width={2000}
        height={1145}
      />
      <span className="hero__scrim" aria-hidden="true" />

      <div className="container hero__inner">
        <a className="hero__announce" href="#platform">
          <span className="hero__announce-text">{t("hero.badge", hero.badge)}</span>
          <span className="hero__announce-pill">
            {t("hero.badgeTag", hero.badgeTag)}
            <Icon name="arrow-right" />
          </span>
        </a>

        {/* The visible lines are separate blocks, so without the space between
            them the accessible name and Google's snippet both read the last
            word of one line joined to the first word of the next. */}
        <h1 className="hero__title">
          {hero.title.map((line, i) => (
            <Fragment key={line}>
              {i > 0 ? " " : null}
              <span className="hero__line">
                <span style={{ animationDelay: `${120 + i * 120}ms` }}>{t(`hero.title.${i}`, line)}</span>
              </span>
            </Fragment>
          ))}
        </h1>

        <p className="hero__sub">{t("hero.sub", hero.sub)}</p>

        <div className="hero__actions">
          <a className="hero__cta" href="#platform">
            <span>{t("hero.primaryCta", hero.primaryCta)}</span>
            <span className="hero__cta-icon">
              <Icon name="arrow-right" />
            </span>
          </a>
          <a className="hero__link" href="#engine">
            {t("hero.secondaryCta", hero.secondaryCta)}
          </a>
        </div>
      </div>

      <div className="container hero__partners">
        <p className="hero__partners-label">{t("partners.note", partners.note)}</p>
        <ul className="hero__partners-row">
          {partners.logos.map((logo) => (
            <li className={`hero__partner ${logo.cls}`} key={logo.src}>
              <img src={logo.src} alt={logo.alt} loading="lazy" {...imgSize(logo.src)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
