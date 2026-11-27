import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    studio: "Media Studio",
    history: "Cronologia",
  },
  get: {
    title: "Le tue creazioni",
    titleShort: "Creazioni",
    description:
      "Immagini, video, musica, voci e trascrizioni create nello Studio, in chat o tramite API. Prima le più recenti.",
    fields: {
      kind: {
        label: "Tipo",
        description:
          "image, video, music, speech o transcribe. Lascia vuoto per vedere tutto.",
      },
      cursor: {
        label: "Cursore di pagina",
        description:
          "Lascia vuoto per i risultati più recenti. Per continuare, passa il nextCursor della pagina precedente.",
      },
    },
    response: {
      items: "Creazioni",
      id: "ID",
      kind: "Tipo",
      title: "Prompt",
      createdAt: "Creato il",
      status: "Stato",
      url: "File",
      transcript: "Trascrizione",
      credits: "Crediti",
      model: "Modello",
      settings: "Impostazioni",
      source: "Creato in",
      threadId: "Chat",
      rootFolderId: "Cartella",
      nextCursor: "Cursore della pagina successiva",
    },
    success: {
      title: "Cronologia caricata",
      description: "Ecco le tue creazioni.",
    },
    errors: {
      validation: {
        title: "Filtro non valido",
        description: "Controlla tipo e pagina, poi riprova.",
      },
      unauthorized: {
        title: "Accesso non effettuato",
        description: "Accedi per vedere le tue creazioni.",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Puoi vedere solo le tue creazioni.",
      },
      notFound: {
        title: "Niente qui",
        description: "Nessuna creazione corrisponde al filtro.",
      },
      server: {
        title: "Cronologia non disponibile",
        description: "Impossibile caricare la cronologia. Riprova tra poco.",
      },
      network: {
        title: "Connessione persa",
        description: "Controlla la connessione e riprova.",
      },
      unknown: {
        title: "Qualcosa è andato storto",
        description: "Impossibile caricare la cronologia. Riprova.",
      },
      conflict: {
        title: "Cronologia cambiata",
        description: "Ricarica per vedere gli ultimi risultati.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Prima salva o scarta le modifiche.",
      },
    },
  },
  widget: {
    title: "Le tue creazioni",
    titles: {
      image: "Le tue immagini",
      video: "I tuoi video",
      music: "I tuoi brani",
      speech: "Le tue voci",
      transcribe: "Le tue trascrizioni",
    },
    count: "{{count}} in totale",
    error: "Impossibile caricare la cronologia.",
    retry: "Aggiorna",
    loadMore: "Mostra altri",
    loadingMore: "Caricamento",
    loadMoreFailed: "Impossibile caricare altri risultati.",
    endOfList: "Non c'è altro.",
    emptyTitle: "Ancora niente",
    emptyHint: "Ogni risultato finisce qui, pronto da scaricare.",
    emptyKindHint: "Il tuo primo risultato compare qui appena è pronto.",
    runAgain: "Rigenera",
    download: "Scarica",
    copyPrompt: "Copia prompt",
    copied: "Copiato",
    copyFailed: "Copia bloccata",
    openInChat: "Apri in chat",
    continueInChat: "Continua in chat",
    chatPrompt: "Ecco cosa ho creato: {{url}}\n\nPrompt: {{prompt}}",
    open: "Apri a dimensione piena",
    credits: "{{amount}} crediti",
    source: {
      studio: "dallo Studio",
      chat: "dalla chat",
      api: "tramite API",
    },
    status: {
      queued: "In coda",
      running: "Generazione in corso",
      saving: "Salvataggio file",
      completed: "Pronto",
      failed: "Non riuscito",
    },
    pendingHint: "Video e musica possono richiedere qualche minuto.",
    kinds: {
      image: "Immagine",
      video: "Video",
      music: "Musica",
      speech: "Voce",
      transcribe: "Trascrizione",
    },
  },
};
