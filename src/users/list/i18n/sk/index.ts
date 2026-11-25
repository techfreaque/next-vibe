import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Používatelia",
  get: {
    title: "Používatelia",
    titleShort: "Používatelia",
    description:
      "Pri každom účte uvidíte platby, spotrebu kreditov a poslednú aktivitu. Účty môžete filtrovať podľa tržieb, aktivity, dátumu registrácie či zdroja a zoradiť podľa ľubovoľného finančného stĺpca.",
    fields: {
      hasSpentCredits: "Minuté kredity",
      requiredState: {
        label: "Požadovaný stav",
        description: "Zahrnúť iba účty, ktoré spĺňajú aj túto podmienku",
      },
      accountLocale: {
        label: "Jazyk a región účtu",
        description: "Presný kód jazyka a regiónu účtu, napríklad en-US",
      },
      attributedRefCode: {
        label: "Priradený kód odporúčania",
        description:
          "Kód, ktorému sa pripísalo odporúčanie. Ak taký nie je, použije sa kód z prvej návštevy.",
      },
      search: {
        label: "Hľadať účty",
        description: "E-mail, meno alebo začiatok ID používateľa",
        placeholder: "Hľadajte podľa e-mailu, mena alebo ID…",
      },
      roles: {
        label: "Roly",
        description: "Používatelia s aspoň jednou z vybraných rolí",
        placeholder: "Ľubovoľná rola",
      },
      accountState: {
        label: "Stav účtu",
        description:
          "Aktívne, neaktívne, zablokované, overené alebo neoverené účty",
        placeholder: "Ľubovoľný stav",
      },
      payer: {
        label: "Platiace a bezplatné účty",
        description:
          "Za platiaci sa považuje účet, ktorý má aspoň jednu úspešnú platbu",
        placeholder: "Platiace a bezplatné účty",
      },
      subscription: {
        label: "Predplatné",
        description:
          "Účty s aktívnym predplatným, niekdajší predplatitelia alebo účty bez histórie predplatného",
        placeholder: "Ľubovoľné predplatné",
      },
      lastActive: {
        label: "Posledná aktivita",
        description:
          "Za aktivitu sa počíta čerpanie kreditov, prihlásenie alebo platba",
        placeholder: "Kedykoľvek",
      },
      signupFrom: {
        label: "Registrácia od",
        description: "Prvý deň registrácie zahrnutý vo výsledkoch",
      },
      signupTo: {
        label: "Registrácia do",
        description: "Posledný deň registrácie zahrnutý vo výsledkoch",
      },
      creditsMin: {
        label: "Najnižší počet kreditov",
        description: "Minimálny zostatok v peňaženke",
      },
      creditsMax: {
        label: "Najvyšší počet kreditov",
        description: "Maximálny zostatok v peňaženke",
      },
      source: {
        label: "Zdroj",
        description:
          "Kanál prvej návštevy, zdroj, médium alebo kampaň UTM, doména odkazujúcej stránky alebo kód odporúčania",
        placeholder: "google, ref:, newsletter…",
      },
      referralActivity: {
        label: "Odporúčania používateľa",
        description:
          "Používatelia, ktorí zdieľajú odkaz na odporúčanie, a výsledky ich odporúčaní",
        placeholder: "Ľubovoľné",
      },
      audience: {
        label: "Publikum",
        description:
          "Filter „Iba ľudia“ vylúči správcov a testovacie adresy (example.com, .invalid a .test).",
        placeholder: "Všetci",
      },
      channel: {
        label: "Kanál",
        description:
          "Presná zhoda s kanálom prvej návštevy (google, youtube, direct). Pre účty bez záznamu o návšteve zadajte none.",
        placeholder: "youtube",
      },
      channelType: {
        label: "Typ kanála",
        description: "Ako sa k nám používateľ dostal pri prvej návšteve",
        placeholder: "Ľubovoľný typ",
      },
      refCode: {
        label: "Kód odporúčania",
        description:
          "Presná zhoda s kódom z prvej návštevy alebo s kódom, ktorému sa pripísalo odporúčanie",
        placeholder: "FRIEND2024",
      },
      plan: {
        label: "Plán",
        description: "Aktívne alebo skúšobné predplatné v tomto pláne",
        placeholder: "Ľubovoľný plán",
      },
      activeFrom: {
        label: "Čerpanie kreditov od",
        description: "Účty, ktoré v tento deň alebo neskôr čerpali kredity",
      },
      activeTo: {
        label: "Čerpanie kreditov do",
        description: "Účty, ktoré najneskôr v tento deň čerpali kredity",
      },
      spentMin: {
        label: "Minuté kredity najmenej",
        description:
          "Celkový počet minutých kreditov. S filtrom „Bez platby“ nájdete účty, ktoré čerpajú iba bezplatné kredity.",
      },
      paidFrom: {
        label: "Platby od",
        description: "Účty s úspešnou platbou v tento deň alebo neskôr",
      },
      paidTo: {
        label: "Platby do",
        description: "Účty s úspešnou platbou najneskôr v tento deň",
      },
      sortBy: {
        label: "Zoradiť podľa",
        description: "Stĺpec, podľa ktorého sa účty zoradia",
      },
      sortOrder: {
        label: "Poradie",
        description: "Vzostupne alebo zostupne",
      },
      page: {
        label: "Strana",
        description: "Číslo strany od 1",
      },
      limit: {
        label: "Na stranu",
        description: "Počet používateľov na stranu, najviac 200",
      },
    },
    response: {
      users: "Používatelia",
      summary: "Súhrn",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete zobraziť používateľov, prihláste sa",
      },
      validation: {
        title: "Neplatné filtre",
        description: "Skontrolujte hodnoty filtrov a skúste to znova",
      },
      forbidden: {
        title: "Len pre správcov",
        description: "Na zobrazenie používateľov potrebujete rolu správcu",
      },
      server: {
        title: "Používateľov sa nepodarilo načítať",
        description: "Server nedokázal načítať zoznam používateľov",
      },
      unknown: {
        title: "Neočakávaná chyba",
        description: "Pri načítaní používateľov sa vyskytla chyba",
      },
      conflict: {
        title: "Konflikt údajov",
        description: "Požiadavka je v rozpore s aktuálnymi údajmi",
      },
      network: {
        title: "Chyba siete",
        description: "So serverom sa nepodarilo spojiť",
      },
      notFound: {
        title: "Žiadni používatelia",
        description: "Zadaným filtrom nezodpovedá žiadny používateľ",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Používatelia sa načítali",
      description: "Zoznam používateľov sa načítal",
    },
  },
  enums: {
    audience: {
      all: "Všetci",
      humans: "Iba ľudia",
    },
    channelType: {
      campaign: "Kampaň",
      referral: "Odporúčanie",
      organic: "Organická návštevnosť",
      direct: "Priama návšteva",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    sortOrder: {
      asc: "Vzostupne",
      desc: "Zostupne",
    },
    role: {
      admin: "Správca",
      customer: "Zákazník",
      partnerAdmin: "Správca partnera",
      partnerEmployee: "Zamestnanec partnera",
      public: "Verejnosť",
    },
    subscription: {
      any: "Ľubovoľné",
      hasActive: "Aktívne predplatné",
      hadAny: "Súčasní aj bývalí predplatitelia",
      never: "Nikdy nemali predplatné",
    },
    referrer: {
      any: "Ľubovoľné",
      hasCode: "Má odkaz na odporúčanie",
      hasClicks: "Odkaz s kliknutiami",
      hasSignups: "Odkaz priniesol registrácie",
      hasSubscribers: "Odkaz priniesol platiacich predplatiteľov",
    },
    sortField: {
      createdAt: "Dátum registrácie",
      lastActive: "Posledná aktivita",
      credits: "Zostatok kreditov",
      totalPaid: "Zaplatené spolu",
      creditsSpent: "Minuté kredity",
      email: "E-mail",
      name: "Meno",
    },
    accountState: {
      active: "Aktívny",
      inactive: "Neaktívny",
      banned: "Zablokovaný",
      verified: "Overený e-mail",
      unverified: "Neoverený e-mail",
    },
    payer: {
      any: "Platiace a bezplatné účty",
      paid: "Platiaci",
      free: "Bez platby",
    },
    lastActive: {
      any: "Kedykoľvek",
      day: "Posledných 24 hodín",
      week: "Posledných 7 dní",
      month: "Posledných 30 dní",
      dormant: "Bez aktivity aspoň 30 dní",
      never: "Bez doterajšej aktivity",
    },
  },
  widget: {
    spent30d: "{{count}} za 30 dní",
    notTracked: "nesleduje sa",
    oneOff: "Iba kredity",
    refCode: "ref:{{code}}",
    chips: {
      paid: "Platba",
      signedUp: "Registrácia",
      spentCredits: "Čerpanie kreditov",
      remove: "Odstrániť filter {{label}}",
    },
    creditsAny: "Ľubovoľné",
    titleWithCount: "Používatelia ({{count}})",
    loading: "Načítavajú sa používatelia…",
    never: "Nikdy",
    referredBy: "cez {{email}}",
    actions: {
      open: "Otvoriť",
      select: "Vybrať",
      openUser: "Otvoriť účet {{email}}",
      selectUser: "Vybrať {{email}}",
      stats: "Prehľad registrácií",
      refresh: "Obnoviť",
      newUser: "Nový používateľ",
      clearFilters: "Vymazať filtre",
      moreFilters: "Filtre",
    },
    kpi: {
      activeSpentHint: "Minuté kredity za 30 dní: {{credits}}",
      matchingHint:
        "Registrácie za posledných 12 úplných týždňov. Minulý týždeň: {{last}}, tento týždeň zatiaľ: {{count}}.",
      verified: "Overený e-mail",
      verifiedHint: "Počet účtov: {{count}}",
      active: "Aktívni za 30 dní",
      matching: "Používatelia podľa filtrov",
      paying: "Platiaci",
      payingShare: "{{percent}} % z vybraných používateľov",
      revenue: "Tržby za celé obdobie",
      revenueHint: "Úspešné platby v USD",
      credits: "Kredity v peňaženkách",
      creditsHint: "Súčet zostatkov v peňaženkách",
    },
    quick: {
      freeBurn: "Aspoň {{min}} minutých kreditov bez platby ({{count}})",
      banned: "Zablokovaní ({{count}})",
      humans: "Iba ľudia",
      paying: "Platiaci ({{count}})",
      free: "Bez platby",
      activeWeek: "Aktívni za 7 dní",
      dormant: "Bez aktivity aspoň 30 dní",
      never: "Bez doterajšej aktivity",
    },
    columns: {
      flags: "Príznaky",
      user: "Používateľ",
      joined: "Registrácia",
      lastActive: "Posledná aktivita",
      credits: "Zostatok",
      spent: "Minuté celkovo",
      paid: "Platba",
      subscription: "Plán",
      source: "Zdroj",
      id: "ID",
    },
    compact: {
      joined: "registrácia {{date}}",
      active: "posledná aktivita {{when}}",
      neverActive: "bez doterajšej aktivity",
      paid: "zaplatené {{amount}}",
      free: "bez platby",
      spent: "minuté kredity: {{count}}",
    },
    flags: {
      freeBurn: "Čerpanie bez platby",
      admin: "správca",
      banned: "Zablokovaný",
      unverified: "Neoverený",
    },
    empty: {
      none: "Zatiaľ žiadni používatelia",
      filtered: "Zadaným filtrom nezodpovedá žiadny používateľ",
      filteredHint: "Upravte podmienky filtra alebo vymažte všetky filtre.",
    },
    pagination: {
      previous: "Predchádzajúca strana",
      next: "Nasledujúca strana",
      showing: "{{start}} až {{end}} z {{total}}",
    },
    text: {
      subheader:
        "Overení: {{verified}} | Aktívni za 30 dní: {{active}} | Zablokovaní: {{banned}} | Registrácie za týždeň (12 týždňov): {{weekly}}",
      header:
        "Používatelia: {{total}} | Platiaci: {{paying}} | Celkové tržby: {{paid}}",
      pageHint: "Strana {{page}} z {{pages}}. Ďalšia: --page={{next}}",
      detailHint: "Podrobnosti: vibe users-view --userId=<ID>",
    },
  },
};
