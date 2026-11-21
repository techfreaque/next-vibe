import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Venice AI Alternativen: privat, unzensiert, verglichen (2026)",
    description:
      "Venice AI Alternativen im Vergleich, geprüft an ihren eigenen Preis-, Datenschutz- und Filterseiten: NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter, LM Studio und {{appName}}. Modelle, API, Gratis-Stufen und für wen sich was lohnt.",
    category: "Vergleich",
    imageAlt: "Venice AI Alternativen im direkten Vergleich",
    keywords:
      "Venice AI Alternativen, Venice AI Alternative, Seiten wie Venice AI, Venice.ai Alternative, private unzensierte KI, unzensierter KI-Chat Alternative, Venice AI vs NanoGPT, Venice AI vs FreedomGPT, unzensierte KI mit API, privater KI-Chat, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Vergleich",
    readTime: "9 Min. Lesezeit",
    title: "Venice AI Alternativen. Privat, unzensiert, geprüft.",
    subtitle:
      "{{count}} Alternativen und {{appName}}, verglichen anhand dessen, was ihre eigenen Preis-, Datenschutz- und Filterseiten sagen. Geprüft am {{date}}.",
  },
  intro: {
    lead: "Venice ist mit zwei Versprechen groß geworden: privat und unzensiert. Beides hält es zu einem guten Teil. Aber die Gratis-Stufe ist knapp, der Erwachsenenfilter braucht Pro, und nicht jeder will eine Krypto-Staking-Ebene neben seinem Chat.",
    p2: "Hier sind die Alternativen, geprüft an ihren eigenen Preis-, Datenschutz- und Filterseiten am {{date}}. Offen gesagt: Wir kaufen bei Venice ein. {{appName}} leitet heute {{veniceModels}} Modelle über Venice, davon {{veniceUncensored}} unzensiert. Wir sagen auch, wo Venice gewinnt.",
  },
  criteria: {
    title: "Was Sie vor dem Wechsel vergleichen sollten",
    intro: "Fünf Fragen entscheiden.",
    privacy:
      "Datenschutz: Wo liegen Ihre Chats, und trainiert jemand damit? Auf dem Gerät, auf dem Server oder zur Modellverbesserung genutzt.",
    models:
      "Modelle: Wie viele unzensierte, welcher Art, und erreichen Sie Claude, GPT und Gemini am selben Ort?",
    filter:
      "Filter: Was ist in der Gratis-Stufe erlaubt, was braucht ein Abo, und gibt es eine Altersprüfung?",
    price:
      "Preis: Gratis-Kontingent, Abo oder Bezahlung pro Nutzung. Und was passiert, wenn das Limit erreicht ist.",
    api: "API: Lassen sich dieselben Modelle aus Code aufrufen, und in welchem Format?",
  },
  table: {
    title: "Alle im direkten Vergleich",
    intro:
      "Auf dem Handy seitwärts scrollen. Angaben der Mitbewerber am {{date}} auf deren eigenen Seiten geprüft. Angaben zu {{appName}} live aus unserer Konfiguration. Venice schließt die Tabelle als Referenz ab.",
  },
  us: {
    title: "{{appName}}: ein Chat, jede Art von Modell",
    intro:
      "{{modelCount}} Modelle in einem Chat mit einem Guthaben. Die Filterstufe wählen Sie pro Nachricht.",
    models:
      "Modelle: {{uncensored}} unzensierte neben {{mainstream}} Mainstream- und {{open}} offenen Modellen. Wechsel mitten im Chat. {{ownModel}} ist mit Büchern und Dokumenten trainiert, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit politischen Gegenpositionen.",
    venice:
      "Venice an Bord: {{veniceModels}} unserer Modelle laufen über Venice, darunter {{veniceExamples}}. Dieselben Modelle, ein Konto mit allen anderen.",
    privacy:
      "Datenschutz: Inkognito-Chats bleiben im lokalen Speicher Ihres Browsers, kein Konto nötig. Private Chats werden nur in Ihrem Konto gespeichert.",
    price:
      "Preis: {{guestCredits}} Gratis-Credits im Monat ohne Konto, {{freeCredits}} mit Konto. Abos ab {{subPrice}} im Monat. Credit-Pakete stocken ein aktives Abo auf und verfallen nie.",
    api: "API: dieselben Modelle über OpenAI- und Anthropic-kompatible Endpunkte. Jedes Abo ab {{apiSubPrice}} im Monat schaltet sie frei.",
    weak: "Wo wir schwächer sind: Der Katalog von Venice ist größer, und bei den eigenen Modellen ist Venice pro Token günstiger, weil wir auf unseren Einkaufspreis einen Aufschlag nehmen. Keine Staking-Ebene wie VVV oder DIEM.",
    directoryLink: "Alle abliterierten Modelle mit Kontext und Preis",
    ownLink: "{{ownModel}} ansehen",
  },
  list: {
    title: "Die {{count}} Alternativen im Einzelnen",
    intro:
      "Von ihren eigenen Seiten, geprüft am {{date}}. Was jede ist, welche Modelle sie hat, was ihr Filter erlaubt und was mit Ihren Chats passiert.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modelle:",
    filter: "Filter:",
    privacy: "Datenschutz:",
    price: "Preis:",
    priceValue: "Gratis-Stufe: {{free}}. Bezahlt: {{plans}}.",
    pro: "Stärke:",
    con: "Haken:",
    forWho: "Passt, wenn:",
    versusLink: "{{appName}} vs. {{name}}: der ganze Vergleich",
    visit: "{{name}} besuchen",
  },
  privacy: {
    title: "Datenschutz: die stärkste Karte von Venice",
    intro:
      "Die meisten schauen wegen des Datenschutzes auf Venice. So schlägt sich der Rest.",
    us: "Auf {{appName}} liegen Inkognito-Chats im lokalen Speicher Ihres Browsers, nicht auf unseren Servern. Browserdaten löschen, und sie sind weg.",
    transit:
      "Jedes gehostete Modell sieht trotzdem Ihren Prompt. Venice, NanoGPT, wir: Die Nachricht muss den Server erreichen, auf dem das Modell läuft. Nur ein lokales Tool behält sie auf Ihrem Rechner.",
    callout:
      "Ein Verlauf auf dem Gerät hält Ihre Chats von Firmenservern fern. Vor dem Modell, das die Antworten schreibt, verbirgt er sie nicht.",
  },
  stay: {
    title: "Wann Venice trotzdem die richtige Wahl ist",
    intro: "Manchmal ist das Original das bessere Angebot.",
    crypto:
      "Sie halten VVV oder DIEM oder wollen API-Aufrufe ohne Konto bezahlen. Das bietet sonst niemand auf dieser Liste in dieser Form.",
    versusLink: "{{appName}} vs. Venice: der ganze Vergleich",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Was ist die beste Alternative zu Venice AI?",
      a: "Kommt darauf an, warum Sie wechseln. Bezahlung pro Nutzung und eine riesige Modellliste: NanoGPT. Volle Privatsphäre: LM Studio auf dem eigenen Rechner. Ein direktes Modell mit eigenem Weltbild: uncensored.ai. Unzensierte, offene und Mainstream-Modelle plus Medien in einem Chat mit einem Guthaben: {{appName}}.",
    },
    free: {
      q: "Gibt es eine kostenlose Alternative zu Venice AI?",
      a: "Ja. FreedomGPT startet gratis ohne Konto. LM Studio ist auf eigener Hardware kostenlos. {{appName}} gibt {{guestCredits}} Gratis-Credits im Monat ohne Konto und {{freeCredits}} mit Konto, unzensierte Modelle nach einmaliger 18+-Bestätigung inklusive.",
    },
    private: {
      q: "Welche Venice-Alternative ist am privatesten?",
      a: "Ein lokales Tool wie LM Studio: Das Modell läuft auf Ihrem Gerät, Prompts verlassen es nie. Unter den gehosteten Optionen halten NanoGPT und der Inkognito-Modus von {{appName}} den Chatverlauf im Browser. Jedes gehostete Modell sieht trotzdem den Prompt, den es beantwortet.",
    },
    api: {
      q: "Welche Alternative hat eine unzensierte API?",
      a: "NanoGPT, uncensored.ai, Gab AI, OpenRouter und {{appName}} bieten alle OpenAI-kompatible APIs. Die Auswahl an unzensierten Modellen unterscheidet sich stark: OpenRouter hat wenige, NanoGPT viele. Auf {{appName}} schaltet jedes Abo ab {{apiSubPrice}} im Monat die API frei.",
    },
    same: {
      q: "Kann ich die Modelle von Venice auch woanders nutzen?",
      a: "Einige. {{appName}} betreibt {{veniceModels}} Modelle über Venice, darunter {{veniceExamples}}, im selben Chat wie Claude, GPT und die anderen. Auch OpenRouter und NanoGPT führen Venice Uncensored.",
    },
    account: {
      q: "Brauche ich ein Konto zum Ausprobieren?",
      a: "Auf {{appName}} nicht: Der Inkognito-Chat funktioniert ohne. Ein kostenloses Konto hält Chats geräteübergreifend und hebt das Gratis-Kontingent auf {{freeCredits}} Credits im Monat.",
    },
    noGpuLink: "Unzensiertes LLM online nutzen, ganz ohne GPU",
    apiLink: "Unzensierte LLM-API: Modell-IDs, Code und Limits",
  },
  cta: {
    title: "Privat, wenn Sie wollen. Unzensiert, wenn Sie es brauchen.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Inkognito starten und ein beliebiges Modell wählen.",
    start: "Inkognito-Chat starten",
    models: "Alle Modelle vergleichen",
  },
};
