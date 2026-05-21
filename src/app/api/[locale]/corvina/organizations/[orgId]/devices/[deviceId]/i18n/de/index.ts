export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Geräte" },
  get: {
    title: "Gerät",
    description: "Ruft ein einzelnes Corvina-Gerät ab.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    deviceId: {
      label: "Geräte-ID",
      description: "Numerische Corvina-Geräte-ID.",
    },
    response: {
      orgId: "Organisations-ID",
      deviceId: "Geräte-ID",
      label: "Bezeichnung",
      hwId: "Hardware-ID",
      orgResourceId: "Org-Ressourcen-ID",
      groups: "Gruppen",
      connected: "Verbunden",
      lastConnection: "Letzte Verbindung",
      lastDisconnection: "Letzte Trennung",
      firstRegistration: "Erstregistrierung",
      lastSeenIp: "Zuletzt gesehene IP",
    },
    widget: {
      edit: "Bearbeiten",
      delete: "Löschen",
      tags: "Tags",
      subscription: "Abonnement",
      loading: "Gerät wird geladen…",
      groups: "Gruppen",
      noSubscription: "Kein aktives Abonnement",
      noSubscriptionHint: "Lizenz aktivieren, um Funktionen freizuschalten.",
      trialStart: "Testbeginn",
      subscriptionEnd: "Abonnementende",
      clientEmail: "Kunden-E-Mail",
      sections: {
        identity: "Identität",
        connectivity: "Verbindung",
        subscription: "Abonnement",
        device: "Gerät",
      },
      labels: {
        label: "Bezeichnung",
        hwId: "Hardware-ID",
        orgResourceId: "Org-Ressourcen-ID",
        groups: "Gruppen",
        connected: "Status",
        online: "Online",
        offline: "Offline",
        lastConnection: "Letzte Verbindung",
        lastDisconnection: "Letzte Trennung",
        firstRegistration: "Erstregistrierung",
        lastSeenIp: "Letzte IP",
        subscriptionStatus: "Status",
        hwIdLabel: "Hardware-ID",
        orgResourceLabel: "Org-Ressource",
        backToDevice: "Zurück zum Gerät",
        changesSaved: "Gespeichert",
      },
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage war fehlerhaft.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Corvina API nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "CORVINA_API_KEY prüfen.",
      },
      forbidden: {
        title: "Verboten",
        description: "Kein Lesezugriff auf dieses Gerät.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Gerät nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina meldet einen Serverfehler.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: { title: "Erfolg", description: "Gerät geladen." },
  },
  patch: {
    title: "Gerät bearbeiten",
    info: "Aktualisiert Bezeichnung, Beschreibung und Seriennummer eines Corvina-Geräts.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    deviceId: {
      label: "Geräte-ID",
      description: "Numerische Corvina-Geräte-ID.",
    },
    label: {
      label: "Bezeichnung",
      description: "Anzeigename des Geräts.",
      placeholder: "Mein Gerät",
    },
    description: {
      label: "Beschreibung",
      description: "Optionale Beschreibung des Geräts.",
      placeholder: "Kurze Beschreibung",
    },
    serialNumber: {
      label: "Seriennummer",
      description: "Physische Seriennummer des Geräts.",
      placeholder: "SN-123456",
    },
    submitButton: { label: "Speichern", loadingText: "Wird gespeichert…" },
    editSubscription: "Abonnement bearbeiten",
    trialStartDate: {
      label: "Testbeginn",
      description: "Datum des Beginns der Testphase.",
    },
    subscriptionEndDate: {
      label: "Abonnementende",
      description: "Datum des Ablaufs des Abonnements.",
    },
    clientEmail: {
      label: "Kunden-E-Mail",
      description: "E-Mail-Adresse des Kunden für dieses Gerät.",
      placeholder: "kunde@beispiel.de",
    },
    subscription: {
      sectionTitle: "Abonnement",
    },
    errors: {
      validation: {
        title: "Ungültige Aktualisierung",
        description: "Corvina hat die Aktualisierung abgelehnt.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Corvina API nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "CORVINA_API_KEY prüfen.",
      },
      forbidden: {
        title: "Verboten",
        description: "Kein Schreibzugriff auf dieses Gerät.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Gerät nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina meldet einen Serverfehler.",
      },
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
      title: "Gespeichert",
      description: "Gerät erfolgreich aktualisiert.",
    },
  },
};
