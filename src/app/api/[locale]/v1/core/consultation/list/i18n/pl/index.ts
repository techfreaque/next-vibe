/**
 * Consultation List endpoint translations for Polish
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista konsultacji",
  description: "Pobierz listę konsultacji z filtrowaniem i paginacją",
  category: "Konsultacje",

  form: {
    title: "Filtry konsultacji",
    description: "Skonfiguruj filtry, aby znaleźć określone konsultacje",
  },

  search: {
    label: "Szukaj",
    description:
      "Przeszukaj konsultacje według treści wiadomości lub szczegółów",
    placeholder: "Wprowadź wyszukiwane terminy...",
  },

  userId: {
    label: "ID użytkownika",
    description: "Filtruj konsultacje według określonego ID użytkownika",
    placeholder: "Wprowadź ID użytkownika...",
  },

  status: {
    label: "Status",
    description: "Filtruj według statusu konsultacji (wielokrotny wybór)",
    placeholder: "Wybierz status(y)...",
  },

  dateFrom: {
    label: "Data od",
    description: "Data początkowa dla filtru zakresu dat konsultacji",
    placeholder: "Wybierz datę początkową...",
  },

  dateTo: {
    label: "Data do",
    description: "Data końcowa dla filtru zakresu dat konsultacji",
    placeholder: "Wybierz datę końcową...",
  },

  sortBy: {
    label: "Sortuj według",
    description: "Wybierz pola do sortowania (wielokrotny wybór)",
    placeholder: "Wybierz pole(a) sortowania...",
  },

  sortOrder: {
    label: "Kolejność sortowania",
    description: "Wybierz kierunek sortowania (wielokrotny wybór)",
    placeholder: "Wybierz kolejność sortowania...",
  },

  limit: {
    label: "Limit",
    description: "Maksymalna liczba konsultacji do zwrócenia",
    placeholder: "Wprowadź limit...",
  },

  offset: {
    label: "Przesunięcie",
    description: "Liczba konsultacji do pominięcia",
    placeholder: "Wprowadź przesunięcie...",
  },

  columns: {
    id: "ID",
    userId: "ID użytkownika",
    status: "Status",
  },

  item: {
    title: "Element konsultacji",
    description: "Szczegóły pojedynczej konsultacji",
    id: "ID konsultacji",
    userId: "ID użytkownika",
    preferredDate: "Preferowana data",
    preferredTime: "Preferowany czas",
    status: "Status",
    createdAt: "Utworzono",
    updatedAt: "Zaktualizowano",
  },

  total: {
    title: "Konsultacje łącznie",
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Parametry filtra są niepoprawne",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono konsultacji z określonymi filtrami",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Musisz być zalogowany, aby wyświetlić listę konsultacji",
    },
    forbidden: {
      title: "Dostęp zabroniony",
      description: "Nie masz uprawnień do przeglądania tych konsultacji",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas pobierania konsultacji",
    },
    network: {
      title: "Błąd sieci",
      description:
        "Nie można połączyć się z serwerem. Sprawdź połączenie internetowe",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description:
        "Masz niezapisane zmiany filtrów, które zostaną utracone, jeśli będziesz kontynuować",
    },
    conflict: {
      title: "Konflikt",
      description: "Występuje konflikt z aktualnymi filtrami konsultacji",
    },
  },

  success: {
    title: "Konsultacje pobrane",
    description: "Pomyślnie pobrano listę konsultacji",
  },
};
