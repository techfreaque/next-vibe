import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    models: "Modely",
  },

  get: {
    title: "Vzor katalógu Scan",
    titleShort: "Katalógový sken",
    description:
      "Najnovšie skenovanie modelového zoznamu každého poskytovateľa: nové modely proti prúdu zatiaľ neslúžime, cenový posun, odstránené ids a ohlásené vypnutie. Len na čítanie.",
    success: {
      title: "Načítaný sken",
      description: "Najnovšie model katalóg skenovanie načítané.",
    },
  },

  post: {
    title: "Spustiť model katalógu Scan",
    titleShort: "Spustiť skenovanie",
    description:
      "Získajte zoznam modelov každého poskytovateľa a živé ceny teraz, diff je proti našim definíciám, uložiť správu a poslať ju do priečinkov operácií. Nikdy neupravujte kód.",
    fields: {
      force: {
        label: "Spustiť aj v prípade, že nedávno",
        description:
          "Preskočte 5-dňovú stráž. Bez nej sa sken mladší ako 5 dní vráti tak, ako je.",
      },
      sendEmail: {
        label: "E-mailom správu",
        description: "Pošlite správu na adresu hi@ a thea@ unbottled.ai.",
      },
    },
    success: {
      title: "Sken ukončený",
      description: "Modelový katalóg uložený.",
    },
  },

  response: {
    scan: "Skenovanie",
    report: "Správa",
    history: "Predchádzajúce skeny",
    skipped: "Skipped (nedávny sken)",
    reportText: "Správa",
  },

  widget: {
    back: "Späť",
    runNow: "Spustite skenovanie",
    running: "Prehľadáva sa…",
    empty: {
      title: "Zatiaľ žiadny sken",
      message:
        "Prvý sken beží na svojom dennom rozvrhu. Spustite jeden teraz vidieť, čo zmenilo proti prúdu.",
    },
    skipped:
      'Sken z posledných 5 dní už existuje, takže nič nové bolo prinesené. Tick "Utekať aj keď nedávna" vynútiť jeden.',
    scannedAt: "Skenované",
    newSince: "Nový od",
    emailedTo: "E-mail",
    notEmailed: "Neposlané",
    emailError: "E- mail zlyhal",
    metrics: {
      newModels: "Nové modely",
      uncensored: "Necenzurovaný",
      priceChanges: "Zmeny cien",
      missing: "Preč proti prúdu",
      deprecations: "Vypovedanie",
      sourceErrors: "Zlyhané zdroje",
    },
    sections: {
      newModels: "Nové modely v počiatočnej fáze",
      priceChanges: "Cenový a kontextový posun",
      missing: "Preč proti prúdu",
      deprecations: "Ohlásené vypnutie",
      sources: "Zdroje",
      history: "Predchádzajúce skeny",
    },
    legacy: "odkaz",
    suspect: "podozrivý, skontrolujte sťahováka",
    uncensored: "bez cenzorovaného",
    ok: "Ok.",
    failed: "zlyhal",
    models: "modely",
    perMillion: "na 1M",
    context: "ctx",
    nothing: "Nič tu nie je.",
  },

  task: {
    name: "Vzor katalógu Scan",
    description:
      "Každých 5 dní: zoznam modelov a ceny pre poskytovateľa diff oproti nášmu katalógu, skladovaniu a pošte správu.",
  },

  errors: {
    scanFailed: "Modelový katalóg zlyhal: {{error}}",
    loadFailed: "Nepodarilo sa načítať sken z katalógu modelu: {{error}}",
    server: {
      title: "Chyba servera",
      description: "Sken sa nepodarilo dokončiť. Skontrolujte záznamy servera.",
    },
    network: {
      title: "Chyba siete",
      description: "Nepodarilo sa dovolať serveru.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Niečo nečakané sa pokazilo.",
    },
    validation: {
      title: "Neplatný vstup",
      description: "Skontrolujte možnosti skenovania.",
    },
    unauthorized: {
      title: "Neprihlásený účet",
      description: "Prihláste sa ako admin pre zobrazenie katalógových skenov.",
    },
    forbidden: {
      title: "iba administrátori",
      description:
        "Iba redaktori môžu zobraziť alebo spustiť katalógové skeny.",
    },
    notFound: {
      title: "Nenájdené",
      description: "Nenašiel sa žiadny katalóg.",
    },
    conflict: {
      title: "Konflikt",
      description: "Skús to o chvíľu.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv si uložte alebo zahoďte zmeny.",
    },
  },
};
