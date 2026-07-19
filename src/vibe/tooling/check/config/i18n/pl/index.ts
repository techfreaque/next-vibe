import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Utwórz konfigurację sprawdzania",
  description:
    "Utwórz check.config.ts z opcjonalną konfiguracją MCP, ustawieniami VSCode i konfiguracjami reguł. Uruchom bez opcji dla interaktywnej konfiguracji.",
  tag: "jakość",

  fields: {
    createMcpConfig: {
      label: "Utwórz konfigurację MCP",
      description:
        "Utwórz plik konfiguracyjny .mcp.json dla integracji Model Context Protocol",
    },
    updateVscodeSettings: {
      label: "Zaktualizuj ustawienia VSCode",
      description:
        "Zaktualizuj .vscode/settings.json z zalecanymi ustawieniami ESLint i formattera",
    },
    updatePackageJson: {
      label: "Zaktualizuj skrypty package.json",
      description:
        "Dodaj/zaktualizuj skrypty package.json dla poleceń check, lint i typecheck",
    },
    enableEslint: {
      label: "Włącz ESLint",
      description:
        "Włącz ESLint dla reguł jeszcze nieobsługiwanych przez Oxlint (sortowanie importów, React hooks). Wyłącz dla maksymalnej szybkości.",
    },
    enableReactRules: {
      label: "Włącz reguły React",
      description:
        "Włącz reguły lintowania specyficzne dla React (react-hooks, jsx-a11y)",
    },
    enableNextjsRules: {
      label: "Włącz reguły Next.js",
      description:
        "Włącz reguły lintowania i konfiguracje specyficzne dla Next.js",
    },
    enableI18nRules: {
      label: "Włącz reguły i18n",
      description:
        "Włącz reguły lintowania internacjonalizacji (eslint-plugin-i18next)",
    },
    jsxCapitalization: {
      label: "Kapitalizacja JSX",
      description:
        "Wymuszaj wielkie litery w nazwach komponentów JSX (react/jsx-pascal-case)",
    },
    enablePedanticRules: {
      label: "Włącz reguły pedantyczne",
      description:
        "Włącz bardziej rygorystyczne reguły lintowania dla wyższej jakości kodu",
    },
    enableRestrictedSyntax: {
      label: "Włącz ograniczoną składnię",
      description: "Ogranicz użycie throw, unknown i typów object",
    },
    interactive: {
      label: "Tryb interaktywny",
      description:
        "Uruchom w trybie interaktywnym i zapytaj o każdą opcję konfiguracji krok po kroku",
    },
  },

  steps: {
    creatingConfig: "Tworzenie check.config.ts...",
  },

  warnings: {
    mcpConfigFailed: "Nie udało się utworzyć konfiguracji MCP",
    vscodeFailed: "Nie udało się zaktualizować ustawień VSCode",
    packageJsonFailed: "Nie udało się zaktualizować package.json",
    packageJsonNotFound: "package.json nie znaleziono w bieżącym katalogu",
  },

  response: {
    message: "Konfiguracja utworzona",
  },

  success: {
    title: "Konfiguracja utworzona",
    description: "Pliki konfiguracyjne utworzone pomyślnie",
  },

  errors: {
    generateConfigsFailed: "Nie udało się wygenerować konfiguracji",
    generateVSCodeSettingsFailed: "Nie udało się wygenerować ustawień VSCode",
    packageRootNotFound: "Nie znaleziono katalogu głównego pakietu",
    templateNotFound: "Nie znaleziono szablonu w {{path}}",
    createConfigFailed: "Nie udało się utworzyć check.config.ts",
    createMcpConfigFailed: "Nie udało się utworzyć .mcp.json",
    validation: {
      title: "Nieprawidłowe parametry",
      description: "Parametry konfiguracji są nieprawidłowe",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił błąd wewnętrzny podczas konfiguracji",
    },
    conflict: {
      title: "Konfiguracja już istnieje",
      description:
        "Plik konfiguracyjny już istnieje. Użyj --force, aby nadpisać.",
    },
    configCreation: "Nie udało się utworzyć check.config.ts: {{error}}",
    unexpected: "Wystąpił nieoczekiwany błąd: {{error}}",
  },
};
