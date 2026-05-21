export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Gerätelizenzen",
    subscription: "Abonnement",
  },
  get: {
    title: "Geräte-Abonnement",
    description: "Abonnementdetails für ein bestimmtes Gerät abrufen.",
    logicalId: {
      label: "Geräte-ID",
      description: "Logische Corvina-ID des Geräts.",
    },
    response: {
      logicalId: "Geräte-ID",
      orgResourceId: "Org-Ressourcen-ID",
      clientEmail: "Kunden-E-Mail",
      trialStartDate: "Teststart",
      subscriptionEndDate: "Abonnementende",
      effectiveStartDate: "Effektiver Start",
      effectiveEndDate: "Effektives Ende",
      status: "Status",
      daysUntilExpiry: "Tage bis Ablauf",
    },
    status: {
      trial: "Testphase",
      active: "Aktiv",
      expiringSoon: "Läuft bald ab",
      expired: "Abgelaufen",
      noSubscription: "Kein Abonnement",
    },
    widget: {
      title: "Abonnement",
      editButton: "Bearbeiten",
      requestLicense: "Lizenz anfragen",
      notFound:
        "Kein Abonnementeintrag gefunden. Standardmäßig gilt eine 30-tägige Testphase ab dem Aktivierungsdatum.",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Geräte-ID ist erforderlich.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich.",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung für Abonnementdaten.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Abonnementeintrag für dieses Gerät.",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten.",
      },
      server: { title: "Serverfehler", description: "Interner Serverfehler." },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: { title: "Erfolg", description: "Abonnementdetails abgerufen." },
  },
  post: {
    title: "Geräte-Abonnement aktualisieren",
    description:
      "Abonnementzeitraum und Kunden-E-Mail für ein Gerät festlegen oder aktualisieren.",
    logicalId: {
      label: "Geräte-ID",
      description: "Logische Corvina-ID des Geräts.",
    },
    orgResourceId: {
      label: "Org-Ressourcen-ID",
      description: "Org-Ressourcen-ID des Geräts.",
    },
    clientEmail: {
      label: "Kunden-E-Mail",
      description: "E-Mail-Adresse für Erinnerungen.",
    },
    trialStartDate: {
      label: "Teststart-Datum",
      description:
        "Teststart überschreiben. Leer lassen für Aktivierungsdatum.",
    },
    subscriptionEndDate: {
      label: "Abonnementend-Datum",
      description:
        "Abonnementende überschreiben. Leer lassen für Start + 30 Tage.",
    },
    widget: {
      title: "Abonnement bearbeiten",
      back: "Zurück",
      result: { title: "Abonnement aktualisiert" },
    },
    submitButton: {
      label: "Abonnement speichern",
      loadingText: "Wird gespeichert...",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Bitte Felder prüfen.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich.",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung zum Aktualisieren.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Gerät nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten.",
      },
      server: { title: "Serverfehler", description: "Interner Serverfehler." },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: {
      title: "Aktualisiert",
      description: "Abonnement erfolgreich aktualisiert.",
    },
  },
};
