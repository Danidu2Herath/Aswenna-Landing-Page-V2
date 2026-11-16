import Chip from "./Chip";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import AppPhone from "./app/AppPhone";
import { soil } from "../data/content";
import { useI18n } from "../i18n";

export default function SoilSection() {
  const { t } = useI18n();

  return (
    <section className="section section--band" id="soil">
      <div className="container">
        <SectionHead {...soil} center={false} keyBase="soil" />

        <div className="soil__layout">
          <Reveal className="soil__visual">
            {/* The soil-monitoring screen stands in for the old abstract
                strata graphic: it shows the same layers, and it shows them
                the way a farmer would actually read them. */}
            <div className="soil__phone-wrap">
              <AppPhone screen="soil" size="sm" />
            </div>
            <div className="soil__legend">
              {soil.transparency.rows.map((row) => (
                <div className="soil__legend-row" key={row.label}>
                  <Chip tone={row.tone}>{row.label}</Chip>
                  <p>{row.text}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <ul className="soil__list">
            {soil.capabilities.map((c, i) => (
              <Reveal as="li" delay={i * 70} key={c.title}>
                <div className="soil__item">
                  <span className="soil__item-icon">
                    <Icon name={c.icon} />
                  </span>
                  <div>
                    <h3 className="soil__item-title">{t(`soil.capabilities.${i}.title`, c.title)}</h3>
                    <p className="soil__item-text">{t(`soil.capabilities.${i}.text`, c.text)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal>
          <div className="transparency">
            <div className="transparency__head">
              <h3 className="transparency__title">{t("soil.transparency.title", soil.transparency.title)}</h3>
              <p className="transparency__text">{t("soil.transparency.text", soil.transparency.text)}</p>
            </div>
            <div className="transparency__rows">
              {soil.transparency.rows.map((row) => (
                <div className="transparency__row" key={row.label}>
                  <Chip tone={row.tone}>{row.label}</Chip>
                  <p>{row.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
