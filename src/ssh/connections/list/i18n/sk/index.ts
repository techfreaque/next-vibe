import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Heslo",
      privateKey: "Súkromný kľúč (PEM)",
      keyAgent: "SSH agent",
      local: "Miestny počítač",
    },
  },

  get: {
    title: "Pripojenia",
    titleShort: "Pripojenia",
    description:
      "Počítače a prostredia, ku ktorým sa môžete pripojiť. Patria sem miestny shell, servery SSH aj vzdialené inštancie.",
    errors: {
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte potrebné oprávnenie",
      },
      server: {
        title: "Chyba servera",
        description: "Zoznam pripojení sa nepodarilo načítať",
      },
      notFound: { title: "Nenašlo sa", description: "Nenašlo sa" },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: { title: "Neuložené zmeny" },
      conflict: {
        title: "Konflikt údajov",
        description: "Údaje sú v konflikte",
      },
      network: {
        title: "Chyba siete",
        description: "Vyskytla sa chyba siete",
      },
      timeout: {
        title: "Časový limit",
        description: "Čas na spracovanie požiadavky vypršal",
      },
    },
    success: {
      title: "Zoznam pripojení sa načítal",
      description: "Načítali sa všetky pripojenia k počítačom",
    },
    response: {
      connections: {
        title: "Pripojenia",
      },
    },
  },
  widget: {
    title: "Pripojenia",
    back: "Späť",
    addSsh: "Pridať pripojenie SSH",
    connectRemote: "Pripojiť vzdialenú inštanciu",
    openTerminal: "Terminál",
    viewRemote: "Podrobnosti",
    defaultBadge: "Predvolené",
    localType: "Miestne",
    sshType: "SSH",
    remoteType: "Vzdialené",
    healthHealthy: "Pripojené",
    healthWarning: "Pomalé pripojenie",
    healthCritical: "Nedostupné",
    healthDisconnected: "Offline",
    noConnections: "Zatiaľ ste nepridali žiadny počítač",
    noConnectionsHint:
      "Začnite pridaním pripojenia SSH alebo pripojte vzdialenú inštanciu.",
    emptyState:
      "Zatiaľ nemáte žiadne pripojenia. Pridajte pripojenie k vzdialenému počítaču.",
  },
};
