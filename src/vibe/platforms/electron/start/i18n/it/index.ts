import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronStart: "Avvio di elettroni",
  },
  post: {
    title: "Avviare Electron App",
    titleShort: "Avviare elettroni",
    description:
      "Compile principale/preload e lanciare la finestra desktop Electron (modalità di uscita - nessun imballaggio)",
    form: {
      title: "Configurazione di avvio di Electron",
      description: "Configurare l'avvio dell'app Electron",
    },
    response: {
      title: "Risposta",
      description: "Avviare i dati di risposta",
    },
    fields: {
      port: {
        title: "Port",
        description:
          "Portare il server dell'atmosfera viene eseguito su (default: 3000)",
      },
      vibeStart: {
        title: "Avviare l'atmosfera",
        description:
          "L'atmosfera di spawn inizia sullo sfondo prima di aprire la finestra",
      },
      success: {
        title: "Operazione riuscita",
      },
      output: {
        title: "Produzione",
      },
      duration: {
        title: "Durata (m)",
      },
      errors: {
        title: "Errori",
      },
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
        compileFailed: "Electron compilazione fallita: {{error}}",
        startFailed: "Avvio di elettroni fallito: {{error}}",
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
      description: "App Electron avviata",
    },
  },
};
