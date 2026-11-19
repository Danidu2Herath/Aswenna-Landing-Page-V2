import { Fragment } from "react";
import Icon from "../Icon";
import { appUi, appUiExtra } from "../../data/content";
import { useI18n } from "../../i18n";
import { Bars, Sparkline } from "./charts";

/* ==========================================================================
   The screens of the proposed Aswenna application.

   Every value shown is illustrative - see the note at the top of the app
   section of js/content.ts. The Estimated / Measured distinction that governs
   the rest of the site is kept inside the mockups too.
   ========================================================================== */

const Tag = ({ kind, onDark = false }: { kind: string; onDark?: boolean }) => (
  <span className={`atag atag--${onDark ? "onDark" : kind.toLowerCase()}`}>{kind}</span>
);

/* ------------------------------------------------------- farmer dashboard */
export function DashboardScreen() {
  const { t } = useI18n();
  const d = appUi.dashboard;

  return (
    <div className="appui">
      <div className="appui__head">
        <span>
          <span className="appui__hello">{t("appUi.dashboard.greeting", d.greeting)}</span>
          <span className="appui__name">{d.farmer}</span>
        </span>
        <span className="appui__avatar">
          <Icon name="bell" />
          <span className="appui__badge" />
        </span>
      </div>

      <span className="appui__plot">
        <Icon name="map-pin" />
        {d.plot}
      </span>

      <div className="acard acard--accent">
        <div className="aweather">
          <span className="aweather__icon">
            <Icon name={d.weather.icon} />
          </span>
          <span className="aweather__meta">
            <span className="aweather__summary">{t("appUi.dashboard.weather.summary", d.weather.summary)}</span>
            <span className="aweather__note">{t("appUi.dashboard.weather.note", d.weather.note)}</span>
          </span>
          <span className="aweather__temp">{d.weather.temp}</span>
        </div>
      </div>

      <div className="atiles">
        {d.tiles.map((tile, i) => (
          <div className="atile" key={tile.label}>
            <Icon name={tile.icon} />
            <span className="atile__value">
              {tile.value}
              {tile.unit ? <em>{tile.unit}</em> : null}
            </span>
            <span className="atile__label">{t(`appUi.dashboard.tiles.${i}.label`, tile.label)}</span>
            <Tag kind={tile.tag} />
          </div>
        ))}
      </div>

      <div className="acard">
        <span className="acard__label">{t("appUi.dashboard.action.label", d.action.label)}</span>
        <p className="acard__title">{t("appUi.dashboard.action.title", d.action.title)}</p>
        <p className="acard__text">{t("appUi.dashboard.action.text", d.action.text)}</p>
        <div className="aaction">
          <span className="abtn" style={{ background: "var(--primary-700)", color: "#fff" }}>
            {t("appUi.dashboard.action.primary", d.action.primary)}
          </span>
          <span className="abtn" style={{ background: "var(--neutral-200)", color: "var(--neutral-700)" }}>
            {t("appUi.dashboard.action.secondary", d.action.secondary)}
          </span>
        </div>
      </div>

      <div className="acard acard--grow">
        <span className="acard__label">{t("appUi.dashboard.trendLabel", d.trendLabel)}</span>
        <div className="achart-wrap">
          <Sparkline values={[...d.trend]} />
        </div>
      </div>

      <div className="astrip">
        <Icon name={d.alert.icon} />
        <span>{t("appUi.dashboard.alert.text", d.alert.text)}</span>
        <time>{d.alert.when}</time>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- soil monitoring */
export function SoilScreen() {
  const { t } = useI18n();
  const s = appUi.soil;

  return (
    <div className="appui">
      <div className="appui__head">
        <span>
          <p className="appui__title">{t("appUi.soil.title", s.title)}</p>
          <p className="appui__sub">{s.plot}</p>
        </span>
        <span className="appui__avatar">
          <Icon name="sliders" />
        </span>
      </div>

      <div className="acard">
        <span className="acard__label">{t("appUi.soil.depthLabel", s.depthLabel)}</span>
        <div className="alayers">
          {s.layers.map((layer) => (
            <div className="alayer" key={layer.name}>
              <span className="alayer__name">{layer.name}</span>
              <span className="alayer__bar">
                <span className="alayer__fill" style={{ width: `${layer.value}%` }} />
              </span>
              <span className="alayer__value">{layer.value}%</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.3em", marginTop: "0.55em" }}>
          <Tag kind="Measured" />
          <Tag kind="Estimated" />
        </div>
      </div>

      <div className="acard acard--grow">
        <span className="acard__label">{t("appUi.soil.trendLabel", s.trendLabel)}</span>
        <div className="achart-wrap">
          <Sparkline values={[...s.trend]} />
        </div>
      </div>

      <div className="acard">
        <span className="acard__label">{t("appUi.soil.nutrientLabel", s.nutrientLabel)}</span>
        <div className="anutrients">
          {s.nutrients.map((n) => (
            <div className={`anutrient${n.state === "Low" ? " anutrient--low" : ""}`} key={n.name}>
              <span className="anutrient__key">{n.name}</span>
              <span className="anutrient__bar">
                <span className="anutrient__fill" style={{ width: `${Math.round(n.level * 100)}%` }} />
              </span>
              <span className="anutrient__state">{n.state}</span>
            </div>
          ))}
        </div>
        <p className="anote">
          <Icon name="info" />
          {t("appUi.soil.nutrientNote", s.nutrientNote)}
        </p>
      </div>
    </div>
  );
}

/* --------------------------------------------------- cultivation calendar */
export function CalendarScreen() {
  const { t } = useI18n();
  const c = appUi.calendar;

  return (
    <div className="appui">
      <div className="appui__head">
        <span>
          <p className="appui__title">{c.month}</p>
          <p className="appui__sub">{t("appUi.calendar.season", c.season)}</p>
        </span>
        <span className="appui__avatar">
          <Icon name="calendar" />
        </span>
      </div>

      <div className="amonth">
        {c.week.map((day, i) => (
          <span className="amonth__dow" key={`${day}-${i}`}>
            {day}
          </span>
        ))}
        {Array.from({ length: c.grid.firstCol }, (_, i) => (
          <span className="amonth__pad" key={`pad${i}`} />
        ))}
        {Array.from({ length: c.grid.days }, (_, i) => {
          const d = i + 1;
          return (
            <span
              className={`amonth__day${d === c.grid.today ? " is-today" : ""}${
                c.grid.marked.includes(d) ? " has-task" : ""
              }`}
              key={d}
            >
              {d}
              <i />
            </span>
          );
        })}
      </div>

      <ul className="atasks">
        {c.tasks.map((task, i) => (
          <Fragment key={task.title}>
            {"group" in task && task.group ? (
              <li className="atasks__group">{t(`appUi.calendar.tasks.${i}.group`, task.group)}</li>
            ) : null}
            <li className={`atask atask--${task.state}`}>
              <span className="atask__mark">
                <Icon name={task.state === "done" ? "check" : task.icon} />
              </span>
              <span>
                <span className="atask__title">{t(`appUi.calendar.tasks.${i}.title`, task.title)}</span>
                <span className="atask__when">{task.when}</span>
              </span>
            </li>
          </Fragment>
        ))}
      </ul>

      <div className="astrip" style={{ marginTop: "auto" }}>
        <Icon name={c.shift.icon} />
        <span>{t("appUi.calendar.shift.text", c.shift.text)}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- smart irrigation */
export function IrrigationScreen() {
  const { t } = useI18n();
  const g = appUi.irrigation;
  const reading = Number(g.reading);
  const circumference = 2 * Math.PI * 46;
  const open = reading < g.lower;

  return (
    <div className="appui">
      <div className="appui__head">
        <span>
          <p className="appui__title">{t("appUi.irrigation.title", g.title)}</p>
          <p className="appui__sub">{g.plot}</p>
        </span>
        <span className={`avalve${open ? "" : " avalve--closed"}`}>
          <i />
          {open ? t("appUi.irrigation.valveOpen", g.valveOpen) : t("appUi.irrigation.valveClosed", g.valveClosed)}
        </span>
      </div>

      <div className="acard">
        <div className="agauge">
          <span className="agauge__ring">
            <svg viewBox="0 0 100 100">
              <circle className="agauge__track" cx="50" cy="50" r="46" />
              <circle
                className="agauge__value"
                cx="50"
                cy="50"
                r="46"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - reading / 100)}
              />
            </svg>
            <span className="agauge__centre">
              <span className="agauge__num">
                {g.reading}
                <em>{g.unit}</em>
              </span>
            </span>
          </span>
          <span>
            <span className="acard__label">{t("appUi.irrigation.readingLabel", g.readingLabel)}</span>
            <div style={{ marginTop: "0.3em" }}>
              <Tag kind={g.tag} />
            </div>
          </span>
        </div>
      </div>

      <div className="acard">
        <span className="acard__label">{t("appUi.irrigation.thresholdLabel", g.thresholdLabel)}</span>
        <div className="arail">
          <span className="arail__mark" style={{ left: `${g.lower}%` }}>
            <span>
              {t("appUi.irrigation.lowerLabel", g.lowerLabel)} {g.lower}%
            </span>
          </span>
          <span className="arail__mark" style={{ left: `${g.upper}%` }}>
            <span>
              {t("appUi.irrigation.upperLabel", g.upperLabel)} {g.upper}%
            </span>
          </span>
          <span className="arail__knob" style={{ left: `${reading}%` }} />
        </div>
        <div className="asegment">
          {g.modes.map((mode, i) => (
            <span key={mode} className={i === 0 ? "is-on" : ""}>
              {t(`appUi.irrigation.modes.${i}`, mode)}
            </span>
          ))}
        </div>
      </div>

      <div className="acard acard--grow">
        <span className="acard__label">{t("appUi.irrigation.logLabel", g.logLabel)}</span>
        <ul className="alog">
          {g.log.map((entry, i) => (
            <li key={entry.time} className={`is-${entry.kind}`}>
              <i />
              <time>{entry.time}</time>
              <span>{t(`appUi.irrigation.log.${i}.text`, entry.text)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- pests & alerts */
export function AlertsScreen() {
  const { t } = useI18n();
  const a = appUi.alerts;

  return (
    <div className="appui">
      <div className="appui__head">
        <span>
          <p className="appui__title">{t("appUi.alerts.headline", a.headline)}</p>
          <p className="appui__sub">{t("appUi.alerts.sub", a.sub)}</p>
        </span>
        <span className="appui__avatar">
          <Icon name="bell-ring" />
          <span className="appui__badge" />
        </span>
      </div>

      <ul className="aalerts">
        {a.items.map((item, i) => (
          <li className={`aalert aalert--${item.severity}`} key={item.title}>
            <span className="aalert__icon">
              <Icon name={item.icon} />
            </span>
            <span>
              <span className="aalert__top">
                <span className="aalert__sev">{t(`appUi.alerts.items.${i}.label`, item.label)}</span>
                <span className="aalert__when">{item.when}</span>
              </span>
              <span className="aalert__title">{t(`appUi.alerts.items.${i}.title`, item.title)}</span>
              <p className="aalert__text">{t(`appUi.alerts.items.${i}.text`, item.text)}</p>
            </span>
          </li>
        ))}
      </ul>

      <div className="adelivery">
        {a.delivery.map((d, i) => (
          <span key={d.label}>
            <Icon name={d.icon} />
            {t(`appUi.alerts.delivery.${i}.label`, d.label)}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- market analytics */
export function MarketScreen() {
  const { t } = useI18n();
  const m = appUi.market;

  return (
    <div className="appui">
      <div className="appui__head">
        <span>
          <p className="appui__title">{t("appUi.market.title", m.title)}</p>
          <p className="appui__sub">{t("appUi.market.priceLabel", m.priceLabel)}</p>
        </span>
        <span className="appui__avatar">
          <Icon name="trending-up" />
        </span>
      </div>

      <div className="achips">
        {m.crops.map((crop, i) => (
          <span key={crop} className={i === m.activeCrop ? "is-on" : ""}>
            {t(`appUi.market.crops.${i}`, crop)}
          </span>
        ))}
      </div>

      <div className="acard acard--grow">
        <span className="acard__label">{t("appUi.market.rangeLabel", m.rangeLabel)}</span>
        <div className="achart-wrap">
          <Bars values={[...m.series]} />
        </div>
      </div>

      <div className="acard">
        <ul className="arows">
          {m.rows.map((row) => (
            <li key={row.name} className={row.dir === "down" ? "is-down" : ""}>
              <span>{row.name}</span>
              <strong>{row.value}</strong>
              <Icon name="trending-up" />
            </li>
          ))}
        </ul>
        <p className="anote">
          <Icon name={m.forecast.icon} />
          {t("appUi.market.forecast.text", m.forecast.text)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------ land registration */
export function MappingScreen() {
  const { t } = useI18n();
  const m = appUiExtra.mapping;

  return (
    <div className="appui">
      <div className="appui__head">
        <span>
          <p className="appui__title">{t("appUiExtra.mapping.title", m.title)}</p>
          <p className="appui__sub">{m.plot}</p>
        </span>
        <span className="appui__avatar">
          <Icon name="pencil" />
        </span>
      </div>

      <div className="acard acard--flush">
        <svg className="amap" viewBox="0 0 120 78" aria-hidden="true">
          <defs>
            <pattern id="amap-grid" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M12 0 L0 0 0 12" fill="none" stroke="var(--color-border)" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="120" height="78" fill="var(--primary-50)" rx="6" />
          <rect width="120" height="78" fill="url(#amap-grid)" rx="6" />
          <path
            className="amap__plot"
            d="M22 16 L88 11 L100 44 L74 66 L30 58 Z"
          />
          {([[22, 16], [88, 11], [100, 44], [74, 66], [30, 58]] as const).map(([x, y]) => (
            <circle key={`${x}-${y}`} className="amap__handle" cx={x} cy={y} r={2.6} />
          ))}
        </svg>
      </div>

      <div className="atiles" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="atile">
          <Icon name="crosshair" />
          <span className="atile__value">
            {m.area}
            <em>{m.areaUnit}</em>
          </span>
          <span className="atile__label">{t("appUiExtra.mapping.areaLabel", m.areaLabel)}</span>
        </div>
        <div className="atile">
          <Icon name="map" />
          <span className="atile__value">{m.perimeter}</span>
          <span className="atile__label">{t("appUiExtra.mapping.perimeterLabel", m.perimeterLabel)}</span>
        </div>
      </div>

      <div className="acard acard--grow">
        <span className="acard__label">{t("appUiExtra.mapping.profileLabel", m.profileLabel)}</span>
        <ul className="arows">
          {m.rows.map((row, i) => (
            <li key={row.name}>
              <span>{t(`appUiExtra.mapping.rows.${i}.name`, row.name)}</span>
              <strong>{row.value}</strong>
              <Tag kind={row.tag} />
            </li>
          ))}
        </ul>
        <p className="anote">
          <Icon name="info" />
          {t("appUiExtra.mapping.note", m.note)}
        </p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------- crop recommendations */
export function CropsScreen() {
  const { t } = useI18n();
  const c = appUiExtra.crops;

  return (
    <div className="appui">
      <div className="appui__head">
        <span>
          <p className="appui__title">{t("appUiExtra.crops.title", c.title)}</p>
          <p className="appui__sub">{c.season}</p>
        </span>
        <span className="appui__avatar">
          <Icon name="sprout" />
        </span>
      </div>

      <div className="acard acard--grow">
        <span className="acard__label">{t("appUiExtra.crops.suitLabel", c.suitLabel)}</span>
        <div className="acrops">
          {c.items.map((item, i) => (
            <div className="acrop" key={item.name}>
              <span className="acrop__rank">{i + 1}</span>
              <span className="acrop__body">
                <span className="acrop__name">{t(`appUiExtra.crops.items.${i}.name`, item.name)}</span>
                <span className="acrop__bar">
                  <span className="acrop__fill" style={{ width: `${Math.round(item.score * 100)}%` }} />
                </span>
                <span className="acrop__note">{t(`appUiExtra.crops.items.${i}.note`, item.note)}</span>
              </span>
              <span className="acrop__score">{Math.round(item.score * 100)}</span>
            </div>
          ))}
        </div>
        <p className="anote">
          <Icon name="info" />
          {t("appUiExtra.crops.note", c.note)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- device monitoring */
export function DevicesScreen() {
  const { t } = useI18n();
  const d = appUiExtra.devices;

  return (
    <div className="appui">
      <div className="appui__head">
        <span>
          <p className="appui__title">{t("appUiExtra.devices.title", d.title)}</p>
          <p className="appui__sub">{t("appUiExtra.devices.sub", d.sub)}</p>
        </span>
        <span className="appui__avatar">
          <Icon name="cpu" />
        </span>
      </div>

      <ul className="adevices">
        {d.items.map((item, i) => (
          <li className={`adevice${item.ok ? "" : " is-warn"}`} key={item.name}>
            <span className="adevice__dot" />
            <span className="adevice__body">
              <span className="adevice__name">{t(`appUiExtra.devices.items.${i}.name`, item.name)}</span>
              <span className="adevice__meta">
                {item.signal} · {item.when}
              </span>
            </span>
            <span className="abattery" aria-hidden="true">
              <span className="abattery__cell">
                <span className="abattery__fill" style={{ width: `${item.battery}%` }} />
              </span>
              {item.battery}%
            </span>
          </li>
        ))}
      </ul>

      <div className="astrip" style={{ marginTop: "auto" }}>
        <Icon name="radio-tower" />
        <span>{t("appUiExtra.devices.gateway", d.gateway)}</span>
      </div>
    </div>
  );
}

/* ----------------------------------------------- extension officer overview */
export function OfficerScreen() {
  const { t } = useI18n();
  const o = appUiExtra.officer;

  return (
    <div className="appui">
      <div className="appui__head">
        <span>
          <p className="appui__title">{t("appUiExtra.officer.title", o.title)}</p>
          <p className="appui__sub">{o.sub}</p>
        </span>
        <span className="appui__avatar">
          <Icon name="users" />
        </span>
      </div>

      <div className="atiles">
        {o.tiles.map((tile, i) => (
          <div className="atile" key={tile.label}>
            <Icon name={tile.icon} />
            <span className="atile__value">{tile.value}</span>
            <span className="atile__label">{t(`appUiExtra.officer.tiles.${i}.label`, tile.label)}</span>
          </div>
        ))}
      </div>

      <div className="acard acard--grow">
        <span className="acard__label">{t("appUiExtra.officer.listLabel", o.listLabel)}</span>
        <ul className="aalerts" style={{ marginTop: "0.5em" }}>
          {o.rows.map((row, i) => (
            <li className={`aalert aalert--${row.level}`} key={row.name} style={{ gridTemplateColumns: "1fr" }}>
              <span>
                <span className="aalert__title">{row.name}</span>
                <p className="aalert__text">{t(`appUiExtra.officer.rows.${i}.text`, row.text)}</p>
              </span>
            </li>
          ))}
        </ul>
        <p className="anote">
          <Icon name="shield-check" />
          {t("appUiExtra.officer.note", o.note)}
        </p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- registry */
export const SCREENS = {
  dashboard: { Screen: DashboardScreen, tab: 0, meta: appUi.dashboard, path: "appUi.dashboard" },
  soil: { Screen: SoilScreen, tab: 1, meta: appUi.soil, path: "appUi.soil" },
  calendar: { Screen: CalendarScreen, tab: 2, meta: appUi.calendar, path: "appUi.calendar" },
  irrigation: { Screen: IrrigationScreen, tab: 1, meta: appUi.irrigation, path: "appUi.irrigation" },
  alerts: { Screen: AlertsScreen, tab: 4, meta: appUi.alerts, path: "appUi.alerts" },
  market: { Screen: MarketScreen, tab: 3, meta: appUi.market, path: "appUi.market" },
  mapping: { Screen: MappingScreen, tab: 1, meta: appUiExtra.mapping, path: "appUiExtra.mapping" },
  crops: { Screen: CropsScreen, tab: 2, meta: appUiExtra.crops, path: "appUiExtra.crops" },
  devices: { Screen: DevicesScreen, tab: 4, meta: appUiExtra.devices, path: "appUiExtra.devices" },
  officer: { Screen: OfficerScreen, tab: 4, meta: appUiExtra.officer, path: "appUiExtra.officer" },
} as const;

export type ScreenName = keyof typeof SCREENS;
