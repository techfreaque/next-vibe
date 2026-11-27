import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "{{appName}} selbst hosten: KI, Buchhaltung und CRM auf deinem Server",
    description:
      "{{appName}} auf deinem eigenen Rechner. git clone, bun i, vibe dev. Alle {{modelCount}} KI-Modelle über dein {{appName}}-Konto, dazu Buchhaltung, CRM und Newsletter. Deine Daten bleiben in deiner Datenbank.",
    category: "Self-Host",
    imageAlt: "{{appName}} auf dem eigenen Rechner selbst hosten",
    keywords:
      "self-host, selbst hosten, selbst gehosteter KI-Chat, next-vibe, {{appName}}, Open Source, private KI, lokale KI, unzensierte KI, Buchhaltung selbst hosten, Open-Source-ERP, CRM selbst hosten",
  },
  hero: {
    badge: "Kostenlos und Open Source",
    title: "Dein Server.",
    titleHighlight: "Deine KI. Deine Buchhaltung.",
    subtitle:
      "{{appName}} auf deinem eigenen Rechner. Mit deinem {{appName}}-Konto anmelden, und alle {{modelCount}} Modelle laufen. Keine Anbieterschlüssel. Buchhaltung, CRM, Newsletter und Agenten stecken in derselben App.",
    ctaStart: "Jetzt starten",
    ctaGithub: "Auf GitHub ansehen",
  },
  diagram: {
    link: "Eine Anmeldung",
    instance: {
      label: "Läuft auf deinem Rechner",
      title: "Deine Instanz",
      points: {
        chats: "Chats, Buchhaltung und Kunden in deinem eigenen Postgres",
        files: "Uploads und generierte Medien auf deiner Platte",
        tools: "Thea, Cronjobs und jedes KI-Tool",
        admin: "Dein Admin, deine Regeln.",
      },
    },
    account: {
      label: "Läuft auf {{appName}}",
      title: "Dein Konto",
      points: {
        models: "{{modelCount}} Modelle, abgerechnet über dein Guthaben",
        keys: "Kein einziger Anbieterschlüssel",
      },
    },
  },
  suite: {
    eyebrow: "Was du installierst",
    title: "Weit mehr als eine Chat-App.",
    intro:
      "Eine Codebasis. Eine Datenbank. Ein Admin. Jedes Modul steckt in derselben Installation.",
    link: "Die ganze Unternehmenssoftware ansehen",
    cards: {
      ai: {
        title: "KI-Chat",
        body: "{{modelCount}} Modelle, Gedächtnis, Websuche und Inkognito-Chats. Dazu Bild, Video, Musik und Sprache.",
      },
      agents: {
        title: "Ein Agent, der arbeitet",
        body: "Thea, der eingebaute Agent, erledigt Aufgaben nach Zeitplan und nutzt SSH, einen Browser und dein E-Mail-Postfach als Werkzeuge.",
      },
      books: {
        title: "Buchhaltung und ERP",
        body: "Doppelte Buchführung, Rechnungen, Eingangsrechnungen, Einkauf, Lager und Kasse.",
      },
      customers: {
        title: "Kunden",
        body: "CRM mit CSV-Import, Newsletter mit Double-Opt-in, ein Posteingang für E-Mail, SMS, Telegram und WhatsApp.",
      },
      payments: {
        title: "Zahlungen",
        body: "Checkout über Stripe und Krypto für Abo-Tarife, mit Webhooks und Erstattungen.",
      },
      build: {
        title: "Eigene Funktionen",
        body: "Eine Definitionsdatei wird zur Webseite, zum CLI-Befehl, MCP-Tool und KI-Tool.",
      },
    },
  },
  start: {
    eyebrow: "Einrichtung",
    title: "Klonen. Installieren. Starten.",
    intro:
      "Drei Befehle im Terminal. Alles andere passiert im Browser. Keine Konfigurationsdateien.",
    terminal: {
      eyebrow: "Im Terminal",
      title: "Instanz starten",
      copyAll: "Alles kopieren",
      copy: "Kopieren",
      copied: "Kopiert",
      rows: {
        clone: "Code holen",
        cd: "Ins Verzeichnis wechseln",
        install: "Installieren. Legt vibe auch in deinen PATH.",
        dev: "Starten. Datenbank und Startdaten richten sich selbst ein.",
      },
      facts: {
        docker: "Kein Docker",
        postgres: "Keine Postgres-Installation",
        config: "Kein .env-Gefrickel",
      },
      troubleshoot: {
        notFound: {
          problem: "vibe: command not found?",
          fix: "Neues Terminal öffnen oder ausführen:",
        },
        port: {
          problem: "Port 3000 belegt?",
          fix: "Anderen Port nehmen:",
        },
      },
    },
    prereqs: {
      summary: "Neuer Rechner? Erst git und Bun installieren",
      body: "Einmal pro Rechner. Du brauchst git und Bun ab Version 1.3. Wähle dein System.",
      newTerminal:
        "Danach ein neues Terminal öffnen, damit git und bun im PATH liegen.",
    },
    browser: {
      eyebrow: "Im Browser",
      title: "Den Rest erledigt der Einrichtungsassistent",
      recommended: "Empfohlen",
      steps: {
        open: {
          title: "{{url}} öffnen",
          body: "Eine frische Instanz öffnet den Einrichtungsassistenten von selbst. Auf „Einrichtung starten“ klicken.",
        },
        admin: {
          title: "Admin-Login anlegen",
          body: "Deine E-Mail, dein Passwort. Ersetzt den eingebauten Standard. Sicherheitsschlüssel sind schon erzeugt.",
        },
        ai: {
          title: "{{appName}}-Konto verbinden",
          body: "E-Mail und Passwort deines {{appName}}-Kontos eingeben. Fertig.",
        },
        extras: {
          title: "Extras, wenn du sie brauchst",
          body: "E-Mail, Stripe-Zahlungen, S3-Speicher. Alles optional. Überspringen und später nachholen.",
        },
      },
      done: "Einrichtung abschließen. Chat starten.",
    },
  },
  ai: {
    eyebrow: "KI verbinden",
    title: "Eine Anmeldung. Jedes Modell.",
    intro: "Deine Instanz betreibt die App. {{appName}} betreibt die Modelle.",
    account: {
      badge: "Empfohlen",
      title: "Dein {{appName}}-Konto",
      body: "Einmal im Einrichtungsassistenten anmelden. Jeder Chat läuft auf deiner Instanz, jeder Modellaufruf auf {{appName}} und wird über dein Guthaben abgerechnet.",
      points: {
        models: {
          title: "{{modelCount}} Modelle",
          body: "Mainstream, offen und unzensiert. Dieselbe Auswahl wie auf {{appName}}.",
        },
        local: {
          title: "Der Verlauf bleibt lokal",
          body: "Threads liegen in deiner Datenbank. Nur die Modellaufrufe laufen über {{appName}}. Sync ist aus, bis du ihn einschaltest.",
        },
        sync: {
          title: "Dein Setup zieht mit",
          body: "Erinnerungen, Dokumente, Skills und Favoriten synchronisieren standardmäßig. Je ein Schalter.",
        },
        paid: {
          title: "Jeder Kauf schaltet frei",
          body: "Ein Abo oder ein beliebiges Guthabenpaket. Bis zu drei Instanzen pro Konto.",
        },
      },
      cta: "{{appName}}-Konto erstellen",
      pricing: "Tarife ansehen",
    },
    claude: {
      title: "Claude Code auf diesem Rechner",
      body: "Mit der claude-CLI angemeldet? Der Assistent erkennt das. Claude-Modelle laufen über dein Claude-Abo. Nichts einzutragen.",
    },
    keys: {
      title: "Eigene Anbieterschlüssel",
      body: "Kein {{appName}}-Konto. Schlüssel im selben Schritt einfügen und direkt beim Anbieter zahlen.",
      providers: {
        openrouter: "OpenRouter",
        venice: "Venice AI",
        nanogpt: "NanoGPT",
      },
      cta: "OpenRouter-Schlüssel holen",
    },
  },
  own: {
    eyebrow: "Dein Server, deine Regeln",
    title: "Dein Stack. Dein Filter.",
    subtitle:
      "Dein Postgres, deine Dateien, deine Logs. Du wählst die Modelle und wie viel Filter zwischen dir und ihnen sitzt.",
    cards: {
      api: {
        title: "Deine API gleich mit",
        body: "Jedes Modul ist ein CLI-Befehl und ein MCP-Tool auf deiner Instanz. Skripte es oder lass deinen Agenten ran.",
      },
      filter: {
        title: "Dein Filterniveau",
        body: "Mainstream, offen oder unzensiert. Du entscheidest pro Skill und pro Thread. Keine Richtlinienabteilung dazwischen.",
      },
      code: {
        title: "Offener Code, kein Lock-in",
        body: "Dieselbe Codebasis wie {{appName}}, öffentlich auf GitHub. Lesen, ändern, forken.",
      },
    },
  },
  server: {
    eyebrow: "Live gehen",
    title: "Ab auf den Server.",
    intro:
      "Gleiches Klonen und Installieren. Dann ein Produktions-Build statt Dev-Server.",
    terminalTitle: "Auf deinem Server",
    rows: {
      start: "Erster Start: Produktions-Build",
      update: "Nach git pull: Update ohne Ausfallzeit",
    },
    points: {
      proxy: "Caddy oder nginx für HTTPS auf Port 3000 zeigen lassen.",
      env: "Beim ersten Aufruf derselbe Einrichtungsassistent. Lieber Umgebungsvariablen? Im Deployment setzen und neu starten.",
      connect:
        "Dein {{appName}}-Konto verbindest du auf dem Server genau wie auf dem Laptop.",
      db: "Standardmäßig eingebettetes Postgres (PGlite). Für den Produktivbetrieb setzt du DATABASE_URL auf dein eigenes Postgres.",
    },
  },
  developers: {
    title: "Willst du darauf aufbauen?",
    body: "Jedes Modul ist normales TypeScript im Repo. Forke es, erweitere es oder schreib dein eigenes.",
    cta: "So funktioniert next-vibe",
  },
  help: {
    title: "Festgefahren? Oder fürs ganze Team?",
    description:
      "Hilfe beim Setup, Team-Installationen, eigene Integrationen. Jede Nachricht liest ein Mensch.",
  },
};
