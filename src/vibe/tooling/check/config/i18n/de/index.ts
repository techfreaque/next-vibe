import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Check-Konfiguration erstellen",
  description:
    "Erstellen Sie check.config.ts mit optionaler MCP-Konfiguration, VSCode-Einstellungen und Regelkonfigurationen. Ohne Optionen für interaktives Setup ausführen.",
  tag: "Qualität",

  fields: {
    createMcpConfig: {
      label: "MCP-Konfiguration erstellen",
      description:
        "Erstellen Sie eine .mcp.json-Konfigurationsdatei für die Model Context Protocol-Integration",
    },
    updateVscodeSettings: {
      label: "VSCode-Einstellungen aktualisieren",
      description:
        "Aktualisieren Sie .vscode/settings.json mit empfohlenen ESLint- und Formatter-Einstellungen",
    },
    updatePackageJson: {
      label: "package.json-Skripte aktualisieren",
      description:
        "package.json-Skripte für check, lint und typecheck Befehle hinzufügen/aktualisieren",
    },
    enableEslint: {
      label: "ESLint aktivieren",
      description:
        "ESLint für Regeln aktivieren, die von Oxlint noch nicht unterstützt werden (Import-Sortierung, React Hooks). Deaktivieren für maximale Geschwindigkeit.",
    },
    enableReactRules: {
      label: "React-Regeln aktivieren",
      description:
        "Aktivieren Sie React-spezifische Linting-Regeln (react-hooks, jsx-a11y)",
    },
    enableNextjsRules: {
      label: "Next.js-Regeln aktivieren",
      description:
        "Aktivieren Sie Next.js-spezifische Linting-Regeln und Konfigurationen",
    },
    enableI18nRules: {
      label: "i18n-Regeln aktivieren",
      description:
        "Aktivieren Sie Internationalisierungs-Linting-Regeln (eslint-plugin-i18next)",
    },
    jsxCapitalization: {
      label: "JSX-Großschreibung",
      description:
        "Großschreibung von JSX-Komponentennamen erzwingen (react/jsx-pascal-case)",
    },
    enablePedanticRules: {
      label: "Pedantische Regeln aktivieren",
      description:
        "Strengere/pedantische Linting-Regeln für höhere Codequalität aktivieren",
    },
    enableRestrictedSyntax: {
      label: "Eingeschränkte Syntax aktivieren",
      description:
        "Verwendung von throw, unknown und object-Typen einschränken",
    },
    interactive: {
      label: "Interaktiver Modus",
      description:
        "Im interaktiven Modus ausführen und jede Konfigurationsoption Schritt für Schritt abfragen",
    },
  },

  steps: {
    creatingConfig: "check.config.ts wird erstellt...",
  },

  warnings: {
    mcpConfigFailed: "MCP-Konfiguration konnte nicht erstellt werden",
    vscodeFailed: "VSCode-Einstellungen konnten nicht aktualisiert werden",
    packageJsonFailed: "package.json konnte nicht aktualisiert werden",
    packageJsonNotFound: "package.json im aktuellen Verzeichnis nicht gefunden",
  },

  response: {
    message: "Konfiguration erstellt",
  },

  success: {
    title: "Konfiguration erstellt",
    description: "Konfigurationsdateien erfolgreich erstellt",
  },

  errors: {
    generateConfigsFailed: "Konfigurationen konnten nicht generiert werden",
    generateVSCodeSettingsFailed:
      "VSCode-Einstellungen konnten nicht generiert werden",
    packageRootNotFound: "Paketstamm nicht gefunden",
    templateNotFound: "Vorlage nicht gefunden unter {{path}}",
    createConfigFailed: "check.config.ts konnte nicht erstellt werden",
    createMcpConfigFailed: ".mcp.json konnte nicht erstellt werden",
    validation: {
      title: "Ungültige Parameter",
      description: "Die Konfigurationsparameter sind ungültig",
    },
    internal: {
      title: "Interner Fehler",
      description:
        "Ein interner Fehler ist während der Konfiguration aufgetreten",
    },
    conflict: {
      title: "Konfiguration existiert bereits",
      description:
        "Konfigurationsdatei existiert bereits. Verwenden Sie --force zum Überschreiben.",
    },
    configCreation: "check.config.ts konnte nicht erstellt werden: {{error}}",
    unexpected: "Ein unerwarteter Fehler ist aufgetreten: {{error}}",
  },
};
