import { translations as contactTranslations } from "@/app/api/[locale]/contact/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  contact: contactTranslations,
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
      ogDescription: "Erhalten Sie Hilfe für Ihre unzensierte KI-Chat-Erfahrung",
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
              "{{appName}} ist eine unzensierte KI-Chat-Plattform mit Zugang zu {{modelCount}} KI-Modellen. Wir kombinieren ehrliche KI-Gespräche mit erweiterten Funktionen wie Ordnerverwaltung, benutzerdefinierten Characters und Multi-Modell-Unterstützung.",
          },
          q2: {
            question: "Welche Zahlungsmethoden akzeptieren Sie?",
            answer:
              "Wir akzeptieren Kreditkarten über Stripe und Kryptowährungszahlungen (Bitcoin, Ethereum, Stablecoins) über NowPayments. Das {{subPrice}}/Monat Abonnement beinhaltet {{subCredits}} Credits/Monat. Sie können auch Guthaben-Pakete ({{packPrice}} für {{packCredits}} Credits) kaufen, wenn Sie mehr Credits benötigen. Guthaben-Pakete verfallen nie, auch nach Beendigung des Abonnements nicht.",
          },
          q3: {
            question: "Wie funktioniert das Guthabensystem?",
            answer:
              "Sie benötigen das {{subPrice}}/Monat Abonnement für den Zugang zum KI-Chat, welches {{subCredits}} Credits/Monat beinhaltet. Wenn Sie mehr Credits benötigen, können Sie Guthaben-Pakete kaufen ({{packPrice}} für {{packCredits}} Credits). Guthaben-Pakete verfallen nie, auch nach Beendigung Ihres Abonnements nicht, sodass sie mit allen {{modelCount}} KI-Modellen funktionieren, wann immer Sie reaktivieren.",
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
