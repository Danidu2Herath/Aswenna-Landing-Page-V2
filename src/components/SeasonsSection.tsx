import { useRef, useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { seasons } from "../data/content";
import { useI18n } from "../i18n";
import { useMediaQuery } from "../hooks";

/**
 * The four stages of a season, as rows that open one at a time.
 *
 * On a fine pointer the row under the cursor opens and the others close —
 * no clicking. The open row carries its own photograph, which is what makes
 * the pattern worth having over four flat cards.
 *
 * Hover does not exist on a touch screen, so there it is a tap. And hover is
 * held for a moment before it commits: without that, dragging the pointer
 * across the stack flickers through every row on the way.
 */
const HOVER_DELAY = 110;

export default function SeasonsSection() {
  const { t } = useI18n();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [open, setOpen] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const hover = (i: number) => {
    if (!canHover) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(i), HOVER_DELAY);
  };
  const leave = () => window.clearTimeout(timer.current);

  return (
    <section className="section" id="seasons">
      <div className="container">
        <SectionHead {...seasons} center={false} keyBase="seasons" />

        <div className="stages" onMouseLeave={leave}>
          {seasons.stages.map((s, i) => {
            const isOpen = i === open;
            return (
              <Reveal delay={i * 60} key={s.title}>
                <div
                  className={`stage${isOpen ? " is-open" : ""}`}
                  onMouseEnter={() => hover(i)}
                >
                  {isOpen ? (
                    <>
                      <img className="stage__photo" src={s.photo} alt="" aria-hidden="true" loading="lazy" />
                      <span className="stage__veil" aria-hidden="true" />
                    </>
                  ) : null}

                  <h3>
                    <button
                      type="button"
                      className="stage__btn"
                      aria-expanded={isOpen}
                      aria-controls={`stage-${i}`}
                      onClick={() => setOpen(isOpen && !canHover ? -1 : i)}
                    >
                      <span className="stage__n">{String(i + 1).padStart(2, "0")}</span>
                      <span className="stage__title">{t(`seasons.stages.${i}.title`, s.title)}</span>
                      <span className="stage__when">{t(`seasons.stages.${i}.when`, s.when)}</span>
                      <span className="stage__sign" aria-hidden="true">
                        <Icon name={isOpen ? "minus" : "plus"} />
                      </span>
                    </button>
                  </h3>

                  <div className="stage__body" id={`stage-${i}`} hidden={!isOpen}>
                    <p className="stage__text">{t(`seasons.stages.${i}.text`, s.text)}</p>
                    <div className="stage__does">
                      <strong>{t(`seasons.stages.${i}.callout.label`, s.callout.label)}</strong>
                      <span>{t(`seasons.stages.${i}.callout.text`, s.callout.text)}</span>
                      <a className="stage__link" href={s.href}>
                        {s.link}
                        <Icon name="arrow-right" />
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
