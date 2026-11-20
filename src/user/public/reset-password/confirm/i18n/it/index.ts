import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",

  title: "Conferma il ripristino della password",
  description: "Confermare il ripristino della password con una nuova password",
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
};
