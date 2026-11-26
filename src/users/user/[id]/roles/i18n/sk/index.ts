import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",

  roles: {
    widget: {
      added: "Pridelená rola: {{role}}",
      removed: "Odobratá rola: {{role}}",
      removeWarning:
        "Od nasledujúcej požiadavky používateľ stratí všetky oprávnenia spojené s touto rolou.",
      addHint: "Zmena sa prejaví pri nasledujúcej požiadavke používateľa.",
    },
    post: {
      title: "Pridať používateľovi rolu",
      titleShort: "Pridať rolu",
      description: "Prideliť rolu konkrétnemu používateľskému účtu",
      container: {
        title: "Pridať rolu",
        description: "Vyberte rolu, ktorú chcete používateľovi prideliť",
      },
      id: {
        label: "Používateľ",
        description:
          "Jedinečný identifikátor používateľa, ktorému chcete prideliť rolu",
        placeholder: "Zadajte ID používateľa…",
      },
      role: {
        label: "Rola",
        description: "Rola, ktorú chcete používateľovi prideliť",
        placeholder: "Vyberte rolu…",
      },
      submit: {
        label: "Pridať rolu",
      },
      response: {
        roleId: {
          content: "ID priradenia roly",
        },
        userId: {
          content: "ID používateľa",
        },
        assignedRole: {
          content: "Priradená rola",
        },
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete spravovať používateľské roly, prihláste sa",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Zadajte platné ID používateľa a rolu",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Používateľské roly môžu spravovať iba správcovia",
        },
        notFound: {
          title: "Používateľ sa nenašiel",
          description: "Zadaný používateľ sa nenašiel",
          detail: "Používateľ s ID {{userId}} sa nenašiel.",
        },
        conflict: {
          title: "Rola je už pridelená",
          description: "Používateľ už má túto rolu",
        },
        network: {
          title: "Chyba siete",
          description: "So serverom sa nepodarilo spojiť",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Prídete o neuložené zmeny",
        },
        server: {
          title: "Chyba servera",
          description: "Pre chybu servera sa rolu nepodarilo prideliť",
          detail:
            "Rolu {{role}} sa nepodarilo prideliť používateľovi {{userId}}.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Pri pridávaní roly sa vyskytla neočakávaná chyba",
        },
      },
      success: {
        title: "Rola sa pridala",
        description: "Používateľovi sa pridelila rola",
      },
    },
    delete: {
      title: "Odobrať používateľovi rolu",
      titleShort: "Odobrať rolu",
      description: "Odobrať rolu konkrétnemu používateľskému účtu",
      container: {
        title: "Odobrať rolu",
        description: "Vyberte rolu, ktorú chcete používateľovi odobrať",
      },
      id: {
        label: "Používateľ",
        description:
          "Jedinečný identifikátor používateľa, ktorému chcete odobrať rolu",
        placeholder: "Zadajte ID používateľa…",
      },
      role: {
        label: "Rola",
        description: "Rola, ktorú chcete používateľovi odobrať",
        placeholder: "Vyberte rolu…",
      },
      submit: {
        label: "Odobrať rolu",
      },
      response: {
        success: {
          content: "Rola sa odobrala",
        },
      },
      errors: {
        unauthorized: {
          title: "Vyžaduje sa prihlásenie",
          description: "Ak chcete spravovať používateľské roly, prihláste sa",
        },
        validation: {
          title: "Neplatné údaje",
          description: "Zadajte platné ID používateľa a rolu",
        },
        forbidden: {
          title: "Prístup zamietnutý",
          description: "Používateľské roly môžu spravovať iba správcovia",
        },
        notFound: {
          title: "Používateľ sa nenašiel",
          description: "Zadaný používateľ sa nenašiel",
          detail: "Používateľ s ID {{userId}} sa nenašiel.",
        },
        conflict: {
          title: "Konflikt údajov",
          description: "Rolu nemožno odobrať pre existujúce závislosti",
        },
        network: {
          title: "Chyba siete",
          description: "So serverom sa nepodarilo spojiť",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Prídete o neuložené zmeny",
        },
        server: {
          title: "Chyba servera",
          description: "Pre chybu servera sa rolu nepodarilo odobrať",
          detail:
            "Rolu {{role}} sa nepodarilo odobrať používateľovi {{userId}}.",
        },
        unknown: {
          title: "Neznáma chyba",
          description: "Pri odoberaní roly sa vyskytla neočakávaná chyba",
        },
      },
      success: {
        title: "Rola sa odobrala",
        description: "Používateľovi sa odobrala rola",
      },
    },
  },
  enums: {
    userRole: {
      public: "Verejnosť",
      customer: "Zákazník",
      partnerAdmin: "Správca partnera",
      partnerEmployee: "Zamestnanec partnera",
      admin: "Správca",
      cliOff: "CLI vypnuté",
      cliAuthBypass: "Výnimka z overovania v CLI",
      aiToolOff: "Nástroje AI vypnuté",
      webOff: "Web vypnutý",
      mcpOff: "MCP vypnuté",
      mcpVisible: "Viditeľné v MCP",
      productionOff: "V produkcii vypnuté",
      skillOff: "Zručnosť vypnutá",
    },
  },
};
