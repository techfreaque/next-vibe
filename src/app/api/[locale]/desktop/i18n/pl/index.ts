import { translations as clickTranslations } from "../../click/i18n/pl";
import { translations as focusWindowTranslations } from "../../focus-window/i18n/pl";
import { translations as getAccessibilityTreeTranslations } from "../../get-accessibility-tree/i18n/pl";
import { translations as getFocusedWindowTranslations } from "../../get-focused-window/i18n/pl";
import { translations as listMonitorsTranslations } from "../../list-monitors/i18n/pl";
import { translations as listWindowsTranslations } from "../../list-windows/i18n/pl";
import { translations as moveMouseTranslations } from "../../move-mouse/i18n/pl";
import { translations as pressKeyTranslations } from "../../press-key/i18n/pl";
import { translations as scrollTranslations } from "../../scroll/i18n/pl";
import { translations as takeScreenshotTranslations } from "../../take-screenshot/i18n/pl";
import { translations as typeTextTranslations } from "../../type-text/i18n/pl";
import type { translations as enTranslations } from "../en";

/**
 * Desktop API translations (Polish)
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

  title: "Narzędzia automatyzacji pulpitu",
  description: "Steruj pulpitem: zrzuty ekranu, mysz, klawiatura, okna",
  category: "Desktop",
  summary:
    "Automatyzacja pulpitu Linux przez xdotool, wmctrl, spectacle/scrot i pyatspi",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    inputAutomation: "Automatyzacja wprowadzania",
    windowManagement: "Zarządzanie oknami",
    captureAutomation: "Automatyzacja przechwytywania",
    accessibilityAutomation: "Automatyzacja dostępności",
  },

  tool: {
    takeScreenshot: "Zrób zrzut ekranu",
    getAccessibilityTree: "Pobierz drzewo dostępności",
    click: "Kliknij",
    typeText: "Wpisz tekst",
    pressKey: "Naciśnij klawisz",
    moveMouse: "Przesuń mysz",
    scroll: "Przewiń",
    getFocusedWindow: "Pobierz aktywne okno",
    listMonitors: "Lista monitorów",
    listWindows: "Lista okien",
    focusWindow: "Aktywuj okno",
  },

  repository: {
    platformNotSupported:
      "Platforma nieobsługiwana: {{platform}}. Obsługiwany jest tylko Linux.",
    windowsNotSupported: "Obsługa Windows wkrótce",
    macosNotSupported: "Obsługa macOS wkrótce",
    commandFailed: "Polecenie nie powiodło się: {{error}}",
    toolNotFound:
      "Wymagane narzędzie nie znalezione: {{tool}}. Zainstaluj przez: {{installCmd}}",
    screenshotFailed: "Nie udało się wykonać zrzutu ekranu",
    accessibilityFailed: "Nie udało się pobrać drzewa dostępności",
    focusWindowRequiresIdentifier:
      "Wymagane jest co najmniej jedno z: windowId, pid lub title",
    missingDep:
      "Brakuje pakietu systemowego: {{dep}}. Powinno pojawić się okno autoryzacji — zatwierdź, aby zainstalować automatycznie.",
  },
};
