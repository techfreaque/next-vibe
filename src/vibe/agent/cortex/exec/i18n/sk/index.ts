import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Spustiť príkaz",
    titleShort: "Spustiť príkaz",
    description:
      "Spustí príkaz shellu na počítači s cestou pod /ssh/. Terminál si medzi volaniami zachová pracovný adresár (cwd). Nová relácia sa otvorí v predvolenom adresári pripojeného úložiska, ak je nastavený.",
    dynamicTitle: "{{path}}: {{command}}",
    status: {
      loading: "Prebieha…",
      done: "Hotovo",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Počítač",
        description:
          'Cesta k vzdialenému počítaču cez SSH. Musí začínať na /ssh/. Počítače a ich pripojené úložiská nájdeš cez cortex-list(path="/ssh").',
      },
      command: {
        label: "Príkaz",
        description: "Príkaz shellu, ktorý sa má spustiť",
        placeholder: "echo hello",
      },
      workingDir: {
        label: "Pracovný adresár",
        description:
          "Pracovný adresár pre tento príkaz. Ak ho nezadáš, použije sa aktuálny adresár terminálu.",
        placeholder: "/home/user/project",
      },
      terminalId: {
        label: "ID terminálu",
        description:
          "Použi existujúcu reláciu terminálu. Ak ju nezadáš, použije sa predvolený terminál tohto pripojenia.",
      },
      timeoutMs: {
        label: "Časový limit (ms)",
        description:
          "Najdlhší čas vykonávania. Predvolene 30 000 ms, najviac 300 000 ms.",
        placeholder: "30000",
      },
    },
    submitButton: {
      label: "Spustiť",
      loadingText: "Prebieha…",
    },
    response: {
      output: { content: "Výstup" },
      exitCode: { title: "Návratový kód" },
      cwd: { content: "Pracovný adresár" },
      terminalId: { content: "ID terminálu" },
      backend: { title: "Backend" },
      truncated: { title: "Skrátené" },
    },
    errors: {
      validation: {
        title: "Neplatný vstup",
        description: "Skontroluj cestu a príkaz.",
      },
      network: { title: "Offline", description: "So serverom sa nedá spojiť" },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Najprv sa prihlás",
      },
      forbidden: {
        title: "Bez prístupu",
        description: "Nemáš oprávnenie použiť tento počítač.",
      },
      notFound: {
        title: "Počítač sa nenašiel",
        description:
          "Na tejto ceste nie je žiadne pripojenie SSH ani vzdialená inštancia.",
      },
      server: {
        title: "Príkaz zlyhal",
        description: "Príkaz sa nepodarilo spustiť",
      },
      unknown: { title: "Chyba", description: "Niečo sa pokazilo." },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv ulož alebo zahoď zmeny.",
      },
      conflict: {
        title: "Konflikt relácie",
        description: "Relácia terminálu je zaneprázdnená.",
      },
    },
    success: {
      title: "Príkaz dokončený",
      description: "Príkaz bol vykonaný",
    },
  },
  errors: {
    invalidWorkingDir: "Pracovný adresár musí mať absolútnu cestu bez '..'.",
    commandTimedOut: "Vypršal časový limit príkazu",
    invalidPath: "Cesta musí začínať na /ssh/.",
    noConnection: "Na tejto ceste sa nenašlo žiadne pripojenie",
    connectionNotFound: "Pripojenie sa nenašlo",
    encryptionFailed:
      "Šifrovanie zlyhalo. Hodnota JWT_SECRET_KEY môže byť neplatná.",
    connectTimeout: "Vypršal časový limit pripojenia",
    sshAuthFailed: "Overenie cez SSH zlyhalo",
    sshConnectionFailed: "Pripojenie SSH zlyhalo",
    fingerprintMismatch:
      "Odtlačok hostiteľa sa zmenil. Môže ísť o bezpečnostné riziko. Odstráň pripojenie a pridaj ho znova.",
    remoteNotSupported:
      "Vzdialené pripojenie zatiaľ nepodporuje spúšťanie príkazov. Použi priame pripojenie SSH.",
  },
  log: {
    execComplete: "Príkaz bol vykonaný",
    openedLocal: "Otvorený lokálny terminál",
    failedLocal: "Nepodarilo sa otvoriť lokálny terminál",
    openedSsh: "Otvorený terminál SSH",
    failedFingerprint: "Odtlačok kľúča hostiteľa sa nepodarilo uložiť",
    failedPty: "Nepodarilo sa otvoriť pseudoterminál SSH (PTY)",
    escalated: "Dlho bežiaci príkaz pokračuje ako úloha na pozadí",
  },
  widget: {
    title: "Terminál",
    back: "Späť",
    machineLabel: "Počítač",
    machinePlaceholder: "/ssh/local-machine",
    placeholder: "Zadaj príkaz…",
    runButton: "Spustiť",
    running: "Prebieha…",
    clearButton: "Vymazať",
    ctrlEnterHint: "Ctrl+Enter spustí príkaz",
    exitCodeLabel: "Návratový kód",
    backendLabel: "Backend",
    cwdLabel: "Pracovný adresár",
    terminalLabel: "Terminál",
    truncatedWarning: "Výstup bol skrátený",
    emptyOutput: "Žiadny výstup",
    outputLabel: "Výstup sa tu zobrazí",
    outputTitle: "Výstup",
    historyTitle: "História",
    noHistory: "Zatiaľ žiadne príkazy",
    manageConnections: "Pripojenia",
    viewTerminals: "Terminály",
    successStatus: "Úspech",
    failedStatus: "Zlyhalo",
    picker: {
      browse: "Prehliadať",
      cancel: "Zrušiť",
      machinesTitle: "Vyber počítač",
      machines: "Počítače",
      loading: "Načítava sa…",
      noMachines: "Nie sú nastavené žiadne počítače",
      defaultBadge: "Predvolené",
      useDir: "Použiť tento priečinok",
      emptyDir: "Prázdny priečinok",
    },
  },
};
