import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
    transactions: "transazioni",
  },
  defaultItem: "Voce fattura",
  success: {
    created: "Fattura creata con successo",
  },
  post: {
    title: "Crea fattura Stripe",
    titleShort: "Fattura Stripe",
    description: "Crea una fattura Stripe per un cliente",
    form: {
      title: "Dettagli della fattura",
      description: "Inserisci importo, valuta e data di scadenza",
    },
    response: {
      success: "Fattura creata con successo",
      message: "Messaggio di stato",
      invoice: {
        title: "Dettagli della fattura",
        description: "Informazioni sulle fatture generate",
        id: "Fatturazione ID",
        userId: "Utente ID",
        stripeInvoiceId: "Stripe Fatturazione ID",
        invoiceNumber: "Numero di fatturazione",
        amount: "Importo",
        currency: "Valuta",
        status: "Stato",
        invoiceUrl: "Fatturazione URL",
        invoicePdf: "Fatturazione PDF",
        dueDate: "Data di scadenza",
        paidAt: "Pagato a",
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
        description: "Parametri della richiesta non validi",
      },
      server: {
        detail: "Non è possibile creare la fattura: {{error}}",
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
        noStripeCustomer:
          "Nessun record di clienti Stripe esiste per il tuo account",
        title: "Non trovato",
        description: "Risorsa non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
    widget: {
      back: "Indietro",
    },
  },
  customerId: {
    label: "Cliente",
    description: "Scegli il conto associato al cliente su Stripe.",
    placeholder: "Cerca un cliente",
  },
  amount: {
    label: "Importo",
    description: "Importo della fattura",
    placeholder: "Inserisci l'importo",
  },
  currency: {
    label: "Valuta",
    description: "Codice valutario",
    placeholder: "Seleziona la valuta",
    usd: "Dollaro US (USD)",
    eur: "Euro (EUR)",
    pln: "Zloty polacco (PLN)",
  },
  description: {
    label: "Designazione",
    description: "Descrizione della fattura",
    placeholder: "Inserisci la descrizione",
  },
  dueDate: {
    label: "Data di scadenza",
    description: "Data di pagamento",
    placeholder: "Selezionare la data",
  },
  metadata: {
    label: "Metadati",
    description: "Altri metadati",
    placeholder: "Inserisci i metadati come JSON",
  },
};
