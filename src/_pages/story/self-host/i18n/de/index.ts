import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} selbst hosten - Deine Instanz, Deine Regeln",
    description:
      "Betreibe den vollständigen {{appName}}-Stack auf deinem eigenen Server. Eigene API-Keys, Thea als KI-Admin, volle Kontrolle. Für immer kostenlos.",
    category: "Self-Host",
    imageAlt: "{{appName}} selbst hosten Schnellstart",
    keywords:
      "self-host, next-vibe, {{appName}}, open-source, KI, VPS, Docker, Kubernetes",
  },
  hero: {
    badge: "Für immer kostenlos - MIT + GPL v3",
    title: "Selbst betreiben.",
    titleHighlight: "Alles besitzen.",
    subtitle:
      "Der vollständige {{appName}}-Stack auf deinem eigenen Server. Jedes Modell, jedes Tool, jede Funktion - plus Thea als KI-Admin, die deine Instanz rund um die Uhr überwacht und selbst repariert.",
    ctaQuickstart: "Zum Schnellstart",
    ctaGithub: "Auf GitHub starten",
  },
  includes: {
    title: "Alles was die Cloud hat. Und mehr.",
    items: {
      models:
        "{{modelCount}} Modelle - eigene API-Keys, direkt bei Providern zahlen",
      memory: "Persistentes Gedächtnis, Inkognito-Modus, 4 Datenschutzstufen",
      search: "Live-Websuche + vollständiges Seitenabrufen",
      thea: "Thea: KI-Admin, die überwacht, selbst repariert und Tools auf Befehl erstellt",
      admin: "Admin-Dashboard, DB-Studio, Cron-Dashboard, Systemüberwachung",
      ssh: "SSH, Browser-Automatisierung, E-Mail-Client - Theas Tools",
      sync: "Lokale Instanz-Synchronisation mit {{appName}} Cloud (Beta)",
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
      noDocker:
        'Kein Docker? DATABASE_URL="file:///absoluter/pfad/data.db" in die .env setzen - vibe dev läuft dann auf eingebettetem PGlite.',
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
          "Alle OpenRouter-Modelle, nutzungsbasierte Abrechnung. Key unter openrouter.ai/keys holen.",
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
  own: {
    eyebrow: "Dein Server, deine Regeln",
    title: "Dein Stack. Dein Filter.",
    subtitle:
      "Kein Konto bei fremden Firmen. Deine Postgres, deine Schlüssel, deine Logs. Du wählst die Modelle und du bestimmst, wie viel Filter zwischen dir und ihnen sitzt.",
    cards: {
      data: {
        title: "Deine Daten bleiben bei dir",
        body: "Threads, Erinnerungen und Dateien liegen in deiner eigenen Postgres und deinem Speicherpfad. Nichts telefoniert nach Hause.",
      },
      filter: {
        title: "Dein Filterlevel",
        body: "Mainstream-, offene oder unzensierte Modelle. Du entscheidest pro Skill, pro Thread, pro Nutzer. Kein Policy-Team dazwischen.",
      },
      keys: {
        title: "Deine Schlüssel",
        body: "Bring OpenRouter, ein lokales Modell oder Claude Code mit. Die Kosten gehen an deinen Anbieter, nicht über unseren.",
      },
    },
  },
  env: {
    title: "Was du brauchst",
    intro:
      "Bun, Docker und eine Handvoll Umgebungsvariablen. Mehr steht nicht auf der Checkliste für eine private Instanz.",
    envLabel: "Minimale Konfiguration",
    composeLabel: "Produktion auf einem VPS",
  },
  instances: {
    title: "Drei Instanzen, drei Aufgaben",
    intro:
      "Eine Codebasis läuft als getrennte Instanzen. Gleicher Code, andere Datenbank und Rolle. So betreiben wir selbst.",
    atlas: {
      name: "Atlas",
      body: "Die Dev-Instanz. Hot Reload, Wegwerf-Datenbank. Hier entsteht der Code.",
    },
    hermes: {
      name: "Hermes",
      body: "Dein Alltagswerkzeug. Lokale Vorschau auf eigener Postgres. In dieser Instanz lebst du.",
    },
    thea: {
      name: "Thea",
      body: "Die Cloud-Instanz auf deinem VPS. Immer an, führt deine Crons aus, nimmt Aufgaben von den anderen beiden.",
    },
    note: "Instanzen sind miteinander verbunden. Threads und Aufgaben synchronisieren zwischen Laptop und Server.",
  },
  fork: {
    title: "Gleiches Framework, anderes Produkt",
    body: "next-vibe-headunit ist ein Car-PC-Fork. Medien, Navigation, Klima, Bluetooth und Radio sind Endpoints, und jeder ist zugleich CLI-Befehl und KI-Tool. Anderes Produkt, dieselben drei Dateien.",
  },
  enterprise: {
    title: "Hilfe beim Einrichten gesucht?",
    description:
      "Wir helfen bei Deployment, individuellen Integrationen und laufender Entwicklungsunterstützung.",
  },
};
