import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stime",
  tags: {
    payment: "pagamento",
    estimate: "Grafico",
    ar: "contabilizzazione",
  },
  post: {
    title: "Crea il preventivo",
    titleShort: "Crea il preventivo",
    description:
      "Creare una nuova stima delle vendite o un preventivo nel progetto di stato",
    form: {
      title: "Nuova stima",
      description: "Compilare i dettagli di stima",
    },
    response: {
      success: "Stime create",
      message: "Messaggio di stato",
      estimate: {
        title: "Stima",
        subtitle: "Stime create",
        id: "Stima ID",
        companyId: "Società ID",
        estimateNumber: "Numero di stima",
        status: "Stato",
        customerId: "Cliente ID",
        customerEmail: "Email del cliente",
        customerName: "Nome del cliente",
        currency: "Valuta",
        validUntil: "Valido fino a quando",
        title_field: "Titolo",
        notes: "Osservazioni",
        terms: "Termini",
        subtotal: "Totale parziale",
        taxAmount: "Importo fiscale",
        total: "Totale",
        invoiceId: "Fatturazione ID",
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
        description: "Parametri di stima non validi",
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
      title: "Operazione riuscita",
      description: "Stime create in progetto di stato",
    },
    widget: {
      otherRate: "Altra aliquota",
      item: "Descrizione",
      quantity: "Quantità",
      price: "Prezzo unitario",
      vatRate: "IVA %",
      add: "Aggiungi riga",
      remove: "Rimuovi riga",
      empty: "Aggiungi i beni o i servizi del preventivo.",
      summary: "Riepilogo",

      back: "Indietro",
      submit: "Crea il preventivo",
      viewButton: "Visualizza il preventivo",
    },
  },
  companyId: {
    label: "Società ID",
    description: "L'azienda emette questa stima",
    placeholder: "Entra in azienda ID",
  },
  customerId: {
    label: "Cliente ID",
    description: "Opzionale: UUID del cliente",
    placeholder: "Inserisci il cliente ID",
  },
  customerEmail: {
    label: "Email del cliente",
    description: "Indirizzo email del cliente",
    placeholder: "customer@example.com",
  },
  customerName: {
    label: "Nome del cliente",
    description: "Nome del cliente",
    placeholder: "Inserisci il nome del cliente",
  },
  currency: {
    code: "{{code}}",
    label: "Valuta",
    description: "Moneta stimata",
    placeholder: "Valuta aziendale",
  },
  validUntil: {
    label: "Valido fino a quando",
    description: "Data fino a che tale stima è valida",
    placeholder: "Selezionare la data di scadenza",
  },
  title: {
    label: "Titolo",
    description: "Titolo breve di questa stima",
    placeholder: "ad esempio. Analisi del sito web",
  },
  notes: {
    label: "Osservazioni",
    description: "Note opzionali visibili sulla stima",
    placeholder: "ad esempio. Prezzi validi per 30 giorni",
  },
  terms: {
    label: "Termini",
    description: "Termini di pagamento o di consegna",
    placeholder: "ad esempio il 50% in anticipo, il 50% alla consegna",
  },
  lines: {
    label: "Elementi di linea",
    description: "Articoli inclusi in questa stima",
  },
};
