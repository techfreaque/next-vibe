import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "Pokladňa",
    order: "Objednávka",
    refund: "Vrátenie peňazí",
  },
  enums: {
    paymentMethod: {
      cash: "Hotovosť",
      card: "Karta",
      transfer: "Prevod",
      other: "Iné",
    },
  },
  get: {
    title: "Vrátenia peňazí za predaje",
    titleShort: "Vrátenia",
    description: "Čo sa predalo, čo sa vrátilo a čo sa ešte dá vrátiť.",
    orderId: {
      label: "Predaj",
      description: "Dokončený predaj",
    },
    response: {
      orderId: "Predaj",
      orderNumber: "Číslo predaja",
      status: "Stav",
      currency: "Mena",
      total: "Suma predaja",
      refundedTotal: "Vrátené",
      refundableTotal: "Ešte možno vrátiť",
      journalPosted: "Zaúčtované",
      lines: "Položky",
      orderItemId: "Riadok",
      description: "Položka",
      quantity: "Predané",
      refundedQuantity: "Vrátené",
      refundableQuantity: "Možno vrátiť",
      unitPrice: "Jednotková cena",
      lineTotal: "Suma riadka",
      taxRate: "Sadzba DPH",
      refunds: "Vrátenia",
      refundId: "Vrátenie",
      refundNumber: "Číslo vrátenia",
      method: "Vrátené cez",
      reason: "Dôvod",
      createdAt: "Dátum",
      cashSession: "Pokladničná zásuvka",
      sessionId: "Pokladničná zmena",
      terminalName: "Pokladňa",
      available: "Hotovosť v zásuvke",
    },
    widget: {
      back: "Späť",
      startRefund: "Vrátiť položky",
      fullyRefunded: "Všetko z tohto predaja bolo vrátené.",
      notCompleted: "Vrátiť možno iba dokončené predaje.",
      history: "História vrátení",
      noRefunds: "Tento predaj zatiaľ nemá žiadne vrátenia.",
      loading: "Načítavam predaj",
    },
    success: {
      title: "Vrátenia načítané",
      description: "Predaj a história vrátení sú aktuálne.",
    },
  },
  post: {
    title: "Vrátiť peniaze za predaj",
    titleShort: "Vrátiť",
    description:
      "Vráť peniaze za dokončený predaj, celé alebo po riadkoch. Tovar sa vráti na sklad a účtovníctvo sa dorovná.",
    orderId: {
      label: "Predaj",
      description: "Dokončený predaj, za ktorý sa vracajú peniaze",
    },
    lines: {
      label: "Položky na vrátenie",
      description:
        "Riadok a množstvo pre každú položku. Nechaj prázdne, ak chceš vrátiť všetko, čo zostalo.",
    },
    method: {
      label: "Vrátiť cez",
      description:
        "Ako sa peniaze vrátia. Hotovosť sa vyberá z otvorenej pokladničnej zásuvky.",
      placeholder: "Vyber spôsob vrátenia",
    },
    sessionId: {
      label: "Pokladničná zásuvka",
      description:
        "Otvorená pokladničná zmena, z ktorej sa vypláca hotovosť. Predvolene tvoja otvorená zmena na pokladni v mene predaja.",
    },
    reason: {
      label: "Dôvod",
      description: "Prečo sa peniaze vracajú. Uloží sa spolu s vrátením.",
      placeholder: "Napríklad: vrátený poškodený tovar",
    },
    response: {
      refundId: "Vrátenie",
      refundNumber: "Číslo vrátenia",
      orderId: "Predaj",
      sessionId: "Pokladničná zmena",
      method: "Vrátené cez",
      currency: "Mena",
      subtotal: "Bez DPH",
      taxAmount: "DPH",
      total: "Vrátené teraz",
      refundedTotal: "Vrátené spolu",
      fullyRefunded: "Vrátené celé",
      journalEntryId: "Účtovný zápis",
      stockReturned: "Produkty späť na sklade",
    },
    widget: {
      back: "Späť na predaj",
      items: "Čo sa vracia",
      selectAll: "Vrátiť všetko",
      clear: "Vymazať",
      decrease: "O jeden kus menej: {{item}}",
      increase: "O jeden kus viac: {{item}}",
      all: "Všetko",
      sold: "Predané {{quantity}}",
      alreadyRefunded: "{{quantity}} už vrátených",
      nothingLeft: "Vrátené celé",
      summary: "Vrátenie",
      net: "Bez DPH",
      vat: "DPH",
      total: "Suma vrátenia",
      cashFrom: "Vyplatené zo zásuvky na pokladni {{terminal}}",
      drawerAvailable: "V zásuvke: {{amount}}",
      noCashSession:
        "Otvor pokladničnú zmenu na pokladni v mene {{currency}}, aby si mohol vrátiť hotovosť.",
      drawerShort: "V zásuvke je menej hotovosti, než treba na toto vrátenie.",
      confirmTitle: "Vrátiť {{amount}}?",
      confirmDescription:
        "Peniaze sa vrátia cez: {{method}}. Sklad aj účtovníctvo sa aktualizujú. Vrátenie sa nedá zrušiť.",
      confirm: "Vrátiť",
      cancel: "Zrušiť",
      pickItems: "Vyber aspoň jednu položku.",
      reasonMissing: "Doplň dôvod.",
      loading: "Načítavam predaj",
      viewRefunds: "Zobraziť vrátenia",
      newSale: "Späť na predaj",
    },
    success: {
      title: "Vrátenie hotové",
      description: "Peniaze sú na ceste späť k zákazníkovi.",
    },
  },
  messages: {
    notCompleted: "Vrátiť možno iba dokončené predaje.",
    invalidLine: "Vyber položky z tohto predaja s množstvom väčším ako nula.",
    nothingLeft: "Pri tomto predaji už nie je čo vrátiť.",
    overRefund: "Je to viac, než sa predalo, po odpočítaní skorších vrátení.",
    rounding:
      "Toto vrátenie je príliš malé na vyplatenie. Pridaj ďalšie položky.",
    cashSessionRequired:
      "Vrátenie hotovosti vyžaduje otvorenú pokladničnú zmenu na pokladni v mene predaja.",
    sessionInvalid: "Vyber otvorenú pokladničnú zmenu tejto firmy.",
    cashCurrencyMismatch: "Táto pokladňa pracuje v inej mene než predaj.",
    drawerShort: "V zásuvke je menej hotovosti, než treba na toto vrátenie.",
    postingUnavailable:
      "Vrátenie sa nepodarilo zaúčtovať. Skontroluj, či je otvorené účtovné obdobie.",
    stockUnavailable:
      "Tovar sa nepodarilo vrátiť na sklad. Skontroluj, či je sklad aktívny.",
  },
  errors: {
    validation: {
      title: "Skontroluj vrátenie",
      description: "Vyber položky, spôsob vrátenia a dôvod.",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihlás sa, aby si mohol vracať peniaze za predaje.",
    },
    forbidden: {
      title: "Bez prístupu",
      description: "Nemôžeš vracať peniaze za predaje tejto firmy.",
    },
    notFound: {
      title: "Predaj sa nenašiel",
      description: "Tento predaj neexistuje alebo patrí inej firme.",
    },
    conflict: {
      title: "Vrátenie nie je možné",
      description: "Predaj alebo zásuvka toto vrátenie nepovoľujú.",
    },
    server: {
      title: "Vrátenie zlyhalo",
      description: "Nič sa nevrátilo. Skús to znova.",
    },
    unknown: {
      title: "Vrátenie zlyhalo",
      description: "Nič sa nevrátilo. Skús to znova.",
    },
    network: {
      title: "Bez pripojenia",
      description: "Skontroluj pripojenie a skús to znova.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv dokonči alebo zahoď svoje zmeny.",
    },
  },
};
