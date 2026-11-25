import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    bank: "banka",
    reconciliation: "párovanie transakcií",
  },
  fields: {
    exactAmount: "Presná suma",
    status: "Stav",
    company: "Firma",
    account: "Bankový účet",
    csv: "Bankový výpis vo formáte CSV",
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
    csvFormat: "Formát CSV",
    commaFormat: "Čiarky medzi poľami, bodky v desatinných číslach",
    semicolonFormat: "Bodkočiarky medzi poľami, čiarky v desatinných číslach",
    sameDay: "Rovnaká suma aj dátum",
    upload: "Vyberte súbor CSV",
    dropCsv: "Alebo sem presuňte súbor CSV",
    pasteCsv: "Vložiť text CSV",
    supportedFormat: "Podporovaný formát",
    mapping: "Priradiť stĺpce",
    chooseColumn: "Vyberte stĺpec CSV",
    preview: "Náhľad prvých piatich transakcií",
    matchRow: "Spárovať",
    unmatched: "Nespárované",
    csvHelp:
      "Priraďte stĺpce pre nemenné ID transakcie, dátum (YYYY-MM-DD alebo DD.MM.YYYY), sumu so znamienkom vo zvolenom desatinnom formáte a kód meny veľkými písmenami. Kladná suma znamená príjem. Každý záznam uveďte na jednom riadku. Nepoužívajte oddeľovače tisícov.",
    unsupported:
      "Súbory CAMT XML, OFX/QFX, MT940, tabuľky, PDF aj údaje s inými oddeľovačmi alebo viacriadkovými záznamami najprv preveďte do tohto formátu CSV.",
    chooseScope: "Vyberte firmu a aktívny bankový účet.",
    empty: "Žiadne nespárované položky",
    emptyHint: "Importujte bankový výpis a začnite párovať.",
    review: "Skontrolovať párovanie",
    noCandidates: "Žiadne zodpovedajúce riadky účtovných zápisov",
    noCandidatesHint:
      "Skontrolujte bankový účet, menu a sumu zaúčtovaného zápisu.",
    alreadyMatched: "Tento riadok už je spárovaný.",
    importAction: "Importovať CSV",
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
    description:
      "Nahrajte súbor CSV alebo vložte jeho obsah pre jeden bankový účet.",
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
