import type { translations as enTranslations } from "../en";

/**
*

* Business Data Social subdomain translations for German
*/

export const translations: typeof enTranslations = {
  category: "Geschäftsdaten",
  tags: {
    social: "Soziale Medien",
    platforms: "Plattformen",
    update: "Aktualisieren",
  },

  // GET endpoint translations
  get: {
    title: "Social Media Daten Abrufen",
    description:
      "Social Media Plattforminformationen für das Unternehmen abrufen",
    form: {
      title: "Social Media Datenanfrage",
      description: "Anfrageformular für Social Media Datenabruf",
    },
    response: {
      title: "Social Media Antwort",
      description: "Social Media Plattformdaten mit Vollständigkeitsstatus",
      platforms: "Social Media Plattformen",
      contentStrategy: "Content-Strategie",
      postingFrequency: "Posting-Häufigkeit",
      goals: "Social Media Ziele",
      completionStatus: {
        title: "Bearbeitungsstatus des Abschnitts",
        description: "Social Media Vollständigkeitsstatus Informationen",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfragedaten bereitgestellt",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Authentifizierung erforderlich für Zugriff auf Social Media Daten",
      },
      server: {
        title: "Serverfehler",
        description:
          "Interner Serverfehler beim Abrufen der Social Media Daten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Abrufen der Social Media Daten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf diese Social Media Daten ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Social Media Daten nicht gefunden",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Es gibt nicht gespeicherte Änderungen, die zuerst gespeichert werden müssen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt beim Abrufen der Social Media Daten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Social Media Daten erfolgreich abgerufen",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Social Media Daten Aktualisieren",
    description:
      "Social Media Plattforminformationen für das Unternehmen aktualisieren",
    form: {
      title: "Social Media Aktualisierungsformular",
      description: "Aktualisierungsformular für Social Media Plattformdaten",
    },
    platforms: {
      label: "Social Media Plattformen",
      description:
        "Liste der Social Media Plattformen mit Benutzernamen und Einstellungen",
      placeholder: "Fügen Sie Ihre Social Media Plattformen hinzu",
    },
    contentStrategy: {
      label: "Content-Strategie",
      description: "Social Media Content-Strategie und Ansatz",
      placeholder: "Beschreiben Sie Ihre Content-Strategie...",
    },
    postingFrequency: {
      label: "Posting-Frequenz",
      description: "Wie oft Inhalte in sozialen Medien gepostet werden",
      placeholder: "z.B. Täglich, 3x pro Woche, etc.",
    },
    goals: {
      label: "Social Media Ziele",
      description: "Geschäftsziele für Social Media Präsenz",
      placeholder: "Beschreiben Sie Ihre Social Media Ziele...",
    },
    response: {
      title: "Aktualisierungsantwort",
      description: "Ergebnis der Social Media Datenaktualisierung",
      message: "Aktualisierungsstatusmeldung",
      platforms: "Social Media Plattformen aktualisiert",
      contentStrategy: "Content-Strategie aktualisiert",
      postingFrequency: "Posting-Häufigkeit aktualisiert",
      goals: "Social Media Ziele aktualisiert",
      completionStatus: {
        title: "Bearbeitungsstatus aktualisiert",
        description: "Social Media Vollständigkeitsstatus wurde aktualisiert",
        isComplete: "Social Update vollständig",
        completedFields: "Social Update abgeschlossene Felder",
        totalFields: "Social Update Gesamtfelder",
        completionPercentage: "Social Update Vollständigkeitsprozentsatz",
        missingRequiredFields: "Social Update fehlende Pflichtfelder",
      },
    },
    additionalNotes: {
      label: "Zusätzliche Notizen",
      description: "Weitere Informationen zu Ihrer Social Media Strategie",
      placeholder: "Fügen Sie weitere relevante Informationen hinzu...",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Social Media Daten bereitgestellt",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Authentifizierung erforderlich für Aktualisierung der Social Media Daten",
      },
      server: {
        title: "Serverfehler",
        description:
          "Interner Serverfehler beim Aktualisieren der Social Media Daten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Aktualisieren der Social Media Daten",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie dürfen Social Media Daten nicht aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Social Media Daten nicht gefunden",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Es gibt nicht gespeicherte Änderungen, die zuerst gespeichert werden müssen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt beim Aktualisieren der Social Media Daten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Social Media Daten erfolgreich aktualisiert",
      message: "Social Media Daten erfolgreich aktualisiert",
    },
  },

  // Individual completion status field translations
  isComplete: "Social vollständig",
  completedFields: "Social abgeschlossene Felder",
  totalFields: "Social Gesamtfelder",
  completionPercentage: "Social Vollständigkeitsprozentsatz",
  missingRequiredFields: "Social fehlende Pflichtfelder",

  // Enum translations
  enums: {
    socialPlatform: {
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      tiktok: "TikTok",
      youtube: "YouTube",
      pinterest: "Pinterest",
      snapchat: "Snapchat",
      discord: "Discord",
      reddit: "Reddit",
      telegram: "Telegram",
      whatsapp: "WhatsApp",
      other: "Andere",
    },
    platformPriority: {
      high: "Hoch",
      medium: "Mittel",
      low: "Niedrig",
    },
  },
};
