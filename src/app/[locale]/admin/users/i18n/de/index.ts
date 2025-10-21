import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  admin: {
    tabs: {
      overview: "Übersicht",
      stats: "Statistiken",
      stats_description:
        "Detaillierte Benutzerstatistiken und Analysen anzeigen",
      list: "Alle Benutzer",
      list_description: "Alle Benutzer durchsuchen und verwalten",
      add: "Benutzer hinzufügen",
      add_description: "Neues Benutzerkonto erstellen",
    },
  },
  userRoles: {
    errors: {
      role_not_found: "Rolle nicht gefunden",
      user_not_found: "Benutzer nicht gefunden",
      permission_denied: "Berechtigung für diese Operation verweigert",
      role_assignment_failed: "Rollenzuweisung fehlgeschlagen: {{error}}",
      role_removal_failed: "Rollenentfernung fehlgeschlagen: {{error}}",
      roles_retrieval_failed: "Abrufen der Rollen fehlgeschlagen: {{error}}",
      user_roles_retrieval_failed:
        "Abrufen der Benutzerrollen fehlgeschlagen: {{error}}",
      find_failed: "Suche nach Benutzerrollen fehlgeschlagen",
      not_found: "Benutzerrollen nicht gefunden",
      lookup_failed: "Suche nach Benutzerrollen fehlgeschlagen",
      add_failed: "Hinzufügen der Benutzerrolle fehlgeschlagen",
      remove_failed: "Entfernen der Benutzerrolle fehlgeschlagen",
      check_failed: "Überprüfung der Benutzerrolle fehlgeschlagen",
      delete_failed: "Löschung der Benutzerrolle fehlgeschlagen",
    },
  },
  users: {
    admin: {
      actions: {
        refresh: "Aktualisieren",
        export: "Exportieren",
        exportCsv: "Als CSV exportieren",
        exportExcel: "Als Excel exportieren",
        add: "Benutzer hinzufügen",
        addUser: "Benutzer hinzufügen",
        edit: "Bearbeiten",
        editUser: "Benutzer bearbeiten",
        deleteUser: "Benutzer löschen",
        viewUser: "Benutzer anzeigen",
        activateUser: "Benutzer aktivieren",
        deactivateUser: "Benutzer deaktivieren",
        verifyEmail: "E-Mail verifizieren",
        resetPassword: "Passwort zurücksetzen",
      },
      filters: {
        title: "Filter",
        timePeriod: "Zeitraum",
        timePeriods: {
          hour: "Stunde",
          day: "Tag",
          week: "Woche",
          month: "Monat",
          quarter: "Quartal",
          year: "Jahr",
        },
        status: "Status",
        statuses: {
          title: "Status",
          all: "Alle Status",
          active: "Aktiv",
          inactive: "Inaktiv",
          pending: "Ausstehend",
          suspended: "Gesperrt",
          emailVerified: "E-Mail verifiziert",
          emailUnverified: "E-Mail nicht verifiziert",
        },
        role: "Rolle",
        roles: {
          title: "Rollen",
          all: "Alle Rollen",
          user: "Benutzer",
          admin: "Administrator",
          moderator: "Moderator",
          public: "Öffentlich",
          customer: "Kunde",
          partnerAdmin: "Partner-Admin",
        },
        sortBy: "Sortieren nach",
        sortFields: {
          createdAt: "Erstellungsdatum",
          updatedAt: "Aktualisierungsdatum",
          email: "E-Mail",
          lastLogin: "Letzte Anmeldung",
        },
        dateRange: "Datumsbereich",
        dateRanges: {
          today: "Heute",
          yesterday: "Gestern",
          last7Days: "Letzte 7 Tage",
          last30Days: "Letzte 30 Tage",
          last90Days: "Letzte 90 Tage",
          thisMonth: "Dieser Monat",
          lastMonth: "Letzter Monat",
          thisQuarter: "Dieses Quartal",
          lastQuarter: "Letztes Quartal",
          thisYear: "Dieses Jahr",
          lastYear: "Letztes Jahr",
          custom: "Benutzerdefinierter Bereich",
        },
        chartType: "Diagrammtyp",
        chartTypes: {
          line: "Liniendiagramm",
          bar: "Balkendiagramm",
          area: "Flächendiagramm",
        },
        includeComparison: "Vergleich einschließen",
        includeComparisonDescription:
          "Vergleichsdaten mit vorherigem Zeitraum einschließen",
      },
      formatting: {
        fallbacks: {
          never: "Nie",
          noValue: "Kein Wert",
          noCompany: "Kein Unternehmen",
        },
      },
      navigation: {
        overview: "Übersicht",
        list: "Alle Benutzer",
        add: "Benutzer hinzufügen",
        settings: "Einstellungen",
        ariaLabel: "Benutzerverwaltung Navigation",
      },
      overview: {
        title: "Benutzerübersicht",
        description:
          "Benutzerstatistiken anzeigen und Benutzerkonten verwalten",
      },
      quickActions: {
        title: "Schnellaktionen",
      },
      role: {
        all: "Alle Rollen",
        public: "Öffentlich",
        customer: "Kunde",
        partner_admin: "Partner Admin",
        partner_employee: "Partner Mitarbeiter",
        admin: "Administrator",
      },
      stats: {
        title: "Benutzerstatistiken",
        description: "Benutzerstatistiken und Analysen anzeigen",
        totalUsers: "Benutzer gesamt",
        activeUsers: "Aktive Benutzer",
        verifiedUsers: "Verifizierte Benutzer",
        premiumUsers: "Premium-Benutzer",
        newThisMonth: "neu diesen Monat",
        ofTotal: "von gesamt",
        verificationRate: "Verifizierungsrate",
        premiumRate: "Premium-Rate",
        adminUsers: "Administratoren",
        inactiveUsers: "Inaktive Benutzer",
        newUsers: "Neue Benutzer",
        emailVerifiedUsers: "E-Mail-verifizierte Benutzer",
        emailUnverifiedUsers: "E-Mail-unverifizierte Benutzer",
        usersWithPhone: "Benutzer mit Telefon",
        usersWithBio: "Benutzer mit Biografie",
        usersWithWebsite: "Benutzer mit Website",
        usersWithJobTitle: "Benutzer mit Berufsbezeichnung",
        usersWithImage: "Benutzer mit Bild",
        usersWithStripeId: "Benutzer mit Stripe-ID",
        stripeIntegrationRate: "Stripe-Integrationsrate",
        usersWithLeadId: "Benutzer mit Lead-ID",
        leadAssociationRate: "Lead-Verknüpfungsrate",
        publicUsers: "Öffentliche Benutzer",
        customerUsers: "Kundenbenutzer",
        partnerAdminUsers: "Partner-Admin-Benutzer",
        partnerEmployeeUsers: "Partner-Mitarbeiter-Benutzer",
        uniqueCompanies: "Eindeutige Unternehmen",
        growthRate: "Wachstumsrate",
        leadToUserConversionRate: "Lead-zu-Benutzer-Konversionsrate",
        retentionRate: "Aufbewahrungsrate",
        activeSubscriptions: "Aktive Abonnements",
        bookedConsultations: "Gebuchte Beratungen",
        monthlyRevenue: "Monatlicher Umsatz",
        emailVerified: "E-Mail verifiziert",
        leadConversion: "Lead-Konversion",
        userRetention: "Benutzerbindung",
        averageRevenue: "Ø Umsatz/Benutzer",
        additionalMetrics: "Zusätzliche Metriken",
        fromLastMonth: "vom letzten Monat",
        change: {
          positive: "+{{value}}%",
          negative: "-{{value}}%",
        },
        usersByStatus: "Benutzer nach Status",
        usersByRole: "Benutzer nach Rolle",
        pendingUsers: "Ausstehende Benutzer",
        suspendedUsers: "Gesperrte Benutzer",
        regularUsers: "Normale Benutzer",
        moderatorUsers: "Moderatoren",
        moderators: "Moderatoren",
        administrators: "Administratoren",
        chart: {
          title: "Benutzerstatistiken über Zeit",
          noData: "Keine Daten verfügbar",
          yAxisLabel: "Anzahl Benutzer",
          xAxisLabel: "Datum",
        },
        tabs: {
          overview: "Übersicht",
          distribution: "Verteilung",
          engagement: "Engagement",
          activity: "Aktivität",
        },
        historicalSubtitle: "Historische Benutzerdaten über die Zeit",
        profileCompleteness: "Profil-Vollständigkeit",
        integrationStatus: "Integrationsstatus",
        stripeIntegration: "Stripe-Integration",
        contactMethods: "Kontaktmethoden",
        contactMethod: {
          email: "E-Mail",
          phone: "Telefon",
          sms: "SMS",
          whatsapp: "WhatsApp",
          telegram: "Telegram",
          facebook: "Facebook",
          instagram: "Instagram",
          twitter: "Twitter",
          linkedin: "LinkedIn",
          discord: "Discord",
          slack: "Slack",
          teams: "Teams",
          zoom: "Zoom",
          skype: "Skype",
          other: "Andere",
        },
        statusDistribution: "Status-Verteilung",
        roleDistribution: "Rollen-Verteilung",
        countryDistribution: "Länder-Verteilung",
        contactMethodDistribution: "Kontaktmethoden-Verteilung",
        profileCompletenessDistribution: "Profil-Vollständigkeits-Verteilung",
        integrationStatusDistribution: "Integrationsstatus-Verteilung",
        countWithPercentage: "{{count}} ({{percentage}})",
        recentActivity: "Neueste Aktivität",
        legend: {
          title: "Legende",
          showAll: "Alle anzeigen",
          hideAll: "Alle ausblenden",
        },
        errors: {
          fetch_failed: {
            title: "Fehler beim Laden der Statistiken",
            description:
              "Benutzer-Statistiken konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
          },
          no_data: {
            title: "Keine Daten verfügbar",
            description:
              "Keine Benutzer-Statistiken für den ausgewählten Zeitraum verfügbar.",
          },
        },
      },
      status: {
        all: "Alle Status",
        active: "Aktiv",
        inactive: "Inaktiv",
        email_verified: "E-Mail verifiziert",
        email_unverified: "E-Mail nicht verifiziert",
      },
      table: {
        name: "Name",
        email: "E-Mail",
        status: "Status",
        roles: "Rollen",
        company: "Unternehmen",
        created: "Erstellt",
        actions: "Aktionen",
      },
      tabs: {
        overview: "Übersicht",
        overview_description: "Benutzerstatistiken und Schnellaktionen",
        list: "Alle Benutzer",
        list_description: "Alle Benutzer durchsuchen und verwalten",
        add: "Benutzer hinzufügen",
        add_description: "Neues Benutzerkonto erstellen",
        stats: "Statistiken",
        stats_description:
          "Detaillierte Benutzerstatistiken und Analysen anzeigen",
      },
    },
    contactMethods: {
      email: "E-Mail",
      phone: "Telefon",
      sms: "SMS",
      whatsapp: "WhatsApp",
    },
    create: {
      title: "Benutzer erstellen",
      description: "Neues Benutzerkonto erstellen",
      fields: {
        email: "E-Mail-Adresse des Benutzers",
        password: "Benutzerpasswort (mindestens 8 Zeichen)",
        firstName: "Vorname des Benutzers",
        lastName: "Nachname des Benutzers",
        company: "Firmenname des Benutzers",
        phone: "Telefonnummer des Benutzers",
        preferredContactMethod: "Bevorzugte Kontaktmethode",
        imageUrl: "Profilbild-URL des Benutzers",
        bio: "Biografie des Benutzers",
        website: "Website-URL des Benutzers",
        jobTitle: "Berufsbezeichnung des Benutzers",
        emailVerified: "Ob die E-Mail verifiziert ist",
        isActive: "Ob das Benutzerkonto aktiv ist",
        leadId: "Zugehörige Lead-ID",
        roles: "Zuzuweisende Benutzerrollen",
      },
    },
    errors: {
      loadFailed: "Laden der Benutzer fehlgeschlagen",
      createFailed: "Erstellen des Benutzers fehlgeschlagen",
      updateFailed: "Aktualisieren des Benutzers fehlgeschlagen",
      deleteFailed: "Löschen des Benutzers fehlgeschlagen",
      emailSendFailed: "Senden der E-Mail fehlgeschlagen",
      invalidData:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    fields: {
      email: "E-Mail-Adresse des Benutzers",
      password: "Benutzerpasswort (mindestens 8 Zeichen)",
      firstName: "Vorname des Benutzers",
      lastName: "Nachname des Benutzers",
      company: "Unternehmen oder Organisation des Benutzers",
      phone: "Telefonnummer des Benutzers",
      preferredContactMethod: "Bevorzugte Kontaktmethode des Benutzers",
      imageUrl: "URL zum Profilbild des Benutzers",
      bio: "Biografie oder Beschreibung des Benutzers",
      website: "Website-URL des Benutzers",
      jobTitle: "Berufsbezeichnung des Benutzers",
      emailVerified: "Ob die E-Mail des Benutzers verifiziert wurde",
      isActive: "Ob das Benutzerkonto aktiv ist",
      leadId: "Zugehörige Lead-ID, falls vom Lead konvertiert",
      roles: "Benutzerrollen und Berechtigungen",
    },
    form: {
      labels: {
        email: "E-Mail-Adresse",
        password: "Passwort",
        firstName: "Vorname",
        lastName: "Nachname",
        company: "Unternehmen",
        phone: "Telefonnummer",
        preferredContactMethod: "Bevorzugte Kontaktmethode",
        imageUrl: "Profilbild-URL",
        bio: "Biografie",
        website: "Website",
        jobTitle: "Berufsbezeichnung",
        emailVerified: "E-Mail verifiziert",
        isActive: "Konto aktiv",
        leadId: "Lead-ID",
        roles: "Benutzerrollen",
      },
      placeholders: {
        email: "benutzer@beispiel.de",
        password: "Sicheres Passwort eingeben",
        firstName: "Max",
        lastName: "Mustermann",
        company: "Musterfirma GmbH",
        phone: "+49123456789",
        imageUrl: "https://beispiel.de/avatar.jpg",
        bio: "Erzählen Sie uns von sich...",
        website: "https://beispiel.de",
        jobTitle: "Software-Entwickler",
      },
      buttons: {
        back: "Zurück",
        save: "Benutzer speichern",
        cancel: "Abbrechen",
        create: "Benutzer erstellen",
        update: "Benutzer aktualisieren",
        delete: "Benutzer löschen",
        reset: "Formular zurücksetzen",
        saving: "Speichern...",
      },
    },
    list: {
      title: "Alle Benutzer",
      description: "Alle Benutzerkonten im System durchsuchen und verwalten",
      empty: {
        title: "Keine Benutzer gefunden",
        description:
          "Keine Benutzer entsprechen Ihren aktuellen Filtern. Versuchen Sie, Ihre Suchkriterien anzupassen.",
        message: "Keine Benutzer entsprechen Ihren aktuellen Filtern.",
      },
      filters: {
        title: "Filter",
        placeholder:
          "Verwenden Sie die obigen Filter, um Benutzer zu suchen und zu filtern.",
        clear: "Filter löschen",
        search: {
          placeholder: "Benutzer nach Name, E-Mail oder Unternehmen suchen...",
        },
        status: {
          label: "Status",
          all: "Alle Status",
          active: "Aktiv",
          inactive: "Inaktiv",
          emailVerified: "E-Mail verifiziert",
          emailUnverified: "E-Mail nicht verifiziert",
        },
        role: {
          label: "Rolle",
          all: "Alle Rollen",
          public: "Öffentlich",
          customer: "Kunde",
          partnerAdmin: "Partner Admin",
          partnerEmployee: "Partner Mitarbeiter",
          admin: "Administrator",
        },
        country: {
          label: "Land",
          all: "Alle Länder",
        },
        language: {
          label: "Sprache",
          all: "Alle Sprachen",
        },
        sortBy: {
          label: "Sortieren nach",
          createdAt: "Erstellungsdatum",
          updatedAt: "Aktualisierungsdatum",
          email: "E-Mail",
          firstName: "Vorname",
          lastName: "Nachname",
          company: "Unternehmen",
        },
        sortOrder: {
          label: "Reihenfolge",
          asc: "Aufsteigend",
          desc: "Absteigend",
        },
      },
      results: {
        showing: "Zeige {{start}} bis {{end}} von {{total}} Benutzern",
      },
      pagination: {
        showing: "Zeige {{start}} bis {{end}} von {{total}} Benutzern",
        page: "Seite {{current}} von {{total}}",
        per_page: "Pro Seite",
        of: "von",
      },
    },
    listApi: {
      fields: {
        page: "Seitennummer für Paginierung",
        limit: "Anzahl der Benutzer pro Seite",
        search: "Suchbegriff für E-Mail, Name oder Unternehmen",
        status: "Nach Benutzerstatus filtern",
        role: "Nach Benutzerrolle filtern",
        country: "Nach Land filtern",
        language: "Nach Sprache filtern",
        sortBy: "Feld zum Sortieren",
        sortOrder: "Sortierreihenfolge (aufsteigend oder absteigend)",
      },
    },
    messages: {
      confirmDelete:
        "Sind Sie sicher, dass Sie diesen Benutzer löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
      userCreated: "Benutzer wurde erfolgreich erstellt",
      userUpdated: "Benutzer wurde erfolgreich aktualisiert",
      userDeleted: "Benutzer wurde erfolgreich gelöscht",
      emailSent: "E-Mail wurde an den Benutzer gesendet",
      passwordReset: "Passwort-Reset-E-Mail wurde gesendet",
    },
    role: {
      placeholder: "Nach Rolle filtern",
    },
    roles: {
      public: "Öffentlich",
      customer: "Kunde",
      partnerAdmin: "Partner Admin",
      partnerEmployee: "Partner Mitarbeiter",
      admin: "Administrator",
    },
    search: {
      placeholder: "Benutzer suchen...",
    },
    sort: {
      placeholder: "Sortieren nach",
      created: "Erstellungsdatum",
      updated: "Aktualisierungsdatum",
      email: "E-Mail",
      first_name: "Vorname",
      last_name: "Nachname",
      company: "Unternehmen",
      privateName: "Privater Name",
      publicName: "Öffentlicher Name",
    },
    sortOrder: {
      placeholder: "Sortierreihenfolge",
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    stats: {
      total_users: "Gesamte Benutzer",
      active_users: "Aktive Benutzer",
      inactive_users: "Inaktive Benutzer",
      new_users: "Neue Benutzer",
      email_verified_users: "E-Mail-verifizierte Benutzer",
      email_unverified_users: "E-Mail-unverifizierte Benutzer",
      verification_rate: "Verifizierungsrate",
      users_with_phone: "Benutzer mit Telefon",
      users_with_bio: "Benutzer mit Biografie",
      users_with_website: "Benutzer mit Website",
      users_with_job_title: "Benutzer mit Berufsbezeichnung",
      users_with_image: "Benutzer mit Bild",
      users_with_stripe_id: "Benutzer mit Stripe-ID",
      stripe_integration_rate: "Stripe-Integrationsrate",
      users_with_lead_id: "Benutzer mit Lead-ID",
      lead_association_rate: "Lead-Verknüpfungsrate",
      public_users: "Öffentliche Benutzer",
      customer_users: "Kundenbenutzer",
      partner_admin_users: "Partner-Admin-Benutzer",
      partner_employee_users: "Partner-Mitarbeiter-Benutzer",
      admin_users: "Admin-Benutzer",
      unique_companies: "Eindeutige Unternehmen",
      growth_rate: "Wachstumsrate",
      lead_to_user_conversion_rate: "Lead-zu-Benutzer-Konversionsrate",
      retention_rate: "Aufbewahrungsrate",
      company_users: "Benutzer nach Unternehmen",
      contact_method: "Kontaktmethode",
      status_users: "Benutzer nach Status",
      role: "Rolle",
      profile_completeness: "Profilvollständigkeit",
      integration_status: "Integrationsstatus",
      verification_status: "E-Mail-Verifizierungsstatus",
      contact_methods: {
        email: "E-Mail",
        phone: "Telefon",
        sms: "SMS",
      },
      series_descriptions: {
        verification_rate: "Prozentsatz der Benutzer mit verifizierten E-Mails",
        users_with_phone: "Anzahl der Benutzer mit Telefonnummern",
        users_with_bio: "Anzahl der Benutzer mit Biografie-Informationen",
        users_with_website: "Anzahl der Benutzer mit Website-URLs",
        users_with_job_title: "Anzahl der Benutzer mit Berufsbezeichnungen",
        users_with_image: "Anzahl der Benutzer mit Profilbildern",
        users_with_stripe_id: "Anzahl der Benutzer mit Stripe-Kunden-IDs",
        stripe_integration_rate:
          "Prozentsatz der Benutzer, die mit Stripe integriert sind",
        users_with_lead_id: "Anzahl der Benutzer, die mit Leads verknüpft sind",
        lead_association_rate:
          "Prozentsatz der Benutzer, die mit Leads verknüpft sind",
        public_users: "Anzahl der öffentlichen Benutzer",
        customer_users: "Anzahl der Kundenbenutzer",
        partner_admin_users: "Anzahl der Partner-Admin-Benutzer",
        partner_employee_users: "Anzahl der Partner-Mitarbeiter-Benutzer",
        admin_users: "Anzahl der Admin-Benutzer",
        unique_companies: "Anzahl der eindeutigen Unternehmen",
        growth_rate: "Monatliches Wachstum",
        lead_to_user_conversion_rate: "Rate der Lead-zu-Benutzer-Konversion",
        retention_rate: "Benutzeraufbewahrungsrate",
      },
    },
    status: {
      placeholder: "Nach Status filtern",
      active: "Aktiv",
      inactive: "Inaktiv",
      emailVerified: "E-Mail verifiziert",
      emailUnverified: "E-Mail nicht verifiziert",
      pending: "Ausstehend",
      suspended: "Gesperrt",
    },
    user: {
      fields: {
        id: "Benutzer-ID",
        email: "E-Mail-Adresse des Benutzers",
        firstName: "Vorname des Benutzers",
        lastName: "Nachname des Benutzers",
        company: "Firmenname des Benutzers",
        phone: "Telefonnummer des Benutzers",
        preferredContactMethod: "Bevorzugte Kontaktmethode",
        imageUrl: "Profilbild-URL des Benutzers",
        bio: "Biografie des Benutzers",
        website: "Website-URL des Benutzers",
        jobTitle: "Berufsbezeichnung des Benutzers",
        emailVerified: "Ob die E-Mail verifiziert ist",
        isActive: "Ob das Benutzerkonto aktiv ist",
        leadId: "Zugehörige Lead-ID",
        roles: "Zuzuweisende Benutzerrollen",
      },
    },
  },
  usersErrors: {
    users: {
      delete: {
        error: {
          validation: {
            title: "Benutzer-Löschungs-Validierung fehlgeschlagen",
            description:
              "Überprüfen Sie Ihre Anfrage und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Benutzer-Löschung nicht autorisiert",
            description: "Sie haben keine Berechtigung, Benutzer zu löschen",
          },
          forbidden: {
            title: "Benutzer-Löschung verboten",
            description:
              "Sie haben keine Berechtigung, diesen Benutzer zu löschen",
          },
          not_found: {
            title: "Benutzer nicht gefunden",
            description:
              "Der Benutzer, den Sie löschen möchten, konnte nicht gefunden werden",
          },
          server: {
            title: "Benutzer-Löschungs-Serverfehler",
            description:
              "Benutzer kann aufgrund eines Serverfehlers nicht gelöscht werden",
          },
          unknown: {
            title: "Benutzer-Löschung fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler ist beim Löschen des Benutzers aufgetreten",
          },
        },
        success: {
          title: "Benutzer erfolgreich gelöscht",
          description: "Der Benutzer wurde dauerhaft aus dem System entfernt",
        },
      },
      get: {
        error: {
          validation: {
            title: "Benutzer-Abruf-Validierung fehlgeschlagen",
            description:
              "Überprüfen Sie Ihre Anfrageparameter und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Benutzer-Abruf nicht autorisiert",
            description:
              "Sie haben keine Berechtigung, auf Benutzerdaten zuzugreifen",
          },
          forbidden: {
            title: "Benutzerzugriff verboten",
            description:
              "Sie haben keine Berechtigung, auf diesen Benutzer zuzugreifen",
          },
          not_found: {
            title: "Benutzer nicht gefunden",
            description:
              "Der angeforderte Benutzer konnte nicht gefunden werden",
          },
          server: {
            title: "Benutzer-Abruf-Serverfehler",
            description:
              "Benutzer kann aufgrund eines Serverfehlers nicht abgerufen werden",
          },
          unknown: {
            title: "Benutzer-Abruf fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler ist beim Abrufen des Benutzers aufgetreten",
          },
        },
        success: {
          title: "Benutzer erfolgreich abgerufen",
          description: "Benutzerdaten wurden erfolgreich geladen",
        },
      },
      post: {
        error: {
          validation: {
            title: "Benutzer-Erstellungs-Validierung fehlgeschlagen",
            description:
              "Überprüfen Sie Ihre Benutzerinformationen und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Benutzer-Erstellung nicht autorisiert",
            description: "Sie haben keine Berechtigung, Benutzer zu erstellen",
          },
          forbidden: {
            title: "Benutzer-Erstellung verboten",
            description: "Sie haben keine Berechtigung, Benutzer zu erstellen",
          },
          duplicate: {
            title: "Benutzer existiert bereits",
            description:
              "Ein Benutzer mit dieser E-Mail-Adresse existiert bereits im System",
          },
          server: {
            title: "Benutzer-Erstellungs-Serverfehler",
            description:
              "Benutzer kann aufgrund eines Serverfehlers nicht erstellt werden",
          },
          unknown: {
            title: "Benutzer-Erstellung fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler ist beim Erstellen des Benutzers aufgetreten",
          },
        },
        success: {
          title: "Benutzer erfolgreich erstellt",
          description:
            "Der neue Benutzer wurde erstellt und zum System hinzugefügt",
        },
      },
      put: {
        error: {
          validation: {
            title: "Benutzer-Update-Validierung fehlgeschlagen",
            description:
              "Überprüfen Sie Ihre Benutzerinformationen und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Benutzer-Update nicht autorisiert",
            description:
              "Sie haben keine Berechtigung, Benutzer zu aktualisieren",
          },
          forbidden: {
            title: "Benutzer-Update verboten",
            description:
              "Sie haben keine Berechtigung, diesen Benutzer zu aktualisieren",
          },
          not_found: {
            title: "Benutzer nicht gefunden",
            description:
              "Der Benutzer, den Sie aktualisieren möchten, konnte nicht gefunden werden",
          },
          duplicate: {
            title: "E-Mail bereits in Verwendung",
            description:
              "Ein anderer Benutzer verwendet bereits diese E-Mail-Adresse",
          },
          server: {
            title: "Benutzer-Update-Serverfehler",
            description:
              "Benutzer kann aufgrund eines Serverfehlers nicht aktualisiert werden",
          },
          unknown: {
            title: "Benutzer-Update fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler ist beim Aktualisieren des Benutzers aufgetreten",
          },
        },
        success: {
          title: "Benutzer erfolgreich aktualisiert",
          description:
            "Die Benutzerinformationen wurden erfolgreich aktualisiert",
        },
      },
    },
    validation: {
      id: {
        invalid: "Ungültige Benutzer-ID",
      },
      email: {
        invalid: "Ungültige E-Mail-Adresse",
      },
      password: {
        tooShort: "Passwort muss mindestens 8 Zeichen haben",
        tooLong: "Passwort darf maximal 128 Zeichen haben",
      },
      firstName: {
        required: "Vorname ist erforderlich",
        tooLong: "Vorname darf maximal 100 Zeichen haben",
      },
      lastName: {
        required: "Nachname ist erforderlich",
        tooLong: "Nachname darf maximal 100 Zeichen haben",
      },
      company: {
        required: "Firmenname ist erforderlich",
        tooLong: "Firmenname darf maximal 255 Zeichen haben",
      },
      phone: {
        invalid: "Ungültiges Telefonnummernformat",
      },
      preferredContactMethod: {
        invalid: "Ungültige bevorzugte Kontaktmethode",
      },
      imageUrl: {
        invalid: "Ungültige Bild-URL",
      },
      bio: {
        tooLong: "Biografie darf maximal 1000 Zeichen haben",
      },
      website: {
        invalid: "Ungültige Website-URL",
      },
      jobTitle: {
        tooLong: "Berufsbezeichnung darf maximal 255 Zeichen haben",
      },
    },
  },
};
