import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Mit next-vibe bauen - {{appName}}",
    category: "Entwickler",
    description:
      "next-vibe macht aus jedem Endpoint gleichzeitig ein Webformular, einen CLI-Befehl, ein MCP-Tool, einen nativen Screen und ein KI-aufrufbares Skill. Automatisiere alles, was ein Mensch am Computer tun kann.",
    imageAlt: "next-vibe Entwicklerplattform - {{appName}}",
    keywords:
      "next-vibe, KI-Automatisierung, Entwicklerplattform, Geschäftsautomatisierung, ERP-Integration, Produktionsautomatisierung, {{appName}}",
    ogTitle: "Mit next-vibe bauen - {{appName}}",
    ogDescription:
      "Eine Codebase. Jede Oberfläche. Produktionslinien, ERP-Systeme, Desktop-Workflows automatisieren - alles, was ein Mensch am Computer erledigt.",
    twitterTitle: "Mit next-vibe bauen - {{appName}}",
    twitterDescription:
      "Eine Codebase. Jede Oberfläche. Produktionslinien, ERP-Systeme, Desktop-Workflows automatisieren - alles, was ein Mensch am Computer erledigt.",
  },

  hero: {
    eyebrow: "Karriere",
    title: "Keine Stellenbörse. Die Arbeit ist offen.",
    subtitle:
      "Hier stehen keine Stellenanzeigen. Die Arbeit ist offen: next-vibe für Kunden ausliefern, echte Unternehmen automatisieren, mit veröffentlichten Skills verdienen. Alles, was du brauchst, liegt auf GitHub.",
    ctaPrimary: "Jetzt loslegen",
    ctaSecondary: "Doku lesen",
  },

  audience: {
    title: "Wer mit next-vibe baut",
    items: {
      freelancers: {
        title: "Freelancer & Agenturen",
        description:
          "KI-gestützte Tools für Kunden liefern, ohne separate Backends, CLIs und UIs zu bauen. Eine Codebase, jede Oberfläche.",
      },
      businessDevs: {
        title: "Business-Entwickler",
        description:
          "ERP, CRM oder beliebige interne Systeme mit KI-Workflows verbinden. Daten rein, Entscheidungen raus - kein Klebe-Code.",
      },
      industrialDevs: {
        title: "Industrie & Embedded",
        description:
          "Gerätekonfiguration auf Produktionslinien automatisieren. KI-Skills auslösen, wenn Sensoren anschlagen. Mit Vibe Sense messen, mit Autopilot handeln.",
      },
      enterpriseDevs: {
        title: "Enterprise-Teams",
        description:
          "Fragmentiertes Tooling durch eine einheitliche Plattform ersetzen. Web-UI, CLI, MCP, Native App - selber Endpoint, null Duplizierung.",
      },
    },
  },

  useCases: {
    title: "Was du bauen kannst",
    items: {
      erpIntegration: {
        title: "ERP- & Geschäftssystem-Integration",
        description:
          "Produktionsdaten in einen KI-Skill einspeisen, der Fehler klassifiziert, den Bestand aktualisiert oder Nachbestellworkflows auslöst. Dein Endpoint ist die Brücke.",
      },
      desktopAutomation: {
        title: "Vollständige Desktop-Automatisierung",
        description:
          "next-vibe kann den gesamten Desktop übernehmen, einschließlich Browser. Formulare ausfüllen, scrapen, navigieren, Dateioperationen - einmal geskriptet, läuft überall.",
      },
      productionLine: {
        title: "Produktionslinien-Automatisierung",
        description:
          "Geräte remote per Endpoint konfigurieren. Qualitätsprüfungen via Vibe Sense auslösen. Wenn eine Messung einen Schwellenwert überschreitet, reagiert ein KI-Skill.",
      },
      autopilotScheduling: {
        title: "Geplante KI-Aktionen",
        description:
          "Autopilot führt deine Skills nach Zeitplan aus. Stündlich eine Datenquelle abfragen, nächtliche Logs zusammenfassen, Alarme bei Anomalien ausgeben.",
      },
      vibeSenseMonitoring: {
        title: "Messen → Entscheiden → Handeln",
        description:
          "Vibe Sense misst alles: Maschinenoutput, API-Gesundheit, Queue-Tiefe. Den Messwert in einen Skill einspeisen. Der Skill entscheidet. Ein Endpoint handelt.",
      },
      skillEconomy: {
        title: "Verkaufe, was du baust",
        description:
          "Automatisierung als Skill verpacken. Link teilen. 10% von jeder Zahlung jedes Users, der sich darüber anmeldet - wiederkehrend, solange er zahlt.",
      },
    },
  },

  architecture: {
    title: "Eine Definition. Jede Oberfläche.",
    subtitle:
      "Eine definition.ts pro Feature schreiben. Alles andere wird generiert.",
    surfaces: {
      web: "Webformular",
      cli: "CLI-Befehl",
      mcp: "MCP-Tool",
      native: "Nativer Screen",
      cron: "Cron-Job",
      ai: "KI-aufrufbarer Skill",
    },
    description:
      "Plattform wird zur Laufzeit erkannt. Derselbe Endpoint, der für einen Menschen eine Web-UI rendert, wird für einen KI-Agenten zum maschinell aufrufbaren Tool - kein zusätzlicher Code.",
  },

  referral: {
    title: "Bauen. Teilen. Daran verdienen.",
    description:
      "Jeder geteilte Skill trägt deinen Referral-Link. 10% von jeder Zahlung der User, die du bringst. Plus 5%, wenn der Link eines anderen einen User zu deinem Skill führt. Wiederkehrend, solange sie zahlen.",
    cta: "So funktioniert die Skill Economy",
  },

  cta: {
    title: "Mit einem Endpoint anfangen.",
    subtitle:
      "next-vibe in Minuten zu einem bestehenden Projekt hinzufügen. Oder vom Scaffold starten und heute ein vollständiges Multi-Surface-Tool deployen.",
    primary: "Loslegen",
    secondary: "Story-Posts erkunden",
  },

  post: {
    title: "Mit next-vibe bauen",
    description: "Entwicklerplattform-Endpoint",
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
