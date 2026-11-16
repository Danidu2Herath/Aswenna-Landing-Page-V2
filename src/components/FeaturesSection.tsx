import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { featureGroups } from "../data/content";
import { useI18n } from "../i18n";

export default function FeaturesSection() {
  const { t } = useI18n();

  return (
    <section className="section" id="features">
      <div className="container">
        <SectionHead {...featureGroups} keyBase="featureGroups" />
        <div className="features__groups">
          {featureGroups.groups.map((g, i) => (
            <Reveal delay={i * 60} key={g.id}>
              <section className="fgroup" aria-labelledby={`fgroup-${g.id}`}>
                <header className="fgroup__head">
                  <span className="fgroup__icon">
                    <Icon name={g.icon} />
                  </span>
                  <div>
                    <span className="fgroup__label">{t(`featureGroups.groups.${i}.label`, g.label)}</span>
                    <h3 className="fgroup__title" id={`fgroup-${g.id}`}>
                      {t(`featureGroups.groups.${i}.title`, g.title)}
                    </h3>
                  </div>
                </header>
                <ul className="fgroup__grid">
                  {g.items.map((item, j) => (
                    <li className="fitem" key={item.title}>
                      <span className="fitem__icon">
                        <Icon name={item.icon} />
                      </span>
                      <h4 className="fitem__title">
                        {t(`featureGroups.groups.${i}.items.${j}.title`, item.title)}
                      </h4>
                      <p className="fitem__text">
                        {t(`featureGroups.groups.${i}.items.${j}.text`, item.text)}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="fgroup__note">
                  <Icon name="info" />
                  <span>{t(`featureGroups.groups.${i}.note`, g.note)}</span>
                </p>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
