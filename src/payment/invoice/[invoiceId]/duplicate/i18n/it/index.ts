import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
    ar: "A.",
  },
  post: {
    title: "Fattura duplicata",
    titleShort: "Fattura duplicata",
    description:
      "Sostituire una fattura esistente in un nuovo DRAFT. Copie tutti gli articoli di linea, cliente, azienda e valuta. Ottiene un nuovo numero di fattura e la data di oggi.",
    form: {
      title: "Fattura duplicata",
      description: "Crea un nuovo progetto di fattura da questo",
    },
    response: {
      success: "Fattura duplicata",
      message: "Messaggio di stato",
      invoice: {
        title: "Nuova fattura",
        subtitle: "Fattura del progetto duplicata",
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
        description: "Fattura non trovata",
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
      title: "Operazione riuscita",
      description: "Fattura duplicata come nuova bozza",
    },
  },
  invoiceId: {
    label: "Fatturazione ID",
    description: "ID della fattura da duplicare",
    placeholder: "Inserire la fattura ID",
  },
  widget: {
    duplicate: "Duplica",
    cancel: "Annulla",
    loading: "Caricamento della fattura",
    total: "Totale",
    duplicateNote:
      "Viene creata una nuova bozza con lo stesso cliente, valuta e righe. Riceve il numero quando la emetti.",
    back: "Indietro",
    submit: "Fattura duplicata",
    duplicated: "Fattura duplicata",
    invoiceNumber: "Fatturato",
    viewDuplicate: "Visualizza Duplicato",
  },
};
