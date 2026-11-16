import { useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import Phone from "./app/Phone";
import { SCREENS } from "./app/screens";
import { platform, platformScreens, appUi } from "../data/content";
import { useI18n } from "../i18n";

/**
 * The platform section is the app showcase: the list of proposed screens on
 * one side, and whichever of them you pick rendered on a device on the other.
 *
 * Every entry in the list has a real designed screen behind it, so nothing in
 * here is a grey rectangle standing in for a screenshot.
 */
export default function PlatformSection() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const name = platformScreens[active];
  const { Screen, tab, meta, path } = SCREENS[name];

  return (
    <section className="section section--band" id="platform">
      <div className="container">
        <SectionHead {...platform} center={false} keyBase="platform" />

        <div className="platform__layout">
          <ul className="platform__list">
            {platform.screens.map((s, i) => (
              <Reveal as="li" delay={Math.min(i, 6) * 50} key={s.name}>
                <button
                  type="button"
                  className={`platform__item${i === active ? " is-active" : ""}`}
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                >
                  <span className="platform__index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="platform__copy">
                    <strong>{t(`platform.screens.${i}.name`, s.name)}</strong>
                    <span>{t(`platform.screens.${i}.text`, s.text)}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </ul>

          <div className="platform__preview-wrap">
            <div className="platform__preview">
              <div className="platform__preview-head">
                <strong>{t(`platform.screens.${active}.name`, platform.screens[active].name)}</strong>
                <span className="phone__concept">
                  <Icon name="info" />
                  {t("appUi.conceptNote", appUi.conceptNote)}
                </span>
              </div>

              {/* `key` remounts the device so the pop-in animation replays on
                  every choice, which is what makes the list feel connected
                  to the screen. */}
              <Phone
                key={name}
                tab={tab}
                size="sm"
                concept={false}
                label={`${t(`${path}.title`, meta.title)} — interface design concept for the Aswenna application`}
              >
                <Screen />
              </Phone>

              <p className="platform__preview-note">{t(`${path}.caption`, meta.caption)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
