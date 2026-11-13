import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "KI-Modelle",
    index: {
      title: "{{count}} KI-Chatmodelle - Preise, Kontext, Filter | {{appName}}",
      description:
        "Alle Modelle auf {{appName}} in einer Liste: Claude, GPT, Gemini, Grok, DeepSeek, offene und unzensierte Chat-Modelle, dazu Bild, Stimme, Musik und Video. Echter Preis pro Nutzung, Kontextfenster, Eingaben. Modell wählen, loslegen.",
      imageAlt: "KI-Modellverzeichnis auf {{appName}}",
      keywords:
        "KI-Modelle, LLM-Vergleich, unzensierte KI, Open-Source-KI, KI-Preise, {{appName}}",
    },
    model: {
      title: "{{model}} von {{lab}} - Preis, Kontext, Nutzung | {{appName}}",
      description:
        "{{model}} von {{lab}}: Stufe {{tier}}, {{context}} Token Kontext, rund {{price}} Credits pro Nachricht. Direkt auf {{appName}} chatten - ohne Abo.",
      imageAlt: "{{model}} auf {{appName}}",
      keywords:
        "{{model}}, {{model}} Preis, {{model}} Kontextfenster, {{lab}} KI, {{appName}}",
    },
    media: {
      title: "{{model}} von {{lab}} - {{type}}, Preis, Nutzung | {{appName}}",
      description:
        "{{model}} von {{lab}}: {{type}}-Modell, Stufe {{tier}}. Echter Preis pro Nutzung in Credits. Direkt auf {{appName}} nutzen - ohne Abo.",
      imageAlt: "{{model}} auf {{appName}}",
      keywords:
        "{{model}}, {{model}} Preis, {{lab}} KI, {{type}} KI-Modell, {{appName}}",
    },
    compare: {
      title:
        "{{a}} vs. {{b}} - Preis, Kontext, Eingaben im Vergleich | {{appName}}",
      description:
        "{{a}} gegen {{b}} im Direktvergleich: Preis pro Nachricht, Kontextfenster, Ein- und Ausgaben, Anbieter und Inhaltsstufe. Beide auf {{appName}} testen.",
      imageAlt: "{{a}} vs. {{b}} auf {{appName}}",
      keywords: "{{a}} vs {{b}}, {{a}}, {{b}}, KI-Modellvergleich, {{appName}}",
    },
  },
  tiers: {
    mainstream: {
      name: "Mainstream",
      line: "Die Modelle der großen Labs mit eigenen Sicherheitsfiltern. Stark bei Arbeit, Code und Recherche.",
    },
    open: {
      name: "Offen",
      line: "Open-Weight-Modelle mit lockereren Filtern. Mehr Spielraum, weniger Verweigerung.",
    },
    uncensored: {
      name: "Unzensiert",
      line: "Keine Verweigerung, keine Moralpredigt. Für düsteres Rollenspiel, Politik und andere Perspektiven: UncensoredLM, als einziges von Grund auf unzensiert. Den übrigen wurden die Verweigerungen entfernt, die Grundhaltung ihres Basismodells bleibt.",
    },
  },
  modality: {
    text: "Text",
    image: "Bilder",
    audio: "Audio",
    video: "Video",
  },
  facts: {
    heading: "Die Fakten",
    type: "Modelltyp",
    lab: "Entwickelt von",
    tier: "Inhaltsstufe",
    intelligence: "Intelligenz",
    price: "Geschätzter Preis pro Nachricht",
    priceValue: "~{{credits}} Credits",
    priceFree: "Kostenlos",
    priceHint: "≈ {{count}} Nachrichten für {{unit}}",
    priceHintFree: "Kostet dich pro Nachricht nichts",
    priceFootnote:
      "Typische Nachricht: 16K Token rein, 1,5K raus. Kurze Antworten kosten weniger. Modelle über OpenRouter rechnen die echten Anbieterkosten plus unseren Aufschlag ab, der tatsächliche Preis schwankt. 1 Credit = {{value}}.",
    context: "Kontextfenster",
    contextValue: "{{tokens}} Token",
    contextHint: "≈ {{pages}} Seiten Text auf einmal",
    inputs: "Versteht",
    outputs: "Erzeugt",
    providers: "Bereitgestellt über",
    tools: "Werkzeugnutzung",
    toolsYes: "Ja - Suche, Gedächtnis, Code und mehr",
    toolsNo: "Nein - reiner Chat",
    status: "Status",
    statusCurrent: "Aktuell",
    statusLegacy: "Veraltet",
  },
  currencyUnit: {
    usd: "1 $",
    eur: "1 €",
  },
  creditValue: {
    usd: "0,01 $",
    eur: "0,01 €",
  },
  chatPrompt:
    "Worin bist du am stärksten? Zeig es mir an einem kurzen, konkreten Beispiel.",
  catalog: {
    typesLabel: "Modelltyp",
    types: {
      text: "Chat",
      tts: "Text zu Stimme",
      stt: "Stimme zu Text",
      image: "Bilder",
      audio: "Musik",
      video: "Video",
    },
    context: "{{size}} Kontext",
    legacyBadge: "Alt",
    count: "{{count}} Modelle",
    showLegacy: "Veraltete anzeigen ({{count}})",
    hideLegacy: "Veraltete ausblenden",
  },
  index: {
    eyebrow:
      "{{chat}} Chat-Modelle, dazu {{image}} Bild-, {{video}} Video-, {{music}} Musik- und {{voice}} Sprachmodelle",
    title: "Jedes Modell. Ein Chat.",
    subtitle:
      "Mainstream, offen und unzensiert. Echte Preise pro Nachricht, echte Kontextgrößen. Den Filter bestimmst du. Nicht wir.",
    searchLabel: "Modelle durchsuchen",
    searchPlaceholder: "Nach Name oder Lab suchen: Claude, DeepSeek, Venice…",
    tierCount: "{{count}} Modelle",
    noResults: "Kein Modell passt zu „{{query}}“.",
    legacyTitle: "Veraltete Modelle",
    legacyIntro:
      "Ältere Versionen. Gespeicherte Chats und Skills, die sie nutzen, wechseln automatisch zum Nachfolger.",
    perMessage: "~{{credits}} Cr./Nachr.",
    free: "Kostenlos",
    ctaTitle: "Genug Datenblätter. Frag einfach.",
    ctaSubtitle:
      "Chat öffnen, beliebiges Modell im Selektor wählen, mitten im Gespräch wechseln.",
    ctaButton: "Chat starten",
  },
  model: {
    back: "Alle Modelle",
    chatCta: "Mit {{model}} chatten",
    compareCta: "Vergleichen",
    legacyBanner:
      "{{model}} ist veraltet. Der Nachfolger {{successor}} ist schneller oder günstiger - und Chats mit {{model}} wechseln automatisch dorthin.",
    legacyCta: "Zu {{successor}}",
    compareHeading: "{{model}} im Vergleich",
    compareIntro: "Dieselben Fakten, direkt nebeneinander.",
    compareWith: "{{model}} vs. {{other}}",
    ctaTitle: "{{model}} jetzt testen.",
    ctaSubtitle:
      "Kein Abo. Startguthaben inklusive. Der Chat öffnet mit {{model}} und fertigem Prompt - einfach abschicken.",
  },
  media: {
    priceLabel: "Preis pro Nutzung",
    generateCta: "Mit {{model}} generieren",
    useCta: "{{model}} nutzen",
    chatNote:
      "Funktioniert auch im Chat: Lass ein Chat-Modell {{model}} für dich einsetzen.",
    priceFootnote:
      "Der Preis gilt pro Einheit - Bild, Clip, Sekunde oder Zeichen - und ändert sich mit Größe, Länge und Optionen. 1 Credit = {{value}}.",
    ctaTitle: "{{model}} jetzt ausprobieren.",
    ctaSubtitle:
      "Kein Abo. Start-Credits geschenkt. Das Werkzeug öffnet sich startbereit.",
  },
  compare: {
    back: "Alle Modelle",
    eyebrow: "Direktvergleich",
    title: "{{a}} vs. {{b}}",
    subtitle: "Preis, Kontext, Eingaben und Filter. Kein Benchmark-Theater.",
    fact: "Merkmal",
    cheaper: "{{model}} kostet pro Nachricht {{times}}× weniger.",
    samePrice: "Beide kosten pro Nachricht etwa gleich viel.",
    biggerContext: "{{model}} fasst {{times}}× mehr Kontext.",
    sameContext: "Beide fassen gleich viel Kontext.",
    chatWith: "Mit {{model}} chatten",
    modelPage: "Details zu {{model}}",
    swap: "Seiten tauschen",
    sameModel: "Wähle zwei verschiedene Modelle für den Vergleich.",
  },
  picker: {
    change: "Modell ändern",
    search: "Modelle suchen",
    suggested: "Empfohlen",
    all: "Alle Modelle",
    empty: "Kein Modell gefunden.",
  },
  refusal: {
    heading: "Verweigerungs-Index",
    intro:
      "So hat {{model}} das feste Fragenset im letzten Wochenlauf ({{date}}) beantwortet.",
    rank: "Rang {{rank}} von {{total}} (1 = wenigste Ablehnungen)",
    refused: "Abgelehnt",
    hedged: "Abgeschwächt",
    answered: "Beantwortet",
    judged: "{{count}} bewertete Antworten",
    trend: "{{delta}} Pkt. ggü. letztem Lauf",
    categories: "Nach Kategorie",
    samplesHeading: "Beispielantworten",
    samplesIntro:
      "Echte Antworten aus dem Messlauf. Derselbe Prompt für jedes Modell.",
    question: "Frage",
    answer: "Antwort",
    judge: "Richter",
    methodCta: "So messen wir",
  },
};
