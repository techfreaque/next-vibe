import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Password",
      privateKey: "Chiave privata (PEM)",
      keyAgent: "Agente SSH",
      local: "Macchina locale",
    },
  },

  errors: {
    sshSecretKeyNotSet:
      "JWT_SECRET_KEY env var non impostato. Aggiungi un valore esagonale di 32 byte per abilitare la modalità SSH.",
    encryptionFailed:
      "Crittografia fallita - JWT_SECRET_KEY può essere invalido",
    noRowReturned: "Nessuna riga restituita dall'inserto",
  },

  post: {
    title: "Crea connessione SSH",
    titleShort: "Crea connessione",
    description:
      "Salvare una nuova connessione SSH. Le credenziali sono criptate a riposo utilizzando AES-256 - GCM.",
    fields: {
      label: {
        label: "Etichetta",
        description: "Un nome amichevole per identificare questa connessione",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Hostname / IP",
        description: "Il nome host del server SSH o l'indirizzo IP",
        placeholder: "192.168.1.1",
      },
      port: {
        label: "Port",
        description: "Porta server SSH (default: 22)",
        placeholder: "22",
      },
      username: {
        label: "Nome utente",
        description: "L'utente SSH per autenticare come",
        placeholder: "deploy",
      },
      authType: {
        label: "Metodo di autenticazione",
        description:
          "Come autenticare. Password: semplice login password. Chiave privata: file chiave PEM. Agente SSH: utilizzare l'agente SSH del sistema (SSH_AUTH_SOCK).",
      },
      secret: {
        label: "Password / chiave privata",
        description:
          "Per Password auth: la password. Per chiave privata: incollare la chiave PEM completa (--- BEGIN... KEY-----). Lasciare vuoto per l'agente SSH.",
        placeholder: "",
      },
      passphrase: {
        label: "Passphrase chiave",
        description:
          "Se la vostra chiave privata è protetta da passphrase, inseritela qui. Lasciare vuoto se la chiave è non crittografata.",
        placeholder: "",
      },
      isDefault: {
        label: "Impostare come connessione predefinita",
        description:
          "Utilizzare questa connessione per impostazione predefinita per le sessioni AI, il terminale e i comandi exec quando non è specificata alcuna connessione.",
      },
      notes: {
        label: "Osservazioni",
        description: "Note interne opzionali su questa connessione",
        placeholder: "VPS dietro NAT, l'host di salto richiesto",
      },
    },
    response: {
      id: { title: "Connessione ID" },
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
        description: "Non hai il permesso di creare connessioni",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a salvare la connessione",
      },
      notFound: { title: "Non trovato", description: "Risorsa non trovata" },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Etichetta già esistente",
        description: "Esiste già un collegamento con questa etichetta",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      timeout: { title: "Timeout", description: "Richiesta tempo libero" },
    },
    success: {
      title: "Connessione salvata",
      description: "Collegamento SSH salvato con successo",
    },
    submitButton: {
      text: "Salvare la connessione",
      loadingText: "Salvare...",
    },
  },
  widget: {
    title: "Nuova connessione SSH",
    createButton: "Salvare la connessione",
    creating: "Salvare...",
    testFirst: "Testare la connessione prima di salvare",
  },
};
