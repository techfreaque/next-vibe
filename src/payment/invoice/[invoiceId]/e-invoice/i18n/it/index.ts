import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Fattura elettronica (Peppol)",
  titleShort: "Fattura elettronica",
  description:
    "Esporti una fattura o una nota di credito emessa come file Peppol BIS Billing 3.0 (UBL, EN 16931).",
  invoiceId: {
    label: "Fattura",
    description: "La fattura o nota di credito emessa da esportare",
  },
  response: {
    invoiceNumber: "Numero documento",
    isCreditNote: "Nota di credito",
    fileName: "Nome file",
    ready: "Pronta per l'invio",
    missingFields: "Dati mancanti",
    xml: "XML",
  },
  widget: {
    back: "Indietro",
    submit: "Prepara fattura elettronica",
    invoice: "Fattura {{number}}",
    creditNote: "Nota di credito {{number}}",
    ready: "Pronta. Tutti i dati obbligatori EN 16931 sono presenti.",
    missing: "Completi questi dati prima di inviare il file:",
    download: "Scarica XML",
    copy: "Copia XML",
    copied: "XML copiato",
    copyFailed: "Impossibile copiare l'XML",
    preview: "Mostra XML",
    disclaimer: "Forniamo strumenti, non consulenza fiscale.",
  },
  fields: {
    bt1: "Numero documento",
    bt2: "Data di emissione",
    bt5: "Valuta",
    bt9: "Data di scadenza",
    bt27: "Nome della Sua azienda",
    bt31: "La Sua partita IVA",
    bt34: "Il Suo indirizzo elettronico (partita IVA, codice fiscale o numero di registro)",
    bt40: "Paese della Sua azienda",
    bt44: "Nome del cliente",
    bt48: "Partita IVA del cliente",
    bt49: "Indirizzo elettronico del cliente (partita IVA, codice fiscale o numero di registro)",
    bt55: "Indirizzo del cliente con paese",
    bt153: "Una descrizione su ogni riga",
    bg25: "Almeno una riga",
  },
  errors: {
    validation: {
      title: "Richiesta non valida",
      description: "Verifichi il riferimento della fattura.",
    },
    network: {
      title: "Errore di rete",
      description: "Non è stato possibile caricare la fattura elettronica.",
    },
    unauthorized: {
      title: "Accesso richiesto",
      description: "Acceda per esportare le fatture elettroniche.",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Non ha accesso a questo documento.",
    },
    notFound: {
      title: "Documento non trovato",
      description: "Questa fattura non esiste.",
    },
    server: {
      title: "Esportazione non riuscita",
      description:
        "Non è stato possibile creare la fattura elettronica. Riprovi.",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Qualcosa è andato storto.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salvi prima le modifiche.",
    },
    conflict: {
      title: "Non ancora emessa",
      description:
        "Emetta la fattura prima di esportarla come fattura elettronica.",
    },
  },
  success: {
    title: "Fattura elettronica pronta",
    description: "Il file Peppol è pronto.",
  },
  tags: {
    payment: "pagamento",
    invoice: "fattura",
    eInvoice: "fattura elettronica",
  },
};
