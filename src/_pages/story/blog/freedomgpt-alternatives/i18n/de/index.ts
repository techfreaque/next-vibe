import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "FreedomGPT Alternativen: unzensierte KI-Apps im Vergleich (2026)",
    description:
      "FreedomGPT im Vergleich mit {{appName}}, Venice und Poe in der Cloud sowie LM Studio, Ollama und Jan für den Offline-Einsatz. Preise, Filter und Datenschutz.",
    category: "Vergleich",
    imageAlt: "FreedomGPT Alternativen im direkten Vergleich",
    keywords:
      "FreedomGPT Alternative, FreedomGPT Alternativen, Seiten wie FreedomGPT, Apps wie FreedomGPT, FreedomGPT vs Venice, FreedomGPT Liberty, FreedomGPT Desktop Alternative, unzensierte KI App, KI ohne Zensur, unzensierter KI-Chat, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Vergleich",
    readTime: "9 Min. Lesezeit",
    title: "FreedomGPT-Alternativen für Cloud und Offline-KI",
    subtitle:
      "{{count}} Alternativen und {{appName}}, verglichen mit dem, was ihre eigenen Preis-, Datenschutz- und Filterseiten sagen.",
  },
  intro: {
    lead: "FreedomGPT verspricht ein Abo für Hunderte Modelle, zensurfreie inklusive. Gute Idee. Die Haken stehen in der eigenen FAQ, in der Datenschutzerklärung und in einer Desktop-App, die seit Jahren niemand mehr aktualisiert.",
    p2: "Hier steht, was FreedomGPT tatsächlich zusagt, was seine Credits wirklich wert sind, und {{count}} Alternativen, geprüft auf ihren eigenen Seiten. Stand FreedomGPT: {{fgDate}}, Stand der übrigen: {{date}}. Wo sie besser sind als wir, sagen wir es.",
    relation:
      "Offen gesagt: Wir sind Kunde bei FreedomGPT. {{freedomGptExamples}} läuft bei {{appName}} über die API von FreedomGPT selbst.",
  },
  fg: {
    title: "Was FreedomGPT bietet",
    intro:
      "Laut Startseite, Preisseite, Datenschutzerklärung, API-Doku und GitHub, gelesen am {{fgDate}}.",
    models:
      "Modelle: Die Startseite nennt über 400 Modelle in einem Abo, darunter ChatGPT, Claude, Gemini, Grok, Kimi, GLM, DeepSeek, Qwen, Llama und Mistral, dazu unzensierte Optionen für Schreiben, Rollenspiel und Recherche.",
    filter:
      "Filter: Laut eigener FAQ garantiert das Etikett zensurfrei nicht, dass jede Anfrage beantwortet wird. Modell- und Dienstregeln gelten weiter.",
    price:
      "Preis: kostenlos testen ohne Karte und ohne Konto. Pro kostet {{proPrice}} im Monat für {{proCredits}} Credits. Eigene Schätzung: etwa {{replyCost}} Credits pro Premium-Antwort, {{imageCost}} pro Bild, {{videoCost}} pro Fünf-Sekunden-Video.",
    bonus:
      "Anmeldebonus: 100 Credits, aber nur für berechtigte neue Google-, Apple- oder X-Konten. Wer sich mit E-Mail und Passwort registriert, bekommt keine.",
    privacy:
      "Datenschutz: Die Startseite rät ausdrücklich, weder Anonymität noch Null-Speicherung anzunehmen. Laut Datenschutzerklärung gehen Nachrichten, Sprachaufnahmen und Bilder an externe KI-Anbieter. Eine Speicherdauer nennt sie nicht.",
    apps: "Apps und API: Web, iPhone, iPad und Android. Den API-Schlüssel gibt es im Dashboard, Preise nennt die Doku nicht. Der letzte Commit der quelloffenen Desktop-App stammt vom {{desktopDate}}.",
    why: "Warum Leute weitersuchen: Sie wollen wissen, was ein Monat wirklich bringt, eine Offline-App, die noch gepflegt wird, oder eine Datenschutzregel, die Chats von fremden Servern fernhält.",
    sourceHome: "Startseite von FreedomGPT",
    sourcePricing: "Preise von FreedomGPT",
    sourcePrivacy: "Datenschutzerklärung von FreedomGPT",
    sourceApi: "API-Doku von FreedomGPT",
    sourceRepo: "Desktop-Repository von FreedomGPT",
  },
  credits: {
    title: "Was {{proPrice}} im Monat bei FreedomGPT bringen",
    intro:
      "{{proCredits}} Credits, geteilt durch die eigenen Schätzwerte von FreedomGPT. Eins davon, oder gemischt.",
    replies: "Rund {{replies}} Premium-Antworten zu je {{replyCost}} Credits.",
    images: "Oder rund {{images}} Bilder zu je {{imageCost}} Credits.",
    videos: "Oder {{videos}} Fünf-Sekunden-Videos zu je {{videoCost}} Credits.",
    us: "Bei {{appName}} zeigt jede Modellseite den aktuellen Preis pro Nachricht, bevor du sendest. Tarife beginnen bei {{subPrice}} im Monat für {{subCredits}} Credits. Günstige Modelle strecken einen Tarif weit, Spitzenmodelle weniger. Du siehst, welches welches ist.",
  },
  criteria: {
    title: "Was du vor dem Wechsel vergleichen solltest",
    intro: "Fünf Fragen entscheiden.",
    models:
      "Modelle: Wie viele unzensierte, welche Art (abliteriert oder wirklich unzensiert), und gibt es Claude, GPT und Gemini am selben Ort?",
    filter:
      "Filter: Was die Nutzungsbedingungen wirklich verbieten, und ob das Etikett unzensiert heißt, dass das Modell antwortet.",
    privacy:
      "Datenschutz: Wo deine Chats liegen, wer sie noch bekommt und wie lange sie jemand aufbewahrt.",
    price:
      "Preis: Was ein Monat an Antworten, Bildern und Video bringt. Nicht nur der Listenpreis.",
    offline:
      "Offline: Gibt es eine gepflegte lokale Variante oder nur eine Cloud-App?",
  },
  table: {
    title: "Alle im direkten Vergleich",
  },
  us: {
    title: "{{appName}}: unzensierte Modelle mit Namen und Preis",
    intro:
      "{{modelCount}} Modelle in einem Chat mit einem Guthaben. Das Modell wählst du pro Nachricht, und jedes Modell hat seine eigene Seite.",
    models:
      "Modelle: {{uncensored}} unzensierte neben {{mainstream}} Mainstream- und {{open}} offenen Modellen. {{ownModel}} ist mit Büchern und Dokumenten trainiert, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit konträren politischen Ansichten.",
    liberty:
      "Liberty von FreedomGPT gibt es hier auch ({{freedomGptExamples}}), neben abliterierten Builds von GLM, DeepSeek und Kimi. Vergleich seine Antwort im selben Chat mit einem anderen Modell.",
    libertyOff:
      "Abliterierte Builds von GLM, DeepSeek und Kimi neben Claude, GPT und Gemini. Antworten im selben Chat vergleichen.",
    privacy:
      "Datenschutz: Inkognito-Chats bleiben im lokalen Speicher deines Browsers, ohne Konto. Private Chats werden nur in deinem Konto gespeichert.",
    price:
      "Preis: {{guestCredits}} Gratis-Credits im Monat ohne Konto, {{freeCredits}} mit Konto. Tarife ab {{subPrice}} im Monat. Unzensierte Modelle werden nach einer einmaligen 18+-Bestätigung freigeschaltet.",
    open: "Open Source: Die gesamte Plattform liegt auf GitHub und wird aktiv entwickelt. Wer eine eigene Instanz will, hostet sie selbst.",
    weak: "Wo wir schwächer sind: kein pauschaler All-in-Tarif, und Video kostet auch bei uns spürbar Credits. Der kontolose Gratis-Einstieg von FreedomGPT ist so einfach wie unserer.",
    hubLink: "Unzensierter KI-Chat: alle Modelle mit Kontext und Preis",
    abliteratedLink: "Abliterierte Modelle direkt im Browser nutzen",
    libertyLink: "FreedomGPT Liberty bei {{appName}} ansehen",
    ownLink: "{{ownModel}} ansehen",
  },
  list: {
    title: "Die {{count}} Alternativen im Einzelnen",
    intro:
      "Von ihren eigenen Seiten, geprüft am {{date}}. Was jede ist, welche Modelle sie hat, was ihr Filter erlaubt, was mit deinen Chats passiert.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modelle:",
    filter: "Filter:",
    privacy: "Datenschutz:",
    price: "Preis:",
    priceValue: "Gratis: {{free}}. Bezahlt: {{plans}}.",
    pro: "Stärke:",
    con: "Haken:",
    forWho: "Nimm sie, wenn:",
    versusLink: "{{appName}} vs {{name}}: der ganze Vergleich",
    visit: "{{name}} besuchen",
  },
  privacy: {
    title: "Datenschutz: Lies die Erklärung, nicht den Slogan",
    intro: "Das schreibt jede Seite tatsächlich auf.",
    fg: "FreedomGPT: Nachrichten, Sprachaufnahmen und Bilder gehen an externe KI-Anbieter. Keine Speicherdauer genannt. Die eigene Startseite rät, keine Anonymität anzunehmen.",
    us: "{{appName}} inkognito: Chats liegen im lokalen Speicher deines Browsers, nicht auf unseren Servern. Browserdaten löschen, und sie sind weg.",
    local:
      "LM Studio und Ollama: Das Modell läuft auf deinem Rechner, der Prompt verlässt ihn nie. Der Preis ist deine eigene Hardware.",
    callout:
      "Jedes gehostete Modell sieht den Prompt, den es beantwortet. Ein Verlauf auf dem Gerät hält Chats von Firmenservern fern, nicht vom Modell.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Was ist die beste FreedomGPT Alternative?",
      a: "Kommt darauf an, was dir fehlt. Verlauf auf dem Gerät und großer Katalog: Venice. Bezahlen pro Nutzung ohne Abo: NanoGPT. Ein kompromissloses Modell mit eigenem Weltbild: uncensored.ai. Komplett offline: LM Studio oder Ollama. Unzensierte, offene und Mainstream-Modelle mit öffentlichem Preis pro Nachricht in einem Chat: {{appName}}.",
    },
    free: {
      q: "Gibt es eine kostenlose FreedomGPT Alternative?",
      a: "Ja. Ollama ist quelloffen und auf eigener Hardware kostenlos, LM Studio läuft lokal ebenfalls gratis. {{appName}} gibt {{guestCredits}} Gratis-Credits im Monat ohne Konto und {{freeCredits}} mit Konto, unzensierte Modelle inklusive nach einer einmaligen 18+-Bestätigung.",
    },
    liberty: {
      q: "Kann ich FreedomGPT Liberty auch woanders nutzen?",
      a: "Ja. {{appName}} bietet {{freedomGptExamples}} über die API von FreedomGPT an. Du nutzt Liberty also neben {{uncensored}} anderen unzensierten Modellen und prüfst seine Antworten gegen sie.",
      aOff: "Liberty ist das Hausmodell von FreedomGPT. Bei {{appName}} bekommst du {{uncensored}} andere unzensierte Modelle, abliteriert und wirklich unzensiert, in einem Chat.",
    },
    desktop: {
      q: "Wird die Desktop-App von FreedomGPT noch gepflegt?",
      a: "Das quelloffene GitHub-Repository zeigt den letzten Commit am {{desktopDate}}. Wer heute offline arbeiten will, greift zu Ollama oder LM Studio, beide werden gepflegt.",
    },
    private: {
      q: "Welche Alternative schützt die Privatsphäre am besten?",
      a: "Ein lokales Programm: Ollama oder LM Studio halten jeden Prompt auf deinem Gerät. Unter den gehosteten Angeboten halten Venice und der Inkognito-Modus von {{appName}} den Verlauf im Browser. FreedomGPT gibt Nachrichten laut eigener Erklärung an externe KI-Anbieter weiter.",
    },
    api: {
      q: "Welche Alternative hat eine unzensierte API?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI und {{appName}} bieten OpenAI-kompatible APIs. FreedomGPT hat auch eine, ohne Preise in der Doku. Bei {{appName}} schaltet jeder Tarif ab {{apiSubPrice}} im Monat die API frei.",
    },
    gabLink: "Gab AI Alternativen im Vergleich",
    nofilterLink: "NoFilterGPT Alternativen im Vergleich",
    noGpuLink: "Unzensierte Modelle ohne eigene Grafikkarte",
  },
  cta: {
    title: "Wissen, wofür du zahlst. Dann alles fragen.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Inkognito starten und jedes Modell testen.",
    start: "Inkognito-Chat starten",
    models: "Die unzensierten Modelle ansehen",
  },
};
