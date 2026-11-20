import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Notizie di prodotto",
      companyUpdates: "Aggiornamenti della Società",
      industryInsights: "Insights dell'industria",
      events: "Eventi",
    },
    creditBonus: {
      active: "Bonus attivo",
      pendingConfirmation: "Conferma la tua email per sbloccare il bonus",
      claimedElsewhere: "Già rivendicato da un altro account",
      accountRequired: "Conto gratuito richiesto",
    },
  },
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
    creditBonus: "Bonus gratuito di credito",
    bonusCredits: "Crediti bonus al mese",
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
      detail: "Abbonamento fallito: {{error}}",
    },
  },
  post: {
    title: "Abbonamento Newsletter",
    titleShort: "Iscriviti",
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
      description: "Sei stato sottoscritto con successo alla nostra newsletter",
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
      confirm_title:
        "Manca un clic: +{{bonusCredits}} crediti gratis ogni mese",
      confirm_text:
        "Conferma questo indirizzo. Riceverai {{bonusCredits}} crediti extra gratis ogni mese finché resti iscritto.",
      confirm_button: "Conferma e sblocca +{{bonusCredits}} crediti",
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
};
