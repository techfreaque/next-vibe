import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Geschäftsdaten",
  tags: {
    profile: "Profil",
    personal: "Persönlich",
    update: "Aktualisieren",
  },

  // Completion status field translations
  isComplete: "Profil vollständig",
  completedFields: "Ausgefüllte Felder",
  totalFields: "Gesamtfelder",
  completionPercentage: "Vervollständigungsgrad",
  missingRequiredFields: "Fehlende Pflichtfelder",

  // Enum translations
  enums: {
    jobTitleCategory: {
      executive: "Führungskraft",
      management: "Management",
      marketing: "Marketing",
      sales: "Vertrieb",
      operations: "Betrieb",
      technology: "Technologie",
      finance: "Finanzen",
      humanResources: "Personalwesen",
      customerService: "Kundenservice",
      product: "Produkt",
      design: "Design",
      consulting: "Beratung",
      freelancer: "Freiberufler",
      entrepreneur: "Unternehmer",
      other: "Sonstiges",
    },
    companySize: {
      solo: "Solo (1 Person)",
      small: "Klein (2-10 Mitarbeiter)",
      medium: "Mittel (11-50 Mitarbeiter)",
      large: "Groß (51-200 Mitarbeiter)",
      enterprise: "Unternehmen (200+ Mitarbeiter)",
    },
    experienceLevel: {
      entry: "Einsteiger (0-2 Jahre)",
      junior: "Junior (2-5 Jahre)",
      mid: "Mittelstufe (5-10 Jahre)",
      senior: "Senior (10-15 Jahre)",
      expert: "Experte (15+ Jahre)",
    },
  },

  // GET endpoint translations
  get: {
    title: "Profil abrufen",
    description: "Benutzerprofilinformationen abrufen",
    form: {
      title: "Profilanfrage",
      description: "Anfrage zum Abrufen von Profilinformationen",
    },
    response: {
      title: "Benutzerprofil",
      description: "Ihre persönlichen Profilinformationen",
      firstName: {
        title: "Vorname",
      },
      lastName: {
        title: "Nachname",
      },
      bio: {
        title: "Biografie",
      },
      phone: {
        title: "Telefonnummer",
      },
      jobTitle: {
        title: "Berufsbezeichnung",
      },
      completionStatus: {
        title: "Profilvervollständigungsstatus",
        description: "Informationen zum Profilvervollständigungsstatus",
      },
    },
    errors: {
      unauthorized: {
        title: "Unbefugter Zugriff",
        description: "Sie sind nicht berechtigt, auf dieses Profil zuzugreifen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter für Profil",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen des Profils ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Abrufen des Profils nicht möglich",
      },
      forbidden: {
        title: "Zugriff verboten",
        description: "Sie haben keine Berechtigung, dieses Profil anzuzeigen",
      },
      notFound: {
        title: "Profil nicht gefunden",
        description: "Kein Profil für diesen Benutzer gefunden",
      },
      conflict: {
        title: "Datenkonflikt",
        description:
          "Profildaten stehen im Konflikt mit vorhandenen Informationen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen an Ihrem Profil",
      },
    },
    success: {
      title: "Profil abgerufen",
      description: "Profilinformationen erfolgreich abgerufen",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Profil aktualisieren",
    description: "Benutzerprofilinformationen aktualisieren",
    form: {
      title: "Profil aktualisieren",
      description: "Aktualisieren Sie Ihre persönlichen Profilinformationen",
    },
    response: {
      title: "Aktualisiertes Profil",
      description: "Ihr Profil wurde erfolgreich aktualisiert",
      message: "Profilaktualisierungsnachricht",
      firstName: "Vorname aktualisiert",
      lastName: "Nachname aktualisiert",
      bio: "Biografie aktualisiert",
      phone: "Telefonnummer aktualisiert",
      jobTitle: "Berufsbezeichnung aktualisiert",
      completionStatus: {
        title: "Vervollständigungsstatus aktualisiert",
        description: "Profilvervollständigungsstatus wurde aktualisiert",
      },
    },
    fullName: {
      label: "Vollständiger Name",
      description: "Ihr vollständiger Name",
      placeholder: "Geben Sie Ihren vollständigen Namen ein",
    },
    firstName: {
      label: "Vorname",
      description: "Ihr Vorname",
      placeholder: "Geben Sie Ihren Vornamen ein",
    },
    lastName: {
      label: "Nachname",
      description: "Ihr Nachname",
      placeholder: "Geben Sie Ihren Nachnamen ein",
    },
    bio: {
      label: "Biografie",
      description: "Eine kurze Beschreibung über Sie",
      placeholder: "Erzählen Sie uns etwas über sich...",
    },
    phone: {
      label: "Telefonnummer",
      description: "Ihre Kontakttelefonnummer",
      placeholder: "+49-555-0123",
    },
    jobTitle: {
      label: "Berufsbezeichnung",
      description: "Ihre aktuelle Berufsbezeichnung oder Position",
      placeholder: "z.B. Marketing Manager",
    },
    expertise: {
      label: "Expertise",
      description: "Ihre beruflichen Fähigkeiten und Fachbereiche",
      placeholder:
        "Beschreiben Sie Ihre wichtigsten Fähigkeiten und Expertise...",
    },
    professionalBackground: {
      label: "Beruflicher Hintergrund",
      description: "Ihre berufliche Erfahrung und Laufbahn",
      placeholder: "Beschreiben Sie Ihre berufliche Erfahrung...",
    },
    additionalNotes: {
      label: "Zusätzliche Hinweise",
      description: "Weitere Informationen über Sie",
      placeholder: "Fügen Sie weitere relevante Informationen hinzu...",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, dieses Profil zu aktualisieren",
      },
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      server: {
        title: "Serverfehler",
        description: "Profil konnte nicht aktualisiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Beim Aktualisieren ist ein unerwarteter Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Aktualisieren des Profils nicht möglich",
      },
      forbidden: {
        title: "Zugriff verboten",
        description:
          "Sie haben keine Berechtigung, dieses Profil zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Profildatensatz nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Profilaktualisierung steht im Konflikt mit vorhandenen Daten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen an Ihrem Profil",
      },
    },
    success: {
      title: "Profil aktualisiert",
      description: "Ihr Profil wurde erfolgreich aktualisiert",
      message: "Profil gespeichert",
    },
  },
};
