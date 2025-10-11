import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  consultations: {
    nav: {
      stats: "Statystyki",
      list: "Widok listy",
      calendar: "Widok kalendarza",
    },
    admin: {
      title: "Konsultacje",
      description: "Zarządzaj konsultacjami i spotkaniami",
      stats: {
        title: "Statystyki konsultacji",
        totalConsultations: "Łączne konsultacje",
        schedulingRate: "Wskaźnik planowania",
        completionRate: "Wskaźnik ukończenia",
        consultationsThisMonth: "W tym miesiącu",
        consultationsByStatus: "Konsultacje według statusu",
        businessTypeStats: "Rozkład typów działalności",
        conversionStats: "Statystyki konwersji",
        averageResponseTime: "Średni czas odpowiedzi",
        requestToScheduled: "Od zapytania do zaplanowania",
        scheduledToCompleted: "Od zaplanowania do ukończenia",
        cancellationRate: "Wskaźnik anulowania",
        noShowRate: "Wskaźnik niestawienia się",
        pending: "Oczekujące",
        hours: "godz.",
      },
      list: {
        title: "Lista konsultacji",
        table: {
          loading: "Ładowanie konsultacji...",
          noResults: "Nie znaleziono konsultacji",
          user: "Użytkownik",
          status: "Status",
          businessType: "Typ działalności",
          preferredDate: "Preferowana data",
          scheduledDate: "Zaplanowana data",
          message: "Wiadomość",
          createdAt: "Utworzono",
          actions: "Akcje",
        },
        pagination: {
          previous: "Poprzednia",
          next: "Następna",
        },
      },
      calendar: {
        title: "Kalendarz konsultacji",
      },
      create: {
        title: "Utwórz nową konsultację",
        description: "Zaplanuj nowe spotkanie konsultacyjne",
      },
      actions: {
        createNew: "Utwórz nową",
        back: "Wstecz",
        cancel: "Anuluj",
        create: "Utwórz konsultację",
        creating: "Tworzenie...",
      },
      form: {
        selection: {
          title: "Metoda wyboru",
        },
        selectionType: {
          label: "Jak chcesz utworzyć tę konsultację?",
          new: "Nowy użytkownik/potencjalny klient",
          user: "Istniejący użytkownik",
          lead: "Istniejący potencjalny klient",
        },
        contact: {
          title: "Informacje kontaktowe",
        },
        business: {
          title: "Informacje o firmie",
        },
        name: {
          label: "Pełne imię i nazwisko",
        },
        email: {
          label: "Adres e-mail",
        },
        phone: {
          label: "Numer telefonu",
        },
        businessType: {
          label: "Typ działalności",
        },
        status: {
          label: "Status",
        },
        message: {
          label: "Wiadomość",
        },
        preferredDate: {
          label: "Preferowana data",
        },
        preferredTime: {
          label: "Preferowany czas",
        },
        scheduledDate: {
          label: "Zaplanowana data",
        },
        scheduledTime: {
          label: "Zaplanowany czas",
        },
        calendarEventId: {
          label: "ID wydarzenia kalendarza",
        },
        meetingLink: {
          label: "Link do spotkania",
        },
        icsAttachment: {
          label: "Załącznik ICS",
        },
        isNotified: {
          label: "Jest powiadomiony",
        },
        createdAt: {
          label: "Utworzono",
        },
        city: {
          placeholder: "Wprowadź miasto",
        },
        userSelect: {
          label: "Wybierz użytkownika",
          placeholder: "Szukaj użytkownika...",
        },
        leadSelect: {
          label: "Wybierz potencjalnego klienta",
          placeholder: "Szukaj potencjalnego klienta...",
        },
        search: {
          noResults: "Nie znaleziono wyników",
        },
      },
      error: {
        title: "Błąd",
        description: "Wystąpił błąd podczas przetwarzania konsultacji",
      },
      selectors: {
        clearSelection: "Wyczyść wybór",
        moreResults: "Załaduj więcej wyników",
      },
      emailPreview: {
        title: "Podgląd e-maila",
        preview: "Podgląd e-maila",
        collapse: "Zwiń",
        to: "Do:",
        subject: "Temat:",
        content: "Treść:",
        note: "Uwaga: To jest podgląd e-maila, który zostanie wysłany.",
        subjectPrefix: "Temat zostanie poprzedzony prefiksem:",
        defaultFirstName: "Jan",
        defaultLastName: "Kowalski",
        defaultCompany: "Przykładowa Firma",
        defaultEmail: "jan.kowalski@przykład.pl",
      },
      messageInput: {
        title: "Wiadomość konsultacyjna",
        customize: "Dostosuj wiadomość",
        collapse: "Zwiń",
        messagePreview: "Podgląd wiadomości",
        placeholder: "Wprowadź wiadomość konsultacyjną...",
        helpText: "Ta wiadomość zostanie dołączona do e-maila konsultacyjnego.",
        resetToDefault: "Zresetuj do domyślnej",
        defaultChallenges: "Wyzwania marketingu w mediach społecznościowych",
        defaultGoals: "Zwiększenie świadomości marki i zaangażowania",
      },
      errors: {
        unknown: {
          description: "Wystąpił nieznany błąd",
        },
      },
    },
  },
  consultation: {
    title: "Konsultacja",
    email: {
      noScheduledDate: "Brak dostępnej zaplanowanej daty",
      subject: "Potwierdzenie konsultacji",
    },
  },
  common: {
    loading: "Ładowanie...",
  },
  leads: {
    admin: {
      actions: {
        refresh: "Odśwież",
      },
    },
    search: {
      placeholder: "Szukaj potencjalnych klientów...",
    },
  },
};
