import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    generateConfigsFailed: "Konfigurationen konnten nicht generiert werden",
    generateVSCodeSettingsFailed:
      "VSCode-Einstellungen konnten nicht generiert werden",
    packageRootNotFound: "Paketstamm nicht gefunden",
    templateNotFound: "Vorlage nicht gefunden unter {{path}}",
    createConfigFailed: "check.config.ts konnte nicht erstellt werden",
    createMcpConfigFailed: ".mcp.json konnte nicht erstellt werden",
  },
};
