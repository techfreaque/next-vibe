import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pagamento",
    bill: "fatturazione",
    ap: "contabilità-pagabile",
  },
  post: {
    title: "Creare AP Bill",
    titleShort: "Creare Bill",
    description: "Registrare una fattura ricevuta da un fornitore",
    form: {
      title: "Nuovo fornitore Bill",
      description: "Inserisci i dettagli della fattura che hai ricevuto",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla tutti i campi e riprova",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per creare fatture",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Hai bisogno di ruolo Contabile o Amministratore",
      },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
      server: {
        title: "Errore del server",
        description: "Non poteva creare il disegno di legge. riprovare",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Controllare la connessione e riprovare",
      },
      notFound: { title: "Non trovato", description: "Risorsa non trovata" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Creato da Bill",
      description: "Il conto del fornitore registrato con successo",
    },
    widget: {
      back: "Indietro",
      submit: "Registrazione",
      viewButton: "Visualizza Bill",
      addAnotherButton: "Aggiungi un altro",
    },
    response: {
      id: "Bill ID",
      companyId: "Società ID",
      supplierName: "Fornitore",
      billNumber: "Numero della fattura",
      billDate: "Data di pubblicazione",
      dueDate: "Data di scadenza",
      currency: "Valuta",
      subtotal: "Totale parziale",
      taxAmount: "Imposte",
      total: "Totale",
      status: "Stato",
      createdAt: "Creato",
      updatedAt: "Aggiornato",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Progetto",
      RECEIVED: "Ricevuto.",
      APPROVED: "Approvazione",
      PAID: "Pagato",
      DISPUTED: "Disputato",
    },
  },
  companyId: {
    label: "Società",
    description: "La società che riceve questa fattura",
    placeholder: "Società UUID",
  },
  supplierName: {
    label: "Nome del fornitore",
    description: "Nome del fornitore che ha inviato questa fattura",
    placeholder: "Acme GmbH",
  },
  supplierVatNumber: {
    label: "Numero di fornitore VAT",
    description: "Numero di identificazione del fornitore VAT /tax",
    placeholder: "DE123456789",
  },
  billNumber: {
    label: "Numero della fattura",
    description: "Numero di riferimento fattura/bill del fornitore",
    placeholder: "INV-2024-001",
  },
  billDate: {
    label: "Data di pubblicazione",
    description: "Data dell'emissione della legge",
    placeholder: "2024-01-01",
  },
  dueDate: {
    label: "Data di scadenza",
    description: "Data di pagamento",
    placeholder: "2024-01-31",
  },
  currency: {
    label: "Valuta",
    description: "Bilancio",
    placeholder: "EUR",
  },
  notes: {
    label: "Osservazioni",
    description: "Note interne su questa fattura",
    placeholder: "Note opzionali",
  },
};
