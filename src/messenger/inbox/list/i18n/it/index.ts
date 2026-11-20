import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Elenco delle caselle postali",
  titleShort: "Posta in arrivo",
  description:
    "Elenca i messaggi dalla casella di posta o una cartella specifica",
  tag: "Posta in arrivo",

  container: {
    title: "Messaggi di posta elettronica",
    description: "Messaggi dall'account e dalla cartella selezionata",
  },

  accountId: {
    label: "Account",
    description: "Conto Messenger per leggere la casella di posta da",
    placeholder: "Account UUID",
  },
  folderPath: {
    label: "Cartella",
    description: "Passo della cartella per elencare (defaults to INBOX)",
    placeholder: "INBOX",
  },

  messages: {
    label: "Messaggi",
    uid: { label: "UID" },
    messageId: { label: "Messaggio ID" },
    subject: { label: "Oggetto" },
    from: { label: "Da" },
    to: { label: "A" },
    date: { label: "Data" },
    isRead: { label: "Leggi tutto" },
    isFlagged: { label: "Bandiera" },
    folderPath: { label: "Cartella" },
    bodyText: { label: "Corpo" },
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
      detail: "Non è possibile caricare la casella di posta: {{error}}",
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
    title: "Posta in arrivo caricata",
    description: "Messaggi recuperati con successo",
  },
};
