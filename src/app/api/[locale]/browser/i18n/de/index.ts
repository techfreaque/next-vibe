import { translations as clickTranslations } from "../../click/i18n/de";
import { translations as closePageTranslations } from "../../close-page/i18n/de";
import { translations as dragTranslations } from "../../drag/i18n/de";
import { translations as emulateTranslations } from "../../emulate/i18n/de";
import { translations as evaluateScriptTranslations } from "../../evaluate-script/i18n/de";
import { translations as fillTranslations } from "../../fill/i18n/de";
import { translations as fillFormTranslations } from "../../fill-form/i18n/de";
import { translations as getConsoleMessageTranslations } from "../../get-console-message/i18n/de";
import { translations as getNetworkRequestTranslations } from "../../get-network-request/i18n/de";
import { translations as handleDialogTranslations } from "../../handle-dialog/i18n/de";
import { translations as hoverTranslations } from "../../hover/i18n/de";
import { translations as listConsoleMessagesTranslations } from "../../list-console-messages/i18n/de";
import { translations as listNetworkRequestsTranslations } from "../../list-network-requests/i18n/de";
import { translations as listPagesTranslations } from "../../list-pages/i18n/de";
import { translations as navigatePageTranslations } from "../../navigate-page/i18n/de";
import { translations as newPageTranslations } from "../../new-page/i18n/de";
import { translations as performanceAnalyzeInsightTranslations } from "../../performance-analyze-insight/i18n/de";
import { translations as performanceStartTraceTranslations } from "../../performance-start-trace/i18n/de";
import { translations as performanceStopTraceTranslations } from "../../performance-stop-trace/i18n/de";
import { translations as pressKeyTranslations } from "../../press-key/i18n/de";
import { translations as resizePageTranslations } from "../../resize-page/i18n/de";
import { translations as selectPageTranslations } from "../../select-page/i18n/de";
import { translations as takeScreenshotTranslations } from "../../take-screenshot/i18n/de";
import { translations as takeSnapshotTranslations } from "../../take-snapshot/i18n/de";
import { translations as uploadFileTranslations } from "../../upload-file/i18n/de";
import { translations as waitForTranslations } from "../../wait-for/i18n/de";
import type { translations as enTranslations } from "../en";

/**
 * Browser API translations (German)
 */

