import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternativa a OpenRouter | API OpenAI e Anthropic | {{appName}}",
    description:
      "Confronta {{appName}} con OpenRouter. Usa il tuo SDK OpenAI con una sola API per {{modelCount}} modelli di chat e {{mediaModelCount}} modelli multimediali.",
    category: "Guida agli sviluppatori",
    imageAlt: "{{appName}}: un endpoint API per ogni modello",
    keywords:
      "{{appName}}, OpenRouter alternativa, una API per GPT Claude Gemini, OpenAI compatibile API, OpenAI compatibile API molti modelli, Anthropic API endpoint compatibile, API Anthropic Messages, risposte API, uso Claude Code con altri modelli, Codex CLI fornitore personalizzato, LLM API gateway, modelli non censurati API, OpenAI immagine compatibile API, testo a discorso API# Whisper # API, generazione video API, generazione musicale API",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida agli sviluppatori",
    readTime: "11 min lettura",
    title: "Una chiave API. {{modelCount}} modelli. Tre formati.",
    subtitle:
      "Usa Chat Completions, Responses o Anthropic Messages con una chiave {{appName}}. Mantieni il tuo SDK, aggiorna l’URL di base e la chiave e verifica l’ID del modello. La stessa chiave funziona anche con {{mediaModelCount}} modelli multimediali.",
  },
  intro: {
    lead: "GPT da OpenAI, Claude da Anthropic, Gemini da Google. Tre SDK, tre chiavi, tre bollette, tre cruscotti. O peggio: lo strumento che ti piace parla solo un formato, quindi ottiene solo i modelli di un venditore.",
    p2: "{{appName}} mette i modelli di chat {{modelCount}} da laboratori {{providerCount}} dietro una chiave e un saldo dei crediti. Chiamali nel formato OpenAI, nel formato Responses o nel formato Anthropic. Stessi modelli su ogni punto. Ecco esattamente come funziona, che cosa costa, e dove andare diretto o utilizzare un router è la migliore chiamata.",
    access:
      "Sul fronte: lo API ha bisogno di un conto a pagamento. Qualsiasi piano, da {{subPrice}} al mese, lo sblocca. I crediti gratuiti e bonus non lo fanno.",
    accessLink: "Sblocca lo API",
  },
  endpoints: {
    title: "Ogni endpoint, una chiave",
    intro:
      "Ogni endpoint prende la stessa chiave e fattura lo stesso saldo. I tre formati di chat servono gli stessi modelli.",
    chat: "POST /v1/chat/completions: OpenAI Chat Completions. Streaming su SSE che termina con i dati: [ DONE ], stream_options.include_usage, tool call. Il formato quasi ogni client compatibile OpenAI parla.",
    responses:
      "POST /v1/responses: OpenAI Responses API, il formato Codex CLI parla. Streaming e strumenti. Stateless: il negozio è falso e previous_response_id viene respinto con 400, quindi inviare l'ingresso completo ogni turno.",
    messages:
      "POST /v1/messages: i messaggi Anthropic API. Streaming e utilizzo degli strumenti. Questo è ciò con cui parla Claude Code e gli SDK Anthropic.",
    countTokens:
      "POST /v1/messages/count_tokens: non costa alcun credito. Una stima locale, nessuna chiamata modello, e non conta contro il limite di tariffa per minuto. Claude Code lo chiama costantemente per dimensionare il suo contesto.",
    models:
      "GET /v1/models: ogni modello che la chiave può chiamare in questo momento, con lunghezza del contesto, supporto degli strumenti e prezzi. Un corpo di risposta che sia la parasa OpenAI che la parata Anthropic SDKs.",
    media:
      "Media in formato OpenAI, modelli {{mediaModelCount}}: POST /v1/images/generations e /v1/images/edits, /v1/audio/speech, /v1/audio/transcriptions e /v1/audio/translations. Video (POST /v1/videos) e musica (POST /v1/music) vengono eseguiti come lavori asincroni: start, sondaggio, download. GET /v1/models segna ogni modello con la sua modalità.",
    auth: "Auth lavora in due modi, su ogni punto. Authorization: Bearer sk-unb-... per i client OpenAI e per Claude Code con ANTHROPIC_AUTH_TOKEN. x-api-key: sk-unb-... per gli SDK Anthropic. Le chiavi iniziano con sk-unb-, vengono mostrate una volta e memorizzate solo come hash. Creali sotto le chiavi Impostazioni > API, fino a 20 chiavi attive per account.",
    baseUrlLabel: "Base URL",
    baseUrlNote:
      "Per gli strumenti di stile OpenAI SDKs e OpenAI. Il locale fa parte del percorso. Imposta solo la lingua dei messaggi di errore, e qualsiasi funziona locale supportata, ma deve essere lì.",
    anthropicBaseUrlLabel: "Anthropic base URL",
    anthropicBaseUrlNote:
      "Per gli SDK Anthropic e Claude Code. Stesso URL senza /v1: si appendono /v1/messages stessi.",
  },
  switching: {
    title: "Passare da OpenRouter a {{appName}}",
    intro:
      "Cerchi un’alternativa a OpenRouter? Entrambi i servizi accettano richieste Chat Completions in formato OpenAI. Puoi tenere il tuo SDK OpenAI e aggiornarne la configurazione.",
    key: "Attiva l’accesso all’API nel tuo account {{appName}} e crea una nuova chiave API nelle impostazioni.",
    baseUrl:
      "Imposta nel client OpenAI l’URL di base indicato qui sopra per la tua lingua, incluso /v1.",
    model:
      "Chiama GET /v1/models sulla nuova API e usa uno degli ID restituiti nel campo model.",
    routing:
      "Prima di passare alla nuova API, controlla le opzioni di instradamento specifiche di OpenRouter. Prova le funzioni che usa la tua app, come lo streaming o le chiamate agli strumenti, con il modello scelto.",
    openrouterDocs: "Riferimento API di OpenRouter",
  },
  samples: {
    title: "Codice: il vostro SDK, la nostra base URL",
    intro:
      "Niente nuova libreria clienti. Gli SDK OpenAI e Anthropic ufficiali funzionano come sono. Sostituisci sk-unb-YOUR_KEY con la tua chiave.",
    curl: {
      title: "curl",
      body: "La prova più veloce che la vostra chiave funziona. Un semplice completamento chat, niente da installare.",
      caption: "Completamenti di chat con curl",
    },
    openai: {
      title: "OpenAI Python SDK",
      body: "Impostare base_url e api_key sul client, quindi chiamare chat.completions.creare come al solito. Qualsiasi modello da GET /v1/models va nel campo dei modelli, Claude e Gemini inclusi.",
      caption: "Completamenti di chat con OpenAI SDK",
      responses:
        "Lo stesso client parla anche le risposte API. Chiama il cliente. Responses.create. Ricordate che qui è senza stato: passare l'intera conversazione come input ogni volta.",
      responsesCaption: "Risposte API con OpenAI SDK",
    },
    anthropic: {
      title: "Anthropic Python SDK",
      body: "Impostare base_url senza /v1 e la chiave come api_key, quindi chiamare i messaggi.create. I modelli di ragionamento mettono un blocco di pensiero prima, quindi il campione stampa il blocco di testo, non il primo blocco.",
      caption: "Messaggi API con Anthropic SDK",
      countTokens:
        "Hai bisogno di una dimensione prima di inviare? count_tokens restituisce un preventivo senza chiamare un modello. Nessun credito speso.",
      countTokensCaption: "Conteggio di gettoni con ricciolo",
    },
    models: {
      title: "Elenca i modelli",
      body: "GET /v1/models è la fonte della verità. Mostra esattamente quali ids la chiave può chiamare, con lunghezza del contesto, supporto degli strumenti e prezzo per token.",
      caption: "Elenco modelli con curl",
    },
    media: {
      title: "Immagini, voce, video, musica",
      body: "Stessa chiave, stessa base URL, forme media di OpenAI. Le immagini e i client audio di OpenAI SDK funzionano in modo immutato. Scegli un modello con la modalità corrispondente da GET /v1/models.",
      imageCaption: "Generare un'immagine con curl",
      async:
        "Il video e la musica impiegano pochi minuti, quindi funzionano come lavoro. POST risponde subito con un id. Poll esso gratuitamente, quindi scaricare il file. Un lavoro fallito non costa niente.",
      videoCaption: "Avviare un lavoro video",
      pollCaption: "Poll it, quindi scaricare il MP4",
    },
  },
  ids: {
    title: "ID dei modelli: nostri o del fornitore",
    intro:
      "Non è necessario riscrivere configurazioni che già nominano un modello. Accettiamo le ordinazioni comuni.",
    ours: "I nostri ids, come GET /v1/models li elenca: claude-sonnet-5.5, gpt-6.1-sol, glm-5.3. Usa questi quando si inizia fresco.",
    vendor:
      "Anche le ortografia del venditore funzionano. Data-stamped Anthropic ids (claude-sonnet-4-5-20250929 si risolve a claude-sonnet-4.5), numeri di versione schiacciati, -la più recente suffissi, il [1m] contesto suffisso, e gli id punteggiati come gpt-5.5.",
    prefix:
      "Per i modelli supportati, l’API riconosce prefissi comuni come anthropic/ e openai/.",
    claudeFallback:
      "Su /v1/messages only: a Claude id your account non può chiamare, come il built-in ids Claude Code invia per le sue chiamate di sfondo, rientra al nuovo Claude della stessa famiglia (Opus, Sonnet o Haiku) che è possibile chiamare. Claude Code funziona senza ulteriori vars. Qualsiasi altro id sconosciuto restituisce 404 model_not_found.",
  },
  tools: {
    title: "Utilizzare Claude Code e Codex CLI con altri modelli",
    intro:
      "Entrambi si connettono direttamente. Nessun proxy, nessun livello di traduzione, niente da installare.",
    p1: "Ogni snippet predefinito a {{model}}. Ha superato Claude Code reale e Codex CLI corre, chiama gli strumenti in modo affidabile e costa poco per token di uscita. Smascherarlo per ogni id una volta che le cose funzionano.",
    claudeCode:
      "Questa è l'intera risposta all'utilizzo del Claude Code con altri modelli. ANTHROPIC_BASE_URL ci indica, ANTHROPIC_AUTH_TOKEN porta la chiave, e le variabili del modello decidono cosa funziona. Sostituire il modello id con qualsiasi id da GET /v1/models: GPT, Gemini, Kimi, DeepSeek o un modello non censurato. CLAUDE_CODE_MAX_CONTEXT_TOKENS è impostato sulla finestra di contesto reale di quel modello, quindi Claude Code compatta al punto giusto.",
    codex:
      "Codex CLI ottiene un fornitore di modelli personalizzato con set wire_api per le risposte. Parla le risposte API a noi esattamente come fa a OpenAI. Modificare il modello con -m.",
    others:
      "OpenCode, Continue, Aider e Cline lavorano anche, tutti testati. Le loro configurazioni, i file di configurazione permanenti e le gotcha che abbiamo colpito sono nella guida degli strumenti di codifica.",
    guideLink: "Impostare ogni strumento di codifica",
  },
  picks: {
    title: "Quale modello per quale lavoro",
    intro:
      "Ogni modello sottostante supporta la chiamata degli strumenti. Fare clic su un nome per il suo prezzo e specifiche, copiare l'id nel codice.",
    frontier: {
      title: "Frontier: il codice e il ragionamento più difficili",
      body: "Grandi refattori, codebases non familiari, lunghe catene di ragionamento. Prezzo più alto per token, meno giri sbagliati.",
    },
    cheap: {
      title: "A buon mercato e veloce: loop, rinfuse, chiamate di fondo",
      body: "Anelli dell'agente che inviano grandi richieste, lavori in batch, classificazione, lo sfondo chiama strumenti di codifica fuoco tutto il giorno. Una frazione dei prezzi di frontiera.",
    },
    uncensored: {
      title: "Senza censura: nessun riflesso di rifiuto",
      body: "GLM 5.3 Uncensored e Qwen 3.6 Plus Uncensored sono modelli mainstream con i rifiuti rimossi. UncensoredLM v1.2 è diverso: addestrato su libri e documenti vietati da internet mainstream, non solo un modello a righe. Stessa API, stessi strumenti.",
    },
    compare:
      "Torn tra due? Le pagine di confronto mettono due modelli fianco a fianco.",
    compareLink: "{{a}} vs {{b}}",
    allModels: "Tutti i modelli {{modelCount}}",
  },
  billing: {
    title: "Che cosa costa",
    intro: "Crediti, fatturati per token. Nessun costo del posto.",
    price:
      "La maggior parte dei modelli fattura al loro prezzo indicato per-token più il nostro markup. Fattura di gettoni di ingresso incassato al prezzo della cache del modello. I modelli serviti attraverso la fattura OpenRouter il costo reale OpenRouter addebitato per la chiamata, più lo stesso markup.",
    reported:
      "Ogni risposta riporta l'utilizzo. credits_charged. Non devi mai indovinare il costo di una chiamata.",
    preflight:
      "Prima di eseguire una chiamata, il tuo saldo viene controllato contro una stima peggiore. Non abbastanza significa HTTP 402 insufficient_credits: niente funziona, nulla è addebitato.",
    abort:
      "Streaming: chiudere la connessione e la generazione si ferma. Paghi solo per quello che e' scappato. Lo stesso se il fornitore non riesce a metà flusso.",
    chat: "Chat e API fatturano allo stesso modo. OpenRouter diffonde un modello in diversi host, e alcuni carica più di quello più economico che elenchiamo. Così per quei modelli il prezzo elencato è una stima, e l'uso. credits_charged è il numero reale. Se OpenRouter non riporta alcun costo per una chiamata, fattura al prezzo indicato.",
    media:
      "Media fattura allo stesso modo: il costo reale del fornitore più il nostro markup dove il fornitore lo riferisce, il prezzo per modello indicato altrimenti. Immagini per immagine, voce per carattere, trascrizione al secondo di audio, video e musica una volta che il file è pronto.",
    paid: "Stesso saldo di credito dell'app chat. Lo API ha bisogno di un conto a pagamento: qualsiasi piano. I crediti gratuiti non lo sbloccano.",
    sub: "Piani mensili: quattro dimensioni, a partire dai crediti {{subCredits}} per {{subPrice}}.",
    pack: "Pacchetti per ricaricare i crediti dell’abbonamento. {{packCredits}} crediti per {{packPrice}}. Non scadono mai. Paga con carta, PayPal o criptovalute.",
    link: "Vedi piani e prezzi",
  },
  versus: {
    title: "Vai in diretta, usa un router o utilizzaci?",
    intro: "Tre opzioni sincere. Ognuno è quello giusto per qualcuno.",
    direct: {
      title: "Andare direttamente a OpenAI, Anthropic o Google",
      body: "La prima parte del nuovo atterra lì prima. Nessun contrassegno da intermediario. I termini di un venditore da leggere. Se si utilizzano solo i modelli di un fornitore, andare direttamente.",
    },
    router: {
      title: "Un aggregatore come OpenRouter",
      body: "OpenRouter offre un’API per più modelli con selezione del fornitore e fallback. Gestisce anche alcune delle nostre richieste ai modelli.",
    },
    here: {
      title: "{{appName}}",
      body: "Una chiave in tre formati di filo: completamento chat, risposte e messaggi Anthropic con count_tokens. Claude Code e Codex CLI si connettono senza un proxy. Modelli non censurati siedono accanto a quelli tradizionali, dietro una sola volta 18+ conferma. Lo stesso saldo paga per la chat app e API, da crediti di abbonamento o pacchetti. E {{appName}} è open source e auto-hostable.",
    },
    verdict:
      "Confronta i cataloghi e le funzioni di instradamento che ti servono. Se vuoi usare modelli senza censura via API e condividere il saldo con la chat, verifica quali modelli puoi chiamare con la tua chiave {{appName}}.",
  },
  limits: {
    title: "Limiti che dovresti sapere",
    intro: "Nessuna sorpresa nella produzione. Questi sono i bordi duri.",
    stateless:
      "Indifferenza. Le risposte API funziona con il set di negozio a false e rifiuta previous_response_id. Invia la storia completa ogni volta. Questo vale per ogni punto di vista.",
    maxTokens: "L'uscita è bloccata su token {{maxTokens}} per richiesta.",
    rateLimit:
      "Le richieste {{rateLimit}} al minuto per chiave di default. Oltre il limite si ottiene 429 con un intestazione Retry-After. Gli agenti che licenziano molte chiamate hanno la loro chiave.",
    countTokens:
      "count_tokens è una stima, non il tokenizer esatto del fornitore. Buon per il contesto di dimensionamento, non per la matematica di fatturazione.",
    tools:
      "Le chiamate degli strumenti funzionano solo su modelli che li supportano. Altrimenti si ottiene 400 tools_not_supported. GET /v1/models mostra supports_tools per ogni modello.",
    consent:
      "I modelli non censurati hanno bisogno di una conferma di una volta 18+ nella pagina delle chiavi API. Senza di esso si ottiene 403 uncensored_consent_required, e nulla è addebitato.",
    localeUrl:
      "I due classici errori di configurazione, entrambi un 404. Uno: lasciare il locale dal percorso. La base URL è /api/ <locale> /v1, non /api/v1. Due: mantenere /v1 sulla base Anthropic URL. Claude Code e Anthropic SDKs append /v1/messages stessi, quindi /v1 due volte significa che nulla è trovato.",
  },
  privacy: {
    title: "Cosa succede ai tuoi suggerimenti",
    intro: "Versione corta: teniamo il conto, non la conversazione.",
    noStore:
      "Lo API non salva nessuna conversazione e non crea discussioni. Quello che rimane dalla nostra parte è il record di fatturazione: quale modello, quanti crediti.",
    upstream:
      "Il tuo prompt va al fornitore che serve il modello. I suoi termini si applicano a ciò che riceve.",
    incognito:
      "Nell'app di chat, incognito chat live solo nella memorizzazione locale del browser, non sui nostri server.",
    selfHost:
      "{{appName}} è open source (MIT e GPL v3). Eseguire la propria istanza con le proprie chiavi del fornitore e pagare direttamente i fornitori.",
    selfHostLink: "Te lo garantisco.",
  },
  faq: {
    title: "FAQ",
    openrouter: {
      q: "{{appName}} è un'alternativa OpenRouter?",
      a: "{{appName}} offre Chat Completions, Responses e Anthropic Messages con una sola chiave. Puoi usare i modelli senza censura dopo aver confermato di avere almeno 18 anni. Chat e API condividono lo stesso saldo. Alcune richieste passano attraverso OpenRouter.",
    },
    openrouterModels: {
      q: "Posso mantenere gli ID dei modelli OpenRouter quando cambio API?",
      a: "Alcuni ID con prefisso del fornitore funzionano se il modello corrispondente è disponibile. Controlla la disponibilità con GET /v1/models e copia l’ID esatto restituito dalla nuova API.",
    },
    claudeCode: {
      q: "Posso usare Claude Code con i modelli non Claude?",
      a: "Si'. Impostare ANTHROPIC_BASE_URL alla base {{appName}} Anthropic URL, mettere la chiave in ANTHROPIC_AUTH_TOKEN e scegliere qualsiasi modello id da GET /v1/models. GPT, Gemini, GLM, Kimi, DeepSeek e i modelli non censurati sono tutti in Claude Code.",
    },
    sdk: {
      q: "Mi serve un nuovo SDK?",
      a: "Usa l’SDK ufficiale di OpenAI o Anthropic. Imposta l’URL di base previsto dal tuo SDK, aggiungi la chiave API e scegli l’ID di un modello disponibile.",
    },
    free: {
      q: "C'è un pareggio gratuito per la API?",
      a: "No. I crediti gratuiti valgono nell’app di chat. Per l’API serve un piano, a partire da {{subCredits}} crediti al mese per {{subPrice}}. Gli abbonati possono ricaricare con pacchetti da {{packCredits}} crediti per {{packPrice}} che non scadono mai.",
    },
    pricing: {
      q: "Il prezzo di listino è quello che pago?",
      a: "Per la maggior parte dei modelli, sì: il prezzo indicato per-token più il nostro markup. I modelli serviti tramite OpenRouter fatturano il costo reale OpenRouter addebitato per la chiamata, più lo stesso markup, nell'app di chat e nello API allo stesso modo. Il loro prezzo è una stima. Ogni risposta riporta l'esatta carica di utilizzo. credits_charged.",
    },
    models: {
      q: "Quali modelli posso chiamare?",
      a: "Modelli di chat {{modelCount}} in questo momento: Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Qwen e modelli non censurati. Inoltre {{mediaModelCount}} modelli di immagine, video, musica, voce e trascrizione. GET /v1/models elenca esattamente ciò che la vostra chiave può chiamare, con prezzi.",
    },
    data: {
      q: "{{appName}} memorizza le mie richieste?",
      a: "Non dalla API. Nessuna conversazione viene memorizzata, solo il record di fatturazione: modello e crediti caricati. Il fornitore che serve il modello vede il prompt, sotto i suoi termini.",
    },
    docsLink: "Leggi il riferimento completo API",
    pricingLink: "Vedi piani e prezzi",
  },
  partners: {
    body: "Strumenti di costruzione o contenuti per gli sviluppatori? Il programma partner {{appName}} ti paga una quota ricorrente di ogni pagamento che fai riferimento.",
    link: "Partecipa al programma partner",
  },
  cta: {
    title: "Una chiave. Ogni modello. Inizia subito.",
    subtitle:
      "Creare una chiave, cambiare una base URL, mantenere il SDK. I documenti API coprono ogni punto finale, campo e codice di errore.",
    key: "Creare una chiave API",
    docs: "Leggi i documenti API",
  },
};
