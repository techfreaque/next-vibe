import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Datenschutzrichtlinie - unbottled.ai",
    category: "Rechtliches",
    description:
      "Erfahren Sie, wie unbottled.ai Ihre Privatsphäre schützt und mit Ihren Daten umgeht",
    imageAlt: "Datenschutzrichtlinie",
    keywords:
      "Datenschutzrichtlinie, Datenschutz, Benutzerdatenschutz, unbottled.ai Datenschutz",
    ogTitle: "Datenschutzrichtlinie - unbottled.ai",
    ogDescription:
      "Erfahren Sie, wie unbottled.ai Ihre Privatsphäre schützt und mit Ihren Daten umgeht",
    twitterTitle: "Datenschutzrichtlinie - unbottled.ai",
    twitterDescription:
      "Erfahren Sie, wie unbottled.ai Ihre Privatsphäre schützt und mit Ihren Daten umgeht",
  },
  printAriaLabel: "Datenschutzrichtlinie drucken",
  printButton: "Drucken",
  title: "Datenschutzrichtlinie",
  lastUpdated: "Zuletzt aktualisiert: Januar 2025",
  introduction:
    "Bei {{appName}} nehmen wir Ihre Privatsphäre ernst. Diese Datenschutzrichtlinie erklärt, wie wir Ihre persönlichen Daten sammeln, verwenden und schützen.",
  sections: {
    informationCollect: {
      title: "Informationen, die wir sammeln",
      description:
        "Wir sammeln Informationen, die Sie uns direkt bereitstellen, und automatisch erhobene Informationen bei der Nutzung unseres Dienstes.",
    },
    personalData: {
      title: "Persönliche Daten",
      description: "Wir können folgende persönliche Informationen erheben:",
      items: {
        name: "Name und Kontaktinformationen",
        email: "E-Mail-Adresse",
        phone: "Telefonnummer (optional)",
        company: "Firmenname (optional)",
        billing: "Abrechnungs- und Zahlungsinformationen",
        payment: "Zahlungsmethode und Transaktionsdetails",
      },
    },
    socialMediaData: {
      title: "Social-Media-Daten",
      description:
        "Wenn Sie Social-Media-Konten verbinden, können wir Profilinformationen und verwandte Daten sammeln.",
    },
    derivativeData: {
      title: "Abgeleitete Daten",
      description:
        "Wir können anonymisierte, aggregierte Daten aus Ihrer Nutzung erstellen, um unsere Dienste zu verbessern.",
    },
    useOfInformation: {
      title: "Verwendung Ihrer Informationen",
      description:
        "Wir verwenden die gesammelten Informationen für verschiedene Zwecke, darunter:",
      items: {
        provide: "Um unsere KI-Chat-Dienste bereitzustellen und zu pflegen",
        process:
          "Um Ihre Transaktionen zu verarbeiten und Ihr Konto zu verwalten",
        send: "Um Ihnen Updates, Newsletter und Marketingkommunikation zu senden",
        respond:
          "Um auf Ihre Anfragen zu antworten und Kundensupport zu bieten",
        monitor: "Um Nutzungsmuster zu überwachen und zu analysieren",
        personalize: "Um Ihre Erfahrung zu personalisieren",
      },
    },
    disclosure: {
      title: "Informationsweitergabe",
      description:
        "Wir können Ihre Informationen weitergeben, wenn dies gesetzlich vorgeschrieben ist.",
    },
    businessTransfers: {
      title: "Unternehmensübertragungen",
      description:
        "Im Falle einer Fusion, Übernahme oder eines Verkaufs von Vermögenswerten können Ihre Daten übertragen werden.",
    },
    thirdParty: {
      title: "Drittanbieterdienste",
      description: "Wir nutzen folgende Drittanbieterdienste:",
    },
    legal: {
      title: "Rechtsgrundlage der Verarbeitung",
      description:
        "Wir verarbeiten Ihre personenbezogenen Daten auf der Grundlage Ihrer Einwilligung, vertraglicher Notwendigkeit, rechtlicher Verpflichtungen und unserer berechtigten Interessen.",
    },
    security: {
      title: "Sicherheitsmaßnahmen",
      description:
        "Wir implementieren geeignete technische und organisatorische Sicherheitsmaßnahmen zum Schutz Ihrer personenbezogenen Daten.",
    },
    rights: {
      title: "Ihre Datenschutzrechte",
      description:
        "Nach den Datenschutzgesetzen haben Sie bestimmte Rechte bezüglich Ihrer persönlichen Daten:",
      items: {
        access: "Recht auf Zugang zu Ihren personenbezogenen Daten",
        correction:
          "Recht auf Berichtigung ungenauer oder unvollständiger Daten",
        deletion: "Recht auf Löschung Ihrer Daten (Recht auf Vergessenwerden)",
        objection: "Recht auf Widerspruch gegen die Verarbeitung Ihrer Daten",
        portability: "Recht auf Datenportabilität und -übertragung",
      },
    },
    cookies: {
      title: "Cookies und Tracking",
      description:
        "Wir verwenden Cookies und ähnliche Tracking-Technologien, um Ihre Erfahrung zu verbessern.",
    },
    thirdPartySites: {
      title: "Websites Dritter",
      description:
        "Unser Dienst kann Links zu Websites Dritter enthalten. Wir sind nicht verantwortlich für deren Datenschutzpraktiken.",
    },
    children: {
      title: "Datenschutz für Kinder",
      description:
        "Unser Dienst ist nicht für Kinder unter 13 Jahren bestimmt. Wir sammeln wissentlich keine Daten von Kindern.",
    },
    changes: {
      title: "Änderungen dieser Richtlinie",
      description:
        "Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wir werden Sie über wesentliche Änderungen informieren.",
    },
    gdpr: {
      title: "DSGVO-Konformität",
      description:
        "Für Nutzer in der Europäischen Union halten wir alle DSGVO-Anforderungen ein.",
    },
    ccpa: {
      title: "CCPA-Konformität",
      description:
        "Für Einwohner Kaliforniens halten wir den California Consumer Privacy Act ein.",
    },
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
};
