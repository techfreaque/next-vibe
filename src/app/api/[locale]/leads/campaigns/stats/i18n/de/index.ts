export const translations = {
  title: "Kampagnen-Statistiken",
  description: "E-Mail-Kampagnen Leistungsstatistiken",
  get: {
    title: "Kampagnen-Statistiken",
    description: "E-Mail-Kampagnen Leistungsstatistiken abrufen",
    container: {
      title: "Filter",
      description: "Kampagnenstatistiken filtern",
    },
    fields: {
      journeyVariant: {
        label: "Journey-Variante",
        description: "Nach E-Mail-Journey-Variante filtern",
      },
    },
    response: {
      total: "Kampagnen gesamt",
      pending: "Ausstehend",
      sent: "Gesendet",
      delivered: "Zugestellt",
      opened: "Geöffnet",
      clicked: "Geklickt",
      failed: "Fehlgeschlagen",
      openRate: "Öffnungsrate",
      clickRate: "Klickrate",
      deliveryRate: "Zustellrate",
      failureRate: "Fehlerrate",
      byStage: "Nach Stufe",
      byJourneyVariant: "Nach Journey-Variante",
      byStatus: "Nach Status",
      pendingLeadsCount: "Aktive Leads in Kampagnen",
      emailsScheduledToday: "Heute geplante E-Mails",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Abrufen der Statistiken",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Eingabeparameter",
      },
    },
    success: {
      title: "Statistiken abgerufen",
      description: "Kampagnenstatistiken erfolgreich abgerufen",
    },
  },
  widget: {
    title: "Kampagnen-Performance",
    refresh: "Aktualisieren",
    noData: "Noch keine Kampagnendaten",
    openRateSuffix: "% Öffnung",
    clickRateSuffix: "% CTR",
    stageLabel: "Stufen-Funnel",
    statusLabel: "Sendestatus",
    variantLabel: "Nach Journey",
    emDash: "—",
  },
};
