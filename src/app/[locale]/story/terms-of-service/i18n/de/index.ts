import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nutzungsbedingungen - {{appName}}",
    category: "Rechtliches",
    description:
      "Lesen Sie die Nutzungsbedingungen für die Verwendung von {{appName}}",
    imageAlt: "Nutzungsbedingungen",
    keywords:
      "Nutzungsbedingungen, Allgemeine Geschäftsbedingungen, Benutzervereinbarung, {{appName}} Bedingungen",
    ogTitle: "Nutzungsbedingungen - {{appName}}",
    ogDescription:
      "Lesen Sie die Nutzungsbedingungen für die Verwendung von {{appName}}",
    twitterTitle: "Nutzungsbedingungen - {{appName}}",
    twitterDescription:
      "Lesen Sie die Nutzungsbedingungen für die Verwendung von {{appName}}",
  },
  printAriaLabel: "Nutzungsbedingungen drucken",
  printButton: "Drucken",
  title: "Nutzungsbedingungen",
  lastUpdated: "Zuletzt aktualisiert: Januar 2025",
  introduction:
    "Willkommen bei {{appName}}. Durch die Nutzung unserer KI-Chat-Plattform stimmen Sie diesen Nutzungsbedingungen zu. Bitte lesen Sie diese sorgfältig durch.",
  sections: {
    agreement: {
      title: "Zustimmung zu den Bedingungen",
      content:
        "Durch den Zugriff auf oder die Nutzung von {{appName}} stimmen Sie zu, an diese Nutzungsbedingungen und alle geltenden Gesetze gebunden zu sein.",
    },
    description: {
      title: "Dienst-Beschreibung",
      content:
        "{{appName}} bietet Zugang zu KI-Chat-Modellen verschiedener Anbieter. Wir bieten kostenlose und kostenpflichtige Tarife mit unterschiedlichen Funktionen an.",
    },
    subscriptions: {
      title: "Abonnements und Abrechnung",
      plans: {
        title: "Abonnement-Pläne",
        content:
          "Wir bieten einen Abonnement-Plan und Kredit-Pakete an. Kredit-Pakete laufen nie ab, auch nicht nach dem Ende des Abonnements.",
      },
      billing: {
        title: "Abrechnung",
        content:
          "Abonnements werden monatlich abgerechnet. Kredit-Pakete sind Einmalkäufe, die nie ablaufen. Wir akzeptieren Kreditkarten über Stripe und Kryptowährung über NowPayments.",
      },
      cancellation: {
        title: "Kündigung",
        content:
          "Sie können Ihr Abonnement jederzeit kündigen. Kündigungen werden am Ende des aktuellen Abrechnungszeitraums wirksam. Kredit-Pakete sind nicht erstattungsfähig.",
      },
    },
    userAccounts: {
      title: "Benutzerkonten",
      creation: {
        title: "Kontoerstellung",
        content:
          "Sie müssen bei der Kontoerstellung genaue Informationen angeben. Sie sind für die Sicherheit Ihrer Kontodaten verantwortlich.",
      },
      responsibilities: {
        title: "Benutzerverantwortlichkeiten",
        content:
          "Sie sind für alle Aktivitäten unter Ihrem Konto verantwortlich. Sie dürfen Ihr Konto nicht mit anderen teilen.",
      },
    },
    userContent: {
      title: "Benutzerinhalte",
      ownership: {
        title: "Inhaltseigentümerschaft",
        content:
          "Sie behalten alle Rechte an Ihren Gesprächen und Daten. Ihre privaten Ordner sind nur für Sie zugänglich.",
      },
      guidelines: {
        title: "Inhaltsrichtlinien",
        intro:
          "Obwohl wir unzensierten KI-Zugang bieten, dürfen Sie den Dienst nicht nutzen, um:",
        items: {
          item1: "Illegale Aktivitäten durchzuführen",
          item2: "Andere zu belästigen, zu bedrohen oder zu schaden",
          item3: "Rechte an geistigem Eigentum zu verletzen",
          item4: "Die Plattform zu hacken oder zu kompromittieren",
        },
      },
    },
    intellectualProperty: {
      title: "Geistiges Eigentum",
      content:
        "Die {{appName}}-Plattform, einschließlich ihres Designs, ihrer Funktionen und ihres Codes, ist durch Gesetze zum Schutz des geistigen Eigentums geschützt.",
    },
    limitation: {
      title: "Haftungsbeschränkung",
      content:
        "{{appName}} haftet nicht für indirekte, zufällige, besondere oder Folgeschäden, die durch Ihre Nutzung des Dienstes entstehen.",
    },
    indemnification: {
      title: "Schadloshaltung",
      content:
        "Sie stimmen zu, {{appName}} und seine verbundenen Unternehmen von Ansprüchen, Schäden oder Ausgaben freizustellen, die aus Ihrer Nutzung des Dienstes entstehen.",
    },
    termination: {
      title: "Kündigung",
      content:
        "Wir behalten uns das Recht vor, Ihr Konto bei Verstößen gegen diese Bedingungen zu kündigen oder zu sperren.",
    },
    changes: {
      title: "Änderungen der Bedingungen",
      content:
        "Wir können diese Nutzungsbedingungen von Zeit zu Zeit aktualisieren. Die weitere Nutzung des Dienstes nach Änderungen gilt als Akzeptanz der neuen Bedingungen.",
    },
    governingLaw: {
      title: "Anwendbares Recht",
      content:
        "Diese Nutzungsbedingungen unterliegen den Gesetzen von {{jurisdictionCountry}}. Streitigkeiten werden in den Gerichten von {{jurisdictionCity}}, {{jurisdictionCountry}} beigelegt.",
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
