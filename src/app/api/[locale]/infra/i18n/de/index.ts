export const translations = {
  category: "Infrastruktur",
  type: "Infrastruktur",

  enums: {
    infraStatus: {
      pending: "Ausstehend",
      provisioning: "Wird eingerichtet",
      ready: "Bereit",
      degraded: "Eingeschränkt",
      error: "Fehler",
    },
    componentStatus: {
      unknown: "Unbekannt",
      healthy: "Gesund",
      degraded: "Eingeschränkt",
      down: "Ausgefallen",
    },
    scaleComponent: {
      web: "Web (Next.js)",
      tasks: "Task-Runner",
      storage: "Speicher (MinIO)",
    },
  },

  errors: {
    noControlPlane:
      "Keine SSH-Verbindung als control-plane markiert. Bitte Server in den SSH-Einstellungen konfigurieren.",
    noClusterNodes:
      "Keine SSH-Verbindungen als Cluster-Knoten markiert. Mindestens einen Server als control-plane konfigurieren.",
    kubeconfigMissing:
      "Kubeconfig nicht gefunden. Zuerst cluster-init ausführen.",
    pulumiNotInstalled:
      "Pulumi CLI nicht installiert. Installation: curl -fsSL https://get.pulumi.com | sh",
    sshExecFailed: "SSH-Befehl auf Knoten fehlgeschlagen",
    k3sInstallFailed: "k3s-Installation fehlgeschlagen",
    scaleTargetNotFound: "Deployment im Cluster nicht gefunden",
    connectionNotFound: "SSH-Verbindung nicht gefunden",
    encryptionFailed: "Entschlüsselung der Zugangsdaten fehlgeschlagen",
    connectTimeout: "SSH-Verbindung abgelaufen",
    sshAuthFailed: "SSH-Authentifizierung fehlgeschlagen",
    sshConnectionFailed: "SSH-Verbindung fehlgeschlagen",
    fingerprintMismatch: "SSH-Host-Key-Fingerabdruck stimmt nicht überein",
  },

  cluster: {
    init: {
      post: {
        title: "Cluster initialisieren",
        description:
          "k3s auf markierten SSH-Servern einrichten. Installiert k3s, Datenbanken, Redis, MinIO und Ingress.",
        container: { title: "Cluster Init" },
        fields: {
          clusterName: {
            label: "Clustername",
            description: "Name für diesen Cluster (für Kubeconfig und Labels)",
            placeholder: "next-vibe-prod",
          },
          domain: {
            label: "Domain",
            description:
              "Basisdomain für Ingress (z.B. example.com → app.example.com)",
            placeholder: "example.com",
          },
          email: {
            label: "E-Mail",
            description: "Kontakt-E-Mail für Let's Encrypt TLS-Zertifikate",
            placeholder: "admin@example.com",
          },
          k3sVersion: {
            label: "k3s-Version",
            description: "Zu installierende k3s-Version",
            placeholder: "v1.31.0+k3s1",
          },
          dryRun: {
            label: "Probelauf",
            description: "Vorschau anzeigen ohne Änderungen vorzunehmen",
          },
          skipDatabase: {
            label: "Datenbank überspringen",
            description: "CloudNativePG PostgreSQL-Installation überspringen",
          },
          skipRedis: {
            label: "Redis überspringen",
            description: "Redis Sentinel-Installation überspringen",
          },
          skipStorage: {
            label: "Speicher überspringen",
            description: "MinIO-Installation überspringen",
          },
          skipIngress: {
            label: "Ingress überspringen",
            description: "nginx-ingress und cert-manager überspringen",
          },
        },
        response: {
          success: { title: "Erfolg" },
          message: { title: "Meldung" },
          nodesProvisioned: { title: "Eingerichtete Knoten" },
          componentsInstalled: { title: "Installierte Komponenten" },
          kubeconfig: { title: "Kubeconfig" },
          duration: { title: "Dauer (ms)" },
        },
        success: {
          title: "Cluster bereit",
          description: "k3s-Cluster erfolgreich eingerichtet",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Cluster-Konfiguration",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Admin-Zugriff erforderlich",
          },
          server: {
            title: "Einrichtung fehlgeschlagen",
            description: "Cluster-Initialisierung fehlgeschlagen",
          },
          notFound: {
            title: "Keine Knoten gefunden",
            description: "Keine SSH-Verbindungen als Cluster-Knoten markiert",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Cluster existiert bereits oder wird eingerichtet",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Cluster-Knoten nicht erreichbar",
          },
        },
      },
    },
    status: {
      get: {
        title: "Cluster-Status",
        description:
          "k8s-Knotengesundheit, Pod-Anzahl und Komponentenstatus anzeigen",
        container: { title: "Cluster-Status" },
        response: {
          nodes: { title: "Knoten" },
          components: { title: "Komponenten" },
          overallStatus: { title: "Gesamtstatus" },
          podCounts: { title: "Pod-Anzahl" },
        },
        success: {
          title: "Status abgerufen",
          description: "Cluster-Status erfolgreich abgerufen",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Parameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Admin-Zugriff erforderlich",
          },
          server: {
            title: "Serverfehler",
            description: "Cluster-Status konnte nicht abgerufen werden",
          },
          notFound: {
            title: "Kein Cluster",
            description:
              "Kein Cluster konfiguriert. Zuerst cluster-init ausführen.",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Cluster nicht erreichbar",
          },
        },
      },
    },
  },

  deploy: {
    push: {
      post: {
        title: "Deployen",
        description: "Infrastrukturänderungen via Pulumi anwenden (pulumi up)",
        container: { title: "Deploy" },
        fields: {
          stack: {
            label: "Stack",
            description: "Pulumi-Stack-Name",
            placeholder: "prod",
          },
          skipPreview: {
            label: "Vorschau überspringen",
            description: "Änderungen ohne Vorschau direkt anwenden",
          },
        },
        response: {
          success: { title: "Erfolg" },
          message: { title: "Meldung" },
          changes: { title: "Änderungen" },
          duration: { title: "Dauer (ms)" },
        },
        success: {
          title: "Deployed",
          description: "Infrastruktur erfolgreich deployed",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Deploy-Konfiguration",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Admin-Zugriff erforderlich",
          },
          server: {
            title: "Deploy fehlgeschlagen",
            description: "Pulumi up fehlgeschlagen",
          },
          notFound: {
            title: "Kein Cluster",
            description: "Kein Cluster konfiguriert",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Deploy läuft bereits",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Cluster nicht erreichbar",
          },
        },
      },
    },
    preview: {
      post: {
        title: "Deploy-Vorschau",
        description:
          "Infrastrukturänderungen vorschauen ohne anzuwenden (pulumi preview)",
        container: { title: "Deploy-Vorschau" },
        fields: {
          stack: {
            label: "Stack",
            description: "Pulumi-Stack-Name",
            placeholder: "prod",
          },
        },
        response: {
          success: { title: "Erfolg" },
          message: { title: "Meldung" },
          preview: { title: "Vorschau" },
          duration: { title: "Dauer (ms)" },
        },
        success: {
          title: "Vorschau bereit",
          description: "Vorschau erfolgreich generiert",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Konfiguration",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Admin-Zugriff erforderlich",
          },
          server: {
            title: "Vorschau fehlgeschlagen",
            description: "Pulumi preview fehlgeschlagen",
          },
          notFound: {
            title: "Kein Cluster",
            description: "Kein Cluster konfiguriert",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Cluster nicht erreichbar",
          },
        },
      },
    },
  },

  scale: {
    replicas: {
      post: {
        title: "Skalieren",
        description: "Ein Deployment im Cluster skalieren",
        container: { title: "Deployment skalieren" },
        fields: {
          component: {
            label: "Komponente",
            description: "Welches Deployment skaliert werden soll",
          },
          replicas: {
            label: "Replicas",
            description: "Zielanzahl der Replicas (0 = pausieren)",
            placeholder: "2",
          },
        },
        response: {
          success: { title: "Erfolg" },
          message: { title: "Meldung" },
          previousReplicas: { title: "Bisherige Replicas" },
          newReplicas: { title: "Neue Replicas" },
        },
        success: {
          title: "Skaliert",
          description: "Deployment erfolgreich skaliert",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Skalierungsparameter",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          forbidden: {
            title: "Verboten",
            description: "Admin-Zugriff erforderlich",
          },
          server: {
            title: "Skalierung fehlgeschlagen",
            description: "Deployment konnte nicht skaliert werden",
          },
          notFound: {
            title: "Deployment nicht gefunden",
            description: "Deployment im Cluster nicht gefunden",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Nicht gespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Ein Konflikt ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Cluster nicht erreichbar",
          },
        },
      },
    },
  },
};
