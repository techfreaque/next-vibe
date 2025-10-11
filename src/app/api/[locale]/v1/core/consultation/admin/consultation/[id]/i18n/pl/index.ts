import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie konsultacjami",
  tag: "konsultacja",

  get: {
    title: "Pobierz konsultację",
    description: "Pobierz konsultację według ID",
    category: "Zarządzanie konsultacjami",
    tag: "konsultacja",
    container: {
      title: "Szczegóły konsultacji",
      description: "Wyświetl informacje i szczegóły konsultacji",
    },
    form: {
      title: "Konfiguracja pobierania konsultacji",
      description: "Skonfiguruj parametry pobierania konsultacji",
    },
    id: {
      label: "ID konsultacji",
      description: "Unikalny identyfikator konsultacji",
    },
    userId: {
      label: "ID użytkownika",
      description: "ID użytkownika, który zarezerwował konsultację",
    },
    leadId: {
      label: "ID leada",
      description: "Powiązane ID leada dla tej konsultacji",
    },
    status: {
      label: "Status",
      description: "Aktualny status konsultacji",
    },
    message: {
      label: "Wiadomość",
      description: "Wiadomość konsultacji lub notatki",
    },
    userEmail: {
      label: "E-mail użytkownika",
      description: "Adres e-mail uczestnika konsultacji",
    },
    userName: {
      label: "Nazwa użytkownika",
      description: "Imię uczestnika konsultacji",
    },
    userBusinessType: {
      label: "Typ działalności",
      description: "Rodzaj działalności prowadzonej przez użytkownika",
    },
    userContactPhone: {
      label: "Telefon kontaktowy",
      description: "Numer telefonu do kontaktu w sprawie konsultacji",
    },
    preferredDate: {
      label: "Preferowana data",
      description: "Preferowana przez użytkownika data konsultacji",
    },
    preferredTime: {
      label: "Preferowana godzina",
      description: "Preferowana przez użytkownika godzina konsultacji",
    },
    scheduledDate: {
      label: "Zaplanowana data",
      description: "Rzeczywista zaplanowana data konsultacji",
    },
    scheduledTime: {
      label: "Zaplanowana godzina",
      description: "Rzeczywista zaplanowana godzina konsultacji",
    },
    calendarEventId: {
      label: "ID wydarzenia kalendarza",
      description: "Identyfikator wydarzenia w systemie kalendarza",
    },
    meetingLink: {
      label: "Link do spotkania",
      description: "URL spotkania online dla konsultacji",
    },
    icsAttachment: {
      label: "Załącznik ICS",
      description: "Dane załącznika pliku kalendarza",
    },
    isNotified: {
      label: "Powiadomienie wysłane",
      description: "Czy powiadomienie zostało wysłane do uczestnika",
    },
    createdAt: {
      label: "Utworzono",
      description: "Data i godzina utworzenia konsultacji",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi konsultacji",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany, które zostaną utracone",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  patch: {
    title: "Aktualizuj konsultację",
    description: "Aktualizuj konsultację według ID",
    category: "Zarządzanie konsultacjami",
    tag: "konsultacja",
    container: {
      title: "Aktualizuj konsultację",
      description: "Zmodyfikuj szczegóły i status konsultacji",
    },
    form: {
      title: "Konfiguracja aktualizacji konsultacji",
      description: "Skonfiguruj parametry aktualizacji konsultacji",
    },
    id: {
      label: "ID konsultacji",
      description: "Unikalny identyfikator konsultacji",
      placeholder: "Wprowadź ID konsultacji",
    },
    status: {
      label: "Status",
      description: "Aktualny status konsultacji",
      placeholder: "Wybierz status konsultacji",
    },
    scheduledDate: {
      label: "Zaplanowana data",
      description: "Data i godzina zaplanowanej konsultacji",
      placeholder: "Wybierz zaplanowaną datę i godzinę",
    },
    scheduledTime: {
      label: "Zaplanowana godzina",
      description: "Godzina zaplanowanej konsultacji",
      placeholder: "Wybierz zaplanowaną godzinę",
    },
    calendarEventId: {
      label: "ID wydarzenia kalendarza",
      description: "Identyfikator wydarzenia w systemie kalendarza",
      placeholder: "Wprowadź ID wydarzenia kalendarza",
    },
    meetingLink: {
      label: "Link do spotkania",
      description: "URL spotkania online dla konsultacji",
      placeholder: "Wprowadź URL linku do spotkania",
    },
    icsAttachment: {
      label: "Załącznik ICS",
      description: "Dane załącznika pliku kalendarza",
      placeholder: "Wprowadź dane załącznika ICS",
    },
    isNotified: {
      label: "Powiadomienie wysłane",
      description: "Czy powiadomienie zostało wysłane do uczestnika",
    },
    message: {
      label: "Wiadomość",
      description: "Wiadomość konsultacji lub notatki",
      placeholder: "Wprowadź wiadomość konsultacji",
    },
    userId: {
      label: "ID użytkownika",
      description: "ID użytkownika, który zarezerwował konsultację",
    },
    leadId: {
      label: "ID leada",
      description: "Powiązane ID leada dla tej konsultacji",
    },
    userEmail: {
      label: "E-mail użytkownika",
      description: "Adres e-mail uczestnika konsultacji",
    },
    userName: {
      label: "Nazwa użytkownika",
      description: "Imię uczestnika konsultacji",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi zaktualizowanej konsultacji",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany, które zostaną utracone",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
