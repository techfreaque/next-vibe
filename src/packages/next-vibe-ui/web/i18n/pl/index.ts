import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    accessibility: {
      srOnly: {
        more: "Więcej",
        previousSlide: "Poprzedni slajd",
        nextSlide: "Następny slajd",
        previousPage: "Poprzednia strona",
        nextPage: "Następna strona",
        close: "Zamknij",
      },
    },
    actions: {
      previous: "Poprzedni",
      next: "Następny",
    },
    addTags: "Dodaj tagi",
    addCustomValue: "Dodaj '{{value}}'",
    required: "Wymagane",
    enterPhoneNumber: "Wprowadź numer telefonu",
    unknownFieldType: "Nieznany typ pola",
    selectDate: "Wybierz datę",
    other: "Inne",
  },
  ui: {
    markdown: {
      reasoningProcess: "Proces rozumowania",
      streaming: "(strumieniowanie...)",
      copied: "Skopiowano!",
      copy: "Kopiuj",
      copyCode: "Kopiuj kod",
    },
  },
};
