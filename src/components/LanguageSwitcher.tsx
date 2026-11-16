import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { LANGUAGES, useI18n } from "../i18n";
import { ui } from "../data/content";

/** The globe menu in the header. */
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`lang${open ? " is-open" : ""}`} ref={wrap}>
      <button
        type="button"
        className="lang__button"
        ref={button}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t("ui.language", ui.language)}: ${current.label}`}
        title={t("ui.chooseLanguage", ui.chooseLanguage)}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="globe" />
        <span className="lang__code" lang={current.code}>
          {current.short}
        </span>
        <Icon name="chevron-down" className="lang__chev" />
      </button>

      <ul className="lang__list" role="listbox" hidden={!open}>
        {LANGUAGES.map((l) => (
          <li role="none" key={l.code}>
            <button
              type="button"
              role="option"
              className={`lang__option${l.code === lang ? " is-active" : ""}`}
              lang={l.code}
              aria-selected={l.code === lang}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
                button.current?.focus();
              }}
            >
              <span>{l.native}</span>
              <Icon name="check" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
