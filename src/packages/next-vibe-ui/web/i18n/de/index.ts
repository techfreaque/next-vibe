import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    accessibility: {
      srOnly: {
        more: "Mehr",
        previousSlide: "Vorherige Folie",
        nextSlide: "Nächste Folie",
        previousPage: "Vorherige Seite",
        nextPage: "Nächste Seite",
        close: "Schließen",
      },
    },
    actions: {
      previous: "Zurück",
      next: "Weiter",
    },
    addTags: "Tags hinzufügen",
    addCustomValue: "'{{value}}' hinzufügen",
    required: "Erforderlich",
    enterPhoneNumber: "Telefonnummer eingeben",
    unknownFieldType: "Unbekannter Feldtyp",
    selectDate: "Datum auswählen",
    other: "Sonstige",
    searchCountries: "Länder suchen...",
    noCountryFound: "Kein Land gefunden",
    preferred: "Bevorzugt",
    allCountries: "Alle Länder",
  },
  ui: {
    markdown: {
      thinking: "Denken",
      reasoningProcess: "Denkprozess",
      streaming: "(streaming...)",
      copied: "Kopiert!",
      copy: "Kopieren",
      copyCode: "Code kopieren",
    },
    multiSelect: {
      placeholder: "Elemente auswählen...",
      noResultsFound: "Keine Ergebnisse gefunden",
    },
  },
};
