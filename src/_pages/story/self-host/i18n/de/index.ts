import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} mit next-vibe selbst hosten",
    category: "Self-Hosting",
    description:
      "Betreibe next-vibe auf deinem Rechner. Nutze dein {{appName}}-Konto für Cloud-Modelle und Guthaben oder hinterlege eigene Anbieterschlüssel.",
    imageAlt: "{{appName}} mit next-vibe selbst hosten",
    keywords: "Self-Hosting, next-vibe, private KI, Docker, {{appName}}",
  },
  hero: {
    title: "next-vibe auf deinem Rechner",
    subtitle:
      "Speichere Chatverläufe und Dateien auf deiner eigenen Hardware. Nutze Modelle und Guthaben von unbottled.ai oder verbinde deine eigenen KI-Anbieter.",
  },
  account: {
    title: "Dein unbottled.ai-Konto nutzen",
    intro:
      "Du betreibst die App. unbottled.ai führt die Modelle aus und rechnet die Anfragen über dein Guthaben ab. Zum Verbinden brauchst du ein bezahltes Konto mit E-Mail-Adresse und Passwort.",
    start: {
      title: "Lokale Instanz starten",
      body: "Installiere next-vibe, starte die App und melde dich mit deinen lokalen Admin-Zugangsdaten an. Für die Cloud-Verbindung genügt ein Abo oder gekauftes Guthaben.",
      signup: "unbottled.ai-Konto erstellen",
    },
    connect: {
      title: "Cloud-Konto verbinden",
      body: "Falls die Assistentenauswahl erscheint, schließe sie vorerst. Klappe in der Chat-Seitenleiste den Kontobereich auf. Öffne das Admin-Dashboard, wähle die Systemeinstellungen und starte den Einrichtungsassistenten. Klicke auf Weiter bis zum Schritt KI-Anbieter. Dort findest du Unbottled AI Cloud. Lass https://unbottled.ai als Zieladresse stehen, gib deine Cloud-Zugangsdaten ein, wähle die Daten für die Synchronisierung aus und klicke auf Anmelden.",
    },
    privacy:
      "Wenn Erinnerungen, Dokumente, Skills, Favoriten und Chats lokal bleiben sollen, schalte alle fünf Optionen aus. Der Assistent aktiviert die ersten vier standardmäßig. Für die Modellanfrage erhält unbottled.ai deinen Prompt, den nötigen Kontext und die Anhänge, die du mitschickst.",
    verify: {
      title: "Testnachricht senden",
      body: "Wechsle zurück zum lokalen Chat und lade die Seite neu. Falls die Assistentenauswahl erscheint, wähle einen Assistenten. Starte einen privaten Chat und wähle ein Modell des verbundenen Anbieters. Die Anfrage läuft über dein Konto bei unbottled.ai.",
    },
    cli: {
      title: "Im Terminal verbinden",
      body: "Lass die aus dem Quellcode gestartete App laufen und öffne ein zweites Terminal im selben Projektordner. Ersetze die Beispieladresse und das Platzhalterpasswort durch deine Cloud-Zugangsdaten. Der Befehl schaltet alle fünf Synchronisierungsoptionen aus. Im Browser-Assistenten taucht dein Passwort weder im Befehlsverlauf noch in Prozessargumenten auf.",
      diagnostics:
        "Prüfe in der Verbindungsliste, ob der KI-Anbieter aktiv ist.",
    },
  },
  standalone: {
    title: "Eigenständig mit eigenen API-Schlüsseln",
    intro:
      "Verbinde deinen KI-Anbieter und bezahle ihn direkt. Für diese Variante brauchst du kein unbottled.ai-Konto.",
    start: {
      title: "next-vibe einrichten",
      body: "Installiere next-vibe und richte die lokale .env-Datei ein. Weiter unten findest du die Docker-Variante.",
    },
    provider: {
      title: "API-Schlüssel hinterlegen",
      body: "Für OpenRouter fügst du diese Zeile in .env ein und ersetzt den Platzhalter durch deinen Schlüssel. In .env.example stehen die Einstellungen für weitere Anbieter.",
      key: "OpenRouter-Schlüssel holen",
    },
    verify: {
      title: "Chat starten",
      body: "Starte die App neu, falls sie bereits läuft. Melde dich mit deinem lokalen Admin-Konto an, wähle ein verfügbares OpenRouter-Modell und sende eine Nachricht.",
    },
  },
  install: {
    title: "next-vibe installieren",
    requirements:
      "Du brauchst Git, Node.js ab Version 22 und Bun im PATH. Der Quellcode verwendet Bun 1.4.4. Die lokale Einrichtung betreibt PostgreSQL über PGlite im selben Prozess. Docker und ein separater Datenbankserver sind optional.",
    checkout: {
      title: "Mit einem Befehl installieren",
      body: "Führe den Befehl unter Linux oder macOS in Bash oder Zsh aus, unter Windows in PowerShell 7. Er klont das Projekt, installiert beim ersten Mal die festgeschriebenen Abhängigkeiten und richtet den Befehl vibe ein.",
      windows:
        "Offiziell unterstützt ist Linux. Der Installer berücksichtigt auch macOS und Windows. Nutze unter Windows einen Projektpfad ohne Leerzeichen. Scheitert die native Installation, führe die Linux-Schritte in WSL aus.",
    },
    config: {
      title: "Speicher und Anmeldung einrichten",
      body: "Öffne .env im Projektordner. Falls die Datei fehlt, kopiere .env.example nach .env. Setze die Datenbank-URL wie unten gezeigt und lege VIBE_ADMIN_USER_EMAIL und VIBE_ADMIN_USER_PASSWORD fest. Betreibe den Entwicklungsserver auf einem privaten Rechner oder in einem privaten Netz.",
      secrets:
        "Führe den Befehl zweimal aus und setze JWT_SECRET_KEY und CRON_SECRET auf je einen der beiden Werte. Behalte beide Werte bei Neustarts bei.",
    },
    run: {
      title: "next-vibe starten",
      body: "Führe den Befehl im Projektordner aus und lass das Terminal offen. Öffne die beim Start angezeigte Adresse, üblicherweise http://localhost:3000. Melde dich mit den lokalen Admin-Zugangsdaten aus .env an.",
    },
  },
  docker: {
    title: "Mit Docker Compose betreiben",
    intro:
      "Die eigenständige Compose-Konfiguration startet die App, PostgreSQL, Redis und MinIO auf einem Linux-Host mit x86-64. Du brauchst Docker und eine Compose-Version, die !override und !reset unterstützt. Der App-Build kann rund 8 GB RAM belegen.",
    config: {
      title: "Projektordner und .env vorbereiten",
      body: "Falls du den Quellcode schon geklont hast, verwende denselben Ordner. Sonst führe diese Befehle aus.",
      env: "Kopiere .env.example nach .env. Setze die lokalen Admin-Zugangsdaten und beide Geheimschlüssel wie oben. Übernimm die folgenden Einstellungen und erzeuge einen dritten Hex-Wert als Datenbankpasswort. Hinterlege bei eigenständigem Betrieb die API-Schlüssel vor dem Start. Verbinde dein Cloud-Konto, solange die App-Adresse noch localhost ist. Trage für den öffentlichen Zugriff die erreichbare Adresse in NEXT_PUBLIC_APP_URL ein und richte HTTPS ein, bevor du die App freigibst.",
    },
    run: {
      title: "Images bauen und Container starten",
      body: "Compose baut die Images für die App und PostgreSQL aus dem Projektordner. Sobald die App läuft, öffne ihre konfigurierte Adresse, melde dich als Admin an und folge oben der passenden Anleitung.",
    },
  },
  update: {
    title: "Instanz aktualisieren",
    intro:
      "Sichere vor dem Update deine .env, die Datenbank und hochgeladene Dateien.",
    source: {
      title: "Installation aus dem Quellcode",
      body: "Stoppe den lokalen Server mit Strg+C. Hole im selben Projektordner den aktuellen Stand, installiere die Abhängigkeiten und starte den Server wieder. Beim Start laufen ausstehende Datenbankmigrationen.",
    },
    docker:
      "Hole im selben Projektordner die Änderungen und baue die Container-Images neu. Lass .env und die Datenverzeichnisse an ihrem Platz.",
  },
  troubleshoot: {
    title: "Fehler beheben",
    path: {
      title: "Das Terminal findet vibe nicht",
      body: "Öffne ein neues Terminal. Fehlt der Befehl weiterhin, starte den Bootstrap direkt aus dem Projektordner.",
    },
    connect: {
      title: "Die Cloud-Verbindung schlägt fehl",
      body: "Prüfe die E-Mail-Adresse und das Passwort deines Cloud-Kontos, kontrolliere die Freischaltung des Kontos und lass die lokale App laufen. Wenn dein Cloud-Konto bei der Anmeldung einen zweiten Faktor verlangt, nutze die eigenständige Variante. Ein bezahltes Kundenkonto kann bis zu drei Instanzen verbinden. Gib einem bereits verbundenen Rechner unter Fernverbindungen eine eigene ID, bevor du den nächsten verbindest. Zeigt der Assistent nur einen allgemeinen Fehler, prüfe das lokale Serverprotokoll oder nutze den Verbindungsbefehl im Terminal.",
    },
    models: {
      title: "Die Modellauswahl ist leer",
      body: "Prüfe bei Cloud-Nutzung, ob die Verbindung aktiv ist. Falls du sie außerhalb des Assistenten eingerichtet hast, muss sie als Inferenzanbieter aktiviert sein. Im eigenständigen Betrieb prüfst du den Schlüssel in .env und das Guthaben beim Anbieter. Starte die App anschließend neu.",
    },
    credits: {
      title: "Die lokale App meldet zu wenig Guthaben",
      body: "Beide Varianten prüfen auch dein lokales Guthaben. Öffne im lokalen Admin-Dashboard den Bereich Nutzer, wähle dein lokales Konto und klicke auf Credits vergeben. Das Guthaben steigt nur auf deiner Instanz. Die Anfragen rechnet dein Anbieter oder unbottled.ai weiterhin über das verbundene Konto ab.",
    },
    docker: {
      title: "Der Container startet nicht",
      body: "Suche im App-Protokoll nach dem ersten Fehler. Wenn beim App-Build der Arbeitsspeicher ausgeht, gib Docker mehr RAM oder starte die App aus dem Quellcode.",
    },
    issue: "Einrichtungsproblem melden",
  },
};
