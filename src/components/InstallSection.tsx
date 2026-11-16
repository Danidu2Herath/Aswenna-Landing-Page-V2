import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { install } from "../data/content";
import { useI18n } from "../i18n";

export default function InstallSection() {
  const { t } = useI18n();

  return (
    <section className="section section--alt" id="install">
      <div className="container">
        <SectionHead {...install} keyBase="install" />
        <div className="install__grid">
          {install.devices.map((d, i) => (
            <Reveal delay={i * 90} key={d.title}>
              <article className="device">
                <header className="device__head">
                  <span className="device__icon">
                    <Icon name={d.icon} />
                  </span>
                  <span className="device__label">{t(`install.devices.${i}.label`, d.label)}</span>
                </header>
                <h3 className="device__title">{t(`install.devices.${i}.title`, d.title)}</h3>
                <p className="device__text">{t(`install.devices.${i}.text`, d.text)}</p>
                <ul className="device__points">
                  {d.points.map((p, j) => (
                    <li key={p}>
                      <span className="device__tick">
                        <Icon name="check" />
                      </span>
                      {t(`install.devices.${i}.points.${j}`, p)}
                    </li>
                  ))}
                </ul>
                <p className="device__link">
                  <Icon name="arrow-right" />
                  <span>{d.link}</span>
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
