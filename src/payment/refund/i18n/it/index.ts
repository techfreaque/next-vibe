import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Rimborso di processo",
  titleShort: "Rimborso",
  description: "Elaborare un rimborso per una transazione di pagamento",
  category: "Rimborsi di pagamento",
  tags: {
    refund: "rimborso",
    transaction: "transazione"
  },
  success: {
    created: "Rimborso effettuato con successo"
  },
  reason: {
    requestedByCustomer: "Richiesta da parte del cliente"
  },
  form: {
    title: "Modulo di rimborso",
    description: "Inserisci i dettagli del rimborso",
    fields: {
      transactionId: {
        label: "Transazione ID",
        description: "ID della transazione al rimborso",
        placeholder: "Inserisci la transazione ID"
      },
      amount: {
        label: "Importo del rimborso",
        description: "Rimborso parziale facoltativo nella valuta della transazione",
        placeholder: "Inserisci l'importo"
      },
      reason: {
        label: "Ragione di rimborso",
        description: "Motivo del rimborso",
        placeholder: "Inserisci il motivo"
      },
      metadata: {
        label: "Metadati",
        description: "Altri metadati di rimborso",
        placeholder: "Inserisci i metadati come JSON"
      }
    }
  },
  post: {
    title: "Rimborso di processo",
    description: "Elaborare un rimborso di pagamento",
    response: {
      success: "Rimborso effettuato con successo",
      message: "Messaggio di stato",
      refund: {
        title: "Dettagli di rimborso",
        description: "Informazioni di rimborso processate",
        id: "Rimborso ID",
        userId: "Utente ID",
        transactionId: "Transazione ID",
        stripeRefundId: "Stripe Rimborso ID",
        amount: "Importo del rimborso",
        currency: "Valuta",
        status: "Stato di rimborso",
        reason: "Ragione di rimborso",
        createdAt: "Creato a",
        updatedAt: "Aggiornato At"
      }
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di rimborso non validi"
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare"
      },
      forbidden: {
        title: "Accesso negato",
        description: "Permesso negato"
      },
      notFound: {
        detail: "Nessuna transazione trovata con id {{transactionId}}",
        title: "Non trovato",
        description: "Transazione non trovata"
      },
      server: {
        detail: "Non è possibile elaborare il rimborso: {{error}}",
        noPaymentIntent: "Questa transazione non ha alcun pagamento collegato Stripe, quindi non può essere rimborsato",
        title: "Errore del server",
        description: "Si è verificato un errore interno del server"
      },
      network: {
        title: "Errore di rete",
        description: "Errore di connessione di rete"
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto"
      },
      conflict: {
        title: "Conflitto",
        description: "Rimborso del conflitto rilevato"
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati"
      }
    },
    success: {
      title: "Operazione riuscita",
      description: "Rimborso effettuato con successo"
    }
  }
};
