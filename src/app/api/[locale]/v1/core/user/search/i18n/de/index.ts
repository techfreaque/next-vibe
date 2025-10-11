import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Benutzersuche",
  description: "Nach Benutzern suchen",
  tag: "Benutzersuche",
  container: {
    title: "Such-Container",
    description: "Benutzersuche-Container",
  },
  groups: {
    searchCriteria: {
      title: "Suchkriterien",
      description: "Definieren Sie Ihre Suchparameter",
    },
    filters: {
      title: "Erweiterte Filter",
      description: "Zusätzliche Filteroptionen",
    },
    pagination: {
      title: "Seitennummerierung",
      description: "Steuern Sie, wie Ergebnisse paginiert werden",
    },
  },
  fields: {
    search: {
      label: "Suchanfrage",
      description: "Suchbegriffe eingeben",
      placeholder: "Benutzer suchen...",
      help: "Suche nach Name, E-Mail oder Unternehmen",
      validation: {
        minLength: "Suchanfrage muss mindestens 2 Zeichen lang sein",
      },
    },
    roles: {
      label: "Benutzerrollen",
      description: "Nach Benutzerrollen filtern",
      placeholder: "Rollen auswählen...",
      help: "Wählen Sie eine oder mehrere Rollen zum Filtern",
    },
    status: {
      label: "Benutzerstatus",
      description: "Nach Benutzerstatus filtern",
      placeholder: "Status auswählen...",
      help: "Filtern nach aktiv, inaktiv oder alle Benutzer",
    },
    limit: {
      label: "Limit",
      description: "Maximale Anzahl der Ergebnisse",
      help: "Geben Sie an, wie viele Ergebnisse zurückgegeben werden sollen (Standard: 10)",
    },
    offset: {
      label: "Offset",
      description: "Anzahl der zu überspringenden Ergebnisse",
      help: "Geben Sie den Paginierungs-Offset an (Standard: 0)",
    },
  },
  status: {
    active: "Aktiv",
    inactive: "Inaktiv",
    all: "Alle",
  },
  response: {
    title: "Suchergebnisse",
    description: "Benutzersuche-Ergebnisse",
    success: {
      badge: "Erfolg",
    },
    message: {
      content: "Suchergebnis-Nachricht",
    },
    searchInfo: {
      title: "Suchinformationen",
      description: "Details über den Suchvorgang",
      searchTerm: "Suchbegriff",
      appliedFilters: "Angewandte Filter",
      searchTime: "Suchzeit",
      totalResults: "Gesamtergebnisse",
    },
    pagination: {
      title: "Paginierungsinfo",
      description: "Seitennavigationsinformationen",
      currentPage: "Aktuelle Seite",
      totalPages: "Gesamtseiten",
      itemsPerPage: "Artikel pro Seite",
      totalItems: "Gesamtartikel",
      hasMore: "Hat mehr",
      hasPrevious: "Hat vorherige",
    },
    actions: {
      title: "Verfügbare Aktionen",
      description: "Aktionen, die Sie mit den Ergebnissen durchführen können",
      type: "Aktionstyp",
      label: "Aktion",
      href: "Link",
    },
    users: {
      label: "Gefundene Benutzer",
      description: "Liste der übereinstimmenden Benutzer",
      item: {
        title: "Benutzer",
        description: "Benutzerkontoinformationen",
      },
      id: "Benutzer-ID",
      leadId: "Lead-ID",
      isPublic: "Öffentlich",
      firstName: "Vorname",
      lastName: "Nachname",
      company: "Unternehmen",
      email: "E-Mail",
      imageUrl: "Avatar",
      isActive: "Aktiv",
      emailVerified: "E-Mail verifiziert",
      requireTwoFactor: "2FA erforderlich",
      marketingConsent: "Marketing-Zustimmung",
      userRoles: {
        item: {
          title: "Rolle",
          description: "Benutzerrollenzuweisung",
        },
        id: "Rollen-ID",
        role: "Rolle",
      },
      createdAt: "Erstellt",
      updatedAt: "Aktualisiert",
    },
  },
  columns: {
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail",
    company: "Unternehmen",
    userRoles: "Rollen",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Suchparameter",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Suche nicht autorisiert",
    },
    internal: {
      title: "Interner Fehler",
      description: "Interner Serverfehler",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindungsfehler",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Keine Benutzer gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Suchkonflikt aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Änderungen wurden nicht gespeichert",
    },
  },
  success: {
    title: "Suche erfolgreich",
    description: "Suche erfolgreich abgeschlossen",
  },
  post: {
    title: "Suche",
    description: "Such-Endpunkt",
    form: {
      title: "Suchkonfiguration",
      description: "Suchparameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Suchantwortdaten",
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
        description: "Interner Serverfehler aufgetreten",
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
};
