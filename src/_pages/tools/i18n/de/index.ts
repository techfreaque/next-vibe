import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "KI-Werkzeuge",
  backToChat: "Zurück zum Chat",
  description:
    "Verwalte, welche Werkzeuge der KI zur Verfügung stehen. Pinne Werkzeuge an, um sie immer im Kontext zu haben.",
  openFullPage: "Vollständige Seite öffnen",
  modal: {
    title: "KI-Werkzeuge",
    description:
      "Verwalte, welche Werkzeuge der KI zur Verfügung stehen. Pinne Werkzeuge an, um sie immer im Kontext zu haben.",
  },
  widget: {
    tools: "Werkzeuge",
    overrideForSlot: "Werkzeugregeln für diesen Slot überschreiben",
    inheritedDefaults:
      "Gerade gelten die geerbten Standards. Aktiviere das hier für eigene Regeln.",
    customToolsConfigured:
      "Für diesen Slot sind eigene Werkzeuge konfiguriert.",
    deselectAll: "Alle abwählen",
    selectAll: "Alle auswählen",
    reset: "Zurücksetzen",
    pinnedToContext: "im Kontext angepinnt",
    requiresConfirmation: "braucht Bestätigung",
    loadingTools: "Werkzeuge werden geladen...",
  },
};
