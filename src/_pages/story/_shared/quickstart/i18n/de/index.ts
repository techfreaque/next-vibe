import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  requirements: {
    label: "Du brauchst",
    os: "macOS, Linux oder Windows",
    git: "git",
    bun: "Bun 1.3+",
  },
  prereqs: {
    step: "Einmal pro Rechner",
    title: "git und Bun installieren",
    platformLabel: "Dein System",
    gitXcode: "git (Xcode Command Line Tools)",
    gitBrew: "oder mit Homebrew",
    gitApt: "git + unzip, Debian / Ubuntu",
    gitDnf: "git + unzip, Fedora",
    gitPacman: "git + unzip, Arch",
    gitWinget: "git",
    bun: "Bun",
    bunWindows: "Bun (PowerShell)",
    check: "Prüfen: 1.3 oder neuer",
    newTerminal:
      "Danach ein neues Terminal öffnen, damit git und bun im PATH sind.",
  },
  terminal: {
    step: "Dann",
    title: "Starten",
    copyAll: "Alles kopieren",
    copy: "Kopieren",
    copied: "Kopiert",
    clone: "Code holen",
    cd: "Ins Verzeichnis",
    install: "Installieren. Legt vibe gleich in deinen PATH.",
    dev: "Starten. Datenbank, Migrationen und Seed-Daten laufen von selbst.",
    fallback:
      "Die Shell kennt vibe nicht? Neues Terminal öffnen oder bun run dev ausführen.",
    port: "Port 3000 schon belegt? Auf einem anderen starten: vibe dev --port=4000, dann localhost:4000 öffnen.",
    postgres:
      "Standard: eingebettetes Postgres (PGlite), ohne Docker. Lieber volles Postgres? DATABASE_URL in den Einstellungen ändern; vibe dev startet es beim nächsten Start in Docker.",
  },
  browser: {
    step: "Zum Schluss",
    title: "Alles Weitere passiert im Browser",
    open: {
      title: "localhost:3000 öffnen",
      body: "Oben rechts auf Anmelden klicken.",
    },
    admin: {
      title: "Das ADMIN-Konto wählen",
      body: "Im Kasten Schnell-Login (Dev). Der Einrichtungsassistent startet.",
    },
    account: {
      title: "Admin-Zugang festlegen",
      body: "Deine E-Mail, dein Passwort. Die Sicherheitsschlüssel sind schon erzeugt.",
    },
    provider: {
      title: "KI-Anbieter wählen",
      body: "Mit deinem unbottled.ai-Konto anmelden oder einen eigenen Anbieter-Schlüssel einfügen. Fertig. Losschreiben.",
    },
  },
};
