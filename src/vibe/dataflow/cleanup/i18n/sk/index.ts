import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  cleanup: {
    name: "Čistenie údajov Vibe Sense",
    description:
      "Odstráni staré dátové body a snímky s vypršanou platnosťou z vyrovnávacej pamäte",
  },
  graphRunner: {
    name: "Vykonávanie grafov Vibe Sense",
    description:
      "Spustí všetky grafy, ktorých naplánovaný čas spustenia cez cron už nastal",
  },
  post: {
    title: "Čistenie údajov Vibe Sense",
    titleShort: "Čistenie údajov",
    description:
      "Odstráni dátové body po uplynutí doby uchovávania a vyradí neplatné snímky",
    response: {
      nodesProcessed: "Spracované uzly",
      totalDeleted: "Odstránené riadky",
      snapshotsDeleted: "Odstránené snímky",
      graphsChecked: "Skontrolované grafy",
      graphsExecuted: "Vykonané grafy",
    },
    success: {
      title: "Čistenie dokončené",
      description: "Odstránenie starých údajov je dokončené",
    },
    errors: {
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Vyžaduje sa prihlásenie",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Vyžaduje sa oprávnenie správcu.",
      },
      server: {
        title: "Chyba servera",
        description: "Vyčistenie zlyhalo",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      validation: {
        title: "Overenie vstupu zlyhalo",
        description: "Neplatná požiadavka",
      },
      notFound: { title: "Nenájdené", description: "Nenájdené" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Chyba siete",
        description: "Sieťová požiadavka zlyhala",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož zmeny",
      },
    },
  },
};
