export const translations = {
  tags: {
    messaging: "Messaging",
  },
  title: "Messenger-Konten",
  description: "Alle Messenger-Konten über alle Kanäle auflisten",
  fields: {
    channel: { label: "Kanal", description: "Nach Kanal filtern" },
    provider: { label: "Anbieter", description: "Nach Anbieter filtern" },
    status: { label: "Status", description: "Nach Status filtern" },
    search: {
      label: "Suche",
      description: "Nach Name oder Beschreibung suchen",
      placeholder: "Konten suchen...",
    },
    page: { label: "Seite", description: "Seitennummer" },
    limit: { label: "Limit", description: "Anzahl der Konten pro Seite" },
    sortBy: { label: "Sortieren nach", description: "Sortierfeld" },
    sortOrder: { label: "Sortierreihenfolge", description: "Sortierrichtung" },
  },
  response: {
    account: {
      title: "Konto",
      description: "Messenger-Konto-Details",
      id: "ID",
      name: "Name",
      channel: "Kanal",
      provider: "Anbieter",
      status: "Status",
      healthStatus: "Gesundheit",
      priority: "Priorität",
      messagesSentTotal: "Gesendete Nachrichten",
      lastUsedAt: "Zuletzt verwendet",
      createdAt: "Erstellt",
      isDefault: "Standard",
      smtpFromEmail: "Von E-Mail",
      fromId: "Von ID",
    },
    pagination: {
      title: "Seitennavigation",
      description: "Seitennavigationsinformationen",
      page: "Seite",
      limit: "Pro Seite",
      total: "Gesamt",
      totalPages: "Seiten gesamt",
    },
  },
  widget: {
    create: "Konto hinzufügen",
    refresh: "Aktualisieren",
    emptyState: "Keine Messenger-Konten konfiguriert",
    searchPlaceholder: "Konten suchen...",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Filterparameter",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Admin-Zugriff erforderlich",
    },
    forbidden: { title: "Verboten", description: "Zugriff verweigert" },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    conflict: { title: "Konflikt", description: "Datenkonflikt aufgetreten" },
    server: {
      title: "Serverfehler",
      description: "Konten konnten nicht abgerufen werden",
    },
    networkError: {
      title: "Netzwerkfehler",
      description: "Netzwerkkommunikation fehlgeschlagen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
  },
  success: {
    title: "Konten abgerufen",
    description: "Messenger-Konten erfolgreich abgerufen",
  },
};
