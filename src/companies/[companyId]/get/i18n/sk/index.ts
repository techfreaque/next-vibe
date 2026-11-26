import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Fyzická osoba",
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
    get: "Zobrazenie",
  },
  get: {
    title: "Údaje o firme",
    titleShort: "Firma",
    description: "Zobrazte si údaje o firme.",
    companyId: {
      label: "ID firmy",
      description: "Firma, ktorú chcete zobraziť",
    },
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "ID firmy je neplatné.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie údajov firmy sa prihláste",
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
        description: "Akciu sa nepodarilo dokončiť. Skúste to znova.",
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
        title: "Firma sa nenašla",
        description: "Firma neexistuje alebo k nej už nemáte prístup.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Firma je načítaná",
      description: "Údaje o firme sú pripravené.",
    },
    widget: {
      address: "Adresa",
      activeMembers: "Aktívni členovia",
      backToList: "Firmy",
      type: "Typ zákazníka",
      loadFailed: "Firmu sa nepodarilo načítať",
      retry: "Skúsiť znova",
      related: "Práca v tejto firme",
      setupAccounting: "Nastaviť účtovníctvo",
      back: "Späť",
      loading: "Načítavajú sa údaje o firme…",
      edit: "Upraviť",
      members: "Členovia",
      invite: "Pozvať člena",
      chartOfAccounts: "Účtový rozvrh",
      viewInvoices: "Zobraziť faktúry",
      viewTerminals: "Zobraziť pokladničné terminály",
      active: "Aktívne",
      inactive: "Neaktívne",
      country: "Krajina",
      currency: "Mena",
      vatNumber: "IČ DPH",
      taxId: "Daňové identifikačné číslo",
      email: "E-mail",
      phone: "Telefón",
      website: "Webové sídlo",
      createdAt: "Vytvorená",
      actions: "Akcie",
      modules: {
        accounting: {
          label: "Účtovníctvo",
        },
        invoices: {
          label: "Faktúry",
        },
        estimates: {
          label: "Cenové ponuky",
        },
        bills: {
          label: "Prijaté faktúry",
        },
        pos: {
          label: "Predajné miesto",
        },
        purchasing: {
          label: "Nákup",
        },
        inventory: {
          label: "Skladové hospodárstvo",
        },
        team: {
          label: "Tím",
        },
      },
    },
  },
};
