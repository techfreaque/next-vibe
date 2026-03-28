import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Show HN: next-vibe - Der Entwurf - next-vibe Blog",
    description:
      "Der Hacker News Post, den wir schreiben. TypeScript-Suprematie, vereinheitlichte Oberflächen und ein Trading-Bot, der nicht handeln kann.",
    category: "Community",
    imageAlt: "Show HN: next-vibe",
    keywords:
      "Hacker News, Show HN, next-vibe, TypeScript, MCP, vereinheitlichte Oberfläche, Open Source",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Community",
    readTime: "5 Min. Lesezeit",
    title: "Show HN: next-vibe",
    subtitle:
      "Der Hacker News Post, den wir schreiben. Zwei Winkel. Eine Entscheidung. Hier ist die Begründung.",
    hnBadge: "Show HN",
    hnSubtext: "Entwurf in Bearbeitung",
  },
  intro: {
    title: "Wir schreiben einen Show HN Post",
    paragraph1:
      "Jedes technische Projekt fragt irgendwann: Wie stellt man sich Hacker News vor? Der Titel ist alles. Die ersten zwei Sätze entscheiden, ob jemand klickt oder scrollt.",
    paragraph2:
      "Wir haben zwei Winkel. Beide sind wahr. Beide sind echte Teile von next-vibe. Die Frage ist, welcher auf HN härter landet - und welcher die Konversation startet, die wir tatsächlich haben wollen.",
  },
  optionA: {
    badge: "Option A",
    title: "TypeScript-Suprematie",
    hnTitle:
      "Show HN: next-vibe – ein TypeScript-first Framework, wo any, unknown, object, as X und throw verboten sind",
    body: "Die meisten TypeScript-Projekte behandeln das Typsystem als optionale Leitplanken. Wir behandeln es als tragende Struktur. Die Regel in next-vibe ist einfach: Typen müssen vollständig übereinstimmen - kein any, kein unknown, kein nacktes object, keine Typzusicherungen (as X), keine Ausnahmen. Wenn Ihre Typen falsch sind, ist die Architektur falsch.\n\nUm dies durchzusetzen, haben wir vibe check gebaut: ein Code-Qualitätstool, das Oxlint (Rust), ESLint und TypeScript-Typüberprüfung parallel ausführt.",
    reasoning:
      "TypeScript-Hardliner werden sofort einsteigen. Die verbotenen Muster sind konkret und umstritten. HN-Ingenieure haben Meinungen zu any und throw. Dieser Winkel lädt zu Widerspruch ein - und auf HN ist Widerspruch Engagement.",
  },
  optionB: {
    badge: "Option B",
    title: "Vereinheitlichte Oberfläche",
    hnTitle:
      "Show HN: next-vibe – eine Endpoint-Definition wird Web-UI, CLI, MCP-Tool, native App, Cron-Job und Graph-Knoten",
    body: "Ich hatte es satt, die gleiche Logik fünfmal zu schreiben. Jede Funktion brauchte ein Webformular, einen CLI-Befehl, ein MCP-Tool für KI-Agenten, manchmal einen mobilen Screen. Gleiche Validierung, gleiche i18n, gleiche Fehlerbehandlung - nur anders verkleidet.\n\nnext-vibe löst dies mit einer einzigen definition.ts pro Funktion. Sie beschreiben Ihre Felder, Zod-Schemas, Labels, Fehlertypen und Beispiele einmal.",
    reasoning:
      "Der nachvollziehbare Schmerzpunkt: die gleiche Sache fünfmal schreiben. Die Lösung ist konkret und demonstrierbar. Der Graph-Knoten-Winkel ist neuartig. MCP + KI-Agenten-Winkel ist zeitgemäß.",
  },
  bannedPatterns: {
    title: "Die verbotenen Muster",
    subtitle: "Das sind keine Stilpräferenzen. Das sind Architekturregeln.",
    any: {
      name: "kein any",
      description:
        "Ersetzen Sie durch eine echte typisierte Schnittstelle. Wenn Sie nach any greifen, hat Ihre Architektur ein Loch.",
    },
    unknown: {
      name: "kein unknown",
      description:
        "Gleiche Regel. unknown ist nur any mit extra Schritten. Definieren Sie den Typ.",
    },
    object: {
      name: "kein nacktes object",
      description:
        "Nacktes object ist bedeutungslos. Schreiben Sie die Form, die Sie tatsächlich erwarten.",
    },
    asX: {
      name: "kein as X",
      description:
        "Typzusicherungen sind Lügen an den Compiler. Beheben Sie stattdessen die Architektur.",
    },
    throwStatements: {
      name: "kein throw",
      description:
        "Verwenden Sie ResponseType<T> mit success(data) oder fail({message, errorType}). Fehler sind Daten, keine Ausnahmen.",
    },
    hardcodedStrings: {
      name: "keine fest codierten Strings in JSX",
      description:
        "Der Checker erkennt nicht übersetzte Literalstrings. Jeder String braucht einen Übersetzungsschlüssel.",
    },
  },
  vibeSense: {
    title: "Der Trading-Bot-Winkel",
    subtitle: "Ein Trading-Bot, der nicht handeln kann",
    description:
      "Vibe Sense ist eine knotenbasierte Marktanalyse-Engine. Datenquellen, Indikatoren (EMA, SMA, Bollinger Bands), Evaluatoren, die Signale ausgeben, und Action-Knoten, die auf diese Signale reagieren. Keine Auftragsausführung.",
    hookForComments:
      "Jeder Knoten im Graphen ist nur ein HTTP-Endpoint - Sie können jeden Schritt in der Pipeline curlen, ihn isoliert testen oder von einem KI-Agenten aus aufrufen. Die Graph-Engine ist ein Scheduler, keine DSL.",
    whyItMatters:
      "Da jeder Knoten ein Standard-Endpoint ist, sind sie einzeln über CLI testbar, für KI-Agenten über MCP zugänglich und mit der gleichen Infra wie alles andere cachbar.",
  },
  angles: {
    title: "Die Winkel nach wahrscheinlichem HN-Traction gerankt",
    intro:
      "Basierend auf Mustererkennung gegen das, was auf HN tatsächlich performt:",
    items: {
      typescript: {
        rank: "1",
        title: "TypeScript-Suprematie + der Checker",
        reason: "Umstritten, technisch, konkret. Ingenieure haben Meinungen.",
      },
      unifiedSurface: {
        rank: "2",
        title:
          "Vereinheitlichte Oberfläche - eine Definition, alle Oberflächen",
        reason:
          "Nachvollziehbarer Schmerzpunkt. Jeder Entwickler hat das gleiche Formular fünfmal geschrieben.",
      },
      vibeSense: {
        rank: "3",
        title: "Vibe Sense Graph-Engine auf Endpoints",
        reason:
          "Neuartige Architektur. Der HTTP-Endpoint als Graph-Knoten ist eine interessante Idee.",
      },
      agentCoordination: {
        rank: "4",
        title: "KI-Agenten-Koordinationsschicht",
        reason:
          "Interessant, aber im Text vergraben. Besser als Kommentar-Hook.",
      },
      freeSpeech: {
        rank: "5",
        title: "unbottled.ai Redefreiheits-Winkel",
        reason:
          "Erzeugt Diskussion, riskiert aber die technische Konversation zu entgleisen.",
      },
    },
  },
  titleAlternatives: {
    title: "Alternative Titeloptionen",
    items: {
      alt1: "Show HN: Ich habe any, unknown, object und as X aus unserer TypeScript-Codebasis verbannt - hier ist der Enforcer",
      alt2: "Show HN: next-vibe – TypeScript so streng, dass wir einen eigenen Linter schrieben, um throw zu verbannen",
      alt3: "Show HN: next-vibe – eine Endpoint-Definition, sechs Oberflächen (web/CLI/MCP/native/cron/graph)",
      alt4: "Show HN: Wir bauten eine Zeitreihen-Graph-Engine, wo jeder Knoten nur ein HTTP-Endpoint ist",
    },
  },
  decision: {
    title: "Die Empfehlung",
    option: "Option A",
    reasoning:
      "Option A für einen meinungsfreudigeren und technischeren Hook. TypeScript-Hardliner werden sofort einsteigen. Option B wenn Sie die volle Breite zeigen möchten. Der TypeScript-Verbotsmuster-Winkel ist am konkretesten, umstrittensten und wahrscheinlichsten, Kommentare zu treiben.",
    cta: "Auf GitHub ansehen",
    github: "github.com/techfreaque/next-vibe",
  },
  ui: {
    hnSiteName: "Hacker News",
    hnNavFull:
      "Hacker News | neu | vergangen | kommentare | fragen | zeigen | jobs | einreichen",
    hnNavShort:
      "neu | vergangen | kommentare | fragen | zeigen | jobs | einreichen",
    hnPostMeta: "42 Punkte von techfreaque vor 2 Stunden | 18 Kommentare",
    hnRecommended: "empfohlen",
    hookForCommentsLabel: "Haken für Kommentare",
  },
};
