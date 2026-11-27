import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    threads: "Conversazioni",
  },
  enums: {
    threadStatus: {
      active: "Attivo",
      archived: "Archivio",
      deleted: "Cancellato",
    },
  },
  errors: {
    count_failed:
      "Non è riuscito a ottenere il conteggio di conversazione: {{error}}",
  },
  get: {
    title: "Conversazioni",
    titleShort: "Conversazioni",
    description:
      "Recuperare un elenco impaginato di filetti di chat con opzioni di filtraggio",
    container: {
      title: "Elenco dei file",
      description: "Sfoglia e filtra i filetti di chat",
    },
    sections: {
      pagination: {
        title: "Pagina",
        description: "Impostazioni di navigazione pagina",
      },
      filters: {
        title: "Filtri",
        description: "Filtrare i fili per criteri",
      },
    },
    page: {
      label: "Pagina",
      description: "Numero di pagina per recuperare",
    },
    limit: {
      label: "Limite",
      description: "Numero di filetti per pagina",
    },
    rootFolderId: {
      label: "Cartella di radice",
      description:
        "Filtra per cartella radice (privato, condiviso, pubblico, incognito)",
    },
    subFolderId: {
      label: "Sottocartella",
      description: "Filtro per sottocartella ID (opzionale)",
    },
    status: {
      label: "Stato",
      description: "Filtra per lo stato del thread",
    },
    search: {
      label: "Cerca",
      description: "Ricerca di filetti per titolo o contenuto",
      placeholder: "Ricerca di filetti...",
    },
    isPinned: {
      label: "Solo perno",
      description: "Filtro per mostrare solo filetti pinned",
    },
    dateFrom: {
      label: "Data da",
      description: "Filtro filetti creati dopo questa data",
    },
    dateTo: {
      label: "Data di",
      description: "Filtro filetti creati prima di questa data",
    },
    response: {
      title: "Risposta dell'elenco dei file",
      description: "Elenco dei filetti",
      threads: {
        thread: {
          title: "File",
          id: {
            content: "File ID",
          },
          threadTitle: {
            content: "Titolo",
          },
          rootFolderId: {
            content: "Cartella di radice",
          },
          folderId: {
            content: "Sottocartella ID",
          },
          status: {
            content: "Stato",
          },
          preview: {
            content: "Anteprima",
          },
          pinned: {
            content: "Pining",
          },
          archived: {
            content: "Archivio",
          },
          streamingState: {
            content: "Stato di streaming",
          },
          createdAt: {
            content: "Creato a",
          },
          updatedAt: {
            content: "Aggiornato At",
          },
          canEdit: {
            content: "Può Modificare",
          },
          canPost: {
            content: "Posta",
          },
          canModerate: {
            content: "Può moderatore",
          },
          canDelete: {
            content: "Può cancellare",
          },
          canManagePermissions: {
            content: "Può gestire le autorizzazioni",
          },
        },
      },
      totalCount: {
        content: "Totale conteggio",
      },
      pageCount: {
        content: "Conteggio",
      },
      page: {
        content: "Pagina corrente",
      },
      limit: {
        content: "Articoli per pagina",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per visualizzare i filetti",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare i filetti",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun thread trovato",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
        detail: "Errore del server: {{error}}",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
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
      title: "Operazione riuscita",
      description: "Filetti recuperati con successo",
    },
  },
  post: {
    title: "Nuova conversazione",
    titleShort: "Nuova conversazione",
    description: "Creare un nuovo thread di chat",
    form: {
      title: "Crea file",
      description: "Configurare nuove impostazioni di thread",
    },
    sections: {
      thread: {
        title: "Dettagli del filetto",
        description: "Informazioni di base sul thread",
      },
    },
    id: {
      label: "File ID",
      description: "Filo generato dal cliente ID",
    },
    threadTitle: {
      label: "Titolo",
      description: "Titolo del filetto",
      placeholder: "Inserire il titolo thread...",
      default: "Nuova chat",
    },
    rootFolderId: {
      label: "Cartella di radice",
      description: "cartella radice (privato, condiviso, pubblico, incognito)",
    },
    subFolderId: {
      label: "Sottocartella",
      description: "Sottocartella per inserire il filo in (opzionale)",
    },
    defaultModel: {
      label: "Modello predefinito",
      description: "Modello predefinito AI per questo thread",
    },
    defaultTone: {
      label: "Abilità predefinita",
      description: "Abilità predefinita per questo thread",
    },
    systemPrompt: {
      label: "Prompt di sistema",
      description: "Avviso di sistema personalizzato per questo thread",
      placeholder: "Inserire il prompt del sistema...",
    },
    response: {
      title: "Filetto creato",
      description: "Nuovi dettagli filettati creati",
      thread: {
        title: "File",
        id: {
          content: "File ID",
        },
        threadTitle: {
          content: "Titolo",
        },
        rootFolderId: {
          content: "Cartella di radice",
        },
        subFolderId: {
          content: "Sottocartella ID",
        },
        status: {
          content: "Stato",
        },
        createdAt: {
          content: "Creato a",
        },
        updatedAt: {
          content: "Aggiornato At",
        },
        canEdit: {
          content: "Può Modificare",
        },
        canPost: {
          content: "Posta",
        },
        canModerate: {
          content: "Può moderatore",
        },
        canDelete: {
          content: "Può cancellare",
        },
        canManagePermissions: {
          content: "Può gestire le autorizzazioni",
        },
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Dati filettati non validi forniti",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per creare filetti",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di creare fili",
        incognitoNotAllowed:
          "I filetti incisivi non possono essere creati sul server",
        cannotCreateHere:
          "Non è possibile creare un thread in questa posizione",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
        folderNotFound: "Cartella non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
        detail: "Errore del server: {{error}}",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
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
        description: "Un filo con questo nome esiste già",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Thread creato con successo",
    },
  },
  widget: {
    common: {
      noChatsFound: "Nessuna chat trovata",
      delete: "Elimina",
      cancel: "Annulla",
    },
    actions: {
      menu: "Azioni di filo",
      rename: "Rinomina",
      unpin: "Rimuovi dall’alto",
      pin: "Fissa in alto",
      unarchive: "Ripristina dall’archivio",
      archive: "Archivia",
      manageSharing: "Gestisci condivisione",
      moveToFolder: "Sposta nella cartella",
      unfiled: "Non filtrato",
    },
    folderList: {
      managePermissions: "Gestisci autorizzazioni",
      today: "Oggi",
      lastWeek: "Ultimi 7 giorni",
      lastMonth: "Ultimi 30 giorni",
      older: "Meno recenti",
    },
    threadList: {
      deleteDialog: {
        title: "Elimina conversazione",
        description:
          "Vuoi eliminare «{{title}}»? Tutti i messaggi della conversazione verranno eliminati definitivamente.",
      },
    },
    suggestedPrompts: {
      starters: {
        explain: {
          label: "Spiegalo semplicemente",
          prompt:
            "Spiega come funziona l'inflazione come se avessi 12 anni. Corto e concreto.",
        },
        search: {
          label: "Cerca nel web",
          prompt:
            "Quali sono state le più grandi storie di tecnologia questa settimana? Cerca e dammi delle fonti.",
        },
        image: {
          label: "Fare un'immagine",
          prompt:
            "Generare un'immagine di una cabina accogliente in una tempesta di neve di notte, luce calda nelle finestre.",
        },
        honest: {
          label: "Ottieni l'onesta presa",
          prompt:
            "Dammi il caso più forte per e contro cripto. Niente copertura, niente disclaimer.",
        },
      },
      backgroundTitle: "I tuoi agenti AI stanno lavorando",
      backgroundDescription:
        "I sub-agenti e gli agenti di sfondo autonomi svolgono compiti qui mentre si concentra altrove. I risultati cadono automaticamente.",
    },
    emptyState: {
      changeCompanion: "Cambia compagno o modello. Ora: {{name}}",
      folder: {
        private: { label: "Privato", note: "Sincronizzato al tuo account." },
        incognito: {
          label: "Incognito",
          note: "Solo in questo browser. Mai sincronizzato.",
        },
        shared: {
          label: "Condividi",
          note: "Chiunque con il link può leggere.",
        },
        public: { label: "Pubblico", note: "Visibile a tutti." },
        cron: { label: "Sfondo", note: "Gli agenti lavorano qui da soli." },
        remote: {
          label: "Remoto",
          note: "Funziona sulla tua istanza collegata.",
        },
      },
      remoteSidebar: {
        title: "Nessuna istanza collegata",
        description:
          "Collega una tua istanza next-vibe per sincronizzare e gestire qui le sue conversazioni.",
        cta: "Collega un'istanza",
      },
      use: {
        everyday: {
          good: "Ricerca, scrittura e attività quotidiane",
          weak: "Lo gioca al sicuro sulla politica",
        },
        politics: {
          good: "Risposte eterogenee su argomenti politici e tabù",
          weak: "Testo solo, meno tagliente su compiti complessi",
        },
        security: {
          good: "Lavori di sicurezza offensivi e difensivi",
          weak: "Lo gioca al sicuro sulla politica",
        },
        writing: {
          good: "Scrittura accurata, codice e analisi",
          weak: "Siepi o rifiuti su argomenti fittizi",
        },
        images: {
          good: "Legge screenshot, foto e video",
          weak: "Attenta agli argomenti di edgy",
        },
        classic: {
          good: "Affidabile tuttofare per il codice e la pianificazione",
          weak: "Attenta agli argomenti di edgy",
        },
        bold: {
          good: "Blunt, risposte opinioni",
          weak: "Non la scelta per la politica",
        },
        general: {
          good: "Questioni generali",
          weak: "Non la scelta per la politica",
        },
      },
      mode: {
        autoModel: "Selezionato automaticamente",
        goodAt: "Bene a:",
        weakAt: "Debole a:",
      },
      spotlight: {
        adultsOnly: "18+",
        title: "Scegli come funziona {{name}}.",
        subtitle:
          "Ogni modalità usa un modello diverso. Oppure scrivi e inizia.",
        now: "Modalità attuale: {{mode}}",
        runsOn: "Gira su",
        allModes: "Tutte le modalità",
        addMode: {
          title: "Aggiungi una modalità",
          subtitle: "Scegli un modello qualsiasi e rendilo tuo.",
          dialogTitle: "Nuova modalità per {{name}}",
          dialogDescription:
            "{{name}} resta, il modello lo scegli tu. Salvala una volta e passaci quando vuoi.",
          personalSummary: "La tua modalità, basata su {{mode}}.",
        },
        fix: {
          politics: "Politica? Passa a {{mode}}",
          complex: "Compito complesso? Passa a {{mode}}",
        },
      },
      single: {
        title: "Parlare con {{name}}.",
        action: "Passare a {{companion}} per più modalità",
      },
      companion: {
        title: "Chi dovrebbe rispondere?",
        subtitle:
          "Ogni compagno ha la sua personalità e un insieme di modelli per lavori diversi.",
        skip: "O semplicemente digitare per iniziare senza un compagno.",
        skipModel: "O solo digitare. {{model}} risponde, nessuna persona.",
        about: {
          thea: "Caldo e premuroso. Parla tutto.",
          hermes: "Diretto e veloce. Fa il lavoro.",
        },
      },
      custom: {
        title: "La tua abilità personalizzata è pronta.",
        subtitle:
          "Interruttore abilità o modello dal selettore sotto la casella di messaggio.",
      },
    },
  },
  publicFeed: {
    timestamp: {
      justNow: "Adesso.",
      hoursAgo: "{{hours}} h fa",
      daysAgo: "{{days}} d fa",
    },
  },
  config: {
    folders: {
      private: "Chat private",
      shared: "Chat condivise",
      public: "Chat pubbliche",
      incognito: "Incognito Chats",
      background: "Filetti di sfondo",
      remote: "Chat remote",
    },
  },
};
