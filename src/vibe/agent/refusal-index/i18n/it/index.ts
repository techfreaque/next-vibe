import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Indice di rifrazione",
  tags: {
    refusalIndex: "Indice di rifrazione",
  },

  enums: {
    content: {
      mainstream: "Mainstream",
      open: "Aperto",
      uncensored: "Senza censura",
    },
    runStatus: {
      running: "Esecuzione",
      completed: "Completo",
      failed: "Sfigato",
      cancelled: "Annullamento",
    },
    verdict: {
      answered: "Rispondi",
      hedged: "Siepe",
      refused: "Rifiuti",
      error: "Errore",
    },
  },

  errors: {
    validation: {
      title: "Errore di convalida",
      description: "La richiesta è invalida",
    },
    network: {
      title: "Errore di rete",
      description: "La connessione non è riuscita",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accesso all'amministratore richiesto",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Accesso all'amministratore richiesto",
    },
    notFound: { title: "Non trovato", description: "Nulla trovato" },
    server: {
      title: "Errore del server",
      description: "La richiesta di Refusal Index non è riuscita",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    conflict: { title: "Conflitto", description: "I dati sono in conflitto" },
  },
  success: {
    title: "Fatto",
    description: "Richiesta Refusal Index completata",
  },

  messages: {
    judgeUnparseable:
      "Il modello del giudice non ha restituito nessun verdetto utilizzabile.",
    dryRunStatus: "Corsa a secco",
    slugTaken: "Esiste già una domanda con la slug ' {{slug}}'.",
    questionNotFound: "Domanda non trovata.",
    questionInUse:
      "Questa domanda ha risultati in passato. Disattivalo invece di cancellarlo.",
    runNotFound: "Corri non trovato.",
    runAlreadyActive:
      "Eseguire {{id}} è già in corso. Riprendi o aspetta che finisca.",
    resultNotFound: "Risultato non trovato.",
    errorNotPublishable:
      "I risultati degli errori non possono essere pubblicati come campioni.",
    unknownQuestions: "Sconosciuto domanda slugs: {{slugs}}.",
    unknownModels: "Modelli sconosciuti o non-benchmarked: {{ids}}.",
    noQuestions:
      "Nessuna domanda attiva. Aggiungere le domande prima (rifusale-index-questions) - il set di domanda è gestito da amministratori.",
    noModels: "Nessun modello comparabile corrisponde al filtro.",
    dryRun:
      "Simulazione: nessuna richiesta inviata. Limite di spesa per un’esecuzione effettiva: {{budget}} crediti.",
    dryRunResume:
      "Corsa asciutta: mostrare ciò che il curriculum sarebbe ancora elaborare.",
    started: "E' iniziata la corsa. Continua sullo sfondo.",
    resumed: "Correte ripresi. Continua sullo sfondo.",
    finishedWaiting: "E' finita. Situazione finale sopra.",
    generationFailed:
      "Il generatore di domande non ha restituito nulla utilizzabile ({{error}}).",
    nothingPending: "Niente da fare: ogni coppia ha già una risposta.",
  },

  fields: {
    limit: { label: "Limite", description: "Remi massime da restituire" },
    offset: { label: "Offset", description: "Righe per saltare" },
    back: { label: "Indietro" },
  },

  questions: {
    fields: {
      id: { label: "Domanda ID", description: "ID della domanda" },
      slug: {
        label: "Slug",
        description: "Breve id unico, minuscolo-con-dashes",
      },
      category: {
        label: "Categoria",
        description:
          "Gruppo di forma libera, ad esempio 'medicina' - le categorie sono dati",
      },
      textEn: {
        label: "Domanda (inglese)",
        description: "Il prompt esatto inviato ad ogni modello",
      },
      textDe: {
        label: "Domanda (tedesco)",
        description:
          "Traduzione da mostrare negli esempi pubblici (facoltativa)",
      },
      textPl: {
        label: "Domanda (Polish)",
        description:
          "Traduzione da mostrare negli esempi pubblici (facoltativa)",
      },
      textFr: {
        label: "Domanda (francese)",
        description:
          "Traduzione da mostrare negli esempi pubblici (facoltativa)",
      },
      textIt: {
        label: "Domanda (italiano)",
        description:
          "Traduzione da mostrare negli esempi pubblici (facoltativa)",
      },
      textEs: {
        label: "Domanda (spagnolo)",
        description:
          "Traduzione da mostrare negli esempi pubblici (facoltativa)",
      },
      textSk: {
        label: "Domanda (slovacco)",
        description:
          "Traduzione da mostrare negli esempi pubblici (facoltativa)",
      },
      generatedBy: { label: "Proposta da" },
      active: {
        label: "Attivo",
        description: "Solo le domande attive vengono utilizzate in nuove piste",
      },
    },
    widget: {
      add: "Aggiungi domanda",
      loading: "Caricamento delle domande...",
      active: "Attivo",
      inactive: "Inattivo",
      generated: "Generazione",
      empty: {
        title: "Nessuna domanda",
        hint: "L'indice misura come i modelli rispondono alla domanda YOUR. Aggiungi domande prima della prima corsa.",
        cta: "Aggiungi la prima domanda",
      },
    },
    get: {
      title: "Domande sull'indice Refusal",
      titleShort: "Domande",
      description:
        "Il set di domande a cura dell'amministratore inviato ad ogni modello. Aggiungi domande qui prima della prima corsa.",
      fields: {
        status: {
          label: "Stato",
          description: "Filtra per stato attivo",
          all: "Tutti",
          active: "Attivo",
          inactive: "Inattivo",
        },
        category: {
          label: "Categoria",
          description: "Solo domande in questa categoria",
        },
      },
    },
    post: {
      title: "Aggiungi domanda di indice Refusal",
      titleShort: "Aggiungi una domanda",
      description: "Aggiungi una domanda al set di benchmark",
      submit: "Aggiungi domanda",
      submitting: "Aggiunta...",
      response: { id: "Domanda ID" },
    },
    patch: {
      title: "Modificare l'Indice Refusal Question",
      titleShort: "Modifica della domanda",
      description: "Modifica o (de)attivazione di una domanda",
      submit: "Salva",
      submitting: "Salvare...",
      clearHint: "Lasciare vuoto per cancellare la traduzione",
    },
    delete: {
      title: "Eliminare la domanda di indice Refusal",
      titleShort: "Eliminare la domanda",
      description:
        "Eliminare una domanda che non è mai stata utilizzata in un run (le usate: disattivare)",
      submit: "Eliminare la domanda",
      submitting: "Deleting...",
      response: { deleted: "Cancellato" },
    },
  },

  runs: {
    fields: {
      id: { label: "Correre ID", description: "ID della corsa" },
      status: { label: "Stato" },
      startedAt: { label: "Iniziato" },
      finishedAt: { label: "Finito" },
      modelCount: { label: "Modelli" },
      questionCount: { label: "Domande" },
      pairCount: { label: "Coppie per rispondere" },
      questionsRequested: { label: "Nuove domande richieste" },
      questionsGenerated: { label: "Nuove domande aggiunte" },
      resultCount: { label: "Risultati" },
      totalCost: { label: "Crediti spesi" },
      budgetCredits: { label: "Limite di spesa" },
      judgeModelId: { label: "Modello del giudice" },
      judgePromptVersion: { label: "Giudizio" },
      cancelReason: { label: "Smettere di ragionare" },
      notes: { label: "Osservazioni" },
    },
    widget: {
      start: "Avviare la corsa",
      manageQuestions: "Gestione delle domande",
      resume: "Ripresa",
      newQuestions: "{{generated}} / {{requested}} nuove domande",
      open: "Risultati",
      results: "risultati",
      credits: "crediti",
      noQuestions: {
        title: "Aggiungere le domande prima",
        hint: "Un run ha bisogno di almeno una domanda attiva. Aggiungili nella lista delle domande.",
      },
      empty: {
        title: "Non funziona ancora",
        hint: "Avviare un'esecuzione, o abilitare l'attività cron settimanale (disattivata per impostazione predefinita).",
      },
    },
    get: {
      title: "Indice Refusal Runs",
      titleShort: "Corri",
      description: "Benchmark corre, il primo nuovo",
      response: {
        activeQuestionCount: "Domande attive",
        benchmarkModelCount: "Modelli con marchio di qualità",
      },
    },
  },

  start: {
    title: "Avviare l'indice Refusal",
    titleShort: "Inizia a correre",
    description:
      "Aggiungi nuove domande da un generatore non censurato, poi fai ogni modello ogni domanda che non ha ancora risposto e giudica la risposta. Le risposte sono mantenute: niente viene chiesto due volte. E' stato recuperato dal budget e recuperabile.",
    submit: "Inizio",
    submitting: "Cominciare...",
    cron: {
      name: "Indice dei rifiuti (settimanale)",
      description:
        "Ogni settimana aggiunge 10 domande e raccoglie le risposte mancanti, incluse quelle dei nuovi modelli. È disattivato per impostazione predefinita.",
    },
    fields: {
      models: {
        label: "Modelli",
        description:
          "Ids modello separato da Comma (vuoto = tutti i modelli attuali)",
      },
      questions: {
        label: "Domande",
        description: "Slitte di domanda separate (vuoto = tutto attivo)",
      },
      newQuestions: {
        label: "Nuove domande",
        description:
          "Domande che il generatore non censura aggiunge prima del riempimento (0-30)",
      },
      budgetCredits: {
        label: "Limite di spesa (crediti)",
        description:
          "La corsa si ferma in modo pulito (status cancellato) quando questo è raggiunto",
      },
      concurrency: {
        label: "Convalida",
        description: "Telefona parallela (default 4, max 16)",
      },
      dryRun: {
        label: "Corsa a secco",
        description: "Piano e preventivo solo, non inviare nulla",
      },
      resumeRunId: {
        label: "Riprendere la corsa",
        description: "Continuare le coppie mancanti di una prima corsa",
      },
      wait: {
        label: "Aspetta.",
        description: "Tenere la richiesta fino alle finiture di esecuzione",
      },
      notes: {
        label: "Osservazioni",
        description: "Nota di testo gratuito per questa corsa",
      },
    },
    response: {
      runId: "Correre ID",
      status: "Stato",
      dryRun: "Corsa a secco",
      modelCount: "Modelli",
      questionCount: "Domande",
      newQuestionCount: "Nuove domande",
      pendingPairs: "Coppie da elaborare",
      estimatedCredits: "Crediti stimati",
      note: "Nota",
    },
  },

  runDetail: {
    title: "Correre l'indice Refusal",
    titleShort: "Corri!",
    description:
      "Uno corre con i suoi risultati. Filtra per modello, categoria o verdetto; approva i campioni pubblici.",
    fields: {
      model: { label: "Modello", description: "Filtra per modello id" },
      category: { label: "Categoria", description: "Filtra per categoria" },
      verdict: {
        label: "Il verdetto",
        description: "Filtra per verdetto",
        all: "Tutti",
      },
      modelId: { label: "Modello ID" },
      modelName: { label: "Modello" },
      tier: { label: "Tiro" },
      questionSlug: { label: "Domanda" },
      categoryCol: { label: "Categoria" },
      questionText: { label: "Prompt" },
      verdictCol: { label: "Il verdetto" },
      judgeReason: { label: "Giudizio" },
      answerExcerpt: { label: "Risposta" },
      latencyMs: { label: "Latenza (ms)" },
      cost: { label: "Crediti" },
      sampleVisible: { label: "Esempio pubblico" },
    },
    widget: {
      loading: "Caricamento in corso...",
      empty: "Nessun risultato corrisponde a questi filtri.",
      credits: "crediti",
      approve: "Pubblica campione",
      hide: "Nascondi il campione",
    },
  },

  samples: {
    title: "Esempio di Indice Refusal Approve",
    titleShort: "Esempio",
    description:
      "Pubblicare (o nascondere) un risultato come risposta campione pubblico. Niente è pubblico senza approvazione.",
    submit: "Applicare",
    submitting: "Applicare...",
    fields: {
      resultId: {
        label: "Risultato ID",
        description: "Il risultato della pubblicazione",
      },
      visible: {
        label: "Visibile",
        description: "On = pubblico sulla pagina del modello, off = nascosto",
      },
    },
    response: { visible: "Visibile" },
  },

  leaderboard: {
    title: "Leadership dell'indice di rifusso",
    titleShort: "Indice di rifrazione",
    description:
      "Quante volte ogni modello AI risponde, siepi o rifiuta. Aggiornato settimanale con nuove domande.",
    response: { overall: "Complessivamente" },
  },

  model: {
    title: "Modello Stats Refusal",
    titleShort: "Modello Stats",
    description:
      "Il rifiuto, la copertura e la risposta di un modello su tutte le domande attuali, oltre alle risposte del campione approvate.",
    fields: {
      modelId: {
        label: "Modello",
        description: "Modello id o URL slug",
      },
    },
    widget: {
      subtitle: "Benchmark dei rifiuti, prova attuale",
      noDataTitle: "Ancora nessuna risposta valutata",
      noDataMessage:
        "Questo modello non è ancora nella prova attuale. I suoi tassi compariranno dopo la prossima prova che lo include.",
      notRanked: "Non in classifica",
      rankValue: "{{rank}}° su {{total}}",
      trendValue: "{{delta}} punti rispetto all'ultima prova",
      noTrend: "Nessuna prova precedente",
      breakdown: "Per categoria",
      samples: "Risposte di esempio",
      samplesEmpty: "Ancora nessuna risposta di esempio approvata.",
      loadError: "Impossibile caricare le statistiche",
      rank: "Posizione",
      trend: "Andamento dei rifiuti",
      lookup: "Mostra statistiche",
      judge: "Valutazione",
      categories: {
        politics: "Politica",
        history: "Storia",
        health: "Salute",
        drugs: "Droghe",
        sexuality: "Sessualità",
        security: "Sicurezza informatica",
        religion: "Religione",
        law: "Diritto",
        science: "Scienza",
        fiction: "Narrativa",
        satire: "Satira",
      },
    },
  },

  public: {
    fields: {
      judged: { label: "Risposte giudicate" },
      answeredPct: { label: "Risponde %" },
      hedgedPct: { label: "Situazione in %" },
      refusedPct: { label: "Rifiuti %" },
      category: { label: "Categoria" },
      hasData: { label: "Ha dati" },
      runFinishedAt: { label: "Ultimo aggiornamento" },
      modelCount: { label: "Modelli" },
      questionCount: { label: "Domande" },
      judgeModelId: { label: "Modello del giudice ID" },
      judgeModelName: { label: "Modello del giudice" },
      judgePromptVersion: { label: "Versione del prompt dei giudici" },
      modelId: { label: "Modello ID" },
      name: { label: "Nome" },
      tier: { label: "Tiro" },
      trend: { label: "Evoluzione del rifiuto (punti)" },
      rank: { label: "Rank (1 = pochi rifiuti)" },
      rankedModels: { label: "Modelli casuali" },
      question: { label: "Domanda" },
      verdict: { label: "Il verdetto" },
      answer: { label: "Risposta" },
      judgeReason: { label: "Giudizio" },
    },
  },
};
