import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { pricing } from "../data/content";
import { useI18n } from "../i18n";

export default function PricingSection() {
  const { t } = useI18n();

  return (
    <section className="section" id="pricing">
      <div className="container">
        <SectionHead {...pricing} keyBase="pricing" />
        <div className="pricing__grid">
          {pricing.tiers.map((p, i) => (
            <Reveal delay={i * 90} key={p.name}>
              <article className={`plan${p.featured ? " plan--featured" : ""}`}>
                {p.featured ? (
                  <span className="plan__flag">
                    <Icon name="star" />
                    {t("pricing.flag", pricing.flag)}
                  </span>
                ) : null}
                <span className="plan__tag">{t(`pricing.tiers.${i}.tag`, p.tag)}</span>
                <h3 className="plan__name">{p.name}</h3>
                <p className="plan__price">
                  {t(`pricing.tiers.${i}.price`, p.price)}
                  <span>{t(`pricing.tiers.${i}.unit`, p.unit)}</span>
                </p>
                <p className="plan__text">{t(`pricing.tiers.${i}.text`, p.text)}</p>
                <ul className="plan__list">
                  {p.items.map((item, j) => (
                    <li key={item}>
                      <span className="plan__tick">
                        <Icon name="check" />
                      </span>
                      {t(`pricing.tiers.${i}.items.${j}`, item)}
                    </li>
                  ))}
                </ul>
                <a className={`btn ${p.featured ? "btn--primary" : "btn--ghost"} plan__btn`} href="#contact">
                  {t(`pricing.tiers.${i}.cta`, p.cta)}
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="pricing__note">
            <Icon name="info" />
            <span>{t("pricing.note", pricing.note)}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
