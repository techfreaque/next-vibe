import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Śledzenie leadów",
  tags: {
    tracking: "Śledzenie",
    engagement: "Zaangażowanie",
  },
  post: {
    title: "Zarejestruj zaangażowanie leada",
    description: "Zarejestruj nowe zdarzenie zaangażowania dla leada",
    form: {
      title: "Formularz zaangażowania leada",
      description: "Zarejestruj szczegóły zaangażowania leada",
    },
    leadId: {
      label: "ID leada",
      description: "Unikalny identyfikator leada",
      placeholder: "Wprowadź ID leada",
      helpText: "UUID leada, dla którego ma być śledzone zaangażowanie",
    },
    engagementType: {
      label: "Typ zaangażowania",
      description: "Typ zdarzenia zaangażowania",
      placeholder: "Wybierz typ zaangażowania",
      helpText: "Rodzaj interakcji lub zaangażowania",
    },
    campaignId: {
      label: "ID kampanii",
      description: "Powiązany identyfikator kampanii",
      placeholder: "Wprowadź ID kampanii",
      helpText: "Opcjonalna kampania, do której należy to zaangażowanie",
    },
    metadata: {
      label: "Metadane",
      description: "Dodatkowe metadane zaangażowania",
      placeholder: "Wprowadź metadane jako JSON",
      helpText: "Niestandardowe dane dotyczące tego zaangażowania",
    },
    userId: {
      label: "ID użytkownika",
      description: "Powiązany identyfikator użytkownika",
      placeholder: "Wprowadź ID użytkownika",
      helpText:
        "Opcjonalny ID użytkownika, jeśli lead jest powiązany z użytkownikiem",
    },
    response: {
      id: "ID zaangażowania",
      leadId: "ID leada",
      engagementType: "Typ zaangażowania",
      campaignId: "ID kampanii",
      metadata: "Metadane",
      timestamp: "Znacznik czasu",
      ipAddress: "Adres IP",
      userAgent: "User Agent",
      createdAt: "Utworzono",
      leadCreated: "Lead utworzony",
      relationshipEstablished: "Relacja nawiązana",
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
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Zaangażowanie zarejestrowane",
      description: "Zaangażowanie leada zostało pomyślnie zarejestrowane",
    },
  },
  get: {
    title: "Śledź kliknięcie leada",
    description: "Śledź kliknięcie leada i przekieruj do docelowego URL",
    form: {
      title: "Parametry śledzenia kliknięć",
      description: "Parametry śledzenia kliknięć i przekierowania",
    },
    id: {
      label: "ID leada",
      description: "Unikalny identyfikator leada",
      placeholder: "Wprowadź ID leada",
      helpText: "Unikalny identyfikator leada",
    },
    stage: {
      label: "Etap kampanii",
      description: "Aktualny etap w kampanii",
      placeholder: "Wybierz etap",
      helpText: "Aktualny etap leada w kampanii",
    },
    source: {
      label: "Źródło",
      description: "Źródło kliknięcia",
      placeholder: "Wprowadź źródło",
      helpText: "Źródło, z którego pochodzi kliknięcie",
    },
    url: {
      label: "Docelowy URL",
      description: "URL do przekierowania",
      placeholder: "https://example.com",
      helpText: "URL, do którego zostanie przekierowany lead",
    },
    response: {
      success: "Sukces",
      redirectUrl: "URL przekierowania",
      leadId: "ID leada",
      campaignId: "ID kampanii",
      engagementRecorded: "Zaangażowanie zarejestrowane",
      leadStatusUpdated: "Status leada zaktualizowany",
      isLoggedIn: "Jest zalogowany",
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
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Kliknięcie zarejestrowane",
      description:
        "Kliknięcie leada zostało pomyślnie zarejestrowane i przekierowane",
    },
  },
  enums: {
    engagementLevel: {
      high: "Wysoki",
      medium: "Średni",
      low: "Niski",
      none: "Brak",
    },
  },
  error: {
    default: "Wystąpił błąd podczas przetwarzania zaangażowania",
  },
};
