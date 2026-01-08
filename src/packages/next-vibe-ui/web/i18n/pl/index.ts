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
    searchCountries: "Wyszukaj kraje...",
    noCountryFound: "Nie znaleziono kraju",
    preferred: "Preferowane",
    allCountries: "Wszystkie kraje",
  },
  ui: {
    markdown: {
      thinking: "Myślenie",
      reasoningProcess: "Proces rozumowania",
      streaming: "(strumieniowanie...)",
      copied: "Skopiowano!",
      copy: "Kopiuj",
      copyCode: "Kopiuj kod",
    },
    multiSelect: {
      placeholder: "Wybierz elementy...",
      noResultsFound: "Nie znaleziono wyników",
    },
    iconPicker: {
      categories: {
        all: "Wszystkie ikony",
        general: "Ogólne",
        ai: "AI i Technologia",
        education: "Edukacja",
        communication: "Komunikacja",
        science: "Nauka",
        arts: "Sztuka i Media",
        finance: "Finanse",
        lifestyle: "Styl życia",
        security: "Bezpieczeństwo",
        programming: "Programowanie",
        platforms: "Platformy",
        ai_providers: "Dostawcy AI",
        media: "Media",
        special: "Specjalne",
      },
    },
  },
};
