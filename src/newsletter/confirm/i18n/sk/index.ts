import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  token: {
    label: "Potvrdzovací kód",
    description: "Kód z odkazu v uvítacom e-maile",
    placeholder: "Vlož kód z e-mailu",
  },
  response: {
    confirmed: "Potvrdené",
    email: "E-mail",
    bonusCredits: "Bonusové kredity mesačne",
  },
  post: {
    title: "Potvrdiť adresu odberu newslettera",
    titleShort: "Potvrdiť e-mail",
    description:
      "Potvrď adresu odberu kódom z uvítacieho e-mailu a získaj bonusové kredity každý mesiac.",
    errors: {
      validation: {
        title: "Neplatný kód",
        description: "Potvrdzovací kód chýba alebo má neplatný formát",
      },
      notFound: {
        title: "Neplatný potvrdzovací odkaz",
        description:
          "Potvrdzovací odkaz je neplatný. Prihlás sa na odber znova a dostaneš nový.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      internal: {
        title: "Potvrdenie zlyhalo",
        description: "U nás nastala chyba. Skús odkaz otvoriť znova.",
      },
    },
    success: {
      title: "E-mail potvrdený",
      description: "Bonus sa pripíše na tvoj bezplatný účet",
    },
  },
  widget: {
    heroTitle: "Jedno kliknutie. +{{bonusCredits}} kreditov každý mesiac.",
    heroDescription:
      "Potvrď svoju adresu. Ak máš bezplatný účet, bonus ihneď pribudne k tvojim bezplatným kreditom.",
    confirmButton: "Potvrdiť môj e-mail",
    confirming: "Potvrdzuje sa…",
    confirmedTitle:
      "Potvrdené. Na bezplatnom účte máš každý mesiac +{{bonusCredits}} kreditov.",
    confirmedDescription:
      "Po prihlásení nájdeš bonus medzi bezplatnými kreditmi. Obnoví sa každý mesiac počas odberu. Ak účet ešte nemáš, vytvor si ho zadarmo v tomto prehliadači a získaj bonus.",
    startChatting: "Začať chatovať",
  },
};
