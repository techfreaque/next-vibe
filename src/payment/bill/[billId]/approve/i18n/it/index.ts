import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  receiveBill: "Segna la fattura come ricevuta",
  supplierDocument: {
    confirmMissing: "Conferma che il documento del fornitore non è disponibile",
    confirmSeparate: "Conferma che si tratta di una spesa distinta",
    missingHelp:
      "Verifica il documento bancario. L’approvazione registra il costo lordo senza detrarre l’IVA.",
    required:
      "Collega il documento del fornitore o conferma che non è disponibile. L’approvazione basata sulla banca richiede il lordo verificato e nessuna registrazione IVA.",
    possibleDuplicate:
      "Una bozza bancaria o un documento del fornitore ha dati simili. Collega il documento o conferma che si tratta di una spesa distinta.",
  },
  reverseCharge: {
    title: "Inversione contabile (facoltativa)",
    base: "Imponibile nella valuta della fattura",
    rate: "Aliquota IVA (%)",
    help: "Per una fattura ricevuta da una piccola impresa tedesca, inserisci i due valori solo dopo aver verificato l’obbligo di inversione contabile. L’IVA viene registrata come costo e debito fiscale.",
    invalid:
      "Indica base e aliquota confermate per una fattura ricevuta nel regime tedesco delle piccole imprese.",
    cost: "IVA indetraibile da inversione contabile",
  },
  tags: {
    payment: "pagamento",
    bill: "fatturazione",
    ap: "contabilità-pagabile",
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
  post: {
    title: "Controlla lo stato della fattura",
    titleShort: "Controlla lo stato della fattura",
    description:
      "Aggiorna lo stato di una fattura fornitore in bozza o ricevuta.",
    billId: {
      label: "Bill ID",
      description: "Il disegno di legge per approvare",
    },
    errors: {
      existingPosting:
        "Riconcilia la scrittura esistente prima di approvare la fattura.",
      lineTotalsReview:
        "Le righe non coincidono con il netto, l’IVA o il lordo registrati. Verifica la fattura originale del fornitore prima di approvarla.",
      billLines:
        "Aggiungi righe con un totale positivo e usa conti di costo attivi di questa azienda.",
      posting:
        "Controlla gli importi, la valuta aziendale, il periodo contabile e i conti di registrazione.",
      validation: {
        title: "Errore di convalida",
        description: "fattura non valida ID",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per approvare le bollette",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Il ruolo contabile o amministrativo richiesto",
      },
      conflict: {
        title: "Già approvato",
        description: "La legge è già approvata o pagata",
      },
      server: {
        title: "Errore del server",
        description: "Non può approvare il disegno di legge",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Controlla la connessione",
      },
      notFound: {
        title: "Bill non trovato",
        description: "Questa legge non esiste",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Approvazione di Bill",
      description: "Stato di Bill avanzato con successo",
    },
    response: {
      status: "Nuovo stato",
      journalEntryId: "Entrata di giornale ID",
    },
    widget: {
      back: "Indietro",
      submit: "Confermare il cambiamento di stato",
      confirmTitle: "Approva questo disegno di legge?",
      confirmDescription:
        "Una bozza passa allo stato Ricevuta. L’approvazione di una fattura ricevuta genera una scrittura contabile.",
      confirmButton: "Sì, Approvo",
      cancelButton: "Annulla",
      approved: "Stato di fattura aggiornato",
    },
  },
};
