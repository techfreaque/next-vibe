import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Používatelia",

  widget: {
    intro:
      "Tu sú všetky zariadenia prihlásené do tvojho účtu. Odhlás tie, ktoré nepoznáš.",
    revokeFailed: "Zariadenie sa nepodarilo odhlásiť. Skús to znova.",
    back: "Späť",
    loading: "Načítavajú sa relácie…",
    empty: "Žiadne aktívne relácie",
    emptyHint: "Relácia vznikne pri každom prihlásení",
    browserSession: "Relácia prehliadača",
    revoke: "Odhlásiť",
    revoking: "Odhlasuje sa…",
    currentSession: "Aktuálna",
    created: "Vytvorené",
    expires: "Platí do",
    never: "Nikdy",
  },

  list: {
    title: "Prihlásené zariadenia",
    titleShort: "Moje relácie",
    description: "Zobraziť všetky aktívne relácie tvojho účtu",
    tag: "Relácie",
    response: {
      sessions: "Relácie",
    },
    success: {
      title: "Relácie načítané",
      description: "Aktívne relácie sa načítali",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      server: {
        title: "Chyba servera",
        description: "Interná chyba servera",
        detail: "Relácie sa nepodarilo načítať: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: { title: "Nenájdené", description: "Zdroj sa nenašiel" },
      conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
    },
  },
  create: {
    title: "Vytvoriť token relácie",
    titleShort: "Vytvoriť token",
    description: "Vytvoriť pomenovaný token relácie na prístup z kódu",
    tag: "Relácie",
    form: {
      name: "Názov tokenu",
      namePlaceholder: "napr. Môj agent",
    },
    response: {
      token: "Token",
      id: "ID relácie",
      name: "Meno",
      message: "Skopíruj token. Znova sa nezobrazí.",
    },
    success: {
      title: "Relácia vytvorená",
      description: "Token relácie sa vytvoril",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      server: {
        title: "Chyba servera",
        description: "Interná chyba servera",
        detail: "Token relácie sa nepodarilo vytvoriť: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: { title: "Nenájdené", description: "Zdroj sa nenašiel" },
      conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
    },
  },
  revoke: {
    title: "Zrušiť reláciu",
    titleShort: "Zrušiť reláciu",
    description: "Zrušiť token relácie podľa ID",
    tag: "Relácie",
    response: {
      message: "Relácia zrušená",
    },
    success: {
      title: "Relácia zrušená",
      description: "Relácia sa zrušila",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatná požiadavka",
      },
      server: {
        title: "Chyba servera",
        description: "Interná chyba servera",
        detail: "Reláciu sa nepodarilo zrušiť: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenájdené",
        description: "Relácia sa nenašla",
        detail: "Relácia s ID {{sessionId}} nepatrí k tvojmu účtu",
      },
      conflict: { title: "Konflikt údajov", description: "Konflikt údajov" },
    },
  },
};
