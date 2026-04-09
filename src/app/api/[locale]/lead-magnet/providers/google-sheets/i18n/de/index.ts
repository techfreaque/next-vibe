export const translations = {
  title: "Google Sheets",
  description:
    "Jeden neuen Lead automatisch als Zeile in dein Google Sheet eintragen. Google-Konto verbinden — keine API-Schlüssel nötig.",
  connect: {
    label: "Google-Konto verbinden",
    description:
      "Mit Google anmelden, um Zugriff auf deine Tabellen zu erlauben",
  },
  connected: {
    label: "Verbunden",
    description: "Dein Google-Konto ist verbunden",
  },
  spreadsheetId: {
    label: "Tabelle",
    description: "Wähle die Tabelle aus, in die neue Leads eingetragen werden",
    placeholder: "Tabelle auswählen…",
  },
  sheetTab: {
    label: "Tabellenblatt (optional)",
    description:
      "Der Name des Tabellenblatts. Leer lassen, um das erste Blatt zu verwenden.",
    placeholder: "z.B. Leads",
  },
  saveTag: "lead-magnet-google-sheets",
  saveTitle: "Google-Sheets-Einstellung speichern",
  saveDescription: "Google Sheet mit deinem Lead-Magnet verbinden",
  saveSuccess: {
    title: "Verbunden",
    description: "Neue Leads erscheinen als Zeilen in deiner Tabelle.",
  },
  oauthStart: {
    title: "Google Sheets verbinden",
    description: "Google-OAuth-Flow starten, um Tabellenzugriff zu genehmigen",
  },
  oauthCallback: {
    title: "Google Sheets OAuth Callback",
    description: "Verarbeitet den OAuth-Code nach der Google-Weiterleitung",
  },
  sheetsList: {
    title: "Tabellen auflisten",
    description:
      "Gibt die Liste der für das verbundene Google-Konto zugänglichen Tabellen zurück",
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
      description: "Ressource nicht gefunden",
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
    oauthFailed: "Google-Autorisierung fehlgeschlagen. Bitte erneut versuchen.",
    noRefreshToken:
      "Google hat kein Refresh-Token zurückgegeben. Bitte Konto trennen und neu verbinden.",
    sheetsApiFailed:
      "Tabellen konnten nicht geladen werden. Google-Verbindung prüfen.",
    appendFailed:
      "Konnte nicht in Google Sheet schreiben. Token ist möglicherweise abgelaufen.",
  },
  response: {
    provider: "Anbieter",
    isActive: "Aktiv",
    spreadsheetId: "Tabellen-ID",
    sheetTab: "Tabellenblatt",
    sheets: "Tabellen",
    connected: "Verbunden",
  },
  widget: {
    connectTitle: "Google Sheets verbinden",
    connectDescription:
      "Mit Google anmelden, um jeden neuen Lead automatisch als Zeile in deine Tabelle einzutragen.",
    redirectNote:
      "Du wirst zu Google weitergeleitet, um Zugriff auf deine Tabellen zu erlauben.",
    reconnect: "Neu verbinden",
    loading: "Tabellen werden geladen…",
    noSheets: "Keine Tabellen gefunden",
    refresh: "Liste aktualisieren",
    selectRequired: "Bitte wähle eine Tabelle aus",
    saveFailed: "Speichern fehlgeschlagen. Bitte erneut versuchen.",
    saving: "Wird gespeichert…",
  },
};
