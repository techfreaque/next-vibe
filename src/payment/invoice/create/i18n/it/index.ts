import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
    ar: "contabilizzazione",
  },
  post: {
    title: "Nuova fattura",
    titleShort: "Nuova fattura",
    description: "Prepara una fattura per il tuo cliente.",
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
      draftSaved: "Bozza della fattura salvata",
      draftSavedNumber: "Bozza della fattura n. {{number}} salvata",
      details: "Dati della fattura",
      draftHint: "Salva una bozza da rivedere prima dell’emissione.",
      items: "Righe",
      itemsDescription:
        "Righe di bozza facoltative. Usa un’aliquota IVA decimale tra 0 e 1.",
      itemsHint:
        "Aggiungi beni o servizi per calcolare il totale della fattura.",
      item: "Descrizione",
      quantity: "Quantità",
      unitPrice: "Prezzo unitario",
      manualTaxRate: "Altra aliquota",
      taxRate: "IVA %",
      addItem: "Aggiungi riga",
      removeItem: "Rimuovi riga",
      itemError:
        "Inserisci una descrizione, una quantità positiva, un prezzo e un’aliquota IVA tra 0 e 100%.",
      itemsTotalError: "Il totale è troppo alto per una sola fattura.",
      summary: "Riepilogo",
      net: "Imponibile",
      tax: "IVA",
      total: "Totale",
      customerSelected: "Cliente selezionato",
      clearCustomer: "Rimuovi cliente",
      lineTotal: "Totale riga",
      companyCurrencyValue: "Valuta aziendale: {{currency}}",
      companyCurrency: "Se non scegli una valuta, si applica quella aziendale.",
      back: "Indietro",
      submit: "Salva bozza",
      saving: "Salvataggio della bozza…",
      retrySave: "Salva di nuovo la bozza",
      saveFailed: "Impossibile salvare la bozza della fattura",
      saveFailedHint:
        "I dati sono ancora nel modulo. Controllali e salva di nuovo la bozza.",
      viewButton: "Visualizza Fattura",
    },
  },
  companyId: {
    label: "Azienda",
    description: "L'azienda emette questa fattura",
    placeholder: "Entra in azienda ID",
  },
  customerId: {
    label: "Cliente",
    description: "Cerca un cliente per nome.",
    placeholder: "Inserisci il cliente ID",
  },
  dueDate: {
    label: "Data di scadenza",
    description: "Quando questa fattura è dovuta",
    placeholder: "Selezionare la data",
  },
  currency: {
    code: "{{code}}",
    label: "Valuta",
    description: "Moneta di fatturazione",
    placeholder: "Valuta aziendale",
  },
  notes: {
    label: "Osservazioni",
    description: "Note opzionali visibili sulla fattura",
    placeholder: "ad es. Termini di pagamento: 30 giorni",
  },
};
