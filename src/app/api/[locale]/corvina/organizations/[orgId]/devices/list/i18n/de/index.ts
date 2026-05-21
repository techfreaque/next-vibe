export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Geräte" },
  get: {
    title: "Geräte",
    description: "Listet alle Geräte einer Corvina-Organisation.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    response: {
      devices: {
        id: "ID",
        label: "Bezeichnung",
        hwId: "Hardware-ID",
        orgResourceId: "Org-Ressourcen-ID",
        groups: "Gruppen",
        connected: "Verbunden",
        subscriptionStatus: "Abonnement",
        daysUntilExpiry: "Tage übrig",
      },
      total: "Gesamt",
      totalPages: "Seiten",
      currentPage: "Aktuelle Seite",
    },
    widget: {
      title: "Geräte",
      noDevicesFound: "Keine Geräte gefunden.",
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
        description: "Kein Lesezugriff auf diese Organisation.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Organisation nicht gefunden.",
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
    success: { title: "Erfolg", description: "Geräte geladen." },
  },
};
