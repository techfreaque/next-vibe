import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Piattaforme a confronto",
  verify:
    "Abbiamo verificato le altre opzioni il {{date}} consultando le fonti ufficiali indicate. Su mobile, scorri la tabella in orizzontale per vedere tutte le colonne. I limiti variano in base al piano e al paese.",
  related: "Altre guide alle alternative",
  kind: {
    chat: "Chat con meno rifiuti",
    assistant: "Assistente generalista",
    writing: "Scrittura creativa",
    privateChat: "Chat orientata alla privacy",
    frontend: "Interfaccia per modelli",
    local: "Ambiente per modelli locali",
    multiChat: "Chat con più modelli",
    research: "Assistente di ricerca",
    roleplay: "Gioco di ruolo con personaggi",
    companion: "Compagno IA",
    gateway: "Gateway API",
    inference: "Inferenza ospitata",
  },
  free: {
    yes: "Accesso gratuito limitato",
    software: "Software gratuito",
    trial: "Prova o crediti iniziali",
    unlisted: "Verifica con il fornitore",
    public: "Accesso gratuito",
  },
  paid: {
    plan: "Abbonamento",
    usage: "A consumo",
    both: "Abbonamento o consumo, secondo il prodotto",
    hosted: "Piano cloud facoltativo",
    none: "Costo dell’hardware",
    contact: "Piani commerciali",
    license: "Licenza e consumo dei modelli",
    unlisted: "Verifica con il fornitore",
    fixedAccess: "Accesso prepagato per 30 giorni",
    byoApi: "App gratuita, paghi il fornitore del modello",
  },
  filter: {
    permissive: "Il servizio dichiara meno rifiuti",
    policy: "Si applicano le regole del fornitore",
    adultPolicy: "Opzioni per adulti soggette alle regole della piattaforma",
    selected: "Meno rifiuti con alcuni modelli",
    varies: "Dipende dal modello e dal fornitore",
    guardrails: "Controlli configurabili e regole del fornitore",
  },
  privacy: {
    noFilter: "Dichiara di cancellare le chat, registra IP e utilizzo",
    trainingControl:
      "Servizio cloud, verifica le impostazioni di addestramento",
    hosted: "Servizio cloud soggetto alle condizioni del fornitore",
    deviceHistory:
      "Cronologia sul dispositivo, richieste inviate ai modelli remoti",
    enclave: "Elaborazione in un’enclave hardware",
    encryptedHistory: "Cronologia salvata e cifrata",
    proxy: "Proxy per le richieste in cloud",
    noTraining: "Il fornitore dichiara di escludere le chat dall’addestramento",
    configurable: "Dipende dall’installazione e dai log",
    localOption: "Sul dispositivo con un modello locale",
    upstream: "Dipende dal fornitore del modello",
    noLogs: "Il fornitore dichiara di non conservare log dei prompt",
  },
  api: {
    separate: "API offerta a parte",
    unlisted: "Nessuna API pubblica indicata",
    available: "Disponibile",
    local: "API locale",
    backend: "Si collega a un backend",
    openAi: "Compatibile con OpenAI",
    dual: "Compatibile con OpenAI e Anthropic",
    eligible: "Piani a pagamento idonei",
  },
  media: {
    text: "Testo",
    image: "Immagini",
    voice: "Voce",
    imageVoice: "Immagini e voce",
    imageVideo: "Immagini e video",
    all: "Immagini, video e voce",
    varies: "Secondo il modello o il piano",
  },
  open: {
    closed: "Servizio proprietario",
    weights: "Alcuni pesi dei modelli sono disponibili",
    client: "Codice del client disponibile",
    open: "Open source, installabile in proprio",
    core: "Componente aperto disponibile",
    license: "Codice disponibile con condizioni di licenza",
  },
  fees: {
    topUp: "{{fee}} sull’acquisto di crediti",
    markup: "{{fee}} sul consumo dei modelli",
    noMarkup: "Prezzo dei token del fornitore",
  },
  summaries: {
    noFilter:
      "Chat in stile GPT con tono regolabile. Il piano gratuito limita i messaggi giornalieri.",
    chatGpt:
      "Ricerca, file e voce nella stessa app. I limiti dipendono dal piano.",
    grok: "Cerca nei post di X e sul web. Limiti più alti e alcune funzioni richiedono un piano a pagamento.",
    unrestricted:
      "Chat essenziale nel browser con un modello Dolphin-Mistral dichiarato. La versione web usa un solo modello testuale.",
    uncensoredCom:
      "Chat, personaggi e contenuti multimediali nello stesso servizio. Le quote variano in base al piano.",
    hemmingway:
      "Narrativa per adulti e gioco di ruolo con un modello a pesi aperti. L’offerta Unlocked si concentra sul testo.",
    maple:
      "L’app verifica l’enclave di elaborazione. Il modello senza censura richiede un piano a pagamento.",
    confer:
      "Il client verifica l’attestazione dell’enclave prima dell’invio. Indicato per chat testuali riservate.",
    lumo: "Proton offre chat per ospiti e cronologia salvata con crittografia senza accesso per il gestore. I modelli girano sui server di Proton.",
    duck: "Puoi provare più modelli senza account. DuckDuckGo inoltra le richieste ai fornitori tramite un proxy.",
    morse:
      "Offre inferenza riservata e un’opzione testuale senza censura. Verifica i modelli inclusi nel piano.",
    harbor:
      "Chat privata e ricerca sul web con Harbor-1. Il servizio elabora le richieste nel cloud.",
    leo: "Fai domande sulla pagina aperta in Brave. I modelli integrati e quelli personalizzati gestiscono i dati in modo diverso.",
    openWebUi:
      "Interfaccia web da ospitare in proprio per Ollama e API compatibili. Il motore si configura a parte.",
    jan: "Chat desktop con modelli scaricabili e API locale. I modelli disponibili dipendono dall’hardware.",
    anythingLlm:
      "Fai domande sui documenti di uno spazio di lavoro. Usa generazione ed embedding locali per elaborare tutto sul dispositivo.",
    gpt4all:
      "Chat desktop con ricerca nei documenti locali. La dimensione del modello dipende dalla memoria disponibile.",
    llamaCpp:
      "Esegue modelli GGUF con controlli dettagliati e un server locale compatibile. L’installazione richiede dimestichezza tecnica.",
    typingMind:
      "Spazio di chat con memoria locale e chiavi dei fornitori a tua scelta. Il consumo dei modelli si paga a parte.",
    poe: "Più modelli e bot della comunità in una sola app. L’utilizzo consuma punti di calcolo.",
    claude:
      "Progetti, artefatti e ricerca web per scrivere e programmare. Si applicano limiti e regole d’uso.",
    gemini:
      "Deep Research e collegamenti alle app Google. Le quote per modelli e contenuti multimediali dipendono dal piano.",
    perplexity:
      "Risposte dal web con fonti consultabili. La ricerca avanzata e la scelta dei modelli richiedono un piano a pagamento.",
    copilot:
      "Si integra nei flussi di lavoro Microsoft 365. L’integrazione con Office dipende dal piano.",
    meta: "Disponibile nelle app Meta supportate. Le funzioni cambiano secondo l’app e il paese.",
    mistral:
      "L’assistente Mistral unisce chat e funzioni di programmazione. L’app online segue le regole di Mistral.",
    deepseek:
      "Chat DeepSeek online, API separata e pesi scaricabili per alcuni modelli. Controlla le regole della versione che usi.",
    qwen: "Alibaba offre una chat Qwen online e pubblica i pesi dei modelli. Hosting e filtri dipendono dalla versione usata.",
    kimi: "L’assistente Moonshot offre i modelli Kimi e strumenti di programmazione. L’uso del servizio online dipende dal piano.",
    spicychat:
      "Puoi scegliere i personaggi della community anche gratis. I piani a pagamento offrono più capacità e funzioni.",
    chub: "Enorme libreria di schede personaggio e lorebook. I suoi modelli richiedono il piano Mars, la via gratuita è una piccola quota giornaliera o un tuo backend.",
    dreamgen:
      "Dirigi le scene e gioca con più personaggi. I limiti dipendono dal piano e dal modello.",
    novelai:
      "Narrativa lunga con schede di ambientazione e immagini in stile anime. Tutte le funzioni richiedono un abbonamento.",
    chai: "Scopri i bot della community soprattutto da mobile. Le conversazioni seguono le regole dell’app.",
    replika:
      "Un compagno che ritrovi nel tempo, con voce e avatar. Le funzioni dipendono dall’abbonamento.",
    polybuzz:
      "Crea e scopri personaggi su mobile. L’app offre acquisti facoltativi e applica le proprie regole.",
    fictionlab:
      "Narrativa interattiva basata su scenari della community. Il fulcro è il racconto testuale.",
    zeta: "Crea personaggi e gioca gli scenari della community. La disponibilità varia secondo il paese.",
    characterTavern:
      "Scopri e crea schede di personaggi. Il piano gratuito permette di iniziare a conversare.",
    liteLlm:
      "Ospita un proxy compatibile con chiavi virtuali, budget e limiti di frequenza. Gestisci tu il servizio e gli accessi ai fornitori.",
    portkey:
      "Configura riserve, controlli e monitoraggio. Log e modalità di distribuzione dipendono dalla configurazione.",
    vercel:
      "Si integra con l’AI SDK di Vercel senza maggiorazioni sui token. Vercel ospita il servizio di routing.",
    cloudflare:
      "Cache ai margini della rete, limiti di frequenza e routing. Controlla il costo della fatturazione unificata e le impostazioni dei log.",
    requesty:
      "Gateway ospitato con routing per latenza e opzioni nell’UE. Verifica la disponibilità per modello e configurazione.",
    helicone:
      "Gateway IA con tracciamento delle richieste e visibilità sulla spesa. Controlla cosa viene registrato prima di inviare dati sensibili.",
    eden: "Un’API per modelli linguistici, OCR e traduzione. Le funzioni dipendono dal fornitore scelto.",
    together:
      "Inferenza serverless ed endpoint dedicati per modelli aperti. Verifica che il modello desiderato sia disponibile.",
    bifrost:
      "Ospita un gateway in Go con ripiego automatico e cache semantica. Configuri tu l’installazione e gli accessi ai fornitori.",
    truefoundry:
      "Regole di accesso centralizzate e monitoraggio per i team. Verifica le opzioni di distribuzione e le condizioni commerciali.",
    llmGateway:
      "Compatibile con OpenAI e Anthropic, anche in hosting proprio. Fatturazione e conservazione dipendono dall’installazione.",
    deepInfra:
      "Inferenza ospitata per modelli aperti e installazioni GPU private. Scegli dal catalogo o configura l’infrastruttura.",
    bedrock:
      "Catalogo gestito con i controlli di accesso AWS. Modelli e funzioni variano secondo la regione.",
    kong: "Aggiunge routing dei modelli e regole a un gateway API. Controlla quali plugin include la tua edizione.",
    huggingFace:
      "Usa i modelli dell’Hub tramite più fornitori di inferenza. La disponibilità di modelli e hardware varia secondo il fornitore.",
    apiko:
      "Un endpoint compatibile per testo, immagini, video e audio. Verifica prezzo e disponibilità del modello che ti serve.",
    zerouter:
      "Una chiave per client di programmazione come Claude Code e Codex. Verifica prezzi e routing prima di migrare.",
    shannon:
      "Offre il modello Shannon e vari modelli a pesi aperti modificati. L’API si paga a consumo.",
    nokeep:
      "Chat e media senza registrazione. La cronologia resta nel browser, mentre i modelli online elaborano le richieste.",
    icelake:
      "Quota giornaliera per la chat, immagini e video. L’API compatibile con OpenAI richiede un piano a pagamento idoneo.",
    uncensoredChat:
      "Chat nel browser con 2.000 token iniziali. Media e accesso all’API dipendono dal piano.",
    aiDungeon:
      "Avventure interattive con schede della storia. Gli abbonamenti offrono più contesto e ricordi.",
    talkie:
      "Scopri e crea personaggi in un catalogo della community. Controlla le regole dell’app sui contenuti.",
    perchance:
      "Chat gratuita con personaggi nel browser, senza registrazione. Uno strumento essenziale per singole sessioni.",
    candy:
      "Compagni per chat romantiche, con voce e immagini. L’app è pensata per conversare con un partner virtuale.",
    ngrok:
      "Instrada le chiamate tra fornitori con chiavi di riserva. Verifica routing e log durante la configurazione.",
    sandbase:
      "Riunisce modelli, dati web e ambienti isolati per il codice in un’API. Le chiamate gratuite hanno un limite giornaliero.",
    openUncensored:
      "Chiave prepagata, nessun account: 58 modelli di testo abliterated e senza censura, più modelli per immagini e video, ordinati per rifiuti misurati. Paghi il prezzo per token del provider che risponde, ricariche da 5 $.",
    risuAi:
      "Client open source per chat con personaggi, con lorebook, chat di gruppo, immagini delle emozioni e TTS. L’API del modello la porti e la paghi tu.",
    agnai:
      "Client per il gioco di ruolo in hosting o da installare, con chat di gruppo multiutente e lorebook. I prezzi del piano in hosting non sono pubblici.",
    koboldCpp:
      "Runner locale in un solo file per modelli GGUF, con interfaccia di chat integrata e API compatibile OpenAI. Senza una tua GPU aspetti in coda sull’AI Horde dei volontari.",
    talemate:
      "Motore di gioco di ruolo multi-agente con narratore, regista e tracciamento dello stato del mondo. Uno strumento da installare per utenti esperti.",
    featherless:
      "Accesso mensile a tariffa fissa a migliaia di modelli aperti, finetune senza censura compresi, con una sola chiave API. Il piano Chat limita il contesto e le richieste parallele.",
    arliAi:
      "Piani a token illimitati per modelli aperti e senza restrizioni, più immagini. I piani più economici consentono una richiesta alla volta.",
    infermatic:
      "Piani mensili per un piccolo gruppo di modelli di testo senza censura, con la promessa di nessun log. Il piano gratuito ha un solo modello e nessuna API.",
    chutes:
      "Inferenza decentralizzata a token per testo, immagini, video e audio. Nessun piano gratuito.",
    kagi: "Assistente multi-modello incluso nella ricerca Kagi. Per impostazione predefinita i thread si cancellano dopo 24 ore, e i modelli di punta richiedono il piano più alto.",
    huggingChat:
      "Chat con modelli aperti tramite un router automatico. Il codice della chat è open source, e l’inferenza si paga con i crediti Hugging Face.",
    zai: "La chat di Zhipu per i modelli GLM, con un’API separata. La sua informativa sulla privacy indica l’uso del contenuto dei messaggi per addestrare i modelli.",
    ourDream:
      "Creatore di compagni per adulti con chat, immagini e video. I media funzionano a monete che puoi comprare solo con un piano attivo.",
  },
  articles: {
    "nofiltergpt-alternatives": {
      question:
        "Quali alternative a NoFilterGPT indicano il modello o funzionano offline?",
      answer:
        "Unrestricted.chat indica il modello Dolphin-Mistral, che esegue sui propri server. LM Studio, Ollama e Jan eseguono i modelli scaricati sul dispositivo. Su {{appName}} scegli il modello e la cronologia in incognito resta nel browser. I modelli ospitati ricevono comunque la richiesta.",
    },
    "freedomgpt-alternatives": {
      question: "Cosa può sostituire l’app FreedomGPT per l’uso offline?",
      answer:
        "LM Studio e Jan offrono app desktop per modelli scaricati. Ollama fornisce un’API locale e si abbina a Open WebUI per l’interfaccia nel browser. AnythingLLM è adatto ai documenti se configuri modelli ed embedding locali.",
    },
    "gab-ai-alternatives": {
      question: "Cosa può sostituire Arya per le domande di politica?",
      answer:
        "Per confrontare i punti di vista, interroga modelli diversi nella stessa conversazione su {{appName}}. Per una ricerca con fonti, prova Perplexity o usa Grok per trovare i materiali originali. Verifica le fonti. Ogni modello può riflettere un punto di vista o sbagliare un fatto.",
    },
    "openrouter-alternatives": {
      question: "Quale alternativa a OpenRouter è adatta alla produzione?",
      answer:
        "Vercel offre accesso ospitato senza maggiorazioni sui token. LiteLLM e Bifrost sono gateway che gestisci con i tuoi account dei fornitori. Per monitoraggio o controllo delle regole, confronta Portkey, Cloudflare e Helicone. Verifica i meccanismi di riserva, la conservazione dei dati e le commissioni.",
    },
    "venice-ai-alternatives": {
      question:
        "Quali opzioni di privacy vanno oltre la cronologia nel browser?",
      answer:
        "Maple, Confer e Morse descrivono un’elaborazione verificabile in enclave hardware. Lumo cifra la cronologia salvata e Duck.ai usa un proxy. LM Studio e Ollama possono eseguire i modelli scaricati sul dispositivo. Controlla dove la richiesta viene decifrata e se ti servono contenuti multimediali o un’API.",
    },
    "character-ai-alternatives": {
      question:
        "Quali app scegliere per scoprire personaggi, scrivere storie lunghe o avere un compagno nel tempo?",
      answer:
        "Janitor AI, SpicyChat e Chub offrono raccolte di personaggi. DreamGen e NovelAI danno più controllo sulle scene e sui racconti lunghi. Kindroid e Nomi puntano su un compagno nel tempo. Con SillyTavern configuri tu il motore e le schede dei personaggi.",
    },
    "chatgpt-alternative-without-filters": {
      question: "Quali alternative a ChatGPT offrono più scelta di modelli?",
      answer:
        "{{appName}} e Venice ti fanno scegliere modelli con livelli diversi di rifiuto. NanoGPT offre opzioni a consumo. LM Studio e Ollama eseguono i modelli scaricati sul dispositivo. Claude e Gemini sono utili per scrittura e ricerca e applicano le proprie regole.",
    },
    "chatgpt-jailbreak-alternative": {
      question: "Cosa conviene verificare prima di cambiare modello?",
      answer:
        "Verifica se il servizio indica il modello, come funziona la quota gratuita e dove elabora le richieste. Prova le normali richieste di scrittura o gioco di ruolo su {{appName}}, Venice o un’app locale. Risposte e rifiuti dipendono dal modello e dal servizio.",
    },
    "grok-alternative": {
      question:
        "Quali alternative sostituiscono la ricerca e le funzioni creative di Grok?",
      answer:
        "Perplexity risponde con fonti dal web. Gemini offre Deep Research e video nei piani idonei. Venice e {{appName}} combinano scelta dei modelli e generazione di contenuti multimediali. Resta con Grok se cercare post su X nella stessa chat è essenziale per il tuo lavoro.",
    },
    "chub-ai-alternatives": {
      question: "Posso portare altrove le mie schede personaggio di Chub?",
      answer:
        "Sì. Le schede di Chub si scaricano in PNG o JSON nel formato V2, e SillyTavern, RisuAI e Agnaistic le importano direttamente. {{appName}} trasforma un personaggio in una skill con cui chattare su qualsiasi modello. I lorebook passano a SillyTavern e RisuAI.",
    },
    "crushon-ai-alternatives": {
      question: "Quale alternativa a CrushOn ha il costo più prevedibile?",
      answer:
        "Piani fissi: Kindroid, Nomi e SpicyChat chiedono un unico prezzo mensile. A consumo: {{appName}} e NanoGPT fanno pagare a messaggio, quindi un mese tranquillo costa meno. Far girare un modello sul tuo PC con SillyTavern e KoboldCpp non costa nulla oltre all’hardware.",
    },
    "sillytavern-alternatives": {
      question:
        "Esiste un’alternativa a SillyTavern che non richiede installazione?",
      answer:
        "Sì. Janitor AI, Chub e Character Tavern girano nel browser con i personaggi inclusi. Anche RisuAI ha una versione web. {{appName}} funziona in qualsiasi browser, iPhone compreso, con i modelli già collegati, quindi non c’è nessuna chiave API da configurare.",
    },
    "nanogpt-alternatives": {
      question:
        "Quale alternativa a NanoGPT conviene per modelli aperti a tariffa fissa?",
      answer:
        "Featherless, Arli AI e Infermatic vendono piani mensili per modelli aperti e senza censura, con limiti su contesto o richieste parallele. OpenRouter e Chutes fanno pagare a token. {{appName}} fa pagare a messaggio da un solo saldo, su modelli senza censura, aperti e mainstream.",
    },
    "claude-alternatives": {
      question: "Quale alternativa a Claude scrive meglio i testi lunghi?",
      answer:
        "GPT e Gemini sono i più vicini per la scrittura strutturata. Kimi e GLM sono modelli aperti forti con meno rifiuti. Per la narrativa che Claude rifiuta, usa un modello senza censura come GLM 5.3 Uncensored o UncensoredLM su {{appName}}, e tieni Claude nello stesso thread per le revisioni.",
    },
  },
};
