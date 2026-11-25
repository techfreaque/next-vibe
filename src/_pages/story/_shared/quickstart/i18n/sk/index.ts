import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  requirements: {
    label: "Čo potrebuješ",
    os: "macOS, Linux alebo Windows",
    git: "git",
    bun: "Bun 1.3 alebo novší",
  },
  prereqs: {
    step: "Raz na každom počítači",
    title: "Nainštaluj git a Bun",
    platformLabel: "Tvoj systém",
    gitXcode: "git (Xcode Command Line Tools)",
    gitBrew: "alebo cez Homebrew",
    gitApt: "git a unzip pre Debian a Ubuntu",
    gitDnf: "git a unzip pre Fedoru",
    gitPacman: "git a unzip pre Arch",
    gitWinget: "git",
    bun: "Bun",
    bunWindows: "Bun (PowerShell)",
    check: "Over, či máš verziu 1.3 alebo novšiu",
    newTerminal:
      "Potom otvor nový terminál, aby v ňom boli príkazy git a bun dostupné cez PATH.",
  },
  terminal: {
    step: "Ďalší krok",
    title: "Spusti aplikáciu",
    copyAll: "Skopírovať všetko",
    copy: "Skopírovať",
    copied: "Skopírované",
    clone: "Stiahni si zdrojový kód",
    cd: "Prejdi do adresára projektu",
    install: "Nainštaluj závislosti. Príkaz vibe sa zároveň pridá do PATH.",
    dev: "Spusti aplikáciu. Databáza sa pripraví, migrácie sa vykonajú a úvodné údaje sa doplnia automaticky.",
    fallback:
      "Hlási terminál „vibe: command not found“? Otvor nový terminál alebo použi bun run dev.",
    port: "Je port 3000 obsadený? Spusti vibe dev --port=4000 a otvor localhost:4000.",
    postgres:
      "Predvolene sa používa vstavaný Postgres (PGlite) bez Dockera. Ak chceš plný Postgres, zmeň v nastaveniach DATABASE_URL. Pri ďalšom spustení ho vibe dev spustí v Dockeri.",
  },
  browser: {
    step: "Nakoniec",
    title: "Zvyšok nastavíš v prehliadači",
    open: {
      title: "Otvor localhost:3000",
      body: "Vpravo hore klikni na Prihlásiť sa.",
    },
    admin: {
      title: "Vyber účet ADMIN",
      body: "Nájdeš ho v časti na rýchle prihlásenie pri vývoji. Otvorí sa sprievodca nastavením.",
    },
    account: {
      title: "Nastav si prihlásenie správcu",
      body: "Zadaj svoj e-mail a heslo. Bezpečnostné kľúče sú už pripravené.",
    },
    provider: {
      title: "Vyber si AI",
      body: "Prihlás sa účtom unbottled.ai alebo vlož vlastný kľúč poskytovateľa. Dokonči nastavenie a začni četovať.",
    },
  },
};
