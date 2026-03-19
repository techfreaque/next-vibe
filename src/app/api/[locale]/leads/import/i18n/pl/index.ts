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
  csv: {
    post: {
      title: "Importuj Dane CSV",
      description:
        "Importuj dane z plików CSV z inteligentnym przetwarzaniem i walidacją",
      form: {
        title: "Konfiguracja Importu CSV",
        description:
          "Skonfiguruj ustawienia importu CSV dla optymalnych rezultatów",
      },
      fileSection: {
        title: "Wgrywanie Pliku",
        description: "Wybierz plik CSV i określ domenę docelową",
      },
      file: {
        label: "Plik CSV",
        description: "Wybierz plik CSV do wgrania (max 10MB)",
        placeholder: "Wybierz plik CSV...",
        helpText:
          "Obsługiwany format: CSV z wartościami oddzielonymi przecinkami. Pierwszy wiersz powinien zawierać nagłówki kolumn.",
      },
      fileName: {
        label: "Nazwa Pliku",
        description: "Nazwa tego importu (dla referencji)",
        placeholder: "np. Import Leadów Styczeń 2024",
      },
      domain: {
        label: "Domena Importu",
        description: "Jaki typ danych importujesz?",
        placeholder: "Wybierz typ danych...",
      },
      processingSection: {
        title: "Opcje Przetwarzania",
        description: "Skonfiguruj sposób przetwarzania twoich danych",
      },
      skipDuplicates: {
        label: "Pomiń Duplikaty",
        description: "Pomiń rekordy z duplikowanymi adresami email",
        helpText:
          "Zalecane: Zapobiega importowaniu tego samego kontaktu dwukrotnie",
      },
      updateExisting: {
        label: "Aktualizuj Istniejące",
        description: "Aktualizuj istniejące rekordy nowymi danymi z CSV",
        helpText:
          "Jeśli niezaznaczone, istniejące rekordy pozostaną niezmienione",
      },
      useChunkedProcessing: {
        label: "Przetwarzanie w Tle",
        description: "Przetwarzaj duże pliki w tle",
        helpText: "Zalecane dla plików z więcej niż 500 rekordami",
      },
      batchSize: {
        label: "Rozmiar Partii",
        description: "Liczba rekordów przetwarzanych jednocześnie",
        placeholder: "100",
        helpText: "Mniejsze partie są stabilniejsze, większe szybsze",
      },
      defaultsSection: {
        title: "Wartości Domyślne (Opcjonalne)",
        description: "Ustaw domyślne wartości dla rekordów bez tych informacji",
      },
      defaultCountry: {
        label: "Domyślny Kraj",
        description: "Kraj dla rekordów bez lokalizacji",
        placeholder: "Wybierz kraj...",
      },
      defaultLanguage: {
        label: "Domyślny Język",
        description: "Język dla rekordów bez preferencji językowych",
        placeholder: "Wybierz język...",
      },
      response: {
        title: "Wyniki Importu",
        description: "Podsumowanie operacji importu CSV",
        basicResults: {
          title: "Podstawowe Wyniki",
          description: "Podstawowe statystyki importu",
        },
        batchId: {
          label: "ID Partii",
        },
        totalRows: {
          label: "Całkowita liczba wierszy",
        },
        isChunkedProcessing: {
          label: "Przetwarzanie w tle",
        },
        jobId: {
          label: "ID Joba",
        },
        statistics: {
          title: "Statystyki Importu",
          description: "Szczegółowy podział operacji importu",
        },
        successfulImports: {
          label: "Udane Importy",
        },
        failedImports: {
          label: "Nieudane Importy",
        },
        duplicateEmails: {
          label: "Zduplikowane E-maile",
        },
        processingTimeMs: {
          label: "Czas przetwarzania (ms)",
        },
        summary: {
          title: "Podsumowanie Importu",
          description: "Przegląd wyników importu",
        },
        newRecords: {
          label: "Nowe Rekordy",
        },
        updatedRecords: {
          label: "Zaktualizowane Rekordy",
        },
        skippedDuplicates: {
          label: "Pominięte Duplikaty",
        },
        errors: {
          title: "Szczegóły Błędów",
          row: {
            label: "Wiersz",
          },
          email: {
            label: "E-mail",
          },
          error: {
            label: "Błąd",
          },
        },
        nextSteps: {
          title: "Następne Kroki",
          item: {
            label: "Następny Krok",
          },
        },
      },
      errors: {
        validation: {
          title: "Nieprawidłowe Dane Importu",
          description: "Sprawdź plik CSV i ustawienia",
          emptyFile: "Zawartość pliku CSV jest wymagana",
          emptyFileName: "Podaj nazwę tego importu",
          invalidDomain: "Wybierz prawidłową domenę importu",
          invalidBatchSize: "Rozmiar partii musi być między 10 a 1000",
          fileTooLarge:
            "Rozmiar pliku przekracza limit 10MB. Rozważ przetwarzanie w tle.",
        },
        unauthorized: {
          title: "Dostęp Zabroniony",
          description: "Nie masz uprawnień do importowania danych",
        },
        fileTooLarge: {
          title: "Plik Za Duży",
          description: "Wybrany plik przekracza maksymalny limit rozmiaru 10MB",
        },
        server: {
          title: "Import Nieudany",
          description:
            "Wystąpił błąd podczas przetwarzania importu. Spróbuj ponownie.",
        },
        network: {
          title: "Błąd Sieci",
          description: "Połączenie sieciowe nie powiodło się podczas importu",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do wykonania tego importu",
        },
        notFound: {
          title: "Nie Znaleziono",
          description: "Zasób importu nie został znaleziony",
        },
        unknown: {
          title: "Nieznany Błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane Zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt Danych",
          description: "Wystąpił konflikt z istniejącymi danymi",
        },
      },
      success: {
        title: "Import Udany",
        description: "Twoje dane CSV zostały pomyślnie zaimportowane",
      },
    },
  },
  enum: {
    status: {
      pending: {
        label: "Oczekujący",
        description: "Job czeka na przetworzenie",
      },
      processing: {
        label: "Przetwarzanie",
        description: "Job jest obecnie przetwarzany",
      },
      completed: {
        label: "Zakończony",
        description: "Job zakończony pomyślnie",
      },
      failed: {
        label: "Nieudany",
        description: "Job napotkał błąd",
      },
      cancelled: {
        label: "Anulowany",
        description: "Job został anulowany przez użytkownika",
      },
      paused: {
        label: "Wstrzymany",
        description: "Przetwarzanie joba jest tymczasowo wstrzymane",
      },
    },
    domain: {
      leads: {
        label: "Leady",
        description: "Potencjalni klienci i kontakty biznesowe",
      },
      contacts: {
        label: "Kontakty",
        description: "Ogólne informacje kontaktowe i książka adresowa",
      },
      businessData: {
        label: "Dane Biznesowe",
        description: "Informacje o firmach i profile biznesowe",
      },
      emails: {
        label: "Listy Email",
        description: "Listy marketingu emailowego i kampanie",
      },
      users: {
        label: "Użytkownicy",
        description: "Użytkownicy systemu i informacje o kontach",
      },
      templates: {
        label: "Szablony",
        description: "Szablony email i treści",
      },
    },
    format: {
      csv: {
        label: "Plik CSV",
        description: "Wartości oddzielone przecinkami (najczęstsze)",
      },
      xlsx: {
        label: "Plik Excel",
        description: "Arkusz kalkulacyjny Microsoft Excel",
      },
      json: {
        label: "Plik JSON",
        description: "Dane JavaScript Object Notation",
      },
      tsv: {
        label: "Plik TSV",
        description: "Wartości oddzielone tabulatorami",
      },
    },
    processing: {
      immediate: {
        label: "Przetwórz Teraz",
        description: "Przetwórz plik natychmiast (najszybsze)",
      },
      background: {
        label: "W Tle",
        description: "Przetwarzaj w tle (dla dużych plików)",
      },
      scheduled: {
        label: "Zaplanuj Później",
        description: "Zaplanuj przetwarzanie na określony czas",
      },
    },
    errorType: {
      validation: {
        label: "Błąd Walidacji",
        description: "Dane nie spełniają wymaganego formatu lub zasad",
      },
      duplicate: {
        label: "Duplikat Danych",
        description: "Rekord już istnieje w systemie",
      },
      format: {
        label: "Błąd Formatu",
        description: "Format pliku jest nieprawidłowy lub uszkodzony",
      },
      processing: {
        label: "Błąd Przetwarzania",
        description: "Błąd wystąpił podczas przetwarzania danych",
      },
      system: {
        label: "Błąd Systemu",
        description: "Wewnętrzny błąd systemu",
      },
    },
    batchSize: {
      small: {
        label: "Mały (50)",
        description: "Najlepszy do testów lub małych importów",
      },
      medium: {
        label: "Średni (100)",
        description: "Zalecany dla większości importów",
      },
      large: {
        label: "Duży (250)",
        description: "Dobry dla dużych plików z prostymi danymi",
      },
      xlarge: {
        label: "Bardzo Duży (500)",
        description: "Dla bardzo dużych plików (zaawansowani użytkownicy)",
      },
    },
  },
  nextSteps: {
    reviewErrors: "Przejrzyj szczegóły błędów, aby zrozumieć co poszło nie tak",
    checkDuplicates: "Rozważ dostosowanie ustawień obsługi duplikatów",
    reviewLeads: "Przejrzyj zaimportowane leady w sekcji zarządzania leadami",
    startCampaign: "Rozważ rozpoczęcie kampanii email z nowymi leadami",
    reviewContacts: "Przejrzyj zaimportowane kontakty w sekcji kontaktów",
    organizeContacts: "Uporządkuj kontakty w grupy lub tagi",
    reviewImported: "Przejrzyj zaimportowane dane w odpowiedniej sekcji",
    monitorProgress: "Monitoruj postęp w historii jobów",
    checkJobsList: "Sprawdź listę jobów dla szczegółowych aktualizacji statusu",
  },
  errors: {
    cancel: {
      server: "Nie udało się anulować joba importu",
    },
    retry: {
      server: "Nie udało się ponowić joba importu",
    },
    delete: {
      server: "Nie udało się usunąć joba importu",
    },
    status: {
      server: "Nie udało się pobrać statusu joba",
    },
  },
  error: {
    default: "Wystąpił błąd",
  },
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
