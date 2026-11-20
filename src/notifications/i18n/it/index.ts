import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Notifiche",

  tags: {
    notifications: "notifiche",
    list: "elenco",
    unread: "non si può leggere",
    read: "Leggi il testo",
  },

  enums: {
    type: {
      taskComplete: "Compito finito",
      taskFailed: "Compito fallito",
      earning: "Guarnizione",
      dreamerResult: "Risultato Dreamer",
      creditLow: "Crediti bassi",
      system: "Sistema",
    },
  },

  // Copy per type. Rendered in the recipient's own locale when the
  // notification is created. {{params}} come from the event source.
  templates: {
    taskComplete: {
      title: "{{name}} finito",
      body: "Il vostro compito di sfondo è fatto. Aprire il risultato.",
    },
    taskFailed: {
      title: "{{name}} ha fallito",
      body: "Il tuo compito di sfondo ha colpito un errore. Aprilo per vedere il perche'.",
    },
    earning: {
      title: "Hai guadagnato crediti {{amount}}",
      body: "Un rinvio che guadagna ha eliminato il suo periodo di attesa e ora è spendibile.",
    },
    dreamerResult: {
      title: "{{name}} ha un risultato",
      body: "La sessione Dreamer è terminata.",
    },
    creditLow: {
      title: "Crediti in esecuzione bassa",
      body: "I crediti {{amount}} sono rimasti. Alzati prima delle tue prossime partite.",
    },
    system: {
      title: "{{name}}",
      body: "",
    },
    fallbackTaskName: "Attività di sfondo",
  },

  list: {
    get: {
      title: "Notifiche",
      titleShort: "Notifiche",
      description: "Tutto cio' che e' finito mentre eri via. Prima illeggi.",
      emptyTitle: "Niente di nuovo",
      emptyHint: "I compiti e i guadagni finiti si presentano qui.",
      markAllRead: "Mark tutti i letti",
      unread: "Non c'è",
      response: {
        notifications: {
          id: "ID",
          type: "Tipologia",
          title: "Titolo",
          body: "Messaggio",
          link: "Link",
          read: "Leggi tutto",
          createdAt: "Ricevuto.",
        },
        unreadCount: "Non c'è",
      },
      paginationInfo: {
        label: "Pagina",
      },
    },
  },

  unreadCount: {
    get: {
      title: "Conto di notifica non letto",
      titleShort: "Il conteggio non letto",
      description: "Quante notifiche non hai ancora aperto.",
      response: {
        unreadCount: "Notifiche non lette",
      },
    },
  },

  read: {
    post: {
      title: "Segnare le notifiche leggere",
      titleShort: "Mark leggere",
      description:
        "Segnare una notifica, o tutti loro, come letto. Mandate un id o tutto = vero.",
      id: {
        label: "Notifica ID",
        description: "La notifica per contrassegnare la lettura",
      },
      all: {
        label: "Segnare tutto leggere",
        description: "Cancellare l'intera lista non letta",
      },
      response: {
        updatedCount: "Segnato letto",
      },
      submit: {
        label: "Mark leggere",
        loading: "Aggiornamento...",
      },
    },
  },

  bell: {
    label: "Notifiche",
    empty: "Siete tutti coinvolti.",
    markAllRead: "Mark tutti i letti",
    viewAll: "Vedi tutto",
    loading: "Caricamento...",
    unreadBadge: "Notifiche non lette {{count}}",
  },

  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Inviare una notifica id, o all=true",
    },
    network: {
      title: "Errore di rete",
      description: "Errore di connessione di rete",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per vedere le notifiche",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Accesso non consentito",
    },
    notFound: {
      title: "Non trovato",
      description: "Notifica non trovata",
    },
    server: {
      title: "Errore del server",
      description: "Si è verificato un errore interno del server",
    },
    serverError: {
      title: "Errore del server",
      description: "Si è verificato un errore interno del server",
      detail: "Qualcosa si è rotto alla nostra fine: {{error}}",
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
      description: "Notifica conflitto di stato",
    },
    idOrAllRequired: "Inviare una notifica id, o all=true.",
  },

  success: {
    title: "Operazione riuscita",
    description: "Operazione completata",
  },
};
