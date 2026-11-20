import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
    lines: "linee",
  },
  post: {
    title: "Rimuovere la linea di fatturazione",
    titleShort: "Rimuovi la linea",
    description: "Rimuovere un articolo di linea da una fattura di progetto",
    form: {
      title: "Rimuovi la linea",
      description: "Rimuove permanentemente questa linea dalla fattura",
    },
    response: {
      success: "Linea rimossa",
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
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Articolo di linea non trovato",
      },
      conflict: {
        title: "Conflitto",
        description: "La fattura non è in progetto di stato",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Elemento di linea rimosso dalla fattura",
    },
  },
  lineId: {
    label: "Linea ID",
    description: "ID della voce di linea per rimuovere",
    placeholder: "Inserisci la riga ID",
  },
  widget: {
    back: "Indietro",
    submit: "Rimuovi la linea",
    warning:
      "Questo rimuoverà definitivamente l'elemento di linea dalla fattura.",
    confirm: "Rimuovi la linea",
    removed: "Elemento di linea rimosso",
  },
};
