import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Dane", vatReturn: "Daňové priznanie k DPH" },
  title: "Daňové priznanie k DPH",
  titleShort: "Priznanie k DPH",
  description:
    "Vaše daňové priznanie k DPH za obdobie v úradnom formáte vašej krajiny.",
  company: {
    label: "Firma",
    description: "Firma, pre ktorú pripravujete priznanie",
  },
  period: {
    label: "Zdaňovacie obdobie",
    description: "Mesiac alebo štvrťrok priznania",
    month: "{{month}} {{year}}",
    quarter: "{{quarter}}. štvrťrok {{year}}",
  },
  disclaimer:
    "Poskytujeme nástroje, nie daňové poradenstvo. Pred podaním si výkazy overte u svojho daňového poradcu.",
  summary: "{{company}}, od {{from}} do {{to}}",
  formats: {
    SK_DPH: "Riadky daňového priznania k DPH (DPHv25)",
    DE_USTVA: "Umsatzsteuer-Voranmeldung (UStVA)",
    DE_EUR_SMALL_BUSINESS: "Prehľad EÜR (§ 19 UStG malý podnikateľ)",
    AT_UVA: "Umsatzsteuervoranmeldung (U30)",
    AT_EA_SMALL_BUSINESS: "Prehľad príjmov a výdavkov (§ 6 ods. 1 Z 27 UStG)",
    GENERIC_VAT: "Prehľad DPH podľa sadzieb",
  },
  dueByFormat: {
    SK_DPH: "Lehota: do 25. dňa nasledujúceho mesiaca, elektronicky.",
    DE_USTVA: "Lehota: do 10. dňa nasledujúceho mesiaca cez ELSTER.",
    DE_EUR_SMALL_BUSINESS: "Ročný prehľad EÜR k dani z príjmov.",
    AT_UVA:
      "Lehota: do 15. dňa druhého nasledujúceho mesiaca cez FinanzOnline.",
    AT_EA_SMALL_BUSINESS: "Ročný prehľad príjmov a výdavkov.",
    GENERIC_VAT: "Skontrolujte zákonnú lehotu daňového úradu vašej krajiny.",
  },
  smallBusiness: {
    title: "Priznanie k DPH nie je potrebné (oslobodenie malého podnikateľa)",
    body: {
      SK_DPH: "Firma nie je platiteľom DPH.",
      DE_USTVA: "Pravidelné podanie UStVA sa nevyžaduje.",
      DE_EUR_SMALL_BUSINESS:
        "Firma uplatňuje oslobodenie podľa § 19 UStG. Pravidelné priznanie k DPH sa nepodáva. Nižšie nájdete prehľad príjmov a výdavkov (EÜR) za obdobie.",
      AT_UVA: "Pravidelné podanie UVA sa nevyžaduje.",
      AT_EA_SMALL_BUSINESS:
        "Firma uplatňuje oslobodenie malého podnikateľa podľa § 6 ods. 1 Z 27 UStG. Nižšie nájdete prehľad príjmov a výdavkov.",
      GENERIC_VAT: "Pre tento daňový režim nie je priznanie k DPH potrebné.",
    },
  },
  xmlSection: {
    SK_DPH: "Kontrolný výkaz (KV DPH)",
    DE_USTVA: "ELSTER UStVA XML",
    DE_EUR_SMALL_BUSINESS: "XML export",
    AT_UVA: "FinanzOnline UVA XML (U30)",
    AT_EA_SMALL_BUSINESS: "XML export",
    GENERIC_VAT: "XML export",
  },
  xmlNote: {
    SK_DPH: "Nahrajte KVDPHv25 XML cez portál eDane.",
    DE_USTVA:
      "XML ELSTER UStVA je pripravené na import u daňového poradcu alebo prenos cez ERiC. Priame odoslanie vyžaduje certifikát ERiC; údaje môžete zadať aj v Mein ELSTER alebo stiahnuť CSV.",
    DE_EUR_SMALL_BUSINESS: "Použite štruktúrovaný CSV export vyššie.",
    AT_UVA:
      "XML FinanzOnline U30 je pripravené na nahratie na portál alebo kontrolu poradcom.",
    AT_EA_SMALL_BUSINESS: "Použite štruktúrovaný CSV export vyššie.",
    GENERIC_VAT: "Použite štruktúrovaný CSV export vyššie.",
  },
  lines: {
    title: "Riadky priznania",
    line: "Riadok",
    meaning: "Význam",
    base: "Základ dane",
    amount: "Suma",
    r01: "Základ dane, sadzba 19 %",
    r02: "Daň, sadzba 19 %",
    r01a: "Základ dane, sadzba 5 %",
    r02a: "Daň, sadzba 5 %",
    r03: "Základ dane, sadzba 23 %",
    r04: "Daň, sadzba 23 %",
    r09: "Platiteľ je osobou povinnou platiť daň (§ 69), základ dane 19 %",
    r10: "Platiteľ je osobou povinnou platiť daň (§ 69), daň 19 %",
    r09a: "Platiteľ je osobou povinnou platiť daň (§ 69), základ dane 5 %",
    r10a: "Platiteľ je osobou povinnou platiť daň (§ 69), daň 5 %",
    r09b: "Platiteľ je osobou povinnou platiť daň (§ 69), základ dane 23 %",
    r10b: "Platiteľ je osobou povinnou platiť daň (§ 69), daň 23 %",
    r13: "Dodanie tovarov a služieb oslobodené od dane",
    r14: "z toho dodanie tovaru do iného členského štátu (§ 43)",
    r15: "z toho vývoz tovaru (§ 46, § 47)",
    r17: "Daň celkom",
    r18: "Odpočítanie dane, sadzba 19 %",
    r18a: "Odpočítanie dane, sadzba 5 %",
    r19: "Odpočítanie dane, sadzba 23 %",
    r20: "z toho z tuzemských faktúr, sadzba 19 %",
    r20a: "z toho z tuzemských faktúr, sadzba 5 %",
    r21: "z toho z tuzemských faktúr, sadzba 23 %",
    r24: "Oprava základu dane (dobropisy, § 25)",
    r25: "Oprava dane (dobropisy, § 25)",
    r32: "Vlastná daňová povinnosť",
    r33: "Nadmerný odpočet",
  },
  sections: {
    title: "Kontrolný výkaz",
    section: "Časť",
    count: "Riadky",
    A1: "A.1 Vyhotovené faktúry pre platiteľov DPH",
    A2: "A.2 Vyhotovené faktúry s tuzemským prenesením daňovej povinnosti",
    B1: "B.1 Prijaté faktúry, daň platíte vy",
    B2: "B.2 Prijaté tuzemské faktúry s odpočítaním dane",
    B31: "B.3.1 Prijaté zjednodušené faktúry (súhrnne)",
    C1: "C.1 Vyhotovené opravné faktúry",
    D1: "D.1 Tržby z pokladnice",
    D2: "D.2 Ostatné plnenia (odberatelia bez IČ DPH)",
  },
  warnings: {
    noVatId:
      "Firma nemá platné IČ DPH. Doplňte ho v nastaveniach firmy pred podaním.",
    noTaxId:
      "Firma nemá vyplnené daňové číslo. Doplňte ho v nastaveniach firmy pred exportom.",
    customerVatIds:
      "{{count}} faktúr pre odberateľov bez IČ DPH sa uvádza v časti D.2.",
    unmappedRates:
      "{{count}} riadkov má neštandardnú sadzbu a nie sú v priradených riadkoch. Skontrolujte ich.",
    b32Required:
      "Odpočítaná daň zo zjednodušených faktúr dosiahla 3 000 EUR. Pred podaním ich uveďte v časti B.3.2 podľa dodávateľov.",
  },
  actions: {
    downloadXml: "Stiahnuť XML",
    downloadCsv: "Stiahnuť CSV",
    showXml: "Zobraziť XML",
    hideXml: "Skryť XML",
    copy: "Kopírovať",
    copied: "Skopírované",
    copyError: "Kopírovanie zlyhalo. Označte text a skopírujte ho ručne.",
  },
  pickCompany: "Vyberte firmu, pre ktorú chcete pripraviť priznanie k DPH.",
  empty: "V tomto období nie sú žiadne relevantné doklady.",
  errors: {
    validation: {
      title: "Neplatná požiadavka",
      description: "Vyberte firmu a platný mesiac alebo štvrťrok.",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihláste sa, aby ste mohli pripraviť priznanie k DPH.",
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
      description: "Údaje sa počas prípravy zmenili. Skúste to znova.",
    },
    server: {
      title: "Priznanie sa nepripravilo",
      description: "Priznanie k DPH sa nepodarilo pripraviť. Skúste to znova.",
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
    title: "Priznanie k DPH pripravené",
    description: "Riadky a exportné súbory zodpovedajú uloženým dokladom.",
  },
};
