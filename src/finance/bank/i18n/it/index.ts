import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    bank: "banca",
    reconciliation: "riconciliazione",
  },
  fields: {
    exactAmount: "Importo esatto",
    status: "Stato",
    company: "Azienda",
    account: "Conto bancario",
    csv: "Estratto conto CSV",
    line: "Riga bancaria",
    transactionId: "ID transazione",
    bookedDate: "Data contabile",
    amount: "Importo",
    currency: "Valuta",
    journalLine: "Riga contabile",
    entryNumber: "Scrittura contabile",
    description: "Descrizione",
    journalDate: "Data della scrittura",
    confirm: "Conferma la riconciliazione",
    imported: "Importate",
    skipped: "Duplicati ignorati",
    matchedAt: "Riconciliata il",
    page: "Pagina",
    pageSize: "Righe per pagina",
    total: "Totale",
  },
  ui: {
    csvFormat: "Formato CSV",
    commaFormat: "Separatore virgola e punto decimale",
    semicolonFormat: "Separatore punto e virgola e virgola decimale",
    sameDay: "Stesso importo, stesso giorno",
    upload: "Scegli file CSV",
    dropCsv: "Oppure trascina un CSV qui",
    pasteCsv: "Incolla il testo CSV",
    supportedFormat: "Formato supportato",
    mapping: "Associa colonne",
    chooseColumn: "Scegli una colonna CSV",
    preview: "Anteprima (prime 5 operazioni)",
    matchRow: "Abbina",
    unmatched: "Da abbinare",
    csvHelp:
      "Associa un identificativo stabile, una data (AAAA-MM-GG o GG.MM.AAAA), un importo con segno nel formato decimale scelto e un codice valuta in maiuscolo. Gli importi positivi sono entrate. Una operazione per riga, senza separatori delle migliaia.",
    unsupported:
      "Converti prima CAMT XML, OFX/QFX, MT940, fogli di calcolo, PDF e CSV con separatori diversi o record su più righe.",
    chooseScope: "Scegli un’azienda e un conto bancario attivo.",
    empty: "Nessuna riga da riconciliare",
    emptyHint: "Importa un estratto conto per iniziare.",
    review: "Controlla le corrispondenze",
    noCandidates: "Nessuna riga contabile corrispondente",
    noCandidatesHint:
      "Controlla il conto bancario, la valuta e l’importo della scrittura.",
    alreadyMatched: "Questa riga è già riconciliata.",
    importAction: "Importa CSV",
    listAction: "Mostra righe bancarie",
    back: "Indietro",
    previous: "Precedente",
    next: "Successiva",
    matchAction: "Riconcilia questa scrittura",
    confirmHint:
      "Il collegamento registra chi ha confermato. Non crea scritture e non trasferisce denaro.",
  },
  errors: {
    validation: {
      title: "Controlla i dati",
      description:
        "Scegli un’azienda e un conto bancario attivo e registrabile nella sua valuta.",
    },
    network: {
      title: "Errore di rete",
      description: "Controlla la connessione e riprova.",
    },
    unauthorized: {
      title: "Accedi",
      description: "Accedi per usare la riconciliazione bancaria.",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Il tuo ruolo aziendale non consente questa operazione.",
    },
    notFound: {
      title: "Conto o riga bancaria non disponibile",
      description: "Controlla l’azienda e il conto selezionati.",
    },
    server: {
      title: "Operazione bancaria non riuscita",
      description:
        "Riprova. Se l’operazione fallisce, i dati restano invariati.",
    },
    unknown: {
      title: "Errore bancario imprevisto",
      description: "Riprova.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Le modifiche sono ancora nel modulo.",
    },
    conflict: {
      title: "Conflitto nella riconciliazione",
      description:
        "Aggiorna l’estratto conto e controlla la scrittura selezionata.",
    },
  },
  check: {
    encoding: "Salva il file come CSV in UTF-8.",
    mappingHeader:
      "Scegli il separatore e usa almeno quattro colonne con nome nell’intestazione.",
    mapping: "Scegli una colonna diversa per ogni campo obbligatorio.",
    columns: "La riga {{row}} deve avere le stesse colonne dell’intestazione.",
    value: "Valore non valido per {{field}} alla riga {{row}}.",
    size: "Usa un CSV di al massimo 256 KB e 1000 righe di dati.",
    header:
      "Usa esattamente le intestazioni transactionId,date,amount,currency.",
    empty: "Aggiungi almeno una riga di transazione.",
    row: "Controlla ID, data, importo con segno e valuta alla riga {{row}}.",
    duplicate: "La riga {{row}} ripete un ID di transazione con dati diversi.",
    storedDuplicate: "Una riga già salvata usa lo stesso ID con dati diversi.",
    currency: "Tutte le righe devono usare la valuta aziendale.",
    journalTaken: "La riga contabile selezionata è già riconciliata.",
    journalMatch:
      "Scegli una riga registrata e non riconciliata per lo stesso conto, importo e valuta.",
    confirmation: "Conferma la riconciliazione prima di salvare.",
  },
  import: {
    title: "Importa estratto conto",
    description: "Carica o incolla il CSV di un conto bancario.",
    success: "Estratto conto elaborato",
  },
  list: {
    title: "Righe bancarie da riconciliare",
    description:
      "Controlla le righe importate e collegale alle scritture registrate.",
    success: "Righe bancarie caricate",
  },
  candidates: {
    title: "Trova una scrittura corrispondente",
    description:
      "Controlla le scritture bancarie registrate con lo stesso importo e lo stesso segno.",
    success: "Scritture corrispondenti caricate",
  },
  match: {
    title: "Conferma riconciliazione bancaria",
    description: "Collega questa riga bancaria alla scrittura registrata.",
    success: "Riga bancaria riconciliata",
  },
};
