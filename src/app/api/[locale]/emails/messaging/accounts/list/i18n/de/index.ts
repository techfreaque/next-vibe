import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Messaging-Konten",
  description: "SMS-, WhatsApp- und Telegram-Anbieterkonten verwalten",

  fields: {
    channel: { label: "Kanal", description: "Nach Kanal filtern" },
    status: { label: "Status", description: "Nach Status filtern" },
    search: {
      label: "Suche",
      description: "Nach Name suchen",
      placeholder: "Konten suchen...",
    },
    page: { label: "Seite", description: "Seitennummer" },
    limit: { label: "Limit", description: "Konten pro Seite" },
  },

  response: {
    account: {
      title: "Messaging-Konto",
      description: "Messaging-Anbieter-Kontodaten",
      id: "ID",
      name: "Name",
      channel: "Kanal",
      provider: "Anbieter",
      fromId: "Von",
      status: "Status",
      messagesSentTotal: "Gesamt gesendet",
      lastUsedAt: "Zuletzt verwendet",
      createdAt: "Erstellt",
    },
    pagination: {
      title: "Paginierung",
      description: "Paginierungsinfo",
      page: "Seite",
      limit: "Limit",
      total: "Gesamt",
      totalPages: "Gesamtseiten",
    },
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Parameter",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Adminzugang erforderlich",
    },
    forbidden: { title: "Verboten", description: "Zugriff verweigert" },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    conflict: { title: "Konflikt", description: "Datenkonflikt" },
    server: {
      title: "Serverfehler",
      description: "Konten konnten nicht abgerufen werden",
    },
    networkError: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
  },

  success: {
    title: "Konten abgerufen",
    description: "Konten erfolgreich abgerufen",
  },

  widget: {
    create: "Konto hinzufügen",
    refresh: "Aktualisieren",
    emptyState: "Keine Messaging-Konten konfiguriert",
    sent: "Gesendet",
    searchPlaceholder: "Konten suchen...",
  },
};
