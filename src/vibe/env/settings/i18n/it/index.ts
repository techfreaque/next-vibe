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
    openSetup: "Apri la configurazione",
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
    title: "Benvenuto in Vibe Setup",
    subtitle: "Tre passaggi veloci e sei già in chat.",
    alreadyConfigured: "Già configurato",
    stepOf: "Passaggio {{step}} di {{total}}",
    next: "Avanti",
    continue: "Continua",
    back: "Indietro",
    skip: "Salta questo passaggio",
    finish: "Completa la configurazione",
    restart: "Riavvia la procedura guidata",
    done: "Configurazione completata",
    doneSubtitle:
      "La tua istanza è pronta. Puoi cambiare ogni impostazione in seguito da Visualizza tutte le impostazioni.",
    goToSettings: "Vai a tutte le impostazioni",
    startChatting: "Inizia a chattare",
    viewAllSettings: "Visualizza tutte le impostazioni",
    encryptionNote: "Salvato cifrato. Nessuno può rileggerlo in chiaro.",
    autoGeneratedNote: "Generato per te. Tienilo o incolla il tuo.",
    steps: {
      admin: "Account amministratore",
      database: "Database",
      security: "Chiavi di sicurezza",
      ai: "Provider IA",
    },
    ai: {
      claudeCodeTitle: "Claude Code (rilevato su questo computer)",
      claudeCodeDescription:
        "Usa la tua sessione locale di Claude CLI. Nessuna chiave API.",
      claudeDetected:
        "Claude CLI trovato. Verifica di aver fatto l'accesso con `claude login`.",
      claudeNotDetected:
        "Claude CLI non trovato. Installalo da claude.ai/code ed esegui `claude login`, oppure scegli un'altra opzione in questa pagina.",
      claudeInstallHint:
        "Facoltativo. Il tuo account unbottled.ai o una chiave OpenRouter vanno benissimo.",
      openRouterTitle: "Chiave API OpenRouter",
      openRouterDescription:
        "Centinaia di modelli con una sola chiave. Da sola o insieme a Claude Code.",
      openRouterHint:
        "Prendi una chiave su openrouter.ai/keys. I modelli gratuiti non chiedono la carta di credito.",
      recommended: "Consigliato",
      unbottledTitle: "Il tuo account unbottled.ai",
      unbottledDescription:
        "Accedi una volta e questa istanza ha tutti i modelli di unbottled.ai. Le chat restano nel tuo database, l'uso dei modelli scala dai tuoi crediti. Serve un piano a pagamento o un pacchetto di crediti.",
      unbottledNoAccount:
        "Non hai ancora un account? Crealo su unbottled.ai, poi accedi qui.",
      unbottledConnected: "Connesso a {{url}}",
      unbottledDisconnected: "Non connesso",
      unbottledSignIn: "Accedi",
      unbottledSigningIn: "Accesso in corso...",
      unbottledDisconnect: "Disconnetti",
      unbottledEmail: "Email",
      unbottledPassword: "Password",
      unbottledRemoteUrl: "URL del cloud",
      unbottledLoginFailed: "Accesso non riuscito. Controlla email e password.",
      unbottledConnectionError: "Server non raggiungibile. Controlla l'URL.",
      orDivider: "Oppure usa il tuo provider",
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
