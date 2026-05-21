export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Gerätelizenzen",
  },
  get: {
    title: "VPN-Job auslösen",
    description:
      "Löst den VPN-Hintergrundjob für Gerätelizenzen aus. Nur für Super-Admins.",
    now: {
      label: "Referenzzeitpunkt",
      description: "Optionaler Epoch-Zeitstempel (ms) als aktueller Zeitpunkt.",
      placeholder: "1704067200000",
    },
    response: {
      result: "Job-Ergebnis",
    },
    widget: {
      title: "VPN-Job",
      back: "Zurück",
      noResult: "Kein Ergebnis zurückgegeben.",
    },
    submitButton: {
      label: "VPN-Job auslösen",
      loadingText: "Wird ausgelöst...",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrageparameter sind ungültig.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Das Corvina-API ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat den API-Schlüssel abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Super-Admin-Berechtigung erforderlich.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Job-Endpunkt nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen internen Serverfehler gemeldet.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es liegen nicht gespeicherte Änderungen vor.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: {
      title: "VPN-Job ausgelöst",
      description: "VPN-Job erfolgreich ausgelöst.",
    },
  },
};
