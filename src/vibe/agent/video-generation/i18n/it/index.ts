import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    video: "Video",
    generation: "Generazione",
    ai: "IA",
  },
  post: {
    title: "Generare video",
    titleShort: "Generare video",
    dynamicTitle: "Video: {{prompt}}",
    description:
      'Generare un video da un prompt dei testi. Utilizzare lo strumento dei modelli (modelType =video) per vedere tutti i modelli video con le loro capacità: supportedDurations (valida clip lunghezze in secondi), supportedAspectRatios, supportedFrameImages (first_frame / last_frame = supporto immagine-video). Passare frameReferences per guidare il video: il ruolo "primo" indica la cornice di apertura e il ruolo "ultimo" pin il frame di chiusura. sia MUST essere URL immagine (solo sui modelli con supporto last_frame); ruolo "riferimento" (o nessun ruolo) alimenta un\'immagine guida, audio o video asset. Passare negativePrompt sui modelli che lo supportano. Restituisce videoUrl.',
    form: {
      title: "Generazione di video",
      description: "Inserire un prompt per generare un video",
    },
    prompt: {
      label: "Prompt",
      description: "Descrivi il video che vuoi generare",
      placeholder:
        "Un colpo cinematografico di un lago di montagna al tramonto...",
    },
    model: {
      label: "Modello",
      description:
        "Video model id. Lascia vuoto per impostazione utente. Utilizzare lo strumento dei modelli (modelType =video) per sfogliare i modelli e le loro capacità.",
    },
    duration: {
      label: "Durata",
      description: "Lunghezza della clip video generata",
      short: "Breve (~5s)",
      medium: "Mezzo (~10s)",
      long: "Lungo (~15s)",
    },
    aspectRatio: {
      label: "Aspect Ratio",
      description: "Rapporto di aspetto video in uscita",
    },
    resolution: {
      label: "Risoluzione",
      description: "Risoluzione video in uscita",
    },
    frameReferences: {
      label: "Referenze dei frame",
      description:
        "Attività di riferimento che guidano il video. Ogni voce è { url, ruolo }. ruolo 'primo' pin l'esatta cornice di apertura e il ruolo 'ultimo' pin la cornice di chiusura esatta (needs last_frame supporto). i telai di bookend sono IMAGES ONLY# Quindi, entrambi # MUST essere URL di immagine. ruolo 'referenza' (o nessun ruolo) è un asset guida che può essere un'immagine, audio o video URL; il suo tipo è auto-determinato dal URL (.mp4/.webm/.mov come video, file audio come audio, tutto il resto come immagine). Una prima o un'immagine di riferimento passa il server al modello più economico, quando necessario.",
      placeholder: "https://example.com/first-frame.jpg",
    },
    negativePrompt: {
      label: "Prompt negativo",
      description:
        "Cosa escludere dal video. Solo inviato a modelli che accettano negative_prompt o negativePrompt. ignorato altrimenti.",
      placeholder: "sfocato, di bassa qualità, distorto...",
    },

    download: "Scarica",
    generatingNote: "La generazione di video può richiedere 1-3 minuti",
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      text: "Generare video",
      label: "Generare video",
      loadingText: "Generando...",
    },
    response: {
      videoUrl: "Video generato URL",
      creditCost: "Crediti utilizzati",
      durationSeconds: "Durata in pochi secondi",
      jobId: "Lavoro asincastro ID",
    },
    errors: {
      referenceUnavailable:
        "L'immagine di ingresso non è disponibile. E 'stato cancellato, o appartiene a una chat che non si può aprire. Utilizzare un'immagine da questa chat o caricarlo di nuovo.",
      validation_failed: {
        title: "Errore di convalida",
        description: "Controllare il prompt e le impostazioni",
      },
      network_error: {
        title: "Errore di rete",
        description:
          "Non è riuscito a connettersi al servizio di generazione video",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Registrati per generare video",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di usare questa funzione",
      },
      not_found: {
        title: "Non trovato",
        description: "Il modello richiesto non è stato trovato",
      },
      server_error: {
        title: "Errore del server",
        description:
          "Un errore inaspettato si è verificato durante la generazione di video",
      },
      unknown_error: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsaved_changes: {
        title: "Modifiche non salvate",
        description: "Si prega di salvare le modifiche prima di generare",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante la generazione di video",
      },
      notAVideoModel:
        "Il modello selezionato non supporta la generazione video. Seleziona un modello video.",
      notConfigured:
        "{{label}} non è configurato. Aggiungi {{envKey}} al tuo file.env. Ottieni la tua chiave a {{url}}",
      providerUnsupported: "{{label}} non è ancora supportato",
      modelUnavailable:
        "Questo modello è temporaneamente non disponibile. Scegli un altro modello.",
      insufficientCredits:
        "Crediti insufficienti. Saldo: {{balance}}, minimo richiesto: {{minimum}}.",
      balanceCheckFailed: "Non è riuscito a controllare il saldo di credito",
      unsupportedDuration:
        "Il modello {{model}} non supporta la durata {{duration}}. Durata supportata: {{supported}}",
      unsupportedAspectRatio:
        "Il modello {{model}} non supporta il rapporto di aspetto {{aspectRatio}}. Rapporti supportati: {{supported}}",
      unsupportedResolution:
        "Il modello {{model}} non supporta la risoluzione {{resolution}}. Risoluzione supportata: {{supported}}",
      generationFailed: "La generazione video non è riuscita: {{error}}",
      providerError: "Errore del fornitore di video: {{error}}",
      noVideoUrl: "Nessun video URL restituito dal fornitore",
      generationFailedUnknown:
        "La generazione di video è fallita e il fornitore non ha dato ragione",
      providerErrorUnknown:
        "Il fornitore di video non è riuscito senza un messaggio di errore",
      nonJsonResponse:
        "Il fornitore di video ha restituito una risposta non JSON (HTTP {{status}}): {{body}}",
      providerHttpError:
        "Il fornitore di video ha restituito HTTP {{status}}: {{body}}",
      jobFailedStatus: "Il lavoro video si è concluso con lo stato: {{status}}",
      requestAborted: "La generazione di video è stata abortita",
      requestTimedOut: "Timed out in attesa di generazione video",
      contentRejected:
        "Rifiutato dal filtro contenuti del fornitore video: {{error}}. Questo è un rifiuto, non un'estrazione. Rimozione del prompt o scegliere un modello meno filtrato. Non sei stato accusato.",
      providerOutage:
        "Il fornitore di video è scaricato o sovraccaricato in questo momento: {{error}}. E' un'estrazione, non un rifiuto. Riprova tra un minuto o scegli un altro modello. Non sei stato accusato.",
      consentRequired:
        "Il fornitore di video desidera una conferma del consenso per i volti reali nell'ingresso: {{error}}. Utilizzare un'immagine senza la faccia di una persona reale, o scegliere un altro modello video. Non sei stato accusato.",
      storageFailed:
        "Il video è stato generato ma non poteva essere salvato. Non sei stato accusato. Riprova.",
      creditsFailed:
        "Non è riuscito a dedurre i crediti per la generazione video",
      inputMediaRequired:
        "Questo modello richiede un'immagine di input URL. Incolla un link di immagine per animarlo.",
      imageInputUnsupported:
        "Il modello video {{model}} ha respinto l'immagine di input - probabilmente non supporta l'immagine-to-video. Ripristina generate_video WITHOUT il parametro del modello (il modello predefinito anima le immagini), o rilascia l'immagine.",
      noImageCapableModel:
        "Nessun modello video qui prende un'immagine di riferimento. Getta l'immagine per generare dal prompt da solo.",
    },
    success: {
      title: "Video Generato",
      description: "Il tuo video è stato generato con successo",
    },
  },
};
