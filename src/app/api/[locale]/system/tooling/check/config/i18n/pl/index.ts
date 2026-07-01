import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    generateConfigsFailed: "Nie udało się wygenerować konfiguracji",
    generateVSCodeSettingsFailed: "Nie udało się wygenerować ustawień VSCode",
    packageRootNotFound: "Nie znaleziono katalogu głównego pakietu",
    templateNotFound: "Nie znaleziono szablonu w {{path}}",
    createConfigFailed: "Nie udało się utworzyć check.config.ts",
    createMcpConfigFailed: "Nie udało się utworzyć .mcp.json",
  },
};
