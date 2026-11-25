import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "SillyTavern Alternativen: Rollenspiel ohne Einrichtung (2026)",
    description:
      "SillyTavern ist gratis, braucht aber Node.js, ein Backend und läuft nicht auf dem iPhone. {{appName}}, RisuAI, Agnaistic, KoboldCpp, Janitor AI, LM Studio und mehr im Vergleich.",
    category: "Vergleich",
    imageAlt: "SillyTavern Alternativen, gehostet und lokal, im Vergleich",
    keywords:
      "SillyTavern Alternativen, SillyTavern Alternative, Apps wie SillyTavern, SillyTavern iPhone, SillyTavern online, SillyTavern ohne Installation, RisuAI vs SillyTavern, KoboldCpp, Agnaistic, KI Rollenspiel Frontend, SillyTavern alternatives, SillyTavern alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Vergleich",
    readTime: "9 Min. Lesezeit",
    title: "SillyTavern-Alternativen ohne Einrichtung",
    subtitle:
      "{{count}} Alternativen und {{appName}}, von anderen Open-Source-Frontends bis zum gehosteten Chat. Geprüft an ihren eigenen Seiten am {{date}}.",
  },
  intro: {
    lead: "SillyTavern ist das Profiwerkzeug für KI-Rollenspiel. Gratis, Open Source, bis ins Letzte konfigurierbar. Es verlangt aber auch Node.js, ein Modell-Backend, eine Konfigurationsdatei und auf dem Handy Termux.",
    p2: "Manche lieben genau das. Andere wollen einfach schreiben. Hier sind die Alternativen, von Open-Source-Klonen mit denselben Karten bis zu gehosteten Apps ohne Installation, geprüft am {{date}}.",
  },
  subject: {
    title: "SillyTavern heute",
    intro:
      "Version 1.19.1 erschien am 19. November 2026. Was die Dokumentation des Projekts selbst sagt.",
    plans:
      "Preis: gratis und Open Source (AGPL-3.0). Die Entwickler betreiben keinen gehosteten Dienst. Sie zahlen also die Modell-API, die Sie anbinden, oder mit einem lokalen Modell gar nichts.",
    filter:
      "Filter: kein eigener. Was erlaubt ist, entscheidet das angebundene Modell oder der Anbieter.",
    privacy:
      "Datenschutz: Chats liegen im Datenordner Ihrer eigenen Installation. Was Sie an eine Cloud-API senden, unterliegt der Richtlinie dieses Anbieters.",
    extra:
      "Einrichtung: Node.js 20 oder neuer, Git, dann ein Backend. Android betreibt es über Termux, auf dem iPhone lässt es sich gar nicht installieren. Fernzugriff braucht eine Whitelist oder ein Passwort, und die Dokumentation warnt davor, es offen ins Internet zu stellen.",
  },
  why: {
    title: "Warum Nutzer sich umsehen",
    intro: "Dieselben vier Klagen, in den Worten des Projekts selbst.",
    setup:
      "Backend-Einrichtung. Lokale Backends können kompliziert sein, und das Team leistet dafür keinen Support.",
    mobile:
      "Handy. Android braucht Termux und kann den Server im Hintergrund beenden. Für das iPhone gibt es keinen Installationsweg.",
    security:
      "Sicherheit ist Ihre Sache. Version 1.19.1 hat behoben, dass Skripte aus Figurenkarten und importierten Chats ausgeführt wurden.",
    cost: "Doppelt zahlen. Ein verwalteter Host kassiert allein fürs Hosting, die Modell-API kommt obendrauf.",
  },
  criteria: {
    title: "Was Sie vor dem Wechsel prüfen sollten",
    intro: "Fünf Fragen sortieren die Optionen.",
    one: "Installation: Browser, Desktop-App oder ein Server, den Sie betreiben und patchen.",
    two: "Karten: Importiert es SillyTavern- und Chub-Karten als PNG oder JSON samt Lorebooks?",
    three:
      "Modelle: eigener API-Schlüssel, lokaler Betrieb oder Modelle inklusive.",
    four: "Funktionen: Gruppenchats, Lorebooks, Bilderzeugung und Stimme.",
    five: "Kosten: freie Software plus API-Gebühren, ein Pauschaltarif oder Bezahlung pro Nachricht.",
  },
  table: {
    title: "Alle im direkten Vergleich",
  },
  us: {
    title: "{{appName}}: keine Installation, Modelle inklusive",
    intro:
      "Browser öffnen, auf jedem Gerät, auch auf dem iPhone. {{modelCount}} Modelle sind schon angebunden, Sie müssen keinen API-Schlüssel einfügen.",
    models:
      "Modelle: {{uncensored}} unzensierte neben {{mainstream}} Mainstream- und {{open}} offenen Modellen. {{ownModel}} ist mit Büchern und Dokumenten trainiert, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen.",
    fit: "Figuren: der Rollenspiel-Skill oder Ihre eigene Figur als Skill. Das Gedächtnis behält Fakten über Chats hinweg, und {{imageModels}} Bildmodelle illustrieren eine Szene im selben Thread.",
    privacy:
      "Datenschutz: Inkognito-Chats bleiben im lokalen Speicher Ihres Browsers, kein Konto nötig.",
    price:
      "Preis: {{guestCredits}} Gratis-Credits im Monat ohne Konto, {{freeCredits}} mit Konto. Abos: {{planList}}. Ein Guthaben für jedes Modell.",
    api: "API: OpenAI- und Anthropic-kompatible Endpunkte, Sie können SillyTavern also weiterhin auf unsere Modelle zeigen lassen. Jeder Kauf schaltet sie frei.",
    weak: "Wo SillyTavern gewinnt: volle Kontrolle über Prompts, Presets und Erweiterungen, Gruppenchats, Lorebooks und Kartenimport. Unsere Software ist auch Open Source, aber eine Plattform, kein Rollenspiel-Werkzeugkasten.",
    ownLink: "{{ownModel}} ansehen",
    skillLink: "Rollenspiel-Skill starten",
  },
  list: {
    title: "Die dokumentierten Alternativen im Einzelnen",
    intro:
      "Die Plattformen mit vollem Profil in unseren Vergleichsdaten, geprüft an ihren eigenen Seiten. Die Open-Source-Frontends stehen in der Tabelle oben.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modelle:",
    filter: "Filter:",
    price: "Preis:",
    priceValue: "Gratis-Stufe: {{free}}. Bezahlt: {{plans}}.",
    pro: "Stärke:",
    con: "Haken:",
    forWho: "Passt, wenn:",
    versusLink: "{{appName}} vs. {{name}}: der ganze Vergleich",
    visit: "{{name}} besuchen",
  },
  stay: {
    title: "Wann SillyTavern trotzdem die richtige Wahl ist",
    intro: "Für viele Power-User ist es das.",
    one: "Sie betreiben Modelle lokal und wollen, dass nichts Ihren Rechner verlässt.",
    two: "Sie leben in Erweiterungen, Presets, Regex-Regeln und Gruppenchats.",
    three:
      "Sie haben schon API-Schlüssel und wollen ein Frontend für alle. Unserer kann einer davon sein.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Was ist die beste Alternative zu SillyTavern?",
      a: "Der nächste Klon: RisuAI, Open Source mit Lorebooks, Gruppenchats und Webversion. Lokal und einfach: KoboldCpp oder LM Studio. Gehostete Figurenbibliothek: Janitor AI oder Chub. Nichts zu installieren, Modelle inklusive: {{appName}}.",
    },
    free: {
      q: "Gibt es eine kostenlose Alternative zu SillyTavern?",
      a: "RisuAI, Agnaistic, KoboldCpp und Talemate sind freie Software. Das Modell zahlen Sie trotzdem, außer Sie betreiben es auf eigener Hardware. {{appName}} gibt {{guestCredits}} Gratis-Credits im Monat ohne Konto und {{freeCredits}} mit Konto, Modelle inklusive.",
    },
    filter: {
      q: "Welche Alternativen erlauben unzensiertes Rollenspiel?",
      a: "Frontends übernehmen die Regeln des Modells, wählen Sie also ein unzensiertes Modell. Lokal betreiben KoboldCpp oder LM Studio abliterierte Modelle. Gehostet bietet {{appName}} {{uncensored}} unzensierte Modelle nach einer einmaligen 18+-Bestätigung. Janitor AI und Chub erlauben Rollenspiel für Erwachsene nach ihren eigenen Regeln.",
    },
    privacy: {
      q: "Ist eine gehostete Alternative so privat wie SillyTavern?",
      a: "Nicht ganz. Ein lokales Modell hält alles auf Ihrem Rechner. Ein gehostetes Modell sieht immer den Prompt, den es beantwortet. Inkognito auf {{appName}} hält den Verlauf in Ihrem Browser statt auf einem Server.",
    },
    move: {
      q: "Kann ich SillyTavern auf dem iPhone nutzen?",
      a: "Nicht direkt. Sie hosten es auf einem PC oder Server und öffnen es in Safari, das heißt: Fernzugriff einrichten. Eine Web-App wie {{appName}} oder Janitor AI läuft auf dem iPhone ohne diesen Schritt.",
    },
  },
  cta: {
    title: "Einrichtung überspringen. Geschichte behalten.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto und kein API-Schlüssel nötig.",
    start: "Rollenspiel starten",
    chat: "Inkognito-Chat öffnen",
  },
};
