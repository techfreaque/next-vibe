import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    models: "Modelli",
  },

  get: {
    title: "Scansione del catalogo del modello",
    titleShort: "Scansione del catalogo",
    description:
      "Ultima scansione dell'elenco dei modelli di ogni fornitore: nuovi modelli a monte che non serviamo ancora, la deriva dei prezzi, ids rimossi e gli arresti annunciati. Solo per leggere.",
    success: {
      title: "Scansione caricata",
      description: "Ultima scansione del catalogo modello caricato.",
    },
  },

  post: {
    title: "Scansione del modello di esecuzione",
    titleShort: "Esegui la scansione",
    description:
      "Portate la lista dei modelli di ogni fornitore e i prezzi in tempo reale, diffrali dalle nostre definizioni, conservate il rapporto e speditelo alle caselle postali delle operazioni. Non modifica mai il codice.",
    fields: {
      force: {
        label: "Correre anche se recenti",
        description:
          "Salta la guardia di 5 giorni. Senza di esso, una scansione più giovane di 5 giorni è restituito come è.",
      },
      sendEmail: {
        label: "Inviare il report",
        description: "Inviare il rapporto a hi@ e thea@unbottled.ai.",
      },
    },
    success: {
      title: "Scansione completa",
      description: "Scansione del catalogo del modello memorizzata.",
    },
  },

  response: {
    scan: "Scan",
    report: "Relazione",
    history: "Scansioni precedenti",
    skipped: "Asciutto (scava di retroscena)",
    reportText: "Relazione",
  },

  widget: {
    back: "Indietro",
    runNow: "Eseguire la scansione ora",
    running: "Scansione...",
    empty: {
      title: "Nessuna scansione ancora",
      message:
        "La prima scansione viene eseguita nel suo programma giornaliero. Eseguire uno ora per vedere cosa è cambiato a monte.",
    },
    skipped:
      'Una scansione degli ultimi 5 giorni già esiste, quindi niente di nuovo è stato catturato. Tick "Run anche se recente" per forzarne uno.',
    scannedAt: "Scansione",
    newSince: "Nuovo da",
    emailedTo: "Email a",
    notEmailed: "Non e-mail",
    emailError: "E-mail non riuscita",
    metrics: {
      newModels: "Nuovi modelli",
      uncensored: "Probabilmente senza censura",
      priceChanges: "Variazioni dei prezzi",
      missing: "Rimossi dai fornitori",
      deprecations: "Annunciato lo shutdowns",
      sourceErrors: "Fonti fallite",
    },
    sections: {
      newModels: "Nuovi modelli a monte",
      priceChanges: "Variazioni di prezzo e contesto",
      missing: "Rimossi dai fornitori",
      deprecations: "Spegnimenti annunciati",
      sources: "Fonti",
      history: "Scansioni precedenti",
    },
    legacy: "legacy",
    suspect: "Possibile anomalia. Verifica il connettore.",
    uncensored: "non censurato",
    ok: "ok",
    failed: "fallito",
    models: "modelli",
    perMillion: "per 1M",
    context: "Ct.",
    nothing: "Qui non c'è niente.",
  },

  task: {
    name: "Verifica del catalogo dei modelli",
    description:
      "Ogni 5 giorni confronta modelli e prezzi dei fornitori con il catalogo, salva il rapporto e lo invia per email.",
  },

  errors: {
    scanFailed: "Scansione del catalogo del modello guasto: {{error}}",
    loadFailed:
      "Non è possibile caricare la scansione del catalogo del modello: {{error}}",
    server: {
      title: "Errore del server",
      description:
        "La scansione non poteva essere completata. Controlla i registri del server.",
    },
    network: {
      title: "Errore di rete",
      description: "Non è possibile raggiungere il server.",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Qualcosa di inaspettato è andato storto.",
    },
    validation: {
      title: "Input non valido",
      description: "Controlla le opzioni di scansione.",
    },
    unauthorized: {
      title: "Non firmato",
      description:
        "Accedi come amministratore per visualizzare le scansioni del catalogo.",
    },
    forbidden: {
      title: "Admins solo",
      description:
        "Solo gli amministratori possono visualizzare o eseguire scansioni di catalogo.",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Nessuna scansione del catalogo trovata.",
    },
    conflict: {
      title: "Conflitto",
      description: "Un'altra scansione sta funzionando. Riprova tra poco.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salvare o scartare le modifiche prima.",
    },
  },
};
