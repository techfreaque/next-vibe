import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailPlaceholder: "Geben Sie Ihre E-Mail ein",
  page: {
    title: "Bleiben Sie auf dem Laufenden mit {{appName}}",
    description: "Erhalten Sie die neuesten KI-Nachrichten, Updates und Tipps",
    subtitle: "Erhalten Sie die neuesten KI-Nachrichten und Updates",
    heroDescription:
      "Abonnieren Sie unseren Newsletter, um Updates über neue KI-Modelle, Funktionen und Tipps zu erhalten, wie Sie das Beste aus unzensiertem KI-Chat herausholen.",
    invalidEmail: {
      title: "Ungültige E-Mail",
      description:
        "Die angegebene E-Mail-Adresse ist ungültig. Bitte überprüfen Sie sie und versuchen Sie es erneut.",
    },
    emailProvided: {
      title: "Verwalten Sie Ihr Abonnement",
      description:
        "Aktualisieren Sie Ihre Newsletter-Einstellungen oder melden Sie sich jederzeit ab.",
    },
    unsubscribeText: "Möchten Sie sich abmelden?",
    unsubscribeLink: "Hier klicken",
    cta: {
      title: "Bereit, informiert zu bleiben?",
      description:
        "Schließen Sie sich Tausenden von KI-Enthusiasten an, die die neuesten Updates erhalten",
      subscribeButton: "Abonnieren",
    },
    benefits: {
      title: "Was Sie erhalten",
      subtitle: "Bleiben Sie mit exklusiven KI-Einblicken vorne",
      benefit1: {
        title: "Neue KI-Modell-Ankündigungen",
        description:
          "Seien Sie der Erste, der erfährt, wenn wir neue KI-Modelle zur Plattform hinzufügen.",
      },
      benefit2: {
        title: "Feature-Updates",
        description:
          "Werden Sie über neue Funktionen, Verbesserungen und Plattform-Updates benachrichtigt.",
      },
      benefit3: {
        title: "KI-Tipps & Tricks",
        description:
          "Lernen Sie, wie Sie bessere Ergebnisse von KI erhalten mit unseren Experten-Tipps und Anwendungsfällen.",
      },
      benefit4: {
        title: "Exklusive Angebote",
        description: "Erhalten Sie spezielle Rabatte und frühen Zugang zu neuen Funktionen.",
      },
    },
    frequency: {
      title: "E-Mail-Häufigkeit",
      description: "Wir versenden Newsletter wöchentlich. Sie können sich jederzeit abmelden.",
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
        description: "Sind Sie sicher, dass Sie sich von unserem Newsletter abmelden möchten?",
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
          description: "Sie können jederzeit wieder abonnieren, wenn Sie Ihre Meinung ändern.",
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
