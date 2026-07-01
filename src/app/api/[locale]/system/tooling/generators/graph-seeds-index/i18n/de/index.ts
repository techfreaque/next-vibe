import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatoren",

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Validierung der Graph-Seeds-Datei fehlgeschlagen",
    },
    internal: {
      title: "Interner Fehler",
      description: "Bei der Generierung ist ein interner Fehler aufgetreten",
    },
  },
};
