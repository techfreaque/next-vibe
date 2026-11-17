import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  summary:
    "{{appName}} ist eine KI-Chat-Plattform mit {{modelCount}} Chat-Modellen von {{providerCount}} Laboren: Mainstream, offen und unzensiert. Du wählst die Filterstufe pro Chat. Bezahlt wird pro Nutzung mit Credits. Open Source und selbst hostbar.",
  intro:
    "Chat-, Bild-, Video-, Musik-, Stimm- und Transkriptionsmodelle auf einem Credit-Guthaben. Nutzbar im Browser, über die Kommandozeile, als MCP-Server oder über eine OpenAI- und Anthropic-kompatible API. Gebaut auf next-vibe, einem Open-Source-TypeScript-Framework: Eine Endpoint-Definition wird zur Web-Oberfläche, zum CLI-Befehl, zum KI-Tool und zum MCP-Tool.",
  facts: {
    heading: "Die wichtigsten Fakten",
    models:
      "Modelle: {{modelCount}} Chat-Modelle ({{mainstream}} Mainstream, {{open}} offen, {{uncensored}} unzensiert) von {{providerCount}} Laboren, dazu {{mediaCount}} Modelle für Bild, Video, Musik, Sprachausgabe und Transkription.",
    free: "Gratis-Credits jeden Monat: {{guest}} ohne Konto, {{signedIn}} mit kostenlosem Konto, {{max}} mit kostenlosem Konto und bestätigtem Newsletter-Abo. Keine Karte nötig.",
    paid: "Bezahlt: ein Abo für {{subPrice}} pro Monat oder {{subYearPrice}} pro Jahr mit {{subCredits}} Credits im Monat, oder ein einmaliges Credit-Paket für {{packPrice}} mit {{packCredits}} Credits. Paket-Credits verfallen nie.",
    credit:
      "1 Credit = {{creditValue}}. Jede Modellseite nennt den Preis pro Nachricht.",
    api: "API: OpenAI Chat Completions, OpenAI Responses und Anthropic Messages auf einer Basis-URL ({{apiBaseUrl}}). Voraussetzung ist ein bezahltes Konto: ein beliebiges Abo oder ein einziger Credit-Kauf, zum Beispiel das Paket für {{packPrice}}. Kostenlose Konten erhalten HTTP 402.",
    uncensored:
      "Unzensierte Stufe: zwei Arten von Modellen. Abliterierte Modelle sind Mainstream-Modelle, die so verändert wurden, dass sie Fragen nicht mehr ausweichen. Echt unzensierte Modelle sind mit anderem Material trainiert. Die unzensierte Stufe erfordert eine einmalige Bestätigung, dass du volljährig bist.",
    openSource:
      "Open Source: Der App-Code steht unter MIT-Lizenz, der Kern des next-vibe-Frameworks unter GPL-3.0. Quellcode: {{repoUrl}}",
    referral:
      "Empfehlungsprogramm: {{direct}} % wiederkehrende Provision auf vermittelte Zahlungen, dazu ein Pool von {{upline}} % über {{levels}} Upline-Ebenen. Auszahlung als Credits oder in BTC/USDC, Mindestauszahlung {{minPayout}}.",
    languages:
      "Jede Seite gibt es auf Englisch ({{en}}), Deutsch ({{de}}), Polnisch ({{pl}}) und Französisch ({{fr}}).",
  },
  pages: {
    heading: "Wichtige Seiten",
    models: "Modelle",
    modelsDesc:
      "jedes Modell mit Preis pro Nachricht, Kontextfenster, Inhaltsstufe und Direktvergleichen",
    pricing: "Preise",
    pricingDesc: "Gratis-Credits, das Abo und das Credit-Paket",
    api: "API-Dokumentation",
    apiDesc: "Basis-URL, Authentifizierung, Anfrageformate und Codebeispiele",
    blog: "Blog",
    blogDesc: "Anleitungen, Modellvergleiche und Entwicklungsnotizen",
    partners: "Partner",
    partnersDesc: "Programm für Creator, Newsletter und Verzeichnisse",
    earn: "Empfehlungsprogramm",
    earnDesc: "so funktionieren Provision und Auszahlung",
    selfHost: "Selbst hosten",
    selfHostDesc: "eigene Instanz auf eigener Hardware betreiben",
    framework: "next-vibe-Framework",
    frameworkDesc: "der Open-Source-Stack hinter {{appName}}",
    refusalIndex: "Verweigerungsindex",
    refusalIndexDesc:
      "jede Woche dieselben Fragen an jedes Modell: wer antwortet, wer ausweicht, wer verweigert",
    skills: "Skills",
    skillsDesc:
      "fertige Spezialisten und Charaktere, jeder mit eigenem Prompt, Modell und Tools",
    help: "Hilfe",
    helpDesc: "FAQ und Kontakt",
  },
  blog: {
    heading: "Blogartikel",
  },
  optional: {
    heading: "Optional",
    full: "Vollversion",
    fullDesc: "diese Datei plus die komplette Modellliste",
    sitemap: "Sitemap",
    sitemapDesc: "jede öffentliche Seite in jeder Sprache",
    about: "Über uns",
    privacy: "Datenschutzerklärung",
    terms: "Nutzungsbedingungen",
    imprint: "Impressum",
  },
  full: {
    chatHeading: "Chat-Modelle",
    chatIntro:
      "Aktuelle Chat-Modelle. Der Preis pro Nachricht gilt für einen normalen Chat-Schritt ({{inputTokens}} Eingabe-Tokens, {{outputTokens}} Ausgabe-Tokens) beim günstigsten Anbieter.",
    chatLine:
      "{{lab}}, {{tier}}, {{context}} Tokens Kontext, etwa {{credits}} Credits pro Nachricht",
    legacyHeading: "Ältere Chat-Modelle, weiterhin verfügbar",
    legacySuccessor: "Nachfolger: {{successor}}",
    mediaHeading: "Medienmodelle",
    mediaLine: "{{lab}}, {{type}}",
    mediaTypes: {
      image: "Bildgenerierung",
      video: "Videogenerierung",
      audio: "Musikgenerierung",
      tts: "Sprachausgabe",
      stt: "Transkription",
    },
  },
};
