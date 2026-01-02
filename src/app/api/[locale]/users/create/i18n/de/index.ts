export const translations = {
  category: "Benutzer",
  tags: {
    create: "Erstellen",
    admin: "Administrator",
  },
  post: {
    title: "Benutzer erstellen",
    description: "Neues Benutzerkonto erstellen",
    form: {
      title: "Benutzer-Erstellungsformular",
      description: "Füllen Sie die Details aus, um einen neuen Benutzer zu erstellen",
    },
    email: {
      label: "E-Mail-Adresse",
      description: "E-Mail-Adresse des Benutzers für Login und Kommunikation",
    },
    password: {
      label: "Passwort",
      description: "Sicheres Passwort für das Benutzerkonto",
    },
    privateName: {
      label: "Privater Name",
      description:
        "Vollständiger rechtlicher Name des Benutzers (nur für Administratoren sichtbar)",
    },
    publicName: {
      label: "Öffentlicher Name",
      description: "Anzeigename des Benutzers (für alle Benutzer sichtbar)",
    },
    firstName: {
      label: "Vorname",
      description: "Vorname des Benutzers",
    },
    lastName: {
      label: "Nachname",
      description: "Nachname des Benutzers",
    },
    company: {
      label: "Unternehmen",
      description: "Unternehmen oder Organisation des Benutzers",
    },
    phone: {
      label: "Telefonnummer",
      description: "Kontakt-Telefonnummer des Benutzers",
    },
    preferredContactMethod: {
      label: "Bevorzugte Kontaktmethode",
      description: "Wie der Benutzer bevorzugt kontaktiert werden möchte",
    },
    roles: {
      label: "Benutzerrollen",
      description: "Rollen dem Benutzer zuweisen",
    },
    imageUrl: {
      label: "Profilbild-URL",
      description: "URL zum Profilbild des Benutzers",
    },
    bio: {
      label: "Biografie",
      description: "Kurze Beschreibung über den Benutzer",
    },
    website: {
      label: "Website",
      description: "Persönliche oder Unternehmens-Website des Benutzers",
    },
    jobTitle: {
      label: "Berufsbezeichnung",
      description: "Berufsbezeichnung oder Position des Benutzers",
    },
    emailVerified: {
      label: "E-Mail verifiziert",
      description: "Ob die E-Mail des Benutzers verifiziert ist",
    },
    isActive: {
      label: "Aktiver Status",
      description: "Ob das Benutzerkonto aktiv ist",
    },
    leadId: {
      label: "Lead-ID",
      description: "Zugehörige Lead-Kennung",
    },
    country: {
      label: "Land",
      description: "Wohnsitzland des Benutzers",
    },
    language: {
      label: "Sprache",
      description: "Bevorzugte Sprache des Benutzers",
    },
    response: {
      title: "Benutzer erstellt",
      description: "Details des neu erstellten Benutzers",
      id: {
        content: "Benutzer-ID",
      },
      leadId: {
        content: "Zugehörige Lead-ID",
      },
      country: {
        label: "Land",
        description: "Wohnsitzland des Benutzers",
      },
      language: {
        label: "Sprache",
        description: "Bevorzugte Sprache des Benutzers",
      },
      email: {
        content: "E-Mail-Adresse",
      },
      privateName: {
        content: "Privater Name",
      },
      publicName: {
        content: "Öffentlicher Name",
      },
      firstName: {
        content: "Vorname",
      },
      lastName: {
        content: "Nachname",
      },
      company: {
        content: "Unternehmen",
      },
      phone: {
        content: "Telefonnummer",
      },
      preferredContactMethod: {
        content: "Bevorzugte Kontaktmethode",
      },
      imageUrl: {
        content: "Profilbild",
      },
      bio: {
        content: "Biografie",
      },
      website: {
        content: "Website",
      },
      jobTitle: {
        content: "Berufsbezeichnung",
      },
      emailVerified: {
        content: "E-Mail verifiziert",
      },
      isActive: {
        content: "Aktiver Status",
      },
      stripeCustomerId: {
        content: "Stripe-Kunden-ID",
      },
      userRoles: {
        content: "Benutzerrollen",
        id: {
          content: "Rollen-ID",
        },
        role: {
          content: "Rolle",
        },
      },
      createdAt: {
        content: "Erstellt am",
      },
      updatedAt: {
        content: "Aktualisiert am",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisierter Zugriff",
        description: "Sie müssen angemeldet sein, um Benutzer zu erstellen",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Bitte überprüfen Sie die Formulardaten und versuchen Sie es erneut",
      },
      server: {
        title: "Serverfehler",
        description: "Benutzer konnte aufgrund eines Serverfehlers nicht erstellt werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist beim Erstellen des Benutzers aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung während der Benutzererstellung fehlgeschlagen",
      },
      forbidden: {
        title: "Zugriff verboten",
        description: "Sie haben keine Berechtigung, Benutzer zu erstellen",
      },
      notFound: {
        title: "Ressource nicht gefunden",
        description: "Erforderliche Ressource für Benutzererstellung nicht gefunden",
      },
      conflict: {
        title: "Benutzer existiert bereits",
        description: "Ein Benutzer mit dieser E-Mail existiert bereits",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen",
      },
      internal: {
        title: "Interner Fehler",
        description: "Ein interner Fehler ist beim Erstellen des Benutzers aufgetreten",
      },
    },
    sms: {
      errors: {
        welcome_failed: {
          title: "SMS-Willkommensnachricht fehlgeschlagen",
          description: "Willkommensnachricht per SMS konnte nicht gesendet werden",
        },
        verification_failed: {
          title: "SMS-Verifizierung fehlgeschlagen",
          description: "Verifizierungsnachricht per SMS konnte nicht gesendet werden",
        },
      },
    },
    success: {
      title: "Benutzer erfolgreich erstellt",
      description: "Das neue Benutzerkonto wurde erstellt",
      message: {
        content: "Benutzer erfolgreich erstellt",
      },
      created: {
        content: "Erstellt",
      },
    },
  },
  email: {
    users: {
      welcome: {
        greeting: "Willkommen auf unserer Plattform, {{firstName}}!",
        preview: "Ihr Konto wurde erfolgreich erstellt",
        subject: "Willkommen bei {{companyName}} - Ihr Konto ist bereit!",
        introduction:
          "Hallo {{firstName}}, wir freuen uns, Sie an Bord zu haben! Ihr Konto wurde erfolgreich erstellt und Sie können nun alle unsere Funktionen nutzen.",
        accountDetails: "Kontodetails",
        email: "E-Mail",
        name: "Name",
        publicName: "Anzeigename",
        company: "Unternehmen",
        phone: "Telefon",
        nextSteps: "Nächste Schritte",
        loginButton: "In Ihr Konto einloggen",
        support:
          "Wenn Sie Fragen haben, steht Ihnen unser Support-Team jederzeit zur Verfügung. Kontaktieren Sie uns!",
      },
      admin: {
        newUser: "Neuer Benutzer erstellt",
        preview: "Ein neuer Benutzer {{firstName}} {{lastName}} wurde erstellt",
        subject: "Neues Benutzerkonto erstellt - {{firstName}} {{lastName}}",
        notification: "Ein neues Benutzerkonto wurde im System erstellt. Hier sind die Details:",
        userDetails: "Benutzerdetails",
        viewUser: "Benutzerprofil anzeigen",
      },
      errors: {
        missing_data: "Erforderliche Benutzerdaten fehlen für E-Mail-Vorlage",
      },
      error: {
        general: {
          internal_server_error: "Ein interner Serverfehler ist aufgetreten",
        },
      },
      labels: {
        id: "ID:",
        email: "E-Mail:",
        name: "Name:",
        privateName: "Vollständiger Name:",
        publicName: "Anzeigename:",
        company: "Unternehmen:",
        created: "Erstellt:",
        leadId: "Lead-ID:",
      },
    },
  },
  sms: {
    welcome: {
      message:
        "Willkommen {{firstName}}! Ihr Konto wurde erfolgreich erstellt. Besuchen Sie uns unter {{appUrl}}",
    },
    verification: {
      message:
        "{{firstName}}, Ihr Verifizierungscode ist: {{code}}. Code innerhalb von 10 Minuten eingeben.",
    },
    errors: {
      welcome_failed: {
        title: "SMS-Willkommensnachricht fehlgeschlagen",
        description: "Willkommensnachricht per SMS konnte nicht gesendet werden",
      },
      verification_failed: {
        title: "SMS-Verifizierung fehlgeschlagen",
        description: "Verifizierungsnachricht per SMS konnte nicht gesendet werden",
      },
    },
  },
};
