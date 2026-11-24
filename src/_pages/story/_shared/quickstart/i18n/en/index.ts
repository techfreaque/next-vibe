export const translations = {
  requirements: {
    label: "You need",
    os: "macOS, Linux or Windows",
    git: "git",
    bun: "Bun 1.3+",
  },
  prereqs: {
    step: "Once per machine",
    title: "Install git and Bun",
    platformLabel: "Your system",
    gitXcode: "git (Xcode Command Line Tools)",
    gitBrew: "or with Homebrew",
    gitApt: "git + unzip, Debian / Ubuntu",
    gitDnf: "git + unzip, Fedora",
    gitPacman: "git + unzip, Arch",
    gitWinget: "git",
    bun: "Bun",
    bunWindows: "Bun (PowerShell)",
    check: "Check: 1.3 or newer",
    newTerminal: "Then open a new terminal, so git and bun are on your PATH.",
  },
  terminal: {
    step: "Then",
    title: "Run it",
    copyAll: "Copy all",
    copy: "Copy",
    copied: "Copied",
    clone: "Get the code",
    cd: "Step inside",
    install: "Install. Also puts vibe on your PATH.",
    dev: "Start. Database, migrations and seed data run on their own.",
    fallback:
      "Shell says vibe: command not found? Open a new terminal, or run bun run dev.",
    port: "Port 3000 already in use? Start on another one: vibe dev --port=4000, then open localhost:4000.",
    postgres:
      "Default: embedded Postgres (PGlite), no Docker. Want full Postgres? Change DATABASE_URL in the settings; vibe dev starts it in Docker on the next run.",
  },
  browser: {
    step: "Finally",
    title: "Everything else happens in the browser",
    open: {
      title: "Open localhost:3000",
      body: "Click Log In, top right.",
    },
    admin: {
      title: "Pick the ADMIN account",
      body: "In the Dev Quick Login box. The setup wizard opens.",
    },
    account: {
      title: "Set your admin login",
      body: "Your email, your password. Security keys are already generated.",
    },
    provider: {
      title: "Choose your AI",
      body: "Sign in with your unbottled.ai account, or paste your own provider key. Finish. Start chatting.",
    },
  },
};
