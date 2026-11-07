import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailPlaceholder: "Gib deine E-Mail ein",
  page: {
    eyebrow: "Der {{appName}}-Newsletter",
    title: "Eine Mail im Monat. Nur was neu ist.",
    description:
      "Neue Modelle, neue Features, Prompts, die funktionieren - monatlich.",
    subtitle: "Neue Modelle, neue Features, Prompts, die funktionieren.",
    heroDescription:
      "Neue Modelle am Tag ihres Starts, Features, die du kennen solltest, Setups mit echten Ergebnissen. Einmal im Monat. Abmeldung mit einem Klick.",
    invalidEmail: {
      title: "Ungültige E-Mail",
      description:
        "Diese Adresse sieht nicht richtig aus. Prüf sie und versuch es nochmal.",
    },
    emailProvided: {
      title: "Abo verwalten",
      description: "Newsletter-Einstellungen ändern oder jederzeit abmelden.",
    },
    unsubscribeText: "Genug gelesen?",
    unsubscribeLink: "Hier abmelden",
    privacyNote: "Kein Spam. Keine Weitergabe deiner Adresse. Niemals.",
    cta: {
      title: "Hol dir die nächste Ausgabe.",
      description: "Eine Mail im Monat. Null Füllstoff.",
      subscribeButton: "Abonnieren",
    },
    benefits: {
      title: "Was in deinem Postfach landet",
      subtitle: "Vier Dinge. Sonst nichts.",
      benefit1: {
        title: "Neue Modelle zuerst",
        description:
          "Jedes neue Modell - wofür es taugt, was es kostet, wann du es wählst.",
      },
      benefit2: {
        title: "Ausgelieferte Features",
        description:
          "Was sich geändert hat, warum es zählt, wie du es heute nutzt.",
      },
      benefit3: {
        title: "Prompts, die funktionieren",
        description:
          "Echte Setups und Skills mit Ergebnissen - kopieren, anpassen, loslegen.",
      },
      benefit4: {
        title: "Exklusive Angebote",
        description: "Rabatte und Frühzugang vor allen anderen.",
      },
    },
    frequency: {
      title: "Monatlich. Das war's.",
      description:
        "Eine Mail pro Monat. Abmeldung jederzeit - ein Klick, keine Rückfragen.",
    },
  },
  subscription: {
    unsubscribe: {
      title: "Abmelden",
      confirmButton: "Abmeldung bestätigen",
      success: "Sie wurden abgemeldet",
      error: "Abmeldung fehlgeschlagen",
    },
  },
  unsubscribe: {
    page: {
      title: "Vom Newsletter abmelden",
      description: "Es tut uns leid, Sie gehen zu sehen",
      subtitle: "Verwalten Sie Ihr Newsletter-Abonnement",
      emailProvided: {
        title: "Abmeldung bestätigen",
        description:
          "Sind Sie sicher, dass Sie sich von unserem Newsletter abmelden möchten?",
      },
      unsubscribeButton: "Abmelden",
      subscribeText: "Haben Sie Ihre Meinung geändert?",
      subscribeLink: "Erneut abonnieren",
      info: {
        title: "Was als Nächstes passiert",
        description: "Hier ist, was Sie über die Abmeldung wissen müssen:",
        immediate: {
          title: "Sofortige Wirkung",
          description: "Sie erhalten sofort keine Newsletter-E-Mails mehr.",
        },
        resubscribe: {
          title: "Einfach wieder abonnieren",
          description:
            "Sie können jederzeit wieder abonnieren, wenn Sie Ihre Meinung ändern.",
        },
      },
      alternatives: {
        title: "Bevor Sie gehen",
        description: "Erwägen Sie diese Alternativen:",
        subscribe: "E-Mail-Häufigkeit anpassen",
        contact: "Kontaktieren Sie uns mit Feedback",
      },
    },
  },
};
