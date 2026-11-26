import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Account",
  tags: {
    remoteConnection: "Connessione remota",
  },
  widget: {
    loading: "Caricamento della connessione…",
    title: "Connessione remota",
    signInDescription: "Accedi per configurare la connessione remota",
    back: "Indietro",
    // ── Status section ─────────────────────────────────────────────────────
    statusSection: "Stato",
    connected: {
      title: "Collegato",
      badge: "Attivo",
      connectedTo: "URL remoto",
      transport: "Trasporti (outbound)",
      remoteTransport: "Il loro trasporto",
      remoteInstance: "Esempio remoto",
      capabilities: "Versione delle capacità",
      lastSynced: "Ultimo scambio di sincronizzazione",
      wsConnected: "Collegato da allora",
      refresh: "Aggiorna",
      transportReverseWs: "Reverse WS (tunnel)",
      transportDirectHttp: "HTTP diretto",
    },
    notConnected: {
      title: "Non collegato",
      description:
        "Connettiti a un account cloud (ad esempio unbottled.ai) per sincronizzare i ricordi e chiamare gli strumenti AI dal tuo terminale - da qualsiasi luogo.",
      benefit1:
        "Le memorie si sincronizzano automaticamente tra questo dispositivo e il tuo account cloud",
      benefit2: "Eseguire gli strumenti AI dalla riga di comando con",
      benefit2Code: "vibe --remote",
      benefit3: "Soggiorno locale e cloud in sincronizzazione",
    },
    // ── Behavior section ───────────────────────────────────────────────────
    behaviorSection: "Comportamento",
    // ── Sync section ───────────────────────────────────────────────────────
    syncSection: "Sincronizzazione e accesso",
    syncScope: {
      memories: "Memoria",
      documents: "Documenti",
      skills: "Skill",
      favorites: "Preferiti",
      threads: "Conversazioni",
    },
    // ── Cross-references ───────────────────────────────────────────────────
    cortexSection: "Cortex",
    cortexDescription:
      "Sfoglia il file system condiviso per questa connessione.",
    cortexLink: "Aprire Cortex",
    sshSection: "SSH & Terminal",
    sshDescription:
      "Configurazioni e sessioni terminali SSH tramite questa connessione.",
    sshLink: "Collegamenti SSH aperti",
    // ── Connection state banner ────────────────────────────────────────────
    state: {
      noSyncRecorded: "Nessuna sincronizzazione registrata",
      syncRecorded: "Sincronizzazione registrata",
      tunnelActive: "WebSocket aperto",
      bridgeActive: "Collegato",
      degraded: "Collegamento degradato",
      connectionLost: "Connessione persa",
      inactive: "Inattivo",
      connectedSince: "Da allora",
      initialSync: "Traduzione:",
    },
    // ── Actions ────────────────────────────────────────────────────────────
    reauthButton: "Re-authenticate",
    renameButton: "Rinomina",
    editButton: "Modifica",
    reconnectButton: "Ricollegamento",
    disconnectButton: "Scollegamento",
    disconnectConfirmTitle: "Scollegare questa istanza?",
    disconnectConfirmDescription:
      "La connessione verrà rimossa. Puoi riconnetterti in qualsiasi momento.",
    disconnectConfirmCancel: "Annulla",
    disconnectConfirmProceed: "Scollegamento",
    // ── Edit section titles ────────────────────────────────────────────────
    edit: {
      identitySection: "Nome",
      reauthSection: "Re-authenticate",
      transportSection: "Transport",
      behaviorSection: "Comportamento",
    },
  },
  get: {
    title: "Stato di connessione remota",
    titleShort: "Connessione",
    description:
      "Stato e impostazioni complete per una specifica connessione remota",
    instanceId: {
      label: "Collegamento",
      description: "L'istanza di connessione per visualizzare",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description:
          "Devi essere connesso per visualizzare la connessione remota",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di vedere questo",
      },
      notFound: {
        title: "Non collegato",
        description: "Nessuna connessione remota trovata per questo caso",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante il recupero della connessione",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
    success: {
      title: "Collegamento recuperato",
      description: "Stato di connessione remota recuperato con successo",
    },
  },
  patch: {
    title: "Aggiornare la connessione remota",
    titleShort: "Aggiornamento della connessione",
    description:
      "Rinominare, riattivare o configurare le impostazioni di trasporto e sincronizzazione",
    // ── Rename ──────────────────────────────────────────────────────────────
    newInstanceId: {
      label: "Nuovo nome",
      description:
        "Rinominare questa connessione. Aggiorna l'etichetta locale e si sincronizza con il telecomando.",
    },
    // ── Reauth ──────────────────────────────────────────────────────────────
    email: {
      label: "Email",
      description: "L'e-mail del tuo account sull'istanza remota",
    },
    password: {
      label: "Password",
      description: "La password del tuo account sull'istanza remota",
    },
    // ── Transport ────────────────────────────────────────────────────────────
    transportMode: {
      label: "Modalità di trasporto",
      description:
        "Come comunica questa connessione. Invertimenti: persistente in uscita WS (apre immediatamente su salva). direct-http: chiamate dirette HTTP.",
      options: {
        reverseWs: "Reverse WS",
        directHttp: "HTTP diretto",
      },
    },
    remoteTransportMode: {
      label: "La loro modalità di trasporto",
      description:
        "Come il peer raggiunge questo lato. inversa-ws: abbiamo un connettore in uscita per ricevere i loro invii. direct-http: POST nostro ponte.",
    },
    // ── Behavior ────────────────────────────────────────────────────────────
    isInferenceProvider: {
      label: "Fornitore di inferenza",
      description:
        "Consentire a questa connessione di servire l'inferenza AI. istanza remota esegue il loop LLM sul rovescio- WS.",
    },
    forceSystemProvider: {
      label: "Fornitore di sistema di forza",
      description:
        "Interruzione di amministrazione: route ALL AI streams attraverso questa connessione, bypassando i costi e le regole di routing per utente. Una connessione alla volta.",
    },
    threadMirrorMode: {
      label: "Specchio di filo",
      description:
        "Se i filetti si sincronizzano tra questa istanza e quella collegata. 'entrambi' specchia i fili in entrambe le direzioni; 'off' mantiene ogni thread dove è stato creato.",
      options: {
        both: "Specchio entrambe le direzioni",
        off: "Non specchiare",
      },
    },
    loopLocation: {
      label: "Loop Location",
      description:
        "Se viene eseguito un loop AI di un thread remoto, 'target' lo esegue sull'istanza collegata (default); 'caller' mantiene il loop qui mentre gli strumenti vengono eseguiti in remoto.",
      options: {
        target: "Sull'istanza collegata",
        caller: "Su questo caso",
      },
    },
    // ── Sync scope ──────────────────────────────────────────────────────────
    syncScope: {
      label: "Sync Scope",
      description:
        "Quali fornitori di dati si sincronizzano su questa connessione: ricordi, documenti, competenze, favoriti, fili.",
      memories: "Memoria",
      documents: "Documenti",
      skills: "Skill",
      favorites: "Preferiti",
      threads: "Conversazioni",
    },
    reconnectNow: {
      label: "Ricollegati ora",
      description:
        "Chiudere e riaprire la connessione, attivando la sincronizzazione pull-on-connect.",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      network: {
        title: "Errore di rete",
        description: "Non è riuscito a connettersi",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Il ruolo di amministratore richiesto per questo campo",
      },
      notFound: {
        title: "Non trovato",
        description: "Connessione non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Non è stato possibile aggiornare la connessione",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
    success: {
      title: "Collegamento Aggiornato",
      description: "Impostazioni salvate con successo",
    },
  },
  delete: {
    title: "Scollegamento",
    titleShort: "Scollegamento",
    description:
      "Rimuovere questa connessione remota e chiudere il canale WebSocket",
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      network: {
        title: "Errore di rete",
        description: "Non è riuscito a connettersi",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso.",
      },
      notFound: {
        title: "Non trovato",
        description: "Connessione non trovata",
      },
      server: { title: "Errore del server", description: "Non si disconnette" },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
    success: {
      title: "Scollegato",
      description: "Collegamento remoto rimosso con successo",
    },
  },
};
