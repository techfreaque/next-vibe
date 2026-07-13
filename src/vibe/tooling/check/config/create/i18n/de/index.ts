import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  title: "Check-Konfiguration erstellen",
  titleShort: "Check-Config",
  description:
    "Erstellen Sie check.config.ts mit optionaler MCP-Konfiguration, VSCode-Einstellungen und Regelkonfigurationen. Ohne Optionen für interaktives Setup ausführen.",
  category: "Entwicklungswerkzeuge",
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
    enablePromiseRules: {
      label: "Promise-Regeln aktivieren",
      description:
        "Promise Best Practices und async/await Linting-Regeln aktivieren",
    },
    enableNodeRules: {
      label: "Node.js-Regeln aktivieren",
      description: "Node.js-spezifische Linting-Regeln aktivieren",
    },
    enableUnicornRules: {
      label: "Unicorn-Regeln aktivieren",
      description:
        "Moderne JavaScript Best Practices aktivieren (eslint-plugin-unicorn)",
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
    enableTsgo: {
      label: "tsgo aktivieren",
      description: "tsgo anstelle von tsc für schnellere Typprüfung verwenden",
    },
    enableStrictTypes: {
      label: "Strenge Typen aktivieren",
      description: "Strenge TypeScript Typprüfungsregeln aktivieren",
    },
    interactive: {
      label: "Interaktiver Modus",
      description:
        "Im interaktiven Modus ausführen und jede Konfigurationsoption Schritt für Schritt abfragen",
    },
  },

  interactive: {
    welcome: "🔧 Interaktive Konfigurationseinrichtung",
    description:
      "Konfigurieren wir Ihre Code-Qualitätswerkzeuge! Beantworten Sie einige Fragen, um Ihre Einrichtung anzupassen.",
    createMcpConfig:
      "MCP-Konfiguration (.mcp.json) für KI-Tool-Integration erstellen?",
    updateVscodeSettings:
      "VSCode-Einstellungen (.vscode/settings.json) mit empfohlenen Formatter-Einstellungen aktualisieren?",
    updatePackageJson:
      "package.json-Skripte aktualisieren (check, lint, typecheck)?",
    enableReactRules: "React-spezifische Linting-Regeln aktivieren?",
    enableNextjsRules: "Next.js-spezifische Linting-Regeln aktivieren?",
    enableI18nRules: "Internationalisierungs (i18n) Linting-Regeln aktivieren?",
    jsxCapitalization: "JSX-Komponentennamen-Großschreibung erzwingen?",
    enablePromiseRules: "Promise Best Practices Regeln aktivieren?",
    enableNodeRules: "Node.js-spezifische Regeln aktivieren?",
    enableUnicornRules:
      "Moderne JavaScript Best Practices aktivieren (Unicorn)?",
    enablePedanticRules: "Strengere/pedantische Regeln aktivieren?",
    enableRestrictedSyntax: "throw, unknown und object-Typen einschränken?",
    enableTsgo: "tsgo anstelle von tsc für Typprüfung verwenden?",
    enableStrictTypes: "Strenge TypeScript Typprüfung aktivieren?",
    creating: "Konfigurationsdateien werden erstellt...",
  },

  steps: {
    creatingConfig: "check.config.ts wird erstellt...",
    configCreated: "check.config.ts erfolgreich erstellt",
    creatingMcpConfig: ".mcp.json wird erstellt...",
    mcpConfigCreated: ".mcp.json erfolgreich erstellt",
    updatingVscode: "VSCode-Einstellungen werden aktualisiert...",
    vscodeUpdated: "VSCode-Einstellungen erfolgreich aktualisiert",
    updatingPackageJson: "package.json-Skripte werden aktualisiert...",
    packageJsonUpdated: "package.json-Skripte erfolgreich aktualisiert",
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
    complete: "✨ Konfiguration abgeschlossen!",
    configCreated: "✓ Erstellt {{path}}",
    mcpConfigCreated: "✓ Erstellt {{path}}",
    vscodeUpdated: "✓ Aktualisiert {{path}}",
    packageJsonUpdated: "✓ Aktualisiert {{path}}",
  },

  errors: {
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
