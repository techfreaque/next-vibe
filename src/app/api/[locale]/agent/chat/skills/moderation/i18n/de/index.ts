export const translations = {
  category: "KI-Skills",
  tags: {
    moderation: "Moderation",
  },
  get: {
    title: "Gemeldete Skills",
    description: "Skills mit Meldungen, sortiert nach Anzahl der Meldungen",
    fields: {
      minReports: {
        label: "Min. Meldungen",
        description: "Mindestanzahl an Meldungen (Standard: 1)",
      },
      limit: {
        label: "Limit",
        description: "Maximale Anzahl zurückzugebender Skills",
      },
      offset: {
        label: "Offset",
        description: "Anzahl übersprungener Skills für Paginierung",
      },
    },
    response: {
      skills: {
        id: { content: "Skill-ID" },
        name: { content: "Name" },
        ownerAuthorId: { content: "Eigentümer-ID" },
        status: { content: "Status" },
        reportCount: { content: "Meldungen" },
        voteCount: { content: "Stimmen" },
        trustLevel: { content: "Vertrauensstufe" },
        publishedAt: { content: "Veröffentlicht am" },
        updatedAt: { content: "Aktualisiert am" },
      },
      totalCount: { content: "Gesamt" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugriff erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Admin-Zugriff erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Skills gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Laden der gemeldeten Skills",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt aufgetreten" },
    },
    success: {
      title: "Skills geladen",
      description: "Gemeldete Skills erfolgreich abgerufen",
    },
  },
  patch: {
    title: "Skill moderieren",
    description: "Gemeldeten Skill verbergen oder Meldungen zurücksetzen",
    fields: {
      id: {
        label: "Skill-ID",
        description: "ID des zu moderierenden Skills",
      },
      action: {
        label: "Aktion",
        description:
          "hide = Status auf UNLISTED setzen, clear = Meldungsanzahl auf 0 zurücksetzen",
      },
    },
    response: {
      id: { content: "Skill-ID" },
      status: { content: "Neuer Status" },
      reportCount: { content: "Meldungsanzahl" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugriff erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Admin-Zugriff erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Skill nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Moderieren des Skills",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt aufgetreten" },
    },
    success: {
      title: "Skill moderiert",
      description: "Aktion erfolgreich angewendet",
    },
  },
};
