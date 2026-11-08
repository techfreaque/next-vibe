import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",

  widget: {
    upgradeTitle: "API-Zugang ist ein Bezahlfeature",
    upgradeBody:
      "Abonniere oder kaufe ein Credit-Paket, um API-Schlüssel und den OpenAI-kompatiblen /v1-Endpunkt freizuschalten. Die Doku kannst du auch im kostenlosen Tarif lesen.",
    upgradeCta: "Jetzt freischalten",
    docsLink: "API-Doku lesen",
    back: "Zurück",
    loading: "API-Schlüssel werden geladen…",
    intro:
      "{{modelCount}} Modelle aus dem eigenen Code. OpenAI-kompatibel. Abrechnung über deine Credits, zum selben Preis wie im Chat.",
    baseUrlTitle: "Basis-URL",
    baseUrlHint:
      "Trag sie in jedes OpenAI-SDK ein und nutze einen Schlüssel unten.",
    exampleTitle: "Beispiel",
    copy: "Kopieren",
    copied: "Kopiert",
    keysTitle: "Deine Schlüssel",
    empty: "Noch keine API-Schlüssel",
    emptyHint: "Erstelle einen, um die API zu nutzen.",
    nameLabel: "Name des Schlüssels",
    namePlaceholder: "z. B. Produktiv-Backend",
    create: "Schlüssel erstellen",
    creating: "Wird erstellt…",
    createFailed: "Schlüssel konnte nicht erstellt werden. Versuch es erneut.",
    newKeyTitle: "Schlüssel jetzt kopieren",
    newKeyHint:
      "Nur jetzt siehst du den ganzen Schlüssel. Wir speichern nur einen Hash. Ist er weg, erstellst du einen neuen.",
    dismiss: "Gespeichert",
    lastUsed: "Zuletzt genutzt",
    neverUsed: "Nie genutzt",
    created: "Erstellt",
    revoke: "Widerrufen",
    revoking: "Wird widerrufen…",
    revokeFailed:
      "Schlüssel konnte nicht widerrufen werden. Versuch es erneut.",
    maskedKey: "{{prefix}}…",
    meta: "{{lastUsed}} · Erstellt {{created}} · {{rate}}",
    keyPlaceholder: "sk-unb-DEIN_SCHLUESSEL",
    rateLimit: "{{n}} Anfr./Min.",
    billingNote:
      "Leere Credits liefern HTTP 402. Streaming wird unterstützt (stream: true).",
  },

  list: {
    title: "API-Schlüssel",
    titleShort: "API-Schlüssel",
    description:
      "Schlüssel für die OpenAI-kompatible API erstellen und widerrufen. Zeigt Basis-URL und deine Schlüssel.",
    tag: "API",
    response: {
      baseUrl: "Basis-URL",
      isPaid: "Bezahlter Tarif",
      keys: "Schlüssel",
    },
    success: {
      title: "API-Schlüssel geladen",
      description: "Deine API-Schlüssel wurden abgerufen",
    },
  },

  create: {
    title: "API-Schlüssel erstellen",
    titleShort: "Neuer Schlüssel",
    description:
      "Erstellt einen Schlüssel für die OpenAI-kompatible API. Der volle Schlüssel wird nur einmal ausgegeben.",
    tag: "API",
    form: {
      name: "Name des Schlüssels",
      namePlaceholder: "Wofür ist dieser Schlüssel?",
    },
    response: {
      key: "API-Schlüssel (nur einmal sichtbar)",
      id: "Schlüssel-ID",
      keyPrefix: "Schlüssel-Präfix",
    },
    success: {
      title: "Schlüssel erstellt",
      description: "Kopiere ihn jetzt. Er wird nicht noch einmal angezeigt.",
    },
    errors: {
      paidRequired:
        "Die API gibt es nur mit bezahltem Tarif. Abonniere oder kaufe Credits, um API-Schlüssel zu erstellen.",
      limit:
        "Du hast bereits {{max}} aktive Schlüssel. Widerrufe zuerst einen.",
    },
  },

  revoke: {
    title: "API-Schlüssel widerrufen",
    titleShort: "Widerrufen",
    description:
      "Deaktiviert einen API-Schlüssel dauerhaft. Aufrufe damit schlagen sofort fehl.",
    tag: "API",
    response: {
      message: "Schlüssel widerrufen. Aufrufe damit schlagen jetzt fehl.",
    },
    success: {
      title: "Schlüssel widerrufen",
      description: "Der API-Schlüssel ist nicht mehr nutzbar",
    },
    errors: {
      notFound: {
        detail: "Kein aktiver Schlüssel mit dieser ID in deinem Konto.",
      },
    },
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Anfrage",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Anmeldung erforderlich",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler",
      detail: "API-Schlüssel-Anfrage fehlgeschlagen: {{error}}",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler aufgetreten",
    },
    forbidden: { title: "Verboten", description: "Zugriff verweigert" },
    notFound: {
      title: "Nicht gefunden",
      description: "API-Schlüssel nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Anfrage steht im Konflikt mit dem Zustand",
    },
  },
};
