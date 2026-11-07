import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Ein Roboter hat jeden Button geklickt. Er fand acht Sicherheitslücken.",
    description:
      "Wir haben ein End-to-End-Testframework gebaut, das die echten Seiten in einem echten Browser bedient - und jeden kundenrelevanten Endpoint abgedeckt. Das hat es gefunden.",
    category: "Engineering",
    imageAlt: "End-to-End-Tests steuern {{appName}} in einem echten Browser",
    keywords:
      "E2E-Tests, Playwright, Sicherheit, SSRF, Open Redirect, next-vibe, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Engineering",
    readTime: "7 Min. Lesezeit",
    title:
      "Ein Roboter hat jeden Button geklickt. Er fand acht Sicherheitslücken.",
    subtitle:
      "Schluss mit Einzelteil-Tests. Wir testen jetzt Seiten. Echter Browser, echter Server, echte Klicks - auf jedem Endpoint, den Kunden berühren.",
  },
  intro: {
    lead: "Unser Code bestand Typprüfung, Linter und Unit-Tests. Und hatte trotzdem Bugs. Keine exotischen - ein Reset-Formular, das das Bestätigungspasswort ignorierte, Rechnungslinks ins Leere, ein Feed mit gelöschten Threads.",
    p1: "Jeder davon steckte in der Lücke zwischen den Teilen. Die Funktion war korrekt. Die Seite drumherum nicht. Also haben wir ein Testframework gebaut, das sich nur für eins interessiert: was ein Kunde wirklich sieht und abschickt.",
  },
  why: {
    title: "Warum die echte Seite testen?",
    intro:
      "Jede Testebene fängt eine andere Art von Fehler. Nur die letzte sieht, was deine Nutzer sehen.",
    unit: {
      label: "Unit-Test",
      title: "Prüft eine Funktion",
      body: "Schnell und billig. Blind für die Verdrahtung: falsche URL, falscher Feldname, ein Button, der nie sendet.",
    },
    api: {
      label: "API-Test",
      title: "Prüft einen Request",
      body: "Beweist, dass der Server antwortet. Nie, dass die Seite diesen Request auch schickt - oder die Antwort anzeigt.",
    },
    e2e: {
      label: "End-to-End",
      title: "Prüft den ganzen Weg",
      body: "Öffnet die Seite in Chromium, tippt wie ein Mensch, klickt auf Senden, liest die Antwort direkt vom Netzwerk. Läuft es hier, läuft es für Kunden.",
    },
  },
  how: {
    title: "So funktioniert der Harness",
    intro:
      "Playwright, gesteuert aus bun test, aufgesetzt auf die Endpoint-Definitionen von next-vibe. Die Definition kennt bereits jedes Feld - der Test muss es nicht.",
    step1: {
      title: "Echte Seite öffnen",
      body: "Der Test öffnet die Kundenseite - /user/login, /story/framework - keinen Test-Stub. Getippt wird erst, wenn React das Formular übernommen hat.",
    },
    step2: {
      title: "Mit typisierten Werten ausfüllen",
      body: "Du übergibst Werte, keine Selektoren. Field-Driver lesen die Definition und bedienen die sichtbare UI - tippen, Option per Label wählen, Datei anhängen.",
    },
    step3: {
      title: "Request vom Netzwerk abgreifen",
      body: "Submit liefert die Wahrheit: Request-Body, Status, Antwort. Der Harness prüft, dass der Request exakt das enthält, was getippt wurde.",
    },
    step4: {
      title: "Einmal aufnehmen, immer abspielen",
      body: "Bezahlte Anbieter - KI-Modelle, Bild, Musik, Video - werden pro Test beim ersten Lauf aufgezeichnet und danach abgespielt. Keine Überraschungsrechnung, deterministische Läufe.",
    },
    step5: {
      title: "Abdeckung messen",
      body: "Ein Coverage-Report zählt jeden öffentlichen Endpoint: je ein Erfolg und eine Ablehnung. Lücken sind sichtbar, nicht geschätzt.",
    },
    codeCaption: "Eine komplette Spec. Keine Selektoren, keine Mocks.",
  },
  numbers: {
    title: "Die Bilanz",
    suites: "Test-Suites",
    covered: "öffentliche Endpoints voll abgedeckt",
    security: "Sicherheitslücken geschlossen",
    note: "Die restlichen Endpoints brauchen kostenpflichtige Anbieter-Keys für Suche, Scraping und Sprache, bevor sie aufgezeichnet werden können.",
  },
  security: {
    title: "Die Sicherheitslücken, die er fand",
    intro:
      "Keine davon tauchte in Typprüfung oder Unit-Tests auf. Alle tauchten auf, sobald ein echter Browser den echten Ablauf durchlief.",
    openRedirect: {
      title: "Open Redirect auf /track",
      body: "Jeder konnte einen Link bauen, der über unsere Domain auf beliebige Seiten weiterleitete. Externe Ziele brauchen jetzt eine HMAC-Signatur.",
    },
    ssrf: {
      title: "SSRF über Nutzer-URLs",
      body: "URLs, die du der KI gibst, konnten auf interne Adressen zeigen. Ein Guard löst jetzt DNS auf und prüft jeden Redirect-Schritt.",
    },
    ssrCache: {
      title: "Server-Cache zwischen Requests geteilt",
      body: "Der Query-Cache beim Server-Rendering konnte Daten eines Nutzers in die Seite eines anderen tragen. Er ist jetzt pro Request isoliert.",
    },
    systemPrompt: {
      title: "System-Prompt-Debug las jeden Thread",
      body: "Ein Debug-Endpoint prüfte nicht, wem der Thread gehört. Jetzt schon.",
    },
    publicFeed: {
      title: "Öffentlicher Feed zeigte versteckte Threads",
      body: "Versteckte und gelöschte Threads erschienen im öffentlichen Feed. Sie werden jetzt herausgefiltert.",
    },
    loginOptions: {
      title: "Login-Optionen verrieten Konten",
      body: "Die Antwort der Login-Optionen verriet, ob zu einer E-Mail ein Konto existiert. Das tut sie nicht mehr.",
    },
    resetPassword: {
      title: "Reset ignorierte die Bestätigung",
      body: "Der Bestätigungsschritt beim Passwort-Reset ignorierte das Bestätigungsfeld. Abweichungen werden jetzt abgelehnt.",
    },
    privateFiles: {
      title: "Private Dateien öffentlich gecacht",
      body: "Private Dateien kamen mit Cache-Control: public, geteilte Caches konnten sie also speichern. Jetzt sind sie privat.",
    },
  },
  broken: {
    title: "Und was einfach kaputt war",
    intro: "Nicht gefährlich - aber für echte Menschen still kaputt:",
    items: {
      attachments: "Chat-Anhang-URLs und Client-Fehlerberichte lieferten 404.",
      permissions:
        "Root-Berechtigungen wurden nie geladen - Kunden konnten in Shared nichts posten.",
      embed: "Das Einbettungs-Widget startete nicht.",
      invoices: "Links in Rechnungs-Mails lieferten 404.",
      models: "Die Modellseite war unbenutzbar.",
      music: "Musikgenerierung über OpenRouter schlug fehl.",
      fixtures: "Der Fixture-Scope der Tests ließ bezahlte Live-Calls durch.",
      pglite:
        "Lokale PGlite-Datenbanken gaben bei INSERT…RETURNING die falschen Zeilen zurück.",
      pagination: "Die Besucher-Paginierung auf /tools war kaputt.",
    },
    footer: "Dazu eine lange Liste unübersetzter Texte und Widget-Fixes.",
  },
  closing: {
    title: "Was das für dich bedeutet",
    p1: "Jede Seite, über die du dich registrierst, einloggst, bezahlst, chattest, generierst oder abonnierst, hat jetzt einen Test, der sie in einem echten Browser öffnet und tut, was du tust. Ändern wir etwas, läuft der Roboter den Weg ab, bevor du es tust.",
    p2: "Das Framework ist Teil von next-vibe. Baust du darauf, bekommen deine Endpoints denselben Harness gratis.",
  },
  cta: {
    title: "Lies den Harness. Nutz ihn für deinen Code.",
    subtitle:
      "Das E2E-Framework ist Open Source und Teil von next-vibe. Eine Spec-Datei pro Feature, direkt neben der Definition.",
    github: "Auf GitHub ansehen",
    framework: "next-vibe entdecken",
  },
};
