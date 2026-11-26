import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Fisco", vatReturn: "Dichiarazione IVA" },
  title: "Dichiarazione IVA slovacca e prospetto di controllo",
  titleShort: "Dichiarazione IVA (SK)",
  description:
    "Prepari i righi della dichiarazione DPH e l'XML del prospetto di controllo (kontrolný výkaz) per un mese o un trimestre.",
  company: {
    label: "Azienda",
    description: "L'azienda soggetta a IVA",
  },
  period: {
    label: "Periodo",
    description: "Mese o trimestre della dichiarazione",
    month: "{{month}} {{year}}",
    quarter: "T{{quarter}} {{year}}",
  },
  unsupportedCountry:
    "La dichiarazione IVA è disponibile solo per aziende slovacche. Imposti la Slovacchia come paese dell'azienda per usarla.",
  disclaimer:
    "Forniamo strumenti, non consulenza fiscale. Faccia verificare le dichiarazioni dal Suo consulente fiscale prima di presentarle in eDane.",
  summary: "{{company}}, dal {{from}} al {{to}}",
  due: "Scadenza: il 25 del mese successivo, in via telematica.",
  lines: {
    title: "Righi della dichiarazione DPH (DPHv25)",
    line: "Rigo",
    meaning: "Significato",
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
    title: "Prospetto di controllo (KV DPH)",
    section: "Sezione",
    count: "Righe",
    A1: "A.1 Fatture emesse a soggetti IVA",
    A2: "A.2 Fatture emesse con inversione contabile nazionale",
    B1: "B.1 Fatture ricevute, l'imposta la versa Lei",
    B2: "B.2 Fatture nazionali ricevute con detrazione",
    B31: "B.3.1 Fatture semplificate ricevute (totale)",
    C1: "C.1 Note di credito emesse",
    D1: "D.1 Corrispettivi eKasa",
    D2: "D.2 Altre cessioni (clienti senza IČ DPH)",
  },
  warnings: {
    noVatId:
      "L'azienda non ha una partita IVA (IČ DPH) valida. L'XML KV la richiede prima dell'invio.",
    customerVatIds:
      "{{count}} fatture a clienti senza IČ DPH sono riportate in D.2.",
    unmappedRates:
      "{{count}} righe usano aliquote diverse da 23 / 19 / 5 % e non sono nella dichiarazione. Le verifichi.",
    b32Required:
      "L'IVA detratta dalle fatture semplificate ha raggiunto 3.000 EUR. Le indichi per fornitore in B.3.2 prima dell'invio.",
  },
  actions: {
    downloadKv: "Scarica XML KV DPH",
    downloadCsv: "Scarica righi della dichiarazione (CSV)",
    showXml: "Mostra XML",
    hideXml: "Nascondi XML",
    copy: "Copia",
    copied: "Copiato",
    copyError: "Copia non riuscita. Selezioni il testo e lo copi manualmente.",
  },
  pickCompany: "Scelga un'azienda per preparare la sua dichiarazione IVA.",
  empty: "Nessun documento rilevante ai fini IVA in questo periodo.",
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
    description:
      "Righi e prospetto di controllo riflettono i documenti salvati.",
  },
};
