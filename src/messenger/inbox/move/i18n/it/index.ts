import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Spostare il messaggio",
  titleShort: "Spostare il messaggio",
  description: "Spostare un messaggio in una cartella diversa",
  tag: "Posta in arrivo",

  container: {
    title: "Spostare il messaggio",
    description: "Spostare un messaggio da una cartella all'altra",
  },

  accountId: {
    label: "Account",
    description: "account di Messenger",
    placeholder: "Account UUID",
  },
  uid: {
    label: "Messaggio UID",
    description: "Lo UID del messaggio per muoversi",
    placeholder: "12345",
  },
  fromFolder: {
    label: "Dalla cartella",
    description: "Il percorso della cartella corrente",
    placeholder: "INBOX",
  },
  toFolder: {
    label: "A cartella",
    description: "percorso della cartella di destinazione",
    placeholder: "Archivia",
  },

  moved: { label: "Spostato" },

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
      detail: "Spostare fallito: {{error}}",
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
    title: "Messaggio spostato",
    description: "Il messaggio è stato spostato con successo",
  },
};
