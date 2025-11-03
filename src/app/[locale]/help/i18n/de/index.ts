import { translations as componentsTranslations } from "../../_components/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  nav: {
    home: "Startseite",
  },
  meta: {
    contact: {
      title: "Kontakt & Support - {{appName}}",
      description:
        "Erhalten Sie Hilfe mit {{appName}} - unzensierte KI-Chat-Plattform. Kontaktieren Sie unser Support-Team.",
      category: "Support",
      imageAlt: "{{appName}} Support",
      keywords: "kontakt, support, hilfe, {{appName}}, ki chat, unterstützung",
      ogTitle: "{{appName}} Support kontaktieren",
      ogDescription:
        "Erhalten Sie Hilfe für Ihre unzensierte KI-Chat-Erfahrung",
      twitterTitle: "{{appName}} kontaktieren",
      twitterDescription: "Wenden Sie sich an unser Support-Team",
    },
  },
  pages: {
    help: {
      title: "Wie können wir Ihnen helfen?",
      subtitle:
        "Erhalten Sie Unterstützung für Ihre unzensierte KI-Chat-Erfahrung oder finden Sie Antworten auf häufige Fragen",
      faq: {
        title: "Häufig gestellte Fragen",
        questions: {
          q1: {
            question: "Was ist {{appName}}?",
            answer:
              "{{appName}} ist eine unzensierte KI-Chat-Plattform mit Zugang zu {{modelCount}} KI-Modellen. Wir kombinieren ehrliche KI-Gespräche mit erweiterten Funktionen wie Ordnerverwaltung, benutzerdefinierten Personas und Multi-Modell-Unterstützung.",
          },
          q2: {
            question: "Welche Zahlungsmethoden akzeptieren Sie?",
            answer:
              "Wir akzeptieren Kreditkarten über Stripe und Kryptowährungszahlungen (Bitcoin, Ethereum, Stablecoins) über NowPayments. Wählen Sie zwischen {{subPrice}}/Monat Abonnement ({{subCredits}} Credits/Monat) oder {{packPrice}} Guthaben-Paketen ({{packCredits}} Credits pro Paket, erfordert Abonnement).",
          },
          q3: {
            question: "Wie funktioniert das Guthabensystem?",
            answer:
              "Kostenlose Benutzer erhalten {{freeCredits}} Credits/Monat. Bezahlte Benutzer können zwischen unbegrenztem Abonnement ({{subPrice}}/Monat) oder Pay-as-you-go Guthaben-Paketen ({{packPrice}} für {{packCredits}} Credits) wählen. Guthaben verfallen nie und funktionieren mit allen 40+ KI-Modellen.",
          },
          q4: {
            question: "Sind meine Daten privat und sicher?",
            answer:
              "Ja! Wir bieten End-to-End-Verschlüsselung für private Ordner, Inkognito-Modus für Sitzungs-Chats und volle DSGVO-Konformität. Ihre Gespräche gehören Ihnen - wir verkaufen Ihre Daten niemals.",
          },
        },
      },
    },
  },
};
