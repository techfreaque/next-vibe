import type { translations as enTranslations } from "../en";

/**
 * Desktop API translations (German)
 */

export const translations: typeof enTranslations = {
  "take-screenshot": {
    title: "Desktop-Screenshot aufnehmen",
    titleShort: "Screenshot",
    dynamicTitle: "Screenshot: {{target}}",
    description:
      "Einen Screenshot des Desktops oder eines Bildschirmbereichs aufnehmen",
    form: {
      label: "Screenshot aufnehmen",
      capturing: "Aufnahme läuft…",
      refresh: "Neu aufnehmen",
      description:
        "Einen Screenshot des gesamten Desktops oder eines bestimmten Bereichs aufnehmen",
      fields: {
        outputPath: {
          label: "Ausgabepfad",
          description:
            "Absoluter Pfad zum Speichern des Screenshots. Weglassen für Base64-Rückgabe.",
          placeholder: "/tmp/screenshot.png",
        },
        screen: {
          label: "Bildschirmindex",
          description:
            "Bildschirm-/Monitor-Index (0 = primär). Bevorzuge monitorName.",
          placeholder: "0",
        },
        monitorName: {
          label: "Monitorname",
          description:
            "Monitorname (z.B. DP-1, HDMI-1). list-monitors zeigt verfügbare Namen.",
          placeholder: "DP-1",
        },
        maxWidth: {
          label: "Maximale Breite",
          description:
            "Bild auf diese Breite skalieren, wenn es breiter ist. Nützlich für KI - 4-Monitor-Aufnahmen sind riesig.",
          placeholder: "1920",
        },
      },
    },
    response: {
      success: "Screenshot erfolgreich aufgenommen",
      imagePath: "Pfad, unter dem der Screenshot gespeichert wurde",
      imageData: "Base64-kodierte PNG-Screenshot-Daten",
      width: "Screenshot-Breite in Pixeln",
      height: "Screenshot-Höhe in Pixeln",
      monitorName: "Erfasster Monitor",
      originalWidth: "Originalbreite vor Skalierung",
      originalHeight: "Originalhöhe vor Skalierung",
      error: "Fehlermeldung",
      executionId: "Ausführungs-ID zur Verfolgung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Aufnehmen des Screenshots aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Desktop-Screenshots aufzunehmen",
      },
      forbidden: {
        title: "Verboten",
        description: "Das Aufnehmen von Desktop-Screenshots ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Aufnehmen des Screenshots aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Aufnehmen des Screenshots aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Aufnehmen des Screenshots aufgetreten",
      },
      notImplemented: {
        title: "Nicht implementiert",
        description:
          "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
      },
    },
    success: {
      title: "Screenshot aufgenommen",
      description: "Der Desktop-Screenshot wurde erfolgreich aufgenommen",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      captureAutomation: "Erfassungs-Automatisierung",
    },
  },
  "get-accessibility-tree": {
    title: "Barrierefreiheitsbaum abrufen",
    titleShort: "A11y-Baum",
    dynamicTitle: "A11y: {{app}}",
    description:
      "Barrierefreiheitsbaum des fokussierten Fensters oder einer bestimmten Anwendung abrufen",
    form: {
      label: "Barrierefreiheitsbaum abrufen",
      description:
        "Den AT-SPI-Barrierefreiheitsbaum für die Desktop-UI-Inspektion abrufen",
      fields: {
        appName: {
          label: "Anwendungsname",
          description:
            "Prozessname oder Fenstertitel (weglassen für fokussiertes Fenster)",
          placeholder: "firefox",
        },
        maxDepth: {
          label: "Maximale Tiefe",
          description: "Maximale Baumtiefe für die Durchquerung (Standard: 5)",
          placeholder: "5",
        },
        includeActions: {
          label: "Aktionen einbeziehen",
          description:
            "Verfügbare Aktionen pro Knoten anzeigen (klicken, drücken, aktivieren...). Mehr Details, größere Ausgabe.",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Barrierefreiheitsbaum erfolgreich abgerufen",
      tree: "Barrierefreiheitsbaum als strukturierter Text",
      nodeCount: "Gesamtanzahl der durchlaufenen Knoten",
      truncated:
        "Ob die Abfrage abgelaufen ist und die Ausgabe unvollständig sein kann",
      error: "Fehlermeldung",
      executionId: "Ausführungs-ID zur Verfolgung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Abrufen des Barrierefreiheitsbaums aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, auf den Barrierefreiheitsbaum zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description: "Der Zugriff auf den Barrierefreiheitsbaum ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Die Zielanwendung oder das Zielfenster wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Abrufen des Barrierefreiheitsbaums aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Abrufen des Barrierefreiheitsbaums aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Abrufen des Barrierefreiheitsbaums aufgetreten",
      },
      notImplemented: {
        title: "Nicht implementiert",
        description:
          "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
      },
    },
    success: {
      title: "Barrierefreiheitsbaum abgerufen",
      description: "Der Barrierefreiheitsbaum wurde erfolgreich abgerufen",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      accessibilityAutomation: "Barrierefreiheits-Automatisierung",
    },
  },
  "list-monitors": {
    title: "Monitore auflisten",
    titleShort: "Monitore",
    description:
      "Alle verbundenen Monitore mit Auflösung, Position und Index auflisten",
    form: {
      label: "Monitore auflisten",
      description:
        "Alle angeschlossenen Bildschirme aufzählen. Monitornamen für gezielte Screenshots verwenden.",
      fields: {},
    },
    response: {
      success: "Monitore erfolgreich aufgelistet",
      monitors: "Array der verbundenen Monitore",
      error: "Fehlermeldung",
      executionId: "Ausführungs-ID zur Verfolgung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Auflisten der Monitore aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Monitore aufzulisten",
      },
      forbidden: {
        title: "Verboten",
        description: "Das Auflisten von Monitoren ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Auflisten der Monitore aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Auflisten der Monitore aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Auflisten der Monitore aufgetreten",
      },
      notImplemented: {
        title: "Nicht implementiert",
        description:
          "Monitor-Auflistung ist auf Ihrem Betriebssystem nicht verfügbar",
      },
    },
    success: {
      title: "Monitore aufgelistet",
      description: "Alle verbundenen Monitore wurden erfolgreich aufgelistet",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      captureAutomation: "Erfassungs-Automatisierung",
    },
  },
  click: {
    title: "Klicken",
    titleShort: "Klicken",
    dynamicTitle: "Klick: {{x}},{{y}}",
    description:
      "Maus zu absoluten Koordinaten bewegen und einen Mausklick ausführen",
    form: {
      label: "Klicken",
      description: "Maus zu den angegebenen Koordinaten bewegen und klicken",
      fields: {
        x: {
          label: "X-Koordinate",
          description:
            "Horizontale Bildschirmkoordinate in Pixeln (vom linken Rand)",
          placeholder: "100",
        },
        y: {
          label: "Y-Koordinate",
          description:
            "Vertikale Bildschirmkoordinate in Pixeln (vom oberen Rand)",
          placeholder: "200",
        },
        button: {
          label: "Maustaste",
          description: "Maustaste für den Klick (links, mitte, rechts)",
          placeholder: "links",
          options: {
            left: "Links",
            middle: "Mitte",
            right: "Rechts",
          },
        },
        doubleClick: {
          label: "Doppelklick",
          description: "Doppelklick statt einfachem Klick ausführen",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Klick erfolgreich ausgeführt",
      error: "Fehlermeldung",
      executionId: "Ausführungs-ID zur Verfolgung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Ausführen des Klicks aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Desktop-Klicks auszuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Das Ausführen von Desktop-Klicks ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Ausführen des Klicks aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Ausführen des Klicks aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Ausführen des Klicks aufgetreten",
      },
      notImplemented: {
        title: "Nicht implementiert",
        description:
          "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
      },
    },
    success: {
      title: "Klick ausgeführt",
      description: "Der Mausklick wurde erfolgreich ausgeführt",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
  },
  "type-text": {
    title: "Text eingeben",
    titleShort: "Text tippen",
    dynamicTitle: "Tippen: {{text}}",
    description:
      "Text in das fokussierte Fenster über Tastatureingabe-Simulation eingeben",
    form: {
      label: "Text eingeben",
      description: "Tastatureingaben an das fokussierte Fenster senden",
      fields: {
        text: {
          label: "Text",
          description: "Der in das fokussierte Fenster einzugebende Text",
          placeholder: "Hallo, Welt!",
        },
        delay: {
          label: "Verzögerung (ms)",
          description:
            "Verzögerung zwischen Tastatureingaben in Millisekunden (Standard: 12)",
          placeholder: "12",
        },
        windowId: {
          label: "Fenster-ID",
          description:
            "Dieses Fenster vor der Eingabe fokussieren (UUID aus list-windows)",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Fenstertitel",
          description: "Fenster mit diesem Titel vor der Eingabe fokussieren",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Text erfolgreich eingegeben",
      error: "Fehlermeldung",
      executionId: "Ausführungs-ID zur Verfolgung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Eingeben von Text aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Text auf dem Desktop einzugeben",
      },
      forbidden: {
        title: "Verboten",
        description: "Das Eingeben von Text auf dem Desktop ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Eingeben von Text aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Eingeben von Text aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Eingeben von Text aufgetreten",
      },
      notImplemented: {
        title: "Nicht implementiert",
        description:
          "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
      },
    },
    success: {
      title: "Text eingegeben",
      description: "Der Text wurde erfolgreich eingegeben",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
  },
  "press-key": {
    title: "Taste drücken",
    titleShort: "Taste drücken",
    dynamicTitle: "Taste: {{key}}",
    description: "Eine Taste oder Tastenkombination mit xdotool drücken",
    form: {
      label: "Taste drücken",
      description:
        "Ein Tastdruckereignis an den Desktop senden (xdotool-Syntax)",
      fields: {
        key: {
          label: "Taste",
          description:
            "Tastenname oder Kombination in xdotool-Syntax (z.B. Return, ctrl+c, alt+F4)",
          placeholder: "Return",
        },
        repeat: {
          label: "Wiederholungsanzahl",
          description: "Anzahl der Tastendrücke (Standard: 1)",
          placeholder: "1",
        },
        delay: {
          label: "Verzögerung (ms)",
          description:
            "Verzögerung zwischen wiederholten Tastendrücken in Millisekunden (Standard: 0)",
          placeholder: "0",
        },
        windowId: {
          label: "Fenster-ID",
          description: "Dieses Fenster vor dem Tastendruck fokussieren",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Fenstertitel",
          description:
            "Fenster mit diesem Titel vor dem Tastendruck fokussieren",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Taste erfolgreich gedrückt",
      error: "Fehlermeldung",
      executionId: "Ausführungs-ID zur Verfolgung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Drücken der Taste aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Tasten auf dem Desktop zu drücken",
      },
      forbidden: {
        title: "Verboten",
        description: "Das Drücken von Tasten auf dem Desktop ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Drücken der Taste aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Drücken der Taste aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Drücken der Taste aufgetreten",
      },
      notImplemented: {
        title: "Nicht implementiert",
        description:
          "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
      },
    },
    success: {
      title: "Taste gedrückt",
      description: "Die Taste wurde erfolgreich gedrückt",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
  },
  "move-mouse": {
    title: "Maus bewegen",
    titleShort: "Maus bewegen",
    dynamicTitle: "Bewegen: {{x}},{{y}}",
    description: "Den Mauszeiger zu absoluten Bildschirmkoordinaten bewegen",
    form: {
      label: "Maus bewegen",
      description: "Den Mauszeiger zur angegebenen Bildschirmposition bewegen",
      fields: {
        x: {
          label: "X-Koordinate",
          description:
            "Horizontale Bildschirmkoordinate in Pixeln (vom linken Rand)",
          placeholder: "100",
        },
        y: {
          label: "Y-Koordinate",
          description:
            "Vertikale Bildschirmkoordinate in Pixeln (vom oberen Rand)",
          placeholder: "200",
        },
      },
    },
    response: {
      success: "Maus erfolgreich bewegt",
      error: "Fehlermeldung",
      executionId: "Ausführungs-ID zur Verfolgung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist beim Bewegen der Maus aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, die Maus auf dem Desktop zu bewegen",
      },
      forbidden: {
        title: "Verboten",
        description: "Das Bewegen der Maus auf dem Desktop ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Bewegen der Maus aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Bewegen der Maus aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Bewegen der Maus aufgetreten",
      },
      notImplemented: {
        title: "Nicht implementiert",
        description:
          "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
      },
    },
    success: {
      title: "Maus bewegt",
      description: "Der Mauszeiger wurde erfolgreich bewegt",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
  },
  scroll: {
    title: "Scrollen",
    titleShort: "Scrollen",
    dynamicTitle: "Scrollen: {{direction}}",
    description:
      "An der aktuellen oder angegebenen Mauszeigerposition scrollen",
    form: {
      label: "Scrollen",
      description:
        "Hoch, runter, links oder rechts an der angegebenen Position scrollen",
      fields: {
        x: {
          label: "X-Koordinate",
          description:
            "Horizontale Scrollposition (aktuelle Position wenn weggelassen)",
          placeholder: "100",
        },
        y: {
          label: "Y-Koordinate",
          description:
            "Vertikale Scrollposition (aktuelle Position wenn weggelassen)",
          placeholder: "200",
        },
        direction: {
          label: "Richtung",
          description: "Scroll-Richtung",
          placeholder: "runter",
          options: {
            up: "Hoch",
            down: "Runter",
            left: "Links",
            right: "Rechts",
          },
        },
        amount: {
          label: "Menge",
          description: "Anzahl der Scroll-Schritte (Standard: 3)",
          placeholder: "3",
        },
      },
    },
    response: {
      success: "Scrollen erfolgreich ausgeführt",
      error: "Fehlermeldung",
      executionId: "Ausführungs-ID zur Verfolgung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist beim Scrollen aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, auf dem Desktop zu scrollen",
      },
      forbidden: {
        title: "Verboten",
        description: "Das Scrollen auf dem Desktop ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist beim Scrollen aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist beim Scrollen aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Scrollen aufgetreten",
      },
      notImplemented: {
        title: "Nicht implementiert",
        description:
          "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
      },
    },
    success: {
      title: "Gescrollt",
      description: "Das Scrollen wurde erfolgreich ausgeführt",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
  },
  "get-focused-window": {
    title: "Fokussiertes Fenster abrufen",
    titleShort: "Aktives Fenster",
    description: "Informationen über das aktuell fokussierte Fenster abrufen",
    form: {
      label: "Fokussiertes Fenster abrufen",
      description: "Fenster-ID, Titel und PID des aktiven Fensters abrufen",
      fields: {},
    },
    response: {
      success: "Informationen zum fokussierten Fenster erfolgreich abgerufen",
      windowId: "X11-Fenster-ID des fokussierten Fensters",
      windowTitle: "Titeltext des fokussierten Fensters",
      pid: "Prozess-ID des fokussierten Fensters",
      error: "Fehlermeldung",
      executionId: "Ausführungs-ID zur Verfolgung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Abrufen des fokussierten Fensters aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Fensterinformationen abzurufen",
      },
      forbidden: {
        title: "Verboten",
        description: "Das Abrufen von Fensterinformationen ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein fokussiertes Fenster gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Abrufen des fokussierten Fensters aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Abrufen des fokussierten Fensters aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Abrufen des fokussierten Fensters aufgetreten",
      },
      notImplemented: {
        title: "Nicht implementiert",
        description:
          "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
      },
    },
    success: {
      title: "Fokussiertes Fenster abgerufen",
      description:
        "Die Informationen zum fokussierten Fenster wurden erfolgreich abgerufen",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      windowManagement: "Fensterverwaltung",
    },
  },
  "list-windows": {
    title: "Fenster auflisten",
    titleShort: "Fenster",
    description: "Alle offenen Fenster auf dem Desktop auflisten",
    form: {
      label: "Fenster auflisten",
      description:
        "Eine Liste aller offenen Fenster mit IDs, Titeln und Positionen abrufen",
      fields: {},
    },
    response: {
      success: "Fensterliste erfolgreich abgerufen",
      windows: "Liste der offenen Fenster",
      error: "Fehlermeldung",
      executionId: "Ausführungs-ID zur Verfolgung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Auflisten der Fenster aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Fenster aufzulisten",
      },
      forbidden: {
        title: "Verboten",
        description: "Das Auflisten von Fenstern ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Fenster gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Auflisten der Fenster aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Auflisten der Fenster aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Auflisten der Fenster aufgetreten",
      },
      notImplemented: {
        title: "Nicht implementiert",
        description:
          "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
      },
    },
    success: {
      title: "Fenster aufgelistet",
      description: "Die Fensterliste wurde erfolgreich abgerufen",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      windowManagement: "Fensterverwaltung",
    },
  },
  "focus-window": {
    title: "Fenster fokussieren",
    titleShort: "Fenster fokussieren",
    dynamicTitle: "Fokus: {{target}}",
    description:
      "Ein Fenster in den Vordergrund bringen und ihm den Fokus geben",
    form: {
      label: "Fenster fokussieren",
      description: "Ein Fenster nach ID, PID oder Titel fokussieren",
      fields: {
        windowId: {
          label: "Fenster-ID",
          description:
            "X11-Fenster-ID (hexadezimal, z.B. 0x1234). Hat Vorrang vor anderen Optionen.",
          placeholder: "0x1234",
        },
        pid: {
          label: "Prozess-ID",
          description: "Fenster fokussieren, das zu dieser Prozess-ID gehört",
          placeholder: "12345",
        },
        title: {
          label: "Fenstertitel",
          description:
            "Fenster fokussieren, dessen Titel diesen Text enthält (Groß-/Kleinschreibung beachten)",
          placeholder: "Firefox",
        },
      },
    },
    response: {
      success: "Fenster erfolgreich fokussiert",
      error: "Fehlermeldung",
      executionId: "Ausführungs-ID zur Verfolgung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte geben Sie mindestens eines an: Fenster-ID, PID oder Titel",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Ein Netzwerkfehler ist beim Fokussieren des Fensters aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Fenster zu fokussieren",
      },
      forbidden: {
        title: "Verboten",
        description: "Das Fokussieren von Fenstern ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Das angegebene Fenster wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Fokussieren des Fensters aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Fokussieren des Fensters aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Fokussieren des Fensters aufgetreten",
      },
      notImplemented: {
        title: "Nicht implementiert",
        description:
          "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
      },
    },
    success: {
      title: "Fenster fokussiert",
      description: "Das Fenster wurde erfolgreich in den Vordergrund gebracht",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      windowManagement: "Fensterverwaltung",
    },
  },
  "move-window-to-monitor": {
    title: "Fenster auf Monitor verschieben",
    titleShort: "Fenster verschieben",
    dynamicTitle: "Verschieben: {{target}}",
    description: "Ein Fenster auf einen bestimmten Monitor verschieben",
    form: {
      label: "Fenster auf Monitor verschieben",
      description:
        "Fenster per ID, PID oder Titel auf einen Zielmonitor verschieben",
      fields: {
        windowId: {
          label: "Fenster-ID",
          description:
            "KWin-interne Fenster-UUID (aus list-windows). Hat Vorrang vor PID und Titel.",
          placeholder: "{uuid}",
        },
        pid: {
          label: "Prozess-ID",
          description: "Fenster dieser Prozess-ID verschieben",
          placeholder: "12345",
        },
        title: {
          label: "Fenstertitel",
          description:
            "Fenster verschieben, dessen Titel diesen Text enthält (Groß-/Kleinschreibung egal)",
          placeholder: "Firefox",
        },
        monitorName: {
          label: "Monitorname",
          description:
            "Name des Zielmonitors (z. B. DP-1, HDMI-A-1). list-monitors zeigt verfügbare Namen.",
          placeholder: "DP-1",
        },
        monitorIndex: {
          label: "Monitor-Index",
          description: "Index des Zielmonitors (ab 0). Monitorname bevorzugen.",
          placeholder: "0",
        },
      },
    },
    response: {
      success: "Ob das Verschieben erfolgreich war",
      movedTo: "Monitor, auf den das Fenster verschoben wurde",
      windowTitle: "Titel des verschobenen Fensters",
      error: "Fehlermeldung bei Misserfolg",
      executionId: "Eindeutige Ausführungs-ID",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte mindestens eine Fensterkennung und ein Monitorziel angeben",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Verschieben des Fensters",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Keine Berechtigung zum Verschieben von Fenstern",
      },
      forbidden: {
        title: "Verboten",
        description: "Fenster verschieben ist nicht erlaubt",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Das angegebene Fenster oder der Monitor wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Verschieben des Fensters",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unbekannter Fehler beim Verschieben des Fensters",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Es gibt nicht gespeicherte Änderungen, die verloren gehen könnten",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt beim Verschieben des Fensters",
      },
    },
    success: {
      title: "Fenster verschoben",
      description:
        "Das Fenster wurde erfolgreich auf den Zielmonitor verschoben",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Desktop-Automatisierung",
      windowManagement: "Fensterverwaltung",
    },
  },

  title: "Desktop-Automatisierungstools",
  description: "Desktop steuern: Screenshots, Maus, Tastatur, Fenster",
  category: "Desktop",
  summary:
    "Plattformübergreifende Desktop-Automatisierung: Linux (ydotool/KWin/pyatspi) und Windows (PowerShell/UIAutomation)",
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
    moveWindowToMonitor: "Fenster auf Monitor verschieben",
  },

  widget: {
    noWindows: "Keine offenen Fenster gefunden",
    windowCount_one: "{{count}} Fenster",
    windowCount_other: "{{count}} Fenster",
    actionFocus: "Fokus",
    actionType: "Tippen",
    actionKey: "Taste",
    actionMove: "Verschieben",
    actionA11y: "A11y",
    actionTypeText: "Text eingeben",
    actionPressKey: "Taste drücken",
    actionScreenshot: "Screenshot",
    actionA11yTree: "A11y-Baum",
    actionAllWindows: "← Alle Fenster",
    actionAllMonitors: "Alle Monitore →",
    actionScreenshotLink: "Screenshot →",
    actionMoveWindowHere: "Fenster hierher",
    labelPrimary: "Primär",
    statusFocused: "Fenster fokussiert",
    statusTyped: "Eingegeben",
    statusPressed: "Gedrückt",
    statusMoved: "Verschoben",
    statusScrolled: "Gescrollt",
    statusMouseMoved: "Maus bewegt",
    statusClickExecuted: "Klick ausgeführt",
    labelSaved: "Gespeichert:",
    labelTruncated: "⚠ Abgeschnitten",
    filterPlaceholder: "Knoten filtern…",
    titleTypeText: "Text eingeben",
    titlePressKey: "Taste drücken",
    titleClick: "Klicken",
    titleScroll: "Scrollen",
    titleMoveMouse: "Maus bewegen",
    titleMoveWindow: "Fenster verschieben",
    titleA11yTree: "Zugänglichkeitsbaum",
    titleListWindows: "Fenster",
    titleListMonitors: "Monitore",
    titleGetFocusedWindow: "Aktives Fenster",
    titleFocusWindow: "Fenster fokussieren",
  },

  repository: {
    platformNotSupported:
      "Plattform nicht unterstützt: {{platform}}. Linux und Windows werden unterstützt.",
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
      "Systempaket fehlt: {{dep}}. Ein Authentifizierungsdialog sollte erschienen sein - bestätigen, um automatisch zu installieren.",
  },
};
