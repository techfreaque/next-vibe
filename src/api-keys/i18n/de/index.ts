import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",

  widget: {
    upgradeTitle: "API-Zugang ist ein Bezahlfeature",
    upgradeBody:
      "Abonniere oder kaufe ein Credit-Paket, um API-Schlüssel freizuschalten. Ein Schlüssel für deinen eigenen Code, Codex CLI, Claude Code und jedes OpenAI-kompatible Tool. Die Doku kannst du auch im kostenlosen Tarif lesen.",
    upgradeCta: "Jetzt freischalten",
    docsLink: "API-Doku lesen",
    back: "Zurück",
    loading: "API-Schlüssel werden geladen…",
    intro:
      "{{modelCount}} Modelle für deinen Code und deinen Coding-Agent. OpenAI- und Anthropic-Format. Abrechnung über deine Credits, zum selben Preis wie im Chat.",
    baseUrlTitle: "Basis-URL",
    baseUrlHint: "OpenAI-SDKs, Codex, OpenCode, Continue, Aider, Cline.",
    anthropicBaseUrlTitle: "Anthropic-Basis-URL",
    anthropicBaseUrlHint:
      "Claude Code und Anthropic-SDKs. Dieselbe URL ohne /v1: /v1/messages hängen sie selbst an.",
    setupTitle: "Tool verbinden",
    setupKeyFilled:
      "Dein neuer Schlüssel steckt schon in jedem Block. Kopieren, einfügen, starten. Nach „Gespeichert“ zeigen die Blöcke wieder den Platzhalter.",
    setupKeyMissing:
      "Die Blöcke zeigen {{placeholder}}. Erstell einen Schlüssel, dann steht er hier drin.",
    copy: "Kopieren",
    copied: "Kopiert",
    keysTitle: "Deine Schlüssel",
    empty: "Noch keine API-Schlüssel",
    emptyHint: "Erstelle einen, um die API zu nutzen.",
    nameLabel: "Name des Schlüssels",
    namePlaceholder: "z. B. Claude Code Laptop",
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
    rateLimit: "{{n}} Anfr./Min.",
    uncensoredLabel: "Unzensierte Modelle für meine Keys erlauben",
    uncensoredHint:
      "Ich bin 18+ und akzeptiere, dass unzensierte Modelle beleidigende, falsche, gefährliche, illegale oder bösartige Inhalte erzeugen können, ungefiltert. Für die Nutzung trage ich die Verantwortung. Ohne Haken liefern unzensierte Modell-IDs HTTP 403.",
    uncensoredFailed: "Speichern fehlgeschlagen. Versuch es erneut.",
    billingNote:
      "Leere Credits liefern HTTP 402. Streaming funktioniert auf jedem Endpunkt.",
  },

  codingTools: {
    blocks: {
      oneCommand: "Ein Befehl",
      config: "Dauerhaft einrichten",
      run: "Dann starten",
      fields: "Einstellungen",
      check: "Schlüssel prüfen",
      request: "Erste Anfrage",
    },
    tested: "Getestet mit {{name}} {{version}}",
    anyModel:
      "Statt {{model}} geht jede ID aus GET /v1/models, etwa {{examples}}.",
    tools: {
      codex: {
        hint: "Befehl einfügen, und Codex läuft auf unbottled.ai. Für dauerhaft: Block an ~/.codex/config.toml anhängen und Codex mit --profile unbottled starten.",
      },
      claudeCode: {
        hint: "Befehl einfügen, und Claude Code läuft auf unbottled.ai. Für dauerhaft: dieselben Werte in den env-Block von ~/.claude/settings.json, neben die vorhandenen Einträge. Ohne die Modellzeilen nutzt Claude Code unsere Claude-Modelle unter den Namen, die es ohnehin kennt.",
      },
      opencode: {
        hint: "Als opencode.json ins Projekt legen, oder als ~/.config/opencode/opencode.json für alle Projekte. Jede Modell-ID passt in die models-Liste.",
      },
      continue: {
        hint: "Startet die Continue CLI. Die IDE-Erweiterung liest ~/.continue/config.yaml: denselben Modelleintrag dort ergänzen.",
      },
      aider: {
        hint: "Ein Befehl. Aider will openai/ vor der Modell-ID. Die zu bearbeitenden Dateien hängst du wie gewohnt an.",
      },
      cline: {
        hint: "Zwei Befehle mit der Cline-CLI: Provider einmal speichern, dann cline starten.",
      },
      openaiCompatible: {
        hint: "Jedes Tool und jedes SDK mit einem Feld für die Basis-URL. OpenAI-Tools bekommen die URL mit /v1, Anthropic-Tools die URL ohne /v1. Gleicher Schlüssel, gleiche Modelle.",
      },
      curl: {
        hint: "Prüft den Schlüssel und listet jede Modell-ID, die du aufrufen darfst. Danach die erste Anfrage.",
      },
    },
  },

  list: {
    title: "API-Schlüssel",
    titleShort: "API-Schlüssel",
    description:
      "API-Schlüssel erstellen und widerrufen. Zeigt die Basis-URLs, fertige Setups für Coding-Tools und deine Schlüssel.",
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
      "Erstellt einen API-Schlüssel. Funktioniert mit OpenAI- und Anthropic-Clients. Der volle Schlüssel wird nur einmal ausgegeben.",
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
