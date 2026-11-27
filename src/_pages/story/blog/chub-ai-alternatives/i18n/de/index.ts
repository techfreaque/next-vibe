import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Chub AI Alternativen: Figurenchat, Lorebooks, Preise (2026)",
    description:
      "Chub AI nimmt nur noch Krypto und deckelt den Gratis-Chat. {{appName}}, Janitor AI, SillyTavern, RisuAI, SpicyChat, CrushOn: Preis, Filter, Gedächtnis.",
    category: "Vergleich",
    imageAlt: "Chub AI Alternativen für Figurenrollenspiel im Vergleich",
    keywords:
      "Chub AI Alternativen, Chub AI Alternative, Seiten wie Chub AI, chub.ai Alternative, Chub Venus Alternative, Character Cards Chat, unzensierte Character AI, Lorebook Rollenspiel, KI Rollenspiel ohne Filter, Chub AI App Alternative, Janitor AI vs Chub, Chub AI alternatives, sites like Chub AI, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Vergleich",
    readTime: "9 Min. Lesezeit",
    title: "Chub-AI-Alternativen für Figurenrollenspiele",
    subtitle:
      "{{count}} Alternativen und {{appName}}, geprüft an ihren eigenen Preis-, Filter- und Hilfeseiten am {{date}}.",
  },
  intro: {
    lead: "Chub hat die größte offene Bibliothek an Figurenkarten im Netz. Seit Sommer 2026 hat es auch eine Bezahlschranke nur für Krypto, ein kleines tägliches Gratiskontingent und keine offizielle iPhone-App.",
    p2: "Also: Wohin mit Ihren Figuren? Jede Option unten haben wir am {{date}} an ihren eigenen Seiten geprüft. Wir sind eine davon und sagen auch, wo Chub weiter vorne liegt.",
  },
  subject: {
    title: "Chub AI heute",
    intro:
      "Was Chubs eigene Dokumentation sagt, plus was unabhängige Tests über die Bezahlschranke berichten.",
    plans:
      "Preis: {{plans}} für die eigenen Modelle mit unbegrenzten Nachrichten, laut Chubs Dokumentation. Tester berichten, dass Kartenzahlung 2026 gestrichen wurde und der Tarif in Krypto bezahlt wird.",
    filter:
      "Filter: Chub nennt sich unzensiert und schränkt Figuren nicht ein. Karten sind als SFW oder NSFW markiert, die NSFW-Suche ist in manchen Regionen gesperrt.",
    privacy:
      "Datenschutz: Laut Chub wurden die Mars-Modelle nicht mit Chub-Chats trainiert. Mit eigenem Backend gilt für alles, was Sie senden, die Richtlinie dieses Anbieters.",
    extra:
      "Gratisweg: ein paar Testnachrichten und ein kleines Tageskontingent auf einem Basismodell, oder Sie binden einen eigenen API-Schlüssel oder ein lokales Modell an.",
  },
  why: {
    title: "Warum Nutzer sich umsehen",
    intro: "Drei Gründe tauchen immer wieder auf.",
    paywall:
      "Die Bezahlschranke hat sich verschoben. Die günstigere Mercury-Stufe ist weg, der Gratis-Chat ist pro Tag gedeckelt, Swipes zählen mit, und bezahlt wird nur noch in Krypto.",
    mobile:
      "Keine offizielle App. Chubs iOS-Eintrag ist verschwunden, Nachahmer-Apps nutzen jetzt seinen Namen.",
    setup:
      "Hürden beim Einrichten. Eine gute Sitzung setzt immer noch voraus, dass Sie sich mit Presets, Modellen und Kontexteinstellungen auskennen.",
  },
  criteria: {
    title: "Was Sie vor dem Umzug prüfen sollten",
    intro: "Fünf Fragen entscheiden, wo Ihre Figuren landen.",
    one: "Karten: Lassen sich Chubs PNG- oder JSON-Karten importieren, oder bauen Sie alles neu?",
    two: "Gedächtnis: Lorebooks, angeheftete Fakten oder Zusammenfassungen, die eine lange Geschichte zusammenhalten.",
    three:
      "Filter: Welche Inhalte für Erwachsene jede Stufe erlaubt, und ob es eine Altersprüfung gibt.",
    four: "Preis: Gratiskontingent, Pauschaltarif oder Bezahlung pro Nachricht, und wie Sie bezahlen können.",
    five: "Geräte: Browser, Handy-App oder eine lokale Installation, die Sie selbst pflegen.",
  },
  table: {
    title: "Alle im direkten Vergleich",
  },
  us: {
    title: "{{appName}}: Figuren auf jedem Modell",
    intro:
      "{{modelCount}} Modelle in einem Chat. Ihre Figur bleibt, das Modell dahinter kann pro Nachricht wechseln.",
    models:
      "Modelle: {{uncensored}} unzensierte neben {{mainstream}} Mainstream- und {{open}} offenen Modellen. {{ownModel}} ist mit Büchern und Dokumenten trainiert, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen.",
    fit: "Figuren: Starten Sie den Rollenspiel-Skill oder bauen Sie Ihre eigene Figur als Skill, dann teilen Sie sie oder behalten sie privat. Das Gedächtnis trägt Fakten über Chats hinweg.",
    privacy:
      "Datenschutz: Inkognito-Chats bleiben im lokalen Speicher Ihres Browsers, kein Konto nötig.",
    price:
      "Preis: {{guestCredits}} Gratis-Credits im Monat ohne Konto, {{freeCredits}} mit Konto, {{maxCredits}} mit Newsletter. Abos: {{planList}}, bezahlt per Karte oder Krypto. Credit-Pakete stocken ein aktives Abo auf.",
    api: "API: dieselben Modelle über OpenAI- und Anthropic-kompatible Endpunkte. Jeder Kauf schaltet sie frei.",
    weak: "Wo Chub gewinnt: Die Kartenbibliothek ist weit größer, und es gibt Lorebooks mit Stichwort-Triggern. Einen Import für Chub-Karten haben wir noch nicht, Sie fügen die Beschreibung der Figur in einen neuen Skill ein.",
    ownLink: "{{ownModel}} ansehen",
    skillLink: "Rollenspiel-Skill starten",
  },
  list: {
    title: "Die dokumentierten Alternativen im Einzelnen",
    intro:
      "Die Plattformen mit vollem Profil in unseren Vergleichsdaten, geprüft an ihren eigenen Seiten. Die übrigen stehen in der Tabelle oben.",
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
    title: "Wann Chub trotzdem die richtige Wahl ist",
    intro: "Manchmal ist das Original das bessere Angebot.",
    one: "Sie wollen die größte öffentliche Bibliothek an Community-Karten und Lorebooks an einem Ort.",
    two: "Sie betreiben schon ein eigenes Backend. Dafür taugt Chub als kostenloses Frontend.",
    three:
      "Sie zahlen ohnehin in Krypto und wollen unbegrenzte Nachrichten in einem Pauschaltarif.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Was ist die beste Alternative zu Chub AI?",
      a: "Kommt darauf an, was Ihnen fehlt. Eine große Figurenbibliothek im Browser: Janitor AI oder Character Tavern. Volle Kontrolle mit eigenen Karten und Lorebooks: SillyTavern oder RisuAI. Ein Begleiter, der sich an Sie erinnert: Kindroid oder Nomi. Figuren auf unzensierten, offenen und Mainstream-Modellen mit einem Guthaben: {{appName}}.",
    },
    free: {
      q: "Gibt es eine kostenlose Alternative zu Chub AI?",
      a: "Ja. Perchance und Character Tavern sind im Browser gratis. SillyTavern, RisuAI und KoboldCpp sind freie Software: Sie zahlen nur das Modell oder betreiben es lokal. {{appName}} gibt {{guestCredits}} Gratis-Credits im Monat ohne Konto und {{freeCredits}} mit Konto, {{maxCredits}} mit Newsletter.",
    },
    filter: {
      q: "Welche Chub-Alternativen erlauben NSFW-Rollenspiel?",
      a: "Janitor AI, CrushOn, SpicyChat und Venice erlauben Text für Erwachsene nach ihren eigenen Regeln, meist nach einer Altersprüfung. Character.AI nicht. Auf {{appName}} werden unzensierte Modelle nach einer einmaligen 18+-Bestätigung freigeschaltet. Inhalte mit Minderjährigen verbietet jeder Dienst.",
    },
    privacy: {
      q: "Welche Alternative hält mein Rollenspiel privat?",
      a: "Ein lokales Setup: SillyTavern oder KoboldCpp mit einem Modell auf dem eigenen PC schickt kein Wort nach außen. Gehostet bleiben Inkognito-Chats auf {{appName}} im lokalen Speicher Ihres Browsers. Jedes gehostete Modell sieht trotzdem die Nachrichten, die es beantwortet.",
    },
    move: {
      q: "Kann ich meine Chub-Figuren mitnehmen?",
      a: "Laden Sie die Karte bei Chub herunter. SillyTavern, RisuAI und Agnaistic importieren sie unverändert. Auf {{appName}} legen Sie einen Skill an und fügen Beschreibung, Persönlichkeit und erste Nachricht ein.",
    },
  },
  cta: {
    title: "Ihre Figuren. Jedes Modell.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Rollenspiel starten und das Modell wechseln, wenn die Geschichte es verlangt.",
    start: "Rollenspiel starten",
    chat: "Inkognito-Chat öffnen",
  },
};
