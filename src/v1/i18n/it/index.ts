import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "IA",

  tags: {
    api: "OpenAI - compatibile API",
  },

  promptCache: {
    label: "Cache del prompt",
    description:
      "Salva nella cache la parte iniziale condivisa del prompt e scegli per quanto tempo conservarla.",
  },
  openai: {
    missingKey:
      "Manca la chiave API. Invialo come 'Autorizzazione: Cuscinetto <key>' o 'x-api-chiave: <key> '. Creare una chiave in Impostazioni > API chiavi.",
    invalidKey:
      "Non valido o revocato chiave API. Controllare la chiave o creare una nuova sotto le chiavi Impostazioni > API.",
    authUnavailable:
      "Non è possibile verificare la chiave API in questo momento. La sua chiave non e' stata respinta. Recuperare in {{seconds}} s.",
    modelNotFound:
      "Il modello ' {{model}} ' non esiste o non è disponibile per voi. Elenca i tuoi modelli con GET /v1/models.",
    paidRequired:
      "Lo API ha bisogno di un conto a pagamento: qualsiasi piano, da {{subPrice}} al mese. Aggiungine uno a {{url}}.",
    toolsUnsupportedByModel:
      "Questo modello non supporta la chiamata degli strumenti. Scegli un modello con supporto per utensili o rimuovi 'tools'.",
    badToolArguments:
      "Gli argomenti della chiamata utensile ' {{name}} ' non sono validi JSON.",
    toolChoiceUnknown: "tool_choice nomina {{name}} ', che non è in 'tools'.",
    toolMessageNeedsId:
      "Il messaggio di strumento {{param}} ha bisogno di uno tool_call_id.",
    nUnsupported: "Solo n=1 è supportato.",
    badImageUrl: "image_url deve essere un http(s) URL o una base64 dati: URL.",
    insufficientCredits:
      "Crediti insufficienti. Questa chiamata ha bisogno di {{cost}}, hai {{balance}}. Continuate a camminare.",
    rateLimited:
      "Troppe richieste ravvicinate per questa chiave. Riprova tra {{seconds}} s.",
    tooManyStreams:
      "Troppi stream simultanei aperti per questa chiave (limite {{limit}}). Chiudi uno stream attivo o riprova tra {{seconds}} s.",
    upstreamRateLimited:
      "Il fornitore del modello sta limitando temporaneamente le richieste: {{error}}",
    upstreamFailed: "Il fornitore del modello ha fallito: {{error}}",
    balanceCheckFailed:
      "Non è possibile verificare il saldo di credito. Non c'era niente da scappare. Riprova.",
  },

  models: {
    get: {
      title: "OpenAI - modelli compatibili",
      titleShort: "v1 modelli",
      description:
        "Elenca i modelli che la chiave API può chiamare. Formato dell'elenco OpenAI. Autenticare con l'autorizzazione: Cuscinetto <key>.",
      response: { object: "Tipo di oggetto" },
      success: {
        title: "Modelli elencati",
        description: "I modelli disponibili per questa chiave API",
      },
    },
  },

  completions: {
    post: {
      title: "OpenAI - Compatibili completamenti chat",
      titleShort: "v1 completamento chat",
      description:
        "Chiama qualsiasi modello con il formato di completamento della chat OpenAI. Fatturato contro i vostri crediti a prezzi di chat. Supporta il flusso: vero.",
      fields: {
        model: {
          label: "Modello",
          description: "Modello ID da GET /v1/modelli",
        },
        messages: {
          label: "Messaggi",
          description: "array di messaggi OpenAI (sistema, utente, assistente)",
        },
        stream: {
          label: "Streaming",
          description: "Invia la risposta come eventi server-sent",
        },
        streamOptions: {
          label: "Opzioni di streaming",
          description:
            "{ include_usage : true } aggiunge un pezzo di uso finale",
        },
        maxTokens: {
          label: "Max gettoni",
          description: "Legato superiore su token generati",
        },
        maxCompletionTokens: {
          label: "Token di completamento massimo",
          description: "Stesso come max_tokens; ha la precedenza",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura di campionamento da 0 a 2",
        },
        topP: {
          label: "Top P",
          description: "Campionamento di Nucleo, da 0 a 1",
        },
        stop: {
          label: "Fermati.",
          description: "Smettere la sequenza o l'elenco di loro",
        },
        n: {
          label: "Scelte",
          description: "Solo 1 è supportato",
        },
        tools: {
          label: "Strumenti",
          description:
            "Strumenti di funzione OpenAI il modello può chiamare: [{type:'function', funzione:{name, descrizione, parametri}}]",
        },
        toolChoice: {
          label: "Scelta degli strumenti",
          description:
            "nessuna, auto, richiesta, o {tipo: 'funzione', funzione: {name} }",
        },
        parallelToolCalls: {
          label: "Chiamate parallele",
          description: "Accettato per la compatibilità; il modello decide",
        },
      },
      response: { object: "Tipo di oggetto" },
      success: {
        title: "Complemento creato",
        description: "Il modello ha risposto",
      },
    },
  },

  responses: {
    previousResponseUnsupported:
      "previous_response_id non è supportato: le risposte non vengono memorizzate. Inviare la conversazione completa in 'input' con il negozio: falso (Codex CLI lo fa per impostazione predefinita).",
    badInputItem:
      "{{param}} non è utilizzabile: le immagini devono essere http(s) o dati base64: gli URL e gli elementi degli strumenti hanno bisogno di uno call_id.",
    post: {
      title: "OpenAI Risposte API",
      titleShort: "v1 risposte",
      description:
        "Chiama qualsiasi modello con il formato OpenAI Responses, l'unico Codex CLI parla. Stateless: inviare la conversazione completa in ingresso. Supporta lo streaming, la funzione, gli strumenti personalizzati e local_shell e gli elementi di ragionamento.",
      fields: {
        model: {
          label: "Modello",
          description: "Modello ID da GET /v1/modelli",
        },
        input: {
          label: "Input",
          description:
            "Una stringa, o la conversazione come Articoli di risposte (messaggio, function_call, function_call_output, ragionamento,...)",
        },
        instructions: {
          label: "Istruzioni",
          description: "Istruzioni di sistema per il modello",
        },
        stream: {
          label: "Streaming",
          description: "Invia la risposta come Risposte eventi server-sent",
        },
        tools: {
          label: "Strumenti",
          description:
            "funzioni, strumenti personalizzati e local_shell. Gli strumenti ospitati (web_search,...) sono saltati.",
        },
        toolChoice: {
          label: "Scelta degli strumenti",
          description: "nessuno, auto, richiesto o {tipo: 'funzione', nome}",
        },
        parallelToolCalls: {
          label: "Chiamate parallele",
          description: "Accettato per la compatibilità; il modello decide",
        },
        maxOutputTokens: {
          label: "Token di uscita max",
          description: "Legato superiore su token generati",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura di campionamento da 0 a 2",
        },
        topP: {
          label: "Top P",
          description: "Campionamento di Nucleo, da 0 a 1",
        },
        reasoning: {
          label: "Ragione",
          description:
            "Accettato per la compatibilità. Modelli motivanti restituiscono gli elementi ragionamento in entrambi i modi.",
        },
        text: {
          label: "Formato del testo",
          description:
            "{format:{type:' json_schema ', schema}} chiede l'output JSON",
        },
        store: {
          label: "Negozio",
          description: "Le risposte non sono mai memorizzate; inviare falsi",
        },
        previousResponseId: {
          label: "Risposta precedente ID",
          description:
            "Non supportato: inviare la conversazione completa invece",
        },
        include: {
          label: "Includere",
          description:
            "Accettato per la compatibilità. Gli articoli motivanti portano sempre encrypted_content per la riproduzione.",
        },
      },
      response: { object: "Tipo di oggetto" },
      success: {
        title: "Risposta creata",
        description: "Il modello ha risposto",
      },
    },
  },

  messages: {
    badContentBlock:
      "{{param}} ha un blocco di contenuti che non possiamo usare: le immagini devono essere URL base64 o http(s).",
    post: {
      title: "Messaggi Anthropic API",
      titleShort: "v1 messaggi",
      description:
        "Chiama qualsiasi modello con il formato messaggi Anthropic, parla il codice Claude. Chiave come x-api-chiave o autorizzazione: Cuscinetto. Supporta lo streaming, gli strumenti e i blocchi di pensiero.",
      fields: {
        model: {
          label: "Modello",
          description:
            "Modello ID da GET /v1/modelli. Claude ids like claude-sonnet-4-5-20250929 mappa al nostro modello Claude corrispondente.",
        },
        messages: {
          label: "Messaggi",
          description:
            "Messaggi Anthropic: utente e assistente si gira con testo, immagine, tool_use, tool_result e blocchi di pensiero",
        },
        system: {
          label: "Sistema",
          description: "prompt del sistema: una stringa o blocchi di testo",
        },
        maxTokens: {
          label: "Max gettoni",
          description: "Legato superiore su token generati",
        },
        stream: {
          label: "Streaming",
          description: "Invia la risposta come eventi server-sent Anthropic",
        },
        tools: {
          label: "Strumenti",
          description:
            "Strumenti client: [{name, descrizione, input_schema }]. Gli strumenti del server (web_search,...) sono saltati.",
        },
        toolChoice: {
          label: "Scelta degli strumenti",
          description: "{type: auto | any | none | tool, name}",
        },
        stopSequences: {
          label: "Smettere sequenze",
          description: "Strings che terminano la risposta",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura di campionamento",
        },
        topP: {
          label: "Top P",
          description: "Campionamento di Nucleo, da 0 a 1",
        },
        thinking: {
          label: "Elaborazione",
          description:
            "Accettato per la compatibilità. Modelli ragionanti restituiscono i blocchi di pensiero in entrambi i casi.",
        },
      },
      response: { type: "Tipo di oggetto" },
      success: {
        title: "Messaggio creato",
        description: "Il modello ha risposto",
      },
    },
  },

  countTokens: {
    post: {
      title: "Conteggio di token Anthropic",
      titleShort: "token di conteggio v1",
      description:
        "Stima i token di ingresso di una richiesta di messaggi Anthropic. Niente chiamate, niente crediti.",
      fields: {
        action: { label: "Azione", description: "Sempre count_tokens" },
        model: { label: "Modello", description: "Modello ID" },
        messages: { label: "Messaggi", description: "Messaggi Anthropic" },
        system: { label: "Sistema", description: "Avviamento del sistema" },
        tools: {
          label: "Strumenti",
          description: "Definizioni degli strumenti",
        },
      },
      response: { inputTokens: "Token di ingresso" },
      success: {
        title: "Token contati",
        description: "Token di ingresso stimati",
      },
    },
  },

  media: {
    images: {
      generations: {
        title: "OpenAI - generazione di immagini compatibile",
        titleShort: "v1 immagini",
        description:
          "Generare immagini con qualsiasi modello di immagine da GET /v1/models. OpenAI formato immagini: url (firmato, valido 7 giorni) o b64_json. Fatturato per immagine.",
        success: {
          title: "Immagini generate",
          description: "Le immagini sono memorizzate e collegate",
        },
      },
      edits: {
        title: "OpenAI - modifica dell'immagine compatibile",
        titleShort: "v1 modifiche dell'immagine",
        description:
          "Modificare un'immagine con un prompt, su un modello che prende l'ingresso dell'immagine. Caricalo come \"immagine\" multipart o invia ' image_url '. Fatturato per immagine.",
        success: {
          title: "Immagine modificata",
          description: "L'immagine modificata viene memorizzata e collegata",
        },
      },
    },
    speech: {
      title: "OpenAI - testo compatibile al discorso",
      titleShort: "v1 discorso",
      description:
        "Trasforma il testo in un discorso. Risposte con gli byte audio (mp3 per impostazione predefinita). Billed per personaggio.",
      success: { title: "Discorso generato", description: "Il file audio" },
    },
    transcriptions: {
      title: "OpenAI - trascrizione compatibile",
      titleShort: "v1 trascrizioni",
      description:
        "Trascrivere un file audio (multipart 'file', fino a 25 MB). JSON, testo, SRT, WebVTT o verbose JSON con segmenti. Fatturato al secondo dell'audio.",
      success: { title: "Trascrizione audio", description: "La trascrizione" },
    },
    translations: {
      title: "OpenAI - traduzione audio compatibile",
      titleShort: "v1 traduzioni",
      description:
        "Trascrivi un file audio direttamente in testo inglese con Whisper. Stessi formati e fatturazione come trascrizioni.",
      success: {
        title: "Audio tradotto",
        description: "La trascrizione inglese",
      },
    },
    videos: {
      create: {
        title: "Generazione video (asincrona)",
        titleShort: "video v1",
        description:
          "Avviare un video nella forma del video OpenAI API. Risposte subito con il lavoro; sonda GET /v1/videos/ {id}, scarica GET /v1/videos/ {id} /content. E' stato citato quando il video e' pronto.",
        success: {
          title: "Lavoro video in coda",
          description: "Poll it by id",
        },
      },
      get: {
        title: "Stato del lavoro video",
        titleShort: "v1 stato video",
        description:
          "Stato, avanzamento e URL del risultato di un job video. Il polling è gratuito e non conta nei limiti anti-abuso.",
        success: {
          title: "Lavoro video",
          description: "Stato attuale del lavoro",
        },
      },
      content: {
        title: "Scarica il video",
        titleShort: "v1 contenuto video",
        description: "Il file video finito di un lavoro completato.",
        success: { title: "File video", description: "I byte MP4" },
      },
    },
    music: {
      create: {
        title: "Generazione musicale (asincrona)",
        titleShort: "v1 musica",
        description:
          "Inizia un lavoro musicale. Risposte subito con il lavoro; sonda GET /v1/music/ {id}, scarica GET /v1/music/ {id} /content. Fatturato per clip quando è pronto.",
        success: {
          title: "Lavoro musicale in coda",
          description: "Poll it by id",
        },
      },
      get: {
        title: "Situazione del lavoro musicale",
        titleShort: "v1 stato della musica",
        description:
          "Stato e URL del risultato di un job musicale. Il polling è gratuito e non conta nei limiti anti-abuso.",
        success: {
          title: "Lavoro di musica",
          description: "Stato attuale del lavoro",
        },
      },
      content: {
        title: "Scarica la musica",
        titleShort: "v1 contenuto musicale",
        description: "Il file audio finito di un lavoro musicale completato.",
        success: { title: "File di musica", description: "L'audio bytes" },
      },
    },
    file: {
      title: "Scarica il file multimediale",
      titleShort: "file multimediale v1",
      description:
        "Scarica un file prodotto da una chiamata media. La sigla URL funziona senza chiave per 7 giorni; la chiave API funziona in qualsiasi momento.",
      success: { title: "File", description: "Il file bytes" },
    },
    fields: {
      model: {
        label: "Modello",
        imageDescription:
          "Modello di immagine ID da GET /v1/modelli (modalità: immagine)",
        speechDescription:
          "Una voce ID da GET /v1/models (modalità: discorso), ad esempio openai-nova. O tts-1 più una voce.",
        transcriptionDescription:
          "Trascrizione modello ID da GET /v1/models (modalità: trascrizione).",
        translationDescription:
          "Un modello Whisper servito da OpenAI: bisbiglia-1 o openai-whisper",
        videoDescription: "Video model ID da GET /v1/modelli (modalità: video)",
        musicDescription:
          "Modello musicale ID da GET /v1/modelli (modalità: musica)",
      },
      prompt: {
        label: "Prompt",
        imageDescription: "Cosa disegnare, fino a 2000 caratteri",
        editDescription: "Cosa cambiare nell'immagine",
        transcriptionDescription:
          "Accettato per la compatibilità; non passato ad ogni fornitore",
        videoDescription: "Cosa succede nella clip, fino a 2000 caratteri",
        musicDescription: "Stile, umore, strumenti, tempo",
      },
      n: {
        label: "Immagini",
        description: "Quante immagini, da 1 a 4. Ognuno è fatturato.",
      },
      size: {
        label: "Dimensione",
        imageDescription:
          "WIDTHxHEIGHT come 1024x1024 o 1536x1024, o auto. Scegli la dimensione più vicina e rapporto il modello supporta.",
        videoDescription:
          "WIDTHxHEIGHT come 1280x720. Imposta il rapporto di aspetto e, dove il modello lo offre, la risoluzione.",
      },
      aspectRatio: {
        label: "Rapporto di ispezione",
        imageDescription:
          "1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3 o 21:9. Vince di piu'.",
        videoDescription:
          "16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9 o 9:21. Vince di piu'.",
      },
      quality: {
        label: "Qualità",
        description:
          "standard, hd, basso, medio, alto o auto. hd e alto chiedere il livello dettagliato dove il modello ha uno.",
      },
      style: {
        label: "Stile",
        description:
          "Accettato per la compatibilità. Metti lo stile nel prompt.",
      },
      responseFormat: {
        label: "Formato di risposta",
        imageDescription:
          "url (default, un link firmato valido 7 giorni) o b64_json",
        speechDescription:
          "mp3 (default), opus, aac, flac, wav o pcm. Quali possono dare una voce dipende dal suo fornitore.",
        transcriptionDescription:
          "json (default), testo, srt, verbose_json o vt",
      },
      user: {
        label: "Utente",
        description: "Il tuo utente finale ID. Accettato per la compatibilità.",
      },
      image: {
        label: "Immagine",
        description:
          "L'immagine da modificare, come caricamento di file multipart",
      },
      imageUrl: {
        label: "Immagine URL",
        description:
          "L'immagine da modificare come un http(s) URL o dati base64: URL, per richieste JSON",
        videoDescription:
          "Prima cornice come http(s) URL o base64 dati: URL (image-to-video)",
      },
      mask: {
        label: "Maschera",
        description: "Non supportato. Descrivi la modifica nel prompt.",
      },
      input: {
        label: "Input",
        description: "Il testo per parlare, fino a 4096 caratteri",
      },
      voice: {
        label: "Voce",
        description:
          "Con un nome del modello OpenAI (tts-1): lega, nova, onice, eco, shimmer o fable. O qualsiasi voce ID da GET /v1/models.",
      },
      speed: {
        label: "Velocità",
        description:
          "0.25 a 4.0. Applicato da voci OpenAI, NanoGPT e ElevenLabs.",
      },
      instructions: {
        label: "Istruzioni",
        description:
          "Accettato per la compatibilità; le voci leggono l'ingresso come scritto",
      },
      file: {
        label: "File",
        description:
          "Il file audio: mp3, mp4, m4a, wav, webm, ogg o flac, fino a 25 MB",
      },
      language: {
        label: "Lingua",
        description:
          "ISO-639 -1 codice della lingua parlata, ad esempio en o de. Predefinito: il locale nella URL.",
      },
      temperature: {
        label: "Temperatura",
        description: "Accettato per la compatibilità",
      },
      seconds: {
        label: "Secondo",
        videoDescription:
          "Lunghezza della clip. Spinto alle lunghezze che il modello offre.",
        musicDescription:
          "Lunghezza desiderata: circa 8, 20 o 30 secondi. Il modello può arrotondarlo.",
      },
      resolution: {
        label: "Risoluzione",
        description:
          "ad esempio 720p o 1080p, dove il modello offre una scelta",
      },
      negativePrompt: {
        label: "Pronta negativa",
        description:
          "Cosa tenere fuori dalla clip, dove il modello lo supporta",
      },
      inputReference: {
        label: "Riferimento dell'input",
        description:
          "Primo frame come caricamento di immagini multipart (immagine-video)",
      },
      jobId: { label: "Lavoro ID", description: "L'id POST è tornato" },
      threadId: {
        label: "Cartella",
        description: "Cartella di archiviazione del file",
      },
      filename: {
        label: "Nome del file",
        description: "Nome file memorizzato",
      },
      expires: {
        label: "Scadenze",
        description: "Unix quando il link firmato smette di funzionare",
      },
      sig: { label: "Firma", description: "Firma del link" },
    },
    response: {
      created: "Creato",
      object: "Tipo di oggetto",
      text: "Testo",
      id: "Lavoro ID",
      status: "Stato",
    },
    errors: {
      badSize:
        "dimensione ' {{size}} ' non è WIDTHxHEIGHT (come 1024x1024) o auto.",
      maskUnsupported:
        "Le maschere non sono supportate. Descrivi invece il cambiamento nel prompt.",
      oneImageOnly: "Un'immagine per modifica. Mandate un'immagine unica.",
      imageTooLarge: "L'immagine è più grande di {{max}} MB.",
      imageRequired:
        "Inviare l'immagine per modificare: campo multipart 'image', o ' image_url ' in JSON.",
      modelCannotEdit:
        "{{model}} non prende un'immagine di input. Scegli un modello di immagine-immagine da GET /v1/models (input_modalities contiene immagine).",
      storageFailed:
        "Il file è stato generato ma non poteva essere memorizzato. Riprova.",
      voiceNotFound:
        "Nessuna voce ' {{voice}}' disponibile per voi. Elenca le voci con GET /v1/models (modalità: discorso), o usa il modello tts-1 con voce nova.",
      formatUnsupported:
        "{{voice}} consegna {{supported}}. Chiedi uno di quelli come response_format.",
      audioTooLarge: "Il file audio è più grande di 25 MB.",
      fileRequired: "Caricare l'audio come campo multipart 'file'.",
      translationUnsupported:
        "{{model}} non può tradurre. Traduzione in inglese corre su bisbiglia-1.",
      jobNotFound: "Nessun lavoro {{kind}} ' {{id}}' su questo conto.",
      jobNotReady:
        "Il lavoro {{kind}} ' {{id}}' è {{status}}. Scaricalo una volta completato il suo stato.",
      jobInterrupted:
        "Il lavoro si è fermato quando il suo server ha ricominciato. Non e' stato accusato niente. Fallo di nuovo.",
      jobNotCreated:
        "Il lavoro non poteva essere salvato. Non e' stato accusato niente. Riprova.",
      mediaNotFound:
        "File non trovato, o il link è scaduto. Ottieni un nuovo link dal lavoro, o invia la chiave API.",
      modelNoImageInput:
        "{{model}} non prende un'immagine del primo fotogramma. Scegli un modello di immagine-video da GET /v1/models, o rilascia l'immagine.",
      modelNeedsImage:
        "{{model}} anima un'immagine. Invia input_reference o image_url.",
      resolutionUnsupported:
        "{{model}} rende {{supported}}. Chiedi uno di quelli come risoluzione.",
    },
  },

  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Richiesta non valida",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "È necessaria una chiave API valida",
    },
    server: {
      title: "Errore del server",
      description: "Errore del server interno",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore sconosciuto",
    },
    network: {
      title: "Errore di rete",
      description: "Si è verificato un errore di rete",
    },
    forbidden: { title: "Accesso negato", description: "Accesso negato" },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Modello non trovato",
    },
    conflict: {
      title: "Conflitto",
      description: "Richiedi conflitti con lo stato",
    },
  },
};
