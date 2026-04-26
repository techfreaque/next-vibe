import { translations as clickTranslations } from "../../click/i18n/de";
import { translations as focusWindowTranslations } from "../../focus-window/i18n/de";
import { translations as getAccessibilityTreeTranslations } from "../../get-accessibility-tree/i18n/de";
import { translations as getFocusedWindowTranslations } from "../../get-focused-window/i18n/de";
import { translations as listMonitorsTranslations } from "../../list-monitors/i18n/de";
import { translations as listWindowsTranslations } from "../../list-windows/i18n/de";
import { translations as moveMouseTranslations } from "../../move-mouse/i18n/de";
import { translations as pressKeyTranslations } from "../../press-key/i18n/de";
import { translations as scrollTranslations } from "../../scroll/i18n/de";
import { translations as takeScreenshotTranslations } from "../../take-screenshot/i18n/de";
import { translations as typeTextTranslations } from "../../type-text/i18n/de";
import type { translations as enTranslations } from "../en";

/**
 * Desktop API translations (German)
 */

export const translations: typeof enTranslations = {
  "take-screenshot": takeScreenshotTranslations,
  "get-accessibility-tree": getAccessibilityTreeTranslations,
  "list-monitors": listMonitorsTranslations,
  click: clickTranslations,
  "type-text": typeTextTranslations,
  "press-key": pressKeyTranslations,
  "move-mouse": moveMouseTranslations,
  scroll: scrollTranslations,
  "get-focused-window": getFocusedWindowTranslations,
  "list-windows": listWindowsTranslations,
  "focus-window": focusWindowTranslations,

  title: "Desktop-Automatisierungstools",
  description: "Desktop steuern: Screenshots, Maus, Tastatur, Fenster",
  category: "Desktop",
  summary:
    "Linux-Desktop-Automatisierung über xdotool, wmctrl, spectacle/scrot und pyatspi",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    inputAutomation: "Eingabe-Automatisierung",
    windowManagement: "Fensterverwaltung",
    captureAutomation: "Erfassungs-Automatisierung",
    accessibilityAutomation: "Barrierefreiheits-Automatisierung",
  },

  tool: {
    takeScreenshot: "Screenshot aufnehmen",
    getAccessibilityTree: "Barrierefreiheitsbaum abrufen",
    click: "Klicken",
    typeText: "Text eingeben",
    pressKey: "Taste drücken",
    moveMouse: "Maus bewegen",
    scroll: "Scrollen",
    getFocusedWindow: "Fokussiertes Fenster abrufen",
    listMonitors: "Monitore auflisten",
    listWindows: "Fenster auflisten",
    focusWindow: "Fenster fokussieren",
  },

  repository: {
    platformNotSupported:
      "Plattform nicht unterstützt: {{platform}}. Nur Linux wird unterstützt.",
    windowsNotSupported: "Windows-Unterstützung kommt bald",
    macosNotSupported: "macOS-Unterstützung kommt bald",
    commandFailed: "Befehl fehlgeschlagen: {{error}}",
    toolNotFound:
      "Erforderliches Tool nicht gefunden: {{tool}}. Installieren mit: {{installCmd}}",
    screenshotFailed: "Screenshot konnte nicht aufgenommen werden",
    accessibilityFailed: "Barrierefreiheitsbaum konnte nicht abgerufen werden",
    focusWindowRequiresIdentifier:
      "Mindestens eines von windowId, pid oder title wird benötigt",
    missingDep:
      "Systempaket fehlt: {{dep}}. Ein Authentifizierungsdialog sollte erschienen sein — bestätigen, um automatisch zu installieren.",
  },
};
