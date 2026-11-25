import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Záväzky voči dodávateľom",
  titleShort: "Veková štruktúra záväzkov",
  description: "Záväzky voči dodávateľom podľa počtu dní po splatnosti.",
  tag: "Veková štruktúra záväzkov",
  company: {
    label: "Firma",
    description:
      "Vyberte firmu, ktorej dodávateľské faktúry chcete skontrolovať.",
    choose: "Vyberte firmu",
    empty: "Vyberte firmu a zobrazte si jej záväzky voči dodávateľom.",
  },
  currency: {
    label: "Mena",
    description:
      "Prehľad zobrazuje faktúry v jednej mene. Sumy sa neprepočítavajú.",
    default: "Mena firmy",
    codes: {
      EUR: "EUR",
      USD: "USD",
      PLN: "PLN",
    },
  },
  agingDate: {
    label: "Rozhodný dátum",
    description: "Dátum, ku ktorému sa počíta počet dní po splatnosti faktúry.",
  },
  columns: {
    supplier: "Dodávateľ",
    vat: "IČ DPH",
    current: "V lehote splatnosti",
    days1to30: "1 až 30 dní",
    days31to60: "31 až 60 dní",
    days61to90: "61 až 90 dní",
    over90: "91 a viac dní",
    undated: "Bez dátumu splatnosti",
    total: "Spolu",
    billNumber: "Číslo dodávateľskej faktúry",
    billDate: "Dátum dodávateľskej faktúry",
    dueDate: "Dátum splatnosti",
    billAmount: "Suma v centoch",
  },
  approved: {
    title: "Schválené a neuhradené",
    empty: "Žiadne schválené faktúry na úhradu",
    emptyDescription:
      "Tu sa zobrazia schválené dodávateľské faktúry s neuhradeným zostatkom.",
  },
  received: {
    title: "Čakajú na schválenie",
    empty: "Žiadne faktúry nečakajú na schválenie",
    emptyDescription:
      "Prijaté dodávateľské faktúry sa tu zobrazia do schválenia.",
  },
  disputed: {
    title: "Sporné",
    empty: "Žiadne sporné faktúry",
    emptyDescription:
      "Sporné faktúry sa nezapočítavajú do súčtu schválených faktúr ani faktúr čakajúcich na schválenie.",
  },
  widget: {
    asOf: "Stav k {{date}}",
    back: "Späť",
    loading: "Načítavajú sa záväzky…",
    details: "Faktúry od dodávateľa {{supplier}}",
    unknownSupplier: "Neznámy dodávateľ",
    datedBill: "Dodávateľská faktúra zo dňa {{date}}",
    due: "Splatnosť {{date}}",
  },
  success: {
    title: "Záväzky sú načítané",
    description:
      "Dodávateľské faktúry vybranej firmy sú pripravené na kontrolu.",
  },
  errors: {
    validation: {
      title: "Skontrolujte filtre prehľadu",
      description: "Vyberte platný dátum a menu prehľadu.",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Ak chcete zobraziť záväzky voči dodávateľom, prihláste sa.",
    },
    forbidden: {
      title: "Firma nie je dostupná",
      description: "Nemáte prístup k dodávateľským faktúram tejto firmy.",
    },
    notFound: {
      title: "Záznam sa nenašiel",
      description: "Požadovaný záznam sa nepodarilo nájsť.",
    },
    server: {
      title: "Záväzky sa nepodarilo načítať",
      description: "Skúste prehľad načítať znova.",
    },
    network: {
      title: "Pripojenie nie je dostupné",
      description: "Skontrolujte pripojenie a skúste to znova.",
    },
    conflict: {
      title: "Konflikt údajov v prehľade",
      description: "Obnovte údaje a spustite prehľad znova.",
    },
    unknown: {
      title: "Neočakávaná chyba",
      description: "Skúste to znova alebo kontaktujte podporu.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Pred odchodom zmeny uložte alebo zahoďte.",
    },
  },
};
