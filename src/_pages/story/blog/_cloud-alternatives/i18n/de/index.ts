import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  rules: {
    checked:
      "Am {{date}} in der offiziellen Doku und den Richtlinien jedes Anbieters gelesen. Auf dem Handy seitlich scrollen.",
    columns: {
      name: "Dienst",
      defaults: "Filter standardmäßig",
      off: "Abschalten",
      models: "Unzensierte Modelle",
      weights: "Eigene Gewichte",
      rules: "Inhaltsregeln, die bleiben",
    },
    rows: {
      azure: {
        defaults: "An für jedes Modell außer Whisper.",
        off: "Nur mit Genehmigung. Kunden können selbst auf High only lockern. Volle Kontrolle verlangt einen Antrag, offen nur für Kunden mit Microsoft-Account-Team oder in einem berechtigten Programm.",
        models: "Im Katalog keine gefunden.",
        weights: "Für diesen Guide nicht geprüft.",
        rules:
          "Der Code of Conduct verbietet sexuell explizite Inhalte sowie erotische oder romantische Chatbots, mit Filter oder ohne.",
      },
      bedrock: {
        defaults:
          "Kein Bedrock-Filter, solange Sie keine Guardrail anhängen. CSAM-Erkennung läuft immer.",
        off: "Die Guardrail-ID weglassen. Die Verweigerungen des Modells selbst bleiben.",
        models: "Keine im Katalog.",
        weights:
          "Custom Model Import: Architekturen von Llama, Mistral, Qwen und gpt-oss, abgerechnet pro Custom Model Unit und Minute.",
        rules:
          "Die Responsible AI Policy verbietet, Sicherheitsfilter zu umgehen, und nicht einvernehmliche sexuelle Bilder.",
      },
      vertex: {
        defaults:
          "Ab gemini-3.5-flash standardmäßig aus. Kernschäden bleiben blockiert.",
        off: "Schwellenwerte auf OFF setzen. Die antrainierten Verweigerungen von Gemini bleiben.",
        models: "Keine in der Liste offener Modelle.",
        weights: "Model Garden Self-Deploy auf vLLM- oder TGI-Containern.",
        rules:
          "Die Prohibited Use Policy verbietet sexuell explizite Inhalte und das Umgehen von Sicherheitsfiltern.",
      },
      together: {
        defaults:
          "Auf den gelesenen Seiten ist kein Filterschalter dokumentiert.",
        off: "Nicht zutreffend.",
        models: "Keine in der Serverless-Liste.",
        weights:
          "Dedizierte Endpunkte ab $5.49 pro H100-Stunde. Uploads müssen Fine-Tunes einer unterstützten Architektur sein.",
        rules: "Die Bedingungen verbieten obszöne Inhalte und Pornografie.",
      },
      us: {
        defaults:
          "Sie wählen das Modell: Mainstream, offen oder unzensiert. Keine Filterschicht obendrauf.",
        off: "Ein unzensiertes Modell wählen und einmalig bestätigen, dass Sie 18+ sind.",
        models: "{{uncensored}} derzeit live.",
        weights: "Nicht unterstützt. Wir betreiben einen kuratierten Katalog.",
        rules:
          "Unzensierte Modelle werden nach einer einmaligen 18+-Bestätigung freigeschaltet. Die Bedingungen des Modellanbieters gelten weiter.",
      },
    },
    sourceLabels: {
      filters: "{{name}}: Filter-Doku",
      access: "{{name}}: Zugangsregeln",
      policy: "{{name}}: Nutzungsrichtlinie",
      privacy: "{{name}}: Datenverarbeitung",
      pricing: "{{name}}: Preise",
      import: "{{name}}: eigene Gewichte",
    },
    sourcesTitle: "Quellen",
  },
  prices: {
    columns: {
      model: "Modell",
      provider: "Anbieter",
      input: "Input / 1M",
      output: "Output / 1M",
    },
    us: "{{appName}}",
    live: "Live-Preis",
    source: "Quelle",
    note: "USD pro 1M Token. Preise der Konkurrenz am {{date}} aus deren öffentlichen Modelllisten gelesen. Unsere werden live aus unserem Register gelesen, inklusive unserer {{markup}}% Marge. Wo eine günstigere Route konfiguriert ist, nutzen wir sie, und der angezeigte Preis folgt ihr.",
  },
  alts: {
    heading: "{{number}}. {{name}}",
    strength: "Stärke:",
    catch: "Haken:",
    sources: "Quellen:",
    versusLink: "{{appName}} vs. {{name}}: der ganze Vergleich",
    openRouter: {
      what: "Gateway mit 477 Modellen hinter einem Schlüssel. Kein Aufschlag auf die Inferenz, 5.5% Gebühr auf Guthabenkäufe (5% bei Krypto).",
      strength:
        "Eigene Anbieter-Schlüssel bis $25,000 im Monat gratis, Zero-Data-Retention-Routing pro Request, Zahlung in USDC.",
      catch:
        "17 auf Rollenspiel oder Unzensiertes getunte Modelle, keine einzige ID mit abliterated oder uncensored im Namen. Im API-Überblick kein Anthropic-Messages-Endpunkt.",
    },
    venice: {
      what: "Chat-App plus OpenAI-kompatible API. Eigene Fine-Tunes Venice Uncensored 1.2 ($0.20 / $0.90) und Venice Role Play Uncensored, daneben abliterierte GLM-, DeepSeek-, Gemma- und Qwen-Modelle.",
      strength:
        "Bild, Video, Stimme und Musik in derselben API. Verschlüsselte Modelle und TEE-Optionen. Bezahlung pro Request aus einem USDC-Wallet mit x402, ohne Konto.",
      catch:
        "Kein nativer Anthropic-Messages-Endpunkt, Claude Code braucht einen lokalen Proxy. Die Bedingungen verbieten den Weiterverkauf des Zugangs. Der Gratis-Tarif ist auf 10 Text-Prompts pro Tag begrenzt.",
    },
    nanoGpt: {
      what: "Pay-per-use-Gateway mit 610 Modellen, davon etwa 54 abliterierte oder unzensierte IDs.",
      strength:
        "OpenAI Chat Completions, Responses und Anthropic Messages. Bitcoin und Monero, kein Konto nötig, Pay-as-you-go-Weiterverkauf erlaubt.",
      catch:
        "Ein unübersichtlicher Katalog mit vielen fast identischen unzensierten IDs. Das Produkt ist zuerst Gateway.",
    },
    openUncensored: {
      what: "API-Router für abliterierte Gewichte: 58 Text-, 20 Bild- und 3 Videomodelle mit vorausbezahltem Schlüssel. Ihr Schlüssel ist Ihr Konto.",
      strength:
        "Keine Provision auf die Anbieterpreise. GLM 5.3 Flash Uncensored ab $0.12 / $0.50. OpenAI-, Responses- und Anthropic-Format unter einer Base-URL.",
      catch:
        "Kein Gratis-Tarif, Krypto nicht erwähnt, Request-Metadaten bis zu zwei Jahre gespeichert. Kein Web-Chat, nur eine Desktop-App.",
    },
    refuseless: {
      what: "Reiner API-Host für offene Gewichte ohne Verweigerung: vier abliterierte Modelle mit 1M Kontext, dazu ein paar unveränderte.",
      strength:
        "DeepSeek V4.1 Flash abliterated für $0.12 / $0.45 und GLM 5.3 Flash abliterated für $0.12 / $0.50. Chat Completions, Responses, Anthropic Messages und Embeddings.",
      catch:
        "Keine Chat-Oberfläche. Seine Datenschutz- und Bedingungsseiten haben unseren Reader blockiert, lesen Sie sie also selbst, bevor Sie live gehen.",
    },
    abliterationHosts: {
      what: "Zwei weitere abliterierte APIs. NEAR AI Cloud betreibt Modelle in Hardware-Enklaven: Qwen 3.8 27B Abliterated für $0.04 / $1.35. abliteration.ai verkauft eigene abliterierte Marken ab $1 / $2.",
      strength:
        "NEAR: kein Antrag, keine Identitätsprüfung, überprüfbare Attestierung. abliteration.ai: Prompts werden im Arbeitsspeicher verarbeitet und standardmäßig nicht gespeichert, EU-Region, OpenAI- und Anthropic-Format.",
      catch:
        "Kleine Kataloge. NEAR erwähnt kein Anthropic-Format. abliteration.ai kostet für ähnliche Gewichte mehr als Refuseless oder NEAR.",
    },
    togetherFireworks: {
      what: "Schnelle Inferenz-Clouds für unveränderte offene Modelle. Together betreibt 24 Serverless-Chatmodelle, keins davon unzensiert. Fireworks listet Dolphin-, Hermes- und Dobby-Unhinged-Modelle, ihr Serverless-Status ist nicht bestätigt.",
      strength:
        "Together: OpenAI, Responses und Anthropic Messages, Zero Data Retention im Self-Service. Fireworks: bei offenen Modellen standardmäßig keine Prompt-Logs, bis zu 6,000 Requests pro Minute.",
      catch:
        "Die Bedingungen von Together verbieten obszöne Inhalte und Pornografie. Fireworks verlangt die Zusicherung, dass Ihr Input keine Nacktheit und nichts sexuell Anzügliches enthält.",
    },
    selfHost: {
      what: "Abliterierte Gewichte selbst betreiben. Ollama und LM Studio auf dem Arbeitsplatzrechner, vLLM oder TGI auf eigenen GPUs. Alle sprechen das OpenAI-Chat-Completions-Format.",
      strength:
        "Prompts verlassen Ihre Rechner nie. Jedes abliterierte GGUF- oder Safetensors-Modell, das Sie herunterladen können. Lokale Nutzung kostet nichts außer Hardware.",
      catch:
        "GPUs, Updates und Verfügbarkeit liegen bei Ihnen. Modelle in Frontier-Größe brauchen Rechenzentrums-Hardware.",
    },
  },
};
