import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Ein Endpoint. Jede Oberfläche. - next-vibe",
    description:
      "Schreib eine definition.ts pro Feature. Es rendert als Webformular, CLI-Befehl, MCP-Tool, nativer Screen, Cron-Job - gleichzeitig. Keine Duplikation. Typen durchgesetzt.",
    category: "Architektur",
    imageAlt:
      "next-vibe Unified-Surface-Architektur - ein Endpoint, jede Plattform",
    keywords:
      "next-vibe, TypeScript, Unified Surface, MCP, CLI, definition.ts, Open Source, SaaS-Framework",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Architektur",
    readTime: "5 Min. Lesezeit",
    title: "Ein Endpoint. Jede Oberfläche.",
    subtitle:
      "Eine Definition pro Feature. Webformular, CLI-Befehl, MCP-Tool, nativer Screen, Cron-Job - alles gleichzeitig. Keine Duplikation.",
  },
  intro: {
    paragraph1:
      "Jede Funktion brauchte ein Webformular, einen CLI-Befehl, ein MCP-Tool für KI-Agenten, manchmal einen mobilen Screen. Selbe Zod-Validierung, selbe i18n, selbe Fehlerbehandlung - nur anders verpackt. Also hab ich next-vibe gebaut: ein Framework, bei dem du eine definition.ts pro Funktion schreibst und es gleichzeitig als alles rendert.",
    paragraph2:
      "Es betreibt auch {{appName}} - {{modelCount}} KI-Modelle, nutzergesteuerte Zensur. Dieselbe Codebase läuft als Next.js Web-App, TanStack/Vite Dev-Server, React Native Mobile-App, CLI, MCP-Server, Cron-System und WebSocket-Event-Bus. Eine Endpoint-Definition. Keine Duplikation.",
  },
  typeRules: {
    title: "Typen müssen stimmen. Keine Ausnahmen.",
    subtitle:
      "Das sind keine Stilpräferenzen. Das sind Architekturregeln, die ins Framework eingebaut sind.",
    intro:
      "Die Regel ist streng: Typen müssen vollständig stimmen. Wenn deine Typen falsch sind, ist deine Architektur falsch. Wir haben vibe check zur Durchsetzung gebaut - Oxlint + ESLint + TypeScript parallel, mit eigenen Plugins für projektspezifische Regeln.",
    any: {
      name: "kein any",
      description:
        "Ersetze es durch eine echte typisierte Schnittstelle. Wenn du nach any greifst, hat deine Architektur ein Loch.",
    },
    unknown: {
      name: "kein unknown",
      description:
        "Selbe Regel. unknown ist nur any mit Extraschritten. Definier den Typ.",
    },
    object: {
      name: "kein nacktes object",
      description:
        "Nacktes object ist bedeutungslos. Schreib die Form, die du tatsächlich erwartest.",
    },
    asX: {
      name: "kein as X",
      description:
        "Typbehauptungen sind Lügen an den Compiler. Fix stattdessen die Architektur.",
    },
    throwStatements: {
      name: "kein throw",
      description:
        "Nutze ResponseType<T> mit success(data) oder fail({message, errorType}). Fehler sind Daten, keine Exceptions.",
    },
    hardcodedStrings: {
      name: "keine hartcodierten Strings in JSX",
      description:
        "Der Checker erkennt nicht übersetzte Literal-Strings. Jeder String braucht einen Übersetzungsschlüssel.",
    },
  },
  vibeSense: {
    title: "Die versehentliche Graph-Engine",
    subtitle: "Ein Trading-Bot, der nicht traden kann",
    description:
      "Vibe Sense hat als Trading-Bot angefangen. Er hat nie Orders ausgeführt - er hat nur Preise beobachtet und Signale ausgelöst. Als ich ihn aufgab, überlebte die Pipeline-Architektur: Datenquellen verbinden sich mit Indikatoren, Indikatoren speisen Evaluatoren, Evaluatoren senden Signale, Signale lösen Aktionen aus. Jeder Knoten ist ein HTTP-Endpoint.",
    quote:
      "Jeder Knoten im Graph ist einfach ein HTTP-Endpoint - du kannst jeden Schritt der Pipeline curlen, ihn isoliert testen oder von einem KI-Agenten aufrufen. Die Graph-Engine ist ein Scheduler, keine DSL.",
    whyItMatters:
      "Weil jeder Knoten ein Standard-Endpoint ist, sind sie einzeln über die CLI testbar, für KI-Agenten per MCP zugänglich und mit derselben Infra wie alles andere cachbar. Die Graph-Engine erfindet keine eigene Sprache. Sie schedulet Endpoints.",
  },
  cta: {
    github: "Auf GitHub ansehen",
    clone: "git clone https://github.com/techfreaque/next-vibe",
  },
};
