import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Szczegóły e-maila",
  description:
    "Pobierz pojedynczy email na podstawie jego unikalnego identyfikatora",
  container: {
    title: "Szczegóły emaila",
    description: "Zobacz szczegółowe informacje o konkretnym emailu",
  },
  fields: {
    id: {
      label: "ID emaila",
      description: "Unikalny identyfikator emaila do pobrania",
    },
  },
  response: {
    email: {
      title: "Szczegóły emaila",
      description: "Kompletne informacje o żądanym emailu",
      id: "ID emaila",
      subject: "Temat",
      recipientEmail: "Email odbiorcy",
      recipientName: "Nazwa odbiorcy",
      senderEmail: "Email nadawcy",
      senderName: "Nazwa nadawcy",
      type: "Typ emaila",
      status: "Status",
      templateName: "Nazwa szablonu",
      emailProvider: "Dostawca emaila",
      externalId: "Zewnętrzne ID",
      sentAt: "Wysłano o",
      deliveredAt: "Dostarczono o",
      openedAt: "Otwarto o",
      clickedAt: "Kliknięto o",
      retryCount: "Liczba ponowień",
      error: "Komunikat błędu",
      userId: "ID użytkownika",
      leadId: "ID leada",
      createdAt: "Utworzono o",
      updatedAt: "Zaktualizowano o",
    },
  },
  get: {
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID emaila jest nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description:
          "Musisz być uwierzytelniony, aby zobaczyć szczegóły emaila",
      },
      not_found: {
        title: "Email nie znaleziony",
        description: "Nie znaleziono emaila o podanym ID",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do wyświetlenia tego emaila",
      },
      server: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas pobierania emaila",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
    },
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Podane ID emaila jest nieprawidłowe",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Musisz być uwierzytelniony, aby zobaczyć szczegóły emaila",
    },
    notFound: {
      title: "Email nie znaleziony",
      description: "Nie znaleziono emaila o podanym ID",
    },
    forbidden: {
      title: "Zabronione",
      description: "Nie masz uprawnień do wyświetlenia tego emaila",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas pobierania emaila",
    },
    conflict: {
      title: "Błąd konfliktu",
      description: "Wystąpił konflikt podczas przetwarzania żądania emaila",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas pobierania emaila",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Istnieją niezapisane zmiany",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
  },
  success: {
    title: "Email pobrany",
    description: "Szczegóły emaila zostały pomyślnie pobrane",
  },
  widget: {
    parties: "Strony",
    to: "Do",
    from: "Od",
    timestamps: "Znaczniki czasu",
    sentAt: "Wysłano",
    deliveredAt: "Dostarczono",
    openedAt: "Otwarto",
    clickedAt: "Kliknięto",
    technical: "Szczegóły techniczne",
    template: "Szablon",
    provider: "Dostawca",
    externalId: "Zewnętrzny ID",
    retryCount: "Liczba ponowień",
    error: "Błąd",
    associations: "Powiązania",
    lead: "Lead",
    user: "Użytkownik",
    notFound: "E-mail nie znaleziony",
  },
};
