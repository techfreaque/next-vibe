import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Deps",
  titleShort: "Deps",
  description:
    "Analizzatore di dipendenza all-in-one. --mode=boundaries mostra ogni importazione di un pacchetto fa in codice app (le mosse da fissare prima dell'estrazione). --mode=layers flags illegal cross-package direction. --mode=shared-candidates ranks app primitives --mode=layers flags linked cross-package direction.",
  category: "Strumenti di sviluppo",
  tag: "analisi",

  mode: {
    report: "Relazione",
    files: "File",
    categories: "Categorie",
    unused: "Inutilizzato",
    boundaries: "Mazzi di fiori",
    layers: "Livelli",
    sharedCandidates: "Candidati condivisi",
    importers: "Importatori",
    needsMove: "Necessità di movimento",
    unusedSymbols: "Simboli inutilizzati",
    unusedI18n: "Le chiavi i18n non utilizzate",
    crossDomain: "Croce-Dominio",
    pageViolations: "Pagina Violazioni",
  },

  container: {
    title: "Analisi della dipendenza",
    description:
      "Configurare la portata e la modalità della scansione di dipendenza",
  },

  fields: {
    focus: {
      label: "Sentiero di messa a fuoco",
      description:
        "Limitare a un file o una directory specifici (ad esempio 'agent/ai-stream' o 'user'). Lasciare vuoto per analizzare la base di codice completo.",
      placeholder: "ad esempio, agente/ai-stream o utente",
    },
    mode: {
      label: "Modalità",
      description:
        "file: per-file import grafo. categorie: arrotolato da dir di alto livello non utilizzato: file senza importatori. confini: pacchetto importazioni in codice app. strati: illegale cross-package direction. condiviso-candidates: app primitives i pacchetti dipendono da. importatori: importatori di un file per pacchetto (needs --focus).",
    },
    package: {
      label: "Pacchetto",
      description:
        "Limiti/strati a un unico pacchetto dichiarato (ad esempio vibe-ui, vibe-unified-ui). Lasciare vuoto per tutti i pacchetti.",
      placeholder: "ad esempio, vibra-unified-ui",
    },
    depth: {
      label: "Profondità",
      description:
        "Quanti livelli di dipendenze transitive da includere (default: 1, diretto solo). 0 = illimitato.",
    },
    limit: {
      label: "Limite",
      description: "Numero massimo di voci da restituire (default: 100).",
    },
  },

  response: {
    success: "Analisi della dipendenza completa",
    entries: {
      title: "Voci di dipendenza",
      emptyState: {
        description: "Nessun file corrisponde al filtro indicato.",
      },
      importedBy: "importato da",
    },
    summary: {
      title: "Riepilogo",
      totalFiles: "File totali scannerizzati",
      totalEdges: "Totale Importa Bordi",
      unusedCount: "Esportazioni non utilizzate",
    },
    boundaries: {
      title: "Pacchetti",
      cleanState:
        "Nessuna violazione di confine. I pacchetti sono autocontenuti.",
      legendTitle: "La leggenda",
      legendOut: "out-of-package (il pacchetto raggiunge il codice app)",
      legendCross: "cross-package (dipendenza illegale)",
      legendReverse:
        "inversione di direzione (più basso livello importazioni più alto)",
      legendHot: "bersaglio caldo (10+ importatori. più forte tirare in core)",
      colTarget: "Obiettivo",
      colCount: "usi",
      colKind: "tipo",
      packageHeader: "pacchetto",
      violationsAcross: "violazioni attraverso",
      packagesWord: "pacchetti",
    },
    layers: {
      title: "Direzione del livello",
      cleanState:
        "La direzione e' pulita. Nessuna importazione illegale di imballaggi incrociati.",
      edge: "Importazioni",
    },
    sharedCandidates: {
      title: "Candidati condivisi",
      description:
        "File di codice dell'app importati da pacchetti, ordinati per numero di pacchetto-importer. Alto = tirare in vibe-core.",
      colCount: "pkg usi",
      colPath: "sentiero",
      emptyState: "Nessun file app viene importato dal codice del pacchetto.",
    },
    importers: {
      title: "Importatori per Pacchetto",
      colCount: "usi",
      colGroup: "pacchetto / categoria",
    },
    needsMove: {
      title: "Elenco dei movimenti",
      description:
        "File non ancora nella loro posizione finale, raggruppati per area di destinazione. I file whitelist (già posizionati) sono silenziosi. Leggere in alto in basso. questo è l'ordine di movimento.",
      colTarget: "→ area",
      colPath: "file",
      emptyState: "Tutto in ambito è posto. Non c'e' niente da spostare.",
      relocate: "rilocalizzazione",
      reorganize: "Regia",
    },
    unusedSymbols: {
      title: "Superficie pubblica inutilizzata",
      description:
        "Esportazioni morte, metodi statici non utilizzati e file senza importatori. Segnali basati su regex da rivedere. conservatore (può perdere usi dinamici).",
      colKind: "tipo",
      colSymbol: "simbolo simbolo",
      colPath: "file",
      emptyState:
        "Nessuna superficie pubblica non utilizzata trovata nell'ambito.",
      wholeFile: "(tutto il file. nessun importatore)",
    },
    unusedI18n: {
      title: "Le chiavi i18n non utilizzate",
      description:
        "Chiavi in ambito en traduzioni che nessun riferimento di file sorgente. I prefissi modello come t(`a.b.<x>`) proteggono il loro subtreo. Eliminare da en, de e pl insieme.",
      colKey: "chiave",
      colPath: "file",
      emptyState:
        "Ogni chiave di traduzione in ambito di applicazione è riferito.",
    },
    pageViolations: {
      title: "Pagina Violazioni dell'architettura",
      description:
        "file page.tsx che importano più di repository/definition/i18n/page-client. Le pagine devono essere sottili conchiglie SSR. logica aziendale, UI, enums e db di accesso appartengono a repository.ts o page-client.tsx.",
      colCount: "violazioni",
      colPath: "pagina",
      emptyState:
        "Tutti i file page.tsx rispettano il confine di architettura.",
    },
    crossDomain: {
      title: "I candidati al cross-Domain",
      description:
        "Importazioni che attraversano un confine di dominio e sono NOT un framework consentito primitivo. Ognuno è un candidato per promuovere in atmosfera (motore/core) o decouple. La maggior parte si e' avvicinata prima. I bordi primitivi consentiti sono alti separatamente, non nascosti.",
      colCount: "usi",
      colTarget: "obiettivo raggiunto",
      emptyState:
        "Nessun bordo cross-domain non visualizzato. Tutto il passaggio è consentito.",
      allowedTally: "consentiti bordi primitivi (non elencati)",
    },
    violations: {
      title: "Violazioni",
      outOfPackage: "Fuori dal pacchetto",
      crossPackage: "Pacchetto trasversale",
      reverseDirection: "Direzione inverso",
      total: "Totale",
    },
  },

  errors: {
    validation: {
      title: "Parametri non validi",
      description: "I parametri di analisi della dipendenza non sono validi",
    },
    internal: {
      title: "Errore interno",
      description:
        "Si è verificato un errore interno durante l'analisi della dipendenza",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Non hai il permesso di eseguire l'analisi della dipendenza",
    },
    forbidden: {
      title: "Accesso negato",
      description: "L'accesso all'analisi della dipendenza è vietato",
    },
    notFound: {
      title: "Non trovato",
      description:
        "Il percorso di messa a fuoco specificato non è stato trovato",
    },
    focusNotFound:
      "Nessun file corrisponde al percorso di messa a fuoco {{focus}}",
    server: {
      title: "Errore del server",
      description:
        "L'errore del server si è verificato durante l'analisi della dipendenza",
    },
    unknown: {
      title: "Errore sconosciuto",
      description:
        "Un errore sconosciuto si è verificato durante l'analisi della dipendenza",
    },
    unsaved: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    conflict: {
      title: "Conflitto",
      description:
        "Un conflitto si è verificato durante l'analisi della dipendenza",
    },
  },

  success: {
    title: "Analisi completa",
    description: "Analisi della dipendenza completata con successo",
  },
};
