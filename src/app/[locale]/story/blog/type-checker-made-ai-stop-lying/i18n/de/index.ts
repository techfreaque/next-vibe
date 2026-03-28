import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Ich baute einen Type-Checker, der KI zum Aufhören mit Lügen brachte — next-vibe",
    description:
      "KI benutzt `any`, um einem Typfehler zu entkommen. Sie fügt eslint-disable hinzu. Sie lügt dich an. So haben wir die Feedbackschleife mit @next-vibe/checker behoben.",
    category: "TypeScript",
    imageAlt: "Type-Checker, der KI zum Aufhören mit Lügen brachte",
    keywords:
      "TypeScript, Type-Checker, KI-Coding, ESLint, Oxlint, any-Typ, Typsicherheit, Claude Code, next-vibe",
  },
  hero: {
    label: "TypeScript",
    readTime: "10 Min. Lesezeit",
    title:
      "Ich baute einen Type-Checker, der KI zum Aufhören mit Lügen brachte",
    subtitle:
      "KI benutzt `any`, um einem Typfehler zu entkommen. Sie fügt eslint-disable hinzu. Sie lügt dich an. So haben wir die Feedbackschleife behoben.",
    quoteAiLies:
      "KI lügt dich nicht an, weil sie es will. Sie lügt dich an, weil du es zulässt.",
  },
  problem: {
    title: "Die kaputte Feedbackschleife",
    description:
      'Bitte Claude Code, ein Feature hinzuzufügen. Es tut es. Führe ESLint aus — es besteht. Führe TypeScript aus — Fehler. Bitte Claude Code, den TypeScript-Fehler zu beheben. Es tut es. Führe ESLint aus — das schlägt jetzt fehl. Hin und Her. Drei Iterationen. Die KI ist bei jedem Schritt zuversichtlich. Jedes Mal: "Das ist behoben."',
    fixLabel: "Es war nie behoben.",
    fixDescription:
      "Es war Whack-a-Mole mit einem Tool, das jeweils nur einen Linter ausführt und nie das vollständige Bild sieht.",
    escapeHatch:
      'Die KI behebt den TypeScript-Fehler, indem sie eine Zeile schreibt und sagt: "Der Typfehler ist behoben."',
    smokeDetector:
      "Ja. Technisch gesehen. So wie das Abkleben deines Rauchmelders mit Klebeband einen Feueralarm behebt.",
    introducingChecker:
      "Das ist das, wofür ich @next-vibe/checker gebaut habe.",
  },
  anyProblem: {
    title: "Das `any`-Problem",
    subtitle: "Warum 98% Typsicherheit dasselbe ist wie 0%",
    graphDescription:
      "TypeScripts Typsystem ist ein Graph. Jeder Typ fließt von der Definition zur Nutzung. Wenn du eine Funktion hast, die `string` zurückgibt, weiß der Aufrufer, dass es ein String ist. Die gesamte Kette wird geprüft.",
    holeInGraph: "`any` ist ein Loch im Graphen.",
    holeDescription:
      "Eine Variable, die als `any` typisiert ist, sagt dem Compiler: Hör hier auf zu prüfen. Nicht nur für diese Variable — für alles, was diese Variable berührt. Der Fehler taucht nicht beim `any` auf. Er taucht drei Dateien entfernt auf, wenn ein unzusammenhängendes Refactoring eine Annahme bricht, die nie durchgesetzt wurde.",
    zeroErrors:
      "Null TypeScript-Fehler bedeutet nichts, wenn du 47 ungeprüfte `any`-Verwendungen hast.",
    zeroErrorsDescription:
      "Du hast keine typsichere Codebasis. Du hast eine Codebasis, in der der Compiler an 47 Stellen aufgegeben hat und du es als bestanden bezeichnet hast.",
    doubleAssertion:
      "`as unknown as Whatever` ist schlimmer. Es ist eine doppelte Typbehauptung. Du sagst dem Compiler: Ich weiß, dass das falsch ist, und ich behaupte mich trotzdem hindurch. Das ist KIs bevorzugter Fluchtweg.",
    bannedTitle: "Die verbotenen Muster in dieser Codebasis:",
    bannedNotWarnings:
      "Keine Warnungen. Fehler. Die Prüfung schlägt fehl. Claude Code muss die Grundursache beheben oder kann nicht ausliefern.",
    psychologyNote:
      "Der Grund, warum das Fehler und keine Warnungen sind, ist psychologisch genauso wie technisch. KI-Modelle behandeln Warnungen als optional. Fehler schließen die Schleife.",
    infectionDiagramTitle: "Das `any`-Infektionsdiagramm",
    infectionDiagramSubtitle:
      "Ein `any`-Typ breitet sich durch den Graphen aus und korrumpiert die nachgelagerte Typinferenz",
    infectionUnsafe: "unsicher",
    counterZeroErrors: "TypeScript-Fehler",
    counterAnyUsages: "`any`-Verwendungen",
  },
  checker: {
    title: "@next-vibe/checker vorstellen",
    subtitle: "Ein Befehl. Drei Tools. Keine Fluchtwege.",
    mcpIntegrationTitle: "MCP-Integration",
    commandDescription:
      "Das ist der Befehl. Ein Befehl. Er führt drei Tools parallel aus und gibt dir eine einheitliche Fehlerliste.",
    oxlintDescription:
      "Rust-basierter Linter. Hunderte von Regeln. Läuft in Millisekunden, selbst auf großen Codebasen.",
    eslintDescription:
      "Die Dinge, die Oxlint noch nicht tut: React Hooks Lint, React Compiler-Regeln, Import-Sortierung.",
    tsDescription:
      "Vollständige Typprüfung. Nicht nur die Datei, die du bearbeitest — den gesamten Graphen.",
    parallelNote:
      "Alle drei laufen parallel. Du bekommst eine einheitliche Fehlerliste. Du behebst, bis es sauber ist.",
    timingNote:
      "Auf dieser Codebasis — 4.400 Dateien — dauert vollständiges TypeScript etwa 12 Sekunden. Oxlint ist unter einer Sekunde. ESLint ist ein paar Sekunden. Parallel bringt es auf 12 runter.",
    mcpNote:
      "Es stellt auch einen `vibe-check mcp`-Befehl bereit, der einen MCP-Server mit einem `check`-Tool startet. Die KI führt keinen Shell-Befehl aus — sie ruft ein Tool auf, das strukturierte Fehlerdaten zurückgibt. Paginierung eingebaut. Filterung nach Pfad.",
    architectureTitle: "Die Checker-Architektur",
    architectureSubtitle:
      "Drei Tools laufen parallel, eine einheitliche Fehlerliste",
    parallel: "parallel",
    unifiedErrors: "Einheitliche Fehlerliste",
    unifiedErrorsDescription: "Eine Ausgabe. Beheben bis es sauber ist.",
  },
  plugins: {
    title: "Benutzerdefinierte Plugins",
    subtitle: "Der Linter als Dokumentation",
    linterIsDocumentation:
      "Der Linter ist die Dokumentation. Und er wird durchgesetzt.",
    jsxPluginTitle: "jsx-capitalization Plugin",
    jsxPluginDescription:
      "Es markiert JSX-Elemente in Kleinbuchstaben und die Fehlermeldung sagt dir genau, was stattdessen zu importieren ist:",
    jsxPluginInsight:
      "Ich habe keine Dokumentation geschrieben, die Claude Code anweist, `next-vibe-ui` zu verwenden. Ich habe es nicht zum System-Prompt hinzugefügt. Das erste Mal, wenn Claude Code `<div>` in einer Komponente schreibt, gibt der Checker einen Fehler aus. Die Fehlermeldung enthält den genauen Import-Pfad. Claude Code liest den Fehler, wendet die Korrektur an und merkt sich die Konvention.",
    restrictedSyntaxTitle: "restricted-syntax Plugin",
    restrictedSyntaxDescription: "Es verbietet drei Dinge:",
    throwBanTitle: "`throw`-Anweisungen",
    throwBanDescription:
      'Die Fehlermeldung sagt: "Verwende stattdessen ordentliche `ResponseType<T>`-Muster." Claude Code trifft darauf, liest es, sucht `ResponseType` und übernimmt das korrekte Fehlerbehandlungsmuster für den Rest der Aufgabe.',
    unknownBanTitle: "nackter `unknown`-Typ",
    unknownBanDescription:
      "\"Ersetze 'unknown' durch eine vorhandene typisierte Schnittstelle. Richte dich an Codebase-Typen aus, anstatt zu konvertieren oder neu zu erstellen.\" Das stoppt Claude Code daran, generische Typ-Fluchtwege zu schreiben.",
    objectBanTitle: "nackter `object`-Typ",
    objectBanDescription:
      "`object` ist fast immer falsch. Entweder kennst du die Form — schreibe das Interface — oder du hast `Record<string, SomeType>`. Rohes `object` ist ein Signal dafür, dass die KI aufgegeben hat.",
    bannedPatternsTitle: "Verbotene Muster",
    bannedPatternsSubtitle:
      "Jedes verbotene Muster wird zur Prüfzeit erfasst. Die Fehlermeldung sagt der KI genau, was stattdessen zu tun ist.",
    bannedLabel: "VERBOTEN",
    correctLabel: "KORREKT",
  },
  demo: {
    title: "Live-Demo: Das 3-Runden-Muster",
    subtitle:
      "Beobachte, wie Claude Code den Checker dreimal trifft, bevor es den richtigen Typ findet",
    round1Title: "Runde 1 — KI schreibt `any`",
    round1Description:
      'Frage Claude Code: "Schreibe eine Hilfsfunktion, die ein rohes API-Antwortobjekt nimmt und das Datenfeld extrahiert. Die Antwort kann verschiedene Formen haben — verwende whatever type makes this work."',
    round1Result: "Claude Code schreibt die einfache Lösung:",
    round1Error:
      "2 Fehler gefunden. Beide `any`. Claude Code kann das durch das MCP-Tool sehen.",
    round2Title: "Runde 2 — KI versucht `unknown`",
    round2Description:
      "Beobachte, was es als nächstes tut. Das ist der wichtige Teil. Es versucht den nächsten Fluchtweg:",
    round2Result: "Der Checker kennt diesen Trick.",
    round2Error:
      "3 Fehler. `unknown` ist auch verboten. Die Fehlermeldung sagt Claude Code genau, was stattdessen zu tun ist: Finde die vorhandene typisierte Schnittstelle.",
    round3Title: "Runde 3 — KI findet den echten Typ",
    round3Description:
      "Jetzt tut Claude Code, was es zuerst hätte tun sollen. Es schaut, wie vorhandene API-Antworten in dieser Codebasis typisiert sind. Es findet `ResponseType<T>`.",
    round3Result:
      "Null Fehler. Und die Funktion ist jetzt tatsächlich korrekt.",
    round3Insight:
      "Der Checker hat es nicht geschrieben. Aber der Checker hat die Abkürzung zweimal verhindert, bis Claude Code sich mit dem eigentlichen Problem auseinandersetzen musste.",
    errorTitle: "Prüfungsausgabe",
    passTitle: "Prüfung bestanden",
  },
  endpoint: {
    title: "Die Endpoint-Verbindung",
    subtitle: "Ein Zod-Schema — vier nachgelagerte Verbraucher",
    description:
      "Jeder Endpoint hat eine Definitionsdatei. Diese Datei enthält ein Zod-Schema für die Anfrage und eines für die Antwort.",
    schemaBecomes:
      "Der `schema`-Schlüssel ist ein Zod-Validator. Dasselbe Zod-Schema wird:",
    webApiValidation: "Die Validierungsregel am Web-API-Endpoint",
    reactHookTypes:
      "Der TypeScript-Typ für den Eingabeparameter des React-Hooks",
    cliFlagsDescription:
      "Das `--name`-Flag in der CLI mit angewandten Min/Max-Einschränkungen",
    aiToolSchema: "Die Parameterbeschreibung im KI-Tool-Schema",
    driftProblem:
      "Hier tötet dich Drift normalerweise. Du aktualisierst die API. Du vergisst, das KI-Tool-Schema zu aktualisieren. Die KI ruft den Endpoint mit den alten Parameternamen auf. Es schlägt still fehl.",
    oneSchemaSolution:
      "Wenn es ein Schema gibt, gibt es nichts zu synchronisieren.",
    typecheckedNote:
      "Und weil der TypeScript-Checker auch darauf läuft — wenn du das Schema auf eine Weise änderst, die den abgeleiteten Typ nachgelagert bricht, bekommst du einen Compiler-Fehler. Das KI-Tool-Schema ist typgeprüft. Die CLI-Flags sind typgeprüft. Der React-Hook ist typgeprüft.",
    statsTitle: "Diese Codebasis in Zahlen",
    stat245: "245 Endpoints",
    stat0any: "Null `any`",
    stat0unknown: "Null `unknown`-Casts",
    stat0tsExpect: "Null `@ts-expect-error`",
    statNote: "Nicht durch Konvention. Durch den Checker.",
    diagramTitle: "Ein Zod-Schema — vier Verbraucher",
    diagramSubtitle:
      "Ändere das Schema einmal, alles aktualisiert sich automatisch",
    diagramSource: "definition.ts (Zod-Schema)",
    diagramWebApi: "Web-API-Validierung",
    diagramHookTypes: "React-Hook-Typen",
    diagramCliFlags: "CLI-Flags",
    diagramAiSchema: "KI-Tool-Schema",
    diagramSameSchema: "selbes Schema",
    diagramInferred: "abgeleitet vom Schema",
    diagramGenerated: "generiert vom Schema",
  },
  install: {
    title: "@next-vibe/checker installieren",
    subtitle: "Funktioniert auf jedem TypeScript-Projekt. Nicht nur next-vibe.",
    installDescription:
      "Der Checker ist als eigenständiges npm-Paket verfügbar. Er funktioniert auf jedem TypeScript-Projekt — nicht nur NextVibe. Du brauchst keinen anderen Teil des Frameworks.",
    thenRun: "Dann ausführen:",
    mcpTitle: "MCP-Integration",
    mcpDescription:
      "Füge es zu deiner Claude Code- oder Cursor-MCP-Konfiguration hinzu. Jetzt ruft Claude Code `check` als Tool auf, nicht als Shell-Befehl. Strukturierte Fehler. Paginiert. Nach Pfad filterbar.",
    migrationNote:
      "Auf der npm-Seite gibt es auch einen Migrations-Prompt. Kopiere ihn in Claude Code oder Cursor und er wird deine Codebasis prüfen, den Checker konfigurieren und dich zu den verbotenen Mustern migrieren.",
    openSourceNote:
      "Es ist Open Source. GPL-3.0 für das Framework, MIT für das Checker-Paket.",
  },
  closing: {
    title: "Baue das System so, dass Lügen unmöglich ist",
    beforeTitle: "Vorher:",
    beforeDescription:
      "KI-unterstützte Entwicklung war eine Verhandlung. Behebe den Lint. Oh, jetzt sind die Typen kaputt. Behebe die Typen. Jetzt gibt es ein `any`, das du nicht bemerkt hast. Behebe das. Führe drei separate Tools aus. Bekomme drei separate Meinungen. Nie sicher, ob es wirklich sauber ist.",
    afterTitle: "Nachher:",
    afterDescription:
      "Ein Befehl. Ein Fehlermodus. Entweder besteht es oder nicht. Die KI weiß genau, was sie beheben muss, weil die Fehler ihr genau sagen, was falsch ist und was stattdessen zu tun ist. Keine Verhandlung.",
    finalQuote:
      "Baue das System so, dass Lügen unmöglich ist. Das ist der Zweck eines Type-Checkers.",
    ctaGitHub: "Auf GitHub ansehen",
    ctaInstall: "@next-vibe/checker installieren",
    backToBlog: "Zurück zum Blog",
  },
};
