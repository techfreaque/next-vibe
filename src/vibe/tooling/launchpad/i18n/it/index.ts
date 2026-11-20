import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Esecutore di rilascio",

  errors: {
    configNotLoaded:
      "Configurazione non caricata. Si prega di caricare prima la configurazione.",
    configFileNotFound: "File di configurazione non trovato: {{path}}",
    configFileNotFoundInParents:
      "File di configurazione ' {{filename}}' non trovato nella directory corrente o in qualsiasi directory dei genitori",
    invalidConfigFormat:
      "Formato di configurazione non valido. Assicurarsi che la configurazione esporta un oggetto predefinito con una proprietà 'pacchetti'.",
    errorLoadingConfig: "Configurazione di caricamento degli errori:",
  },

  releaseExecutor: {
    processing: "\nElaborazione: {{directory}}",
    executing: "Esecuzione: {{command}}",
    completed: "✅ Completato con successo: {{directory}}",
    failed: "Non processato {{directory}}",
    baseCommand: "bun pub release",
    forceUpdateCommand: "bun pub release --force-update",

    state: {
      continuing: "Proseguendo dallo stato precedente...",
      noState: "Nessun stato esistente trovato, iniziando fresco...",
      allCompleted: "Tutti gli obiettivi sono stati elaborati con successo!",
    },

    prompts: {
      retryFailed: "Retry {{count}} ha fallito obiettivi?",
      targetAction: "Cosa vorresti fare con {{directory}}?",
      processTarget: "Elaborare questo obiettivo",
      skipTarget: "Salta questo obiettivo",
      abortOperation: "Intera operazione",
      continueAfterFailure: "Continuare con obiettivi rimanenti?",
    },

    actions: {
      skipped: " ⁇  Skipped: {{directory}}",
      aborted: "Operazione annullata dall'utente",
      stopped: "L'operazione si è fermata a causa di guasto",
      continuing: "Proseguendo con obiettivi rimanenti...",
    },

    summary: {
      title: "\n ⁇  Sintesi finale:",
      allSuccess: " ⁇  Tutti gli obiettivi trattati con successo!",
      failedTargets:
        "Gli obiettivi di {{count}} non sono riusciti. Utilizzare --continua a riprovare.",
    },

    forceUpdate: {
      starting: " ⁇  Rinnovare le dipendenze per tutti gli obiettivi...",
      updating: "\n ⁇  Aggiornamento: {{directory}}",
      updated: "✅ Aggiornato: {{directory}}",
      failed: "Non aggiornato {{directory}}",
      completed:
        " ⁇  Aggiornamento della Forza completato per tutti gli obiettivi!",
    },

    forceRelease: {
      starting:
        " ⁇  Forza che rilascia tutti gli obiettivi con {{versionBump}} versione urto...",
    },

    weeklyUpdate: {
      starting: " ⁇  Avviare il processo di aggiornamento settimanale...",
      targetBranch: "Settore di destinazione: {{branchName}}",
      creatingBranch: " ⁇  Creazione di ramo aggiornamento...",
      gitCheckout:
        "git checkout -b {{branchName}} || git checkout {{branchName}}",
      updatingPackages: " ⁇  Aggiornare tutte le dipendenze del pacchetto...",
      runningSnyk: " ⁇  Controllo della sicurezza in esecuzione Snyk...",
      noChanges:
        " ⁇  Nessun cambiamento rilevato, saltando commit e la creazione PR",
      committing: " ⁇  Commettendo modifiche...",
      pushing: " ⁇  Succursale...",
      gitPush: "git push origin {{branchName}}",
      creatingPR: " ⁇  Creazione/aggiornamento della richiesta di pull...",
      completed: " ⁇  Aggiornamento settimanale completato con successo!",
      failed: "Aggiornamento settimanale fallito:",
    },

    snyk: {
      noCredentials:
        " ⁇  Le credenziali Snyk non sono state trovate, saltando il monitoraggio della sicurezza",
      monitoring: " ⁇  Monitoraggio {{packageName}}...",
      failed:
        "Il monitoraggio Snyk non è riuscito per {{packageFile}}, continua...",
    },

    github: {
      noToken: " ⁇  GITHUB_TOKEN non trovato, saltando la creazione PR",
      prFailed: "La creazione di PR ha fallito, continua...",
      prError: "Errore di creazione PR:",
      prSuccess: "✅ PR creato / aggiornato con successo",
    },

    git: {
      findCommand:
        'find. -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*"',
    },
  },

  cloneMissing: {
    checking: " ⁇  Controllare i repository mancanti...",
    failedToClone: "Normalmente non è possibile clonare {{repoPath}}",
    noMissing: "✅ Nessun deposito mancante trovato",
    success: "✅ Con successo clonato repository {{count}}",
    failed: "Non riuscita a clonare i repository {{count}}:",
    failedRepo: "  - {{repo}}",
  },

  updateAll: {
    updating: " ⁇  Aggiornare tutti i repository...",
    failedClone:
      " ⁇  Non clonare {{repoPath}}, continuando con altri repository...",
    failedUpdate:
      " ⁇  Non è riuscito ad aggiornare {{repoPath}}, continuando con altri repository...",
    clonedSuccess: "✅ Con successo clonato {{count}} depositi mancanti.",
    updatedSuccess:
      "✅ Successamente aggiornato {{count}} repository esistenti.",
    cloneFailed: "Non riuscita a clonare i repository {{count}}:",
    updateFailed: "Non è stato possibile aggiornare i repository {{count}}:",
    failedRepo: "   - {{repo}}",
  },
};
