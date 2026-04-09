export const translations = {
  list: {
    title: "Erfasste Leads",
    description: "Alle, die dein Lead-Magnet-Formular ausgefüllt haben",
    tag: "lead-magnet-captures",
    response: {
      items: "Leads",
      total: "Gesamt",
      page: "Seite",
      pageSize: "Seitengröße",
    },
    success: {
      title: "Leads geladen",
      description: "Deine erfassten Leads",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Überprüfe deine Eingabe",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Bitte einloggen",
      },
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Leads gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      internal: {
        title: "Serverfehler",
        description: "Ein interner Fehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
  },
  widget: {
    empty:
      "Noch keine Leads erfasst. Teile deine Skill-Seite, um mit dem Sammeln zu beginnen.",
    exportCsv: "CSV exportieren",
    columns: {
      date: "Datum",
      name: "Name",
      email: "E-Mail",
      status: "Status",
    },
    statusSuccess: "Erfasst",
    statusFailed: "Fehlgeschlagen",
  },
};
