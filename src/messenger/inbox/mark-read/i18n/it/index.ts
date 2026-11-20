import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Mark Read",
  titleShort: "Mark Read",
  description: "Segnare un messaggio come letto o non letto",
  tag: "Posta in arrivo",

  container: {
    title: "Messaggio di Marco",
    description: "Aggiornare lo stato di lettura di un messaggio",
  },

  accountId: {
    label: "Account",
    description: "account di Messenger",
    placeholder: "Account UUID",
  },
  uid: {
    label: "Messaggio UID",
    description: "La UID del messaggio",
    placeholder: "12345",
  },
  folderPath: {
    label: "Cartella",
    description: "Percorso della cartella contenente il messaggio",
    placeholder: "INBOX",
  },
  isRead: {
    label: "Segnala come Leggi",
    description:
      "Impostare a true per contrassegnare come letto, falso per segnare come illeggi",
  },

  updated: { label: "Aggiornato" },

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
      detail: "Non è stato possibile aggiornare lo stato di lettura: {{error}}",
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
    title: "Messaggio aggiornato",
    description: "Leggi lo stato aggiornato con successo",
  },
};
