import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Wie mein toter Trading-Bot zur Monitoring-Engine wurde - next-vibe",
    description:
      "Ich hab vor Jahren einen Trading-Bot aufgegeben. Dann wurde mir klar: Seine Architektur - DataSource, Indicator, Evaluator, Action - passt auf jedes Business. Also hab ich ihn in next-vibe neu gebaut.",
    category: "Vibe Sense",
    imageAlt: "Vibe Sense Monitoring-Pipeline - next-vibe",
    keywords:
      "vibe sense, Monitoring, Trading-Bot, Endpoints, EMA, Pipeline, next-vibe, TypeScript",
    ogTitle: "Wie mein toter Trading-Bot zur Monitoring-Engine wurde",
    ogDescription:
      "Der Trading-Bot hatte die richtige Architektur. Ich hab ihn nur am falschen Ort gebaut.",
    twitterTitle: "Toter Trading-Bot → lebendige Monitoring-Engine",
    twitterDescription:
      "Jede Node ist ein Endpoint. Die Pipeline besteht einfach aus Endpoints, die andere Endpoints aufrufen.",
  },
  backToBlog: "Zurück zum Blog",
  hero: {
    eyebrow: "Vibe Sense",
    title: "Deine Plattform, die sich selbst überwacht.",
    subtitle:
      "Ich hab vor Jahren einen Trading-Bot aufgegeben. Seine Architektur wurde zum spannendsten Teil von next-vibe. Jede Node im Graph ist ein Endpoint - aufrufbar über die CLI, auffindbar für KI, direkt in die Plattform integriert.",
    readTime: "14 Min. Lesezeit",
    date: "Architektur",
  },
  origin: {
    title: "Der Trading-Bot, den ich aufgegeben hab",
    paragraph1:
      "Vor ein paar Jahren hab ich OctoBot geforkt und daraus etwas gebaut, das ich Octane nannte. Python-Backend, React-Frontend. Man konnte technische Indikatoren auf eine Canvas ziehen, Evaluatoren verketten, Ausführungsregeln konfigurieren, Alerts einrichten, Orders abfeuern. Ein vollständiger visueller Strategy-Builder. Ich nutz ihn noch für mein eigenes Portfolio.",
    paragraph2:
      "Als Codebase hab ich ihn aufgegeben. Das Python war ein Chaos, die Architektur hatte so viel technische Schulden angehäuft, dass sich jede Änderung teuer anfühlte.",
    paragraph3:
      "Aber der Gedanke daran ließ mich nicht los. Vor allem nicht der Gedanke daran, was ihn als System zum Laufen gebracht hat.",
    quoteText:
      "Der Trading-Bot hatte die richtige Architektur. Mein Fehler war, ihn isoliert zu bauen.",
    timeline: {
      octane: {
        label: "Octane (OctoBot-Fork)",
        description:
          "Visueller Strategy-Builder, Drag-and-Drop-Indikatoren, Python-Backend. Als Codebase aufgegeben.",
      },
      insight: {
        label: "Die Erkenntnis",
        description:
          "Diese Struktur beschreibt nicht nur Trading. Sie beschreibt jeden Geschäftsprozess mit zeitbasierten Daten.",
      },
      rebuilt: {
        label: "Neugebaut in next-vibe",
        description:
          "Sauber typisiert. Jede Node ist ein Standard-Endpoint. Überall verfügbar, wo die Plattform läuft.",
      },
    },
  },
  insight: {
    title: "Jedes Business ist eine Zeitreihe",
    intro:
      "Bei einem Trading-Bot sind die Bausteine simpel. Eine Datenquelle: Preisdaten, Volumen, was auch immer man ausliest. Ein Indikator: Moving Average, RSI, MACD - nimmt Rohdaten, erzeugt ein abgeleitetes Signal. Ein Evaluator: Ist der schnelle MA über dem langsamen? Boolean-Bedingung. Eine Aktion: Wenn der Evaluator anschlägt, tu was.",
    realization:
      "Diese Struktur beschreibt nicht nur Trading. Sie beschreibt jeden Geschäftsprozess, bei dem du Daten über Zeit hast, Bedingungen die dir wichtig sind, und Aktionen die du auslösen willst, wenn diese Bedingungen eintreten.",
    examples: {
      userGrowth: {
        label: "Nutzerwachstum",
        description:
          "Das ist eine Zeitreihe. Geht sie runter? Das ist ein Evaluator. Schick eine Win-back-Kampagne. Das ist eine Aktion.",
      },
      emailHealth: {
        label: "E-Mail-Performance",
        description:
          "Öffnungsraten, Bounce-Raten, Abmelderaten. Alles Zeitreihen. Alles auswertbare Bedingungen. Alles triggerbar.",
      },
      creditEconomy: {
        label: "Credit-Ökonomie",
        description: "Ausgabegeschwindigkeit. Burn-Rate vs. Kaufrate. Alles.",
      },
      revenueAnomaly: {
        label: "Umsatzanomalien",
        description:
          "Rückerstattungsrate steigt an einem Tag über 20 % - Thea kriegt Bescheid, bevor du es im Dashboard siehst.",
      },
    },
  },
  architecture: {
    title: "Die vier Node-Typen",
    subtitle:
      "Drei Node-Typen, die du verstehen musst, um einen Graph zu lesen. Plus ein vierter, der den Kreis schließt.",
    dataSource: {
      label: "DataSource",
      description:
        "Ein domäneneigener Endpoint, der die Datenbank abfragt und { timestamp, value }[] für einen bestimmten Zeitraum und eine Auflösung zurückgibt. Lebt bei seiner Domäne. Kennt sein eigenes Schema.",
    },
    indicator: {
      label: "Indicator",
      description:
        "Ein reiner, wiederverwendbarer Berechnungs-Endpoint - EMA, RSI, MACD, Bollinger Bands, Clamp, Delta, Fensterdurchschnitt. Kein SQL. Kein Domänenwissen. Auf jede Datenquelle anwendbar.",
    },
    evaluator: {
      label: "Evaluator",
      description:
        "Ein Schwellenwert oder eine Bedingung. Nimmt eine Reihe und stellt eine Frage. Liegt der Wert unter 0,7? Hat das Verhältnis 20 % überschritten? Gibt ein Signal aus - ausgelöst oder nicht.",
    },
    action: {
      label: "Action",
      description:
        "Wenn der vorgelagerte Evaluator auslöst, wird ein bestimmter Endpoint aufgerufen. In-Process. Kein HTTP. Gleiche Validierung, gleiche Auth, gleicher Response-Typ wie jeder andere Aufruf im System.",
    },
    connector: "fließt in",
  },
  unified: {
    title: "Jede Node ist ein Endpoint",
    intro:
      "Das ist der wichtigste Punkt, den ich klären will, bevor wir weitermachen.",
    oldApproach: {
      label: "Alter Ansatz (Octane)",
      description:
        "EMA existiert nur als Node in einem Graph. Man kann es nicht über die CLI aufrufen. Es taucht nicht als KI-Tool auf. Es ist ein internes Implementierungsdetail.",
    },
    newApproach: {
      label: "next-vibe Ansatz",
      description:
        "Jede Vibe Sense Node ist ein Standard-Endpoint, definiert mit createEndpoint(), registriert in derselben Endpoint-Registry wie alles andere auf der Plattform.",
    },
    cliCaption:
      "Derselbe EMA-Endpoint, der als Node im Lead-Funnel-Graph läuft - gleiche Definition, gleiche Validierung, gleiche Auth - einzeln von der CLI aufrufbar.",
    insight:
      "DERSELBE Endpoint, der eine Node in deinem Lead-Funnel-Graph ist, ist gleichzeitig ein eigenständiges Tool auf 13 Plattformen.",
    keyLine:
      "Die Pipeline besteht einfach aus Endpoints, die andere Endpoints aufrufen.",
  },
  actionCallout: {
    title: "Aber Aktionen sind keine Trades",
    body: "Wenn ein Signal auslöst, ruft die Engine einen beliebigen Endpoint auf. In-Process. Kein HTTP-Roundtrip. Ein Alert. Ein Kampagnen-Trigger. Eine KI-Eskalation mit vorbefülltem Kontext. Thea wird benachrichtigt. Eine Win-back-Sequenz startet. Was auch immer am Evaluator hängt.",
    noWebhook: "Kein Webhook.",
    noAlerting: "Kein eigener Alerting-Service.",
    noZapier: "Kein Zapier.",
    punchline: "Die Plattform ruft sich selbst auf.",
    examples: {
      alert: {
        label: "Alert",
        description: "complete-task aufrufen - Thea reagiert sofort.",
      },
      campaign: {
        label: "Kampagne",
        description:
          "Eine Conversion-Sequenz auslösen, wenn die Lead-Geschwindigkeit einen Schwellenwert überschreitet.",
      },
      ai: {
        label: "KI-Eskalation",
        description:
          "Einen KI-Lauf mit vorbefülltem Kontext starten - inklusive Info, welches Signal ihn ausgelöst hat.",
      },
    },
  },
  funnel: {
    title: "Den Lead-Funnel-Graph Schritt für Schritt",
    subtitle:
      "Das ist der Lead Acquisition Funnel. Er läuft alle sechs Stunden. Gehen wir ihn von oben nach unten durch.",
    column1: {
      label: "Spalte 1: Datenquellen",
      description:
        "Echte Endpoints. Jeder liegt unter leads/data-sources/. Sie nehmen einen Zeitraum und eine Auflösung entgegen, führen ihre SQL-Abfrage aus und liefern { timestamp, value }[] zurück.",
      nodes: {
        created: {
          name: "leads.created",
          description:
            "Fragt Leads nach created_at ab. Sparse - Stunden ohne neue Leads erzeugen keinen Datenpunkt.",
        },
        converted: {
          name: "leads.converted",
          description:
            "Gruppiert nach converted_at, zählt Leads die den SIGNED_UP-Status erreicht haben.",
        },
        bounced: {
          name: "leads.bounced",
          description: "Leads mit gebounceter E-Mail pro Zeitfenster.",
        },
        active: {
          name: "leads.active",
          description:
            "Snapshot-Indikator bei ONE_DAY-Auflösung. Zählt alle Leads, die sich nicht in einem Endzustand befinden.",
        },
      },
    },
    column2: {
      label: "Spalte 2: Indikatoren",
      description:
        'Reine Berechnung. Der EMA-Endpoint liegt unter analytics/indicators/ema. Seine Graph-Konfiguration ist schlicht { type: "indicator", indicatorId: "ema", params: { period: 7 } }.',
      nodes: {
        ema7: {
          name: "leads_created_ema7",
          description:
            "EMA-Indikator, period=7. Erweitert automatisch den Abrufbereich für den Warmup.",
        },
        conversionRate: {
          name: "conversion_rate",
          description:
            "Transformer: teilt leads.converted durch leads.created pro Zeitfenster. Auf 0–1 begrenzt.",
        },
      },
    },
    column3: {
      label: "Spalte 3: Evaluatoren",
      description:
        "Schwellenwertbedingungen. Jeder gibt ein Signal aus - ausgelöst oder nicht.",
      nodes: {
        leadDrop: {
          name: "eval_lead_drop",
          description:
            "EMA(7) < 0,7 bei ONE_WEEK-Auflösung. Lead-Erstellungsrate, geglättet über 7 Perioden, fällt unter 70 %.",
        },
        zeroLeads: {
          name: "eval_zero_leads",
          description: "leads.created < 1/Tag. Ein ganzer Tag ohne neue Leads.",
        },
        lowConversion: {
          name: "eval_low_conversion",
          description:
            "conversion_rate < 5 %/Woche. Funnel-Conversion fällt unter 5 %.",
        },
      },
    },
  },
  domainOwned: {
    title: "Domäneneigene Datenquellen",
    subtitle:
      "Eine meiner liebsten Architekturentscheidungen: Datenquellen leben bei ihrer Domäne, nicht in einem zentralen vibe-sense/-Verzeichnis.",
    leadsLabel: "Leads-Domäne",
    leadsCount: "... 15 Datenquellen insgesamt",
    creditsLabel: "Credits-Domäne",
    creditsCount: "... 17 Datenquellen insgesamt",
    explanation:
      "leads/data-sources/leads-created kennt die Leads-Tabelle. Es importiert aus leads/db. Es nutzt LeadStatus aus leads/enum. Wenn du das Leads-Modul löschst, verschwinden die Datenquellen gleich mit. Nichts bleibt verwaist.",
    indicators: {
      label: "Indikatoren unter analytics/indicators/",
      description:
        "Reine Berechnung - EMA, RSI, MACD, Bollinger Bands, Clamp, Delta, Fensterdurchschnitt. Kein Domänenwissen. Auf jede Datenquelle anwendbar.",
    },
    registration:
      "Beim Start erkennt die Indikator-Registry beide automatisch. Datenquellen-Endpoints registrieren sich als Node-Definitionen. Neue Domäne anlegen, data-sources/-Endpoints hinzufügen, graphSeeds exportieren. Sie tauchen einfach auf.",
    keyLine: "Die Domäne besitzt ihre eigene Observability.",
  },
  safety: {
    title: "Versionierung, Backtest, Persistenz",
    subtitle: "Drei Dinge, die Vibe Sense produktionssicher machen.",
    versioning: {
      label: "Versionierung",
      description:
        "Graphs werden versioniert. Wenn du einen Graph bearbeitest, erstellst du eine neue Version - nie die aktive ändern. Die neue Version ist ein Entwurf. Promoten geht explizit. Rollback ist trivial.",
    },
    backtest: {
      label: "Backtest",
      description:
        "Vor dem Promoten kannst du über einen historischen Zeitraum backtesten. Bedingungen werden ausgewertet. Signale werden aufgezeichnet. Endpoints feuern nie. Gate geschlossen.",
    },
    persist: {
      label: "Persistenzmodi",
      always: {
        label: "always",
        description:
          "Jeder berechnete Datenpunkt wird in den Datapoints-Store geschrieben. Für ereignisbasierte Indikatoren: erstellte Leads pro Minute, verbrauchte Credits pro Minute.",
      },
      snapshot: {
        label: "snapshot",
        description:
          "Wird bei Bedarf berechnet, gecacht, aber nicht in die Haupttabelle geschrieben. Tagesgesamtwerte, kumulative Zählungen.",
      },
      never: {
        label: "never",
        description:
          "Wird immer live aus den Inputs neu berechnet. EMA-Outputs, Verhältnisse - keine Speicherkosten. Lookback wird automatisch für den Warmup erweitert.",
      },
    },
  },
  ships: {
    title: "Was heute da ist vs. was noch kommt",
    prodReady: {
      label: "Heute produktionsbereit",
      items: {
        engine:
          "Vollständige Engine: Datenquellen-Endpoints, Indikator-Endpoints (EMA, RSI, MACD, Bollinger, Clamp, Delta, Window), Schwellenwert-Evaluatoren, Transformer-Nodes, Endpoint-Action-Nodes.",
        execution:
          "Topologische Ausführung über den Graph-Walker. Multi-Resolution-Support mit automatischem Hoch-/Runterskalieren. Lookback-bewusste Bereichserweiterung.",
        versioning:
          "Versionierung, Backtest-Modus mit vollständiger Run-Historie, Signal-Persistenz als Audit-Trail.",
        cli: "CLI-Zugriff - vibe vibe-sense-ema, vibe vibe-sense-rsi, jeder Indikator-Endpoint, einzeln aufrufbar.",
        mcp: "MCP-Registrierung - Indikator-Endpoints tauchen in der Tool-Liste auf. Thea kann Indikatoren direkt aufrufen.",
        seeds:
          "Seed-Graphs: 29 Graphs über 9 Domänen - Leads, Credits, Nutzer, Abonnements, Empfehlungen, Newsletter, Zahlungen, Messenger, KI-Chat und Systemgesundheit. Laufen alle sofort bei vibe dev.",
      },
    },
    coming: {
      label: "Kommt als Nächstes",
      items: {
        builder:
          "Visueller Drag-and-Drop-Graph-Builder. Die Engine steht. Der Canvas-Editor ist das nächste Kapitel.",
        trading:
          "Trading-Endpoints. Preis-Datenquellen-Endpoints, Exchange-API-Endpoints, Order-Ausführung als Endpoint-Nodes verdrahtet. Ein Trading-Graph ist einfach ein weiterer Graph.",
        marketplace:
          "Strategie-Marktplatz. Sobald du Graphs visuell bauen kannst, kannst du sie teilen. Eine fertige Lead-Monitoring-Strategie importieren. Forken, anpassen.",
      },
    },
  },
  vision: {
    title: "Was das Ganze wirklich ist",
    paragraph1:
      "Jeder Geschäftsprozess, der sich so beschreiben lässt: Gegeben diese Daten - wenn diese Bedingungen eintreten - tu das - ist ein Vibe Sense Graph. Monitoring, klar. Alerting, klar. Aber auch: automatisierte Lead-Qualifizierung, Umsatzanomalie-Erkennung, Credit-Ökonomie-Balancierung, Marketing-Automatisierung.",
    paragraph2:
      "Der Trading-Bot hatte die richtige Architektur. Indikatoren, Evaluatoren, Aktionen, Backtest-Modus. Mein Fehler war, ihn isoliert zu bauen. In Octane war EMA in der Pipeline eingesperrt. In next-vibe ist EMA ein vollwertiger Endpoint.",
    keyLine:
      "Du baust kein Monitoring-System. Du baust deine Plattform. Das Monitoring ist schon drin.",
    closeTagline:
      "Einmal definieren. Überall verfügbar. Die Pipeline besteht einfach aus Endpoints, die andere Endpoints aufrufen.",
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
