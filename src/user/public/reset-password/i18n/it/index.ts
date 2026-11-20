import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: {
    category: "Utenti",

    title: "Conferma il ripristino della password",
    titleShort: "Conferma ripristino",
    description:
      "Confermare il ripristino della password con una nuova password",
    tag: "Ripristino della password",
    email: {
      title: "Password ripristinata",
      subject: "Password ripristinata su {{appName}}",
      previewText:
        "Hai ripristinato la password di {{appName}}. Accedi per chattare con {{modelCount}} modelli di IA.",
      greeting: "Ciao {{name}},",
      successMessage:
        "La tua password è stata ripristinata. Accedi e riprendi da dove eri rimasto.",
      loginButton: "Accedi a {{appName}}",
      promoText: "{{modelCount}} modelli di IA. Zero filtri. Zero prediche.",
      securityWarning:
        "Non hai chiesto tu il ripristino? Contatta subito l’assistenza. Il tuo account potrebbe essere a rischio.",
    },
    groups: {
      verification: {
        title: "Verifica",
        description: "Verifica la richiesta di ripristino della password",
      },
      newPassword: {
        title: "Nuova password",
        description: "Imposta la nuova password",
      },
    },
    fields: {
      token: {
        label: "Token di ripristino",
        description: "Il token di reset della password dalla tua email",
        placeholder: "Inserisci il token di reset",
        help: "Controlla la tua email per il token di reset della password e inseriscila qui",
        validation: {
          required: "Reset token è necessario",
        },
      },
      email: {
        label: "Indirizzo email",
        description: "Il tuo indirizzo email",
        placeholder: "Inserisci il tuo indirizzo email",
        validation: {
          invalid: "Si prega di inserire un indirizzo email valido",
        },
      },
      password: {
        label: "Nuova password",
        description: "La nuova password",
        placeholder: "Inserisci nuova password",
        help: "Scegliere una password forte con almeno 8 caratteri tra cui lettere, numeri e simboli",
        validation: {
          minLength: "La password deve essere lunga almeno 8 caratteri",
        },
      },
      confirmPassword: {
        label: "Confermare la password",
        description: "Conferma la tua nuova password",
        placeholder: "Confermare la nuova password",
        validation: {
          minLength: "La password deve essere lunga almeno 8 caratteri",
        },
      },
    },
    validation: {
      passwords: {
        mismatch: "Le password non coincidono",
      },
    },
    response: {
      title: "Riattiva risposta password",
      description: "Rispondere alla conferma della password",
      message: {
        label: "Messaggio",
        description: "Messaggio di risposta",
      },
      securityTip:
        "Considerare l'attivazione dell'autenticazione a due fattori per una migliore sicurezza",
      nextSteps: [
        "Accedi con la nuova password",
        "Aggiorna le password salvate nel tuo browser",
        "Considerare l'abilitazione 2FA per una maggiore sicurezza",
      ],
    },
    errors: {
      title: "Errore di ripristino della password",
      no_email: "Nessun account trovato con quell'indirizzo email",
      validation: {
        title: "Errore di convalida",
        description: "Si prega di controllare il vostro input e riprovare",
        passwordsDoNotMatch: "Le password non coincidono",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Token di reset non valido o scaduto",
      },
      internal: {
        title: "Errore del server",
        description: "Si è verificato un errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di connessione di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di eseguire questa azione",
      },
      notFound: {
        title: "Non trovato",
        description: "Reset token non trovato o scaduto",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante l'elaborazione della vostra richiesta",
      },
    },
    success: {
      title: "Password ripristinata",
      description: "La tua password è stata ripristinata con successo",
      message: "La password è stata ripristinata con successo",
      password_reset: "La tua password è stata ripristinata con successo",
    },
    actions: {
      requestNewLink: "Richiedi un nuovo link di reset",
    },
    emailTemplates: {
      confirm: {
        name: "Email di conferma del ripristino della password",
        description:
          "Email inviata agli utenti dopo che la password è stata ripristinata con successo",
        category: "Autenticazione",
        preview: {
          publicName: {
            label: "Nome pubblico",
            description: "Il nome del display pubblico dell'utente",
          },
          userId: {
            label: "Utente ID",
            description: "L'identificatore unico dell'utente",
          },
        },
      },
    },
  },
  request: {
    category: "Utenti",
    title: "Reimpostare la richiesta di password",
    titleShort: "Ripristina la password",
    description: "Richiedi il ripristino della password",
    tag: "Ripristino della password",
    ui: {
      title: "Ripristina la password",
      subtitle:
        "Inserisci la tua email. Ti invieremo un link per ripristinare la password.",
      sendResetLink: "Invia link di ripristino",
      alreadyHaveAccount: "Hai già un account? Accedi",
    },
    actions: {
      submitting: "Invio in corso…",
    },
    email: {
      title: "Ripristina la tua password di {{appName}}",
      subject: "Richiesta di ripristino della password di {{appName}}",
      previewText:
        "Ripristina la tua password di {{appName}}. Il link è valido per {{hours}} ore.",
      greeting: "Ciao {{name}},",
      requestInfo:
        "Abbiamo ricevuto una richiesta di ripristino della password per il tuo account {{appName}}. Se l’hai inviata tu, usa il pulsante qui sotto.",
      buttonText: "Ripristina la mia password",
      expirationInfo:
        "Il link scade tra {{hours}} ore. Se non hai inviato tu la richiesta, ignora questa email. La tua password resta la stessa.",
      signoff: "Il team di {{appName}}",
      promoText: "{{modelCount}} modelli di IA. Zero filtri. Zero prediche.",
    },
    groups: {
      emailInput: {
        title: "Indirizzo email",
        description:
          "Inserisci il tuo indirizzo e-mail per ricevere le istruzioni di reset",
      },
    },
    fields: {
      email: {
        label: "Email",
        description: "Inserisci il tuo indirizzo email",
        placeholder: "you@example.com",
        help: "Inserisci l'indirizzo email associato al tuo account",
        validation: {
          invalid: "Si prega di inserire un indirizzo email valido",
        },
      },
    },
    response: {
      title: "Reimpostare la risposta richiesta",
      description: "Risposta della richiesta di ripristino della password",
      success: {
        message: "Link di ripristino inviato",
      },
      deliveryInfo: {
        estimatedTime: "entro 5 minuti",
        expiresAt: "4 ore da ora",
      },
      nextSteps: {
        checkEmail: "Controlla la cartella posta e-mail e spam",
        clickLink: "Fare clic sul link di reset nell'e-mail",
        createPassword: "Creare una nuova password sicura",
      },
    },
    errors: {
      title: "Errore",
      validation: {
        title: "Errore di convalida",
        description: "Input non valido fornito",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Richiesta non autorizzata",
      },
      internal: {
        title: "Errore interno",
        description: "Errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di connessione di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Le modifiche non sono state salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
      no_email: "Nessun account trovato con quell'indirizzo email",
      email_generation_failed: "Non generare e-mail",
    },
    success: {
      title: "Richiesta inviata",
      description: "Richiesta di ripristino della password inviata",
    },
    post: {
      title: "Richiesta",
      description: "Richiedi il punto finale",
      form: {
        title: "Richiesta di configurazione",
        description: "Configurare i parametri di richiesta",
      },
      response: {
        title: "Risposta",
        description: "Richiedi i dati di risposta",
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
    emailTemplates: {
      request: {
        name: "Email con il link per ripristinare la password",
        description:
          "Email inviata agli utenti con un link per ripristinare la password",
        category: "Autenticazione",
        preview: {
          publicName: {
            label: "Nome pubblico",
            description: "Il nome del display pubblico dell'utente",
          },
          userId: {
            label: "Utente ID",
            description: "L'identificatore unico dell'utente",
          },
          passwordResetUrl: {
            label: "Password Reset URL",
            description: "URL per il ripristino della password",
          },
        },
      },
    },
  },
  validate: {
    category: "Utenti",

    title: "Convalida Reset Password Token",
    titleShort: "Convalida Token",
    description: "Convalida password reset token endpoint",
    tag: "Convalida di ripristino della password",
    groups: {
      tokenInput: {
        title: "Convalida dei token",
        description:
          "Immettere il token di reset della password per convalidare",
      },
    },
    fields: {
      token: {
        label: "Token di ripristino",
        description: "Password reset token da email",
        placeholder: "Inserisci il token di reset",
        help: "Inserisci il token che hai ricevuto nella tua email",
        validation: {
          required: "Reset token è necessario",
        },
      },
    },
    response: {
      title: "Risultato di convalida",
      description: "Risposta di convalida token",
      valid: "Convalida di token",
      message: "Messaggio di convalida",
      validationMessage: "Reset token validazione completata",
      userId: "Utente ID",
      expiresAt: "Scade Token a",
      nextSteps: {
        item: "Prossimo passo dopo la convalida",
        setPassword: "Procedere per impostare la nuova password",
        choosePassword: "Scegli una password forte e unica",
      },
    },
    errors: {
      title: "Errore",
      validation: {
        title: "Errore di convalida",
        description: "La validazione di Token è fallita",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Token non valido o scaduto",
      },
      internal: {
        title: "Errore interno",
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
        description: "Token non trovato",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Rilevamento delle modifiche non rilevate",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
    },
    success: {
      title: "Convalida di token",
      description: "Password reset token è valido",
    },
    post: {
      title: "Convalida",
      description: "Valida il punto finale",
      form: {
        title: "Configurazione valida",
        description: "Configurare i parametri di convalida",
      },
      response: {
        title: "Risposta",
        description: "Convalida dei dati di risposta",
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
  actions: {
    back: "Indietro",
    submit: "Invia",
    submitting: "Invio in corso...",
  },
  success: {
    password_reset: "La password è stata ripristinata con successo.",
  },
  errors: {
    tokenValidationFailed: "La validazione di Token è fallita",
    userLookupFailed: "Non riuscito a cercare l'utente",
    tokenDeletionFailed: "Non è riuscito a eliminare token",
    userDeletionFailed: "Non riuscita a eliminare l'utente",
    resetFailed: "Ripristino della password non riuscito",
    tokenCreationFailed: "Non è riuscito a creare il token di reset",
    noDataReturned: "Il database non ha restituito dati",
    tokenInvalid: "Il token di reset non è valido",
    tokenExpired: "Reset token è scaduto",
    tokenVerificationFailed: "La verifica del token è fallita",
    userNotFound: "Utente non trovato",
    passwordUpdateFailed: "Non è stato possibile aggiornare la password",
    passwordResetFailed: "Ripristino della password non riuscito",
    requestFailed: "Reimpostare la richiesta fallita",
    emailMismatch: "Email non corrisponde",
    confirmationFailed: "Conferma del ripristino della password non riuscita",
  },
};
