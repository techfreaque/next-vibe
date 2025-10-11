import type { listTranslations as EnglishListTranslations } from "../../../../en/sections/consultations/admin/list";

export const listTranslations: typeof EnglishListTranslations = {
  title: "Beratungsliste",
  search: "Beratungen suchen...",
  filters: {
    status: "Status",
    all: "Alle Status",
    dateFrom: "Von Datum",
    dateTo: "Bis Datum",
    userEmail: "Benutzer-E-Mail",
    sortBy: "Sortieren nach",
    sortOrder: "Sortierreihenfolge",
    ascending: "Aufsteigend",
    descending: "Absteigend",
  },
  table: {
    user: "Benutzer",
    status: "Status",
    preferredDate: "Gewünschtes Datum",
    scheduledDate: "Geplantes Datum",
    message: "Nachricht",
    businessType: "Geschäftstyp",
    createdAt: "Erstellt",
    actions: "Aktionen",
    view: "Anzeigen",
    edit: "Bearbeiten",
    noResults: "Keine Beratungen gefunden",
    loading: "Lade Beratungen...",
  },
  pagination: {
    showing: "Zeige {{start}} bis {{end}} von {{total}} Beratungen",
    previous: "Vorherige",
    next: "Nächste",
    page: "Seite {{page}} von {{totalPages}}",
  },
};
