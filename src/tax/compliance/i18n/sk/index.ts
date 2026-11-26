import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { compliance: "Súlad s predpismi", tax: "Dane" },
  enums: {
    vatTreatment: {
      domestic: "Tuzemské dodanie s DPH",
      reverseChargeDomestic: "Tuzemské prenesenie daňovej povinnosti",
      euServices: "Služby pre podnikateľa z EÚ (prenesenie daňovej povinnosti)",
      euGoods: "Dodanie tovaru do iného členského štátu (oslobodené od dane)",
      export: "Vývoz tovaru mimo EÚ (oslobodené od dane)",
      exempt: "Plnenie oslobodené od dane",
    },
    severity: {
      error: "Blokuje vystavenie",
      warning: "Skontrolovať",
      info: "Poznámka",
    },
  },
  issues: {
    issuerAddressMissing:
      "Doplňte ulicu, obec a PSČ firmy. Faktúra musí obsahovať úplnú adresu.",
    issuerRegistrationMissing:
      "Doplňte IČO firmy. Musí byť uvedené na každej faktúre.",
    issuerRegistrationInvalid:
      "IČO nie je platné. Má 8 číslic vrátane kontrolnej číslice.",
    issuerTaxIdMissing: "Doplňte DIČ. Musí byť uvedené na každej faktúre.",
    issuerTaxIdInvalid: "DIČ nie je platné. Má 10 číslic.",
    issuerVatIdMissing:
      "Doplňte IČ DPH. Platiteľ DPH ho musí uvádzať na faktúrach.",
    issuerVatIdInvalid: "IČ DPH nie je platné. Tvorí ho SK a 10 číslic.",
    customerVatIdMissing:
      "Doplňte IČ DPH odberateľa do fakturačnej adresy. Vyžaduje ho prenesenie daňovej povinnosti aj dodanie do EÚ.",
    customerVatIdInvalid: "IČ DPH odberateľa nie je platné.",
    customerNotForeignEu:
      "Plnenia v rámci EÚ vyžadujú IČ DPH odberateľa z iného členského štátu.",
    customerNotDomestic:
      "Tuzemské prenesenie daňovej povinnosti vyžaduje slovenské IČ DPH odberateľa.",
    treatmentNotAllowed:
      "Tento režim plnenia nezodpovedá režimu DPH firmy. Zvoľte iný režim plnenia alebo upravte režim DPH.",
    treatmentRequiresZeroRate:
      "Pri prenesení daňovej povinnosti a oslobodených plneniach sa DPH neuvádza. Nastavte všetky položky na 0 %.",
    rateNotValidOnDate:
      "Sadzba DPH {{rate}} % k {{date}} neplatí. Použite sadzbu platnú ku dňu dodania.",
    zeroRateWithoutReason:
      "Položka tuzemského dodania má 0 % DPH. Zvoľte príslušné oslobodenie od dane alebo prenesenie daňovej povinnosti.",
    issueDeadlinePassed:
      "Vystavené {{days}} dní po dodaní. Zákonná lehota je {{limit}} dní.",
    regimeNotElected:
      "Nie je zadaný režim DPH. Kým ho nezvolíte, ERP považuje firmu za platiteľa DPH.",
    chartTemplateMismatch:
      "Účtový rozvrh nevychádza zo vzoru pre túto krajinu.",
    taxRatesMissing:
      "Chýbajú sadzby dane pre túto krajinu. Doplňte ich, aby ich mohli doklady používať.",
    taxRatesOutdated:
      "Niektoré aktívne sadzby dane už neplatia. Deaktivujte ich alebo nastavte dátum ukončenia.",
    fiscalProviderMissing:
      "Tržby v hotovosti a kartou vyžadujú certifikovanú pokladnicu eKasa. Predaj cez pokladnicu zostane zablokovaný, kým ju nepripojíte.",
    eInvoicingUpcoming:
      "Štruktúrovaná elektronická faktúra bude povinná od {{date}}. Export Peppol UBL je pripravený.",
    vatThresholdNear:
      "Obrat v tomto kalendárnom roku je {{turnover}}. Nad {{threshold}} je registrácia pre DPH povinná.",
    vatThresholdExceeded:
      "Obrat v tomto kalendárnom roku je {{turnover}}, nad hranicou {{threshold}} pre DPH. Zaregistrujte sa pre DPH.",
  },
  review: {
    title: "Kontrola súladu s predpismi krajiny",
    titleShort: "Kontrola súladu",
    description:
      "Pozrite si, ktoré zákonné požiadavky krajiny firmy sú splnené a čo opraviť ako prvé.",
    company: {
      label: "Firma",
      description: "Firma na kontrolu",
    },
    disclaimer:
      "Poskytujeme nástroje, nie daňové poradenstvo. Podania si overte u svojho daňového poradcu.",
    country: "Pravidlá krajiny",
    regime: "Režim DPH",
    findings: "Zistenia",
    findingCode: "Zistenie",
    findingSeverity: "Závažnosť",
    allClear: "Všetky požiadavky pre túto krajinu sú splnené.",
    countries: {
      SK: "Slovensko",
      DE: "Nemecko",
      AT: "Rakúsko",
      XX: "Všeobecné (bez pravidiel krajiny)",
    },
    facts: {
      title: "Čo ERP pripraví",
      vatReturn: "Daňové priznanie k DPH a kontrolný výkaz",
      statements: "Účtovná závierka",
      fiscal: "Pokladničné doklady (eKasa)",
      eInvoicing: "Povinná elektronická fakturácia od",
      yes: "Dostupné",
      no: "Pre túto krajinu nedostupné",
      notRequired: "Nevyžaduje sa",
      required: "Vyžaduje sa, cez certifikovanú pokladnicu eKasa",
    },
    actions: {
      company: "Upraviť údaje firmy",
      regime: "Zvoliť režim DPH",
      rates: "Skontrolovať sadzby dane",
      chart: "Nastaviť účtový rozvrh",
      vatReturn: "Otvoriť daňové priznanie k DPH",
      fiscal: "Otvoriť nastavenia eKasy",
    },
    pickCompany: "Vyberte firmu na kontrolu.",
    errors: {
      validation: {
        title: "Neplatná požiadavka",
        description: "Vyberte firmu, ktorej ste členom.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa, aby ste mohli skontrolovať súlad.",
      },
      forbidden: {
        title: "Bez prístupu",
        description: "Nie ste členom tejto firmy.",
      },
      notFound: {
        title: "Firma sa nenašla",
        description: "Firma neexistuje alebo je neaktívna.",
      },
      conflict: {
        title: "Konflikt",
        description: "Údaje firmy sa počas kontroly zmenili. Skúste to znova.",
      },
      server: {
        title: "Kontrola zlyhala",
        description: "Kontrolu súladu sa nepodarilo spustiť. Skúste to znova.",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie a skúste to znova.",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Niečo sa pokazilo. Skúste to znova.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv uložte alebo zahoďte zmeny.",
      },
    },
    success: {
      title: "Súlad skontrolovaný",
      description: "Zistenia zodpovedajú aktuálnym údajom firmy.",
    },
  },
};
