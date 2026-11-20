import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Start Guard",
  titleShort: "Start Guard",
  description: "Avviare ambienti di guardia per progetti VSCode",
  tag: "Inizio",
  category: "Protezione",
  container: {
    title: "Avviare la configurazione",
    description: "Configurare i parametri di avvio della guardia",
  },
  fields: {
    projectPath: {
      title: "Percorso del progetto",
      description: "Percorso al progetto VSCode",
      placeholder: "/home/user/projects/my-project",
    },
    guardId: {
      title: "Guardia ID",
      description: "Identificatore unico per l'ambiente di guardia",
      placeholder: "guard_my_project_abc123",
    },
    startAll: {
      title: "Avviare tutte le guardie",
      description: "Avviare tutti gli ambienti di guardia disponibili",
    },
    totalStarted: {
      title: "Totale Iniziato",
    },
    output: {
      title: "Produzione",
    },
    startedGuards: {
      columns: {
        username: "Nome utente",
        projectPath: "Percorso del progetto",
      },
    },
    summary: {
      title: "Riepilogo",
    },
    status: {
      title: "Stato",
    },
    hasIssues: {
      title: "Ha problemi",
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
    internal: {
      title: "Errore interno",
      description: "Si è verificato un errore interno del server",
    },
    notFound: {
      title: "Non trovato",
      description: "Ambiente di protezione non trovato",
    },
    conflict: {
      title: "Conflitto",
      description: "Ambiente di protezione già iniziato",
    },
    jailSetupFailed:
      "Impostazione della prigione di guardia guasto: {{detail}}",
    vscodeSetupFailed:
      "Configurazione di integrazione VSCode fallita: {{detail}}",
    startFailed: "Errore interno durante l'avvio della guardia: {{detail}}",
    guardIdLookupUnsupported:
      "Il lookup by guard ID non è ancora implementato - utilizzare il percorso di progetto invece.",
    notAVscodeProject:
      "Guard richiede un progetto VSCode - no directory.vscode in {{projectPath}}",
  },
  success: {
    title: "Operazione riuscita",
    description: "La guardia ha iniziato con successo",
  },
};
