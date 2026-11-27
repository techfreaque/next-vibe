import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  update: {
    post: {
      title: "Besucherland-Datenbank aktualisieren",
      titleShort: "Geo-IP-Update",
      description:
        "Lädt die monatliche DB-IP-Ländertabelle in die Datenbank und ergänzt das Land bei Leads ohne Land. Offline-Abfrage, kein API-Aufruf pro Besuch.",
      tag: "Geo-IP",
      container: {
        title: "Geo-IP-Datenbank",
        description:
          "IP-zu-Land- und ASN-Daten von DB-IP (CC BY 4.0). Hosting-ASN-Liste: bad-asn-list (MIT)",
      },
      fields: {
        force: {
          label: "Download erzwingen",
          description:
            "Aktuelle Version auch dann laden, wenn sie schon gespeichert ist",
        },
      },
      response: {
        status: "Status",
        version: "Version",
        asnVersion: "ASN-Version",
        v4Ranges: "IPv4-Bereiche",
        v6Ranges: "IPv6-Bereiche",
        backfilled: "Leads ergänzt",
        unresolved: "Leads noch ohne Land",
      },
      errors: {
        unauthorized: {
          title: "Nicht angemeldet",
          description:
            "Melde dich als Admin an, um die Geo-Datenbank zu aktualisieren.",
        },
        forbidden: {
          title: "Keine Berechtigung",
          description: "Nur Admins dürfen die Geo-Datenbank aktualisieren.",
        },
        server: {
          title: "Update fehlgeschlagen",
          description:
            "Die Geo-Datenbank konnte nicht aktualisiert werden. Prüfe die Logs.",
        },
        unknown: {
          title: "Unerwarteter Fehler",
          description:
            "Beim Aktualisieren der Geo-Datenbank ist etwas schiefgelaufen.",
        },
        validation: {
          title: "Ungültige Eingabe",
          description: "Prüfe die Felder der Anfrage.",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Die Geo-Quelle war nicht erreichbar.",
        },
      },
      success: {
        title: "Geo-Datenbank geprüft",
        description: "Die Ländertabelle ist aktuell.",
      },
    },
    task: {
      description:
        "Monatliches DB-IP-Länderupdate plus stündliche Länderergänzung für Leads",
    },
  },
  enums: {
    updateStatus: {
      updated: "Aktualisiert",
      current: "Bereits aktuell",
      unavailable: "Download fehlgeschlagen",
    },
  },
};
