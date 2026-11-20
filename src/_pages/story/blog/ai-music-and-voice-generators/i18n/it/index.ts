import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Musica, voce e trascrizione con l’IA | {{appName}}",
    description:
      "Modelli musicali {{musicCount}} AI, testo {{voiceCount}} a voci vocali, modelli di trascrizione {{sttCount}}. Suno alternative con prezzi reali per clip, al minuto e all'ora. Crediti gratuiti per iniziare.",
    category: "Comparazione del modello",
    imageAlt:
      "{{appName}} : Modelli musicali, vocali e trascrizionali AI comparati",
    keywords:
      "AI generatore di musica, Suno alternativa, AI generatore di canzoni, AI beat generator, Lyria 3, ElevenLabs Musica, Sonauto, MusicGen, AI testo al discorso, AI generatore di voce, AI voce generatore crediti gratuiti, testo a voci di discorso, ElevenLabs alternativa, Kokoro TTS, Gemini TTS, discorso al testo, AI trascrizione, Whisper, Whisper Large V3, Deepgram Nova-2, GPT-4o Mini Transcribe, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Comparazione del modello",
    readTime: "11 min lettura",
    title: "Canzoni, basi, voci e trascrizioni. Un solo account.",
    subtitle:
      "{{musicCount}} modelli musicali, {{voiceCount}} voci e {{sttCount}} modelli di trascrizione con un solo saldo su {{appName}}. Quanto costano davvero per clip, minuto e ora, e quale scegliere per ogni lavoro.",
  },
  intro: {
    lead: "Un'app musicale. Un'app vocale. Un'app di trascrizione. Tre abbonamenti, tre login, tre pile di crediti che scadono. Tutto quello che volevi era un jingle, un voiceover e una trascrizione.",
    p2: "{{appName}} esegue modelli audio {{modelCount}} da laboratori {{labCount}} su un unico bilanciamento del credito. Ogni numero qui sotto viene dal nostro registro di modello: lunghezze, voci, livelli, prezzi reali. Quattro posti di lavoro, quattro risposte:",
    songs:
      "Canzoni con voce: Sonauto, ElevenLabs Music, Lyria 3 Pro. Clip fino a {{longestMusic}} secondi.",
    beats:
      "Beats and strumentalals: MusicGen Stereo, ModelsLab Music Gen, Lyria 3.",
    voiceovers:
      "Voiceovers e read-aloud: voci {{voiceCount}}, {{cheapVoiceMinute}} a {{priceyVoiceMinute}} al minuto di parola.",
    transcription:
      "Trascrizione: modelli {{sttCount}}, {{cheapSttHour}} a {{priceySttHour}} all'ora di audio.",
  },
  tiers: {
    mainstream: "Convenzionale",
    open: "Aperto",
    uncensored: "Senza censura",
  },
  music: {
    title: "Generatore di musica AI: tutti i modelli {{musicCount}}",
    intro:
      "Il clip più economico prima. I prezzi includono il nostro markup {{markup}} %. 1 credito = {{creditValue}}.",
    colModel: "Modello",
    colLength: "Lunghezza della clip",
    colTier: "Tiro",
    colCredits: "Crediti / clip",
    colPrice: "Prezzo / clip",
    lengthChoice: "{{lengths}} s",
    lengthFixed: "{{seconds}} s",
    footnote:
      "Un prezzo per clip, qualunque sia la lunghezza che scegli. Chiedere una lunghezza il modello non offre e la richiesta scatta a quella più vicina che fa.",
    factLine: "Crediti {{credits}} ({{price}}) per clip · {{length}}",
    picks: {
      songs: {
        title: "Canzoni con voce",
        body: "Un cantante e un gancio. Descrivi il genere, l'umore, la voce e di cosa si tratta. Questi modelli sono costruiti per le canzoni che cantano.",
      },
      beats: {
        title: "Beats e strumenti",
        body: 'Musica di sfondo, loop per un video, un battito da rap over. Niente voci. Nome genere, tempo e strumenti: "lo-fi hip hop, 85 bpm, piano polveroso, crackle in vinile".',
      },
      short: {
        title: "Corti clip, punture, jingles",
        body: "Intros, suoni di notifica, un podcast sting. Breve e a buon mercato. Facciamo dieci, tienine uno.",
      },
    },
    suno: "Cerchi un'alternativa Suno? Suno e Udio non sono su {{appName}}. Quello che si ottiene invece: modelli musicali {{musicCount}} su un unico saldo, da {{cheapMusicPrice}} a clip, senza abbonamento aggiuntivo. La cattura onesta: i clip si fermano ai secondi {{longestMusic}}. Le tracce di tre minuti sono ancora app dedicate alle canzoni.",
    toolLink: "Aprire il generatore di musica",
  },
  voices: {
    title: "Testo AI al discorso: le voci {{voiceCount}} confrontate",
    intro:
      "Prima e' piu' economico. Fatturato per carattere di testo. L'ultima colonna stima un minuto di discorso a circa caratteri {{charsPerMinute}}.",
    colVoice: "Voce",
    colCharacter: "Suono",
    colTier: "Tiro",
    colCredits: "Crediti / 1.000 carboni",
    colMinute: "Circa 1 min di discorso",
    gender: {
      male: "Maschio",
      female: "Femmina",
      neutral: "Neutrale",
    },
    style: {
      conversational: "conversazione",
      warm: "caldo caldo",
      deep: "profondo",
      expressive: "espressiva espressiva espressiva espressiva",
      calm: "calma.",
      friendly: "amichevole",
      authoritative: "autorevolezza",
      clear: "chiaro",
      soft: "morbido",
      steady: "costante",
      confident: "fiducioso",
      british: "Regno Unito",
      lively: "vivace e vivace",
      bright: "luminoso",
      upbeat: "Imbattibile",
    },
    footnote:
      "Le tariffe includono il nostro markup {{markup}} %. Il minuto è una stima: parlanti veloci e parole lunghe lo spostano. Paghi per i personaggi che mandi, non per i secondi che rientri.",
    factLine:
      "Crediti {{credits}} / 1.000 carboni · circa {{minute}} al minuto · {{character}}",
    picks: {
      everyday: {
        title: "Ogni giorno lettura-aloud",
        body: "{{defaultVoice}} è la voce predefinita per leggere le risposte ad alta voce.",
      },
      natural: {
        title: "La maggior parte naturale: i voiceover che pubblichi",
        body: "Gamma emotiva, pacing umano. Per la narrazione YouTube, annunci, campioni audiolibri. Le voci priciest qui, quindi finire il copione prima e rendere una volta.",
      },
      multilingual: {
        title: "Molte lingue, una voce",
        body: "Le voci Gemini parlano 100+ lingue e seguono le istruzioni di consegna: più lento, sussurrato, eccitato.",
      },
      expressive: {
        title: "Caratteri e storytelling",
        body: "Più dramma, più gamma. Costruito per romanzi, personaggi di gioco, scene di gioco.",
      },
      budget: {
        title: "Più economico, nessun filtro di contenuto",
        body: "Kokoro è un modello 82M a peso aperto. Le voci di {{uncensoredVoiceCount}} Kokoro siedono nel nostro livello non censurato: nessun filtro dei contenuti su quello che leggono. Sono anche le voci più economiche sulla piattaforma.",
      },
    },
    languages:
      "Ogni voce qui è sintonizzata per l'inglese. Le voci Gemini gestiscono 100 lingue. Il resto può leggere altre lingue, spesso con un accento. Prova una frase prima di rendere un intero script.",
    toolLink: "Testo aperto al discorso",
  },
  stt: {
    title: "Trascrizione AI: discorso {{sttCount}} ai modelli di testo",
    intro:
      "Il più economico al minuto prima. Fatturato al secondo dell'audio. I prezzi includono il nostro markup {{markup}} %.",
    colModel: "Modello",
    colTier: "Tiro",
    colCredits: "Crediti / minuto",
    colHour: "Prezzo / ora",
    footnote:
      "Quando un fornitore riferisce il suo costo effettivo per un lavoro, noi fattura che costa più il markup. Una carica finale può atterrare leggermente fuori dal tavolo.",
    factLine: "Crediti {{credits}} / minuto · {{hour}} all'ora",
    picks: {
      cheapest: {
        title: "Più economico: ore di audio per centesimi",
        body: "Whisper, 99 lingue. Un abbonamento copre circa {{subSttHours}} ore di audio a questa velocità.",
      },
      accuracy: {
        title: "Accuratezza prima",
        body: "Meno parole sbagliate, migliore rilevamento della lingua. Per le interviste, le citazioni, qualsiasi cosa pubblichi. {{defaultStt}} è il default per l'ingresso vocale.",
      },
      languages: {
        title: "Molte lingue",
        body: "Whisper copre 99 lingue, Nemotron 40 locali. Voxtral è il modello di trascrizione Mistral, costruito per registrazioni fino a 10 minuti.",
      },
      fast: {
        title: "Rapido e rumoroso",
        body: "Bassa latenza, si tiene in stanze rumorose. Realizzato per note vocali veloci e dittatura.",
      },
    },
    toolLink: "Discorso aperto al testo",
  },
  chat: {
    title: "Come funziona nella chat",
    intro:
      "Nessuna app separata. Musica, voce e trascrizione dal vivo all'interno di ogni chat su {{appName}}.",
    steps: {
      song: {
        title: "Chiedere una canzone",
        body: 'Digitare "fare un 30 secondo intro sinthwave per il mio podcast". Lo AI chiama il generatore musicale con il modello musicale della tua abilità, {{defaultMusic}} a meno che tu non l\'abbia cambiato. Nomina un altro modello nel prompt per passare.',
      },
      voice: {
        title: "Ascoltare qualsiasi risposta",
        body: "Premi l'icona dell'altoparlante su una risposta e viene letta aloud nella voce della tua abilità, {{defaultVoice}} per impostazione predefinita. Impostare una voce diversa per abilità.",
      },
      dictate: {
        title: "Parlare invece di digitare",
        body: "Toccare il microfono e parlare. {{defaultStt}} trascrive le parole nell'ingresso, o la registrazione va dritto a modelli che capiscono l'audio.",
      },
      transcribe: {
        title: "Trascrivere i file interi",
        body: "Riunioni, interviste, memo vocali: passare ai file {{sttMaxFiles}} sul discorso alla pagina del testo e scegliere il modello.",
      },
      call: {
        title: "Modalità di chiamata",
        body: "Senza mani. Parli, lo AI risponde ad alta voce, rispondi. Voce in, voce fuori, stesso saldo.",
      },
    },
    toolPages:
      "Vuoi il pieno controllo? Ogni lavoro ha una sua pagina: scegli il modello o la voce, imposta la lunghezza della clip, incolla un lungo script.",
  },
  pricing: {
    title: "Che musica e voce AI costano qui",
    intro:
      "Tre formule, un saldo. Prezzo del fornitore più il nostro markup {{markup}} %. 1 credito = {{creditValue}}.",
    music:
      "Musica: un prezzo piatto per clip. Dai crediti {{cheapMusicCredits}} ({{cheapMusicPrice}}) su crediti {{cheapMusicName}} a {{priceyMusicCredits}} ({{priceyMusicPrice}}) su {{priceyMusicName}}.",
    voice:
      "Voce: per carattere. Da crediti {{cheapVoiceCredits}} per 1.000 caratteri su {{cheapVoiceName}} a {{priceyVoiceCredits}} su {{priceyVoiceName}}.",
    stt: "Trascrizione: al secondo dell'audio. Da {{cheapSttCredits}} accredita un minuto su {{cheapSttName}} a {{priceySttCredits}} su {{priceySttName}}.",
    failed:
      "I crediti vengono fuori solo una volta che hai il risultato. Lavoro fallito, timeout, respinta richiesta: non si paga nulla.",
    free: "Gratis: {{guestCredits}} accredita un mese senza un account, {{freeCredits}} con un account gratuito, {{maxCredits}} con la newsletter. I crediti {{freeCredits}} acquistano clip {{freeClips}} su {{cheapMusicName}}, o sui minuti {{freeVoiceMinutes}} di {{cheapVoiceName}}.",
    sub: "Piani mensili: quattro dimensioni, a partire dai crediti {{subCredits}} per {{subPrice}}.",
    pack: "Pacchetti per ricaricare i crediti dell’abbonamento. {{packCredits}} crediti per {{packPrice}}. Non scadono mai. Paga con carta, PayPal o criptovalute.",
    link: "Vedi piani e pacchetti di credito",
  },
  limits: {
    title: "I limiti, dritto",
    intro: "Conoscere i bordi prima di spendere un credito.",
    musicLength:
      "I clip musicali funzionano secondo {{longestMusic}} al massimo. Niente tracce di tre minuti, niente allungamento di una clip.",
    musicFlat:
      "Una clip costa lo stesso a ogni lunghezza. I clip corti sono il modo economico per testare un prompt, non uno sconto.",
    noSuno: "No Suno, no Udio. Le loro API non sono su {{appName}}.",
    ttsLength:
      "Il testo in parola raggiunge i caratteri {{ttsMaxChars}} per richiesta. Scrittori più lunghi: dividerli.",
    sttFiles:
      "La trascrizione richiede fino a file {{sttMaxFiles}} per richiesta, {{sttMaxMb}} MB ciascuno.",
    noCloning:
      "Niente clonazione vocale. Scegli tra le voci del tavolo. Non puoi caricare il tuo.",
    filters:
      "La maggior parte dei modelli di musica e voce corrono dietro la moderazione del loro fornitore. Un prompt può essere rifiutato a monte. Quel rifiuto non costa nulla.",
    callout:
      "Prima di pubblicare: controlla i termini del fornitore per l'uso commerciale di musica e voci generate. Le regole differiscono per laboratorio, e cambiano.",
  },
  faq: {
    title: "FAQ",
    bestMusic: {
      q: "Qual è il miglior generatore di musica AI?",
      a: "Dipende dalla pista. Canzoni con voce: Sonauto o ElevenLabs Music. Pista breve lucidata: Lyria 3 Pro. Beats and loops: MusicGen Stereo. Più economico: {{cheapMusicName}} a {{cheapMusicPrice}} una clip. Tutti gli {{musicCount}} funzionano su un saldo {{appName}}, quindi si passa per clip.",
    },
    suno: {
      q: "C'è una buona alternativa Suno?",
      a: "Per brevi canzoni e beat, sì: Sonauto, ElevenLabs Music e Google Lyria 3 funzionano qui su un unico saldo, da {{cheapMusicPrice}} a clip, senza abbonamento aggiuntivo. Per le canzoni di tre minuti, non ancora: i clip qui si fermano ai secondi {{longestMusic}}.",
    },
    vocals: {
      q: "AI può fare canzoni con la voce?",
      a: "Si'. Chiedi a Sonauto, ElevenLabs Music o Lyria 3 Pro per una canzone e descrivi l'argomento, l'umore e il cantante. Modelli strumentali come MusicGen Stereo fanno musica senza voce.",
    },
    bestVoice: {
      q: "Quale generatore vocale AI suona più naturale?",
      a: "Per le voci di lettura quotidiane, OpenAI come il suono {{defaultVoice}} pulito e poco costoso. Più espressivo: xAI Eve e Inworld. Per molte lingue: Gemini. Per il prezzo più basso e nessun filtro: Kokoro.",
    },
    free: {
      q: "C'è un generatore di voce AI con crediti gratuiti?",
      a: "Si. {{guestCredits}} crediti gratuiti al mese senza un account, {{freeCredits}} con un account gratuito, {{maxCredits}} con la newsletter. Su {{cheapVoiceName}} si tratta di minuti {{freeVoiceMinutes}} di discorso. Gli stessi crediti pagano per musica e trascrizione.",
    },
    transcribeCost: {
      q: "Quanto costa la trascrizione AI?",
      a: "Da {{cheapSttHour}} all'ora di audio su {{cheapSttName}} a {{priceySttHour}} su {{priceySttName}}. Billed al secondo. I posti di lavoro non costano niente.",
    },
    cloning: {
      q: "Posso clonare la mia voce?",
      a: "No. {{appName}} offre voci pronte {{voiceCount}}. Niente clonazione, niente caricamenti della tua voce.",
    },
    uncensored: {
      q: "Esiste un modello di sintesi vocale senza censura?",
      a: "Si. Le voci di {{uncensoredVoiceCount}} Kokoro siedono nel nostro livello non censurato: un modello open-weight senza filtro dei contenuti su quello che legge. La maggior parte dei modelli musicali e le altre voci corrono dietro i filtri del loro fornitore.",
    },
    modelsLink: "Sfoglia tutti i modelli con specifiche e prezzi",
    videoLink: "Ti serve anche il video? Generatori video AI confrontati",
    pricingLink: "Vedi piani e prezzi",
  },
  partners: {
    body: "Fare musica, podcast o contenuti di voiceover? Il programma partner {{appName}} ti paga una quota ricorrente di ogni pagamento che fai riferimento.",
    link: "Partecipa al programma partner",
  },
  cta: {
    title: "Scegli un modello. Premi play.",
    subtitle:
      "Canzoni, battiti, voci e trascrizioni da un unico saldo. Inizia con i crediti gratuiti {{guestCredits}}, nessun account necessario.",
    music: "Fare musica",
    voice: "Generare una voce",
    transcribe: "Trascrizione audio",
    models: "Sfoglia tutti i modelli",
  },
};
