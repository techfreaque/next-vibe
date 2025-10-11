import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  list: {
    title: "Beratungsliste",
    description: "Alle Beratungen anzeigen und verwalten",
    filters: {
      status: "Nach Status filtern",
      dateRange: "Datumsbereich",
      businessType: "Unternehmenstyp",
      searchPlaceholder: "Beratungen suchen...",
      clearFilters: "Filter löschen",
      applyFilters: "Filter anwenden",
    },
    table: {
      columns: {
        user: "Benutzer",
        email: "E-Mail",
        phone: "Telefon",
        status: "Status",
        businessType: "Unternehmenstyp",
        preferredDate: "Gewünschtes Datum",
        scheduledDate: "Geplantes Datum",
        message: "Nachricht",
        createdAt: "Erstellt",
        actions: "Aktionen",
      },
      actions: {
        edit: "Bearbeiten",
        delete: "Löschen",
        schedule: "Planen",
        complete: "Als abgeschlossen markieren",
        cancel: "Abbrechen",
      },
      pagination: {
        showing: "Zeige",
        of: "von",
        results: "Ergebnissen",
        previous: "Vorherige",
        next: "Nächste",
        page: "Seite",
      },
    },
    states: {
      loading: "Beratungen werden geladen...",
      noResults: "Keine Beratungen gefunden",
      error: "Fehler beim Laden der Beratungen",
    },
  },
};
