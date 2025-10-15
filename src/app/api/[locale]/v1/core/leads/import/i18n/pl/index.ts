import { translations as jobsTranslations } from "../../jobs/i18n/pl";
import { translations as statusTranslations } from "../../status/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
  },
};
