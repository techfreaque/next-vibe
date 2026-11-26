import {
  type CountryLanguage,
  CountryLanguageValues,
  defaultLocale,
} from "../../../core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "../../../core/i18n/core/language-utils";
import { scopedTranslation } from "../../../identity/middleware/lead-id/i18n";

export function isToolsDocument(
  request: Pick<Request, "method" | "headers">,
  pathname: string,
): boolean {
  return (
    /^(?:\/(?:[a-z]{2}-[a-z]+))?\/tools(?:\/|$)/i.test(pathname) &&
    (request.method === "GET" || request.method === "HEAD") &&
    !request.headers.has("rsc") &&
    !request.headers.has("x-tsr-serverfn") &&
    !!request.headers.get("accept")?.includes("text/html")
  );
}

export function toolsDocumentLocale(pathname: string): CountryLanguage {
  const requested = pathname.split("/")[1];
  return (
    Object.values(CountryLanguageValues).find(
      (locale) => locale === requested,
    ) ?? defaultLocale
  );
}

export const toolsDocumentHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "text/html; charset=utf-8",
  "Content-Security-Policy":
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
};

/** A navigation failure can precede every app asset, including its style sheet. */
export function toolsDocumentHtml(locale: CountryLanguage): string {
  const { t } = scopedTranslation.scopedT(locale);
  const { language } = getLanguageAndCountryFromLocale(locale);
  const title = t("toolsUnavailable.title");
  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>
:root {
  color-scheme: light dark;
  font: 100%/1.5 "Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif;
  --background: #f7f8fb;
  --foreground: #141a2b;
  --card: #fff;
  --muted-foreground: #5f6779;
  --border: #dfe3eb;
  --primary: #2251e0;
}
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0c0f17;
    --foreground: #eef1f7;
    --card: #121723;
    --muted-foreground: #949db0;
    --border: #252d3f;
    --primary: #3565e9;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0;
  padding: clamp(1rem, 5vw, 3rem);
  background: var(--background);
  color: var(--foreground);
}
main {
  max-width: 35rem;
  margin: clamp(2rem, 12vh, 7rem) auto;
  padding: clamp(1.25rem, 5vw, 2.5rem);
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: var(--card);
  overflow-wrap: anywhere;
}
h1 { font-size: clamp(1.4rem, 5vw, 2rem); line-height: 1.2; margin: 0; }
p { color: var(--muted-foreground); margin: 0.75rem 0 1.5rem; }
a, a:visited {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
a:hover { filter: brightness(0.94); }
a:focus-visible { outline: 3px solid var(--primary); outline-offset: 3px; }
@media (forced-colors: active) {
  a, a:visited { border-color: ButtonText; }
  a:focus-visible { outline-color: Highlight; }
}
</style></head><body><main><h1>${title}</h1><p>${t("toolsUnavailable.description")}</p><a href="">${t("toolsUnavailable.reload")}</a></main></body></html>`;
}
