import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    pos: "Pokladňa",
    order: "Predaj",
    removePayment: "Odstrániť platbu",
  },
  enums: {
    paymentMethod: {
      cash: "Hotovosť",
      card: "Karta",
      transfer: "Prevod",
      other: "Iné",
    },
  },
  post: {
    title: "Odstrániť platbu",
    titleShort: "Odstrániť platbu",
    description:
      "Zruší platbu na otvorenom predaji, napríklad keď ju niekto zadal omylom.",
    orderId: {
      label: "Predaj",
      description: "Otvorený predaj s touto platbou",
    },
    paymentId: {
      label: "Platba",
      description: "Platba, ktorá sa z predaja odstráni",
    },
    response: {
      orderId: "Predaj",
      paymentId: "Odstránená platba",
      sessionId: "Pokladničná zmena",
      currency: "Mena",
      totalPaid: "Zatiaľ zaplatené",
      outstanding: "Zostáva zaplatiť",
      remainingPayments: "Zostávajúce platby",
    },
    widget: {
      back: "Späť na predaj",
      pickPayment: "Vyberte platbu na odstránenie",
      noPayments: "Tento predaj nemá žiadne platby na odstránenie.",
      notOpen: "Platby sa dajú odstrániť len z otvoreného predaja.",
      loading: "Načítava sa predaj",
      change: "Výdavok {{amount}}",
      selected: "Vybraté",
      amount: "Suma",
      confirmTitle: "Odstrániť túto platbu?",
      confirmDescription:
        "Predaj zostane otvorený. Potom prijmite správnu platbu.",
      confirm: "Odstrániť platbu",
      cancel: "Zrušiť",
      stillDue: "Zostáva zaplatiť",
      paidSoFar: "Zatiaľ zaplatené",
      nothingPaid: "Na tomto predaji už nie je žiadna platba.",
    },
    success: {
      title: "Platba odstránená",
      description: "Predaj čaká na novú platbu.",
    },
  },
  errors: {
    validation: {
      title: "Skontrolujte platbu",
      description: "Vyberte platbu z tohto predaja.",
    },
    unauthorized: {
      title: "Potrebné prihlásenie",
      description: "Prihláste sa, aby ste mohli meniť predaje.",
    },
    forbidden: {
      title: "Bez prístupu",
      description: "Predaje tejto firmy nemôžete meniť.",
    },
    notFound: {
      title: "Platba sa nenašla",
      description: "Táto platba už na predaji nie je.",
    },
    conflict: {
      title: "Predaj nie je otvorený",
      description:
        "Platbu možno odstrániť, len kým sú predaj aj pokladničná zmena otvorené.",
    },
    server: {
      title: "Platba sa neodstránila",
      description: "Niečo sa pokazilo. Skúste to znova.",
    },
    unknown: {
      title: "Platba sa neodstránila",
      description: "Niečo sa pokazilo. Skúste to znova.",
    },
    network: {
      title: "Bez pripojenia",
      description: "Skontrolujte pripojenie a skúste to znova.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv dokončite alebo zahoďte zmeny.",
    },
  },
};
