import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  leads: {
    admin: {
      title: "Lead-Verwaltung",
      abTesting: {
        title: "A/B-Test-Konfiguration",
        subtitle:
          "A/B-Tests für E-Mail-Journey-Varianten überwachen und konfigurieren",
        status: {
          active: "Aktiv",
          inactive: "Inaktiv",
          valid: "Gültig",
          invalid: "Ungültig",
        },
        metrics: {
          testStatus: "Test-Status",
          totalVariants: "Gesamte Varianten",
          configuration: "Konfiguration",
          trafficSplit: "Traffic-Aufteilung",
          trafficAllocation: "Traffic-Zuteilung",
        },
        variants: {
          title: "E-Mail-Journey-Varianten",
          keyCharacteristics: "Hauptmerkmale:",
        },
        config: {
          title: "Konfigurationsdetails",
          testConfiguration: "Test-Konfiguration",
          trafficDistribution: "Traffic-Verteilung",
          status: "Status",
          enabled: "Aktiviert",
          disabled: "Deaktiviert",
          configurationValid: "Konfiguration gültig",
          yes: "Ja",
          no: "Nein",
          total: "Gesamt",
        },
        descriptions: {
          enabled: "A/B-Tests laufen",
          disabled: "A/B-Tests sind deaktiviert",
          emailJourneyVariants: "E-Mail-Journey-Varianten",
          configurationStatus: "Konfigurationsstatus",
        },
      },
      actions: {
        refresh: "Aktualisieren",
        retry: "Wiederholen",
        export: "Exportieren",
        exportCsv: "Als CSV exportieren",
        exportExcel: "Als Excel exportieren",
        import: "Importieren",
        addLead: "Lead hinzufügen",
      },
      adminErrors: {
        metrics: {
          calculation: "Fehler beim Berechnen der Engagement-Metriken",
        },
        processing: {
          listData: "Fehler beim Verarbeiten der Lead-Listendaten",
        },
      },
      batch: {
        filter_count: "{{total}} Leads entsprechen den aktuellen Filtern",
        current_page_count: "{{count}} Leads auf Seite {{page}}",
        scope_current_page: "Aktuelle Seite",
        scope_all_pages: "Alle Seiten",
        preview: "Änderungen vorschau",
        apply: "Änderungen anwenden",
        delete: "Löschen",
        select_action: "Aktion auswählen",
        select_value: "Wert auswählen",
        actions: {
          update_status: "Status aktualisieren",
          update_stage: "Kampagnen-Phase aktualisieren",
          update_source: "Quelle aktualisieren",
          delete: "Leads löschen",
        },
        preview_title: "Batch-Update Vorschau",
        delete_preview_title: "Batch-Löschung Vorschau",
        confirm_title: "Batch-Update bestätigen",
        delete_confirm: {
          title: "Batch-Löschung bestätigen",
        },
        result_title: "Batch-Operation Ergebnisse",
        preview_description:
          "{{count}} Leads überprüfen, die aktualisiert werden",
        delete_preview_description:
          "{{count}} Leads überprüfen, die gelöscht werden. Diese Aktion kann nicht rückgängig gemacht werden.",
        planned_changes: "Geplante Änderungen",
        change_status: "Status → {{status}}",
        change_stage: "Kampagnen-Phase → {{stage}}",
        change_source: "Quelle → {{source}}",
        confirm_update: "Update bestätigen",
        confirm_delete: "Löschung bestätigen",
        success_message:
          "{{updated}} von {{total}} Leads erfolgreich aktualisiert",
        delete_success_message:
          "{{deleted}} von {{total}} Leads erfolgreich gelöscht",
        error_message:
          "Fehler beim Aktualisieren der Leads. Bitte versuchen Sie es erneut.",
        errors_title: "Fehler ({{count}})",
        processing: "Verarbeitung...",
        close: "Schließen",
        results: {
          title: "Ergebnisse der Batch-Operation",
        },
        confirm: {
          title: "Batch-Aktualisierung bestätigen",
        },
      },
      campaigns: {
        title: "E-Mail-Kampagnen",
        subtitle:
          "Überwachen und verwalten Sie Ihre automatisierten E-Mail-Kampagnen",
        description:
          "Verwalten Sie automatisierte E-Mail-Kampagnen und -Sequenzen",
        error: "Fehler beim Laden der Kampagnenstatistiken",
        comingSoon: "Kampagnen-Verwaltungsschnittstelle kommt bald...",
        coming_soon: "Kampagnen-Verwaltungsschnittstelle kommt bald...",
        active_campaigns: "Aktive Kampagnen",
        currently_running: "Derzeit laufend",
        total_leads: "Gesamt Leads",
        in_campaigns: "In Kampagnen",
        conversion_rate: "Konversionsrate",
        overall_performance: "Gesamtleistung",
        emails_sent: "E-Mails gesendet",
        total_sent: "Gesamt gesendet",
        email_performance: "E-Mail-Performance",
        open_rate: "Öffnungsrate",
        click_rate: "Klickrate",
        bounce_rate: "Bounce-Rate",
        engagement_breakdown: "Engagement-Aufschlüsselung",
        emails_opened: "E-Mails geöffnet",
        emails_clicked: "E-Mails geklickt",
        unsubscribe_rate: "Abmelderate",
        lead_status_breakdown: "Lead-Status-Aufschlüsselung",
        recent_activity: "Letzte Aktivität",
        leads_this_week: "Leads diese Woche",
        leads_this_month: "Leads diesen Monat",
        emails_this_week: "E-Mails diese Woche",
        emails_this_month: "E-Mails diesen Monat",
      },
      campaignStarter: {
        description:
          "Konfigurieren Sie automatisierte Kampagnen-Starter-Einstellungen und Planung",
        form: {
          cronSettings: {
            label: "Cron-Aufgaben-Einstellungen",
            description:
              "Konfigurieren Sie die Ausführungseinstellungen des Cron-Jobs",
            schedule: {
              label: "Zeitplan",
              placeholder: "Cron-Ausdruck eingeben (z.B. */3 * * * *)",
            },
            timezone: {
              label: "Zeitzone",
              placeholder: "Zeitzone eingeben (z.B. UTC)",
            },
            enabled: {
              label: "Aktiviert",
            },
            priority: {
              label: "Priorität",
              options: {
                low: "Niedrig",
                normal: "Normal",
                high: "Hoch",
                critical: "Kritisch",
              },
            },
            timeout: {
              label: "Timeout (ms)",
              placeholder: "Timeout in Millisekunden eingeben",
            },
            retries: {
              label: "Wiederholungen",
              placeholder: "Anzahl der Wiederholungsversuche",
            },
            retryDelay: {
              label: "Wiederholungsverzögerung (ms)",
              placeholder:
                "Verzögerung zwischen Wiederholungen in Millisekunden",
            },
          },
          dryRun: {
            label: "Testmodus",
          },
          enabledDays: {
            label: "Aktivierte Tage",
            description:
              "Wählen Sie die Wochentage aus, an denen der Kampagnen-Starter laufen soll",
            options: {
              monday: "Montag",
              tuesday: "Dienstag",
              wednesday: "Mittwoch",
              thursday: "Donnerstag",
              friday: "Freitag",
              saturday: "Samstag",
              sunday: "Sonntag",
            },
          },
          enabledHours: {
            label: "Aktivierte Stunden",
            description:
              "Stellen Sie den Zeitbereich ein, in dem der Kampagnen-Starter laufen soll",
            startHour: {
              label: "Startstunde",
              placeholder: "Startstunde (0-23)",
            },
            endHour: {
              label: "Endstunde",
              placeholder: "Endstunde (0-23)",
            },
          },
          leadsPerWeek: {
            label: "Leads pro Woche",
            description:
              "Stellen Sie das wöchentliche Kontingent von Leads ein, die für jede Sprache verarbeitet werden sollen",
          },
          minAgeHours: {
            label: "Mindestalter (Stunden)",
            placeholder: "Mindestalter in Stunden eingeben",
          },
          sections: {
            basic: {
              title: "Grundkonfiguration",
              description:
                "Grundlegende Kampagnen-Starter-Einstellungen konfigurieren",
            },
          },
        },
        settings: {
          title: "Kampagnen-Starter-Einstellungen",
          description:
            "Konfigurieren Sie die Kampagnen-Starter-Cron-Job-Einstellungen",
        },
      },
      emails: {
        preview: {
          actions: {
            title: "E-Mail-Aktionen",
            description: "E-Mail-Vorlagen testen und verwalten",
          },
          live: "Live-Vorschau",
          error: "E-Mail-Vorschau konnte nicht gerendert werden",
        },
        testEmail: {
          button: "Test-E-Mail senden",
          title: "Test-E-Mail senden",
          send: "Test-E-Mail senden",
          sending: "Wird gesendet...",
          success: "Test-E-Mail erfolgreich an {{email}} gesendet",
          prefix: "[TEST]",
          recipient: {
            title: "Test-Empfänger",
            name: "Test-Empfänger",
            email: {
              label: "Test-E-Mail-Adresse",
              placeholder: "E-Mail-Adresse für den Test eingeben",
              description:
                "Die E-Mail-Adresse, an die die Test-E-Mail gesendet wird",
            },
          },
          leadData: {
            title: "Lead-Daten für Vorlage",
            businessName: {
              label: "Firmenname",
              placeholder: "Beispiel Firma GmbH",
            },
            contactName: {
              label: "Kontaktname",
              placeholder: "Max Mustermann",
            },
            phone: {
              label: "Telefonnummer",
              placeholder: "+49123456789",
            },
            website: {
              label: "Website",
              placeholder: "https://example.com",
            },
            country: {
              label: "Land",
            },
            language: {
              label: "Sprache",
            },
            status: {
              label: "Lead-Status",
            },
            source: {
              label: "Lead-Quelle",
            },
            notes: {
              label: "Notizen",
              placeholder: "Test-Lead für E-Mail-Vorschau",
            },
          },
          mockData: {
            businessName: "Acme Digital Lösungen GmbH",
            contactName: "Anna Schmidt",
            phone: "+49-30-12345678",
            website: "https://acme-digital.de",
            notes:
              "Interessiert an Premium Social Media Management Services. Potenzialstarker Kunde mit etabliertem Unternehmen.",
          },
        },
      },
      filters: {
        title: "Filter",
        clear: "Filter löschen",
        search: {
          placeholder: "Suche nach E-Mail, Firmenname oder Kontakt...",
        },
        status: {
          placeholder: "Nach Status filtern",
          all: "Alle Status",
        },
        campaign_stage: {
          all: "Alle Kampagnen-Phasen",
        },
        country: "Land",
        countries: {
          title: "Land",
          all: "Alle Länder",
          global: "Global",
          us: "Vereinigte Staaten",
          ca: "Kanada",
          gb: "Vereinigtes Königreich",
          de: "Deutschland",
          fr: "Frankreich",
          au: "Australien",
          pl: "Polen",
        },
        languages: {
          en: "Englisch",
          de: "Deutsch",
          fr: "Französisch",
          es: "Spanisch",
          pl: "Polnisch",
        },
        sources: {
          title: "Quelle",
          website: "Website",
          socialMedia: "Soziale Medien",
          emailCampaign: "E-Mail-Kampagne",
          referral: "Empfehlung",
          csvImport: "CSV-Import",
          all: "Alle Quellen",
          organic: "Organisch",
          paid: "Bezahlte Werbung",
          social: "Soziale Medien",
          email: "E-Mail",
          direct: "Direkt",
        },
        timePeriod: "Zeitraum",
        timePeriods: {
          hour: "Stündlich",
          day: "Täglich",
          week: "Wöchentlich",
          month: "Monatlich",
          quarter: "Vierteljährlich",
          year: "Jährlich",
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
        },
        chartType: "Diagrammtyp",
        chartTypes: {
          line: "Liniendiagramm",
          bar: "Balkendiagramm",
          area: "Flächendiagramm",
        },
        statuses: {
          title: "Status",
          all: "Alle Status",
          new: "Neu",
          pending: "Ausstehend",
          campaign_running: "Kampagne läuft",
          website_user: "Website-Nutzer",
          newsletter_subscriber: "Newsletter-Abonnent",
          nurturing: "Pflege",
          converted: "Konvertiert",
          signed_up: "Registriert",
          consultation_booked: "Beratung Gebucht",
          subscription_confirmed: "Abonnement Bestätigt",
          unsubscribed: "Abgemeldet",
          bounced: "Abgelehnt",
          invalid: "Ungültig",
        },
      },
      formatting: {
        percentage: {
          zero: "0%",
          format: "{{value}}%",
        },
        fallbacks: {
          dash: "—",
          never: "Nie",
          direct: "Direkt",
          unknown: "Unbekannt",
          noSource: "Keine Quelle",
          notAvailable: "N/V",
        },
      },
      import: {
        button: "Leads importieren",
        title: "Leads aus CSV importieren",
        description:
          "Laden Sie eine CSV-Datei hoch, um Leads in Ihr Kampagnensystem zu importieren",
        template: {
          title: "Vorlage herunterladen",
          description:
            "Holen Sie sich die CSV-Vorlage mit erforderlichen Spalten",
          download: "Vorlage herunterladen",
          examples: {
            example1:
              "hans@beispiel.com,Beispiel GmbH,Hans Müller,+49-123-456789,https://beispiel.com,DE,de,website,Interessiert an Premium-Funktionen",
            example2:
              "anna@firma.com,Firma AG,Anna Schmidt,+49-987-654321,https://firma.com,DE,de,empfehlung,Sucht nach Social Media Automatisierung",
          },
        },
        file: {
          label: "CSV-Datei",
          dropzone: {
            title: "Legen Sie Ihre CSV-Datei hier ab",
            description: "oder klicken Sie, um Dateien zu durchsuchen",
          },
          validation: {
            required: "Bitte wählen Sie eine CSV-Datei zum Hochladen aus",
          },
        },
        options: {
          title: "Import-Optionen",
          description:
            "Konfigurieren Sie, wie der Import mit vorhandenen Daten umgehen soll",
          skipDuplicates: "Leads mit doppelten E-Mail-Adressen überspringen",
          updateExisting: "Bestehende Leads mit neuen Daten aktualisieren",
        },
        batch: {
          title: "Batch-Verarbeitung",
          description:
            "Konfigurieren Sie, wie große Importe verarbeitet werden sollen",
          useChunkedProcessing: "Batch-Verarbeitung verwenden",
          useChunkedProcessingDescription:
            "Große CSV-Dateien in kleineren Batches über Hintergrund-Jobs verarbeiten. Empfohlen für Dateien mit mehr als 1000 Zeilen.",
          batchSize: "Batch-Größe",
          batchSizeDescription: "Anzahl der Zeilen pro Batch (10-1000)",
          batchSizePlaceholder: "100",
        },
        defaults: {
          title: "Standardwerte",
          description:
            "Standardwerte für Leads festlegen, die diese Felder nicht angeben",
          country: "Standardland",
          countryDescription:
            "Land, das verwendet wird, wenn nicht in CSV angegeben",
          countryPlaceholder: "Standardland auswählen",
          language: "Standardsprache",
          languageDescription:
            "Sprache, die verwendet wird, wenn nicht in CSV angegeben",
          languagePlaceholder: "Standardsprache auswählen",
          status: "Standardstatus",
          statusDescription:
            "Status, der verwendet wird, wenn nicht in CSV angegeben",
          statusPlaceholder: "Standardstatus auswählen",
          campaignStage: "Standard-Kampagnenstufe",
          campaignStageDescription:
            "Kampagnenstufe, die verwendet wird, wenn nicht in CSV angegeben",
          campaignStagePlaceholder: "Standard-Kampagnenstufe auswählen",
          source: "Standardquelle",
          sourceDescription:
            "Quelle, die verwendet wird, wenn nicht in CSV angegeben",
          sourcePlaceholder: "Standardquelle auswählen",
        },
        progress: {
          title: "Import-Fortschritt",
          processing: "Verarbeitung...",
        },
        status: {
          title: "Import-Status",
          pending: "Wartend",
          processing: "Verarbeitung",
          completed: "Abgeschlossen",
          failed: "Fehlgeschlagen",
          unknown: "Unbekannt",
          rows: "Zeilen",
          summary:
            "{{successful}} erfolgreich, {{failed}} fehlgeschlagen, {{duplicates}} Duplikate",
          andMore: "und {{count}} weitere",
          importing: "Importiere",
          loading: "Lade Import-Status...",
          activeJobs: "Aktive Import-Aufträge",
          preparing: "Bereite Import vor...",
        },
        settings: {
          title: "Import-Auftragseinstellungen",
          description: "Einstellungen für diesen Import-Auftrag anpassen",
          batchSize: "Batch-Größe",
          maxRetries: "Maximale Wiederholungen",
        },
        success:
          "Erfolgreich {{successful}} von {{total}} Leads importiert. {{failed}} fehlgeschlagen, {{duplicates}} Duplikate.",
        importing: "Importiere...",
        start: "Import starten",
        error: {
          generic:
            "Import fehlgeschlagen. Bitte überprüfen Sie Ihr Dateiformat und versuchen Sie es erneut.",
          invalid_email_format: "Ungültiges E-Mail-Format",
          email_required: "E-Mail ist erforderlich",
        },
        errors: {
          noData: "Keine Daten in der hochgeladenen Datei gefunden",
          missingHeaders: "Fehlende erforderliche Header in der CSV-Datei",
        },
      },
      results: {
        showing: "Zeige {{start}}-{{end}} von {{total}} Leads",
      },
      sort: {
        newest: "Neueste zuerst",
        oldest: "Älteste zuerst",
        business_asc: "Unternehmen A-Z",
        business_desc: "Unternehmen Z-A",
      },
      source: {
        website: "Website",
        social_media: "Soziale Medien",
        email_campaign: "E-Mail-Kampagne",
        referral: "Empfehlung",
        csv_import: "CSV-Import",
        api: "API",
      },
      stage: {
        not_started: "Nicht gestartet",
        initial: "Erstkontakt",
        followup_1: "Nachfassen 1",
        followup_2: "Nachfassen 2",
        followup_3: "Nachfassen 3",
        nurture: "Pflege",
        reactivation: "Reaktivierung",
      },
      stats: {
        // UI Component translations
        totalLeads: "Gesamt Leads",
        newThisMonth: "Neu Diesen Monat",
        activeLeads: "Aktive Leads",
        ofTotal: "von insgesamt",
        conversionRate: "Konversionsrate",
        convertedLeads: "Konvertierte Leads",
        emailEngagement: "E-Mail-Engagement",
        emailsSent: "E-Mails Gesendet",
        consultationBookings: "Beratungsbuchungen",
        bookingRate: "Buchungsrate",
        dataCompleteness: "Datenvollständigkeit",
        profileCompleteness: "Profilvollständigkeit",
        leadVelocity: "Lead-Geschwindigkeit",
        leadsPerDay: "Leads Pro Tag",
        signedUpLeads: "Angemeldete Leads",
        signupRate: "Anmelderate",
        consultationBookedLeads: "Beratung Gebuchte Leads",
        subscriptionConfirmedLeads: "Abonnement Bestätigte Leads",
        confirmationRate: "Bestätigungsrate",
        unsubscribedLeads: "Abgemeldete Leads",
        bouncedLeads: "Zurückgewiesene Leads",
        invalidLeads: "Ungültige Leads",
        leadsWithEmailEngagement: "Leads Mit E-Mail-Engagement",
        leadsWithoutEmailEngagement: "Leads Ohne E-Mail-Engagement",
        averageEmailEngagementScore:
          "Durchschnittlicher E-Mail-Engagement-Score",
        engagementScore: "Engagement-Score",
        totalEmailEngagements: "Gesamte E-Mail-Engagements",
        totalEngagements: "Gesamte Engagements",
        todayActivity: "Heutige Aktivität",
        leadsCreatedToday: "Heute Erstellte Leads",
        leadsUpdatedToday: "Heute Aktualisierte Leads",
        weekActivity: "Aktivität Dieser Woche",
        leadsCreatedThisWeek: "Diese Woche Erstellte Leads",
        leadsUpdatedThisWeek: "Diese Woche Aktualisierte Leads",
        monthActivity: "Aktivität Diesen Monat",
        leadsCreatedThisMonth: "Diesen Monat Erstellte Leads",
        leadsUpdatedThisMonth: "Diesen Monat Aktualisierte Leads",
        campaignStageDistribution: "Kampagnenstufen-Verteilung",
        leadsInActiveCampaigns: "Leads in Aktiven Kampagnen",
        leadsNotInCampaigns: "Leads Nicht in Kampagnen",
        journeyVariantDistribution: "Journey-Varianten-Verteilung",
        countWithPercentage: "{{count}} ({{percentage}}%)",
        overview: "Übersicht",
        campaigns: "Kampagnen",
        performance: "Leistung",
        distribution: "Verteilung",
        activity: "Aktivität",
        topPerformers: "Top-Performer",
        historicalSubtitle: "Historische Daten",
        campaignPerformance: "Kampagnen-Leistung",
        emailsOpened: "Geöffnete E-Mails",
        open_rate: "Öffnungsrate",
        click_rate: "Klickrate",
        topCampaigns: "Top-Kampagnen",
        leadsGenerated: "Generierte Leads",
        performanceMetrics: "Leistungskennzahlen",
        avgTimeToConversion: "Durchschn. Zeit bis Konversion",
        avgTimeToSignup: "Durchschn. Zeit bis Anmeldung",
        avgTimeToConsultation: "Durchschn. Zeit bis Beratung",
        topSources: "Top-Quellen",
        qualityScore: "Qualitätsbewertung",
        statusDistribution: "Status-Verteilung",
        sourceDistribution: "Quellen-Verteilung",
        geographicDistribution: "Geografische Verteilung",
        dataCompletenessBreakdown: "Datenvollständigkeit-Aufschlüsselung",
        withBusinessName: "Mit Firmenname",
        withContactName: "Mit Kontaktname",
        withPhone: "Mit Telefon",
        withWebsite: "Mit Website",
        recentActivity: "Letzte Aktivität",
        engagementLevelDistribution: "Engagement-Level-Verteilung",
        topPerformingCampaigns: "Leistungsstärkste Kampagnen",
        openRate: "Öffnungsrate",
        clickRate: "Klickrate",
        topPerformingSources: "Leistungsstärkste Quellen",

        chart: {
          series: {
            totalLeads: "Gesamt Leads",
            newLeads: "Neue Leads",
            qualifiedLeads: "Qualifizierte Leads",
            convertedLeads: "Konvertierte Leads",
            consultationBooked: "Beratung Gebucht",
          },
          title: "Lead-Statistiken über Zeit",
          noData: "Keine Daten für den ausgewählten Zeitraum verfügbar",
          yAxisLabel: "Anzahl Leads",
          xAxisLabel: "Datum",
        },
        grouped: {
          by_status: "Nach Status: {{status}}",
          by_source: "Nach Quelle: {{source}}",
          by_country: "Nach Land: {{country}}",
          by_language: "Nach Sprache: {{language}}",
          by_campaign_stage: "Nach Kampagnenstufe: {{stage}}",
          by_journey_variant: "Nach Journey-Variante: {{variant}}",
          by_engagement_level: "Nach Engagement-Level: {{level}}",
          by_conversion_funnel: "Nach Konversions-Trichter: {{stage}}",
        },
        legend: {
          title: "Diagramm-Legende",
          showAll: "Alle anzeigen",
          hideAll: "Alle ausblenden",
          clickToToggle:
            "Klicken Sie, um die Sichtbarkeit der Serie umzuschalten",
        },
        metrics: {
          total_leads: "Gesamt Leads",
          new_leads: "Neue Leads",
          active_leads: "Aktive Leads",
          campaign_running_leads: "Kampagne läuft Leads",
          website_user_leads: "Website-Nutzer Leads",
          newsletter_subscriber_leads: "Newsletter-Abonnent Leads",
          qualified_leads: "Qualifizierte Leads",
          converted_leads: "Konvertierte Leads",
          signed_up_leads: "Angemeldete Leads",
          consultation_booked_leads: "Beratung Gebuchte Leads",
          subscription_confirmed_leads: "Abonnement Bestätigte Leads",
          unsubscribed_leads: "Abgemeldete Leads",
          bounced_leads: "Zurückgewiesene Leads",
          invalid_leads: "Ungültige Leads",
          emails_sent: "Gesendete E-Mails",
          emails_opened: "Geöffnete E-Mails",
          emails_clicked: "Geklickte E-Mails",
          open_rate: "Öffnungsrate",
          click_rate: "Klickrate",
          conversion_rate: "Konversionsrate",
          signup_rate: "Anmelderate",
          consultation_booking_rate: "Beratungsbuchungsrate",
          subscription_confirmation_rate: "Abonnement-Bestätigungsrate",
          average_email_engagement_score:
            "Durchschnittlicher E-Mail-Engagement-Score",
          lead_velocity: "Lead-Geschwindigkeit",
          data_completeness_rate: "Datenvollständigkeitsrate",
          status_historical: "Status Historische Daten",
          source_historical: "Quelle Historische Daten",
          country_historical: "Land Historische Daten",
          language_historical: "Sprache Historische Daten",
          campaign_stage_historical: "Kampagnenstufe Historische Daten",
          campaign_performance: "Kampagnen-Performance",
          source_performance: "Quellen-Performance",
          website_leads: "Website Leads",
          social_media_leads: "Social Media Leads",
          email_campaign_leads: "E-Mail-Kampagnen Leads",
          referral_leads: "Empfehlungs-Leads",
          csv_import_leads: "CSV-Import Leads",
          api_leads: "API Leads",
          new_status_leads: "Neue Status Leads",
          pending_leads: "Ausstehende Leads",
          contacted_leads: "Kontaktierte Leads",
          engaged_leads: "Engagierte Leads",
          german_leads: "Deutsche Leads",
          polish_leads: "Polnische Leads",
          global_leads: "Globale Leads",
          german_language_leads: "Deutschsprachige Leads",
          english_language_leads: "Englischsprachige Leads",
          polish_language_leads: "Polnischsprachige Leads",
          not_started_leads: "Nicht Gestartete Leads",
          initial_stage_leads: "Anfangsstufe Leads",
          followup_1_leads: "Nachfass 1 Leads",
          followup_2_leads: "Nachfass 2 Leads",
          followup_3_leads: "Nachfass 3 Leads",
          nurture_leads: "Pflege Leads",
          reactivation_leads: "Reaktivierungs-Leads",
          personal_approach_leads: "Persönlicher Ansatz Leads",
          results_focused_leads: "Ergebnisorientierte Leads",
          personal_results_leads: "Persönliche Ergebnisse Leads",
          high_engagement_leads: "Hohe Engagement Leads",
          medium_engagement_leads: "Mittlere Engagement Leads",
          low_engagement_leads: "Niedrige Engagement Leads",
          no_engagement_leads: "Keine Engagement Leads",
          journey_variant_historical: "Journey-Variante Historische Daten",
          engagement_level_historical: "Engagement-Level Historische Daten",
          conversion_funnel_historical: "Conversion-Funnel Historische Daten",
        },
        sources: {
          website: "Website",
          social_media: "Soziale Medien",
          email_campaign: "E-Mail-Kampagne",
          referral: "Empfehlung",
          csv_import: "CSV-Import",
          api: "API",
          unknown: "Unbekannt",
          legend: {
            title: "Quellen-Legende",
            visible: "sichtbar",
            leads: "{{count}} Lead_one ({{percentage}}%)",
            leads_one: "{{count}} Lead ({{percentage}}%)",
            leads_other: "{{count}} Leads ({{percentage}}%)",
            summary:
              "{{visible}} von {{total}} Quellen sichtbar ({{percentage}}%)",
          },
        },
      },
      status: {
        new: "Neu",
        pending: "Ausstehend",
        campaign_running: "Kampagne läuft",
        website_user: "Website-Nutzer",
        in_contact: "In Kontakt",
        newsletter_subscriber: "Newsletter-Abonnent",
        signed_up: "Angemeldet",
        consultation_booked: "Beratung gebucht",
        subscription_confirmed: "Abonnement bestätigt",
        unsubscribed: "Abgemeldet",
        bounced: "Abgesprungen",
        invalid: "Ungültig",
        unknown: "Unbekannt",
      },
      table: {
        title: "Leads",
        total: "Gesamt Leads",
        email: "E-Mail",
        business: "Unternehmen",
        status: "Status",
        stage: "Kampagnen-Phase",
        campaign_stage: "Kampagnen-Phase",
        country: "Land",
        language: "Sprache",
        phone: "Telefon",
        website: "Website",
        emails: "E-Mails",
        emails_sent: "E-Mails Gesendet",
        emails_opened: "E-Mails Geöffnet",
        emails_clicked: "E-Mails Geklickt",
        last_engagement: "Letztes Engagement",
        last_email_sent: "Letzte E-Mail Gesendet",
        created: "Erstellt",
        updated: "Aktualisiert",
        source: "Quelle",
        notes: "Notizen",
        actions: "Aktionen",
        scroll_hint:
          "💡 Horizontal scrollen, um alle Lead-Details und Spalten zu sehen",
        select_all: "Alle Leads auswählen",
        select_lead: "{{business}} auswählen",
        description: {
          recent: "Kürzlich zu Ihrer Datenbank hinzugefügte Leads",
          complete: "Vollständige Liste der Leads mit Verwaltungsaktionen",
          overview: "Die zuletzt hinzugefügten Leads zu Ihrer Datenbank",
        },
      },
      tabs: {
        overview: "Übersicht",
        leads: "Leads",
        leads_description: "Leads verwalten und anzeigen",
        campaigns: "Kampagnen",
        campaigns_description: "E-Mail-Kampagnen und Automatisierung verwalten",
        stats: "Statistiken",
        stats_description: "Lead-Statistiken und Analysen anzeigen",
        emails: "E-Mail-Vorschauen",
        emails_description: "E-Mail-Vorlagen anzeigen und verwalten",
        abTesting: "A/B-Tests",
        abTesting_description:
          "A/B-Tests für E-Mail-Kampagnen konfigurieren und überwachen",
        campaignStarter: "Kampagnen-Starter",
        campaignStarter_description:
          "Kampagnen-Starter-Einstellungen konfigurieren",
      },
    },
    campaign: {
      title: "E-Mail-Kampagnensystem",
      description: "Verwalten Sie Ihre E-Mail-Kampagnen",
      starter: {
        title: "Starter-Kampagne",
        description: "Beginnen Sie mit einer einfachen Kampagne",
        schedule: "Täglich um 9:00 Uhr",
      },
      emails: {
        title: "E-Mail-Kampagne",
        description: "Senden Sie personalisierte E-Mails",
        schedule: "Täglich um 10:00 Uhr",
      },
      cleanup: {
        title: "Bereinigung",
        description: "Bereinigen Sie alte Kampagnen",
        schedule: "Wöchentlich am Sonntag",
      },
      info: "Die Kampagnenverwaltung wird automatisch vom Cron-System durchgeführt. Besuchen Sie die Cron-Admin-Seite für detaillierte Überwachung.",
    },
    constants: {
      unknown: "unbekannt",
      defaultLanguage: "de",
      validationError: "Validierungsfehler",
    },
    csvImport: {
      exampleData: {
        row1: "john@example.com,Example Corp,John Doe,+1234567890,https://example.com,DE,en,website,Interessiert an Premium-Features",
        row2: "jane@company.com,Company Inc,Jane Smith,+0987654321,https://company.com,PL,en,referral,Sucht nach Social Media Automatisierung",
      },
    },
    edit: {
      form: {
        actions: {
          back: "Zurück",
          save: "Speichern",
          saving: "Speichern...",
          cancel: "Abbrechen",
        },
        additionalInfo: {
          title: "Zusätzliche Informationen",
          description: "Quelle und Notizen",
        },
        businessInfo: {
          title: "Geschäftsinformationen",
          description: "Grundlegende Geschäftsdetails",
        },
        contactInfo: {
          title: "Kontaktinformationen",
          description: "Kontaktdaten und Kommunikationspräferenzen",
        },
        fields: {
          id: {
            label: "ID",
            description: "Eindeutige Kennung für den Lead",
          },
          businessName: {
            label: "Firmenname",
            placeholder: "Firmenname eingeben",
          },
          contactName: {
            label: "Kontaktname",
            placeholder: "Name der Kontaktperson eingeben",
          },
          email: {
            label: "E-Mail-Adresse",
            placeholder: "E-Mail-Adresse eingeben",
          },
          phone: {
            label: "Telefonnummer",
            placeholder: "Telefonnummer eingeben",
          },
          website: {
            label: "Website",
            placeholder: "Website-URL eingeben",
          },
          country: {
            label: "Land",
            placeholder: "Land auswählen",
          },
          language: {
            label: "Sprache",
            placeholder: "Sprache auswählen",
          },
          status: {
            label: "Status",
            description: "Aktueller Status des Leads",
            placeholder: "Status auswählen",
            options: {
              new: "Neu",
              pending: "Ausstehend",
              campaign_running: "Kampagne läuft",
              website_user: "Website-Nutzer",
              newsletter_subscriber: "Newsletter-Abonnent",
              in_contact: "In Kontakt",
              signed_up: "Angemeldet",
              consultation_booked: "Beratung gebucht",
              subscription_confirmed: "Abonnement bestätigt",
              unsubscribed: "Abgemeldet",
              bounced: "Abgesprungen",
              invalid: "Ungültig",
            },
          },
          currentCampaignStage: {
            label: "Kampagnenstufe",
            description: "Aktuelle Stufe in der E-Mail-Kampagne",
            placeholder: "Kampagnenstufe auswählen",
            options: {
              not_started: "Nicht gestartet",
              initial: "Initial",
              followup_1: "Nachfass 1",
              followup_2: "Nachfass 2",
              followup_3: "Nachfass 3",
              nurture: "Pflege",
              reactivation: "Reaktivierung",
            },
          },
          source: {
            label: "Quelle",
            placeholder: "Lead-Quelle eingeben",
          },
          notes: {
            label: "Notizen",
            description: "Zusätzliche Notizen über den Lead",
            placeholder: "Zusätzliche Notizen eingeben",
          },
          metadata: {
            label: "Metadaten",
            description: "Zusätzliche Metadaten als JSON",
            placeholder: "Metadaten als JSON eingeben",
          },
          convertedUserId: {
            label: "Konvertierter Benutzer",
            placeholder:
              "Wählen Sie einen Benutzer aus, zu dem dieser Lead konvertiert wurde...",
            searchPlaceholder: "Benutzer suchen...",
            searchHint: "Geben Sie mindestens 2 Zeichen ein, um zu suchen",
            noResults: "Keine Benutzer gefunden",
            selectedUser: "{{firstName}} {{lastName}} ({{email}})",
          },
        },
        locationStatus: {
          title: "Standort & Status",
          description: "Geografischer Standort und Lead-Status",
        },
      },
      success: {
        title: "Lead erfolgreich aktualisiert",
        description: "Der Lead wurde erfolgreich aktualisiert.",
      },
    },
    emails: {
      tagline: "Ihre Social Media Management Plattform",
      initial: {
        subject: "Transformieren Sie {{businessName}}'s Social Media Präsenz",
        greeting: "Hallo,",
        intro:
          "Ich habe {{businessName}} bemerkt und dachte, Sie könnten interessiert sein, wie wir Unternehmen wie Ihres dabei helfen, ihre Social Media Präsenz um 300% oder mehr zu steigern.",
        value_proposition:
          "Unsere Plattform automatisiert Ihr Social Media Management und behält dabei authentisches Engagement mit Ihrer Zielgruppe bei.",
        benefit_1: "Automatisierte Content-Planung über alle Plattformen",
        benefit_2: "KI-gestütztes Engagement und Response Management",
        benefit_3: "Detaillierte Analysen und Wachstums-Insights",
        cta: "Sehen Sie, wie es funktioniert",
        closing:
          "Würde Ihnen gerne zeigen, wie das für Ihr Unternehmen funktionieren könnte. Keine Verpflichtung erforderlich.",
      },
      followup1: {
        subject:
          "{{businessName}}: Sehen Sie, wie andere 300% mit unserer Plattform gewachsen sind",
        greeting: "Hallo,",
        intro:
          "Ich wollte mich bezüglich meiner vorherigen E-Mail über die Hilfe für {{businessName}} beim Wachstum der Social Media Präsenz melden.",
        case_study_title: "Echte Ergebnisse von ähnlichen Unternehmen",
        case_study_content:
          "Erst letzten Monat steigerte ein Unternehmen ähnlich Ihrem sein Social Media Engagement um 340% und generierte 50+ neue Leads direkt aus Social Media mit unserer Plattform.",
        social_proof:
          "Über 1.000+ Unternehmen vertrauen uns bei der Verwaltung ihres Social Media Wachstums.",
        cta: "Fallstudien ansehen",
        closing:
          "Ich würde Ihnen gerne genau zeigen, wie wir diese Ergebnisse erzielt haben und wie es für Ihr Unternehmen funktionieren könnte.",
      },
      signature: {
        best_regards: "Mit freundlichen Grüßen,",
        team: "Das {{companyName}} Team",
      },
      footer: {
        unsubscribe_text: "Möchten Sie diese E-Mails nicht mehr erhalten?",
        unsubscribe_link: "Hier abmelden",
      },
    },
    engagement: {
      types: {
        email_open: "E-Mail geöffnet",
        email_click: "E-Mail geklickt",
        website_visit: "Website-Besuch",
        form_submit: "Formular abgesendet",
      },
    },
    errors: {
      create: {
        conflict: {
          title: "Lead existiert bereits",
          description:
            "Ein Lead mit dieser E-Mail-Adresse existiert bereits im System.",
        },
        validation: {
          title: "Ungültige Lead-Daten",
          description:
            "Bitte überprüfen Sie die Lead-Informationen und versuchen Sie es erneut.",
        },
      },
      get: {
        notFound: {
          title: "Lead nicht gefunden",
          description: "Der angeforderte Lead konnte nicht gefunden werden.",
        },
      },
      update: {
        notFound: {
          title: "Lead nicht gefunden",
          description:
            "Der Lead, den Sie zu aktualisieren versuchen, konnte nicht gefunden werden.",
        },
        validation: {
          title: "Ungültige Update-Daten",
          description:
            "Bitte überprüfen Sie die Update-Informationen und versuchen Sie es erneut.",
        },
      },
      import: {
        badRequest: {
          title: "Ungültige CSV-Datei",
          description: "Das CSV-Dateiformat ist ungültig oder leer.",
        },
        validation: {
          title: "CSV-Validierungsfehler",
          description:
            "Einige Zeilen in der CSV-Datei enthalten ungültige Daten.",
        },
      },
    },
    export: {
      headers: {
        email: "E-Mail",
        businessName: "Firmenname",
        contactName: "Kontaktname",
        phone: "Telefon",
        website: "Website",
        country: "Land",
        language: "Sprache",
        status: "Status",
        source: "Quelle",
        notes: "Notizen",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        emailsSent: "E-Mails gesendet",
        emailsOpened: "E-Mails geöffnet",
        emailsClicked: "E-Mails geklickt",
        lastEmailSent: "Letzte E-Mail gesendet",
        lastEngagement: "Letztes Engagement",
        unsubscribedAt: "Abgemeldet am",
        metadata: "Metadaten",
      },
      fileName: {
        prefix: "leads_export_",
        suffix: {
          csv: ".csv",
          excel: ".xlsx",
        },
      },
    },
    filter: {
      status: "Nach Status filtern",
      campaign_stage: "Nach Kampagnen-Phase filtern",
      country: "Nach Land filtern",
      language: "Nach Sprache filtern",
      source: "Nach Quelle filtern",
      all_statuses: "Alle Status",
      all_countries: "Alle Länder",
      all_languages: "Alle Sprachen",
      all_sources: "Alle Quellen",
      sort: "Sortieren nach",
      page_size: "Seitengröße",
      countries: {
        global: "Global",
        de: "Deutschland",
        pl: "Polen",
      },
      languages: {
        en: "Englisch",
        de: "Deutsch",
        pl: "Polnisch",
      },
      sources: {
        website: "Website",
        social_media: "Social Media",
        email_campaign: "E-Mail-Kampagne",
        referral: "Empfehlung",
        csv_import: "CSV-Import",
        api: "API",
      },
      quick_filters: "Schnellfilter",
      quick: {
        new_leads: "Neue Leads",
        campaign_running: "Kampagne läuft",
        not_started: "Nicht Gestartet",
        imported: "Importiert",
      },
    },
    import: {
      validation: {
        missingFields: "Erforderliche Felder fehlen",
        invalidEmail: "Ungültige E-Mail-Adresse",
        invalidData: "Ungültiges Datenformat",
        failed: "Validierung fehlgeschlagen",
      },
      defaults: {
        language: "de",
        source: "csv_import",
      },
    },
    list: {
      title: "Leads-Liste",
      titleWithCount: "Leads-Liste ({{count}})",
      description:
        "Durchsuchen und verwalten Sie alle Leads mit erweiterten Filter- und Sortieroptionen",
      loading: "Laden...",
      no_results: "Keine Leads gefunden, die Ihren Kriterien entsprechen",
      noResults: "Keine Leads gefunden, die Ihren Kriterien entsprechen",
      results: {
        showing: "Zeige {{start}}-{{end}} von {{total}} Leads",
      },
      table: {
        title: "Alle Leads",
        campaign_stage: "Kampagnen-Phase",
        contact: "Kontakt",
      },
      filters: {
        title: "Filter",
      },
    },
    pagination: {
      page_size: "Seitengröße",
      page_info: "Seite {{current}} von {{total}}",
      page_info_with_count:
        "Seite {{current}} von {{total}} ({{count}} gesamt)",
      first: "Erste",
      previous: "Vorherige",
      next: "Nächste",
      last: "Letzte",
    },
    search: {
      placeholder: "Leads suchen...",
      error: {
        validation: {
          title: "Validierungsfehler",
          description:
            "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.",
        },
        unauthorized: {
          title: "Unbefugter Zugriff",
          description: "Sie haben keine Berechtigung für diese Aktion.",
        },
        server: {
          title: "Serverfehler",
          description:
            "Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten.",
        },
      },
      success: {
        title: "Suche erfolgreich",
        description: "Leads erfolgreich gefunden.",
      },
    },
    sort: {
      placeholder: "Sortieren nach",
      field: "Sortierfeld",
      order: "Sortierreihenfolge",
      created: "Erstellungsdatum",
      updated: "Aktualisierungsdatum",
      email: "E-Mail",
      business: "Unternehmen",
      last_engagement: "Letztes Engagement",
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    sorting: {
      fields: {
        email: "E-Mail",
        businessName: "Firmenname",
        updatedAt: "Aktualisiert am",
        lastEngagementAt: "Letztes Engagement",
        createdAt: "Erstellt am",
      },
    },
    success: {
      create: {
        title: "Lead erstellt",
        description: "Der Lead wurde erfolgreich zum System hinzugefügt.",
      },
      update: {
        title: "Lead aktualisiert",
        description: "Die Lead-Informationen wurden erfolgreich aktualisiert.",
      },
      import: {
        title: "Import abgeschlossen",
        description: "Der CSV-Import wurde erfolgreich abgeschlossen.",
      },
      unsubscribe: {
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich von unseren E-Mails abgemeldet.",
      },
    },
    tracking: {
      errors: {
        missingId: "Lead-ID ist für das Tracking erforderlich",
        invalidIdFormat: "Lead-ID muss ein gültiges UUID-Format haben",
        invalidCampaignIdFormat:
          "Kampagnen-ID muss ein gültiges UUID-Format haben",
        invalidUrl: "Ungültiges URL-Format angegeben",
      },
    },
    unsubscribe: {
      title: "Von E-Mails abmelden",
      description:
        "Es tut uns leid, Sie gehen zu sehen. Sie können sich unten von unseren E-Mails abmelden. Dies entfernt Sie von allen Lead-Kommunikationen und Marketing-E-Mails.",
      success: "Sie wurden erfolgreich abgemeldet.",
      error: "Es gab einen Fehler bei der Bearbeitung Ihrer Abmeldeanfrage.",
      button: "Abmelden",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        success: {
          title: "Batch-Update erfolgreich",
          description: "Leads wurden erfolgreich aktualisiert",
        },
        error: {
          server: {
            title: "Batch-Update fehlgeschlagen",
            description:
              "Leads konnten aufgrund eines Serverfehlers nicht aktualisiert werden",
          },
          validation: {
            title: "Validierung fehlgeschlagen",
            description:
              "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Sie haben keine Berechtigung für Batch-Updates",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff auf Batch-Updates ist verboten",
          },
          not_found: {
            title: "Nicht gefunden",
            description: "Die angeforderte Ressource wurde nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description:
              "Ein unerwarteter Fehler ist beim Batch-Update aufgetreten",
          },
        },
        validation: {
          no_fields: "Mindestens ein Update-Feld muss angegeben werden",
        },
      },
    },
    campaigns: {
      common: {
        error: {
          validation: {
            title: "Kampagnen-Validierung fehlgeschlagen",
            description:
              "Bitte überprüfen Sie Ihre Kampagnendaten und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Kampagnen-Zugriff verweigert",
            description:
              "Sie haben keine Berechtigung zum Zugriff auf Kampagnen",
          },
          server: {
            title: "Kampagnen-Serverfehler",
            description:
              "Kampagne kann aufgrund eines Serverfehlers nicht verarbeitet werden",
          },
          unknown: {
            title: "Kampagnen-Operation fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler ist während der Kampagnen-Operation aufgetreten",
          },
          forbidden: {
            title: "Kampagnen-Zugriff verboten",
            description:
              "Sie haben keine Berechtigung für diese Kampagnen-Operation",
          },
          notFound: {
            title: "Kampagne nicht gefunden",
            description:
              "Die angeforderte Kampagne konnte nicht gefunden werden",
          },
        },
      },
      delete: {
        success: {
          title: "Kampagne gelöscht",
          description: "Kampagne erfolgreich gelöscht",
        },
      },
      get: {
        success: {
          title: "Kampagnen-Statistiken geladen",
          description: "Kampagnen-Statistiken erfolgreich abgerufen",
        },
      },
      manage: {
        error: {
          validation: {
            title: "Kampagnen-Verwaltung-Validierung fehlgeschlagen",
            description:
              "Bitte überprüfen Sie Ihre Kampagnendaten und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Kampagnen-Verwaltung-Zugriff verweigert",
            description: "Sie haben keine Berechtigung, Kampagnen zu verwalten",
          },
          server: {
            title: "Kampagnen-Verwaltung-Serverfehler",
            description:
              "Kampagne kann aufgrund eines Serverfehlers nicht verwaltet werden",
          },
          unknown: {
            title: "Kampagnen-Verwaltung-Operation fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler ist während der Kampagnen-Verwaltung aufgetreten",
          },
          forbidden: {
            title: "Kampagnen-Verwaltung-Zugriff verboten",
            description: "Sie haben keine Berechtigung, Kampagnen zu verwalten",
          },
          notFound: {
            title: "Kampagne nicht gefunden",
            description:
              "Die angeforderte Kampagne konnte nicht gefunden werden",
          },
          campaignActive:
            "Aktive Kampagne kann nicht gelöscht werden. Bitte deaktivieren Sie sie zuerst.",
        },
        post: {
          success: {
            title: "Kampagne erstellt",
            description: "Kampagne erfolgreich erstellt",
          },
        },
        put: {
          success: {
            title: "Kampagne aktualisiert",
            description: "Kampagnen-Status erfolgreich aktualisiert",
          },
        },
        delete: {
          success: {
            title: "Kampagne gelöscht",
            description: "Kampagne erfolgreich gelöscht",
          },
        },
      },
      post: {
        success: {
          title: "Kampagne erstellt",
          description: "Kampagne erfolgreich erstellt",
        },
      },
      put: {
        success: {
          title: "Kampagne aktualisiert",
          description: "Kampagnen-Status erfolgreich aktualisiert",
        },
      },
      stats: {
        error: {
          validation: {
            title: "Kampagnen-Statistik-Validierung fehlgeschlagen",
            description:
              "Bitte überprüfen Sie Ihre Statistikparameter und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Kampagnen-Statistik-Zugriff verweigert",
            description:
              "Sie haben keine Berechtigung, Kampagnen-Statistiken anzuzeigen",
          },
          server: {
            title: "Kampagnen-Statistik-Serverfehler",
            description:
              "Statistiken können aufgrund eines Serverfehlers nicht abgerufen werden",
          },
          unknown: {
            title: "Kampagnen-Statistik-Operation fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler ist beim Abrufen der Statistiken aufgetreten",
          },
          forbidden: {
            title: "Kampagnen-Statistik-Zugriff verboten",
            description:
              "Sie haben keine Berechtigung, Kampagnen-Statistiken anzuzeigen",
          },
          notFound: {
            title: "Kampagnen-Statistiken nicht gefunden",
            description:
              "Die angeforderten Kampagnen-Statistiken konnten nicht gefunden werden",
          },
        },
        success: {
          title: "Kampagnen-Statistiken geladen",
          description: "Kampagnen-Statistiken erfolgreich abgerufen",
        },
      },
    },
    constants: {
      defaultSource: "csv_import",
      validationError: "Validierungsfehler",
      trackingMethod: "click_implied",
    },
    leads: {
      get: {
        error: {
          validation: {
            title: "Lead-Datenvalidierung fehlgeschlagen",
            description: "Lead-Datenanfrage konnte nicht validiert werden",
          },
          unauthorized: {
            title: "Lead-Datenzugriff verweigert",
            description:
              "Sie haben keine Berechtigung für den Zugriff auf Lead-Daten",
          },
          server: {
            title: "Lead-Daten Serverfehler",
            description:
              "Lead-Daten konnten aufgrund eines Serverfehlers nicht geladen werden",
          },
          unknown: {
            title: "Lead-Datenzugriff fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler beim Laden der Lead-Daten ist aufgetreten",
          },
          not_found: {
            title: "Lead nicht gefunden",
            description: "Der angeforderte Lead konnte nicht gefunden werden",
          },
          forbidden: {
            title: "Lead-Zugriff verboten",
            description: "Sie haben keine Berechtigung, diesen Lead anzuzeigen",
          },
          network: {
            title: "Netzwerkfehler",
            description:
              "Lead-Daten konnten aufgrund eines Netzwerkfehlers nicht geladen werden",
          },
          unsaved_changes: {
            title: "Nicht gespeicherte Änderungen",
            description:
              "Sie haben nicht gespeicherte Änderungen, die verloren gehen werden",
          },
          conflict: {
            title: "Datenkonflikt",
            description:
              "Die Lead-Daten wurden von einem anderen Benutzer geändert",
          },
        },
        success: {
          title: "Lead-Daten geladen",
          description: "Lead-Informationen erfolgreich abgerufen",
        },
      },
      patch: {
        error: {
          validation: {
            title: "Lead-Update-Validierung fehlgeschlagen",
            description:
              "Bitte überprüfen Sie Ihre Lead-Updates und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Lead-Update nicht autorisiert",
            description: "Sie haben keine Berechtigung, Leads zu aktualisieren",
          },
          server: {
            title: "Lead-Update Serverfehler",
            description:
              "Lead konnte aufgrund eines Serverfehlers nicht aktualisiert werden",
          },
          unknown: {
            title: "Lead-Update fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler beim Aktualisieren des Leads ist aufgetreten",
          },
          not_found: {
            title: "Lead nicht gefunden",
            description:
              "Der zu aktualisierende Lead konnte nicht gefunden werden",
          },
          forbidden: {
            title: "Lead-Update verboten",
            description:
              "Sie haben keine Berechtigung, diesen Lead zu aktualisieren",
          },
          network: {
            title: "Netzwerkfehler",
            description:
              "Lead konnte aufgrund eines Netzwerkfehlers nicht aktualisiert werden",
          },
          unsaved_changes: {
            title: "Nicht gespeicherte Änderungen",
            description:
              "Sie haben nicht gespeicherte Änderungen, die verloren gehen werden",
          },
          conflict: {
            title: "Datenkonflikt",
            description:
              "Die Lead-Daten wurden von einem anderen Benutzer geändert",
          },
        },
        success: {
          title: "Lead aktualisiert",
          description: "Lead-Informationen erfolgreich aktualisiert",
        },
      },
      post: {
        error: {
          validation: {
            title: "Lead-Erstellung Validierung fehlgeschlagen",
            description:
              "Bitte überprüfen Sie Ihre Lead-Informationen und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Lead-Erstellung nicht autorisiert",
            description: "Sie haben keine Berechtigung, Leads zu erstellen",
          },
          server: {
            title: "Lead-Erstellung Serverfehler",
            description:
              "Lead konnte aufgrund eines Serverfehlers nicht erstellt werden",
          },
          unknown: {
            title: "Lead-Erstellung fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler beim Erstellen des Leads ist aufgetreten",
          },
          forbidden: {
            title: "Lead-Erstellung verboten",
            description: "Sie haben keine Berechtigung, Leads zu erstellen",
          },
          duplicate: {
            title: "Lead bereits vorhanden",
            description:
              "Ein Lead mit dieser E-Mail-Adresse existiert bereits im System",
          },
          conflict: {
            title: "Lead bereits vorhanden",
            description:
              "Ein Lead mit dieser E-Mail-Adresse existiert bereits im System",
          },
        },
        success: {
          title: "Lead erstellt",
          description: "Lead erfolgreich erstellt",
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "Lead-Engagement-Validierung fehlgeschlagen",
            description:
              "Bitte überprüfen Sie Ihre Engagement-Daten und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Lead-Engagement nicht autorisiert",
            description:
              "Sie haben keine Berechtigung, Lead-Engagement zu erfassen",
          },
          server: {
            title: "Lead-Engagement Serverfehler",
            description:
              "Lead-Engagement konnte aufgrund eines Serverfehlers nicht erfasst werden",
          },
          unknown: {
            title: "Lead-Engagement fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler beim Erfassen des Lead-Engagements ist aufgetreten",
          },
          forbidden: {
            title: "Lead-Engagement verboten",
            description:
              "Sie haben keine Berechtigung, Lead-Engagement zu erfassen",
          },
        },
        success: {
          title: "Lead-Engagement erfasst",
          description: "Lead-Engagement erfolgreich erfasst",
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          validation: {
            title: "Lead-Export-Validierung fehlgeschlagen",
            description:
              "Bitte überprüfen Sie Ihre Export-Parameter und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Lead-Export nicht autorisiert",
            description:
              "Sie haben keine Berechtigung zum Exportieren von Leads",
          },
          server: {
            title: "Lead-Export-Serverfehler",
            description:
              "Leads können aufgrund eines Serverfehlers nicht exportiert werden",
          },
          unknown: {
            title: "Lead-Export fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler ist beim Exportieren von Leads aufgetreten",
          },
        },
        success: {
          title: "Leads exportiert",
          description: "Leads erfolgreich exportiert",
        },
      },
    },
    leadsImport: {
      delete: {
        success: {
          title: "Import-Job gelöscht",
          description: "Import-Job wurde erfolgreich gelöscht",
        },
        error: {
          unauthorized: {
            title: "Löschen des Import-Jobs nicht autorisiert",
            description: "Sie haben keine Berechtigung, Import-Jobs zu löschen",
          },
          forbidden: {
            title: "Löschen des Import-Jobs verboten",
            description:
              "Sie haben keine Berechtigung, diesen Import-Job zu löschen",
          },
          not_found: {
            title: "Import-Job nicht gefunden",
            description: "Der Import-Job konnte nicht gefunden werden",
          },
          server: {
            title: "Server-Fehler beim Löschen des Import-Jobs",
            description:
              "Import-Job konnte aufgrund eines Server-Fehlers nicht gelöscht werden",
          },
        },
      },
      get: {
        success: {
          title: "Import-Aufträge erfolgreich abgerufen",
          description: "Import-Auftragsliste geladen",
        },
        error: {
          validation: {
            title: "Ungültige Import-Auftragsanfrage",
            description: "Bitte überprüfen Sie Ihre Anfrageparameter",
          },
          unauthorized: {
            title: "Import-Aufträge-Zugriff nicht autorisiert",
            description:
              "Sie haben keine Berechtigung, Import-Aufträge anzuzeigen",
          },
          server: {
            title: "Import-Aufträge Serverfehler",
            description:
              "Import-Aufträge konnten aufgrund eines Serverfehlers nicht abgerufen werden",
          },
          unknown: {
            title: "Import-Aufträge-Abruf fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler beim Abrufen der Import-Aufträge ist aufgetreten",
          },
        },
      },
      patch: {
        success: {
          title: "Import-Auftrag erfolgreich aktualisiert",
          description: "Auftragseinstellungen wurden aktualisiert",
        },
        error: {
          validation: {
            title: "Ungültige Auftragsaktualisierungsanfrage",
            description: "Bitte überprüfen Sie Ihre Aktualisierungsparameter",
          },
          unauthorized: {
            title: "Auftragsaktualisierung nicht autorisiert",
            description:
              "Sie haben keine Berechtigung, diesen Auftrag zu aktualisieren",
          },
          forbidden: {
            title: "Auftragsaktualisierung verboten",
            description:
              "Sie haben keine Berechtigung, diesen Import-Auftrag zu aktualisieren",
          },
          not_found: {
            title: "Import-Auftrag nicht gefunden",
            description: "Der Import-Auftrag konnte nicht gefunden werden",
          },
          server: {
            title: "Auftragsaktualisierung Serverfehler",
            description:
              "Auftrag konnte aufgrund eines Serverfehlers nicht aktualisiert werden",
          },
          unknown: {
            title: "Auftragsaktualisierung fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler beim Aktualisieren des Auftrags ist aufgetreten",
          },
        },
      },
      post: {
        success: {
          title: "Import-Auftragsaktion abgeschlossen",
          description: "Die angeforderte Aktion wurde ausgeführt",
          job_stopped: "Auftrag erfolgreich gestoppt",
          job_queued_retry: "Auftrag für Wiederholung eingereiht",
          job_deleted: "Auftrag erfolgreich gelöscht",
        },
        error: {
          validation: {
            title: "Lead-Import-Validierung fehlgeschlagen",
            description:
              "Bitte überprüfen Sie Ihre CSV-Datei und versuchen Sie es erneut",
            failed: "CSV-Zeilen-Validierung fehlgeschlagen",
            invalidData: "Ungültige Daten in CSV-Zeile",
            missingFields: "Erforderliche Felder fehlen",
            invalidEmail: "Ungültige E-Mail-Adresse in CSV-Zeile",
            email_required: "E-Mail ist erforderlich",
            invalid_email_format: "Ungültiges E-Mail-Format",
          },
          unauthorized: {
            title: "Lead-Import nicht autorisiert",
            description: "Sie haben keine Berechtigung, Leads zu importieren",
          },
          server: {
            title: "Lead-Import Serverfehler",
            description:
              "Leads konnten aufgrund eines Serverfehlers nicht importiert werden",
          },
          unknown: {
            title: "Lead-Import fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler beim Importieren der Leads ist aufgetreten",
          },
          forbidden: {
            title: "Lead-Import verboten",
            description: "Sie haben keine Berechtigung, Leads zu importieren",
          },
          not_found: {
            title: "Import-Auftrag nicht gefunden",
            description:
              "Der angeforderte Import-Auftrag konnte nicht gefunden werden",
          },
          stopped_by_user: "Vom Benutzer gestoppt",
        },
      },
      retry: {
        success: {
          title: "Import-Job wiederholt",
          description:
            "Import-Job wurde zur Wiederholung in die Warteschlange eingereiht",
        },
        error: {
          unauthorized: {
            title: "Wiederholung des Import-Jobs nicht autorisiert",
            description:
              "Sie haben keine Berechtigung, Import-Jobs zu wiederholen",
          },
          forbidden: {
            title: "Wiederholung des Import-Jobs verboten",
            description:
              "Sie haben keine Berechtigung, diesen Import-Job zu wiederholen",
          },
          not_found: {
            title: "Import-Job nicht gefunden",
            description: "Der Import-Job konnte nicht gefunden werden",
          },
          validation: {
            title: "Import-Job kann nicht wiederholt werden",
            description:
              "Dieser Import-Job kann in seinem aktuellen Zustand nicht wiederholt werden",
          },
          server: {
            title: "Server-Fehler bei der Wiederholung des Import-Jobs",
            description:
              "Import-Job konnte aufgrund eines Server-Fehlers nicht wiederholt werden",
          },
        },
      },
      stop: {
        success: {
          title: "Import-Job gestoppt",
          description: "Import-Job wurde erfolgreich gestoppt",
        },
        error: {
          unauthorized: {
            title: "Stoppen des Import-Jobs nicht autorisiert",
            description: "Sie haben keine Berechtigung, Import-Jobs zu stoppen",
          },
          forbidden: {
            title: "Stoppen des Import-Jobs verboten",
            description:
              "Sie haben keine Berechtigung, diesen Import-Job zu stoppen",
          },
          not_found: {
            title: "Import-Job nicht gefunden",
            description: "Der Import-Job konnte nicht gefunden werden",
          },
          validation: {
            title: "Import-Job kann nicht gestoppt werden",
            description:
              "Dieser Import-Job kann in seinem aktuellen Zustand nicht gestoppt werden",
          },
          server: {
            title: "Server-Fehler beim Stoppen des Import-Jobs",
            description:
              "Import-Job konnte aufgrund eines Server-Fehlers nicht gestoppt werden",
          },
        },
      },
    },
    leadsStats: {
      get: {
        error: {
          validation: {
            title: "Lead-Statistik-Validierung fehlgeschlagen",
            description: "Lead-Statistik-Anfrage konnte nicht validiert werden",
          },
          unauthorized: {
            title: "Lead-Statistik-Zugriff verweigert",
            description:
              "Sie haben keine Berechtigung für den Zugriff auf Lead-Statistiken",
          },
          server: {
            title: "Lead-Statistik Serverfehler",
            description:
              "Lead-Statistiken konnten aufgrund eines Serverfehlers nicht geladen werden",
          },
          unknown: {
            title: "Lead-Statistik-Zugriff fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler beim Laden der Lead-Statistiken ist aufgetreten",
          },
          forbidden: {
            title: "Lead-Statistik-Zugriff verboten",
            description:
              "Sie haben keine Berechtigung, auf Lead-Statistiken zuzugreifen",
          },
        },
        success: {
          title: "Lead-Statistiken geladen",
          description: "Lead-Statistiken erfolgreich abgerufen",
        },
      },
    },
    leadsTracking: {
      get: {
        error: {
          validation: {
            title: "Lead-Tracking-Validierung fehlgeschlagen",
            description:
              "Bitte überprüfen Sie Ihre Tracking-Parameter und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Lead-Tracking nicht autorisiert",
            description:
              "Sie haben keine Berechtigung für den Zugriff auf Lead-Tracking",
          },
          server: {
            title: "Lead-Tracking-Serverfehler",
            description:
              "Tracking kann aufgrund eines Serverfehlers nicht verarbeitet werden",
          },
          unknown: {
            title: "Lead-Tracking fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler ist beim Lead-Tracking aufgetreten",
          },
          forbidden: {
            title: "Lead-Tracking-Zugriff verboten",
            description:
              "Sie haben keine Berechtigung für den Zugriff auf Lead-Tracking",
          },
          not_found: {
            title: "Lead nicht gefunden",
            description:
              "Der angeforderte Lead konnte für das Tracking nicht gefunden werden",
          },
        },
        success: {
          title: "Lead-Tracking erfolgreich",
          description: "Lead-Tracking erfolgreich aufgezeichnet",
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        error: {
          validation: {
            title: "Lead-Abmeldung-Validierung fehlgeschlagen",
            description:
              "Bitte überprüfen Sie Ihre Abmeldeanfrage und versuchen Sie es erneut",
          },
          unauthorized: {
            title: "Lead-Abmeldung nicht autorisiert",
            description: "Sie haben keine Berechtigung, Leads abzumelden",
          },
          server: {
            title: "Lead-Abmeldung Serverfehler",
            description:
              "Lead konnte aufgrund eines Serverfehlers nicht abgemeldet werden",
          },
          unknown: {
            title: "Lead-Abmeldung fehlgeschlagen",
            description:
              "Ein unerwarteter Fehler bei der Lead-Abmeldung ist aufgetreten",
          },
          forbidden: {
            title: "Lead-Abmeldung verboten",
            description: "Sie haben keine Berechtigung, Leads abzumelden",
          },
        },
        success: {
          title: "Lead abgemeldet",
          description: "Lead erfolgreich abgemeldet",
        },
      },
    },
    testEmail: {
      error: {
        validation: {
          title: "Test-E-Mail-Validierung fehlgeschlagen",
          description:
            "Überprüfen Sie Ihre Test-E-Mail-Daten und versuchen Sie es erneut",
        },
        unauthorized: {
          title: "Test-E-Mail nicht autorisiert",
          description: "Sie haben keine Berechtigung, Test-E-Mails zu senden",
        },
        server: {
          title: "Test-E-Mail-Serverfehler",
          description:
            "Test-E-Mail konnte aufgrund eines Serverfehlers nicht gesendet werden",
        },
        unknown: {
          title: "Test-E-Mail fehlgeschlagen",
          description:
            "Ein unerwarteter Fehler ist beim Senden der Test-E-Mail aufgetreten",
        },
        templateNotFound: {
          title: "E-Mail-Vorlage nicht gefunden",
          description:
            "Die angeforderte E-Mail-Vorlage konnte nicht gefunden werden",
        },
        sendingFailed: {
          title: "E-Mail-Versand fehlgeschlagen",
          description: "Die Test-E-Mail konnte nicht gesendet werden",
        },
        invalidConfiguration: {
          title: "Ungültige E-Mail-Konfiguration",
          description:
            "Die E-Mail-Konfiguration ist ungültig oder unvollständig",
        },
      },
      fields: {
        journeyVariant: {
          description: "Wählen Sie die E-Mail-Journey-Variante zum Testen",
        },
        stage: {
          description: "Wählen Sie die E-Mail-Kampagnen-Phase zum Testen",
        },
        testEmail: {
          description:
            "Geben Sie die E-Mail-Adresse ein, an die die Test-E-Mail gesendet wird",
        },
        leadData: {
          email: {
            description: "E-Mail-Adresse, die in der E-Mail-Vorlage erscheint",
          },
          businessName: {
            description: "Firmenname, der in der E-Mail-Vorlage erscheint",
          },
          contactName: {
            description: "Kontaktname, der in der E-Mail-Vorlage erscheint",
          },
          phone: {
            description: "Telefonnummer, die in der E-Mail-Vorlage erscheint",
          },
          website: {
            description: "Website-URL, die in der E-Mail-Vorlage erscheint",
          },
          country: {
            description:
              "Land, das für die Lokalisierung in der E-Mail-Vorlage verwendet wird",
          },
          language: {
            description:
              "Sprache, die für die Lokalisierung in der E-Mail-Vorlage verwendet wird",
          },
          status: {
            description:
              "Lead-Status, der in der E-Mail-Vorlage verwendet wird",
          },
          source: {
            description:
              "Lead-Quelle, die in der E-Mail-Vorlage verwendet wird",
          },
          notes: {
            description: "Notizen, die in der E-Mail-Vorlage verwendet werden",
          },
        },
      },
      success: {
        title: "Test-E-Mail erfolgreich gesendet",
        description: "Die Test-E-Mail wurde an die angegebene Adresse gesendet",
      },
      validation: {
        journeyVariant: {
          invalid: "Ungültige E-Mail-Journey-Variante",
        },
        stage: {
          invalid: "Ungültige E-Mail-Kampagnen-Phase",
        },
        testEmail: {
          invalid: "Ungültige Test-E-Mail-Adresse",
        },
        leadData: {
          email: {
            invalid: "Ungültige Lead-E-Mail-Adresse",
          },
          businessName: {
            required: "Lead-Firmenname ist erforderlich",
            tooLong: "Lead-Firmenname ist zu lang",
          },
          contactName: {
            tooLong: "Lead-Kontaktname ist zu lang",
          },
          phone: {
            invalid: "Ungültige Lead-Telefonnummer",
          },
          website: {
            invalid: "Ungültige Lead-Website-URL",
          },
          country: {
            invalid: "Ungültiges Lead-Land",
          },
          language: {
            invalid: "Ungültige Lead-Sprache",
          },
          status: {
            invalid: "Ungültiger Lead-Status",
          },
          source: {
            invalid: "Ungültige Lead-Quelle",
          },
          notes: {
            tooLong: "Lead-Notizen sind zu lang",
          },
        },
      },
    },
    validation: {
      email: {
        invalid: "Ungültige E-Mail-Adresse",
      },
      businessName: {
        required: "Firmenname ist erforderlich",
      },
      website: {
        invalid: "Ungültige Website-URL",
      },
      language: {
        tooShort: "Sprachcode muss mindestens 2 Zeichen haben",
        tooLong: "Sprachcode darf maximal 5 Zeichen haben",
      },
      country: {
        invalid: "Ungültiger Ländercode",
      },
    },
  },
};
