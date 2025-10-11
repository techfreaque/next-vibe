import type { formTranslations as EnglishFormTranslations } from "../../../../../en/sections/cronErrors/pulse/trigger/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja wyzwalacza pulsu nie powiodła się",
      description: "Sprawdź parametry wyzwalacza pulsu i spróbuj ponownie",
    },
    unauthorized: {
      title: "Wyzwalacz pulsu nieautoryzowany",
      description: "Nie masz uprawnień do wyzwalania operacji pulsu",
    },
    server: {
      title: "Błąd serwera wyzwalacza pulsu",
      description: "Nie można wyzwolić pulsu z powodu błędu serwera",
    },
    unknown: {
      title: "Wyzwalacz pulsu nie powiódł się",
      description: "Wystąpił nieoczekiwany błąd podczas wyzwalania pulsu",
    },
  },
  success: {
    title: "Puls wyzwolony pomyślnie",
    description: "Wykonanie pulsu zostało pomyślnie wyzwolone",
  },
};
