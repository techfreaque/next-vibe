import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronBuild: "Electron Build",
  },
  post: {
    title: "Electron-App bauen",
    description:
      "Main/Preload mit bun kompilieren, vibe build ausführen, dann mit electron-builder paketieren",
    form: {
      title: "Electron Build Konfiguration",
      description: "Electron Build Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Build-Antwortdaten",
    },
    fields: {
      viBuild: {
        title: "vibe build ausführen",
        description:
          "vibe build (Next.js + Migrationen) vor dem Paketieren ausführen",
      },
      generate: {
        title: "Endpunkte generieren",
        description: "Endpunkt-Index vor dem Build neu generieren",
      },
      platform: {
        title: "Zielplattform",
        description: "Für welche Plattform paketiert werden soll",
        options: {
          current: "Aktuelles Betriebssystem",
          linux: "Linux",
          mac: "macOS",
          win: "Windows",
          all: "Alle Plattformen",
        },
      },
      success: {
        title: "Erfolgreich",
      },
      output: {
        title: "Ausgabe",
      },
      duration: {
        title: "Dauer (ms)",
      },
      errors: {
        title: "Fehler",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Electron-App erfolgreich gebaut",
    },
  },
};
