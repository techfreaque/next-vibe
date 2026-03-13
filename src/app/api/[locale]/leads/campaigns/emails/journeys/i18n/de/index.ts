import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      },
    },
  },
};
