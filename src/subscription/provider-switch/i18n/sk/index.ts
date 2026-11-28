import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Platby",
  tags: {
    subscription: "Predplatné",
    billing: "Fakturácia",
  },

  get: {
    title: "Presuň svoj plán",
    titleShort: "Presunúť plán",
    description:
      "Ukáže, či sa tvoj kartový plán dá presunúť k novému poskytovateľovi platieb a kedy tam začne fakturácia.",
  },
  post: {
    title: "Spustiť presun plánu",
    titleShort: "Presunúť plán",
    description:
      "Otvorí platbu u nového poskytovateľa pre tvoj aktuálny plán. Starý kartový plán sa zastaví po zaplatení nového. Žiadna dvojitá platba.",
  },

  response: {
    offer: "Ponuka",
    targetProvider: "Nový poskytovateľ",
    plan: "Plán",
    billingInterval: "Fakturačné obdobie",
    pastDue: "Po splatnosti",
    deadline: "Plán beží do",
    billingStartAt: "Nová fakturácia od",
    firstPeriodEnd: "Koniec prvého nového obdobia",
    carryOver: "Prenos zaplateného času",
    checkoutUrl: "Odkaz na platbu",
    sessionId: "Platobná relácia",
  },

  widget: {
    badge: "Treba konať",
    title: "Presuň svoj plán jedným klikom",
    description:
      "Náš spracovateľ platieb kartou pre nás prestal prijímať platby. Tvoj plán aj kredity sú v bezpečí.",
    deadline: "Tvoj plán beží do {{date}}. Presuň ho skôr, nech pokračuje.",
    carryExtend:
      "Zaplatíš teraz a tvoje prvé nové obdobie trvá do {{date}}. Už zaplatené dni sa prenesú.",
    carryDeferred:
      "Dnes sa nič nestrhne. Fakturácia u nového poskytovateľa začne {{date}}, keď skončí tvoj zaplatený čas.",
    pastDue:
      "Tvoje posledné obnovenie neprešlo. Presuň plán hneď, aby si ho nestratil.",
    unsupportedPlan:
      "Nová platba kartou zatiaľ neponúka tento plán s mesačnou fakturáciou. Vyber ročnú fakturáciu alebo zaplať kryptom.",
    cta: "Presunúť môj plán",
    ctaLoading: "Otvára sa platba...",
    otherOptions: "Iné spôsoby platby",
    noDoubleCharge:
      "Starý kartový plán sa zastaví hneď, ako zaplatíš nový. Nikdy neplatíš dvakrát.",
    checkoutReady: "Platba je pripravená.",
    openCheckout: "Otvoriť platbu",
    notEligible: "Žiadny kartový plán na presun.",
  },

  manage: {
    cancelOld: "Zrušiť starý kartový plán",
    moveFirst: "Chceš si plán nechať? Presuň ho vyššie. Zrušenie tu ho ukončí.",
  },

  enums: {
    carryOver: {
      extendFirstPeriod: "Platba teraz, zaplatený čas predĺži prvé obdobie",
      deferredStart: "Fakturácia začne, keď skončí zaplatený čas",
    },
    status: {
      pending: "Platba spustená",
      completed: "Presunuté",
      cancelFailed: "Presunuté, zrušenie starého plánu zlyhalo",
    },
    cancelMode: {
      atPeriodEnd: "Ku koncu obdobia",
      immediate: "Okamžite",
    },
    offer: {
      available: "Dostupné",
      planNotSupported: "Plán nie je podporovaný",
      notEligible: "Nespĺňa podmienky",
    },
    notice: {
      sending: "Odosiela sa",
      sent: "Odoslané",
      failed: "Neúspešné",
    },
  },

  errors: {
    validation: {
      title: "Neplatná požiadavka",
      description: "Skontroluj požiadavku a skús to znova.",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihlás sa, aby si mohol presunúť plán.",
    },
    forbidden: {
      title: "Nepovolené",
      description: "Tento účet nemôže presunúť plán.",
    },
    notFound: {
      title: "Žiadny kartový plán",
      description: "Na tomto účte nie je žiadny kartový plán na presun.",
    },
    conflict: {
      title: "Nie je čo presunúť",
      description:
        "Presun plánov teraz nie je otvorený alebo sa tento plán nedá presunúť. Tvoj plán beží ďalej.",
    },
    unsupportedPlan: {
      title: "Plán nie je podporovaný",
      description:
        "Nový poskytovateľ nevie predať tento plán s týmto fakturačným obdobím.",
    },
    server: {
      title: "Niečo sa pokazilo",
      description: "Platbu sa nepodarilo otvoriť. Skús to o minútu.",
    },
    network: {
      title: "Chyba siete",
      description: "Server je nedostupný. Skontroluj pripojenie.",
    },
    unknown: {
      title: "Neočakávaná chyba",
      description: "Stalo sa niečo neočakávané. Skús to znova.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv ulož alebo zahoď zmeny.",
    },
  },

  success: {
    title: "Platba pripravená",
    description: "Dokonči platbu, aby sa tvoj plán presunul.",
  },
};
