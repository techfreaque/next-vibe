import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  requirements: {
    label: "Ti serve",
    os: "macOS, Linux o Windows",
    git: "git",
    bun: "Bun 1.3+",
  },
  prereqs: {
    step: "Una volta per computer",
    title: "Installa git e Bun",
    platformLabel: "Il tuo sistema",
    gitXcode: "git (Xcode Command Line Tools)",
    gitBrew: "oppure con Homebrew",
    gitApt: "git + unzip, Debian / Ubuntu",
    gitDnf: "git + unzip, Fedora",
    gitPacman: "git + unzip, Arch",
    gitWinget: "git",
    bun: "Bun",
    bunWindows: "Bun (PowerShell)",
    check: "Verifica la versione: 1.3 o successiva",
    newTerminal: "Poi apri un nuovo terminale per trovare git e bun nel PATH.",
  },
  terminal: {
    step: "Poi",
    title: "Avvia l’istanza",
    copyAll: "Copia tutto",
    copy: "Copia",
    copied: "Copiato",
    clone: "Scarica il codice",
    cd: "Entra nella cartella",
    install: "Installa. Il comando aggiunge anche vibe al PATH.",
    dev: "Avvia. Il database, le migrazioni e i dati iniziali si configurano da soli.",
    fallback:
      "La shell dice «vibe: command not found»? Apri un nuovo terminale o esegui bun run dev.",
    postgres:
      "Di default usi Postgres integrato (PGlite) senza Docker. Se vuoi Postgres completo, imposta DATABASE_URL. Al prossimo avvio, vibe dev lo esegue in Docker.",
  },
  browser: {
    step: "Infine",
    title: "Completa la configurazione nel browser",
    open: {
      title: "Apri localhost:3000",
      body: "Fai clic su Accedi, in alto a destra.",
    },
    admin: {
      title: "Seleziona l’account ADMIN",
      body: "Nel riquadro Dev Quick Login. Si apre la configurazione guidata.",
    },
    account: {
      title: "Imposta l’accesso amministratore",
      body: "Inserisci la tua email e la tua password. Le chiavi di sicurezza sono già pronte.",
    },
    provider: {
      title: "Scegli la tua IA",
      body: "Accedi con il tuo account unbottled.ai o incolla la chiave del tuo fornitore. Termina la configurazione e inizia a chattare.",
    },
  },
};
