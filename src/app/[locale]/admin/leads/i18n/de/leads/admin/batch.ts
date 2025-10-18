import type { translations as EnglishBatchTranslations } from "../../../en/leads/admin/batch";

export const translations: typeof EnglishBatchTranslations = {
  filter_count: "{{total}} Leads entsprechen den aktuellen Filtern",
  current_page_count: "{{count}} Leads auf Seite {{page}}",
  scope_current_page: "Aktuelle Seite",
  scope_all_pages: "Alle Seiten",
  preview: "Änderungen vorschau",
  apply: "Änderungen anwenden",
  delete: "Löschen",
  select_action: "Aktion auswählen",
  select_value: "Wert auswählen",
  actions: {
    update_status: "Status aktualisieren",
    update_stage: "Kampagnen-Phase aktualisieren",
    update_source: "Quelle aktualisieren",
    delete: "Leads löschen",
  },
  preview_title: "Batch-Update Vorschau",
  delete_preview_title: "Batch-Löschung Vorschau",
  confirm_title: "Batch-Update bestätigen",
  delete_confirm: {
    title: "Batch-Löschung bestätigen",
  },
  result_title: "Batch-Operation Ergebnisse",
  preview_description: "{{count}} Leads überprüfen, die aktualisiert werden",
  delete_preview_description:
    "{{count}} Leads überprüfen, die gelöscht werden. Diese Aktion kann nicht rückgängig gemacht werden.",
  planned_changes: "Geplante Änderungen",
  change_status: "Status → {{status}}",
  change_stage: "Kampagnen-Phase → {{stage}}",
  change_source: "Quelle → {{source}}",
  confirm_update: "Update bestätigen",
  confirm_delete: "Löschung bestätigen",
  success_message: "{{updated}} von {{total}} Leads erfolgreich aktualisiert",
  delete_success_message:
    "{{deleted}} von {{total}} Leads erfolgreich gelöscht",
  error_message:
    "Fehler beim Aktualisieren der Leads. Bitte versuchen Sie es erneut.",
  errors_title: "Fehler ({{count}})",
  processing: "Verarbeitung...",
  close: "Schließen",
  results: {
    title: "Ergebnisse der Batch-Operation",
  },
  confirm: {
    title: "Batch-Aktualisierung bestätigen",
  },
};
