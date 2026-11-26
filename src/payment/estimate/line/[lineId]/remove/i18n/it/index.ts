import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stime",
  tags: { payment: "pagamento", estimate: "Grafico", lines: "linee" },
  post: {
    title: "Rimuovere la linea di stima",
    titleShort: "Rimuovi la linea",
    description: "Rimuovere un elemento di linea da una stima del progetto",
    form: {
      title: "Rimuovere la linea di stima",
      description: "Rimuovere questo articolo di linea dal preventivo",
    },
    response: {
      estimateId: "Preventivo",
      success: "Operazione riuscita",
      message: "Messaggio di stato",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri non validi",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: { title: "Accesso negato", description: "Accesso negato" },
      notFound: {
        title: "Non trovato",
        description: "Articolo di linea non trovato",
      },
      conflict: {
        title: "Conflitto",
        description:
          "La stima deve essere nello stato DRAFT per rimuovere le linee",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Rimozione della linea",
      description: "Elemento di linea rimosso dalla stima",
    },
  },
  lineId: {
    label: "Linea ID",
    description: "L'elemento di linea per rimuovere",
  },
  widget: {
    lineTotal: "Totale riga",
    back: "Indietro",
    submit: "Rimuovi la linea",
    removed: "Elemento di linea rimosso dalla stima.",
    confirmTitle: "Rimuovere questo articolo linea?",
    confirmDescription:
      "Questo rimuoverà definitivamente l'elemento di linea dalla stima. I totali saranno ricalcolati.",
    confirmButton: "Rimuovi",
    cancelButton: "Annulla",
  },
};
