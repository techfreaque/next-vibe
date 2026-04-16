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
        "Wähle unten einen Skill oder lade einen gespeicherten Favoriten. Das Modell wird automatisch aufgelöst.",
    },
  },
};
