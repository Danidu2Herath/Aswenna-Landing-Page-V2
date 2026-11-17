/**
 * Server entry, used only by scripts/prerender.mjs at build time.
 *
 * It renders the same tree main.tsx mounts, as a string, so the HTML a
 * crawler is served already contains the content instead of an empty div.
 * The browser still mounts the real app over it; this is the paint and the
 * index, not the application.
 */
import { renderToStaticMarkup } from "react-dom/server";
import App from "./App";
import { LanguageProvider } from "./i18n";

export function render(): string {
  return renderToStaticMarkup(
    <LanguageProvider>
      <App />
    </LanguageProvider>,
  );
}
