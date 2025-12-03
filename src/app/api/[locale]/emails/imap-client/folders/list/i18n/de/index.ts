import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "IMAP-Ordner auflisten",
  description: "Liste der IMAP-Ordner abrufen",
  category: "API Endpunkt",
  tag: "Ordner",
  tags: {
    list: "Liste",
  },
  container: {
    title: "Ordner-Container",
    description: "Container für Ordner-Listendaten",
  },
  page: {
    label: "Seite",
    description: "Seitennummer für Paginierung",
    placeholder: "Seitennummer eingeben",
  },
  limit: {
    label: "Limit",
    description: "Anzahl der Elemente pro Seite",
    placeholder: "Limit eingeben",
  },
  accountId: {
    label: "Konto-ID",
    description: "Nach spezifischer Konto-ID filtern",
    placeholder: "Konto-ID eingeben",
  },
  search: {
    label: "Suchen",
    description: "Ordner nach Namen durchsuchen",
    placeholder: "Ordner suchen...",
  },
  specialUseType: {
    label: "Spezialverwendungstyp",
    description: "Nach Spezialverwendungs-Ordnertyp filtern",
    placeholder: "Ordnertyp auswählen",
  },
  syncStatus: {
    label: "Sync-Status",
    description: "Nach Synchronisationsstatus filtern",
    placeholder: "Sync-Status auswählen",
  },
  sortBy: {
    label: "Sortieren nach",
    description: "Feld zum Sortieren",
    placeholder: "Sortierfeld auswählen",
  },
  sortOrder: {
    label: "Sortierreihenfolge",
    description: "Sortierrichtung (aufsteigend oder absteigend)",
    placeholder: "Sortierreihenfolge auswählen",
  },
  response: {
    folders: {
      title: "Ordner",
    },
    folder: {
      title: "Ordner",
      description: "Ordnerdetails",
      id: "Ordner-ID",
      name: "Ordnername",
      displayName: "Anzeigename",
      path: "Ordnerpfad",
      isSelectable: "Auswählbar",
      hasChildren: "Hat Unterordner",
      specialUseType: "Spezialverwendung",
      messageCount: "Nachrichtenanzahl",
      unseenCount: "Ungelesene Anzahl",
      syncStatus: "Synchronisationsstatus",
      createdAt: "Erstellt am",
    },
    pagination: {
      title: "Paginierung",
      description: "Paginierungsinformationen",
      page: "Seite",
      limit: "Limit",
      total: "Gesamt",
      totalPages: "Gesamtseiten",
    },
  },
  info: {
    start: "Starte Ordner-Listen-Abruf",
  },
  errors: {
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, auf diese Ressource zuzugreifen",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein interner Serverfehler ist aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
  },
  success: {
    title: "Erfolg",
    description: "Ordner erfolgreich abgerufen",
  },
};
