import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Neue Modelle, neue unzensierte Anbieter - {{appName}}",
    description:
      "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 und frische offene Modelle. Dazu NanoGPT, ein größeres Venice-Angebot und die ersten unzensierten Bildmodelle.",
    category: "Modell-Update",
    imageAlt: "{{appName}} Modell-Update - November 2026",
    keywords:
      "{{appName}}, Claude Opus 5.5, GPT-6, Gemini 4 Argon, Grok 4.7, unzensierte KI, Venice, NanoGPT, Lustify, Chroma",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    category: "Modell-Update",
    readTime: "5 Min. Lesezeit",
    title: "Die neuesten Modelle sind da. Unzensiert wird ernst.",
    subtitle:
      "Jede große Modellfamilie ist eine Generation weiter. Ein zweiter unzensierter Anbieter ist dazugekommen. Und zum ersten Mal kannst du unzensierte Bilder erzeugen.",
  },
  intro: {
    lead: "Kurzfassung: Der Katalog ist wieder auf dem neuesten Stand. Gerade laufen {{modelCount}} Modelle - {{uncensoredCount}} davon unzensiert.",
    p2: "Du musst nichts tun. Hattest du ein älteres Modell fest gewählt? Deine Chats wechseln von selbst zum Nachfolger.",
  },
  filter: {
    title: "Was „unzensiert“ hier heißt",
    intro: "Drei Stufen. Du entscheidest.",
    p1: "Jedes Modell hat eine Inhaltsstufe. Mainstream-Modelle behalten die Filter ihres Anbieters. Offene Modelle sind lockerer. Unzensierte Modelle antworten ohne Belehrung. Eines davon, UncensoredLM, ist von Grund auf unzensiert gebaut; die übrigen sind bestehende Modelle ohne Verweigerungen, ihr Basistraining prägt die Antworten weiter.",
    p2: "Niemand wählt die Stufe für dich. Mainstream für die Arbeit, unzensiert für die Frage, die sonst keiner beantwortet - gleicher Chat, gleiches Konto.",
    mainstream: "Mainstream",
    open: "Offen",
    uncensored: "Unzensiert",
    mainstreamBody:
      "Anbieterfilter bleiben aktiv. Sichere Wahl für die Arbeit.",
    openBody: "Weniger Verweigerungen, ein paar Leitplanken bleiben.",
    uncensoredBody:
      "Keine Belehrung, kein Verweigerungstheater. Deine Entscheidung.",
    countLabel: "{{count}} aktiv",
  },
  lineup: {
    title: "Das neue Aufgebot",
    intro:
      "Nach Familie sortiert. Ältere Auswahlen dieser Familien landen jetzt bei den neuen Versionen.",
    claude: "Claude",
    claudeNote:
      "Die neue Generation von Anthropic - vom tiefen Denken bis zur schnellen Antwort.",
    gpt: "GPT",
    gptNote: "Die GPT-6-Familie von OpenAI. Jede Stufe gibt es auch als Pro.",
    gemini: "Gemini",
    geminiNote:
      "Googles Flaggschiff plus ein schnelles, günstiges Arbeitstier.",
    grok: "Grok",
    grokNote: "Das Neueste von xAI - eingestuft als offen, nicht Mainstream.",
    openModels: "Offene Modelle",
    openModelsNote:
      "Kimi, DeepSeek, GLM und MiniMax - stark und weniger gefiltert.",
  },
  uncensored: {
    title: "Unzensiert hat richtig zugelegt",
    intro: "Mehr Modelle, zwei Anbieter - und Bilder.",
    veniceTitle: "Venice: das Rückgrat, ausgebaut",
    veniceBody:
      "Venice trägt den Großteil unseres unzensierten Katalogs. Das Flaggschiff ist jetzt {{veniceModel}}, und eine ganze Reihe kam dazu:",
    nanoTitle: "NanoGPT: ein zweiter Weg",
    nanoBody:
      "Neuer Anbieter. Er bringt {{glm}} und {{glmFlash}} mit 1 Million Token Kontext und liefert {{deepseek}} parallel zu Venice - dazu exklusiv {{mimoAbliterated}}. Fällt ein Anbieter aus, übernimmt der andere.",
    imagesTitle: "Die ersten unzensierten Bildmodelle",
    imagesBody:
      "{{lustify}} und {{chroma}}, über Venice. Ein Credit pro Bild. Jedes Bildmodell davor war Mainstream oder offen.",
    warning:
      "{{model}} ist das am wenigsten eingeschränkte Modell, das wir je gelistet haben. Es liegt hinter der Stufe „unzensiert“ - du bekommst es nur, wenn du es bewusst wählst.",
  },
  underTheHood: {
    title: "Unter der Haube",
    intro:
      "Für alle, die wissen wollen, wie der Wechsel wirklich funktioniert.",
    successorsTitle: "Alte Auswahl folgt dem Nachfolger",
    successorsBody:
      "Ältere Modell-IDs sind jetzt als Legacy markiert: im Picker ausgeblendet, aber weiter auflösbar. Fest gewählte Modelle und gespeicherte Skills folgen einer Nachfolger-Tabelle zum aktuellen Modell - aber nur, wenn der Nachfolger für dich auch tatsächlich verfügbar ist. Sonst bleibt deine ursprüngliche Wahl. Kein stiller Tausch gegen ein fremdes Modell.",
    pricesTitle: "Preise, die aktuell bleiben",
    pricesBody:
      "Neue Preisabrufe ohne API-Key für Venice und NanoGPT halten Preise, Kontextfenster und Modalitäten aktuell. Fehlende Preisdaten waren genau der Grund, warum sich das alte Venice-Modell abgeschaltet hatte - das passiert jetzt nicht mehr unbemerkt.",
    toolsTitle: "Tool-Aufrufe, ehrlich",
    toolsBody:
      "NanoGPT-Modelle bekommen native Tool-Aufrufe. Venice Uncensored hat native Tools in unseren Tests ignoriert - deshalb bleibt es beim prompt-basierten Tool-Weg, der funktioniert.",
  },
  cta: {
    title: "Modell wählen. Filter setzen.",
    subtitle:
      "Jedes Modell oben läuft im Chat. Direkt vergleichen oder einfach loslegen.",
    chat: "Chat starten",
    models: "Alle Modelle ansehen",
  },
};
