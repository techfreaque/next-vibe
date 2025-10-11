import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie konsultacjami",
  tag: "konsultacja",

  get: {
    title: "Lista konsultacji",
    description: "Endpoint listy konsultacji admina",
    category: "Zarządzanie konsultacjami",
    tag: "konsultacja",
    container: {
      title: "Lista konsultacji",
      description: "Zarządzaj i przeglądaj konsultacje",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj konsultacji",
      placeholder: "Szukaj po nazwie, emailu...",
    },
    status: {
      label: "Status",
      description: "Filtruj według statusu",
      placeholder: "Wybierz status",
    },
    page: {
      label: "Strona",
      description: "Numer strony",
      placeholder: "Numer strony",
    },
    limit: {
      label: "Limit",
      description: "Elementy na stronę",
      placeholder: "Elementy na stronę",
    },
    sortBy: {
      label: "Sortuj według",
      description: "Pole sortowania",
      placeholder: "Sortuj według pola",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description: "Kierunek sortowania",
      placeholder: "Kierunek sortowania",
    },
    dateFrom: {
      label: "Data od",
      description: "Filtruj od daty",
      placeholder: "Od daty",
    },
    dateTo: {
      label: "Data do",
      description: "Filtruj do daty",
      placeholder: "Do daty",
    },
    userEmail: {
      label: "Email użytkownika",
      description: "Filtruj według emaila użytkownika",
      placeholder: "Email użytkownika",
    },
    columns: {
      id: "ID",
      userName: "Nazwa",
      userEmail: "Email",
      status: "Status",
      preferredDate: "Preferowana data",
      preferredTime: "Preferowany czas",
      createdAt: "Utworzono",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Wykryto niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },

    // Consultation field structure for nested references
    consultation: {
      title: "Konsultacja",
      description: "Dane indywidualnej konsultacji",
      id: "ID",
      userId: "ID użytkownika",
      leadId: "ID potencjalnego klienta",
      userName: "Nazwa użytkownika",
      userEmail: "E-mail użytkownika",
      status: "Status",
      preferredDate: "Preferowana data",
      preferredTime: "Preferowany czas",
      message: "Wiadomość",
      isNotified: "Powiadomiony",
      scheduledDate: "Zaplanowana data",
      scheduledTime: "Zaplanowany czas",
      calendarEventId: "ID wydarzenia kalendarzowego",
      meetingLink: "Link do spotkania",
      icsAttachment: "Załącznik ICS",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      userBusinessType: "Typ biznesu",
      userContactPhone: "Telefon kontaktowy",
      leadEmail: "E-mail potencjalnego klienta",
      leadBusinessName: "Nazwa firmy potencjalnego klienta",
      leadPhone: "Telefon potencjalnego klienta",
    },

    pagination: {
      title: "Paginacja",
      description: "Informacje o paginacji",
      page: "Strona",
      limit: "Limit",
      total: "Łącznie",
      totalPages: "Łączna liczba stron",
    },
  },
  response: {
    consultations: "Konsultacje",
    consultation: {
      id: "ID",
      userId: "ID użytkownika",
      leadId: "ID potencjalnego klienta",
      userName: "Nazwa użytkownika",
      userEmail: "E-mail użytkownika",
      status: "Status",
      preferredDate: "Preferowana data",
      preferredTime: "Preferowany czas",
      message: "Wiadomość",
      isNotified: "Powiadomiony",
      scheduledDate: "Zaplanowana data",
      scheduledTime: "Zaplanowany czas",
      calendarEventId: "ID wydarzenia kalendarzowego",
      meetingLink: "Link do spotkania",
      icsAttachment: "Załącznik ICS",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
      userBusinessType: "Typ biznesu",
      userContactPhone: "Telefon kontaktowy",
      leadEmail: "E-mail potencjalnego klienta",
      leadBusinessName: "Nazwa firmy potencjalnego klienta",
      leadPhone: "Telefon potencjalnego klienta",
    },
    pagination: {
      page: "Strona",
      limit: "Limit",
      total: "Łącznie",
      totalPages: "Łączna liczba stron",
    },
  },
};
