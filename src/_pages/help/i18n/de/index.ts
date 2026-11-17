import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      info: {
        title: "Kontaktinformationen",
        supportEmail: "Support-E-Mail",
        discord: "Discord",
        discordUrl: "Tritt unserer Discord-Community bei",
      },
      faq: {
        title: "Häufig gestellte Fragen",
        questions: {
          q1: {
            question: "Was ist {{appName}}?",
            answer:
              "{{appName}} ist eine unzensierte KI-Chat-Plattform mit Zugang zu {{modelCount}} KI-Modellen. Wir kombinieren ehrliche KI-Gespräche mit erweiterten Funktionen wie Ordnerverwaltung, benutzerdefinierten Skills und Multi-Modell-Unterstützung.",
          },
          q2: {
            question: "Welche Zahlungsmethoden akzeptieren Sie?",
            answer:
              "Karte, PayPal, Apple Pay und Google Pay über Stripe, dazu Krypto (Bitcoin, Ethereum, Stablecoins) über NOWPayments. Tarife gibt es ab {{subscriptionPrice}} im Monat. Credit-Pakete sind die Aufstockung für Abonnenten.",
          },
          q3: {
            question: "Wie funktioniert das Guthabensystem?",
            answer:
              "Jedes Modell kostet Credits pro Nutzung. Zum Start gibt es Gratis-Credits. Jeder Tarif bringt jeden Monat neue Credits: {{subscriptionPrice}} für {{subscriptionCredits}}, {{plusPrice}} für {{plusCredits}}, {{proPrice}} für {{proCredits}}, {{ultraPrice}} für {{ultraCredits}}. Mehr gebraucht? Abonnenten stocken mit Credit-Paketen auf ({{packPrice}} für {{packCredits}} Credits). Paket-Credits verfallen nie und laufen mit allen {{modelCount}} KI-Modellen.",
          },
          q4: {
            question: "Sind meine Daten privat und sicher?",
            answer:
              "Ja! Private Ordner sind nur für Sie sichtbar, der Inkognito-Modus hält Chats von unseren Servern fern (generierte Medien speichern wir aus technischen Gründen vorübergehend), und in den Einstellungen können Sie alle Ihre Daten exportieren oder Ihr Konto samt der damit verknüpften personenbezogenen Daten löschen. Ihre Gespräche gehören Ihnen - wir verkaufen Ihre Daten niemals. Ende-zu-Ende-Verschlüsselung folgt bald.",
          },
        },
      },
    },
  },
};
