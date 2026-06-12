import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  title: "Utwórz konfigurację sprawdzania",
  titleShort: "Konfiguracja check",
  description:
    "Utwórz check.config.ts z opcjonalną konfiguracją MCP, ustawieniami VSCode i konfiguracjami reguł. Uruchom bez opcji dla interaktywnej konfiguracji.",
  category: "Narzędzia programistyczne",
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
    enablePromiseRules: {
      label: "Włącz reguły Promise",
      description: "Włącz najlepsze praktyki Promise i reguły async/await",
    },
    enableNodeRules: {
      label: "Włącz reguły Node.js",
      description: "Włącz reguły lintowania specyficzne dla Node.js",
    },
    enableUnicornRules: {
      label: "Włącz reguły Unicorn",
      description:
        "Włącz nowoczesne najlepsze praktyki JavaScript (eslint-plugin-unicorn)",
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
    enableTsgo: {
      label: "Włącz tsgo",
      description: "Użyj tsgo zamiast tsc dla szybszego sprawdzania typów",
    },
    enableStrictTypes: {
      label: "Włącz ścisłe typy",
      description: "Włącz ścisłe reguły sprawdzania typów TypeScript",
    },
    interactive: {
      label: "Tryb interaktywny",
      description:
        "Uruchom w trybie interaktywnym i zapytaj o każdą opcję konfiguracji krok po kroku",
    },
  },

  interactive: {
    welcome: "🔧 Interaktywna konfiguracja",
    description:
      "Skonfigurujmy twoje narzędzia jakości kodu! Odpowiedz na kilka pytań, aby dostosować konfigurację.",
    createMcpConfig:
      "Utworzyć konfigurację MCP (.mcp.json) dla integracji narzędzi AI?",
    updateVscodeSettings:
      "Zaktualizować ustawienia VSCode (.vscode/settings.json) z zalecanymi ustawieniami formattera?",
    updatePackageJson:
      "Zaktualizować skrypty package.json (check, lint, typecheck)?",
    enableReactRules: "Włączyć reguły lintowania specyficzne dla React?",
    enableNextjsRules: "Włączyć reguły lintowania specyficzne dla Next.js?",
    enableI18nRules: "Włączyć reguły lintowania internacjonalizacji (i18n)?",
    jsxCapitalization: "Wymuszać wielkie litery w nazwach komponentów JSX?",
    enablePromiseRules: "Włączyć reguły najlepszych praktyk Promise?",
    enableNodeRules: "Włączyć reguły specyficzne dla Node.js?",
    enableUnicornRules:
      "Włączyć nowoczesne najlepsze praktyki JavaScript (Unicorn)?",
    enablePedanticRules: "Włączyć bardziej rygorystyczne reguły?",
    enableRestrictedSyntax: "Ogranicz użycie throw, unknown i typów object?",
    enableTsgo: "Użyć tsgo zamiast tsc do sprawdzania typów?",
    enableStrictTypes: "Włączyć ścisłe sprawdzanie typów TypeScript?",
    creating: "Tworzenie plików konfiguracyjnych...",
  },

  steps: {
    creatingConfig: "Tworzenie check.config.ts...",
    configCreated: "check.config.ts utworzony pomyślnie",
    creatingMcpConfig: "Tworzenie .mcp.json...",
    mcpConfigCreated: ".mcp.json utworzony pomyślnie",
    updatingVscode: "Aktualizowanie ustawień VSCode...",
    vscodeUpdated: "Ustawienia VSCode zaktualizowane pomyślnie",
    updatingPackageJson: "Aktualizowanie skryptów package.json...",
    packageJsonUpdated: "Skrypty package.json zaktualizowane pomyślnie",
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
    complete: "✨ Konfiguracja zakończona!",
    configCreated: "✓ Utworzono {{path}}",
    mcpConfigCreated: "✓ Utworzono {{path}}",
    vscodeUpdated: "✓ Zaktualizowano {{path}}",
    packageJsonUpdated: "✓ Zaktualizowano {{path}}",
  },

  errors: {
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
