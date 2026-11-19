import { useI18n } from "../i18n";

type Props = {
  num?: string;
  eyebrow: string;
  title: string;
  accent?: string;
  sub?: string;
  center?: boolean;
  display?: boolean;
  /** Content path, e.g. "problems" - leaves are looked up under it. */
  keyBase?: string;
};

/** The numbered eyebrow + heading + standfirst that opens every section. */
export default function SectionHead({
  num,
  eyebrow,
  title,
  accent,
  sub,
  center = true,
  display = false,
  keyBase,
}: Props) {
  const { t } = useI18n();
  const k = (field: string, value: string) => (keyBase ? t(`${keyBase}.${field}`, value) : value);

  return (
    <div className={`section-head${center ? " section-head--center" : ""}`}>
      <span className="eyebrow">
        {num ? <span className="eyebrow__num">{num}</span> : null}
        <span>{k("eyebrow", eyebrow)}</span>
      </span>
      <h2 className={`section-title${display ? " section-title--display" : ""}`}>
        <span>{k("title", title)}</span>
        {accent ? <> <span className="accent">{k("accent", accent)}</span></> : null}
      </h2>
      {sub ? <p className="section-sub">{k("sub", sub)}</p> : null}
    </div>
  );
}
