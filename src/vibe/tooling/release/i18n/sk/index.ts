import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Nástroj na vydávanie",
  titleShort: "Nástroj na vydávanie",
  description:
    "Správa vydaní balíkov so zvyšovaním verzií, značkami v Gite a integráciou CI/CD.",
  category: "Nástroj na vydávanie",
  tags: {
    release: "Vydanie",
  },
  enums: {
    versionIncrement: {
      patch: "Patch",
      minor: "Vedľajšia verzia (minor)",
      major: "Hlavná verzia (major)",
      prepatch: "Pre-patch",
      preminor: "Pre-minor",
      premajor: "Pre-major",
      prerelease: "Predbežné vydanie",
    },
    packageManager: {
      bun: "Bun",
      npm: "NPM",
      yarn: "Yarn",
      pnpm: "PNPM",
      deno: "Deno",
    },
    webhookType: {
      slack: "Slack",
      discord: "Discord",
      teams: "Microsoft Teams",
      custom: "Vlastné",
    },
    npmAccess: {
      public: "Verejné",
      restricted: "Obmedzené",
    },
    changelogPreset: {
      "conventional-commits": "Conventional Commits",
      angular: "Angular",
      atom: "Atom",
      eslint: "ESLint",
      ember: "Ember",
    },
  },
  form: {
    title: "Nastavenia vydania",
    description: "Nastavenia vydávania balíkov",
  },
  fields: {
    configPath: {
      title: "Cesta ku konfigurácii",
      description:
        "Cesta ku konfiguračnému súboru vydania (predvolene release.config.ts)",
    },
    ci: {
      title: "Režim CI",
      description:
        "Spustí sa v režime CI bez interaktívnych otázok. Použije ciReleaseCommand.",
    },
    forceUpdate: {
      title: "Vynútiť aktualizáciu závislostí",
      description:
        "Vynúti aktualizáciu všetkých závislostí bez potvrdenia. Ostatné kroky preskočí.",
    },
    dryRun: {
      title: "Skúšobné spustenie",
      description: "Simuluje vydanie bez vykonania zmien.",
    },
    skipLint: {
      title: "Preskočiť kontrolu linterom",
      description: "Preskočí kontrolu linterom.",
    },
    skipTypecheck: {
      title: "Preskočiť kontrolu typov",
      description: "Preskočí kontrolu typov TypeScriptu.",
    },
    skipBuild: {
      title: "Preskočiť zostavenie",
      description: "Preskočí zostavenie.",
    },
    skipTests: {
      title: "Preskočiť testy",
      description: "Preskočí spúšťanie testov.",
    },
    skipSnyk: {
      title: "Preskočiť Snyk",
      description: "Preskočí kontrolu zraniteľností nástrojom Snyk.",
    },
    skipPublish: {
      title: "Preskočiť publikovanie",
      description: "Preskočí publikovanie do registra npm.",
    },
    skipChangelog: {
      title: "Preskočiť zoznam zmien",
      description: "Preskočí generovanie zoznamu zmien.",
    },
    prereleaseId: {
      title: "ID predbežného vydania",
      description:
        "Identifikátor predbežného vydania na zvýšenie verzie (alpha, beta alebo rc)",
    },
    versionIncrement: {
      title: "Zvýšenie verzie",
      description:
        "Typ zvýšenia verzie (patch, minor alebo major). Platí iba v lokálnom režime.",
    },
    targetPackage: {
      title: "Cieľový balík",
      description:
        "Voliteľný adresár cieľového balíka. Predvolene sa spracujú všetky balíky.",
    },
    inlineConfig: {
      title: "Priamo zadané nastavenia",
      description:
        "Prijme nastavenia vydania priamo bez načítania konfiguračného súboru.",
    },
    skipGitTag: {
      title: "Preskočiť značku Git",
      description: "Preskočí vytvorenie značky Git pri vydaní.",
    },
    skipGitPush: {
      title: "Preskočiť odoslanie zmien Git",
      description: "Preskočí odoslanie zmien do vzdialeného repozitára.",
    },
    verbose: {
      title: "Podrobné",
      description: "Zapne podrobný výstup záznamov.",
    },
    skipInstall: {
      title: "Preskočiť inštaláciu",
      description: "Preskočí inštaláciu závislostí.",
    },
    skipClean: {
      title: "Preskočiť čistenie",
      description: "Preskočí čistenie pred zostavením.",
    },
    commitMessage: {
      title: "Správa commitu",
      description:
        // eslint-disable-next-line no-template-curly-in-string -- Intentional template placeholder documentation
        "Vlastná správa commitu pri zvýšení verzie. Podporuje zástupný výraz ${version}.",
    },
    notifyWebhook: {
      title: "Webhook oznámení",
      description:
        "Adresa URL webhooku na oznámenia o vydaní (Slack, Discord, Teams alebo vlastná služba)",
    },
    configObject: {
      title: "Konfiguračný objekt",
      description: "Nastavenie konfigurácie vydania",
    },
    packageManager: {
      title: "Správca balíkov",
      description:
        "Správca balíkov pre vydávanie (bun, npm, yarn, pnpm alebo deno)",
    },
    globalVersion: {
      title: "Globálna verzia",
      description: "Nastaviť globálnu verziu pre všetky balíky v monorepo",
    },
    parallel: {
      title: "Súbežné vykonávanie",
      description: "Povoliť paralelné spracovanie balíkov",
    },
    maxParallelJobs: {
      title: "Najviac súbežných úloh",
      description: "Najvyšší počet úloh, ktoré sa môžu vykonávať súbežne",
    },
    continueOnError: {
      title: "Pokračovať pri chybe",
      description:
        "Pokračovať v spracovaní zostávajúcich balíkov, ak jeden zlyhá",
    },
    verifyGitStatus: {
      title: "Overiť stav Git",
      description: "Pred vydaním skontroluje stav pomocou git status",
    },
    requireCleanWorkingDir: {
      title: "Vyžadovať čistý pracovný strom",
      description:
        "Pred vydaním vyžaduje čistý pracovný strom Git bez zmien nezahrnutých v commite.",
    },
    verifyLockfile: {
      title: "Overiť lockfile",
      description:
        "Pred vydaním overí integritu súboru so zamknutými verziami závislostí.",
    },
    branch: {
      title: "Nastavenie vetiev",
      description: "Nastavenia vetiev Git",
    },
    branchMain: {
      title: "Hlavná vetva",
      description: "Názov hlavnej alebo produkčnej vetvy",
    },
    branchDevelop: {
      title: "Vývojová vetva",
      description: "Názov vývojovej vetvy",
    },
    allowNonMain: {
      title: "Povoliť vydania z iných vetiev",
      description: "Povolí vydanie aj z iných vetiev ako main.",
    },
    protectedBranches: {
      title: "Chránené vetvy",
      description: "Názvy chránených vetiev",
    },
    notifications: {
      title: "Oznámenia",
      description: "Nastavenia oznámení o vydávaní",
    },
    notificationsEnabled: {
      title: "Povoliť oznámenia",
      description: "Zapne oznámenia o vydaniach.",
    },
    webhookUrl: {
      title: "Adresa URL webhooku",
      description: "Adresa URL webhooku na oznámenia",
    },
    webhookType: {
      title: "Typ webhooku",
      description: "Typ webhooku (Slack, Discord, Teams alebo vlastný)",
    },
    onSuccess: {
      title: "Upozorniť pri úspechu",
      description: "Poslať oznámenie pri úspešnom vydaní",
    },
    onFailure: {
      title: "Upozorniť na zlyhanie",
      description: "Poslať oznámenie pri neúspešnom vydaní",
    },
    messageTemplate: {
      title: "Šablóna správy",
      description: "Vlastná šablóna správ pre oznámenia",
    },
    includeTimings: {
      title: "Zahrnúť časy",
      description: "Pridať do oznámení časové údaje",
    },
    retry: {
      title: "Nastavenia opakovaných pokusov",
      description: "Nastavenia opakovania neúspešných operácií",
    },
    maxAttempts: {
      title: "Najviac pokusov",
      description: "Najvyšší počet opakovaných pokusov",
    },
    delayMs: {
      title: "Odstup medzi pokusmi",
      description: "Počiatočný odstup medzi pokusmi v milisekundách",
    },
    backoffMultiplier: {
      title: "Násobiteľ odstupu",
      description:
        "Násobiteľ exponenciálneho predlžovania odstupu medzi pokusmi",
    },
    maxDelayMs: {
      title: "Max. oneskorenie",
      description: "Najdlhší odstup medzi pokusmi v milisekundách",
    },
    rollback: {
      title: "Nastavenia vrátenia zmien",
      description: "Nastavenia automatického vrátenia zmien pri zlyhaní",
    },
    rollbackEnabled: {
      title: "Povoliť vrátenie zmien",
      description: "Pri zlyhaní vykonať automatické vrátenie zmien",
    },
    rollbackGit: {
      title: "Vrátiť zmeny v Gite",
      description: "Pri zlyhaní vráti commity a značky Gitu",
    },
    rollbackVersion: {
      title: "Vrátiť zmeny verzie",
      description: "Pri zlyhaní vrátiť verziu na pôvodnú hodnotu",
    },
    packages: {
      title: "Balíky",
      description: "Zoznam balíkov na vydanie",
    },
    package: {
      title: "Nastavenie balíka",
    },
    directory: {
      title: "Adresár",
    },
    name: {
      title: "Názov",
    },
    updateDeps: {
      title: "Aktualizovať závislosti",
      description: "Aktualizácia závislostí v závislých balíkoch",
    },
    clean: {
      title: "Príkaz na čistenie",
      description: "Príkaz alebo skript na vyčistenie balíka",
    },
    lint: {
      title: "Príkaz lintera",
      description: "Príkaz alebo skript na kontrolu balíka linterom",
    },
    typecheck: {
      title: "Príkaz na kontrolu typov",
      description: "Príkaz alebo skript na kontrolu typov balíka",
    },
    build: {
      title: "Príkaz na zostavenie",
      description: "Príkaz alebo skript na zostavenie balíka",
    },
    test: {
      title: "Príkaz na spustenie testov",
      description: "Príkaz alebo skript na testovanie balíka",
    },
    snyk: {
      title: "Kontrola cez Snyk",
      description: "Povoliť bezpečnostnú kontrolu nástrojom Snyk",
    },
    install: {
      title: "Príkaz na inštaláciu",
      description: "Príkaz alebo skript na inštaláciu závislostí",
    },
    release: {
      title: "Nastavenia vydania",
    },
    releaseVersion: {
      title: "Verzia vydania",
    },
    tagPrefix: {
      title: "Predpona značky",
    },
    tagSuffix: {
      title: "Prípona značky",
    },
    ciReleaseCommand: {
      title: "Príkaz na vydanie v CI",
      description: "Príkaz na vydanie v režime CI",
    },
    ciCommand: {
      title: "Príkaz",
      description: "Príkaz a jeho argumenty vo forme poľa",
    },
    ciEnvMapping: {
      title: "Mapovanie premenných prostredia",
      description: "Mapovanie premenných prostredia pre CI",
    },
    gitOps: {
      title: "Operácie s Gitom",
    },
    skipTag: {
      title: "Nevytvárať značku",
    },
    skipPush: {
      title: "Neodosielať zmeny",
    },
    skipCommit: {
      title: "Preskočiť commit",
    },
    signCommit: {
      title: "Podpísať commit",
    },
    signTag: {
      title: "Podpísať značku",
    },
    remote: {
      title: "Vzdialený repozitár",
    },
    npm: {
      title: "Nastavenia npm",
    },
    npmEnabled: {
      title: "Povoliť publikovanie do npm",
    },
    npmRegistry: {
      title: "Register npm",
    },
    npmTag: {
      title: "Značka npm",
    },
    npmAccess: {
      title: "Prístup v npm",
    },
    otpEnvVar: {
      title: "Premenná prostredia pre OTP",
    },
    provenance: {
      title: "Potvrdenie pôvodu balíka",
    },
    ignoreScripts: {
      title: "Ignorovať skripty",
    },
    npmDryRun: {
      title: "Skúšobné publikovanie do npm",
    },
    jsr: {
      title: "Nastavenie JSR",
    },
    jsrEnabled: {
      title: "Povoliť publikovanie do JSR",
    },
    allowSlowTypes: {
      title: "Povoliť pomaly vyhodnocované typy",
    },
    allowDirty: {
      title: "Povoliť zmeny bez commitu",
    },
    jsrDryRun: {
      title: "Skúšobné publikovanie do JSR",
    },
    changelog: {
      title: "Nastavenia zoznamu zmien",
    },
    changelogEnabled: {
      title: "Povoliť zoznam zmien",
    },
    changelogFile: {
      title: "Súbor zoznamu zmien",
    },
    changelogHeader: {
      title: "Hlavička zoznamu zmien",
    },
    compareUrlFormat: {
      title: "Formát adresy URL porovnania",
    },
    commitUrlFormat: {
      title: "Formát adresy URL commitu",
    },
    includeBody: {
      title: "Zahrnúť telo správy",
    },
    changelogPreset: {
      title: "Predvoľba zoznamu zmien",
    },
    gitRelease: {
      title: "Nastavenia vydania v Gite",
    },
    gitReleaseEnabled: {
      title: "Zapnúť vydanie v Gite",
    },
    releaseTitle: {
      title: "Názov vydania",
    },
    generateNotes: {
      title: "Generovať poznámky k vydaniu",
    },
    releaseBody: {
      title: "Opis vydania",
    },
    draft: {
      title: "Návrh",
    },
    prerelease: {
      title: "Predbežné vydanie",
    },
    discussionCategory: {
      title: "Kategória diskusie",
    },
    target: {
      title: "Cieľ",
    },
    assets: {
      title: "Prílohy",
      description: "Súbory, ktoré sa nahrajú k vydaniu",
    },
    foldersToZip: {
      title: "Priečinky na zabalenie do ZIP",
      description: "Priečinky na zabalenie do ZIP pri vydaní",
    },
    versionBumper: {
      title: "Zvýšenie verzie",
      description: "Nastavenia zvyšovania verzie v súboroch mimo package.json",
    },
    hooks: {
      title: "Akcie v jednotlivých fázach",
      description: "Príkazy na spustenie v rôznych fázach",
    },
    preInstall: {
      title: "Akcia pred inštaláciou",
    },
    postInstall: {
      title: "Akcia po inštalácii",
    },
    preClean: {
      title: "Akcia pred čistením",
    },
    postClean: {
      title: "Akcia po čistení",
    },
    preLint: {
      title: "Akcia pred kontrolou linterom",
    },
    postLint: {
      title: "Akcia po kontrole linterom",
    },
    preTypecheck: {
      title: "Akcia pred kontrolou typov",
    },
    postTypecheck: {
      title: "Akcia po kontrole typov",
    },
    preBuild: {
      title: "Akcia pred zostavením",
    },
    postBuild: {
      title: "Akcia po zostavení",
    },
    preTest: {
      title: "Akcia pred testovaním",
    },
    postTest: {
      title: "Akcia po testovaní",
    },
    prePublish: {
      title: "Akcia pred publikovaním",
    },
    postPublish: {
      title: "Akcia po publikovaní",
    },
    preRelease: {
      title: "Akcia pred vydaním",
    },
    postRelease: {
      title: "Akcia po vydaní",
    },
    globalHooks: {
      title: "Globálne akcie",
      description: "Globálne akcie pre celý proces vydávania",
    },
  },
  response: {
    status: "Stav",
    success: "Stav vydania",
    output: "Záznam vydania",
    duration: "Trvanie",
    packages: "Balíky",
    packagesProcessed: "Spracované balíky",
    ciEnvironment: "Prostredie CI",
    errors: "Chyby",
    warnings: "Upozornenia",
    gitInfo: "Informácie o Gite",
    published: "Publikované balíky",
    publishedPackages: "Publikované balíky",
    timings: "Výkonnosť",
    rollbackPerformed: "Zmeny boli vrátené",
    notificationsSent: "Oznámenia",
  },
  table: {
    name: "Balík",
    directory: "Adresár",
    version: "Verzia",
    tag: "Značka",
    status: "Stav",
    message: "Správa",
    registry: "Register",
    url: "URL",
  },
  errors: {
    validation: {
      title: "Chyba overenia",
      description: "Neplatná konfigurácia vydania",
    },
    notFound: {
      title: "Nenájdené",
      description: "Konfiguračný súbor alebo balík sa nenašiel",
    },
    server: {
      title: "Chyba servera",
      description: "Pri vydávaní nastala chyba",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    network: {
      title: "Chyba siete",
      description: "Chyba siete počas procesu vydania",
    },
    unauthorized: {
      title: "Bez oprávnenia",
      description: "Na vydanie nemáte oprávnenie",
    },
    forbidden: {
      title: "Prístup zakázaný",
      description: "Na vykonanie vydania nemáte oprávnenie",
    },
    conflict: {
      title: "Konflikt",
      description: "Zistil sa konflikt pri vydávaní. Značka už môže existovať.",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Pred vydaním uložte zmeny do commitu",
    },
    packageNotFound: "Balík „{{targetPackage}}“ sa v konfigurácii nenašiel",
    gitOperationFailed: "Operácia Git zlyhala: {{error}}",
    gitAddFailed: "Príkaz git add zlyhal: {{error}}",
    gitTagFailed: "Vytvorenie značky Git „{{tag}}“ zlyhalo: {{error}}",
    gitPushFailed: "Príkaz git push do „{{remote}}“ zlyhal: {{error}}",
    gitPushTagFailed:
      "Odoslanie značky Git „{{tag}}“ do „{{remote}}“ zlyhalo: {{error}}",
  },
  success: {
    title: "Vydanie dokončené",
    description: "Proces vydania sa úspešne dokončil",
  },
  config: {
    fileNotFound: "Konfiguračný súbor {{path}} sa nenašiel.",
    invalidFormat:
      "Neplatný formát konfigurácie. Konfigurácia musí predvolene exportovať objekt s poľom packages. Podrobnosti nájdete v dokumentácii.",
    errorLoading: "Chyba pri načítavaní konfigurácie: {{error}}",
  },
  packageJson: {
    notFound: "Súbor package.json sa nenašiel: {{path}}",
    invalidFormat: "Neplatný formát súboru package.json: {{path}}",
    errorReading: "Chyba pri čítaní súboru package.json: {{error}}",
    errorUpdatingDeps:
      "Chyba pri aktualizácii závislostí pre {{directory}}: {{error}}",
    errorUpdatingVersion:
      "Chyba pri aktualizácii verzie balíka v {{directory}}: {{error}}",
  },
  scripts: {
    invalidPackageJson: "Neplatný formát súboru package.json v {{path}}",
    testsFailed: "Testy zlyhali v {{path}}: {{error}}",
    lintFailed: "Kontrola linterom v {{path}} zlyhala: {{output}}",
    typecheckFailed: "Kontrola typov v {{path}} zlyhala: {{error}}",
    buildFailed: "Zostavenie v {{path}} zlyhalo: {{error}}",
    packageJsonNotFound: "Súbor package.json sa v {{path}} nenašiel",
  },
  snyk: {
    cliNotFound:
      "Snyk CLI sa nenašiel. Nainštalujte ho príkazom npm install -g snyk.",
    testFailed:
      "Kontrola zraniteľností Snyk pre {{packageName}} zlyhala: {{error}}",
    tokenRequired:
      "Balík {{packageName}} vyžaduje premennú prostredia SNYK_TOKEN",
    orgKeyRequired:
      "Balík {{packageName}} vyžaduje premennú prostredia SNYK_ORG_KEY",
    monitorFailed: "Monitor Snyk zlyhal pre {{packageName}}: {{error}}",
  },
  git: {
    tagCreated: "Značka Git „{{tag}}“ bola vytvorená",
    tagExists: "Značka Git „{{tag}}“ už existuje",
    pushSuccess: "Zmeny sa odoslali do vzdialeného repozitára",
    noCommits: "Od značky „{{lastTag}}“ nevznikli žiadne nové commity",
    uncommittedChanges: "Zistili sa zmeny bez commitu",
    notOnMain: "Očakávaná vetva „{{main}}“. Aktuálna vetva: {{currentBranch}}.",
    commitFailed: "Zmeny sa nepodarilo uložiť do commitu",
    tagFailed: "Značku sa nepodarilo vytvoriť",
    pushFailed: "Zmeny sa nepodarilo odoslať do vzdialeného repozitára",
  },
  version: {
    bumped: "Verzia sa zvýšila z {{from}} na {{to}} ({{increment}})",
    fileUpdated: "Verzia v {{file}} sa aktualizovala na {{newVersion}}",
    invalidFormat: "Neplatný formát verzie: {{version}}",
  },
  ci: {
    commandRunning:
      "Spúšťa sa príkaz na vydanie balíka {{package}} v CI: {{command}}",
    commandSuccess: "Príkaz na vydanie balíka {{package}} v CI sa dokončil",
    commandFailed:
      "Príkaz na vydanie balíka {{package}} v CI zlyhal: {{error}}",
    commandRequired:
      "Režim CI vyžaduje konfiguráciu ciReleaseCommand pre {{package}}",
    envVarMissing:
      "Požadovaná premenná prostredia '{{variable}}' nie je nastavená pre {{package}}",
  },
  zip: {
    starting: "Priečinky sa balia do ZIP…",
    complete: "Úspešne zips {{input}} na {{output}} (Byty {{bytes}})",
    failed: "Priečinok {{input}} sa nepodarilo zabaliť do ZIP: {{error}}",
    noFolders: "Konfigurácia neobsahuje priečinky na zabalenie do ZIP",
    inputNotFound: "Vstupný priečinok {{input}} neexistuje",
  },
  dryRun: {
    prefix: "[DRY RUN]",
    wouldExecute: "Vykonala by sa akcia: {{action}}",
  },
  release: {
    starting: "Spúšťa sa vydanie…",
    ciMode: "Vydanie prebieha v režime CI…",
    localMode: "Vydanie prebieha v lokálnom režime…",
    forceUpdate: "Vynucuje sa aktualizácia závislostí…",
    complete: "Proces vydania dokončený",
    failed: "Proces vydania zlyhal",
    processingPackage: "Spracúva sa balík: {{name}}",
    packageSkipped: "Balík „{{name}}“ sa preskočil: {{reason}}",
    packageComplete: "Spracovanie balíka „{{name}}“ bolo dokončené",
    packageFailed: "Spracovanie balíka „{{name}}“ zlyhalo: {{error}}",
    firstRelease:
      "Neboli nájdené žiadne predchádzajúce značky. Toto bude prvé vydanie.",
  },
  qualityChecks: {
    linting: "Spúšťa sa linter pre {{package}}…",
    lintPassed: "Kontrola linterom pre {{package}} prešla",
    lintFailed: "Kontrola linterom pre {{package}} zlyhala",
    typeChecking: "Kontrolujú sa typy pre {{package}}…",
    typeCheckPassed: "Kontrola typov pre {{package}} prešla",
    typeCheckFailed: "Kontrola typov pre {{package}} zlyhala",
    building: "Zostavuje sa {{package}}…",
    buildPassed: "Zostavenie {{package}} sa podarilo",
    buildFailed: "Zostavenie {{package}} zlyhalo",
    testing: "Spúšťajú sa testy pre {{package}}…",
    testsPassed: "Testy pre {{package}} prešli",
    testsFailed: "Testy zlyhali pre {{package}}",
    snykTesting: "Spúšťa sa kontrola Snyk pre {{package}}…",
    snykTestPassed: "Kontrola Snyk pre {{package}} prešla",
    snykTestFailed: "Kontrola Snyk pre {{package}} zlyhala",
    snykMonitoring: "Spúšťa sa monitorovanie Snyk pre {{package}}…",
    snykMonitorPassed: "Monitorovanie Snyk pre {{package}} je dokončené",
    snykMonitorFailed: "Monitorovanie Snyk pre {{package}} zlyhalo",
  },
  dependencies: {
    updating: "Aktualizujú sa závislosti v {{directory}}…",
    updated: "Závislosti v {{directory}} sa aktualizovali",
    failed: "Aktualizácia závislostí v {{directory}} zlyhala: {{error}}",
    skipped: "Aktualizácia závislostí v {{directory}} sa preskakuje",
    dedupeFailed:
      "Nepodarilo sa odstrániť duplicitné závislosti v {{directory}}: {{error}}",
  },
  security: {
    auditFailed: "Bezpečnostný audit zlyhal pre {{directory}}: {{error}}",
  },
  hooks: {
    running: "Spúšťa sa akcia {{hook}} pre {{package}}…",
    completed: "Akcia {{hook}} pre {{package}} je dokončená",
    failed: "Príkaz akcie „{{command}}“ zlyhal: {{error}}",
    skipped: "Preskakuje sa akcia {{hook}} (continueOnError)",
  },
  npm: {
    publishing: "Publikuje sa {{package}} na npm…",
    published: "Úspešne publikované {{package}} @ {{version}} až npm",
    publishFailed:
      "Balík {{package}} sa nepodarilo publikovať do npm: {{error}}",
    registry: "Používa sa register npm: {{registry}}",
    dryRun: "[DRY RUN] Balík {{package}}@{{version}} by sa publikoval do npm",
  },
  changelog: {
    generating: "Generuje sa zoznam zmien pre {{package}}…",
    generated: "Zoznam zmien pre {{package}} bol vygenerovaný",
    failed:
      "Nepodarilo sa vygenerovať zoznam zmien pre {{directory}}: {{error}}",
    noChanges: "Balík {{package}} nemá zmeny na pridanie do zoznamu zmien",
  },
  branch: {
    checking: "Kontroluje sa stav vetvy…",
    notAllowed:
      "Vydania z vetvy '{{branch}}' nie sú povolené. Hlavná vetva: {{main}}.",
    isProtected: "Vetva „{{branch}}“ je chránená",
  },
  gitRelease: {
    creating: "Vytvára sa vydanie GitHub pre {{tag}}…",
    created: "Vydanie na GitHube bolo vytvorené: {{url}}",
    failed: "Zlyhalo vytvorenie vydania GitHub: {{error}}",
    ghNotFound:
      "Nástroj GitHub CLI (gh) sa nenašiel. Vydanie na GitHube sa preskočí.",
    notGitHub: "Vydania na GitHube sú dostupné iba pre repozitáre GitHub",
  },
  validation: {
    branchNotAllowed: "Vydanie z vetvy '{{branch}}' nie je povolené.",
    dirtyWorkingDir: "Pracovný priečinok obsahuje zmeny bez commitu",
    passed: "Všetky overenia prešli",
  },
  summary: {
    header: "Súhrn vydania",
    successCount: "Počet úspešne vydaných balíkov: {{count}}",
    skipCount: "Počet preskočených balíkov: {{count}}",
    failCount: "Počet balíkov, ktoré sa nepodarilo vydať: {{count}}",
  },
  jsr: {
    publishing: "Publikuje sa {{package}} do JSR…",
    published: "Úspešne publikované {{package}} na JSR",
    failed: "Balík {{package}} sa nepodarilo publikovať do JSR: {{error}}",
  },
  gitlab: {
    creating: "Vytvára sa vydanie na GitLabe pre {{tag}}…",
    created: "Vydanie na GitLabe bolo vytvorené: {{url}}",
    failed: "Vydanie na GitLabe sa nepodarilo vytvoriť: {{error}}",
    glabNotFound:
      "Nástroj GitLab CLI (glab) sa nenašiel. Vydanie na GitLabe sa preskočí.",
  },
  lockfile: {
    checking: "Overuje sa integrita lockfile…",
    valid: "Lockfile je platný",
    invalid: "Overenie integrity lockfile zlyhalo: {{error}}",
    missing: "Lockfile sa nenašiel. Očakával sa {{expected}}.",
  },
  notifications: {
    sending: "Odosiela sa oznámenie…",
    sent: "Oznámenie bolo odoslané",
    failed: "Nepodarilo sa poslať oznámenie: {{error}}",
    disabled: "Oznámenia vypnuté",
  },
  retry: {
    attempt: "Opakovaný pokus o {{operation}} ({{attempt}} z {{maxAttempts}})",
    failed: "Všetky opakované pokusy o {{operation}} zlyhali",
    success: "Operácia {{operation}} sa po opakovaní podarila",
  },
  rollback: {
    starting: "Začína sa vrátenie zmien…",
    complete: "Zmeny sa úspešne vrátili",
    failed: "Vrátenie zmien zlyhalo: {{error}}",
    git: "Vracajú sa zmeny v Gite…",
    version: "Vracajú sa zmeny verzie…",
  },
  timings: {
    report: "Trvanie jednotlivých krokov",
    validation: "Overenie",
    install: "Inštalácia",
    clean: "Čistenie",
    lint: "Linter",
    typecheck: "Kontrola typov",
    build: "Zostavenie",
    test: "Testovanie",
    publish: "Publikovanie",
    changelog: "Zoznam zmien",
    gitOperations: "Operácie s Gitom",
  },
  widget: {
    runRelease: "Spustiť vydanie",
    runAgain: "Spustiť znova",
    complete: "Vydanie dokončené",
    failed: "Vydanie zlyhalo",
    published: "Uverejnené",
    errors: "Chyby",
    bullet: "•",
    warning: "⚠",
  },
};
