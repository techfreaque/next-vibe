import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pagamento",
    bill: "fatturazione",
    ap: "contabilità-pagabile",
  },
  post: {
    title: "Nuova fattura fornitore",
    titleShort: "Nuova fattura fornitore",
    description: "Aggiungi il fornitore e le righe, poi salva la bozza.",
    form: {
      title: "Nuovo fornitore Bill",
      description: "Inserisci i dettagli della fattura che hai ricevuto",
    },
    errors: {
      vendor: "Scegli un fornitore attivo di questa azienda.",
      supplier: "Inserisci un nome o scegli un fornitore.",
      dates: "Inserisci date di fattura e scadenza valide.",
      amounts:
        "Controlla le righe e mantieni il totale entro il limite consentito.",
      expenseAccount: "Scegli un conto di costo attivo di questa azienda.",

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
      conflict: {
        title: "Conflitto",
        description:
          "Esiste già una fattura con questo fornitore e numero. Controllala prima di crearne un’altra.",
      },
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
      supplier: "Fornitore",
      dates: "Date e valuta",
      items: "Righe fattura",
      itemsDescription:
        "Righe facoltative. Inserisci l’aliquota IVA come decimale da 0 a 1.",
      itemsHint: "Aggiungi i beni o servizi fatturati.",
      item: "Descrizione",
      quantity: "Quantità",
      unitPrice: "Prezzo unitario",
      manualTaxRate: "Altra aliquota",
      taxRate: "IVA %",
      lineTotal: "Totale riga",
      addItem: "Aggiungi riga",
      removeItem: "Rimuovi riga",
      itemError: "Controlla descrizione, quantità, prezzo e IVA.",
      supplierTotalReview:
        "Confronta questo totale con la fattura del fornitore. Se non coincide, verifica il documento originale prima di salvare.",
      summary: "Riepilogo fattura",
      net: "Imponibile",
      tax: "IVA",
      total: "Totale",
      chooseVendor: "Scegli fornitore",
      vendorSource: "Dall’elenco dei fornitori",
      terms: "Applica la scadenza del fornitore",
      manualVendor: "Inserisci il fornitore manualmente",
      selectCompanyFirst: "Scegli prima un’azienda.",

      back: "Indietro",
      submit: "Salva bozza",
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
  vendorId: {
    label: "Scegli fornitore",
    description: "Dall’elenco dei fornitori",
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
    placeholder: "Scegli la data della fattura",
  },
  dueDate: {
    label: "Data di scadenza",
    description: "Data di pagamento",
    placeholder: "Scegli la data di scadenza",
  },
  currency: {
    code: "{{code}}",
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
