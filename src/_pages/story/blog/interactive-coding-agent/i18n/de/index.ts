import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Deine KI übergibt den Job an Claude Code - {{appName}}",
    description:
      "Mit dem Coding-Agent-Tool delegiert deine KI echte Code-Änderungen an Claude Code oder OpenCode - im Hintergrund oder als Live-Session in einem echten Terminalfenster, die sich nach getaner Arbeit zurückmeldet. Jetzt auch instanzübergreifend.",
    category: "Coding-Agent",
    imageAlt:
      "Interaktiver Coding-Agent - Claude Code in einem Terminalfenster",
    keywords:
      "Coding-Agent, Claude Code, OpenCode, KI-Terminal, MCP complete-task, selbst gehostete KI, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Coding-Agent",
    readTime: "5 Min. Lesezeit",
    title: "Deine KI öffnet ein Terminal und übergibt an Claude Code.",
    subtitle:
      "Chat-KIs reden über Code. Coding-Agents ändern ihn. Das Coding-Agent-Tool verbindet beides - und im interaktiven Modus siehst du der Arbeit in einem echten Terminalfenster zu.",
  },
  intro: {
    p1: "Du bittest deine KI, einen fehlschlagenden Test zu reparieren. Sie kann dir den Fix erklären. Sie kann aber nicht dein Repo bearbeiten, die Suite laufen lassen und nachbessern, bis alles grün ist. Claude Code und OpenCode schon.",
    p2: "Das Coding-Agent-Tool übergibt die Aufgabe an einen von beiden - auf dem Rechner, auf dem der Code liegt - und holt das Ergebnis zurück in dein Gespräch.",
  },
  modes: {
    title: "Zwei Modi",
    intro: "Abschicken und einsammeln - oder zuschauen und steuern.",
    batch: {
      label: "Standard",
      title: "Batch",
      body: "Läuft im Hintergrund. Sammelt alles ein, was der Agent ausgibt, und liefert es ins Gespräch. Bricht nach 30 Minuten ab.",
    },
    interactive: {
      label: "Zuschauen und steuern",
      title: "Interaktiv",
      body: "Öffnet ein echtes Terminalfenster mit einer Live-Session. Verfolge jeden Schritt, beantworte Rückfragen, lenke um. Kein Zeitlimit - das Ergebnis landet in deinem Thread, sobald sich die Session zurückmeldet.",
    },
  },
  handBack: {
    title: "Wie das Ergebnis zurückfindet",
    intro:
      "Die Terminal-Session ist ein eigener Prozess. So landet ihre Antwort trotzdem im richtigen Thread.",
    step1Title: "Deine KI ruft das Tool auf",
    step1Body: "Mit deinem Prompt und eingeschaltetem interaktivem Modus.",
    step2Title: "Ein verfolgter Task entsteht",
    step2Body: "Der Thread wartet auf diesen Task - nicht auf das Terminal.",
    step3Title: "Ein Terminalfenster öffnet sich",
    step3Body:
      "Terminal unter macOS, dein $TERMINAL oder der erste gefundene Emulator unter Linux, eine frische PowerShell-Konsole unter Windows.",
    step4Title: "Der Agent bekommt seinen Auftrag",
    step4Body:
      "Der Prompt enthält eine zusätzliche Zeile: Wenn du fertig bist, rufe complete-task auf dem MCP-Server dieser Instanz mit dieser Task-ID auf.",
    step5Title: "Das Ergebnis landet in deinem Thread",
    step5Body:
      "complete-task liefert die Ausgabe, und das Gespräch geht weiter.",
    codeCaption:
      "Die Zeile, die an jeden interaktiven Claude-Code-Prompt angehängt wird:",
  },
  whatsNew: {
    title: "Neu: funktioniert instanzübergreifend",
    intro:
      "Thea in der Cloud kann Hermes auf deinem Rechner jetzt bitten, eine Coding-Session zu starten.",
    item1:
      "Auf der entfernten Instanz läuft die Session als verfolgter Hintergrund-Task - nichts blockiert, während du im Terminal arbeitest.",
    item2:
      "Meldet sich die Session über complete-task, wird das echte Ergebnis an die anfragende Instanz zurückgeleitet.",
    item3:
      "Unter Windows öffnet sich ein echtes Konsolenfenster. Der Befehl wird vorher in ein PowerShell-Skript geschrieben, damit Prompts mit Anführungszeichen, Klammern oder Zeilenumbrüchen unbeschädigt ankommen.",
    item4:
      "Eine vom lokalen Rechner gestartete Session darf zu jedem Task berichten, der ihrer eigenen Instanz gehört.",
    item5:
      "Kein Live-Kanal für die Rückmeldung? Dann fällt der interaktive Modus auf Batch zurück, und der Aufrufer bekommt trotzdem eine Antwort.",
  },
  tryIt: {
    title: "Selbst ausprobieren",
    p1: "Das Tool ist Admins vorbehalten und läuft auf selbst gehosteten Instanzen: Es startet eine Coding-CLI mit vollen Rechten in deinem Projektordner. Auf dem Rechner müssen Claude Code oder OpenCode installiert und angemeldet sein.",
    p2: "Dann einfach im Chat fragen - oder direkt aus dem Terminal aufrufen:",
  },
  cta: {
    title: "Gib deiner KI Hände.",
    subtitle:
      "Hoste next-vibe selbst, melde dich einmal bei Claude Code an und lass deine KI Code-Änderungen auf ihrem eigenen Rechner ausliefern.",
    selfHost: "Zur Self-Hosting-Anleitung",
    framework: "next-vibe entdecken",
  },
};
