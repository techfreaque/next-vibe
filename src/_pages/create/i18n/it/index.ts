import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Generazione AI",
    imageAlt: "{{appName}} {{title}}",
  },
  studio: "Media Studio",
  navName: "Studio",
  hub: {
    metaTitle: "Studio media IA: immagini, video, musica e voce",
    metaDescription:
      "Genera immagini, clip video, musica e voci, oppure trascrivi l'audio. Modelli mainstream e senza censura fianco a fianco. Paghi per risultato.",
    keywords:
      "studio media IA, generatore di immagini IA senza censura, generatore video IA, generatore di musica IA, sintesi vocale, trascrizione audio",
    title: "Studio media",
    subtitle:
      "Cinque strumenti. Tutti i grandi modelli, anche quelli senza censura. Paghi per risultato e tieni tutto ciò che crei.",
    from: "Da {{price}}",
    free: "Gratis",
    models: "{{count}} modelli",
    voices: "{{count}} voci",
    open: "Apri",
  },
  asyncProgress:
    "In corso. Video e musica richiedono di solito da uno a tre minuti. Vedi l'avanzamento anche nella tua cronologia.",
  ooc: {
    title: "Crediti gratuiti insufficienti",
    need: "Questa generazione costa {{amount}} crediti.",
    description:
      "Un account gratuito riceve {{signedIn}} crediti al mese, {{max}} con la newsletter. Dopo la registrazione torni qui con le stesse impostazioni.",
    signUp: "Registrati gratis",
    defaults: "Impostazioni più economiche",
    haveAccount: "Hai già un account?",
    logIn: "Accedi",
  },
  moreOptions: "Altre opzioni",
  modelDefault: "Automatico",
  model: "Modello",
  voice: "Voce",
  estimate: "Costo stimato",
  credits: "Crediti {{amount}}",
  failed: "Generazione fallita",
  historyError:
    "Non poteva aprire la tua storia dello Studio. Per favore, riprovate.",
  unavailable:
    "Nessun modello è disponibile per questo generatore in questo momento.",
  file: "File audio",
  language: "Lingua di registrazione",
  referenceAudio: "audio di riferimento URL",
  durationSeconds: "Lunghezza di registrazione in pochi secondi",
  duration: "Durata",
  ratio: "Rapporto di ispezione",
  size: "Dimensione",
  quality: "Qualità",
  reference: "Immagine di riferimento URL",
  lastFrame: "Ultimo frame URL",
  creating: "Generazione · {{seconds}} s",
  submitImage: "Generare l'immagine",
  submitVideo: "Generare video",
  submitMusic: "Generare musica",
  submitSpeech: "Generare il discorso",
  submitTranscribe: "Trascrizione audio",
  meteredCost: "L'addebito finale utilizza l'utilizzo segnalato del fornitore.",
  estimatePending: "Aggiungi l'audio per stimare il costo.",
  needsCredits: "Servono {{amount}} crediti",
  units: {
    image: "Crediti / immagine {{amount}}",
    video: "Crediti {{amount}} / sec",
    music: "Crediti / traccia {{amount}}",
    speech: "Crediti {{amount}} / 1.000 caratteri",
    transcribe: "Crediti {{amount}} / min",
    tokenImage: "≈ {{amount}} credits / immagine",
  },
  kinds: {
    image: {
      label: "Immagine",
      tab: "Foto",
      pitch:
        "Dal testo all'immagine, o il ritocco di un riferimento. Fotorealismo, anime, arte: qualsiasi cosa descrivi.",
      title: "Creare un'immagine",
      metaTitle: "Generatore di immagini AI non censurato - {{appName}}",
      description: "Descrivi una scena e scegli la sua inquadratura.",
      keywords:
        "uncensored AI generatore di immagini, arte AI, testo a immagine",
    },
    video: {
      label: "Video",
      tab: "Video",
      pitch:
        "Un testo o un primo fotogramma diventa una clip. Scegli durata, formato e risoluzione.",
      title: "Creare un video",
      metaTitle: "Generatore di video AI - {{appName}}",
      description:
        "Impostare una scena in movimento, dal primo telaio all'ultimo.",
      keywords: "Generatore di video AI, testo in video, immagine a video",
    },
    music: {
      label: "Musica",
      tab: "Musica",
      pitch:
        "Un brano completo da un prompt: atmosfera, genere, strumenti, durata.",
      title: "Fare musica",
      metaTitle: "Generatore di musica AI - {{appName}}",
      description:
        "Descrivi l'umore, gli strumenti e la lunghezza della tua traccia.",
      keywords: "Generatore di musica AI, testo alla musica, canzone AI",
    },
    speech: {
      label: "Discorso",
      tab: "Voce",
      pitch: "Il tuo testo letto da voci naturali in molte lingue.",
      title: "Dare testo a voce",
      metaTitle: "Testo AI al discorso - {{appName}}",
      description: "Scegli una voce per leggere il tuo copione ad alta voce.",
      keywords: "testo a discorso, voce AI, TTS",
    },
    transcribe: {
      label: "Trascrizione",
      tab: "Testo",
      pitch:
        "Carica una registrazione e ottieni un testo pulito. Scaricalo come file.",
      title: "Trascrizione audio",
      metaTitle: "Discorso AI al testo - {{appName}}",
      description:
        "Trasformare una registrazione in una trascrizione che è possibile scaricare.",
      keywords: "discorso al testo, trascrizione AI, audio a testo",
    },
  },
};
