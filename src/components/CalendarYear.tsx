import { useState } from "react";
import Icon from "./Icon";
import Phone from "./app/Phone";
import { SCREENS } from "./app/screens";
import { journey, seasons } from "../data/content";
import { useI18n } from "../i18n";

/**
 * The cultivation-year showcase.
 *
 * A twelve-month ribbon runs across the top, banded by season. Picking a
 * month moves the whole panel to it: the phone's header follows, and the
 * copy names the stage the crop is in then.
 *
 * The stage descriptions are the same four the page already publishes in
 * the seasons section — this presents them against the year rather than
 * making a new claim about what happens in a given month. The season spans
 * are indicative and the panel says so, because the monsoon decides the
 * exact start and it differs by district.
 */
const A = journey.adapts;
const { Screen, tab } = SCREENS.calendar;

export default function CalendarYear() {
  const { t } = useI18n();
  // November — the month the designed screen shows.
  const [at, setAt] = useState(1);

  const month = A.months[at];
  const stage = seasons.stages[month.stage];
  const seasonLabel = A.seasonLabels[month.season as keyof typeof A.seasonLabels];

  return (
    <div className="cyear">
      {/* ------------------------------------------------------- ribbon */}
      <div className="cyear__ribbon">
        <div className="cyear__bands" aria-hidden="true">
          <span className="cyear__band cyear__band--maha">{A.seasonLabels.maha}</span>
          <span className="cyear__band cyear__band--yala">{A.seasonLabels.yala}</span>
        </div>

        <ul className="cyear__months" role="tablist" aria-label={t("journey.adapts.eyebrow", A.eyebrow)}>
          {A.months.map((m, i) => (
            <li key={m.m} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={i === at}
                tabIndex={i === at ? 0 : -1}
                className={`cyear__month cyear__month--${m.season}${i === at ? " is-active" : ""}`}
                onMouseEnter={() => setAt(i)}
                onFocus={() => setAt(i)}
                onClick={() => setAt(i)}
              >
                {m.m}
              </button>
            </li>
          ))}
        </ul>

        <p className="cyear__note">
          <Icon name="info" />
          {t("journey.adapts.ribbonNote", A.ribbonNote)}
        </p>
      </div>

      {/* -------------------------------------------------------- panel */}
      <div className="cyear__panel">
        <div className="cyear__copy">
          <p className="cyear__eyebrow">
            {month.m} · {seasonLabel}
          </p>
          <h3 className="cyear__title">{t("journey.adapts.title", A.title)}</h3>
          <p className="cyear__sub">{t("journey.adapts.sub", A.sub)}</p>

          {/* The stage the crop is in at this point of the year, named from
              the four the seasons section already describes. */}
          <div className="cyear__stage" key={month.stage}>
            <span className="cyear__stage-label">{stage.stage}</span>
            <strong className="cyear__stage-name">{stage.title}</strong>
            <span className="cyear__stage-text">{stage.callout.text}</span>
          </div>

          <ul className="cyear__list">
            {A.items.map((item, i) => (
              <li key={item}>
                <span className="cyear__tick">
                  <Icon name="check" />
                </span>
                {t(`journey.adapts.items.${i}`, item)}
              </li>
            ))}
          </ul>
        </div>

        <div className="cyear__device">
          <Phone
            tab={tab}
            size="sm"
            concept={false}
            label="Cultivation calendar — interface design concept for the Aswenna application"
          >
            <Screen />
          </Phone>
        </div>
      </div>
    </div>
  );
}
