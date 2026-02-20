import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz szczegóły leada",
    description: "Pobierz szczegółowe informacje o określonym leadzie",
    backButton: {
      label: "Powrót do leadów",
    },
    editButton: {
      label: "Edytuj leada",
    },
    deleteButton: {
      label: "Usuń leada",
    },
    id: {
      label: "ID leada",
      description: "Unikalny identyfikator leada",
    },
    form: {
      title: "Żądanie szczegółów leada",
      description: "Parametry żądania dla informacji o leadzie",
    },
    response: {
      title: "Informacje o leadzie",
      description: "Pełne szczegóły leada i historia",
      basicInfo: {
        title: "Podstawowe informacje",
        description: "Podstawowa identyfikacja i status leada",
      },
      id: {
        content: "ID leada",
      },
      email: {
        content: "Adres e-mail",
      },
      businessName: {
        content: "Nazwa firmy",
      },
      contactName: {
        content: "Imię i nazwisko kontaktu",
      },
      status: {
        content: "Status leada",
      },
      contactDetails: {
        title: "Dane kontaktowe",
        description: "Informacje kontaktowe i preferencje",
      },
      phone: {
        content: "Numer telefonu",
      },
      website: {
        content: "Adres strony",
      },
      country: {
        content: "Kraj",
      },
      language: {
        content: "Język",
      },
      campaignTracking: {
        title: "Śledzenie kampanii",
        description: "Informacje o kampanii e-mailowej i śledzeniu",
      },
      source: {
        content: "Źródło leada",
      },
      currentCampaignStage: {
        content: "Aktualna faza kampanii",
      },
      emailJourneyVariant: {
        content: "Wariant ścieżki e-mailowej",
      },
      emailsSent: {
        content: "Wysłane e-maile",
      },
      lastEmailSentAt: {
        content: "Ostatni e-mail wysłany",
      },
      engagement: {
        title: "Wskaźniki zaangażowania",
        description: "Dane zaangażowania e-mailowego i interakcji",
      },
      emailsOpened: {
        content: "Otwarte e-maile",
      },
      emailsClicked: {
        content: "Kliknięte e-maile",
      },
      lastEngagementAt: {
        content: "Ostatnie zaangażowanie",
      },
      unsubscribedAt: {
        content: "Wypisano dnia",
      },
      conversion: {
        title: "Śledzenie konwersji",
        description: "Śledzenie konwersji i kamieni milowych leada",
      },
      convertedUserId: {
        content: "ID skonwertowanego użytkownika",
      },
      convertedAt: {
        content: "Skonwertowany dnia",
      },
      signedUpAt: {
        content: "Zarejestrowany dnia",
      },
      subscriptionConfirmedAt: {
        content: "Subskrypcja potwierdzona dnia",
      },
      metadata: {
        title: "Dodatkowe informacje",
        description: "Notatki i metadane",
        content: "Metadane",
      },
      notes: {
        content: "Notatki",
      },
      createdAt: {
        content: "Utworzony dnia",
      },
      updatedAt: {
        content: "Zaktualizowany dnia",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID leada jest nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description:
          "Wymagana autentykacja aby uzyskać dostęp do szczegółów leada",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do wyświetlenia tego leada",
      },
      notFound: {
        title: "Lead nie znaleziony",
        description: "Nie znaleziono leada z podanym ID",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania szczegółów leada",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt danych",
        description: "Dane leada zostały zmodyfikowane",
      },
    },
    success: {
      title: "Sukces",
      description: "Szczegóły leada pobrane pomyślnie",
    },
  },
  patch: {
    title: "Zaktualizuj leada",
    description: "Zaktualizuj informacje i status leada",
    backButton: {
      label: "Powrót do leada",
    },
    deleteButton: {
      label: "Usuń leada",
    },
    submitButton: {
      label: "Zaktualizuj leada",
      loadingText: "Aktualizowanie leada...",
    },
    id: {
      label: "ID leada",
      description: "Unikalny identyfikator leada do aktualizacji",
    },
    form: {
      title: "Zaktualizuj leada",
      description: "Edytuj informacje o leadzie",
    },
    updates: {
      title: "Aktualizacje leada",
      description: "Pola do aktualizacji",
    },
    basicInfo: {
      title: "Podstawowe informacje",
      description: "Zaktualizuj podstawowe dane leada",
    },
    email: {
      label: "Adres e-mail",
      description: "Adres e-mail leada",
      placeholder: "email@example.com",
    },
    businessName: {
      label: "Nazwa firmy",
      description: "Nazwa przedsiębiorstwa",
      placeholder: "Firma Sp. z o.o.",
    },
    contactName: {
      label: "Imię i nazwisko kontaktu",
      description: "Główna osoba kontaktowa",
      placeholder: "Jan Kowalski",
    },
    status: {
      label: "Status leada",
      description: "Aktualny status leada",
      placeholder: "Wybierz status",
    },
    contactDetails: {
      title: "Dane kontaktowe",
      description: "Zaktualizuj informacje kontaktowe",
    },
    phone: {
      label: "Numer telefonu",
      description: "Numer telefonu kontaktowego",
      placeholder: "+48123456789",
    },
    website: {
      label: "Strona internetowa",
      description: "Adres strony internetowej firmy",
      placeholder: "https://example.pl",
    },
    country: {
      label: "Kraj",
      description: "Kraj firmy",
      placeholder: "Wybierz kraj",
    },
    language: {
      label: "Język",
      description: "Preferowany język",
      placeholder: "Wybierz język",
    },
    campaignManagement: {
      title: "Zarządzanie kampanią",
      description: "Zarządzaj ustawieniami kampanii",
    },
    source: {
      label: "Źródło leada",
      description: "Pochodzenie leada",
      placeholder: "Wybierz źródło",
    },
    currentCampaignStage: {
      label: "Faza kampanii",
      description: "Aktualna faza kampanii e-mailowej",
      placeholder: "Wybierz fazę",
    },
    additionalDetails: {
      title: "Dodatkowe szczegóły",
      description: "Notatki i metadane",
    },
    notes: {
      label: "Notatki",
      description: "Wewnętrzne notatki o leadzie",
      placeholder: "Dodaj tutaj notatki",
    },
    metadata: {
      label: "Metadane",
      description: "Dodatkowe metadane (JSON)",
      placeholder: '{"key": "value"}',
    },
    convertedUserId: {
      label: "ID skonwertowanego użytkownika",
      description: "ID skonwertowanego konta użytkownika",
      placeholder: "ID użytkownika",
    },
    subscriptionConfirmedAt: {
      label: "Subskrypcja potwierdzona dnia",
      description: "Data potwierdzenia subskrypcji",
      placeholder: "Wybierz datę",
    },
    response: {
      title: "Zaktualizowany lead",
      description: "Zaktualizowane informacje o leadzie",
      basicInfo: {
        title: "Podstawowe informacje",
        description: "Zaktualizowane podstawowe dane leada",
      },
      id: {
        content: "ID leada",
      },
      email: {
        content: "Adres e-mail",
      },
      businessName: {
        content: "Nazwa firmy",
      },
      contactName: {
        content: "Imię i nazwisko kontaktu",
      },
      status: {
        content: "Status leada",
      },
      contactDetails: {
        title: "Dane kontaktowe",
        description: "Zaktualizowane informacje kontaktowe",
      },
      phone: {
        content: "Numer telefonu",
      },
      website: {
        content: "Adres strony",
      },
      country: {
        content: "Kraj",
      },
      language: {
        content: "Język",
      },
      campaignTracking: {
        title: "Śledzenie kampanii",
        description: "Zaktualizowane informacje o kampanii",
      },
      source: {
        content: "Źródło leada",
      },
      currentCampaignStage: {
        content: "Aktualna faza kampanii",
      },
      emailJourneyVariant: {
        content: "Wariant ścieżki e-mailowej",
      },
      emailsSent: {
        content: "Wysłane e-maile",
      },
      lastEmailSentAt: {
        content: "Ostatni e-mail wysłany",
      },
      engagement: {
        title: "Wskaźniki zaangażowania",
        description: "Dane zaangażowania e-mailowego",
      },
      emailsOpened: {
        content: "Otwarte e-maile",
      },
      emailsClicked: {
        content: "Kliknięte e-maile",
      },
      lastEngagementAt: {
        content: "Ostatnie zaangażowanie",
      },
      unsubscribedAt: {
        content: "Wypisano dnia",
      },
      conversion: {
        title: "Śledzenie konwersji",
        description: "Śledzenie kamieni milowych konwersji",
      },
      convertedUserId: {
        content: "ID skonwertowanego użytkownika",
      },
      convertedAt: {
        content: "Skonwertowany dnia",
      },
      signedUpAt: {
        content: "Zarejestrowany dnia",
      },
      subscriptionConfirmedAt: {
        content: "Subskrypcja potwierdzona dnia",
      },
      metadata: {
        title: "Dodatkowe informacje",
        description: "Notatki i metadane",
        content: "Metadane",
      },
      notes: {
        content: "Notatki",
      },
      createdAt: {
        content: "Utworzony dnia",
      },
      updatedAt: {
        content: "Zaktualizowany dnia",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane dane są nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autentykacja aby aktualizować leadów",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do aktualizacji tego leada",
      },
      notFound: {
        title: "Lead nie znaleziony",
        description: "Nie znaleziono leada z podanym ID",
      },
      conflict: {
        title: "Konflikt aktualizacji",
        description: "Lead został zmodyfikowany przez innego użytkownika",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji leada",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Lead zaktualizowany pomyślnie",
    },
  },
  post: {
    title: "[id]",
    description: "Endpoint [id]",
    form: {
      title: "Konfiguracja [id]",
      description: "Konfiguruj parametry [id]",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi [id]",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autentykacja",
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
        description: "Nie znaleziono zasobu",
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
  },
  widget: {
    loading: "Ładowanie leada...",
    notFound: "Lead nie znaleziony.",
    back: "Wstecz",
    leadFallbackTitle: "Lead",
    edit: "Edytuj",
    delete: "Usuń",
    converted: "Skonwertowany",
    quickActions: "Szybkie akcje",
    editLead: "Edytuj leada",
    sendTestEmail: "Wyślij testowego e-maila",
    viewInSearch: "Pokaż w wyszukiwarce",
    userProfile: "Profil użytkownika",
    userDetail: "Szczegóły użytkownika",
    creditHistory: "Historia kredytów",
    campaignFunnel: "Lejek kampanii",
    sourceLabel: "Źródło:",
    lastEmailLabel: "Ostatni e-mail:",
    campaignPerformance: "Wydajność kampanii",
    emailsSent: "Wysłane e-maile",
    opened: "Otwarte",
    clicked: "Kliknięte",
    openRate: "Wskaźnik otwarć",
    clickRate: "Wskaźnik kliknięć",
    clickToOpenRate: "Wskaźnik kliknięć do otwarć",
    contactDetails: "Dane kontaktowe",
    country: "Kraj",
    language: "Język",
    engagement: "Zaangażowanie",
    emailsOpened: "Otwarte e-maile",
    emailsClicked: "Kliknięte e-maile",
    lastEngagement: "Ostatnie zaangażowanie",
    unsubscribed: "Wypisany",
    conversion: "Konwersja",
    signedUp: "Zarejestrowany",
    convertedAt: "Skonwertowany dnia",
    subscriptionConfirmed: "Subskrypcja potwierdzona",
    convertedUserId: "ID skonwertowanego użytkownika",
    activeSubscriberSince: "Aktywny subskrybent od",
    viewUserProfile: "Pokaż profil użytkownika",
    viewUserDetail: "Pokaż szczegóły użytkownika",
    notesAndMetadata: "Notatki i metadane",
    notes: "Notatki",
    metadata: "Metadane",
    created: "Utworzony",
    lastUpdated: "Ostatnio zaktualizowany",
    daysOld: "dni temu",
    lastEngaged: "Ostatnie zaangażowanie",
    ago: "temu",
    variant: "Wariant:",
    copyEmail: "e-mail",
    copyId: "ID",
    copyPhone: "telefon",
    copyUserId: "ID użytkownika",
    stageNotStarted: "Nie rozpoczęto",
    stageInitial: "Początkowy",
    stageFollowup1: "Kontynuacja 1",
    stageFollowup2: "Kontynuacja 2",
    stageFollowup3: "Kontynuacja 3",
    stageNurture: "Pielęgnacja",
    stageReactivation: "Reaktywacja",
  },
  delete: {
    title: "Usuń leada",
    description: "Usuń leada z systemu",
    container: {
      title: "Usuń leada",
      description: "Czy na pewno chcesz trwale usunąć tego leada?",
    },
    backButton: {
      label: "Powrót do leada",
    },
    submitButton: {
      label: "Usuń leada",
      loadingText: "Usuwanie leada...",
    },
    actions: {
      delete: "Usuń leada",
      deleting: "Usuwanie leada...",
    },
    id: {
      label: "ID leada",
      description: "Unikalny identyfikator leada do usunięcia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID leada jest nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autentykacja aby usuwać leadów",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do usunięcia tego leada",
      },
      notFound: {
        title: "Lead nie znaleziony",
        description: "Nie znaleziono leada z podanym ID",
      },
      conflict: {
        title: "Konflikt usuwania",
        description:
          "Lead nie może być usunięty z powodu istniejących zależności",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas usuwania leada",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Lead usunięty",
      description: "Lead został pomyślnie usunięty",
    },
  },
};
