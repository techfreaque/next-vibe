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
    list: "Zoznam",
  },
  get: {
    title: "Firmy",
    titleShort: "Adresár firiem",
    description:
      "Prezerajte firmy, ktorých ste členom. Správcovia platformy majú prístup k úplnému zoznamu.",
    includeAll: {
      label: "Všetky firmy",
      description:
        "Zahrňte aj firmy, ktorých nie ste členom. Iba pre správcov platformy.",
    },
    page: {
      label: "Stránka",
      description: "Číslo strany (začína na 1)",
    },
    pageSize: {
      label: "Za stranu",
      description: "Výsledky na stránku (max. 100)",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Neplatná požiadavka",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie firiem sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
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
        title: "Nenašlo sa",
        description: "Neboli zistené žiadne spoločnosti",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Zaťažené spoločnosti",
      description: "Získaný zoznam spoločnosti",
    },
    widget: {
      noMembership: "Bez členstva",
      back: "Späť",
      loading: "Načítavam spoločnosti...",
      title: "Firmy",
      create: "Nová firma",
      previous: "Predchádzajúca",
      next: "Nasledujúca",
      total: "spoločnosti",
      totalSingular: "spoločnosť",
      inactive: "Neaktívne",
      empty: {
        title: "Zatiaľ žiadne spoločnosti",
        hint: "Vytvorte spoločnosť, ktorá začne spravovať vaše účtovníctvo, fakturáciu a tím.",
        cta: "Vytvorte si svoju prvú spoločnosť",
      },
    },
    response: {
      total: "Spolu",
      id: "ID",
      name: "Názov",
      type: "Typ",
      role: "Vaša rola",
      isActive: "Aktívne",
      country: "Krajina",
      currency: "Mena",
      email: "E-mail",
      createdAt: "Vytvorené",
    },
  },
};
