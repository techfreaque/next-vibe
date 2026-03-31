import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "unbottled.ai selbst hosten - Deine Instanz, Deine Regeln",
    description:
      "Betreibe den vollständigen unbottled.ai-Stack auf deinem eigenen Server. Eigene API-Keys, Thea als KI-Admin, volle Kontrolle. Für immer kostenlos.",
    category: "Self-Host",
    imageAlt: "unbottled.ai selbst hosten Schnellstart",
    keywords:
      "self-host, next-vibe, unbottled.ai, open-source, KI, VPS, Docker, Kubernetes",
  },
  hero: {
    badge: "Für immer kostenlos - MIT + GPL v3",
    title: "Selbst betreiben.",
    titleHighlight: "Alles besitzen.",
    subtitle:
      "Der vollständige unbottled.ai-Stack auf deinem eigenen Server. Jedes Modell, jedes Tool, jede Funktion - plus Thea als KI-Admin, die deine Instanz rund um die Uhr überwacht und selbst repariert.",
    ctaQuickstart: "Zum Schnellstart",
    ctaGithub: "Auf GitHub starten",
  },
  includes: {
    title: "Alles was die Cloud hat. Und mehr.",
    items: {
      models: "42+ Modelle - eigene API-Keys, direkt bei Providern zahlen",
      memory: "Persistentes Gedächtnis, Inkognito-Modus, 4 Datenschutzstufen",
      search: "Live-Websuche + vollständiges Seitenabrufen",
      thea: "Thea: KI-Admin, die überwacht, selbst repariert und Tools auf Befehl erstellt",
      admin: "Admin-Dashboard, DB-Studio, Cron-Dashboard, Systemüberwachung",
      ssh: "SSH, Browser-Automatisierung, E-Mail-Client - Theas Tools",
      sync: "Lokale Instanz-Synchronisation mit unbottled.ai Cloud (Beta)",
      free: "Für immer kostenlos - MIT + GPL v3, kein Vendor-Lock-in",
    },
  },
  quickstart: {
    title: "Schnellstart",
    subtitle: "Drei Befehle. In 5 Minuten einsatzbereit.",
    step1: {
      title: "Klonen und installieren",
      description: "Code holen und Abhängigkeiten installieren.",
    },
    step2: {
      title: "Dev-Server starten",
      description:
        "Startet PostgreSQL in Docker, führt Migrationen durch, befüllt Daten und öffnet localhost:3000.",
    },
    step3: {
      title: "Einloggen und konfigurieren",
      description:
        'Auf der Login-Seite auf "Als Admin einloggen" klicken - kein Passwort im Dev-Modus nötig. Der Einrichtungsassistent führt durch API-Key-Setup und Admin-Passwort.',
    },
    step4: {
      title: "KI-Provider wählen",
      optionA: {
        label: "Option A: Claude Code (empfohlen)",
        description:
          "Kein API-Key nötig. Nutzt dein bestehendes Claude-Abonnement. Ein claude-code-* Modell in der Modellauswahl wählen.",
      },
      optionB: {
        label: "Option B: OpenRouter",
        description:
          "200+ Modelle, nutzungsbasierte Abrechnung. Key unter openrouter.ai/keys holen.",
      },
    },
  },
  vps: {
    title: "Auf einem VPS deployen?",
    description:
      "Funktioniert auf jedem Linux-VPS. nginx oder Caddy auf Port 3000 zeigen - fertig.",
    docker: "Docker-Setup",
    kubernetes: "Kubernetes",
    kubernetesDescription:
      "Enthält Vorlagen für Web, Task-Worker, Redis, Ingress und Namespace.",
  },
  localSync: {
    title: "Lokalen Rechner verbinden (Beta)",
    description:
      "Thea kann Aufgaben an Claude Code auf deinem Entwicklungsrechner weiterleiten. Gehe zu Admin → Remote-Verbindungen im Dashboard und füge deine lokale Instanz-URL hinzu. Erinnerungen und Aufgaben synchronisieren alle 60 Sekunden - kein Port-Forwarding, kein VPN.",
  },
  enterprise: {
    title: "Hilfe beim Einrichten gesucht?",
    description:
      "Wir helfen bei Deployment, individuellen Integrationen und laufender Entwicklungsunterstützung.",
    cta: "Kontakt aufnehmen",
  },
};
