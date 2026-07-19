import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
          description: "Beim Starten der Kampagnen ist ein Fehler aufgetreten",
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
                disclosure: "Vollständige Affiliate-Offenlegung von Anfang an",
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
};
