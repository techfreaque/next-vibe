import type { translations as enTranslations } from "../en";

import { translations as jobsTranslations  } from "../../jobs/i18n/de";
import { translations as statusTranslations  } from "../../status/i18n/de";

export const translations: typeof enTranslations = {
  jobs: jobsTranslations,
  status: statusTranslations,
  enums: {
    csvImportJobStatus: {
      pending: "Ausstehend",
      processing: "In Bearbeitung",
      completed: "Abgeschlossen", 
      failed: "Fehlgeschlagen"
    },
    csvImportJobAction: {
      retry: "Wiederholen",
      delete: "Löschen",
      stop: "Stoppen"
    },
    importMode: {
      createOnly: "Nur erstellen",
      updateOnly: "Nur aktualisieren", 
      createOrUpdate: "Erstellen oder aktualisieren",
      skipDuplicates: "Duplikate überspringen"
    },
    importFormat: {
      csv: "CSV",
      tsv: "TSV", 
      json: "JSON"
    },
    importProcessingType: {
      immediate: "Sofort",
      chunked: "Stückweise",
      scheduled: "Geplant"
    },
    importErrorType: {
      validationError: "Validierungsfehler",
      duplicateEmail: "Doppelte E-Mail",
      invalidFormat: "Ungültiges Format",
      missingRequiredField: "Pflichtfeld fehlt",
      processingError: "Verarbeitungsfehler",
      systemError: "Systemfehler"
    },
    batchProcessingStatus: {
      pending: "Ausstehend", 
      processing: "In Bearbeitung",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      retrying: "Wird wiederholt"
    },
    importPriority: {
      low: "Niedrig",
      normal: "Normal",
      high: "Hoch",
      urgent: "Dringend"
    },
    importSource: {
      webUpload: "Web-Upload",
      apiUpload: "API-Upload",
      scheduledImport: "Geplanter Import",
      bulkOperation: "Massenoperation"
    },
    csvDelimiter: {
      comma: "Komma",
      semicolon: "Semikolon", 
      tab: "Tab",
      pipe: "Pipe"
    },
    importValidationLevel: {
      strict: "Streng",
      moderate: "Mäßig",
      lenient: "Nachsichtig"
    },
    importNotificationType: {
      email: "E-Mail",
      inApp: "In-App",
      webhook: "Webhook", 
      none: "Keine"
    }
  }
};