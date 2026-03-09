export const translations = {
  title: "Statystyki kampanii",
  description: "Statystyki wydajności kampanii e-mail",
  get: {
    title: "Statystyki kampanii",
    description: "Pobierz statystyki wydajności kampanii e-mail",
    container: {
      title: "Filtry",
      description: "Filtruj statystyki kampanii",
    },
    fields: {
      journeyVariant: {
        label: "Wariant ścieżki",
        description: "Filtruj według wariantu ścieżki e-mail",
      },
    },
    response: {
      total: "Łącznie kampanii",
      pending: "Oczekujące",
      sent: "Wysłane",
      delivered: "Dostarczone",
      opened: "Otwarte",
      clicked: "Kliknięte",
      failed: "Nieudane",
      openRate: "Wskaźnik otwarć",
      clickRate: "Wskaźnik kliknięć",
      deliveryRate: "Wskaźnik dostarczalności",
      failureRate: "Wskaźnik błędów",
      byStage: "Według etapu",
      byJourneyVariant: "Według wariantu",
      byStatus: "Według statusu",
      pendingLeadsCount: "Aktywne leady w kampaniach",
      emailsScheduledToday: "E-maile zaplanowane na dziś",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak uprawnień",
      },
      server: {
        title: "Błąd serwera",
        description: "Błąd podczas pobierania statystyk",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry wejściowe",
      },
    },
    success: {
      title: "Statystyki pobrane",
      description: "Statystyki kampanii pobrane pomyślnie",
    },
  },
  widget: {
    title: "Wydajność kampanii",
    refresh: "Odśwież",
    noData: "Brak danych kampanii",
    openRateSuffix: "% otwarć",
    clickRateSuffix: "% CTR",
    stageLabel: "Lejek etapów",
    statusLabel: "Status wysyłki",
    variantLabel: "Według ścieżki",
    emDash: "—",
  },
};
