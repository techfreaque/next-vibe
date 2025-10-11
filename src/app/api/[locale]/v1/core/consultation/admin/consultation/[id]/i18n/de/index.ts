import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Beratungsverwaltung",
  tag: "beratung",

  get: {
    title: "Beratung abrufen",
    description: "Beratung nach ID abrufen",
    category: "Beratungsverwaltung",
    tag: "beratung",
    container: {
      title: "Beratungsdetails",
      description: "Beratungsinformationen und Details anzeigen",
    },
    form: {
      title: "Beratung abrufen Konfiguration",
      description: "Parameter für Beratungsabruf konfigurieren",
    },
    id: {
      label: "Beratungs-ID",
      description: "Eindeutige Kennung für die Beratung",
    },
    userId: {
      label: "Benutzer-ID",
      description: "ID des Benutzers, der die Beratung gebucht hat",
    },
    leadId: {
      label: "Lead-ID",
      description: "Zugehörige Lead-ID für diese Beratung",
    },
    status: {
      label: "Status",
      description: "Aktueller Status der Beratung",
    },
    message: {
      label: "Nachricht",
      description: "Beratungsnachricht oder Notizen",
    },
    userEmail: {
      label: "Benutzer-E-Mail",
      description: "E-Mail-Adresse des Beratungsteilnehmers",
    },
    userName: {
      label: "Benutzername",
      description: "Name des Beratungsteilnehmers",
    },
    userBusinessType: {
      label: "Unternehmenstyp",
      description: "Art des Unternehmens, das der Benutzer betreibt",
    },
    userContactPhone: {
      label: "Kontakttelefon",
      description: "Telefonnummer für Beratungskontakt",
    },
    preferredDate: {
      label: "Bevorzugtes Datum",
      description: "Vom Benutzer bevorzugtes Beratungsdatum",
    },
    preferredTime: {
      label: "Bevorzugte Zeit",
      description: "Vom Benutzer bevorzugte Beratungszeit",
    },
    scheduledDate: {
      label: "Geplantes Datum",
      description: "Tatsächlich geplantes Beratungsdatum",
    },
    scheduledTime: {
      label: "Geplante Zeit",
      description: "Tatsächlich geplante Beratungszeit",
    },
    calendarEventId: {
      label: "Kalender-Event-ID",
      description: "Kalender-System-Event-Identifikator",
    },
    meetingLink: {
      label: "Meeting-Link",
      description: "Online-Meeting-URL für die Beratung",
    },
    icsAttachment: {
      label: "ICS-Anhang",
      description: "Kalenderdatei-Anhangsdaten",
    },
    isNotified: {
      label: "Benachrichtigung gesendet",
      description: "Ob eine Benachrichtigung an den Teilnehmer gesendet wurde",
    },
    createdAt: {
      label: "Erstellt am",
      description: "Datum und Zeit der Beratungserstellung",
    },
    response: {
      title: "Antwort",
      description: "Beratungsantwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen, die verloren gehen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
  patch: {
    title: "Beratung aktualisieren",
    description: "Beratung nach ID aktualisieren",
    category: "Beratungsverwaltung",
    tag: "beratung",
    container: {
      title: "Beratung aktualisieren",
      description: "Beratungsdetails und Status ändern",
    },
    form: {
      title: "Beratung aktualisieren Konfiguration",
      description: "Parameter für Beratungsaktualisierung konfigurieren",
    },
    id: {
      label: "Beratungs-ID",
      description: "Eindeutige Kennung für die Beratung",
      placeholder: "Beratungs-ID eingeben",
    },
    status: {
      label: "Status",
      description: "Aktueller Status der Beratung",
      placeholder: "Beratungsstatus auswählen",
    },
    scheduledDate: {
      label: "Geplantes Datum",
      description: "Datum und Uhrzeit für die geplante Beratung",
      placeholder: "Geplantes Datum und Uhrzeit auswählen",
    },
    scheduledTime: {
      label: "Geplante Zeit",
      description: "Zeit für die geplante Beratung",
      placeholder: "Geplante Zeit auswählen",
    },
    calendarEventId: {
      label: "Kalender-Event-ID",
      description: "Kalender-System-Event-Identifikator",
      placeholder: "Kalender-Event-ID eingeben",
    },
    meetingLink: {
      label: "Meeting-Link",
      description: "Online-Meeting-URL für die Beratung",
      placeholder: "Meeting-Link-URL eingeben",
    },
    icsAttachment: {
      label: "ICS-Anhang",
      description: "Kalenderdatei-Anhangsdaten",
      placeholder: "ICS-Anhangsdaten eingeben",
    },
    isNotified: {
      label: "Benachrichtigung gesendet",
      description: "Ob eine Benachrichtigung an den Teilnehmer gesendet wurde",
    },
    message: {
      label: "Nachricht",
      description: "Beratungsnachricht oder Notizen",
      placeholder: "Beratungsnachricht eingeben",
    },
    userId: {
      label: "Benutzer-ID",
      description: "ID des Benutzers, der die Beratung gebucht hat",
    },
    leadId: {
      label: "Lead-ID",
      description: "Zugehörige Lead-ID für diese Beratung",
    },
    userEmail: {
      label: "Benutzer-E-Mail",
      description: "E-Mail-Adresse des Beratungsteilnehmers",
    },
    userName: {
      label: "Benutzername",
      description: "Name des Beratungsteilnehmers",
    },
    response: {
      title: "Antwort",
      description: "Aktualisierte Beratungsantwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen, die verloren gehen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
