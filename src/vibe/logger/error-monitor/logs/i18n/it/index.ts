import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/it";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ...analyticsTranslations,
  category: "Sistema",

  errors: {
    repositoryInternalError: "Si è verificato un errore interno",
    fetchErrorLogs: "Non riuscito a recuperare i log di errore: {{error}}",
    updateErrorLog:
      "Non è possibile aggiornare lo stato del registro di errore: {{error}}",
    missingTarget: "Passare le impronte o id.",
    idNotUnique:
      "Id prefix {{id}} corrisponde alle righe {{count}}. Usa l'impronta digitale o l'id completo.",
  },

  statusFilter: {
    all: "Tutti",
    active: "Irrisolte",
    resolved: "Risolto",
  },
  levelFilter: {
    all: "Tutti i livelli",
    error: "Errori",
    warn: "Avvisi",
  },
  sourceFilter: {
    all: "Tutte le fonti",
    client: "Browser",
    server: "Server",
  },
  trendSplit: {
    newVsRecurring: "Nuovi vs ricorrenti",
    level: "Livello",
    source: "Fonte",
  },
  sort: {
    windowOccurrences: "Più occorrenze nel periodo",
    lastSeen: "Visti di recente",
    firstSeen: "Più recenti",
    totalOccurrences: "Più occorrenze in totale",
  },

  get: {
    title: "Log di errore",
    titleShort: "Log di errore",
    description:
      "Classi di errore con il numero esatto di irrisolti, occorrenze nel tempo, principali colpevoli e utenti colpiti. Filtra per periodo, stato, livello, fonte, endpoint o testo; risolvi con un clic.",
    tags: {
      monitoring: "Monitoraggio",
    },
    fields: {
      group: {
        label: "Raggruppa simili",
        description:
          "Una riga per messaggio: le varianti su route diverse contano insieme",
      },
      status: {
        label: "Stato",
        description: "Filtra per stato risolto",
      },
      search: {
        label: "Cerca errori",
        description: "Cerca messaggi, impronte o ID di log",
        placeholder: "Cerca messaggi, impronte o ID di log",
      },
      errorType: {
        label: "Tipo di errore",
        description: "Filtra per classificazione di tipo di errore",
        placeholder: "ad es. INTERNAL_ERROR",
      },
      level: {
        label: "Livello",
        description: "Errori o avvisi",
      },
      source: {
        label: "Fonte",
        description: "Generato nel browser (client log) o sul server",
      },
      endpoint: {
        label: "Endpoint o route",
        description:
          "Il percorso endpoint, l'alias o la route della pagina contiene questo testo",
        placeholder: "es. payment/providers",
      },
      fingerprint: {
        label: "Fingerprint",
        description: "Mostra una sola classe di errore",
        placeholder: "Fingerprint",
      },
      split: {
        label: "Suddivisione grafico",
        description: "Come il grafico delle occorrenze impila",
      },
      sort: {
        label: "Ordinamento",
        description: "Ordine della lista",
      },
      limit: {
        label: "Limite",
        description: "Numero di risultati da restituire",
        placeholder: "50",
      },
      offset: {
        label: "Offset",
        description: "Numero di risultati per saltare",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "Voci di registro degli errori",
      },
      totalCount: {
        title: "Totale conteggio",
      },
      hasMore: {
        title: "Ha di più",
      },
      unresolvedCount: {
        title: "Contatore irrisolto",
      },
      window: {
        title: "Periodo",
      },
      kpis: {
        title: "Numeri chiave",
      },
      trend: {
        title: "Occorrenze nel tempo",
      },
      byEndpoint: {
        title: "Per endpoint",
      },
      historySince: {
        title: "Storico dal",
      },
    },
    success: {
      title: "Log recuperati",
      description: "log di errore recuperati con successo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun registro trovato",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      server: {
        title: "Errore del server",
        description: "Non riuscito a recuperare i log di errore",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsavedChanges: {
        titleChanges: "Modifiche non salvate",
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
    },
  },

  patch: {
    title: "Aggiorna il registro degli errori",
    titleShort: "Aggiorna il log",
    description:
      "Risolvere o riaprire un registro di errore con le impronte digitali",
    tags: {
      monitoring: "Monitoraggio",
    },
    fields: {
      similarTo: {
        label: "Stesso messaggio di",
        description:
          "Risolvi o riapri ogni classe con lo stesso messaggio di questo fingerprint",
      },
      fingerprints: {
        label: "Fingerprint",
        description:
          "Più fingerprint insieme (risoluzione o riapertura in blocco, max 200)",
      },
      fingerprint: {
        label: "Impronte per la stampa",
        description:
          "L'impronta del registro di errore (colonna `fingerprint` nella lista). Passa questo o id.",
        placeholder: "Inserire l'impronta digitale",
      },
      id: {
        label: "Log ID",
        description:
          "Il file id dalla lista (full uuid o i suoi primi 8+ caratteri). Utilizzare invece di impronte digitali.",
        placeholder: "ad es. c21bd4c7",
      },
      resolved: {
        label: "Risolto",
        description: "Impostare a vero per risolvere, falso da riaprire",
      },
    },
    response: {
      fingerprint: {
        title: "Impronte per la stampa",
      },
      resolved: {
        title: "Risolto",
      },
      affectedRows: {
        title: "Righe colpite",
      },
    },
    success: {
      title: "Aggiornamento del registro",
      description: "Stato del registro di errore aggiornato con successo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato",
      },
      notFound: {
        title: "Non trovato",
        description: "Tronchi di errore non trovati",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      server: {
        title: "Errore del server",
        description:
          "Non è stato possibile aggiornare il registro degli errori",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsavedChanges: {
        titleChanges: "Modifiche non salvate",
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
    },
  },

  post: {
    title: "Eseguire la scansione del monitoraggio degli errori",
    description:
      "Scansione di messaggi di chat e log backend per i modelli di errore",
    tags: {
      monitoring: "Monitoraggio",
    },
    response: {
      errorsFound: "Errori trovati",
      threadsScanned: "Filetti analizzati",
      scanWindowFrom: "Finestra di scansione da",
      scanWindowTo: "Scansione della finestra",
      patterns: "Modelli di errore",
    },
    success: {
      title: "Scansione completa",
      description: "Controllo di errore completato con successo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      server: {
        title: "Errore del server",
        description:
          "Non è possibile eseguire la scansione del monitor di errore",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
    },
  },

  errorMonitor: {
    name: "Monitor di errore",
    description: "Scansioni per modelli di errore ogni 3 ore",
  },

  widget: {
    kpi: {
      unresolvedMessages: "{{messages}} messaggi · {{occurrences}} occorrenze",
      unresolvedMatching: "{{count}} irrisolte corrispondono ai filtri",
      unresolved: "Classi irrisolte (totale)",
      unresolvedHint: "{{occurrences}} occorrenze in totale",
      unresolvedOutside: "{{count}} non viste in questo periodo",
      occurrences: "Occorrenze",
      newClasses: "Nuove classi",
      activeClasses: "Classi colpite",
      affectedUsers: "Utenti colpiti",
      affectedLeads: "Visitatori colpiti",
    },
    chart: {
      noEndpoint: "Nessun endpoint registrato",
      emptyFiltered:
        "Nessuna occorrenza corrisponde ai filtri in questo periodo.",
      trendTitle: "Occorrenze",
      trendSubtitle: "Clicca una barra per restringere il periodo",
      endpointTitle: "Dove si rompe",
      endpointSubtitle:
        "Endpoint e route per occorrenze. Clicca una riga per filtrare.",
      endpoint: "Endpoint / route",
      occurrences: "Occorrenze",
      classes: "Classi",
      unresolved: "Aperte",
      historyNote:
        "Storico giornaliero dal {{date}}. Le occorrenze precedenti contano solo nei totali.",
      historyNone:
        "Nessuno storico giornaliero ancora. I totali per classe restano esatti.",
    },
    series: {
      new: "Nuovi",
      recurring: "Ricorrenti",
      error: "Errori",
      warn: "Avvisi",
      client: "Browser",
      server: "Server",
    },
    list: {
      viewGroup: "Vedi {{count}}",
      noSession: "Nessun contesto di sessione",
      cliAct:
        "azione: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliStatus: "Stato: {{status}}",
      groupSize: "{{count}} classi",
      resolveGroup: "Risolvi tutte ({{count}})",
      reopenGroup: "Riapri tutte ({{count}})",
      groupHint: "Raggruppato per messaggio",
      subtitleGrouped: "{{count}} messaggi visti in questo periodo",
      bulkResolveOf: "Risolvi {{shown}} di {{total}} corrispondenti",
      cliGroup:
        '{{count}} classi. Elenca: vibe error-logs --group=false --search="{{search}}" · Tutte: vibe update-error-log --similarTo={{fingerprint}} --resolved=true',
      allClear: "Niente di aperto corrisponde a questi filtri.",
      allClearHint: "Rimuovi i filtri per vedere il resto.",
      similar: "+{{count}} simili",
      cliFilters:
        "Filtri (i valori sono le chiavi enum mostrate): --range=analytics.range.last7Days --status=statusFilter.all --level=levelFilter.error --source=sourceFilter.server --endpoint=<testo> --search=<testo>. In blocco: vibe update-error-log --fingerprints=<a>,<b> --resolved=true",
      more: "+{{count}} altri",
      doneResolved: "Risolta: {{label}}",
      doneReopened: "Riaperta: {{label}}",
      doneResolvedMany: "{{count}} classi risolte",
      doneReopenedMany: "{{count}} classi riaperte",
      undo: "Annulla",
      dismiss: "Chiudi",
      bulkResolve: "Risolvi tutte le {{count}} mostrate",
      bulkConfirm: "Conferma: risolvi {{count}}",
      cliHits: "{{period}} nel periodo / {{total}} in totale",
      resolveFailed: "Non salvato. Riprova.",
      cliResolve:
        "Azione: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliHint:
        "Risolvi: vibe update-error-log --fingerprint=<fingerprint> --resolved=true. Dettaglio: --fingerprint=<fingerprint>. Pagina successiva: --offset={{next}}",
      title: "Classi di errore",
      subtitle: "{{count}} viste in questo periodo",
      hitsPeriod: "{{count}} nel periodo",
      hitsTotal: "{{count}} in totale",
      users: "Utenti {{count}}",
      leads: "Visitatori {{count}}",
      firstSeen: "prima {{date}}",
      lastSeen: "ultima {{date}}",
      open: "Dettagli",
      close: "Nascondi",
      focus: "Solo questa",
      affected: "Utenti colpiti",
      affectedLeads: "Visitatori colpiti",
      resolving: "Salvataggio...",
    },
    filter: {
      fingerprint: "Classe",
      endpoint: "Endpoint",
      search: "Cerca",
      errorType: "Tipo",
      status: "Stato",
      level: "Livello",
      source: "Fonte",
    },
    emptyFiltered:
      "Nessun gruppo corrisponde ai filtri. Rimuovi un filtro e riprova.",
    emptyActive:
      "Nessun gruppo di errori attivo. Seleziona Tutti per vedere gli errori risolti.",
    severity: {
      error: "Errore",
      warning: "Avvertenza",
    },
    title: "Log di errore",
    loading: "Caricamento dei registri...",
    empty: "Nessun registro di errore trovato",
    header: {
      refresh: "Aggiorna",
      runScan: "Esegui la scansione",
      back: "Indietro",
      activeCount: "Totale aperti: {{count}}",
    },
    col: {
      message: "Messaggio",
      errorType: "Tipo di errore",
      occurrences: "Occurrence",
      firstSeen: "Primo Segreto",
      createdAt: "Ultimo accesso",
    },
    status: {
      active: "Irrisolte",
      resolved: "Risolto",
    },
    action: {
      confirm: "Salva stato",
      clear: "Cancella filtri",
      resolve: "Risolvere",
      reopen: "Riaprire",
    },
    detail: {
      context: "Contesto dell’errore",
      stackTrace: "Traccia di stack",
      metadata: "Metadati",
      collapse: "Colpo",
      resolved: "Risolto",
    },
    source: {
      client: "Browser",
      server: "Server",
    },
    pagination: {
      matches: "Gruppi corrispondenti: {{count}}",
      info: "Pagina {{page}} di {{totalPages}} (totale {{total}})",
      prev: "Precedente",
      next: "Avanti",
    },
  },
};
