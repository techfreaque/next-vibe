import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { tax: "Dane", vatReturn: "Daňové priznanie k DPH" },
  title: "Daňové priznanie k DPH a kontrolný výkaz",
  titleShort: "Priznanie k DPH (SK)",
  description:
    "Pripravte riadky daňového priznania k DPH a XML kontrolného výkazu za mesiac alebo štvrťrok.",
  company: { label: "Firma", description: "Firma registrovaná pre DPH" },
  period: {
    label: "Zdaňovacie obdobie",
    description: "Mesiac alebo štvrťrok priznania",
    month: "{{month}} {{year}}",
    quarter: "{{quarter}}. štvrťrok {{year}}",
  },
  unsupportedCountry:
    "Daňové priznanie k DPH sa pripravuje len pre slovenské firmy. Nastavte krajinu firmy na Slovensko.",
  disclaimer:
    "Poskytujeme nástroje, nie daňové poradenstvo. Pred podaním cez eDane si podania overte u svojho daňového poradcu.",
  summary: "{{company}}, od {{from}} do {{to}}",
  due: "Lehota: do 25. dňa nasledujúceho mesiaca, elektronicky.",
  lines: {
    title: "Riadky daňového priznania k DPH (DPHv25)",
    line: "Riadok",
    meaning: "Význam",
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
    title: "Kontrolný výkaz (KV DPH)",
    section: "Časť",
    count: "Riadky",
    A1: "A.1 Vyhotovené faktúry pre platiteľov DPH",
    A2: "A.2 Vyhotovené faktúry s tuzemským prenesením daňovej povinnosti",
    B1: "B.1 Prijaté faktúry, daň platíte vy",
    B2: "B.2 Prijaté tuzemské faktúry s odpočítaním dane",
    B31: "B.3.1 Prijaté zjednodušené faktúry (súhrnne)",
    C1: "C.1 Vyhotovené opravné faktúry",
    D1: "D.1 Tržby z eKasy",
    D2: "D.2 Ostatné plnenia (odberatelia bez IČ DPH)",
  },
  warnings: {
    noVatId:
      "Firma nemá platné IČ DPH. XML kontrolného výkazu ho pred podaním vyžaduje.",
    customerVatIds:
      "{{count}} faktúr pre odberateľov bez IČ DPH sa uvádza v časti D.2.",
    unmappedRates:
      "{{count}} riadkov má inú sadzbu ako 23 / 19 / 5 % a nie sú v priznaní. Skontrolujte ich.",
    b32Required:
      "Odpočítaná daň zo zjednodušených faktúr dosiahla 3 000 EUR. Pred podaním ich uveďte v časti B.3.2 podľa dodávateľov.",
  },
  actions: {
    downloadKv: "Stiahnuť XML KV DPH",
    downloadCsv: "Stiahnuť riadky priznania (CSV)",
    showXml: "Zobraziť XML",
    hideXml: "Skryť XML",
    copy: "Kopírovať",
    copied: "Skopírované",
    copyError: "Kopírovanie zlyhalo. Označte text a skopírujte ho ručne.",
  },
  pickCompany: "Vyberte firmu, pre ktorú chcete pripraviť priznanie k DPH.",
  empty: "V tomto období nie sú žiadne doklady relevantné pre DPH.",
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
    description: "Riadky a kontrolný výkaz zodpovedajú uloženým dokladom.",
  },
};
