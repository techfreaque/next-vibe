import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    localModeOnly: {
      title: "Solo la modalità locale",
    },
    connectionNotFound: "Connessione non trovata",
    encryptionFailed:
      "Crittografia fallita - JWT_SECRET_KEY può essere invalido",
    connectTimeout: "Connessione time-out",
    sshAuthFailed: "L'autenticazione SSH non è riuscita",
    sshConnectionFailed: "connessione SSH guasto",
    fingerprintMismatch:
      "Le impronte sono cambiate. Potenziale attacco MITM. Utilizzare acknowledgeNewFingerprint =true per procedere.",
  },

  get: {
    title: "Elenco utenti Linux",
    titleShort: "Utenti Linux",
    description: "Elenca gli account utente OS sull'host (uid >= 1000)",
    fields: {
      connectionId: {
        label: "Connessione",
        description:
          "Collegamento SSH da usare (permette di svuotare per locali)",
        placeholder: "uuid",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accesso all'amministratore richiesto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "LOCAL_MODE richiesto",
      },
      server: {
        title: "Errore del server",
        description: "Non elencare gli utenti",
      },
      notFound: {
        title: "Non trovato",
        description: "Account o sessione non trovati",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: { title: "Modifiche non salvate" },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato il conflitto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      timeout: { title: "Timeout", description: "Richiesta tempo libero" },
    },
    response: {
      users: { title: "Utenti" },
    },
    success: {
      title: "Utenti elencati",
      description: "Gli utenti OS recuperati",
    },
  },
  widget: {
    title: "Utenti Linux",
    createButton: "Crea utente",
    lockButton: "Bloccaggio",
    unlockButton: "Sbloccaggio",
    deleteButton: "Elimina",
    usernameCol: "Nome utente",
    uidCol: "UID",
    homeDirCol: "Home",
    shellCol: "Shell",
    groupsCol: "Gruppi",
    statusCol: "Stato",
    locked: "Bloccati",
    active: "Attivo",
    localModeOnly: "Disponibile solo in LOCAL_MODE",
    noUsers: "Nessun utente trovato",
    confirmDelete:
      "Eliminare l'utente {username}? Questo non può essere annullato.",
  },
};
