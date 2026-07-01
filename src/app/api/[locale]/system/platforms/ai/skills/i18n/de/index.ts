import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  agent: {
    get: {
      title: "Agent-Skill-Manifest (AGENT.md)",
      description:
        "Gibt ein Markdown-Dokument zurück, das alle KI-Tools für unauthentifizierte Agenten auflistet",
      response: {
        title: "Skill-Manifest",
        description: "Markdown-Dokument mit allen verfügbaren Agent-Tools",
      },
      success: {
        title: "Skill-Manifest abgerufen",
        description: "Agent-Skill-Manifest erfolgreich gerendert",
      },
      errors: {
        server: {
          title: "Serverfehler",
          description: "Fehler beim Generieren des Agent-Skill-Manifests",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Skill-Manifest nicht gefunden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
      },
    },
  },
  publicUser: {
    get: {
      title: "Öffentliches Benutzer-Skill-Manifest (PUBLIC_USER_SKILL.md)",
      description:
        "Gibt ein Markdown-Dokument zurück, das alle KI-Tools für authentifizierte Benutzer auflistet",
      response: {
        title: "Skill-Manifest",
        description: "Markdown-Dokument mit Tools für angemeldete Benutzer",
      },
      success: {
        title: "Skill-Manifest abgerufen",
        description:
          "Öffentliches Benutzer-Skill-Manifest erfolgreich gerendert",
      },
      errors: {
        server: {
          title: "Serverfehler",
          description:
            "Fehler beim Generieren des öffentlichen Benutzer-Skill-Manifests",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Skill-Manifest nicht gefunden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
      },
    },
  },
  userWithAccount: {
    get: {
      title: "Benutzer-mit-Konto-Skill-Manifest (USER_WITH_ACCOUNT_SKILL.md)",
      description:
        "Gibt ein Markdown-Dokument zurück, das Tools auflistet, die ein authentifiziertes Konto erfordern",
      response: {
        title: "Skill-Manifest",
        description: "Markdown-Dokument mit kontopflichtigen Tools",
      },
      success: {
        title: "Skill-Manifest abgerufen",
        description: "Benutzer-mit-Konto-Skill-Manifest erfolgreich gerendert",
      },
      errors: {
        server: {
          title: "Serverfehler",
          description:
            "Fehler beim Generieren des Benutzer-mit-Konto-Skill-Manifests",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Skill-Manifest nicht gefunden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
      },
    },
  },
  category: "KI-Skills",
  tags: {
    skills: "skills",
    manifest: "manifest",
    agent: "agent",
  },
};
