import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guardia di sistema",

  title: "Ferma la guardia",
  titleShort: "Ferma la guardia",
  description: "Interrompere gli ambienti di guardia per i progetti VSCode",
  tag: "guard",

  container: {
    title: "Configurazione della guardia di arresto",
    description: "Configurare i parametri per fermare gli ambienti di guardia",
  },

  fields: {
    projectPath: {
      title: "Percorso del progetto",
      description: "Percorso alla directory del progetto",
      placeholder: "/percorso/percorso/progetto",
    },
    guardId: {
      title: "Guardia ID",
      description: "Protezione specifica ID per fermare",
      placeholder: "guard_project_abc123",
    },
    username: {
      title: "Nome utente",
    },
    wasRunning: {
      title: "Correre",
    },
    nowRunning: {
      title: "Ora correte",
    },
    pid: {
      title: "Processo ID",
    },
    forceStopped: {
      title: "Forza bloccata",
    },
    stopAll: {
      title: "Fermare tutte le guardie",
      description:
        "Interrompere tutti gli ambienti di protezione in esecuzione",
    },
    force: {
      title: "Forza!",
      description: "La forza si ferma anche se la guardia non risponde",
    },
    success: {
      title: "Successo dell'operazione",
    },
    output: {
      title: "Uscita del comando",
    },
    stoppedGuards: {
      title: "Guardie bloccate",
    },
    totalStopped: {
      title: "Totale bloccato",
    },
  },

  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Parametri della richiesta non validi",
    },
    internal: {
      title: "Errore interno",
      description: "Si è verificato un errore interno del server",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per continuare",
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
    missingTarget:
      "Errore di convalida: specificare projectPath, guardId  o stopAll.",
    stopFailed: "Errore interno durante l'arresto della guardia: {{detail}}",
  },

  success: {
    title: "Operazione riuscita",
    description: "operazione di arresto della guardia completata con successo",
  },
};
