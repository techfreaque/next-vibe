import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    bill: "fattura fornitore",
    lines: "linee",
  },
  post: {
    title: "Rimuovi riga fattura",
    titleShort: "Rimuovi la linea",
    description: "Rimuovi una riga dalla bozza della fattura fornitore",
    form: {
      title: "Rimuovi la linea",
      description: "Rimuove questa riga dalla bozza.",
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
        description:
          "È possibile rimuovere righe solo da una bozza modificabile.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "La riga è stata rimossa.",
    },
  },
  billId: {
    label: "Fattura fornitore",
    description: "Fattura fornitore contenente la riga da rimuovere",
  },
  lineId: {
    label: "Linea ID",
    description: "ID della voce di linea per rimuovere",
    placeholder: "Inserisci la riga ID",
  },
  widget: {
    verifying: "Verifica della riga selezionata…",
    unavailable:
      "Questa riga non può più essere rimossa. Riapri la bozza e verifica le righe attuali.",
    lineGross: "Importo lordo della riga: {{amount}}",

    back: "Indietro",
    submit: "Rimuovi la linea",
    warning:
      "La riga verrà rimossa definitivamente e il totale della bozza verrà ricalcolato.",
    confirm: "Rimuovi la linea",
    removed: "Elemento di linea rimosso",
  },
};
