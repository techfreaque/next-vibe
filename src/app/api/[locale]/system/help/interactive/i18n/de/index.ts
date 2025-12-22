import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Interaktiver API-Explorer",
  description:
    "Durchsuchen und testen Sie alle Endpunktdefinitionen interaktiv",
  grouping: {
    category: "Kategorie",
    tags: "Tags",
    path: "Pfad",
  },
  search: {
    placeholder: "Endpunkte suchen...",
  },
  noEndpoints: "Keine Endpunkte gefunden",
  selectEndpoint: "Wählen Sie einen Endpunkt aus, um Details anzuzeigen",
  errors: {
    cliOnly: {
      title: "Nur CLI",
    },
  },
};
