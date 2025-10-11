import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista kont SMTP",
  description: "Pobierz paginowaną listę kont SMTP z opcjami filtrowania",

  errors: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagane uprawnienia administratora do listy kont SMTP",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry filtrowania",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się pobrać kont SMTP",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
  },

  success: {
    title: "Konta SMTP pobrane",
    description: "Pomyślnie pobrano listę kont SMTP",
  },
};
