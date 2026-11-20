import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",

  roles: {
    widget: {
      added: "Role concesso: {{role}}",
      removed: "Role rimosso: {{role}}",
      removeWarning:
        "L'utente perde ogni permesso che questo ruolo concede sulla loro prossima richiesta.",
      addHint: "Prende effetto sulla prossima richiesta dell'utente.",
    },
    post: {
      title: "Aggiungi il ruolo dell'utente",
      titleShort: "Aggiungi Role",
      description: "Concedere un ruolo a un account utente specifico",
      container: {
        title: "Aggiungi Role",
        description: "Selezionare un ruolo da concedere a questo utente",
      },
      id: {
        label: "Utente ID",
        description:
          "Unico identificatore dell'utente per concedere il ruolo a",
        placeholder: "Inserisci utente ID...",
      },
      role: {
        label: "Role",
        description: "Il ruolo da concedere all'utente",
        placeholder: "Seleziona un ruolo...",
      },
      submit: {
        label: "Aggiungi Role",
      },
      response: {
        roleId: {
          content: "Assegnazione del ruolo ID",
        },
        userId: {
          content: "Utente ID",
        },
        assignedRole: {
          content: "Assegnato Role",
        },
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso per gestire i ruoli degli utenti",
        },
        validation: {
          title: "Convalida non riuscita",
          description: "Si prega di fornire un utente valido ID e ruolo",
        },
        forbidden: {
          title: "Accesso Proibito",
          description:
            "Solo gli amministratori possono gestire i ruoli degli utenti",
        },
        notFound: {
          title: "Utente non trovato",
          description: "L'utente specificato non potrebbe essere trovato",
          detail: "Nessun utente trovato con ID {{userId}}.",
        },
        conflict: {
          title: "Role già assegnata",
          description: "Questo utente ha già il ruolo specificato",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai dei cambiamenti non salvati che saranno persi",
        },
        server: {
          title: "Errore del server",
          description:
            "Non è possibile aggiungere ruolo a causa di errore server",
          detail:
            "Non poteva concedere il ruolo {{role}} all'utente {{userId}}.",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Si è verificato un errore inaspettato, aggiungendo il ruolo",
        },
      },
      success: {
        title: "Role Aggiunto",
        description: "Il ruolo è stato concesso con successo all'utente",
      },
    },
    delete: {
      title: "Rimuovi il ruolo dell'utente",
      titleShort: "Rimuovere Role",
      description: "Rivolgere un ruolo da un account utente specifico",
      container: {
        title: "Rimuovere Role",
        description: "Selezionare un ruolo da revocare da questo utente",
      },
      id: {
        label: "Utente ID",
        description:
          "Unico identificatore dell'utente per revocare il ruolo da",
        placeholder: "Inserisci utente ID...",
      },
      role: {
        label: "Role",
        description: "Il ruolo da revocare dall'utente",
        placeholder: "Seleziona un ruolo...",
      },
      submit: {
        label: "Rimuovere Role",
      },
      response: {
        success: {
          content: "Role Rimuovi",
        },
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso per gestire i ruoli degli utenti",
        },
        validation: {
          title: "Convalida non riuscita",
          description: "Si prega di fornire un utente valido ID e ruolo",
        },
        forbidden: {
          title: "Accesso Proibito",
          description:
            "Solo gli amministratori possono gestire i ruoli degli utenti",
        },
        notFound: {
          title: "Utente non trovato",
          description: "L'utente specificato non potrebbe essere trovato",
          detail: "Nessun utente trovato con ID {{userId}}.",
        },
        conflict: {
          title: "Errore di conflitto",
          description:
            "Incapace di rimuovere il ruolo a causa delle dipendenze esistenti",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai dei cambiamenti non salvati che saranno persi",
        },
        server: {
          title: "Errore del server",
          description:
            "Non è possibile rimuovere il ruolo a causa di errore del server",
          detail:
            "Non è possibile rimuovere il ruolo {{role}} dall'utente {{userId}}.",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Si è verificato un errore inaspettato mentre si rimuove il ruolo",
        },
      },
      success: {
        title: "Role Rimuovi",
        description: "Il ruolo è stato revocato con successo dall'utente",
      },
    },
  },
  enums: {
    userRole: {
      public: "Pubblico",
      customer: "Cliente",
      partnerAdmin: "Amministratore partner",
      partnerEmployee: "Collaboratore partner",
      admin: "Amministratore",
      cliOff: "CLI disattivata",
      cliAuthBypass: "CLI senza autenticazione",
      aiToolOff: "Strumento IA disattivato",
      webOff: "Web disattivato",
      mcpOff: "MCP disattivato",
      mcpVisible: "Visibile in MCP",
      productionOff: "Disattivato in produzione",
      skillOff: "Skill disattivata",
    },
  },
};
