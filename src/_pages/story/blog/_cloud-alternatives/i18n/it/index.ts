import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  rules: {
    checked:
      "Letto nella documentazione e nelle policy ufficiali di ogni provider il {{date}}. Su mobile scorri lateralmente.",
    columns: {
      name: "Servizio",
      defaults: "Filtro predefinito",
      off: "Disattivarlo",
      models: "Modelli senza censura",
      weights: "I tuoi pesi",
      rules: "Regole sui contenuti che restano",
    },
    rows: {
      azure: {
        defaults: "Attivo su ogni modello tranne Whisper.",
        off: "Solo se approvato. I clienti possono allentare fino a High only. Il controllo completo richiede una richiesta, aperta solo ai clienti gestiti da un account team Microsoft o in un programma idoneo.",
        models: "Nessuno trovato nel catalogo.",
        weights: "Non verificato per questa guida.",
        rules:
          "Il Code of Conduct vieta i contenuti sessualmente espliciti e i chatbot erotici o romantici, con i filtri attivi o no.",
      },
      bedrock: {
        defaults:
          "Nessun filtro Bedrock se non colleghi un Guardrail. Il rilevamento CSAM è sempre attivo.",
        off: "Ometti l'ID del guardrail. I rifiuti del modello restano.",
        models: "Nessuno nel catalogo.",
        weights:
          "Custom Model Import: architetture Llama, Mistral, Qwen e gpt-oss, fatturato al minuto per Custom Model Unit.",
        rules:
          "La Responsible AI Policy vieta di aggirare i filtri di sicurezza e le immagini sessuali non consensuali.",
      },
      vertex: {
        defaults:
          "Disattivato di default per gemini-3.5-flash e successivi. I danni principali restano bloccati.",
        off: "Imposta le soglie su OFF. I rifiuti appresi di Gemini restano.",
        models: "Nessuno nell'elenco dei modelli aperti.",
        weights: "Self-deploy da Model Garden su container vLLM o TGI.",
        rules:
          "La Prohibited Use Policy vieta i contenuti sessualmente espliciti e l'elusione dei filtri di sicurezza.",
      },
      together: {
        defaults:
          "Nessun interruttore del filtro documentato nelle pagine che abbiamo letto.",
        off: "Non applicabile.",
        models: "Nessuno nell'elenco serverless.",
        weights:
          "Endpoint dedicati da $5.49 per ora di H100. I caricamenti devono essere fine-tune di un'architettura supportata.",
        rules: "I termini vietano contenuti osceni e pornografia.",
      },
      us: {
        defaults:
          "Scegli tu il modello: mainstream, aperto o senza censura. Nessun livello di filtro sopra.",
        off: "Scegli un modello senza censura e conferma una volta di avere 18 anni o più.",
        models: "{{uncensored}} attivi in questo momento.",
        weights: "Non supportato. Serviamo un catalogo curato.",
        rules:
          "I modelli senza censura si sbloccano dopo un consenso 18+ una tantum. I termini del provider del modello restano validi.",
      },
    },
    sourceLabels: {
      filters: "{{name}}: doc sui filtri",
      access: "{{name}}: regole di accesso",
      policy: "{{name}}: policy d'uso",
      privacy: "{{name}}: gestione dei dati",
      pricing: "{{name}}: prezzi",
      import: "{{name}}: pesi propri",
    },
    sourcesTitle: "Fonti",
  },
  prices: {
    columns: {
      model: "Modello",
      provider: "Provider",
      input: "Input / 1M",
      output: "Output / 1M",
    },
    us: "{{appName}}",
    live: "prezzo live",
    source: "fonte",
    note: "USD per 1M di token. Prezzi dei concorrenti letti il {{date}} dai loro elenchi pubblici di modelli. Il nostro è letto live dal nostro registro, ricarico del {{markup}}% incluso. Dove è configurata una route più economica la usiamo, e il prezzo mostrato la segue.",
  },
  alts: {
    heading: "{{number}}. {{name}}",
    strength: "Il lato forte:",
    catch: "Il rovescio:",
    sources: "Fonti:",
    versusLink: "{{appName}} vs {{name}}: confronto completo",
    openRouter: {
      what: "Gateway con 477 modelli dietro una sola chiave. Nessun ricarico sull'inferenza, commissione del 5.5% sugli acquisti di crediti (5% in crypto).",
      strength:
        "Porta le tue chiavi dei provider, gratis fino a $25,000 al mese, routing zero data retention per richiesta, pagamenti in USDC.",
      catch:
        "17 modelli per roleplay o ottimizzati senza censura, nessun id con abliterated o uncensored nel nome. Nessun endpoint Anthropic Messages nella panoramica dell'API.",
    },
    venice: {
      what: "App di chat più un'API compatibile OpenAI. Fine-tune propri Venice Uncensored 1.2 ($0.20 / $0.90) e Venice Role Play Uncensored, accanto a modelli GLM, DeepSeek, Gemma e Qwen abliterated.",
      strength:
        "Immagini, video, voce e musica nella stessa API. Opzioni di modelli cifrati e in TEE. Pagamento per richiesta da un wallet USDC con x402, senza account.",
      catch:
        "Nessun endpoint Anthropic Messages nativo, Claude Code richiede un proxy locale. I termini vietano la rivendita dell'accesso. Il piano gratuito: 10 prompt di testo al giorno.",
    },
    nanoGpt: {
      what: "Gateway a consumo con 610 modelli, circa 54 dei quali id abliterated o senza censura.",
      strength:
        "Chat completions OpenAI, Responses e Anthropic Messages. Bitcoin e Monero, nessun account necessario, rivendita a consumo consentita.",
      catch:
        "Un catalogo caotico, con molti id senza censura quasi identici. Il prodotto nasce prima di tutto come gateway.",
    },
    openUncensored: {
      what: "Router API per pesi abliterated: 58 modelli di testo, 20 di immagini e 3 di video con una chiave prepagata. La tua chiave è il tuo account.",
      strength:
        "Nessuna commissione sui prezzi dei provider. GLM 5.3 Flash Uncensored da $0.12 / $0.50. Formati OpenAI, Responses e Anthropic su un'unica base URL.",
      catch:
        "Nessun piano gratuito, crypto non menzionate, metadati delle richieste conservati fino a due anni. Nessuna chat web, solo un'app desktop.",
    },
    refuseless: {
      what: "Host solo API di pesi aperti senza rifiuti: quattro modelli abliterated con 1M di contesto, più alcuni standard.",
      strength:
        "DeepSeek V4.1 Flash abliterated a $0.12 / $0.45 e GLM 5.3 Flash abliterated a $0.12 / $0.50. Chat completions, Responses, Anthropic Messages ed embeddings.",
      catch:
        "Nessuna interfaccia di chat. Le sue pagine di privacy e termini hanno bloccato il nostro lettore: leggile tu stesso prima di andare in produzione.",
    },
    abliterationHosts: {
      what: "Altre due API abliterated. NEAR AI Cloud esegue i modelli in enclave hardware: Qwen 3.8 27B Abliterated a $0.04 / $1.35. abliteration.ai vende marchi abliterated propri da $1 / $2.",
      strength:
        "NEAR: nessuna richiesta di accesso, nessun controllo d'identità, attestazione verificabile. abliteration.ai: prompt elaborati in memoria e non salvati di default, regione UE, formati OpenAI e Anthropic.",
      catch:
        "Cataloghi piccoli. NEAR non cita alcun formato Anthropic. abliteration.ai costa più di Refuseless o NEAR per pesi simili.",
    },
    togetherFireworks: {
      what: "Cloud di inferenza veloci per modelli aperti standard. Together serve 24 modelli di chat serverless, nessuno senza censura. Fireworks elenca modelli Dolphin, Hermes e Dobby Unhinged, stato serverless non confermato.",
      strength:
        "Together: OpenAI, Responses e Anthropic Messages, zero data retention in self-service. Fireworks: nessun log dei prompt di default per i modelli aperti, fino a 6,000 richieste al minuto.",
      catch:
        "I termini di Together vietano contenuti osceni e pornografia. Fireworks ti fa garantire che il tuo input non contenga nudità né contenuti sessualmente allusivi.",
    },
    selfHost: {
      what: "Esegui tu stesso i pesi abliterated. Ollama e LM Studio su una workstation, vLLM o TGI sulle tue GPU. Tutti parlano il formato OpenAI chat completions.",
      strength:
        "I prompt non lasciano mai le tue macchine. Qualsiasi modello abliterated in GGUF o safetensors che puoi scaricare. L'uso locale non costa nulla oltre all'hardware.",
      catch:
        "GPU, aggiornamenti e uptime sono affar tuo. I modelli di taglia frontier richiedono hardware da datacenter.",
    },
  },
};
