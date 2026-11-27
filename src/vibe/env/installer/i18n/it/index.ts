import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Installa {{appName}}",
    description:
      "Stato dell'installazione locale e configurazione facoltativa del repository GitHub privato.",
  },
  enums: {
    stepStatus: {
      done: "Pronto",
      inProgress: "In corso",
      pending: "In attesa",
      skipped: "Saltato",
      error: "Richiede attenzione",
    },
    action: {
      refresh: "Ricontrolla stato",
      githubAuthStart: "Accedi con GitHub",
      githubAuthCheck: "Verifica accesso GitHub",
      githubCreatePrivateRepo: "Crea repository privato",
      githubSkip: "Salta GitHub",
      githubReset: "Configura GitHub",
    },
    checkoutMode: {
      cloned: "Nuovo clone",
      existing: "Cartella esistente preservata",
      unknown: "Checkout locale",
    },
  },
  get: {
    title: "Stato dell'installer",
    titleShort: "Installer",
    description:
      "Controlla lo stato dell'installazione locale, della cartella progetto e dell'opzione GitHub.",
    tags: {
      installer: "Installer",
    },
    success: {
      title: "Stato caricato",
      description: "Stato locale dell'installazione recuperato.",
    },
    response: {
      installDir: { title: "Cartella di installazione" },
      os: { title: "Sistema operativo" },
      arch: { title: "Architettura" },
      checkoutMode: { title: "Modalità checkout" },
      branch: { title: "Branch Git" },
      originUrl: { title: "Remote origin" },
      upstreamUrl: { title: "Remote upstream" },
      port: { title: "Porta locale" },
      stateFilePath: { title: "File di stato" },
      updatedAt: { title: "Ultimo aggiornamento" },
      lastError: { title: "Ultimo errore" },
      steps: { title: "Passaggi di installazione" },
      github: { title: "Stato GitHub" },
      setup: { title: "Stato configurazione" },
    },
    errors: {
      validation: {
        title: "Errore di validazione",
        description: "Richiesta di stato non valida.",
      },
      unauthorized: {
        title: "Non autorizzato",
        description: "Autenticazione richiesta.",
      },
      forbidden: {
        title: "Solo locale",
        description:
          "L'installer è disponibile solo su un'istanza locale al primo avvio.",
      },
      notFound: {
        title: "Non trovato",
        description: "Stato dell'installer non trovato.",
      },
      network: {
        title: "Errore di rete",
        description: "Richiesta di rete non riuscita.",
      },
      server: {
        title: "Errore del server",
        description: "Impossibile leggere lo stato locale dell'installazione.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto.",
      },
      unsavedChanges: {
        title: "Conflitto",
        description: "Lo stato è cambiato durante la lettura.",
      },
      conflict: {
        title: "Conflitto",
        description: "Conflitto nello stato dell'installer.",
      },
    },
  },
  post: {
    title: "Esegui azione installer",
    titleShort: "Azione installer",
    description:
      "Aggiorna i controlli locali o configura il repository GitHub privato.",
    tags: {
      installer: "Installer",
    },
    request: {
      action: {
        label: "Azione",
        description: "Azione dell'installer da eseguire.",
      },
      repoName: {
        label: "Nome del repository privato",
        description: "Nome del repository sul tuo account GitHub.",
        placeholder: "next-vibe-private",
      },
    },
    response: {
      actionMessage: { title: "Risultato azione" },
    },
    success: {
      title: "Azione completata",
      description: "Azione dell'installer completata.",
    },
    errors: {
      validation: {
        title: "Errore di validazione",
        description: "Azione o nome del repository non valido.",
      },
      unauthorized: {
        title: "Non autorizzato",
        description: "Autenticazione richiesta.",
      },
      forbidden: {
        title: "Solo locale",
        description:
          "Le azioni dell'installer sono disponibili solo in locale.",
      },
      notFound: {
        title: "Non trovato",
        description: "Strumento locale richiesto non trovato.",
      },
      network: {
        title: "Errore di rete",
        description:
          "Impossibile contattare GitHub. Controlla la connessione e riprova.",
      },
      server: {
        title: "Errore del server",
        description: "Azione dell'installer non riuscita.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto.",
      },
      unsavedChanges: {
        title: "Conflitto",
        description: "Lo stato è cambiato durante l'operazione.",
      },
      conflict: {
        title: "Repository già esistente",
        description: "Conflitto sul repository GitHub.",
      },
    },
  },
  errors: {
    localOnly:
      "L'installer è disponibile solo su un'istanza locale al primo avvio.",
    invalidRepoName:
      "Usa lettere, numeri, punti, trattini o trattini bassi (massimo 100 caratteri).",
    ghNotInstalled:
      "GitHub CLI (gh) non è installata su questa macchina. Segui i passaggi manuali sotto oppure salta.",
    ghAuthStartFailed:
      "Impossibile avviare l'accesso dispositivo GitHub. Esegui 'gh auth login --web' nel terminale oppure usa i passaggi manuali.",
    ghNotSignedIn: "Accedi prima a GitHub, poi riprova.",
    ghCreateFailed:
      "Impossibile creare o inviare al repository GitHub privato. Controlla i permessi GitHub e riprova.",
  },
  actions: {
    refreshed: "Controlli dell'ambiente aggiornati.",
    githubAuthPending:
      "Inserisci il codice monouso su GitHub, poi clicca Verifica accesso.",
    githubAuthReady: "Accesso GitHub effettuato come {{username}}.",
    githubAuthWaiting:
      "In attesa del completamento dell'accesso GitHub nel browser.",
    githubRepoCreated: "Repository privato collegato e sincronizzato.",
    githubSkipped:
      "Configurazione GitHub saltata. Puoi collegare un repository in seguito.",
    githubReset: "Configurazione GitHub riaperta.",
  },
  widget: {
    progressOf: "{{done}} di {{total}} passaggi pronti",
    title: "La tua installazione locale è pronta.",
    titleIncomplete: "Completa l'installazione locale",
    subtitle:
      "next-vibe è già attivo sul tuo computer. Collega facoltativamente un repository GitHub privato, poi continua nella procedura di configurazione.",
    subtitleIncomplete:
      "Controlla i passaggi qui sotto, risolvi gli elementi evidenziati e continua nella procedura di configurazione.",
    checkoutLabel: "Cartella",
    stateFileLabel: "File di stato",
    recheck: "Ricontrolla",
    rechecking: "Controllo...",
    copy: "Copia",
    copied: "Copiato",
    steps: {
      git: {
        title: "Git",
        missingDetail: "Git non trovato nel PATH.",
        missingRecovery:
          "Installa git, apri un nuovo terminale e rilancia l'installer.",
      },
      bun: {
        title: "Runtime Bun",
        missingDetail: "Bun non trovato nel PATH.",
        missingRecovery:
          "Installa Bun da https://bun.sh e rilancia l'installer.",
      },
      clone: {
        title: "Checkout next-vibe",
        clonedDetail: "Clonato in {{dir}}",
        existingDetail: "Checkout esistente preservato in {{dir}}",
        unknownDetail: "In esecuzione da {{dir}}",
      },
      dependencies: {
        title: "Dipendenze e CLI",
        readyDetail: "Pacchetti installati e vibe CLI pronto.",
        missingDetail: "node_modules è incompleto.",
        missingRecovery: "Esegui 'bun install' nella cartella del progetto.",
      },
      github: {
        title: "Repository GitHub privato",
        optionalTag: "Facoltativo",
        connectedDetail: "Origin punta a {{url}}",
        skippedDetail:
          "Saltato per ora. Gli aggiornamenti arrivano comunque da next-vibe.",
        pendingDetail: "Facoltativo. Tieni la tua copia privata su GitHub.",
      },
      server: {
        title: "Server locale",
        readyDetail: "Attivo su http://localhost:{{port}}",
      },
    },
    githubCard: {
      title: "Repository GitHub privato",
      badge: "Facoltativo",
      body: "Crea il tuo repository privato per mantenere riservate le tue modifiche su GitHub, lasciando upstream collegato a next-vibe per gli aggiornamenti.",
      connectedTitle: "Repository privato collegato",
      connectedOpen: "Apri su GitHub",
      skippedNotice:
        "Configurazione GitHub saltata. Puoi collegare un repository privato quando preferisci.",
      reopenButton: "Configura GitHub",
      skipButton: "Salta per ora",
      signedInAs: "Accesso GitHub effettuato come {{username}}",
      repoNameLabel: "Nome del repository privato",
      repoNameHelp:
        "Creato come repository privato sul tuo account GitHub. Upstream resta collegato a next-vibe.",
      createButton: "Crea repository privato",
      creatingButton: "Creazione e invio...",
      signInButton: "Accedi con GitHub",
      startingSignIn: "Avvio accesso...",
      deviceTitle: "Approva l'accesso su GitHub",
      deviceBody:
        "Copia il codice monouso qui sotto, apri la pagina dispositivo di GitHub e approva l'accesso. Questa pagina non salva token.",
      deviceOpenLink: "Apri pagina dispositivo GitHub",
      deviceCheckButton: "Ho effettuato l'accesso, ricontrolla",
      manualTitle: "Configurazione manuale (senza GitHub CLI)",
      manualBody:
        "GitHub CLI (gh) non è installata. Crea un repository privato vuoto su GitHub ed esegui questi tre comandi nella cartella del progetto.",
      manualNewRepoLink: "Crea un repository privato su GitHub",
      manualShowCommands: "Mostra comandi git",
      manualHideCommands: "Nascondi comandi git",
    },
    handover: {
      continueToSetup: "Continua nella configurazione guidata",
      openApp: "Apri l'app",
      hint: "Prossimo passo: imposta l'accesso admin e collega il tuo account unbottled.ai o le tue chiavi API.",
      completeHint:
        "La configurazione iniziale è già completa su questa istanza.",
    },
  },
};
