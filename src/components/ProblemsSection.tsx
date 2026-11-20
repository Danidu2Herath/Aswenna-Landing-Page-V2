import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { problems } from "../data/content";
import { imgSize } from "../data/imageSizes";
import { useI18n } from "../i18n";

export default function ProblemsSection() {
  const { t } = useI18n();

  return (
    <section className="section section--alt" id="why">
      <div className="container">
        <SectionHead {...problems} keyBase="problems" />

        <div className="problems__grid">
          {problems.items.map((p, i) => (
            <Reveal as="article" delay={i * 70} key={p.title}>
              <div className="problem">
                <div className="media media--16x9 problem__media">
                  <img
                    src={p.photo}
                    alt={p.alt}
                    loading="lazy"
                    {...imgSize(p.photo)}
                  />
                  <span className="problem__tag">
                    {t(`problems.items.${i}.tag`, p.tag)}
                  </span>
                </div>
                <div className="problem__body">
                  <h3 className="problem__title">
                    {t(`problems.items.${i}.title`, p.title)}
                  </h3>
                  <p className="problem__text">
                    {t(`problems.items.${i}.text`, p.text)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <article className="gap">
            <div className="media gap__media">
              <img
                src={problems.gap.photo}
                alt={problems.gap.alt}
                loading="lazy"
                {...imgSize(problems.gap.photo)}
              />
              <span className="problem__tag">{problems.gap.tag}</span>
            </div>
            <div className="gap__body">
              <h3 className="gap__title">
                {t("problems.gap.title", problems.gap.title)}
              </h3>
              <p className="gap__text">
                {t("problems.gap.text", problems.gap.text)}
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
