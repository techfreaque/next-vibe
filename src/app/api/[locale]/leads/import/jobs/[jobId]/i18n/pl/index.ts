import { translations as retryTranslations } from "../../retry/i18n/pl";
import { translations as stopTranslations } from "../../stop/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Zaktualizuj zadanie importu",
    description: "Zaktualizuj ustawienia konfiguracji zadania importu",
    jobId: {
      label: "ID zadania",
      description: "Unikalny identyfikator zadania importu",
    },
    form: {
      title: "Zaktualizuj ustawienia zadania",
      description: "Zmodyfikuj konfigurację zadania importu",
    },
    settings: {
      title: "Ustawienia zadania",
      description: "Ustawienia konfiguracji dla zadania importu",
    },
    batchSize: {
      label: "Rozmiar partii",
      description: "Liczba wierszy do przetworzenia w każdej partii",
      placeholder: "100",
    },
    maxRetries: {
      label: "Maksymalna liczba ponowień",
      description: "Maksymalna liczba prób ponowienia dla nieudanych wierszy",
      placeholder: "3",
    },
    response: {
      title: "Zaktualizowane informacje o zadaniu",
      description: "Zaktualizowane szczegóły zadania importu",
      info: {
        title: "Informacje o zadaniu",
        description: "Podstawowe szczegóły zadania",
      },
      id: {
        content: "ID zadania",
      },
      fileName: {
        content: "Nazwa pliku",
      },
      status: {
        content: "Status zadania",
      },
      progress: {
        title: "Postęp importu",
        description: "Bieżący postęp importu i statystyki",
      },
      totalRows: {
        content: "Łączna liczba wierszy",
      },
      processedRows: {
        content: "Przetworzone wiersze",
      },
      successfulImports: {
        content: "Udane importy",
      },
      failedImports: {
        content: "Nieudane importy",
      },
      duplicateEmails: {
        content: "Zduplikowane e-maile",
      },
      configuration: {
        title: "Konfiguracja zadania",
        description: "Bieżące ustawienia konfiguracji zadania",
      },
      currentBatchStart: {
        content: "Start bieżącej partii",
      },
      batchSize: {
        content: "Rozmiar partii",
      },
      retryCount: {
        content: "Liczba ponowień",
      },
      maxRetries: {
        content: "Maksymalna liczba ponowień",
      },
      error: {
        content: "Komunikat błędu",
      },
      timestamps: {
        title: "Znaczniki czasu zadania",
        description: "Znaczniki czasu cyklu życia zadania",
      },
      createdAt: {
        content: "Utworzono",
      },
      updatedAt: {
        content: "Zaktualizowano",
      },
      startedAt: {
        content: "Rozpoczęto",
      },
      completedAt: {
        content: "Ukończono",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane dane są nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie do aktualizacji zadań",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do aktualizacji tego zadania",
      },
      notFound: {
        title: "Zadanie nie znalezione",
        description: "Nie znaleziono zadania importu o podanym ID",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji zadania",
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
        title: "Konflikt aktualizacji",
        description: "Zadanie zostało zmodyfikowane przez innego użytkownika",
      },
    },
    success: {
      title: "Sukces",
      description: "Zadanie importu zostało pomyślnie zaktualizowane",
    },
  },
  delete: {
    title: "Usuń zadanie importu",
    description: "Usuń konkretne zadanie importu",
    jobId: {
      label: "ID zadania",
      description: "Unikalny identyfikator zadania importu do usunięcia",
    },
    form: {
      title: "Usuń zadanie importu",
      description: "Potwierdź usunięcie zadania importu",
    },
    response: {
      title: "Wynik usunięcia",
      description: "Wynik operacji usunięcia",
      success: {
        content: "Status sukcesu",
      },
      message: {
        content: "Komunikat usunięcia",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID zadania jest nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie do usuwania zadań",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do usunięcia tego zadania",
      },
      notFound: {
        title: "Zadanie nie znalezione",
        description: "Nie znaleziono zadania importu o podanym ID",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas usuwania zadania",
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
        title: "Konflikt usuwania",
        description: "Nie można usunąć zadania, które jest obecnie przetwarzane",
      },
    },
    success: {
      title: "Sukces",
      description: "Zadanie importu zostało pomyślnie usunięte",
    },
  },
  retry: retryTranslations,
  stop: stopTranslations,
};
