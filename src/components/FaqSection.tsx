import { useState } from "react";
import Icon from "./Icon";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { faq } from "../data/content";
import { useI18n } from "../i18n";

/** Accordion: one answer open at a time. */
export default function FaqSection() {
  const { t } = useI18n();
  const [open, setOpen] = useState(0);

  return (
    <section className="section section--alt" id="faq">
      <div className="container">
        <SectionHead {...faq} keyBase="faq" />
        <div className="faq__list">
          {faq.items.map((item, i) => (
            <Reveal delay={i * 60} key={item.q}>
              <div className={`faq__item${i === open ? " is-open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={i === open}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen((prev) => (prev === i ? -1 : i))}
                  >
                    <span>{t(`faq.items.${i}.q`, item.q)}</span>
                    <span className="faq__sign" aria-hidden="true">
                      <Icon name="plus" className="faq__plus" />
                      <Icon name="minus" className="faq__minus" />
                    </span>
                  </button>
                </h3>
                <div
                  className="faq__a"
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  hidden={i !== open}
                >
                  <p>{t(`faq.items.${i}.a`, item.a)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
