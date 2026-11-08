import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Ordner",
  },
  get: {
    title: "Projekt-Einstellungen",
    titleShort: "Projekt",
    description: "Anweisungen und Wissensdateien eines Ordner-Projekts",
    id: { label: "Ordner-ID", description: "Der zu lesende Ordner" },
    response: {
      folderName: "Ordner",
      instructions: "Anweisungen",
      canManage: "Darf verwalten",
      knowledgePath: "Wissenspfad",
      files: {
        id: "ID",
        name: "Name",
        path: "Pfad",
        size: "Größe",
        updatedAt: "Aktualisiert",
      },
    },
    heading: "Projekt",
    subheading:
      "Anweisungen gelten für jeden Chat in diesem Ordner und seinen Unterordnern. Wissensdateien stehen der KI zur Verfügung.",
    instructionsTitle: "Anweisungen",
    noInstructions:
      "Noch keine Anweisungen. Sag der KI, wie sie sich in diesem Ordner verhalten soll.",
    editInstructions: "Anweisungen bearbeiten",
    addInstructions: "Anweisungen hinzufügen",
    knowledgeTitle: "Wissensdateien",
    noFiles:
      "Noch keine Wissensdateien. Füge Notizen, Briefings oder Dokumente hinzu, die die KI kennen soll.",
    addFile: "Datei hinzufügen",
    removeFile: "Entfernen",
    bytes: "Zeichen",
    noData: "Projekt wird geladen...",
    noAccess: "Nur Ordner-Bearbeiter können Projekt-Einstellungen ändern.",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Daten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Du musst angemeldet sein",
      },
      forbidden: {
        title: "Verboten",
        description: "Du darfst dieses Projekt nicht bearbeiten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ordner oder Datei nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen. Versuch es nochmal.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Das Projekt wurde anderswo geändert",
      },
      notSupported: {
        title: "Nicht unterstützt",
        description: "Projekte gibt es nur in privaten und geteilten Ordnern",
      },
    },
    success: {
      title: "Gespeichert",
      description: "Erledigt",
    },
  },
  patch: {
    title: "Projekt-Anweisungen bearbeiten",
    titleShort: "Anweisungen",
    description: "Lege fest, was die KI in jedem Chat dieses Ordners befolgt",
    container: {
      title: "Projekt-Anweisungen",
      description:
        "Gelten für jeden Chat in diesem Ordner und seinen Unterordnern",
    },
    id: { label: "Ordner-ID", description: "Der zu aktualisierende Ordner" },
    instructions: {
      label: "Anweisungen",
      description:
        "Wie die KI sich verhalten soll, was sie wissen soll, Ton, Format. Leer löscht sie.",
      placeholder:
        "z. B. Du bist mein Launch-Texter. Knapp und kraftvoll. Antworte immer in Stichpunkten.",
    },
    response: { folderId: "Ordner", hasInstructions: "Anweisungen aktiv" },
    backButton: { label: "Zurück" },
    submitButton: {
      label: "Anweisungen speichern",
      loadingText: "Speichert...",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Daten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Du musst angemeldet sein",
      },
      forbidden: {
        title: "Verboten",
        description: "Du darfst dieses Projekt nicht bearbeiten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ordner oder Datei nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen. Versuch es nochmal.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Das Projekt wurde anderswo geändert",
      },
      notSupported: {
        title: "Nicht unterstützt",
        description: "Projekte gibt es nur in privaten und geteilten Ordnern",
      },
    },
    success: {
      title: "Gespeichert",
      description: "Erledigt",
    },
  },
};
