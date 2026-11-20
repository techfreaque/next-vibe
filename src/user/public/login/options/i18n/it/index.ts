import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",

  title: "Opzioni di accesso",
  titleShort: "Opzioni di accesso",
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
    socialAuthDescription: "Accedi con i tuoi account sui social media",
    continueWithProvider: "Continua con {{provider}}",
    twoFactorRequired: "Maggiore sicurezza: richiesta 2FA",
    standardSecurity: "Requisiti di sicurezza standard",
    tryPasswordFirst: "Prova prima password login",
    useSocialLogin: "Utilizzare il login sociale",
    socialLoginFaster: "Social login è più veloce per i nuovi utenti",
  },
};
