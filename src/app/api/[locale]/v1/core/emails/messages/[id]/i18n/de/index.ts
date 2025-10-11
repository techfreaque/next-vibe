import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "E-Mail nach ID abrufen",
  description: "Eine einzelne E-Mail anhand ihrer eindeutigen Kennung abrufen",
  container: {
    title: "E-Mail-Details",
    description:
      "Detaillierte Informationen über eine bestimmte E-Mail anzeigen",
  },
  fields: {
    id: {
      label: "E-Mail-ID",
      description: "Eindeutige Kennung der abzurufenden E-Mail",
    },
  },
  response: {
    email: {
      title: "E-Mail-Details",
      description: "Vollständige Informationen über die angeforderte E-Mail",
      id: "E-Mail-ID",
      subject: "Betreff",
      recipientEmail: "Empfänger-E-Mail",
      recipientName: "Empfängername",
      senderEmail: "Absender-E-Mail",
      senderName: "Absendername",
      type: "E-Mail-Typ",
      status: "Status",
      templateName: "Vorlagenname",
      emailProvider: "E-Mail-Anbieter",
      externalId: "Externe ID",
      sentAt: "Gesendet am",
      deliveredAt: "Zugestellt am",
      openedAt: "Geöffnet am",
      clickedAt: "Geklickt am",
      retryCount: "Wiederholungsanzahl",
      error: "Fehlermeldung",
      userId: "Benutzer-ID",
      leadId: "Lead-ID",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
    },
  },
  get: {
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene E-Mail-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen authentifiziert sein, um E-Mail-Details einzusehen",
      },
      not_found: {
        title: "E-Mail nicht gefunden",
        description: "Keine E-Mail mit der angegebenen ID gefunden",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diese E-Mail anzuzeigen",
      },
      server: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Abrufen der E-Mail aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Die angegebene E-Mail-ID ist ungültig",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie müssen authentifiziert sein, um E-Mail-Details einzusehen",
    },
    notFound: {
      title: "E-Mail nicht gefunden",
      description: "Keine E-Mail mit der angegebenen ID gefunden",
    },
    forbidden: {
      title: "Verboten",
      description: "Sie haben keine Berechtigung, diese E-Mail anzuzeigen",
    },
    server: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Abrufen der E-Mail aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
  },
  success: {
    title: "E-Mail abgerufen",
    description: "E-Mail-Details erfolgreich abgerufen",
  },
};
