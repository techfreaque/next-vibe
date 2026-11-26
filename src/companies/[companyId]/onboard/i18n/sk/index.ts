import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Rakúsko (AT)",
      DE: "Nemecko (DE)",
      XX: "Všeobecný účtový rozvrh (nastavte sadzby dane ručne)",
      SK: "Slovensko (SK)",
    },
  },
  tags: { companies: "firmy", onboard: "spustenie", setup: "nastavenie" },
  post: {
    title: "Nastaviť účtovníctvo",
    titleShort: "Nastaviť účtovníctvo",
    description:
      "Nastavte účtový rozvrh a pripravte pokladničné a bankové účty na účtovanie.",
    companyId: { label: "Firma", description: "Firma" },
    country: {
      genericPreview:
        "Pridá všeobecný účtový rozvrh. Pred vystavením faktúr nastavte sadzby dane.",
      regionalPreview:
        "Použije účtový rozvrh a predvolené sadzby DPH podľa zvolenej krajiny.",
      label: "Účtovná šablóna",
      description:
        "Pre firmu registrovanú v Rakúsku alebo Nemecku vyberte príslušnú krajinu. Pre ostatné krajiny vyberte všeobecnú účtovú osnovu.",
      placeholder: "Vyberte šablónu",
    },
    period: {
      title: "Prvé účtovné obdobie",
      open: "Otvoriť účtovné obdobie pri nastavovaní",
      description:
        "Predvolený je aktuálny mesiac. Zmenou dátumov nastavíte vlastné alebo ročné obdobie.",
      name: "Názov účtovného obdobia",
      start: "Dátum začiatku",
      end: "Dátum konca",
      proposal: "Navrhované obdobie {{name}} od {{start}} do {{end}}",
      kept: "Existujúci kalendár účtovných období zostane zachovaný.",
      invalid:
        "Zadajte názov obdobia a koncový dátum, ktorý nie je pred počiatočným dátumom.",
      opened: "Obdobie {{name}} je otvorené na účtovanie.",
      view: "Zobraziť účtovné obdobia",
      viewHint: "Skontrolujte kalendár účtovných období.",
      createHint: "Pred zaúčtovaním prvého zápisu vyberte dátumy.",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte všetky polia",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete nastaviť účtovníctvo firmy, prihláste sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na nastavenie potrebujete oprávnenia správcu.",
      },
      conflict: {
        title: "Existujúci účtový rozvrh vychádza zo šablóny inej krajiny",
        description:
          "Pred zmenou účtovnej šablóny skontrolujte existujúci účtový rozvrh.",
      },
      profileMismatch: "Vyberte šablónu pre krajinu uvedenú v profile firmy.",
      server: {
        title: "Chyba servera",
        description: "Účtovníctvo sa nepodarilo nastaviť.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie a skúste to znova.",
      },
      notFound: {
        title: "Firma sa nenašla",
        description: "Táto firma neexistuje.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Účtovníctvo je nastavené",
      description:
        "Účtový rozvrh je pripravený. Môžete otvoriť účtovné obdobie a začať vytvárať doklady.",
    },
    widget: {
      books: "Nastavenie účtovníctva",
      setupCounts:
        "Pripravené účty: {{accounts}} · Pridané sadzby dane: {{rates}}",
      invoiceHint:
        "Pripravte návrh faktúry pre túto firmu. Pred vystavením ho môžete skontrolovať.",
      submit: "Nastaviť účtovníctvo",
      company: "Firma: {{name}}",
      back: "Späť",
      cashAndBankReady: "Na pokladničné a bankové účty už možno účtovať.",
      nextHint: "Pred zaúčtovaním zápisov otvorte účtovné obdobie.",
      period: "Vytvoriť účtovné obdobie",
      invoice: "Vytvoriť návrh faktúry",
    },
    response: {
      accountsCreated: "Pridané účty",
      accountsSkipped: "Existujúce účty",
      taxRatesCreated: "Pridané sadzby dane",
      cashAccountId: "ID účtu pokladnice",
      bankAccountId: "ID bankového účtu",
      success: "Úspech",
    },
  },
};
