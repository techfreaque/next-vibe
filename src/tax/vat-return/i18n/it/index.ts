import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Fisco", vatReturn: "Dichiarazione IVA" },
  title: "Dichiarazione IVA",
  titleShort: "Dichiarazione IVA",
  description:
    "La sua dichiarazione IVA per il periodo, nel formato ufficiale del suo Paese.",
  company: {
    label: "Azienda",
    description: "L'azienda per cui preparare la dichiarazione",
  },
  period: {
    label: "Periodo",
    description: "Mese o trimestre della dichiarazione",
    month: "{{month}} {{year}}",
    quarter: "T{{quarter}} {{year}}",
  },
  disclaimer:
    "Forniamo strumenti, non consulenza fiscale. Faccia verificare le dichiarazioni dal suo consulente prima dell'invio.",
  summary: "{{company}}, dal {{from}} al {{to}}",
  formats: {
    SK_DPH: "Righi della dichiarazione DPH (DPHv25)",
    DE_USTVA: "Umsatzsteuer-Voranmeldung (UStVA)",
    DE_EUR_SMALL_BUSINESS: "Riepilogo EÜR (regime forfettario § 19 UStG)",
    AT_UVA: "Umsatzsteuervoranmeldung (U30)",
    AT_EA_SMALL_BUSINESS: "Riepilogo entrate e uscite (§ 6 c. 1 Z 27 UStG)",
    GENERIC_VAT: "Riepilogo IVA per aliquota",
  },
  dueByFormat: {
    SK_DPH: "Scadenza: il 25 del mese successivo, in via telematica.",
    DE_USTVA: "Scadenza: il 10 del mese successivo tramite ELSTER.",
    DE_EUR_SMALL_BUSINESS:
      "Riepilogo annuale EÜR con la dichiarazione dei redditi.",
    AT_UVA: "Scadenza: il 15 del secondo mese successivo tramite FinanzOnline.",
    AT_EA_SMALL_BUSINESS: "Riepilogo annuale per piccole imprese.",
    GENERIC_VAT: "Verifichi la scadenza presso l'autorità fiscale locale.",
  },
  smallBusiness: {
    title: "Nessuna dichiarazione IVA richiesta (regime piccole imprese)",
    body: {
      SK_DPH: "Questa azienda non è registrata ai fini IVA.",
      DE_USTVA: "Nessuna UStVA periodica richiesta.",
      DE_EUR_SMALL_BUSINESS:
        "Questa azienda applica l'esenzione § 19 UStG. Non serve la UStVA periodica. Qui sotto trova il riepilogo EÜR per il periodo.",
      AT_UVA: "Nessuna UVA periodica richiesta.",
      AT_EA_SMALL_BUSINESS:
        "Questa azienda applica l'esenzione § 6 c. 1 Z 27 UStG. Qui sotto trova il riepilogo entrate e uscite.",
      GENERIC_VAT: "Nessuna dichiarazione IVA richiesta per questo regime.",
    },
  },
  xmlSection: {
    SK_DPH: "Prospetto di controllo (KV DPH)",
    DE_USTVA: "XML ELSTER UStVA",
    DE_EUR_SMALL_BUSINESS: "Esportazione XML",
    AT_UVA: "XML FinanzOnline UVA (U30)",
    AT_EA_SMALL_BUSINESS: "Esportazione XML",
    GENERIC_VAT: "Esportazione XML",
  },
  xmlNote: {
    SK_DPH: "Carichi l'XML KVDPHv25 nel portale eDane.",
    DE_USTVA:
      "XML ELSTER UStVA pronto per l'importazione contabile o l'invio ERiC. L'invio automatico richiede un certificato ERiC; in alternativa copi i valori in Mein ELSTER o scarichi il CSV.",
    DE_EUR_SMALL_BUSINESS: "Utilizzi l'esportazione CSV strutturata sopra.",
    AT_UVA:
      "XML FinanzOnline U30 pronto per il caricamento sul portale o la revisione del consulente.",
    AT_EA_SMALL_BUSINESS: "Utilizzi l'esportazione CSV strutturata sopra.",
    GENERIC_VAT: "Utilizzi l'esportazione CSV strutturata sopra.",
  },
  lines: {
    title: "Righi della dichiarazione",
    line: "Rigo",
    meaning: "Significato",
    base: "Imponibile",
    amount: "Importo",
    r01: "Imponibile al 19 %",
    r02: "IVA al 19 %",
    r01a: "Imponibile al 5 %",
    r02a: "IVA al 5 %",
    r03: "Imponibile al 23 %",
    r04: "IVA al 23 %",
    r09: "Reverse charge, imponibile al 19 % (l'imposta la versa Lei)",
    r10: "Reverse charge, IVA al 19 %",
    r09a: "Reverse charge, imponibile al 5 %",
    r10a: "Reverse charge, IVA al 5 %",
    r09b: "Reverse charge, imponibile al 23 %",
    r10b: "Reverse charge, IVA al 23 %",
    r13: "Operazioni esenti",
    r14: "di cui cessioni intracomunitarie di beni (§ 43)",
    r15: "di cui esportazioni (§§ 46, 47)",
    r17: "IVA a debito totale",
    r18: "IVA detratta al 19 %",
    r18a: "IVA detratta al 5 %",
    r19: "IVA detratta al 23 %",
    r20: "di cui fatture nazionali al 19 %",
    r20a: "di cui fatture nazionali al 5 %",
    r21: "di cui fatture nazionali al 23 %",
    r24: "Rettifiche dell'imponibile (note di credito, § 25)",
    r25: "Rettifiche dell'IVA (note di credito, § 25)",
    r32: "IVA da versare",
    r33: "Eccedenza detraibile (rimborso)",
  },
  sections: {
    title: "Prospetto di controllo",
    section: "Sezione",
    count: "Righe",
    A1: "A.1 Fatture emesse a soggetti IVA",
    A2: "A.2 Fatture emesse con inversione contabile nazionale",
    B1: "B.1 Fatture ricevute, l'imposta la versa Lei",
    B2: "B.2 Fatture nazionali ricevute con detrazione",
    B31: "B.3.1 Fatture semplificate ricevute (totale)",
    C1: "C.1 Note di credito emesse",
    D1: "D.1 Corrispettivi di cassa",
    D2: "D.2 Altre cessioni (clienti senza partita IVA)",
  },
  warnings: {
    noVatId:
      "L'azienda non ha una partita IVA valida configurata. La inserisca prima dell'invio.",
    noTaxId:
      "L'azienda non ha un codice fiscale configurato. Lo inserisca prima dell'esportazione.",
    customerVatIds:
      "{{count}} fatture a clienti senza partita IVA sono riportate in D.2.",
    unmappedRates:
      "{{count}} righe usano aliquote non standard e non sono incluse nei righi mappati. Le verifichi.",
    b32Required:
      "L'IVA detratta dalle fatture semplificate ha raggiunto 3.000 EUR. Le indichi per fornitore in B.3.2 prima dell'invio.",
  },
  actions: {
    downloadXml: "Scarica XML",
    downloadCsv: "Scarica CSV",
    showXml: "Mostra XML",
    hideXml: "Nascondi XML",
    copy: "Copia",
    copied: "Copiato",
    copyError: "Copia non riuscita. Selezioni il testo e lo copi manualmente.",
  },
  pickCompany: "Scelga un'azienda per preparare la sua dichiarazione IVA.",
  empty: "Nessun documento rilevante in questo periodo.",
  errors: {
    validation: {
      title: "Richiesta non valida",
      description: "Scelga un'azienda e un mese o trimestre valido.",
    },
    unauthorized: {
      title: "Accesso richiesto",
      description: "Acceda per preparare le dichiarazioni IVA.",
    },
    forbidden: {
      title: "Nessun accesso",
      description: "Non fa parte di questa azienda.",
    },
    notFound: {
      title: "Azienda non trovata",
      description: "L'azienda non esiste o non è attiva.",
    },
    conflict: {
      title: "Conflitto",
      description: "I dati sono cambiati durante la preparazione. Riprovi.",
    },
    server: {
      title: "Dichiarazione non preparata",
      description:
        "Non è stato possibile preparare la dichiarazione IVA. Riprovi.",
    },
    network: {
      title: "Errore di rete",
      description: "Controlli la connessione e riprovi.",
    },
    unknown: {
      title: "Errore imprevisto",
      description: "Qualcosa è andato storto. Riprovi.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salvi o annulli prima le modifiche.",
    },
  },
  success: {
    title: "Dichiarazione IVA preparata",
    description: "Righi e file di esportazione riflettono i documenti salvati.",
  },
};
