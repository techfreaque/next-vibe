import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    missingUrlParam:
      "Parametro URL mancante {{paramName}} per endpoint {{endpoint}}",
    urlConstructionFailed: "La costruzione di URL è fallita: {{error}}",
    validationFailed: "Mancata convalida: {{error}}",
    htmlResponseReceived:
      "La risposta HTML ha ricevuto invece di JSON da {{url}} (status {{status}}). Controllare che il server API sia in esecuzione e l'endpoint esiste.",
    networkError: "Errore di rete si è verificato: {{error}}",
    failedToLoadPage: "Non caricare la pagina",
  },
  generate: {
    post: {
      title: "Generare gli indici di Expo",
      titleShort: "Indici di Expo",
      description:
        "Generare wrapper di compatibilità Router Expo per le pagine Next.js",
      response: {
        fields: {
          success: "Operazione riuscita",
          created: "File creati",
          skipped: "File saltati",
          errors: "Errori",
          message: "Messaggio",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Non sei autorizzato a eseguire questa azione",
        },
        server: {
          title: "Errore del server",
          description:
            "Si è verificato un errore durante la generazione di indici",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di eseguire questa azione",
        },
        notFound: {
          title: "Non trovato",
          description: "Directory sorgente non trovata",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        conflict: {
          title: "Conflitto",
          description: "Si è verificato un conflitto",
        },
      },
      success: {
        title: "Operazione riuscita",
        description:
          "Generato file {{created}}, ignorato file {{skipped}}, errori {{errors}}",
      },
    },
  },
};
