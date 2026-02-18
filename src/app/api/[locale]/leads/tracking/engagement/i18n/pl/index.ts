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
    ref: {
      label: "ID referencyjne",
      description: "Identyfikator referencyjny śledzenia",
      placeholder: "Wprowadź ID referencyjne",
      helpText: "Opcjonalne ID referencyjne do dodatkowego kontekstu śledzenia",
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
  widget: {
    post: {
      headerTitle: "Rejestruj zaanga\u017cowanie",
      viewStatsTitle: "Wy\u015bwietl statystyki lead\u00f3w",
      statsButton: "Statystyki",
      loading: "Rejestrowanie zaanga\u017cowania\u2026",
      successTitle: "Zaanga\u017cowanie zarejestrowane",
      successSubtitle: "pomy\u015blnie \u015bledzone",
      event: "Zdarzenie",
      labels: {
        engagementId: "ID zaanga\u017cowania",
        type: "Typ",
        leadId: "ID leada",
        campaignId: "ID kampanii",
        ipAddress: "Adres IP",
        recordedAt: "Zarejestrowano o",
        leadCreated: "Lead utworzony",
        leadCreatedYes: "Tak (nowy lead)",
        leadCreatedNo: "Nie (istniej\u0105cy)",
        relationshipEst: "Relacja nawiq.",
        relationshipYes: "Tak",
        relationshipNo: "Nie",
        metadata: "Metadane",
      },
      nextSteps: "Nast\u0119pne kroki:",
      viewLeadButton: "Wy\u015bwietl lead",
      leadStatsButton: "Statystyki lead\u00f3w",
      emptyTitle: "\u015aled\u017a zdarzenie zaanga\u017cowania",
      emptyDescription:
        "Wype\u0142nij poni\u017cszy formularz i wy\u015blij, aby zarejestrowa\u0107 nowe zdarzenie zaanga\u017cowania dla leada",
      viewLeadStatsButton: "Wy\u015bwietl statystyki lead\u00f3w",
    },
    get: {
      headerTitle: "\u015aledzenie klikni\u0119\u0107",
      viewStatsTitle: "Wy\u015bwietl statystyki lead\u00f3w",
      statsButton: "Statystyki",
      loading: "Przetwarzanie \u015bledzenia klikni\u0119\u0107\u2026",
      successTitle: "Klikni\u0119cie zarejestrowane",
      successSubtitle:
        "Zaanga\u017cowanie zarejestrowane i URL przekierowania gotowy",
      failTitle: "\u015aledzenie nie powiod\u0142o si\u0119",
      failSubtitle:
        "Nie mo\u017cna zarejestrowa\u0107 zdarzenia klikni\u0119cia",
      labels: {
        engagementLabel: "Zaanga\u017cowanie",
        recorded: "Zarejestrowane",
        notRecorded: "Niezarejestrowane",
        leadStatusLabel: "Status leada",
        updated: "Zaktualizowany",
        unchanged: "Niezmieniony",
        userLabel: "U\u017cytkownik",
        loggedIn: "Zalogowany",
        anonymous: "Anonimowy",
        leadId: "ID leada",
        campaignId: "ID kampanii",
        redirectUrl: "URL przekierowania",
      },
      nextSteps: "Nast\u0119pne kroki:",
      openUrlButton: "Otw\u00f3rz URL",
      viewLeadButton: "Wy\u015bwietl lead",
      leadStatsButton: "Statystyki lead\u00f3w",
      emptyTitle: "\u015aled\u017a zdarzenie klikni\u0119cia",
      emptyDescription:
        "Wprowad\u017a poni\u017cej parametry \u015bledzenia, aby zarejestrowa\u0107 klikni\u0119cie i pobra\u0107 URL przekierowania",
      viewLeadStatsButton: "Wy\u015bwietl statystyki lead\u00f3w",
    },
  },
  enums: {
    engagementLevel: {
      high: "Wysoki",
      medium: "\u015aredni",
      low: "Niski",
      none: "Brak",
    },
  },
  error: {
    default:
      "Wyst\u0105pi\u0142 b\u0142\u0105d podczas przetwarzania zaanga\u017cowania",
  },
};
