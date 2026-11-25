import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Jednotlivec",
    },
    companyMemberRole: {
      owner: "Vlastník",
      admin: "Správca",
      member: "Člen",
      accountant: "Účtovník",
      viewer: "Čitateľ",
    },
  },
  tags: {
    companies: "Firmy",
    members: "Členovia",
    list: "Zoznam",
  },
  get: {
    title: "Členovia tímu",
    titleShort: "Členovia tímu",
    description: "Zoznam všetkých členov tejto spoločnosti",
    companyId: {
      label: "ID firmy",
      description: "Firma, ktorej členov chcete zobraziť",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné ID spoločnosti",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa na zobrazenie členov spoločnosti",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nie ste členom tejto firmy.",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt údajov",
      },
      server: {
        title: "Chyba servera",
        description: "Niečo sa pokazilo. Skúste znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie a skúste to znova",
      },
      notFound: {
        title: "Spoločnosť sa nenašla",
        description: "Táto spoločnosť neexistuje",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Členovia načítaní",
      description: "Zoznam členov sa načítal",
    },
    response: {
      id: "ID člena",
      userId: "ID používateľa",
      email: "E-mail",
      name: "Meno",
      role: "Rola",
      isActive: "Aktívne",
      joinedAt: "Členstvo od",
    },
    widget: {
      back: "Späť",
      loading: "Načítavajú sa členovia…",
      title: "Členovia tímu",
      memberSingular: "člen",
      memberPlural: "členovia",
      invite: "Pozvať člena",
      updateRole: "Zmeniť rolu",
      remove: "Odstrániť",
      active: "Aktívne",
      inactive: "Neaktívne",
      empty: {
        title: "Tím zatiaľ nemá žiadnych členov",
        hint: "Pozvite kolegov, aby spolupracovali na účtovníctve a prevádzke tejto spoločnosti.",
        cta: "Pozvite prvého člena",
      },
    },
  },
};
