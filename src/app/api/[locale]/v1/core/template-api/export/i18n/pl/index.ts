import type { translations as enTranslations } from "../en";

/**
*

* Template Export API translations for Polish
*/

export const translations: typeof enTranslations = {
  export: {
    title: "Eksportuj szablony",
    description: "Eksportuj szablony w różnych formatach",
    category: "API szablonów",
    tags: {
      export: "Eksport",
      download: "Pobierz",
    },
    form: {
      title: "Konfiguracja eksportu",
      description: "Skonfiguruj opcje eksportu szablonów",
    },

    // Field labels
    format: {
      label: "Format eksportu",
      description: "Wybierz format dla eksportowanych szablonów",
      placeholder: "Wybierz format eksportu",
    },
    templateIds: {
      label: "ID szablonów",
      description:
        "Konkretne ID szablonów do eksportu (pozostaw puste dla wszystkich)",
      placeholder: "Wybierz szablony do eksportu",
    },
    status: {
      label: "Filtr statusu",
      description: "Eksportuj szablony z wybranymi statusami",
      placeholder: "Wybierz status",
    },
    tagsFilter: {
      label: "Filtr tagów",
      description: "Eksportuj szablony z wybranymi tagami",
      placeholder: "Wybierz tagi",
    },
    includeContent: {
      label: "Dołącz zawartość",
      description: "Dołącz zawartość szablonu do eksportu",
    },
    includeMetadata: {
      label: "Dołącz metadane",
      description: "Dołącz daty utworzenia i informacje o użytkowniku",
    },
    dateFrom: {
      label: "Data początkowa",
      description: "Eksportuj szablony utworzone po tej dacie",
      placeholder: "Wybierz datę początkową",
    },
    dateTo: {
      label: "Data końcowa",
      description: "Eksportuj szablony utworzone przed tą datą",
      placeholder: "Wybierz datę końcową",
    },

    // Response
    response: {
      title: "Wynik eksportu",
      description: "Wyeksportowane dane szablonów",
    },

    // Enums
    enums: {
      exportFormat: {
        json: "JSON",
        csv: "CSV",
        xml: "XML",
      },
      importMode: {
        createOnly: "Tylko utwórz",
        updateOnly: "Tylko zaktualizuj",
        createOrUpdate: "Utwórz lub zaktualizuj",
      },
      exportStatus: {
        pending: "Oczekujący",
        processing: "Przetwarzanie",
        completed: "Zakończony",
        failed: "Niepowodzenie",
      },
    },

    // Debug messages
    debug: {
      exporting: "Rozpoczynanie eksportu szablonów",
      noTemplates: "Nie znaleziono szablonów spełniających kryteria eksportu",
      success: "Szablony wyeksportowane pomyślnie",
    },

    // Errors
    errors: {
      validation: {
        title: "Nieprawidłowe parametry eksportu",
        description: "Podane parametry eksportu są nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do eksportowania szablonów",
      },
      forbidden: {
        title: "Eksport zabroniony",
        description: "Eksport szablonów nie jest dozwolony dla Twojego konta",
      },
      notFound: {
        title: "Nie znaleziono szablonów",
        description: "Nie znaleziono szablonów spełniających kryteria eksportu",
      },
      server: {
        title: "Eksport nie powiódł się",
        description: "Wystąpił błąd podczas eksportowania szablonów",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można zakończyć żądania eksportu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd podczas eksportu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Konflikt eksportu",
        description: "Wystąpił konflikt podczas procesu eksportu",
      },
    },

    // Success
    success: {
      title: "Eksport zakończony",
      description: "Szablony wyeksportowane pomyślnie",
    },
  },
};
