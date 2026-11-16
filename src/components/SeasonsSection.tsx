import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { seasons } from "../data/content";
import { useI18n } from "../i18n";

export default function SeasonsSection() {
  const { t } = useI18n();

  return (
    <section className="section" id="seasons">
      <div className="container">
        <SectionHead {...seasons} keyBase="seasons" />
        <ol className="seasons__grid">
          {seasons.stages.map((s, i) => (
            <Reveal as="li" delay={i * 80} key={s.title}>
              <article className="season">
                <header className="season__head">
                  <span className="season__icon">
                    <Icon name={s.icon} />
                  </span>
                  <span className="season__stage">
                    {t(`seasons.stages.${i}.stage`, s.stage)}
                    <em>{s.when}</em>
                  </span>
                </header>
                <h3 className="season__title">{t(`seasons.stages.${i}.title`, s.title)}</h3>
                <p className="season__text">{t(`seasons.stages.${i}.text`, s.text)}</p>
                <div className="season__callout">
                  <strong>{s.callout.label}</strong>
                  <p>{s.callout.text}</p>
                </div>
                <a className="season__link" href={s.href}>
                  {s.link}
                  <Icon name="arrow-right" />
                </a>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
