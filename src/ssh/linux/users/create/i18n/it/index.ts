import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "Nessuna shell di login",
    },
  },

  errors: {
    localModeOnly: {
      title: "Solo la modalità locale",
    },
    invalidUsername:
      "Nome utente non valido: deve iniziare con una lettera, poi lettere minuscole, cifre o trattini (max 32 caratteri)",
    userAlreadyExists: "Un utente con quel nome utente esiste già",
    connectionNotFound: "Connessione SSH non trovata",
    encryptionFailed:
      "Crittografia fallita - JWT_SECRET_KEY può essere invalido",
    connectTimeout: "Connessione time-out",
    sshAuthFailed: "L'autenticazione SSH non è riuscita",
    sshConnectionFailed: "connessione SSH guasto",
    sudoAuthFailed:
      "Autenticazione improvvisa fallita - password sbagliata o privilegi sudo insufficienti",
    permissionDenied:
      "Permesso negato: fornire la password sudo per creare utenti OS",
    fingerprintMismatch:
      "Le impronte sono cambiate. Potenziale attacco MITM. Riconoscere di procedere.",
  },

  post: {
    title: "Crea un utente Linux",
    titleShort: "Crea utente",
    description:
      "Crea un nuovo account utente OS. Esegue useradd sull'host di destinazione. Solo l'amministratore.",
    fields: {
      connectionId: {
        label: "Connessione SSH",
        description:
          "Quale server per creare l'utente su. Lasciare vuoto per utilizzare la connessione predefinita o la modalità locale.",
        placeholder: "Seleziona una connessione...",
      },
      username: {
        label: "Nome utente",
        description:
          "Deve iniziare con una lettera, poi lettere minuscole, cifre, o iphens. Max 32 caratteri.",
        placeholder: "alice",
      },
      groups: {
        label: "Gruppi aggiuntivi",
        description:
          "Gruppi aggiuntivi opzionali per aggiungere l'utente a (comma-separato). Esempio: docker, www-data.",
        placeholder: "docker,www-data",
      },
      shell: {
        label: "Login Shell",
        description:
          "La shell che si apre quando questo utente accede in modo interattivo.",
      },
      homeDir: {
        label: "Home Elenco",
        description:
          "Percorso per la home directory dell'utente. Predefinisce /home/ <username> se lasciato vuoto.",
        placeholder: "/home/alice",
      },
      sudoAccess: {
        label: "Grant Sudo Accesso",
        description:
          "Aggiungi l'utente al gruppo sudo in modo che possano eseguire i comandi come root. Utilizzare con cautela.",
      },
      sudoPassword: {
        label: "Password improvvisata",
        description:
          "La tua password sudo per eseguire useradd con privilegi elevati. Lasciare vuoto se il sudo senza password è configurato.",
        placeholder: "Inserisci sudo password...",
      },
    },
    response: {
      ok: { title: "Operazione riuscita" },
      uid: { title: "UID" },
      gid: { title: "GID" },
      homeDirectory: { title: "Home Elenco" },
      shell: { title: "Shell" },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla i campi del modulo e riprova",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accesso all'amministratore richiesto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "La modalità locale non è abilitata su questo server",
      },
      server: {
        title: "Errore del server",
        description: "Non riuscita a creare l'account utente",
      },
      notFound: {
        title: "Non trovato",
        description: "Connessione SSH non trovata",
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
        title: "Nome utente già esistente",
        description: "Un utente con questo nome utente esiste già sul server",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      timeout: { title: "Timeout", description: "Richiesta tempo libero" },
    },
    success: {
      title: "Creato dall'utente",
      description: "account utente OS creato con successo",
    },
    submitButton: {
      text: "Crea utente",
      loadingText: "Creare...",
    },
  },
  widget: {
    title: "Crea un utente Linux",
    createButton: "Crea utente",
    creating: "Creare...",
    sudoWarning:
      "Garantire l'accesso sudo dà ai privilegi di livello root dell'utente. Fai questo solo se ti fidi completamente di questo utente.",
  },
};
