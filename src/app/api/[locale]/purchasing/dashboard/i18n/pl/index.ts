import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    get: {
      title: "Przegląd zakupów",
      description:
        "Aktualny stan zamówień zakupu i aktywności dostawców dla Twojej firmy.",
      widget: {
        kpiDraft: "Szkice",
        kpiConfirmed: "Potwierdzone",
        kpiAwaitingReceipt: "Oczekuje na odbiór",
        kpiActiveVendors: "Aktywni dostawcy",
        warningDueThisWeek:
          "{{count}} zamówienie do realizacji w tym tygodniu — sprawdź daty dostawy",
        warningDueThisWeekPlural:
          "{{count}} zamówień do realizacji w tym tygodniu — sprawdź daty dostawy",
        navNewPo: "Nowe zamówienie zakupu",
        navAllPos: "Wszystkie zamówienia",
        navVendors: "Dostawcy",
        navNewVendor: "Nowy dostawca",
        loading: "Ładowanie…",
      },
      companyId: {
        label: "Firma",
        description:
          "Firma, której statystyki zakupów mają być wyświetlone (opcjonalnie)",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlić przegląd zakupów",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej firmy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować przeglądu zakupów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        network: {
          title: "Błąd sieci",
          description: "Sprawdź połączenie i spróbuj ponownie",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Firma nie znaleziona",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
      },
      success: {
        title: "Dashboard załadowany",
        description: "Przegląd zakupów pobrany",
      },
      response: {
        draftCount: "Szkice",
        confirmedCount: "Potwierdzone zamówienia",
        awaitingReceiptCount: "Oczekuje na odbiór",
        activeVendorCount: "Aktywni dostawcy",
        dueThisWeekCount: "Do realizacji w tym tygodniu",
      },
    },
  },
};
