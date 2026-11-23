import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Kolejka kampanii",
  description: "Leady aktualnie aktywne w kampaniach e-mail",
  enums: {
    delivery: {
      stuck: "Zablokowane próby wysyłki",
      dueNow: "Do wysłania teraz",
      overdue: "Spóźnione 24 h+",
      scheduled: "Zaplanowane",
      failed: "Błędy",
      sent: "Wysłane",
      opened: "Wysłane i otwarte",
      clicked: "Wysłane i kliknięte",
      unsubscribed: "Wypisani",
      bounced: "Odbite",
    },
    emailJourneyVariantFilter: {
      all: "Wszystkie",
      uncensoredConvert: "Niecenzurowana konwersja",
      sideHustle: "Dodatkowy zarobek",
      quietRecommendation: "Cicha rekomendacja",
      signupNurture: "Pielęgnacja po rejestracji",
      retention: "Utrzymanie klienta",
      winback: "Odzyskanie klienta",
      newsletterMay2026: "Newsletter maj 2026",
      newsletterNov2026: "Newsletter listopad 2026",
    },
    emailCampaignStageFilter: {
      all: "Wszystkie",
    },
    emailCampaignStage: {
      notStarted: "Nie rozpoczęto",
      initial: "Pierwszy kontakt",
      followup1: "Kontynuacja 1",
      followup2: "Kontynuacja 2",
      followup3: "Kontynuacja 3",
      nurture: "Pielęgnacja",
      reactivation: "Reaktywacja",
    },
    campaignType: {
      leadCampaign: "Kampania leadów",
      newsletter: "Newsletter",
      signupNurture: "Pielęgnacja rejestracji",
      retention: "Retencja",
      winback: "Odzyskanie",
      transactional: "Transakcyjny",
      notification: "Powiadomienie",
      system: "System",
    },
    campaignTypeFilter: {
      all: "Wszystkie",
    },
  },
  get: {
    title: "Kolejka kampanii",
    titleShort: "Kolejka kampanii",
    description:
      "Wyświetl paginowaną listę leadów aktualnie w kampaniach e-mail",
    fields: {
      delivery: {
        label: "Stan maila",
        description:
          "Leady z mailem w tym stanie. Wysłane, otwarte, kliknięte, wypisania, odbicia i błędy używają okna dat",
        placeholder: "Dowolny stan",
      },
      journeyVariant: {
        label: "Wariant ścieżki",
        description: "Tylko maile tej ścieżki",
        placeholder: "Dowolna ścieżka",
      },
      stage: {
        label: "Etap",
        description: "Tylko maile tego etapu kampanii",
        placeholder: "Dowolny etap",
      },
      locale: {
        label: "Język",
        description: "Wyrenderowana lokalizacja (de-DE) lub język (de)",
        placeholder: "Dowolny język",
      },
      eventFrom: {
        label: "Od",
        description: "Pierwszy dzień okna zdarzeń",
      },
      eventTo: {
        label: "Do",
        description: "Ostatni dzień okna zdarzeń",
      },
      page: {
        label: "Strona",
        description: "Numer strony",
      },
      pageSize: {
        label: "Rozmiar strony",
        description: "Liczba rekordów na stronę",
      },
      campaignType: {
        label: "Typ kampanii",
        description: "Filtruj według typu kampanii",
      },
    },
    response: {
      matchedAt: "Ostatnie pasujące zdarzenie",
      matchedSubject: "Temat pasującej wiadomości",
      daysOverdue: "Dni opóźnienia",
      nextSubject: "Zaplanowany temat",
      leadId: "ID leada",
      leadEmail: "E-mail",
      businessName: "Firma",
      campaignType: "Typ kampanii",
      journeyVariant: "Wariant ścieżki",
      currentStage: "Bieżący etap",
      nextScheduledAt: "Następny e-mail",
      emailsSent: "Wysłane",
      emailsOpened: "Otwarte",
      emailsClicked: "Kliknięte",
      startedAt: "Rozpoczęto",
      total: "Łącznie",
      page: "Strona",
      pageSize: "Rozmiar strony",
      items: "Elementy kolejki",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby wyświetlić kolejkę kampanii",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do wyświetlania kolejki kampanii",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania kolejki kampanii",
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
      title: "Kolejka pobrana",
      description: "Kolejka kampanii pobrana pomyślnie",
    },
  },
  widget: {
    matchedEvents:
      "Jeden wiersz na kontakt. Wiersz pokazuje najnowsze pasujące zdarzenie.",
    overdueDays: "Spóźnione o {{days}} dni, nigdy nie wysłane",
    titleWithCount: "Kolejka kampanii ({{count}})",
    eventWindow: "Zdarzenia mailowe {{from}} do {{to}}",
    title: "Kolejka kampanii",
    refresh: "Odśwież",
    noData: "Brak wpisów w kolejce kampanii",
    emptyDescription:
      "Tutaj znajdziesz zaplanowane e-maile i leady z aktywnymi kampaniami.",
    back: "Wstecz",
    loading: "Wczytywanie kolejki kampanii",
    selectedLead: "Wybrany lead",
    clearFilters: "Wyczyść filtry",
    leadEmpty: "Brak wpisów w kolejce dla tego leada",
    firstPage: "Przejdź do pierwszej strony",
    scheduledFor: "Zaplanowano na {{date}}",
    noScheduledEmail: "Brak zaplanowanych e-maili",
    deliveryStats:
      "{{sent}} wysłanych · {{opened}} otwartych · {{clicked}} klikniętych",
    startedOn: "Rozpoczęto {{date}}",
    openLead: "Otwórz leada",
    openLeadNamed: "Otwórz leada {{recipient}}",
    previous: "Poprzednia",
    next: "Następna",
    pagination: "Strona {{page}} z {{totalPages}} · {{total}} leadów",
  },
};
