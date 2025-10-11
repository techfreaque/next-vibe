import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  consultations: {
    nav: {
      stats: "Statistiken",
      list: "Listenansicht",
      calendar: "Kalenderansicht",
    },
    admin: {
      title: "Beratungen",
      description: "Beratungen und Termine verwalten",
      stats: {
        title: "Beratungsstatistiken",
        totalConsultations: "Gesamtberatungen",
        schedulingRate: "Terminplanungsrate",
        completionRate: "Abschlussrate",
        consultationsThisMonth: "Diesen Monat",
        consultationsByStatus: "Beratungen nach Status",
        businessTypeStats: "Unternehmenstyp-Verteilung",
        conversionStats: "Konversionsstatistiken",
        averageResponseTime: "Durchschnittliche Antwortzeit",
        requestToScheduled: "Anfrage bis Terminierung",
        scheduledToCompleted: "Terminiert bis Abgeschlossen",
        cancellationRate: "Stornierungsrate",
        noShowRate: "Nicht-Erscheinen-Rate",
        pending: "Ausstehend",
        hours: "Std.",
      },
      list: {
        title: "Beratungsliste",
        table: {
          loading: "Beratungen werden geladen...",
          noResults: "Keine Beratungen gefunden",
          user: "Benutzer",
          status: "Status",
          businessType: "Unternehmenstyp",
          preferredDate: "Gewünschtes Datum",
          scheduledDate: "Geplantes Datum",
          message: "Nachricht",
          createdAt: "Erstellt am",
          actions: "Aktionen",
        },
        pagination: {
          previous: "Vorherige",
          next: "Nächste",
        },
      },
      calendar: {
        title: "Beratungskalender",
      },
      create: {
        title: "Neue Beratung erstellen",
        description: "Einen neuen Beratungstermin planen",
      },
      actions: {
        createNew: "Neu erstellen",
        back: "Zurück",
        cancel: "Abbrechen",
        create: "Beratung erstellen",
        creating: "Wird erstellt...",
      },
      form: {
        selection: {
          title: "Auswahlmethode",
        },
        selectionType: {
          label: "Wie möchten Sie diese Beratung erstellen?",
          new: "Neuer Benutzer/Lead",
          user: "Bestehender Benutzer",
          lead: "Bestehender Lead",
        },
        contact: {
          title: "Kontaktinformationen",
        },
        business: {
          title: "Unternehmensinformationen",
        },
        name: {
          label: "Vollständiger Name",
        },
        email: {
          label: "E-Mail-Adresse",
        },
        phone: {
          label: "Telefonnummer",
        },
        businessType: {
          label: "Unternehmenstyp",
        },
        status: {
          label: "Status",
        },
        message: {
          label: "Nachricht",
        },
        preferredDate: {
          label: "Gewünschtes Datum",
        },
        preferredTime: {
          label: "Gewünschte Zeit",
        },
        scheduledDate: {
          label: "Geplantes Datum",
        },
        scheduledTime: {
          label: "Geplante Zeit",
        },
        calendarEventId: {
          label: "Kalender-Ereignis-ID",
        },
        meetingLink: {
          label: "Meeting-Link",
        },
        icsAttachment: {
          label: "ICS-Anhang",
        },
        isNotified: {
          label: "Ist benachrichtigt",
        },
        createdAt: {
          label: "Erstellt am",
        },
        city: {
          placeholder: "Stadt eingeben",
        },
        userSelect: {
          label: "Benutzer auswählen",
          placeholder: "Nach einem Benutzer suchen...",
        },
        leadSelect: {
          label: "Lead auswählen",
          placeholder: "Nach einem Lead suchen...",
        },
        search: {
          noResults: "Keine Ergebnisse gefunden",
        },
      },
      error: {
        title: "Fehler",
        description: "Ein Fehler ist beim Verarbeiten der Beratung aufgetreten",
      },
      selectors: {
        clearSelection: "Auswahl löschen",
        moreResults: "Weitere Ergebnisse laden",
      },
      emailPreview: {
        title: "E-Mail-Vorschau",
        preview: "E-Mail-Vorschau",
        collapse: "Einklappen",
        to: "An:",
        subject: "Betreff:",
        content: "Inhalt:",
        note: "Hinweis: Dies ist eine Vorschau der E-Mail, die gesendet wird.",
        subjectPrefix: "Der Betreff wird mit folgendem Präfix versehen:",
        defaultFirstName: "Max",
        defaultLastName: "Mustermann",
        defaultCompany: "Beispielunternehmen",
        defaultEmail: "max.mustermann@beispiel.de",
      },
      messageInput: {
        title: "Beratungsnachricht",
        customize: "Nachricht anpassen",
        collapse: "Einklappen",
        messagePreview: "Nachrichtenvorschau",
        placeholder: "Beratungsnachricht eingeben...",
        helpText: "Diese Nachricht wird in die Beratungs-E-Mail eingefügt.",
        resetToDefault: "Auf Standard zurücksetzen",
        defaultChallenges: "Social Media Marketing Herausforderungen",
        defaultGoals: "Markenbekanntheit und Engagement steigern",
      },
      errors: {
        unknown: {
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
      },
    },
  },
  consultation: {
    title: "Beratung",
    email: {
      noScheduledDate: "Kein geplantes Datum verfügbar",
      subject: "Beratungsbestätigung",
    },
  },
  common: {
    loading: "Lädt...",
  },
  leads: {
    admin: {
      actions: {
        refresh: "Aktualisieren",
      },
    },
    search: {
      placeholder: "Leads suchen...",
    },
  },
};
