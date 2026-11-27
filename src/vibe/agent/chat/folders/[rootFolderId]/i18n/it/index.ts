import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Cartelle",
  },
  enums: {
    userRole: {
      public: "Pubblico",
      customer: "Cliente",
      partnerAdmin: "Admin partner",
      partnerEmployee: "Dipendente partner",
      admin: "Amministratore",
    },
  },
  widget: {
    config: {
      foldersShort: {
        private: "Privato",
        shared: "Condiviso",
        public: "Pubblico",
        incognito: "Incognito",
        cron: "Background",
        support: "Supporto",
        remote: "Remoto",
      },
    },
    folderList: {
      menu: "Azioni cartella",
      newChatInFolder: "Nuova chat nella cartella",
      moveUp: "Sposta su",
      moveDown: "Sposta giù",
      newSubfolder: "Nuova sottocartella",
      managePermissions: "Gestisci permessi",
      projectSettings: "Impostazioni progetto",
      renameFolder: "Rinomina cartella",
      moveToFolder: "Sposta nella cartella",
      deleteFolder: "Elimina cartella",
      deleteDialog: {
        title: "Elimina cartella",
        description: 'Vuoi davvero eliminare "{{folderName}}"?',
      },
      pinned: "In evidenza",
      pin: "Fissa",
      unpin: "Rimuovi fissaggio",
      today: "Oggi",
      lastWeek: "Ultimi 7 giorni",
      lastMonth: "Ultimi 30 giorni",
      older: "Precedenti",
      showMore: "Mostra altro",
    },
    renameFolder: {
      title: "Rinomina cartella",
    },
    moveFolder: {
      title: "Sposta cartella",
    },
    newFolder: {
      title: "Crea nuova cartella",
    },
    project: {
      dialogTitle: "Impostazioni progetto",
    },
    permissions: {
      folderTitle: "Permessi della cartella",
    },
    accessModal: {
      title: "Account richiesto",
      privateTitle: "Thread privati",
      sharedTitle: "Thread condivisi",
      publicTitle: "Forum pubblico",
      incognitoTitle: "Modalità incognito",
      backgroundTitle: "Thread in background",
      remoteTitle: "Thread remoti",
      privateExplanation:
        "I thread privati sono il tuo spazio personale per conversare con l'IA. Tutte le tue chat sono salvate in modo sicuro sui nostri server e sincronizzate automaticamente su tutti i tuoi dispositivi.",
      sharedExplanation:
        "I thread condivisi ti permettono di creare conversazioni e condividerle con altri tramite link sicuri. Ideali per collaborare e condividere risultati con il tuo team o i tuoi amici.",
      publicExplanation:
        "Il Forum pubblico è uno spazio aperto in cui persone e IA parlano liberamente. Decidi tu cosa leggere. Rimuoviamo solo ciò che viola la legge o i nostri termini. Condividi idee, metti in discussione prospettive e partecipa a discussioni senza censura.",
      incognitoExplanation:
        "La modalità incognito mantiene le tue conversazioni completamente private e locali. Le tue chat restano solo nel browser e non vengono mai inviate ai nostri server (i media generati vengono conservati temporaneamente per motivi tecnici), senza alcun legame con il tuo account.",
      backgroundExplanation:
        "Le attività lunghe non dovrebbero bloccare la tua chat. I thread in background sono lo spazio in cui i tuoi sub-agenti e agenti pianificati lavorano in autonomia e riportano i risultati.",
      remoteExplanation:
        "Gestire le tue istanze non dovrebbe disperdere le conversazioni tra strumenti diversi. I thread remoti riuniscono in un unico posto le chat sincronizzate dalle tue istanze collegate.",
      requiresAccount:
        "Per accedere a {{folderName}}, devi creare un account o accedere.",
      loginButton: "Accedi",
      signupButton: "Registrati",
      close: "Chiudi",
    },
    actions: {
      rename: "Rinomina",
      moveToFolder: "Sposta nella cartella",
      pin: "Fissa",
      unpin: "Rimuovi fissaggio",
    },
    threadList: {
      deleteDialog: {
        title: "Elimina thread",
        description: 'Vuoi davvero eliminare "{{title}}"?',
      },
    },
    sharedThread: {
      noLinks: "Non ancora condiviso. Tocca per condividere",
      linkCount: "{{count}} link attivo/i",
      shareAction: "Condividi",
      moveToShared: "Sposta in Condivisi",
    },
    common: {
      cancel: "Annulla",
      delete: "Elimina",
      noChatsFound: "Nessun thread trovato",
      noResults: "Nessun thread corrispondente",
      searchPlaceholder: "Cerca...",
      privateChats: "Thread privati",
      sharedChats: "Thread condivisi",
      publicChats: "Thread pubblici",
      incognitoChats: "Thread in incognito",
      backgroundChats: "Thread in background",
      remoteChats: "Thread remoti",
      newChat: "Nuovo thread",
      newPrivateChat: "Thread privato",
      newSharedChat: "Thread condiviso",
      newPublicChat: "Thread pubblico",
      newIncognitoChat: "Thread in incognito",
      newPrivateFolder: "Nuova cartella privata",
      newSharedFolder: "Nuova cartella condivisa",
      newPublicFolder: "Nuova cartella pubblica",
      newIncognitoFolder: "Nuova cartella in incognito",
      newFolder: "Nuova cartella",
    },
  },
  errors: {
    not_implemented_on_native:
      "{{method}} non è implementato sulla piattaforma nativa. Usa la versione web per questa operazione.",
  },
  config: {
    folders: {
      private: "Privato",
      shared: "Condiviso",
      public: "Pubblico",
      background: "Background",
      incognito: "Incognito",
      support: "Supporto",
      remote: "Remoto",
    },
  },
  get: {
    title: "Ottieni cartelle",
    titleShort: "Cartelle",
    description: "Recupera tutte le cartelle della cartella radice corrente",
    rootFolderId: {
      label: "Cartella radice",
      description:
        "La cartella radice da recuperare (privato, condiviso, pubblico, background, incognito)",
    },
    container: {
      title: "Dettagli cartella",
      description: "Visualizza le informazioni della cartella",
    },
    id: {
      label: "ID cartella",
      description: "L'identificativo univoco della cartella",
    },
    response: {
      title: "Cartelle",
      description: "Elenco delle cartelle con i permessi",
      rootFolderPermissions: {
        title: "Permessi cartella radice",
        description: "Permessi per la cartella radice",
        canCreateThread: {
          content: "Può creare thread",
        },
        canCreateFolder: {
          content: "Può creare cartelle",
        },
      },
      folders: {
        folder: {
          id: { content: "ID" },
          userId: { content: "ID utente" },
          name: { content: "Nome" },
          icon: { content: "Icona" },
          color: { content: "Colore" },
          parentId: { content: "Cartella padre" },
          expanded: { content: "Espansa" },
          sortOrder: { content: "Ordine" },
          rootFolderId: {
            content: "Cartella radice",
          },
          canManage: {
            content: "Può gestire",
          },
          canCreateThread: {
            content: "Può creare thread",
          },
          canModerate: {
            content: "Può moderare",
          },
          canDelete: {
            content: "Può eliminare",
          },
          canManagePermissions: {
            content: "Può gestire i permessi",
          },
          createdAt: {
            content: "Creata il",
          },
          updatedAt: {
            content: "Aggiornata il",
          },
        },
      },
      folder: {
        title: "Cartella",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID utente",
        },
        name: {
          content: "Nome",
        },
        icon: {
          content: "Icona",
        },
        color: {
          content: "Colore",
        },
        parentId: {
          content: "Cartella padre",
        },
        expanded: {
          content: "Espansa",
        },
        sortOrder: {
          content: "Ordine",
        },
        metadata: {
          content: "Metadati",
        },
        createdAt: {
          content: "Creata il",
        },
        updatedAt: {
          content: "Aggiornata il",
        },
      },
    },
    errors: {
      validation: {
        title: "Errore di validazione",
        description: "L'ID cartella fornito non è valido",
      },
      unauthorized: {
        title: "Non autorizzato",
        description: "Devi effettuare l'accesso per vedere le cartelle",
      },
      forbidden: {
        title: "Vietato",
        description: "Non hai il permesso di vedere questa cartella",
      },
      notFound: {
        title: "Non trovato",
        description: "La cartella richiesta non è stata trovata",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante il recupero della cartella",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
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
        description:
          "Si è verificato un conflitto durante l'elaborazione della richiesta",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Cartella recuperata correttamente",
    },
  },
  patch: {
    title: "Aggiorna cartella",
    description: "Aggiorna una cartella esistente",
    container: {
      title: "Aggiorna cartella",
      description: "Modifica le proprietà della cartella",
    },
    id: {
      label: "ID cartella",
      description: "L'identificativo univoco della cartella da aggiornare",
    },
    sections: {
      updates: {
        title: "Aggiornamenti cartella",
        description: "Campi da aggiornare",
      },
    },
    name: {
      label: "Nome",
      description: "Il nome della cartella",
    },
    icon: {
      label: "Icona",
      description: "Nome icona Lucide o Simple Icons",
    },
    color: {
      label: "Colore",
      description: "Codice colore esadecimale per la distinzione visiva",
    },
    parentId: {
      label: "Cartella padre",
      description: "Sposta la cartella in un altro padre (null per radice)",
    },
    expanded: {
      label: "Espansa",
      description: "Indica se la cartella è espansa nell'interfaccia",
    },
    sortOrder: {
      label: "Ordine",
      description: "Ordine di visualizzazione delle cartelle",
    },
    metadata: {
      label: "Metadati",
      description: "Metadati aggiuntivi della cartella",
    },
    rolesView: {
      label: "Ruoli visualizzazione",
      description: "Ruoli che possono visualizzare questa cartella",
    },
    rolesManage: {
      label: "Ruoli gestione",
      description: "Ruoli che possono gestire le impostazioni della cartella",
    },
    rolesCreateThread: {
      label: "Ruoli creazione thread",
      description: "Ruoli che possono creare thread in questa cartella",
    },
    rolesPost: {
      label: "Ruoli pubblicazione",
      description: "Ruoli che possono inviare messaggi",
    },
    rolesModerate: {
      label: "Ruoli moderazione",
      description: "Ruoli che possono moderare i contenuti",
    },
    rolesAdmin: {
      label: "Ruoli amministrazione",
      description: "Ruoli con accesso amministrativo completo",
    },
    response: {
      title: "Cartella aggiornata",
      description: "Dettagli della cartella aggiornata",
      folder: {
        title: "Cartella",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID utente",
        },
        name: {
          content: "Nome",
        },
        icon: {
          content: "Icona",
        },
        color: {
          content: "Colore",
        },
        parentId: {
          content: "Cartella padre",
        },
        expanded: {
          content: "Espansa",
        },
        sortOrder: {
          content: "Ordine",
        },
        metadata: {
          content: "Metadati",
        },
        createdAt: {
          content: "Creata il",
        },
        updatedAt: {
          content: "Aggiornata il",
        },
      },
    },
    errors: {
      validation: {
        title: "Errore di validazione",
        description: "I dati forniti non sono validi",
        circularReference:
          "Impossibile impostare la cartella come padre di sé stessa",
      },
      unauthorized: {
        title: "Non autorizzato",
        description: "Devi effettuare l'accesso per aggiornare le cartelle",
      },
      forbidden: {
        title: "Vietato",
        description: "Non hai il permesso di aggiornare questa cartella",
      },
      notFound: {
        title: "Non trovato",
        description: "La cartella richiesta non è stata trovata",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'aggiornamento della cartella",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
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
        description: "Esiste già una cartella con questo nome",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Cartella aggiornata correttamente",
    },
  },
  delete: {
    title: "Elimina cartella",
    description: "Elimina una cartella e tutto il suo contenuto",
    container: {
      title: "Elimina cartella",
      description: "Rimuovi la cartella in modo permanente",
    },
    id: {
      label: "ID cartella",
      description: "L'identificativo univoco della cartella da eliminare",
    },
    response: {
      title: "Risultato eliminazione",
      description: "Conferma dell'eliminazione della cartella",
      success: {
        content: "Operazione riuscita",
      },
      deletedFolderId: {
        content: "ID cartella eliminata",
      },
    },
    errors: {
      validation: {
        title: "Errore di validazione",
        description: "L'ID cartella fornito non è valido",
      },
      unauthorized: {
        title: "Non autorizzato",
        description: "Devi effettuare l'accesso per eliminare le cartelle",
      },
      forbidden: {
        title: "Vietato",
        description: "Non hai il permesso di eliminare questa cartella",
      },
      notFound: {
        title: "Non trovato",
        description: "La cartella richiesta non è stata trovata",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'eliminazione della cartella",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
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
        description: "Impossibile eliminare una cartella con contenuti attivi",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Cartella eliminata correttamente",
    },
  },
  post: {
    errors: {
      forbidden: {
        title: "Vietato",
        incognitoNotAllowed:
          "Le cartelle non sono supportate in modalità incognito",
      },
      unauthorized: {
        title: "Non autorizzato",
      },
      server: {
        title: "Errore del server",
      },
    },
  },
};
