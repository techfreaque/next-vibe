import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  emailPlaceholder: "Inserisci la tua email",
  subscription: {
    unsubscribe: {
      title: "Disiscriviti",
      confirmButton: "Conferma la disiscrizione",
      success: "Iscrizione annullata",
      error: "Impossibile annullare l’iscrizione",
    },
  },
  unsubscribe: {
    page: {
      title: "Disiscriviti",
      description:
        "Inserisci l’indirizzo e premi il pulsante. Tutto qui, senza pressioni.",
      subtitle: "Gestisci l’iscrizione alla newsletter",
      emailProvided: {
        title: "Conferma la disiscrizione",
        description:
          "Basta un clic per smettere di ricevere la newsletter a questo indirizzo.",
      },
      unsubscribeButton: "Disiscriviti",
      unsubscribing: "Disiscrizione in corso…",
      status: {
        subscribed: "Questo indirizzo riceve la nostra newsletter.",
        notSubscribed: "Questo indirizzo non è nella nostra lista.",
      },
      subscribeText: "Hai cambiato idea?",
      subscribeLink: "Iscriviti di nuovo",
      info: {
        title: "Che cosa succede",
        description: "Ecco quello che devi sapere su disiscrizione:",
        immediate: {
          title: "Instant.",
          description:
            "Non riceverai più le email della newsletter, da subito.",
        },
        resubscribe: {
          title: "Reversibile.",
          description: "Se cambi idea, puoi sempre iscriverti di nuovo.",
        },
      },
      alternatives: {
        title: "Prima di andare",
        description: "Considerate queste alternative:",
        subscribe: "Regolare la frequenza e-mail invece",
        contact: "Dicci cosa si risolva",
      },
    },
  },
  email: {
    label: "Indirizzo email",
    description:
      "L'indirizzo e-mail per annullare l'iscrizione alla newsletter",
    placeholder: "user@example.com",
    unsubscribe: {
      title: "Disiscrizione alla newsletter",
      preview: "Hai annullato l’iscrizione alla nostra newsletter",
      greeting: "Ciao.",
      confirmation:
        "L’indirizzo {{email}} non riceverà più la nostra newsletter.",
      resubscribe_info:
        "Se cambi idea, puoi iscriverti di nuovo sul nostro sito.",
      resubscribe_button: "Iscriviti di nuovo",
      support_message:
        "Per qualsiasi domanda, scrivi al nostro team di assistenza.",
      subject: "Conferma di disiscrizione dalla newsletter",
      admin_unsubscribe_notification: {
        title: "Notifica di disiscrizione dalla newsletter",
        preview: "Un utente si è disiscritto dalla newsletter",
        message: "Un utente si è disiscritto dalla newsletter",
        email: "Email",
        date: "Data",
        view_dashboard: "Visualizza Dashboard",
        subject:
          "Disiscrizione dalla newsletter. Notifica per gli amministratori",
      },
    },
  },
  response: {
    success: "Scontato con successo dalla newsletter",
    message: "Messaggio di successo",
  },
  errors: {
    email_generation_failed: "Non generare e-mail",
    internal: {
      title: "Errore interno",
      description:
        "Si è verificato un errore durante l'elaborazione della richiesta di cancellazione",
      detail: "Disiscrizione non riuscita: {{error}}",
    },
  },
  post: {
    title: "Newsletter Disiscrizione",
    titleShort: "Disiscriviti",
    description: "Disiscrizione agli aggiornamenti di newsletter",
    form: {
      title: "Disiscrizione alla newsletter",
      description:
        "Inserisci il tuo indirizzo email per annullare l'iscrizione alla nostra newsletter",
    },
    response: {
      title: "Annulla risposta",
      description: "Conferma di cancellazione della newsletter",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Indirizzo email non valido fornito",
      },
      internal: {
        title: "Errore interno",
        description:
          "Si è verificato un errore durante l'elaborazione della richiesta di cancellazione",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
    },
    success: {
      title: "Con successo non sottoscritta",
      description: "Sei stato svincolato dalla nostra newsletter",
    },
  },
  oneClick: {
    tag: "One-Click Unsubscribe",
    post: {
      title: "One-Click Unsubscribe",
      titleShort: "Disiscriviti",
      description:
        "Cancellare l'iscrizione tramite il link di un clic firmato in un'intestazione (RFC 8058)",
      container: {
        title: "One-Click Unsubscribe",
        description:
          "Chiamato da fornitori di mailbox. Il token firmato autorizza l'annullamento dell'iscrizione.",
      },
      token: {
        label: "Token",
        description: "Firmato cancella token dall'e-mail",
      },
      errors: {
        invalidToken: {
          title: "Link non valido",
          description: "Questo link di disiscrizione non è valido.",
        },
        server: {
          title: "Errore del server",
          description: "Impossibile annullare l’iscrizione. Riprova.",
        },
        validation: {
          title: "Errore di convalida",
          description: "Formato di token non valido",
        },
      },
      success: {
        title: "Iscrizione annullata",
        description: "Sei fuori dalla lista.",
      },
    },
  },
  sync: {
    failed: "Notiziario annullare l'iscrizione sincronizzazione non riuscita",
    error: "Notiziario annullare l'iscrizione errore di sincronizzazione",
    tag: "Newsletter Sync",
    post: {
      title: "Notiziario Cancellare Sync",
      description:
        "Sincronizza gli stati di contatto per la cancellazione della newsletter",
      container: {
        title: "Dissubscribe Configurazione Sync",
        description: "Configurare i parametri di sincronizzazione",
      },
      fields: {
        batchSize: {
          label: "Dimensione della batch",
          description: "Numero di record da elaborare per lotto",
        },
        dryRun: {
          label: "Correre a secco",
          description: "Correre senza apportare modifiche",
        },
      },
      response: {
        leadsProcessed: "Contatto lavorati",
        leadsUpdated: "Contatto Aggiornato",
        executionTimeMs: "Tempo di esecuzione (ms)",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        server: {
          title: "Errore del server",
          description:
            "Si è verificato un errore durante la sincronizzazione di unsubscribes",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
      },
      success: {
        title: "Sincronizzazione completa",
        description:
          "Newsletter annullare la sincronizzazione completata con successo",
      },
    },
  },
  emailTemplates: {
    unsubscribe: {
      name: "Newsletter Cancella l'iscrizione",
      description:
        "E-mail di conferma inviata agli utenti che si cancellano dalla newsletter",
      category: "newsletter",
      preview: {
        email: {
          label: "Indirizzo email",
          description: "Indirizzo email per cui annullare l’iscrizione",
        },
      },
    },
  },
  sms: {
    confirmation: {
      message:
        "Hai annullato l’iscrizione alla newsletter di {{appName}}. Se è stato un errore, puoi iscriverti di nuovo sul nostro sito.",
    },
    admin_notification: {
      message:
        "Newsletter Unsubscribe: {{email}} ha cancellato dalla newsletter.",
    },
    errors: {
      confirmation_failed: {
        title: "Conferma SMS non riuscita",
        description:
          "Non è stato possibile inviare la conferma di cancellazione SMS",
      },
      admin_notification_failed: {
        title: "Admin SMS Notifica non riuscita",
        description: "Non inviare la notifica di amministratore SMS",
      },
    },
  },
};
