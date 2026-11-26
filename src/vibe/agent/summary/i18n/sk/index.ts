import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    errors: {
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description:
          "Ak chceš získať prístup k vlastným zručnostiam, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "K tomuto zdroju nemáš prístup.",
      },
      notFound: {
        title: "Nenájdené",
        description: "Požadovaný zdroj sa nenašiel.",
      },
      server: {
        title: "Chyba servera",
        description: "Zručnosti sa nepodarilo načítať.",
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
        description: "Nastal konflikt so súčasným stavom",
      },
    },
  },
  title: "Aktivita umelej inteligencie",
  description:
    "Skontrolujte katalóg modelov a konverzácie vytvorené za posledných sedem dní.",
  models: "Modely v katalógu",
  providers: "Poskytovatelia modelov",
  skills: "Zverejnené zručnosti komunity",
  conversations: "Nové konverzácie",
  reported: "Nahlásené zručnosti",
  attention: "Na kontrolu",
  clear: "Žiadne nahlásené zručnosti.",
  unavailable: "Stav moderovania nie je dostupný.",
  recent: "Posledná aktivita",
  loading: "Načítava sa aktivita umelej inteligencie…",
  failed: "Aktivitu umelej inteligencie sa nepodarilo načítať.",
};
