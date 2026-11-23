import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} API Docs: Compatibile OpenAI e Anthropic",
    description:
      "Una base URL, {{modelCount}} chat modelli. Completamenti di chat OpenAI e risposte API, messaggi Anthropic API, streaming, chiamata degli strumenti. Oltre a immagini, discorso, trascrizione, video e musica in formato OpenAI. Codex CLI e Claude Code si connettono direttamente. Paga con i crediti.",
    category: "API",
    imageAlt: "{{appName}} OpenAI: compatibili documenti API",
    keywords:
      "api, compatibile openai, compatibile antropica, completamento chat, risposte api, messaggi api, codex cli, claude code, streaming, funzione call, generazione immagini api, testo api, bisbiglia api, video generazione api, musica generazione api, {{appName}}",
  },
  toc: {
    title: "Su questa pagina",
    mobileTitle: "Vai a",
    groups: {
      start: "Iniziare",
      chat: "Chat",
      media: "Media",
      reference: "Riferimento",
      integrations: "Integrazioni",
    },
  },
  nav: {
    quickstart: "Quickstart",
    auth: "Autenticazione",
    access: "Accesso e prezzi",
    models: "Modelli",
    chat: "Completamenti di chat",
    tools: "Chiamata di strumento",
    responses: "Responses API",
    messages: "Messages API",
    billing: "Crediti e fatturazione",
    errors: "Errori e limiti di velocità",
    codingTools: "Utensili per la codifica",
    sdks: "Esempi di SDK",
    guides: "Guide",
    images: "Immagini",
    speech: "Testo al discorso",
    transcriptions: "Trascrizione",
    videos: "Video",
    music: "Musica",
    mediaFiles: "File multimediali",
  },
  hero: {
    badge: "Riferimento API",
    title: "Una base URL.",
    titleHighlight: "Ogni modello.",
    subtitle:
      "Punta qualsiasi OpenAI o Anthropic SDK a {{appName}}. Codex CLI e Claude Code anche. Immagini, voce, video e musica sulla stessa chiave. Nessun nuovo cliente da imparare.",
    ctaKey: "Ottieni una chiave API",
    ctaPricing: "Vedi i piani",
    quickstartLink: "Avvio rapido in 3 passi",
    facts: {
      models: "Modelli di chat {{modelCount}}",
      formats: "OpenAI + formato Anthropic",
      streaming: "Streaming e chiamate degli strumenti",
      rate: "Richieste {{rate}} al minuto per chiave",
    },
  },
  code: {
    copy: "Copia",
    wrap: "Linee di scorrimento",
    copied: "Affrontato",
    request: "Richiesta",
    response: "Risposta",
    stream: "Streaming",
    showResponse: "Esempio",
    showStream: "Esempio di flusso",
    showObject: "Oggetti di lavoro finiti",
  },
  quickstart: {
    title: "Quickstart",
    intro:
      "Lo API parla il formato OpenAI e il filo Anthropic. Il codice che corre contro entrambi corre qui dopo due modifiche: la base URL e la chiave.",
    baseUrlLabel: "OpenAI base URL",
    anthropicBaseUrlLabel: "Anthropic base URL",
    anthropicBaseUrlNote:
      "Per gli SDK Claude Code e Anthropic. No `/v1` alla fine: aggiungono `/v1/messages`.",
    baseUrlNote:
      "Qualsiasi locale funziona nel percorso (en- US, de- DE, pl- PL). Cambia solo la lingua dei messaggi di errore.",
    envLabel: "Oppure impostalo una volta per ogni OpenAI SDK",
    step1: {
      title: "Creare una chiave",
      description:
        "Apri i tasti API nel tuo account, chiama la chiave, copiala. Lo vedi una volta.",
      cta: "Aprire le chiavi API",
    },
    step2: {
      title: "Impostare la base URL",
      description:
        "Ingrandisci la base URL nel tuo cliente. I clienti Anthropic prendono il secondo.",
    },
    step3: {
      title: "Invia una richiesta",
      description:
        "Incollalo in un terminale, metti la chiave dentro e gestiscila. Stessa chiamata in Python e JavaScript.",
    },
  },
  access: {
    title: "Accesso e prezzi",
    intro:
      "Lo API funziona sugli stessi crediti dell'app di chat. Nessun piano API separato, senza tasse di posto.",
    unlockTitle: "Che cosa lo sblocca",
    plan: "Qualsiasi piano, da {{subPrice}} al mese. Ogni piano porta crediti mensili.",
    grant: "Crediti concessi dal nostro team, come i crediti del tester.",
    never:
      "I crediti gratuiti non lo sbloccano mai: l'indennità mensile, la registrazione e i bonus di newsletter, i guadagni di riferimento.",
    withoutTitle: "Senza un acquisto",
    locked:
      "I conti senza acquisto non possono creare le chiavi e ogni chiamata `/v1` risponde a HTTP 402 `paid_plan_required`.",
    topup:
      "Ti servono altri crediti? Con un abbonamento puoi ricaricare con pacchetti a partire da {{packPrice}}. I crediti dei pacchetti non scadono mai.",
    ctaUnlock: "Vedi i piani",
    ctaKeys: "Aprire le chiavi API",
  },
  auth: {
    title: "Autenticazione",
    intro:
      "Invia la tua chiave come token Bearer su ogni richiesta. Le chiavi iniziano con `sk-unb-`. I client Anthropic lo inviano come `x-api-key` e funziona anche.",
    header: "Authorization: Bearer sk-unb-YOUR_KEY",
    headerAnthropic: "x-api-key: sk-unb-YOUR_KEY",
    headerTab: "Formato OpenAI",
    headerAnthropicTab: "Formato Anthropic",
    points: {
      hash: "Memorizziamo un hash, non la chiave. Perderlo e crearne uno nuovo.",
      scope:
        "Una chiave funziona solo su API: `/v1/models`, chat (`/v1/chat/completions`, `/v1/responses`, `/v1/messages`) e media (`/v1/images`, `/v1/audio`, `/v1/videos`, `/v1/music`, `/v1/media`). Non può toccare il tuo account, pagamenti o impostazioni.",
      limit:
        "Fino a {{maxKeys}} chiavi attive per conto. Rivolgere qualsiasi chiave in qualsiasi momento: smette di lavorare subito.",
      missing:
        "Nessuna chiave o una chiave revocata restituisce 401. Una chiave su un conto senza un acquisto restituisce 402.",
    },
  },
  models: {
    title: "Modelli",
    intro:
      "`GET /v1/models` elenca i modelli che la chiave può chiamare in questo momento, con dimensioni del contesto, supporto degli strumenti e prezzi di credito per milione di gettoni. Utilizzare l'id come campo di modello nelle richieste.",
    note: "La lista dipende dal tuo account. Ids non noti o non disponibili restituiscono 404 `model_not_found`. L'unica mappatura: su `/v1/messages`, Claude ids che Claude Code invia per impostazione predefinita andare al nostro nuovo Claude della stessa famiglia.",
    browse: "Sfoglia ogni modello con prezzi e filtri",
    media: {
      title: "Modelli multimediali nella stessa lista",
      body: "Immagine, video, musica, voce e trascrizione modelli siedono nella stessa lista. Ogni voce dice cosa fa e dove chiamarlo.",
      filename: "voce dei media",
      points: {
        modality:
          "la modalità è chat, immagine, video, musica, discorso o trascrizione. endpoints elenca i percorsi che prendono il modello.",
        pricing:
          "I prezzi dei media sono per unità: `credits_per_image`, `credits_per_second` (video), `credits_per_clip` (musica), `credits_per_1k_characters` (speech), `credits_per_minute` (transcription).",
        anthropic:
          "I client Anthropic (intestazione `anthropic-version`) ottengono solo i modelli di chat. I modelli il cui fornitore non è impostato sul nostro lato non sono elencati e rispondono 404 `model_not_found`.",
      },
    },
  },
  chat: {
    title: "Completamenti di chat",
    intro:
      "Completamenti standard di chat OpenAI. Messaggi in, un messaggio di assistente. Ingressi di testo e immagine (`image_url` come https URL o dati base64 URL).",
    nonStream: {
      title: "Non a monte",
      body: "Il valore predefinito. Si ottiene un corpo JSON quando il modello è fatto. `usage.credits_charged` è ciò che questa chiamata costa.",
    },
    stream: {
      title: "Streaming",
      body: "Impostare `stream: true` per gli eventi server-sent nel formato a blocchi OpenAI, terminata da `data: [DONE]`. Aggiungi `stream_options.include_usage` per ottenere un pezzo finale con conteggi di token e `credits_charged`. La chiusura della connessione cessa la generazione. Paghi solo per quello che e' scappato.",
    },
    paramsTitle: "Richiesta campi",
    paramsColumns: {
      field: "Campo di applicazione",
      description: "Che cosa fa",
    },
    params: {
      model: "Obbligatorio. Un modello id da `GET /v1/models`.",
      messages:
        "Richiesto. sistema, sviluppatore, utente, assistente e messaggi di strumento. Il contenuto dell'utente può essere una stringa o un testo e parti `image_url`.",
      stream: "vero per eventi server-sent. Falso di default.",
      streamOptions:
        "`{ include_usage: true }` aggiunge un pezzo di utilizzo finale.",
      maxTokens:
        "Il limite superiore sui token generati. `max_completion_tokens` ha la precedenza. E' caduto a {{maxTokens}}.",
      temperature: "Da 0 a 2. Ignorato da modelli che non lo supportano.",
      topP: "Da 0 a 1.",
      stop: "Una stringa di arresto o una lista di loro.",
      n: "Solo 1 è supportato. Altri valori restituiscono 400.",
      tools:
        "Strumenti funzione che il modello può chiamare. Vedi la chiamata degli strumenti.",
      toolChoice: "nessuna, auto, richiesta, o una funzione chiamata.",
    },
  },
  tools: {
    title: "Chiamata di strumento",
    intro:
      "La funzione chiamata funziona come OpenAI. Descrivi le funzioni, il modello decide di chiamarne uno, lo esegui e rispedisci il risultato. Non eseguiamo mai i tuoi strumenti.",
    flow: {
      title: "L'anello",
      step1: "Invia strumenti con i tuoi messaggi.",
      step2:
        "Il modello risponde con `tool_calls` e `finish_reason: tool_calls`. Ogni chiamata ha un id, un nome di funzione e argomenti JSON -string.",
      step3:
        "Eseguire la funzione da soli. Appendere il messaggio dell'assistente, quindi un messaggio di strumento per chiamata con il suo `tool_call_id`.",
      step4: "Richiamami. Il modello utilizza i risultati e le risposte.",
    },
    requestTitle: "1. Richiesta con strumenti",
    responseTitle: "2. Il modello chiede una chiamata",
    followUpTitle: "3. Ritorna il risultato",
    sdkTitle: "Lo stesso anello con Python SDK",
    streamingTitle: "Le chiamate degli strumenti di streaming",
    streamingBody:
      "Con `stream: true`, le chiamate arrivano come blocchi `delta.tool_calls`, indirizzati dall'indice. Il primo pezzo per un indice porta id e `function.name`. I pezzi più tardi mettono d'accordo a `function.arguments`. Concatenarli, poi parse il JSON quando `finish_reason` è `tool_calls`. Ogni OpenAI SDK fa questo per te.",
    rules: {
      title: "Regole",
      support:
        "Il modello deve supportare gli strumenti: controllare `supports_tools` in `GET /v1/models`. Altri restituiscono 400 `tools_not_supported`.",
      choice:
        "`tool_choice` nessuna, auto e lavoro richiesto come in OpenAI. Denominazione di una funzione che non è in strumenti restituisce 400.",
      names:
        "Nomi di funzione: lettere, cifre, underscore, dash, fino a 64 caratteri.",
      billing:
        "Le definizioni degli strumenti e i risultati degli strumenti sono gettoni di ingresso. Le chiamate sono token di uscita. Si fanno pagare come tutti gli altri gettoni.",
    },
  },
  billing: {
    title: "Crediti e fatturazione",
    intro:
      "L’API usa gli stessi crediti dell’app di chat e applica le stesse tariffe. Un solo saldo, una sola fattura.",
    points: {
      price:
        "Costo = gettoni di ingresso più token di uscita al prezzo di credito del modello, quotati per milione di gettoni in `GET /v1/models`. I modelli OpenRouter sono l'eccezione: si paga quello che il fornitore ha veramente addebitato per la chiamata, più il nostro markup. Il loro prezzo è una stima. Chatta li fattura allo stesso modo.",
      usage:
        "Ogni risposta riporta `usage.credits_charged`. Il tuo saldo è nell'app sotto Credits.",
      preflight:
        "Prima di eseguire una chiamata, verifichiamo se il tuo saldo copre il costo massimo stimato. Se non basta, restituiamo HTTP 402 con `insufficient_credits`. Non eseguiamo la chiamata e non addebitiamo nulla.",
      real: "Dopo la chiamata si paga l'utilizzo reale, non la stima: il token conteggia i rapporti del fornitore, o il costo reale del fornitore per i modelli OpenRouter. Se un fornitore non riporta alcun costo, la chiamata rientra nel prezzo indicato.",
      media:
        "Media chiama fattura allo stesso modo: il costo reale del fornitore più il nostro markup dove il fornitore lo riferisce, il prezzo per modello indicato altrimenti. Immagini fattura per immagine, discorso per carattere, trascrizione al secondo di audio, video quando la clip è pronta, musica per clip.",
      topup:
        "Hai finito i crediti? Ricarica con un pacchetto, rinnova l’abbonamento o passa a un piano superiore. Puoi fare subito un’altra chiamata.",
    },
  },
  limits: {
    title: "Limiti di tasso",
    body: "Ogni chiave consente di default alle richieste {{rate}} al minuto. Nel limite si ottiene HTTP 429 con un intestazione `Retry-After` in pochi secondi. Ritiratevi per quel lungo e riprovate. I limiti sono per chiave, così i carichi di lavoro pesanti divisi tra le chiavi.",
  },
  errors: {
    title: "Errori e limiti di velocità",
    intro:
      "Gli errori usano la busta OpenAI, quindi gli SDK aumentano le loro eccezioni abituali. Branch su `error.code`, non sul messaggio.",
    shapeTitle: "Corpo di errore",
    shapeOpenAi: "Formato OpenAI",
    shapeAnthropic: "Formato Anthropic",
    codesTitle: "Codici di errore",
    columns: { status: "HTTP", code: "code", meaning: "Significato" },
    rows: {
      missingKey:
        "Nessuna chiave inviata. Inviare `Authorization: Bearer sk-unb-...`, o `x-api-key`.",
      invalidKey: "La chiave è sbagliata o revocata.",
      paid: "Nessun acquisto sul conto ancora. Qualsiasi piano lo sblocca.",
      credits: "Saldo insufficiente per questa chiamata. Ricarica i crediti.",
      cap: "Hai esaurito i crediti a pagamento e raggiunto il limite giornaliero di crediti gratuiti. Ricarica i crediti.",
      notFound: "Il modello non esiste o non è disponibile per voi.",
      invalid:
        "Bad richiesta: parametro non supportato, cattivo `tool_choice`, cattiva immagine URL.",
      contentPolicy:
        "Il fornitore dei media ha rifiutato il prompt. Non c'e' niente che sia accusato. Riformulare o scegliere un altro modello.",
      consent:
        "I modelli non censurati hanno bisogno di una sola volta 18+ conferma sul tuo conto. Confermare una volta sulla pagina delle chiavi API, quindi riprovare.",
      rate: "Oltre {{rate}} richiede al minuto per questa chiave. Leggi `Retry-After`.",
      upstream:
        "Il fornitore di modelli non è riuscito. Sicuro da riprovare. I flussi terminano con un evento di errore.",
      balance:
        "Non siamo riusciti a leggere il tuo saldo. Non abbiamo eseguito la chiamata. Riprova.",
    },
    streamNote:
      "Errori che avvengono a metà flusso arrivano come evento `data:` con lo stesso oggetto di errore, seguito da `data: [DONE]`.",
  },
  responses: {
    title: "Responses API",
    intro:
      "OpenAI Responses API, il formato Codex CLI parla. Stessi modelli, chiave, crediti e limiti di tasso come completamento della chat.",
    request: {
      title: "Richiesta",
      body: "input è una stringa o un elenco di elementi di input. istruzioni è il prompt del sistema. La risposta arriva come elementi di output. Ogni OpenAI SDK ti dà anche `output_text`.",
    },
    stream: {
      title: "Streaming",
      body: "Impostare `stream: true` per il flusso di eventi Responses: `response.created`, delta di testo, quindi `response.completed` con l'uso.",
    },
    points: {
      tools:
        "Strumenti: funzione, personalizzato e `local_shell`. Le chiamate del modello ritornano come elementi di uscita. Invia ogni risultato come elemento `function_call_output` con lo stesso `call_id`.",
      reasoning:
        "Modelli motivanti restituiscono elementi di ragionamento accanto alla risposta.",
      billing:
        "Billing, ids modello, errori e limiti di tasso funzionano esattamente come completamento della chat.",
    },
  },
  messages: {
    title: "Messages API",
    intro:
      "I messaggi Anthropic API, il formato Claude Code e gli SDK Anthropic parlano. Utilizzare la base URL senza `/v1`: i client aggiungono `/v1/messages` stessi.",
    request: {
      title: "Richiesta",
      body: "Richiesta messaggi standard: modello, `max_tokens`, sistema, messaggi. Blocchi di testo e immagine in, testo e `tool_use` si bloccano.",
    },
    stream: {
      title: "Streaming",
      body: "Impostare `stream: true` per eventi server-sent Anthropic, da `message_start` a `message_stop`.",
    },
    points: {
      auth: "Auth: `x-api-key` o `Authorization: Bearer`. Prendete entrambi la chiave di sk-unb.",
      models:
        "Modello: qualsiasi id da `GET /v1/models`. Il codice Anthropic ids Claude invia per impostazione predefinita, come `claude-sonnet-4-5-20250929`, mappa al nostro modello Claude corrispondente.",
      tools:
        "Utensili: `tool_use` si blocca, `tool_result` blocca indietro, come nel Anthropic API.",
      billing:
        "Stessi crediti, stessi prezzi, stesso limite di tasso come ogni altro endpoint.",
    },
    countTokens: {
      title: "Conteggio di gettoni",
      body: "`POST /v1/messages/count_tokens` conta i token di ingresso di una richiesta di messaggi senza eseguire il modello. Claude Code lo chiama a gestire il suo contesto.",
    },
  },
  images: {
    title: "Immagini",
    intro:
      "formato immagini OpenAI. Qualsiasi modello con immagine di modalità da `GET /v1/models`. Funziona con il client di immagini di ogni OpenAI SDK.",
    generate: {
      title: "Generazione",
      body: "Invia JSON con questi campi. La risposta elenca un url per immagine.",
    },
    params: {
      model:
        "Obbligatorio. Qualsiasi id con modalità `image` da `GET /v1/models`.",
      prompt: "Obbligatorio. Che disegnare, fino a 2000 caratteri.",
      n: "Immagini per chiamata, da 1 a {{maxImages}}. Ognuno è fatturato.",
      size: "`WIDTHxHEIGHT` come `1024x1024`, o `auto`. Scegliamo la dimensione più vicina che il modello rende.",
      aspectRatio:
        "La nostra estensione: `1:1 | 16:9 | 9:16 | 4:3 | 3:4 | 3:2 | 2:3 | 21:9`. Vince di piu'.",
      quality:
        "`standard | hd | low | medium | high | auto`. `hd` e `high` chiedono il livello dettagliato dove il modello ha uno.",
      responseFormat:
        "`url` (default, un link firmato valido 7 giorni) o `b64_json`.",
    },
    edit: {
      title: "Modificare un'immagine",
      body: "Un'immagine di input più un prompt. Caricalo come immagine di campo multipart o invia `image_url` (https o base64 dati URL) in JSON. Il modello deve prendere l'ingresso dell'immagine: `input_modalities` contiene l'immagine. Le maschere non sono supportate; descrivere il cambiamento nel prompt.",
    },
    points: {
      size: "Scegliamo la dimensione più vicina e raddrizziamo i render del modello.",
      format:
        "url è un link firmato al file memorizzato, valido 7 giorni senza chiave. `b64_json` restituisce i byte in linea.",
      billing: "`credits_charged` nella risposta dice il costo della chiamata.",
    },
  },
  speech: {
    title: "Testo al discorso",
    intro:
      "Testo in, audio bytes out. model è un id vocale di `GET /v1/models` (linguaggio di modalità), come `openai-nova`. Lo stile OpenAI funziona anche: modello `tts-1` con voce nova.",
    points: {
      voices:
        "ingresso fino a caratteri {{maxChars}}. velocità da 0.25 a 4 su voci OpenAI, NanoGPT e ElevenLabs.",
      formats:
        "`response_format` mp3 (default), opus, aac, flac, wav o pcm. Quali una voce offre dipende dal suo fornitore; altri rispondono 400 con la lista.",
      billing:
        "Billed per personaggio. L'intestazione `X-Credits-Charged` dice il costo della chiamata.",
    },
  },
  transcriptions: {
    title: "Trascrizione",
    intro:
      "Discorso al testo, OpenAI Whisper format. Caricamento multipart, stessa chiamata SDK che si utilizza già.",
    transcribe: {
      title: "Trascrizione",
      body: "file fino a {{maxMb}} MB (mp3, mp4, m4a, wav, webm, ogg, flac), modello come `whisper-1`, lingua facoltativa. `response_format` json, sms, srt, `verbose_json` o vt.",
    },
    translate: {
      title: "Traduci in Italiano",
      body: "`POST /v1/audio/translations`: qualsiasi lingua parlata, testo in inglese. Corre su `whisper-1`. Stessi formati delle trascrizioni.",
    },
    points: {
      billing: "Fatturato al secondo dell'audio.",
    },
  },
  videos: {
    title: "Video",
    intro:
      "Async, a forma di OpenAI video API. La chiamata risponde subito con un lavoro. Poll it, quindi scaricare il MP4.",
    create: {
      title: "Iniziare un lavoro",
      body: "modello, prompt, secondi, dimensione o `aspect_ratio`, risoluzione, `negative_prompt`. La risposta è un oggetto video con lo stato in coda.",
    },
    poll: {
      title: "Sondaggi e download",
      body: "`GET /v1/videos/{id}` restituisce lo stato (queued, `in_progress`, completato, fallito), il progresso e, quando fatto, un url firmato. L'inquinamento è gratuito e salta il limite di velocità. `GET /v1/videos/{id}/content` trasmette il MP4.",
    },
    points: {
      image:
        "Immagine al video: inviare `image_url` in JSON o `input_reference` come upload multipart. Diventa la prima cornice.",
      billing:
        "Fatturato quando il video è pronto, al secondo del video. `credits_charged` mostra il costo.",
      failed: "Un lavoro fallito non costa niente.",
    },
  },
  music: {
    title: "Musica",
    intro:
      "Come un video. Avviare un lavoro, sondare `GET /v1/music/{id}`, scaricare `GET /v1/music/{id}/content`.",
    startTitle: "Iniziare un lavoro",
    pollTitle: "Sondaggi e download",
    points: {
      seconds:
        "secondi: circa 8, 20 o 30. Il modello può arrotondarlo. Descrivi stile, umore, strumenti e tempo in pronta consegna.",
      billing:
        "Billed per clip una volta che è pronto. Un lavoro fallito non costa niente.",
    },
  },
  mediaFiles: {
    title: "File multimediali",
    intro:
      "Ogni url in un punto di risposta dei media qui. Il link firmato funziona senza chiave per 7 giorni, in modo da poterlo consegnare a un browser o a un utente. Con la chiave API lo stesso percorso funziona in qualsiasi momento.",
  },
  codingTools: {
    title: "Utensili per la codifica",
    intro:
      "Una base URL, una chiave. Codex CLI e Claude Code si connettono in modo nativo. OpenCode, Continue, Aider e Cline utilizzano i completamento della chat. Scegli il tuo strumento, copia il blocco, eseguilo.",
    keyPage:
      "La pagina dei tasti API mostra gli stessi blocchi con la chiave già riempita.",
    keyPageCta: "Prendili con la chiave",
    guide: "Leggi la guida degli strumenti di codifica",
  },
  sdks: {
    title: "Esempi di SDK",
    intro:
      "Gli SDK ufficiali OpenAI e Anthropic funzionano in modo immutato. Impostare la base URL e la chiave, mantenere il resto del codice.",
    chat: "Chat",
    stream: "Streaming",
    responses: "Responses API",
    anthropic: "Anthropic SDK",
    images: "Immagini",
    speech: "Discorso",
    transcription: "Trascrizione",
  },
  guides: {
    title: "Guide",
    intro:
      "Guide più approfondite: passare da OpenAI o OpenRouter, usare modelli senza censura via API e collegare la chiave agli strumenti di coding.",
  },
  cta: {
    title: "Sviluppa con tutti i modelli.",
    subtitle:
      "Crea una chiave, configura l’URL nel tuo SDK e inizia a fare richieste.",
    button: "Creare una chiave API",
    secondary: "Confrontare i piani",
  },
};
