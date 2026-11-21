// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../models/i18n/it";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    speech: "Discorso",
    tts: "Testo a velocità",
    ai: "IA",
  },

  post: {
    title: "Testo a Discorso",
    titleShort: "Testo a Discorso",
    dynamicTitle: "Discorso: {{text}}",
    description:
      "Convertire testo in parola. Passare il testo e una voce id. Utilizzare lo strumento dei modelli (modelType = audio) per vedere i modelli vocali disponibili. Ognuno ha un id unico per passare come parametro vocale. Costo: per carattere al ritmo della voce scelta (vedere lo strumento dei modelli). Restituisce audioUrl.",
    form: {
      title: "Testo a Conversione di Discorso",
      description: "Inserire il testo per convertire in discorso",
    },
    text: {
      label: "Testo",
      description: "Testo da convertire in discorso (max 5000 caratteri)",
      placeholder: "Inserisci il testo che vuoi convertire in discorso...",
    },
    voice: {
      label: "Voce",
      description:
        "Modello vocale. Utilizzare lo strumento dei modelli (modelType = audio) per sfogliare le voci disponibili e i loro id.",
    },
    download: "Scarica",
    response: {
      title: "Risultato audio",
      description: "L'audio vocale generato",
      success: "Operazione riuscita",
      audioUrl: "Audio URL",
      creditCost: "Crediti utilizzati",
    },
    submitButton: {
      label: "Parla.",
      loadingText: "Sinthesizing...",
    },
    errors: {
      validation_failed: {
        title: "Errore di convalida",
        description: "Il testo o i parametri forniti non sono validi",
      },
      network_error: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso all'utilizzo di text-to-speech",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di usare text-to-speech",
      },
      not_found: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      server_error: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante la conversione del testo in parola",
      },
      unknown_error: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsaved_changes: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
      noTtsProviderConfigured:
        "Nessun fornitore di testo-a-speech è configurato. Aggiungi OPENAI_API_KEY, EDEN_AI_API_KEY  o ELEVENLABS_API_KEY, oppure collega un provider di inferenza di sistema.",
      notConfigured:
        "La chiave {{label}} API non è configurata. Aggiungi {{envKey}} = <your-key> al tuo file.env. Ottieni la tua chiave a {{url}}",
      conversionFailed: "La sintesi vocale è fallita: {{error}}",
      noText: "Nessun testo fornito",
      noAudioUrl: "Nessun audio URL ricevuto dal fornitore",
      audioFetchFailed:
        "Incapace di creare il file audio. Per favore prova di nuovo.",
      providerError: "Errore del provider: {{error}}",
      internalError: "Errore del server interno",
      unsupportedProvider: "provider TTS non supportato per voce: {{voiceId}}",
      creditsFailed: "Non è riuscito a dedurre i crediti: {{error}}",
      balanceCheckFailed:
        "Non è possibile controllare il saldo di credito. Per favore prova di nuovo.",
      insufficientCredits:
        "Crediti insufficienti per la sintesi vocale. Saldo: {{balance}}, minimo richiesto: {{minimum}}. Ricarica per continuare.",
    },
    success: {
      title: "Operazione riuscita",
      description: "Testo convertito in parola con successo",
      conversionComplete: "Sintesi del discorso completata con successo",
    },
  },
  languages: {
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    es: "Spagnolo",
    fr: "Francese",
    it: "Italiano",
  },
  models: {
    descriptions: {
      openaiAlloy:
        "Lega OpenAI - Voce bilanciata e neutrale per contenuti professionali",
      openaiNova:
        "OpenAI Nova - Caldo, voce amichevole ideale per applicazioni di conversazione",
      openaiOnyx:
        "OpenAI Onyx - voce profonda e autorevole per contenuti formali",
      openaiEcho: "OpenAI Echo - Chiaro, voce articolata con ritmo naturale",
      openaiShimmer:
        "OpenAI Shimmer - Voce espressiva e dinamica per coinvolgere contenuti",
      openaiFable: "OpenAI Fable - voce espressiva, narrante",
      elevenlabsRachel:
        "ElevenLabs Rachel - Voce femminile naturale con gamma emotiva",
      elevenlabsJosh:
        "ElevenLabs Josh - Voce maschile naturale con il tono conversazione",
      elevenlabsBella:
        "ElevenLabs Bella - Voce femminile caldo con consegna morbida",
      elevenlabsAdam:
        "ElevenLabs Adam - Voce maschio professionale per la creazione di contenuti",
      elevenlabsRachelTurbo:
        "ElevenLabs Rachel Turbo - Stessa voce su v4 Turbo. Metà del prezzo, risposte quasi istantanea.",
      elevenlabsJoshTurbo:
        "ElevenLabs Josh Turbo - Stessa voce su v4 Turbo. Metà del prezzo, risposte quasi istantanea.",
      elevenlabsBellaTurbo:
        "ElevenLabs Bella Turbo - Stessa voce su v4 Turbo. Metà del prezzo, risposte quasi istantanea.",
      elevenlabsAdamTurbo:
        "ElevenLabs Adam Turbo - Stessa voce su v4 Turbo. Metà del prezzo, risposte quasi istantanea.",
      kokoroBella:
        "Kokoro Bella - Modello 82M in peso aperto, voce femminile americana calda. Nessun filtro dei contenuti.",
      kokoroSarah:
        "Kokoro Sarah - Modello a peso aperto 82M, voce femminile americana chiara. Nessun filtro dei contenuti.",
      kokoroNicole:
        "Kokoro Nicole - Modello a peso aperto 82M, voce femminile soft low-key. Nessun filtro dei contenuti.",
      kokoroAdam:
        "Kokoro Adam - Modello a peso aperto 82M, voce maschile americana costante. Nessun filtro dei contenuti.",
      kokoroMichael:
        "Kokoro Michael - Modello di 82M a peso aperto, voce maschile americana sicura. Nessun filtro dei contenuti.",
      kokoroEmma:
        "Kokoro Emma - Modello 82M a peso aperto, voce femminile britannica. Nessun filtro dei contenuti.",
      kokoroGeorge:
        "Kokoro George - Modello di 82M a peso aperto, voce maschile britannica. Nessun filtro dei contenuti.",
      voxtralPaul:
        "Voxtral Mini legge testi inglesi con la voce neutra di Paul.",
      inworldAshley:
        "Inworld Ashley - Veloce, a basso costo voce femminile con consegna vivace.",
      inworldCraig:
        "Inworld Craig - Veloce, a basso costo voce maschile inglese.",
      xaiEve:
        "xAI Eve - Voce femminile espressiva con controlli di emozione in linea.",
      geminiZephyr:
        "Gemini Zephyr - Voce femminile brillante, 100+ lingue, istruzioni di consegna.",
      geminiPuck:
        "Gemini Puck - Voce maschile, 100+ lingue, istruzioni di consegna.",
    },
    names: modelTranslations.names,
  },
};
