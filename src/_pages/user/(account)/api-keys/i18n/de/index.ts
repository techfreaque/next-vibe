import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "API-Schlüssel",
  metaTitle: "API-Schlüssel - {{appName}}",
  description:
    "Ein Schlüssel, {{modelCount}} Modelle. OpenAI- und Anthropic-Format, abgerechnet über deine Credits.",
  unauthenticated: {
    title: "Melde dich an, um deine API-Schlüssel zu verwalten",
    subtitle:
      "Schlüssel gehören zu deinem Konto. Anmelden, beliebigen Plan ab {{subPrice}} im Monat wählen, und der erste Schlüssel steht in Sekunden.",
    point1: "{{modelCount}} Modelle hinter einem OpenAI-kompatiblen Endpunkt",
    point2: "Läuft in Claude Code, Codex, OpenCode, Cline und jedem OpenAI-SDK",
    point3: "Gleicher Preis wie im Chat. Keine separate API-Rechnung.",
    logIn: "Anmelden",
    signUp: "Konto erstellen",
    docs: "Erst die API-Doku lesen",
  },
};
