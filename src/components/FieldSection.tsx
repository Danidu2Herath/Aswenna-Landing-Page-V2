import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { field } from "../data/content";
import { imgSize } from "../data/imageSizes";
import { useI18n } from "../i18n";

export default function FieldSection() {
  const { t } = useI18n();

  return (
    <section className="section section--alt" id="field">
      <div className="container">
        <SectionHead {...field} keyBase="field" />
        <div className="field__grid">
          {field.items.map((f, i) => (
            <Reveal delay={i * 80} key={f.title}>
              <article className="field__card">
                {f.photo ? (
                  <div className="media media--5x3 field__media">
                    <img src={f.photo} alt={f.alt} loading="lazy" {...imgSize(f.photo)} />
                  </div>
                ) : (
                  <div className="field__art" aria-hidden="true">
                    <span className="field__art-icon">
                      <Icon name={f.icon} />
                    </span>
                  </div>
                )}
                <div className="field__body">
                  <span className="card__icon">
                    <Icon name={f.icon} />
                  </span>
                  <h3 className="card__title">{t(`field.items.${i}.title`, f.title)}</h3>
                  <p className="card__text">{t(`field.items.${i}.text`, f.text)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
