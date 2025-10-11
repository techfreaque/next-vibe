import type { translations as enTranslations } from "../en";

/**
*

* Template Import API translations for Polish
*/

export const translations: typeof enTranslations = {
  import: {
    // Enums
    enums: {
      importFormat: {
        csv: "CSV",
        json: "JSON",
        xml: "XML",
      },
      importMode: {
        createOnly: "Tylko utwórz",
        updateOnly: "Tylko zaktualizuj",
        createOrUpdate: "Utwórz lub zaktualizuj",
      },
      importStatus: {
        pending: "Oczekujący",
        processing: "Przetwarzanie",
        completed: "Zakończony",
        failed: "Niepowodzenie",
      },
    },
    title: "Importuj szablony",
    description: "Importuj szablony z plików CSV, JSON lub XML",
    category: "API szablonów",
    tags: {
      import: "Import",
      bulk: "Operacja masowa",
      templates: "Szablony",
    },
    form: {
      title: "Konfiguracja importu",
      description: "Skonfiguruj ustawienia importu szablonów",
    },

    // Field labels
    format: {
      label: "Format pliku",
      description: "Wybierz format pliku importu",
      placeholder: "Wybierz format pliku",
    },
    mode: {
      label: "Tryb importu",
      description: "Wybierz sposób obsługi istniejących szablonów",
      placeholder: "Wybierz tryb importu",
    },
    data: {
      label: "Dane importu",
      description: "Wklej tutaj dane CSV, JSON lub XML",
      placeholder: "Wklej dane szablonów...",
    },
    validateOnly: {
      label: "Tylko walidacja",
      description: "Tylko zwaliduj dane bez importowania",
    },
    skipErrors: {
      label: "Pomiń błędy",
      description: "Kontynuuj import nawet jeśli niektóre rekordy mają błędy",
    },
    defaultStatus: {
      label: "Domyślny status",
      description: "Status dla szablonów bez wyraźnego statusu",
      placeholder: "Wybierz domyślny status",
    },

    // Response
    response: {
      title: "Wyniki importu",
      description: "Szczegóły operacji importu",
    },

    // Errors
    errors: {
      validation: {
        title: "Nieprawidłowe dane importu",
        description: "Dane importu są nieprawidłowe lub uszkodzone",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do importowania szablonów",
      },
      forbidden: {
        title: "Import zabroniony",
        description: "Import szablonów nie jest dozwolony dla Twojego konta",
      },
      server: {
        title: "Import nie powiódł się",
        description: "Wystąpił błąd podczas importowania szablonów",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można zakończyć żądania importu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd podczas importu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt importu",
        description: "Wystąpił konflikt podczas procesu importu",
      },
      unsupportedFormat: "Nieobsługiwany format importu",
    },

    // Success
    success: {
      title: "Import zakończony",
      description: "Szablony zaimportowane pomyślnie",
    },
  },
};
