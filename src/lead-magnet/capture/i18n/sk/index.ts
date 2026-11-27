import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  submit: {
    tag: "lead-magnet-capture",
    title: "Prihlásiť sa na odber a získať prístup",
    titleShort: "Prihlásiť sa na odber",
    description:
      "Zadaj údaje, prihlás sa na odber správ od tvorcu a získaj prístup k zručnosti",
    groups: {
      main: {
        title: "Získať prístup",
        description: "Zadaj údaje nižšie",
      },
    },
    fields: {
      skillId: {
        label: "Zručnosť",
        description: "Zručnosť, pri ktorej sa prihlasuješ na odber",
      },
      firstName: {
        label: "Krstné meno",
        description: "Tvoje krstné meno",
        placeholder: "napríklad Alex",
      },
      email: {
        label: "E-mailová adresa",
        description: "Tvoja e-mailová adresa",
        placeholder: "you@example.com",
      },
    },
    response: {
      captured: "Prihlásené na odber",
      nextStep: "Ďalší krok",
      signupUrl: "Adresa URL registrácie",
    },
    success: {
      title: "Odber je potvrdený",
      description:
        "Skontroluj e-mail a zaregistruj sa, aby si mohol používať zručnosť",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontroluj zadané údaje",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zručnosť sa nenašla",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny",
      },
      internal: {
        title: "Chyba servera",
        description: "Vyskytla sa interná chyba",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
    },
  },
  form: {
    signUp: "Vytvor si účet",
    headline: "Dostávaj novinky",
    namePlaceholder: "Tvoje krstné meno",
    emailPlaceholder: "Tvoj e-mail",
    send: "Prihlásiť sa na odber",
    sending: "…",
    doneHeading: "Hotovo.",
    doneSub: "Si v zozname odberateľov.",
    finePrint: "Bez spamu. Kedykoľvek sa môžeš odhlásiť.",
    error: "Niečo sa pokazilo. Skús znova.",
  },
};