export const translations: typeof enTranslations = {
  click: clickTranslations,
  "close-page": closePageTranslations,
  drag: dragTranslations,
  fill: fillTranslations,
  "fill-form": fillFormTranslations,
  "handle-dialog": handleDialogTranslations,
  hover: hoverTranslations,
  "press-key": pressKeyTranslations,
  "upload-file": uploadFileTranslations,
  "list-pages": listPagesTranslations,
  "navigate-page": navigatePageTranslations,
  "new-page": newPageTranslations,
  "select-page": selectPageTranslations,
  emulate: emulateTranslations,
  "resize-page": resizePageTranslations,
  "evaluate-script": evaluateScriptTranslations,
  "get-console-message": getConsoleMessageTranslations,
  "list-console-messages": listConsoleMessagesTranslations,
  "get-network-request": getNetworkRequestTranslations,
  "list-network-requests": listNetworkRequestsTranslations,
  "performance-analyze-insight": performanceAnalyzeInsightTranslations,
  "performance-start-trace": performanceStartTraceTranslations,
  "performance-stop-trace": performanceStopTraceTranslations,
  "take-screenshot": takeScreenshotTranslations,
  "take-snapshot": takeSnapshotTranslations,
  "wait-for": waitForTranslations,
  title: "Chrome DevTools MCP Tools",
  description:
    "Chrome DevTools MCP Tools für Browser-Automatisierung und Debugging ausführen",
  category: "Core API",
  summary:
    "Zugriff auf Chrome DevTools Protocol Tools über MCP für Web-Automatisierung",
  tags: {
    browserAutomation: "Browser-Automatisierung",
    chromeDevTools: "Chrome DevTools",
    mcpTools: "MCP Tools",
    webDebugging: "Web-Debugging",
    performanceAnalysis: "Leistungsanalyse",
    inputAutomation: "Eingabe-Automatisierung",
    captureAutomation: "Erfassungs-Automatisierung",
    debugging: "Debugging",
    dialogAutomation: "Dialog-Automatisierung",
    navigationAutomation: "Navigations-Automatisierung",
    networkAnalysis: "Netzwerkanalyse",
    performanceAutomation: "Leistungs-Automatisierung",
    scriptExecution: "Skriptausführung",
    viewportAutomation: "Viewport-Automatisierung",
    waitAutomation: "Warte-Automatisierung",
  },

  form: {
    label: "Browser Tool Ausführung",
    description:
      "Chrome DevTools MCP Tools für Browser-Steuerung und Analyse ausführen",
    fields: {
      tool: {
        label: "Tool",
        description: "Das auszuführende Chrome DevTools MCP Tool auswählen",
        placeholder: "Tool auswählen...",
      },
      arguments: {
        label: "Argumente",
        description: "JSON-Argumente für das ausgewählte Tool (optional)",
        placeholder: '{"url": "https://example.com"}',
      },
    },
  },

  tool: {
    // Input automation tools (8)
    click: "Element anklicken",
    drag: "Element ziehen",
    fill: "Eingabefeld ausfüllen",
    fillForm: "Formular ausfüllen",
    handleDialog: "Dialog behandeln",
    hover: "Element hovern",
    pressKey: "Taste drücken",
    uploadFile: "Datei hochladen",

    // Navigation automation tools (6)
    closePage: "Seite schließen",
    listPages: "Seiten auflisten",
    navigatePage: "Seite navigieren",
    newPage: "Neue Seite",
    selectPage: "Seite auswählen",
    waitFor: "Warten auf",

    // Emulation tools (2)
    emulate: "Gerät emulieren",
    resizePage: "Seite skalieren",

    // Performance tools (3)
    performanceAnalyzeInsight: "Leistungs-Insight analysieren",
    performanceStartTrace: "Leistungs-Trace starten",
    performanceStopTrace: "Leistungs-Trace stoppen",

    // Network tools (2)
    getNetworkRequest: "Netzwerk-Anfrage abrufen",
    listNetworkRequests: "Netzwerk-Anfragen auflisten",

    // Debugging tools (5)
    evaluateScript: "Skript auswerten",
    getConsoleMessage: "Konsolen-Nachricht abrufen",
    listConsoleMessages: "Konsolen-Nachrichten auflisten",
    takeScreenshot: "Screenshot aufnehmen",
    takeSnapshot: "Snapshot aufnehmen",
  },

  status: {
    pending: "Ausstehend",
    running: "Läuft",
    completed: "Abgeschlossen",
    failed: "Fehlgeschlagen",
  },

  response: {
    success: "Tool erfolgreich ausgeführt",
    result: "Ausführungsergebnis",
    status: "Aktueller Ausführungsstatus",
    statusItem: "Status item",
    executionId: "Ausführungs-ID zur Nachverfolgung",
  },

  examples: {
    requests: {
      navigate: {
        title: "Zu URL navigieren",
        description: "Browser zu einer bestimmten URL navigieren",
      },
      screenshot: {
        title: "Screenshot aufnehmen",
        description: "Ein Screenshot der aktuellen Seite aufnehmen",
      },
      click: {
        title: "Element anklicken",
        description: "Auf ein bestimmtes Element klicken",
      },
      performance: {
        title: "Leistungs-Trace starten",
        description: "Beginne mit der Aufzeichnung von Leistungsmetriken",
      },
      script: {
        title: "Skript auswerten",
        description: "JavaScript im Browser ausführen",
      },
    },
    responses: {
      navigate: {
        title: "Navigation Ergebnis",
        description: "Ergebnis der Seitennavigation",
      },
      screenshot: {
        title: "Screenshot Ergebnis",
        description: "Screenshot-Aufnahme Ergebnis",
      },
      click: {
        title: "Klick Ergebnis",
        description: "Element-Klick Ergebnis",
      },
      performance: {
        title: "Leistungs-Trace gestartet",
        description: "Leistungsverfolgung initiiert",
      },
      script: {
        title: "Skript Auswertung Ergebnis",
        description: "JavaScript-Ausführung Ergebnis",
      },
    },
  },

  errors: {
    toolExecutionFailed: {
      title: "Tool-Ausführung fehlgeschlagen",
      description:
        "Das ausgewählte Tool konnte nicht erfolgreich ausgeführt werden",
    },
    invalidArguments: {
      title: "Ungültige Argumente",
      description:
        "Die bereitgestellten Argumente sind für dieses Tool nicht gültig",
    },
    browserNotAvailable: {
      title: "Browser nicht verfügbar",
      description: "Chrome Browser Instanz ist nicht verfügbar",
    },
    toolNotFound: {
      title: "Tool nicht gefunden",
      description: "Das angeforderte Tool ist nicht verfügbar",
    },
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      toolRequired: "Tool-Auswahl ist erforderlich",
      argumentsInvalid: "Argumente müssen gültiges JSON sein",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Bei der Tool-Ausführung ist ein Netzwerkfehler aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Browser-Tools auszuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Browser-Tool-Ausführung ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Das angeforderte Browser-Tool wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Bei der Tool-Ausführung ist ein interner Serverfehler aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Bei der Tool-Ausführung ist ein unbekannter Fehler aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description:
        "Sie haben ungespeicherte Änderungen, die verloren gehen könnten",
    },
    conflict: {
      title: "Konflikt",
      description: "Bei der Tool-Ausführung ist ein Konflikt aufgetreten",
    },
  },

  success: {
    title: "Tool erfolgreich ausgeführt",
    description: "Das Browser-Tool wurde erfolgreich ausgeführt",
  },

  repository: {
    execute: {
      start: "Browser-Tool-Ausführung starten",
      success: "Browser-Tool erfolgreich ausgeführt",
      error: "Fehler bei der Browser-Tool-Ausführung",
    },
    mcp: {
      connect: {
        start: "Verbindung zum Chrome DevTools MCP Server herstellen",
        success: "Erfolgreich mit MCP Server verbunden",
        error: "Fehler beim Verbinden mit MCP Server",
        failedToInitialize:
          "Fehler beim Initialisieren des Chrome DevTools MCP Servers",
      },
      tool: {
        call: {
          start: "MCP Tool aufrufen",
          success: "MCP Tool erfolgreich aufgerufen",
          error: "Fehler beim Aufrufen des MCP Tools",
          invalidJsonArguments: "Ungültige JSON-Argumente",
          executionFailed: "Tool-Ausführung fehlgeschlagen: {{error}}",
          toolExecutionFailed: "Fehler beim Ausführen von {{toolName}}",
        },
      },
    },
  },
};
