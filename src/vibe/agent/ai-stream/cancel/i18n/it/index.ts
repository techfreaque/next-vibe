import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "IA",
  tags: {
    streaming: "Streaming",
  },
  post: {
    title: "Annullare il flusso di AI",
    titleShort: "Annullare la corrente",
    description: "Annulla una risposta attiva di streaming AI",
    container: {
      title: "Annullare la corrente",
      description: "Smettere un flusso AI attivo per un thread",
    },
    form: {
      title: "Annullare la corrente",
      description: "Fornire il thread ID per annullare il suo flusso attivo",
    },
    threadId: {
      label: "File ID",
      description: "ID del filo il cui flusso per annullare",
    },
    response: {
      title: "Annullare il risultato",
      description: "Risultato dell'operazione di cancellazione",
      cancelled: "Se un flusso attivo è stato trovato e cancellato",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Dati di richiesta di cancellazione non valida",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per cancellare i flussi",
      },
      forbidden: {
        title: "Accesso negato",
        description: "È possibile cancellare solo i propri flussi",
      },
      notFound: {
        title: "Non trovato",
        description: "Conversazione non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Non è stato possibile cancellare il flusso",
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
        title: "Conflitto",
        description: "Cancella il conflitto si è verificato",
      },
    },
    success: {
      title: "Cancellazione del flusso",
      description: "Il flusso AI è stato cancellato con successo",
    },
    streamInterrupted:
      "La generazione e' stata fermata. La risposta parziale è stata salvata.",
  },
};
