import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Debug Prompt di sistema",
    titleShort: "Debug Prompt",
    description:
      "Mostra il prompt del sistema esatto che AI ottiene in un determinato contesto. cartella, abilità, thread, messaggio.",
    status: {
      loading: "Edificio...",
      done: "Fatto",
    },
    tags: {
      debug: "Debug",
    },
    fields: {
      rootFolderId: {
        label: "Cartella di radice",
        description:
          "Contesto pieghevole per simulare (privato, pubblico, incognito, cron, condiviso, remoto)",
        placeholder: "private",
        options: {
          private: "Privato",
          shared: "Condividi",
          public: "Pubblico",
          incognito: "Incognito",
          background: "Sfondo",
          remote: "Telecomando",
        },
      },
      userRole: {
        label: "Ruolo dell'utente",
        description: "ruolo utente simulato: pubblico | cliente | admin",
        placeholder: "admin",
      },
      userMessage: {
        label: "Messaggio utente",
        description:
          "Messaggio utente simulato per la ricerca di embedding cortex",
        placeholder: "Di cosa abbiamo parlato l'ultima volta?",
      },
      threadId: {
        label: "File ID",
        description: "Filo opzionale ID per contesto",
        placeholder: "uuid o lasciare vuoto",
      },
      userId: {
        label: "Utente ID",
        description:
          "L'utente opzionale ID per caricare i dati della corteccia (predefiniti da auto)",
        placeholder: "uuid o lasciare vuoto",
      },
      skillId: {
        label: "ID della skill",
        description:
          "Abilità opzionale ID per iniettare nel prompt del sistema",
        placeholder: "abilità uuid o lasciare vuoto",
      },
      subFolderId: {
        label: "Sottocartella ID",
        description: "Sottocartella opzionale UUID",
        placeholder: "uuid o lasciare vuoto",
      },
      imageGenModelSelection: {
        label: "Selezione Gen immagine",
        description:
          "Selezione del modello di immagine gen dal favorito attivo/chat UI (lasciare vuoto per usare il default dell'utente)",
        placeholder: "lasciare vuoto per impostazione utente",
      },
      musicGenModelSelection: {
        label: "Selezione musica Gen",
        description:
          "Selezione del modello di musica gen dal favorito attivo/chat UI (lasciare vuoto per usare il default dell'utente)",
        placeholder: "lasciare vuoto per impostazione utente",
      },
      videoGenModelSelection: {
        label: "Selezione video Gen",
        description:
          "Selezione del modello di video gen dal favorito attivo/chat UI (lasciare vuoto per usare il default dell'utente)",
        placeholder: "lasciare vuoto per impostazione utente",
      },
    },
    response: {
      systemPrompt: { text: "Prompt di sistema" },
      trailingSystemMessage: { text: "Contesto di trailing" },
      charCount: { text: "Skill" },
      tokenEstimate: { text: "~Tokens" },
      cortexDiagnostics: { text: "Diagnostica per Embedding Cortex" },
      messageContextLines: { text: "Linee di testo del messaggio" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Controlla i tuoi params",
      },
      network: {
        title: "Offline",
        description: "Non riesco a raggiungere il server",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Accedi per primo",
      },
      forbidden: {
        title: "Solo l'amministratore",
        description: "Richiede l'accesso di amministratore",
      },
      notFound: {
        title: "Non trovato",
        description: "Utente o risorsa non trovata",
      },
      threadNotFound: {
        title: "Filetto non trovato o non visibile a voi",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a costruire il prompt",
      },
      unknown: { title: "Errore", description: "Qualcosa è andato storto" },
      unsavedChanges: {
        title: "Non liberato",
        description: "Salvare o scartare prima",
      },
      conflict: { title: "Conflitto", description: "Stato di conflitto" },
    },
    widget: {
      emptyTitle: "Scegli un contesto",
      emptyMessage:
        "Scegliere una cartella, facoltativamente un messaggio, quindi costruire il prompt.",
      chars: "Caratteri",
      tokens: "~Tokens",
      cortexFailed:
        "Cortex embedding non è riuscito. nessun tasto API o errore del fornitore.",
      cortexNoNodes:
        "Embedding generato, ma nessun nodo cortex ha ancora incorporato le embeddings.",
      cortexPassing:
        "{{passing}} delle partite di {{total}} superano la soglia",
      noTrailing: "Non c'è un contesto per questa richiesta.",
    },
    success: {
      title: "Prompt Costruito",
      description: "Avvio del sistema reso con successo",
    },
  },
};
