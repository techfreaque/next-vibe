import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/it";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Account",
  tags: {
    remoteConnection: "Connessione remota",
  },
  enums: {
    fleetStatus: {
      all: "Tutte",
      unhealthy: "Con problemi",
      critical: "Critica",
      warning: "Avviso",
      disconnected: "Disconnessa",
      healthy: "Sana",
    },
  },
  fleet: {
    title: "Stato delle connessioni",
    subtitle:
      "Ogni istanza collegata a questo server, tutti i proprietari. Letto dallo stato salvato. Nessun ping.",
    kpi: {
      total: "Connessioni",
      healthy: "Sane",
      unhealthy: "Con problemi",
      disconnected: "Disconnesse",
      totalHint: "{{active}} attive, {{inactive}} inattive",
      healthyHint: "Sincronizzate, nessun problema",
      unhealthyHint: "{{critical}} critiche · {{warning}} avvisi",
      disconnectedHint: "Inattive, nessun guasto",
    },
    status: {
      healthy: "Sana",
      warning: "Avviso",
      critical: "Critica",
      disconnected: "Disconnessa",
    },
    issue: {
      reauthRequired: "Inattiva: il peer rifiuta l'accesso salvato",
      inactive: "Inattiva",
      accessDenied: "Accesso negato dall'ultimo contatto",
      disconnectedAt: "Disconnessione registrata {{at}}",
      noToken: "Nessun token, le chiamate non si autenticano",
      neverSynced: "Mai sincronizzata, collegata {{at}}",
      staleSync: "È passato troppo tempo dall’ultima sincronizzazione",
      transportDrift:
        "Ultima chiamata via {{used}}, configurato {{configured}}",
      transportMismatch: "I due lati non concordano sul trasporto",
      mismatch:
        "{{sender}} invia {{sent}}, {{receiver}} si aspetta {{expected}}",
      denial: "{{action}} da noi {{at}}: {{reason}}",
      peerToolsStale: "Il peer ha una copia vecchia dei nostri strumenti",
    },
    table: {
      instance: "Connessione",
      trustTools: "Permessi e strumenti",
      title: "Connessioni",
      subtitle: "Prima i problemi, poi il contatto più recente.",
      empty: "Nessuna connessione in questo stato.",
      emptyAll: "Nessuna istanza è collegata a questo server.",
      count: "{{shown}} di {{total}}",
    },
    direction: {
      incoming: "Collegata dal peer",
      outgoing: "Collegata da noi",
      mine: "Tua",
    },
    trust: {
      standard: "Standard: diritti cliente, AI sul peer",
      tools: "{{count}} strumenti",
      peerBuild: "Build del peer {{version}}",
      noBuild: "Nessuna build segnalata",
      syncsAll: "Sincronizza tutto",
      syncsNone: "Non sincronizza nulla",
      syncsAllBut: "Sincronizza tutto tranne {{missing}}",
      syncsOnly: "Sincronizza solo {{list}}",
      admin: "Agisce come admin",
      noTools: "Nessuno strumento del peer salvato",
      loopHere: "AI qui",
    },
    meta: {
      out: "Noi → peer",
      in: "Peer → noi",
      lastCall: "La nostra ultima chiamata",
      none: "ancora nessuna",
      capabilities: "Capacità",
      owner: "Proprietario",
      trust: "Permessi",
    },
    lastCallNone: "ancora nessuna chiamata in uscita",
    earlier: "Prima: {{text}}",
    yours: "tua",
    otherEnd: "altro capo {{peer}}",
    lastCall: "la nostra ultima chiamata {{used}}",
    transportPair: "noi → peer {{out}} · peer → noi {{in}}",
    transport: {
      reverseWs: "WS",
      directHttp: "HTTP",
    },
    detail: {
      lastContact: "Ultimo contatto",
      lastSynced: "Ultima sincronizzazione",
      socket: "Socket aperto da",
      socketNone: "Nessun socket",
      lastUsed: "Ultima chiamata",
      lastUsedValue: "{{transport}}, {{at}}",
      outMode: "Raggiungiamo il peer via",
      inMode: "Il peer ci raggiunge via",
      capabilities: "Strumenti del peer",
      capabilitiesValue: "{{count}} strumenti · {{version}}",
      ourTools: "I nostri strumenti sul peer",
      ourToolsCurrent: "{{sent}} (aggiornati)",
      ourToolsStale: "{{sent}}, quella attuale è {{current}}",
      inference: "Provider di inferenza",
      forced: "Provider di sistema forzato",
      syncScope: "Sincronizza",
      loop: "Il loop AI gira su",
      loopTarget: "Il peer",
      loopCaller: "Questo server",
      created: "Collegata",
      remoteUrl: "URL del peer",
      owner: "Proprietario",
      yes: "Sì",
      no: "No",
      none: "Niente",
      unknown: "Sconosciuto",
      openOwner: "Apri proprietario",
      openDetail: "Impostazioni della tua connessione",
      showDetails: "Dettagli",
      hideDetails: "Nascondi",
    },
    scope: {
      memories: "Memorie",
      documents: "Documenti",
      skills: "Skill",
      favorites: "Preferiti",
      threads: "Chat",
    },
    never: "Mai",
    audit: {
      title: "Registro di audit",
      subtitle: "Registrazioni, disconnessioni e rifiuti su questo server.",
      events: "Eventi di audit",
      failures: "Rifiutati o limitati",
      trend: "Eventi nel tempo",
      byReason: "Per azione e motivo",
      reason: "Azione e motivo",
      count: "Eventi",
      recent: "Ultimi eventi",
      empty: "Nessun evento di audit in questo periodo.",
      openRecent: "Apri",
    },
    action: {
      registered: "Registrata",
      reregistered: "Registrata di nuovo",
      disconnected: "Disconnessa",
      denied: "Rifiutata",
      rate_limited: "Limitata",
    },
    cli: {
      counts:
        "{{total}} connessioni: {{healthy}} sane, {{unhealthy}} con problemi, {{disconnected}} disconnesse",
      attention: "Da controllare",
      ok: "Sane",
      none: "Nessuna",
      audit:
        "Audit {{period}}: {{events}} eventi, {{failures}} rifiutati o limitati",
      lastContact: "ultimo contatto {{at}}",
    },
  },
  get: {
    title: "Collegamenti remoti",
    titleShort: "Connessioni",
    description:
      "Le tue istanze collegate. Gli admin vedono anche lo stato di ogni connessione su questo server.",
    fields: {
      activeOnly: {
        label: "Solo attivo",
        description: "Solo restituire connessioni attive",
      },
      fleetStatus: {
        label: "Stato",
        description: "Mostra solo le connessioni in questo stato",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Devi essere connesso per visualizzare le connessioni",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso.",
      },
      server: {
        title: "Errore del server",
        description: "Non elencare le connessioni",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun collegamento trovato",
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
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
    },
    success: {
      title: "Collegamenti elencati",
      description: "Collegamenti remoti recuperati",
    },
  },
  widget: {
    loading: "Caricamento delle connessioni…",
    refresh: "Aggiorna connessioni",
    back: "Indietro",
    socketSince: "WebSocket aperto dal",
    transportLabel: "Transport",
    viewConnection: "Apri la connessione {{instance}}",
    pickConnection: "Scegli",
    title: "Collegamenti remoti",
    addButton: "Aggiungi connessione",
    emptyState:
      "Nessuna istanza collegata. Collega un’istanza per condividere dati e strumenti a tua scelta.",
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
      unknown: "Sconosciuto",
      reverseWs: "WS",
      directHttp: "HTTP",
    },
    instanceId: "Articolo ID",
    remoteUrl: "URL remoto",
    viewButton: "Vista",
    editButton: "Modifica",
    deleteButton: "Scollegamento",
    // ── Health status labels ───────────────────────────────────────────────────
    health: {
      socketOpen: "WebSocket aperto",
      noSyncRecorded: "Nessuna sincronizzazione registrata",
      syncRecorded: "Sincronizzazione registrata",
      tunnelOpen: "Tunnel aperto",
      bridgeActive: "Collegato",
      tunnelWarning: "Tunnel che collega",
      bridgeWarning: "Sincronizzazione",
      tunnelLost: "Tunnel perso",
      bridgeFailed: "La connessione non è riuscita",
      disconnected: "Scollegato",
      reauthRequired: "Registrazione necessaria",
      incomingActive: "Attivo",
    },
    // ── Reconnect button labels ────────────────────────────────────────────────
    reconnectButton: {
      reauth: "Firma di nuovo",
      reconnect: "Ricollegamento",
      retry: "Recuperare",
      resync: "Resync",
    },
    // Cloud marketing panel
    cloud: {
      heroTitle: "Porta il tuo caso",
      heroSubtitle:
        "Eseguire next-vibe sul proprio hardware e collegarlo a questo account. Le tue chat, ricordi e competenze ti seguono. I tuoi strumenti funzionano sulla tua macchina.",
      stepsTitle: "Collegare in tre passaggi",
      step1Title: "Installare next-vibe",
      step1Body:
        "Open source. Funziona su un computer portatile, un server di casa o uno VPS.",
      step2Title: "Collegalo dal tuo caso",
      step2Body:
        "Sulla tua istanza Abbonamento aperto, quindi Cloud Sync, quindi Collegati a Cloud. Inserisci {{appUrl}} e il login di questo account. In un terminale su quella macchina:",
      step2Command: "vibe remote-connect -i",
      step3Title: "Scegli quali sincronizzazioni",
      step3Body:
        "Memorie, documenti, competenze, favoriti, chat. Un interruttore ciascuno, cambiato in qualsiasi momento sulla vostra istanza.",
      githubCta: "Visualizza su GitHub",
      quickstartCta: "Avvio rapido",
      trustTitle: "Che cosa può fare un'istanza collegata",
      trust1:
        "Agisce come te. Legge e scrive le proprie chat, ricordi e abilità. Niente da qualsiasi altro account.",
      trust2:
        "Gli strumenti di amministrazione rimangono bloccati. La tua istanza ottiene esattamente i diritti che il tuo account ha.",
      trust3:
        "AI lo gestisce invia qui fattura i vostri crediti al tasso normale: costo del fornitore più il 30%.",
      trust4:
        "Fino a istanze {{max}}. Scollegare uno qui sotto e il suo link si ferma subito.",
      paidTitle: "Conti solo a pagamento",
      paidBody:
        "Collegare la propria istanza ha bisogno di un conto pagato. Qualsiasi pacchetto di credito o abbonamento lo sblocca.",
      paidCta: "Sbloccalo.",
      alreadyHaveLocal: "Le tue istanze collegate",
      alreadyHaveLocalSub:
        "Ognuno agisce come questo account. Aprire uno per controllare lo stato o scollegare.",
    },
    // Local panel
    local: {
      cloudTitle: "Connettiti a Cloud",
      cloudSubtitle:
        "Collega questa istanza a un’istanza cloud per sincronizzare i dati selezionati ed eseguire gli strumenti locali dal cloud.",
      benefit1: "Le memorie si sincronizzano bidirezionale, automaticamente",
      benefit2: "Cloud AI scopre e gestisce i tuoi strumenti locali",
      benefit3: "Delegare le attività dal cloud a questa macchina",
      noConnectionsYet: "Niente ancora collegato",
      connectionsTitle: "Collegamenti collegati",
    },
    // Self-identity
    selfIdentity: {
      title: "Il tuo indirizzo ID",
      description:
        "Altre istanze vedono questo server come questo ID. Deve essere unico in tutte le istanze connesse.",
    },
    // Sync settings (admin only)
    syncSettings: {
      title: "Auto-Sync",
      description:
        "Sincronizza compiti e ricordi con tutte le istanze collegate ogni minuto",
      enabledBadge: "Attivo",
      disabledBadge: "Inattivo",
      toggleLabel: "Toggle autosync",
    },
  },
};
