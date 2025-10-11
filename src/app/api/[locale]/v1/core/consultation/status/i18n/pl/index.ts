import type { translations as enTranslations } from "../en";

/**
*

* Consultation Status subdomain translations for Polish
*/

export const translations: typeof enTranslations = {
  title: "Pobierz status konsultacji",
  description: "Pobierz aktualny status Twojej rezerwacji konsultacji",
  category: "Konsultacja",
  tag: "Status",
  container: {
    title: "Status konsultacji",
    description: "Zobacz status rezerwacji konsultacji i szczegóły",
  },
  response: {
    title: "Szczegóły statusu",
    description: "Aktualne informacje o statusie konsultacji",
    isScheduled: "Czy zaplanowana",
    scheduledAt: "Zaplanowana na",
    consultant: "Konsultant",
    status: "Status",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Parametry żądania są nieprawidłowe",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono konsultacji dla Twojego konta",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Musisz być zalogowany, aby sprawdzić status konsultacji",
    },
    forbidden: {
      title: "Odmowa dostępu",
      description: "Nie masz uprawnień do wyświetlenia tej konsultacji",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas pobierania statusu konsultacji",
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
        "Masz niezapisane zmiany, które zostaną utracone, jeśli będziesz kontynuować",
    },
    conflict: {
      title: "Konflikt",
      description: "Występuje konflikt z aktualnym stanem konsultacji",
    },
    internal: {
      title: "Wewnętrzny błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas przetwarzania Twojego żądania",
    },
    database: {
      title: "Błąd bazy danych",
      description: "Nie udało się pobrać danych konsultacji z bazy danych",
    },
  },
  success: {
    title: "Status pobrany",
    description: "Pomyślnie pobrano status Twojej konsultacji",
  },
};
