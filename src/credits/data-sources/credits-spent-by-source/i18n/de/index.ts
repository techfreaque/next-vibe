import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    source: {
      public: "Öffentlich (Gäste)",
      usersFree: "Nutzer gratis",
      paid: "Bezahlt",
      gifted: "Geschenkt",
      internal: "Intern (Admins)",
      unattributed: "Nicht zugeordnet (Altdaten)",
    },
  },
  post: {
    titleShort: "Verbrauch nach Quelle",
    title: "Ausgegebene Credits nach Quelle",
    description:
      "Ausgegebene Credits, aufgeteilt nach Verbraucher und Credit-Herkunft: öffentlich (Gäste), Nutzer gratis, bezahlt, geschenkt, intern, nicht zugeordnet. Die Quellen ergeben zusammen den Gesamtverbrauch.",
    fields: {
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Abzufragender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart",
      },
      source: {
        label: "Quelle",
        description:
          "Welche Credits gezählt werden: öffentliche Gäste, Gratis-Credits angemeldeter Nutzer, bezahlt (Abo + Pakete), geschenkt (Admin-Gutschriften), intern (Admin-Konten) oder nicht zugeordnete Altdaten",
      },
      result: {
        label: "Ausgegebene Credits",
        description: "Ausgabe-Zeitreihe",
      },
      meta: { label: "Meta", description: "Metadaten der Knotenausführung" },
    },
    success: {
      title: "Credits nach Quelle berechnet",
      description: "Zeitreihe der Credits nach Quelle geliefert",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Admin-Zugriff erforderlich",
      },
      server: { title: "Serverfehler", description: "Abfrage fehlgeschlagen" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Anfrageparameter",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Zuerst Änderungen speichern",
      },
    },
  },
};
