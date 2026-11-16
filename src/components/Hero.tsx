import Icon from "./Icon";
import Chip from "./Chip";
import AppPhone from "./app/AppPhone";
import { hero, site } from "../data/content";
import { useI18n } from "../i18n";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero" id="top">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <span className="hero__badge">
          <span className="hero__badge-tag">{t("hero.badgeTag", hero.badgeTag)}</span>
          <span>{t("hero.badge", hero.badge)}</span>
        </span>

        <h1 className="hero__title">
          {hero.title.map((line, i) => (
            <span className="hero__line" key={line}>
              <span style={{ animationDelay: `${120 + i * 120}ms` }}>{t(`hero.title.${i}`, line)}</span>
            </span>
          ))}
        </h1>

        <p className="hero__sub">{t("hero.sub", hero.sub)}</p>

        <div className="hero__actions">
          <a className="btn btn--primary btn--lg" href="#platform">
            <span>{t("hero.primaryCta", hero.primaryCta)}</span>
            <Icon name="arrow-right" />
          </a>
          <a className="btn btn--ghost btn--lg" href="#engine">
            <Icon name="arrow-down" />
            <span>{t("hero.secondaryCta", hero.secondaryCta)}</span>
          </a>
        </div>

        <p className="hero__tagline">
          <Icon name="sprout" />
          <span>
            {site.name} — <span>{t("site.promise", site.promise)}</span>
          </span>
        </p>
      </div>

      <div className="container">
        <div className="hero__showcase">
          <div className="hero__stage">
            <img
              className="hero__photo"
              src={hero.photo}
              alt={hero.photoAlt}
              fetchPriority="high"
              width={2000}
              height={1145}
            />
            <span className="hero__veil" aria-hidden="true" />

            {hero.cards.map((card, i) => (
              <div className={`hero__float hero__float--${i === 0 ? "left" : "right"}`} key={card.label}>
                <span className={`hero__float-icon${i ? " hero__float-icon--alt" : ""}`}>
                  <Icon name={card.icon} />
                </span>
                <div>
                  <strong>{card.value}</strong>
                  <span>{t(`hero.cards.${i}.label`, card.label)}</span>
                </div>
                <Chip tone={card.tone}>{card.note}</Chip>
              </div>
            ))}

            {/* The application itself, in the hero: the product is the screen,
                not the photograph behind it. */}
            <div className="hero__device">
              <AppPhone screen="dashboard" withCaption={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
