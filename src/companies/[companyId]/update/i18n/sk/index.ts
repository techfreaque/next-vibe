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
    update: "Aktualizovať",
    management: "Správa",
  },
  patch: {
    title: "Aktualizovať spoločnosť",
    titleShort: "Aktualizovať spoločnosť",
    description:
      "Upraviť údaje o firme. Vyžaduje rolu správcu alebo vlastníka.",
    companyId: {
      label: "ID firmy",
      description: "Spoločnosť, ktorú treba aktualizovať",
    },
    name: {
      label: "Názov firmy",
      description: "Právny názov spoločnosti",
      placeholder: "Acme GmbH",
    },
    type: {
      label: "Typ spoločnosti",
      description: "Obchodný model",
      placeholder: "Vybrať typ",
    },
    vatNumber: {
      label: "IČ DPH",
      description: "Identifikačné číslo pre DPH",
      placeholder: "DE123456789",
    },
    country: {
      label: "Krajina",
      description: "Krajina registrácie",
      placeholder: "SK",
    },
    currency: {
      label: "Predvolená mena",
      description: "Prvotná fakturačná mena",
      placeholder: "EUR",
    },
    email: {
      label: "E-mail spoločnosti",
      description: "Primárne obchodné e-maily",
      placeholder: "contact@company.com",
    },
    phone: {
      label: "Telefón spoločnosti",
      description: "Primárny obchodný telefón",
      placeholder: "+43 1 234 5678",
    },
    website: {
      label: "Webová stránka",
      description: "Adresa URL webu firmy",
      placeholder: "https://company.com",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte formulár a skúste to znova",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na úpravu údajov firmy sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Údaje o firme môže upraviť iba správca alebo vlastník",
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
      title: "Aktualizované",
      description: "Firemné detaily uložené úspešne",
    },
    response: {
      id: "ID firmy",
      name: "Názov firmy",
    },
    widget: {
      back: "Späť",
      successLabel: "Spoločnosť aktualizovaná",
      viewCompany: "Zobraziť spoločnosť",
    },
  },
};
