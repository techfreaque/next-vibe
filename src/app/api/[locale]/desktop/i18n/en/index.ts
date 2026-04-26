/**
 * Desktop API translations (English)
 */

import { translations as clickTranslations } from "../../click/i18n/en";
import { translations as focusWindowTranslations } from "../../focus-window/i18n/en";
import { translations as getAccessibilityTreeTranslations } from "../../get-accessibility-tree/i18n/en";
import { translations as getFocusedWindowTranslations } from "../../get-focused-window/i18n/en";
import { translations as listMonitorsTranslations } from "../../list-monitors/i18n/en";
import { translations as listWindowsTranslations } from "../../list-windows/i18n/en";
import { translations as moveMouseTranslations } from "../../move-mouse/i18n/en";
import { translations as pressKeyTranslations } from "../../press-key/i18n/en";
import { translations as scrollTranslations } from "../../scroll/i18n/en";
import { translations as takeScreenshotTranslations } from "../../take-screenshot/i18n/en";
import { translations as typeTextTranslations } from "../../type-text/i18n/en";

export const translations = {
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

  title: "Desktop Automation Tools",
  description: "Control the desktop: screenshots, mouse, keyboard, windows",
  category: "Desktop",
  summary:
    "Linux desktop automation via xdotool, wmctrl, spectacle/scrot, and pyatspi",
  tags: {
    desktopAutomation: "Desktop Automation",
    inputAutomation: "Input Automation",
    windowManagement: "Window Management",
    captureAutomation: "Capture Automation",
    accessibilityAutomation: "Accessibility Automation",
  },

  tool: {
    takeScreenshot: "Take Screenshot",
    getAccessibilityTree: "Get Accessibility Tree",
    listMonitors: "List Monitors",
    click: "Click",
    typeText: "Type Text",
    pressKey: "Press Key",
    moveMouse: "Move Mouse",
    scroll: "Scroll",
    getFocusedWindow: "Get Focused Window",
    listWindows: "List Windows",
    focusWindow: "Focus Window",
  },

  repository: {
    platformNotSupported:
      "Platform not supported: {{platform}}. Only Linux is supported.",
    windowsNotSupported: "Windows support coming soon",
    macosNotSupported: "macOS support coming soon",
    commandFailed: "Command failed: {{error}}",
    toolNotFound:
      "Required tool not found: {{tool}}. Install it with: {{installCmd}}",
    screenshotFailed: "Failed to capture screenshot",
    accessibilityFailed: "Failed to get accessibility tree",
    focusWindowRequiresIdentifier:
      "At least one of windowId, pid, or title is required",
    missingDep:
      "Required system package missing: {{dep}}. A system auth dialog should have appeared - approve it to install automatically.",
  },
};
