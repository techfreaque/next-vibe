import { translations as hooksTranslations } from "../../hooks/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  hooks: hooksTranslations,
  widgets: {
    endpointRenderer: {
      submit: "Wyślij",
      submitting: "Wysyłanie...",
    },
    container: {
      noContent: "Brak zawartości",
    },
    dataTable: {
      showingResults: "Wyświetlanie {{count}} z {{total}} wyników",
      noData: "Brak dostępnych danych",
    },
    dataList: {
      noData: "Brak dostępnych danych",
      showMore: "Pokaż {{count}} więcej",
      showLess: "Pokaż mniej",
      viewList: "Widok listy",
      viewGrid: "Widok siatki",
    },
    linkList: {
      noResults: "Nie znaleziono wyników",
    },
    link: {
      invalidData: "Nieprawidłowe dane linku",
    },
    markdown: {
      noContent: "Brak zawartości",
    },
    errorBoundary: {
      title: "Błąd widgetu",
      errorDetails: "Szczegóły błędu",
      defaultMessage: "Wystąpił błąd podczas renderowania tego widgetu",
    },
    formField: {
      requiresContext:
        "Pole formularza wymaga kontekstu formularza i konfiguracji pola",
    },
    filterPills: {
      requiresContext:
        "Widget filtrowania wymaga kontekstu formularza i nazwy pola",
    },
    toolCall: {
      status: {
        error: "Błąd",
        executing: "Wykonywanie...",
        complete: "Zakończono",
        waitingForConfirmation: "Oczekiwanie na potwierdzenie",
      },
      sections: {
        request: "Żądanie",
        response: "Odpowiedź",
      },
      messages: {
        executingTool: "Wykonywanie narzędzia...",
        errorLabel: "Błąd:",
        noArguments: "Brak argumentów",
        noResult: "Brak wyniku",
        metadataNotAvailable:
          "Metadane widgetu niedostępne. Pokazywanie surowych danych.",
        confirmationRequired:
          "Sprawdź i edytuj parametry, następnie potwierdź.",
      },
      actions: {
        confirm: "Potwierdź",
        cancel: "Anuluj",
      },
    },
    codeQualityList: {
      noData: "Nie znaleziono problemów z jakością kodu",
      rule: "Reguła: {{rule}}",
    },
    section: {
      noData: "Brak danych sekcji",
    },
    title: {
      noData: "Brak danych tytułu",
    },
    chart: {
      noDataAvailable: "Brak dostępnych danych",
      noDataToDisplay: "Brak danych do wyświetlenia",
    },
    creditTransactionList: {
      invalidConfig: "Nieprawidłowa konfiguracja listy transakcji kredytowych",
      noTransactions: "Nie znaleziono transakcji",
    },
    pagination: {
      showing: "Pokazywanie {{start}}-{{end}} z {{total}} wpisów",
      itemsPerPage: "Wpisów na stronę",
      page: "Strona {{current}} z {{total}}",
    },
  },
};
