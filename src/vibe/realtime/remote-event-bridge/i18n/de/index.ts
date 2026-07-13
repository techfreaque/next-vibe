import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  tags: {
    remoteSync: "Remote-Synchronisation",
  },
  remoteEventBridge: {
    post: {
      title: "Remote-Ereignisbrücke",
      titleShort: "Ereignisbrücke",
      description:
        "Empfängt und leitet Remote-Peer-Ereignisse weiter. Wird von Direct-HTTP-Peers per HTTP oder über Reverse-WS aufgerufen.",
      eventName: {
        label: "Ereignisname",
        description: "Der Wire-Ereignistyp zur Verarbeitung",
      },
      leadId: {
        label: "Lead-ID",
        description: "Instanzübergreifende Identität des sendenden Peers",
      },
      originInstanceId: {
        label: "Ursprungsinstanz",
        description:
          "Instanz, die dieses Ereignis ausgelöst hat (Echo-Prävention)",
      },
      payload: {
        label: "Nutzlast",
        description: "Rohe Ereignisnutzlast der Remote-Instanz",
      },
      received: {
        label: "Empfangen",
        description: "Ob das Ereignis akzeptiert und verarbeitet wurde",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Ereignisnutzlast",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        internal: {
          title: "Verarbeitungsfehler",
          description: "Fehler bei der Ereignisverarbeitung",
        },
        forbidden: {
          title: "Verboten",
          description: "Keine Berechtigung zum Einreichen von Ereignissen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ziel nicht gefunden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ereignisbrücken-Endpunkt nicht erreichbar",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ereigniskonflikt erkannt",
        },
      },
      success: {
        title: "Ereignis empfangen",
        description: "Remote-Ereignis erfolgreich verarbeitet",
      },
    },
  },
};
