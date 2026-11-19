import Icon from "./Icon";
import Phone from "./app/Phone";
import { SCREENS } from "./app/screens";
import { journey } from "../data/content";
import { useI18n } from "../i18n";

/**
 * The cultivation-calendar showcase: what the calendar covers on the left,
 * the screen itself on the right.
 *
 * There is deliberately no Maha/Yala ribbon here. The calendar is not a
 * two-season feature - it re-reads the plot whenever conditions change, in
 * whatever season the farmer is planting - and banding the panel by season
 * said otherwise.
 */
const A = journey.adapts;
const { Screen, tab } = SCREENS.calendar;

export default function CalendarYear() {
  const { t } = useI18n();

  return (
    <div className="cyear">
      <div className="cyear__copy">
        <p className="cyear__eyebrow">{t("journey.adapts.eyebrow", A.eyebrow)}</p>
        <h3 className="cyear__title">{t("journey.adapts.title", A.title)}</h3>
        <p className="cyear__sub">{t("journey.adapts.sub", A.sub)}</p>

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
          label="Cultivation calendar - interface design concept for the Aswenna application"
        >
          <Screen />
        </Phone>
      </div>
    </div>
  );
}
