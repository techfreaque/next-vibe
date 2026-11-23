import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",
  title: "Bentornato",
  titleShort: "Accedi",
  description:
    "Accedi ai modelli AI non censurati e alla cronologia delle tue conversazioni.",
  tag: "Autenticazione",
  options: {
    category: "Utenti",

    title: "Opzioni di accesso",
    description: "Opzioni di configurazione del login",
    tag: "login-opzioni",
    container: {
      title: "Configurazione del login",
      description: "Configurare le impostazioni e le opzioni di login",
    },
    fields: {
      email: {
        label: "Indirizzo email",
        description: "Inserisci il tuo indirizzo email",
        placeholder: "your@email.com",
      },
      allowPasswordAuth: {
        label: "Consentire l'autenticazione della password",
        description: "Abilitare l'autenticazione basata su password",
      },
      allowSocialAuth: {
        label: "Consentire l'autenticazione sociale",
        description: "Abilitare l'autenticazione dei fornitori sociali",
      },
      maxAttempts: {
        label: "Tentazioni di accesso massimo",
        description: "Numero massimo di tentativi di login consentiti",
      },
      requireTwoFactor: {
        label: "Richiedere l'autenticazione a due fattori",
        description: "Richiedere 2FA per il login dell'utente",
      },
      socialProviders: {
        label: "Fornitori sociali",
        description: "Fornitori di autenticazione sociale disponibili",
      },
      socialProvider: {
        title: "Fornitore sociale",
        description: "Configurazione del fornitore di autenticazione sociale",
        enabled: {
          label: "Abilitato",
          description: "Se questo fornitore è abilitato",
        },
        name: {
          label: "Nome del fornitore",
          description: "Nome del fornitore sociale",
        },
        providers: {
          label: "Opzioni del fornitore",
          description: "Opzioni di social provider disponibili",
        },
      },
    },
    response: {
      title: "Opzioni di Login",
      description: "Opzioni di configurazione di login disponibili",
      success: {
        badge: "Operazione riuscita",
      },
      message: {
        content: "Messaggio di stato",
      },
      forUser: {
        content: "Indirizzo email",
      },
      loginMethods: {
        title: "Metodi di Login",
        description: "Metodi di autenticazione disponibili",
        password: {
          title: "Password Login",
          description: "Autenticazione della password standard",
          enabled: {
            badge: "Abilitato",
          },
        },
        social: {
          title: "Social Login",
          description: "Opzioni di autenticazione dei social media",
          enabled: {
            badge: "Abilitato",
          },
          providers: {
            item: {
              title: "Fornitore sociale",
              description: "Fornitore di autenticazione sociale",
            },
            name: {
              content: "Nome del fornitore",
            },
            id: {
              content: "Provider ID",
            },
            enabled: {
              badge: "Disponibile",
            },
            description: "Descrizione del fornitore",
          },
        },
      },
      security: {
        title: "Impostazioni di sicurezza",
        description: "Requisiti di sicurezza di autenticazione",
        maxAttempts: {
          content: "Tentazioni di accesso massimo",
        },
        requireTwoFactor: {
          badge: "2FA richiesto",
        },
      },
      recommendations: {
        item: "Opzione di accesso consigliata",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
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
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Le modifiche non sono state salvate",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Opzioni di accesso recuperate con successo",
    },
    post: {
      title: "Opzioni di accesso",
      description: "Ottieni le opzioni di login disponibili",
      response: {
        title: "Opzioni di Login",
        description: "Opzioni di configurazione di login disponibili",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
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
          description: "Si è verificato un errore sconosciuto",
        },
      },
      success: {
        description: "Opzioni di accesso recuperate con successo",
      },
    },
    enums: {
      socialProviders: {
        google: "Google",
        github: "GitHub",
        facebook: "Facebook",
      },
    },
    messages: {
      successMessage: "Opzioni di accesso recuperate con successo",
      passwordAuthDescription: "Accedi con email e password",
      socialAuthDescription:
        "Il social login non è ancora disponibile. Utilizzare e-mail e password.",
      continueWithProvider: "Continua con {{provider}}",
      twoFactorRequired: "Maggiore sicurezza: richiesta 2FA",
      standardSecurity: "Requisiti di sicurezza standard",
      tryPasswordFirst: "Prova prima password login",
      useSocialLogin: "Utilizzare il login sociale",
      socialLoginFaster: "Social login è più veloce per i nuovi utenti",
    },
  },
  actions: {
    submit: "Accedi",
    submitting: "Logging in...",
  },
  fields: {
    email: {
      label: "La tua email",
      description: "L'email con cui ti sei iscritto.",
      placeholder: "Inserisci la tua email",
      validation: {
        required: "E-mail è richiesta",
        invalid: "Inserisci un indirizzo email valido",
      },
    },
    password: {
      label: "La tua password",
      description: "Inserisci la password impostata durante l'iscrizione.",
      placeholder: "Inserisci la password",
      help: "Inserisci la password del tuo account",
      validation: {
        required: "La password è richiesta",
        minLength: "La password deve essere lunga almeno 8 caratteri",
      },
    },
    twoFactorCode: {
      label: "Codice di autenticazione",
      description: "Utilizzare il codice app o un codice di recupero.",
      placeholder: "Codice a 6 cifre",
    },
    rememberMe: {
      label: "Continua a leggere",
    },
  },
  twoFactorStep: {
    title: "Controllo a due passi",
    helper: "Inserisci il codice a 6 cifre dalla tua app di autenticatore.",
    recoveryHelper:
      "Inserisci uno dei tuoi codici di recupero. Ogni opera una volta.",
    codeLabel: "Codice di autenticazione",
    recoveryLabel: "Codice di recupero",
    recoveryPlaceholder: "XXXXX-XXXXX",
    useRecovery: "Usa un codice di recupero",
    useApp: "Usa l’app di autenticazione",
    verify: "Verifica",
    verifying: "Verificare...",
    back: "Indietro",
  },
  groups: {
    credentials: {
      title: "Credenziali di Login",
      description: "Inserisci le informazioni di login",
    },
    options: {
      title: "Opzioni di accesso",
      description: "Ulteriori preferenze di login e impostazioni",
    },
    preferences: {
      title: "Preferenze di accesso",
      description: "Ulteriori opzioni di login",
    },
    advanced: {
      title: "Opzioni avanzate",
      description: "Impostazioni di login avanzate",
    },
  },
  footer: {
    forgotPassword: "Password dimenticata?",
    createAccount: "Non hai un account? Registrati",
  },
  response: {
    title: "Risposta del Login",
    description: "Dati di risposta del login",
    success: "Accesso riuscito",
    message: "Messaggio di stato",
    user: {
      title: "Dettagli utente",
      description: "Registrato nelle informazioni dell'utente",
      id: "ID utente",
      email: "Indirizzo email",
      firstName: "Nome",
      lastName: "Ultimo nome",
      privateName: "Nome privato",
      publicName: "Nome pubblico",
      imageUrl: "Immagine del profilo",
    },
    sessionInfo: {
      title: "Informazioni di sessione",
      description: "Dettagli della sessione utente",
      expiresAt: "Scadenza della sessione",
      rememberMeActive: "Stato dell’opzione di accesso continuato",
      loginLocation: "Luogo di accesso",
    },
    nextSteps: {
      title: "Prossimo passo",
      item: "Prossimo passo",
    },
  },
  errors: {
    title: "Errore di accesso",
    account_suspended:
      "Account sospeso. Se pensi che sia un errore, contatta l’assistenza.",
    account_locked:
      "Troppi tentativi falliti. Aspetta 15 minuti o ripristina la password. Non hai ancora un account? Registrati.",
    accountLocked: "L'account è bloccato",
    accountLockedDescription:
      "Il tuo account è bloccato. Contatta l’assistenza.",
    pendingEmail: "Conferma l’email prima di accedere.",
    resendPending: "Invia di nuovo l’email di conferma",
    invalid_credentials:
      "Email o password errata. Non hai ancora un account? Registrati.",
    two_factor_required: "Serve l’autenticazione a due fattori",
    invalid_two_factor_code: "Codice di autenticazione non valido",
    auth_error: "Autenticazione non riuscita per {{email}}: {{error}}",
    user_not_found: "Nessun utente trovato per {{userId}}",
    session_creation_failed:
      "Non è possibile creare una sessione per {{userId}}: {{error}}",
    token_save_failed: "Impossibile salvare il token di autenticazione",
    validation: {
      title: "Convalida non riuscita",
      description: "Controlla i dati inseriti",
    },
    unauthorized: {
      title: "Accesso non riuscito",
      description: "credenziali non valide",
    },
    unknown: {
      title: "Errore di accesso",
      description: "Un errore si è verificato durante il login",
    },
    network: {
      title: "Errore di rete",
      description: "La connessione non è riuscita",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Accesso non consentito",
    },
    notFound: {
      title: "Utente non trovato",
      description: "account utente non trovato",
    },
    unsaved: {
      title: "Modifiche non salvate",
      description: "Le modifiche non sono state salvate",
    },
    conflict: {
      title: "Accedi a Conflict",
      description: "Rilevato conflitto di accesso",
    },
    server: {
      title: "Errore del server",
      description: "Si è verificato un errore interno del server",
    },
  },
  success: {
    title: "Accesso riuscito",
    description: "Sei stato registrato",
    message: "Bentornato! Hai effettuato l'accesso.",
  },
  token: {
    save: {
      failed: "Impossibile salvare il token di autenticazione",
      success: "Token di autenticazione salvato con successo",
    },
  },
  process: {
    failed: "Processo di log-in fallito",
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
  dev: {
    quickLogin: "Dev Quick Login",
  },
};
