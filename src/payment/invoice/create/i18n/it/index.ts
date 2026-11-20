import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
    ar: "contabilizzazione",
  },
  post: {
    title: "Crea fatturazione AR",
    titleShort: "Crea fattura",
    description: "Creare una nuova fattura creditibile per un cliente",
    form: {
      title: "Nuova fattura",
      description: "Compila i dettagli della fattura",
    },
    response: {
      success: "Fattura creata",
      message: "Messaggio di stato",
      invoice: {
        title: "Fatturato",
        subtitle: "Fattura creata",
        id: "Fatturazione ID",
        companyId: "Società ID",
        customerId: "Cliente ID",
        invoiceSequenceNumber: "Numero di fatturazione",
        currency: "Valuta",
        status: "Stato",
        dueDate: "Data di scadenza",
        notes: "Osservazioni",
        amount: "Importo",
        createdAt: "Creato a",
        updatedAt: "Aggiornato At",
      },
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri di fattura non valida",
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
        description:
          "Deve essere un amministratore o contabile di questa società",
      },
      notFound: {
        title: "Non trovato",
        description: "Società non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Fattura Creata",
      description: "Fattura creata in progetto di stato",
    },
    widget: {
      back: "Indietro",
      submit: "Crea fattura",
      viewButton: "Visualizza Fattura",
    },
  },
  companyId: {
    label: "Società ID",
    description: "L'azienda emette questa fattura",
    placeholder: "Entra in azienda ID",
  },
  customerId: {
    label: "Cliente ID",
    description: "Facoltativo: UUID del cliente (soft reference to user)",
    placeholder: "Inserisci il cliente ID",
  },
  dueDate: {
    label: "Data di scadenza",
    description: "Quando questa fattura è dovuta",
    placeholder: "Selezionare la data",
  },
  currency: {
    label: "Valuta",
    description: "Moneta di fatturazione",
    placeholder: "EUR",
  },
  notes: {
    label: "Osservazioni",
    description: "Note opzionali visibili sulla fattura",
    placeholder: "ad es. Termini di pagamento: 30 giorni",
  },
};
