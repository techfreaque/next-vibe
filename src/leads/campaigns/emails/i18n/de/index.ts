import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
            description: "Ein sachlicher Profi gibt ein getestetes Tool weiter",
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
          description: "E-Mail-Vorlage für angegebene Parameter nicht gefunden",
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
};
