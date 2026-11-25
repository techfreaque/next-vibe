import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    consent: "Súhlas",
  },

  get: {
    title: "Súhlas s používaním modelov bez cenzúry",
    titleShort: "Súhlas s modelmi bez cenzúry",
    description:
      "Zobrazí stav potvrdenia veku aspoň 18 rokov a súhlasu s nefiltrovanými odpoveďami pre účet alebo hosťa. Modely bez cenzúry sa spustia až po potvrdení.",
    response: {
      consented: "Potvrdené",
      consentedAt: "Potvrdené dňa",
      version: "Verzia súhlasu",
    },
    success: {
      title: "Načítaný status súhlasu",
      description: "Aktuálny status súhlasu bez cenzurovaného modelu",
    },
  },

  post: {
    title: "Odomknúť modely bez cenzúry",
    titleShort: "Odomknúť modely",
    description:
      "Jednorazové potvrdenie pre modely bez cenzúry. Potvrdzujete, že máte aspoň 18 rokov a beriete na vedomie, že modely môžu bez filtrovania vytvárať urážlivý, nepravdivý, nebezpečný, nezákonný alebo škodlivý obsah. Súhlas musí potvrdiť človek osobne. AI ho nemôže potvrdiť za vás.",
    fields: {
      confirm: {
        label: "Mám aspoň 18 rokov a súhlasím",
        description:
          "Hodnotou true potvrdíte, že máte aspoň 18 rokov, súhlasíte s nefiltrovaným obsahom a preberáte zodpovednosť za jeho používanie.",
      },
    },
    success: {
      title: "Necenzurované modely odomknuté",
      description: "Potvrdenie sa uložilo. Nebudeme ho žiadať znova.",
    },
  },

  delete: {
    title: "Odvolať súhlas s modelmi bez cenzúry",
    titleShort: "Odvolanie súhlasu",
    description:
      "Odvolá súhlas. Modely bez cenzúry ostanú zamknuté, kým ich nepotvrdíte znova.",
    success: {
      title: "Stiahnutý súhlas",
      description: "Necenzorované modely sú opäť zamknuté.",
    },
  },

  errors: {
    validation: {
      title: "Chýbajúce potvrdenie",
      description: "Potvrdiť, že máte 18+ a prijať podmienky pokračovať.",
    },
    unauthorized: {
      title: "Nepovolené",
      description: "Nemôžeš zmeniť tento súhlas.",
    },
    forbidden: {
      title: "Prístup zakázaný",
      description: "Táto akcia tu nie je k dispozícii.",
    },
    notFound: {
      title: "Nenájdené",
      description: "Nebol nájdený žiadny účet alebo hosť.",
    },
    server: {
      title: "Chyba servera",
      description: "Nemohol som zachrániť tvoju voľbu.",
    },
    network: {
      title: "Chyba siete",
      description: "Server nie je dosiahnuteľný. Skontrolujte si pripojenie.",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Niečo sa pokazilo.",
    },
    conflict: {
      title: "Konflikt",
      description: "Váš súhlas sa zmenil v inej karte.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv to potvrďte alebo zrušte.",
    },
    noIdentity:
      "Žiadny účet alebo hosť relácie. Znovu načítať stránku a skúste to znova.",
    saveFailed: "Nemohol som zachrániť tvoju voľbu.",
  },

  gate: {
    required:
      "Model {{model}} odpovedá bez cenzúry. Raz potvrďte, že máte aspoň 18 rokov a beriete na vedomie, že modely bez cenzúry môžu vytvárať urážlivý, nepravdivý, nebezpečný, nezákonný alebo škodlivý obsah. Potvrďte to osobne v chate alebo príkazom vibe uncensored-consent-agree --confirm=true",
    apiRequired:
      "Model {{model}} odpovedá bez cenzúry. Pri tomto účte ešte nebol potvrdený vek aspoň 18 rokov a súhlas s nefiltrovaným obsahom. Na stránke kľúčov API raz začiarknite súhlas s modelmi bez cenzúry a skúste znova.",
  },

  dialog: {
    eyebrow: "Necenzurované modely",
    title: "Iba pre dospelých. Bez filtrov.",
    stance:
      "O tom, čo čítate, rozhodujete vy. Preto si vypýtame jednorazový súhlas a jednotlivé odpovede už filtrovať nebudeme.",
    modelLine: "Tento chat používa model {{model}}.",
    pointAge: "Mám aspoň 18 rokov.",
    pointContent:
      "Modely bez cenzúry môžu vytvárať urážlivý, nepravdivý, nebezpečný, nezákonný alebo škodlivý obsah.",
    pointNoFilter: "Odpovede nefiltruje model ani naša platforma.",
    pointResponsible: "Beriem zodpovednosť za to, ako odpovede použijem.",
    agree: "Mám aspoň 18 rokov a súhlasím",
    agreeing: "Ukladá sa…",
    pickAnother: "Vyberte si iný model",
    close: "Zavrieť",
    footnote: "Potvrdíte raz. Súhlas môžete kedykoľvek odvolať v nastaveniach.",
    saveFailed: "Nemohol som zachrániť.",
  },

  widget: {
    title: "Necenzurované modely",
    statusOn: "Odomknuté",
    statusOff: "Zamknuté",
    since: "Potvrdené {{date}}",
    onBody:
      "Potvrdili ste, že máte aspoň 18 rokov a súhlasíte s nefiltrovaným obsahom. Modely bez cenzúry odpovedajú bez filtrov.",
    offBody:
      "Modely bez cenzúry sa odomknú po potvrdení veku aspoň 18 rokov a súhlasu s nefiltrovaným obsahom.",
    outdatedBody:
      "Od vášho potvrdenia sa znenie súhlasu zmenilo. Ak chcete ďalej používať modely bez cenzúry, potvrďte ho znova.",
    withdraw: "Odvolanie súhlasu",
    withdrawing: "Odstraňujem...",
    unlock: "Odomknúť necenzorované modely",
    guestNote:
      "Uložené pre tento prehliadač. Zaregistrujte sa a presunie sa na vaše konto.",
    loading: "Načítavam súhlas...",
    back: "Späť",
    menuLabel: "Necenzurované modely",
    menuOn: "Na",
    menuOff: "Vypnuté",
  },
};
