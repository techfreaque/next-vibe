import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Beratungsverwaltung",
  tag: "beratung",

  get: {
    title: "Beratungsliste",
    description: "Admin-Beratungsliste Endpunkt",
    category: "Beratungsverwaltung",
    tag: "beratung",
    container: {
      title: "Beratungsliste",
      description: "Beratungen verwalten und anzeigen",
    },
    search: {
      label: "Suchen",
      description: "Beratungen suchen",
      placeholder: "Nach Name, E-Mail suchen...",
    },
    status: {
      label: "Status",
      description: "Nach Status filtern",
      placeholder: "Status auswählen",
    },
    page: {
      label: "Seite",
      description: "Seitennummer",
      placeholder: "Seitennummer",
    },
    limit: {
      label: "Limit",
      description: "Elemente pro Seite",
      placeholder: "Elemente pro Seite",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Sortierfeld",
      placeholder: "Nach Feld sortieren",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Sortierrichtung",
      placeholder: "Sortierrichtung",
    },
    dateFrom: {
      label: "Datum von",
      description: "Von Datum filtern",
      placeholder: "Von Datum",
    },
    dateTo: {
      label: "Datum bis",
      description: "Bis Datum filtern",
      placeholder: "Bis Datum",
    },
    userEmail: {
      label: "Benutzer E-Mail",
      description: "Nach Benutzer E-Mail filtern",
      placeholder: "Benutzer E-Mail",
    },
    columns: {
      id: "ID",
      userName: "Name",
      userEmail: "E-Mail",
      status: "Status",
      preferredDate: "Bevorzugtes Datum",
      preferredTime: "Bevorzugte Zeit",
      createdAt: "Erstellt am",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen erkannt",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },

    // Consultation field structure for nested references
    consultation: {
      title: "Beratung",
      description: "Individuelle Beratungsdaten",
      id: "ID",
      userId: "Benutzer-ID",
      leadId: "Lead-ID",
      userName: "Benutzername",
      userEmail: "Benutzer-E-Mail",
      status: "Status",
      preferredDate: "Bevorzugtes Datum",
      preferredTime: "Bevorzugte Zeit",
      message: "Nachricht",
      isNotified: "Benachrichtigt",
      scheduledDate: "Geplantes Datum",
      scheduledTime: "Geplante Zeit",
      calendarEventId: "Kalender-Event-ID",
      meetingLink: "Meeting-Link",
      icsAttachment: "ICS-Anhang",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      userBusinessType: "Geschäftstyp",
      userContactPhone: "Kontakt-Telefon",
      leadEmail: "Lead-E-Mail",
      leadBusinessName: "Lead-Firmenname",
      leadPhone: "Lead-Telefon",
    },

    pagination: {
      title: "Paginierung",
      description: "Paginierungsinformationen",
      page: "Seite",
      limit: "Limit",
      total: "Gesamt",
      totalPages: "Gesamtseiten",
    },
  },
  response: {
    consultations: "Beratungen",
    consultation: {
      id: "ID",
      userId: "Benutzer-ID",
      leadId: "Lead-ID",
      userName: "Benutzername",
      userEmail: "Benutzer-E-Mail",
      status: "Status",
      preferredDate: "Bevorzugtes Datum",
      preferredTime: "Bevorzugte Zeit",
      message: "Nachricht",
      isNotified: "Benachrichtigt",
      scheduledDate: "Geplantes Datum",
      scheduledTime: "Geplante Zeit",
      calendarEventId: "Kalender-Event-ID",
      meetingLink: "Meeting-Link",
      icsAttachment: "ICS-Anhang",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      userBusinessType: "Geschäftstyp",
      userContactPhone: "Kontakt-Telefon",
      leadEmail: "Lead-E-Mail",
      leadBusinessName: "Lead-Firmenname",
      leadPhone: "Lead-Telefon",
    },
    pagination: {
      page: "Seite",
      limit: "Limit",
      total: "Gesamt",
      totalPages: "Gesamtseiten",
    },
  },
};
