import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    title: "Przegląd księgowości",
    description:
      "Stan ksiąg rachunkowych — otwarty okres, liczba zapisów i szybka nawigacja do wszystkich narzędzi księgowych.",
    companyId: {
      label: "ID firmy",
      description: "Firma, dla której ładowany jest przegląd",
      placeholder: "UUID firmy",
    },
    response: {
      currentPeriod: "Bieżący okres",
      accountCount: "Konta",
      draftEntryCount: "Szkice",
      postedThisMonthCount: "Zaksięgowane w tym miesiącu",
      hasSetup: "Konfiguracja",
      currency: "Waluta",
    },
    success: {
      title: "Przegląd załadowany",
      description: "Pobrano przegląd księgowości",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź dane wejściowe",
      },
      forbidden: {
        title: "Odmowa dostępu",
        description: "Brak dostępu do tej firmy",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie można załadować przeglądu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      notFound: { title: "Nie znaleziono", description: "Firma nie istnieje" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    widget: {
      currentPeriod: "Bieżący okres",
      noPeriod: "Brak otwartego okresu",
      createPeriod: "Utwórz okres",
      totalAccounts: "Konta",
      viewAccounts: "Pokaż",
      draftEntries: "Szkice",
      viewDrafts: "Pokaż",
      postedThisMonth: "Zaksięgowane w tym miesiącu",
      setupStatus: "Konfiguracja",
      loading: "Ładowanie dashboardu…",
      noData: "Brak danych księgowych.",
      configured: "Skonfigurowane",
      notSetUp: "Nie skonfigurowane",
      runSetup: "Konfiguruj",
      navTitle: "Księgowość",
      chartOfAccounts: "Plan kont",
      journalEntries: "Dziennik księgowy",
      periods: "Okresy",
      balanceSheet: "Bilans",
      profitLoss: "Wynik finansowy",
      trialBalance: "Bilans próbny",
      taxReport: "Raport podatkowy",
      companies: "Firmy",
      invoices: "Faktury sprzedaży",
      bills: "Faktury zakupu",
      selectCompany: "Podaj ID firmy, aby załadować przegląd księgowości.",
    },
  },
  category: "Księgowość",
  tag: "pulpit",
};
