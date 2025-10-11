import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../../en/sections/imapErrors/agent/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  emailIds: {
    description: "Liste der zu verarbeitenden E-Mail-IDs",
  },
  accountIds: {
    description:
      "Liste der Konto-IDs, von denen E-Mails verarbeitet werden sollen",
  },
  forceReprocess: {
    description: "Erneute Verarbeitung bereits verarbeiteter E-Mails erzwingen",
  },
  skipHardRules: {
    description: "Harte Regeln-Verarbeitungsphase überspringen",
  },
  skipAiProcessing: {
    description: "KI-Verarbeitungsphase überspringen",
  },
  priority: {
    description: "Verarbeitungspriorität",
  },
  dryRun: {
    description: "Testlauf ohne tatsächliche Änderungen durchführen",
  },
  emailId: {
    description: "E-Mail-ID zum Filtern",
  },
  accountId: {
    description: "Konto-ID zum Filtern",
  },
  status: {
    description: "Verarbeitungsstatus zum Filtern",
  },
  actionType: {
    description: "Aktionstyp zum Filtern",
  },
  dateFrom: {
    description: "Startdatum für Filterung",
  },
  dateTo: {
    description: "Enddatum für Filterung",
  },
  sortBy: {
    description: "Feld zum Sortieren der Ergebnisse",
  },
  sortOrder: {
    description: "Sortierreihenfolge (aufsteigend oder absteigend)",
  },
  page: {
    description: "Seitennummer für Paginierung",
  },
  limit: {
    description: "Anzahl der Elemente pro Seite",
  },
  confirmationId: {
    description: "Bestätigungsanfrage-ID",
  },
  confirmationAction: {
    description: "Auszuführende Aktion (genehmigen oder ablehnen)",
  },
  confirmationReason: {
    description: "Grund für die Bestätigungsentscheidung",
  },
  confirmationMetadata: {
    description: "Zusätzliche Metadaten für die Bestätigung",
  },
};
