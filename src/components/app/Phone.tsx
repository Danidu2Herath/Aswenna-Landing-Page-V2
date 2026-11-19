import type { ReactNode } from "react";
import Icon from "../Icon";
import { appUi } from "../../data/content";
import { useI18n } from "../../i18n";

type Props = {
  children: ReactNode;
  /** Index of the lit tab, or null for a screen with no tab bar. */
  tab?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Caption under the device. Omitted inside the hero, where space is tight. */
  caption?: { title: string; text: string };
  /** Accessible description of the whole device. */
  label: string;
};

/**
 * The device frame. Everything inside is real DOM, so it scales without
 * blurring, inherits the design tokens and can be translated.
 *
 * The screen is `aria-hidden`: it is an illustration of an interface, and
 * reading out a decorative mock dashboard would be noise. The device as a
 * whole carries one description instead.
 */
export default function Phone({
  children,
  tab = 0,
  size = "md",
  className = "",
  caption,
  label,
}: Props) {
  const { t } = useI18n();

  return (
    <figure className={`phone phone--${size}${className ? ` ${className}` : ""}`}>
      <div className="phone__frame" role="img" aria-label={label}>
        <span className="phone__island" aria-hidden="true" />
        <div className="phone__screen" aria-hidden="true">
          <div className="phone__status">
            <span>{t("appUi.statusTime", appUi.statusTime)}</span>
            <span className="phone__status-icons">
              <Icon name="signal-low" />
              <Icon name="wifi" />
              <Icon name="battery" />
            </span>
          </div>

          {children}

          {tab === null ? null : (
            <nav className="phone__tabs">
              {appUi.tabs.map((item, i) => (
                <span key={item.label} className={`phone__tab${i === tab ? " is-on" : ""}`}>
                  <Icon name={item.icon} />
                  {t(`appUi.tabs.${i}.label`, item.label)}
                </span>
              ))}
            </nav>
          )}
        </div>
        <span className="phone__home" aria-hidden="true" />
      </div>

      {caption ? (
        <figcaption className="phone__caption">
          <strong>{caption.title}</strong>
          <span>{caption.text}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
