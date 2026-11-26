import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Upraviť účet",
    titleShort: "Upraviť účet",
    description:
      "Aktualizovať názov účtu, popis, alebo triediť poradie. Typ a podtyp nemožno zmeniť na systémových účtoch.",
    accountId: {
      label: "Účet",
      description: "Účet, ktorý sa má upraviť",
      placeholder: "UUID účtu",
    },
    code: {
      label: "Kód",
      description: "Kód účtu",
    },
    type: {
      label: "Typ",
      description: "Typ účtu",
    },
    subtype: {
      label: "Podtyp",
      description: "Podtyp účtu",
    },
    isSystem: {
      label: "Systémový účet",
      description: "Či je to systémový účet",
    },
    isActive: {
      label: "Aktívne",
      description: "Či je tento účet aktívny",
    },
    name: {
      label: "Názov účtu",
      description: "Zobraziť názov pre tento účet",
      placeholder: "napr. Pohľadávky",
    },
    accountDescription: {
      label: "Opis",
      description: "Nepovinné poznámky o účele tohto účtu",
      placeholder: "napr. Zisťuje sumy dlžné zákazníkmi",
    },
    sortOrder: {
      label: "Poradie",
      description:
        "Poradie zobrazenia v nadradenej skupine. Nižšie čísla sa zobrazia ako prvé.",
      placeholder: "napr. 10",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte všetky polia",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Polia systémového účtu nemožno upraviť",
      },
      server: {
        title: "Chyba servera",
        description: "Nepodarilo sa aktualizovať účet",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      conflict: { title: "Konflikt", description: "Konflikt údajov" },
      network: {
        title: "Chyba siete",
        description: "Server sa nepodarilo kontaktovať",
      },
      notFound: { title: "Nenašlo sa", description: "Účet sa nenašiel" },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: { title: "Účet upravený", description: "Zmeny uložené" },
    widget: {
      savedLabel: "Uložené",
      failedLabel: "Zlyhalo",
      back: "Späť",
      submit: "Uložiť zmeny",
      sectionDetails: "Podrobnosti",
      viewAccount: "Zobraziť účet",
      successTitle: "Zmeny uložené",
      successDesc: "Účet bol aktualizovaný.",
      systemNotice: "Systémový účet: typ a podtyp sú uzamknuté.",
      inactiveNotice: "Tento účet je neaktívny.",
      selectPrompt: "Vyberte účet, ktorý chcete upraviť",
    },
  },
  title: "Upraviť účet",
  description: "Upraviť údaje o účte",
  category: "Účtový rozvrh",
  tag: "Účet",
};
