import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { compliance: "Conformità", tax: "Fisco" },
  enums: {
    vatTreatment: {
      domestic: "Vendita nazionale con IVA",
      reverseChargeDomestic: "Inversione contabile nazionale",
      euServices: "Servizi a impresa UE (reverse charge)",
      euGoods: "Cessione intracomunitaria di beni (non imponibile)",
      export: "Esportazione fuori UE (non imponibile)",
      exempt: "Operazione esente IVA",
    },
    severity: {
      error: "Blocca l'emissione",
      warning: "Da verificare",
      info: "Nota",
    },
  },
  issues: {
    issuerAddressMissing:
      "Inserisca via, città e CAP dell'azienda. Le fatture devono riportare l'indirizzo completo.",
    issuerRegistrationMissing:
      "Inserisca il numero di registrazione dell'azienda (IČO). Deve comparire su ogni fattura.",
    issuerRegistrationInvalid:
      "Il numero di registrazione (IČO) non è valido. Ha 8 cifre, compresa una cifra di controllo.",
    issuerTaxIdMissing:
      "Inserisca il codice fiscale (DIČ). Deve comparire su ogni fattura.",
    issuerTaxIdInvalid: "Il codice fiscale (DIČ) non è valido. Ha 10 cifre.",
    issuerVatIdMissing:
      "Inserisca la partita IVA (IČ DPH). Le aziende soggette a IVA devono indicarla in fattura.",
    issuerVatIdInvalid:
      "La partita IVA (IČ DPH) non è valida. È composta da SK seguito da 10 cifre.",
    customerVatIdMissing:
      "Inserisca la partita IVA del cliente nell'indirizzo di fatturazione. Reverse charge e operazioni UE la richiedono.",
    customerVatIdInvalid: "La partita IVA del cliente non è valida.",
    customerNotForeignEu:
      "Le operazioni intracomunitarie richiedono una partita IVA del cliente di un altro paese UE.",
    customerNotDomestic:
      "L'inversione contabile nazionale richiede una partita IVA del cliente del Suo paese.",
    treatmentNotAllowed:
      "Questo trattamento IVA non è compatibile con il regime IVA dell'azienda. Scelga un altro trattamento o aggiorni il regime.",
    treatmentRequiresZeroRate:
      "Reverse charge e operazioni esenti non hanno IVA. Imposti tutte le righe a 0 %.",
    rateNotValidOnDate:
      "L'aliquota IVA del {{rate}} % non si applica il {{date}}. Usi un'aliquota valida alla data della cessione.",
    zeroRateWithoutReason:
      "Una riga ha IVA 0 % su una vendita nazionale. Scelga l'esenzione o l'inversione contabile applicabile.",
    issueDeadlinePassed:
      "Emessa {{days}} giorni dopo la cessione. Il termine di legge è di {{limit}} giorni.",
    regimeNotElected:
      "Nessun regime IVA registrato. Finché non ne sceglie uno, l'ERP considera l'azienda soggetto IVA.",
    chartTemplateMismatch:
      "Il piano dei conti non deriva dal modello per questo paese.",
    taxRatesMissing:
      "Mancano le aliquote per questo paese. Le aggiunga perché i documenti possano usarle.",
    taxRatesOutdated:
      "Alcune aliquote attive non sono più in vigore. Le disattivi o imposti una data di fine.",
    fiscalProviderMissing:
      "Le vendite in contanti e con carta richiedono un registratore di cassa eKasa certificato. Le vendite POS restano bloccate finché non ne collega uno.",
    eInvoicingUpcoming:
      "La fattura elettronica strutturata diventa obbligatoria dal {{date}}. L'esportazione Peppol UBL è pronta.",
    vatThresholdNear:
      "Il fatturato di quest'anno solare è {{turnover}}. Oltre {{threshold}} la registrazione IVA è obbligatoria.",
    vatThresholdExceeded:
      "Il fatturato di quest'anno solare è {{turnover}}, oltre la soglia IVA di {{threshold}}. Registri l'azienda ai fini IVA.",
  },
  review: {
    title: "Verifica di conformità per paese",
    titleShort: "Verifica di conformità",
    description:
      "Veda quali obblighi di legge del paese dell'azienda sono rispettati e cosa correggere per primo.",
    company: {
      label: "Azienda",
      description: "L'azienda da verificare",
    },
    disclaimer:
      "Forniamo strumenti, non consulenza fiscale. Faccia verificare le dichiarazioni dal Suo consulente fiscale.",
    country: "Regole del paese",
    regime: "Regime IVA",
    findings: "Rilievi",
    findingCode: "Rilievo",
    findingSeverity: "Gravità",
    allClear: "Tutti i requisiti per questo paese sono soddisfatti.",
    countries: {
      SK: "Slovacchia",
      DE: "Germania",
      AT: "Austria",
      XX: "Generico (senza regole nazionali)",
    },
    facts: {
      title: "Cosa prepara l'ERP",
      vatReturn: "Dichiarazione IVA e prospetto di controllo",
      statements: "Bilancio d'esercizio obbligatorio",
      fiscal: "Scontrini fiscali (eKasa)",
      eInvoicing: "Fattura elettronica obbligatoria dal",
      yes: "Disponibile",
      no: "Non disponibile per questo paese",
      notRequired: "Non richiesto",
      required: "Richiesto, tramite un registratore di cassa eKasa certificato",
    },
    actions: {
      company: "Modifica dati aziendali",
      regime: "Scegli regime IVA",
      rates: "Verifica aliquote",
      chart: "Configura piano dei conti",
      vatReturn: "Apri dichiarazione IVA",
      fiscal: "Apri le impostazioni fiscali della cassa",
    },
    pickCompany: "Scelga un'azienda da verificare.",
    errors: {
      validation: {
        title: "Richiesta non valida",
        description: "Scelga un'azienda di cui fa parte.",
      },
      unauthorized: {
        title: "Accesso richiesto",
        description: "Acceda per verificare la conformità.",
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
        description: "L'azienda è cambiata durante la verifica. Riprovi.",
      },
      server: {
        title: "Verifica non riuscita",
        description: "Non è stato possibile eseguire la verifica. Riprovi.",
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
      title: "Conformità verificata",
      description: "I rilievi riflettono i dati aziendali attuali.",
    },
  },
};
