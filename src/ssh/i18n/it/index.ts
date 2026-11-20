import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",
  type: "SSH",

  enums: {
    authType: {
      password: "Password",
      privateKey: "Chiave privata (PEM)",
      keyAgent: "Agente SSH",
      local: "Macchina locale",
    },
    clusterRole: {
      none: "Nessun ruolo di cluster",
      controlPlane: "Piano di controllo",
      worker: "Worker",
      storage: "Stoccaggio",
    },
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "/usr/sbin/nologin",
    },
  },

  errors: {
    localModeOnly: {
      title: "Solo la modalità locale",
      description: "Questa funzione è disponibile solo in LOCAL_MODE",
    },
    adminOnly: {
      title: "Solo l'amministratore",
      description:
        "Solo gli amministratori possono accedere alle funzionalità della macchina",
    },
    connectionNotFound: "Connessione non trovata",
    sessionNotFound: "Sessione non trovata",
    fileNotFound: "File non trovato",
    directoryNotFound: "Elenco non trovato",
    permissionDenied: "Permesso negato",
    sshSecretKeyNotSet:
      "JWT_SECRET_KEY env var non impostato. Aggiungi un valore esagonale di 32 byte per abilitare la modalità SSH.",
    encryptionFailed:
      "Crittografia fallita - JWT_SECRET_KEY può essere invalido",
    noRowReturned: "Nessuna riga restituita dall'inserto",
    notImplemented: {
      test: "SSH backend non ancora implementato. Non è ancora possibile testare le connessioni remote.",
      local:
        "SSH backend non ancora implementato. Lasciare connectionId vuoto per eseguire localmente.",
      fileList: "SSH backend non ancora implementato per l'elenco dei file",
      fileRead: "SSH backend non ancora implementato per la lettura dei file",
      fileWrite:
        "SSH backend non ancora implementato per la scrittura dei file",
      session:
        "Le sessioni SSH PTY non sono ancora implementate. Utilizzare ssh_exec_POST per comandi remoti.",
    },
    fingerprintMismatch:
      "Le impronte sono cambiate. Potenziale attacco MITM. Utilizzare acknowledgeNewFingerprint =true per procedere.",
    noDefaultConnection:
      "Nessuna connessione SSH predefinita configurata. Creare una connessione e impostarla come predefinito.",
    sshConnectionFailed: "connessione SSH guasto",
    sshAuthFailed: "L'autenticazione SSH non è riuscita",
    connectTimeout: "Connessione time-out",
    invalidWorkingDir:
      "directory di lavoro non valida: deve essere percorso assoluto senza segmenti '.'",
    invalidPath: "percorso non valido: deve essere assoluto senza segmenti '.'",
    parentDirNotFound:
      "Directory principale non trovata. Impostare createDirs =true per crearlo.",
    commandTimedOut: "Comando time out",
    cannotDeleteCurrentUser:
      "Non è possibile eliminare l'utente di processo corrente",
    cannotDeleteSystemUser:
      "Non è possibile eliminare gli utenti di sistema (uid < 1000)",
    userNotFound: "Utente non trovato",
    userAlreadyExists: "L'utente esiste già",
    invalidUsername:
      "Nome utente non valido: deve essere alfanumerico + trattino, a partire da una lettera",
  },

  session: {
    read: {
      get: {
        title: "Leggi l'output sessione SSH",
        description: "L'output buffer di lettura da una sessione attiva SSH",
        fields: {
          sessionId: {
            label: "Sessione ID",
            description: "ID della sessione SSH da leggere",
          },
          waitMs: {
            label: "Aspetta (ms)",
            description: "Millisecondi per attendere l'output",
          },
          maxBytes: {
            label: "Max Bytes",
            description: "Massimo byte da leggere",
          },
        },
        response: {
          output: { title: "Produzione" },
          eof: { title: "EOF" },
          status: { title: "Stato" },
        },
        success: {
          title: "Uscita sessione lettura",
          description: "Uscita di sessione di lettura riuscita",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri di lettura della sessione non valida",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: { title: "Accesso negato", description: "Accesso negato" },
          server: {
            title: "Errore del server",
            description: "Non ha letto l'output della sessione",
          },
          notFound: {
            title: "Sessione non trovata",
            description: "sessione SSH non trovata",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
        },
      },
    },
    close: {
      post: {
        title: "Chiudi sessione SSH",
        description: "Chiudere una sessione SSH attiva",
        fields: {
          sessionId: {
            label: "Sessione ID",
            description: "ID della sessione SSH per chiudere",
          },
        },
        response: {
          ok: { title: "Operazione riuscita" },
        },
        success: {
          title: "Sessione chiusa",
          description: "sessione SSH chiuso con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Prossimi parametri di sessione non valida",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: { title: "Accesso negato", description: "Accesso negato" },
          server: {
            title: "Errore del server",
            description: "Non è riuscito a chiudere la sessione",
          },
          notFound: {
            title: "Sessione non trovata",
            description: "sessione SSH non trovata",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
        },
      },
    },
    write: {
      post: {
        title: "Scrivi a SSH Session",
        description: "Scrivi l'ingresso a una sessione attiva SSH",
        fields: {
          sessionId: {
            label: "Sessione ID",
            description: "ID della sessione SSH per scrivere a",
          },
          input: {
            label: "Input",
            description: "Inserire il testo per inviare alla sessione",
          },
          raw: {
            label: "Raw",
            description: "Invia l'ingresso come byte grezzo senza newline",
          },
        },
        response: {
          ok: { title: "Operazione riuscita" },
        },
        success: {
          title: "Input inviato",
          description: "Input scritto a sessione con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri di scrittura non validi",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: { title: "Accesso negato", description: "Accesso negato" },
          server: {
            title: "Errore del server",
            description: "Non è riuscito a scrivere a sessione",
          },
          notFound: {
            title: "Sessione non trovata",
            description: "sessione SSH non trovata",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
        },
      },
    },
    open: {
      post: {
        title: "Sessione SSH aperta",
        description: "Aprire una sessione interattiva del terminale SSH",
        fields: {
          connectionId: {
            label: "Connessione ID",
            description: "ID della connessione SSH da utilizzare",
          },
          name: {
            label: "Nome della sessione",
            description: "Nome opzionale per la sessione",
          },
          cols: {
            label: "Colonne",
            description: "Larghezza del terminale in colonne",
          },
          rows: {
            label: "Righe",
            description: "Altezza del terminale nelle file",
          },
        },
        disconnected: "Scollegato",
        response: {
          sessionId: { title: "Sessione ID" },
          status: { title: "Stato" },
          shell: { title: "Shell" },
        },
        success: {
          title: "Sessione aperta",
          description: "sessione SSH aperta con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri di sessione non validi",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: { title: "Accesso negato", description: "Accesso negato" },
          server: {
            title: "Errore del server",
            description: "Non ha aperto la sessione",
          },
          notFound: {
            title: "Connessione Non trovata",
            description: "Connessione SSH non trovata",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
        },
      },
    },
  },

  terminal: {
    get: {
      title: "Terminale SSH",
      description: "widget terminale interattivo SSH",
      response: {
        ok: { title: "Terminale pronto" },
      },
      success: {
        title: "Terminale pronto",
        description: "Il terminale SSH è pronto",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        server: {
          title: "Errore del server",
          description: "Errore del terminale",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Rilevamento delle modifiche non rilevate",
        },
        notFound: { title: "Non trovato", description: "Risorsa non trovata" },
        conflict: {
          title: "Conflitto",
          description: "Si è verificato un conflitto",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        validation: {
          title: "Errore di convalida",
          description: "Convalida fallita",
        },
        forbidden: { title: "Accesso negato", description: "Accesso negato" },
      },
    },
  },

  files: {
    read: {
      get: {
        title: "Leggi il file remoto",
        description: "Leggi il contenuto di un file tramite SSH",
        fields: {
          connectionId: {
            label: "Connessione ID",
            description: "Collegamento SSH per l'uso",
            placeholder: "uuid",
          },
          path: {
            label: "Percorso file",
            description: "Percorso assoluto al file",
            placeholder: "/etc/hosts",
          },
          maxBytes: {
            label: "Max Bytes",
            description: "Massimo byte da leggere",
            placeholder: "102400",
          },
          offset: {
            label: "Offset",
            description: "Byte offset per iniziare la lettura da",
            placeholder: "0",
          },
        },
        response: {
          content: { title: "Contenuti" },
          size: { title: "Dimensione" },
          truncated: { title: "Truncated" },
          encoding: { title: "Codifica" },
        },
        success: {
          title: "Informazioni sul file",
          description: "Contenuto file recuperato con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri di lettura del file Invalid",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: { title: "Accesso negato", description: "Accesso negato" },
          server: {
            title: "Errore del server",
            description: "Non ha letto il file",
          },
          notFound: {
            title: "File non trovato",
            description: "File o connessione non trovata",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
        },
      },
    },
    list: {
      get: {
        title: "Elenca i file remoti",
        description: "Elenca i file in una directory remota tramite SSH",
        fields: {
          connectionId: {
            label: "Connessione ID",
            description: "Collegamento SSH per l'uso",
            placeholder: "uuid",
          },
          path: {
            label: "Percorso di directory",
            description: "Percorso assoluto alla directory",
            placeholder: "/",
          },
        },
        response: {
          entries: { title: "Voci" },
          currentPath: { title: "Sentiero attuale" },
        },
        success: {
          title: "Elenco delle liste",
          description: "Contenuto della directory recuperato con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri dell'elenco non valido",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: { title: "Accesso negato", description: "Accesso negato" },
          server: {
            title: "Errore del server",
            description: "Non elencato directory",
          },
          notFound: {
            title: "Non trovato",
            description: "Directory o connessione non trovata",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
        },
      },
    },
    write: {
      post: {
        title: "Scrivere il file remoto",
        description: "Scrivere contenuti in un file tramite SSH",
        fields: {
          connectionId: {
            label: "Connessione ID",
            description: "Collegamento SSH per l'uso",
            placeholder: "uuid",
          },
          path: {
            label: "Percorso file",
            description: "Percorso assoluto per scrivere a",
            placeholder: "/tmp/file.txt",
          },
          content: {
            label: "Contenuti",
            description: "Contenuto per scrivere al file",
            placeholder: "contenuto del file",
          },
          createDirs: {
            label: "Creare Dirs",
            description: "Creare directory genitori se non esistono",
          },
        },
        response: {
          ok: { title: "Operazione riuscita" },
          bytesWritten: { title: "Scritto da Bytes" },
        },
        success: {
          title: "File scritto",
          description: "File scritto con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri di scrittura del file Invalid",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: { title: "Accesso negato", description: "Accesso negato" },
          server: {
            title: "Errore del server",
            description: "Non è riuscito a scrivere file",
          },
          notFound: {
            title: "Non trovato",
            description: "Percorso o collegamento non trovato",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
        },
      },
    },
  },

  linux: {
    users: {
      list: {
        get: {
          title: "Elenco utenti Linux",
          description: "Elenca utenti Linux su un server remoto tramite SSH",
          response: {
            users: { title: "Utenti" },
          },
          success: {
            title: "Utenti elencati",
            description: "Gli utenti Linux recuperati con successo",
          },
          errors: {
            validation: {
              title: "Errore di convalida",
              description: "Convalida fallita",
            },
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Accedi per continuare",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Accesso negato",
            },
            server: {
              title: "Errore del server",
              description: "Non elencare gli utenti",
            },
            notFound: {
              title: "Non trovato",
              description: "Risorsa non trovata",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore imprevisto",
            },
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Rilevamento delle modifiche non rilevate",
            },
            conflict: {
              title: "Conflitto",
              description: "Si è verificato un conflitto",
            },
            network: {
              title: "Errore di rete",
              description: "Si è verificato un errore di rete",
            },
          },
        },
      },
      username: {
        delete: {
          title: "Eliminare l'utente Linux",
          description:
            "Eliminare un utente Linux da un server remoto tramite SSH",
          fields: {
            removeHome: {
              label: "Rimuovi la casa",
              description: "Rimuovere anche la home directory dell'utente",
            },
          },
          response: {
            ok: { title: "Operazione riuscita" },
          },
          success: {
            title: "Utente cancellato",
            description: "utente Linux cancellato con successo",
          },
          errors: {
            validation: {
              title: "Errore di convalida",
              description: "Convalida fallita",
            },
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Accedi per continuare",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Accesso negato",
            },
            server: {
              title: "Errore del server",
              description: "Non riuscita a eliminare l'utente",
            },
            notFound: {
              title: "Utente non trovato",
              description: "utente Linux non trovato",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore imprevisto",
            },
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Rilevamento delle modifiche non rilevate",
            },
            conflict: {
              title: "Conflitto",
              description: "Si è verificato un conflitto",
            },
            network: {
              title: "Errore di rete",
              description: "Si è verificato un errore di rete",
            },
          },
        },
      },
      create: {
        post: {
          title: "Crea un utente Linux",
          description: "Creare un utente Linux su un server remoto tramite SSH",
          fields: {
            username: {
              label: "Nome utente",
              description: "Nome utente per il nuovo account",
              placeholder: "deploy",
            },
            groups: {
              label: "Gruppi",
              description: "Gruppi aggiuntivi per aggiungere l'utente a",
              placeholder: "sudo,docker",
            },
            shell: {
              label: "Shell",
              description: "Login shell per l'utente",
              placeholder: "/bin/bash",
            },
            homeDir: {
              label: "Home Elenco",
              description: "Home directory path",
              placeholder: "/home/deploy",
            },
            sudoAccess: {
              label: "Accesso Sudo",
              description: "Concedere l'accesso sudo all'utente",
            },
          },
          response: {
            ok: { title: "Operazione riuscita" },
            uid: { title: "UID" },
            gid: { title: "GID" },
            homeDirectory: { title: "Home Elenco" },
            shell: { title: "Shell" },
          },
          success: {
            title: "Creato dall'utente",
            description: "utente Linux creato con successo",
          },
          errors: {
            validation: {
              title: "Errore di convalida",
              description: "Convalida fallita",
            },
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Accedi per continuare",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Accesso negato",
            },
            server: {
              title: "Errore del server",
              description: "Non riuscita a creare utente",
            },
            notFound: {
              title: "Non trovato",
              description: "Connessione non trovata",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore imprevisto",
            },
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Rilevamento delle modifiche non rilevate",
            },
            conflict: {
              title: "Conflitto",
              description: "Si è verificato un conflitto",
            },
            network: {
              title: "Errore di rete",
              description: "Si è verificato un errore di rete",
            },
          },
        },
      },
    },
  },

  exec: {
    post: {
      title: "Esegui il comando SSH",
      description: "Eseguire un comando su un server remoto tramite SSH",
      fields: {
        connectionId: {
          label: "Connessione ID",
          description: "Collegamento SSH per l'uso",
          placeholder: "uuid",
        },
        command: {
          label: "Comando",
          description: "Comando per eseguire",
          placeholder: "ls -la",
        },
        workingDir: {
          label: "Elenco di lavoro",
          description: "Directory di lavoro per il comando",
          placeholder: "/home/user",
        },
        timeoutMs: {
          label: "Timeout (ms)",
          description: "Timeout di comando in millisecondi",
          placeholder: "30000",
        },
      },
      response: {
        stdout: { title: "Stdout" },
        stderr: { title: "Stderr" },
        exitCode: { title: "Codice di uscita" },
        status: { title: "Stato" },
        durationMs: { title: "Durata (m)" },
        backend: { title: "Backend" },
        truncated: { title: "Truncated" },
      },
      success: {
        title: "Comando eseguito",
        description: "Comando eseguito con successo",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Parametri di comando non validi",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: { title: "Accesso negato", description: "Accesso negato" },
        server: {
          title: "Errore del server",
          description: "Esecuzione del comando fallita",
        },
        notFound: {
          title: "Connessione Non trovata",
          description: "Connessione SSH non trovata",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Rilevamento delle modifiche non rilevate",
        },
        conflict: {
          title: "Conflitto",
          description: "Si è verificato un conflitto",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
      },
    },
  },

  connections: {
    id: {
      get: {
        title: "Ottieni connessione SSH",
        description: "Ottieni i dettagli di una connessione SSH",
        response: {
          id: { title: "ID" },
          label: { title: "Etichetta" },
          host: { title: "Host" },
          port: { title: "Port" },
          username: { title: "Nome utente" },
          authType: { title: "Tipo di Auth" },
          isDefault: { title: "È predefinito" },
          fingerprint: { title: "Impronte per la stampa" },
          notes: { title: "Osservazioni" },
          createdAt: { title: "Creato a" },
        },
        success: {
          title: "Connessione trovata",
          description: "Collegamento SSH recuperato con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Convalida fallita",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: { title: "Accesso negato", description: "Accesso negato" },
          server: {
            title: "Errore del server",
            description: "Non è riuscito a ottenere il collegamento",
          },
          notFound: {
            title: "Connessione Non trovata",
            description: "Connessione SSH non trovata",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
        },
      },
    },
    list: {
      get: {
        title: "Elenco connessioni SSH",
        description: "Elenca tutte le connessioni SSH",
        response: {
          connections: { title: "Connessioni" },
        },
        success: {
          title: "Collegamenti elencati",
          description: "Le connessioni SSH recuperate con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Convalida fallita",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: { title: "Accesso negato", description: "Accesso negato" },
          server: {
            title: "Errore del server",
            description: "Non elencare le connessioni",
          },
          notFound: {
            title: "Non trovato",
            description: "Nessun collegamento trovato",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
        },
      },
    },
    create: {
      post: {
        title: "Crea connessione SSH",
        description: "Creare una nuova connessione SSH",
        fields: {
          label: {
            label: "Etichetta",
            description: "Nome amichevole per la connessione",
            placeholder: "prod-web-01",
          },
          host: {
            label: "Host",
            description: "Nome host del server SSH o IP",
            placeholder: "192.168.1.1",
          },
          port: {
            label: "Port",
            description: "Porta server SSH",
            placeholder: "22",
          },
          username: {
            label: "Nome utente",
            description: "Nome utente SSH",
            placeholder: "deploy",
          },
          authType: {
            label: "Tipo di Auth",
            description: "Metodo di autenticazione",
          },
          secret: {
            label: "Segreto",
            description: "Password o chiave privata",
          },
          passphrase: {
            label: "Passphrase",
            description: "Passphrase chiave privata (se applicabile)",
          },
          isDefault: {
            label: "Predefinito",
            description: "Impostare la connessione predefinita",
          },
          clusterRole: {
            label: "Cluster Role",
            description: "Ruolo di questo server nel cluster k8s",
          },
          notes: {
            label: "Osservazioni",
            description: "Note opzionali su questa connessione",
          },
        },
        response: {
          id: { title: "ID" },
        },
        success: {
          title: "Connessione creata",
          description: "Collegamento SSH creato con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri di collegamento non valido",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: { title: "Accesso negato", description: "Accesso negato" },
          server: {
            title: "Errore del server",
            description: "Non è riuscito a creare connessione",
          },
          notFound: {
            title: "Non trovato",
            description: "Risorsa non trovata",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
        },
      },
    },
    test: {
      post: {
        title: "Test di connessione SSH",
        description: "Provare una connessione SSH",
        fields: {
          connectionId: {
            label: "Connessione ID",
            description: "ID della connessione SSH per testare",
            placeholder: "uuid",
          },
          acknowledgeNewFingerprint: {
            label: "Riconoscimento Impronte",
            description: "Riconoscere nuove impronte dell'ospite",
            placeholder: "false",
          },
        },
        response: {
          ok: { title: "Operazione riuscita" },
          latencyMs: { title: "Latenza (ms)" },
          fingerprint: { title: "Impronte per la stampa" },
          fingerprintChanged: { title: "Impronte cambio" },
        },
        success: {
          title: "Connessione di successo",
          description: "test di connessione SSH superato",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri di prova non validi",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: { title: "Accesso negato", description: "Accesso negato" },
          server: {
            title: "Errore del server",
            description: "Test di connessione fallito",
          },
          notFound: {
            title: "Connessione Non trovata",
            description: "Connessione SSH non trovata",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
        },
      },
    },
  },
};
