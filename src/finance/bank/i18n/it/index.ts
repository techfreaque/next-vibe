import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  adjustment: {
    confirmHint:
      "Confermi per collegare il movimento bancario e contabilizzare le rettifiche indicate.",
    autoMatch: "Riconcilia automaticamente i pagamenti verificati ai fornitori",
    autoMatched: "Riconciliati automaticamente",
    followup: "Azioni sul movimento bancario",
    followupHint:
      "Controlla la bozza fornitore o annulla la riconciliazione confermata.",
    vendor: "Fornitore",
    expenseAccount: "Conto di costo",
    reversalDate: "Data dello storno (AAAA-MM-GG)",
    reason: "Motivo dell’annullamento",
    openDraft: "Apri fattura fornitore",
    settings: "Impostazioni di riconciliazione",
    settingsHint:
      "Imposta la valuta del conto, la coppia valutaria ammessa, l’intervallo e i limiti.",
    settingsSaved: "Impostazioni salvate",
    save: "Salva impostazioni",
    foreignCurrency: "Valuta fattura per differenze cambio",
    absTolerance: "Differenza cambio massima nella valuta del conto",
    bpsTolerance: "Differenza cambio massima in punti base",
    days: "Finestra di riconciliazione in giorni",
    gainAccount: "Conto utili su cambi",
    lossAccount: "Conto perdite su cambi",
    feeAccount: "Conto costi per commissioni documentate",
    invalidSettings:
      "Controlla coppia valutaria, limiti e conti attivi della società.",
    description: "Rettifica di riconciliazione {{reference}}",
    unavailable:
      "Non è stato possibile contabilizzare la rettifica. Controlla data, periodo e conti.",
    journal: "Scrittura di rettifica",
    kind: "Tipo di riconciliazione",
    fxDifference: "Utile o perdita su cambi",
    release: "Annulla la riconciliazione",
    releaseHint:
      "Rimuovi il collegamento e storna la rettifica in un periodo aperto.",
    releaseSuccess: "Riconciliazione annullata",
    draft: "Bozza fornitore da movimento bancario",
    draftHint:
      "Usa l’importo registrato come prova provvisoria. Aggiungi la fattura originale prima di detrarre l’imposta.",
    draftReady: "Bozza fornitore pronta",
    confirmDraft: "Crea bozza fornitore provvisoria",
    sourceMemo:
      "Giustificativo bancario {{reference}}. Fattura originale in attesa.",
  },
  statement: {
    projected: "Pronte per l’importazione",
    localPreview:
      "L’anteprima mostra date e importi prima del filtro di riservatezza.",
    screenedOut: "Escluse dal controllo della riservatezza",
    screenedOutCount:
      "Il controllo della riservatezza ha escluso {{count}} righe dal registro bancario.",
    format: "Formato dell’estratto",
    mapping: "Mappatura delle colonne",
    preview: "Anteprima dell’importazione",
    previewSuccess: "Anteprima dell’importazione",
    invalid:
      "Il formato selezionato non consente di leggere l’estratto (riga {{row}}).",
    decimal: "Separatore decimale",
    dotDecimal: "Punto decimale",
    commaDecimal: "Virgola decimale",
    unmapped: "Nessuna colonna",
    overlap:
      "Possibile sovrapposizione con un altro estratto. Controlla i riferimenti bancari originali.",
    columns: {
      counterpartyIban: "IBAN della controparte",
      id: "Riferimento bancario",
      date: "Data di contabilizzazione",
      valueDate: "Data valuta",
      amount: "Importo contabilizzato",
      currency: "Valuta contabile",
      nativeAmount: "Importo originale",
      nativeCurrency: "Valuta originale",
      feeAmount: "Commissione documentata",
      feeCurrency: "Valuta della commissione",
      description: "Descrizione",
      counterparty: "Controparte",
      status: "Stato",
    },
    formats: {
      normalized: "CSV standard",
      c24: "CSV C24",
      revolut: "CSV Revolut personale",
      revolutBusiness: "CSV Revolut Business",
      mapped: "CSV personalizzato",
      camt053: "CAMT.053",
      mt940: "MT940",
    },
  },
  tags: {
    bank: "banca",
    reconciliation: "riconciliazione",
  },
  fields: {
    exactAmount: "Importo esatto",
    status: "Stato",
    company: "Azienda",
    account: "Conto bancario",
    csv: "Estratto conto",
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
    exactMatch: "Corrispondenza esatta",
    csvFormat: "Separatore delle colonne",
    commaFormat: "Virgola",
    semicolonFormat: "Punto e virgola",
    sameDay: "Stesso importo, stesso giorno",
    upload: "Scegli file dell’estratto",
    dropCsv: "Oppure trascina qui un estratto",
    pasteCsv: "Incolla il testo dell’estratto",
    supportedFormat: "Formati supportati",
    mapping: "Associa colonne",
    chooseColumn: "Scegli una colonna CSV",
    preview: "Anteprima (prime 5 operazioni)",
    matchRow: "Abbina",
    unmatched: "Da abbinare",
    csvHelp:
      "Scegli un’esportazione bancaria o associa le colonne CSV. Sono obbligatori data e importo con segno.",
    unsupported:
      "Usa CSV, CAMT.053 XML o testo MT940. Converti prima PDF, fogli di calcolo e altri formati.",
    chooseScope: "Scegli un’azienda e un conto bancario attivo.",
    empty: "Nessuna riga da riconciliare",
    emptyHint: "Importa un estratto conto per iniziare.",
    review: "Controlla le corrispondenze",
    noCandidates: "Nessuna riga contabile corrispondente",
    noCandidatesHint:
      "Controlla il conto bancario, la valuta e l’importo della scrittura.",
    alreadyMatched: "Questa riga è già riconciliata.",
    importAction: "Importa estratto",
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
    description: "Carichi o incolli un estratto per un conto bancario.",
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
