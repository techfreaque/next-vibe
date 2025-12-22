import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Benutzerliste",
    description: "Benutzer durchsuchen und filtern",
    form: {
      title: "Benutzerverwaltung",
      description: "Benutzer verwalten und filtern",
    },
    actions: {
      refresh: "Aktualisieren",
      refreshing: "Aktualisiere...",
    },
    // Search & Filters section
    searchFilters: {
      title: "Suche & Filter",
      description: "Benutzer nach Kriterien durchsuchen und filtern",
    },
    search: {
      label: "Suchen",
      description: "Benutzer nach Name oder E-Mail durchsuchen",
      placeholder: "Benutzer suchen...",
    },
    status: {
      label: "Status",
      description: "Benutzer nach Status filtern",
      placeholder: "Status auswählen...",
    },
    role: {
      label: "Rolle",
      description: "Benutzer nach Rolle filtern",
      placeholder: "Rolle auswählen...",
    },
    // Sorting section
    sortingOptions: {
      title: "Sortierung",
      description: "Ergebnissortierung konfigurieren",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Feld zum Sortieren",
      placeholder: "Sortierfeld auswählen...",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Sortierrichtung",
      placeholder: "Sortierrichtung auswählen...",
    },
    // Response section
    response: {
      title: "Benutzer",
      description: "Liste der Benutzer, die den Kriterien entsprechen",
      users: {
        id: "Benutzer-ID",
        email: "E-Mail",
        privateName: "Privater Name",
        publicName: "Öffentlicher Name",
        isActive: "Aktiv",
        emailVerified: "Verifiziert",
        createdAt: "Erstellt",
        updatedAt: "Aktualisiert",
      },
      totalCount: "Benutzer insgesamt",
      pageCount: "Seiten insgesamt",
    },
    // Pagination section
    page: {
      label: "Seite",
    },
    limit: {
      label: "Pro Seite",
    },
    // Error messages
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Benutzer anzuzeigen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter angegeben",
      },
      forbidden: {
        title: "Zugriff verboten",
        description: "Sie haben keine Berechtigung, Benutzer anzuzeigen",
      },
      server: {
        title: "Serverfehler",
        description: "Benutzer konnten nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: {
        title: "Konfliktfehler",
        description:
          "Benutzer können aufgrund von Konflikten nicht aufgelistet werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Keine Verbindung zum Server möglich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Benutzer gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Benutzer erfolgreich abgerufen",
    },
  },
  // Legacy keys for backward compatibility
  title: "Benutzer auflisten",
  description: "Benutzer auflisten und durchsuchen mit Filterung",
  category: "Benutzer",
  tag: "Liste",
  container: {
    title: "Benutzerliste",
    description: "Benutzer durchsuchen und filtern",
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
      privateName: "Privater Name",
      publicName: "Öffentlicher Name",
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
    title: "Liste",
    description: "Listen-Endpunkt",
    form: {
      title: "Listenkonfiguration",
      description: "Listenparameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Listen-Antwortdaten",
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
      privateName: "Privater Name",
      publicName: "Öffentlicher Name",
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
