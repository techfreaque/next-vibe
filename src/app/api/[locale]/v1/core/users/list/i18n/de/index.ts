import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Benutzer auflisten",
  description: "Benutzer auflisten und durchsuchen mit Filterung",
  category: "Benutzer",
  tag: "Liste",
  container: {
    title: "Benutzerliste",
    description: "Benutzer durchsuchen und filtern",
  },
  fields: {
    limit: {
      label: "Grenze",
      description: "Anzahl der zurückzugebenden Benutzer",
      placeholder: "Grenze eingeben...",
    },
    page: {
      label: "Seite",
      description: "Seitenzahl für Paginierung",
      placeholder: "Seitenzahl eingeben...",
    },
    offset: {
      label: "Versatz",
      description: "Anzahl der zu überspringenden Benutzer",
    },
    search: {
      label: "Suchen",
      description: "Benutzer nach Name oder E-Mail durchsuchen",
      placeholder: "Suchbegriff eingeben...",
    },
    status: {
      label: "Status-Filter",
      description: "Benutzer nach Status filtern",
      placeholder: "Status auswählen...",
    },
    role: {
      label: "Rollen-Filter",
      description: "Benutzer nach Rolle filtern",
      placeholder: "Rolle auswählen...",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Feld zum Sortieren",
      placeholder: "Sortierfeld auswählen...",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Sortierrichtung",
      placeholder: "Sortierreihenfolge auswählen...",
    },
  },
  response: {
    summary: {
      title: "Benutzer-Zusammenfassung",
      description: "Zusammenfassungsstatistiken für die Benutzerliste",
    },
    users: {
      title: "Benutzer",
    },
    user: {
      title: "Benutzer",
      id: "Benutzer-ID",
      email: "E-Mail",
      firstName: "Vorname",
      lastName: "Nachname",
      company: "Unternehmen",
      phone: "Telefon",
      isActive: "Aktiv",
      emailVerified: "E-Mail verifiziert",
      role: "Rolle",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
    },
    total: {
      content: "Benutzer insgesamt",
    },
    page: {
      content: "Aktuelle Seite",
    },
    limit: {
      content: "Benutzer pro Seite",
    },
    totalPages: {
      content: "Seiten insgesamt",
    },
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
    forbidden: {
      title: "Verboten",
      description: "Zugriff verboten",
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
      description: "Sie haben ungespeicherte Änderungen, die verloren gehen",
    },
    internal: {
      title: "Interner Fehler",
      description:
        "Ein interner Fehler ist beim Auflisten der Benutzer aufgetreten",
    },
  },
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
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
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
  enums: {
    userSortField: {
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      email: "E-Mail",
      firstName: "Vorname",
      lastName: "Nachname",
      company: "Unternehmen",
      lastLogin: "Letzter Login",
    },
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    userStatusFilter: {
      all: "Alle",
      active: "Aktiv",
      inactive: "Inaktiv",
      pending: "Ausstehend",
      suspended: "Gesperrt",
      emailVerified: "E-Mail verifiziert",
      emailUnverified: "E-Mail nicht verifiziert",
    },
    userStatus: {
      active: "Aktiv",
      inactive: "Inaktiv",
      pending: "Ausstehend",
      suspended: "Gesperrt",
    },
    userRoleFilter: {
      all: "Alle",
      user: "Benutzer",
      public: "Öffentlich",
      customer: "Kunde",
      moderator: "Moderator",
      partnerAdmin: "Partner Administrator",
      partnerEmployee: "Partner Mitarbeiter",
      admin: "Administrator",
      superAdmin: "Super Administrator",
    },
  },
};
