import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "NoFilterGPT Alternativen: unzensierte KI-Chats im Vergleich (2026)",
    description:
      "NoFilterGPT Alternativen, geprüft auf ihren eigenen Seiten: Venice, uncensored.ai, FreedomGPT, NanoGPT, Gab AI, LM Studio und {{appName}}. Modelle, Filter, Datenschutz, Preis, API.",
    category: "Vergleich",
    imageAlt: "NoFilterGPT Alternativen im direkten Vergleich",
    keywords:
      "NoFilterGPT Alternative, NoFilterGPT Alternativen, Seiten wie NoFilterGPT, NoFilterGPT vs Venice, unzensierter KI-Chat, KI ohne Filter, ChatGPT ohne Filter, KI ohne Zensur, {{appName}}",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Vergleich",
    readTime: "8 Min. Lesezeit",
    title: "NoFilterGPT Alternativen. Mehr Modelle, gleiche Freiheit.",
    subtitle:
      "{{count}} Alternativen und {{appName}}, verglichen mit dem, was ihre eigenen Preis-, Datenschutz- und Filterseiten sagen.",
  },
  intro: {
    lead: "NoFilterGPT verkauft genau eins: einen Chatbot, der dich nicht belehrt. Fair. Dafür bekommst du ein einziges Modell, ein Tageslimit im Gratis-Tarif und ein Datenschutzversprechen, das du glauben musst.",
    p2: "Hier sind die Alternativen, geprüft auf ihren eigenen Seiten. Stand der Konkurrenz: {{date}}, NoFilterGPT: {{nfDate}}. Offen gesagt: Wir kaufen Modelle bei einigen von ihnen ein und bieten sie in unserem Chat an, allein {{veniceModels}} über Venice. Wo sie besser sind, sagen wir es auch.",
  },
  nfg: {
    title: "Was NoFilterGPT bietet",
    intro:
      "Laut eigener Startseite und Datenschutzerklärung, gelesen am {{nfDate}}.",
    model:
      "Modell: ein eigenes Modell, beschrieben als GPT-Architektur ohne die üblichen Einschränkungen. Kein genanntes Basismodell, keine Modellauswahl.",
    price:
      "Preis: ein kostenloser Basic-Tarif mit begrenzten Nachrichten pro Tag. Professional kostet {{proPrice}} im Monat für nahezu unbegrenzte Chats, Bildanalyse, Bildgenerierung und API-Zugang.",
    media:
      "Medien: Bilder erzeugen und bearbeiten, Video aus einem Bild, Sprache rein und raus.",
    privacy:
      "Datenschutz: Die Startseite sagt, Gespräche werden nicht gespeichert und Chats verschlüsselt. Die Datenschutzerklärung ergänzt, dass IP-Adressen aus Sicherheitsgründen protokolliert werden können, Nutzungsdaten protokolliert werden und Cloudflare Analytics auf der Seite läuft.",
    payments: "Zahlung: Karten über Stripe, dazu ETH, BTC und USDC.",
    why: "Warum Leute eine Alternative suchen: Sie wollen das Modell selbst wählen, Antworten vergleichen oder ein Datenschutzversprechen an einer Erklärung prüfen, die es ausbuchstabiert.",
    sourceHome: "Startseite von NoFilterGPT",
    sourcePrivacy: "Datenschutzerklärung von NoFilterGPT",
  },
  criteria: {
    title: "Was du vor dem Wechsel vergleichen solltest",
    intro: "Fünf Fragen entscheiden.",
    models:
      "Modelle: ein Hausmodell oder echte Auswahl? Abliteriert, wirklich unzensiert, und kommst du am selben Ort noch an Claude, GPT und Gemini?",
    filter:
      "Filter: Was ist im Gratis-Tarif erlaubt, was braucht einen bezahlten Tarif, und gibt es eine Altersprüfung?",
    privacy:
      "Datenschutz: Wo deine Chats liegen, was protokolliert wird und ob jemand damit trainiert.",
    price:
      "Preis: Gratis-Kontingent, Abo oder Bezahlung pro Nutzung. Und was passiert, wenn das Limit erreicht ist.",
    api: "API: Kannst du dieselben Modelle aus deinem Code aufrufen, und in welchem Format?",
  },
  table: {
    title: "Alle im direkten Vergleich",
    intro:
      "Auf dem Handy seitlich scrollen. Fakten der Konkurrenz am {{date}} auf ihren eigenen Seiten geprüft. Fakten zu {{appName}} kommen live aus unserer Konfiguration.",
  },
  us: {
    title: "{{appName}}: jede Art Modell in einem Chat",
    intro:
      "{{modelCount}} Modelle in einem Chat und mit einem Guthaben. Die Filterstufe wählst du pro Nachricht.",
    models:
      "Modelle: {{uncensored}} unzensierte neben {{mainstream}} Mainstream- und {{open}} offenen Modellen. {{ownModel}} ist mit Büchern und Dokumenten trainiert, die im Mainstream-Internet verbannt sind. Das Ergebnis ist ein Modell mit konträren politischen Ansichten.",
    switch:
      "Modelle mitten im Chat wechseln. Frag ein unzensiertes Modell und prüf die Antwort gegen ein Mainstream-Modell.",
    privacy:
      "Datenschutz: Inkognito-Chats bleiben im lokalen Speicher deines Browsers, ohne Konto. Private Chats werden nur in deinem Konto gespeichert.",
    price:
      "Preis: {{guestCredits}} Gratis-Credits im Monat ohne Konto, {{freeCredits}} mit Konto. Tarife ab {{subPrice}} im Monat. Credit-Pakete stocken einen aktiven Tarif auf und verfallen nie.",
    api: "API: dieselben Modelle über OpenAI- und Anthropic-kompatible Endpunkte. Jeder Tarif ab {{apiSubPrice}} im Monat schaltet sie frei.",
    weak: "Wo wir schwächer sind: kein pauschaler Unbegrenzt-Tarif. Jede Nachricht kostet Credits, der Preis hängt vom gewählten Modell ab.",
    hubLink: "Unzensierter KI-Chat: alle Modelle mit Kontext und Preis",
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
    intro:
      "Keine Logs ist eine starke Aussage. Das schreibt jede Seite tatsächlich auf.",
    nfg: "NoFilterGPT: Die Startseite sagt, Chats werden nicht gespeichert. Die Datenschutzerklärung sagt, IP-Adressen und Nutzungsdaten können protokolliert werden und Cloudflare verarbeitet Anfragedaten.",
    us: "Bei {{appName}} liegen Inkognito-Chats im lokalen Speicher deines Browsers, nicht auf unseren Servern. Browserdaten löschen, und sie sind weg.",
    transit:
      "Jedes gehostete Modell sieht deinen Prompt. NoFilterGPT, Venice, wir: Die Nachricht muss den Server erreichen, auf dem das Modell läuft. Nur ein lokales Programm hält sie auf deinem Rechner.",
    callout:
      "Ein Verlauf auf dem Gerät hält deine Chats von fremden Servern fern. Vor dem Modell, das antwortet, versteckt er sie nicht.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Was ist die beste NoFilterGPT Alternative?",
      a: "Kommt darauf an, was dir fehlt. Großer Katalog und Verlauf auf dem Gerät: Venice. Ein kompromissloses Modell mit eigenem Weltbild: uncensored.ai. Bezahlen pro Nutzung: NanoGPT. Maximaler Datenschutz: LM Studio auf dem eigenen Rechner. Unzensierte, offene und Mainstream-Modelle plus Medien in einem Chat mit einem Guthaben: {{appName}}.",
    },
    free: {
      q: "Gibt es eine kostenlose NoFilterGPT Alternative?",
      a: "Ja. FreedomGPT startet kostenlos ohne Konto. LM Studio ist auf eigener Hardware gratis. {{appName}} gibt {{guestCredits}} Gratis-Credits im Monat ohne Konto und {{freeCredits}} mit Konto, unzensierte Modelle inklusive nach einer einmaligen 18+-Bestätigung.",
    },
    models: {
      q: "Welches Modell nutzt NoFilterGPT?",
      a: "Die Startseite beschreibt ein eigenes Modell auf GPT-Architektur und nennt kein Basismodell. Bei {{appName}} hat jedes Modell eine eigene Seite mit Anbieter, Kontextfenster und Preis. Du weißt also, wer dir antwortet.",
    },
    private: {
      q: "Welche Alternative schützt die Privatsphäre am besten?",
      a: "Ein lokales Programm wie LM Studio: Das Modell läuft auf deinem Gerät, Prompts verlassen es nie. Unter den gehosteten Angeboten halten Venice und der Inkognito-Modus von {{appName}} den Verlauf im Browser. Jedes gehostete Modell sieht trotzdem den Prompt, den es beantwortet.",
    },
    api: {
      q: "Welche Alternative hat eine unzensierte API?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI und {{appName}} bieten OpenAI-kompatible APIs. NoFilterGPT packt seine API in den Professional-Tarif. Bei {{appName}} schaltet jeder Tarif ab {{apiSubPrice}} im Monat die API frei.",
    },
    account: {
      q: "Brauche ich ein Konto zum Testen?",
      a: "Nicht bei {{appName}}: Der Inkognito-Chat funktioniert ohne. Ein kostenloses Konto speichert Chats geräteübergreifend und erhöht das Gratis-Kontingent auf {{freeCredits}} Credits im Monat.",
    },
    chatgptLink: "Eine ChatGPT Alternative ohne Filter",
    kindsLink:
      "Abliteriert, feinjustiert oder eigenes Weltbild: die drei Arten",
  },
  cta: {
    title: "Wähl das Modell. Nicht nur den Filter.",
    subtitle:
      "{{guestCredits}} Gratis-Credits im Monat, kein Konto nötig. Inkognito starten und jedes Modell testen.",
    start: "Inkognito-Chat starten",
    models: "Die unzensierten Modelle ansehen",
  },
};
