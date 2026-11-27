import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Plattformen im Vergleich",
  verify:
    "Weitere Angebote haben wir am {{date}} anhand der verlinkten offiziellen Quellen geprüft. Wische auf dem Handy seitlich, um alle Spalten zu sehen. Limits hängen vom Tarif und vom Land ab.",
  verifyRange:
    "Weitere Optionen, geprüft anhand der verlinkten offiziellen Quellen zwischen {{from}} und {{to}}. Auf dem Handy wischst du die Tabelle seitwärts, um alle Spalten zu sehen. Limits hängen von Tarif und Region ab.",
  related: "Weitere Alternativen im Vergleich",
  kind: {
    chat: "Chat mit weniger Ablehnungen",
    assistant: "Allgemeiner KI-Assistent",
    writing: "Kreatives Schreiben",
    privateChat: "Chat mit Datenschutzfokus",
    frontend: "Modelloberfläche",
    local: "Lokale Modellumgebung",
    multiChat: "Chat mit Modellauswahl",
    research: "Rechercheassistent",
    roleplay: "Figurenrollenspiel",
    companion: "KI-Begleiter",
    gateway: "API-Gateway",
    inference: "Gehostete Modellinferenz",
  },
  free: {
    yes: "Begrenzter Gratiszugang",
    software: "Kostenlose Software",
    trial: "Testzugang oder Startguthaben",
    unlisted: "Siehe Anbieter",
    public: "Gratiszugang",
  },
  paid: {
    plan: "Abo",
    usage: "Nach Verbrauch",
    both: "Je nach Produkt: Abo oder Verbrauch",
    hosted: "Optionaler Cloud-Tarif",
    none: "Kosten für Hardware",
    contact: "Gewerbliche Tarife",
    license: "Lizenz plus Modellnutzung",
    unlisted: "Siehe Anbieter",
    fixedAccess: "Vorauszahlung für 30 Tage",
    byoApi: "App gratis, du zahlst den Modellanbieter",
  },
  filter: {
    permissive: "Wirbt mit weniger Ablehnungen",
    policy: "Es gelten die Anbieterrichtlinien",
    adultPolicy: "Optionen für Erwachsene, Plattformregeln gelten",
    selected: "Weniger Ablehnungen bei ausgewählten Modellen",
    varies: "Hängt von Modell und Anbieter ab",
    guardrails: "Konfigurierbare Schutzregeln plus Anbieterrichtlinien",
  },
  privacy: {
    noFilter: "Löscht Chats laut eigener Aussage, protokolliert IP und Nutzung",
    trainingControl: "Cloud-Dienst, Trainingseinstellungen prüfen",
    hosted: "Cloud-Dienst nach Anbieterbedingungen",
    deviceHistory: "Verlauf auf dem Gerät, externe Modelle erhalten Eingaben",
    enclave: "Hardwareisolierte Verarbeitung",
    encryptedHistory: "Verschlüsselt gespeicherter Verlauf",
    proxy: "Proxy für Cloud-Anfragen",
    noTraining: "Laut Anbieter kein Training mit Chats",
    configurable: "Hängt von Betrieb und Protokollierung ab",
    localOption: "Auf dem Gerät bei lokalem Modell",
    upstream: "Hängt vom Modellanbieter ab",
    noLogs: "Laut Anbieter keine Prompt-Protokolle",
    noDisk:
      "Laut Anbieter werden keine API-Eingaben auf Datenträgern gespeichert",
  },
  api: {
    separate: "Separates API-Angebot",
    unlisted: "Keine öffentliche API aufgeführt",
    available: "Verfügbar",
    local: "Lokale API",
    backend: "Verbindet sich mit einem Backend",
    openAi: "OpenAI-kompatibel",
    dual: "Kompatibel mit OpenAI und Anthropic",
    eligible: "In ausgewählten Bezahltarifen",
  },
  media: {
    text: "Text",
    image: "Bilder",
    voice: "Sprache",
    imageVoice: "Bilder, Sprache",
    imageVideo: "Bilder, Video",
    all: "Bilder, Video, Sprache",
    varies: "Je nach Modell oder Tarif",
  },
  open: {
    closed: "Proprietärer Dienst",
    weights: "Einige Modellgewichte verfügbar",
    client: "Clientcode verfügbar",
    open: "Open Source, selbst betreibbar",
    core: "Offene Komponente verfügbar",
    license: "Quellcode verfügbar, Lizenzauflagen",
  },
  fees: {
    topUp: "{{fee}} auf Guthabenkäufe",
    markup: "{{fee}} auf Modellnutzung",
    noMarkup: "Tokenpreis des Anbieters",
  },
  summaries: {
    noFilter:
      "Eigenes GPT-ähnliches Modell mit einstellbarem Ton. Der Gratiszugang begrenzt die Nachrichten pro Tag.",
    chatGpt:
      "Suche, Dateien und Sprachdialog in einer App. Die Limits hängen vom Tarif ab.",
    grok: "Sucht in X-Beiträgen und im Web. Höhere Limits und manche Funktionen kosten extra.",
    unrestricted:
      "Einfacher Browserchat mit benanntem Dolphin-Mistral-Modell. Die Web-App nutzt ein einziges Textmodell.",
    uncensoredCom:
      "Chat, Figuren und Medien in einem Dienst. Die Kontingente richten sich nach dem Tarif.",
    hemmingway:
      "Belletristik für Erwachsene und Rollenspiel mit offenen Modellgewichten. Unlocked konzentriert sich auf Text.",
    maple:
      "Die App prüft die isolierte Rechenumgebung. Das unzensierte Modell gibt es im Bezahltarif.",
    confer:
      "Der Client prüft die attestierte Rechenumgebung vor dem Versand. Geeignet für vertrauliche Textchats.",
    lumo: "Proton bietet Gastchats und Zero-Access-Verschlüsselung für gespeicherte Verläufe. Die Modelle laufen auf Proton-Servern.",
    duck: "Mehrere Modelle ohne Konto ausprobieren. DuckDuckGo leitet Eingaben über einen Proxy an die Modellanbieter weiter.",
    morse:
      "Bietet vertrauliche Inferenz und eine unzensierte Textoption. Die Modellauswahl hängt vom Tarif ab.",
    harbor:
      "Vertraulicher Chat und Websuche mit Harbor-1. Der Dienst verarbeitet Eingaben in der Cloud.",
    leo: "Im Brave-Browser direkt zur geöffneten Seite chatten. Integrierte und eigene Modelle verarbeiten Daten unterschiedlich.",
    openWebUi:
      "Selbst betriebene Browseroberfläche für Ollama und kompatible APIs. Ein Modell-Backend richtest du separat ein.",
    jan: "Desktop-Chat mit Modell-Downloads und lokaler API. Welche Modelle laufen, hängt von deiner Hardware ab.",
    anythingLlm:
      "Dokumente in einem Arbeitsbereich befragen. Mit lokaler Generierung und lokalen Embeddings bleibt die Verarbeitung auf dem Gerät.",
    gpt4all:
      "Desktop-Chat mit lokaler Dokumentensuche. Der verfügbare Speicher bestimmt die Modellgröße.",
    llamaCpp:
      "GGUF-Modelle mit detaillierten Einstellungen und kompatiblem lokalem Server ausführen. Die Einrichtung richtet sich an technisch versierte Nutzer.",
    typingMind:
      "Chat-Arbeitsbereich mit lokalem Speicher und eigenen Anbieterschlüsseln. Modellnutzung wird separat abgerechnet.",
    poe: "Verschiedene Modelle und Community-Bots in einer App ausprobieren. Die Nutzung kostet Rechenpunkte.",
    claude:
      "Projekte, Artefakte und Websuche für Texte und Code. Es gelten Nutzungslimits und Richtlinien.",
    gemini:
      "Deep Research und Anbindung an Google-Apps. Kontingente für Modelle und Medien hängen vom Tarif ab.",
    perplexity:
      "Webantworten mit überprüfbaren Quellen. Vertiefte Recherche und Modellauswahl sind kostenpflichtig.",
    copilot:
      "Passt zu Microsoft 365. Die Office-Integration hängt vom Tarif ab.",
    meta: "In unterstützten Meta-Apps verfügbar. Funktionen hängen von App und Land ab.",
    mistral:
      "Mistrals Assistent verbindet Chat mit Programmierfunktionen. In der Cloud gelten Mistrals Regeln.",
    deepseek:
      "Gehosteter DeepSeek-Chat, eigene API und Modellgewichte für ausgewählte Modelle. Prüfe die Regeln der verwendeten Variante.",
    qwen: "Alibaba bietet Qwen im Browser und veröffentlicht Modellgewichte. Betrieb und Filter hängen von der verwendeten Variante ab.",
    kimi: "Moonshots Assistent bietet Kimi-Modelle und Programmierabläufe. Die Cloud-Nutzung richtet sich nach dem Tarif.",
    spicychat:
      "Community-Figuren stehen auch im Gratiszugang bereit. Bezahltarife bieten mehr Kapazität und Funktionen.",
    chub: "Riesige Bibliothek an Figurenkarten und Lorebooks. Die eigenen Modelle brauchen den Mars-Tarif, gratis gibt es nur ein kleines Tageskontingent oder dein eigenes Backend.",
    dreamgen:
      "Szenen steuern und mit mehreren Figuren spielen. Nutzungsgrenzen hängen von Tarif und Modell ab.",
    novelai:
      "Lange Geschichten mit Lorebooks und Bildern im Anime-Stil. Alle Funktionen gibt es im Abo.",
    chai: "Community-Bots vor allem auf dem Smartphone entdecken. Es gelten die Regeln der App.",
    replika:
      "Ein dauerhafter Begleiter mit Stimme und Avatar. Der Funktionsumfang hängt vom Abo ab.",
    polybuzz:
      "Figuren in einer mobilen App erstellen und entdecken. Die App hat optionale Käufe und eigene Regeln.",
    fictionlab:
      "Interaktive Geschichten mit Szenarien der Community. Der Schwerpunkt liegt auf erzählerischem Text.",
    zeta: "Figuren erstellen und Szenarien der Community spielen. Die Verfügbarkeit hängt vom Land ab.",
    characterTavern:
      "Figurenkarten entdecken und erstellen. Ein Gratiszugang deckt den Einstieg in Figurenchats ab.",
    liteLlm:
      "Kompatiblen Proxy mit virtuellen Schlüsseln, Budgets und Ratenlimits selbst betreiben. Betrieb und Anbieterzugänge liegen bei dir.",
    portkey:
      "Ausweichrouten, Schutzregeln und Überwachung konfigurieren. Protokollierung und Betrieb hängen vom Setup ab.",
    vercel:
      "Passt zu Vercels AI SDK und berechnet keinen Tokenaufschlag. Vercel hostet das Routing.",
    cloudflare:
      "Edge-Caching, Ratenlimits und Routing. Prüfe die Kosten der Sammelabrechnung und die Protokolleinstellungen.",
    requesty:
      "Cloud-Gateway mit Routing nach Latenz und EU-Routing. Die Verfügbarkeit hängt von Modell und Konfiguration ab.",
    helicone:
      "KI-Gateway mit Anfrage-Traces und Kostenübersicht. Prüfe die Protokollierung vor dem Versand sensibler Daten.",
    eden: "Eine API für Sprachmodelle und Dienste wie OCR oder Übersetzung. Die Funktionen hängen vom gewählten Anbieter ab.",
    together:
      "Serverlose und dedizierte Inferenz mit OpenAI-, Responses- und Anthropic-Messages-API, dazu Bilder, Video und Sprache. Keine unzensierten Modelle, und die Nutzungsbedingungen verbieten Pornografie.",
    bifrost:
      "Go-Gateway mit Ausweichrouten und semantischem Cache selbst betreiben. Installation und Anbieterzugänge richtest du ein.",
    truefoundry:
      "Zentrale Zugriffsregeln und Überwachung für Teams. Prüfe Betrieb und Vertragskonditionen für deine Organisation.",
    llmGateway:
      "Kompatibel mit OpenAI und Anthropic, auch selbst betreibbar. Abrechnung und Aufbewahrung hängen vom Betrieb ab.",
    deepInfra:
      "Pro Token einer der günstigsten Anbieter für Standard-Open-Modelle, standardmäßig mit 200 gleichzeitigen Anfragen pro Modell. Im Katalog finden sich weder unzensierte noch Roleplay-Modelle.",
    bedrock:
      "Verwalteter Modellkatalog mit AWS-Zugriffskontrollen. Modelle und Funktionen hängen von der Region ab.",
    kong: "Erweitert ein API-Gateway um Modellrouting und Regeln. Prüfe, welche Plugins deine Edition enthält.",
    huggingFace:
      "Hub-Modelle über mehrere Inferenzanbieter aufrufen. Modell- und Hardwareangebot hängen vom Anbieter ab.",
    apiko:
      "Ein kompatibler Endpunkt für Text, Bild, Video und Audio. Prüfe Preis und Verfügbarkeit deines Modells.",
    zerouter:
      "Ein Schlüssel für Coding-Clients wie Claude Code und Codex. Prüfe Preise und Routing vor der Umstellung.",
    shannon:
      "Bietet ein eigenes Shannon-Modell und angepasste Open-Weight-Modelle. Die API rechnet nach Verbrauch ab.",
    nokeep:
      "Chat und Medien ohne Anmeldung. Der Verlauf bleibt im Browser, externe Modelle verarbeiten die Eingaben.",
    icelake:
      "Tägliches Chat-Kontingent plus Bild und Video. Die OpenAI-kompatible API setzt einen passenden Bezahltarif voraus.",
    uncensoredChat:
      "Browserchat mit 2.000 Starttokens. Medien und API-Zugang hängen vom Tarif ab.",
    aiDungeon:
      "Interaktive Abenteuer mit Story Cards. Bezahltarife bieten mehr Kontext und Erinnerungen.",
    talkie:
      "Figuren in einem Community-Katalog entdecken und selbst erstellen. Es gelten die Inhaltsregeln der App.",
    perchance:
      "Kostenloser Figurenchat im Browser ohne Anmeldung. Das schlanke Tool eignet sich für einzelne Sitzungen.",
    candy:
      "Virtuelle Partner mit Stimme und Bildern. Der Schwerpunkt liegt auf romantischen Begleiterchats.",
    ngrok:
      "Leitet Modellanfragen an verschiedene Anbieter und kann bei Schlüsselfehlern ausweichen. Prüfe Routing und Protokollierung im Setup.",
    sandbase:
      "Verbindet Modellaufrufe, Webdaten und Code-Sandboxes in einer API. Kostenlose Aufrufe haben ein Tageslimit.",
    openUncensored:
      "Prepaid-Schlüssel ohne Konto und ohne E-Mail: 58 Textmodelle, fast alle abliteriert, dazu RP-Feintunes, 20 Bild- und 3 Videomodelle. Anbieterpreis ohne Provision, Aufladungen ab 5 USD, die nie verfallen. Kein Gratis-Kontingent, kein Web-Chat.",
    risuAi:
      "Open-Source-Client für Figurenchats mit Lorebooks, Gruppenchats, Emotionsbildern und TTS. Die Modell-API bringst und bezahlst du selbst.",
    agnai:
      "Rollenspiel-Client, gehostet oder selbst betrieben, mit Gruppenchats für mehrere Nutzer und Lorebooks. Die Preise der gehosteten Tarife sind nicht öffentlich.",
    koboldCpp:
      "Lokaler Runner in einer Datei für GGUF-Modelle, mit eingebauter Chatoberfläche und OpenAI-kompatibler API. Ohne eigene GPU wartest du in der Warteschlange der freiwilligen AI Horde.",
    talemate:
      "Rollenspiel-Engine mit mehreren Agenten: Erzähler, Regisseur und Verfolgung des Weltzustands. Ein Werkzeug zum Selbstinstallieren für Power-User.",
    featherless:
      "Über 50.000 Hugging-Face-Modelle hinter einem Schlüssel, 1.398 als abliterated und 1.605 als uncensored getaggt. Der Tarif Chat für 25 USD bietet unbegrenzte Tokens, aber nur 32K Kontext, wenig parallele Anfragen und ausschließlich private Nutzung.",
    arliAi:
      "Unbegrenzte Tokens in Flatrate-Tarifen ab 15 USD: rund 121 Textmodelle, viele davon derestricted oder unzensierte Feintunes, dazu Bildgenerierung. Core und Plus bearbeiten nur eine Anfrage gleichzeitig.",
    infermatic:
      "Flatrate ab 9 USD für eine kuratierte Auswahl unzensierter 70B-Tunes und Roleplay-Tunes, mit No-Logs-Versprechen. Der Gratis-Tarif gilt nur im Web, und Einzeltarife dürfen keine Apps antreiben.",
    chutes:
      "Dezentrale Inferenz pro Token, die meisten Textmodelle in Confidential Compute, Krypto möglich. Keine unzensierten Modelle und kein Gratis-Kontingent.",
    kagi: "Assistent mit mehreren Modellen, gebündelt mit der Kagi-Suche. Threads werden standardmäßig nach 24 Stunden gelöscht, Spitzenmodelle brauchen den höchsten Tarif.",
    huggingChat:
      "Chat mit offenen Modellen über einen automatischen Router. Der Chatcode ist Open Source, die Inferenz wird über Hugging-Face-Credits abgerechnet.",
    zai: "Zhipus eigener Chat für GLM-Modelle, mit separater API. Laut Datenschutzerklärung werden Nachrichteninhalte zum Modelltraining genutzt.",
    ourDream:
      "Baukasten für Begleiter ab 18 mit Chat, Bildern und Video. Medien laufen über Coins, die du nur mit aktivem Abo kaufen kannst.",
    refuseless:
      "Reiner API-Host für abliterierte Versionen von GLM 5.3, DeepSeek V4.1 Flash und Kimi K3.1 Pro mit 1 Mio. Kontext, im Format OpenAI, Responses und Anthropic Messages. Verifizierte E-Mail nötig, keine Chat-App.",
    nearAi:
      "API in Confidential Compute mit zwei abliterierten Modellen und Hardware-Attestierung. Kein Antrag, keine Identitätsprüfung, Bezahlung pro Token.",
    uncensoredLlmAi:
      "Prepaid-Gateway mit 332 abliterierten und unzensierten Chatmodellen und täglicher Prüfung auf Ablehnungen. Karte oder Krypto ab 3 USD, kein Weiterverkauf ohne schriftliche Zustimmung.",
    abliterationAi:
      "Eigene abliterierte Modelle im OpenAI- und Anthropic-Format, EU-Region und eine Policy-Schicht für deine eigenen Regeln. Tarife ab 20 USD im Monat.",
    mancer:
      "Roleplay-Feintunes wie MythoMax und Magnum mit einem Gratis-Tarif namens MythoLite. Keine abliterierten Modelle, und die Bedingungen verbieten obszönes oder anzügliches Material.",
  },
  articles: {
    "nofiltergpt-alternatives": {
      question:
        "Welche NoFilterGPT-Alternativen nennen ihr Modell oder laufen offline?",
      answer:
        "Unrestricted.chat nennt sein Dolphin-Mistral-Modell, führt es aber auf eigenen Servern aus. LM Studio, Ollama und Jan starten heruntergeladene Modelle auf deinem Gerät. Bei {{appName}} wählst du das Modell und speicherst Inkognito-Verläufe im Browser. Gehostete Modelle erhalten deine Eingabe.",
    },
    "freedomgpt-alternatives": {
      question:
        "Was ersetzt die ältere FreedomGPT-App für den Offline-Einsatz?",
      answer:
        "LM Studio und Jan bieten Desktop-Apps für heruntergeladene Modelle. Ollama liefert eine lokale API und lässt sich mit Open WebUI im Browser nutzen. AnythingLLM eignet sich für Dokumente, wenn du lokale Modelle und Embeddings einrichtest.",
    },
    "gab-ai-alternatives": {
      question: "Was ersetzt Arya bei politischen Fragen?",
      answer:
        "Für unterschiedliche Perspektiven fragst du bei {{appName}} mehrere Modelle im selben Chat. Für Webrecherche mit Quellen kommen Perplexity oder die Suche von Grok infrage. Prüfe die Originalquellen. Jedes Modell kann eine Sichtweise spiegeln oder sich in Fakten irren.",
    },
    "openrouter-alternatives": {
      question:
        "Welche OpenRouter-Alternative passt zu einer produktiven Anwendung?",
      answer:
        "Für unzensierten Traffic: OpenUncensored, Refuseless oder NEAR AI Cloud für abliterierte Gewichte zum Anbieterpreis, {{appName}}, wenn du zusätzlich Mainstream-Modelle, Medien und einen Chat unter demselben Schlüssel brauchst. Zum Routen eigener Anbieterkonten: LiteLLM oder Bifrost selbst gehostet, Vercel gehostet ohne Token-Aufschlag. Prüfe Fallbacks, Datenspeicherung und Gebühren, bevor du Traffic umziehst.",
    },
    "venice-ai-alternatives": {
      question:
        "Welche Datenschutzoptionen gehen über lokalen Browserverlauf hinaus?",
      answer:
        "Maple, Confer und Morse beschreiben überprüfbare hardwareisolierte Verarbeitung. Lumo verschlüsselt gespeicherte Verläufe, Duck.ai nutzt einen Proxy. LM Studio und Ollama führen heruntergeladene Modelle auf deinem Gerät aus. Prüfe, wo die Eingabe entschlüsselt wird und ob du Medien oder eine API brauchst.",
    },
    "character-ai-alternatives": {
      question:
        "Welche Apps eignen sich für Figuren, längere Geschichten oder einen festen Begleiter?",
      answer:
        "Janitor AI, SpicyChat und Chub bieten Figurenbibliotheken. DreamGen und NovelAI geben dir mehr Kontrolle über Szenen oder längere Geschichten. Kindroid und Nomi richten sich auf langfristige Begleiter aus. Mit SillyTavern richtest du Backend und Figurenkarten selbst ein.",
    },
    "chatgpt-alternative-without-filters": {
      question: "Bei welchen ChatGPT-Alternativen habe ich mehr Modellauswahl?",
      answer:
        "Bei {{appName}} und Venice wählst du zwischen Modellen, die unterschiedlich oft ablehnen. NanoGPT rechnet nach Verbrauch ab. LM Studio und Ollama führen heruntergeladene Modelle lokal aus. Claude und Gemini eignen sich für Texte oder Recherche und wenden ihre eigenen Richtlinien an.",
    },
    "chatgpt-jailbreak-alternative": {
      question: "Was sollte ich vor dem Modellwechsel vergleichen?",
      answer:
        "Prüfe, ob der Dienst das Modell nennt, wie das Gratislimit funktioniert und wo deine Eingabe verarbeitet wird. Teste typische Schreibaufgaben oder Rollenspieltexte bei {{appName}}, Venice oder in einer lokalen App. Antworten und Ablehnungen hängen von Modell und Dienst ab.",
    },
    "grok-alternative": {
      question:
        "Welche Alternativen decken Groks Suche und Kreativfunktionen ab?",
      answer:
        "Perplexity liefert Webantworten mit Quellen. Gemini bietet Deep Research und Video in passenden Tarifen. Venice und {{appName}} verbinden Modellauswahl mit Medienerstellung. Bleib bei Grok, wenn du regelmäßig X-Beiträge direkt im Chat suchst.",
    },
    "chub-ai-alternatives": {
      question: "Kann ich meine Chub-Figurenkarten woanders weiter nutzen?",
      answer:
        "Ja. Chub-Karten lassen sich als PNG oder JSON im V2-Kartenformat herunterladen, SillyTavern, RisuAI und Agnaistic importieren sie direkt. {{appName}} macht aus einer Figur einen Skill, mit dem du auf jedem Modell chattest. Lorebooks lassen sich nach SillyTavern und RisuAI mitnehmen.",
    },
    "crushon-ai-alternatives": {
      question: "Welche CrushOn-Alternative hat die kalkulierbarsten Kosten?",
      answer:
        "Pauschaltarife: Kindroid, Nomi und SpicyChat verlangen einen festen Monatspreis. Nach Verbrauch: {{appName}} und NanoGPT rechnen pro Nachricht ab, ein ruhiger Monat kostet also weniger. Ein Modell auf dem eigenen PC mit SillyTavern und KoboldCpp kostet nach der Hardware nichts mehr.",
    },
    "sillytavern-alternatives": {
      question: "Gibt es eine SillyTavern-Alternative ohne Installation?",
      answer:
        "Ja. Janitor AI, Chub und Character Tavern laufen im Browser, Figuren inklusive. RisuAI hat auch eine Webversion. {{appName}} läuft in jedem Browser, auch auf dem iPhone, mit bereits angebundenen Modellen, du richtest also keinen API-Schlüssel ein.",
    },
    "nanogpt-alternatives": {
      question:
        "Welche NanoGPT-Alternative passt für offene Modelle zum Pauschalpreis?",
      answer:
        "Featherless, Arli AI und Infermatic verkaufen Monatstarife für offene und unzensierte Modelle, mit Grenzen bei Kontext oder parallelen Anfragen. OpenRouter und Chutes rechnen pro Token ab. {{appName}} rechnet pro Nachricht aus einem Guthaben ab, für unzensierte, offene und Mainstream-Modelle.",
    },
    "claude-alternatives": {
      question: "Welche Claude-Alternative schreibt die besten langen Texte?",
      answer:
        "GPT und Gemini kommen bei strukturierten Texten am nächsten heran. Kimi und GLM sind starke offene Modelle mit weniger Ablehnungen. Für Fiktion, die Claude ablehnt, nimm auf {{appName}} ein unzensiertes Modell wie GLM 5.3 Uncensored oder UncensoredLM und behalte Claude im selben Thread fürs Überarbeiten.",
    },
  },
};
