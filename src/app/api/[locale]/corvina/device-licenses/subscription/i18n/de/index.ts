export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Geräte-Abonnements",
    subscription: "Abonnement",
  },
  get: {
    title: "Abonnementstatus Gerät",
    description:
      "Test- und Bezahlzeitraum eines Corvina-Geräts. Zeigt aktuellen Status, verbleibende Tage und Kontakt-E-Mail für Verlängerungserinnerungen.",
    logicalId: {
      label: "Geräte-ID",
      description: "Logische Corvina-ID des Geräts.",
    },
    response: {
      logicalId: "Geräte-ID",
      orgResourceId: "Organisation",
      clientEmail: "Kontakt-E-Mail",
      trialStartDate: "Teststart",
      subscriptionEndDate: "Abonnementende",
      effectiveStartDate: "Aktiv ab",
      effectiveEndDate: "Aktiv bis",
      status: "Status",
      daysUntilExpiry: "Verbleibende Tage",
    },
    status: {
      trial: "Testphase",
      active: "Aktiv",
      expiringSoon: "Läuft bald ab",
      expired: "Abgelaufen",
      noSubscription: "Kein Abonnement",
    },
    widget: {
      title: "Geräte-Abonnement",
      editButton: "Bearbeiten",
      requestRenewal: "Verlängerung anfragen",
      notFound:
        "Kein Abonnementeintrag. Standard: 30-tägige Testphase ab Aktivierungsdatum.",
      daysLeft: "T verbleibend",
      daysAgo: "T abgelaufen",
      loading: "Abonnement wird geladen…",
      noSubscription: "Kein Abonnement",
      noSubscriptionHint:
        "Standard: 30-tägige Testphase ab Aktivierungsdatum des Geräts.",
      sections: {
        subscription: "Abonnement",
      },
      effectiveFrom: "Aktiv ab",
      effectiveUntil: "Aktiv bis",
      trialStart: "Teststart",
      subscriptionEnd: "Abonnementende",
      clientEmail: "Kontakt-E-Mail",
      organization: "Organisation",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Geräte-ID ist erforderlich.",
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
        title: "Zugriff verweigert",
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
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler.",
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
      title: "Erfolg",
      description: "Abonnementstatus geladen.",
    },
  },
  post: {
    title: "Geräte-Abonnement setzen",
    description:
      "Teststart und Abonnementende für ein Gerät festlegen oder überschreiben. Kontakt-E-Mail für Ablauferinnerungen hinterlegen.",
    logicalId: {
      label: "Geräte-ID",
      description: "Logische Corvina-ID des Geräts.",
    },
    orgResourceId: {
      label: "Organisation",
      description: "Organisations-Ressourcen-ID des Geräts.",
    },
    clientEmail: {
      label: "Kontakt-E-Mail",
      description: "E-Mail-Adresse für Ablauferinnerungen.",
    },
    trialStartDate: {
      label: "Teststart",
      description:
        "Teststart überschreiben. Leer lassen für Aktivierungsdatum.",
    },
    subscriptionEndDate: {
      label: "Abonnementende",
      description:
        "Bezahltes Abonnementende setzen. Leer lassen für Testphase (Start + 30 Tage).",
    },
    widget: {
      title: "Abonnement bearbeiten",
      back: "Zurück",
      result: {
        title: "Abonnement gespeichert",
      },
      sections: {
        identity: "Gerät",
        subscription: "Abonnementdaten",
      },
    },
    submitButton: {
      label: "Speichern",
      loadingText: "Wird gespeichert…",
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
        title: "Zugriff verweigert",
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
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler.",
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
      title: "Gespeichert",
      description: "Abonnement aktualisiert.",
    },
  },
};
