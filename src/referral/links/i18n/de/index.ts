import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Empfehlung",
  tags: {
    referral: "empfehlung",
    links: "links",
  },
  get: {
    title: "Meine Tracking-Links",
    titleShort: "Tracking-Links",
    description:
      "Deine Empfehlungslinks, einer pro Platzierung, mit Besuchen, Anmeldungen und Einnahmen je Link.",
    response: {
      links: "Links",
    },
    widget: {
      title: "Tracking-Links",
      subtitle:
        "Ein Link pro Platzierung. So siehst du, welches Video, welcher Post oder welcher Newsletter wirklich zahlt.",
      create: "Neuer Link",
      refresh: "Aktualisieren",
      loading: "Lade deine Links...",
      copy: "Kopieren",
      copied: "Kopiert",
      visits: "Besuche",
      signups: "Anmeldungen",
      paid: "Zahlend",
      earned: "Verdient",
      pending: "{{amount}} ausstehend",
      code: "Code {{code}}",
      landsOn: "Landet auf {{path}}",
      empty: {
        title: "Noch keine Tracking-Links",
        hint: "Erstelle einen pro Video, Post oder Newsletter-Ausgabe. Jeder Besuch, jede Anmeldung und jede Zahlung wird ihm zugeordnet.",
        cta: "Ersten Link erstellen",
      },
      cli: {
        header: "{{count}} Tracking-Links",
        funnel:
          "{{visits}} Besuche, {{signups}} Anmeldungen, {{paid}} zahlend, {{earned}} verdient ({{pending}} ausstehend)",
      },
    },
  },
  post: {
    title: "Tracking-Link erstellen",
    titleShort: "Neuer Link",
    description:
      "Erstelle einen Empfehlungslink für eine Platzierung. Er trägt deinen Empfehlungscode plus UTM-Parameter, damit Besuche, Anmeldungen und Zahlungen pro Link gezählt werden.",
    submit: "Link erstellen",
    fields: {
      name: {
        label: "Name",
        description: "Nur für dich sichtbar. Benenne die Platzierung.",
        placeholder: "YouTube-Review, November",
      },
      source: {
        label: "Wo du ihn teilst",
        description: "Plattform oder Website, z. B. youtube, newsletter, x",
        placeholder: "youtube",
      },
      campaign: {
        label: "Kampagne",
        description:
          "Bündelt Links, z. B. ein Video oder eine Ausgabe. Optional.",
        placeholder: "uncensored-ai-review",
      },
      medium: {
        label: "Medium",
        description: "Art der Platzierung. Standard ist referral.",
        placeholder: "video",
      },
      destinationPath: {
        label: "Zielseite",
        description: "Pfad auf dieser Website, auf dem Besucher landen",
        placeholder: "/",
      },
      code: {
        label: "Empfehlungscode",
        description:
          "Einer deiner Codes. Leer nimmt deinen ersten aktiven Code.",
        placeholder: "MEINCODE",
      },
    },
    response: {
      id: "Link-ID",
      url: "Link",
      code: "Empfehlungscode",
    },
    widget: {
      back: "Zurück",
      hint: "Ein Link pro Platzierung. Dann siehst du genau, welcher zahlende Nutzer bringt.",
      presets: "Wo teilst du ihn?",
      created: "Dein Link ist fertig",
      copy: "Kopieren",
      copied: "Kopiert",
    },
  },
  errors: {
    validation: {
      title: "Ungültige Eingabe",
      description: "Prüfe die markierten Felder",
    },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Melde dich an, um deine Links zu verwalten",
    },
    forbidden: {
      title: "Nicht erlaubt",
      description: "Du kannst diese Links nicht verwalten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Diesen Link gibt es nicht",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Inzwischen hat sich etwas geändert, neu laden und erneut versuchen",
    },
    server: {
      title: "Serverfehler",
      description: "Die Anfrage konnte nicht abgeschlossen werden",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Die Anfrage hat den Server nicht erreicht",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas Unerwartetes ist schiefgelaufen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Speichere oder verwirf zuerst deine Änderungen",
    },
    noCode:
      "Erstelle zuerst deinen Empfehlungscode. Deine Tracking-Links bauen darauf auf.",
    notYourCode: "Code {{code}} ist keiner deiner aktiven Empfehlungscodes",
    invalidDestination:
      "Der Zielpfad muss mit / beginnen und auf dieser Website bleiben",
  },
  success: {
    title: "Erledigt",
    description: "Link ist fertig",
  },
};
