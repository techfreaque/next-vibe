// oxlint-disable-next-line oxlint-plugin-boilerplate/i18n-pattern
import { translations as modelTranslations } from "../../../../models/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Endpunkt auswählen...",
    searchEndpoints: "Endpunkte suchen...",
    value: "{{value}}",
    selectEndpointHint: "Endpunkt auswählen, um Parameter zu konfigurieren.",
    resolvingEndpoint: "Endpunkt wird aufgelöst...",
    preCallsDescription:
      "Tool-Aufrufe vor dem Prompt. Ergebnisse werden als Kontext eingefügt.",
    addPreCall: "Pre-Call hinzufügen",
    preCalls: "Pre-Calls",
    instructions: "Anweisungen",
    instructionsTooltip: "System-Anweisungen überschreiben",
    preCallsTooltip: "Tool-Aufrufe vor der Ausführung",
    more: "Mehr",
    moreTooltip: "Erweiterte Optionen",
    emptyState: {
      title: "Skill oder Favorit auswählen",
      description:
        "Wähle unten ein Skill oder lade einen gespeicherten Favoriten. Das Modell wird automatisch aufgelöst.",
    },
    noResponse: "Keine Antwort",
    cli: {
      submitting: "…",
      promptPrefix: "› ",
      skillPrefix: "Skill ",
      promptHint: "Enter: Senden  ·  Esc: Beenden  ·  Tab: Feld wechseln",
      promptPlaceholder: "Prompt eingeben...",
      skillLabel: "Skill: {{skill}}",
    },
  },
  models: { names: modelTranslations.names },
};
