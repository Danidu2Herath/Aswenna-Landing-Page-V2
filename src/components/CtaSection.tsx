import Icon from "./Icon";
import Reveal from "./Reveal";
import { cta, site } from "../data/content";
import { imgSize } from "../data/imageSizes";
import { useI18n } from "../i18n";

export default function CtaSection() {
  const { t } = useI18n();

  return (
    <section className="cta" id="cta" data-dark>
      <div className="cta__panel">
        <img className="cta__photo" src={cta.photo} alt="" aria-hidden="true" loading="lazy" {...imgSize(cta.photo)} />
        <div className="cta__veil" aria-hidden="true" />
        <Reveal className="container cta__inner">
          <span className="cta__eyebrow">
            <Icon name="sprout" />
            <span>{t("cta.eyebrow", cta.eyebrow)}</span>
          </span>
          <h2 className="cta__title">{t("cta.title", cta.title)}</h2>
          <p className="cta__sub">{t("cta.sub", cta.sub)}</p>
          <div className="cta__actions">
            <a className="btn btn--light btn--lg" href="#platform">
              <span>{t("cta.primary", cta.primary)}</span>
              <Icon name="arrow-right" />
            </a>
            <a className="btn btn--outline-light btn--lg" href="#contact">
              {t("cta.secondary", cta.secondary)}
            </a>
          </div>
          <p className="cta__brand">
            <strong>{site.name.toUpperCase()}</strong> — <span>{t("site.promise", site.promise)}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
