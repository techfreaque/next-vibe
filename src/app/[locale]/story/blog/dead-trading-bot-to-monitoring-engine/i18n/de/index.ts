import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Mein toter Trading-Bot wurde zu einer Plattform-Monitoring-Engine — next-vibe",
    description:
      "Ich habe vor Jahren einen Trading-Bot aufgegeben. Dann erkannte ich: Seine Architektur — DataSource, Indicator, Evaluator, Action — gilt für jedes Unternehmen. Also habe ich ihn in next-vibe neu aufgebaut.",
    category: "Vibe Sense",
    imageAlt: "Vibe Sense Monitoring-Pipeline — next-vibe",
    keywords:
      "vibe sense, Monitoring, Trading-Bot, Endpoints, EMA, Pipeline, next-vibe, TypeScript",
    ogTitle:
      "Mein toter Trading-Bot wurde zu einer Plattform-Monitoring-Engine",
    ogDescription:
      "Der Trading-Bot hatte diese Architektur richtig. Ich habe nur den falschen Ort gewählt, um ihn zu bauen.",
    twitterTitle: "Toter Trading-Bot → lebendige Monitoring-Engine",
    twitterDescription:
      "Jeder Node ist ein Endpoint. Die Pipeline sind nur Endpoints, die Endpoints aufrufen.",
  },
  backToBlog: "Zurück zum Blog",
  hero: {
    eyebrow: "Vibe Sense",
    title: "Das ist deine Plattform, die sich selbst beobachtet.",
    subtitle:
      "Ich habe vor Jahren einen Trading-Bot aufgegeben. Seine Architektur wurde zum interessantesten Teil von next-vibe. Jeder Node im Graph ist ein Endpoint — aufrufbar von der CLI, auffindbar durch KI, in deine Plattform eingebunden.",
    readTime: "14 Min. Lesezeit",
    date: "Architektur",
  },
  origin: {
    title: "Der Trading-Bot, den ich aufgegeben habe",
    paragraph1:
      "Vor einigen Jahren habe ich OctoBot geforkt und etwas gebaut, das ich Octane nannte. Python-Backend, React-Frontend. Man konnte technische Indikatoren auf eine Canvas ziehen, Evaluatoren verketten, Ausführungsregeln konfigurieren, Alerts einrichten, Orders feuern. Es hatte einen vollständigen visuellen Strategy-Builder. Ich benutze es noch für mein eigenes Portfolio.",
    paragraph2:
      "Ich habe es als Codebasis aufgegeben. Das Python war unübersichtlich, die Architektur hatte genug technische Schulden angesammelt, dass sich jede Änderung teuer anfühlte.",
    paragraph3:
      "Aber ich dachte immer wieder darüber nach. Besonders darüber, was es als System funktionieren ließ.",
    quoteText:
      "Der Trading-Bot hatte diese Architektur richtig. Das, was ich falsch gemacht habe, war, ihn in Isolation zu bauen.",
    timeline: {
      octane: {
        label: "Octane (OctoBot-Fork)",
        description:
          "Visueller Strategy-Builder, Drag-and-Drop-Indikatoren, Python-Backend. Als Codebasis aufgegeben.",
      },
      insight: {
        label: "Die Erkenntnis",
        description:
          "Diese Struktur beschreibt kein Trading. Sie beschreibt jeden Geschäftsprozess mit zeitbasierten Daten.",
      },
      rebuilt: {
        label: "Neu aufgebaut in next-vibe",
        description:
          "Richtig typisiert. Jeder Node ist ein Standard-Endpoint. Überall zugänglich, wo die Plattform ist.",
      },
    },
  },
  insight: {
    title: "Jedes Unternehmen ist eine Zeitreihe",
    intro:
      "In einem Trading-Bot sind die Teile einfach. Eine Datenquelle: Preisdaten, Volumen, was auch immer man liest. Ein Indikator: Moving Average, RSI, MACD — nimmt Rohdaten, produziert ein abgeleitetes Signal. Ein Evaluator: Ist der schnelle MA über dem langsamen MA? Boolean-Bedingung. Eine Aktion: Wenn der Evaluator feuert, tue etwas.",
    realization:
      "Diese Struktur beschreibt kein Trading. Sie beschreibt jeden Geschäftsprozess, bei dem man Daten über Zeit hat, Bedingungen die einem wichtig sind, und Aktionen, die man ausführen möchte, wenn diese Bedingungen erfüllt sind.",
    examples: {
      userGrowth: {
        label: "Nutzerwachstum",
        description:
          "Das ist eine Zeitreihe. Geht sie nach unten? Das ist ein Evaluator. Sende eine Win-back-Kampagne. Das ist eine Aktion.",
      },
      emailHealth: {
        label: "E-Mail-Kampagnengesundheit",
        description:
          "Öffnungsraten, Bounce-Raten, Abmelderaten. Alles Zeitreihen. Alle auswertbaren Bedingungen. Alle triggerbar.",
      },
      creditEconomy: {
        label: "Credit-Ökonomie",
        description: "Ausgabengeschwindigkeit. Burn-Rate vs. Kaufrate. Alles.",
      },
      revenueAnomaly: {
        label: "Umsatzanomalien",
        description:
          "Rückerstattungsrate steigt an einem Tag über 20% — Thea wird benachrichtigt, bevor man es im Dashboard sieht.",
      },
    },
  },
  architecture: {
    title: "Die vier Node-Typen",
    subtitle:
      "Drei Node-Typen, die man verstehen muss, um einen Graph zu lesen. Plus ein vierter, der den Kreis schließt.",
    dataSource: {
      label: "DataSource",
      description:
        "Ein domänen-eigener Endpoint, der die Datenbank abfragt und { timestamp, value }[] für einen gegebenen Zeitraum und eine Auflösung zurückgibt. Lebt mit seiner Domäne. Kennt sein eigenes Schema.",
    },
    indicator: {
      label: "Indicator",
      description:
        "Ein reiner, wiederverwendbarer Berechnungs-Endpoint — EMA, RSI, MACD, Bollinger Bands, clamp, delta, Fensterdurchschnitt. Kein SQL. Kein Domänenwissen. Auf jede Datenquelle anwendbar.",
    },
    evaluator: {
      label: "Evaluator",
      description:
        "Ein Schwellenwert oder eine Bedingung. Nimmt eine Reihe und stellt eine Frage. Liegt dieser Wert unter 0,7? Hat dieses Verhältnis 20% überschritten? Gibt ein Signal aus — ausgelöst oder nicht ausgelöst.",
    },
    action: {
      label: "Action",
      description:
        "Wenn der vorgelagerte Evaluator auslöst, wird ein bestimmter Endpoint aufgerufen. In-Process. Kein HTTP. Gleiche Validierung, gleiche Auth, gleicher Response-Typ wie jeder andere Aufruf im System.",
    },
    connector: "fließt in",
  },
  unified: {
    title: "Jeder Node ist ein Endpoint",
    intro:
      "Das ist das Wichtigste, was ich jetzt klarstellen möchte, bevor wir weitermachen.",
    oldApproach: {
      label: "Alter Ansatz (Octane)",
      description:
        "EMA existiert nur als Node in einem Graph. Man kann es nicht von der CLI aufrufen. Es erscheint nicht als KI-Tool. Es ist ein privates Implementierungsdetail.",
    },
    newApproach: {
      label: "next-vibe Ansatz",
      description:
        "Jeder Vibe Sense Node ist ein Standard-Endpoint, definiert mit createEndpoint(), registriert in der gleichen Endpoint-Registry wie alles andere auf der Plattform.",
    },
    cliCaption:
      "Der gleiche EMA-Endpoint, der als Node im Lead-Funnel-Graph lief — gleiche Definition, gleiche Validierung, gleiche Auth — standalone von der CLI aufrufbar.",
    insight:
      "Der GLEICHE Endpoint, der ein Node in deinem Lead-Funnel-Graph ist, ist auch ein eigenständiges Tool auf 13 Plattformen.",
    keyLine: "Die Pipeline sind nur Endpoints, die Endpoints aufrufen.",
  },
  actionCallout: {
    title: "Aber Aktionen sind keine Trades",
    body: "Wenn ein Signal auslöst, ruft die Engine jeden beliebigen Endpoint auf. In-Process. Kein HTTP-Roundtrip. Ein Alert. Ein Kampagnen-Trigger. Eine KI-Eskalation mit vorbefülltem Kontext. Thea wird benachrichtigt. Eine Win-back-Sequenz startet. Was auch immer an diesem Evaluator angeschlossen ist.",
    noWebhook: "Kein Webhook.",
    noAlerting: "Kein eigener Alerting-Service.",
    noZapier: "Kein Zapier.",
    punchline: "Die Plattform ruft sich selbst auf.",
    examples: {
      alert: {
        label: "Alert",
        description: "complete-task aufrufen — Thea nimmt es sofort entgegen.",
      },
      campaign: {
        label: "Kampagne",
        description:
          "Eine Konversionsequenz auslösen, wenn die Lead-Geschwindigkeit einen Schwellenwert überschreitet.",
      },
      ai: {
        label: "KI-Eskalation",
        description:
          "Einen KI-Lauf mit vorbefülltem Kontext darüber starten, welches Signal ihn ausgelöst hat.",
      },
    },
  },
  funnel: {
    title: "Den Lead-Funnel-Graph durchlaufen",
    subtitle:
      "Das ist der Lead Acquisition Funnel. Er läuft alle sechs Stunden. Lassen Sie uns ihn von oben nach unten verfolgen.",
    column1: {
      label: "Spalte 1: Datenquellen",
      description:
        "Echte Endpoints. Jeder lebt unter leads/data-sources/. Sie akzeptieren einen Zeitraum und eine Auflösung, führen ihre SQL-Abfrage aus und geben { timestamp, value }[] zurück.",
      nodes: {
        created: {
          name: "leads.created",
          description:
            "Abfrage der Leads nach created_at. Sparse — Stunden ohne neue Leads produzieren keinen Datenpunkt.",
        },
        converted: {
          name: "leads.converted",
          description:
            "Gruppiert nach converted_at, zählt Leads, die den SIGNED_UP-Status erreicht haben.",
        },
        bounced: {
          name: "leads.bounced",
          description: "Leads mit gebounceter E-Mail pro Zeitbucket.",
        },
        active: {
          name: "leads.active",
          description:
            "Snapshot-Indikator bei ONE_DAY-Auflösung. Zählt alle Leads, die nicht in Terminalzuständen sind.",
        },
      },
    },
    column2: {
      label: "Spalte 2: Indikatoren",
      description:
        'Reine Berechnung. Der EMA-Endpoint lebt unter analytics/indicators/ema. Seine Graph-Config ist nur { type: "indicator", indicatorId: "ema", params: { period: 7 } }.',
      nodes: {
        ema7: {
          name: "leads_created_ema7",
          description:
            "EMA-Indikator, period=7. Erweitert automatisch den vorgelagerten Fetch-Bereich für den Warmup.",
        },
        conversionRate: {
          name: "conversion_rate",
          description:
            "Transformer: dividiert leads.converted durch leads.created pro Zeitbucket. Auf 0–1 begrenzt.",
        },
      },
    },
    column3: {
      label: "Spalte 3: Evaluatoren",
      description:
        "Schwellenwertbedingungen. Jeder gibt ein Signal aus — ausgelöst oder nicht ausgelöst.",
      nodes: {
        leadDrop: {
          name: "eval_lead_drop",
          description:
            "EMA(7) < 0,7 bei ONE_WEEK-Auflösung. Lead-Erstellungsgeschwindigkeit, geglättet über 7 Perioden, fällt unter 70%.",
        },
        zeroLeads: {
          name: "eval_zero_leads",
          description:
            "leads.created < 1/Tag. Ein ganzer Tag vergeht ohne neue Leads.",
        },
        lowConversion: {
          name: "eval_low_conversion",
          description:
            "conversion_rate < 5%/Woche. Funnel-Konversion fällt unter 5%.",
        },
      },
    },
  },
  domainOwned: {
    title: "Domänen-eigene Datenquellen",
    subtitle:
      "Eine der architektonischen Entscheidungen, mit der ich am zufriedensten bin: Datenquellen leben mit ihrer Domäne, nicht in einem zentralen vibe-sense/-Verzeichnis.",
    leadsLabel: "Leads-Domäne",
    creditsLabel: "Credits-Domäne",
    explanation:
      "leads/data-sources/leads-created kennt die Leads-Tabelle. Es importiert aus leads/db. Es verwendet LeadStatus aus leads/enum. Wenn man das Leads-Modul löscht, gehen die Datenquellen mit. Nichts bleibt verwaist.",
    indicators: {
      label: "Indikatoren unter analytics/indicators/",
      description:
        "Reine Berechnung — EMA, RSI, MACD, Bollinger Bands, clamp, delta, Fensterdurchschnitt. Kein Domänenwissen. Auf jede Datenquelle anwendbar.",
    },
    registration:
      "Beim Start entdeckt das Indikator-Registry beide automatisch. Datenquellen-Endpoints registrieren sich als Node-Definitionen. Man fügt eine neue Domäne hinzu, fügt data-sources/-Endpoints hinzu, exportiert graphSeeds. Sie erscheinen.",
    keyLine: "Die Domäne besitzt ihre eigene Observability.",
  },
  safety: {
    title: "Versionierung, Backtest, Persistenz",
    subtitle:
      "Drei Dinge, die Vibe Sense sicher für den Produktionseinsatz machen.",
    versioning: {
      label: "Versionierung",
      description:
        "Graphs werden versioniert. Wenn man einen Graph bearbeitet, erstellt man eine neue Version — nie die aktive mutieren. Die neue Version ist ein Entwurf. Man promoted sie explizit. Rollback ist trivial.",
    },
    backtest: {
      label: "Backtest",
      description:
        "Vor dem Promoten kann man über einen historischen Zeitraum backtesten. Bedingungen werden ausgewertet. Signale werden aufgezeichnet. Endpoints feuern nie. Gate geschlossen.",
    },
    persist: {
      label: "Persistenzmodi",
      always: {
        label: "always",
        description:
          "Jeder berechnete Datenpunkt wird in den Datapoints-Store geschrieben. Für ereignisbasierte Indikatoren: erstellte Leads pro Minute, ausgegebene Credits pro Minute.",
      },
      snapshot: {
        label: "snapshot",
        description:
          "Auf Anfrage berechnet, gecacht, aber nicht in die Haupttabelle geschrieben. Tägliche Gesamtsummen, kumulative Zählungen.",
      },
      never: {
        label: "never",
        description:
          "Immer live aus Inputs neu berechnet. EMA-Outputs, Verhältnisse — keine Speicherkosten. Lookback wird automatisch für den Warmup erweitert.",
      },
    },
  },
  ships: {
    title: "Was heute ships vs. was kommt",
    prodReady: {
      label: "Heute produktionsbereit",
      items: {
        engine:
          "Vollständige Engine: Datenquellen-Endpoints, Indikator-Endpoints (EMA, RSI, MACD, Bollinger, clamp, delta, Window), Schwellenwert-Evaluatoren, Transformer-Nodes, Endpoint-Action-Nodes.",
        execution:
          "Topologische Ausführung via Graph-Walker. Multi-Resolution-Unterstützung mit automatischem Hoch-/Runterskalieren. Lookback-bewusste Bereichserweiterung.",
        versioning:
          "Versionierung, Backtest-Modus mit vollständiger Run-Historie, Signal-Persistenz als Audit-Trail.",
        cli: "CLI-Zugang — vibe ema, vibe rsi, jeder Indikator-Endpoint, standalone aufrufbar.",
        mcp: "MCP-Registrierung — Indikator-Endpoints erscheinen in der Tool-Liste. Thea kann Indikatoren direkt aufrufen.",
        seeds:
          "Seed-Graphs: 4 Lead-Domänen-Graphs, 4 Credits-Domänen-Graphs, plus Nutzerwachstums-Graphs. Alle laufen sofort auf vibe dev.",
      },
    },
    coming: {
      label: "Als nächstes kommt",
      items: {
        builder:
          "Visueller Drag-and-Drop-Graph-Builder. Die Engine ist vollständig gebaut. Der Canvas-Editor ist das nächste Kapitel.",
        trading:
          "Trading-Endpoints. Preis-Datenquellen-Endpoints, Exchange-API-Endpoints, Order-Ausführung als Endpoint-Nodes verdrahtet. Ein Trading-Graph ist nur ein weiterer Graph.",
        marketplace:
          "Strategie-Marktplatz. Sobald man Graphs visuell bauen kann, kann man sie teilen. Eine vorgefertigte Lead-Monitoring-Strategie importieren. Forken, modifizieren.",
      },
    },
  },
  vision: {
    title: "Was das wirklich ist",
    paragraph1:
      "Jeder Geschäftsprozess, der beschrieben werden kann als: gegeben diese Daten, wenn diese Bedingungen erfüllt sind, tue dies — das ist ein Vibe Sense Graph. Monitoring, ja. Alerting, ja. Aber auch: automatisierte Lead-Qualifizierung, Umsatzanomalientekennung, Credit-Ökonomie-Balancierung, Marketing-Automatisierung.",
    paragraph2:
      "Der Trading-Bot hatte diese Architektur richtig. Indikatoren, Evaluatoren, Aktionen, Backtest-Modus. Das, was ich falsch gemacht habe, war, ihn in Isolation zu bauen. In Octane war EMA in der Pipeline eingesperrt. In next-vibe ist EMA ein First-Class-Endpoint.",
    keyLine:
      "Man baut kein Monitoring-System. Man baut seine Plattform. Das Monitoring-System ist bereits vorhanden.",
    closeTagline:
      "Einmal definieren. Überall vorhanden. Die Pipeline sind nur Endpoints, die Endpoints aufrufen.",
    cta: {
      primary: "Auf GitHub ansehen",
      secondary: "Zurück zum Blog",
    },
    quickstart: {
      label: "Quick Start",
      description:
        "vibe dev startet PostgreSQL in Docker, führt Migrationen aus, seeded Daten, seeded die Vibe Sense Graphs, füllt 365 Tage historische Daten auf und startet den Dev-Server. Öffne localhost:3000. Die Graphs laufen.",
    },
  },
  ui: {
    checkMark: "✓",
    crossMark: "✗",
    arrowMark: "→",
    emaFunctionLabel: "computeEma()",
  },
};
