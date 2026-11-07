import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Was ist neu: sechs Monate auf einer Seite - {{appName}}",
    description:
      "Stopp heißt Stopp. Spracheingabe läuft auf dem iPhone. Deine KI arbeitet über deine Rechner hinweg. Selbst hosten ohne Docker. Und ein Test-Roboter hat acht Sicherheitslücken geschlossen. Alles seit Mai.",
    category: "Produkt-Update",
    imageAlt: "{{appName}} - Produkt-Update November 2026",
    keywords:
      "{{appName}}, Produkt-Update, Hermes, Thea, PGlite, Self-Hosting, Spracherkennung, E2E-Tests, Sicherheit",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Produkt-Update",
    readTime: "6 Min. Lesezeit",
    title: "Sechs Monate auf einer Seite: schneller, sicherer, läuft überall.",
    subtitle:
      "Stopp heißt Stopp. Spracheingabe läuft auf dem iPhone. Deine KI folgt dir über Rechner hinweg. Selbst hosten ohne Docker. Und ein Test-Roboter hat acht Sicherheitslücken geschlossen.",
  },
  intro: {
    lead: "Unser letztes Update kam im Mai. Seitdem haben wir die Codebasis bis aufs Fundament zerlegt, flacher neu aufgebaut und monatelang behoben, worüber echte Nutzer im Betrieb gestolpert sind.",
    p1: "Keine Liste mit 200 Stichpunkten. Hier steht, was du wirklich merkst - sortiert danach, wo du es merkst.",
  },
  chat: {
    title: "Ein Chat, der gehorcht",
    intro: "Die kleinen Dinge, die den Chat langsam oder stur wirken ließen.",
    stop: {
      title: "Stopp heißt Stopp",
      body: "Ein Klick auf Stopp und es erscheinen sofort keine Tokens mehr - kein Warten, bis der Server aufgeräumt hat. Stopp greift jetzt auch in Inkognito- und Gast-Chats, wo es vorher gar nichts tat.",
    },
    input: {
      title: "Eingabe passend zum Modell",
      body: "Das Eingabefeld weiß, wie viel Platz das gewählte Modell in diesem Thread noch hat - statt einem starren Limit für alle Modelle.",
    },
    reasoning: {
      title: "Modelle behalten den Faden",
      body: "Reasoning-Blöcke gehen in der nächsten Runde zurück ans Modell, statt gelöscht zu werden - Denkmodelle bauen auf dem auf, was sie schon erarbeitet haben.",
    },
    queue: {
      title: "Schreiben, während sie arbeitet",
      body: "Schick Nachrichten, während die KI noch antwortet - sie reihen sich der Reihe nach ein. Lange Tool-Läufe verdichten ihren Kontext unterwegs, statt an die Wand zu fahren.",
    },
  },
  voice: {
    title: "Spracheingabe, die überall läuft",
    intro: "Speech-to-Text hat die Aufmerksamkeit bekommen, die es brauchte.",
    ios: {
      title: "iPhone und iPad repariert",
      body: "Safari auf iOS hat die Audio-Engine pausiert, das Diktat starb lautlos. Jetzt wird sie korrekt fortgesetzt.",
    },
    long: {
      title: "Nimm so lange auf, wie du willst",
      body: "Aufnahmen werden in Stücke geteilt - das Diktat ist nicht mehr durch einen einzelnen Upload begrenzt.",
    },
    windows: {
      title: "Windows repariert",
      body: "Eine Reihe von Fixes bringt Speech-to-Text auf Windows-Desktops zum Laufen.",
    },
  },
  agents: {
    title: "Deine KI, über deine Rechner hinweg",
    intro:
      "Thea läuft in der Cloud. Hermes läuft auf deinem Computer. Jetzt arbeiten sie wirklich zusammen.",
    twoWay: {
      title: "Remote-Threads in beide Richtungen",
      body: "Gib einen Thread von der Cloud an deinen Rechner ab oder zurück - in beide Richtungen. Hat die andere Seite keinen API-Key, springt deine Seite ein und führt ihn lokal aus.",
      link: "So sprechen Hermes und Thea",
    },
    coding: {
      title: "Ein Coding-Agent zum Zuschauen",
      body: "Thea kann auf deinem Rechner einen interaktiven Coding-Agenten starten - ein echtes Konsolenfenster, das du siehst - als Task verfolgt, mit Ergebnis-Rückmeldung.",
      link: "Lern den Coding-Agenten kennen",
    },
    tools: {
      title: "Schärfere Werkzeuge",
      body: "Bessere Browser-Automatisierung mit Geräte-Emulation, Desktop-Tools unter Windows und SSH-Tools für alle Kunden - nicht nur für Admins.",
    },
  },
  selfHost: {
    title: "Selbst hosten ist jetzt einfach",
    intro: "Eine eigene Instanz hieß früher Docker plus C++-Toolchain. Vorbei.",
    pglite: {
      title: "Kein Docker nötig",
      body: "Setz DATABASE_URL auf eine Datei und der Server läuft auf einem eingebetteten Postgres (PGlite). Migrationen und Seeds funktionieren einfach.",
    },
    windows: {
      title: "Windows ist vollwertig",
      body: "Monate an Windows-Fixes: Pfade, Datei-Locks, Nutzer-Seeding, Datenbankfunktionen. Klonen, installieren, starten.",
    },
    native: {
      title: "Kein Compiler nötig",
      body: "Passwort-Hashing nutzt jetzt vorkompilierte Binaries - kein node-gyp, keine Build-Tools. Gleicher Algorithmus, bestehende Hashes bleiben gültig.",
    },
    revive: {
      title: "Steht von selbst wieder auf",
      body: "Der Produktionsserver startet nach einem Absturz neu, und ein Datenbank-Neustart reißt die App nicht mehr mit.",
    },
  },
  security: {
    title: "Sicher ab Werk",
    intro: "Sicherheitsarbeit, die du nie siehst - genau darum geht es.",
    e2e: {
      title: "Ein Roboter testet jede Seite",
      body: "60 End-to-End-Suites bedienen jetzt die echten Seiten in einem echten Browser. Sie fanden acht Sicherheitslücken, die wir geschlossen haben - vom Open Redirect bis zu öffentlich gecachten privaten Dateien.",
      link: "Lies, was er gefunden hat",
    },
    patches: {
      title: "Gepatchtes Basis-Image",
      body: "Unser Container zieht die neuesten Alpine-Sicherheitspatches, inklusive des Fixes für CVE-2026-111497.",
    },
    toolCalls: {
      title: "Weniger kaputte Tool-Calls",
      body: "Schickt ein Modell fehlerhaftes Tool-Call-JSON, wird es repariert, statt die ganze Runde scheitern zu lassen.",
    },
  },
  cta: {
    title: "Überzeug dich selbst.",
    subtitle:
      "Alles oben ist heute live auf {{appName}} - und im Open-Source-Code, wenn du selbst hostest.",
    chat: "Jetzt chatten",
    selfHost: "Selbst hosten",
  },
};
