import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { comparison } from "../data/content";
import { useI18n } from "../i18n";

export default function ComparisonSection() {
  const { t } = useI18n();
  const without = t("comparison.withoutLabel", comparison.withoutLabel);
  const withLabel = t("comparison.withLabel", comparison.withLabel);

  return (
    <section className="section section--alt" id="approach">
      <div className="container">
        <SectionHead {...comparison} keyBase="comparison" />
        <Reveal>
          <div className="compare">
            <div className="compare__head compare__head--without">
              <span className="compare__badge compare__badge--without">
                <Icon name="x" />
              </span>
              {without}
            </div>
            <div className="compare__head compare__head--with">
              <span className="compare__badge compare__badge--with">
                <Icon name="check" />
              </span>
              {withLabel}
            </div>

            {comparison.rows.map((row, i) => (
              <div className="compare__row" key={row.without}>
                <div className="compare__cell compare__cell--without">
                  <span className="compare__mark compare__mark--without">
                    <Icon name="x" />
                  </span>
                  <p>
                    <span className="compare__inline">{without}</span>
                    {t(`comparison.rows.${i}.without`, row.without)}
                  </p>
                </div>
                <div className="compare__cell compare__cell--with">
                  <span className="compare__mark compare__mark--with">
                    <Icon name="check" />
                  </span>
                  <p>
                    <span className="compare__inline">{withLabel}</span>
                    {t(`comparison.rows.${i}.with`, row.with)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
