import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Headless-Client",
    titleShort: "headless",
    description: "Headless-Remote-Verbindungs-Client starten",
    form: {
      title: "Headless-Client",
      description:
        "Startet Reverse-WS-Verbindungen und Tool-Executor. Kein Webserver.",
    },
    fields: {
      computerName: {
        title: "Computername",
        description: "Bezeichner für diesen Rechner (Standard: OS-Hostname)",
      },
      remoteUrl: { title: "Remote-URL", description: "URL der Cloud-Instanz" },
      leadId: {
        title: "Lead-ID",
        description: "Deine Lead-UUID auf der Remote-Instanz",
      },
      token: {
        title: "Token",
        description: "Verbindungs-Authentifizierungstoken",
      },
      output: { title: "Ausgabe" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Eingabe",
      },
      network: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Nicht autorisiert",
      },
      forbidden: { title: "Verboten", description: "Verboten" },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      server: { title: "Serverfehler", description: "Serverfehler" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unbekannter Fehler",
      },
      conflict: { title: "Konflikt", description: "Konflikt" },
      migrationFailed: "Migration fehlgeschlagen",
      migrationError: "Migrationsfehler",
    },
    success: {
      title: "Headless-Client gestartet",
      description: "Reverse-WS-Verbindungen offen, warte auf Tool-Anfragen",
    },
  },
};
