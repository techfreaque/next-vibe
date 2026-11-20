import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",

  errors: {
    readFailed: "Non è possibile leggere le impostazioni del sistema",
    writeFailed: "Non è riuscito a scrivere le impostazioni al file.env",
    readOnly: "La configurazione è di sola lettura in questo ambiente",
    defaultPasswordDetected: "Password di amministratore predefinita rilevata",
    passwordNotConfigured: "Password di amministratore non configurata",
  },

  messages: {
    settingsUpdated: "Impostazioni aggiornate",
  },

  get: {
    title: "Impostazioni di sistema",
    titleShort: "Impostazioni di sistema",
    description:
      "Visualizza e gestisci la configurazione dell'ambiente raggruppata per modulo",
    tags: {
      settings: "Impostazioni",
    },
    response: {
      modules: {
        title: "Moduli di configurazione",
      },
      isWritable: {
        title: "Facilissimo",
      },
      isDevMode: {
        title: "Modalità Dev",
      },
      needsOnboarding: {
        title: "Necessità di bordo",
      },
      onboardingIssues: {
        title: "Problemi di bordo",
      },
      wizardSteps: {
        title: "Procedura guidata di configurazione",
      },
    },
    success: {
      title: "Impostazioni Caricate",
      description: "Impostazioni ambientali recuperate con successo",
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
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      notFound: {
        title: "Non trovato",
        description: "Impostazioni non trovate",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      server: {
        title: "Errore del server",
        description: "Non riuscita a caricare le impostazioni",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
  },

  patch: {
    title: "Impostazioni di aggiornamento",
    titleShort: "Impostazioni di aggiornamento",
    description:
      "Aggiornare i valori di configurazione dell'ambiente nel file.env",
    tags: {
      settings: "Impostazioni",
    },
    fields: {
      settings: {
        label: "Impostazioni",
        description: "Coppie di valore chiave per l'aggiornamento",
      },
    },
    response: {
      updated: {
        title: "Tasti aggiornate",
      },
      needsRestart: {
        title: "Bisogno di riavviare",
      },
      resultMessage: {
        title: "Impostazioni aggiornate",
      },
    },
    success: {
      title: "Impostazioni salvate",
      description: "Impostazioni ambientali aggiornate con successo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Valori delle impostazioni non valide",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      notFound: {
        title: "Non trovato",
        description: "Impostazioni non trovate",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      server: {
        title: "Errore del server",
        description: "Non riuscita a salvare le impostazioni",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
  },

  widget: {
    title: "Configurazione del sistema",
    subtitle: "Variabili ambientali raggruppate per modulo",
    readOnlyBanner:
      "La configurazione è in sola lettura. Modificare il file.env direttamente o utilizzare lo CLI.",
    onboardingBanner:
      "Impostazione richiesta - configurare i campi evidenziati per iniziare.",
    defaultPasswordWarning:
      "Password di amministrazione predefinita rilevata! Cambialo subito.",
    cancel: "Annulla",
    save: "Salvare le modifiche",
    saving: "Salvare...",
    apply: "Applicare e riavviare",
    applying: "Applicare...",
    saved: "Impostazioni salvate con successo",
    restartRequired:
      "Impostazioni salvate. È necessario un riavvio per applicare le modifiche.",
    devRestartHint:
      "Riavviare il server dev (Ctrl+C quindi eseguire vibe dev) per applicare le modifiche.",
    notSet: "non impostato",
    configured: "Configurato",
    partial: "Parziale",
    notConfigured: "Non configurato",
    required: "Obbligatorio",
    selectPlaceholder: "Seleziona...",
    boolTrue: "su",
    boolFalse: "Fuori.",
    logPathDisabled: "file di registrazione disabilitato",
    restartWizard: "Creazione guidata",
    exportProd: "Esportazione per la produzione",
    generate: "Generazione",
    editConfirmHint: "[Enter] confermare [Esc] cancellare",
    editSettings: "Modifica delle impostazioni",
    exit: "Uscita",
    loading: "Impostazioni di caricamento...",
    moduleLabels: {
      env: "Core",
      agent: "Fornitori di IA",
      leadsCampaigns: "Campagne di piombo",
      messenger: "Messaggero / SMTP",
      imap: "IMAP",
      payment: "Pagamenti",
      sms: "SMS",
      serverSystem: "Server / Piattaforma",
    },
  },

  wizard: {
    title: "Benvenuti a Vibe Setup",
    subtitle: "Configurate la vostra istanza in pochi passi.",
    alreadyConfigured: "Già configurato",
    stepOf: "Passo {{step}} di {{total}}",
    next: "Avanti",
    continue: "Continua",
    back: "Indietro",
    skip: "Salta questo passaggio",
    finish: "Impostazione di finitura",
    restart: "Riavviare la procedura guidata",
    done: "Setup completo",
    doneSubtitle:
      "La tua istanza e' pronta. È sempre possibile aggiornare le impostazioni in seguito.",
    goToSettings: "Vai a Impostazioni complete",
    viewAllSettings: "Visualizza tutte le impostazioni",
    encryptionNote:
      "Questo valore sarà crittografato e memorizzato in modo sicuro - non sarà mai leggibile in testo semplice.",
    autoGeneratedNote:
      "Auto-generato - sicuro da usare as-is, o sostituire con il proprio valore.",
    steps: {
      admin: "Conto di amministrazione",
      database: "Database",
      security: "Keys di sicurezza",
      ai: "Fornitore di AI",
    },
    ai: {
      claudeCodeTitle: "Codice Claude (Auto-detected)",
      claudeCodeDescription:
        "Utilizza la sessione Claude CLI locale - senza chiave API necessaria. Aggiungi OpenRouter qui sotto per accedere a 200+ modelli aggiuntivi.",
      claudeDetected:
        "Claude CLI rilevato! Assicurati di aver effettuato l'accesso con `claude login`.",
      claudeNotDetected:
        "Claude CLI non trovato. Installarlo da claude.ai /code, quindi eseguire `claude login`. Oppure saltare e utilizzare OpenRouter di seguito.",
      claudeInstallHint:
        "Opzionale - è possibile utilizzare OpenRouter o altri fornitori invece.",
      openRouterTitle: "Chiave OpenRouter API",
      openRouterDescription:
        "Accedere a ogni modello OpenRouter AI (GPT-4, Claude, Llama, e altro ancora). Funziona a fianco del Codice Claude o da solo.",
      openRouterHint:
        "Ottieni la chiave API gratuita a openrouter.ai /keys - nessuna carta di credito richiesta per i modelli gratuiti.",
      unbottledTitle: "Unbottled AI Cloud",
      unbottledDescription:
        "Accedi a unbottled.ai per accedere a tutti i modelli AI senza gestire le chiavi API. La tua istanza auto-hosted relays attraverso il cloud.",
      unbottledConnected: "Collegato a {{url}}",
      unbottledDisconnected: "Non collegato",
      unbottledSignIn: "Accedi",
      unbottledSigningIn: "Firma in...",
      unbottledDisconnect: "Scollegamento",
      unbottledEmail: "Email",
      unbottledPassword: "Password",
      unbottledRemoteUrl: "Cloud URL",
      unbottledLoginFailed:
        "Login fallito - controlla la tua email e password.",
      unbottledConnectionError:
        "Non è possibile raggiungere il server. Controllare la URL.",
    },
  },

  post: {
    title: "Accedi a unbottled.ai",
    titleShort: "Registrazione",
    description:
      "login proxy lato server. le credenziali non lasciano mai il server",
    tags: { settings: "Registrazione" },
    fields: {
      email: {
        label: "Email",
        description: "E-mail dell'account unbottled.ai",
        placeholder: "you@example.com",
      },
      password: {
        label: "Password",
        description: "Password account unbottled.ai",
        placeholder: "Password",
      },
      remoteUrl: {
        label: "URL remoto",
        description: "istanza unbottled.ai URL",
        placeholder: "https://unbottled.ai",
      },
      credential: {
        label: "Credenziali",
        description: "stringa di credenziali codificata",
      },
      syncScope: {
        label: "Sync Scope",
        description: "Quali dati si sincronizzano su questa connessione.",
      },
    },
    success: { title: "Firmato", description: "Credenziali recuperati" },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla email, password e URL",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      notFound: {
        title: "Non trovato",
        description: "Account o sessione non trovati",
      },
      network: {
        title: "Connessione non riuscita",
        description: "Non è possibile raggiungere l'istanza remota",
      },
      server: {
        title: "Accesso non riuscito",
        description: "E-mail sbagliato o password",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
  },

  export: {
    title: "Esportazione per la produzione",
    subtitle:
      "Generare un file.env pronto per l'implementazione sul server. I valori sensibili sono visualizzati in testo normale - mantenere questo file sicuro.",
    copyButton: "Copia a Appunti",
    copied: "Copiato!",
    downloadButton: "Scarica.env.prod",
    instructions:
      "Copiare questo file sul server:\nscp.env.prod user@yourserver:/app/.env\nO incollare manualmente:\nssh user@yourserver && nano /app/.env",
    checklist: "Elenco di controllo",
    close: "Chiudi",
  },
};
