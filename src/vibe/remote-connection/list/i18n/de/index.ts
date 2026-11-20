import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  get: {
    title: "Fernverbindungen",
    titleShort: "Verbindungen",
    description: "Alle Fernverbindungen für dein Konto auflisten",
    fields: {
      activeOnly: {
        label: "Nur aktive",
        description: "Nur aktive Verbindungen zurückgeben",
      },
    },
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
    loading: "Verbindungen werden geladen …",
    refresh: "Verbindungen aktualisieren",
    back: "Zurück",
    socketSince: "WebSocket offen seit",
    transportLabel: "Transport",
    viewConnection: "Verbindung {{instance}} öffnen",
    pickConnection: "Auswählen",
    title: "Fernverbindungen",
    addButton: "Verbindung hinzufügen",
    emptyState:
      "Keine Instanz ist verknüpft. Verknüpfe eine Instanz, um ausgewählte Daten und Werkzeuge zu teilen.",
    emptyStateCloud: "Noch keine Instanz verknüpft.",
    connectedBadge: "Verbunden",
    registeredBadge: "Registriert",
    selfBadge: "Selbst",
    lastSynced: "Letzter Synchronisierungsaustausch",
    never: "Nie",
    connectButton: "Lokale Instanz verknüpfen",
    connectButtonLocal: "Mit Cloud verbinden",
    incomingBadge: "Eingehend",
    inactiveBadge: "Inaktiv",
    inferenceProviderBadge: "Inferenz",
    transportBadge: "raus {{out}} · rein {{in}}",
    transport: {
      unknown: "Unbekannt",
      reverseWs: "WS",
      directHttp: "HTTP",
    },
    health: {
      socketOpen: "WebSocket offen",
      noSyncRecorded: "Keine Synchronisierung erfasst",
      syncRecorded: "Synchronisierung erfasst",
      tunnelOpen: "Tunnel offen",
      bridgeActive: "Verbunden",
      tunnelWarning: "Tunnel verbindet",
      bridgeWarning: "Synchronisiert",
      tunnelLost: "Tunnel unterbrochen",
      bridgeFailed: "Verbindung fehlgeschlagen",
      disconnected: "Getrennt",
      reauthRequired: "Anmeldung erforderlich",
      incomingActive: "Aktiv",
    },
    reconnectButton: {
      reauth: "Erneut anmelden",
      reconnect: "Neu verbinden",
      retry: "Wiederholen",
      resync: "Neu synchronisieren",
    },
    instanceId: "Instanz-ID",
    remoteUrl: "Remote-URL",
    viewButton: "Ansehen",
    editButton: "Bearbeiten",
    deleteButton: "Trennen",
    cloud: {
      heroTitle: "Deine eigene Instanz",
      heroSubtitle:
        "Betreibe next-vibe auf eigener Hardware und verknüpfe es mit diesem Konto. Chats, Erinnerungen und Skills ziehen mit. Deine Tools laufen auf deinem Rechner.",
      stepsTitle: "In drei Schritten verbunden",
      step1Title: "next-vibe installieren",
      step1Body: "Open Source. Läuft auf Laptop, Heimserver oder VPS.",
      step2Title: "Von deiner Instanz aus verknüpfen",
      step2Body:
        "Öffne auf deiner Instanz Abonnement, dann Cloud-Sync, dann Mit Cloud verbinden. Gib {{appUrl}} und die Zugangsdaten dieses Kontos ein. Im Terminal auf dem Rechner:",
      step2Command: "vibe remote-connect -i",
      step3Title: "Sync-Umfang festlegen",
      step3Body:
        "Erinnerungen, Dokumente, Skills, Favoriten, Chats. Je ein Schalter, jederzeit auf deiner Instanz änderbar.",
      githubCta: "Auf GitHub ansehen",
      quickstartCta: "Schnellstart",
      trustTitle: "Was eine verknüpfte Instanz darf",
      trust1:
        "Sie handelt als du. Sie liest und schreibt deine eigenen Chats, Erinnerungen und Skills. Nichts aus fremden Konten.",
      trust2:
        "Admin-Werkzeuge bleiben gesperrt. Deine Instanz hat exakt die Rechte deines Kontos.",
      trust3:
        "KI-Läufe, die sie hierher schickt, kosten Credits zum normalen Satz: Anbieterkosten plus 30 %.",
      trust4:
        "Bis zu {{max}} Instanzen. Trennst du eine unten, endet ihre Verbindung sofort.",
      paidTitle: "Nur für zahlende Konten",
      paidBody:
        "Eigene Instanzen verknüpfen setzt ein bezahltes Konto voraus. Jedes Credit-Paket oder Abo schaltet es frei.",
      paidCta: "Freischalten",
      alreadyHaveLocal: "Deine verknüpften Instanzen",
      alreadyHaveLocalSub:
        "Jede handelt als dieses Konto. Öffne eine für Status oder Trennung.",
    },
    local: {
      cloudTitle: "Mit Cloud verbinden",
      cloudSubtitle:
        "Verknüpfe diese Instanz mit einer Cloud-Instanz. So kannst du ausgewählte Daten synchronisieren und lokale Werkzeuge aus der Cloud ausführen.",
      benefit1: "Erinnerungen synchronisieren sich bidirektional, automatisch",
      benefit2: "Cloud-KI entdeckt und führt deine lokalen Tools aus",
      benefit3: "Delegiere Aufgaben von der Cloud an diesen Rechner",
      noConnectionsYet: "Noch nichts verknüpft",
      connectionsTitle: "Verknüpfte Verbindungen",
    },
    selfIdentity: {
      title: "Deine Instanz-ID",
      description:
        "Andere Instanzen sehen diesen Server unter dieser ID. Muss über alle verbundenen Instanzen eindeutig sein.",
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
