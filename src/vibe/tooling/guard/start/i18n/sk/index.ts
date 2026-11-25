import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Spustiť Guard",
  titleShort: "Spustiť Guard",
  description: "Spustiť prostredie Guard pre projekty VS Code",
  tag: "Spustiť",
  category: "Guard",
  container: {
    title: "Nastavenia spustenia",
    description: "Nastaviť parametre spustenia prostredia Guard",
  },
  fields: {
    projectPath: {
      title: "Cesta k projektu",
      description: "Cesta k projektu VS Code",
      placeholder: "/home/user/projects/my-project",
    },
    guardId: {
      title: "ID prostredia Guard",
      description: "Jedinečné ID prostredia Guard",
      placeholder: "guard_my_project_abc123",
    },
    startAll: {
      title: "Spustiť všetky prostredia Guard",
      description: "Spustiť všetky dostupné prostredia Guard",
    },
    totalStarted: {
      title: "Celkový počet spustených prostredí",
    },
    output: {
      title: "Výstup",
    },
    startedGuards: {
      columns: {
        username: "Používateľské meno",
        projectPath: "Cesta k projektu",
      },
    },
    summary: {
      title: "Zhrnutie",
    },
    status: {
      title: "Stav",
    },
    hasIssues: {
      title: "Má problémy",
    },
  },
  errors: {
    unauthorized: {
      title: "Bez oprávnenia",
      description: "Vyžaduje sa prihlásenie",
    },
    validation: {
      title: "Chyba overenia",
      description: "Neplatné parametre požiadavky",
    },
    internal: {
      title: "Interná chyba",
      description: "Nastala chyba interného servera",
    },
    notFound: {
      title: "Nenájdené",
      description: "Prostredie Guard sa nenašlo",
    },
    conflict: {
      title: "Konflikt",
      description: "Prostredie Guard už beží",
    },
    jailSetupFailed:
      "Nastavenie izolovaného prostredia Guard zlyhalo: {{detail}}",
    vscodeSetupFailed: "Nastavenie integrácie VS Code zlyhalo: {{detail}}",
    startFailed: "Interná chyba pri spúšťaní prostredia Guard: {{detail}}",
    guardIdLookupUnsupported:
      "Vyhľadávanie podľa ID prostredia Guard zatiaľ nie je dostupné. Použite cestu k projektu.",
    notAVscodeProject:
      "Guard vyžaduje projekt VS Code. V {{projectPath}} chýba priečinok .vscode.",
  },
  success: {
    title: "Úspech",
    description: "Prostredie Guard sa úspešne spustilo",
  },
};
