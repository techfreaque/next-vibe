import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  pages: {
    error: {
      title: "C'e' qualcosa che non va!",
      message: "Ci dispiace, ma e' successo qualcosa di inaspettato.",
      errorId: "Errore ID: {{id}}",
      error_message: "Errore: {{message}}",
      stackTrace: "Traccia: {{stack}}",
      tryAgain: "Prova di nuovo",
      backToHome: "Torna a casa",
    },
    frame: {
      endpointNotFound: 'Endpoint " {{endpointId}} " non trovato',
      endpointLoadFailed: "Non caricate l'endpoint",
    },
    notFound: {
      title: "Pagina non trovata",
      description: "La pagina che stai cercando non esiste o è stata spostata.",
      goBack: "Torna indietro",
      goHome: "Vai a casa",
    },
  },
  meta: {
    title: "404: Pagina non trovata",
    category: "Errore",
    description: "La pagina che stai cercando non esiste",
    imageAlt: "404: Errore non trovato",
    keywords: "404, non trovato, errore",
  },
  post: {
    title: "[...notFound]",
    description: "[... notFound]",
    form: {
      title: "[...notFound] Configurazione",
      description: "Configurare i parametri [...notfound]",
    },
    response: {
      title: "Risposta",
      description: "[... notFound] dati di risposta",
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
};
