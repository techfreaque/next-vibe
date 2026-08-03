import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Leads",
  tags: {
    leads: "Leads",
    batch: "Stapel",
    campaigns: "Kampagnen",
    management: "Verwaltung",
    create: "Erstellen",
    search: "Suchen",
    export: "Exportieren",
    import: "Importieren",
    csv: "CSV",
    jobs: "Jobs",
    list: "Liste",
  },
  admin: {
    title: "Leads-Verwaltung",
    tabs: {
      overview: "Leads-Navigation",
      stats: "Übersicht",
      stats_description: "Lead-Statistiken und -Analysen anzeigen",
      leads: "Leads",
      leads_description: "Alle Leads durchsuchen und verwalten",
      emails: "E-Mail-Kampagnen",
      emails_description: "E-Mail-Kampagnen und Vorlagen verwalten",
      abTesting: "A/B-Tests",
      abTesting_description: "A/B-Test-Varianten konfigurieren",
      campaignStarter: "Kampagnen-Starter",
      campaignStarter_description: "Lead-Kampagnen konfigurieren und starten",
    },
    import: {
      label: "Importieren",
      description: "Leads aus CSV-Dateien importieren",
    },
    emails: {
      preview: {
        error: "Fehler beim Rendern der E-Mail-Vorschau",
        live: "Live-Vorschau",
        actions: {
          title: "E-Mail-Vorschau",
          description: "Vorschau, wie die E-Mail bei Empfängern aussehen wird",
        },
      },
      preview_title: "E-Mail-Vorschau",
      testEmail: {
        button: "Test-E-Mail senden",
      },
      from: "Von",
      recipient: "Empfänger",
      subject: "Betreff",
      email_preview: "E-Mail-Vorschau",
      stage_of: "von",
      stages: "Stufen",
      journey: "Journey",
      back: "Zurück",
      previous: "Zurück",
      next: "Weiter",
    },
  },
  auth: {
    public: {
      validCookie: "Gültiger Cookie-Lead gefunden",
      invalidCookie: "Ungültiger Cookie-Lead",
      created: "Anonymer Lead erstellt",
      error: "Fehler bei öffentlicher Lead-Authentifizierung",
    },
    authenticated: {
      primaryFound: "Primärer Lead für Benutzer gefunden",
      noPrimary: "Kein primärer Lead für Benutzer gefunden",
      error: "Fehler bei authentifizierter Lead-Authentifizierung",
    },
    link: {
      alreadyExists: "Lead-Verknüpfung existiert bereits",
      created: "Lead-Verknüpfung erstellt",
      error: "Fehler beim Verknüpfen von Leads",
    },
    validate: {
      error: "Fehler bei Lead-Validierung",
    },
    getOrCreate: {
      invalid: "Ungültige Lead-ID",
      error: "Fehler beim Abrufen oder Erstellen von Lead",
    },
    create: {
      existingFound: "Bestehender anonymer Lead gefunden",
      success: "Lead erfolgreich erstellt",
      error: "Fehler beim Erstellen von Lead",
    },
    createForUser: {
      success: "Lead für Benutzer erstellt",
      error: "Fehler beim Erstellen von Lead für Benutzer",
    },
    cookie: {
      set: "Lead-Cookie gesetzt",
      error: "Fehler beim Setzen von Lead-Cookie",
    },
    getUserLeads: {
      error: "Fehler beim Abrufen von Benutzer-Leads",
    },
    linkLeads: {
      sameId: "Lead kann nicht mit sich selbst verknüpft werden",
      alreadyExists: "Lead-Verknüpfung existiert bereits",
      created: "Leads erfolgreich verknüpft",
      error: "Fehler beim Verknüpfen von Leads",
    },
    getLinkedLeads: {
      error: "Fehler beim Abrufen verknüpfter Leads",
    },
    getAllLinkedLeads: {
      error: "Fehler beim Abrufen aller verknüpften Leads",
    },
  },
  errors: {
    cannotLinkLeadToItself: "Lead kann nicht mit sich selbst verknüpft werden",
    linkFailed: "Fehler beim Verknüpfen der Leads",
  },
  filters: {
    search: {
      label: "Suche",
      description: "Leads nach E-Mail oder Firmenname suchen",
      placeholder: "E-Mail oder Firmenname eingeben...",
    },
    status: {
      label: "Status",
      description: "Nach Lead-Status filtern",
      placeholder: "Alle Status",
    },
    currentCampaignStage: {
      label: "Kampagnenphase",
      description: "Nach E-Mail-Kampagnenphase filtern",
      placeholder: "Alle Phasen",
    },
    source: {
      label: "Quelle",
      description: "Nach Lead-Quelle filtern",
      placeholder: "Alle Quellen",
    },
    country: {
      label: "Land",
      description: "Nach Land filtern",
      placeholder: "Alle Länder",
    },
    language: {
      label: "Sprache",
      description: "Nach Sprache filtern",
      placeholder: "Alle Sprachen",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Feld auswählen, nach dem sortiert werden soll",
      placeholder: "Sortierfeld",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Aufsteigend oder absteigend sortieren",
      placeholder: "Reihenfolge",
    },
    statusFilters: {
      title: "Status- & Kampagnenfilter",
      description: "Nach Status, Kampagnenphase und Quelle filtern",
    },
    locationFilters: {
      title: "Standortfilter",
      description: "Nach Land und Sprache filtern",
    },
    sortingOptions: {
      title: "Sortieroptionen",
      description: "Sortierreihenfolge konfigurieren",
    },
  },
  batch: {
    category: "Leads",
    tags: {
      leads: "Leads",
      batch: "Stapel",
    },

    patch: {
      title: "Batch-Aktualisierung",
      description:
        "Leads basierend auf Filterkriterien in Stapeln aktualisieren",
      form: {
        title: "Batch-Aktualisierung-Konfiguration",
        description: "Parameter für Batch-Aktualisierung konfigurieren",
      },
      search: {
        label: "Suche",
        description: "Leads nach E-Mail oder Firmenname suchen",
        placeholder: "E-Mail oder Firmenname eingeben",
      },
      status: {
        label: "Status-Filter",
        description: "Leads nach aktuellem Status filtern",
      },
      currentCampaignStage: {
        label: "Kampagnenstufe-Filter",
        description: "Leads nach aktueller Kampagnenstufe filtern",
      },
      source: {
        label: "Quellen-Filter",
        description: "Leads nach Quelle filtern",
      },
      scope: {
        label: "Operationsbereich",
        description: "Bereich der Batch-Operation definieren",
      },
      dryRun: {
        label: "Testlauf",
        description: "Vorschau der Änderungen ohne Anwendung",
      },
      maxRecords: {
        label: "Max. Datensätze",
        description: "Maximale Anzahl zu verarbeitender Datensätze",
      },
      updates: {
        title: "Aktualisierungsfelder",
        description: "Zu aktualisierende Felder angeben",
        status: {
          label: "Neuer Status",
          description: "Lead-Status auf diesen Wert aktualisieren",
        },
        currentCampaignStage: {
          label: "Neue Kampagnenstufe",
          description: "Kampagnenstufe auf diesen Wert aktualisieren",
        },
        source: {
          label: "Neue Quelle",
          description: "Lead-Quelle auf diesen Wert aktualisieren",
        },
        notes: {
          label: "Notizen",
          description: "Notizen für den Lead hinzufügen oder aktualisieren",
        },
      },
      response: {
        title: "Aktualisierung-Antwort",
        description: "Batch-Aktualisierung Antwortdaten",
        success: "Erfolgreich",
        totalMatched: "Gesamt Gefunden",
        totalProcessed: "Gesamt Verarbeitet",
        totalUpdated: "Gesamt Aktualisiert",
        preview: "Vorschau",
        errors: "Fehler",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung für Batch-Operationen erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter für Batch-Aktualisierung",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler bei Batch-Aktualisierung",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler bei Batch-Aktualisierung",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler bei Batch-Aktualisierung",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff für Batch-Operationen verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource für Batch-Aktualisierung nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt bei Batch-Aktualisierung",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description:
            "Es gibt ungespeicherte Änderungen in der Batch-Aktualisierung",
        },
      },
      success: {
        title: "Aktualisierung Erfolgreich",
        description: "Batch-Aktualisierung erfolgreich abgeschlossen",
      },
    },
    delete: {
      title: "Batch-Löschung",
      description: "Leads basierend auf Filterkriterien in Stapeln löschen",
      form: {
        title: "Batch-Löschung-Konfiguration",
        description: "Parameter für Batch-Löschung konfigurieren",
      },
      search: {
        label: "Suche",
        description: "Leads nach E-Mail oder Firmenname suchen",
      },
      status: {
        label: "Status-Filter",
        description: "Leads nach aktuellem Status filtern",
      },
      confirmDelete: {
        label: "Löschung bestätigen",
        description:
          "Bestätigen, dass die ausgewählten Leads gelöscht werden sollen",
      },
      dryRun: {
        label: "Testlauf",
        description: "Vorschau der Löschungen ohne tatsächliche Entfernung",
      },
      maxRecords: {
        label: "Max. Datensätze",
        description: "Maximale Anzahl zu löschender Datensätze",
      },
      response: {
        title: "Löschung-Antwort",
        description: "Batch-Löschung Antwortdaten",
        success: "Erfolgreich",
        totalMatched: "Gesamt Gefunden",
        totalProcessed: "Gesamt Verarbeitet",
        totalDeleted: "Gesamt Gelöscht",
        preview: "Vorschau",
        errors: "Fehler",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Authentifizierung für Batch-Löschungsoperationen erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter für Batch-Löschung",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler bei Batch-Löschung",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler bei Batch-Löschung",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler bei Batch-Löschung",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff für Batch-Löschungsoperationen verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource für Batch-Löschung nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt bei Batch-Löschung",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description:
            "Es gibt ungespeicherte Änderungen in der Batch-Löschung",
        },
      },
      success: {
        title: "Löschung Erfolgreich",
        description: "Batch-Löschung erfolgreich abgeschlossen",
      },
    },
    widget: {
      update: {
        headerTitle: "Leads Stapel-Aktualisierung",
        emptyStateTitle: "Leads Stapel-Aktualisierung",
        emptyStateDescription:
          "Wenden Sie ein Feldupdate auf viele Leads auf einmal anhand von Filterkriterien an. Verwenden Sie",
        emptyStateDescriptionStrong: "Testlauf",
        emptyStateDescriptionSuffix:
          "um eine Vorschau der betroffenen Leads zu sehen, bevor Sie Änderungen übernehmen.",
        emptyStateTip1:
          "Filter setzen und Absenden klicken, um zuerst einen Testlauf zu starten",
        emptyStateTip2:
          "Testlauf deaktivieren, um Änderungen tatsächlich anzuwenden",
        highVolumeTitle: "Großer Stapel: {{count}} Leads gefunden",
        highVolumeDescription:
          "Dies betrifft eine große Anzahl von Datensätzen. Überprüfen Sie die Vorschau sorgfältig, bevor Sie den Testlauf deaktivieren und tatsächlich einreichen.",
        partialBatchTitle: "Teilstapel verarbeitet",
        partialBatchDescription:
          "{{processed}} von {{matched}} gefundenen Leads wurden verarbeitet. Erhöhen Sie Max. Datensätze oder führen Sie den Vorgang erneut aus.",
        successTitle: "Stapelvorgang abgeschlossen",
        failureTitle: "Stapelvorgang fehlgeschlagen",
        statMatched: "Gefunden",
        statProcessed: "Verarbeitet",
        statUpdated: "Aktualisiert",
        btnRunAgain: "Erneut ausführen",
        btnViewAllAffected: "Alle betroffenen Leads anzeigen",
        btnViewInList: "In Liste anzeigen",
        dryRunPreviewTitle:
          "Testlauf-Vorschau ({{count}} Leads würden betroffen sein)",
        leadFallback: "Lead {{number}}",
        errorsTitle: "{{count}} Fehler",
        errorRow: "Lead {{leadId}}: {{error}}",
        sectionFilter: "Filterkriterien",
        sectionUpdates: "Aktualisierungsfelder",
        sectionSettings: "Betriebseinstellungen",
        activeFiltersLabel: "Aktive Filter aus der Liste (vorausgefüllt)",
        filterSearch: "Suche",
        submitButton: "Aktualisierungen anwenden",
        submitButtonLoading: "Wird angewendet...",
      },
      delete: {
        headerTitle: "Leads Stapel-Löschung",
        warningTitle: "Warnung: {{count}} Lead wird dauerhaft gelöscht",
        warningTitlePlural:
          "Warnung: {{count}} Leads werden dauerhaft gelöscht",
        warningDescription:
          "Diese Aktion kann nicht rückgängig gemacht werden. Alle Daten der gefundenen Leads werden dauerhaft entfernt. Testlauf deaktivieren und bestätigen, um fortzufahren.",
        successTitle: "Löschung abgeschlossen",
        failureTitle: "Löschung fehlgeschlagen",
        statMatched: "Gefunden",
        statDeleted: "Gelöscht",
        btnRunAgain: "Erneut ausführen",
        btnViewRemainingLeads: "Verbleibende Leads anzeigen",
        previewTitle: "{{count}} Leads werden dauerhaft gelöscht",
        leadFallback: "Lead {{number}}",
        errorRow: "Lead {{leadId}}: {{error}}",
        sectionFilter: "Filterkriterien",
        sectionSettings: "Löscheinstellungen",
        activeFiltersLabel: "Aktive Filter aus der Liste (vorausgefüllt)",
        filterSearch: "Suche",
        submitButton: "Leads löschen",
        submitButtonLoading: "Wird gelöscht...",
      },
    },
    enums: {
      batchOperationScope: {
        currentPage: "Aktuelle Seite",
        allPages: "Alle Seiten",
      },
      leadStatus: {
        new: "Neu",
        pending: "Ausstehend",
        campaignRunning: "Kampagne läuft",
        websiteUser: "Website-Nutzer",
        newsletterSubscriber: "Newsletter-Abonnent",
        inContact: "In Kontakt",
        signedUp: "Registriert",
        subscriptionConfirmed: "Abonnement bestätigt",
        unsubscribed: "Abgemeldet",
        bounced: "Zurückgewiesen",
        invalid: "Ungültig",
      },
      emailCampaignStage: {
        notStarted: "Nicht gestartet",
        initial: "Erstkontakt",
        followup1: "Nachfassen 1",
        followup2: "Nachfassen 2",
        followup3: "Nachfassen 3",
        nurture: "Pflege",
        reactivation: "Reaktivierung",
      },
      leadSource: {
        website: "Website",
        socialMedia: "Soziale Medien",
        emailCampaign: "E-Mail-Kampagne",
        referral: "Empfehlung",
        csvImport: "CSV-Import",
      },
    },
    email: {
      admin: {
        batchUpdate: {
          title: "Batch-Aktualisierung Abgeschlossen",
          subject: "Batch-Aktualisierung Ergebnisse",
          preview: "{{totalProcessed}} Leads wurden verarbeitet",
          message:
            "Die Batch-Aktualisierung wurde mit {{totalProcessed}} verarbeiteten Leads abgeschlossen.",
          operationSummary: "Vorgangsübersicht",
          totalMatched: "Gesamt Gefunden",
          totalProcessed: "Gesamt Verarbeitet",
          totalUpdated: "Gesamt Aktualisiert",
          errors: "Fehler",
          dryRunNote:
            "Dies war ein Testlauf - es wurden keine tatsächlichen Änderungen vorgenommen.",
          viewLeads: "Aktualisierte Leads Anzeigen",
          error: {
            noData: "Keine Batch-Aktualisierungsdaten verfügbar",
          },
        },
        batchDelete: {
          title: "Batch-Löschung Abgeschlossen",
          subject: "Batch-Löschung Ergebnisse",
          preview: "{{totalProcessed}} Leads wurden zur Löschung verarbeitet",
          message:
            "Die Batch-Löschung wurde mit {{totalProcessed}} verarbeiteten Leads abgeschlossen.",
          operationSummary: "Vorgangsübersicht",
          totalMatched: "Gesamt Gefunden",
          totalProcessed: "Gesamt Verarbeitet",
          totalDeleted: "Gesamt Gelöscht",
          errors: "Fehler",
          dryRunNote:
            "Dies war ein Testlauf - es wurden keine tatsächlichen Löschungen vorgenommen.",
          viewLeads: "Leads Anzeigen",
          error: {
            noData: "Keine Batch-Löschungsdaten verfügbar",
          },
        },
      },
      error: {
        general: {
          internal_server_error: "Ein interner Serverfehler ist aufgetreten",
        },
      },
    },
  },
  campaigns: {
    category: "Kampagnen-Verwaltung",
    tags: {
      campaigns: "Kampagnen",
      management: "Verwaltung",
    },
    campaignStarter: {
      category: "Kampagnen-Verwaltung",
      tag: "Kampagnenstarter",
      task: {
        description:
          "Kampagnen für neue Leads starten, indem sie in den PENDING-Status versetzt werden",
      },
      errors: {
        server: {
          title: "Serverfehler",
          description:
            "Bei der Verarbeitung der Kampagnenstarter-Anfrage ist ein Fehler aufgetreten",
        },
        invalidTransition: "Ungültiger Statusübergang für den Kampagnenstart",
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
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
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
      },
      post: {
        title: "Kampagnenstarter",
        description: "Kampagnen für neue Leads starten",
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: { title: "Verboten", description: "Zugriff verweigert" },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter",
          },
          server: {
            title: "Serverfehler",
            description:
              "Beim Starten der Kampagnen ist ein Fehler aufgetreten",
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
            description: "Es gibt ungespeicherte Änderungen",
          },
        },
        fields: {
          timezone: {
            label: "Zeitzone",
            description: "Browser-Zeitzone zur Stundenumrechnung",
          },
          dryRun: {
            label: "Testlauf",
            description: "Ausführen ohne Änderungen vorzunehmen",
          },
          force: {
            label: "Erzwingen",
            description: "Tages-/Stunden-Zeitplaneinschränkungen umgehen",
          },
        },
        response: {
          leadsProcessed: "Verarbeitete Leads",
          leadsStarted: "Gestartete Leads",
          leadsSkipped: "Übersprungene Leads",
          executionTimeMs: "Ausführungszeit (ms)",
          errors: "Fehler",
          quotaDetails: "Kontingent-Details",
        },
        success: {
          title: "Kampagnenstarter abgeschlossen",
          description: "Kampagnenstarter wurde erfolgreich ausgeführt",
        },
      },
      get: {
        title: "Campaign-Starter-Konfiguration abrufen",
        description: "Campaign-Starter-Konfiguration laden",
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: { title: "Verboten", description: "Zugriff verweigert" },
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
            description: "Es gibt ungespeicherte Änderungen",
          },
        },
        fields: {
          timezone: {
            label: "Zeitzone",
            description: "Browser-Zeitzone zur Stundenumrechnung",
          },
        },
        response: {
          dryRun: "Testmodus",
          minAgeHours: "Mindestalter in Stunden",
          localeConfig: "Sprachkonfiguration",
          enabledDays: "Aktive Wochentage",
          enabledHours: "Aktive Stunden",
          leadsPerWeek: "Leads pro Woche",
          schedule: "Zeitplan",
          enabled: "Aktiviert",
          priority: "Priorität",
          timeout: "Timeout",
          retries: "Wiederholungen",
          retryDelay: "Wiederholungsverzögerung",
        },
        success: {
          title: "Konfiguration erfolgreich geladen",
          description: "Campaign-Starter-Konfiguration erfolgreich geladen",
        },
      },
      put: {
        title: "Campaign-Starter-Konfiguration",
        description: "Campaign-Starter-Konfiguration aktualisieren",
        dryRun: {
          label: "Testmodus (Dry Run)",
          description: "Testmodus aktivieren ohne echte E-Mails zu senden",
        },
        minAgeHours: {
          label: "Mindestalter in Stunden",
          description: "Mindestalter in Stunden bevor Leads verarbeitet werden",
        },
        enabledDays: {
          label: "Aktive Wochentage",
          description: "Wochentage, an denen Kampagnen aktiv sind",
          monday: "Montag",
          tuesday: "Dienstag",
          wednesday: "Mittwoch",
          thursday: "Donnerstag",
          friday: "Freitag",
          saturday: "Samstag",
          sunday: "Sonntag",
        },
        enabledHours: {
          label: "Aktive Stunden",
          description: "Tagesstunden, in denen Kampagnen aktiv sind",
          start: {
            label: "Startstunde",
            description: "Tagesstunde, zu der Kampagnen beginnen (0-23)",
          },
          end: {
            label: "Endstunde",
            description: "Tagesstunde, zu der Kampagnen enden (0-23)",
          },
        },
        localeConfig: {
          label: "Sprachkonfiguration",
          description:
            "Einstellungen pro Sprache: Leads pro Woche, aktive Tage und aktive Stunden",
        },
        leadsPerWeek: {
          label: "Leads pro Woche",
          description: "Maximale Anzahl der zu verarbeitenden Leads pro Woche",
        },
        schedule: {
          label: "Zeitplan",
          description: "Kampagnenausführungszeitplan",
        },
        enabled: {
          label: "Aktiviert",
          description: "Campaign Starter aktivieren oder deaktivieren",
        },
        priority: {
          label: "Priorität",
          description: "Prioritätsstufe für die Kampagnenausführung",
        },
        timeout: {
          label: "Timeout",
          description: "Timeout-Wert in Millisekunden",
        },
        retries: {
          label: "Wiederholungen",
          description: "Anzahl der Wiederholungsversuche",
        },
        retryDelay: {
          label: "Wiederholungsverzögerung",
          description:
            "Verzögerung zwischen Wiederholungsversuchen in Millisekunden",
        },
        success: {
          title: "Konfiguration gespeichert",
          description: "Campaign-Starter-Konfiguration erfolgreich gespeichert",
        },
      },
      priority: {
        critical: "Kritisch",
        high: "Hoch",
        medium: "Mittel",
        low: "Niedrig",
        background: "Hintergrund",
        filter: {
          all: "Alle Prioritäten",
          highAndAbove: "Hoch und höher",
          mediumAndAbove: "Mittel und höher",
        },
      },
      widget: {
        title: "Campaign-Starter-Konfiguration",
        titleSaved: "Konfiguration gespeichert",
        description:
          "Kampagnen für neue Leads starten, die kontaktiert werden können.",
        saving: "Speichern...",
        save: "Einstellungen speichern",
        addLocale: "+ Sprache hinzufügen",
        guidanceTitle: "Campaign Starter konfigurieren",
        guidanceDescription:
          "Zeitplan, aktive Tage/Stunden und Leads-pro-Woche-Ziele festlegen.",
        runButton: "Kampagnen starten",
        running: "Läuft...",
        done: "Fertig",
        perRunBudget:
          "~{{perRunBudget}} Leads/Lauf · {{totalRunsPerWeek}} Läufe/Woche",
        perRunBudgetFractional:
          "{{exactBudget}}/Lauf · {{totalRunsPerWeek}} Läufe/Woche (gebrochen - akkumuliert über Läufe)",
        perRunBudgetZeroHint:
          "— Leads/Woche erhöhen oder Zeitplanfrequenz reduzieren",
        sections: {
          general: "Allgemein",
          generalDescription:
            "Hauptsteuerung zum Aktivieren des Campaign Starters und des Testmodus.",
          schedule: "Zeitplan",
          scheduleDescription:
            "Wann sollen Kampagnen laufen? Cron-Zeitplan, aktive Tage und Stunden festlegen.",
          hoursTimezoneNote:
            "Stunden in Ihrer Browser-Zeitzone ({{offset}}). Auf dem Server als UTC gespeichert.",
          quotas: "Kontingente",
          quotasDescription:
            "Wie viele Leads pro Woche verarbeitet werden sollen, aufgeteilt nach Sprache.",
          advanced: "Erweitert",
          advancedDescription:
            "Task-Ausführungseinstellungen wie Priorität, Timeouts und Wiederholungsverhalten.",
        },
        days: {
          mon: "Mo",
          tue: "Di",
          wed: "Mi",
          thu: "Do",
          fri: "Fr",
          sat: "Sa",
          sun: "So",
        },
      },
    },
    emailCampaigns: {
      category: "Kampagnen-Verwaltung",
      tag: "E-Mail-Kampagnen",
      task: {
        description:
          "Automatisierte E-Mail-Kampagnen an Leads basierend auf deren Phase und Timing senden",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
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
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
      post: {
        title: "E-Mail-Kampagnen",
        description: "E-Mail-Kampagnen für Leads verarbeiten",
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: { title: "Verboten", description: "Zugriff verboten" },
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
            description: "Es gibt ungespeicherte Änderungen",
          },
        },
        fields: {
          batchSize: {
            label: "Batch-Größe",
            description: "Anzahl der Leads pro Batch",
          },
          maxEmailsPerRun: {
            label: "Max. E-Mails pro Durchlauf",
            description: "Maximale Anzahl zu sendender E-Mails pro Durchlauf",
          },
          dryRun: {
            label: "Testlauf",
            description: "Ohne E-Mail-Versand ausführen",
          },
        },
        response: {
          emailsScheduled: "Geplante E-Mails",
          emailsSent: "Gesendete E-Mails",
          emailsFailed: "Fehlgeschlagene E-Mails",
          leadsProcessed: "Verarbeitete Leads",
        },
        success: {
          title: "Erfolg",
          description: "Vorgang erfolgreich abgeschlossen",
        },
      },
      get: {
        title: "E-Mail-Kampagnen-Konfiguration abrufen",
        description: "E-Mail-Kampagnen-Hintergrundaufgaben-Konfiguration laden",
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: { title: "Verboten", description: "Zugriff verboten" },
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
            description: "Es gibt ungespeicherte Änderungen",
          },
        },
        response: {
          enabled: "Aktiviert",
          dryRun: "Testmodus",
          batchSize: "Batch-Größe",
          maxEmailsPerRun: "Max. E-Mails pro Durchlauf",
          schedule: "Zeitplan",
          priority: "Priorität",
          timeout: "Timeout",
          retries: "Wiederholungen",
          retryDelay: "Wiederholungsverzögerung",
        },
        success: {
          title: "Konfiguration erfolgreich geladen",
          description: "E-Mail-Kampagnen-Konfiguration erfolgreich geladen",
        },
      },
      put: {
        title: "E-Mail-Kampagnen-Konfiguration",
        description:
          "E-Mail-Kampagnen-Hintergrundaufgaben-Konfiguration aktualisieren",
        enabled: {
          label: "Aktiviert",
          description:
            "E-Mail-Kampagnen-Hintergrundaufgabe aktivieren oder deaktivieren",
        },
        dryRun: {
          label: "Testmodus",
          description: "E-Mails verarbeiten ohne sie zu senden",
        },
        batchSize: {
          label: "Batch-Größe",
          description: "Anzahl der zu verarbeitenden Leads pro Batch (1–100)",
        },
        maxEmailsPerRun: {
          label: "Max. E-Mails pro Durchlauf",
          description:
            "Maximale Anzahl zu sendender E-Mails pro Hintergrundlauf (1–1000)",
        },
        schedule: {
          label: "Zeitplan",
          description: "Cron-Ausdruck für die E-Mail-Kampagnen-Ausführung",
        },
        priority: {
          label: "Priorität",
          description: "Prioritätsstufe für die Task-Ausführung",
        },
        timeout: {
          label: "Timeout (ms)",
          description: "Maximale Ausführungszeit in Millisekunden",
        },
        retries: {
          label: "Wiederholungen",
          description: "Anzahl der Wiederholungsversuche bei Fehler",
        },
        retryDelay: {
          label: "Wiederholungsverzögerung (ms)",
          description:
            "Verzögerung zwischen Wiederholungsversuchen in Millisekunden",
        },
        success: {
          title: "Konfiguration gespeichert",
          description: "E-Mail-Kampagnen-Konfiguration erfolgreich gespeichert",
        },
      },
      priority: {
        critical: "Kritisch",
        high: "Hoch",
        medium: "Mittel",
        low: "Niedrig",
        background: "Hintergrund",
      },
      widget: {
        title: "E-Mail-Kampagnen-Konfiguration",
        titleSaved: "Konfiguration gespeichert",
        saving: "Speichern...",
        save: "Einstellungen speichern",
        guidanceTitle: "E-Mail-Kampagnen-Hintergrundaufgabe konfigurieren",
        guidanceDescription:
          "E-Mail-Kampagnen-Cron-Task aktivieren/deaktivieren und Zeitplan, Batch-Größe konfigurieren.",
        runButton: "Jetzt ausführen",
        running: "Wird ausgeführt...",
        done: "Fertig",
        sections: {
          general: "Allgemein",
          generalDescription:
            "Hauptsteuerung für E-Mail-Kampagnen-Task und Testmodus.",
          schedule: "Zeitplan",
          scheduleDescription: "Cron-Zeitplan für E-Mail-Versand festlegen.",
          processing: "Verarbeitung",
          processingDescription:
            "Konfigurieren Sie, wie viele Leads und E-Mails pro Durchlauf verarbeitet werden.",
          advanced: "Erweitert",
          advancedDescription:
            "Task-Ausführungseinstellungen wie Priorität, Timeouts und Wiederholungsverhalten.",
        },
      },
    },
    emails: {
      common: {
        logoPart1: "Next",
        logoPart2: "Vibe",
      },
      email: {
        template: {
          tagline: "Bessere Produkte schneller entwickeln",
        },
      },
      emailJourneys: {
        components: {
          footer: {
            copyright: "© 2024 {{appName}}. Alle Rechte vorbehalten.",
            helpText:
              "Bei Fragen kontaktieren Sie uns bitte unter {{config.emails.support}}",
            unsubscribeText: "Möchten Sie diese E-Mails nicht mehr erhalten?",
            unsubscribeLink: "Abmelden",
          },
          socialProof: {
            quotePrefix: "„",
            quoteSuffix: "201D",
            attribution: "— Kundenname, Unternehmen",
          },
        },
      },
      journeys: {
        emailJourneys: {
          components: {
            defaults: {
              signatureName: "Ein anderer unbottled.ai-Nutzer",
              previewLeadId: "vorschau-lead-id",
              previewEmail: "vorschau@beispiel.de",
              previewBusinessName: "Muster GmbH",
              previewContactName: "Vorschau Nutzer",
              previewPhone: "+491234567890",
              previewCampaignId: "vorschau-kampagne-id",
            },
            footer: {
              unsubscribeText:
                "Sie erhalten diese E-Mail, weil Sie sich angemeldet haben.",
              unsubscribeLink: "Abmelden",
            },
            journeyInfo: {
              uncensoredConvert: {
                name: "Unzensierter Konverter",
                description:
                  "Ein Begeisterter teilt seine Entdeckung von unbottled.ai",
                longDescription:
                  "Begeisterter teilt eine echte Entdeckung mit Affiliate-Transparenz",
                characteristics: {
                  tone: "Lockerer, verschwörerischer Ton",
                  story: "Echte persönliche Geschichte",
                  transparency: "Affiliate-Transparenz",
                  angle: "Anti-Zensur-Winkel",
                  energy: "Begeisterte Energie",
                },
              },
              sideHustle: {
                name: "Nebenverdienst",
                description:
                  "Ein transparenter Affiliate teilt echte Anwendungsfälle",
                longDescription:
                  "Transparenter Affiliate-Vermarkter teilt echte wöchentliche Anwendungsfälle",
                characteristics: {
                  disclosure:
                    "Vollständige Affiliate-Offenlegung von Anfang an",
                  updates: "Wöchentliche Anwendungsfalls-Updates",
                  income: "Passives Einkommens-Story",
                  proof: "Praktischer Beweis, kein Hype",
                  energy: "Ehrliche Hustle-Energie",
                },
              },
              quietRecommendation: {
                name: "Stille Empfehlung",
                description:
                  "Ein sachlicher Profi gibt ein getestetes Tool weiter",
                longDescription:
                  "Zurückhaltender Profi gibt ein wochenlang getestetes Tool weiter",
                characteristics: {
                  signal: "Kurz, hohes Signal-Rausch-Verhältnis",
                  specifics: "Kein Hype, nur Fakten",
                  testing: "3-Wochen-Test-Geschichte",
                  comparison: "Ehrlicher Vergleich mit ChatGPT",
                  affiliate: "Minimale Affiliate-Erwähnung",
                },
              },
              signupNurture: {
                name: "Anmelde-Nurturing",
                description: "Onboarding-Sequenz für neu angemeldete Benutzer",
                longDescription:
                  "Willkommens- und Onboarding-E-Mails, die neuen Benutzern den Einstieg erleichtern",
              },
              retention: {
                name: "Kundenbindung",
                description: "Reaktivierung für bestehende Abonnenten",
                longDescription:
                  "Wertorientierte E-Mails, um aktive Abonnenten zu binden und Funktionen zu erkunden",
              },
              winback: {
                name: "Rückgewinnung",
                description: "Inaktive oder abgewanderte Nutzer zurückgewinnen",
                longDescription:
                  "Reaktivierungskampagne für Nutzer, die inaktiv geworden sind oder abgebrochen haben",
              },
              newsletterMay2026: {
                name: "Newsletter Mai 2026",
                description:
                  "Einmaliger Newsletter über Cortex, Dreamer, Autopilot und Mediengenerierung",
                longDescription:
                  "Produkt-Update-Newsletter Mai 2026 für alle registrierten Nutzer mit ehrlichem Bug-Eingeständnis und Feature-Highlights",
              },
            },
          },
        },
      },
      services: {
        scheduler: {
          cancelledBySystem: "Vom System abgebrochen",
        },
        abTesting: {
          invalidWeights: "Gesamtgewichte der Varianten müssen 100% ergeben",
          negativeWeight: "Variantengewicht muss positiv sein",
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
      },
      testMail: {
        category: "Leads",
        tags: {
          campaigns: "Campaigns",
          leads: "Leads",
        },
        post: {
          title: "Test-Mail",
          description: "Test-E-Mail mit benutzerdefinierten Lead-Daten senden",
          form: {
            title: "Test-Mail-Konfiguration",
            description: "Test-Mail-Parameter und Lead-Daten konfigurieren",
          },
          campaignType: {
            label: "Kampagnentyp",
            description: "Art der E-Mail-Kampagne",
            placeholder: "Kampagnentyp eingeben",
          },
          emailJourneyVariant: {
            label: "E-Mail-Journey-Variante",
            description: "A/B-Test-Variante für E-Mail-Journey",
            placeholder: "Journey-Variante auswählen",
          },
          emailCampaignStage: {
            label: "E-Mail-Kampagnenstufe",
            description: "Aktuelle Stufe in der E-Mail-Kampagne",
            placeholder: "Kampagnenstufe auswählen",
          },
          testEmail: {
            label: "Test-E-Mail-Adresse",
            description: "E-Mail-Adresse, an die Test-Mail gesendet wird",
            placeholder: "test@example.com",
          },
          leadData: {
            title: "Lead-Daten",
            description: "Lead-Informationen für Template-Rendering",
            businessName: {
              label: "Unternehmensname",
              description: "Name des Unternehmens",
              placeholder: "Acme Corporation",
            },
            contactName: {
              label: "Kontaktname",
              description: "Name der Kontaktperson",
              placeholder: "Max Mustermann",
            },
            website: {
              label: "Website",
              description: "Unternehmens-Website-URL",
              placeholder: "https://example.com",
            },
            country: {
              label: "Land",
              description: "Ländercode",
              placeholder: "GLOBAL",
            },
            language: {
              label: "Sprache",
              description: "Bevorzugter Sprachcode",
              placeholder: "de",
            },
            status: {
              label: "Status",
              description: "Lead-Status",
              placeholder: "NEW",
            },
            source: {
              label: "Quelle",
              description: "Lead-Quelle",
              placeholder: "WEBSITE",
            },
            notes: {
              label: "Notizen",
              description: "Zusätzliche Notizen zum Lead",
              placeholder: "Zusätzliche Notizen eingeben",
            },
          },
          response: {
            title: "Test-E-Mail-Ergebnis",
            description: "Ergebnis des Sendens der Test-E-Mail",
            success: {
              content: "Erfolg",
            },
            messageId: {
              content: "Nachrichten-ID",
            },
            testEmail: {
              content: "Test-E-Mail",
            },
            subject: {
              content: "E-Mail-Betreff",
            },
            sentAt: {
              content: "Gesendet am",
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
            unsavedChanges: {
              title: "Ungespeicherte Änderungen",
              description: "Es gibt ungespeicherte Änderungen",
            },
            conflict: {
              title: "Konflikt",
              description: "Datenkonflikt aufgetreten",
            },
            templateNotFound: {
              title: "Vorlage nicht gefunden",
              description:
                "E-Mail-Vorlage für angegebene Parameter nicht gefunden",
            },
            sendingFailed: {
              title: "Senden fehlgeschlagen",
              description: "Test-E-Mail konnte nicht gesendet werden",
            },
          },
          success: {
            title: "Erfolg",
            description: "Test-E-Mail erfolgreich gesendet",
          },
          selectionCriteria: "SMTP-Auswahlkriterien",
          widget: {
            title: "Test-E-Mail senden",
            send: "Test-E-Mail senden",
            sending: "Wird gesendet...",
            successMessage: "Test-E-Mail erfolgreich gesendet",
            sentTo: "Gesendet an: ",
            subject: "Betreff: ",
            sentAt: "Gesendet am: ",
            campaignConfig: "Kampagnenkonfiguration",
            sendAnother: "Weitere senden",
          },
        },
      },
    },
  },
  create: {
    category: "Leads",
    tags: {
      leads: "Leads",
      create: "Erstellen",
    },

    enums: {
      leadSource: {
        website: "Website",
        socialMedia: "Soziale Medien",
        emailCampaign: "E-Mail-Kampagne",
        referral: "Empfehlung",
        csvImport: "CSV-Import",
      },
    },
    widget: {
      headerLeadCreated: "Lead erstellt",
      headerCreateLead: "Lead erstellen",
      subheaderFillDetails: "Füllen Sie die Details unten aus",
      fallbackLeadName: "Lead",
      buttonCopyId: "ID kopieren",
      buttonViewLead: "Lead anzeigen",
      buttonEditLead: "Lead bearbeiten",
      buttonBackToList: "Zurück zur Liste",
    },
    post: {
      title: "Lead erstellen",
      description: "Einen neuen Lead im System erstellen",
      backButton: {
        label: "Zurück zu Leads",
      },
      submitButton: {
        label: "Lead erstellen",
        loadingText: "Lead wird erstellt...",
      },
      form: {
        title: "Neues Lead-Formular",
        description:
          "Lead-Informationen eingeben um einen neuen Lead zu erstellen",
      },
      contactInfo: {
        title: "Kontaktinformationen",
        description: "Primäre Kontaktdaten für den Lead",
      },
      email: {
        label: "E-Mail-Adresse",
        description: "Primäre E-Mail-Adresse für die Kommunikation",
        placeholder: "john@beispiel.com",
      },
      businessName: {
        label: "Firmenname",
        description: "Name des Unternehmens oder Geschäfts",
        placeholder: "Beispiel GmbH",
      },
      phone: {
        label: "Telefonnummer",
        description: "Kontakt-Telefonnummer mit Ländercode",
        placeholder: "+491234567890",
      },
      website: {
        label: "Webseite",
        description: "Firmen-Website-URL",
        placeholder: "https://beispiel.de",
      },
      locationPreferences: {
        title: "Standort & Präferenzen",
        description: "Geografische und Sprachpräferenzen",
      },
      country: {
        label: "Land",
        description: "Geschäftsstandort oder Zielmarkt",
        placeholder: "Land auswählen",
      },
      language: {
        label: "Sprache",
        description: "Bevorzugte Kommunikationssprache",
        placeholder: "Sprache auswählen",
      },
      leadDetails: {
        title: "Lead-Details",
        description: "Zusätzliche Informationen über den Lead",
      },
      source: {
        label: "Lead-Quelle",
        description: "Wie der Lead akquiriert wurde",
        placeholder: "Quelle auswählen",
      },
      notes: {
        label: "Notizen",
        description: "Zusätzliche Notizen oder Kommentare",
        placeholder: "Zusätzliche Informationen eingeben...",
      },
      response: {
        title: "Erstellter Lead",
        description: "Details des neu erstellten Leads",
        summary: {
          title: "Lead-Zusammenfassung",
          id: "Lead-ID",
          businessName: "Firmenname",
          email: "E-Mail-Adresse",
          status: "Lead-Status",
        },
        contactDetails: {
          title: "Kontaktdetails",
          phone: "Telefonnummer",
          website: "Website-URL",
          country: "Land",
          language: "Sprache",
        },
        trackingInfo: {
          title: "Tracking-Informationen",
          source: "Lead-Quelle",
          emailsSent: "E-Mail-Anzahl",
          currentCampaignStage: "Kampagnenstufe",
        },
        metadata: {
          title: "Metadaten",
          notes: "Notizen",
          createdAt: "Erstellungsdatum",
          updatedAt: "Zuletzt aktualisiert",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich um Leads zu erstellen",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Lead-Informationen angegeben",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler beim Erstellen des Leads",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler beim Erstellen des Leads",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Erstellen des Leads",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff für Lead-Erstellung verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Benötigte Ressource für Lead-Erstellung nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Lead existiert bereits oder Datenkonflikt aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen im Lead-Formular",
        },
      },
      success: {
        title: "Lead erstellt",
        description: "Lead erfolgreich erstellt",
      },
    },
    email: {
      welcome: {
        subject: "Willkommen bei {{companyName}}",
        title: "Willkommen bei {{companyName}}, {{businessName}}!",
        preview: "Willkommen bei unserem Service - lassen Sie uns starten",
        greeting:
          "Willkommen bei {{companyName}}, {{businessName}}! Wir freuen uns darauf, Ihrem Unternehmen beim Wachstum zu helfen.",
        defaultName: "dort",
        introduction:
          "Vielen Dank für Ihr Interesse an unseren Dienstleistungen. Wir haben Ihre Informationen erhalten und unser Team ist bereit, Ihnen bei der Erreichung Ihrer Geschäftsziele zu helfen.",
        nextSteps: {
          title: "Was passiert als Nächstes?",
          step1Number: "1.",
          step1:
            "Unser Team wird Ihr Geschäftsprofil und Ihre Ziele überprüfen",
          step2Number: "2.",
          step2:
            "Sie erhalten innerhalb von 24 Stunden einen personalisierten Beratungsvorschlag",
          step3Number: "3.",
          step3:
            "Wir vereinbaren einen Termin, um Ihre spezifischen Bedürfnisse und Ziele zu besprechen",
        },
        cta: {
          getStarted: "Beratung planen",
        },
        support:
          "Haben Sie Fragen? Antworten Sie auf diese E-Mail oder kontaktieren Sie uns unter {{supportEmail}}",
        error: {
          noEmail:
            "Willkommens-E-Mail kann nicht gesendet werden - keine E-Mail-Adresse angegeben",
        },
      },
      admin: {
        newLead: {
          subject: "Neuer Lead: {{businessName}}",
          title: "Neuer Lead erstellt",
          preview: "Neuer Lead von {{businessName}} benötigt Nachfassen",
          message:
            "Ein neuer Lead wurde im System von {{businessName}} erstellt und benötigt Ihre Aufmerksamkeit.",
          leadDetails: "Lead-Details",
          businessName: "Firmenname",
          email: "E-Mail",
          phone: "Telefon",
          website: "Webseite",
          source: "Quelle",
          status: "Status",
          notes: "Notizen",
          notProvided: "Nicht angegeben",
          viewLead: "Lead-Details ansehen",
          viewAllLeads: "Alle Leads ansehen",
          error: {
            noData:
              "Admin-Benachrichtigung kann nicht gesendet werden - keine Lead-Daten angegeben",
          },
          defaultName: "Neuer Lead",
        },
      },
      error: {
        general: {
          internal_server_error: "Ein interner Serverfehler ist aufgetreten",
        },
      },
    },
  },
  export: {
    category: "Leads",
    tags: {
      leads: "Leads",
      export: "Exportieren",
    },

    get: {
      title: "Leads exportieren",
      description: "Lead-Daten in Datei exportieren",
      form: {
        title: "Export-Konfiguration",
        description: "Lead-Exportparameter und Filter konfigurieren",
      },
      format: {
        label: "Exportformat",
        description: "Dateiformat für den Export",
      },
      status: {
        label: "Lead-Status",
        description: "Nach Lead-Status filtern",
      },
      country: {
        label: "Land",
        description: "Nach Land filtern",
        placeholder: "Land auswählen",
      },
      language: {
        label: "Sprache",
        description: "Nach Sprache filtern",
        placeholder: "Sprache auswählen",
      },
      source: {
        label: "Lead-Quelle",
        description: "Nach Lead-Quelle filtern",
        placeholder: "Quelle auswählen",
      },
      search: {
        label: "Suche",
        description: "Leads nach Text durchsuchen",
        placeholder: "Leads suchen...",
      },
      dateFrom: {
        label: "Startdatum",
        description: "Leads ab diesem Datum exportieren",
      },
      dateTo: {
        label: "Enddatum",
        description: "Leads bis zu diesem Datum exportieren",
      },
      includeMetadata: {
        label: "Metadaten einschließen",
        description: "Erstellungs- und Aktualisierungszeitstempel einschließen",
      },
      includeEngagementData: {
        label: "Engagement-Daten einschließen",
        description: "E-Mail-Tracking und Kampagnendaten einschließen",
      },
      response: {
        title: "Exportdatei",
        description: "Generierte Exportdatei mit Lead-Daten",
        fileName: "Dateiname",
        fileContent: "Dateiinhalt (Base64)",
        mimeType: "MIME-Typ",
        totalRecords: "Gesamtanzahl Datensätze",
        exportedAt: "Exportiert am",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich um Leads zu exportieren",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Exportparameter oder Filter",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler beim Export",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler beim Export",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Export",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff für Lead-Export verboten",
        },
        notFound: {
          title: "Keine Daten",
          description:
            "Keine Leads gefunden die den Exportkriterien entsprechen",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt beim Export",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen im Exportformular",
        },
      },
      success: {
        title: "Export abgeschlossen",
        description: "Lead-Export erfolgreich abgeschlossen",
      },
    },
    widget: {
      exportLeads: "Leads exportieren",
      import: "Importieren",
      viewList: "Liste anzeigen",
      importLeadsTitle: "Leads importieren",
      viewLeadsListTitle: "Lead-Liste anzeigen",
      copyCsvTitle: "CSV-Inhalt in Zwischenablage kopieren",
      generatingExport: "Export wird generiert…",
      generatingExportHint:
        "Dies kann bei großen Datensätzen einen Moment dauern",
      exportReady: "Export bereit",
      fileReadyToDownload: "Ihre Datei kann heruntergeladen werden",
      records: "Datensätze",
      format: "Format",
      fileSize: "Dateigröße",
      copied: "Kopiert!",
      copy: "Kopieren",
      download: "Herunterladen",
      exportedAt: "Exportiert am:",
      nextSteps: "Nächste Schritte:",
      viewLeads: "Leads anzeigen",
      importLeads: "Leads importieren",
      configureExport: "Export konfigurieren",
      configureExportHint:
        "Format und Filter unten auswählen, dann auf Exportieren klicken um die Datei zu generieren",
      formatLabel: "Format",
      formatHint: "CSV oder Excel (XLSX) auswählen",
      statusFilter: "Statusfilter",
      statusFilterHint: "Nur Leads mit einem bestimmten Status exportieren",
      dateRange: "Datumsbereich",
      dateRangeHint: "Export auf ein bestimmtes Zeitfenster einschränken",
      metadataEngagement: "Metadaten & Engagement",
      metadataEngagementHint:
        "Optional zusätzliche Spalten für erweiterte Analyse einschließen",
      viewLeadsList: "Lead-Liste anzeigen",
      excelSpreadsheet: "Excel-Tabelle",
      csvFile: "CSV-Datei",
    },
    enums: {
      exportFormat: {
        csv: "CSV",
        xlsx: "Excel",
      },
      leadStatus: {
        new: "Neu",
        pending: "Ausstehend",
        campaignRunning: "Kampagne läuft",
        websiteUser: "Website-Nutzer",
        newsletterSubscriber: "Newsletter-Abonnent",
        inContact: "In Kontakt",
        signedUp: "Registriert",
        subscriptionConfirmed: "Abonnement bestätigt",
        unsubscribed: "Abgemeldet",
        bounced: "Zurückgewiesen",
        invalid: "Ungültig",
      },
      leadSource: {
        website: "Website",
        socialMedia: "Soziale Medien",
        emailCampaign: "E-Mail-Kampagne",
        referral: "Empfehlung",
        csvImport: "CSV-Import",
      },
    },
    headers: {
      email: "E-Mail",
      businessName: "Firmenname",
      contactName: "Kontaktname",
      phone: "Telefon",
      country: "Land",
      language: "Sprache",
      status: "Status",
      source: "Quelle",
      website: "Webseite",
      notes: "Notizen",
      campaignStage: "Kampagnenphase",
      emailsSent: "Gesendete E-Mails",
      emailsOpened: "Geöffnete E-Mails",
      emailsClicked: "Angeklickte E-Mails",
      lastEmailSent: "Letzte gesendete E-Mail",
      lastEngagement: "Letztes Engagement",
      unsubscribedAt: "Abgemeldet am",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      lastEngagementAt: "Letztes Engagement",
      metadata: "Metadaten",
      ipAddress: "IP-Adresse",
      userAgent: "User Agent",
      deviceType: "Gerätetyp",
      browser: "Browser",
      os: "Betriebssystem",
      referralCode: "Empfehlungscode",
    },
  },
  import: {
    tags: {
      import: "Importieren",
      leads: "Leads",
      csv: "CSV",
    },

    category: "Datenimport",
    post: {
      title: "Leads importieren",
      description: "Leads aus CSV-Datei importieren",
      form: {
        title: "Import-Konfiguration",
        description: "Lead-Importparameter konfigurieren",
      },
      file: {
        label: "CSV-Datei",
        description: "CSV-Dateiinhalt (base64-kodiert)",
        placeholder: "Base64-kodierten CSV-Inhalt einfügen",
        helpText: "CSV-Datei mit Lead-Daten hochladen",
      },
      fileName: {
        label: "Dateiname",
        description: "Name der CSV-Datei",
        placeholder: "leads.csv",
        helpText: "Aussagekräftigen Dateinamen angeben",
      },
      skipDuplicates: {
        label: "Duplikate überspringen",
        description: "Leads mit doppelten E-Mail-Adressen überspringen",
        helpText:
          "Aktivieren um existierende E-Mail-Adressen automatisch zu überspringen",
      },
      updateExisting: {
        label: "Existierende aktualisieren",
        description: "Existierende Leads mit neuen Daten aktualisieren",
        helpText:
          "Aktivieren um existierende Leads zu aktualisieren statt zu überspringen",
      },
      defaultCountry: {
        label: "Standard-Land",
        description: "Standard-Land für Leads ohne Land-Angabe",
        helpText: "Standard-Ländercode auswählen",
      },
      defaultLanguage: {
        label: "Standard-Sprache",
        description: "Standard-Sprache für Leads ohne Sprach-Angabe",
        helpText: "Standard-Sprachcode auswählen",
      },
      defaultStatus: {
        label: "Standard-Status",
        description: "Standard-Status für importierte Leads",
        helpText: "Anfangsstatus für neue Leads auswählen",
      },
      defaultCampaignStage: {
        label: "Standard-Kampagnenstufe",
        description: "Standard-E-Mail-Kampagnenstufe für importierte Leads",
        helpText: "Anfangskampagnenstufe auswählen",
      },
      defaultSource: {
        label: "Standard-Quelle",
        description: "Standard-Quellenzuordnung für importierte Leads",
        helpText: "Lead-Quelle für Tracking auswählen",
      },
      useChunkedProcessing: {
        label: "Stückweise Verarbeitung verwenden",
        description: "Große Importe in Hintergrund-Chunks verarbeiten",
        helpText: "Für Dateien mit mehr als 1000 Zeilen aktivieren",
      },
      batchSize: {
        label: "Batch-Größe",
        description: "Anzahl der Zeilen pro Batch",
        helpText: "Empfohlen: 2000 Zeilen pro Batch",
      },
      response: {
        batchId: "Batch-ID",
        totalRows: "Gesamtzeilen",
        successfulImports: "Erfolgreiche Importe",
        failedImports: "Fehlgeschlagene Importe",
        duplicateEmails: "Doppelte E-Mails",
        errors: "Import-Fehler",
        summary: "Import-Zusammenfassung",
        isChunkedProcessing: "Stückweise Verarbeitung",
        jobId: "Hintergrund-Job-ID",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Importparameter oder CSV-Format",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich um Leads zu importieren",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff für Lead-Import verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "CSV-Datei nicht gefunden oder ungültig",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt beim Import",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler beim Import",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler beim Import",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Import",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen im Importformular",
        },
      },
      success: {
        title: "Import gestartet",
        description: "Lead-Import wurde erfolgreich initiiert",
      },
      widget: {
        headerTitle: "Leads aus CSV importieren",
        exportTemplateButton: "Vorlage exportieren",
        importGuideTitle: "Import-Anleitung",
        importGuideSubtitle: "CSV-Datei mit folgenden Spalten hochladen:",
        importGuideNote:
          "Nur {{email}} ist erforderlich. Alle anderen Spalten sind optional und verwenden die unten konfigurierten Standardwerte.",
        fileRequirementsTitle: "Dateianforderungen",
        fileRequirementFormat:
          "Format: CSV (kommagetrennte Werte, UTF-8 kodiert)",
        fileRequirementHeader:
          "Die erste Zeile muss die Kopfzeile mit Spaltennamen sein",
        fileRequirementSize: "Empfohlene Maximalgröße: 50 MB pro Upload",
        fileRequirementChunked:
          "Für Dateien mit mehr als ~5.000 Zeilen {{chunkedProcessing}} aktivieren, um Timeouts zu vermeiden",
        chunkedProcessingLabel: "Stückweise Verarbeitung",
        downloadTemplateLink: "CSV-Vorlage herunterladen",
        loadingText: "Leads werden importiert\u2026",
        backgroundProcessingTitle: "Hintergrundverarbeitung",
        backgroundProcessingNote:
          "Großer Import als Job eingereiht: {{jobId}}. {{totalRows}} Zeilen werden im Hintergrund verarbeitet.",
        checkJobStatusButton: "Job-Status prüfen",
        stopJobButton: "Job stoppen",
        retryFailedButton: "Fehlgeschlagene wiederholen",
        statTotalRows: "Zeilen gesamt",
        statImported: "Importiert",
        statDuplicates: "Duplikate",
        statFailed: "Fehlgeschlagen",
        viewImportedLeadsButton: "Importierte Leads anzeigen",
        retryFailedWithCountButton: "Fehlgeschlagene wiederholen ({{count}})",
        summaryTitle: "Zusammenfassung",
        summaryNewLeads: "Neue Leads",
        summaryUpdated: "Aktualisiert",
        summarySkipped: "Übersprungen",
        successRateLabel: "Erfolgsrate",
        importErrorsTitle: "{{count}} Importfehler",
        errorRowLabel: "Zeile {{row}}",
        findLeadButton: "Lead suchen",
      },
    },
    process: {
      tag: "Importverarbeitung",
      post: {
        title: "Importaufträge verarbeiten",
        titleShort: "Import verarbeiten",
        description: "Ausstehende CSV-Importaufträge verarbeiten",
        container: {
          title: "Importverarbeitungskonfiguration",
          description: "Importverarbeitungsparameter konfigurieren",
        },
        fields: {
          maxJobsPerRun: {
            label: "Max. Aufträge pro Durchlauf",
            description:
              "Maximale Anzahl der zu verarbeitenden Aufträge pro Durchlauf",
          },
          maxRetriesPerJob: {
            label: "Max. Wiederholungen pro Auftrag",
            description: "Maximale Anzahl der Wiederholungen pro Auftrag",
          },
          dryRun: {
            label: "Testlauf",
            description: "Ausführen ohne Änderungen vorzunehmen",
          },
          selfTaskId: {
            label: "Eigene Task-ID",
            description:
              "Interne Task-ID zur Selbstbereinigung nach der Verarbeitung",
          },
        },
        response: {
          jobsProcessed: "Verarbeitete Aufträge",
          totalRowsProcessed: "Verarbeitete Zeilen gesamt",
          successfulImports: "Erfolgreiche Importe",
          failedImports: "Fehlgeschlagene Importe",
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verweigert",
          },
          server: {
            title: "Serverfehler",
            description:
              "Beim Verarbeiten der Importe ist ein Fehler aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter",
          },
        },
        success: {
          title: "Importverarbeitung abgeschlossen",
          description: "Importaufträge erfolgreich verarbeitet",
        },
      },
    },
    widget: {
      header: {
        title: "Importaufträge",
        newImport: "Neuer Import",
      },
      filter: {
        all: "Alle",
        completed: "Abgeschlossen",
        failed: "Fehlgeschlagen",
        pending: "Ausstehend",
        running: "In Bearbeitung",
      },
      loading: "Importauftr\u00E4ge werden geladen\u2026",
      empty: {
        title: "Keine Importauftr\u00E4ge gefunden",
        withFilter:
          "Versuchen Sie einen anderen Filter oder starten Sie einen neuen Import.",
        withoutFilter: "Starten Sie Ihren ersten Import, um ihn hier zu sehen.",
        newImport: "Neuer Import",
      },
    },
    jobs: {
      jobId: {
        category: "Datenimport",
        tags: {
          leads: "Leads",
          management: "Verwaltung",
        },

        get: {
          title: "Import-Job abrufen",
          description: "Details eines bestimmten Import-Jobs abrufen",
          actions: {
            retry: "Wiederholen",
            stop: "Stoppen",
            viewLeads: "Leads anzeigen",
          },
          jobId: {
            label: "Job-ID",
            description: "Eindeutige Kennung für den Import-Job",
          },
          form: {
            title: "Import-Job-Status",
            description: "Aktueller Status und Fortschritt des Import-Jobs",
          },
          response: {
            title: "Job-Informationen",
            description: "Aktuelle Import-Job-Details",
            info: {
              title: "Job-Informationen",
              description: "Grundlegende Job-Details",
            },
            id: {
              content: "Job-ID",
            },
            fileName: {
              content: "Dateiname",
            },
            status: {
              content: "Job-Status",
            },
            progress: {
              title: "Import-Fortschritt",
              description: "Aktueller Import-Fortschritt und Statistiken",
            },
            totalRows: {
              content: "Gesamtzahl der Zeilen",
            },
            processedRows: {
              content: "Verarbeitete Zeilen",
            },
            successfulImports: {
              content: "Erfolgreiche Importe",
            },
            failedImports: {
              content: "Fehlgeschlagene Importe",
            },
            duplicateEmails: {
              content: "Duplizierte E-Mails",
            },
            configuration: {
              title: "Job-Konfiguration",
              description: "Aktuelle Job-Konfigurationseinstellungen",
            },
            currentBatchStart: {
              content: "Aktueller Batch-Start",
            },
            batchSize: {
              content: "Batch-Größe",
            },
            retryCount: {
              content: "Wiederholungszähler",
            },
            maxRetries: {
              content: "Maximale Wiederholungen",
            },
            error: {
              content: "Fehlermeldung",
            },
            timestamps: {
              title: "Job-Zeitstempel",
              description: "Job-Lebenszyklus-Zeitstempel",
            },
            createdAt: {
              content: "Erstellt am",
            },
            updatedAt: {
              content: "Aktualisiert am",
            },
            startedAt: {
              content: "Gestartet am",
            },
            completedAt: {
              content: "Abgeschlossen am",
            },
          },
          errors: {
            validation: {
              title: "Validierungsfehler",
              description: "Die angegebene Job-ID ist ungültig",
            },
            unauthorized: {
              title: "Nicht autorisiert",
              description:
                "Authentifizierung erforderlich zum Anzeigen von Jobs",
            },
            forbidden: {
              title: "Zugriff verweigert",
              description:
                "Sie haben keine Berechtigung, diesen Job anzuzeigen",
            },
            notFound: {
              title: "Job nicht gefunden",
              description: "Kein Import-Job mit der angegebenen ID gefunden",
            },
            server: {
              title: "Serverfehler",
              description: "Beim Abrufen des Jobs ist ein Fehler aufgetreten",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description: "Ein unerwarteter Fehler ist aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description: "Verbindung zum Server nicht möglich",
            },
            unsavedChanges: {
              title: "Nicht gespeicherte Änderungen",
              description: "Sie haben nicht gespeicherte Änderungen",
            },
            conflict: {
              title: "Konflikt",
              description: "Beim Abrufen des Jobs ist ein Konflikt aufgetreten",
            },
          },
          success: {
            title: "Erfolg",
            description: "Import-Job erfolgreich abgerufen",
          },
        },
        patch: {
          title: "Import-Job aktualisieren",
          description: "Import-Job-Konfigurationseinstellungen aktualisieren",
          jobId: {
            label: "Job-ID",
            description: "Eindeutige Kennung für den Import-Job",
          },
          form: {
            title: "Job-Einstellungen aktualisieren",
            description: "Import-Job-Konfiguration ändern",
          },
          settings: {
            title: "Job-Einstellungen",
            description: "Konfigurationseinstellungen für den Import-Job",
          },
          batchSize: {
            label: "Batch-Größe",
            description:
              "Anzahl der Zeilen, die in jedem Batch verarbeitet werden",
            placeholder: "100",
          },
          maxRetries: {
            label: "Maximale Wiederholungen",
            description:
              "Maximale Anzahl von Wiederholungsversuchen für fehlgeschlagene Zeilen",
            placeholder: "3",
          },
          response: {
            title: "Aktualisierte Job-Informationen",
            description: "Aktualisierte Import-Job-Details",
            info: {
              title: "Job-Informationen",
              description: "Grundlegende Job-Details",
            },
            id: {
              content: "Job-ID",
            },
            fileName: {
              content: "Dateiname",
            },
            status: {
              content: "Job-Status",
            },
            progress: {
              title: "Import-Fortschritt",
              description: "Aktueller Import-Fortschritt und Statistiken",
            },
            totalRows: {
              content: "Gesamtzahl der Zeilen",
            },
            processedRows: {
              content: "Verarbeitete Zeilen",
            },
            successfulImports: {
              content: "Erfolgreiche Importe",
            },
            failedImports: {
              content: "Fehlgeschlagene Importe",
            },
            duplicateEmails: {
              content: "Duplizierte E-Mails",
            },
            configuration: {
              title: "Job-Konfiguration",
              description: "Aktuelle Job-Konfigurationseinstellungen",
            },
            currentBatchStart: {
              content: "Aktueller Batch-Start",
            },
            batchSize: {
              content: "Batch-Größe",
            },
            retryCount: {
              content: "Wiederholungszähler",
            },
            maxRetries: {
              content: "Maximale Wiederholungen",
            },
            error: {
              content: "Fehlermeldung",
            },
            timestamps: {
              title: "Job-Zeitstempel",
              description: "Job-Lebenszyklus-Zeitstempel",
            },
            createdAt: {
              content: "Erstellt am",
            },
            updatedAt: {
              content: "Aktualisiert am",
            },
            startedAt: {
              content: "Gestartet am",
            },
            completedAt: {
              content: "Abgeschlossen am",
            },
          },
          errors: {
            validation: {
              title: "Validierungsfehler",
              description: "Die bereitgestellten Daten sind ungültig",
            },
            unauthorized: {
              title: "Nicht autorisiert",
              description:
                "Authentifizierung erforderlich zum Aktualisieren von Jobs",
            },
            forbidden: {
              title: "Zugriff verweigert",
              description:
                "Sie haben keine Berechtigung, diesen Job zu aktualisieren",
            },
            notFound: {
              title: "Job nicht gefunden",
              description: "Kein Import-Job mit der angegebenen ID gefunden",
            },
            server: {
              title: "Serverfehler",
              description:
                "Beim Aktualisieren des Jobs ist ein Fehler aufgetreten",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description: "Ein unerwarteter Fehler ist aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description: "Verbindung zum Server nicht möglich",
            },
            unsavedChanges: {
              title: "Nicht gespeicherte Änderungen",
              description: "Sie haben nicht gespeicherte Änderungen",
            },
            conflict: {
              title: "Aktualisierungskonflikt",
              description: "Der Job wurde von einem anderen Benutzer geändert",
            },
          },
          success: {
            title: "Erfolg",
            description: "Import-Job erfolgreich aktualisiert",
          },
        },
        delete: {
          title: "Import-Job löschen",
          description: "Einen bestimmten Import-Job löschen",
          jobId: {
            label: "Job-ID",
            description: "Eindeutige Kennung für den zu löschenden Import-Job",
          },
          form: {
            title: "Import-Job löschen",
            description: "Löschen des Import-Jobs bestätigen",
          },
          response: {
            title: "Löschergebnis",
            description: "Ergebnis des Löschvorgangs",
            success: {
              content: "Erfolgsstatus",
            },
            message: {
              content: "Löschmeldung",
            },
          },
          errors: {
            validation: {
              title: "Validierungsfehler",
              description: "Die angegebene Job-ID ist ungültig",
            },
            unauthorized: {
              title: "Nicht autorisiert",
              description:
                "Authentifizierung erforderlich zum Löschen von Jobs",
            },
            forbidden: {
              title: "Zugriff verweigert",
              description:
                "Sie haben keine Berechtigung, diesen Job zu löschen",
            },
            notFound: {
              title: "Job nicht gefunden",
              description: "Kein Import-Job mit der angegebenen ID gefunden",
            },
            server: {
              title: "Serverfehler",
              description: "Beim Löschen des Jobs ist ein Fehler aufgetreten",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description: "Ein unerwarteter Fehler ist aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description: "Verbindung zum Server nicht möglich",
            },
            unsavedChanges: {
              title: "Nicht gespeicherte Änderungen",
              description: "Sie haben nicht gespeicherte Änderungen",
            },
            conflict: {
              title: "Löschkonflikt",
              description:
                "Job, der gerade verarbeitet wird, kann nicht gelöscht werden",
            },
          },
          success: {
            title: "Erfolg",
            description: "Import-Job erfolgreich gelöscht",
          },
        },
        retry: {
          category: "Datenimport",
          tags: {
            leads: "Leads",
            management: "Verwaltung",
          },

          post: {
            title: "Import-Job wiederholen",
            description: "Einen fehlgeschlagenen Import-Job wiederholen",
            jobId: {
              label: "Job-ID",
              description:
                "Eindeutige Kennung für den zu wiederholenden Import-Job",
            },
            form: {
              title: "Import-Job wiederholen",
              description: "Den fehlgeschlagenen Import-Job wiederholen",
            },
            response: {
              title: "Wiederholungsergebnis",
              description: "Ergebnis der Wiederholungsoperation",
              success: {
                content: "Erfolgsstatus",
              },
              message: {
                content: "Wiederholungsnachricht",
              },
            },
            errors: {
              validation: {
                title: "Validierungsfehler",
                description: "Die angegebene Job-ID ist ungültig",
              },
              unauthorized: {
                title: "Nicht autorisiert",
                description:
                  "Authentifizierung erforderlich, um Jobs zu wiederholen",
              },
              forbidden: {
                title: "Zugriff verweigert",
                description:
                  "Sie haben keine Berechtigung, diesen Job zu wiederholen",
              },
              notFound: {
                title: "Job nicht gefunden",
                description: "Kein Import-Job mit der angegebenen ID gefunden",
              },
              server: {
                title: "Serverfehler",
                description:
                  "Beim Wiederholen des Jobs ist ein Fehler aufgetreten",
              },
              unknown: {
                title: "Unbekannter Fehler",
                description: "Ein unerwarteter Fehler ist aufgetreten",
              },
              network: {
                title: "Netzwerkfehler",
                description: "Verbindung zum Server nicht möglich",
              },
              unsavedChanges: {
                title: "Nicht gespeicherte Änderungen",
                description: "Sie haben nicht gespeicherte Änderungen",
              },
              conflict: {
                title: "Wiederholungskonflikt",
                description:
                  "Job kann nicht wiederholt werden, während er verarbeitet wird",
              },
            },
            success: {
              title: "Erfolg",
              description: "Import-Job erfolgreich wiederholt",
            },
          },
          widget: {
            title: "Import-Job wiederholen",
            successMessage: "Job-Wiederholung erfolgreich gestartet",
          },
        },
        stop: {
          category: "Datenimport",
          tags: {
            leads: "Leads",
            management: "Verwaltung",
          },

          post: {
            title: "Import-Job stoppen",
            description: "Einen laufenden Import-Job stoppen",
            jobId: {
              label: "Job-ID",
              description:
                "Eindeutige Kennung für den zu stoppenden Import-Job",
            },
            form: {
              title: "Import-Job stoppen",
              description: "Den laufenden Import-Job stoppen",
            },
            response: {
              title: "Stoppergebnis",
              description: "Ergebnis der Stoppoperation",
              success: {
                content: "Erfolgsstatus",
              },
              message: {
                content: "Stoppnachricht",
              },
            },
            errors: {
              validation: {
                title: "Validierungsfehler",
                description: "Die angegebene Job-ID ist ungültig",
              },
              unauthorized: {
                title: "Nicht autorisiert",
                description:
                  "Authentifizierung erforderlich, um Jobs zu stoppen",
              },
              forbidden: {
                title: "Zugriff verweigert",
                description:
                  "Sie haben keine Berechtigung, diesen Job zu stoppen",
              },
              notFound: {
                title: "Job nicht gefunden",
                description: "Kein Import-Job mit der angegebenen ID gefunden",
              },
              server: {
                title: "Serverfehler",
                description: "Beim Stoppen des Jobs ist ein Fehler aufgetreten",
              },
              unknown: {
                title: "Unbekannter Fehler",
                description: "Ein unerwarteter Fehler ist aufgetreten",
              },
              network: {
                title: "Netzwerkfehler",
                description: "Verbindung zum Server nicht möglich",
              },
              unsavedChanges: {
                title: "Nicht gespeicherte Änderungen",
                description: "Sie haben nicht gespeicherte Änderungen",
              },
              conflict: {
                title: "Stoppkonflikt",
                description:
                  "Job kann nicht gestoppt werden, wenn er nicht verarbeitet wird",
              },
            },
            success: {
              title: "Erfolg",
              description: "Import-Job erfolgreich gestoppt",
            },
          },
          widget: {
            title: "Import-Job stoppen",
            successMessage: "Job erfolgreich gestoppt",
          },
        },
        widget: {
          status: {
            title: "Import-Job-Status",
            loadingJobStatus: "Job-Status wird geladen…",
            totalRows: "Gesamtzeilen",
            processed: "Verarbeitet",
            imported: "Importiert",
            failed: "Fehlgeschlagen",
            duplicates: "Duplikate",
            progress: "Fortschritt",
            configurationTitle: "Konfiguration",
            batchSize: "Batch-Größe",
            batchStart: "Batch-Start",
            retries: "Wiederholungen",
            timestampsTitle: "Zeitstempel",
            created: "Erstellt",
            started: "Gestartet",
            completed: "Abgeschlossen",
            jobStatus: {
              enums: {
                csvImportJobStatus: {
                  pending: "Ausstehend",
                  processing: "Wird verarbeitet",
                  completed: "Abgeschlossen",
                  failed: "Fehlgeschlagen",
                },
              },
            },
          },
          retry: {
            title: "Import-Job wiederholen",
            loadingRetrying: "Job wird wiederholt…",
            successMessage: "Job erfolgreich wiederholt",
            failureMessage: "Wiederholung fehlgeschlagen",
            viewJobStatus: "Job-Status anzeigen",
            viewLeads: "Leads anzeigen",
          },
          stop: {
            title: "Import-Job stoppen",
            loadingStopping: "Job wird gestoppt…",
            successMessage: "Job erfolgreich gestoppt",
            failureMessage: "Stoppen fehlgeschlagen",
            viewLeads: "Leads anzeigen",
            startNewImport: "Neuen Import starten",
          },
        },
      },
    },
    status: {
      category: "Datenimport",
      tags: {
        import: "Importieren",
        jobs: "Jobs",
        list: "Liste",
      },

      get: {
        title: "Import-Jobs Status",
        description: "CSV-Import-Jobs auflisten und überwachen",
        form: {
          title: "Job-Filter",
          description: "Import-Jobs nach Status und Paginierung filtern",
        },
        filters: {
          title: "Filter",
          description: "Filteroptionen für Import-Jobs",
        },
        status: {
          label: "Job-Status",
          description: "Nach Job-Status filtern",
          placeholder: "Status auswählen",
        },
        limit: {
          label: "Ergebnisse pro Seite",
          description: "Anzahl der zurückzugebenden Jobs",
          placeholder: "50",
        },
        offset: {
          label: "Seiten-Offset",
          description: "Anzahl der zu überspringenden Jobs",
          placeholder: "0",
        },
        response: {
          title: "Import-Jobs",
          description: "Liste der Import-Jobs mit ihrem aktuellen Status",
          items: {
            title: "Jobs-Liste",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Filterparameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Authentifizierung erforderlich um Import-Jobs anzuzeigen",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff für Import-Jobs verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Keine Import-Jobs gefunden",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler beim Abrufen der Jobs",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler beim Abrufen der Jobs",
          },
          unsavedChanges: {
            title: "Ungespeicherte Änderungen",
            description: "Es gibt ungespeicherte Änderungen",
          },
          conflict: {
            title: "Konflikt",
            description: "Datenkonflikt aufgetreten",
          },
        },
        success: {
          title: "Jobs abgerufen",
          description: "Import-Jobs-Liste erfolgreich abgerufen",
        },
      },
      widget: {
        status: {
          pending: "Ausstehend",
          running: "Läuft",
          completed: "Abgeschlossen",
          failed: "Fehlgeschlagen",
          stopped: "Gestoppt",
        },
        filter: {
          all: "Alle",
          pending: "Ausstehend",
          running: "Läuft",
          completed: "Abgeschlossen",
          failed: "Fehlgeschlagen",
        },
        progress: {
          rows: "Zeilen",
        },
        job: {
          total: "Gesamt:",
          processed: "Verarbeitet:",
          ok: "OK:",
          fail: "Fehler:",
          created: "Erstellt:",
          done: "Fertig:",
        },
        header: {
          title: "Import-Jobs",
          newImport: "Neuer Import",
        },
        loading: "Import-Jobs werden geladen\u2026",
        empty: {
          title: "Keine Import-Jobs gefunden",
          withFilter: "Anderen Filter wählen oder neuen Import starten.",
          withoutFilter:
            "Starten Sie Ihren ersten Import, um ihn hier zu sehen.",
          newImport: "Neuer Import",
        },
      },
    },
    csv: {
      post: {
        title: "CSV-Daten Importieren",
        description:
          "Importieren Sie Daten aus CSV-Dateien mit intelligenter Verarbeitung und Validierung",
        form: {
          title: "CSV-Import Konfiguration",
          description:
            "Konfigurieren Sie Ihre CSV-Import Einstellungen für optimale Ergebnisse",
        },
        fileSection: {
          title: "Datei Upload",
          description:
            "Wählen Sie Ihre CSV-Datei aus und spezifizieren Sie die Zieldomäne",
        },
        file: {
          label: "CSV-Datei",
          description: "Wählen Sie eine CSV-Datei zum Upload (max 10MB)",
          placeholder: "CSV-Datei auswählen...",
          helpText:
            "Unterstütztes Format: CSV mit komma-getrennten Werten. Erste Zeile sollte Spaltenüberschriften enthalten.",
        },
        fileName: {
          label: "Dateiname",
          description: "Name für diesen Import (zu Ihrer Referenz)",
          placeholder: "z.B. Januar 2024 Leads Import",
        },
        domain: {
          label: "Import-Domäne",
          description: "Welche Art von Daten importieren Sie?",
          placeholder: "Datentyp auswählen...",
        },
        processingSection: {
          title: "Verarbeitungsoptionen",
          description:
            "Konfigurieren Sie, wie Ihre Daten verarbeitet werden sollen",
        },
        skipDuplicates: {
          label: "Duplikate Überspringen",
          description: "Datensätze mit doppelten E-Mail-Adressen überspringen",
          helpText:
            "Empfohlen: Verhindert das doppelte Importieren desselben Kontakts",
        },
        updateExisting: {
          label: "Bestehende Aktualisieren",
          description:
            "Bestehende Datensätze mit neuen Daten aus CSV aktualisieren",
          helpText:
            "Wenn nicht aktiviert, bleiben bestehende Datensätze unverändert",
        },
        useChunkedProcessing: {
          label: "Hintergrundverarbeitung",
          description: "Große Dateien im Hintergrund verarbeiten",
          helpText: "Empfohlen für Dateien mit mehr als 500 Datensätzen",
        },
        batchSize: {
          label: "Batch-Größe",
          description:
            "Anzahl der Datensätze, die gleichzeitig verarbeitet werden",
          placeholder: "100",
          helpText:
            "Kleinere Batches sind stabiler, größere Batches sind schneller",
        },
        defaultsSection: {
          title: "Standardwerte (Optional)",
          description:
            "Setzen Sie Standardwerte für Datensätze, denen diese Information fehlt",
        },
        defaultCountry: {
          label: "Standardland",
          description: "Land für Datensätze ohne Ortsangabe",
          placeholder: "Land auswählen...",
        },
        defaultLanguage: {
          label: "Standardsprache",
          description: "Sprache für Datensätze ohne Sprachpräferenz",
          placeholder: "Sprache auswählen...",
        },
        response: {
          title: "Import-Ergebnisse",
          description: "Zusammenfassung Ihres CSV-Import Vorgangs",
          basicResults: {
            title: "Basis-Ergebnisse",
            description: "Kern-Import-Statistiken",
          },
          batchId: {
            label: "Batch-ID",
          },
          totalRows: {
            label: "Gesamtzeilen",
          },
          isChunkedProcessing: {
            label: "Hintergrundverarbeitung",
          },
          jobId: {
            label: "Job-ID",
          },
          statistics: {
            title: "Import-Statistiken",
            description: "Detaillierte Aufschlüsselung des Import-Vorgangs",
          },
          successfulImports: {
            label: "Erfolgreiche Importe",
          },
          failedImports: {
            label: "Fehlgeschlagene Importe",
          },
          duplicateEmails: {
            label: "Doppelte E-Mails",
          },
          processingTimeMs: {
            label: "Verarbeitungszeit (ms)",
          },
          summary: {
            title: "Import-Zusammenfassung",
            description: "Übersicht der Import-Ergebnisse",
          },
          newRecords: {
            label: "Neue Datensätze",
          },
          updatedRecords: {
            label: "Aktualisierte Datensätze",
          },
          skippedDuplicates: {
            label: "Übersprungene Duplikate",
          },
          errors: {
            title: "Fehlerdetails",
            row: {
              label: "Zeile",
            },
            email: {
              label: "E-Mail",
            },
            error: {
              label: "Fehler",
            },
          },
          nextSteps: {
            title: "Nächste Schritte",
            item: {
              label: "Nächster Schritt",
            },
          },
        },
        errors: {
          validation: {
            title: "Ungültige Import-Daten",
            description:
              "Bitte überprüfen Sie Ihre CSV-Datei und Einstellungen",
            emptyFile: "CSV-Dateiinhalt ist erforderlich",
            emptyFileName: "Bitte geben Sie einen Namen für diesen Import an",
            invalidDomain: "Bitte wählen Sie eine gültige Import-Domäne aus",
            invalidBatchSize: "Batch-Größe muss zwischen 10 und 1000 liegen",
            fileTooLarge:
              "Dateigröße überschreitet 10MB Limit. Erwägen Sie Hintergrundverarbeitung.",
          },
          unauthorized: {
            title: "Zugriff Verweigert",
            description:
              "Sie haben keine Berechtigung zum Importieren von Daten",
          },
          fileTooLarge: {
            title: "Datei zu Groß",
            description:
              "Die ausgewählte Datei überschreitet die maximale Größenbeschränkung von 10MB",
          },
          server: {
            title: "Import Fehlgeschlagen",
            description:
              "Ein Fehler ist beim Verarbeiten Ihres Imports aufgetreten. Bitte versuchen Sie es erneut.",
          },
          network: {
            title: "Netzwerkfehler",
            description:
              "Netzwerkverbindung während des Imports fehlgeschlagen",
          },
          forbidden: {
            title: "Verboten",
            description: "Sie haben keine Berechtigung für diesen Import",
          },
          notFound: {
            title: "Nicht Gefunden",
            description: "Import-Ressource nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht Gespeicherte Änderungen",
            description: "Sie haben nicht gespeicherte Änderungen",
          },
          conflict: {
            title: "Datenkonflikt",
            description: "Ein Konflikt mit vorhandenen Daten ist aufgetreten",
          },
        },
        success: {
          title: "Import Erfolgreich",
          description: "Ihre CSV-Daten wurden erfolgreich importiert",
        },
      },
    },
    enum: {
      status: {
        pending: {
          label: "Ausstehend",
          description: "Job wartet auf Verarbeitung",
        },
        processing: {
          label: "Verarbeitung",
          description: "Job wird gerade verarbeitet",
        },
        completed: {
          label: "Abgeschlossen",
          description: "Job erfolgreich beendet",
        },
        failed: {
          label: "Fehlgeschlagen",
          description: "Job ist auf einen Fehler gestoßen",
        },
        cancelled: {
          label: "Abgebrochen",
          description: "Job wurde vom Benutzer abgebrochen",
        },
        paused: {
          label: "Pausiert",
          description: "Job-Verarbeitung ist vorübergehend pausiert",
        },
      },
      domain: {
        leads: {
          label: "Leads",
          description: "Potenzielle Kunden und Geschäftskontakte",
        },
        contacts: {
          label: "Kontakte",
          description: "Allgemeine Kontaktinformationen und Adressbuch",
        },
        businessData: {
          label: "Geschäftsdaten",
          description: "Unternehmensinformationen und Geschäftsprofile",
        },
        emails: {
          label: "E-Mail-Listen",
          description: "E-Mail-Marketing Listen und Kampagnen",
        },
        users: {
          label: "Benutzer",
          description: "Systembenutzer und Kontoinformationen",
        },
        templates: {
          label: "Vorlagen",
          description: "E-Mail-Vorlagen und Inhalte",
        },
      },
      format: {
        csv: {
          label: "CSV-Datei",
          description: "Komma-getrennte Werte (am häufigsten)",
        },
        xlsx: {
          label: "Excel-Datei",
          description: "Microsoft Excel Tabelle",
        },
        json: {
          label: "JSON-Datei",
          description: "JavaScript Object Notation Daten",
        },
        tsv: {
          label: "TSV-Datei",
          description: "Tab-getrennte Werte",
        },
      },
      processing: {
        immediate: {
          label: "Jetzt Verarbeiten",
          description: "Datei sofort verarbeiten (schnellste)",
        },
        background: {
          label: "Hintergrund",
          description: "Im Hintergrund verarbeiten (für große Dateien)",
        },
        scheduled: {
          label: "Später Planen",
          description: "Verarbeitung für bestimmte Zeit planen",
        },
      },
      errorType: {
        validation: {
          label: "Validierungsfehler",
          description:
            "Daten entsprechen nicht dem erforderlichen Format oder Regeln",
        },
        duplicate: {
          label: "Doppelte Daten",
          description: "Datensatz existiert bereits im System",
        },
        format: {
          label: "Formatfehler",
          description: "Dateiformat ist falsch oder beschädigt",
        },
        processing: {
          label: "Verarbeitungsfehler",
          description: "Fehler während der Datenverarbeitung aufgetreten",
        },
        system: {
          label: "Systemfehler",
          description: "Interner Systemfehler",
        },
      },
      batchSize: {
        small: {
          label: "Klein (50)",
          description: "Am besten für Tests oder kleine Imports",
        },
        medium: {
          label: "Mittel (100)",
          description: "Empfohlen für die meisten Imports",
        },
        large: {
          label: "Groß (250)",
          description: "Gut für große Dateien mit einfachen Daten",
        },
        xlarge: {
          label: "Extra Groß (500)",
          description: "Für sehr große Dateien (fortgeschrittene Benutzer)",
        },
      },
    },
    nextSteps: {
      reviewErrors:
        "Überprüfen Sie die Fehlerdetails, um zu verstehen, was schiefgelaufen ist",
      checkDuplicates:
        "Erwägen Sie die Anpassung der Duplikat-Behandlungseinstellungen",
      reviewLeads:
        "Überprüfen Sie Ihre importierten Leads im Leads-Management-Bereich",
      startCampaign:
        "Erwägen Sie den Start einer E-Mail-Kampagne mit Ihren neuen Leads",
      reviewContacts:
        "Überprüfen Sie Ihre importierten Kontakte im Kontakte-Bereich",
      organizeContacts: "Organisieren Sie Ihre Kontakte in Gruppen oder Tags",
      reviewImported:
        "Überprüfen Sie Ihre importierten Daten im entsprechenden Bereich",
      monitorProgress: "Überwachen Sie den Fortschritt im Job-Verlauf",
      checkJobsList:
        "Überprüfen Sie die Jobs-Liste für detaillierte Status-Updates",
    },
    errors: {
      cancel: {
        server: "Import-Job konnte nicht abgebrochen werden",
      },
      retry: {
        server: "Import-Job konnte nicht wiederholt werden",
      },
      delete: {
        server: "Import-Job konnte nicht gelöscht werden",
      },
      status: {
        server: "Job-Status konnte nicht abgerufen werden",
      },
    },
    error: {
      default: "Ein Fehler ist aufgetreten",
    },
    enums: {
      csvImportJobStatus: {
        pending: "Ausstehend",
        processing: "In Bearbeitung",
        completed: "Abgeschlossen",
        failed: "Fehlgeschlagen",
      },
      csvImportJobAction: {
        retry: "Wiederholen",
        delete: "Löschen",
        stop: "Stoppen",
      },
      importMode: {
        createOnly: "Nur erstellen",
        updateOnly: "Nur aktualisieren",
        createOrUpdate: "Erstellen oder aktualisieren",
        skipDuplicates: "Duplikate überspringen",
      },
      importFormat: {
        csv: "CSV",
        tsv: "TSV",
        json: "JSON",
      },
      importProcessingType: {
        immediate: "Sofort",
        chunked: "Stückweise",
        scheduled: "Geplant",
      },
      importErrorType: {
        validationError: "Validierungsfehler",
        duplicateEmail: "Doppelte E-Mail",
        invalidFormat: "Ungültiges Format",
        missingRequiredField: "Pflichtfeld fehlt",
        processingError: "Verarbeitungsfehler",
        systemError: "Systemfehler",
      },
      batchProcessingStatus: {
        pending: "Ausstehend",
        processing: "In Bearbeitung",
        completed: "Abgeschlossen",
        failed: "Fehlgeschlagen",
        retrying: "Wird wiederholt",
      },
      importPriority: {
        low: "Niedrig",
        normal: "Normal",
        high: "Hoch",
        urgent: "Dringend",
      },
      importSource: {
        webUpload: "Web-Upload",
        apiUpload: "API-Upload",
        scheduledImport: "Geplanter Import",
        bulkOperation: "Massenoperation",
      },
      csvDelimiter: {
        comma: "Komma",
        semicolon: "Semikolon",
        tab: "Tab",
        pipe: "Pipe",
      },
      importValidationLevel: {
        strict: "Streng",
        moderate: "Mäßig",
        lenient: "Nachsichtig",
      },
      importNotificationType: {
        email: "E-Mail",
        inApp: "In-App",
        webhook: "Webhook",
        none: "Keine",
      },
      leadStatus: {
        new: "Neu",
        pending: "Ausstehend",
        campaignRunning: "Kampagne läuft",
        websiteUser: "Website-Nutzer",
        newsletterSubscriber: "Newsletter-Abonnent",
        inContact: "In Kontakt",
        signedUp: "Registriert",
        subscriptionConfirmed: "Abonnement bestätigt",
        unsubscribed: "Abgemeldet",
        bounced: "Zurückgewiesen",
        invalid: "Ungültig",
      },
      emailCampaignStage: {
        notStarted: "Nicht gestartet",
        initial: "Erstkontakt",
        followup1: "Nachfassen 1",
        followup2: "Nachfassen 2",
        followup3: "Nachfassen 3",
        nurture: "Pflege",
        reactivation: "Reaktivierung",
      },
      leadSource: {
        website: "Website",
        socialMedia: "Soziale Medien",
        emailCampaign: "E-Mail-Kampagne",
        referral: "Empfehlung",
        csvImport: "CSV-Import",
      },
    },
  },
  lead: {
    id: {
      category: "Leads",
      tags: {
        leads: "Leads",
        management: "Verwaltung",
      },

      get: {
        title: "Lead-Details abrufen",
        description:
          "Detaillierte Informationen zu einem bestimmten Lead laden",
        backButton: {
          label: "Zurück zu Leads",
        },
        editButton: {
          label: "Lead bearbeiten",
        },
        deleteButton: {
          label: "Lead löschen",
        },
        id: {
          label: "Lead-ID",
          description: "Eindeutige Kennung des Leads",
        },
        form: {
          title: "Lead-Details Anfrage",
          description: "Anfrageparameter für Lead-Informationen",
        },
        response: {
          title: "Lead-Informationen",
          description: "Vollständige Lead-Details und Verlauf",
          basicInfo: {
            title: "Grundlegende Informationen",
            description: "Kern-Lead-Identifikation und Status",
          },
          id: {
            content: "Lead-ID",
          },
          email: {
            content: "E-Mail-Adresse",
          },
          businessName: {
            content: "Firmenname",
          },
          contactName: {
            content: "Kontaktname",
          },
          status: {
            content: "Lead-Status",
          },
          contactDetails: {
            title: "Kontaktdaten",
            description: "Kontaktinformationen und Präferenzen",
          },
          phone: {
            content: "Telefonnummer",
          },
          website: {
            content: "Website-URL",
          },
          country: {
            content: "Land",
          },
          language: {
            content: "Sprache",
          },
          campaignTracking: {
            title: "Kampagnenverfolgung",
            description: "E-Mail-Kampagnen- und Tracking-Informationen",
          },
          source: {
            content: "Lead-Quelle",
          },
          currentCampaignStage: {
            content: "Aktuelle Kampagnenphase",
          },
          emailJourneyVariant: {
            content: "E-Mail-Journey-Variante",
          },
          emailsSent: {
            content: "E-Mails gesendet",
          },
          lastEmailSentAt: {
            content: "Letzte E-Mail gesendet",
          },
          engagement: {
            title: "Engagement-Metriken",
            description: "E-Mail-Engagement- und Interaktionsdaten",
          },
          emailsOpened: {
            content: "E-Mails geöffnet",
          },
          emailsClicked: {
            content: "E-Mails geklickt",
          },
          lastEngagementAt: {
            content: "Letztes Engagement",
          },
          unsubscribedAt: {
            content: "Abgemeldet am",
          },
          conversion: {
            title: "Konversionsverfolgung",
            description: "Lead-Konversion und Meilensteinverfolgung",
          },
          convertedUserId: {
            content: "Konvertierte Benutzer-ID",
          },
          convertedAt: {
            content: "Konvertiert am",
          },
          signedUpAt: {
            content: "Registriert am",
          },
          subscriptionConfirmedAt: {
            content: "Abonnement bestätigt am",
          },
          metadata: {
            title: "Zusätzliche Informationen",
            description: "Notizen und Metadaten",
            content: "Metadaten",
          },
          notes: {
            content: "Notizen",
          },
          createdAt: {
            content: "Erstellt am",
          },
          updatedAt: {
            content: "Aktualisiert am",
          },
          identity: {
            title: "Gerät & Identität",
            description: "Tracking-Identität und Geräteinformationen",
          },
          ipAddress: {
            content: "IP-Adresse",
          },
          userAgent: {
            content: "User Agent",
          },
          deviceType: {
            content: "Gerätetyp",
          },
          browser: {
            content: "Browser",
          },
          os: {
            content: "Betriebssystem",
          },
          referralCode: {
            content: "Empfehlungscode",
          },
          lifecycle: {
            title: "Lebenszyklus",
            description: "Weitere Lebenszyklus-Zeitstempel",
          },
          bouncedAt: {
            content: "Zurückgesendet am",
          },
          invalidAt: {
            content: "Ungültig ab",
          },
          campaignStartedAt: {
            content: "Kampagne gestartet am",
          },
          linkedLeads: {
            title: "Verknüpfte Leads",
            description: "Als dieselbe Person identifizierte Leads",
            linkedLeadId: {
              content: "Verknüpfte Lead-ID",
            },
            linkReason: {
              content: "Verknüpfungsgrund",
            },
            linkedAt: {
              content: "Verknüpft am",
            },
            email: {
              content: "E-Mail",
            },
            businessName: {
              content: "Firmenname",
            },
            status: {
              content: "Status",
            },
            ipAddress: {
              content: "IP-Adresse",
            },
            userAgent: {
              content: "User Agent",
            },
            createdAt: {
              content: "Erstellt am",
            },
          },
          linkedUsers: {
            title: "Verknüpfte Benutzerkonten",
            description: "Mit diesem Lead verknüpfte Benutzerkonten",
            userId: {
              content: "Benutzer-ID",
            },
            linkReason: {
              content: "Verknüpfungsgrund",
            },
            linkedAt: {
              content: "Verknüpft am",
            },
            email: {
              content: "E-Mail",
            },
            publicName: {
              content: "Anzeigename",
            },
          },
          referralHistory: {
            title: "Empfehlungsverlauf",
            description:
              "Empfehlungscodes, die dieser Lead vor der Anmeldung angeklickt hat",
            code: {
              content: "Empfehlungscode",
            },
            ownerUserId: {
              content: "Code-Besitzer",
            },
            clickedAt: {
              content: "Geklickt am",
            },
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Die angegebene Lead-ID ist ungültig",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Authentifizierung erforderlich zum Zugriff auf Lead-Details",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description: "Sie haben keine Berechtigung, diesen Lead anzuzeigen",
          },
          notFound: {
            title: "Lead nicht gefunden",
            description: "Kein Lead mit der angegebenen ID gefunden",
          },
          server: {
            title: "Serverfehler",
            description:
              "Beim Abrufen der Lead-Details ist ein Fehler aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Verbindung zum Server nicht möglich",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Sie haben nicht gespeicherte Änderungen",
          },
          conflict: {
            title: "Datenkonflikt",
            description: "Die Lead-Daten wurden geändert",
          },
        },
        success: {
          title: "Erfolgreich",
          description: "Lead-Details erfolgreich geladen",
        },
      },
      patch: {
        title: "Lead aktualisieren",
        description: "Lead-Informationen und Status aktualisieren",
        backButton: {
          label: "Zurück zum Lead",
        },
        deleteButton: {
          label: "Lead löschen",
        },
        submitButton: {
          label: "Lead aktualisieren",
          loadingText: "Lead wird aktualisiert...",
        },
        id: {
          label: "Lead-ID",
          description: "Eindeutige Kennung des zu aktualisierenden Leads",
        },
        form: {
          title: "Lead aktualisieren",
          description: "Lead-Informationen bearbeiten",
        },
        updates: {
          title: "Lead-Aktualisierungen",
          description: "Zu aktualisierende Felder",
        },
        basicInfo: {
          title: "Grundlegende Informationen",
          description: "Kern-Lead-Informationen aktualisieren",
        },
        email: {
          label: "E-Mail-Adresse",
          description: "E-Mail-Adresse des Leads",
          placeholder: "email@example.com",
        },
        businessName: {
          label: "Firmenname",
          description: "Name des Unternehmens",
          placeholder: "Muster GmbH",
        },
        contactName: {
          label: "Kontaktname",
          description: "Hauptansprechpartner",
          placeholder: "Max Mustermann",
        },
        status: {
          label: "Lead-Status",
          description: "Aktueller Status des Leads",
          placeholder: "Status wählen",
        },
        contactDetails: {
          title: "Kontaktdaten",
          description: "Kontaktinformationen aktualisieren",
        },
        phone: {
          label: "Telefonnummer",
          description: "Kontakttelefonnummer",
          placeholder: "+491234567890",
        },
        website: {
          label: "Website",
          description: "Unternehmens-Website-URL",
          placeholder: "https://example.de",
        },
        country: {
          label: "Land",
          description: "Land des Unternehmens",
          placeholder: "Land wählen",
        },
        language: {
          label: "Sprache",
          description: "Bevorzugte Sprache",
          placeholder: "Sprache wählen",
        },
        campaignManagement: {
          title: "Kampagnenverwaltung",
          description: "Kampagneneinstellungen verwalten",
        },
        source: {
          label: "Lead-Quelle",
          description: "Herkunft des Leads",
          placeholder: "Quelle wählen",
        },
        currentCampaignStage: {
          label: "Kampagnenphase",
          description: "Aktuelle E-Mail-Kampagnenphase",
          placeholder: "Phase wählen",
        },
        additionalDetails: {
          title: "Weitere Details",
          description: "Notizen und Metadaten",
        },
        notes: {
          label: "Notizen",
          description: "Interne Notizen zum Lead",
          placeholder: "Notizen hier eingeben",
        },
        metadata: {
          label: "Metadaten",
          description: "Zusätzliche Metadaten (JSON)",
          placeholder: '{"key": "value"}',
        },
        convertedUserId: {
          label: "Konvertierte Benutzer-ID",
          description: "ID des konvertierten Benutzerkontos",
          placeholder: "Benutzer-ID",
        },
        subscriptionConfirmedAt: {
          label: "Abonnement bestätigt am",
          description: "Datum der Abonnementbestätigung",
          placeholder: "Datum wählen",
        },
        response: {
          title: "Aktualisierter Lead",
          description: "Aktualisierte Lead-Informationen",
          basicInfo: {
            title: "Grundlegende Informationen",
            description: "Aktualisierte Kern-Lead-Informationen",
          },
          id: {
            content: "Lead-ID",
          },
          email: {
            content: "E-Mail-Adresse",
          },
          businessName: {
            content: "Firmenname",
          },
          contactName: {
            content: "Kontaktname",
          },
          status: {
            content: "Lead-Status",
          },
          contactDetails: {
            title: "Kontaktdaten",
            description: "Aktualisierte Kontaktinformationen",
          },
          phone: {
            content: "Telefonnummer",
          },
          website: {
            content: "Website-URL",
          },
          country: {
            content: "Land",
          },
          language: {
            content: "Sprache",
          },
          campaignTracking: {
            title: "Kampagnenverfolgung",
            description: "Aktualisierte Kampagneninformationen",
          },
          source: {
            content: "Lead-Quelle",
          },
          currentCampaignStage: {
            content: "Aktuelle Kampagnenphase",
          },
          emailJourneyVariant: {
            content: "E-Mail-Journey-Variante",
          },
          emailsSent: {
            content: "E-Mails gesendet",
          },
          lastEmailSentAt: {
            content: "Letzte E-Mail gesendet",
          },
          engagement: {
            title: "Engagement-Metriken",
            description: "E-Mail-Engagement-Daten",
          },
          emailsOpened: {
            content: "E-Mails geöffnet",
          },
          emailsClicked: {
            content: "E-Mails geklickt",
          },
          lastEngagementAt: {
            content: "Letztes Engagement",
          },
          unsubscribedAt: {
            content: "Abgemeldet am",
          },
          conversion: {
            title: "Konversionsverfolgung",
            description: "Konversionsmeilensteinverfolgung",
          },
          convertedUserId: {
            content: "Konvertierte Benutzer-ID",
          },
          convertedAt: {
            content: "Konvertiert am",
          },
          signedUpAt: {
            content: "Registriert am",
          },
          subscriptionConfirmedAt: {
            content: "Abonnement bestätigt am",
          },
          metadata: {
            title: "Zusätzliche Informationen",
            description: "Notizen und Metadaten",
            content: "Metadaten",
          },
          notes: {
            content: "Notizen",
          },
          createdAt: {
            content: "Erstellt am",
          },
          updatedAt: {
            content: "Aktualisiert am",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Die angegebenen Daten sind ungültig",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Authentifizierung erforderlich zum Aktualisieren von Leads",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description:
              "Sie haben keine Berechtigung, diesen Lead zu aktualisieren",
          },
          notFound: {
            title: "Lead nicht gefunden",
            description: "Kein Lead mit der angegebenen ID gefunden",
          },
          conflict: {
            title: "Aktualisierungskonflikt",
            description: "Der Lead wurde von einem anderen Benutzer geändert",
          },
          server: {
            title: "Serverfehler",
            description:
              "Beim Aktualisieren des Leads ist ein Fehler aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Verbindung zum Server nicht möglich",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Sie haben nicht gespeicherte Änderungen",
          },
        },
        success: {
          title: "Erfolgreich",
          description: "Lead erfolgreich aktualisiert",
        },
      },
      post: {
        title: "[id]",
        description: "[id] endpoint",
        form: {
          title: "[id] Configuration",
          description: "Configure [id] parameters",
        },
        response: {
          title: "Response",
          description: "[id] response data",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
          },
          server: {
            title: "Server Error",
            description: "Internal server error occurred",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          network: {
            title: "Network Error",
            description: "Network error occurred",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access forbidden",
          },
          notFound: {
            title: "Not Found",
            description: "Resource not found",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
        },
        success: {
          title: "Success",
          description: "Operation completed successfully",
        },
      },
      enums: {
        leadStatus: {
          new: "Neu",
          pending: "Ausstehend",
          campaignRunning: "Kampagne läuft",
          websiteUser: "Website-Benutzer",
          newsletterSubscriber: "Newsletter-Abonnent",
          inContact: "In Kontakt",
          signedUp: "Registriert",
          subscriptionConfirmed: "Abonnement bestätigt",
          unsubscribed: "Abgemeldet",
          bounced: "Unzustellbar",
          invalid: "Ungültig",
        },
        leadSource: {
          website: "Website",
          referral: "Empfehlung",
          socialMedia: "Soziale Medien",
          emailCampaign: "E-Mail-Kampagne",
          csvImport: "CSV-Import",
          api: "API",
          manual: "Manuell",
          other: "Sonstiges",
        },
        emailCampaignStage: {
          notStarted: "Nicht gestartet",
          initial: "Erster Kontakt",
          followup1: "Nachfassung 1",
          followup2: "Nachfassung 2",
          followup3: "Nachfassung 3",
          nurture: "Pflege",
          reactivation: "Reaktivierung",
        },
        emailJourneyVariant: {
          uncensoredConvert: "Unzensierter Konverter",
          sideHustle: "Nebenverdienst",
          quietRecommendation: "Stille Empfehlung",
        },
      },
      widget: {
        loading: "Lead wird geladen...",
        notFound: "Lead nicht gefunden.",
        back: "Zurück",
        leadFallbackTitle: "Lead",
        edit: "Bearbeiten",
        delete: "Löschen",
        converted: "Konvertiert",
        quickActions: "Schnellaktionen",
        editLead: "Lead bearbeiten",
        sendTestEmail: "Test-E-Mail senden",
        viewInSearch: "In Suche anzeigen",
        userProfile: "Benutzerprofil",
        userDetail: "Benutzerdetails",
        creditHistory: "Kreditverlauf",
        campaignFunnel: "Kampagnentrichter",
        sourceLabel: "Quelle:",
        lastEmailLabel: "Letzte E-Mail:",
        campaignPerformance: "Kampagnenleistung",
        emailsSent: "E-Mails gesendet",
        opened: "Geöffnet",
        clicked: "Geklickt",
        openRate: "Öffnungsrate",
        clickRate: "Klickrate",
        clickToOpenRate: "Klick-zu-Öffnungs-Rate",
        contactDetails: "Kontaktdaten",
        country: "Land",
        language: "Sprache",
        engagement: "Engagement",
        emailsOpened: "E-Mails geöffnet",
        emailsClicked: "E-Mails geklickt",
        lastEngagement: "Letztes Engagement",
        unsubscribed: "Abgemeldet",
        conversion: "Konversion",
        signedUp: "Registriert",
        convertedAt: "Konvertiert am",
        subscriptionConfirmed: "Abonnement bestätigt",
        convertedUserId: "Konvertierte Benutzer-ID",
        activeSubscriberSince: "Aktiver Abonnent seit",
        viewUserProfile: "Benutzerprofil anzeigen",
        viewUserDetail: "Benutzerdetails anzeigen",
        notesAndMetadata: "Notizen & Metadaten",
        notes: "Notizen",
        metadata: "Metadaten",
        created: "Erstellt",
        lastUpdated: "Zuletzt aktualisiert",
        daysOld: "Tage alt",
        lastEngaged: "Zuletzt engagiert",
        ago: "vor",
        variant: "Variante:",
        copyEmail: "E-Mail",
        copyId: "ID",
        copyPhone: "Telefon",
        copyUserId: "Benutzer-ID",
        stageNotStarted: "Nicht gestartet",
        stageInitial: "Initial",
        stageFollowup1: "Nachfassen 1",
        stageFollowup2: "Nachfassen 2",
        stageFollowup3: "Nachfassen 3",
        stageNurture: "Pflegen",
        stageReactivation: "Reaktivierung",
        tabOverview: "Übersicht",
        tabDetails: "Details",
        tabIdentity: "Identität",
        tabBasic: "Basis",
        tabCampaign: "Kampagne",
        tabAdvanced: "Erweitert",
        deviceIdentity: "Gerät & Identität",
        ipAddress: "IP-Adresse",
        userAgent: "User Agent",
        deviceType: "Gerätetyp",
        browser: "Browser",
        os: "Betriebssystem",
        referralCode: "Empfehlungscode",
        lifecycleTimestamps: "Lebenszyklus",
        bouncedAt: "Zurückgewiesen am",
        invalidAt: "Ungültig ab",
        campaignStartedAt: "Kampagne gestartet am",
        linkedLeadsSection: "Verknüpfte Leads",
        linkedLeadsEmpty: "Keine verknüpften Leads",
        linkedUsersSection: "Verknüpfte Benutzerkonten",
        linkedUsersEmpty: "Keine verknüpften Benutzerkonten",
        linkReason: "Verknüpfungsgrund:",
        linkedAt: "Verknüpft am:",
        copyIp: "IP",
        copyLinkedLeadId: "Lead-ID",
        copyUserId2: "Benutzer-ID",
      },
      delete: {
        title: "Lead löschen",
        description: "Lead aus dem System löschen",
        container: {
          title: "Lead löschen",
          description:
            "Sind Sie sicher, dass Sie diesen Lead dauerhaft löschen möchten?",
        },
        backButton: {
          label: "Zurück zum Lead",
        },
        submitButton: {
          label: "Lead löschen",
          loadingText: "Lead wird gelöscht...",
        },
        actions: {
          delete: "Lead löschen",
          deleting: "Lead wird gelöscht...",
        },
        id: {
          label: "Lead ID",
          description: "Eindeutige Kennung des zu löschenden Leads",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Die angegebene Lead-ID ist ungültig",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich zum Löschen von Leads",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description: "Sie haben keine Berechtigung, diesen Lead zu löschen",
          },
          notFound: {
            title: "Lead nicht gefunden",
            description: "Kein Lead mit der angegebenen ID gefunden",
          },
          conflict: {
            title: "Löschkonflikt",
            description:
              "Der Lead kann aufgrund bestehender Abhängigkeiten nicht gelöscht werden",
          },
          server: {
            title: "Serverfehler",
            description: "Beim Löschen des Leads ist ein Fehler aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Verbindung zum Server nicht möglich",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Sie haben nicht gespeicherte Änderungen",
          },
        },
        success: {
          title: "Lead gelöscht",
          description: "Der Lead wurde erfolgreich gelöscht",
        },
      },
    },
  },
  list: {
    category: "Leads",
    tags: {
      leads: "Leads",
      management: "Verwaltung",
    },

    get: {
      title: "Leads auflisten",
      description: "Abrufen einer paginierten Liste von Leads mit Filterung",
      createButton: {
        label: "Lead erstellen",
      },
      form: {
        title: "Lead-Listen-Filter",
        description: "Filter für Lead-Liste konfigurieren",
      },
      actions: {
        refresh: "Aktualisieren",
        refreshing: "Aktualisierung...",
      },
      page: {
        label: "Seitennummer",
        description: "Seitennummer für Paginierung",
        placeholder: "Seitennummer eingeben",
      },
      limit: {
        label: "Ergebnisse pro Seite",
        description: "Anzahl der Ergebnisse pro Seite",
        placeholder: "Limit eingeben",
      },
      status: {
        label: "Lead-Status",
        description: "Nach Lead-Status filtern",
        placeholder: "Status auswählen",
      },
      currentCampaignStage: {
        label: "Kampagnenstufe",
        description: "Nach aktueller Kampagnenstufe filtern",
        placeholder: "Kampagnenstufe auswählen",
      },
      source: {
        label: "Lead-Quelle",
        description: "Nach Lead-Quelle filtern",
        placeholder: "Quelle auswählen",
      },
      country: {
        label: "Land",
        description: "Nach Land filtern",
        placeholder: "Länder auswählen",
      },
      language: {
        label: "Sprache",
        description: "Nach Sprache filtern",
        placeholder: "Sprachen auswählen",
      },
      search: {
        label: "Suche",
        description: "Leads nach Name, E-Mail oder Firma suchen",
        placeholder: "Suchbegriff eingeben",
      },
      searchPagination: {
        title: "Suche & Paginierung",
        description: "Such- und Paginierungssteuerung",
      },
      statusFilters: {
        title: "Status- & Kampagnenfilter",
        description: "Nach Status, Kampagnenstufe und Quelle filtern",
      },
      locationFilters: {
        title: "Standortfilter",
        description: "Nach Land und Sprache filtern",
      },
      sortingOptions: {
        title: "Sortieroptionen",
        description: "Ergebnissortierung konfigurieren",
      },
      sortBy: {
        label: "Sortieren nach",
        description: "Feld zum Sortieren der Ergebnisse",
        placeholder: "Sortierfeld auswählen",
      },
      sortOrder: {
        label: "Sortierreihenfolge",
        description: "Sortierreihenfolge für Ergebnisse",
        placeholder: "Sortierreihenfolge auswählen",
      },
      response: {
        title: "Lead-Listen-Antwort",
        description: "Paginierte Liste von Leads mit Metadaten",
        leads: {
          title: "Lead-Details",
          description: "Einzelne Lead-Informationen",
          id: "Lead-ID",
          email: "E-Mail-Adresse",
          businessName: "Firmenname",
          contactName: "Kontaktname",
          phone: "Telefonnummer",
          website: "Webseite",
          country: "Land",
          language: "Sprache",
          status: "Status",
          source: "Quelle",
          notes: "Notizen",
          convertedUserId: "Konvertierte Benutzer-ID",
          convertedAt: "Konvertiert am",
          signedUpAt: "Angemeldet am",
          subscriptionConfirmedAt: "Abonnement bestätigt am",
          currentCampaignStage: "Aktuelle Kampagnenstufe",
          emailsSent: "E-Mails gesendet",
          lastEmailSentAt: "Letzte E-Mail gesendet am",
          unsubscribedAt: "Abgemeldet am",
          emailsOpened: "E-Mails geöffnet",
          emailsClicked: "E-Mails geklickt",
          lastEngagementAt: "Letztes Engagement am",
          metadata: "Metadaten",
          createdAt: "Erstellt am",
          updatedAt: "Aktualisiert am",
        },
        total: "Gesamt Leads",
        page: "Aktuelle Seite",
        limit: "Seitengröße",
        totalPages: "Gesamtseiten",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich um Leads aufzulisten",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Filterparameter",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler beim Abrufen der Leads",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler beim Abrufen der Leads",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Abrufen der Leads",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff auf Lead-Liste verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Leads nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt beim Abrufen der Leads",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen in der Lead-Liste",
        },
      },
      success: {
        title: "Erfolg",
        description: "Lead-Liste erfolgreich abgerufen",
      },
      emptySearch: "Keine Leads entsprechen Ihren Filtern",
      emptyState: "Noch keine Leads",
    },
    widget: {
      converted: "Konvertiert",
      emailsSent: "{{count}} E-Mails gesendet",
      openRate: "{{percent}}% Öffnungsrate",
      clicks: "{{count}} Klicks",
      stats: "Statistiken",
      graphs: "Graphen",
      search: "Suche",
      export: "Exportieren",
      import: "Importieren",
      batch: "Stapel",
      refresh: "Aktualisieren",
      view: "Anzeigen",
      edit: "Bearbeiten",
      delete: "Löschen",
      allSources: "Alle Quellen",
      clearSearch: "Suche zurücksetzen",
      clearStatusFilter: "Statusfilter zurücksetzen",
      clearSourceFilter: "Quellenfilter zurücksetzen",
      addLead: "Lead hinzufügen",
      importCsv: "CSV importieren",
      pagination: "Seite {{page}} von {{totalPages}} · {{total}} Leads",
      tabAll: "Alle",
      tabNew: "Neu",
      tabCampaign: "Kampagne",
      tabConfirmed: "Bestätigt",
      tabUnsubscribed: "Abgemeldet",
      tabBounced: "Zurückgesendet",
      sortNewest: "Neueste zuerst",
      sortOldest: "Älteste zuerst",
      sortEmailsSentHigh: "E-Mails gesendet (hoch)",
      sortEmailsSentLow: "E-Mails gesendet (niedrig)",
      sortBusinessNameAZ: "Firmenname (A-Z)",
      sortBusinessNameZA: "Firmenname (Z-A)",
      linkedCount: "{{count}} verknüpft",
      hasLinkedUser: "Nutzer",
      referralCode: "Ref-Code",
    },
  },
  search: {
    category: "Lead-Verwaltung",
    tags: {
      leads: "Leads",
      search: "Suchen",
    },
    get: {
      title: "Leads suchen",
      description: "Leads mit Filterung und Paginierung suchen",
      form: {
        title: "Lead-Suchformular",
        description: "Suchkriterien eingeben um Leads zu finden",
      },
      search: {
        label: "Suchanfrage",
        description:
          "Suchbegriff um Leads nach E-Mail, Firmenname oder Notizen zu filtern",
        placeholder: "Suchbegriff eingeben...",
      },
      status: {
        label: "Status-Filter",
        description: "Leads nach Status filtern",
      },
      limit: {
        label: "Ergebnislimit",
        description: "Maximale Anzahl der zurückzugebenden Ergebnisse (1-100)",
      },
      offset: {
        label: "Ergebnisversatz",
        description: "Anzahl der zu überspringenden Ergebnisse für Paginierung",
      },
      response: {
        title: "Suchergebnisse",
        description: "Paginierte Suchergebnisse mit Lead-Daten",
        leads: {
          title: "Leads",
          item: "Lead",
        },
        total: "Gesamtergebnisse",
        hasMore: "Weitere Ergebnisse verfügbar",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich um Leads zu suchen",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Suchparameter angegeben",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler bei der Lead-Suche",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler bei der Lead-Suche",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler bei der Lead-Suche",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff auf Lead-Suche verboten",
        },
        notFound: {
          title: "Keine Ergebnisse",
          description: "Keine Leads gefunden die den Suchkriterien entsprechen",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen im Suchformular",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt bei der Lead-Suche",
        },
      },
      success: {
        title: "Suche abgeschlossen",
        description: "Lead-Suche erfolgreich abgeschlossen",
      },
    },
    widget: {
      title: "Leads suchen",
      filterLabel: "Filter:",
      clearFilter: "Zurücksetzen",
      noResultsTitle: "Keine Ergebnisse gefunden",
      noResultsSubtitle: "Suche nach E-Mail, Firmenname oder Telefon",
      createLead: "Lead erstellen",
      noLeadsMatchFilter: "Keine Leads entsprechen den ausgewählten Filtern.",
      clearFilters: "Filter zurücksetzen",
      loadMore: "Mehr laden",
      openRateSuffix: "% geöffnet",
      noEmails: "keine E-Mails",
      converted: "Konvertiert",
      emailsSentSuffix: "gesendet",
      copyEmailTitle: "E-Mail kopieren",
      editLeadTitle: "Lead bearbeiten",
      deleteLeadTitle: "Lead löschen",
      statusNew: "Neu",
      statusPending: "Ausstehend",
      statusCampaign: "Kampagne",
      statusWebUser: "Web-Nutzer",
      statusNewsletter: "Newsletter",
      statusInContact: "In Kontakt",
      statusSignedUp: "Angemeldet",
      statusSubscribed: "Abonniert",
      statusUnsub: "Abgemeldet",
      statusBounced: "Zurückgesendet",
      statusInvalid: "Ungültig",
    },
  },
  stats: {
    title: "Lead-Statistiken",
    description:
      "Umfassende Lead-Statistiken und Analysen mit historischen Daten",
    category: "Lead-Verwaltung",
    tags: {
      leads: "Leads",
      statistics: "Statistiken",
      analytics: "Analysen",
    },
    container: {
      title: "Statistikfilter",
      description:
        "Konfigurieren Sie Ihre Lead-Statistikfilter und Ansichtsoptionen",
    },
    refresh: "Aktualisieren",
    sections: {
      timeFilters: "Zeitraum & Datumsbereich",
      comparison: "Vergleichseinstellungen",
      leadFilters: "Lead-Filter",
      engagement: "Engagement-Filter",
      conversion: "Konversionsfilter",
      dataCompleteness: "Datenvollständigkeit",
      additional: "Zusätzliche Filter",
      searchSort: "Suche & Sortierung",
    },
    timePeriod: {
      label: "Zeitraum",
      description:
        "Wählen Sie den Zeitraum für die Aggregierung von Statistiken",
      hour: "Stunde",
      day: "Tag",
      week: "Woche",
      month: "Monat",
      quarter: "Quartal",
      year: "Jahr",
    },
    dateRangePreset: {
      label: "Datumsbereich-Voreinstellung",
      description: "Wählen Sie einen vordefinierten Datumsbereich",
    },
    dateRange: {
      today: "Heute",
      yesterday: "Gestern",
      last7Days: "Letzte 7 Tage",
      last30Days: "Letzte 30 Tage",
      last90Days: "Letzte 90 Tage",
      thisWeek: "Diese Woche",
      lastWeek: "Letzte Woche",
      thisMonth: "Diesen Monat",
      lastMonth: "Letzter Monat",
      thisQuarter: "Dieses Quartal",
      lastQuarter: "Letztes Quartal",
      thisYear: "Dieses Jahr",
      lastYear: "Letztes Jahr",
      custom: "Benutzerdefinierter Bereich",
    },
    dateFrom: {
      label: "Startdatum",
      description: "Beginndatum für Statistiken",
    },
    dateTo: {
      label: "Enddatum",
      description: "Enddatum für Statistiken",
    },
    chartType: {
      label: "Diagrammtyp",
      description: "Wählen Sie den Diagrammtyp für die Datenvisualisierung",
      line: "Liniendiagramm",
      bar: "Balkendiagramm",
      area: "Flächendiagramm",
      pie: "Kreisdiagramm",
      donut: "Ringdiagramm",
    },
    includeComparison: {
      label: "Vergleich einbeziehen",
      description: "Mit einem früheren Zeitraum vergleichen",
    },
    comparisonPeriod: {
      label: "Vergleichszeitraum",
      description: "Wählen Sie den Zeitraum zum Vergleichen",
    },
    status: {
      label: "Lead-Status",
      description: "Nach Lead-Status filtern",
    },
    source: {
      label: "Lead-Quelle",
      description: "Nach Lead-Quelle filtern",
    },
    country: {
      label: "Land",
      description: "Nach Land filtern",
      all: "Alle Länder",
      de: "Deutschland",
      pl: "Polen",
      global: "Global",
    },
    language: {
      label: "Sprache",
      description: "Nach Sprachpräferenz filtern",
      all: "Alle Sprachen",
      en: "Englisch",
      de: "Deutsch",
      pl: "Polnisch",
    },
    campaignStage: {
      label: "Kampagnenphase",
      description: "Nach E-Mail-Kampagnenphase filtern",
    },
    hasEngagement: {
      label: "Hat Engagement",
      description: "Leads mit E-Mail-Engagement filtern",
    },
    minEmailsOpened: {
      label: "Mindestanzahl geöffneter E-Mails",
      description: "Mindestanzahl der geöffneten E-Mails",
    },
    minEmailsClicked: {
      label: "Mindestanzahl geklickter E-Mails",
      description: "Mindestanzahl der geklickten E-Mails",
    },
    isConverted: {
      label: "Ist konvertiert",
      description: "Konvertierte Leads filtern",
    },
    hasSignedUp: {
      label: "Hat sich angemeldet",
      description: "Leads filtern, die sich angemeldet haben",
    },
    hasConfirmedSubscription: {
      label: "Hat Abonnement bestätigt",
      description: "Leads mit bestätigtem Abonnement filtern",
    },
    hasBusinessName: {
      label: "Hat Firmennamen",
      description: "Leads mit Firmennamen filtern",
    },
    hasContactName: {
      label: "Hat Kontaktnamen",
      description: "Leads mit Kontaktnamen filtern",
    },
    hasPhone: {
      label: "Hat Telefon",
      description: "Leads mit Telefonnummer filtern",
    },
    hasWebsite: {
      label: "Hat Website",
      description: "Leads mit Website filtern",
    },
    hasNotes: {
      label: "Hat Notizen",
      description: "Leads mit Notizen filtern",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Feld zum Sortieren der Ergebnisse",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Aufsteigende oder absteigende Reihenfolge",
    },
    limit: {
      label: "Ergebnislimit",
      description: "Maximale Anzahl der Ergebnisse",
    },
    hasUserId: {
      label: "Hat Benutzer-ID",
      description: "Leads mit zugeordneter Benutzer-ID filtern",
    },
    emailVerified: {
      label: "E-Mail verifiziert",
      description: "Nach E-Mail-Verifizierungsstatus filtern",
    },
    journeyVariant: {
      label: "Journey-Variante",
      description: "Nach E-Mail-Journey-Variante filtern",
    },
    minEmailsSent: {
      label: "Mindestanzahl gesendeter E-Mails",
      description: "Mindestanzahl der an den Lead gesendeten E-Mails",
    },
    createdAfter: {
      label: "Erstellt nach",
      description: "Leads filtern, die nach diesem Datum erstellt wurden",
    },
    createdBefore: {
      label: "Erstellt vor",
      description: "Leads filtern, die vor diesem Datum erstellt wurden",
    },
    updatedAfter: {
      label: "Aktualisiert nach",
      description: "Leads filtern, die nach diesem Datum aktualisiert wurden",
    },
    updatedBefore: {
      label: "Aktualisiert vor",
      description: "Leads filtern, die vor diesem Datum aktualisiert wurden",
    },
    search: {
      label: "Suche",
      description: "Leads nach E-Mail, Name oder Firmenname suchen",
      placeholder: "Leads suchen...",
    },
    engagementLevel: {
      high: "Hohes Engagement",
      medium: "Mittleres Engagement",
      low: "Niedriges Engagement",
      none: "Kein Engagement",
    },
    response: {
      overview: "Übersicht",
      emailPerformance: "E-Mail-Leistung",
      conversionRates: "Konversionsraten",
      activityTimeline: "Aktivitätszeitlinie",
      campaignDistribution: "Kampagnenverteilung",
      geographicDistribution: "Geografische & Quellenverteilung",
      dataQuality: "Datenqualität",
      performanceMetrics: "Leistungskennzahlen",
      engagementLevels: "Engagement-Level",
      conversionFunnel: "Konversionstrichter",
      totalLeads: "Gesamt-Leads",
      newLeads: "Neue Leads",
      activeLeads: "Aktive Leads",
      inactiveLeads: "Inaktive Leads",
      leadsByStatus: "Leads nach Status",
      leadsBySource: "Leads nach Quelle",
      leadsByCountry: "Leads nach Land",
      leadsByLanguage: "Leads nach Sprache",
      websiteUserLeads: "Website-Benutzer",
      newsletterSubscriberLeads: "Newsletter-Abonnenten",
      convertedLeads: "Konvertierte Leads",
      consultationBookedLeads: "Beratung gebucht",
      signedUpLeads: "Angemeldete Leads",
      subscriptionConfirmedLeads: "Abonnement bestätigt",
      unsubscribedLeads: "Abgemeldete Leads",
      bounces: "Bounced",
      qualifiedLeads: "Qualifizierte Leads",
      nonQualifiedLeads: "Nicht qualifizierte Leads",
      nurturingLeads: "Nurturing-Leads",
      engagedLeads: "Engagierte Leads",
      leadsWithEmailEngagement: "Mit E-Mail-Engagement",
      leadsWithoutEmailEngagement: "Ohne E-Mail-Engagement",
      averageEmailEngagementScore: "Durchschn. E-Mail-Engagement",
      totalEmailEngagements: "Gesamt-E-Mail-Engagements",
      signupRate: "Anmelderate",
      subscriptionConfirmationRate: "Abonnementbestätigungsrate",
      dataCompletenessRate: "Datenvollständigkeit",
      leadsWithBusinessName: "Mit Firmennamen",
      leadsWithContactName: "Mit Kontaktnamen",
      leadsWithPhone: "Mit Telefon",
      leadsWithWebsite: "Mit Website",
      leadsWithNotes: "Mit Notizen",
      averageBusinessDataCompleteness:
        "Durchschn. Geschäftsdatenvollständigkeit",
      leadsByCampaignStage: "Leads nach Kampagnenphase",
      leadsInActiveCampaigns: "In aktiven Kampagnen",
      leadsNotInCampaigns: "Nicht in Kampagnen",
      recentLeads: "Aktuelle Leads",
      topLeadsByEngagement: "Top-Leads nach Engagement",
      mostActiveLeads: "Aktivste Leads",
      recentConversions: "Aktuelle Konversionen",
      recentSignups: "Aktuelle Anmeldungen",
      timeSeriesData: "Zeitreihendaten",
      comparisonData: "Vergleichsdaten",
      averageTimeToConversion: "Durchschn. Zeit bis zur Konversion",
      averageTimeToConsultation: "Durchschn. Zeit bis zur Beratung",
      averageTimeToSignup: "Durchschn. Zeit bis zur Anmeldung",
      topPerformingCampaigns: "Leistungsstärkste Kampagnen",
      topPerformingSources: "Leistungsstärkste Quellen",
      topPerformingCountries: "Leistungsstärkste Länder",
      conversionRate: "Konversionsrate",
      consultationBookingRate: "Beratungsbuchungsrate",
      averageOpenRate: "Durchschn. Öffnungsrate",
      averageClickRate: "Durchschn. Klickrate",
      campaignRunningLeads: "In laufenden Kampagnen",
      bouncedLeads: "Bounced Leads",
      invalidLeads: "Ungültige Leads",
      totalEmailsSent: "Gesendete E-Mails gesamt",
      totalEmailsOpened: "Geöffnete E-Mails gesamt",
      totalEmailsClicked: "Geklickte E-Mails gesamt",
      averageEmailsPerLead: "Durchschn. E-Mails pro Lead",
      leadVelocity: "Lead-Velocity",
      leadsCreatedToday: "Heute erstellte Leads",
      leadsCreatedThisWeek: "Diese Woche erstellte Leads",
      leadsCreatedThisMonth: "Diesen Monat erstellte Leads",
      leadsUpdatedToday: "Heute aktualisierte Leads",
      leadsUpdatedThisWeek: "Diese Woche aktualisierte Leads",
      leadsUpdatedThisMonth: "Diesen Monat aktualisierte Leads",
      leadsByJourneyVariant: "Leads nach Journey-Variante",
      historicalData: "Historische Daten",
      groupedStats: "Gruppierte Statistiken",
      recentActivity: "Aktuelle Aktivität",
      metadata: "Berichtsinformationen",
      generatedAt: "Generiert am",
      dataRange: "Datenbereich",
      data: "Statistikdaten",
      campaignName: "Kampagne",
      leadsGenerated: "Leads",
      openRate: "Öffnungsrate",
      clickRate: "Klickrate",
      source: "Quelle",
      qualityScore: "Qualitätsscore",
      activityType: "Aktivität",
      email: "E-Mail",
      businessName: "Unternehmen",
      timestamp: "Zeit",
      status: "Status",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisierter Zugriff",
        description:
          "Authentifizierung erforderlich um Lead-Statistiken anzuzeigen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Statistik-Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Abrufen der Lead-Statistiken",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler beim Abrufen der Statistiken",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Abrufen der Statistiken",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf Lead-Statistiken verboten",
      },
      notFound: {
        title: "Keine Daten",
        description:
          "Keine statistischen Daten für die angegebenen Kriterien gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt beim Generieren der Statistiken",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Es gibt ungespeicherte Änderungen in den Statistikfiltern",
      },
    },
    success: {
      title: "Statistiken generiert",
      description: "Lead-Statistiken erfolgreich abgerufen",
    },
    widget: {
      title: "Lead-Statistiken",
      refresh: "Aktualisieren",
      viewAllLeads: "Alle Leads anzeigen",
      searchLeads: "Leads suchen",
      export: "Exportieren",
      import: "Importieren",
      batchUpdate: "Massenaktualisierung",
      totalLeads: "Gesamt-Leads",
      activeLeads: "Aktive Leads",
      converted: "Konvertiert",
      conversionRate: "Konversionsrate",
      openRate: "Öffnungsrate",
      clickRate: "Klickrate",
      unsubscribeRate: "Abmelderate",
      newThisMonth: "Neu (30T)",
      newLeadsTimeline: "Neue Leads Zeitlinie",
      today: "Heute",
      thisWeek: "Diese Woche",
      thisMonth: "Diesen Monat",
      conversionFunnel: "Konversionstrichter",
      funnelTotalLeads: "Gesamt-Leads",
      funnelCampaignRunning: "Kampagne läuft",
      funnelSignedUp: "Angemeldet",
      funnelSubscriptionConfirmed: "Abonnement bestätigt",
      byStatus: "Nach Status",
      clickToFilter: "(zum Filtern klicken)",
      bySource: "Nach Quelle",
      byCountry: "Nach Land",
      byCampaignStage: "Nach Kampagnenphase",
      topPerformingCampaigns: "Leistungsstärkste Kampagnen",
      topSources: "Top-Quellen",
      viewAll: "Alle anzeigen",
      recentActivity: "Aktuelle Aktivität",
      filters: "Filter",
      applyFilters: "Filter anwenden",
      openRateSuffix: "% Öffnung",
      conversionRateSuffix: "% Konv.",
      emDash: "—",
      dateSeparator: "–",
    },
    enums: {
      sortOrder: {
        asc: "Aufsteigend",
        desc: "Absteigend",
      },
      leadSortField: {
        email: "E-Mail",
        businessName: "Firmenname",
        createdAt: "Erstellungsdatum",
        updatedAt: "Aktualisierungsdatum",
        lastEngagementAt: "Letztes Engagement",
      },
      leadStatusFilter: {
        all: "Alle",
        new: "Neu",
        pending: "Ausstehend",
        campaignRunning: "Kampagne läuft",
        websiteUser: "Website-Benutzer",
        newsletterSubscriber: "Newsletter-Abonnent",
        inContact: "In Kontakt",
        signedUp: "Registriert",
        subscriptionConfirmed: "Abonnement bestätigt",
        unsubscribed: "Abgemeldet",
        bounced: "Unzustellbar",
        invalid: "Ungültig",
      },
      emailCampaignStageFilter: {
        all: "Alle",
        notStarted: "Nicht gestartet",
        initial: "Erster Kontakt",
        followup1: "Nachfassung 1",
        followup2: "Nachfassung 2",
        followup3: "Nachfassung 3",
        nurture: "Pflege",
        reactivation: "Reaktivierung",
      },
      leadSourceFilter: {
        all: "Alle",
        website: "Website",
        socialMedia: "Soziale Medien",
        emailCampaign: "E-Mail-Kampagne",
        referral: "Empfehlung",
        csvImport: "CSV-Import",
      },
    },
  },
  tracking: {
    engagement: {
      category: "Lead-Tracking",
      tags: {
        tracking: "Tracking",
        engagement: "Engagement",
      },
      post: {
        title: "Lead-Engagement erfassen",
        description: "Neues Engagement-Ereignis für einen Lead erfassen",
        form: {
          title: "Lead-Engagement-Formular",
          description: "Lead-Engagement-Details erfassen",
        },
        leadId: {
          label: "Lead-ID",
          description: "Eindeutige Kennung für den Lead",
          placeholder: "Lead-ID eingeben",
          helpText:
            "UUID des Leads, für den das Engagement erfasst werden soll",
        },
        engagementType: {
          label: "Engagement-Typ",
          description: "Art des Engagement-Ereignisses",
          placeholder: "Engagement-Typ auswählen",
          helpText: "Die Art der Interaktion oder des Engagements",
        },
        campaignId: {
          label: "Kampagnen-ID",
          description: "Zugehörige Kampagnenkennung",
          placeholder: "Kampagnen-ID eingeben",
          helpText: "Optionale Kampagne, zu der dieses Engagement gehört",
        },
        metadata: {
          label: "Metadaten",
          description: "Zusätzliche Engagement-Metadaten",
          placeholder: "Metadaten als JSON eingeben",
          helpText: "Benutzerdefinierte Daten zu diesem Engagement",
        },
        userId: {
          label: "Benutzer-ID",
          description: "Zugehörige Benutzerkennung",
          placeholder: "Benutzer-ID eingeben",
          helpText:
            "Optionale Benutzer-ID, falls Lead mit einem Benutzer verknüpft ist",
        },
        response: {
          id: "Engagement-ID",
          leadId: "Lead-ID",
          engagementType: "Engagement-Typ",
          campaignId: "Kampagnen-ID",
          metadata: "Metadaten",
          timestamp: "Zeitstempel",
          ipAddress: "IP-Adresse",
          userAgent: "User-Agent",
          createdAt: "Erstellt am",
          leadCreated: "Lead erstellt",
          relationshipEstablished: "Beziehung hergestellt",
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
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Sie haben nicht gespeicherte Änderungen",
          },
        },
        success: {
          title: "Engagement erfasst",
          description: "Lead-Engagement erfolgreich erfasst",
        },
      },
      get: {
        title: "Lead-Klick verfolgen",
        description: "Lead-Klick verfolgen und zur Ziel-URL weiterleiten",
        form: {
          title: "Klick-Tracking-Parameter",
          description: "Parameter für Klick-Tracking und Weiterleitung",
        },
        id: {
          label: "Lead-ID",
          description: "Eindeutige Kennung für den Lead",
          placeholder: "Lead-ID eingeben",
          helpText: "Die eindeutige Kennung des Leads",
        },
        stage: {
          label: "Kampagnenstufe",
          description: "Aktuelle Stufe in der Kampagne",
          placeholder: "Stufe auswählen",
          helpText: "Die aktuelle Stufe des Leads in der Kampagne",
        },
        source: {
          label: "Quelle",
          description: "Quelle des Klicks",
          placeholder: "Quelle eingeben",
          helpText: "Die Quelle, von der der Klick kam",
        },
        url: {
          label: "Ziel-URL",
          description: "URL, zu der weitergeleitet werden soll",
          placeholder: "https://example.com",
          helpText: "Die URL, zu der der Lead weitergeleitet wird",
        },
        ref: {
          label: "Referenz-ID",
          description: "Referenzkennung zum Nachverfolgen",
          placeholder: "Referenz-ID eingeben",
          helpText: "Optionale Referenz-ID für zusätzliche Tracking-Kontexte",
        },
        response: {
          success: "Erfolg",
          redirectUrl: "Weiterleitungs-URL",
          leadId: "Lead-ID",
          campaignId: "Kampagnen-ID",
          engagementRecorded: "Engagement erfasst",
          leadStatusUpdated: "Lead-Status aktualisiert",
          isLoggedIn: "Ist angemeldet",
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
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Sie haben nicht gespeicherte Änderungen",
          },
        },
        success: {
          title: "Klick erfasst",
          description: "Lead-Klick erfolgreich erfasst und weitergeleitet",
        },
      },
      widget: {
        post: {
          headerTitle: "Engagement erfassen",
          viewStatsTitle: "Lead-Statistiken anzeigen",
          statsButton: "Statistiken",
          loading: "Engagement wird erfasst\u2026",
          successTitle: "Engagement erfasst",
          successSubtitle: "erfolgreich verfolgt",
          event: "Ereignis",
          labels: {
            engagementId: "Engagement-ID",
            type: "Typ",
            leadId: "Lead-ID",
            campaignId: "Kampagnen-ID",
            ipAddress: "IP-Adresse",
            recordedAt: "Erfasst am",
            leadCreated: "Lead erstellt",
            leadCreatedYes: "Ja (neuer Lead)",
            leadCreatedNo: "Nein (vorhanden)",
            relationshipEst: "Beziehung herg.",
            relationshipYes: "Ja",
            relationshipNo: "Nein",
            metadata: "Metadaten",
          },
          nextSteps: "N\u00E4chste Schritte:",
          viewLeadButton: "Lead anzeigen",
          leadStatsButton: "Lead-Statistiken",
          emptyTitle: "Engagement-Ereignis verfolgen",
          emptyDescription:
            "F\u00FCllen Sie das Formular aus und senden Sie es ab, um ein neues Engagement-Ereignis f\u00FCr einen Lead zu erfassen",
          viewLeadStatsButton: "Lead-Statistiken anzeigen",
        },
        get: {
          headerTitle: "Klick-Tracking",
          viewStatsTitle: "Lead-Statistiken anzeigen",
          statsButton: "Statistiken",
          loading: "Klick-Tracking wird verarbeitet\u2026",
          successTitle: "Klick erfasst",
          successSubtitle: "Engagement erfasst und Weiterleitungs-URL bereit",
          failTitle: "Tracking fehlgeschlagen",
          failSubtitle: "Das Klick-Ereignis konnte nicht erfasst werden",
          labels: {
            engagementLabel: "Engagement",
            recorded: "Erfasst",
            notRecorded: "Nicht erfasst",
            leadStatusLabel: "Lead-Status",
            updated: "Aktualisiert",
            unchanged: "Unver\u00E4ndert",
            userLabel: "Benutzer",
            loggedIn: "Angemeldet",
            anonymous: "Anonym",
            leadId: "Lead-ID",
            campaignId: "Kampagnen-ID",
            redirectUrl: "Weiterleitungs-URL",
          },
          nextSteps: "N\u00E4chste Schritte:",
          openUrlButton: "URL \u00F6ffnen",
          viewLeadButton: "Lead anzeigen",
          leadStatsButton: "Lead-Statistiken",
          emptyTitle: "Klick-Ereignis verfolgen",
          emptyDescription:
            "Geben Sie unten die Tracking-Parameter ein, um einen Klick zu erfassen und die Weiterleitungs-URL abzurufen",
          viewLeadStatsButton: "Lead-Statistiken anzeigen",
        },
      },
      enums: {
        engagementLevel: {
          high: "Hoch",
          medium: "Mittel",
          low: "Niedrig",
          none: "Keine",
        },
      },
      error: {
        default:
          "Bei der Verarbeitung des Engagements ist ein Fehler aufgetreten",
      },
    },
    pixel: {
      category: "API Endpunkt",
      tags: {
        pixel: "Pixel",
      },
      // Add endpoint-specific translations here
    },
    existing: {
      found: "Vorhandenes Lead-Tracking gefunden",
    },
    component: {
      initialized: "Lead-Tracking-Komponente initialisiert",
    },
    error: "Fehler beim Lead-Tracking",
    errors: {
      default: "Ein Fehler ist aufgetreten",
      missingId: "Fehlende Tracking-ID",
      invalidUrl: "Ungültige URL",
    },
    data: {
      captured: "Lead-Tracking-Daten erfasst",
      capture: {
        error: "Fehler beim Erfassen der Lead-Tracking-Daten",
      },
      retrieve: {
        error: "Fehler beim Abrufen der Lead-Tracking-Daten",
      },
      loaded: {
        signup: "Lead-Tracking-Daten für Anmeldung geladen",
      },
      load: {
        error: {
          noncritical: "Fehler beim Laden der Lead-Tracking-Daten (unkritisch)",
        },
      },
      stored: "Lead-Tracking-Daten gespeichert",
      store: {
        error: "Fehler beim Speichern der Lead-Tracking-Daten",
      },
      cleared: "Lead-Tracking-Daten gelöscht",
      clear: {
        error: "Fehler beim Löschen der Lead-Tracking-Daten",
      },
      format: {
        error: "Fehler beim Formatieren der Tracking-Daten",
      },
    },
    params: {
      validate: {
        error: "Fehler beim Validieren der Tracking-Parameter",
      },
    },
  },
  enums: {
    engagementTypes: {
      emailOpen: "E-Mail geöffnet",
      emailClick: "E-Mail geklickt",
      websiteVisit: "Website-Besuch",
      formSubmit: "Formular abgeschickt",
      leadAttribution: "Lead-Zuordnung",
    },
    leadStatus: {
      new: "Neu",
      pending: "Ausstehend",
      campaignRunning: "Kampagne läuft",
      websiteUser: "Website-Benutzer",
      newsletterSubscriber: "Newsletter-Abonnent",
      inContact: "In Kontakt",
      signedUp: "Registriert",
      subscriptionConfirmed: "Abonnement bestätigt",
      unsubscribed: "Abgemeldet",
      bounced: "Unzustellbar",
      invalid: "Ungültig",
    },
    emailCampaignStage: {
      notStarted: "Nicht gestartet",
      initial: "Erster Kontakt",
      followup1: "Nachfassung 1",
      followup2: "Nachfassung 2",
      followup3: "Nachfassung 3",
      nurture: "Pflege",
      reactivation: "Reaktivierung",
    },
    emailStatus: {
      pending: "Ausstehend",
      sent: "Gesendet",
      delivered: "Zugestellt",
      opened: "Geöffnet",
      clicked: "Geklickt",
      bounced: "Unzustellbar",
      failed: "Fehlgeschlagen",
      unsubscribed: "Abgemeldet",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Unzensierter Konverter",
      sideHustle: "Nebenverdienst",
      quietRecommendation: "Stille Empfehlung",
      signupNurture: "Anmeldungs-Nurturing",
      retention: "Kundenbindung",
      winback: "Rückgewinnung",
      newsletterMay2026: "Newsletter Mai 2026",
    },
    emailJourneyVariantFilter: {
      all: "Alle",
      uncensoredConvert: "Unzensierter Konverter",
      sideHustle: "Nebenverdienst",
      quietRecommendation: "Stille Empfehlung",
      signupNurture: "Anmeldungs-Nurturing",
      retention: "Kundenbindung",
      winback: "Rückgewinnung",
      newsletterMay2026: "Newsletter Mai 2026",
    },
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    leadSortField: {
      email: "E-Mail",
      businessName: "Firmenname",
      createdAt: "Erstellungsdatum",
      updatedAt: "Aktualisierungsdatum",
      lastEngagementAt: "Letztes Engagement",
    },
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
    mimeType: {
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    activityType: {
      leadCreated: "Lead erstellt",
      leadUpdated: "Lead aktualisiert",
      emailSent: "E-Mail gesendet",
      emailOpened: "E-Mail geöffnet",
      emailClicked: "E-Mail geklickt",
      leadConverted: "Lead konvertiert",
      leadUnsubscribed: "Lead abgemeldet",
    },
    userAssociation: {
      withUser: "Mit Benutzer",
      withLead: "Mit Lead",
      standalone: "Eigenständig",
      withBoth: "Mit beiden",
    },
    deviceType: {
      desktop: "Desktop",
      mobile: "Mobilgerät",
      tablet: "Tablet",
      bot: "Bot",
      unknown: "Unbekannt",
    },
    leadSource: {
      website: "Website",
      socialMedia: "Soziale Medien",
      emailCampaign: "E-Mail-Kampagne",
      referral: "Empfehlung",
      csvImport: "CSV-Import",
    },
    leadStatusFilter: {
      all: "Alle",
      new: "Neu",
      pending: "Ausstehend",
      campaignRunning: "Kampagne läuft",
      websiteUser: "Website-Benutzer",
      newsletterSubscriber: "Newsletter-Abonnent",
      inContact: "In Kontakt",
      signedUp: "Registriert",
      subscriptionConfirmed: "Abonnement bestätigt",
      unsubscribed: "Abgemeldet",
      bounced: "Unzustellbar",
      invalid: "Ungültig",
    },
    emailCampaignStageFilter: {
      all: "Alle",
      notStarted: "Nicht gestartet",
      initial: "Erster Kontakt",
      followup1: "Nachfassung 1",
      followup2: "Nachfassung 2",
      followup3: "Nachfassung 3",
      nurture: "Pflege",
      reactivation: "Reaktivierung",
    },
    leadSourceFilter: {
      all: "Alle",
      website: "Website",
      socialMedia: "Soziale Medien",
      emailCampaign: "E-Mail-Kampagne",
      referral: "Empfehlung",
      csvImport: "CSV-Import",
    },
    batchOperationScope: {
      currentPage: "Aktuelle Seite",
      allPages: "Alle Seiten",
    },
    country: {
      de: "Deutschland",
      pl: "Polen",
      global: "Global",
    },
    language: {
      de: "Deutsch",
      pl: "Polnisch",
      en: "Englisch",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Sonstiges",
    },
  },
  error: {
    general: {
      internal_server_error: "Interner Serverfehler",
      not_found: "Nicht gefunden",
      unauthorized: "Nicht autorisiert",
      forbidden: "Verboten",
      bad_request: "Ungültige Anfrage",
      validation_error: "Validierungsfehler",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        error: {
          validation: {
            title: "Ungültige Batch-Aktualisierungsanfrage",
          },
          server: {
            title: "Serverfehler beim Batch-Update von Leads",
          },
          default: "Fehler beim Batch-Update von Leads",
        },
      },
    },
    leads: {
      get: {
        error: {
          server: {
            title: "Serverfehler beim Abrufen der Leads",
            detail: "Serverfehler beim Abrufen der Leads: {{error}}",
          },
          not_found: {
            title: "Leads nicht gefunden",
          },
        },
      },
      post: {
        error: {
          duplicate: {
            title: "Lead mit dieser E-Mail existiert bereits",
          },
          server: {
            title: "Serverfehler beim Erstellen des Leads",
          },
        },
      },
      patch: {
        error: {
          not_found: {
            title: "Lead nicht gefunden",
          },
          server: {
            title: "Serverfehler beim Aktualisieren des Leads",
          },
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        success: {
          description: "Erfolgreich abgemeldet",
        },
        error: {
          validation: {
            title: "Ungültige Abmeldeanfrage",
          },
          server: {
            title: "Serverfehler bei der Verarbeitung der Abmeldung",
          },
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "Ungültige Engagement-Daten",
          },
          server: {
            title: "Serverfehler bei der Aufzeichnung des Engagements",
          },
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          server: {
            title: "Serverfehler beim Exportieren der Leads",
          },
        },
      },
    },
    campaigns: {
      common: {
        error: {
          server: {
            title: "Serverfehler bei der Verarbeitung der Kampagne",
          },
        },
      },
    },
  },
  countries: {
    global: "Global",
    de: "Deutschland",
    pl: "Polen",
    us: "Vereinigte Staaten",
  },
  languages: {
    en: "Englisch",
    de: "Deutsch",
    pl: "Polnisch",
  },
};
