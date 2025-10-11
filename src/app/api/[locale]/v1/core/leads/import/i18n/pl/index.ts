import type { translations as enTranslations } from "../en";

import { translations as jobsTranslations  } from "../../jobs/i18n/pl";
import { translations as statusTranslations  } from "../../status/i18n/pl";

export const translations: typeof enTranslations = {
  jobs: jobsTranslations,
  status: statusTranslations,
  enums: {
    csvImportJobStatus: {
      pending: "Oczekujący",
      processing: "W trakcie",
      completed: "Zakończony", 
      failed: "Nieudany"
    },
    csvImportJobAction: {
      retry: "Ponów",
      delete: "Usuń",
      stop: "Zatrzymaj"
    },
    importMode: {
      createOnly: "Tylko tworzenie",
      updateOnly: "Tylko aktualizacja", 
      createOrUpdate: "Tworzenie lub aktualizacja",
      skipDuplicates: "Pomiń duplikaty"
    },
    importFormat: {
      csv: "CSV",
      tsv: "TSV", 
      json: "JSON"
    },
    importProcessingType: {
      immediate: "Natychmiastowe",
      chunked: "Fragmentami",
      scheduled: "Zaplanowane"
    },
    importErrorType: {
      validationError: "Błąd walidacji",
      duplicateEmail: "Duplikat e-maila",
      invalidFormat: "Niepoprawny format",
      missingRequiredField: "Brak wymaganego pola",
      processingError: "Błąd przetwarzania",
      systemError: "Błąd systemu"
    },
    batchProcessingStatus: {
      pending: "Oczekujący", 
      processing: "W trakcie",
      completed: "Zakończony",
      failed: "Nieudany",
      retrying: "Ponowienie"
    },
    importPriority: {
      low: "Niski",
      normal: "Normalny",
      high: "Wysoki",
      urgent: "Pilny"
    },
    importSource: {
      webUpload: "Upload web",
      apiUpload: "Upload API",
      scheduledImport: "Import zaplanowany",
      bulkOperation: "Operacja masowa"
    },
    csvDelimiter: {
      comma: "Przecinek",
      semicolon: "Średnik", 
      tab: "Tabulator",
      pipe: "Kreska pionowa"
    },
    importValidationLevel: {
      strict: "Ścisły",
      moderate: "Umiarkowany",
      lenient: "Łagodny"
    },
    importNotificationType: {
      email: "E-mail",
      inApp: "W aplikacji",
      webhook: "Webhook", 
      none: "Brak"
    }
  }
};