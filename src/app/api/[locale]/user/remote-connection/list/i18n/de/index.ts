import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  get: {
    title: "Fernverbindungen",
    description: "Alle Fernverbindungen für dein Konto auflisten",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein, um Verbindungen zu sehen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung",
      },
      server: {
        title: "Serverfehler",
        description: "Verbindungen konnten nicht aufgelistet werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Verbindungen gefunden",
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
        description: "Ein Konflikt ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
    },
    success: {
      title: "Verbindungen aufgelistet",
      description: "Fernverbindungen abgerufen",
    },
  },
  widget: {
    title: "Fernverbindungen",
    addButton: "Verbindung hinzufügen",
    emptyState: "Noch keine Fernverbindungen.",
    emptyStateCloud:
      "Verknüpfe deine lokale Installation hier, sobald sie läuft. Deine Erinnerungen und Tools synchronisieren sich automatisch.",
    connectedBadge: "Verbunden",
    registeredBadge: "Registriert",
    selfBadge: "Selbst",
    lastSynced: "Zuletzt synchronisiert",
    never: "Nie",
    connectButton: "Lokale Instanz verknüpfen",
    connectButtonLocal: "Mit Cloud verbinden",
    inactiveBadge: "Inaktiv",
    instanceId: "Instanz-ID",
    friendlyName: "Name",
    remoteUrl: "Remote-URL",
    viewButton: "Ansehen",
    editButton: "Umbenennen",
    deleteButton: "Trennen",
    cloud: {
      heroTitle: "Deine KI. Überall.",
      heroSubtitle:
        "unbottled.ai ist dein Cloud-Gehirn. Füge eine lokale Instanz hinzu und deine KI arbeitet auf beiden — Erinnerungen synchronisieren sich, Tools laufen auf deinem Rechner.",
      benefit1: "Erinnerungen synchronisieren sich bidirektional, automatisch",
      benefit2: "Cloud-KI entdeckt und führt deine lokalen Tools aus",
      benefit3: "Delegiere Aufgaben von der Cloud an deinen Rechner",
      feature1Title: "Deine Tools, dein Rechner",
      feature1Body:
        "SSH, lokale Dateien, Code-Ausführung — die Cloud-KI entdeckt und führt deine lokalen Tools automatisch aus. Kein Port-Forwarding. Kein VPN.",
      feature2Title: "Geteiltes Gedächtnis",
      feature2Body:
        "Alles, was du der KI hier sagst, synchronisiert sich mit deiner lokalen Instanz. Kontext reist mit dir.",
      feature3Title: "Kein Lock-in",
      feature3Body:
        "Es ist Open Source. Fork es, hoste es selbst, besitze jede Zeile. Keine Black Box.",
      feature4Title: "Ein Befehl zum Starten",
      feature4Body:
        "Klone das Repo, füge deinen API-Schlüssel hinzu, führe vibe dev aus. Dein persönlicher KI-Stack läuft in unter einer Minute.",
      githubCta: "Auf GitHub ansehen →",
      quickstartCta: "Quickstart-Anleitung",
      alreadyHaveLocal: "Hast du bereits eine lokale Instanz?",
      alreadyHaveLocalSub:
        "Verbinde dich von deinem lokalen Rechner — öffne dort Fernverbindungen und verknüpfe sie mit dieser Cloud-Instanz.",
      connectSectionTitle: "Lokale Instanz verknüpfen",
    },
    local: {
      cloudTitle: "Mit Cloud verbinden",
      cloudSubtitle:
        "Verknüpfe diese lokale Instanz mit unbottled.ai (oder einer anderen Cloud-Instanz). Erinnerungen synchronisieren sich alle 60 Sekunden und Thea kann deine lokalen Tools entdecken und ausführen.",
      benefit1: "Erinnerungen synchronisieren sich bidirektional, automatisch",
      benefit2: "Cloud-KI entdeckt und führt deine lokalen Tools aus",
      benefit3: "Delegiere Aufgaben von der Cloud an diesen Rechner",
      noConnectionsYet: "Noch keine Verbindungen.",
      connectionsTitle: "Verknüpfte Verbindungen",
    },
    syncSettings: {
      title: "Auto-Sync",
      description:
        "Aufgaben und Erinnerungen jede Minute mit allen verbundenen Instanzen synchronisieren",
      enabledBadge: "Aktiv",
      disabledBadge: "Inaktiv",
      toggleLabel: "Auto-Sync umschalten",
    },
  },
};
