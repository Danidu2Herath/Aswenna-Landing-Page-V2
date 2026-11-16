/**
 * One icon from the generated sprite at /images/icons.svg.
 * The sprite is built by scripts/build-icons.mjs from lucide's real geometry,
 * so the whole set costs one cached request instead of a component per glyph.
 */
export default function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg className={`icon${className ? ` ${className}` : ""}`} aria-hidden="true">
      <use href={`/images/icons.svg#i-${name}`} />
    </svg>
  );
}
