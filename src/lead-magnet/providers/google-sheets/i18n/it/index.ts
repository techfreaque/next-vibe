import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Google Sheets",
  titleShort: "Google Sheets",
  description:
    "Aggiungi automaticamente ogni nuovo piombo come riga nel foglio Google. Collegare il tuo account Google - non sono necessarie chiavi API.",
  connect: {
    label: "Collegare l'account Google",
    description:
      "Accedi con Google per autorizzare l'accesso ai tuoi fogli di calcolo",
  },
  connected: {
    label: "Collegato",
    description: "Il tuo account Google è collegato",
  },
  spreadsheetId: {
    label: "Foglio di calcolo",
    description:
      "Selezionare il foglio di calcolo in cui verranno aggiunti i cavi",
    placeholder: "Seleziona un foglio di calcolo...",
  },
  sheetTab: {
    label: "Scheda foglio (opzionale)",
    description:
      "Il nome della scheda nel foglio di calcolo. Lasciare vuoto per utilizzare la prima scheda.",
    placeholder: "ad es. Piombo",
  },
  saveTag: "lead-magnet-google-sheets",
  saveTitle: "Salvare la configurazione di fogli Google",
  saveDescription: "Collegare il foglio Google per catturare i cavi",
  saveSuccess: {
    title: "Collegato",
    description: "I nuovi cavi compariranno come righe nel foglio.",
  },
  oauthStart: {
    title: "Collegare fogli Google",
    description:
      "Avviare il flusso Google OAuth per autorizzare l'accesso al foglio di calcolo",
  },
  oauthCallback: {
    title: "Google Fogli OAuth Callback",
    description:
      "Maneggia lo scambio di codice OAuth dopo il reindirizzamento Google",
  },
  sheetsList: {
    title: "Elenco fogli di calcolo",
    titleShort: "Fogli di calcolo",
    description:
      "Restituisce l'elenco dei fogli di calcolo accessibili all'account Google collegato",
  },
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Controlla il tuo input",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per continuare",
    },
    forbidden: { title: "Accesso negato", description: "Accesso negato" },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Risorsa non trovata",
    },
    conflict: {
      title: "Conflitto",
      description: "Si è verificato un conflitto",
    },
    network: {
      title: "Errore di rete",
      description: "Si è verificato un errore di rete",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    internal: {
      title: "Errore del server",
      description: "Si è verificato un errore interno",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore sconosciuto",
    },
    oauthFailed:
      "L'autorizzazione Google non è riuscita. Per favore, riprovate.",
    noRefreshToken:
      "Google non ha restituito un token di aggiornamento. Si prega di disconnettere e riconnettere il tuo account.",
    sheetsApiFailed:
      "Non poteva caricare fogli di calcolo. Controlla la connessione Google.",
    appendFailed:
      "Non poteva scrivere a Google Sheet. Token può essere scaduto.",
  },
  response: {
    provider: "Fornitore",
    isActive: "Attivo",
    spreadsheetId: "Foglio di calcolo ID",
    sheetTab: "Scheda di foglio",
    sheets: "Fogli di calcolo",
    connected: "Collegato",
  },
  widget: {
    connectTitle: "Collegare fogli Google",
    connectDescription:
      "Accedi con Google per aggiungere automaticamente ogni nuovo lead come riga nel foglio di calcolo.",
    redirectNote:
      "Verrai reindirizzato a Google per concedere l'accesso ai fogli di calcolo.",
    reconnect: "Ricollegamento",
    loading: "Caricamento fogli...",
    noSheets: "Nessun foglio di calcolo trovato",
    refresh: "Elenco dei rifiuti",
    selectRequired: "Seleziona un foglio di calcolo",
    saveFailed: "Non ho fatto nulla per salvare. Per favore, riprovate.",
    saving: "Salvare...",
  },
};
