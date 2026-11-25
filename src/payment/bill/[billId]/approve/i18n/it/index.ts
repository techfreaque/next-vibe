import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
