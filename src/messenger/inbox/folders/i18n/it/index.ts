import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Elenco cartelle",
  titleShort: "Cartelle",
  description: "Elenca le cartelle disponibili per un account messenger",
  tag: "Posta in arrivo",

  container: {
    title: "Cartelle",
    description: "Cartelle disponibili per l'account selezionato",
  },

  accountId: {
    label: "Account",
    description: "account Messenger per elencare le cartelle per",
    placeholder: "Account UUID",
  },

  folders: {
    label: "Cartelle",
    path: { label: "Sentiero" },
    name: { label: "Nome" },
    displayName: { label: "Nome dell'esposizione" },
    specialUseType: { label: "Tipologia" },
    messageCount: { label: "Messaggi" },
    unseenCount: { label: "Unseen" },
  },

  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Controlla il tuo input",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Login richiesto",
    },
    server: {
      title: "Errore del server",
      description: "Errore del server interno",
      detail: "Cartelle di carico: {{error}}",
    },
    unknown: { title: "Errore sconosciuto", description: "Errore inaspettato" },
    forbidden: { title: "Accesso negato", description: "Accesso negato" },
    network: { title: "Errore di rete", description: "Errore di rete" },
    notFound: {
      title: "Account Non trovato",
      description: "Conto Messenger non trovato",
    },
    conflict: {
      title: "Conflitto",
      description: "Richiedi conflitti con i dati esistenti",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
  },

  success: {
    title: "Cartelle caricate",
    description: "Cartelle recuperate con successo",
  },
};
