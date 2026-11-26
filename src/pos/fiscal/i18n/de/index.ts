import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { pos: "Kasse", fiscal: "Fiskalbelege" },
  enums: {
    adapter: {
      sandbox: "Sandbox (nur zum Testen, nicht zertifiziert)",
    },
    deviceKind: {
      orp: "ORP (Kasse mit Hardware-Speicher)",
      sorp: "SORP (Softwarekasse, Speicher beim Hersteller)",
      vrp: "VRP (kostenlose virtuelle Kasse der Finančná správa)",
    },
    receiptStatus: {
      pending: "Wartet auf Registrierung",
      registered: "Registriert",
      offline: "Offline ausgestellt",
      failed: "Fehlgeschlagen",
    },
  },
  block: {
    ekasaRequired:
      "Nach slowakischem Recht muss jeder Bar- und Kartenverkauf in eKasa registriert werden. Verbinden Sie unter den Fiskaleinstellungen der Kasse eine zertifizierte eKasa-Kasse, bevor Sie verkaufen.",
  },
  title: "Fiskalbelege",
  description:
    "Prüfen Sie, ob Ihr Land Online-Fiskalbelege vorschreibt und welche Kasse Ihre Verkäufe registriert.",
  saveTitle: "Fiskalkasse",
  saveDescription:
    "Verbinden Sie die Kasse, die Ihre Kassenverkäufe bei der Finanzverwaltung registriert.",
  company: "Unternehmen",
  adapter: "Anbieter",
  adapterPlaceholder: "Anbieter wählen",
  adapterDescription:
    "Nur zertifizierte Anbieter registrieren echte Verkäufe. Die Sandbox dient dem Test und gibt den Verkauf nie frei.",
  deviceKind: "Kassentyp",
  deviceKindDescription:
    "ORP speichert Belege in einem Hardware-CHDÚ. SORP hält den geschützten Speicher auf den Servern des Herstellers. VRP ist der kostenlose Dienst der Finančná správa.",
  cashRegisterCode: "Kassencode",
  cashRegisterCodeDescription:
    "Der Code, den die Finanzverwaltung dieser Kasse zugeteilt hat (kód pokladnice).",
  cashRegisterCodePlaceholder: "z. B. 88812345678900001",
  isEnabled: "Verkäufe über diesen Anbieter registrieren",
  isEnabledDescription:
    "Wenn aktiv, wird jeder abgeschlossene Verkauf zur Registrierung eingereiht.",
  certifiedUntil: "Zertifikat gültig bis",
  certifiedUntilDescription:
    "Letzter Gültigkeitstag des Kassenzertifikats. Danach sind Verkäufe gesperrt.",
  credentialRef: "Verweis auf Zugangsdaten",
  credentialRefDescription:
    "Name des hinterlegten Schlüssels oder Zertifikats. Fügen Sie hier nie einen privaten Schlüssel oder ein Passwort ein.",
  offlineDeadlineHours: "Nachsendefrist offline (Stunden)",
  offlineDeadlineHoursDescription:
    "Offline ausgestellte Belege müssen innerhalb dieser Frist bei der Finanzverwaltung eingehen.",
  response: {
    required: "Fiskalbelege Pflicht",
    blocked: "Verkauf gesperrt",
    provider: "Kasse",
    counts: "Belegwarteschlange",
    adapters: "Verfügbare Anbieter",
    companyName: "Unternehmen",
    country: "Land",
    saved: "Gespeichert",
  },
  widget: {
    requiredTitle: "eKasa ist für dieses Unternehmen Pflicht",
    requiredMessage:
      "Jeder Bar- und Kartenverkauf muss online in eKasa registriert werden (zákon 384/2025 Z. z.). Belege ohne Bestätigung binnen 5 Sekunden werden offline gespeichert und müssen innerhalb von 96 Stunden nachgesendet werden.",
    notRequiredTitle: "Keine Online-Fiskalbelege vorgeschrieben",
    notRequiredMessage:
      "Für das Land dieses Unternehmens ist in unserer Bibliothek kein Online-Fiskalsystem hinterlegt. Kassenverkäufe laufen wie gewohnt.",
    blockedTitle: "Kassenverkäufe sind gesperrt",
    blockedMessage:
      "Verbinden und aktivieren Sie eine zertifizierte eKasa-Kasse. Bis dahin kann die Kasse keine Verkäufe abschließen.",
    readyTitle: "Verkäufe werden registriert",
    readyMessage:
      "Abgeschlossene Verkäufe werden eingereiht und über die verbundene Kasse registriert.",
    noCertifiedProvider:
      "In dieser Installation ist noch kein zertifizierter eKasa-Anbieter verfügbar.",
    noProvider: "Keine Kasse verbunden",
    configure: "Kasse verbinden",
    edit: "Kasse ändern",
    certified: "Zertifiziert",
    notCertified: "Nicht zertifiziert",
    enabled: "Aktiv",
    disabled: "Inaktiv",
    certifiedUntilValue: "Zertifikat gültig bis {{date}}",
    pending: "Wartend",
    offline: "Offline",
    failed: "Fehlgeschlagen",
    overdue: "Frist überschritten",
    queueHint: "Belege, die die Finanzverwaltung noch nicht bestätigt hat.",
    disclaimer: "Wir liefern Werkzeuge, keine Steuerberatung.",
    pickCompany: {
      title: "Unternehmen wählen",
      message: "Die Fiskalregeln hängen vom Land des Unternehmens ab.",
    },
    savedTitle: "Kasse gespeichert",
    savedBlocked:
      "Verkäufe bleiben gesperrt: Dieser Anbieter ist für eKasa nicht zertifiziert.",
    savedReady: "Abgeschlossene Verkäufe werden über diese Kasse registriert.",
    back: "Zurück",
    save: "Kasse speichern",
    sectionProvider: "Anbieter",
    sectionDevice: "Kasse",
  },
  errors: {
    validation: {
      title: "Prüfen Sie die Kassendaten",
      description: "Einige Angaben fehlen oder sind ungültig.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Melden Sie sich an, um Fiskalbelege zu verwalten.",
    },
    forbidden: {
      title: "Kein Zugriff",
      description:
        "Nur Inhaber und Administratoren des Unternehmens können Fiskaleinstellungen ändern.",
    },
    notFound: {
      title: "Unternehmen nicht gefunden",
      description:
        "Das Unternehmen existiert nicht oder Sie sind kein Mitglied.",
    },
    conflict: {
      title: "Einstellungen geändert",
      description: "Laden Sie die Seite neu und versuchen Sie es erneut.",
    },
    server: {
      title: "Fiskaleinstellungen nicht verfügbar",
      description: "Versuchen Sie es gleich noch einmal.",
    },
    network: {
      title: "Keine Verbindung",
      description: "Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    },
    unknown: {
      title: "Etwas ist schiefgelaufen",
      description: "Versuchen Sie es gleich noch einmal.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Speichern oder verwerfen Sie zuerst Ihre Änderungen.",
    },
    deviceKindUnsupported:
      "Dieser Anbieter unterstützt den gewählten Kassentyp nicht.",
    adapterUnknown: "Diesen Anbieter gibt es nicht.",
    sandboxProduction:
      "Die Sandbox ist im Produktivbetrieb nicht zulässig. Wählen Sie einen zertifizierten Anbieter.",
  },
  success: {
    title: "Fiskaleinstellungen geladen",
    description: "Status der Fiskalbelege für das Unternehmen.",
    savedTitle: "Kasse gespeichert",
    savedDescription: "Die Einstellungen der Fiskalkasse sind gespeichert.",
  },
};
