import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  status: {
    title: "Stato della Newsletter",
    description:
      "Controlla lo stato dell'abbonamento alla newsletter per un indirizzo email",
    category: "Newsletter",
    tags: {
      status: "Stato",
    },
    form: {
      title: "Controllare lo stato della Newsletter",
      description:
        "Inserisci un indirizzo e-mail per controllare lo stato dell'abbonamento alla newsletter",
    },
    email: {
      label: "Indirizzo email",
      description: "L'indirizzo email per verificare lo stato dell'abbonamento",
      placeholder: "user@example.com",
      helpText: "Inserisci l'indirizzo e-mail che vuoi controllare",
    },
    response: {
      subscribed: "Stato di abbonamento",
      status: "Stato attuale",
    },
    errors: {
      validation: {
        title: "E-mail non valida",
        description: "Si prega di fornire un indirizzo email valido",
      },
      internal: {
        title: "Errore interno",
        description:
          "Si è verificato un errore durante il controllo dello stato dell'abbonamento",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Non sei autorizzato a controllare lo stato dell'abbonamento",
      },
      notFound: {
        title: "Non trovato",
        description:
          "Nessuna informazione di sottoscrizione trovata per questo indirizzo email",
      },
    },
    success: {
      title: "Stato recuperato",
      description:
        "Stato di abbonamento della newsletter recuperato con successo",
    },
  },
  subscribe: {
    category: "Newsletter",
    tags: {
      newsletter: "Newsletter",
      subscription: "Abbonamento",
    },
    email: {
      label: "Indirizzo email",
      description: "Il tuo indirizzo email per l'abbonamento alla newsletter",
      placeholder: "user@example.com",
      helpText: "Lo useremo per inviarti aggiornamenti di newsletter",
    },
    name: {
      label: "Nome",
      description: "Il tuo nome (opzionale)",
      placeholder: "John Doe",
      helpText: "Aiutaci a personalizzare la tua esperienza di newsletter",
    },
    preferences: {
      label: "Preferenze Newsletter",
      description: "Seleziona i tipi di newsletter che desideri ricevere",
      placeholder: "Seleziona le tue preferenze",
      helpText: "È possibile modificare queste preferenze in qualsiasi momento",
    },
    leadId: {
      label: "ID del contatto",
      description: "Identificatore di contatto opzionale",
      placeholder: "123e4567-e89b-12d3-a456-426614174000",
      helpText: "Solo uso interno",
    },
    response: {
      success: "Con successo sottoscritto alla newsletter",
      message: "Messaggio di successo",
      leadId: "Identificativo del contatto",
      subscriptionId: "Abbonamento ID",
      userId: "Utente ID",
      alreadySubscribed:
        "Questo indirizzo email è già iscritto alla nostra newsletter",
    },
    errors: {
      email_generation_failed: "Non generare e-mail",
      badRequest: {
        title: "Richiesta non impegnativa",
        description: "Parametri di richiesta non valida forniti",
      },
      internal: {
        title: "Errore interno",
        description:
          "Si è verificato un errore durante l'elaborazione dell'abbonamento",
      },
    },
    post: {
      title: "Abbonamento Newsletter",
      description:
        "Iscriviti agli aggiornamenti e alle notifiche della newsletter",
      form: {
        title: "Abbonamento Newsletter",
        description:
          "Configura le preferenze relative all'abbonamento alla newsletter",
      },
      response: {
        title: "Risposta dell'abbonamento",
        description: "Dati di conferma dell'abbonamento alla newsletter",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
        internal: {
          title: "Errore interno",
          description:
            "Si è verificato un errore durante l'elaborazione dell'abbonamento",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        conflict: {
          title: "Abbonamento già attivo",
          description:
            "Questo indirizzo email è già iscritto alla nostra newsletter",
        },
        badRequest: {
          title: "Richiesta non impegnativa",
          description: "Parametri di richiesta non valida forniti",
        },
      },
      success: {
        title: "Abbonati con successo",
        description:
          "Sei stato sottoscritto con successo alla nostra newsletter",
      },
    },
    repository: {
      starting: "Abbonamenti alla newsletter",
      linking_to_lead: "Collegamento newsletter abbonamento a contatto",
      lead_found: "Contatto trovato per l'abbonamento alla newsletter",
      lead_updated:
        "Condurre aggiornato con i dati di iscrizione alla newsletter",
      lead_update_failed:
        "Non è riuscito ad aggiornare il lead con i dati della newsletter",
      lead_not_found: "Contatto non trovato o non idoneo per l'aggiornamento",
      lead_linking_error:
        "Errore durante il collegamento al contatto dalla newsletter",
      missing_lead_id: "Registrazione della newsletter tentata senza leadId",
      already_subscribed: "L'utente è già iscritto alla newsletter",
      reactivating: "Riattivare l'abbonamento alla newsletter",
      creating_new: "Creazione di un nuovo abbonamento newsletter",
      created_successfully: "Abbonamento newsletter creato con successo",
      subscription_failed: "L'abbonamento alla newsletter è fallito",
    },
    sms: {
      no_phone_number:
        "Nessun numero di telefono disponibile per la newsletter di benvenuto SMS",
      sending_welcome: "Invio di benvenuto SMS abbonato alla newsletter",
      welcome_error: "Errore di inviare newsletter di benvenuto SMS",
      no_admin_phone:
        "Nessun numero di telefono di amministratore configurato, saltando la notifica SMS",
      sending_admin_notification:
        "Inviare la notifica di amministrazione SMS per l'abbonamento alla newsletter",
      admin_notification_error: "Avviso di errore dell'amministratore SMS",
      welcome: {
        message:
          "Ciao {{name}}! Benvenuto nella nostra newsletter. Restate sintonizzati per aggiornamenti!",
      },
      admin_notification: {
        message:
          "Nuovo abbonamento alla newsletter: {{displayName}} ({{email}}) ha sottoscritto",
      },
    },
    route: {
      sms_failed_continuing: "Le notifiche SMS sono fallite ma continua",
    },
    emailTemplates: {
      welcome: {
        name: "Newsletter Benvenuto Email",
        description:
          "Email di benvenuto inviata a nuovi iscritti alla newsletter",
        category: "newsletter",
        preview: {
          email: {
            label: "Indirizzo email",
            description: "Indirizzo e-mail del sottoscrittore",
          },
          name: {
            label: "Nome utente",
            description: "Nome dell'abbonato (opzionale)",
          },
          leadId: {
            label: "ID del contatto",
            description: "ID del lead per il monitoraggio statistico",
          },
          userId: {
            label: "Utente ID",
            description: "Identificazione dell'account utente (opzionale)",
          },
        },
      },
    },
    emailTemplate: {
      welcome: {
        title: "Benvenuto nella newsletter di {{appName}}!",
        subject: "Benvenuto su {{appName}}. Le novità sull’IA senza censura",
        preview:
          "Iscrizione attiva. Riceverai novità sull’IA senza censura, nuovi modelli e consigli riservati agli iscritti.",
        greeting_with_name: "Ciao {{name}}!",
        greeting: "Ciao!",
        message:
          "Benvenuto nella newsletter di {{appName}}. Entri a far parte di una comunità che vuole conversazioni sincere e senza censura con l’IA.",
        what_to_expect: "Cosa riceverai:",
        benefit_1: "Annunci e aggiornamenti sui modelli di IA",
        benefit_2: "Consigli per sfruttare al meglio l’IA senza censura",
        benefit_3: "Offerte riservate e accesso anticipato alle nuove funzioni",
        benefit_4: "Novità e storie dalla comunità",
        frequency:
          "Ti scriveremo ogni poche settimane con novità e consigli. Niente spam.",
        unsubscribe_text: "Preferisci non ricevere queste email?",
        unsubscribe_link: "Disiscriviti",
      },
      admin_notification: {
        title: "Nuova Newsletter Abbonamento",
        subject: "Nuova Newsletter Abbonamento",
        preview: "Un nuovo utente ha sottoscritto la newsletter",
        message: "Un nuovo utente ha sottoscritto la newsletter.",
        subscriber_details: "Dettagli dell'abbonamento",
        email: "Email",
        name: "Nome",
        preferences: "Preferenze",
        view_in_admin: "Apri il pannello di amministrazione",
      },
    },
  },
  unsubscribe: {
    category: "Newsletter",
    tags: {
      newsletter: "Newsletter",
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
      },
    },
    post: {
      title: "Newsletter Disiscrizione",
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
    sync: {
      failed: "Notiziario annullare l'iscrizione sincronizzazione non riuscita",
      error: "Notiziario annullare l'iscrizione errore di sincronizzazione",
      tag: "Newsletter Sync",
      post: {
        title: "Sincronizzazione delle disiscrizioni alla newsletter",
        titleShort: "Sincronizzazione di un soggetto",
        description:
          "Aggiorna lo stato dei contatti che si sono disiscritti dalla newsletter.",
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
  },
  email: {
    welcome: {
      title: "Benvenuti nella nostra Newsletter",
      preview: "Benvenuto alla nostra newsletter! Grazie per la sottoscrizione",
      greeting: "Ciao.",
      greeting_with_name: "Ciao {{name}}",
      message:
        "Benvenuto nella newsletter di {{appName}}! Grazie per esserti iscritto.",
      what_to_expect: "Cosa troverai nella nostra newsletter:",
      benefit_1: "Ultimi aggiornamenti e caratteristiche del prodotto",
      benefit_2: "Intuizioni e tendenze del settore",
      benefit_3: "Contenuto esclusivo e suggerimenti",
      benefit_4: "Offerte speciali e promozioni",
      frequency:
        "Ti invieremo una newsletter ogni settimana con le ultime novità.",
      unsubscribe_text: "Puoi disiscriverti quando vuoi, cliccando",
      unsubscribe_link: "qui",
      subject: "Benvenuti alla nostra Newsletter!",
    },
    admin_notification: {
      title: "Nuova Newsletter Abbonamento",
      preview: "Un nuovo utente ha sottoscritto la newsletter",
      message: "Un nuovo utente ha sottoscritto la newsletter.",
      subscriber_details: "Dettagli dell'abbonamento",
      email: "Email",
      name: "Nome",
      preferences: "Preferenze",
      view_in_admin: "Apri il pannello di amministrazione",
      subject: "Nuova Newsletter Abbonamento - Notifica di Admin",
    },
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
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Notizie di prodotto",
      companyUpdates: "Aggiornamenti della Società",
      industryInsights: "Insights dell'industria",
      events: "Eventi",
    },
    status: {
      subscribed: "Iscritto",
      unsubscribed: "Iscrizione annullata",
      pending: "Finanziamenti",
      bounced: "Bounce",
      complained: "Spiegato",
    },
    creditBonus: {
      active: "Bonus attivo",
      pendingConfirmation: "Conferma la tua email per sbloccare il bonus",
      claimedElsewhere: "Già rivendicato da un altro account",
      accountRequired: "Conto gratuito richiesto",
    },
  },
  hooks: {
    errors: {
      missing_lead_id: "Abbonamento alla newsletter: Manca leadId",
    },
  },
  errors: {
    email_generation_failed: "Non generare e-mail",
  },
  error: {
    general: {
      internal_server_error: "Errore del server interno",
    },
    default: "Si è verificato un errore",
  },
  subscription: {
    error: {
      description: "Non iscritti alla newsletter",
    },
    unsubscribe: {
      error: "Non è stato possibile annullare l'iscrizione alla newsletter",
      confirmQuestion: "Vuoi disiscriverti?",
    },
  },
};
