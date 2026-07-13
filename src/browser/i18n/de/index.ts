import type { translations as enTranslations } from "../en";

/**
 * Browser API translations (German)
 */

export const translations: typeof enTranslations = {
  click: {
    title: "Element klicken",
    titleShort: "Klicken",
    description:
      "Element per UID aus einem Snapshot anklicken. Zuerst take-snapshot aufrufen.",
    dynamicTitle: "Klick: {{uid}}",

    form: {
      label: "Element klicken",
      description: "Klicken Sie auf ein bestimmtes Element auf der Seite",
      fields: {
        uid: {
          label: "Element-UID",
          description:
            "Die UID eines Elements auf der Seite aus dem Seiteninhalt-Snapshot",
          placeholder: "Element-UID eingeben",
        },
        dblClick: {
          label: "Doppelklick",
          description: "Auf true setzen für Doppelklicks. Standard ist false",
        },
      },
    },

    response: {
      success: "Klickvorgang erfolgreich",
      result: "Ergebnis des Klickvorgangs",
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
          "Ein Netzwerkfehler ist während des Klickvorgangs aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Klickvorgänge durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Klickvorgang ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Das angeforderte Element wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während des Klickvorgangs aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während des Klickvorgangs aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist während des Klickvorgangs aufgetreten",
      },
    },

    success: {
      title: "Klickvorgang erfolgreich",
      description: "Das Element wurde erfolgreich geklickt",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
  },
  "close-page": {
    title: "Seite schließen",
    titleShort: "Schließen",
    description:
      "Aktuelle Sitzungsseite schließen. Die letzte offene Seite kann nicht geschlossen werden.",

    form: {
      label: "Seite schließen",
      description: "Eine Browser-Seite nach ihrem Index schließen",
      fields: {
        pageIdx: {
          label: "Seiten-Index",
          description:
            "Der Index der zu schließenden Seite. Rufen Sie list_pages auf, um Seiten aufzulisten",
          placeholder: "Seiten-Index eingeben (z.B. 0)",
        },
      },
    },

    response: {
      success: "Seite erfolgreich geschlossen",
      result: "Ergebnis der Seiten-Schließung",
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
          "Ein Netzwerkfehler ist beim Schließen der Seite aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Seiten zu schließen",
      },
      forbidden: {
        title: "Verboten",
        description: "Das Schließen der Seite ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Seite wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Schließen der Seite aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Schließen der Seite aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Schließen der Seite aufgetreten",
      },
    },

    success: {
      title: "Seite erfolgreich geschlossen",
      description: "Die Seite wurde erfolgreich geschlossen",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      navigationAutomation: "Navigationsautomatisierung",
    },
  },
  drag: {
    title: "Element ziehen",
    titleShort: "Ziehen",
    description:
      "Element per UID auf ein anderes ziehen. UIDs mit take-snapshot ermitteln.",
    dynamicTitle: "Ziehen: {{from}} \u2192 {{to}}",

    form: {
      label: "Element ziehen",
      description: "Ein Element auf ein anderes Element ziehen",
      fields: {
        from_uid: {
          label: "Quell-Element UID",
          description: "Die UID des zu ziehenden Elements",
          placeholder: "Quell-Element UID eingeben",
        },
        to_uid: {
          label: "Ziel-Element UID",
          description: "Die UID des Zielelements",
          placeholder: "Ziel-Element UID eingeben",
        },
      },
    },

    response: {
      success: "Ziehvorgang erfolgreich",
      result: "Ergebnis des Ziehvorgangs",
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
          "Ein Netzwerkfehler ist während des Ziehvorgangs aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Ziehvorgänge durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Ziehvorgang ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Das angeforderte Element wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während des Ziehvorgangs aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während des Ziehvorgangs aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist während des Ziehvorgangs aufgetreten",
      },
    },

    success: {
      title: "Ziehvorgang erfolgreich",
      description: "Das Element wurde erfolgreich gezogen",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
  },
  fill: {
    title: "Ausfüllen",
    titleShort: "Ausfüllen",
    description:
      "Text in Eingabefeld/Textarea eingeben oder Dropdown-Option per UID auswählen. UIDs mit take-snapshot ermitteln.",
    dynamicTitle: "Füllen: {{uid}}",

    form: {
      label: "Element ausfüllen",
      description: "Text in ein Formularelement eingeben",
      fields: {
        uid: {
          label: "Element-UID",
          description:
            "Die UID eines Elements auf der Seite aus dem Seiteninhalt-Snapshot",
          placeholder: "Element-UID eingeben",
        },
        value: {
          label: "Wert",
          description: "Der einzugebende Wert",
          placeholder: "Auszufüllenden Wert eingeben",
        },
      },
    },

    response: {
      success: "Ausfüllvorgang erfolgreich",
      result: "Ergebnis des Ausfüllvorgangs",
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
          "Ein Netzwerkfehler ist während des Ausfüllvorgangs aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Ausfüllvorgänge durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Ausfüllvorgang ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während des Ausfüllvorgangs aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während des Ausfüllvorgangs aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist während des Ausfüllvorgangs aufgetreten",
      },
    },

    success: {
      title: "Ausfüllvorgang erfolgreich",
      description: "Das Element wurde erfolgreich ausgefüllt",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
  },
  "fill-form": {
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
    title: "Formular ausfüllen",
    titleShort: "Formular",
    description:
      "Mehrere Formularfelder per UID-Array auf einmal ausfüllen. Effizienter als einzelne fill-Aufrufe.",

    form: {
      label: "Formularelemente ausfüllen",
      description: "Mehrere Formularelemente gleichzeitig ausfüllen",
      fields: {
        elements: {
          label: "Formularelemente",
          description: "Array von Elementen aus dem Snapshot zum Ausfüllen",
          placeholder: "Formularelemente eingeben (JSON-Array)",
          uid: {
            label: "Element-UID",
            description: "Die eindeutige Kennung des auszufüllenden Elements",
          },
          value: {
            label: "Wert",
            description: "Der in das Element einzutragende Wert",
          },
        },
      },
    },

    response: {
      success: "Formularausfüllen erfolgreich",
      result: {
        title: "Ergebnis",
        description: "Ergebnis des Formularausfüllens",
        filled: "Alle ausgefüllt",
        filledCount: "Anzahl ausgefüllt",
        elements: {
          uid: "Element-UID",
          filled: "Erfolgreich ausgefüllt",
        },
      },
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
          "Ein Netzwerkfehler ist während des Formularausfüllens aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Formularausfüllvorgänge durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Formularausfüllen ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während des Formularausfüllens aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während des Formularausfüllens aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist während des Formularausfüllens aufgetreten",
      },
    },

    success: {
      title: "Formularausfüllen erfolgreich",
      description: "Alle Formularelemente wurden erfolgreich ausgefüllt",
    },
  },
  "handle-dialog": {
    title: "Dialog behandeln",
    titleShort: "Dialog",
    description:
      "Browser-Dialog annehmen oder abweisen (alert/confirm/prompt). Vor der auslösenden Aktion aufrufen.",
    dynamicTitle: "Dialog: {{action}}",

    form: {
      label: "Browser-Dialog behandeln",
      description: "Browser-Dialog akzeptieren oder ablehnen",
      fields: {
        action: {
          label: "Aktion",
          description: "Ob der Dialog abgelehnt oder akzeptiert werden soll",
          placeholder: "Aktion auswählen",
          options: {
            accept: "Akzeptieren",
            dismiss: "Ablehnen",
          },
        },
        promptText: {
          label: "Eingabetext",
          description: "Optionaler Eingabetext für den Dialog",
          placeholder: "Eingabetext eingeben (optional)",
        },
      },
    },

    response: {
      success: "Dialogbehandlung erfolgreich",
      result: "Ergebnis der Dialogbehandlung",
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
          "Ein Netzwerkfehler ist während der Dialogbehandlung aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Dialogbehandlungen durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Dialogbehandlung ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während der Dialogbehandlung aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während der Dialogbehandlung aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist während der Dialogbehandlung aufgetreten",
      },
    },

    success: {
      title: "Dialogbehandlung erfolgreich",
      description: "Der Browser-Dialog wurde erfolgreich behandelt",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      dialogAutomation: "Dialog-Automatisierung",
    },
  },
  hover: {
    title: "Hover",
    titleShort: "Hovern",
    description:
      "Per UID über ein Element hovern, um Tooltips oder versteckte Steuerelemente einzublenden.",
    dynamicTitle: "Hover: {{uid}}",

    form: {
      label: "Element überschweben",
      description: "Mauszeiger über ein Element bewegen",
      fields: {
        uid: {
          label: "Element-UID",
          description:
            "Die UID eines Elements auf der Seite aus dem Seiteninhalt-Snapshot",
          placeholder: "Element-UID eingeben",
        },
      },
    },

    response: {
      success: "Hover-Vorgang erfolgreich",
      result: "Ergebnis des Hover-Vorgangs",
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
          "Ein Netzwerkfehler ist während des Hover-Vorgangs aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Hover-Vorgänge durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Hover-Vorgang ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während des Hover-Vorgangs aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während des Hover-Vorgangs aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist während des Hover-Vorgangs aufgetreten",
      },
    },

    success: {
      title: "Hover-Vorgang erfolgreich",
      description: "Das Element wurde erfolgreich überflogen",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
  },
  "press-key": {
    title: "Taste drücken",
    titleShort: "Taste",
    dynamicTitle: "Taste: {{key}}",
    description: "Taste oder Tastenkombination drücken",
    form: {
      label: "Taste drücken",
      description: "Taste oder Tastenkombination drücken",
      fields: {
        key: {
          label: "Taste",
          description:
            "Eine Taste oder eine Kombination (z.B. Eingabe, Steuerung+A, Steuerung+Shift+R)",
          placeholder: "Taste oder Kombination eingeben",
        },
      },
    },
    response: {
      success: "Tastendruck erfolgreich",
      result: "Ergebnis des Tastendrucks",
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
          "Ein Netzwerkfehler ist während des Tastendrucks aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Tastendrücke durchzuführen",
      },
      forbidden: { title: "Verboten", description: "Tastendruck ist verboten" },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während des Tastendrucks aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während des Tastendrucks aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist während des Tastendrucks aufgetreten",
      },
    },
    success: {
      title: "Tastendruck erfolgreich",
      description: "Die Taste wurde erfolgreich gedrückt",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
  },
  "upload-file": {
    title: "Datei hochladen",
    titleShort: "Hochladen",
    dynamicTitle: "Upload: {{file}}",
    description: "Datei über ein bereitgestelltes Element hochladen",
    form: {
      label: "Datei hochladen",
      description: "Datei zu einem Dateiauswahl-Element hochladen",
      fields: {
        uid: {
          label: "Element-UID",
          description:
            "Die UID des Dateiauswahl-Elements oder eines Elements, das den Dateiwähler öffnet",
          placeholder: "Element-UID eingeben",
        },
        filePath: {
          label: "Dateipfad",
          description: "Der lokale Pfad der hochzuladenden Datei",
          placeholder: "Dateipfad eingeben",
        },
      },
    },
    response: {
      success: "Datei-Upload erfolgreich",
      result: "Ergebnis des Datei-Uploads",
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
          "Ein Netzwerkfehler ist während des Datei-Uploads aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Datei-Uploads durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Datei-Upload ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während des Datei-Uploads aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während des Datei-Uploads aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist während des Datei-Uploads aufgetreten",
      },
    },
    success: {
      title: "Datei-Upload erfolgreich",
      description: "Die Datei wurde erfolgreich hochgeladen",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      inputAutomation: "Eingabe-Automatisierung",
    },
  },
  "list-pages": {
    title: "Seiten auflisten",
    titleShort: "Seiten",
    description:
      "Alle offenen Browser-Tabs mit URLs auflisten. Jede Sitzung besitzt einen Tab; new-page ersetzt ihn.",
    form: {
      label: "Seiten auflisten",
      description: "Alle geöffneten Browser-Seiten abrufen",
      fields: {},
    },
    response: {
      success: "Seitenauflistung erfolgreich",
      result: {
        title: "Ergebnis",
        description: "Ergebnis der Seitenauflistung",
        pages: {
          idx: "Index",
          title: "Titel",
          url: "URL",
          active: "Aktiv",
        },
        totalCount: "Gesamtanzahl",
      },
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
          "Ein Netzwerkfehler ist beim Auflisten der Seiten aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Seiten aufzulisten",
      },
      forbidden: {
        title: "Verboten",
        description: "Seitenauflistung ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Auflisten der Seiten aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Auflisten der Seiten aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Auflisten der Seiten aufgetreten",
      },
    },
    success: {
      title: "Seiten erfolgreich aufgelistet",
      description: "Die geöffneten Seiten wurden erfolgreich aufgelistet",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      navigationAutomation: "Navigations-Automatisierung",
    },
  },
  "navigate-page": {
    title: "Seite navigieren",
    titleShort: "Navigieren",
    dynamicTitle: "Navigation: {{target}}",
    description:
      "Sitzungsseite zu URL navigieren oder vor/zurück/neu laden. Bevorzugen gegenüber new-page für gleichen Tab.",
    form: {
      label: "Seite navigieren",
      description:
        "Die aktuell ausgewählte Seite zu einer URL oder durch die Historie navigieren",
      fields: {
        type: {
          label: "Navigationstyp",
          description:
            "Navigieren nach URL, zurück oder vorwärts in der Historie, oder neu laden",
          placeholder: "Navigationstyp auswählen",
          options: {
            url: "URL",
            back: "Zurück",
            forward: "Vorwärts",
            reload: "Neu laden",
          },
        },
        url: {
          label: "URL",
          description: "Ziel-URL (nur für type=url)",
          placeholder: "URL eingeben",
        },
        ignoreCache: {
          label: "Cache ignorieren",
          description: "Ob Cache beim Neuladen ignoriert werden soll",
          placeholder: "Cache ignorieren",
        },
        timeout: {
          label: "Zeitlimit",
          description: "Maximale Wartezeit in Millisekunden (0 für Standard)",
          placeholder: "Zeitlimit eingeben",
        },
      },
    },
    response: {
      success: "Navigation erfolgreich",
      result: "Ergebnis der Navigation",
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
          "Ein Netzwerkfehler ist während der Navigation aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Seiten zu navigieren",
      },
      forbidden: {
        title: "Verboten",
        description: "Seitennavigation ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während der Navigation aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während der Navigation aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist während der Navigation aufgetreten",
      },
    },
    success: {
      title: "Navigation erfolgreich",
      description: "Die Seite wurde erfolgreich navigiert",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      navigationAutomation: "Navigations-Automatisierung",
    },
  },
  "new-page": {
    title: "Neue Seite",
    titleShort: "Neue Seite",
    dynamicTitle: "Neue Seite: {{url}}",
    description:
      "Neuen Browser-Tab öffnen. Die Sitzung übernimmt den Tab — alle Folgeaufrufe operieren auf ihm.",
    form: {
      label: "Neue Seite",
      description: "Eine neue Browser-Seite erstellen und eine URL laden",
      fields: {
        url: {
          label: "URL",
          description: "URL, die in der neuen Seite geladen werden soll",
          placeholder: "URL eingeben",
        },
        replacePage: {
          label: "Seite ersetzen",
          description: "Vorhandene Seiten vor dem Öffnen der neuen schließen",
        },
        background: {
          label: "Hintergrund",
          description: "Seite öffnen ohne sie in den Vordergrund zu bringen",
        },
        timeout: {
          label: "Zeitlimit",
          description: "Maximale Wartezeit in Millisekunden (0 für Standard)",
          placeholder: "Zeitlimit eingeben",
        },
      },
    },
    response: {
      success: "Neue Seite erfolgreich erstellt",
      result: "Ergebnis der Seitenerstellung",
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
          "Ein Netzwerkfehler ist beim Erstellen der neuen Seite aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, neue Seiten zu erstellen",
      },
      forbidden: {
        title: "Verboten",
        description: "Seitenerstellung ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Erstellen der neuen Seite aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Erstellen der neuen Seite aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Erstellen der neuen Seite aufgetreten",
      },
    },
    success: {
      title: "Neue Seite erfolgreich erstellt",
      description: "Die neue Seite wurde erfolgreich erstellt",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      navigationAutomation: "Navigations-Automatisierung",
    },
  },
  "select-page": {
    title: "Seite auswählen",
    titleShort: "Auswählen",
    dynamicTitle: "Auswaehlen: {{page}}",
    description:
      "Sitzung per Index auf eine bestimmte Seite umschalten. Index mit list-pages ermitteln. Aktualisiert den Tab der Sitzung nicht.",
    form: {
      label: "Seite auswählen",
      description: "Eine Seite nach ihrem Index auswählen",
      fields: {
        pageIdx: {
          label: "Seitenindex",
          description:
            "Der Index der auszuwählenden Seite (list_pages aufrufen um Seiten aufzulisten)",
          placeholder: "Seitenindex eingeben",
        },
      },
    },
    response: {
      success: "Seitenauswahl erfolgreich",
      result: "Ergebnis der Seitenauswahl",
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
          "Ein Netzwerkfehler ist beim Auswählen der Seite aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Seiten auszuwählen",
      },
      forbidden: {
        title: "Verboten",
        description: "Seitenauswahl ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Auswählen der Seite aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Auswählen der Seite aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Auswählen der Seite aufgetreten",
      },
    },
    success: {
      title: "Seite erfolgreich ausgewählt",
      description: "Die Seite wurde erfolgreich ausgewählt",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      navigationAutomation: "Navigations-Automatisierung",
    },
  },
  emulate: {
    title: "Emulieren",
    titleShort: "Emulieren",
    description:
      "Netzwerkbedingungen (offline/3G/4G) oder CPU-Drosselung auf der aktuellen Seite emulieren.",
    dynamicTitle: "Emulieren: {{config}}",
    form: {
      label: "Gerät emulieren",
      description: "Netzwerkbedingungen und CPU-Drosselung emulieren",
      fields: {
        networkConditions: {
          label: "Netzwerkbedingungen",
          description:
            "Netzwerk drosseln (auf Keine Emulation setzen zum Deaktivieren)",
          placeholder: "Netzwerkbedingung auswählen",
          options: {
            noEmulation: "Keine Emulation",
            offline: "Offline",
            slow3g: "Langsames 3G",
            fast3g: "Schnelles 3G",
            slow4g: "Langsames 4G",
            fast4g: "Schnelles 4G",
          },
        },
        cpuThrottlingRate: {
          label: "CPU-Drosselungsrate",
          description: "CPU-Verlangsamungsfaktor (1 zum Deaktivieren, 1-20)",
          placeholder: "Drosselungsrate eingeben",
        },
      },
    },
    response: {
      success: "Emulation erfolgreich",
      result: "Ergebnis der Emulation",
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
        description: "Ein Netzwerkfehler ist während der Emulation aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Gerätefunktionen zu emulieren",
      },
      forbidden: {
        title: "Verboten",
        description: "Geräteemulation ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während der Emulation aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während der Emulation aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist während der Emulation aufgetreten",
      },
    },
    success: {
      title: "Emulation erfolgreich",
      description: "Gerätefunktionen wurden erfolgreich emuliert",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      performanceAutomation: "Leistungs-Automatisierung",
    },
  },
  "resize-page": {
    title: "Seite skalieren",
    titleShort: "Größe",
    dynamicTitle: "Groesse: {{width}}x{{height}}",
    description: "Browser-Viewport auf bestimmte Pixelmaße skalieren.",
    form: {
      label: "Seite skalieren",
      description: "Seite auf angegebene Abmessungen skalieren",
      fields: {
        width: {
          label: "Breite",
          description: "Seitenbreite in Pixeln",
          placeholder: "Breite eingeben",
        },
        height: {
          label: "Höhe",
          description: "Seitenhöhe in Pixeln",
          placeholder: "Höhe eingeben",
        },
      },
    },
    response: {
      success: "Seitenskalierung erfolgreich",
      result: "Ergebnis der Seitenskalierung",
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
          "Ein Netzwerkfehler ist beim Skalieren der Seite aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Seiten zu skalieren",
      },
      forbidden: {
        title: "Verboten",
        description: "Seitenskalierung ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Skalieren der Seite aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Skalieren der Seite aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Skalieren der Seite aufgetreten",
      },
    },
    success: {
      title: "Seite erfolgreich skaliert",
      description: "Die Seite wurde erfolgreich skaliert",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      viewportAutomation: "Viewport-Automatisierung",
    },
  },
  "evaluate-script": {
    title: "Skript auswerten",
    titleShort: "Skript",
    description:
      "JavaScript in der Seite ausführen und Ergebnis zurückgeben. Für Zustand, den take-snapshot nicht liefert.",
    dynamicTitle: "Skript: {{snippet}}",
    form: {
      label: "Skript auswerten",
      description: "JavaScript in der Browser-Seite ausführen",
      fields: {
        function: {
          label: "Funktion",
          description: "JavaScript-Funktionsdeklaration zum Ausführen",
          placeholder: "() => { return document.title; }",
        },
        args: {
          label: "Argumente",
          description:
            "Optionale Liste von Argumenten (Element-UIDs) zur Übergabe an die Funktion",
          placeholder: '[{"uid": "element-uid"}]',
          uid: {
            label: "Element-UID",
            description: "Die eindeutige Kennung eines Elements auf der Seite",
          },
        },
      },
    },
    response: {
      success: "Skript-Auswertung erfolgreich",
      result: {
        title: "Ergebnis",
        description: "Ergebnis der Skript-Auswertung",
        executed: "Ausgeführt",
        result: "Rückgabewert",
      },
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
          "Ein Netzwerkfehler ist während der Skript-Auswertung aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Skripte auszuwerten",
      },
      forbidden: {
        title: "Verboten",
        description: "Skript-Auswertung ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während der Skript-Auswertung aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während der Skript-Auswertung aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist während der Skript-Auswertung aufgetreten",
      },
    },
    success: {
      title: "Skript erfolgreich ausgewertet",
      description: "Das JavaScript wurde erfolgreich ausgeführt",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      scriptExecution: "Skriptausführung",
    },
  },
  "get-console-message": {
    title: "Konsolen-Nachricht abrufen",
    titleShort: "Konsole",
    description:
      "Vollständigen Inhalt einer Konsolen-Nachricht per msgid aus list-console-messages abrufen.",
    dynamicTitle: "Konsole #{{id}}",
    form: {
      label: "Konsolen-Nachricht abrufen",
      description: "Eine bestimmte Konsolen-Nachricht abrufen",
      fields: {
        msgid: {
          label: "Nachrichten-ID",
          description:
            "Die msgid einer Konsolen-Nachricht aus den aufgelisteten Konsolen-Nachrichten",
          placeholder: "Nachrichten-ID eingeben",
        },
      },
    },
    response: {
      success: "Konsolen-Nachricht erfolgreich abgerufen",
      result: "Ergebnis des Abrufs der Konsolen-Nachricht",
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
          "Ein Netzwerkfehler ist beim Abrufen der Konsolen-Nachricht aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Konsolen-Nachrichten abzurufen",
      },
      forbidden: {
        title: "Verboten",
        description: "Abrufen von Konsolen-Nachrichten ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Abrufen der Konsolen-Nachricht aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Abrufen der Konsolen-Nachricht aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Abrufen der Konsolen-Nachricht aufgetreten",
      },
    },
    success: {
      title: "Konsolen-Nachricht erfolgreich abgerufen",
      description: "Die Konsolen-Nachricht wurde erfolgreich abgerufen",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      debugging: "Debugging",
    },
  },
  "list-console-messages": {
    title: "Konsolen-Nachrichten auflisten",
    titleShort: "Konsolenlog",
    description:
      "Konsolen-Nachrichten seit letzter Navigation auflisten. Nach Typ filtern (error/warn/log). Nach Aktionen auf JS-Fehler prüfen.",
    form: {
      label: "Konsolen-Nachrichten auflisten",
      description: "Alle Konsolen-Nachrichten von der Browser-Seite abrufen",
      fields: {
        includePreservedMessages: {
          label: "Bewahrte Nachrichten einbeziehen",
          description:
            "Auf true setzen, um die bewahrten Nachrichten der letzten 3 Navigationen zurückzugeben",
          placeholder: "false",
        },
        pageIdx: {
          label: "Seitenindex",
          description:
            "Seitennummer zum Zurückgeben (0-basiert, weglassen für erste Seite)",
          placeholder: "Seitenindex eingeben",
        },
        pageSize: {
          label: "Seitengröße",
          description:
            "Maximale Anzahl der zurückzugebenden Nachrichten (weglassen für alle Nachrichten)",
          placeholder: "Seitengröße eingeben",
        },
        types: {
          label: "Nachrichtentypen",
          description:
            "Nachrichten filtern, um nur Nachrichten der angegebenen Typen zurückzugeben (weglassen für alle)",
          placeholder: "Nachrichtentypen auswählen",
          options: {
            log: "Log",
            debug: "Debug",
            info: "Info",
            error: "Fehler",
            warn: "Warnung",
            dir: "Dir",
            dirxml: "Dirxml",
            table: "Tabelle",
            trace: "Trace",
            clear: "Löschen",
            startGroup: "Gruppe starten",
            startGroupCollapsed: "Gruppe zugeklappt starten",
            endGroup: "Gruppe beenden",
            assert: "Assert",
            profile: "Profil",
            profileEnd: "Profil Ende",
            count: "Zähler",
            timeEnd: "Zeit Ende",
            verbose: "Ausführlich",
            issue: "Problem",
          },
        },
      },
    },
    response: {
      success: "Konsolen-Nachrichten erfolgreich abgerufen",
      result: {
        title: "Ergebnis",
        description: "Ergebnis der Konsolen-Nachrichten-Liste",
        messages: {
          msgid: "Nachrichten-ID",
          type: "Typ",
          text: "Nachricht",
          timestamp: "Zeitstempel",
        },
        totalCount: "Gesamtanzahl",
      },
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
          "Ein Netzwerkfehler ist beim Auflisten der Konsolen-Nachrichten aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Konsolen-Nachrichten aufzulisten",
      },
      forbidden: {
        title: "Verboten",
        description: "Auflisten von Konsolen-Nachrichten ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Auflisten der Konsolen-Nachrichten aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Auflisten der Konsolen-Nachrichten aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Auflisten der Konsolen-Nachrichten aufgetreten",
      },
    },
    success: {
      title: "Konsolen-Nachrichten erfolgreich abgerufen",
      description: "Die Konsolen-Nachrichten wurden erfolgreich abgerufen",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      debugging: "Debugging",
    },
  },
  "get-network-request": {
    title: "Netzwerk-Anfrage abrufen",
    titleShort: "Anfrage",
    description:
      "Vollständige Details (Header, Body) einer Anfrage per reqid aus list-network-requests abrufen.",
    dynamicTitle: "Netzwerk #{{id}}",
    form: {
      label: "Netzwerk-Anfrage abrufen",
      description:
        "Eine bestimmte Netzwerk-Anfrage oder die aktuell ausgewählte abrufen",
      fields: {
        reqid: {
          label: "Anfrage-ID",
          description:
            "Die reqid der Netzwerk-Anfrage (weglassen für aktuell ausgewählte Anfrage in DevTools)",
          placeholder: "Anfrage-ID eingeben",
        },
        maxBodyLength: {
          label: "Maximale Body-Länge",
          description:
            "Maximale Zeichen für inline Request/Response-Bodies. Überschreitungen werden mit einem Hinweis abgeschnitten.",
          placeholder: "z.B. 10000",
        },
      },
    },
    response: {
      success: "Netzwerk-Anfrage erfolgreich abgerufen",
      result: "Ergebnis des Abrufs der Netzwerk-Anfrage",
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
          "Ein Netzwerkfehler ist beim Abrufen der Netzwerk-Anfrage aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Netzwerk-Anfragen abzurufen",
      },
      forbidden: {
        title: "Verboten",
        description: "Abrufen von Netzwerk-Anfragen ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Abrufen der Netzwerk-Anfrage aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Abrufen der Netzwerk-Anfrage aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Abrufen der Netzwerk-Anfrage aufgetreten",
      },
    },
    success: {
      title: "Netzwerk-Anfrage erfolgreich abgerufen",
      description: "Die Netzwerk-Anfrage wurde erfolgreich abgerufen",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      networkAnalysis: "Netzwerkanalyse",
    },
  },
  "list-network-requests": {
    title: "Netzwerk-Anfragen auflisten",
    titleShort: "Netzwerklog",
    description:
      "Netzwerk-Anfragen seit letzter Navigation auflisten. Nach Ressourcentyp filtern (fetch/xhr/doc). Für API-Inspektion.",
    form: {
      label: "Netzwerk-Anfragen auflisten",
      description: "Alle Netzwerk-Anfragen von der Browser-Seite abrufen",
      fields: {
        includePreservedRequests: {
          label: "Bewahrte Anfragen einbeziehen",
          description:
            "Auf true setzen, um die bewahrten Anfragen der letzten 3 Navigationen zurückzugeben",
          placeholder: "false",
        },
        pageIdx: {
          label: "Seitenindex",
          description:
            "Seitennummer zum Zurückgeben (0-basiert, weglassen für erste Seite)",
          placeholder: "Seitenindex eingeben",
        },
        pageSize: {
          label: "Seitengröße",
          description:
            "Maximale Anzahl der zurückzugebenden Anfragen (weglassen für alle Anfragen)",
          placeholder: "Seitengröße eingeben",
        },
        resourceTypes: {
          label: "Ressourcentypen",
          description:
            "Anfragen filtern, um nur Anfragen der angegebenen Ressourcentypen zurückzugeben (weglassen für alle)",
          placeholder: "Ressourcentypen auswählen",
          options: {
            document: "Dokument",
            stylesheet: "Stylesheet",
            image: "Bild",
            media: "Medien",
            font: "Schriftart",
            script: "Skript",
            texttrack: "Text-Track",
            xhr: "XHR",
            fetch: "Fetch",
            prefetch: "Prefetch",
            eventsource: "Event Source",
            websocket: "WebSocket",
            manifest: "Manifest",
            signedexchange: "Signed Exchange",
            ping: "Ping",
            cspviolationreport: "CSP-Verletzungsbericht",
            preflight: "Preflight",
            fedcm: "FedCM",
            other: "Andere",
          },
        },
      },
    },
    response: {
      success: "Netzwerk-Anfragen erfolgreich abgerufen",
      result: {
        title: "Ergebnis",
        description: "Ergebnis der Netzwerk-Anfragen-Liste",
        requests: {
          reqid: "Anfrage-ID",
          url: "URL",
          method: "Methode",
          status: "Status",
          type: "Typ",
        },
        totalCount: "Gesamtanzahl",
      },
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
          "Ein Netzwerkfehler ist beim Auflisten der Netzwerk-Anfragen aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Netzwerk-Anfragen aufzulisten",
      },
      forbidden: {
        title: "Verboten",
        description: "Auflisten von Netzwerk-Anfragen ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Auflisten der Netzwerk-Anfragen aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Auflisten der Netzwerk-Anfragen aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Auflisten der Netzwerk-Anfragen aufgetreten",
      },
    },
    success: {
      title: "Netzwerk-Anfragen erfolgreich abgerufen",
      description: "Die Netzwerk-Anfragen wurden erfolgreich abgerufen",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      networkAnalysis: "Netzwerkanalyse",
    },
  },
  "performance-analyze-insight": {
    title: "Leistungs-Insight analysieren",
    titleShort: "Einblick",
    description:
      "Einzelnen Insight aus einem Trace-Ergebnis vertiefen (z. B. DocumentLatency, LCPBreakdown). Nach performance-stop-trace aufrufen.",
    form: {
      label: "Leistungs-Insight analysieren",
      description:
        "Detaillierte Informationen über einen spezifischen Leistungs-Insight abrufen",
      fields: {
        insightSetId: {
          label: "Insight-Set-ID",
          description:
            "Die ID für das spezifische Insight-Set (nur IDs aus der Liste Verfügbare Insight-Sets verwenden)",
          placeholder: "Insight-Set-ID eingeben",
        },
        insightName: {
          label: "Insight-Name",
          description:
            "Der Name des Insights, über den Sie mehr Informationen wünschen (z.B. DocumentLatency oder LCPBreakdown)",
          placeholder: "Insight-Namen eingeben",
        },
      },
    },
    response: {
      success: "Leistungs-Insight erfolgreich analysiert",
      result: "Ergebnis der Leistungs-Insight-Analyse",
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
          "Ein Netzwerkfehler ist bei der Analyse des Leistungs-Insights aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, Leistungs-Insights zu analysieren",
      },
      forbidden: {
        title: "Verboten",
        description: "Analysieren von Leistungs-Insights ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist bei der Analyse des Leistungs-Insights aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist bei der Analyse des Leistungs-Insights aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist bei der Analyse des Leistungs-Insights aufgetreten",
      },
    },
    success: {
      title: "Leistungs-Insight erfolgreich analysiert",
      description: "Der Leistungs-Insight wurde erfolgreich analysiert",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      performanceAutomation: "Leistungs-Automatisierung",
    },
  },
  "performance-start-trace": {
    title: "Leistungs-Trace starten",
    titleShort: "Trace starten",
    description:
      "Performance-Trace starten, um Core Web Vitals und Lademetriken zu erfassen. Danach performance-stop-trace aufrufen.",
    form: {
      label: "Leistungs-Trace starten",
      description:
        "Beginne mit der Aufzeichnung von Leistungsmetriken für die Browser-Seite",
      fields: {
        reload: {
          label: "Seite neu laden",
          description:
            "Bestimmt, ob die Seite automatisch neu geladen werden soll, sobald die Aufzeichnung gestartet wurde",
          placeholder: "true",
        },
        autoStop: {
          label: "Automatisch stoppen",
          description:
            "Bestimmt, ob die Trace-Aufzeichnung automatisch gestoppt werden soll",
          placeholder: "true",
        },
      },
    },
    response: {
      success: "Leistungs-Trace erfolgreich gestartet",
      result: "Ergebnis des Leistungs-Trace-Starts",
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
          "Ein Netzwerkfehler ist beim Starten des Leistungs-Traces aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Leistungs-Traces zu starten",
      },
      forbidden: {
        title: "Verboten",
        description: "Starten von Leistungs-Traces ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Starten des Leistungs-Traces aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Starten des Leistungs-Traces aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Starten des Leistungs-Traces aufgetreten",
      },
    },
    success: {
      title: "Leistungs-Trace erfolgreich gestartet",
      description: "Der Leistungs-Trace wurde erfolgreich gestartet",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      performanceAutomation: "Leistungs-Automatisierung",
    },
  },
  "performance-stop-trace": {
    title: "Leistungs-Trace stoppen",
    titleShort: "Trace stoppen",
    description:
      "Aktiven Trace beenden und Leistungsmetriken mit Insight-Set-IDs für performance-analyze-insight zurückgeben.",
    form: {
      label: "Leistungs-Trace stoppen",
      description: "Stoppe die aktive Leistungs-Trace-Aufzeichnung",
      fields: {},
    },
    response: {
      success: "Leistungs-Trace erfolgreich gestoppt",
      result: "Ergebnis des Leistungs-Trace-Stopps mit Metriken",
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
          "Ein Netzwerkfehler ist beim Stoppen des Leistungs-Traces aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Leistungs-Traces zu stoppen",
      },
      forbidden: {
        title: "Verboten",
        description: "Stoppen von Leistungs-Traces ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Stoppen des Leistungs-Traces aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Stoppen des Leistungs-Traces aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Stoppen des Leistungs-Traces aufgetreten",
      },
    },
    success: {
      title: "Leistungs-Trace erfolgreich gestoppt",
      description: "Der Leistungs-Trace wurde erfolgreich gestoppt",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      performanceAutomation: "Leistungs-Automatisierung",
    },
  },
  "take-screenshot": {
    title: "Screenshot aufnehmen",
    titleShort: "Screenshot",
    dynamicTitle: "Screenshot: {{target}}",
    description:
      "Visuellen Screenshot der Seite oder eines Elements aufnehmen. Gibt Bild zurück. Für UI-Verifikation.",
    form: {
      label: "Screenshot aufnehmen",
      description:
        "Einen Screenshot der Browser-Seite oder eines Elements aufnehmen",
      fields: {
        uid: {
          label: "Element-UID",
          description:
            "Die UID eines Elements für den Screenshot (weglassen für Screenshot der gesamten Seite)",
          placeholder: "Element-UID eingeben",
        },
        fullPage: {
          label: "Ganze Seite",
          description:
            "Wenn auf true gesetzt, wird ein Screenshot der gesamten Seite anstelle des aktuell sichtbaren Viewports aufgenommen (inkompatibel mit uid)",
          placeholder: "false",
        },
        format: {
          label: "Format",
          description:
            "Formattyp zum Speichern des Screenshots (Standard: png)",
          placeholder: "png",
          options: {
            png: "PNG",
            jpeg: "JPEG",
            webp: "WebP",
          },
        },
        quality: {
          label: "Qualität",
          description:
            "Kompressionsqualität für JPEG- und WebP-Formate (0-100). Höhere Werte bedeuten bessere Qualität, aber größere Dateigrößen. Wird für PNG-Format ignoriert.",
          placeholder: "80",
        },
        filePath: {
          label: "Dateipfad",
          description:
            "Der absolute Pfad oder ein Pfad relativ zum aktuellen Arbeitsverzeichnis, um den Screenshot zu speichern, anstatt ihn an die Antwort anzuhängen",
          placeholder: "/pfad/zum/screenshot.png",
        },
      },
    },
    response: {
      success: "Screenshot erfolgreich aufgenommen",
      result: "Ergebnis der Screenshot-Aufnahme",
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
        description: "Sie sind nicht berechtigt, Screenshots aufzunehmen",
      },
      forbidden: {
        title: "Verboten",
        description: "Aufnehmen von Screenshots ist verboten",
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
    },
    success: {
      title: "Screenshot erfolgreich aufgenommen",
      description: "Der Screenshot wurde erfolgreich aufgenommen",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      captureAutomation: "Erfassungs-Automatisierung",
    },
  },
  "take-snapshot": {
    title: "Snapshot aufnehmen",
    titleShort: "Snapshot",
    description:
      "A11y-Baum der Seite als Text ausgeben. Pflicht vor click/fill/drag — liefert Element-UIDs.",
    form: {
      label: "Snapshot aufnehmen",
      description:
        "Einen Text-Snapshot der Browser-Seite basierend auf dem a11y-Baum aufnehmen",
      fields: {
        verbose: {
          label: "Ausführlich",
          description:
            "Ob alle verfügbaren Informationen im vollständigen a11y-Baum enthalten sein sollen (Standard: false)",
          placeholder: "false",
        },
        filePath: {
          label: "Dateipfad",
          description:
            "Der absolute Pfad oder ein Pfad relativ zum aktuellen Arbeitsverzeichnis, um den Snapshot zu speichern, anstatt ihn an die Antwort anzuhängen",
          placeholder: "/pfad/zum/snapshot.txt",
        },
      },
    },
    response: {
      success: "Snapshot erfolgreich aufgenommen",
      result: "Ergebnis der Snapshot-Aufnahme",
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
          "Ein Netzwerkfehler ist beim Aufnehmen des Snapshots aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Snapshots aufzunehmen",
      },
      forbidden: {
        title: "Verboten",
        description: "Aufnehmen von Snapshots ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist beim Aufnehmen des Snapshots aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Aufnehmen des Snapshots aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Aufnehmen des Snapshots aufgetreten",
      },
    },
    success: {
      title: "Snapshot erfolgreich aufgenommen",
      description: "Der Snapshot wurde erfolgreich aufgenommen",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      captureAutomation: "Erfassungs-Automatisierung",
    },
  },
  "wait-for": {
    title: "Warten auf",
    titleShort: "Warten",
    dynamicTitle: "Warten: {{text}}",
    description:
      "Warten, bis bestimmter Text auf der Seite erscheint. Nach Navigation oder asynchronen Aktionen einsetzen.",

    form: {
      label: "Auf Text warten",
      description: "Warten, bis ein bestimmter Text auf der Seite erscheint",
      fields: {
        text: {
          label: "Text",
          description: "Text, der auf der Seite erscheinen soll",
          placeholder: "Text eingeben, auf den gewartet werden soll",
        },
        timeout: {
          label: "Timeout",
          description:
            "Maximale Wartezeit in Millisekunden. Bei 0 wird der Standard-Timeout verwendet",
          placeholder: "Timeout eingeben (ms)",
        },
        captureSnapshot: {
          label: "Snapshot aufnehmen",
          description:
            "Wenn aktiviert, wird der vollständige Barrierefreiheits-Snapshot in der Antwort eingeschlossen. Standardmäßig deaktiviert.",
        },
      },
    },

    response: {
      success: "Wartevorgang erfolgreich",
      result: "Ergebnis des Wartevorgangs",
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
          "Ein Netzwerkfehler ist während des Wartevorgangs aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, Wartevorgänge durchzuführen",
      },
      forbidden: {
        title: "Verboten",
        description: "Wartevorgang ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description:
          "Ein interner Serverfehler ist während des Wartevorgangs aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während des Wartevorgangs aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist während des Wartevorgangs aufgetreten",
      },
    },

    success: {
      title: "Wartevorgang erfolgreich",
      description: "Der angegebene Text ist auf der Seite erschienen",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Browser-Automatisierung",
      waitAutomation: "Warte-Automatisierung",
    },
  },
  title: "Chrome DevTools MCP Tools",
  description:
    "Browser-Automatisierung via Chrome DevTools. Ablauf: new-page → take-snapshot → interagieren (click/fill) → verifizieren.",
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

  shared: {
    instanceId: {
      label: "Sitzungs-ID",
      description:
        "Browser-Sitzungs-ID. Jede eindeutige ID erhält einen eigenen isolierten Tab. Leer lassen für die Standard-Sitzung.",
      placeholder: "z.B. meine-sitzung-1",
    },
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
      closePage: {
        noSession: "Keine aktive Sitzung — nichts zu schließen",
        switchedToPage: "Seite geschlossen, zu Seite {{pageId}} gewechselt",
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
