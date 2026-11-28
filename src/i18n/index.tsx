import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import * as EN from "../data/content";
import { si } from "./si";
import { ta } from "./ta";

export type LangCode = "en" | "si" | "ta";

export const LANGUAGES: {
  code: LangCode;
  label: string;
  native: string;
  short: string;
}[] = [
  { code: "en", label: "English", native: "English", short: "EN" },
  { code: "si", label: "Sinhala", native: "සිංහල", short: "සිං" },
  { code: "ta", label: "Tamil", native: "தமிழ்", short: "த" },
];

//languages currently available only will be shown and others will be hidden from user for now
export const AVAILABLE = LANGUAGES.filter(
  (l) => l.code === "en" || l.code === "si",
);

const DICTS: Record<LangCode, unknown> = { en: null, si, ta };
const STORAGE_KEY = "aswenna.lang";

/** Reads "a.b.0.c" out of a nested object. */
function get(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc == null ? undefined : (acc as Record<string, unknown>)[key],
      obj,
    );
}

type Ctx = {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  /** English is the base: a translation only has to fill in what it covers. */
  t: (key: string, fallback?: string) => string;
};

const LanguageContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (key, fallback) => fallback ?? key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  // Read the stored choice after mount, so the markup is identical on first paint.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
      if (stored && stored in DICTS) setLangState(stored);
    } catch {
      /* private mode: stay on English */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = "ltr";
  }, [lang]);

  const setLang = useCallback((next: LangCode) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* not worth failing over */
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => {
      const translated = lang === "en" ? undefined : get(DICTS[lang], key);
      if (typeof translated === "string") return translated;
      const base = get(EN, key);
      if (typeof base === "string") return base;
      return fallback ?? "";
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/** `const { t } = useI18n()` - every content string goes through this. */
export const useI18n = () => useContext(LanguageContext);
