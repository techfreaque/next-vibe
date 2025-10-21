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
  },
  ui: {
    markdown: {
      reasoningProcess: "Denkprozess",
      streaming: "(streaming...)",
      copied: "Kopiert!",
      copy: "Kopieren",
      copyCode: "Code kopieren",
    },
  },
};
