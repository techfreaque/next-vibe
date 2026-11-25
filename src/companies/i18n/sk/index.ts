import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Firmy",
  tags: {
    companies: "Firmy",
    create: "Vytvoriť",
    list: "Zoznam",
    get: "Načítať",
    update: "Aktualizovať",
    members: "Členovia",
    invite: "Pozvať",
    management: "Správa",
  },
  endpointCategories: {
    companies: "Firmy",
    companyManagement: "Správa spoločností",
    companyMembers: "Členovia spoločnosti",
  },
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

  // Shared auth/repository error messages
  auth: {
    errors: {
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie na túto akciu",
      },
      notFound: {
        title: "Spoločnosť sa nenašla",
        description: "Táto spoločnosť neexistuje",
      },
      server: {
        title: "Chyba servera",
        description: "Niečo sa pokazilo. Skúste znova.",
      },
      patchNotFound: {
        title: "Spoločnosť sa nenašla",
        description: "Firma na úpravu sa nenašla",
      },
      patchServer: {
        title: "Chyba servera",
        description: "Nepodarilo sa aktualizovať spoločnosť",
      },
    },
  },

  // update-role endpoint translations
  updateRole: {
    patch: {
      title: "Zmeniť rolu člena",
      titleShort: "Aktualizovať rolu",
      description:
        "Zmení rolu člena. Túto akciu môže vykonať iba vlastník firmy.",
      companyId: { label: "ID firmy", description: "Firma" },
      memberId: {
        label: "ID člena",
        description: "Člen, ktorého rolu chcete upraviť",
      },
      role: {
        label: "Nová rola",
        description: "Rola, ktorú chcete členovi prideliť",
        placeholder: "Vyberte rolu",
      },
      errors: {
        validation: { title: "Neplatné údaje", description: "Neplatný vstup" },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na zmenu rolí členov sa prihláste",
        },
        forbidden: {
          title: "Iba vlastník",
          description: "Roly členov môže meniť iba vlastník firmy",
        },
        conflict: { title: "Konflikt", description: "Konflikt údajov" },
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
          title: "Člen sa nenašiel",
          description: "Tento člen nie je členom firmy",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Rola aktualizovaná",
        description: "Rola člena sa zmenila",
      },
      response: {
        memberId: "ID člena",
        role: "Nová rola",
      },
      widget: {
        back: "Späť k členom",
        successLabel: "Aktualizovaná úloha",
        title: "Zmeniť rolu člena",
      },
    },
  },

  // remove endpoint translations
  removeMember: {
    post: {
      title: "Odstrániť člena",
      titleShort: "Odstrániť člena",
      description:
        "Odstráni člena z firmy. Posledného vlastníka nemožno odstrániť.",
      companyId: { label: "ID firmy", description: "Firma" },
      memberId: { label: "ID člena", description: "Člen na odstránenie" },
      errors: {
        validation: { title: "Neplatné údaje", description: "Neplatný vstup" },
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Na odstránenie členov sa prihláste",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description:
            "Na odstránenie člena potrebujete rolu vlastníka alebo správcu. Posledného vlastníka nemožno odstrániť.",
        },
        conflict: {
          title: "Posledný vlastník",
          description: "Posledného vlastníka firmy nemožno odstrániť",
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
          title: "Člen sa nenašiel",
          description: "Tento člen nie je členom firmy",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Máte neuložené zmeny",
        },
      },
      success: {
        title: "Člen odstránený",
        description: "Člen bol odstránený z firmy",
      },
      response: {
        removedMemberId: "ID odstráneného člena",
      },
      widget: {
        back: "Späť k členom",
        successLabel: "Odstránený člen",
        confirmTitle: "Odstrániť tohto člena?",
        confirmDescription:
          "Prístup k firme zanikne okamžite. Túto akciu nemožno vrátiť späť.",
        confirmButton: "Áno, odstrániť člena",
        cancelButton: "Zrušiť",
      },
    },
  },
};
