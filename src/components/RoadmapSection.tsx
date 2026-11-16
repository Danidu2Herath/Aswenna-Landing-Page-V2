import Chip from "./Chip";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { roadmap } from "../data/content";
import { useI18n } from "../i18n";

export default function RoadmapSection() {
  const { t } = useI18n();

  return (
    <section className="section" id="roadmap">
      <div className="container">
        <SectionHead {...roadmap} keyBase="roadmap" />

        <div className="roadmap__legend">
          <Chip tone="neutral">{t("roadmap.scopeLabel", roadmap.scopeLabel)}</Chip>
          <Chip tone="note">{t("roadmap.futureLabel", roadmap.futureLabel)}</Chip>
        </div>

        <ol className="roadmap__track">
          {roadmap.phases.map((p, i) => (
            <Reveal as="li" className="roadmap__item" delay={i * 90} key={p.n}>
              <article className={`roadmap__card${p.scope ? "" : " roadmap__card--future"}`}>
                <span className="roadmap__dot" aria-hidden="true" />
                <header className="roadmap__head">
                  <span className="roadmap__n">{p.n}</span>
                  <Chip tone={p.scope ? "estimated" : "note"}>{t(`roadmap.phases.${i}.status`, p.status)}</Chip>
                </header>
                <h3 className="roadmap__name">{t(`roadmap.phases.${i}.name`, p.name)}</h3>
                <ul className="roadmap__items">
                  {p.items.map((item, j) => (
                    <li key={item}>
                      <span className="roadmap__tick">
                        <Icon name="check" />
                      </span>
                      {t(`roadmap.phases.${i}.items.${j}`, item)}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ol>

        {/* The integrity note that has to stay: these are planned phases, not
            deployed operations. */}
        <Reveal>
          <p className="roadmap__note">{t("roadmap.note", roadmap.note)}</p>
        </Reveal>
      </div>
    </section>
  );
}
