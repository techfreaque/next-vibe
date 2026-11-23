import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  bounceSync: {
    title: "Sincronizza i guasti di consegna dell'iscrizione",
    description:
      "Controllare la casella di posta del sistema per le email di conferma dell'iscrizione fallite.",
    marked: "Aggiornamento delle iscrizioni",
    result: "Aggiornamento delle iscrizioni: {{count}}",
    productionOnly:
      "La sincronizzazione della consegna dell'iscrizione viene eseguita solo sulla produzione.",
    mailboxUnavailable:
      "Non poteva controllare la casella di posta del sistema per email di registrazione fallite.",
  },
  events: {
    started: "Registrazione iniziata",
    emailSent: "Email di conferma inviata",
    sendFailed: "Invio dell'email non riuscito",
    bounced: "Email di conferma respinta",
    expired: "Conferma scaduta",
    confirmed: "Email confermata",
    reminderSent: "Promemoria inviato",
  },
  reminder: {
    subject: "Il tuo account unbottled.ai è a un clic",
    hint: "Hai iniziato la registrazione ma non hai mai confermato la tua email. Conferma ora e ricevi {{credits}} crediti gratuiti ogni mese. Il codice e il pulsante qui sotto valgono 24 ore e sostituiscono quelli della prima email.",
    button: "Conferma e accedi",
    ignore:
      "Non ti sei registrato tu? Ignora questa email. Senza un clic non viene creato nessun account.",
  },
  confirmation: {
    bouncedTitle: "Non siamo riusciti a consegnare l’email di conferma",
    changeAddress: "Cambia indirizzo email",
    description:
      "Completa la registrazione con il codice o il link ricevuto via email.",
    title: "Controlla la posta",
    sent: "Inserisci il codice inviato a {{email}}. Scade tra 30 minuti.",
    code: "Codice a 6 cifre",
    confirm: "Conferma e accedi",
    change: "Indirizzo sbagliato? Cambialo",
    resend: "Invia di nuovo il codice",
    countdown: "Puoi riprovare tra {{seconds}} s",
    save: "Invia a questo indirizzo",
    cancel: "Annulla",
    email: "Indirizzo email",
    hint: "Per completare la registrazione, inserisci questo codice oppure usa il link qui sotto entro 30 minuti.",
    bounce:
      "Non siamo riusciti a consegnare l’email di conferma a {{email}}. Controlla l’indirizzo o usane un altro.",
    bouncePolicy:
      "Il tuo provider ha bloccato il nostro messaggio. Gli account di lavoro e di scuola spesso rifiutano la posta da mittenti esterni. Usa un altro indirizzo.",
    bounceMailboxMissing:
      "Il tuo provider ci segnala che {{email}} non esiste. Controlla l’indirizzo o usane un altro.",
    bounceMailboxFull:
      "La casella di {{email}} è piena. Libera spazio e chiedi un nuovo codice oppure usa un altro indirizzo.",
    invalid:
      "Il codice o il link non è valido oppure è scaduto. Richiedi un nuovo codice.",
    cooldown: "Troppe richieste. Aspetta prima di chiedere un altro codice.",
    domain: "Questo dominio non può ricevere email. Controlla l’indirizzo.",
    sendFailed:
      "Non siamo riusciti a inviare l’email a {{email}}. Controlla l’indirizzo o riprova.",
    done: "Email confermata. Hai effettuato l’accesso.",
    newsletter:
      "Con la conferma attivi anche l’iscrizione alla newsletter che hai richiesto.",
    link: "Conferma la mia email",
    pendingId: "Referenza della firma",
    token: "Email conferma link token",
    callback: "Percorso di ritorno",
    suggestion: "Intendevi {{email}}?",
    expired:
      "La sessione di registrazione è scaduta. Ricomincia per ricevere un nuovo codice.",
    retry: "Ricomincia la registrazione",
  },
  category: "Utenti",

  _components: {
    passwordStrength: {
      label: "Robustezza della password",
      weak: "Debole",
      fair: "Discreta",
      good: "Buona",
      strong: "Forte",
      requirement: {
        minLength: {
          icon: "✗",
          text: "Almeno 8 caratteri",
        },
        uppercase: {
          icon: "✗",
          text: "Almeno una lettera maiuscola",
        },
        lowercase: {
          icon: "✗",
          text: "Almeno una lettera minuscola",
        },
        number: {
          icon: "✗",
          text: "Almeno un numero",
        },
        special: {
          icon: "!",
          text: "Carattere speciale (opzionale, migliora la forza)",
        },
      },
    },
    post: {
      title: "_componenti",
      description: "_componenti endpoint",
      form: {
        title: "Configurazione _components",
        description: "Configurare _parametri dei componenti",
      },
      response: {
        title: "Risposta",
        description: "_componenti dati di risposta",
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
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno del server",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorsa non trovata",
        },
        conflict: {
          title: "Conflitto",
          description: "I dati sono in conflitto",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Operazione completata",
      },
    },
  },
  title: "Registrazione utente",
  titleShort: "Registrati",
  description: "Finalpoint di registrazione utente",
  tag: "Autenticazione",
  form: {
    title: "Crea il tuo account",
    description: "Ogni modello. Le tue regole. Libero di iniziare.",
  },
  actions: {
    submit: "Invia il codice di conferma",
    submitting: "Invio del codice...",
  },
  fields: {
    privateName: {
      label: "Nome privato",
      description: "Quello che ti chiama lo AI. Mai mostrato a nessun altro.",
      placeholder: "ad es. Alex:",
      validation: {
        required: "Il nome privato è richiesto",
        minLength: "Il nome deve essere almeno 2 caratteri",
        maxLength: "Il nome deve essere inferiore a 100 caratteri",
      },
    },
    publicName: {
      label: "Nome pubblico",
      description: "Mostrato in chat e forum condivisi.",
      placeholder: "ad esempio alex_builds",
      validation: {
        required: "Il nome dell'esposizione è richiesto",
        minLength: "Il nome dell'esposizione deve essere almeno 2 caratteri",
        maxLength:
          "Il nome dell'esposizione deve essere inferiore a 100 caratteri",
      },
    },
    email: {
      label: "Email",
      description: "Solo per il login. Mai condiviso.",
      placeholder: "you@example.com",
      help: "Questo sarà il vostro email di login e metodo di contatto primario",
      validation: {
        required: "E-mail è richiesta",
        invalid: "Si prega di inserire un indirizzo email valido",
      },
    },
    password: {
      label: "Password",
      description:
        "8+ caratteri con superiore, inferiore e un numero. Conservare al sicuro: la crittografia end-to-end sta arrivando, e un reset sarà poi cancellare la tua storia.",
      placeholder: "Crea una password",
      validation: {
        required: "La password è richiesta",
        minLength: "La password deve avere almeno 8 caratteri",
        complexity:
          "La password deve contenere maiuscole, minuscole e un numero",
      },
    },
    confirmPassword: {
      label: "Conferma la password",
      validation: {
        required: "Conferma la tua password",
        minLength: "La password deve avere almeno 8 caratteri",
        mismatch: "Le password non coincidono",
      },
    },
    subscribeToNewsletter: {
      label:
        "Iscriviti alla newsletter per ricevere crediti extra gratis ogni mese",
      description:
        "Conferma il tuo indirizzo per attivare il bonus mensile della newsletter.",
      checkboxLabel:
        "Iscriviti alla newsletter e ricevi +{{credits}} crediti gratis ogni mese",
      hint: "Nuovi modelli e novità ogni poche settimane. Puoi disiscriverti quando vuoi.",
      tooltip:
        "Conferma la tua email per ricevere {{credits}} crediti extra ogni mese, {{total}} in tutto, finché resti iscritto.",
    },
    acceptTerms: {
      label: "Accetto i termini e le condizioni",
      description:
        "I nostri termini e condizioni rispettano la tua libertà e la tua privacy.",
      termsLink: "termini",
      conditionsLink: "condizioni",
      descriptionPrefix: "I nostri",
      descriptionAnd: "e",
      descriptionSuffix: "rispettano la tua libertà e la tua privacy.",
      validation: {
        required: "Per continuare, accetta i termini e le condizioni",
      },
    },
    referralCode: {
      label: "Codice invito (facoltativo)",
      description:
        "Hai ricevuto il codice da un amico? Riceverà un premio quando ti abboni.",
      placeholder: "Inserisci il codice",
      labelPrefilled: "Codice invito",
      subscriptionBonus:
        "+{{credits}} crediti bonus con il tuo primo abbonamento.",
      descriptionPrefilled:
        "Chi ti ha invitato riceve un premio quando crei il tuo account.",
      validation: {
        invalid:
          "Il codice invito non esiste o non è più attivo. Correggilo o lascia il campo vuoto.",
      },
    },
    supportedSkillId: {
      label: "Sostieni un creator",
      description:
        "Con la tua registrazione, chi ha creato questa skill riceve un bonus del 5% sui tuoi abbonamenti.",
      selectorTitle: "Sostieni un creator",
      selectorDescription:
        "Hai aggiunto ai preferiti alcune skill di creator indipendenti. Scegli chi sostenere: riceverà il 5% in più sui tuoi abbonamenti. Puoi cambiare scelta quando vuoi.",
      selectorNone: "Nessuno (salta)",
    },
    localFavorites: {
      label: "Preferiti locali",
    },
  },

  footer: {
    alreadyHaveAccount: "Hai già un account? Accedi",
  },
  errors: {
    title: "Errore di registrazione",
    validation: {
      title: "Errore di convalida",
      description: "Si prega di controllare il vostro input e riprovare",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per continuare",
    },
    server: {
      title: "Errore del server",
      description: "Si è verificato un errore interno del server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    conflict: {
      title: "Conflitto dell'account",
      description: "Esiste già un account con questa email",
      detail: "Esiste già un account con questa email. Accedi.",
    },
    disposableEmail: {
      title: "Serve un indirizzo email permanente",
      detail:
        "Non puoi registrarti con un indirizzo temporaneo. Usa un indirizzo email permanente.",
    },
    subnetSignupLimit: {
      title: "Troppe registrazioni dalla tua rete",
      detail:
        "Oggi sono stati creati troppi account dalla tua rete. Riprova domani o accedi a un account esistente.",
    },
    userNotFound: "Nessun account trovato per {{email}}",
    forbidden: {
      title: "Accesso negato",
      description: "Accesso negato",
    },
    network: {
      title: "Errore di rete",
      description: "Si è verificato un errore di rete",
    },
    notFound: {
      title: "Non trovato",
      description: "Risorsa non trovata",
    },
    unsaved: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    autoLoginFailed:
      "L’account è stato creato, ma l’accesso automatico non è riuscito. Accedi con la nuova password.",
    internal: {
      title: "Iscrizione non riuscita per {{email}}: {{error}}",
      description: "Si è verificato un errore interno",
    },
  },
  emailCheck: {
    title: "Email Disponibilità Check",
    description: "Controllare se l'email è disponibile per la registrazione",
    tag: "Controllo email",
    fields: {
      email: {
        label: "Indirizzo email",
        description: "E-mail da controllare",
        placeholder: "Inserisci l'indirizzo email",
        validation: {
          invalid: "Formato e-mail non valido",
        },
      },
    },
    response: {
      title: "Email Check Risposta",
      description: "Verificare il risultato della disponibilità",
      available: "E-mail disponibile",
      message: "Messaggio di disponibilità",
    },
    errors: {
      validation: {
        title: "E-mail non valida",
        description: "Si prega di inserire un indirizzo email valido",
      },
      internal: {
        title: "Non poteva controllare {{email}}: {{error}}",
        description: "Controllare l'errore e la disponibilità",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      conflict: {
        title: "Indirizzo email già in uso",
        description: "Questa e-mail è già registrata",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di controllare questa email",
      },
      network: {
        title: "Errore di rete",
        description:
          "Errore di rete si è verificato durante il controllo e-mail",
      },
      notFound: {
        title: "Servizio non trovato",
        description: "Il servizio di email check non è disponibile",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per controllare e-mail",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Verifica dell’indirizzo completata",
      description: "La disponibilità e-mail verificata con successo",
    },
  },
  post: {
    title: "Firma",
    description: "Punto di arrivo dell'iscrizione",
    form: {
      title: "Configurazione di registrazione",
      description: "Configurare i parametri di registrazione",
    },
    response: {
      title: "Risposta",
      description: "Dati di risposta all'iscrizione",
      success: "Registrazione Successo",
      message: "Messaggio di stato",
      userId: "Utente ID",
      nextSteps: "Prossimo passo",
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
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
      processing: "Registrazione di elaborazione con successo",
    },
  },
  response: {
    title: "Risposta",
    description: "Dati di risposta all'iscrizione",
    success: "Registrazione Successo",
    message: "Messaggio di stato",
    user: {
      id: "Utente ID",
      email: "Indirizzo email",
      firstName: "Nome",
      lastName: "Ultimo nome",
      privateName: "Nome privato",
      publicName: "Nome pubblico",
      imageUrl: "Immagine del profilo URL",
      verificationRequired: "Verifica richiesta",
    },
    verificationInfo: {
      title: "Verifica Email",
      description: "Dettagli sul processo di verifica e-mail",
      emailSent: "Invia un'email",
      expiresAt: "Escursione di verifica",
      checkSpamFolder: "Controllare la cartella Spam",
    },
    nextSteps: "Prossimo passo",
  },
  success: {
    title: "Controlla la posta",
    description: "Inserisci il codice ricevuto via email.",
  },
  admin_notification: {
    title: "Nuova acquisizione utente",
    subject: "Nuova registrazione di {{privateName}}",
    preview: "{{privateName}} si è appena registrato",
    message: "C’è un nuovo utente su {{appName}}",
    privateName: "Nome privato",
    publicName: "Nome pubblico",
    email: "Email",
    locale: "Lingua",
    creditBalance: "Saldo crediti",
    leadCreditBalance: "Saldo crediti del lead",
    signup_preferences: "Preferenze di iscrizione",
    user_details: "Dettagli utente",
    basic_information: "Informazioni di base",
    signup_type: "Tipo di iscrizione",
    direct_signup: "Registrazione diretta",
    newsletter: "Newsletter",
    subscribed: "Iscritto",
    not_subscribed: "Non sottoscritto",
    signup_details: "Dettagli di iscrizione",
    signup_date: "Data di iscrizione",
    user_id: "Utente ID",
    recommended_next_steps: "Prossimo passo consigliato",
    direct_recommendation:
      "Verifica profilo utente e configurazione di pagamento",
    contact_user: "Contatta l'utente",
    footer: "Notifica automatica di {{appName}}",
  },
  email: {
    subject: "Ci sei. {{appName}} è pronto per te",
    previewText:
      "Ciao {{privateName}}, il tuo account è pronto. Chatta con Claude, GPT, Gemini, DeepSeek e altri {{modelCount}} modelli. Gratis, senza carta di credito.",
    headline: "La tua IA ti aspetta.",
    greeting: "Ciao {{privateName}},",
    intro:
      "Benvenuto su {{appName}}. Tutto quello che apprezzi di ChatGPT, più modelli open source e senza filtri sui contenuti. Un solo account, tutto nello stesso posto.",
    models: {
      title: "{{modelCount}} modelli in 3 categorie",
      mainstream: "Convenzionale",
      open: "Open source",
      uncensored: "Senza censura",
    },
    free: {
      title: "Cosa hai gratis, per sempre:",
      credits:
        "{{freeCreditsSignedIn}} crediti gratis ogni mese, più {{freeCreditsNewsletterBonus}} con la newsletter. Non serve una carta.",
      allModels: "Accesso a tutti i {{modelCount}} modelli di IA",
      uncensored: "Modelli senza censura che rispondono alle tue domande",
      chatModes: "Chat private, in incognito, condivise e pubbliche",
      noCard: "Nessuna carta di credito. Mai.",
    },
    verify: {
      note: "I crediti gratuiti si attivano quando confermi questo indirizzo.",
      cta: "Conferma l’email e ottieni {{freeCreditsSignedIn}} crediti",
    },
    ctaButton: "Inizia a chattare",
    upgrade: {
      title: "Vuoi di più?",
      desc: "I piani partono da {{subscriptionPrice}} al mese per {{subscriptionCredits}} crediti e arrivano a {{ultraCredits}} crediti per {{ultraPrice}}. Con un abbonamento puoi acquistare pacchetti di crediti senza scadenza.",
      cta: "Scopri i piani",
    },
    signoff: "Buone chat,\nIl team di {{appName}}",
    ps: "P.S. Con la modalità in incognito, le conversazioni restano solo sul tuo dispositivo. Non le salviamo mai sui nostri server. Per motivi tecnici, i contenuti multimediali generati vengono salvati temporaneamente.",
  },
  emailTemplates: {
    welcome: {
      name: "Email di benvenuto",
      description:
        "Email di benvenuto inviata agli utenti dopo la registrazione di successo",
      category: "Autenticazione",
      preview: {
        privateName: {
          label: "Nome privato",
          description: "Il nome privato dell'utente",
        },
        userId: {
          label: "Utente ID",
          description: "L'identificatore unico dell'utente",
        },
        leadId: {
          label: "ID del contatto",
          description: "L'identificatore di contatto dell'utente",
        },
      },
    },
    adminSignup: {
      name: "Notifica di iscrizione di Admin Email",
      description:
        "Email inviata agli amministratori quando un nuovo utente registra",
      category: "Administration",
      preview: {
        privateName: {
          label: "Nome privato",
        },
        publicName: {
          label: "Nome pubblico",
        },
        email: {
          label: "Indirizzo email",
        },
        userId: {
          label: "Utente ID",
        },
        subscribeToNewsletter: {
          label: "Abbonamento Newsletter",
        },
      },
    },
  },
};
