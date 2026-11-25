import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Čet",
  tags: {
    moderation: "Moderovanie",
  },
  post: {
    title: "Nahlásiť obsah",
    titleShort: "Nahlásiť",
    description:
      "Nahlás verejný príspevok alebo zdieľanú konverzáciu. Ak ho nahlási dosť ľudí, skryje sa, kým ho nepreverí správca.",
    reason: {
      label: "Dôvod",
      description: "Čo je s týmto obsahom v neporiadku?",
    },
    note: {
      label: "Podrobnosti",
      description: "Môžeš pridať súvislosti pre moderátora.",
      placeholder: "Čo by mal moderátor vedieť?",
    },
    reasons: {
      spam: "Nevyžiadaný obsah",
      illegal: "Nezákonný obsah",
      abuse: "Zneužívanie alebo obťažovanie",
      csamFlag: "Ohrozenie bezpečnosti detí",
      other: "Iné",
    },
    messageId: {
      label: "ID správy",
      description: "Konkrétna správa, ktorú chceš nahlásiť (voliteľné)",
    },
    errors: {
      validation: { title: "Chyba overenia", description: "Vyber dôvod" },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Tento obsah nemôžeš nahlásiť",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vlastný obsah nemôžeš nahlásiť",
      },
      notFound: {
        title: "Nenájdené",
        description: "Tento obsah bol odstránený alebo je nedostupný",
      },
      server: {
        title: "Chyba servera",
        description: "Hlásenie sa nepodarilo odoslať",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Už nahlásené",
        description: "Tento obsah si už nahlásil",
      },
      rateLimited: {
        title: "Príliš veľa hlásení",
        description: "Posielaš hlásenia príliš rýchlo. Skús to neskôr.",
      },
    },
    success: {
      title: "Hlásenie odoslané",
      description: "Ďakujeme. Všetky hlásenia preverujeme.",
    },
    response: {
      reported: { content: "Nahlásené" },
      reportCount: { content: "Počet hlásení" },
      hidden: { content: "Skryté" },
    },
    backButton: {
      label: "Späť",
    },
    button: {
      submit: "Odoslať hlásenie",
      loading: "Odosiela sa...",
    },
  },
};
