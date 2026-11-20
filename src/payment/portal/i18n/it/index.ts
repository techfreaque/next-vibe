import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  success: {
    created: "Sessione del portale clienti creata con successo",
  },
  post: {
    title: "Portale clienti",
    titleShort: "Portale clienti",
    description:
      "Crea sessione del portale clienti per la gestione delle fatture",
    form: {
      title: "Configurazione del portale",
      description: "Configurare i parametri del portale clienti",
    },
    returnUrl: {
      label: "Ritorno URL",
      description: "URL per reindirizzare dopo la sessione del portale",
      placeholder: "https://example.com/dashboard",
    },
    response: {
      success: "Sessione del portale creata con successo",
      message: "Messaggio di stato",
      customerPortalUrl: "Portale clienti URL",
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
        detail: "Impossibile aprire il portale di fatturazione: {{error}}",
        portalNotConfigured:
          "Il Portale clienti Stripe non è ancora configurato. Configurarlo a https://dashboard.stripe.com/test/settings/billing/portal",
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
        noStripeCustomer:
          "Nessun record di clienti Stripe esiste per il tuo account",
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
};
