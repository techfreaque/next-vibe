import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Esegui il comando",
    titleShort: "Comando",
    description:
      "Eseguire un comando shell su una macchina. Funziona solo su /ssh/ percorsi. Terminale persistente. cwd porta avanti tra le chiamate. Se configurate, si avviano nuove sessioni nella directory di mount predefinita.",
    dynamicTitle: "{{path}}: {{command}}",
    status: {
      loading: "Correre...",
      done: "Fatto",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Macchina per la produzione",
        description:
          'Percorso macchina SSH. Deve iniziare con /ssh/. Utilizzare cortex-list (path="/ssh") per trovare macchine e i loro supporti.',
      },
      command: {
        label: "Comando",
        description: "Comando Shell per eseguire",
        placeholder: "echo ciao",
      },
      workingDir: {
        label: "Elenco di lavoro",
        description:
          "Override cwd per questo comando. Se omesso, utilizza la directory corrente del terminale.",
        placeholder: "/home/utente/progetto",
      },
      terminalId: {
        label: "Terminal ID",
        description:
          "Riutilizzare una sessione terminale specifica. Se omesso, utilizza il terminale predefinito per questa connessione.",
      },
      timeoutMs: {
        label: "Timeout (ms)",
        description: "Esecuzione massima. Predefinito 30000ms. Max 300000ms.",
        placeholder: "30000",
      },
    },
    submitButton: {
      label: "Corri!",
      loadingText: "Correre...",
    },
    response: {
      output: { content: "Produzione" },
      exitCode: { title: "Codice di uscita" },
      cwd: { content: "Elenco di lavoro" },
      terminalId: { content: "Terminal ID" },
      backend: { title: "Backend" },
      truncated: { title: "Truncated" },
    },
    errors: {
      validation: {
        title: "Bad Input",
        description: "Controllare il percorso e il comando",
      },
      network: {
        title: "Offline",
        description: "Non riesco a raggiungere il server",
      },
      unauthorized: {
        title: "Non è stato registrato",
        description: "Accedi per primo",
      },
      forbidden: {
        title: "Nessun accesso",
        description: "Nessun permesso per questa macchina",
      },
      notFound: {
        title: "Macchina non trovata",
        description:
          "Nessuna connessione SSH o istanza remota in questo percorso",
      },
      server: {
        title: "Exec non è riuscito",
        description: "Esecuzione del comando fallita",
      },
      unknown: { title: "Errore", description: "Qualcosa è andato storto" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare o scartare prima",
      },
      conflict: {
        title: "Conflitto di sessione",
        description: "La sessione del terminal è impegnata",
      },
    },
    success: {
      title: "Comando completo",
      description: "Comando eseguito",
    },
  },
  errors: {
    invalidWorkingDir:
      "La directory di lavoro deve essere un percorso assoluto senza '.'",
    commandTimedOut: "Comando time out",
    invalidPath: "Il percorso deve iniziare con /ssh/",
    noConnection: "Nessun collegamento trovato in questo percorso",
    connectionNotFound: "Connessione non trovata",
    encryptionFailed:
      "Crittografia fallita - JWT_SECRET_KEY può essere invalido",
    connectTimeout: "Connessione time-out",
    sshAuthFailed: "L'autenticazione SSH non è riuscita",
    sshConnectionFailed: "connessione SSH guasto",
    fingerprintMismatch:
      "Cambiata l'impronta dell'host - possibile rischio di sicurezza. Eliminare e ri-add la connessione.",
    remoteNotSupported:
      "La connessione remota exec non è ancora supportata. Utilizzare una connessione SSH diretta.",
  },
  log: {
    execComplete: "Comando eseguito",
    openedLocal: "Terminale locale aperto",
    failedLocal: "Non è riuscito ad aprire il terminal locale",
    openedSsh: "Terminale SSH aperto",
    failedFingerprint: "Non riuscito a salvare l'impronta digitale",
    failedPty: "Non aprire SSH PTY",
    escalated: "Comando a lungo termine escalato al compito di sfondo",
  },
  widget: {
    title: "Terminal",
    back: "Indietro",
    machineLabel: "Macchina per la produzione",
    machinePlaceholder: "/ssh/local-machine",
    placeholder: "Digitare un comando...",
    runButton: "Corri!",
    running: "Correre...",
    clearButton: "Azzera",
    ctrlEnterHint: "Ctrl+Enter in esecuzione",
    exitCodeLabel: "Codice di uscita",
    backendLabel: "Backend",
    cwdLabel: "Elenco di lavoro",
    terminalLabel: "Terminal",
    truncatedWarning: "Produzione troncata",
    emptyOutput: "Nessuna uscita",
    outputLabel: "L'output appare qui",
    outputTitle: "Produzione",
    historyTitle: "Storia",
    noHistory: "Nessun comando ancora",
    manageConnections: "Connessioni",
    viewTerminals: "Terminali",
    successStatus: "Operazione riuscita",
    failedStatus: "Sfigato",
    picker: {
      browse: "Sfoglia",
      cancel: "Annulla",
      machinesTitle: "Scegli una macchina",
      machines: "Macchine",
      loading: "Caricamento...",
      noMachines: "Nessuna macchina configurata",
      defaultBadge: "Predefinito",
      useDir: "Utilizzare questa directory",
      emptyDir: "Directory vuota",
    },
  },
};
