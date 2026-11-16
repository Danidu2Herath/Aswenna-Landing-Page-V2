import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import AppPhone from "./app/AppPhone";
import { fieldFirst } from "../data/content";
import { useI18n } from "../i18n";

export default function FieldFirstSection() {
  const { t } = useI18n();

  return (
    <section className="section section--band" id="field-first">
      <div className="container">
        <SectionHead {...fieldFirst} center={false} keyBase="fieldFirst" />

        <div className="ffirst__layout">
          <ul className="ffirst__list">
            {fieldFirst.items.map((item, i) => (
              <Reveal as="li" delay={i * 80} key={item.title}>
                <div className="ffirst__item">
                  <span className="ffirst__icon">
                    <Icon name={item.icon} />
                  </span>
                  <div>
                    <h3 className="ffirst__title">{t(`fieldFirst.items.${i}.title`, item.title)}</h3>
                    <p className="ffirst__text">{t(`fieldFirst.items.${i}.text`, item.text)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal className="ffirst__visual" delay={120}>
            {/* The alerts screen in front of the place it has to work: this is
                the section about low coverage, SMS and voice. */}
            <div className="ffirst__stack">
              <div className="media media--4x3">
                <img
                  src="/images/photos/connectivity-gap.webp"
                  alt="Paddy fields and coconut palms in rural Sri Lanka"
                  loading="lazy"
                />
              </div>
              <div className="ffirst__device">
                <AppPhone screen="alerts" size="sm" withCaption={false} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
