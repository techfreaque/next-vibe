import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    title: "Aktívne terminály",
    back: "Späť",
    lastCommand: "Posledný príkaz",
    noTerminals: "Žiadne aktívne terminály",
    noTerminalsHint:
      "Reláciu terminálu otvoríš pomocou nástroja Spustiť príkaz.",
    openExec: "Spustiť príkaz",
    terminalCount: "terminály",
    machineLabel: "Počítač",
    cwdLabel: "cwd",
    statusLabel: "Stav",
    openedLabel: "Otvorené",
    openTerminal: "Otvoriť",
    manageConnections: "Pripojenia",
    activeStatus: "Aktívny",
  },
  get: {
    title: "Zoznam terminálov",
    titleShort: "Terminály",
    description:
      "Zobrazí aktívne relácie terminálu a ich aktuálne pracovné adresáre.",
    dynamicTitle: "Terminály: {{path}}",
    status: {
      loading: "Načítava sa…",
      done: "Načítané",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Počítač",
        description:
          "Vyber počítač, napríklad /ssh/local-machine. Ak pole vynecháš, zobrazia sa všetky relácie.",
      },
    },
    response: {
      terminals: {
        terminalId: { content: "ID terminálu" },
        connectionSlug: { content: "Počítač" },
        cwd: { content: "Pracovný adresár" },
        name: { content: "Názov" },
        openedAt: { content: "Otvorené" },
        lastCommandAt: { content: "Posledný príkaz" },
        status: { content: "Stav" },
      },
      total: { text: "Spolu" },
    },
    errors: {
      validation: {
        title: "Neplatný vstup",
        description: "Skontroluj cestu.",
      },
      network: { title: "Offline", description: "So serverom sa nedá spojiť" },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Najprv sa prihlás",
      },
      forbidden: {
        title: "Bez prístupu",
        description: "Nepovolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Nenašli sa žiadne terminály.",
      },
      server: { title: "Chyba servera", description: "Niečo sa pokazilo." },
      unknown: { title: "Chyba", description: "Niečo sa pokazilo." },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož alebo zahoď zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt operácií",
      },
    },
    success: {
      title: "Terminály načítané",
      description: "Aktívne terminály sa načítali",
    },
  },
};
