import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Hermes und Thea: Remote-Threads in beide Richtungen - {{appName}}",
    description:
      "Deine lokale KI und deine Cloud-KI führen jetzt Threads füreinander aus - in beide Richtungen. Fehlt der Instanz, die den Turn übernimmt, der API-Key, holt sich der Aufrufer die Schleife zurück und bringt sie zu Ende.",
    category: "Hermes & Thea",
    imageAlt: "Hermes und Thea - zwei verbundene next-vibe-Instanzen",
    keywords:
      "Hermes, Thea, next-vibe, Remote-Threads, selbst gehostete KI, Reverse-WebSocket, API-Key-Fallback, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Hermes & Thea",
    readTime: "6 Min. Lesezeit",
    title: "Zwei KIs. Ein Gespräch. Beide Richtungen.",
    subtitle:
      "Hermes läuft auf deinem Rechner. Thea läuft auf einem Server. Jetzt kann jede der beiden einen Thread an die andere übergeben - und ein fehlender API-Key bremst keinen Turn mehr aus.",
  },
  intro: {
    p1: "next-vibe läuft überall: auf dem Laptop, auf einem VPS, auf beidem gleichzeitig. Verbinde zwei Instanzen, und sie werden zu einem System. Unsere heißen Hermes und Thea.",
    p2: "Dieses Release schließt den Kreis: Remote-Threads laufen jetzt in beide Richtungen, und die Instanz ohne Provider-Key blockiert nichts mehr.",
  },
  who: {
    title: "Das Duo",
    intro: "Dieselbe Codebasis. Unterschiedliche Aufgaben.",
    hermes: {
      label: "Lokal",
      title: "Hermes",
      body: "Läuft auf deinem eigenen Rechner. Direkt neben deinen Dateien, deinem Terminal und deinen Coding-Agents. Dein Alltagswerkzeug.",
    },
    thea: {
      label: "Cloud",
      title: "Thea",
      body: "Läuft auf einem Server. Immer online, von überall erreichbar. Überwacht die Plattform und delegiert Arbeit.",
    },
    note: "Jede Instanz verwaltet ihre eigenen Daten und Tasks. Die Verbindung leitet Events weiter - nicht mehr und nicht weniger.",
  },
  twoWay: {
    title: "Threads wechseln jetzt in beide Richtungen",
    intro:
      "Remote-Ordner und private Threads laufen auf der jeweils anderen Instanz - von Thea zu Hermes und von Hermes zu Thea.",
    p1: "Leg einen Thread in einen Remote-Ordner, und die Instanz auf der anderen Seite übernimmt den kompletten KI-Turn: Modell, Systemprompt, Tools. Du schreibst weiter, wo du bist. Das Gespräch wird zu dir zurückgespiegelt.",
    stepsTitle: "Ein Turn, von Anfang bis Ende",
    step1Title: "Du schreibst",
    step1Body: "Eine Nachricht in einem Remote-Thread auf Hermes.",
    step2Title: "Die Verbindung leitet sie weiter",
    step2Body:
      "Über einen dauerhaften WebSocket - oder per direktem HTTP-Aufruf, wenn die Gegenseite öffentlich erreichbar ist.",
    step3Title: "Thea führt die Schleife aus",
    step3Body: "Mit ihrem Modell, ihrem Prompt, ihren Tools.",
    step4Title: "Tools laufen dort, wo sie zu Hause sind",
    step4Body:
      "Ein Tool, das nur auf Hermes existiert, wird auf Hermes aufgerufen. Das Ergebnis fließt zurück in Theas Schleife.",
    step5Title: "Der Turn landet auf beiden Seiten",
    step5Body:
      "Das fertige Gespräch synchronisiert sich zurück in deinen Spiegel.",
  },
  keyless: {
    title: "Kein API-Key? Der Turn läuft trotzdem durch.",
    intro:
      "Die Instanz, die einen Turn ausführt, braucht den API-Key des Modellanbieters. Nicht jede Instanz hat einen.",
    p1: "Bevor eine Instanz einen Turn übernimmt, prüft sie den Provider-Key auf ihrem eigenen Knoten. Fehlt er, bricht sie sofort mit einer eindeutigen Markierung ab - kein Hängen, kein halb geschriebener Thread.",
    p2: "Die aufrufende Seite erkennt die Markierung, macht ihre Relay-Buchführung rückgängig und führt die Schleife selbst aus. Prompt und Tools der Gegenseite gelten weiter; Tool-Aufrufe laufen über die Verbindung hin und zurück.",
    calloutTitle: "Der Inference-Provider-Modus braucht überhaupt keinen Key.",
    calloutBody:
      "Nutze die verbundene Instanz als Modellanbieter, und deine Seite fasst nie einen Provider-Key an. Die Verbindung ist die Modell-Leitung.",
    scenarioTitle: "Wer führt die Schleife aus?",
    scenario1Label: "Gegenseite hat den Key",
    scenario1Body:
      "Die Gegenseite führt den Turn aus. Tools laufen hin und zurück.",
    scenario2Label: "Gegenseite hat keinen Key",
    scenario2Body:
      "Die Gegenseite bricht sofort ab. Der Aufrufer führt den Turn mit ihrem Prompt und ihren Tools aus.",
    scenario3Label: "Inference-Provider-Modus",
    scenario3Body:
      "Die Provider-Instanz betreibt das Modell. Der Aufrufer braucht keinen Key.",
  },
  underTheHood: {
    title: "Unter der Haube",
    intro: "Für alle, die den Diff lesen.",
    transport:
      "Der Transportweg wird beim Verbinden ausgehandelt, nie von Hand konfiguriert. Das Ziel pingt den Initiator mit einem authentifizierten Health-Check an (maximal 5 Sekunden). Erreichbar: direktes HTTP. Hinter NAT: Die verdeckte Seite öffnet einen ausgehenden WebSocket, und jedes Relay läuft gebündelt darüber.",
    reconnect:
      "Der Connector verbindet sich mit exponentiellem Backoff von 1 bis 30 Sekunden neu und liest die Verbindung bei jedem Versuch frisch ein. Dieses Release härtet genau diesen Pfad.",
    fixesTitle: "Außerdem in diesem Release",
    fix1: "Warnung bei veraltetem Lead: Ein Frame an einen Lead, den diese Instanz nicht mehr kennt, wird mit Warnung verworfen statt stillschweigend - eine erneute Authentifizierung der Verbindung behebt es.",
    fix2: "Datenbank-Zeitstempel in UTC, für Postgres-Pool und PGlite gleichermaßen - damit Zeilen mit Standard-Zeitstempel instanzübergreifend richtig sortiert werden.",
    fix3: "Der Stream-Writer setzt die Thread-ID von Anfang an, sodass Gegenstellen keine Events mit leerer Thread-ID mehr verwerfen.",
    fix4: "Revival-Turns synchronisieren mit der Gegenseite, damit nachträglich eingefügte Tool-Ergebnisse auch im Spiegel ankommen.",
    codeCaption: "Die Markierung, die ein Empfänger ohne Key zurückschickt:",
  },
  tryIt: {
    title: "Selbst ausprobieren",
    p1: "Hoste eine Instanz selbst und lege die Verbindung unter Admin → Remote Connections an. Nur Admins können Verbindungen erstellen; die Gegenseite erhält ihren Eintrag automatisch.",
  },
  cta: {
    title: "Betreib deinen eigenen Hermes.",
    subtitle:
      "Hoste next-vibe auf deinem Rechner, verbinde es mit einem Server und lass beide die Arbeit teilen.",
    selfHost: "Zur Self-Hosting-Anleitung",
    github: "Code lesen",
  },
};
