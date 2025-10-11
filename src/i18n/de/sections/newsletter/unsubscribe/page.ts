import type { pageTranslations as EnglishPageTranslations } from "../../../../en/sections/newsletter/unsubscribe/page";

export const pageTranslations: typeof EnglishPageTranslations = {
  title: "Vom Newsletter abmelden",
  subtitle: "Es tut uns leid, Sie gehen zu sehen",
  description:
    "Geben Sie unten Ihre E-Mail-Adresse ein, um sich von unserem Newsletter abzumelden",
  unsubscribeButton: "Abmelden",
  emailProvided: {
    title: "Abmeldung bestätigen",
    description:
      "Wir haben Ihre E-Mail-Adresse vorausgefüllt. Klicken Sie auf abmelden, um sich aus unserem Newsletter zu entfernen.",
  },
  subscribeText: "Möchten Sie stattdessen abonnieren?",
  subscribeLink: "Newsletter abonnieren",
  info: {
    title: "Was passiert als nächstes?",
    description: "Hier ist, was Sie über die Abmeldung wissen müssen:",
    immediate: {
      title: "Sofortige Wirkung",
      description:
        "Sie werden sofort aus unserer Mailingliste entfernt und erhalten keine zukünftigen Newsletter mehr.",
    },
    resubscribe: {
      title: "Einfach wieder abonnieren",
      description:
        "Sie können jederzeit wieder abonnieren, indem Sie unsere Newsletter-Seite besuchen und Ihre E-Mail eingeben.",
    },
  },
  alternatives: {
    title: "Haben Sie es sich anders überlegt?",
    description:
      "Wenn Sie in Verbindung bleiben möchten oder Hilfe bei etwas anderem benötigen:",
    subscribe: "Newsletter abonnieren",
    contact: "Support kontaktieren",
  },
  success: "Sie wurden erfolgreich von allen E-Mails abgemeldet.",
};
