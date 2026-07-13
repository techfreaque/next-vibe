import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Wie mein Type-Checker die KI vom Lügen abgehalten hat - next-vibe",
    description:
      "KI nutzt `any`, um Typfehlern auszuweichen. Sie fügt eslint-disable hinzu. Sie lügt dich an. So haben wir die Feedbackschleife mit @next-vibe/checker repariert.",
    category: "TypeScript",
    imageAlt: "Type-Checker, der die KI vom Lügen abgehalten hat",
    keywords:
      "TypeScript, Type-Checker, KI-Coding, ESLint, Oxlint, any-Typ, Typsicherheit, Claude Code, next-vibe",
  },
  hero: {
    label: "TypeScript",
    readTime: "10 Min. Lesezeit",
    title: "Wie mein Type-Checker die KI vom Lügen abgehalten hat",
    subtitle:
      "KI nutzt `any`, um Typfehlern auszuweichen. Sie fügt eslint-disable hinzu. Sie lügt dich an. So haben wir die Feedbackschleife repariert.",
    quoteAiLies:
      "KI lügt dich nicht an, weil sie es will. Sie lügt dich an, weil du es zulässt.",
  },
  problem: {
    title: "Die kaputte Feedbackschleife",
    description:
      'Bitte Claude Code, ein Feature hinzuzufügen. Macht es. ESLint laufen lassen - besteht. TypeScript laufen lassen - Fehler. Bitte Claude Code, den TypeScript-Fehler zu fixen. Macht es. ESLint nochmal - schlägt jetzt fehl. Hin und her. Drei Iterationen. Die KI ist bei jedem Schritt überzeugt. Jedes Mal: "Ist gefixt."',
    fixLabel: "War es nie.",
    fixDescription:
      "Es war Whack-a-Mole mit einem Tool, das immer nur einen Linter gleichzeitig ausführt und nie das Gesamtbild sieht.",
    escapeHatch:
      'Die KI fixt den TypeScript-Fehler, indem sie eine Zeile schreibt und sagt: "Der Typfehler ist behoben."',
    smokeDetector:
      "Ja. Technisch gesehen. So wie Klebeband über dem Rauchmelder einen Feueralarm behebt.",
    introducingChecker: "Dafür hab ich @next-vibe/checker gebaut.",
  },
  anyProblem: {
    title: "Das `any`-Problem",
    subtitle: "Warum 98 % Typsicherheit dasselbe ist wie 0 %",
    graphDescription:
      "TypeScripts Typsystem ist ein Graph. Jeder Typ fließt von der Definition zur Nutzung. Wenn eine Funktion `string` zurückgibt, weiß der Aufrufer, dass es ein String ist. Die gesamte Kette wird geprüft.",
    holeInGraph: "`any` ist ein Loch in diesem Graph.",
    holeDescription:
      "Eine als `any` typisierte Variable sagt dem Compiler: Hör hier auf zu prüfen. Nicht nur für diese Variable - für alles, was sie berührt. Der Fehler taucht nicht beim `any` auf. Er taucht drei Dateien weiter auf, wenn ein zusammenhangsloses Refactoring eine Annahme bricht, die nie durchgesetzt wurde.",
    zeroErrors:
      "Null TypeScript-Fehler heißt gar nichts, wenn du 47 ungeprüfte `any`-Stellen hast.",
    zeroErrorsDescription:
      "Du hast keine typsichere Codebase. Du hast eine Codebase, bei der der Compiler an 47 Stellen aufgegeben hat und du es als bestanden gewertet hast.",
    doubleAssertion:
      "`as unknown as Whatever` ist noch schlimmer. Das ist eine doppelte Typbehauptung. Du sagst dem Compiler: Ich weiß, dass das falsch ist, und behaupte mich trotzdem durch. Das ist der Lieblings-Fluchtweg der KI.",
    bannedTitle: "Die verbotenen Muster in dieser Codebase:",
    bannedNotWarnings:
      "Keine Warnungen. Fehler. Die Prüfung schlägt fehl. Claude Code muss die Grundursache beheben oder kann nicht ausliefern.",
    psychologyNote:
      "Der Grund, warum das Fehler und keine Warnungen sind, ist genauso psychologisch wie technisch. KI-Modelle behandeln Warnungen als optional. Fehler schließen die Schleife.",
    infectionDiagramTitle: "Das `any`-Infektionsdiagramm",
    infectionDiagramSubtitle:
      "Ein `any`-Typ breitet sich durch den Graph aus und korrumpiert die nachgelagerte Typinferenz",
    infectionUnsafe: "unsicher",
    counterZeroErrors: "TypeScript-Fehler",
    counterAnyUsages: "`any`-Stellen",
  },
  checker: {
    title: "@next-vibe/checker",
    subtitle: "Ein Befehl. Drei Tools. Keine Fluchtwege.",
    mcpIntegrationTitle: "MCP-Integration",
    commandDescription:
      "Das ist der Befehl. Ein einziger. Er führt drei Tools parallel aus und gibt dir eine einheitliche Fehlerliste.",
    oxlintDescription:
      "Rust-basierter Linter. Hunderte Regeln. Läuft in Millisekunden, selbst bei großen Codebases.",
    eslintDescription:
      "Das, was Oxlint noch nicht kann: React Hooks Lint, React Compiler-Regeln, Import-Sortierung.",
    tsDescription:
      "Vollständige Typprüfung. Nicht nur die Datei, die du gerade bearbeitest - den gesamten Graph.",
    parallelNote:
      "Alle drei laufen parallel. Du bekommst eine einheitliche Fehlerliste. Fixen, bis es sauber ist.",
    timingNote:
      "Bei dieser Codebase - 4.400 Dateien - dauert das vollständige TypeScript etwa 12 Sekunden. Oxlint unter einer Sekunde. ESLint ein paar Sekunden. Parallel sind es insgesamt 12.",
    mcpNote:
      "Es gibt außerdem einen `vibe-check mcp`-Befehl, der einen MCP-Server mit einem `check`-Tool startet. Die KI führt keinen Shell-Befehl aus - sie ruft ein Tool auf, das strukturierte Fehlerdaten zurückgibt. Paginierung eingebaut. Filterung nach Pfad.",
    architectureTitle: "Die Checker-Architektur",
    architectureSubtitle:
      "Drei Tools laufen parallel, eine einheitliche Fehlerliste",
    parallel: "parallel",
    unifiedErrors: "Einheitliche Fehlerliste",
    unifiedErrorsDescription: "Eine Ausgabe. Fixen, bis es sauber ist.",
  },
  plugins: {
    title: "Eigene Plugins",
    subtitle: "Der Linter als Dokumentation",
    linterIsDocumentation:
      "Der Linter ist die Dokumentation. Und er wird durchgesetzt.",
    jsxPluginTitle: "jsx-capitalization Plugin",
    jsxPluginDescription:
      "Es markiert JSX-Elemente in Kleinbuchstaben und die Fehlermeldung sagt dir genau, was du stattdessen importieren sollst:",
    jsxPluginInsight:
      "Ich hab keine Dokumentation geschrieben, die Claude Code anweist, `next-vibe-ui` zu verwenden. Ich hab es nicht zum System-Prompt hinzugefügt. Wenn Claude Code das erste Mal `<div>` in einer Komponente schreibt, gibt der Checker einen Fehler aus. Die Fehlermeldung enthält den genauen Import-Pfad. Claude Code liest den Fehler, wendet die Korrektur an und merkt sich die Konvention.",
    restrictedSyntaxTitle: "restricted-syntax Plugin",
    restrictedSyntaxDescription: "Es verbietet drei Dinge:",
    throwBanTitle: "`throw`-Anweisungen",
    throwBanDescription:
      'Die Fehlermeldung sagt: "Nutze stattdessen ordentliche `ResponseType<T>`-Muster." Claude Code stößt darauf, liest es, sucht `ResponseType` und übernimmt das korrekte Fehlerbehandlungsmuster für den Rest der Aufgabe.',
    unknownBanTitle: "Nackter `unknown`-Typ",
    unknownBanDescription:
      "\"Ersetze 'unknown' durch eine vorhandene typisierte Schnittstelle. Richte dich an den Codebase-Typen aus, statt zu konvertieren oder neu zu erstellen.\" Das stoppt Claude Code daran, generische Typ-Fluchtwege zu schreiben.",
    objectBanTitle: "Nackter `object`-Typ",
    objectBanDescription:
      "`object` ist fast immer falsch. Entweder kennst du die Form - dann schreib das Interface - oder du meinst `Record<string, SomeType>`. Rohes `object` ist ein Zeichen dafür, dass die KI aufgegeben hat.",
    bannedPatternsTitle: "Verbotene Muster",
    bannedPatternsSubtitle:
      "Jedes verbotene Muster wird beim Prüfen erkannt. Die Fehlermeldung sagt der KI genau, was stattdessen zu tun ist.",
    bannedLabel: "VERBOTEN",
    correctLabel: "KORREKT",
  },
  demo: {
    title: "Live-Demo: Das 3-Runden-Muster",
    subtitle:
      "Schau zu, wie Claude Code dreimal gegen den Checker anrennt, bevor es den richtigen Typ findet",
    round1Title: "Runde 1 - KI schreibt `any`",
    round1Description:
      'Frag Claude Code: "Schreib eine Hilfsfunktion, die ein rohes API-Antwortobjekt nimmt und das Datenfeld extrahiert. Die Antwort kann verschiedene Formen haben - nimm whatever type makes this work."',
    round1Result: "Claude Code schreibt die einfache Lösung:",
    round1Error:
      "2 Fehler gefunden. Beide `any`. Claude Code sieht das über das MCP-Tool.",
    round2Title: "Runde 2 - KI versucht `unknown`",
    round2Description:
      "Schau, was es als Nächstes macht. Das ist der entscheidende Teil. Es versucht den nächsten Fluchtweg:",
    round2Result: "Den Trick kennt der Checker.",
    round2Error:
      "3 Fehler. `unknown` ist genauso verboten. Die Fehlermeldung sagt Claude Code genau, was stattdessen zu tun ist: die vorhandene typisierte Schnittstelle finden.",
    round3Title: "Runde 3 - KI findet den echten Typ",
    round3Description:
      "Jetzt macht Claude Code das, was es gleich hätte tun sollen. Es schaut nach, wie vorhandene API-Antworten in dieser Codebase typisiert sind. Es findet `ResponseType<T>`.",
    round3Result:
      "Null Fehler. Und die Funktion ist jetzt tatsächlich korrekt.",
    round3Insight:
      "Der Checker hat den Code nicht geschrieben. Aber er hat die Abkürzung zweimal verhindert, bis Claude Code sich mit dem eigentlichen Problem auseinandersetzen musste.",
    errorTitle: "Prüfungsausgabe",
    passTitle: "Prüfung bestanden",
  },
  endpoint: {
    title: "Die Endpoint-Verbindung",
    subtitle: "Ein Zod-Schema - vier nachgelagerte Verbraucher",
    description:
      "Jeder Endpoint hat eine Definitionsdatei. Diese Datei enthält ein Zod-Schema für die Anfrage und eines für die Antwort.",
    schemaBecomes:
      "Der `schema`-Schlüssel ist ein Zod-Validator. Dasselbe Zod-Schema wird:",
    webApiValidation: "Die Validierungsregel am Web-API-Endpoint",
    reactHookTypes:
      "Der TypeScript-Typ für den Eingabeparameter des React-Hooks",
    cliFlagsDescription:
      "Das `--name`-Flag in der CLI mit angewandten Min/Max-Constraints",
    aiToolSchema: "Die Parameterbeschreibung im KI-Tool-Schema",
    driftProblem:
      "Hier tötet dich normalerweise Drift. Du aktualisierst die API. Du vergisst das KI-Tool-Schema. Die KI ruft den Endpoint mit alten Parameternamen auf. Es schlägt lautlos fehl.",
    oneSchemaSolution:
      "Wenn es ein Schema gibt, gibt es nichts zu synchronisieren.",
    typecheckedNote:
      "Und weil der TypeScript-Checker auch darüber läuft: Wenn du das Schema so änderst, dass der abgeleitete Typ downstream bricht, bekommst du einen Compiler-Fehler. Das KI-Tool-Schema ist typgeprüft. Die CLI-Flags sind typgeprüft. Der React-Hook ist typgeprüft.",
    statsTitle: "Diese Codebase in Zahlen",
    stat245: "245 Endpoints",
    stat0any: "Null `any`",
    stat0unknown: "Null `unknown`-Casts",
    stat0tsExpect: "Null `@ts-expect-error`",
    statNote: "Nicht per Konvention. Durch den Checker.",
    diagramTitle: "Ein Zod-Schema - vier Verbraucher",
    diagramSubtitle:
      "Schema einmal ändern - alles aktualisiert sich automatisch",
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
    subtitle: "Funktioniert mit jedem TypeScript-Projekt. Nicht nur next-vibe.",
    installDescription:
      "Der Checker ist als eigenständiges npm-Paket verfügbar. Er funktioniert mit jedem TypeScript-Projekt - nicht nur NextVibe. Du brauchst keinen anderen Teil des Frameworks.",
    thenRun: "Dann ausführen:",
    mcpTitle: "MCP-Integration",
    mcpDescription:
      "Füg es zu deiner Claude Code- oder Cursor-MCP-Konfiguration hinzu. Dann ruft Claude Code `check` als Tool auf, nicht als Shell-Befehl. Strukturierte Fehler. Paginiert. Nach Pfad filterbar.",
    migrationNote:
      "Auf der npm-Seite gibt es außerdem einen Migrations-Prompt. Kopier ihn in Claude Code oder Cursor und er prüft deine Codebase, konfiguriert den Checker und migriert dich zu den verbotenen Mustern.",
    openSourceNote:
      "Open Source. GPL-3.0 für das Framework, MIT für das Checker-Paket.",
  },
  closing: {
    title: "Bau das System so, dass Lügen unmöglich ist",
    beforeTitle: "Vorher:",
    beforeDescription:
      "KI-unterstützte Entwicklung war eine Verhandlung. Fix den Lint. Oh, jetzt sind die Typen kaputt. Fix die Typen. Jetzt gibt's ein `any`, das du nicht bemerkt hast. Fix das. Drei separate Tools laufen lassen. Drei separate Meinungen bekommen. Nie sicher, ob es wirklich sauber ist.",
    afterTitle: "Nachher:",
    afterDescription:
      "Ein Befehl. Ein Fehlermodus. Entweder es besteht oder nicht. Die KI weiß genau, was sie fixen muss, weil die Fehler ihr sagen, was falsch ist und was stattdessen zu tun ist. Keine Verhandlung.",
    finalQuote:
      "Bau das System so, dass Lügen unmöglich ist. Genau dafür gibt es einen Type-Checker.",
    ctaGitHub: "Auf GitHub ansehen",
    ctaInstall: "@next-vibe/checker installieren",
    backToBlog: "Zurück zum Blog",
  },
};
