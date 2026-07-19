import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    leads: "leads",
    dashboard: "pulpit",
  },
  get: {
    title: "Pulpit leadów",
    titleShort: "Pulpit leadów",
    description:
      "Aktualne liczby aktywnych leadów, nowych w tym tygodniu, trwających kampanii i konwersji",
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
        description: "Nie udało się załadować danych pulpitu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Brak dostępu do tych danych",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Dane pulpitu nie zostały znalezione",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Dane pulpitu załadowane",
    },
    response: {
      activeLeadsCount: "Aktywne leady",
      newThisWeekCount: "Nowe w tym tygodniu",
      runningCampaignsCount: "Trwające kampanie",
      convertedCount: "Skonwertowane",
      totalLeadsCount: "Wszystkie leady",
      conversionRate: "Wskaźnik konwersji",
      statusBreakdown: "Rozkład statusów",
      recentLeads: "Ostatnie leady",
      "recentLeads.id": "ID",
      "recentLeads.businessName": "Nazwa firmy",
      "recentLeads.email": "Email",
      "recentLeads.status": "Status",
      "recentLeads.source": "Źródło",
      "recentLeads.createdAt": "Data utworzenia",
    },
  },
  widget: {
    loading: "Ładowanie pulpitu...",
    activeLeads: "Aktywne leady",
    newThisWeek: "Nowe w tym tygodniu",
    runningCampaigns: "W kampanii",
    converted: "Skonwertowane",
    totalLeads: "Wszystkie leady",
    conversionRate: "Wskaźnik konwersji",
    quickActions: "Szybkie akcje",
    newLead: "Nowy lead",
    newLeadDesc: "Utwórz lead ręcznie",
    allLeads: "Wszystkie leady",
    allLeadsDesc: "Przeglądaj i filtruj leady",
    campaignStats: "Statystyki kampanii",
    campaignStatsDesc: "Analiza wyników kampanii",
    searchLeads: "Szukaj leadów",
    searchLeadsDesc: "Znajdź po nazwie lub emailu",
    importLeads: "Import",
    importLeadsDesc: "Importuj leady z pliku CSV",
    statusBreakdown: "Rozkład statusów",
    recentLeads: "Ostatnie leady",
    viewAll: "Pokaż wszystkie",
    noLeadsYet: "Brak leadów",
    noLeadsHint: "Utwórz pierwszego leada lub zaimportuj z pliku CSV",
    createFirst: "Utwórz lead",
  },
};
