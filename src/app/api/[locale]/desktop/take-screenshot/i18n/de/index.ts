import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Desktop-Screenshot aufnehmen",
  description:
    "Einen Screenshot des Desktops oder eines Bildschirmbereichs aufnehmen",
  form: {
    label: "Desktop-Screenshot aufnehmen",
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
          "Bild auf diese Breite skalieren, wenn es breiter ist. Nützlich für KI — 4-Monitor-Aufnahmen sind riesig.",
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
      description: "Sie sind nicht berechtigt, Desktop-Screenshots aufzunehmen",
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
};
