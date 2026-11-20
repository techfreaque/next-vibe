import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Mailbox della piattaforma",
  tag: "Mailbox della piattaforma",

  task: {
    description:
      "Componi il report di stato interno giornaliero e invialo dalla casella di posta della piattaforma",
  },

  send: {
    title: "Inviare la piattaforma Mail",
    titleShort: "Invia la mail",
    description:
      "Inviare una e-mail transazionale dalla casella di posta della piattaforma e file in Sent",
    container: {
      title: "Inviare la piattaforma Mail",
      description:
        "Un destinatario, un messaggio. Conservato nella cartella di immissione dopo la consegna.",
    },
    fields: {
      to: {
        label: "Recipiente",
        description: "Un unico indirizzo email",
        placeholder: "name@example.com",
      },
      subject: {
        label: "Oggetto",
        description: "Oggetto",
        placeholder: "Di che si tratta?",
      },
      body: {
        label: "Messaggio",
        description: "Corpo in tessuto di pianura",
        placeholder: "Scrivi il messaggio...",
      },
      html: {
        label: "Corpo HTML",
        description: "Versione semplice opzionale HTML",
        placeholder: "<p> opzionale HTML </p>",
      },
    },
    response: {
      messageId: "Messaggio ID",
      from: "Da",
      to: "A",
      storedInSent: "Archiviato in Sent",
      sentFolder: "Cartella di ingresso",
      sentLastHour: "Inviato nell'ultima ora",
      rateLimitPerHour: "Limite oraria",
    },
    widget: {
      submit: "Invia mail",
      submitting: "Invio in corso…",
      sent: "Mail inviata",
      filed: "Archiviato in Sent",
      notFiled: "Consegnato, ma non depositato in Sent",
      yes: "Sì.",
      no: "No.",
    },
    success: {
      title: "Mail inviata",
      description: "Il messaggio è stato consegnato al server di posta",
    },
  },

  inbox: {
    title: "Posto di accesso alla piattaforma",
    titleShort: "Posta in arrivo",
    description:
      "Elenca i messaggi INBOX recenti della casella di posta della piattaforma",
    container: {
      title: "Posto di accesso alla piattaforma",
      description:
        "Prima e' il piu' nuovo. La lettura non segna mai un messaggio come letto.",
    },
    fields: {
      limit: {
        label: "Limite",
        description: "Quanti messaggi restituire (1-50)",
        placeholder: "20",
      },
      unreadOnly: {
        label: "Solo per non aver letto",
        description: "Solo restituire messaggi non letti",
      },
    },
    response: {
      address: "Mailbox",
      messages: {
        title: "Messaggi",
        uid: "UID",
        from: "Da",
        subject: "Oggetto",
        date: "Data",
        snippet: "Snippet",
        unread: "Non c'è",
      },
    },
    widget: {
      submit: "Posta di riserva",
      submitting: "Caricamento...",
      empty: "Nessun messaggio",
      emptyDescription: "Niente corrisponde a questi filtri.",
      unread: "Non c'è",
      noSubject: "(non soggetto)",
      open: "Aperto",
    },
    success: {
      title: "Posta in arrivo",
      description:
        "Messaggi recuperati dalla casella di posta della piattaforma",
    },
  },

  message: {
    title: "Leggi la Piattaforma",
    titleShort: "Leggi la mail",
    description:
      "Ottieni un messaggio INBOX della casella di posta della piattaforma da UID",
    container: {
      title: "Leggi la Piattaforma",
      description: "Corpo pieno di un messaggio. Non lo segna come letto.",
    },
    fields: {
      uid: {
        label: "UID",
        description: "Messaggio UID dall'elenco delle caselle di posta",
        placeholder: "42",
      },
    },
    response: {
      uid: "UID",
      from: "Da",
      to: "A",
      subject: "Oggetto",
      date: "Data",
      messageId: "Messaggio ID",
      unread: "Non c'è",
      bodyText: "Corpo",
    },
    widget: {
      submit: "Leggi il messaggio",
      submitting: "Caricamento...",
      unread: "Non c'è",
      noSubject: "(non soggetto)",
    },
    success: {
      title: "Messaggio caricato",
      description:
        "Messaggio recuperato dalla casella di posta della piattaforma",
    },
  },

  report: {
    title: "Rapporto sullo stato giornaliero",
    titleShort: "Rapporto giornaliero",
    description:
      "Componi l'ultimo report della piattaforma 24h e invialo dalla casella di posta della piattaforma",
    container: {
      title: "Rapporto sullo stato giornaliero",
      description:
        "Segnali, abbonamenti, spesa di credito, imbuto, incidenti di attività e errori. Testo normale.",
    },
    fields: {
      to: {
        label: "Recipiente",
        description:
          "Lasciare vuoto per utilizzare l'indirizzo del report configurato",
        placeholder: "name@example.com",
      },
      dryRun: {
        label: "Anteprima solo",
        description: "Componi il rapporto ma non inviarlo",
      },
    },
    response: {
      subject: "Oggetto",
      body: "Relazione",
      recipient: "Recipiente",
      sent: "Inviato",
      sections: "Sezioni incluse",
      skippedSections: "Sezioni saltate",
    },
    widget: {
      submit: "Invia rapporto",
      submitting: "Comporre...",
      sent: "Relazione inviata",
      preview: "Anteprima",
    },
    success: {
      title: "Rapporto pronto",
      description: "Il rapporto di stato giornaliero è stato composto",
    },
  },

  errors: {
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per continuare",
    },
    forbidden: {
      title: "Accesso negato",
      description:
        "Solo gli amministratori possono utilizzare la casella di posta della piattaforma",
    },
    server: {
      title: "Errore del server",
      description: "La richiesta di mailbox della piattaforma è fallita",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore sconosciuto",
    },
    validation: {
      title: "Errore di convalida",
      description: "Parametri della richiesta non validi",
    },
    notConfigured:
      "La casella di posta della piattaforma non è configurata. Impostare THEA_MAIL_ADDRESS, THEA_MAIL_HOST e THEA_MAIL_PASSWORD.",
    invalidRecipient:
      "Il destinatario deve essere un unico indirizzo email valido",
    noRecipient:
      "Nessun destinatario. Passare uno o impostare THEA_MAIL_REPORT_TO.",
    rateLimited:
      "Limite di invio orario raggiunto ({{sent}} di {{limit}}). Riprova più tardi.",
    smtpFailed: "Il server di posta ha respinto il messaggio: {{error}}",
    imapFailed: "Non è possibile raggiungere la casella di posta: {{error}}",
    messageNotFound: "Nessun messaggio con quello UID nella casella di posta",
    reportFailed: "Non poteva comporre il rapporto: {{error}}",
  },
};
