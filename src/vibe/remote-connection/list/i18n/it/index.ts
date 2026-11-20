import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Account",
  tags: {
    remoteConnection: "Connessione remota"
  },
  get: {
    title: "Collegamenti remoti",
    titleShort: "Connessioni",
    description: "Elenca tutte le connessioni remote per il tuo account",
    fields: {
      activeOnly: {
        label: "Solo attivo",
        description: "Solo restituire connessioni attive"
      }
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi"
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Devi essere connesso per visualizzare le connessioni"
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso."
      },
      server: {
        title: "Errore del server",
        description: "Non elencare le connessioni"
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun collegamento trovato"
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto"
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate"
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto"
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete"
      }
    },
    success: {
      title: "Collegamenti elencati",
      description: "Collegamenti remoti recuperati"
    }
  },
  widget: {
    title: "Collegamenti remoti",
    addButton: "Aggiungi connessione",
    emptyState: "Nessuna istanza collegata. Collega un’istanza per condividere dati e strumenti a tua scelta.",
    emptyStateCloud: "Non c'e' ancora nessun caso collegato.",
    connectedBadge: "Collegato",
    registeredBadge: "Registrato",
    selfBadge: "Il mio account",
    lastSynced: "Ultimo scambio di sincronizzazione",
    never: "Mai.",
    connectButton: "Link Impiego locale",
    connectButtonLocal: "Connettiti a Cloud",
    incomingBadge: "In arrivo",
    inactiveBadge: "Inattivo",
    inferenceProviderBadge: "Inferenza",
    transportBadge: "fuori {{out}} · in {{in}}",
    transport: {
      reverseWs: "WS",
      directHttp: "HTTP"
    },
    instanceId: "Articolo ID",
    remoteUrl: "URL remoto",
    viewButton: "Vista",
    editButton: "Modifica",
    deleteButton: "Scollegamento",
    health: {
      tunnelOpen: "Tunnel aperto",
      bridgeActive: "Collegato",
      tunnelWarning: "Tunnel che collega",
      bridgeWarning: "Sincronizzazione",
      tunnelLost: "Tunnel perso",
      bridgeFailed: "La connessione non è riuscita",
      disconnected: "Scollegato",
      reauthRequired: "Registrazione necessaria",
      incomingActive: "Attivo"
    },
    reconnectButton: {
      reauth: "Firma di nuovo",
      reconnect: "Ricollegamento",
      retry: "Recuperare",
      resync: "Resync"
    },
    cloud: {
      heroTitle: "Porta il tuo caso",
      heroSubtitle: "Eseguire next-vibe sul proprio hardware e collegarlo a questo account. Le tue chat, ricordi e competenze ti seguono. I tuoi strumenti funzionano sulla tua macchina.",
      stepsTitle: "Collegare in tre passaggi",
      step1Title: "Installare next-vibe",
      step1Body: "Open source. Funziona su un computer portatile, un server di casa o uno VPS.",
      step2Title: "Collegalo dal tuo caso",
      step2Body: "Sulla tua istanza Abbonamento aperto, quindi Cloud Sync, quindi Collegati a Cloud. Inserisci {{appUrl}} e il login di questo account. In un terminale su quella macchina:",
      step2Command: "vibe remote-connect -i",
      step3Title: "Scegli quali sincronizzazioni",
      step3Body: "Memorie, documenti, competenze, favoriti, chat. Un interruttore ciascuno, cambiato in qualsiasi momento sulla vostra istanza.",
      githubCta: "Visualizza su GitHub",
      quickstartCta: "Avvio rapido",
      trustTitle: "Che cosa può fare un'istanza collegata",
      trust1: "Agisce come te. Legge e scrive le proprie chat, ricordi e abilità. Niente da qualsiasi altro account.",
      trust2: "Gli strumenti di amministrazione rimangono bloccati. La tua istanza ottiene esattamente i diritti che il tuo account ha.",
      trust3: "AI lo gestisce invia qui fattura i vostri crediti al tasso normale: costo del fornitore più il 30%.",
      trust4: "Fino a istanze {{max}}. Scollegare uno qui sotto e il suo link si ferma subito.",
      paidTitle: "Conti solo a pagamento",
      paidBody: "Collegare la propria istanza ha bisogno di un conto pagato. Qualsiasi pacchetto di credito o abbonamento lo sblocca.",
      paidCta: "Sbloccalo.",
      alreadyHaveLocal: "Le tue istanze collegate",
      alreadyHaveLocalSub: "Ognuno agisce come questo account. Aprire uno per controllare lo stato o scollegare."
    },
    local: {
      cloudTitle: "Connettiti a Cloud",
      cloudSubtitle: "Collega questa istanza a un’istanza cloud per sincronizzare i dati selezionati ed eseguire gli strumenti locali dal cloud.",
      benefit1: "Le memorie si sincronizzano bidirezionale, automaticamente",
      benefit2: "Cloud AI scopre e gestisce i tuoi strumenti locali",
      benefit3: "Delegare le attività dal cloud a questa macchina",
      noConnectionsYet: "Niente ancora collegato",
      connectionsTitle: "Collegamenti collegati"
    },
    selfIdentity: {
      title: "Il tuo indirizzo ID",
      description: "Altre istanze vedono questo server come questo ID. Deve essere unico in tutte le istanze connesse."
    },
    syncSettings: {
      title: "Auto-Sync",
      description: "Sincronizza compiti e ricordi con tutte le istanze collegate ogni minuto",
      enabledBadge: "Attivo",
      disabledBadge: "Inattivo",
      toggleLabel: "Toggle autosync"
    }
  }
};
