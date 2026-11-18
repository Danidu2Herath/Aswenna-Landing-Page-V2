import { useRef, useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { featureGroups } from "../data/content";
import { useI18n } from "../i18n";
import { useMediaQuery } from "../hooks";

/**
 * Three columns, one line per capability, headed by what that group needs.
 *
 * The whole section used to be three grids of paragraphs — seventeen blocks
 * of near-identical text, where nothing was louder than anything else and
 * the thing that actually matters (the first group needs no hardware at all)
 * was invisible. Here the count is readable at a glance and the requirement
 * sits in the heading.
 *
 * The description each line used to carry is not lost: it opens under the
 * line on hover, on focus, or on a tap. Hover waits a moment before it
 * commits, so sweeping the pointer down a column does not open every row on
 * the way past.
 */
const HOVER_DELAY = 120;

export default function FeaturesSection() {
  const { t } = useI18n();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  // One open row at a time, addressed as "groupIndex:itemIndex".
  const [open, setOpen] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const enter = (key: string) => {
    if (!canHover) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(key), HOVER_DELAY);
  };

  const leaveColumn = () => {
    window.clearTimeout(timer.current);
    if (canHover) setOpen(null);
  };

  return (
    <section className="section" id="features">
      <div className="container">
        <SectionHead {...featureGroups} keyBase="featureGroups" />

        <div className="fcols">
          {featureGroups.groups.map((g, i) => (
            <Reveal className={`fcol fcol--${i + 1}`} delay={i * 70} key={g.id}>
              <div onMouseLeave={leaveColumn}>
                <header className="fcol__head">
                  <span className="fcol__n">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <h3 className="fcol__title" id={`fcol-${g.id}`}>
                      {t(`featureGroups.groups.${i}.title`, g.title)}
                    </h3>
                    {/* The requirement, not the marketing label: this is the
                        line that tells a visitor whether they can start. */}
                    <span className="fcol__need">{t(`featureGroups.groups.${i}.need`, g.need)}</span>
                  </span>
                </header>

                <ul className="fcol__list" aria-labelledby={`fcol-${g.id}`}>
                  {g.items.map((item, j) => {
                    const key = `${i}:${j}`;
                    const isOpen = open === key;
                    return (
                      <li className={`frow${isOpen ? " is-open" : ""}`} key={item.title}>
                        <button
                          type="button"
                          className="frow__btn"
                          aria-expanded={isOpen}
                          aria-controls={`frow-${i}-${j}`}
                          onMouseEnter={() => enter(key)}
                          /* Keyboard focus opens the row. A TAP also focuses,
                             and without the :focus-visible guard that open
                             was immediately toggled shut again by the click
                             that followed — the row never opened on a phone. */
                          onFocus={(e) => {
                            if (e.currentTarget.matches(":focus-visible")) setOpen(key);
                          }}
                          onClick={() => setOpen(isOpen ? null : key)}
                        >
                          <span className="frow__icon">
                            <Icon name={item.icon} />
                          </span>
                          <span className="frow__title">
                            {t(`featureGroups.groups.${i}.items.${j}.title`, item.title)}
                          </span>
                          <span className="frow__sign" aria-hidden="true">
                            <Icon name="plus" />
                          </span>
                        </button>

                        {/* Always rendered, so the text is in the HTML for a
                            crawler and for search inside the page; the height
                            is what animates. */}
                        <div className="frow__body" id={`frow-${i}-${j}`}>
                          <p className="frow__text">
                            {t(`featureGroups.groups.${i}.items.${j}.text`, item.text)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <p className="fcol__count">
                  {g.items.length} {t("featureGroups.countWord", featureGroups.countWord)}
                </p>

                {/* Kept from the old layout on purpose. Group 02's note is
                    where the page says device readings are marked measured
                    and never mixed with regional estimates, which is a claim
                    the project holds itself to rather than decoration. */}
                <p className="fcol__note">{t(`featureGroups.groups.${i}.note`, g.note)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
