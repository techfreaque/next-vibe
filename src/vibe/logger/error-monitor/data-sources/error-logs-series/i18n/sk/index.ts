import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    metric: {
      occurrences: "Výskyty",
      distinct: "Zaznamenané triedy chýb",
      new: "Nové triedy chýb",
      openBacklog: "Aktuálne nevyriešené chyby",
    },
    level: {
      all: "Chyby a varovania",
      error: "Iba chyby",
      warn: "Iba upozornenia",
    },
  },
  post: {
    title: "Časový rad chybových záznamov",
    titleShort: "Chybové záznamy",
    description:
      "Objem chybových záznamov v čase. Výskyty a triedy chýb sa berú z denného počítadla s históriou od 22. novembra 2026. Nové triedy sa započítajú pri prvom výskyte. Pri každom spustení grafu sa zaznamená aktuálny počet nevyriešených tried.",
    fields: {
      resolution: {
        label: "Rozlíšenie",
        description:
          "Časový interval výpočtu. Výskyty a triedy chýb sa sledujú najpodrobnejšie po dňoch.",
      },
      range: {
        label: "Rozsah",
        description: "Vybrané časové obdobie",
      },
      lookback: {
        label: "Rozsah histórie",
        description: "Počet intervalov pred začiatkom rozsahu",
      },
      metric: {
        label: "Ukazovateľ",
        description:
          "Čo počítať: výskyty, zaznamenané triedy chýb, nové triedy alebo aktuálne nevyriešené chyby.",
      },
      level: {
        label: "Úroveň",
        description: "Chyby, varovania alebo oboje",
      },
      result: {
        label: "Počet záznamov o chybe",
        description: "Výstupný časový rad",
      },
      meta: {
        label: "Metadáta",
        description: "Metadáta o spustení uzla",
      },
    },
    success: {
      title: "Časový rad chýb sa vypočítal",
      description: "Časový rad chybových záznamov je pripravený.",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Vyžaduje sa oprávnenie správcu.",
      },
      server: { title: "Chyba servera", description: "Dopyt zlyhal." },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Neplatné parametre požiadavky",
      },
      notFound: { title: "Nenašlo sa", description: "Nenašlo sa" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Chyba siete",
        description: "Sieťová požiadavka zlyhala.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv uložte zmeny.",
      },
    },
  },
};
