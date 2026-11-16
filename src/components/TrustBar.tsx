import Icon from "./Icon";
import { trustBar } from "../data/content";
import { useI18n } from "../i18n";

export default function TrustBar() {
  const { t } = useI18n();
  return (
    <section className="trustbar" aria-label={t("trustBar.label", trustBar.label)}>
      <div className="container trustbar__inner">
        <span className="trustbar__label">{t("trustBar.label", trustBar.label)}</span>
        <ul className="trustbar__list">
          {trustBar.items.map((item, i) => (
            <li key={item.text}>
              <Icon name={item.icon} />
              <span>{t(`trustBar.items.${i}.text`, item.text)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
