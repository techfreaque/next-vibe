import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Platby",
  tag: "Oznámenie o presune plánu",

  post: {
    title: "Oznámenie o presune plánu",
    titleShort: "Presun plánu",
    description:
      "Jednorazový mail každému predplatiteľovi, ktorý platí kartou: presunúť plán k novému poskytovateľovi platieb. Skúšobný beh vypíše príjemcov a vykreslí náhľad. Ostrý beh napíše každému používateľovi iba raz a odmietne sa spustiť, kým nový poskytovateľ nebeží.",
    container: {
      title: "Oznámenie o presune plánu",
      description:
        "Predplatitelia s kartou (aktívni, v skúšobnom období, s nezaplatenou platbou, končiaci ku koncu obdobia), ktorým ešte neprišiel mail",
    },
    fields: {
      dryRun: {
        label: "Skúšobný beh",
        description: "Vypíše príjemcov a vykreslí náhľad. Nič neodošle.",
      },
      batchSize: {
        label: "Veľkosť dávky",
        description:
          "Najviac mailov v tomto behu (obmedzené aj hodinovým rozpočtom)",
      },
      hourlyCap: {
        label: "Hodinový limit",
        description:
          "Najviac mailov platformy za hodinu, vrátane všetkých mailov (limit schránky je 500)",
      },
      previewLocale: {
        label: "Jazyk náhľadu",
        description: "Vykresliť mail v tomto jazyku",
      },
      testRecipient: {
        label: "Testovací príjemca",
        description:
          "Pošle skutočný mail len na túto adresu. Bez kontroly, či poskytovateľ beží, nikto sa neoznačí ako upozornený.",
      },
    },
    response: {
      providerLive: "Nový poskytovateľ beží",
      targetProvider: "Nový poskytovateľ",
      totalRecipients: "Predplatitelia s kartou",
      alreadyNotified: "Už oslovení",
      pending: "Zostáva osloviť",
      planNotSupported:
        "Plán u nového poskytovateľa nie je dostupný (preskočené)",
      hourlyBudget: "Zostávajúci hodinový rozpočet",
      sent: "Odoslané",
      failed: "Neúspešné",
      byLocale: "Podľa jazyka",
      locale: "Jazyk",
      count: "Počet",
      recipients: "Príjemcovia v tomto behu",
      userId: "Používateľ",
      email: "E-mail",
      status: "Stav",
      deadline: "Termín",
      testSentTo: "Test odoslaný na",
      previewSubject: "Predmet náhľadu",
      previewHtml: "HTML náhľadu",
    },
    widget: {
      dryRunBadge: "Skúšobný beh",
      liveBadge: "Ostrý beh",
      notLive: "Nový poskytovateľ ešte nebeží. Ostrý beh sa odmietne.",
      run: "Spustiť",
      noRecipients: "Už nie je komu písať.",
    },
    errors: {
      notLive: {
        title: "Nový poskytovateľ nebeží",
        description:
          "Nastav SUBSCRIPTION_SWITCH_PROVIDER a SUBSCRIPTION_SWITCH_ENABLED=true a pred odoslaním over, že poskytovateľ prijíma platby.",
      },
      validation: {
        title: "Neplatná požiadavka",
        description: "Skontroluj polia a skús to znova.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Len pre adminov.",
      },
      forbidden: {
        title: "Nepovolené",
        description: "Len pre adminov.",
      },
      server: {
        title: "Beh zlyhal",
        description: "Beh oznámení zlyhal. Pozri logy.",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Stalo sa niečo neočakávané.",
      },
    },
    success: {
      title: "Beh oznámení hotový",
      description: "Čísla nájdeš nižšie.",
    },
  },

  emailTemplate: {
    name: "Oznámenie o presune plánu",
    description:
      "Jednorazový mail, ktorý žiada predplatiteľov s kartou, aby presunuli plán k novému poskytovateľovi platieb",
    category: "Predplatné",
    preview: {
      privateName: {
        label: "Meno",
        description: "Krstné meno predplatiteľa",
      },
      planName: {
        label: "Plán",
        description: "Názov plánu",
      },
      deadline: {
        label: "Termín",
        description: "Posledný deň zaplateného obdobia",
      },
    },
  },

  email: {
    subject:
      "Príliš veľa slobody pre nášho kartového spracovateľa. Presuň plán do {{deadline}}",
    subjectPastDue:
      "Príliš veľa slobody pre nášho kartového spracovateľa. Presuň plán hneď",
    subjectNoDate:
      "Príliš veľa slobody pre nášho kartového spracovateľa. Presuň plán a nechaj si ho",
    previewText:
      "Jeden klik a plán ti zostane. Rovnaká cena, kredity v bezpečí.",
    headline: "Pre ich pravidlá príliš slobodné. Pre teba akurát.",
    greeting: "Ahoj {{privateName}},",
    intro:
      "Náš spracovateľ kartových platieb rozhodol, že AI, ktorá odpovedá slobodne, nezapadá do jeho pravidiel, a tak sa platby kartou za tvoj plán {{planName}} zastavili. Jedným klikom ho presunieš na našu novú platobnú bránu do {{deadline}}, inak plán skončí {{deadline}} a tvoje kredity zostanú.",
    introPastDue:
      "Náš spracovateľ kartových platieb rozhodol, že AI, ktorá odpovedá slobodne, nezapadá do jeho pravidiel, a tak posledné obnovenie tvojho plánu {{planName}} neprešlo. Jedným klikom presunieš plán na našu novú platobnú bránu hneď teraz a tvoje kredity zostanú v každom prípade.",
    introNoDate:
      "Náš spracovateľ kartových platieb rozhodol, že AI, ktorá odpovedá slobodne, nezapadá do jeho pravidiel, a tak sa platby kartou za tvoj plán {{planName}} zastavili. Jedným klikom ho presunieš na našu novú platobnú bránu, inak plán skončí po uplynutí zaplateného obdobia a tvoje kredity zostanú.",
    cta: "Presunúť môj plán",
    reassurance:
      "Rovnaký plán, rovnaká cena a zaplatené dni sa prenesú. Nikdy nezaplatíš dvakrát. Každý kredit zostáva tvoj.",
    stance:
      "Skôr vymeníme spracovateľa platieb, než by sme cenzurovali jedinú odpoveď.",
    crypto: "Radšej platíš kryptom? Aj to ide.",
    cryptoCta: "Zaplatiť kryptom",
    help: "Otázky? Stačí odpísať na tento mail. Každú odpoveď číta človek.",
    signoff: "Vďaka, že stojíš pri nás,\nTím {{appName}}",
  },
};
