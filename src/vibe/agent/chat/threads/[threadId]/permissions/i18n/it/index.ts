import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    threads: "Conversazioni",
    permissions: "Permissioni",
  },
  enums: {
    userRole: {
      public: "Pubblico",
      customer: "Cliente",
      partnerAdmin: "Amministratore partner",
      partnerEmployee: "Collaboratore partner",
      admin: "Amministratore",
    },
  },
  dialog: {
    title: "Permessi filettati: {{threadTitle}}",
  },
  get: {
    title: "Ottieni autorizzazioni di filettatura",
    titleShort: "Accesso filettatura",
    description: "Recuperare l'elenco dei moderatori per un thread specifico",
    container: {
      title: "Autorizzazioni della conversazione",
      description:
        "Visualizzare e gestire le autorizzazioni di accesso filettato",
    },
    threadId: {
      label: "File ID",
      description: "L'identificatore univoco del thread",
    },
    response: {
      title: "Autorizzazioni della conversazione",
      rolesView: {
        label: "Visualizza Roles",
        description: "Roles che possono vedere questo thread",
      },
      rolesEdit: {
        label: "Modificare Roles",
        description: "Roles che possono modificare le impostazioni del thread",
      },
      rolesPost: {
        label: "Post Roles",
        description: "Ruoli che possono inviare messaggi",
      },
      rolesModerate: {
        label: "Ruoli moderati",
        description: "Ruoli che possono moderare il contenuto",
      },
      rolesAdmin: {
        label: "Admin Roles",
        description: "Ruoli con accesso amministrativo completo",
      },
      moderatorIds: {
        title: "ID moderatori",
        description:
          "Elenco degli ID utente che possono moderare questo thread",
        content: "Utente ID",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "I dati forniti sono invalidi",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante il recupero dei permessi del thread",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere connesso per visualizzare le autorizzazioni del thread",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Non hai il permesso di visualizzare le autorizzazioni di questo thread",
      },
      notFound: {
        title: "Non trovato",
        description: "Il thread richiesto non è stato trovato",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante il recupero dei permessi di thread",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "C'era un conflitto con lo stato attuale",
      },
    },
    backButton: {
      label: "Indietro",
    },
    success: {
      title: "Operazione riuscita",
      description: "Permessi filettati recuperati con successo",
    },
  },
  patch: {
    title: "Permessi di aggiornamento del thread",
    titleShort: "Accesso filettatura",
    description: "Aggiorna l'elenco dei moderatori per un thread specifico",
    container: {
      title: "Permessi di aggiornamento del thread",
      description: "Modificare le autorizzazioni di accesso filettato",
    },
    threadId: {
      label: "File ID",
      description: "L'identificatore univoco del thread per aggiornare",
    },
    rolesView: {
      label: "Visualizza Roles",
      description: "Roles che possono vedere questo thread",
    },
    rolesEdit: {
      label: "Modificare Roles",
      description: "Roles che possono modificare le impostazioni del thread",
    },
    rolesPost: {
      label: "Post Roles",
      description: "Ruoli che possono inviare messaggi",
    },
    rolesModerate: {
      label: "Ruoli moderati",
      description: "Ruoli che possono moderare il contenuto",
    },
    rolesAdmin: {
      label: "Admin Roles",
      description: "Ruoli con accesso amministrativo completo",
    },
    permissions: {
      title: "Aggiornamento delle autorizzazioni",
      moderatorIds: {
        label: "ID moderatori",
        description:
          "Elenco degli ID utente che possono moderare questo thread",
      },
    },
    response: {
      title: "Permissioni aggiornate",
      rolesView: {
        label: "Visualizza Roles",
        description: "Roles che possono vedere questo thread",
      },
      rolesEdit: {
        label: "Modificare Roles",
        description: "Roles che possono modificare le impostazioni del thread",
      },
      rolesPost: {
        label: "Post Roles",
        description: "Ruoli che possono inviare messaggi",
      },
      rolesModerate: {
        label: "Ruoli moderati",
        description: "Ruoli che possono moderare il contenuto",
      },
      rolesAdmin: {
        label: "Admin Roles",
        description: "Ruoli con accesso amministrativo completo",
      },
      message: {
        content: "Permessi filettati aggiornati con successo",
      },
      moderatorIds: {
        title: "Moderatori attuali",
        description: "Elenco aggiornato dei moderatori per questo thread",
        content: "Utente ID",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Gli ID dei moderatori forniti non sono validi",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante l'aggiornamento dei permessi filettati",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere connesso per aggiornare le autorizzazioni del thread",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Non hai il permesso di aggiornare le autorizzazioni di questo thread",
      },
      notFound: {
        title: "Non trovato",
        description: "Il thread richiesto non è stato trovato",
      },
      server: {
        title: "Errore del server",
        description:
          "Si è verificato un errore durante l'aggiornamento dei permessi di thread",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "C'era un conflitto con lo stato attuale",
      },
    },
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      label: "Salvare le autorizzazioni",
      loadingText: "Salvare...",
    },
    success: {
      title: "Operazione riuscita",
      description: "Permessi filettati aggiornati con successo",
    },
  },
};
