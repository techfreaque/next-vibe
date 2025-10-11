import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Sprawdź dostępność konsultacji",
  description: "Pobierz dostępne terminy do planowania konsultacji",
  category: "Dostępność Konsultacji",
  tag: "Dostępność",

  form: {
    title: "Parametry sprawdzania dostępności",
    description:
      "Określ zakres dat i parametry, aby sprawdzić dostępne terminy konsultacji",
  },

  startDate: {
    label: "Data początkowa",
    description: "Data początkowa sprawdzania dostępności",
    placeholder: "Wybierz datę początkową",
  },

  endDate: {
    label: "Data końcowa",
    description: "Data końcowa sprawdzania dostępności",
    placeholder: "Wybierz datę końcową",
  },

  slotDuration: {
    label: "Czas trwania slotu (minuty)",
    description: "Czas trwania każdego slotu konsultacji w minutach",
    placeholder: "60",
  },

  response: {
    slotsArray: "Dostępne terminy",
    slots: {
      title: "Termin",
      description: "Dostępny termin konsultacji",
      start: "Czas rozpoczęcia",
      end: "Czas zakończenia",
      available: "Dostępny",
    },
    timezone: "Strefa czasowa",
  },

  success: {
    title: "Dostępność pobrana",
    description: "Pomyślnie pobrano dostępne terminy konsultacji",
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Podane parametry są nieprawidłowe",
      message: "Proszę podać prawidłowe parametry daty i czasu",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do sprawdzania dostępności konsultacji",
    },
    server: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas sprawdzania dostępności",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    network: {
      title: "Błąd sieci",
      description: "Nie udało się połączyć z serwerem",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp do tego zasobu jest zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które zostaną utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt z aktualnym stanem",
    },
  },
};
