import { translations as jobsTranslations } from "../../jobs/i18n/pl";
import { translations as statusTranslations } from "../../status/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    import: "Importuj",
    leads: "Leady",
    csv: "CSV",
  },

  category: "Import danych",
  post: {
    title: "Importuj leady",
    description: "Importuj leady z pliku CSV",
    form: {
      title: "Konfiguracja importu",
      description: "Skonfiguruj parametry importu leadów",
    },
    file: {
      label: "Plik CSV",
      description: "Zawartość pliku CSV (zakodowana base64)",
      placeholder: "Wklej zawartość CSV zakodowaną base64",
      helpText: "Prześlij plik CSV z danymi leadów",
    },
    fileName: {
      label: "Nazwa pliku",
      description: "Nazwa pliku CSV",
      placeholder: "leads.csv",
      helpText: "Podaj opisową nazwę pliku",
    },
    skipDuplicates: {
      label: "Pomiń duplikaty",
      description: "Pomiń leady z duplikowanymi adresami e-mail",
      helpText: "Włącz aby automatycznie pomijać istniejące adresy e-mail",
    },
    updateExisting: {
      label: "Aktualizuj istniejące",
      description: "Aktualizuj istniejące leady nowymi danymi",
      helpText: "Włącz aby aktualizować istniejące leady zamiast pomijać",
    },
    defaultCountry: {
      label: "Domyślny kraj",
      description: "Domyślny kraj dla leadów bez określonego kraju",
      helpText: "Wybierz domyślny kod kraju",
    },
    defaultLanguage: {
      label: "Domyślny język",
      description: "Domyślny język dla leadów bez określonego języka",
      helpText: "Wybierz domyślny kod języka",
    },
    defaultStatus: {
      label: "Domyślny status",
      description: "Domyślny status dla importowanych leadów",
      helpText: "Wybierz początkowy status dla nowych leadów",
    },
    defaultCampaignStage: {
      label: "Domyślny etap kampanii",
      description: "Domyślny etap kampanii e-mailowej dla importowanych leadów",
      helpText: "Wybierz początkowy etap kampanii",
    },
    defaultSource: {
      label: "Domyślne źródło",
      description: "Domyślna atrybucja źródła dla importowanych leadów",
      helpText: "Wybierz źródło leada do śledzenia",
    },
    useChunkedProcessing: {
      label: "Użyj przetwarzania fragmentami",
      description: "Przetwarzaj duże importy w tle fragmentami",
      helpText: "Włącz dla plików z więcej niż 1000 wierszami",
    },
    batchSize: {
      label: "Rozmiar partii",
      description: "Liczba wierszy do przetworzenia na partię",
      helpText: "Zalecane: 2000 wierszy na partię",
    },
    response: {
      batchId: "ID partii",
      totalRows: "Całkowita liczba wierszy",
      successfulImports: "Udane importy",
      failedImports: "Nieudane importy",
      duplicateEmails: "Duplikaty e-mail",
      errors: "Błędy importu",
      summary: "Podsumowanie importu",
      isChunkedProcessing: "Przetwarzanie fragmentami",
      jobId: "ID zadania w tle",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry importu lub format CSV",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do importu leadów",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony dla importu leadów",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Plik CSV nie został znaleziony lub jest nieprawidłowy",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt danych podczas importu",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas importu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas importu",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas importu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany w formularzu importu",
      },
    },
    success: {
      title: "Import rozpoczęty",
      description: "Import leadów został pomyślnie zainicjowany",
    },
    widget: {
      headerTitle: "Importuj leady z CSV",
      exportTemplateButton: "Eksportuj szablon",
      importGuideTitle: "Przewodnik importu",
      importGuideSubtitle: "Prześlij plik CSV z następującymi kolumnami:",
      importGuideNote:
        "Tylko {{email}} jest wymagany. Wszystkie inne kolumny są opcjonalne i przyjmą domyślne wartości skonfigurowane poniżej.",
      fileRequirementsTitle: "Wymagania pliku",
      fileRequirementFormat:
        "Format: CSV (wartości rozdzielone przecinkami, kodowanie UTF-8)",
      fileRequirementHeader:
        "Pierwszy wiersz musi być wierszem nagłówkowym z nazwami kolumn",
      fileRequirementSize: "Zalecany maksymalny rozmiar: 50 MB na upload",
      fileRequirementChunked:
        "Dla plików większych niż ~5 000 wierszy włącz {{chunkedProcessing}}, aby uniknąć limitów czasowych",
      chunkedProcessingLabel: "Przetwarzanie fragmentami",
      downloadTemplateLink: "Pobierz szablon CSV",
      loadingText: "Importowanie lead\u00f3w\u2026",
      backgroundProcessingTitle: "Przetwarzanie w tle",
      backgroundProcessingNote:
        "Duży import umieszczony w kolejce jako zadanie: {{jobId}}. Przetwarzanie {{totalRows}} wierszy w tle.",
      checkJobStatusButton: "Sprawdź status zadania",
      stopJobButton: "Zatrzymaj zadanie",
      retryFailedButton: "Ponów nieudane",
      statTotalRows: "Wiersze łącznie",
      statImported: "Zaimportowane",
      statDuplicates: "Duplikaty",
      statFailed: "Nieudane",
      viewImportedLeadsButton: "Zobacz zaimportowane leady",
      retryFailedWithCountButton: "Ponów nieudane ({{count}})",
      summaryTitle: "Podsumowanie",
      summaryNewLeads: "Nowe leady",
      summaryUpdated: "Zaktualizowane",
      summarySkipped: "Pominięte",
      successRateLabel: "Wskaźnik sukcesu",
      importErrorsTitle: "{{count}} błędów importu",
      errorRowLabel: "Wiersz {{row}}",
      findLeadButton: "Znajdź lead",
    },
  },
  process: {
    tag: "Przetwarzanie importu",
    post: {
      title: "Przetwarzaj zadania importu",
      description: "Przetwarzaj oczekujące zadania importu CSV",
      container: {
        title: "Konfiguracja przetwarzania importu",
        description: "Skonfiguruj parametry przetwarzania importu",
      },
      fields: {
        maxJobsPerRun: {
          label: "Maks. zadań na przebieg",
          description: "Maksymalna liczba zadań do przetworzenia na przebieg",
        },
        maxRetriesPerJob: {
          label: "Maks. ponowień na zadanie",
          description: "Maksymalna liczba ponowień na zadanie",
        },
        dryRun: {
          label: "Próbny przebieg",
          description: "Uruchom bez wprowadzania zmian",
        },
        selfTaskId: {
          label: "Własne ID zadania",
          description:
            "Wewnętrzne ID zadania do samoczyszczenia po przetworzeniu",
        },
      },
      response: {
        jobsProcessed: "Przetworzone zadania",
        totalRowsProcessed: "Łącznie przetworzone wiersze",
        successfulImports: "Udane importy",
        failedImports: "Nieudane importy",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Dostęp zabroniony",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił błąd podczas przetwarzania importów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry żądania",
        },
      },
      success: {
        title: "Przetwarzanie importu zakończone",
        description: "Zadania importu zostały pomyślnie przetworzone",
      },
    },
  },
  widget: {
    header: {
      title: "Zadania importu",
      newImport: "Nowy import",
    },
    filter: {
      all: "Wszystkie",
      completed: "Zako\u0144czone",
      failed: "Nieudane",
      pending: "Oczekuj\u0105ce",
      running: "W trakcie",
    },
    loading: "Wczytywanie zada\u0144 importu\u2026",
    empty: {
      title: "Nie znaleziono zada\u0144 importu",
      withFilter: "Spr\u00f3buj innego filtru lub rozpocznij nowy import.",
      withoutFilter:
        "Rozpocznij sw\u00f3j pierwszy import, aby zobaczy\u0107 go tutaj.",
      newImport: "Nowy import",
    },
  },
  jobs: jobsTranslations,
  status: statusTranslations,
  enums: {
    csvImportJobStatus: {
      pending: "Oczekujący",
      processing: "W trakcie",
      completed: "Zakończony",
      failed: "Nieudany",
    },
    csvImportJobAction: {
      retry: "Ponów",
      delete: "Usuń",
      stop: "Zatrzymaj",
    },
    importMode: {
      createOnly: "Tylko tworzenie",
      updateOnly: "Tylko aktualizacja",
      createOrUpdate: "Tworzenie lub aktualizacja",
      skipDuplicates: "Pomiń duplikaty",
    },
    importFormat: {
      csv: "CSV",
      tsv: "TSV",
      json: "JSON",
    },
    importProcessingType: {
      immediate: "Natychmiastowe",
      chunked: "Fragmentami",
      scheduled: "Zaplanowane",
    },
    importErrorType: {
      validationError: "Błąd walidacji",
      duplicateEmail: "Duplikat e-maila",
      invalidFormat: "Niepoprawny format",
      missingRequiredField: "Brak wymaganego pola",
      processingError: "Błąd przetwarzania",
      systemError: "Błąd systemu",
    },
    batchProcessingStatus: {
      pending: "Oczekujący",
      processing: "W trakcie",
      completed: "Zakończony",
      failed: "Nieudany",
      retrying: "Ponowienie",
    },
    importPriority: {
      low: "Niski",
      normal: "Normalny",
      high: "Wysoki",
      urgent: "Pilny",
    },
    importSource: {
      webUpload: "Upload web",
      apiUpload: "Upload API",
      scheduledImport: "Import zaplanowany",
      bulkOperation: "Operacja masowa",
    },
    csvDelimiter: {
      comma: "Przecinek",
      semicolon: "Średnik",
      tab: "Tabulator",
      pipe: "Kreska pionowa",
    },
    importValidationLevel: {
      strict: "Ścisły",
      moderate: "Umiarkowany",
      lenient: "Łagodny",
    },
    importNotificationType: {
      email: "E-mail",
      inApp: "W aplikacji",
      webhook: "Webhook",
      none: "Brak",
    },
    leadStatus: {
      new: "Nowy",
      pending: "Oczekujący",
      campaignRunning: "Kampania aktywna",
      websiteUser: "Użytkownik strony",
      newsletterSubscriber: "Subskrybent newslettera",
      inContact: "W kontakcie",
      signedUp: "Zarejestrowany",
      subscriptionConfirmed: "Subskrypcja potwierdzona",
      unsubscribed: "Wypisany",
      bounced: "Odrzucony",
      invalid: "Nieprawidłowy",
    },
    emailCampaignStage: {
      notStarted: "Nie rozpoczęto",
      initial: "Pierwszy kontakt",
      followup1: "Follow-up 1",
      followup2: "Follow-up 2",
      followup3: "Follow-up 3",
      nurture: "Pielęgnowanie",
      reactivation: "Reaktywacja",
    },
    leadSource: {
      website: "Strona WWW",
      socialMedia: "Media społecznościowe",
      emailCampaign: "Kampania e-mail",
      referral: "Polecenie",
      csvImport: "Import CSV",
    },
  },
};
