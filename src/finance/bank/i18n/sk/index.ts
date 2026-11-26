import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  adjustment: {
    confirmHint:
      "Potvrďte prepojenie položky výpisu a zaúčtovanie zobrazených úprav.",
    autoMatch: "Automaticky spárovať overené platby dodávateľom",
    autoMatched: "Automaticky spárované",
    followup: "Spracovanie bankového pohybu",
    followupHint:
      "Skontrolujte dočasný návrh faktúry alebo zrušte potvrdené párovanie.",
    vendor: "Dodávateľ",
    expenseAccount: "Nákladový účet",
    reversalDate: "Dátum storna (RRRR-MM-DD)",
    reason: "Dôvod zrušenia",
    openDraft: "Otvoriť dodávateľskú faktúru",
    settings: "Nastavenia párovania banky",
    settingsHint:
      "Nastavte menu účtu, povolenú dvojicu mien, časové okno a limity.",
    settingsSaved: "Nastavenia párovania sú uložené",
    save: "Uložiť nastavenia",
    foreignCurrency: "Mena faktúry pre kurzové rozdiely",
    absTolerance: "Najvyšší kurzový rozdiel v mene účtu",
    bpsTolerance: "Najvyšší kurzový rozdiel v bázických bodoch",
    days: "Časové okno párovania v dňoch",
    gainAccount: "Účet kurzových ziskov",
    lossAccount: "Účet kurzových strát",
    feeAccount: "Nákladový účet pre doložené poplatky",
    invalidSettings:
      "Skontrolujte dvojicu mien, limity a aktívne účty spoločnosti.",
    description: "Vyrovnávací zápis {{reference}}",
    unavailable:
      "Rozdiel sa nepodarilo zaúčtovať. Skontrolujte dátum, otvorené obdobie a zvolené účty.",
    journal: "Vyrovnávací zápis",
    kind: "Typ párovania",
    fxDifference: "Kurzový zisk alebo strata",
    release: "Zrušiť bankové párovanie",
    releaseHint:
      "Zrušte prepojenie a stornujte vyrovnávací zápis v otvorenom období.",
    releaseSuccess: "Bankové párovanie je zrušené",
    draft: "Návrh dodávateľskej faktúry z banky",
    draftHint:
      "Ako dočasný doklad použite zaúčtovanú sumu. Pred odpočtom dane pridajte originál faktúry.",
    draftReady: "Návrh dodávateľskej faktúry je pripravený",
    confirmDraft: "Vytvoriť dočasný návrh faktúry",
    sourceMemo: "Doklad z výpisu {{reference}}. Originál faktúry zatiaľ chýba.",
  },
  statement: {
    projected: "Pripravené na import",
    localPreview:
      "Náhľad súboru zobrazuje dátumy a sumy pred kontrolou súkromia.",
    screenedOut: "Vylúčené kontrolou súkromia",
    screenedOutCount:
      "Kontrola súkromia nepreniesla {{count}} riadkov do bankovej evidencie.",
    format: "Formát výpisu",
    mapping: "Priradenie stĺpcov výpisu",
    preview: "Náhľad importu",
    previewSuccess: "Náhľad importu",
    invalid:
      "Výpis sa vo vybranom formáte nepodarilo prečítať (riadok {{row}}).",
    decimal: "Desatinný oddeľovač",
    dotDecimal: "Desatinná bodka",
    commaDecimal: "Desatinná čiarka",
    unmapped: "Bez stĺpca",
    overlap:
      "Možný súbeh s iným bankovým výpisom. Skontrolujte pôvodné bankové referencie.",
    columns: {
      counterpartyIban: "IBAN protistrany",
      id: "Banková referencia",
      date: "Dátum zaúčtovania",
      valueDate: "Dátum valuty",
      amount: "Zaúčtovaná suma",
      currency: "Mena zaúčtovania",
      nativeAmount: "Pôvodná suma",
      nativeCurrency: "Pôvodná mena",
      feeAmount: "Doložený poplatok",
      feeCurrency: "Mena poplatku",
      description: "Opis",
      counterparty: "Protistrana",
      status: "Stav",
    },
    formats: {
      normalized: "Štandardný CSV",
      c24: "CSV z C24",
      revolut: "CSV z osobného Revolutu",
      revolutBusiness: "CSV z Revolut Business",
      mapped: "Vlastný CSV",
      camt053: "CAMT.053",
      mt940: "MT940",
    },
  },
  tags: {
    bank: "banka",
    reconciliation: "párovanie transakcií",
  },
  fields: {
    exactAmount: "Presná suma",
    status: "Stav",
    company: "Firma",
    account: "Bankový účet",
    csv: "Bankový výpis",
    line: "Riadok bankového výpisu",
    transactionId: "ID transakcie",
    bookedDate: "Dátum zaúčtovania",
    amount: "Suma",
    currency: "Mena",
    journalLine: "Riadok účtovného zápisu",
    entryNumber: "Účtovný zápis",
    description: "Opis",
    journalDate: "Dátum účtovného zápisu",
    confirm: "Potvrdiť spárovanie",
    imported: "Importované položky",
    skipped: "Vynechané duplicity",
    matchedAt: "Čas spárovania",
    page: "Strana",
    pageSize: "Počet položiek na strane",
    total: "Spolu",
  },
  ui: {
    exactMatch: "Presná zhoda",
    csvFormat: "Oddeľovač stĺpcov",
    commaFormat: "Čiarka",
    semicolonFormat: "Bodkočiarka",
    sameDay: "Rovnaká suma aj dátum",
    upload: "Vybrať súbor výpisu",
    dropCsv: "Alebo sem presuňte výpis",
    pasteCsv: "Vložiť text výpisu",
    supportedFormat: "Podporované formáty",
    mapping: "Priradiť stĺpce",
    chooseColumn: "Vyberte stĺpec CSV",
    preview: "Náhľad prvých piatich transakcií",
    matchRow: "Spárovať",
    unmatched: "Nespárované",
    csvHelp:
      "Vyberte export z banky alebo priraďte stĺpce CSV. Potrebujete dátum zaúčtovania a sumu so znamienkom.",
    unsupported:
      "Použite CSV, CAMT.053 XML alebo text MT940. Súbory PDF, tabuľky a iné formáty najprv skonvertujte.",
    chooseScope: "Vyberte firmu a aktívny bankový účet.",
    empty: "Žiadne nespárované položky",
    emptyHint: "Importujte bankový výpis a začnite párovať.",
    review: "Skontrolovať párovanie",
    noCandidates: "Žiadne zodpovedajúce riadky účtovných zápisov",
    noCandidatesHint:
      "Skontrolujte bankový účet, menu a sumu zaúčtovaného zápisu.",
    alreadyMatched: "Tento riadok už je spárovaný.",
    importAction: "Importovať výpis",
    listAction: "Zobraziť riadky bankového výpisu",
    back: "Späť",
    previous: "Späť",
    next: "Ďalej",
    matchAction: "Spárovať zápis",
    confirmHint:
      "Prepojenie zaznamená, kto párovanie potvrdil. Nevytvorí účtovný zápis ani neprevedie peniaze.",
  },
  errors: {
    validation: {
      title: "Skontrolujte zadané údaje",
      description:
        "Vyberte firmu a aktívny bankový účet v mene firmy, na ktorý možno účtovať.",
    },
    network: {
      title: "Chyba siete",
      description: "Skontrolujte pripojenie a skúste to znova.",
    },
    unauthorized: {
      title: "Prihlásenie je povinné",
      description: "Na párovanie bankových transakcií sa prihláste.",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Vaša rola vo firme neumožňuje túto akciu.",
    },
    notFound: {
      title: "Riadok bankového výpisu alebo účet nie je k dispozícii",
      description: "Skontrolujte vybranú firmu a bankový účet.",
    },
    server: {
      title: "Operácia s výpisom zlyhala",
      description:
        "Skúste to znova. Pri neúspešnej operácii zostanú záznamy bez zmeny.",
    },
    unknown: {
      title: "Neočakávaná chyba pri práci s výpisom",
      description: "Skúste to znova.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Formulár obsahuje neuložené zmeny.",
    },
    conflict: {
      title: "Konflikt pri párovaní bankových transakcií",
      description: "Obnovte výpis a skontrolujte vybraný zápis.",
    },
  },
  check: {
    encoding: "Uložte súbor ako CSV v kódovaní UTF-8.",
    mappingHeader:
      "Vyberte oddeľovač a uveďte v hlavičke aspoň štyri pomenované stĺpce.",
    mapping: "Každému povinnému poľu priraďte iný stĺpec CSV.",
    columns: "Riadok {{row}} musí obsahovať rovnaké stĺpce ako hlavička.",
    value: "Riadok {{row}}, pole {{field}}: neplatná hodnota.",
    size: "Použite súbor CSV s veľkosťou najviac 256 KB a najviac 1 000 dátovými riadkami.",
    header: "Použite presnú hlavičku CSV: transactionId,date,amount,currency.",
    empty: "Pridajte aspoň jeden riadok transakcie.",
    row: "Na riadku {{row}} skontrolujte ID transakcie, dátum, sumu so znamienkom a menu.",
    duplicate: "Riadok {{row}} opakuje ID transakcie s odlišnými údajmi.",
    storedDuplicate:
      "Toto ID transakcie už používa uložený riadok s odlišnými údajmi.",
    currency: "Vo všetkých riadkoch použite menu firmy.",
    journalTaken: "Vybraný riadok účtovného zápisu už je spárovaný.",
    journalMatch:
      "Vyberte nespárovaný riadok zaúčtovaného zápisu s rovnakým bankovým účtom, sumou a menou.",
    confirmation: "Pred odoslaním potvrďte spárovanie.",
  },
  import: {
    title: "Import bankového výpisu",
    description: "Nahrajte alebo vložte výpis pre jeden bankový účet.",
    success: "Bankový výpis spracovaný",
  },
  list: {
    title: "Nespárované riadky bankového výpisu",
    description:
      "Skontrolovať importované riadky bankového výpisu a spárovať ich so zaúčtovanými zápismi.",
    success: "Riadky bankového výpisu načítané",
  },
  candidates: {
    title: "Nájsť zodpovedajúci účtovný zápis",
    description:
      "Skontrolujte zaúčtované bankové transakcie s rovnakou sumou a smerom platby.",
    success: "Návrhy na spárovanie načítané",
  },
  match: {
    title: "Potvrdiť spárovanie",
    description:
      "Prepojte riadok bankového výpisu s príslušným zaúčtovaným zápisom.",
    success: "Riadok bankového výpisu spárovaný",
  },
};
