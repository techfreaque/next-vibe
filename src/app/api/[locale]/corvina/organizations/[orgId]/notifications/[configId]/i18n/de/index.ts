export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    notifications: "Benachrichtigungen",
  },
  post: {
    title: "Benachrichtigungskonfiguration aktualisieren",
    description: "Aktualisiert eine bestehende Benachrichtigungskonfiguration.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    configId: {
      label: "Konfigurations-ID",
      description: "Numerische ID der Benachrichtigungskonfiguration.",
    },
    event: {
      label: "Ereignis",
      description: "Der Typ des Benachrichtigungsereignisses.",
    },
    beforeDays: {
      label: "Tage vorher",
      description: "Benachrichtigung so viele Tage vor dem Ereignis auslösen.",
    },
    afterDays: {
      label: "Tage nachher",
      description: "Benachrichtigung so viele Tage nach dem Ereignis auslösen.",
    },
    emailBcc: {
      label: "E-Mail BCC",
      description: "Zusätzliche BCC-E-Mail-Adresse für Benachrichtigungen.",
      placeholder: "bcc@beispiel.de",
    },
    response: {
      id: "ID",
      organizationId: "Organisations-ID",
      event: "Ereignis",
      beforeDays: "Tage vorher",
      afterDays: "Tage nachher",
      emailBcc: "E-Mail BCC",
      lastCheck: "Letzte Prüfung",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage an Corvina war fehlerhaft.",
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
        description:
          "Der API-Schlüssel hat keinen Zugriff zum Aktualisieren von Konfigurationen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Konfiguration mit dieser ID gefunden.",
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
      title: "Aktualisiert",
      description: "Benachrichtigungskonfiguration erfolgreich aktualisiert.",
    },
    submitButton: {
      label: "Änderungen speichern",
      loadingText: "Wird gespeichert...",
    },
    widget: {
      labels: {
        bcc: "bcc",
        before: "vorher",
        after: "nachher",
        deleted: "GELÖSCHT",
        updated: "Aktualisiert",
        deleted2: "Gelöscht",
      },
    },
  },
  delete: {
    title: "Benachrichtigungskonfiguration löschen",
    description: "Löscht eine Benachrichtigungskonfiguration.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    configId: {
      label: "Konfigurations-ID",
      description: "Numerische ID der Benachrichtigungskonfiguration.",
    },
    response: {
      id: "ID",
      organizationId: "Organisations-ID",
      event: "Ereignis",
      beforeDays: "Tage vorher",
      afterDays: "Tage nachher",
      emailBcc: "E-Mail BCC",
      lastCheck: "Letzte Prüfung",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage an Corvina war fehlerhaft.",
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
        description:
          "Der API-Schlüssel hat keinen Zugriff zum Löschen von Konfigurationen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Konfiguration mit dieser ID gefunden.",
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
      title: "Gelöscht",
      description: "Benachrichtigungskonfiguration erfolgreich gelöscht.",
    },
  },
};
