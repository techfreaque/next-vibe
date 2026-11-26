import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Austria (AT)",
      DE: "Germania (DE)",
      XX: "Piano generico (aliquote da configurare)",
      SK: "Slovacchia (SK)",
    },
  },
  tags: { companies: "aziende", onboard: "a bordo", setup: "configurazione" },
  post: {
    title: "Configura la contabilità",
    titleShort: "Configura la contabilità",
    description:
      "Installa il piano dei conti e prepara i conti di cassa e banca per le registrazioni.",
    companyId: { label: "Azienda", description: "Azienda" },
    country: {
      genericPreview:
        "Aggiunge un piano generico. Configura le aliquote prima di emettere fatture.",
      regionalPreview:
        "Usa il piano dei conti e le aliquote IVA del paese scelto.",
      label: "Modello del piano dei conti",
      description:
        "Scegli il modello austriaco o tedesco se l’azienda ha sede in uno di questi paesi. Per gli altri paesi, scegli il piano generico.",
      placeholder: "Scegli un modello",
    },
    period: {
      title: "Primo periodo contabile",
      open: "Apri questo periodo durante la configurazione",
      description:
        "È proposto il mese corrente. Cambia le date per un periodo personalizzato o annuale.",
      name: "Nome del periodo",
      start: "Data di inizio",
      end: "Data di fine",
      proposal: "Periodo proposto {{name}}, dal {{start}} al {{end}}",
      kept: "Il calendario contabile esistente viene mantenuto.",
      invalid:
        "Inserisci il nome del periodo e una data di fine uguale o successiva a quella di inizio.",
      opened: "Il periodo {{name}} è aperto per le registrazioni.",
      view: "Vedi periodi contabili",
      viewHint: "Controlla il calendario contabile.",
      createHint: "Scegli le date prima della prima registrazione.",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla tutti i campi",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi a bordo di un'azienda",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Ruolo di amministrazione richiesto",
      },
      conflict: {
        title: "Il piano dei conti esistente usa il modello di un altro paese",
        description:
          "Controlla il piano dei conti esistente prima di cambiare modello.",
      },
      profileMismatch:
        "Scegli il modello che corrisponde al paese del profilo aziendale.",
      server: {
        title: "Errore del server",
        description: "Non poteva completare l'imbarco",
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
        title: "Società non trovata",
        description: "Questa società non esiste",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Configurazione contabile completata",
      description:
        "Il piano dei conti è pronto. Puoi aprire un periodo e iniziare a creare documenti.",
    },
    widget: {
      books: "Configurazione dei conti",
      setupCounts: "Conti pronti {{accounts}} · Aliquote aggiunte {{rates}}",
      invoiceHint:
        "Prepara una bozza per questa azienda e controllala prima di emetterla.",
      submit: "Configura la contabilità",
      company: "Azienda: {{name}}",
      back: "Indietro",
      cashAndBankReady:
        "I conti di cassa e banca sono pronti per le registrazioni.",
      nextHint: "Apri un periodo contabile prima di registrare i movimenti.",
      period: "Crea un periodo",
      invoice: "Crea una bozza di fattura",
    },
    response: {
      accountsCreated: "Conti aggiunti",
      accountsSkipped: "Conti già presenti",
      taxRatesCreated: "Aliquote aggiunte",
      cashAccountId: "Conto in contanti ID",
      bankAccountId: "Conto bancario ID",
      success: "Operazione riuscita",
    },
  },
};
