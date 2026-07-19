import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzer",
  tags: {
    create: "Erstellen",
    admin: "Administrator",
    user: "Benutzer",
    view: "Anzeigen",
    stats: "Statistiken",
  },
  create: {
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
        description:
          "Füllen Sie die Details aus, um einen neuen Benutzer zu erstellen",
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
          description:
            "Bitte überprüfen Sie die Formulardaten und versuchen Sie es erneut",
        },
        server: {
          title: "Serverfehler",
          description:
            "Benutzer konnte aufgrund eines Serverfehlers nicht erstellt werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Ein unerwarteter Fehler ist beim Erstellen des Benutzers aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description:
            "Netzwerkverbindung während der Benutzererstellung fehlgeschlagen",
        },
        forbidden: {
          title: "Zugriff verboten",
          description: "Sie haben keine Berechtigung, Benutzer zu erstellen",
        },
        notFound: {
          title: "Ressource nicht gefunden",
          description:
            "Erforderliche Ressource für Benutzererstellung nicht gefunden",
        },
        conflict: {
          title: "Benutzer existiert bereits",
          description: "Ein Benutzer mit dieser E-Mail existiert bereits",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description:
            "Sie haben nicht gespeicherte Änderungen, die verloren gehen",
        },
        internal: {
          title: "Interner Fehler",
          description:
            "Ein interner Fehler ist beim Erstellen des Benutzers aufgetreten",
        },
      },
      sms: {
        errors: {
          welcome_failed: {
            title: "SMS-Willkommensnachricht fehlgeschlagen",
            description:
              "Willkommensnachricht per SMS konnte nicht gesendet werden",
          },
          verification_failed: {
            title: "SMS-Verifizierung fehlgeschlagen",
            description:
              "Verifizierungsnachricht per SMS konnte nicht gesendet werden",
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
    widget: {
      headerCreated: "Benutzer erstellt",
      headerCreate: "Benutzer erstellen",
      headerSubtitle: "Neuen Admin-Benutzer oder Kundenkonto erstellen",
      activeBadge: "Aktiv",
      verifiedBadge: "Verifiziert",
      copiedTooltip: "Kopiert!",
      copyUserIdTooltip: "Benutzer-ID kopieren",
      copyIdButton: "ID kopieren",
      copiedButton: "Kopiert!",
      viewUserButton: "Benutzer anzeigen",
      fullProfileButton: "Vollständiges Profil",
      creditHistoryButton: "Kreditverlauf",
      createAnotherButton: "Weiteren Benutzer erstellen",
      createdPrefix: "Erstellt",
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
          preview:
            "Ein neuer Benutzer {{firstName}} {{lastName}} wurde erstellt",
          subject: "Neues Benutzerkonto erstellt - {{firstName}} {{lastName}}",
          notification:
            "Ein neues Benutzerkonto wurde im System erstellt. Hier sind die Details:",
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
          description:
            "Willkommensnachricht per SMS konnte nicht gesendet werden",
        },
        verification_failed: {
          title: "SMS-Verifizierung fehlgeschlagen",
          description:
            "Verifizierungsnachricht per SMS konnte nicht gesendet werden",
        },
      },
    },
  },
  list: {
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
      subscription: {
        label: "Abonnement",
        description: "Nach Abonnementstatus filtern",
        placeholder: "Beliebiger Abonnementstatus",
      },
      creditActivity: {
        label: "Kreditaktivität",
        description: "Nach Kauf oder Verbrauch von Guthaben filtern",
        placeholder: "Beliebige Kreditaktivität",
      },
      threads: {
        label: "Unterhaltungen",
        description: "Filtern, ob der Benutzer Chat-Unterhaltungen hat",
        placeholder: "Beliebiger Status",
      },
      referralActivity: {
        label: "Empfehlungsaktivität",
        description:
          "Nach Empfehlungslink, Klicks, Anmeldungen oder zahlenden Abonnenten filtern",
        placeholder: "Beliebige Empfehlungsaktivität",
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
          referralCode: "Verwendeter Ref.-Code",
          referredByUserId: "Empfohlen von",
          totalReferrals: "Geworbene Nutzer",
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
    widget: {
      statusActive: "Aktiv",
      statusInactive: "Inaktiv",
      statusUnverified: "Nicht verifiziert",
      joined: "Beigetreten",
      creditHistory: "Kreditverlauf",
      view: "Ansehen",
      edit: "Bearbeiten",
      delete: "L\u00F6schen",
      stats: "Statistiken",
      graphs: "Graphen",
      newUser: "Neuer Benutzer",
      searchPlaceholder: "Nach Name oder E-Mail suchen\u2026 (Strg+F)",
      roleFilterLabel: "Rolle",
      sortLabel: "Sortieren:",
      clearFilters: "Filter zur\u00FCcksetzen",
      noUsersMatchFilters: "Keine Benutzer entsprechen den Filtern.",
      noUsersFound: "Keine Benutzer gefunden.",
      userStatistics: "Benutzerstatistiken",
      refresh: "Aktualisieren",
      roleAll: "Alle",
      roleAdmin: "Administrator",
      roleCustomer: "Kunde",
      rolePartnerAdmin: "Partner Administrator",
      rolePartnerEmployee: "Partner Mitarbeiter",
      statusAll: "Alle",
      sortNewest: "Neueste",
      sortOldest: "\u00C4lteste",
      sortNameAZ: "Name A-Z",
      sortNameZA: "Name Z-A",
      sortEmailAZ: "E-Mail A-Z",
      of: "von",
      usersShown: "Benutzer angezeigt",
      paginationPage: "Seite",
      paginationOf: "von",
      paginationSeparator: "·",
      paginationUsers: "Benutzer",
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
      subscriptionPresenceFilter: {
        any: "Beliebig",
        hasActive: "Hat aktives Abonnement",
        hadAny: "Hatte jemals ein Abonnement",
        never: "Nie abonniert",
      },
      creditActivityFilter: {
        any: "Beliebig",
        boughtPack: "Guthaben-Paket gekauft",
        spentCredits: "Guthaben verbraucht",
        neverSpent: "Nie Guthaben verbraucht",
      },
      threadsFilter: {
        any: "Beliebig",
        hasThreads: "Hat Unterhaltungen",
        noThreads: "Keine Unterhaltungen",
      },
      referralActivityFilter: {
        any: "Beliebig",
        hasCode: "Hat Empfehlungslink",
        hasClicks: "Hat Empfehlungsklicks",
        hasSignups: "Hat Empfehlungsanmeldungen",
        hasSubscribers: "Hat zahlende Geworbene",
      },
    },
  },
  stats: {
    title: "Benutzerstatistiken",
    description: "Umfassende Benutzeranalysen und Statistiken",
    category: "Benutzer",
    tag: "Statistiken",
    container: {
      title: "Benutzerstatistik-Dashboard",
      description: "Umfassende Benutzeranalysen und Statistiken anzeigen",
    },
    actions: {
      refresh: "Aktualisieren",
      refreshing: "Aktualisiere...",
    },
    basicFilters: {
      title: "Basis-Filter",
      description: "Benutzer nach Status und Rolle filtern",
    },
    subscriptionFilters: {
      title: "Abonnement-Filter",
      description: "Nach Abonnement und Zahlung filtern",
    },
    locationFilters: {
      title: "Standort-Filter",
      description: "Nach Land und Sprache filtern",
    },
    timePeriodOptions: {
      title: "Zeitraum-Optionen",
      description: "Zeitraum und Diagramm-Einstellungen konfigurieren",
    },
    sections: {
      filterOptions: {
        title: "Filter-Optionen",
        description: "Filter für Benutzerstatistiken konfigurieren",
      },
    },
    fields: {
      status: {
        label: "Status-Filter",
        description: "Statistiken nach Benutzerstatus filtern",
      },
      role: {
        label: "Rollen-Filter",
        description: "Statistiken nach Benutzerrolle filtern",
      },
      country: {
        label: "Länder-Filter",
        description: "Statistiken nach Land filtern",
        placeholder: "Land auswählen...",
      },
      language: {
        label: "Sprach-Filter",
        description: "Statistiken nach Sprache filtern",
        placeholder: "Sprache auswählen...",
      },
      search: {
        label: "Suchen",
        description: "Benutzer für Statistiken durchsuchen",
        placeholder: "Suchbegriff eingeben...",
      },
      chartType: {
        label: "Diagrammtyp",
        description: "Wählen Sie den Typ des anzuzeigenden Diagramms",
      },
      dateRangePreset: {
        label: "Datumsbereichsvorlage",
        description: "Wählen Sie einen vordefinierten Datumsbereich",
      },
      includeComparison: {
        label: "Vergleich einbeziehen",
        description: "Vergleich mit vorherigem Zeitraum einbeziehen",
      },
      timePeriod: {
        label: "Zeitraum",
        description: "Wählen Sie den Zeitraum für Statistiken",
      },
      subscriptionStatus: {
        label: "Abonnement-Status",
        description: "Nach Abonnement-Status filtern",
      },
      paymentMethod: {
        label: "Zahlungsmethode",
        description: "Nach Zahlungsmethode filtern",
      },
    },
    response: {
      overviewStats: {
        title: "Übersichts-Statistiken",
        description: "Allgemeine Benutzerstatistiken-Übersicht",
        totalUsers: {
          label: "Benutzer insgesamt",
        },
        activeUsers: {
          label: "Aktive Benutzer",
        },
        inactiveUsers: {
          label: "Inaktive Benutzer",
        },
        newUsers: {
          label: "Neue Benutzer",
        },
      },
      emailStats: {
        title: "E-Mail-Statistiken",
        description: "Benutzer E-Mail-Verifizierungsstatistiken",
        emailVerifiedUsers: {
          label: "Verifizierte E-Mails",
        },
        emailUnverifiedUsers: {
          label: "Unverifizierte E-Mails",
        },
        verificationRate: {
          label: "Verifizierungsrate",
        },
      },
      profileStats: {
        title: "Profil-Statistiken",
        description: "Benutzer-Profilvollständigkeitsstatistiken",
        complete: {
          title: "Profilvollständigkeit",
          description: "Detaillierte Profilvollständigkeitsmetriken",
          usersWithPhone: {
            content: "Benutzer mit Telefon",
          },
          usersWithBio: {
            content: "Benutzer mit Biografie",
          },
          usersWithWebsite: {
            content: "Benutzer mit Website",
          },
          usersWithJobTitle: {
            content: "Benutzer mit Jobtitel",
          },
          usersWithImage: {
            content: "Benutzer mit Profilbild",
          },
          completionRate: {
            content: "Profilvollständigkeitsrate",
          },
        },
      },
      subscriptionStats: {
        title: "Abonnement-Statistiken",
        description: "Benutzer-Abonnementverteilungsstatistiken",
        activeSubscriptions: {
          label: "Aktiv",
        },
        canceledSubscriptions: {
          label: "Storniert",
        },
        expiredSubscriptions: {
          label: "Abgelaufen",
        },
        noSubscription: {
          label: "Kein Abonnement",
        },
        subscriptionChart: {
          label: "Abonnementverteilung",
          description: "Visuelle Aufschlüsselung der Abonnementstatus",
        },
      },
      paymentStats: {
        title: "Zahlungsstatistiken",
        description: "Umsatz- und Transaktionsstatistiken",
        totalRevenue: {
          label: "Gesamtumsatz",
        },
        transactionCount: {
          label: "Transaktionen",
        },
        averageOrderValue: {
          label: "Durchschn. Bestellwert",
        },
        refundRate: {
          label: "Erstattungsrate",
        },
      },
      roleStats: {
        title: "Rollen-Statistiken",
        description: "Benutzer-Rollenverteilungsstatistiken",
        publicUsers: {
          label: "Öffentlich",
        },
        customerUsers: {
          label: "Kunden",
        },
        partnerAdminUsers: {
          label: "Partner-Admins",
        },
        partnerEmployeeUsers: {
          label: "Partner-Personal",
        },
        adminUsers: {
          label: "Admins",
        },
        roleChart: {
          label: "Rollenverteilung",
          description: "Visuelle Aufschlüsselung der Benutzer nach Rolle",
        },
      },
      timeStats: {
        title: "Zeitbasierte Statistiken",
        description:
          "Benutzererstellung und Wachstumsstatistiken über die Zeit",
        usersCreatedToday: {
          label: "Heute",
        },
        usersCreatedThisWeek: {
          label: "Diese Woche",
        },
        usersCreatedThisMonth: {
          label: "Diesen Monat",
        },
        usersCreatedLastMonth: {
          label: "Letzten Monat",
        },
        growthRate: {
          label: "Wachstumsrate",
        },
      },
      companyStats: {
        title: "Unternehmens-Statistiken",
        description: "Unternehmensbezogene Benutzerstatistiken",
        uniqueCompanies: {
          content: "Einzigartige Unternehmen",
        },
      },
      // Keep the flat structure for backward compatibility
      totalUsers: {
        content: "Benutzer insgesamt",
      },
      activeUsers: {
        content: "Aktive Benutzer",
      },
      inactiveUsers: {
        content: "Inaktive Benutzer",
      },
      newUsers: {
        content: "Neue Benutzer",
      },
      emailVerifiedUsers: {
        content: "E-Mail-verifizierte Benutzer",
      },
      emailUnverifiedUsers: {
        content: "E-Mail-unverifizierte Benutzer",
      },
      verificationRate: {
        content: "E-Mail-Verifizierungsrate",
      },
      usersWithPhone: {
        content: "Benutzer mit Telefon",
      },
      usersWithBio: {
        content: "Benutzer mit Biografie",
      },
      usersWithWebsite: {
        content: "Benutzer mit Website",
      },
      usersWithJobTitle: {
        content: "Benutzer mit Berufsbezeichnung",
      },
      usersWithImage: {
        content: "Benutzer mit Profilbild",
      },
      usersWithStripeId: {
        content: "Benutzer mit Stripe-ID",
      },
      usersWithoutStripeId: {
        content: "Benutzer ohne Stripe-ID",
      },
      stripeIntegrationRate: {
        content: "Stripe-Integrationsrate",
      },
      usersWithLeadId: {
        content: "Benutzer mit Lead-ID",
      },
      usersWithoutLeadId: {
        content: "Benutzer ohne Lead-ID",
      },
      leadAssociationRate: {
        content: "Lead-Assoziationsrate",
      },
      publicUsers: {
        content: "Öffentliche Benutzer",
      },
      customerUsers: {
        content: "Kunden-Benutzer",
      },
      partnerAdminUsers: {
        content: "Partner-Administrator-Benutzer",
      },
      partnerEmployeeUsers: {
        content: "Partner-Mitarbeiter-Benutzer",
      },
      adminUsers: {
        content: "Administrator-Benutzer",
      },
      uniqueCompanies: {
        content: "Einzigartige Unternehmen",
      },
      usersCreatedToday: {
        content: "Heute erstellte Benutzer",
      },
      usersCreatedThisWeek: {
        content: "Diese Woche erstellte Benutzer",
      },
      usersCreatedThisMonth: {
        content: "Diesen Monat erstellte Benutzer",
      },
      usersCreatedLastMonth: {
        content: "Letzten Monat erstellte Benutzer",
      },
      growthRate: {
        content: "Wachstumsrate",
      },
      leadToUserConversionRate: {
        content: "Lead-zu-Benutzer-Konversionsrate",
      },
      retentionRate: {
        content: "Benutzer-Bindungsrate",
      },
      generatedAt: {
        content: "Statistiken generiert am",
      },
      growthMetrics: {
        title: "Wachstumsmetriken",
        description: "Benutzer-Wachstums- und Konversionsmetriken",
        growthChart: {
          label: "Benutzerwachstum über Zeit",
          description: "Visuelle Darstellung der Benutzererstellungstrends",
        },
      },
      performanceRates: {
        title: "Leistungsraten",
        description: "Benutzer-Leistungs- und Konversionsmetriken",
        growthRate: {
          label: "Wachstumsrate",
        },
        leadToUserConversionRate: {
          label: "Lead-Konversion",
        },
        retentionRate: {
          label: "Bindungsrate",
        },
      },
      businessInsights: {
        title: "Geschäftseinblicke",
        description: "Business Intelligence und Analytik",
        uniqueCompanies: {
          label: "Einzigartige Unternehmen",
        },
        generatedAt: {
          label: "Generiert am",
        },
      },
    },
    errors: {
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Statistikparameter angegeben",
      },
      unauthorized: {
        title: "Nicht autorisierter Zugriff",
        description: "Sie müssen angemeldet sein, um Statistiken anzuzeigen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, Statistiken anzuzeigen",
      },
      notFound: {
        title: "Statistiken nicht gefunden",
        description:
          "Die angeforderten Statistiken konnten nicht gefunden werden",
      },
      conflict: {
        title: "Konfliktfehler",
        description:
          "Statistiken können aufgrund bestehender Konflikte nicht generiert werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen, die verloren gehen",
      },
      server: {
        title: "Serverfehler",
        description:
          "Statistiken können aufgrund eines Serverfehlers nicht generiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler ist beim Generieren der Statistiken aufgetreten",
      },
    },
    enums: {
      subscriptionStatusFilter: {
        all: "Alle",
        active: "Aktiv",
        trialing: "Testphase",
        pastDue: "Zahlungsrückstand",
        canceled: "Storniert",
        unpaid: "Unbezahlt",
        paused: "Pausiert",
        noSubscription: "Kein Abonnement",
      },
      paymentMethodFilter: {
        all: "Alle",
        card: "Karte",
        bankTransfer: "Banküberweisung",
        paypal: "PayPal",
        applePay: "Apple Pay",
        googlePay: "Google Pay",
        sepaDebit: "SEPA-Lastschrift",
        crypto: "Kryptowährung",
        noPaymentMethod: "Keine Zahlungsmethode",
      },
    },
    success: {
      title: "Statistiken erfolgreich generiert",
      description: "Benutzerstatistiken wurden erfolgreich generiert",
    },
    widget: {
      headerTitle: "Benutzerstatistiken",
      refresh: "Aktualisieren",
      labelTotalUsers: "Benutzer gesamt",
      labelActiveUsers: "Aktive Benutzer",
      labelNewToday: "Neu heute",
      labelNewThisWeek: "Neu diese Woche",
      labelNewThisMonth: "Neu diesen Monat",
      labelTotalRevenue: "Gesamtumsatz",
      labelAvgRevenuePerUser: "Durchschn. Umsatz / Benutzer",
      labelEmailVerified: "E-Mail verifiziert",
      labelVerificationRate: "Verifizierungsrate",
      labelEmailUnverified: "E-Mail nicht verifiziert",
      labelGrowthRate: "Wachstumsrate",
      labelLeadUserCvr: "Lead \u2192 Benutzer CVR",
      labelRetentionRate: "Bindungsrate",
      chartByRole: "Nach Rolle",
      chartBySubscriptionStatus: "Nach Abonnement-Status",
      chartGrowthOverTime: "Wachstum \u00FCber Zeit",
      recentSignupsSummary: "Neuanmeldungen \u00DCbersicht",
      rowToday: "Heute",
      rowThisWeek: "Diese Woche",
      rowThisMonth: "Diesen Monat",
      rowLastMonth: "Letzten Monat",
      generatedAt: "Generiert am:",
      filters: "Filter",
      filtersTitle: "Filteroptionen",
      applyFilters: "Filter anwenden",
      viewUsers: "Benutzer anzeigen",
      createUser: "Benutzer erstellen",
    },
  },
  user: {
    category: "Benutzer",
    tag: "Benutzerverwaltung",
    errors: {
      not_found: {
        title: "Benutzer nicht gefunden",
        description: "Der angeforderte Benutzer konnte nicht gefunden werden",
      },
      internal: {
        title: "Interner Fehler",
        description:
          "Ein interner Fehler ist bei der Verarbeitung der Benutzeranfrage aufgetreten",
      },
    },
    id: {
      category: "Benutzer",
      tag: "Benutzerverwaltung",

      id: {
        roles: {
          post: {
            title: "Benutzerrolle hinzufügen",
            description: "Einem bestimmten Benutzerkonto eine Rolle zuweisen",
            container: {
              title: "Rolle hinzufügen",
              description:
                "Wählen Sie eine Rolle aus, die diesem Benutzer gewährt werden soll",
            },
            id: {
              label: "Benutzer-ID",
              description:
                "Eindeutige Kennung des Benutzers, dem die Rolle zugewiesen werden soll",
              placeholder: "Benutzer-ID eingeben...",
            },
            role: {
              label: "Rolle",
              description: "Die dem Benutzer zu gewährende Rolle",
              placeholder: "Rolle auswählen...",
            },
            submit: {
              label: "Rolle hinzufügen",
            },
            response: {
              roleId: {
                content: "Rollenzuweisungs-ID",
              },
              userId: {
                content: "Benutzer-ID",
              },
              assignedRole: {
                content: "Zugewiesene Rolle",
              },
            },
            errors: {
              unauthorized: {
                title: "Nicht autorisiert",
                description:
                  "Sie müssen angemeldet sein, um Benutzerrollen zu verwalten",
              },
              validation: {
                title: "Validierung fehlgeschlagen",
                description:
                  "Bitte geben Sie eine gültige Benutzer-ID und Rolle an",
              },
              forbidden: {
                title: "Zugriff verweigert",
                description:
                  "Nur Administratoren können Benutzerrollen verwalten",
              },
              notFound: {
                title: "Benutzer nicht gefunden",
                description:
                  "Der angegebene Benutzer konnte nicht gefunden werden",
              },
              conflict: {
                title: "Rolle bereits zugewiesen",
                description: "Dieser Benutzer hat die angegebene Rolle bereits",
              },
              network: {
                title: "Netzwerkfehler",
                description: "Verbindung zum Server nicht möglich",
              },
              unsavedChanges: {
                title: "Ungespeicherte Änderungen",
                description:
                  "Sie haben ungespeicherte Änderungen, die verloren gehen",
              },
              server: {
                title: "Serverfehler",
                description:
                  "Rolle konnte aufgrund eines Serverfehlers nicht hinzugefügt werden",
              },
              unknown: {
                title: "Unbekannter Fehler",
                description:
                  "Beim Hinzufügen der Rolle ist ein unerwarteter Fehler aufgetreten",
              },
            },
            success: {
              title: "Rolle hinzugefügt",
              description: "Die Rolle wurde dem Benutzer erfolgreich gewährt",
            },
          },
          delete: {
            title: "Benutzerrolle entfernen",
            description:
              "Eine Rolle von einem bestimmten Benutzerkonto entziehen",
            container: {
              title: "Rolle entfernen",
              description:
                "Wählen Sie eine Rolle aus, die diesem Benutzer entzogen werden soll",
            },
            id: {
              label: "Benutzer-ID",
              description:
                "Eindeutige Kennung des Benutzers, dem die Rolle entzogen werden soll",
              placeholder: "Benutzer-ID eingeben...",
            },
            role: {
              label: "Rolle",
              description: "Die dem Benutzer zu entziehende Rolle",
              placeholder: "Rolle auswählen...",
            },
            submit: {
              label: "Rolle entfernen",
            },
            response: {
              success: {
                content: "Rolle entfernt",
              },
            },
            errors: {
              unauthorized: {
                title: "Nicht autorisiert",
                description:
                  "Sie müssen angemeldet sein, um Benutzerrollen zu verwalten",
              },
              validation: {
                title: "Validierung fehlgeschlagen",
                description:
                  "Bitte geben Sie eine gültige Benutzer-ID und Rolle an",
              },
              forbidden: {
                title: "Zugriff verweigert",
                description:
                  "Nur Administratoren können Benutzerrollen verwalten",
              },
              notFound: {
                title: "Benutzer nicht gefunden",
                description:
                  "Der angegebene Benutzer konnte nicht gefunden werden",
              },
              conflict: {
                title: "Konfliktfehler",
                description:
                  "Rolle konnte aufgrund bestehender Abhängigkeiten nicht entfernt werden",
              },
              network: {
                title: "Netzwerkfehler",
                description: "Verbindung zum Server nicht möglich",
              },
              unsavedChanges: {
                title: "Ungespeicherte Änderungen",
                description:
                  "Sie haben ungespeicherte Änderungen, die verloren gehen",
              },
              server: {
                title: "Serverfehler",
                description:
                  "Rolle konnte aufgrund eines Serverfehlers nicht entfernt werden",
              },
              unknown: {
                title: "Unbekannter Fehler",
                description:
                  "Beim Entfernen der Rolle ist ein unerwarteter Fehler aufgetreten",
              },
            },
            success: {
              title: "Rolle entfernt",
              description: "Die Rolle wurde dem Benutzer erfolgreich entzogen",
            },
          },
        },
        get: {
          title: "Benutzer abrufen",
          description:
            "Detaillierte Informationen zu einem bestimmten Benutzer abrufen",
          container: {
            title: "Benutzerdetails",
            description: "Detaillierte Benutzerinformationen anzeigen",
          },
          id: {
            label: "Benutzer-ID",
            description: "Eindeutige Kennung für den Benutzer",
            placeholder: "Benutzer-ID eingeben...",
          },
          response: {
            userProfile: {
              title: "Benutzerprofil",
              description: "Detaillierte Benutzerprofilinformationen",
              basicInfo: {
                title: "Grundinformationen",
                description: "Kernbenutzerinformationen",
                id: {
                  content: "Benutzer-ID",
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
              },
              contactDetails: {
                title: "Kontaktdaten",
                description: "Benutzer-Kontaktinformationen",
                phone: {
                  content: "Telefonnummer",
                },
                preferredContactMethod: {
                  content: "Bevorzugte Kontaktmethode",
                },
                website: {
                  content: "Website",
                },
              },
            },
            profileDetails: {
              title: "Profildetails",
              description: "Zusätzliche Profilinformationen",
              imageUrl: {
                content: "Profilbild",
              },
              bio: {
                content: "Biografie",
              },
              jobTitle: {
                content: "Berufsbezeichnung",
              },
              leadId: {
                content: "Zugeordnete Lead-ID",
              },
            },
            accountStatus: {
              title: "Kontostatus",
              description: "Informationen zum Benutzerkontostatus",
              isActive: {
                content: "Aktiver Status",
              },
              emailVerified: {
                content: "E-Mail verifiziert",
              },
              stripeCustomerId: {
                content: "Stripe-Kunden-ID",
              },
              userRoles: {
                content: "Benutzerrollen",
              },
            },
            timestamps: {
              title: "Zeitstempel",
              description: "Erstellungs- und Aktualisierungszeitstempel",
              createdAt: {
                content: "Erstellt am",
              },
              updatedAt: {
                content: "Aktualisiert am",
              },
            },
            referralInfo: {
              title: "Empfehlungsinfo",
              description: "Empfehlungskette und Verdienste",
              referredByUserId: {
                content: "Empfohlen von (Benutzer-ID)",
              },
              referredByCode: {
                content: "Verwendeter Empfehlungscode",
              },
              totalReferrals: {
                content: "Geworbene Nutzer",
              },
              totalEarnedCents: {
                content: "Gesamtverdienst (Cent)",
              },
            },
            leadId: {
              content: "Zugehörige Lead-ID",
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
              description:
                "Sie müssen angemeldet sein, um Benutzerdetails anzuzeigen",
            },
            validation: {
              title: "Validierung fehlgeschlagen",
              description: "Ungültige Benutzer-ID angegeben",
            },
            forbidden: {
              title: "Zugriff verboten",
              description:
                "Sie haben keine Berechtigung, diesen Benutzer anzuzeigen",
            },
            notFound: {
              title: "Benutzer nicht gefunden",
              description:
                "Der angeforderte Benutzer konnte nicht gefunden werden",
            },
            conflict: {
              title: "Konfliktfehler",
              description:
                "Benutzer kann aufgrund bestehender Konflikte nicht abgerufen werden",
            },
            network: {
              title: "Netzwerkfehler",
              description:
                "Verbindung zum Server kann nicht hergestellt werden",
            },
            unsavedChanges: {
              title: "Ungespeicherte Änderungen",
              description:
                "Sie haben ungespeicherte Änderungen, die verloren gehen",
            },
            server: {
              title: "Serverfehler",
              description:
                "Benutzer kann aufgrund eines Serverfehlers nicht abgerufen werden",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description:
                "Ein unerwarteter Fehler ist beim Abrufen des Benutzers aufgetreten",
            },
          },
          success: {
            title: "Benutzer erfolgreich abgerufen",
            description: "Benutzerinformationen wurden erfolgreich abgerufen",
          },
        },
        put: {
          title: "Benutzer aktualisieren",
          description: "Benutzerinformationen und Profildetails aktualisieren",
          container: {
            title: "Benutzer aktualisieren",
            description: "Benutzerinformationen und Einstellungen ändern",
          },
          id: {
            label: "Benutzer-ID",
            description:
              "Eindeutige Kennung für den zu aktualisierenden Benutzer",
            placeholder: "Benutzer-ID eingeben...",
          },
          sections: {
            basicInfo: {
              title: "Grundinformationen",
              description: "Grundlegende Benutzerinformationen aktualisieren",
            },
            contactInfo: {
              title: "Kontaktinformationen",
              description: "Kontaktdaten aktualisieren",
            },
            profileDetails: {
              title: "Profildetails",
              description: "Zusätzliche Profilinformationen aktualisieren",
            },
            adminSettings: {
              title: "Administrative Einstellungen",
              description: "Administrative Einstellungen aktualisieren",
            },
          },
          email: {
            label: "E-Mail-Adresse",
            description:
              "E-Mail-Adresse des Benutzers für Anmeldung und Kommunikation",
            placeholder: "E-Mail-Adresse eingeben...",
          },
          privateName: {
            label: "Privater Name",
            description:
              "Vollständiger rechtlicher Name des Benutzers (nur für Administratoren sichtbar)",
          },
          publicName: {
            label: "Öffentlicher Name",
            description:
              "Anzeigename des Benutzers (für alle Benutzer sichtbar)",
          },
          firstName: {
            label: "Vorname",
            description: "Vorname des Benutzers",
            placeholder: "Vorname eingeben...",
          },
          lastName: {
            label: "Nachname",
            description: "Nachname des Benutzers",
            placeholder: "Nachname eingeben...",
          },
          company: {
            label: "Unternehmen",
            description: "Unternehmen oder Organisation des Benutzers",
            placeholder: "Unternehmen eingeben...",
          },
          phone: {
            label: "Telefonnummer",
            description: "Kontakt-Telefonnummer des Benutzers",
            placeholder: "Telefonnummer eingeben...",
          },
          preferredContactMethod: {
            label: "Bevorzugte Kontaktmethode",
            description: "Wie der Benutzer bevorzugt kontaktiert werden möchte",
          },
          bio: {
            label: "Biografie",
            description: "Kurze Beschreibung über den Benutzer",
            placeholder: "Biografie eingeben...",
          },
          website: {
            label: "Website",
            description: "Persönliche oder Unternehmens-Website des Benutzers",
            placeholder: "Website-URL eingeben...",
          },
          jobTitle: {
            label: "Berufsbezeichnung",
            description: "Berufsbezeichnung oder Position des Benutzers",
            placeholder: "Berufsbezeichnung eingeben...",
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
            placeholder: "Lead-ID eingeben...",
          },
          isBanned: {
            label: "Gesperrt",
            description: "Ob der Benutzer von der Plattform gesperrt ist",
          },
          bannedReason: {
            label: "Sperrgrund",
            description: "Grund für die Sperrung des Benutzers",
          },
          response: {
            leadId: {
              content: "Zugehörige Lead-ID",
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
              description:
                "Sie müssen angemeldet sein, um Benutzer zu aktualisieren",
            },
            validation: {
              title: "Validierung fehlgeschlagen",
              description:
                "Bitte überprüfen Sie die Formulardaten und versuchen Sie es erneut",
            },
            forbidden: {
              title: "Zugriff verboten",
              description:
                "Sie haben keine Berechtigung, diesen Benutzer zu aktualisieren",
            },
            notFound: {
              title: "Benutzer nicht gefunden",
              description:
                "Der zu aktualisierende Benutzer konnte nicht gefunden werden",
            },
            conflict: {
              title: "Aktualisierungskonflikt",
              description:
                "Die Benutzerdaten stehen im Konflikt mit vorhandenen Datensätzen",
            },
            server: {
              title: "Serverfehler",
              description:
                "Benutzer kann aufgrund eines Serverfehlers nicht aktualisiert werden",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description:
                "Ein unerwarteter Fehler ist beim Aktualisieren des Benutzers aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description:
                "Verbindung zum Server kann nicht hergestellt werden",
            },
            unsavedChanges: {
              title: "Ungespeicherte Änderungen",
              description:
                "Sie haben ungespeicherte Änderungen, die verloren gehen",
            },
          },
          success: {
            title: "Benutzer erfolgreich aktualisiert",
            description:
              "Benutzerinformationen wurden erfolgreich aktualisiert",
          },
        },
        delete: {
          title: "Benutzer löschen",
          description: "Benutzerkonto dauerhaft löschen",
          container: {
            title: "Benutzer löschen",
            description: "Benutzer dauerhaft aus dem System entfernen",
          },
          id: {
            label: "Benutzer-ID",
            description: "Eindeutige Kennung für den zu löschenden Benutzer",
            placeholder: "Benutzer-ID eingeben...",
            helpText:
              "WARNUNG: Diese Aktion kann nicht rückgängig gemacht werden",
          },
          submitButton: {
            label: "Benutzer löschen",
            loadingText: "Wird gelöscht...",
          },
          response: {
            deletionResult: {
              title: "Löschungsergebnis",
              description: "Ergebnis des Löschvorgangs",
              success: {
                content: "Löschung erfolgreich",
              },
              message: {
                content: "Löschungsnachricht",
              },
              deletedAt: {
                content: "Gelöscht am",
              },
            },
            success: {
              content: "Löschung erfolgreich",
            },
            message: {
              content: "Löschungsnachricht",
            },
          },
          errors: {
            unauthorized: {
              title: "Nicht autorisierter Zugriff",
              description: "Sie müssen angemeldet sein, um Benutzer zu löschen",
            },
            validation: {
              title: "Validierung fehlgeschlagen",
              description: "Ungültige Benutzer-ID für Löschung angegeben",
            },
            forbidden: {
              title: "Zugriff verboten",
              description: "Sie haben keine Berechtigung, Benutzer zu löschen",
            },
            notFound: {
              title: "Benutzer nicht gefunden",
              description:
                "Der zu löschende Benutzer konnte nicht gefunden werden",
            },
            server: {
              title: "Serverfehler",
              description:
                "Benutzer kann aufgrund eines Serverfehlers nicht gelöscht werden",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description:
                "Ein unerwarteter Fehler ist beim Löschen des Benutzers aufgetreten",
            },
            conflict: {
              title: "Konfliktfehler",
              description:
                "Benutzer kann aufgrund bestehender Abhängigkeiten nicht gelöscht werden",
            },
            network: {
              title: "Netzwerkfehler",
              description:
                "Verbindung zum Server kann nicht hergestellt werden",
            },
            unsavedChanges: {
              title: "Ungespeicherte Änderungen",
              description:
                "Sie haben ungespeicherte Änderungen, die verloren gehen",
            },
          },
          success: {
            title: "Benutzer erfolgreich gelöscht",
            description: "Benutzer wurde erfolgreich gelöscht",
          },
        },
        widget: {
          userProfile: "Benutzerprofil",
          active: "Aktiv",
          inactive: "Inaktiv",
          leadId: "Lead-ID:",
          viewLead: "Lead anzeigen",
          created: "Erstellt",
          lastUpdated: "Zuletzt aktualisiert",
          fullProfile: "Vollständiges Profil",
          referrals: "Empfehlungen",
          subscription: "Abonnement",
          creditHistory: "Kreditverlauf",
          deleteUser: "Benutzer löschen",
          userDeletedSuccessfully: "Benutzer erfolgreich gelöscht",
          deletedAt: "Gelöscht am",
          confirmDeletion: "Löschung bestätigen",
          confirmDeletionMessage:
            "Dadurch wird der Benutzer und alle zugehörigen Daten dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
          titleReferralCodes: "Referral-Codes und Statistiken",
          titleSubscription: "Abonnement anzeigen",
          titleCopyUserId: "Benutzer-ID kopieren",
        },
      },
    },
  },
  view: {
    category: "Benutzer",
    tags: {
      user: "Benutzer",
      view: "Anzeigen",
    },

    badge: "Benutzerdetails",
    get: {
      title: "Benutzer anzeigen",
      description: "Detaillierte Informationen über einen Benutzer anzeigen",
      userId: {
        label: "Benutzer-ID",
      },
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description:
          "Bitte überprüfen Sie die Benutzer-ID und versuchen Sie es erneut",
      },
      network: {
        title: "Verbindungsfehler",
        description:
          "Keine Verbindung möglich. Bitte überprüfen Sie Ihre Internetverbindung",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an, um Benutzerdetails anzuzeigen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, diesen Benutzer anzuzeigen",
      },
      notFound: {
        title: "Benutzer nicht gefunden",
        description: "Wir konnten diesen Benutzer nicht finden",
      },
      serverError: {
        title: "Ein Fehler ist aufgetreten",
        description:
          "Die Benutzerdetails konnten nicht geladen werden. Bitte versuchen Sie es erneut",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description:
          "Etwas Unerwartetes ist passiert. Bitte versuchen Sie es erneut",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben Änderungen, die noch nicht gespeichert wurden",
      },
      conflict: {
        title: "Datenkonflikt",
        description:
          "Die Benutzerdaten haben sich geändert. Bitte aktualisieren Sie die Seite und versuchen Sie es erneut",
      },
    },
    success: {
      title: "Benutzer geladen",
      description: "Benutzerdetails erfolgreich geladen",
    },
    empty: "Keine Benutzerdaten gefunden",
    sections: {
      basicInfo: "Grundlegende Informationen",
      chatActivity: "Chat-Aktivität",
      credits: "Guthaben",
      payments: "Zahlungen",
      newsletter: "Newsletter",
      referrals: "Empfehlungen",
      recentActivity: "Letzte Aktivität",
    },
    status: {
      active: "Aktiv",
      banned: "Gesperrt",
      inactive: "Inaktiv",
      verified: "Verifiziert",
    },
    fields: {
      userId: "Benutzer-ID",
      locale: "Sprache",
      twoFactor: "Zwei-Faktor-Auth",
      enabled: "Aktiviert",
      disabled: "Deaktiviert",
      marketing: "Marketing",
      optedIn: "Eingewilligt",
      optedOut: "Abgemeldet",
      created: "Erstellt",
      lastUpdated: "Zuletzt aktualisiert",
      banReason: "Sperrgrund",
      roles: "Rollen",
    },
    credits: {
      currentBalance: "Aktuelles Guthaben",
      availableCredits: "Verfügbares Guthaben",
      packBreakdown: "Guthabenpakete Aufschlüsselung",
      subscription: "Abonnement",
      permanent: "Dauerhaft",
      bonus: "Bonus",
      earned: "Verdient",
      expires: "Läuft ab",
    },
    payment: {
      stripeCustomerId: "Stripe-Kunden-ID",
      activeSubscription: "Aktives Abonnement",
      subscriptionPlan: "Plan",
      subscriptionStatus: "Abonnementstatus",
      nextBilling: "Nächste Abrechnung",
    },
    common: {
      yes: "Ja",
      no: "Nein",
    },
    newsletter: {
      status: "Status",
      subscribed: "Abonniert",
      notSubscribed: "Nicht abonniert",
      subscribedAt: "Abonniert am",
      confirmedAt: "Bestätigt am",
      lastEmailSent: "Letzte E-Mail gesendet",
    },
    referrals: {
      totalReferrals: "Empfehlungen gesamt",
      activeCodes: "Aktive Codes",
      revenue: "Umsatz",
      earnings: "Verdienst",
    },
    activity: {
      lastLogin: "Letzter Login",
      lastThread: "Letzter Thread",
      lastMessage: "Letzte Nachricht",
      lastPayment: "Letzte Zahlung",
    },
    tabs: {
      overview: "Übersicht",
      credits: "Guthaben",
      referrals: "Empfehlungen",
      earnings: "Verdienste",
      connections: "Verbindungen",
      favorites: "Favoriten",
      skills: "Skills",
    },
    modelUsage: {
      title: "Modellnutzung",
      model: "Modell",
      spent: "Verbrauchtes Guthaben",
      messages: "Nachrichten",
      noUsage: "Keine Modellnutzungsdaten",
    },
    connections: {
      title: "Verbindungen",
      leadsTitle: "Verbundene Leads",
      usersTitle: "Verbundene Benutzer",
      noLeads: "Keine verbundenen Leads",
      noUsers: "Keine verbundenen Benutzer",
      leadEmail: "E-Mail",
      leadBusiness: "Unternehmen",
      leadStatus: "Status",
      ipAddress: "IP-Adresse",
      device: "Gerät",
      linkReason: "Verknüpfungsgrund",
      linkedAt: "Verknüpft am",
      userId: "Benutzer-ID",
      userEmail: "E-Mail",
      userPublicName: "Benutzername",
      viewLead: "Lead anzeigen",
      viewUser: "Benutzer anzeigen",
    },
    ban: {
      banUser: "Benutzer sperren",
      unbanUser: "Sperre aufheben",
    },
    widget: {
      actions: {
        edit: "Bearbeiten",
        delete: "Löschen",
        viewCreditHistory: "Guthabenhistorie anzeigen",
        viewSubscription: "Abonnement anzeigen",
        viewReferralCodes: "Empfehlungscodes anzeigen",
        viewReferralEarnings: "Empfehlungsverdienste anzeigen",
        addCredits: "Guthaben hinzufügen",
        viewLead: "Lead anzeigen",
        copyUserId: "Benutzer-ID kopieren",
        copied: "Kopiert!",
      },
      sections: {
        quickActions: "Schnellaktionen",
      },
      stats: {
        totalThreads: "Threads gesamt",
        totalMessages: "Nachrichten gesamt",
        userMessages: "Benutzernachrichten",
        lastActivity: "Letzte Aktivität",
        never: "Nie",
        freeCredits: "Kostenloses Guthaben",
        freePeriod: "Zeitraum",
        totalSpent: "Gesamt ausgegeben",
        totalPurchased: "Gesamt gekauft",
        totalRevenue: "Gesamtumsatz",
        payments: "Zahlungen",
        successful: "Erfolgreich",
        failed: "Fehlgeschlagen",
        totalRefunds: "Erstattungen gesamt",
        lastPayment: "Letzte Zahlung",
      },
    },
  },
};
