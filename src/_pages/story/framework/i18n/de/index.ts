import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Entwickler: next-vibe-Framework, unzensierte KI-API, MCP",
    description:
      "Einen Endpoint schreiben, Web-UI, CLI-Befehl, MCP-Tool und KI-Tool bekommen. Open Source. Klonen, installieren, starten. Dazu eine OpenAI- und Anthropic-kompatible API für Mainstream- und unzensierte Modelle. Mit Modulen für Buchhaltung, Rechnungen, CRM und Kasse.",
    category: "Entwickler",
    imageAlt: "unbottled.ai für Entwickler: API, MCP und Self-Hosting",
    keywords:
      "unzensierte KI-API, OpenAI-kompatible API, Anthropic-kompatible API, abliterierte Modelle API, UncensoredLM API, MCP-Server, selbst gehostete KI, next-vibe",
  },
  hero: {
    eyebrow: "Für Entwickler",
    title: "Eine definition.ts.",
    titleAccent: "Jede Oberfläche.",
    subtitle:
      "next-vibe ist das Open-Source-Framework in TypeScript hinter {{appName}}. KI-Chat, Buchhaltung, Kasse, Lager und CRM laufen darauf. Ein Endpoint wird zu Web-UI, CLI-Befehl, MCP-Tool und KI-Tool. Kein Glue-Code.",
    ctaFramework: "Code ansehen",
    ctaKeys: "API nutzen",
    stats: {
      endpoints: "typisierte Endpoints im Repo",
      surfaces: "Oberflächen aus einer Definition",
      languages: "Sprachen eingebaut",
      models: "Chat-Modelle, ein API-Schlüssel",
    },
  },
  paths: {
    api: {
      label: "API nutzen",
      title: "{{modelCount}} Modelle, ein Schlüssel",
      body: "Dein OpenAI- oder Anthropic-Code, unsere Base-URL. Mainstream und unzensiert über denselben Schlüssel.",
      link: "Schnellstart",
    },
    selfHost: {
      label: "Selbst hosten",
      title: "Die ganze Plattform betreiben",
      body: "Chat, Buchhaltung, Kasse, Lager, CRM. Klonen, installieren, starten.",
      link: "Installieren",
    },
    framework: {
      label: "Darauf bauen",
      title: "Eine Definition, jede Oberfläche",
      body: "Einen Endpoint einmal schreiben. Daraus werden Web-UI, CLI-Befehl, MCP-Tool, KI-Tool und mehr.",
      link: "Code ansehen",
    },
  },
  modules: {
    eyebrow: "Im Repo",
    title: "Ganze Produkte, gleiches Muster.",
    intro:
      "Buchhaltung, Rechnungen, CRM und Nachrichten folgen demselben Muster wie das Kontaktformular oben. Jeder Endpoint ist CLI-Befehl, MCP-Tool und KI-Tool, außer seine Definition schaltet das ab. Öffne einen beliebigen Ordner: definition, repository, route.",
    endpoints: "{{count}} Endpoints",
    business: "Führ deine Firma damit",
    source: "Module auf GitHub ansehen",
    tryLine: "Gleiches Muster, echte Befehle",
    items: {
      accounting: "Doppelte Buchführung",
      documents: "Rechnungen, Eingangsrechnungen, Angebote",
      purchasing: "Einkauf",
      pos: "Kasse",
      inventory: "Lager",
      crm: "CRM und Leads",
      newsletter: "Newsletter",
      messaging: "Posteingang und Nachrichten",
    },
  },
  quickstart: {
    eyebrow: "Schnellstart",
    title: "Erste Antwort in drei Schritten.",
    intro:
      "Die API spricht OpenAI Chat Completions und Responses sowie Anthropic Messages. Dein Code läuft hier nach drei Änderungen: Base-URL, Schlüssel und eine Modell-ID aus `GET /v1/models`.",
    step1: {
      title: "API freischalten und Schlüssel erstellen",
      description:
        "Jeder Plan ab {{subPrice}} im Monat schaltet sie frei. Dann API-Schlüssel öffnen, Schlüssel benennen, kopieren. Er wird nur einmal angezeigt.",
      ctaPlans: "Pläne ansehen",
      ctaKeys: "API-Schlüssel öffnen",
    },
    step2: {
      title: "Client auf uns umstellen",
      description:
        "OpenAI-Clients nehmen die erste URL. Claude Code und Anthropic-SDKs die zweite.",
      baseUrl: "OpenAI-Base-URL",
      baseUrlNote:
        "Jedes Sprachkürzel im Pfad funktioniert (de-DE, en-US). Es ändert nur die Sprache der Fehlermeldungen.",
      anthropicBaseUrl: "Anthropic-Base-URL",
      anthropicNote:
        "Ohne `/v1` am Ende: Anthropic-Clients hängen `/v1/messages` selbst an.",
    },
    step3: {
      title: "Anfrage senden",
      description:
        "Schlüssel eintragen und ausführen. `{{model}}` ist eine Modell-ID. `GET /v1/models` listet jede ID, die dein Schlüssel aufrufen darf.",
      response: "Beispielantwort",
    },
    agents: {
      title: "Coding-Agenten laufen sofort",
      body: "Getestete Setups zum Kopieren:",
      link: "Agent-Setups",
    },
    reference: "Vollständige API-Referenz",
  },
  pricing: {
    eyebrow: "Preise",
    title: "Ein Plan schaltet die API frei. Abgerechnet wird pro Aufruf.",
    intro:
      "Dieselben Preise wie in der Chat-App. Kein API-Aufschlag, keine Gebühren pro Nutzer, ein Guthaben.",
    unlockTitle: "Schaltet die API frei",
    unlockPlan: "Jeder Plan, ab {{subPrice}} im Monat",
    unlockGrant: "Von unserem Team vergebene Credits, etwa Tester-Credits",
    neverTitle: "Schaltet sie nie frei",
    never:
      "Der Gratis-Tarif: Monatskontingent, Boni für Registrierung und Newsletter, Empfehlungsguthaben. Ohne Plan oder vergebene Credits antwortet jeder `/v1`-Aufruf mit 402 `paid_plan_required`.",
    billTitle: "So wird ein Aufruf abgerechnet",
    bill: "Anbieterkosten plus unsere Marge, in Credits. `GET /v1/models` nennt für jedes Modell die Credits pro Million Ein- und Ausgabetokens. Jede Antwort meldet `usage.credits_charged`, Streams mit `stream_options.include_usage`.",
    topup:
      "Brauchst du mehr? Abonnenten laden mit Credit-Paketen ab {{packPrice}} nach. Paket-Credits verfallen nie.",
    facts: {
      credit: "1 Credit = 1 US-Cent",
      rate: "Kein festes Ratenlimit (Abrechnung pro Anfrage)",
      keys: "Bis zu {{maxKeys}} Schlüssel pro Konto",
      preflight: "Zu wenig Credits: 402, bevor etwas läuft",
    },
    modelsTitle: "Jeder Preis kommt direkt aus der API",
    modelsResponse: "Beispielantwort",
  },
  uncensored: {
    eyebrow: "Unzensierte Modelle",
    title: "Zwei Arten unzensiert. Beide über die API.",
    intro:
      "Fast jede unzensierte KI ist ein Mainstream-Modell, dem die Verweigerungen herausgeschnitten oder abtrainiert wurden. Die betreiben wir, dazu eines, das von Anfang an anders trainiert wurde. Die Modell-ID entscheidet pro Anfrage.",
    abliterated: {
      label: "Abliteriert und feingetunt",
      title: "Mainstream-Modelle, die nicht mehr ausweichen",
      body: "Verweigerungen aus den Gewichten geschnitten oder abtrainiert. Gleiches Wissen, klare Antworten.",
    },
    worldview: {
      label: "Wirklich unzensiert",
      title: "Ein Modell mit eigenem Weltbild",
      body: "{{model}} ist mit Büchern und Dokumenten trainiert, die im Mainstream-Internet verbannt sind. Das Ergebnis: ein Modell mit gegenläufigen politischen Ansichten.",
    },
    more: "+{{count}} weitere",
    consent:
      "18+ einmal auf der API-Schlüssel-Seite bestätigen. Bis dahin antworten unzensierte Modelle mit 403 `uncensored_consent_required`, und nichts wird berechnet.",
    allModels: "Alle unzensierten Modelle",
    catalog: "Zum Modellkatalog",
  },
  mcp: {
    eyebrow: "MCP und CLI",
    title: "Dein Agent kennt deine App schon.",
    intro:
      "`bun i` schreibt die MCP-Konfiguration für Claude Code, Cursor, VS Code, OpenCode und Codex. Öffne das Repo in deinem Agenten, und die Tools sind da.",
    points: {
      stdio: "MCP über stdio. Kein zusätzlicher Server, kein Port.",
      roles:
        "Dieselben Rollen und dieselbe Validierung wie in der Web-UI. Modelle erreichen nur, was deine Rolle erlaubt.",
      connect:
        "Verbinde die Installation mit deinem {{appName}}-Konto, dann laufen ihre Agenten auf unseren Modellen.",
      help: "Jeder Befehl dokumentiert sich selbst: `vibe <command> --help`.",
    },
    configNote:
      "Der `atlas`-Eintrag, den `bun i` schreibt, gekürzt. Die echte Datei enthält auch einen `hermes`-Server und nutzt den Pfad deines Klons.",
  },
  selfHost: {
    eyebrow: "Selbst hosten",
    title: "Alles selbst betreiben.",
    intro:
      "Die Plattform hinter {{appName}} ist Open Source. Klonen, installieren, starten. Dann übernimmt der Browser. Kein Docker, keine Konfigurationsdateien.",
    terminal: "Terminal",
    db: "Standardmäßig eingebettetes Postgres (PGlite). Reicht es nicht mehr, setz `DATABASE_URL` auf dein eigenes Postgres.",
    guide: "Anleitung zum Selbsthosten",
    github: "Code auf GitHub",
  },
  framework: {
    eyebrow: "Das Framework",
    title: "Ein Endpoint, einmal komplett.",
    intro:
      "Das Kontaktformular aus diesem Repo, gekürzt, aber echt. Aus einer Definition werden Web-UI, CLI-Befehl, MCP-Tool, nativer Screen, KI-Tool und Cron-Job.",
    tabAdd: "Eigenes Feature",
    call: {
      title: "So rufst du es auf",
      cli: "CLI",
      mcp: "MCP",
      ai: "KI-Tool",
      cron: "Cron",
    },
    becomes: "Aus dem Kontaktformular wird",
    more: "Dazu {{count}} weitere Oberflächen",
    source: "Kompletter Quellcode auf GitHub",
    live: "Live am Ende der Seite",
    docs: "Doku zu den Mustern auf GitHub",
    deleteLine:
      "Ein Feature ist ein Ordner. Löschen, `vibe gen` ausführen, und es verschwindet auf einen Schlag von jeder Oberfläche.",
    moreSurfaces: {
      webApi: "REST-API",
      websocket: "WebSocket-Events",
      adminPanel: "Admin-Panel",
      vibeFrame: "Einbettbares Widget",
    },
    surfaces: {
      web: {
        title: "Web-UI",
        body: "Das Formular unten auf dieser Seite. Felder, Validierung und Erfolgsmeldung stammen aus der Definition.",
      },
      cli: {
        title: "CLI-Befehl",
        body: "`vibe contact-form`, ein Flag pro Feld, Hilfetext inklusive.",
      },
      mcp: {
        title: "MCP-Tool",
        body: "Agenten erreichen es über `vibe mcp` mit dem Tool `execute-tool`. Das Eingabeschema kommt direkt aus Zod.",
      },
      ai: {
        title: "KI-Tool",
        body: "Modelle können es aufrufen. Mit `requiresConfirmation` muss der Nutzer erst zustimmen.",
      },
      native: {
        title: "Nativer Screen",
        body: "Die Expo-App rendert dasselbe Widget mit nativen Eingabefeldern. Beta.",
      },
      cron: {
        title: "Cron-Job",
        body: "Jeder Endpoint läuft auch nach Zeitplan. Derselbe Handler, kein zweiter Codepfad.",
      },
    },
    maturity: {
      stable: {
        title: "Im Produktivbetrieb",
        body: "{{appName}} läuft auf dieser Codebasis: Web, CLI, MCP, KI-Tools, Cron, Realtime, Zahlungen.",
      },
      beta: {
        title: "Beta",
        body: "React-Native-Screens, Sync zwischen Instanzen und Remote-Skills funktionieren, mit Ecken und Kanten.",
      },
      churn: {
        title: "Rechne mit Umbauten",
        body: "Ein Team, hohes Tempo. Noch kein Semver, und die Doku hinkt dem Code hinterher. Einen Commit pinnen oder forken.",
      },
    },
  },
  faq: {
    title: "Was Entwickler fragen",
    free: {
      q: "Gibt es einen Gratis-Tarif für die API?",
      a: "Nein. Die API schaltet sich mit jedem Plan ab {{subPrice}} im Monat frei, oder mit Credits, die unser Team vergibt. Das kostenlose Chat-Kontingent schaltet sie nicht frei.",
    },
    sdks: {
      q: "Welche SDKs und Tools funktionieren?",
      a: "Die offiziellen OpenAI- und Anthropic-SDKs, jede OpenAI-kompatible Bibliothek und Coding-Agenten wie Claude Code, Codex CLI, OpenCode, Aider, Cline und Continue. Base-URL und Schlüssel tauschen, fertig.",
    },
    uncensored: {
      q: "Kann ich unzensierte Modelle über die API aufrufen?",
      a: "Ja. Einmal auf der Seite für API-Schlüssel bestätigen, dass du mindestens 18 bist, dann wie jedes andere Modell aufrufen. Abliterierte Modelle und UncensoredLM nutzen dieselben Endpoints.",
    },
    media: {
      q: "Auch Bilder, Sprache, Video und Musik?",
      a: "Derselbe Schlüssel. `/v1/images`, `/v1/audio`, `/v1/videos` und `/v1/music` folgen den OpenAI-Formaten, wo es eines gibt. Die API-Referenz deckt jeden Endpoint ab.",
    },
    limits: {
      q: "Welche Rate-Limits gelten?",
      a: "Kein festes Ratenlimit. Die Nutzung wird pro Anfrage aus deinem Guthaben abgerechnet; es gilt ein großzügiger Missbrauchsschutz (hohe Burst- und Stream-Obergrenzen). HTTP 429 von Modellanbietern wird mit `Retry-After`-Header durchgereicht. Sehr hohes Volumen geplant? Nutze das Kontaktformular unten.",
    },
    selfHost: {
      q: "Ist Selbsthosten kostenlos?",
      a: "Ja. Der Code ist Open Source: MIT für die App, GPL v3 für das Framework. Eigene Anbieterschlüssel mitbringen, oder die Installation mit deinem {{appName}}-Konto verbinden und nach Verbrauch zahlen.",
    },
  },
  contact: {
    eyebrow: "Der Endpoint, live",
    title: "Fragen oder etwas Großes geplant?",
    description:
      "Setup, eigene Integrationen, Architektur-Review. Es antwortet das Team, das es gebaut hat. Dieses Formular ist der Kontakt-Endpoint aus dem Framework-Abschnitt.",
  },
  code: {
    copy: "Kopieren",
    copied: "Kopiert",
    wrap: "Umbrechen",
    anthropic: "Anthropic",
  },
};
