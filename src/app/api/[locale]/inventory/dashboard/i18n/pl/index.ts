import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    get: {
      title: "Przegląd magazynu",
      description:
        "Aktualny stan zapasów, oczekujące transfery i liczba magazynów.",
      widget: {
        kpiInStock: "Na stanie",
        kpiOutOfStock: "Brak w magazynie",
        kpiLowStock: "Niski stan",
        kpiWarehouses: "Magazyny",
        alertOutOfStock: "{{count}} produkt niedostępny",
        alertOutOfStockPlural: "{{count}} produktów niedostępnych",
        navStockLevels: "Stany magazynowe",
        navTransfers: "Transfery",
        navWarehouses: "Magazyny",
        loading: "Ładowanie…",
        pendingTransfers: "{{count}} transfer w drodze",
        pendingTransfersPlural: "{{count}} transferów w drodze",
      },
      companyId: {
        label: "Firma",
        description:
          "Firma, której statystyki magazynowe mają być wyświetlone (opcjonalnie)",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Sprawdź wymagane pola",
        },
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się, aby wyświetlić przegląd magazynu",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Brak dostępu do tej firmy",
        },
        conflict: { title: "Konflikt", description: "Konflikt danych" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować przeglądu magazynu",
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
        description: "Przegląd magazynu pobrany",
      },
      response: {
        inStockCount: "Na stanie",
        outOfStockCount: "Brak w magazynie",
        lowStockCount: "Niski stan",
        pendingTransferCount: "Oczekujące transfery",
        warehouseCount: "Magazyny",
      },
    },
  },
};
