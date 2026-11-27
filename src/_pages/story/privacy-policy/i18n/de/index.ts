import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Datenschutzrichtlinie: {{appName}}",
    category: "Rechtliches",
    description:
      "Erfahren Sie, wie {{appName}} Ihre Privatsphäre schützt und mit Ihren Daten umgeht",
    imageAlt: "Datenschutzrichtlinie",
    keywords:
      "Datenschutzrichtlinie, Datenschutz, Benutzerdatenschutz, {{appName}} Datenschutz",
    ogTitle: "Datenschutzrichtlinie: {{appName}}",
    ogDescription:
      "Erfahren Sie, wie {{appName}} Ihre Privatsphäre schützt und mit Ihren Daten umgeht",
    twitterTitle: "Datenschutzrichtlinie: {{appName}}",
    twitterDescription:
      "Erfahren Sie, wie {{appName}} Ihre Privatsphäre schützt und mit Ihren Daten umgeht",
  },
  printAriaLabel: "Datenschutzrichtlinie drucken",
  onThisPage: "Auf dieser Seite",
  printButton: "Drucken",
  title: "Datenschutzrichtlinie",
  lastUpdated: "Zuletzt aktualisiert: November 2026",
  bindingVersionNotice:
    "Diese Übersetzung dient nur der Information. Rechtsverbindlich ist die deutsche Fassung dieses Dokuments.",
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
      title: "Betreiberwechsel",
      description:
        "Geht der Dienst auf einen neuen Betreiber über, können Ihre Daten an diesen übertragen werden.",
    },
    thirdParty: {
      title: "Drittanbieterdienste",
      description:
        "Personenbezogene Daten geben wir nur an die unten genannten Dienstleister weiter, und nur so weit, wie der jeweilige Dienst sie braucht. Ihr Konto, Ihre Chats und Dateien liegen auf unseren eigenen Servern in Deutschland.",
      aiNotice:
        "Wenn Sie chatten oder Medien erzeugen, geht die Anfrage an den Anbieter des gewählten Modells. Sie enthält, was das Modell für die Antwort braucht: Ihre Nachricht, frühere Nachrichten des Gesprächs, Anhänge, die Anweisungen und Erinnerungen, die die KI nutzt, sowie den Anzeigenamen aus Ihrem Profil. Ihre E-Mail-Adresse senden wir nicht mit. Vermittler wie OpenRouter, NanoGPT und Venice leiten die Anfrage an das Unternehmen weiter, das das Modell betreibt, zum Beispiel OpenAI, Anthropic, Google, xAI, DeepSeek oder Mistral. Wie lange ein Anbieter eine Anfrage speichert und was er damit tun darf, regeln dessen eigene Bedingungen. Wir trainieren keine KI-Modelle mit Ihren Chats.",
      transfers:
        "Mehrere Anbieter sitzen außerhalb der EU. Bietet ein Anbieter die Standardvertragsklauseln der EU-Kommission an, etwa Stripe und OpenRouter, stützt sich die Übermittlung darauf. Andernfalls erfolgt die Übermittlung nach den Bedingungen des Anbieters.",
      labels: {
        purpose: "Zweck",
        data: "Übermittelte Daten",
        privacyPolicy: "Datenschutzerklärung",
      },
      groups: {
        hosting: "Hosting und Speicherung",
        email: "E-Mail",
        payments: "Zahlungen",
        ai: "KI-Modelle",
        web: "Websuche und Seitenabruf",
      },
      providers: {
        hostinger: {
          purpose:
            "Vermietet uns die zwei virtuellen Server, auf denen die Plattform läuft. Datenbank, Dateispeicher (MinIO) und Cache (Redis) betreiben wir selbst auf diesen Servern. Ein separater Cloud-Speicherdienst ist nicht beteiligt.",
          data: "Alles, was auf der Plattform gespeichert ist: Kontodaten, Chats, Erinnerungen, hochgeladene und erzeugte Dateien, Zahlungsbelege.",
          location: "Server in Deutschland, Unternehmen in Litauen (EU)",
        },
        hosttech: {
          purpose:
            "Mailserver für unsere E-Mail-Adressen. Versendet Anmeldecodes, Belege und Newsletter und empfängt Ihre E-Mails an uns.",
          data: "E-Mail-Adresse, Name, Inhalt der E-Mails.",
          location: "Schweiz (Angemessenheitsbeschluss der EU)",
        },
        stripe: {
          purpose: "Kartenzahlungen, Abonnements und Rechnungen.",
          data: "Name, E-Mail-Adresse, Rechnungsadresse, Zahlungsdaten, Beträge, Ihre Konto-ID. Ihre vollständige Kartennummer sehen wir nie.",
          location:
            "Stripe Payments Europe, Ltd., Irland (EU); Muttergesellschaft in den USA",
        },
        paypal: {
          purpose: "Nur wenn Sie im Stripe-Checkout PayPal wählen.",
          data: "Name, E-Mail-Adresse, Zahlungsdaten, Beträge.",
          location: "PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxemburg (EU)",
        },
        nowpayments: {
          purpose: "Zahlungen mit Kryptowährungen.",
          data: "Ihre Konto-ID in der Bestellnummer, Produkt und Betrag, Wallet- und Transaktionsdaten. Bei wiederkehrenden Kryptozahlungen zusätzlich Ihre E-Mail-Adresse.",
          location: "St. Vincent und die Grenadinen",
        },
        openrouter: {
          purpose:
            "Vermittelt die meisten Chatmodelle (etwa von OpenAI, Anthropic, Google, xAI, DeepSeek, Mistral und Qwen) sowie einige Bild- und Videomodelle an das Unternehmen, das sie betreibt.",
          data: "Inhalt der KI-Anfrage wie oben beschrieben. Das Unternehmen, das das Modell betreibt, erhält denselben Inhalt.",
          location: "USA",
        },
        nanogpt: {
          purpose: "Chat-, Bild- und Videomodelle, Sprachausgabe.",
          data: "Inhalt der KI-Anfrage, Text, den Sie vorlesen lassen.",
          location: "USA",
        },
        venice: {
          purpose: "Unzensierte Chat-, Bild- und Videomodelle.",
          data: "Inhalt der KI-Anfrage.",
          location: "USA",
        },
        uncensoredAi: {
          purpose: "Chatmodell UncensoredLM.",
          data: "Inhalt der KI-Anfrage.",
          location: "USA",
        },
        freedomgpt: {
          purpose: "Chatmodelle von FreedomGPT.",
          data: "Inhalt der KI-Anfrage.",
          location: "USA",
        },
        gabAi: {
          purpose: "Chatmodelle von Gab AI.",
          data: "Inhalt der KI-Anfrage.",
          location: "USA",
        },
        modelslab: {
          purpose: "Bild-, Video- und Musikmodelle.",
          data: "Ihr Prompt und angehängte Bilder.",
          location: "Indien",
        },
        edenAi: {
          purpose:
            "Spracherkennung und Sprachausgabe. Leitet Audio oder Text an die genutzte Sprach-Engine weiter.",
          data: "Sprachaufnahmen, die Sie transkribieren, Text, den Sie vorlesen lassen.",
          location: "Frankreich (EU)",
        },
        braveSearch: {
          purpose: "Websuche, wenn die KI im Internet sucht.",
          data: "Die Suchanfrage, die die KI formuliert. Keine Kontodaten.",
          location: "USA",
        },
        kagi: {
          purpose:
            "Websuche und kurze Webantworten, wenn die KI im Internet sucht.",
          data: "Die Suchanfrage, die die KI formuliert. Keine Kontodaten.",
          location: "USA",
        },
        scrappey: {
          purpose: "Lädt eine Webseite, wenn die KI einen Link liest.",
          data: "Die Adresse der Seite. Keine Kontodaten.",
          location: "EU",
        },
      },
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
        deletion:
          "Recht auf Löschung: Löschen Sie Ihr Konto in den Einstellungen, Ihre personenbezogenen Daten werden entfernt",
        objection: "Recht auf Widerspruch gegen die Verarbeitung Ihrer Daten",
        portability:
          "Recht auf Datenportabilität: Exportieren Sie alle Ihre Daten als JSON in den Einstellungen",
      },
    },
    cookies: {
      title: "Cookies und Tracking",
      description:
        "Keine Tracker von Drittanbietern, keine Werbepixel, kein Fingerprinting. Ein eigenes Cookie erkennt Ihren Browser bei uns wieder. Um zu sehen, welche Kanäle Menschen bringen, die bleiben, speichern wir, wie Sie zum ersten Mal und zuletzt über einen markierten Link zu uns kamen: die Kampagnen-Tags des Links (utm_source, utm_medium, utm_campaign, utm_content, utm_term), die Domain der verweisenden Website (nie die vollständige Adresse), die Einstiegsseite (ohne Query-String) und einen etwaigen Empfehlungscode. Dazu halten wir fest, wann Sie zuerst gechattet, sich registriert, den Newsletter bestätigt, bezahlt und verlängert haben. Mit der Registrierung wird das Ihrem Konto zugeordnet. Wir nutzen es nur aggregiert zur Bewertung von Marketingkanälen, verkaufen oder teilen es nie und löschen es mit Ihrem Konto.",
    },
    guestMedia: {
      title: "Medien ohne Benutzerkonto",
      description:
        "Bilder, Audio und Videos, die ohne Konto erzeugt werden, auch im Inkognito-Modus, speichern wir auf unseren Servern, damit sie angezeigt und heruntergeladen werden können. Legen Sie nie ein Konto an, löschen wir diese Dateien nach 4 Monaten automatisch.",
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
    controller: {
      description:
        "Verantwortlicher im Sinne der DSGVO ist {{operator}}, {{address}}.",
    },
    gdpr: {
      title: "DSGVO-Konformität",
      description:
        "Für Nutzer in der Europäischen Union achten wir Ihre DSGVO-Rechte. Exportieren Sie Ihre Daten jederzeit in den Einstellungen. Wenn Sie Ihr Konto löschen, werden Profil, Chats, Erinnerungen, Adressen, Newsletter-Anmeldung und Kontaktdaten gelöscht, und personenbezogene Angaben in verknüpften Besucherdatensätzen entfernt. Anonyme Gesamtstatistiken und das Credit-Journal (nicht mehr mit Ihnen verknüpft) bleiben erhalten. Für alles, was die Einstellungen nicht abdecken, kontaktieren Sie uns.",
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
