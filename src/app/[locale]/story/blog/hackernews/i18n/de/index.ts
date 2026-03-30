import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Show HN: next-vibe — ein Endpoint, jede Oberfläche",
    description:
      "Der Show HN Post für next-vibe und die Überlegungen dahinter. TypeScript-Suprematie, vereinheitlichte Oberflächen und eine versehentliche Graph-Engine.",
    category: "Community",
    imageAlt: "Show HN: next-vibe",
    keywords:
      "Hacker News, Show HN, next-vibe, TypeScript, MCP, vereinheitlichte Oberfläche, Open Source",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Show HN",
    readTime: "5 Min. Lesezeit",
    title: "Show HN: next-vibe — ein Endpoint, jede Oberfläche",
    subtitle: "Der eigentliche Post — und die Überlegungen dahinter.",
  },
  post: {
    label: "Der Post",
    body: "Ich hatte es satt, die gleiche Logik fünfmal zu schreiben.\n\nJede Funktion brauchte ein Webformular, einen CLI-Befehl, ein MCP-Tool für KI-Agenten, manchmal einen mobilen Screen. Gleiche Zod-Validierung, gleiche i18n, gleiche Fehlerbehandlung — nur anders verkleidet. Also baute ich next-vibe: ein Framework, bei dem man eine definition.ts pro Funktion schreibt und es gleichzeitig als alle rendert.\n\nDie Regel ist streng: Typen müssen vollständig übereinstimmen. Kein any, kein unknown, keine Typzusicherungen (as X), keine throw-Anweisungen. Wenn deine Typen falsch sind, ist deine Architektur falsch. Wir bauten vibe check zur Durchsetzung — Oxlint + ESLint + TypeScript parallel, mit benutzerdefinierten Plugins für projektspezifische Regeln.\n\nEs betreibt auch unbottled.ai (50+ KI-Modelle, nutzergesteuerte Zensur). Die gleiche Codebasis läuft als Next.js Web-App, TanStack/Vite Dev-Server, React Native Mobile-App, CLI, MCP-Server, Cron-System und WebSocket-Event-Bus. Eine Endpoint-Definition. Keine Duplikation.\n\nDer seltsamste Teil: Ein aufgegebener Trading-Bot, den ich vor Jahren schrieb, wurde zum interessantesten Teil. Vibe Sense ist eine knotenbasierte Analytics-Engine — Datenquellen, Indikatoren (EMA, SMA, Bollinger Bands), Evaluatoren, die Signale ausgeben. Keine Auftragsausführung. Jeder Knoten ist ein Standard-HTTP-Endpoint: curl-bar, MCP-zugänglich, einzeln testbar. Die Graph-Engine ist ein Scheduler, keine DSL.",
    note: "Das ist der Post, der zu Hacker News geht. Titel und erste zwei Sätze sind alles.",
  },
  behind: {
    label: "Hinter dem Post",
    subtitle:
      "Warum dieser Winkel, was wir sonst erwogen haben und die Kompromisse.",
  },
  whyAngle: {
    title: "Warum der Unified-Surface-Winkel",
    p1: "Der nachvollziehbare Schmerzpunkt — die gleiche Sache fünfmal schreiben — trifft jeden Entwickler, der ein echtes Produkt gebaut hat. Es ist nicht abstrakt. Jeder Ingenieur, der einen REST-Endpoint, einen CLI-Wrapper und einen mobilen Client für die gleiche Funktion gepflegt hat, kennt das Gefühl.",
    p2: "Die TypeScript-Regeln sind der umstrittenste Teil. HN-Ingenieure haben starke Meinungen zu any und throw. Mit dem Unified-Surface-Ansatz beginnen erzielt breiteres Engagement; der TypeScript-Winkel treibt die Kommentare.",
  },
  bannedPatterns: {
    title: "Die verbotenen Muster",
    subtitle: "Das sind keine Stilpräferenzen. Das sind Architekturregeln.",
    any: {
      name: "kein any",
      description:
        "Ersetze durch eine echte typisierte Schnittstelle. Wenn du nach any greifst, hat deine Architektur ein Loch.",
    },
    unknown: {
      name: "kein unknown",
      description:
        "Gleiche Regel. unknown ist nur any mit extra Schritten. Definiere den Typ.",
    },
    object: {
      name: "kein nacktes object",
      description:
        "Nacktes object ist bedeutungslos. Schreibe die Form, die du tatsächlich erwartest.",
    },
    asX: {
      name: "kein as X",
      description:
        "Typzusicherungen sind Lügen an den Compiler. Behebe stattdessen die Architektur.",
    },
    throwStatements: {
      name: "kein throw",
      description:
        "Verwende ResponseType<T> mit success(data) oder fail({message, errorType}). Fehler sind Daten, keine Ausnahmen.",
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
      "Vibe Sense begann als Trading-Bot. Er führte nie Aufträge aus — er beobachtete nur Preise und löste Signale aus. Als ich ihn aufgab, überlebte die Pipeline-Architektur: Datenquellen verbinden sich mit Indikatoren, Indikatoren speisen Evaluatoren, Evaluatoren senden Signale, Signale lösen Aktionen aus. Jeder Knoten ist ein HTTP-Endpoint.",
    hookForComments:
      "Jeder Knoten im Graphen ist nur ein HTTP-Endpoint — du kannst jeden Schritt in der Pipeline curlen, ihn isoliert testen oder von einem KI-Agenten aus aufrufen. Die Graph-Engine ist ein Scheduler, keine DSL.",
    whyItMatters:
      "Da jeder Knoten ein Standard-Endpoint ist, sind sie einzeln über CLI testbar, für KI-Agenten über MCP zugänglich und mit der gleichen Infra wie alles andere cachbar.",
  },
  alternatives: {
    title: "Titel-Alternativen, die wir erwogen haben",
    items: {
      alt1: "Show HN: Ich habe any, unknown, object und as X aus unserer TypeScript-Codebasis verbannt — hier ist der Enforcer",
      alt2: "Show HN: next-vibe — TypeScript so streng, dass wir einen eigenen Linter schrieben, um throw zu verbannen",
      alt3: "Show HN: next-vibe — eine Endpoint-Definition, sechs Oberflächen (web/CLI/MCP/native/cron/graph)",
      alt4: "Show HN: Wir bauten eine Zeitreihen-Graph-Engine, wo jeder Knoten nur ein HTTP-Endpoint ist",
    },
  },
  cta: {
    github: "Auf GitHub ansehen",
    githubUrl: "github.com/techfreaque/next-vibe",
  },
};
