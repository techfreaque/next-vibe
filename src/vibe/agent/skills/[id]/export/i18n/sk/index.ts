import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Nástroje AI",
  tags: {
    skills: "zručnosti",
  },
  get: {
    title: "Exportovať kartu postavy",
    titleShort: "Exportovať kartu",
    description:
      "Exportuje zručnosť ako súbor JSON s kartou postavy vo formáte V2. Môžeš ju importovať do SillyTavern, RisuAI, Chub alebo inej aplikácie kompatibilnej s formátom Tavern. Môže slúžiť aj ako záloha. Podporuje tvoje vlastné zručnosti aj verejné komunitné a vstavané zručnosti. Karta uvádza autora a odkazuje na stránku zručnosti.",
    dynamicTitle: "Export: {{name}}",
    id: {
      label: "Zručnosť",
      description: "Zručnosť, ktorú chceš exportovať",
    },
    widget: {
      intro:
        "Stiahni si svoju postavu ako kartu vo formáte Character Card V2. Podporujú ho SillyTavern, RisuAI aj Chub.",
      included:
        "Karta obsahuje meno, celé zadanie postavy, slogan, opis, autora a odkaz na túto stránku.",
      download: "Stiahnuť kartu",
      copy: "Kopírovať JSON",
      copied: "Kopírované",
    },
    card: {
      skillPage: "Stránka zručnosti: {{url}}",
    },
    response: {
      name: { content: "Názov" },
      fileName: { content: "Názov súboru" },
      card: { content: "Karta vo formáte JSON" },
    },
    errors: {
      validation: {
        title: "Neplatná požiadavka",
        description: "Skontroluj ID zručnosti.",
      },
      network: {
        title: "Chyba siete",
        description: "Server sa nepodarilo kontaktovať.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihlás sa a exportuj zručnosť.",
      },
      forbidden: {
        title: "Nepovolené",
        description: "Túto zručnosť nemôžeš exportovať.",
      },
      notFound: {
        title: "Zručnosť sa nenašla.",
        description: "Zručnosť neexistuje alebo k nej nemáš prístup.",
      },
      server: {
        title: "Export zlyhal",
        description: "Kartu sa nepodarilo vytvoriť. Skús to znova.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máš neuložené zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Zručnosť sa počas exportu zmenila. Skús to znova.",
      },
    },
    success: {
      title: "Karta je pripravená",
      description: "Stiahni si kartu alebo skopíruj JSON.",
    },
  },
};
