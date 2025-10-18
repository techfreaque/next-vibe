import type { translations as EnglishSearchTranslations } from "../../en/user/search";

export const translations: typeof EnglishSearchTranslations = {
  error: {
    validation: {
      title: "Błąd walidacji",
      description: "Proszę sprawdzić wprowadzone dane i spróbować ponownie.",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do wykonania tej akcji.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd serwera. Proszę spróbować ponownie później.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd.",
    },
  },
  success: {
    title: "Wyszukiwanie zakończone sukcesem",
    description: "Użytkownicy zostali pomyślnie znalezieni.",
  },
};
