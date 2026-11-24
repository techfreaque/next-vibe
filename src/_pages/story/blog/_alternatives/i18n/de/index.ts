import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Plattformen im Vergleich",
  verify:
    "Weitere Angebote haben wir am {{date}} anhand der verlinkten offiziellen Quellen geprüft. Wische auf dem Handy seitlich, um alle Spalten zu sehen. Limits hängen vom Tarif und vom Land ab.",
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
    chub: "Figurenkarten und Lorebooks durchsuchen oder eigenes Backend anbinden. Das Backend bestimmt Kosten und Datenschutz mit.",
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
      "Serverlose Inferenz und dedizierte Endpunkte für offene Modelle. Prüfe, ob dein Modell im Katalog steht.",
    bifrost:
      "Go-Gateway mit Ausweichrouten und semantischem Cache selbst betreiben. Installation und Anbieterzugänge richtest du ein.",
    truefoundry:
      "Zentrale Zugriffsregeln und Überwachung für Teams. Prüfe Betrieb und Vertragskonditionen für deine Organisation.",
    llmGateway:
      "Kompatibel mit OpenAI und Anthropic, auch selbst betreibbar. Abrechnung und Aufbewahrung hängen vom Betrieb ab.",
    deepInfra:
      "Gehostete offene Modelle und private GPU-Installationen. Wähle aus dem Katalog oder richte eigene Infrastruktur ein.",
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
        "Vercel bietet gehosteten Zugang ohne Tokenaufschlag. LiteLLM und Bifrost betreibst du selbst mit eigenen Anbieterkonten. Für Überwachung oder Richtlinien vergleiche Portkey, Cloudflare und Helicone. Prüfe Ausweichrouten, Datenspeicherung und Gebühren.",
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
  },
};
