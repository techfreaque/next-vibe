import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronBuild: "Costruzione di elettroni",
  },
  post: {
    title: "Costruire l'app Electron",
    titleShort: "Costruire elettroni",
    description:
      "Compile principale / precarico con bun, eseguire la costruzione dell'atmosfera, quindi pacchetto con elettrone-builder",
    form: {
      title: "Configurazione di Electron Build",
      description: "Configurare i parametri di costruzione Electron",
    },
    response: {
      title: "Risposta",
      description: "Costruire i dati di risposta",
    },
    fields: {
      viBuild: {
        title: "Eseguire la costruzione dell'atmosfera",
        description:
          "Eseguire la costruzione di vibrazioni (Next.js + migrazioni) prima dell'imballaggio",
      },
      generate: {
        title: "Genera i punti finali",
        description: "Rigenerare l'indice di endpoint prima della costruzione",
      },
      platform: {
        title: "Piattaforma di destinazione",
        description: "Quale piattaforma per il pacchetto",
        options: {
          current: "Corrente OS",
          linux: "Linux",
          mac: "macOS",
          win: "Finestre",
          all: "Tutte le piattaforme",
        },
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
        viBuildFailed: "vibe build fail: {{error}}",
        compileFailed: "Electron compilazione fallita: {{error}}",
        builderFailed: "elettroni-costruttore fallito: {{error}}",
        buildFailed: "Electron build fail: {{error}}",
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
      description: "App Electron costruita con successo",
    },
  },
};
