import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Účet",
  tags: {
    remoteConnection: "Vzdialené pripojenie",
  },
  widget: {
    title: "Spätná synchronizácia",
    description:
      "Systémový koncový bod. Volá ho iniciujúca inštancia, aby zmeny syncScope preniesla aj na vzdialenú stranu.",
    note: "Interný koncový bod. Spúšťa sa automaticky pri zmene nastavení pripojenia.",
  },
  patch: {
    title: "Aktualizovať spätné pripojenie",
    titleShort: "Aktualizovať spätné pripojenie",
    description:
      "Volajúca inštancia týmto prenesie nastavenia pripojenia na druhú stranu.",
    syncScope: {
      label: "Rozsah synchronizácie",
      description:
        "Oblasti údajov, ktoré sa majú cez toto pripojenie synchronizovať",
    },
    newInstanceId: {
      label: "Nový názov inštancie",
      description:
        "Nový názov volajúcej inštancie. Aktualizuje jej označenie na tejto strane.",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Skontrolujte zadané údaje a skúste to znova.",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Neprihlásený používateľ",
        description: "Ak chcete zmeniť nastavenia pripojenia, prihláste sa.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Na zmenu nastavení tohto pripojenia nemáte oprávnenie.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Pre túto inštanciu sa nenašlo žiadne spätné pripojenie.",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala chyba pri aktualizácii pripojenia",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri aktualizácii pripojenia nastal konflikt.",
      },
    },
    success: {
      title: "Pripojenie sa aktualizovalo",
      description: "Nastavenia spätného pripojenia sa aktualizovali.",
    },
  },
};
