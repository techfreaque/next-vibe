import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} selbst hosten: Deine Instanz, Deine Regeln",
    description:
      "Der komplette {{appName}}-Stack auf deinem eigenen Rechner. Vier Befehle, danach ein Einrichtungsassistent im Browser. Mit deinem {{appName}}-Konto oder eigenen Schlüsseln.",
    category: "Self-Host",
    imageAlt: "{{appName}} selbst hosten: Schnellstart",
    keywords:
      "self-host, selbst hosten, next-vibe, {{appName}}, Open Source, private KI, lokale KI, OpenRouter",
  },
  hero: {
    badge: "Kostenlos und Open Source",
    title: "Selbst betreiben.",
    titleHighlight: "Alles besitzen.",
    subtitle:
      "Der komplette {{appName}}-Stack auf deinem Rechner. Verbinde dein {{appName}}-Konto für alle Modelle oder nutze eigene Schlüssel. Vier Befehle, den Rest erledigt der Browser.",
    ctaQuickstart: "In vier Befehlen starten",
    ctaGithub: "Auf GitHub ansehen",
  },
  quickstart: {
    eyebrow: "Schnellstart",
    title: "Vier Befehle. Dann übernimmt der Browser.",
    intro:
      "Keine Konfigurationsdateien. Beim ersten Login startet ein Einrichtungsassistent und führt dich durch den Rest.",
  },
  paths: {
    eyebrow: "KI wählen",
    title: "Dein Rechner. Deine Modelle.",
    intro:
      "Beide Wege stecken im Schritt KI-Anbieter des Einrichtungsassistenten. Jederzeit umstellbar.",
    account: {
      badge: "Empfohlen",
      title: "Dein {{appName}}-Konto verbinden",
      body: "Einmal im Assistenten anmelden. Deine Instanz führt jeden Chat, die Modelle laufen auf {{appName}} und rechnen über dein Guthaben ab. Kein Schlüssel-Jonglieren.",
      points: {
        models:
          "Alle {{modelCount}} Modelle, von Mainstream bis unzensiert, mit einem Login.",
        local: "Chats bleiben in deiner lokalen Datenbank.",
        sync: "Erinnerungen, Dokumente, Skills und Favoriten synchronisieren standardmäßig, Threads nicht. Ein Schalter pro Bereich.",
        paid: "Setzt ein bezahltes Abo oder Guthabenpaket voraus. Bis zu drei Instanzen pro Konto.",
      },
      cta: "{{appName}}-Konto anlegen",
    },
    standalone: {
      badge: "Ohne Konto",
      title: "Eigenständig, mit eigenen Schlüsseln",
      body: "Kein Konto bei uns. Im selben Schritt einen Anbieter-Schlüssel einfügen und direkt beim Anbieter zahlen.",
      points: {
        openrouter: "OpenRouter: Hunderte Modelle, ein Schlüssel.",
        claude:
          "Claude Code auf diesem Rechner angemeldet? Wird automatisch erkannt. Kein Schlüssel nötig.",
        more: "Weitere Anbieter jederzeit unter Alle Einstellungen anzeigen.",
        billing:
          "Du zahlst direkt beim Anbieter. Keine Rechnung von {{appName}}.",
      },
      cta: "OpenRouter-Schlüssel holen",
    },
  },
  own: {
    eyebrow: "Dein Server, deine Regeln",
    title: "Den Stack besitzen. Den Filter bestimmen.",
    subtitle:
      "Dein Postgres, deine Dateien, deine Logs. Du wählst die Modelle und wie viel Filter zwischen dir und ihnen sitzt.",
    cards: {
      data: {
        title: "Deine Daten bleiben, wo sie sind",
        body: "Threads, Erinnerungen und Dateien liegen in deiner eigenen Datenbank und deinem Speicherpfad.",
      },
      filter: {
        title: "Deine Filterstufe",
        body: "Mainstream, offen oder unzensiert. Du entscheidest pro Skill und pro Thread. Keine Richtlinien-Abteilung dazwischen.",
      },
      keys: {
        title: "Deine Rechnung, deine Wahl",
        body: "Modellkosten laufen über dein {{appName}}-Guthaben oder direkt an deinen eigenen Anbieter. Du entscheidest.",
      },
    },
  },
  includes: {
    title: "Alles, was die Cloud kann.",
    intro: "Dieselbe Codebasis wie {{appName}}. Nichts zurückgehalten.",
    items: {
      models: "{{modelCount}} Chatmodelle, dazu Bild, Video, Musik und Sprache",
      memory: "Dauerhaftes Gedächtnis und Inkognito-Chats",
      search: "Websuche und Seitenabruf",
      thea: "Thea, deine KI-Admin: erledigt Aufgaben, baut Tools auf Zuruf",
      admin: "Admin-Dashboard und Cron-Jobs",
      tools: "SSH, Browser-Automatisierung, E-Mail-Client als KI-Tools",
    },
  },
  developers: {
    title: "Du willst darauf aufbauen?",
    body: "Jedes Feature ist eine Definitionsdatei. Daraus werden Webseite, CLI-Befehl, MCP-Tool und KI-Tool.",
    cta: "So funktioniert next-vibe",
  },
  help: {
    title: "Hängst du fest, oder soll es fürs ganze Team laufen?",
    description:
      "Hilfe beim Einrichten, Team-Installationen, individuelle Integrationen. Jede Nachricht liest ein Mensch.",
  },
};
