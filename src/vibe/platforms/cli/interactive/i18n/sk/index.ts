import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  capture: {
    title: "Zachytiť interaktívnu obrazovku",
    titleShort: "Zachytiť obrazovku",
    description:
      "Načíta aktuálnu obrazovku z bežiacej interaktívnej relácie CLI vibe.",
    form: {
      fields: {
        pid: {
          label: "PID relácie",
          description:
            "PID interaktívnej relácie. Ak ho nezadáte, zistí sa automaticky.",
        },
      },
    },
    response: {
      fields: {
        content: "Obsah obrazovky",
        logs: "Záznamy chýb",
        pid: "PID relácie",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné parametre požiadavky",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      server: {
        title: "Chyba servera",
        description: "Interná chyba servera",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zakázaný",
      },
      notFound: {
        title: "Žiadna relácia",
        description: "Nenašla sa aktívna interaktívna relácia",
        noSession:
          "Nebeží žiadna interaktívna relácia. Spustite vibe <alias> -i --agent-control.",
        deadSession: "Relácia s PID {{pid}} už nebeží.",
        frameNotFound:
          "Relácia {{pid}} zatiaľ nevykreslila obrazovku. Chvíľu počkajte a skúste znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt relácie",
      },
    },
    success: {
      title: "Obrazovka zachytená",
      description: "Aktuálna obrazovka bola načítaná",
    },
  },
  sendKeys: {
    title: "Odoslať stlačenia klávesov do interaktívnej relácie",
    titleShort: "Odoslať stlačenia klávesov",
    description:
      "Odošle stlačenia klávesov do bežiacej interaktívnej relácie CLI vibe a vráti aktualizovanú obrazovku.",
    form: {
      fields: {
        keys: {
          label: "Klávesy",
          description:
            "Kláves na odoslanie: Enter, Tab, Escape, Up, Down, Left, Right, Backspace, Space alebo ľubovoľný text",
        },
        pid: {
          label: "PID relácie",
          description:
            "PID interaktívnej relácie. Ak ho nezadáte, zistí sa automaticky.",
        },
        waitMs: {
          label: "Čakanie (ms)",
          description:
            "Čas čakania po odoslaní klávesov pred načítaním obrazovky, v milisekundách. Predvolená hodnota: 500.",
        },
      },
    },
    response: {
      fields: {
        content: "Obsah obrazovky",
        logs: "Záznamy chýb",
        pid: "PID relácie",
      },
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Neplatné parametre požiadavky",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      server: {
        title: "Chyba servera",
        description: "Interná chyba servera",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zakázaný",
      },
      notFound: {
        title: "Žiadna relácia",
        description: "Nenašla sa aktívna interaktívna relácia",
        noSession:
          "Nebeží žiadna interaktívna relácia. Spustite vibe <alias> -i --agent-control.",
        deadSession: "Relácia s PID {{pid}} už nebeží.",
        keysNotFound:
          "Relácia {{pid}} zatiaľ neprijíma stlačenia klávesov. Chvíľu počkajte a skúste znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt relácie",
      },
    },
    success: {
      title: "Klávesy odoslané",
      description:
        "Stlačenia klávesov boli odoslané a obrazovka sa aktualizovala",
    },
  },
};
