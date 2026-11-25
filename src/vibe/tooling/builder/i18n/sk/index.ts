import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zostavovanie",
  description: "Nástroj na zostavenie projektu a vytváranie balíkov",
  cli: {
    build: {
      description: "Typ zostavenia: build",
      configOption: "zadajte cestu ku konfiguračnému súboru",
      defaultConfig: "build.config.ts",
    },
  },
  enums: {
    profile: {
      development: "Vývoj",
      production: "Produkcia",
    },
    buildType: {
      reactTailwind: "React + Tailwind",
      react: "React",
      vanilla: "Čistý JavaScript",
      executable: "Spustiteľný súbor (Bun)",
      spa: "SPA (zostavenie aplikácie Vite)",
    },
    bunTarget: {
      bun: "Behové prostredie Bun",
      node: "Node.js",
      browser: "Prehliadač",
    },
    sourcemap: {
      external: "Externá mapa (súbor .map)",
      inline: "Vložené priamo do súboru",
      none: "Žiadne (vypnuté)",
    },
    format: {
      esm: "Modul ES",
      cjs: "CommonJS",
      iife: "IIFE (prehliadač)",
    },
    viteMinify: {
      esbuild: "esbuild (rýchle zostavenie)",
      terser: "Terser (menší výstup)",
      false: "Vypnuté",
    },
    viteLibFormat: {
      es: "Modul ES",
      cjs: "CommonJS",
      umd: "UMD",
      iife: "IIFE",
    },
    viteSourcemap: {
      true: "Zapnuté",
      false: "Vypnuté",
      inline: "Vložené",
      hidden: "Skryté",
    },
  },
  errors: {
    inputFileNotFound: "Vstupný súbor {{filePath}} neexistuje",
    invalidOutputFileName: "Názov výstupného súboru je neplatný",
    invalidBuildConfig:
      "Neplatná konfigurácia zostavenia. Musí predvolene exportovať objekt BuildConfig.",
    configNotFound: "Konfiguračný súbor {{path}} sa nenašiel.",
    inputRequired: "Tento cieľ zostavenia vyžaduje vstupný súbor",
    emptyConfig: "Prázdna konfigurácia. Chýbajú kroky zostavenia.",
  },
  warnings: {
    outputIsDirectory: "Výstupná cesta musí odkazovať na súbor: {{path}}",
    sourceNotFound: "Zdrojový súbor sa nenašiel: {{path}}",
  },
  suggestions: {
    checkFilePaths: "Skontrolujte cesty a overte, či súbory existujú",
    runFromProjectRoot: "Spustite príkaz z koreňového priečinka projektu",
    checkPermissions:
      "Skontrolujte oprávnenia vstupných a výstupných priečinkov",
    checkDependencies: "Skontrolujte importy. Niektoré závislosti môžu chýbať.",
    runInstall: "Spustite bun install a nainštalujte závislosti.",
    increaseMemory:
      "Pri veľkých zostaveniach skúste zvýšiť pamäť: NODE_OPTIONS=--max-old-space-size=4096",
    useExternals: "Zvážte označenie veľkých závislostí za externé",
    checkSyntax: "Skontrolujte syntax zdrojových súborov",
    runTypecheck: "Typové chyby skontrolujete príkazom bun typecheck",
    increaseTimeout: "Zvýšte časový limit zostavenia",
    checkNetworkConnection: "Skontrolujte sieťové pripojenie",
    checkDiskSpace: "Skontrolujte dostupný priestor na disku",
    cleanBuildCache:
      "Skúste vyčistiť vyrovnávaciu pamäť zostavy a dočasné súbory",
  },
  messages: {
    buildStart: "Začína sa zostavovanie…",
    cleaningDist: "Čistí sa výstupný priečinok…",
    cleaningFolders: "Čistia sa priečinky…",
    buildingVersion: "Zostavuje sa verzia {{version}}…",
    bundlingCli: "Vytvára sa balík CLI pomocou Bun…",
    bundleFailed: "Vytvorenie balíka zlyhalo: {{error}}",
    bundleFailedUnknown: "Vytvorenie balíka zlyhalo bez chybového hlásenia",
    outputMissing: "Balík nemá výstup. {{output}} chýba alebo je prázdny.",
    bundleSuccess: "Balík CLI bol úspešne vytvorený",
    creatingPackageJson: "Vytvára sa package.json…",
    copyingFiles: "Kopírujú sa README a LICENSE…",
    copyingAdditionalFiles: "Kopírujú sa ďalšie súbory…",
    publishInstructions: "Zverejnenie:",
    buildComplete: "Zostavenie dokončené",
    buildFailed: "Zostavenie zlyhalo",
    loadingConfig: "Načítava sa konfigurácia z {{path}}…",
    cleaningFolder: "Čistí sa priečinok: {{folder}}",
    compilingFiles: "Kompilujú sa súbory pomocou Vite…",
    compilingFile: "Kompiluje sa: {{file}}",
    fileCompiled: "Skompilované: {{file}}",
    buildingWithVite: "Zostavuje sa pomocou Vite ({{type}})…",
    usingInlineConfig: "Používa sa priamo zadaná konfigurácia…",
    filesCopied: "Súbory boli skopírované",
    dryRunMode: "[DRY RUN] Žiadne zmeny sa nevykonajú",
    buildSummary: "Súhrn zostavenia:",
    totalDuration: "Celkové trvanie",
    filesBuilt: "Zostavené súbory",
    filesCopiedCount: "Skopírované súbory",
    stepsCompleted: "Dokončené kroky",
    usingProfile: "Používa sa profil: {{profile}}",
    runningPreBuild: "Spúšťa sa pre-build hook…",
    runningPostBuild: "Spúšťa sa post-build hook…",
    preBuildComplete: "Pre-build hook je dokončený",
    postBuildComplete: "Post-build hook je dokončený",
    analyzingBundles: "Analyzujú sa veľkosti balíkov…",
    bundleAnalysis: "Analýza balíkov",
    optimizationTips: "Tipy na optimalizáciu",
    suggestions: "Návrhy",
    validatingConfig: "Overuje sa konfigurácia zostavenia…",
    configValid: "Konfigurácia je platná",
    configWarnings: "Upozornenia ku konfigurácii",
    tsEntrypointWithNode:
      "Vstupný bod TypeScript cieli na Node.js. Bun môže ponúknuť lepšiu kompatibilitu.",
    watchModeStarted: "Režim sledovania je spustený. Čaká sa na zmeny súborov…",
    watchModeRebuild: "Súbor {{file}} sa zmenil. Spúšťa sa nové zostavenie…",
    watchModeReady: "Zostavenie dokončené. Čaká sa na zmeny…",
    watchModeError: "Chyba v režime sledovania: {{error}}",
    watchModeStopped: "Režim sledovania zastavený",
    parallelCompiling: "Súbory sa kompilujú súbežne. Počet: {{count}}…",
    parallelComplete:
      "Súbežná kompilácia dokončená. Počet súborov: {{count}}. Trvanie: {{duration}} ms.",
    cacheHit: "Súbor {{file}} je vo vyrovnávacej pamäti. Preskakuje sa.",
    cacheMiss:
      "Súbor {{file}} chýba vo vyrovnávacej pamäti. Zostavuje sa znova.",
    cacheCleared: "Vyrovnávacia pamäť zostavenia bola vyčistená",
    cacheStats:
      "Vyrovnávacia pamäť: nájdené {{hits}}, nenájdené {{misses}} (úspešnosť {{hitRate}} %)",
    generatingReport: "Generuje sa správa o zostavení…",
    reportGenerated: "Správa o zostavení bola vygenerovaná: {{path}}",
    progress: "[{{current}}/{{total}}] {{step}}",
    spinnerBuilding: "Pripravuje sa…",
    spinnerCompiling: "Kompiluje sa…",
    spinnerBundling: "Vytvára sa balík…",
  },
  post: {
    title: "Zostaviť balík",
    titleShort: "Zostaviť balík",
    description:
      "Nástroj na zostavovanie CLI, zostavy Vite, integráciu Reactu a Tailwindu a distribúciu cez npm.",
    form: {
      title: "Nastavenia zostavenia",
      description: "Nastaviť zostavenie alebo použiť súbor build.config.ts",
    },
    fields: {
      // Config file path
      configPath: {
        title: "Cesta ku konfiguračnému súboru",
        description: "Cesta ku konfigurácii zostavenia (build.config.ts)",
        placeholder: "build.config.ts",
      },
      // Config object
      configObject: {
        title: "Možnosti zostavenia",
        description:
          "Nastavenia zostavy zadané priamo. Majú prednosť pred hodnotami v konfiguračnom súbore.",
      },
      // Runtime options
      profile: {
        title: "Profil zostavenia",
        description:
          "Vývoj (rýchla zostava s ladením) alebo produkcia (optimalizovaná a minifikovaná zostava)",
      },
      dryRun: {
        title: "Skúšobné spustenie",
        description: "Zobrazí plán zostavenia bez vykonania zmien",
      },
      verbose: {
        title: "Podrobný výstup",
        description: "Zobrazí priebeh zostavovania a podrobné informácie.",
      },
      analyze: {
        title: "Analýza balíkov",
        description: "Analyzovať veľkosť balíkov a možnosti optimalizácie",
      },
      watch: {
        title: "Režim sledovania",
        description: "Sledovať zmeny súborov a po zmene zostaviť znova",
      },
      parallel: {
        title: "Súbežné zostavenie",
        description: "Kompilovať viac súborov súbežne a skrátiť zostavenie",
      },
      cache: {
        title: "Vyrovnávacia pamäť zostavenia",
        description:
          "Ukladať výstupy zostavenia a preskakovať nezmenené súbory",
      },
      report: {
        title: "Generovať správu",
        description:
          "Vygenerovať správu o zostavení vo formáte JSON s podrobnými metrikami",
      },
      minify: {
        title: "Minifikovať",
        description:
          "Minifikovať výstupný balík. Má prednosť pred nastavením profilu.",
      },
      // Folders to clean
      foldersToClean: {
        title: "Priečinky na vyčistenie",
        description:
          "Priečinky, ktoré sa pred zostavovaním odstránia, napríklad dist alebo build.",
        placeholder: "dist, build, .cache",
      },
      // Files to compile
      filesToCompile: {
        title: "Súbory na kompiláciu",
        description: "Zoznam súborov na kompiláciu pomocou Vite alebo Bun",
      },
      fileToCompile: {
        title: "Nastavenie súboru",
      },
      disabled: {
        title: "Vypnuté",
        description: "Preskočiť túto položku pri zostavení",
      },
      input: {
        title: "Vstupný súbor",
        description: "Cesta k súboru vstupného bodu, napríklad src/index.ts",
        placeholder: "src/index.ts",
      },
      output: {
        title: "Výstupný súbor",
        description: "Cesta k výstupnému súboru, napríklad dist/index.js",
        placeholder: "dist/index.js",
      },
      type: {
        title: "Typ zostavenia",
        description:
          "Typ zostavy. React, čistý JavaScript alebo spustiteľný súbor.",
      },
      modulesToExternalize: {
        title: "Externé moduly",
        description:
          "Moduly, ktoré sa majú vylúčiť z balíka, napríklad react alebo lodash",
        placeholder: "react, react-dom, lodash",
      },
      inlineCss: {
        title: "Vložené CSS",
        description: "Vložiť CSS priamo do balíka JavaScript",
      },
      bundleReact: {
        title: "Zahrnúť React do balíka",
        description:
          "Zahrnúť React priamo do balíka a odstrániť ho zo zoznamu externých modulov",
      },
      // Package config
      packageConfig: {
        title: "Nastavenia balíka",
        description: "Nastavenia zostavenia knižnice s deklaráciami TypeScript",
      },
      isPackage: {
        title: "Zostaviť ako balík",
        description: "Povoliť režim knižnice s exportmi balíka",
      },
      dtsInclude: {
        title: "Súbory pre deklarácie DTS",
        description: "Vzory glob pre súbory TypeScript zahrnuté do deklarácií",
        placeholder: "src/**/*.ts",
      },
      dtsEntryRoot: {
        title: "Koreňový priečinok vstupov DTS",
        description: "Koreňový priečinok na generovanie deklaračných súborov",
        placeholder: "src",
      },
      // Bun options
      bunOptions: {
        title: "Možnosti Bun",
        description: "Nastavenia Bun pre zostavenie spustiteľných súborov",
      },
      bunTarget: {
        title: "Cieľové behové prostredie",
        description: "Cieľové behové prostredie: Bun, Node.js alebo prehliadač",
      },
      bunMinify: {
        title: "Minifikovať",
        description: "Minifikovať a zmenšiť výstup",
      },
      sourcemap: {
        title: "Zdrojové mapy",
        description: "Generovať zdrojové mapy pre ladenie",
      },
      external: {
        title: "Externé moduly",
        description: "Moduly, ktoré sa majú vylúčiť z balíka",
        placeholder: "react, react-dom",
      },
      define: {
        title: "Konštanty",
        description:
          "Konštanty známe pri kompilácii vo formáte JSON, napríklad process.env.NODE_ENV",
        placeholder: '{"process.env.NODE_ENV": "\\"production\\""}',
      },
      splitting: {
        title: "Rozdelenie kódu",
        description: "Povoliť rozdelenie kódu do zdieľaných častí",
      },
      format: {
        title: "Formát výstupu",
        description: "Modulový formát: ESM, CommonJS alebo IIFE",
      },
      bytecode: {
        title: "Bajtkód",
        description: "Kompilovať do bajtkódu Bun pre rýchlejší štart",
      },
      banner: {
        title: "Hlavička",
        description: "Text pred výstupom, napríklad riadok shebang",
        placeholder: "#!/usr/bin/env node",
      },
      footer: {
        title: "Pätička",
        description: "Text na pripojenie k výstupu",
        placeholder: "// End of file",
      },
      publicPath: {
        title: "Verejná cesta",
        label: "Verejná cesta",
        description: "Predpona verejnej cesty k statickým súborom",
      },
      naming: {
        title: "Pomenovanie",
        label: "Pomenovanie",
        description: "Vzor pre pomenovanie výstupov",
      },
      root: {
        title: "Koreň",
        label: "Koreň",
        description: "Koreňový priečinok",
      },
      conditions: {
        title: "Podmienky",
        label: "Podmienky",
        description: "Podmienky exportu",
      },
      loader: {
        title: "Načítavač",
        label: "Načítavač",
        description: "Priradenie načítavačov k typom súborov",
      },
      drop: {
        title: "Odstrániť identifikátory",
        label: "Odstrániť identifikátory",
        description: "Identifikátory, ktoré sa majú odstrániť z výstupu",
      },
      // Vite options
      viteOptions: {
        title: "Možnosti Vite",
        description: "Pokročilá konfigurácia Vite",
      },
      viteTarget: {
        title: "Cieľ zostavenia",
        description:
          "Cieľové prehliadače alebo prostredia, napríklad es2020 alebo chrome80",
        placeholder: "es2020, chrome80, node18",
      },
      viteOutDir: {
        title: "Výstupný adresár",
        description: "Priečinok s výstupom zostavenia",
        placeholder: "dist",
      },
      viteAssetsDir: {
        title: "Priečinok so statickými súbormi",
        description: "Podpriečinok pre statické súbory",
        placeholder: "assets",
      },
      viteAssetsInlineLimit: {
        title: "Limit vkladania",
        description:
          "Maximálna veľkosť súboru v bajtoch na priame vloženie v kódovaní Base64",
        placeholder: "4096",
      },
      viteChunkSizeWarningLimit: {
        title: "Upozornenie na veľkosť časti balíka",
        description:
          "Veľkosť časti balíka v KB, pri ktorej sa zobrazí upozornenie",
        placeholder: "500",
      },
      viteCssCodeSplit: {
        title: "Rozdelenie CSS",
        description: "Rozdeliť CSS do samostatných súborov podľa častí balíka",
      },
      viteSourcemap: {
        title: "Zdrojové mapy",
        description: "Režim generovania zdrojových máp",
      },
      viteMinify: {
        title: "Minifikátor",
        description: "Minifikátor esbuild alebo terser",
      },
      viteEmptyOutDir: {
        title: "Vyčistiť výstupný priečinok",
        description: "Odstrániť obsah výstupného priečinka pred zostavením",
      },
      viteReportCompressedSize: {
        title: "Zobraziť veľkosť po kompresii",
        description: "Zobraziť veľkosť balíkov po kompresii gzip",
      },
      viteManifest: {
        title: "Manifest zostavy",
        description:
          "Vytvoriť manifest.json pre statické súbory s identifikátormi podľa obsahu",
      },
      // Vite lib options
      viteLib: {
        title: "Režim knižnice",
        description: "Nastaviť zostavenie knižnice pomocou Vite",
      },
      viteLibEntry: {
        title: "Vstupný bod",
        description: "Vstupné súbory knižnice",
        placeholder: "src/index.ts",
      },
      viteLibName: {
        title: "Názov knižnice",
        description: "Názov globálnej premennej pre výstup UMD alebo IIFE",
        placeholder: "MyLibrary",
      },
      viteLibFormats: {
        title: "Výstupné formáty",
        description: "Formáty výstupov knižnice (ES, CJS, UMD, IIFE)",
      },
      viteLibFileName: {
        title: "Názov súboru",
        description: "Názov výstupného súboru bez prípony",
        placeholder: "my-library",
      },
      // Rollup options
      viteRollupOptions: {
        title: "Možnosti Rollup",
        description: "Pokročilé nastavenia nástroja Rollup",
      },
      rollupExternal: {
        title: "Externé moduly",
        description: "Moduly na vylúčenie z balíka",
        placeholder: "react, react-dom",
      },
      rollupTreeshake: {
        title: "Tree shaking",
        description: "Odstrániť nepoužitý kód z balíka",
      },
      rollupOutput: {
        title: "Nastavenia výstupu Rollup",
        label: "Nastavenia výstupu Rollup",
        description: "Nastavenia odovzdané priamo do výstupu Rollup",
      },
      viteTsconfigPath: {
        title: "Cesta k tsconfig",
        description: "Cesta k tsconfig pre vite-tsconfig-paths (režim SPA)",
        placeholder: "tsconfig.tanstack.json",
      },
      viteModuleAliases: {
        label: "Aliasy modulov",
        description:
          "Priradiť identifikátory importov k cestám súborov. Platí pre klienta aj SSR.",
      },
      vitePlugins: {
        title: "Doplnky Vite",
        label: "Doplnky Vite",
        description: "Pole doplnkov Vite na programové použitie",
      },
      viteBuild: {
        title: "Priame nastavenia zostavenia",
        label: "Priame nastavenia zostavenia",
        description: "Nastavenia zostavenia odovzdané priamo do Vite",
      },
      // Files to copy
      filesOrFoldersToCopy: {
        title: "Súbory na kopírovanie",
        description: "Súbory alebo priečinky na skopírovanie po kompilácii",
      },
      copyConfig: {
        title: "Nastavenia kopírovania",
      },
      copyInput: {
        title: "Zdroj",
        description: "Cesta k zdrojovému súboru alebo priečinku",
        placeholder: "README.md",
      },
      copyOutput: {
        title: "Cieľ",
        description: "Cesta k cieľovému súboru alebo priečinku",
        placeholder: "dist/README.md",
      },
      copyPattern: {
        title: "Vzor",
        description: "Vzor glob na filtrovanie súborov",
        placeholder: "**/*.json",
      },
      // NPM package
      npmPackage: {
        title: "Balík npm",
        description: "Vygeneruje package.json na distribúciu cez npm",
      },
      packageName: {
        title: "Názov balíka",
        description: "Názov balíka npm (napr. @scope/package)",
        placeholder: "@myorg/package-name",
      },
      packageVersion: {
        title: "Verzia",
        description:
          "Verzia balíka. Predvolene zo súboru package.json v koreňovom priečinku.",
        placeholder: "1.0.0",
      },
      packageDescription: {
        title: "Opis",
        description: "Stručný opis balíka pre npm",
        placeholder: "Stručný opis balíka",
      },
      packageMain: {
        title: "Hlavný vstupný bod",
        description: "Vstupný bod CommonJS (pole main)",
        placeholder: "./dist/index.cjs",
      },
      packageModule: {
        title: "Vstupný bod modulu",
        description: "Vstupný bod modulu ES (pole module)",
        placeholder: "./dist/index.mjs",
      },
      packageTypes: {
        title: "Vstupný bod deklarácií",
        description: "Deklarácie TypeScript (pole types)",
        placeholder: "./dist/index.d.ts",
      },
      packageBin: {
        title: "Spustiteľné súbory",
        description:
          "Priradenie príkazov CLI k spustiteľným súborom vo formáte JSON",
        placeholder: '{"my-cli": "./dist/bin/cli.js"}',
      },
      packageExports: {
        title: "Mapa exportu",
        description: "Pole exports balíka vo formáte JSON",
        placeholder:
          '{".": {"import": "./dist/index.mjs", "require": "./dist/index.cjs"}}',
      },
      packageDependencies: {
        title: "Závislosti",
        description: "Behové závislosti vo formáte JSON",
        placeholder: '{"lodash": "^4.17.21"}',
      },
      packagePeerDependencies: {
        title: "Partnerské závislosti",
        description: "Partnerské závislosti (peerDependencies) vo formáte JSON",
        placeholder: '{"react": ">=18.0.0"}',
      },
      packagePeerDependenciesMeta: {
        title: "Metadáta partnerských závislostí",
        description: "Označiť partnerské závislosti za nepovinné",
        placeholder: '{"react": {"optional": true}}',
      },
      packageFiles: {
        title: "Zahrnuté súbory",
        description: "Súbory, ktoré sa majú zahrnúť do zverejneného balíka",
        placeholder: "dist, README.md, LICENSE",
      },
      packageKeywords: {
        title: "Kľúčové slová",
        description: "Kľúčové slová pre príkaz npm search",
        placeholder: "typescript, build, vite",
      },
      packageLicense: {
        title: "Licencia",
        description: "Licencia balíka, napríklad MIT alebo Apache-2.0",
        placeholder: "MIT",
      },
      packageRepository: {
        title: "Repozitár",
        description: "Adresa URL repozitára Git",
        placeholder: "https://github.com/user/repo",
      },
      packageOutputDir: {
        title: "Výstupný adresár",
        description:
          "Priečinok, do ktorého sa zapíše package.json (predvolene dist/)",
        placeholder: ".dist/checker",
      },
      // Response fields
      success: {
        title: "Úspech",
      },
      buildOutput: {
        title: "Výstup zostavenia",
      },
      duration: {
        title: "Trvanie (ms)",
      },
      outputPath: {
        title: "Cesta výstupu",
      },
      filesBuilt: {
        title: "Zostavené súbory",
        item: "Zostavený súbor",
      },
      filesCopied: {
        title: "Skopírované súbory",
        item: "Skopírovaný súbor",
      },
      packageJson: {
        title: "Vygenerovaný package.json",
      },
      profileUsed: {
        title: "Použitý profil",
      },
      cacheStats: {
        title: "Štatistiky vyrovnávacej pamäte",
        description: "Metriky výkonu vyrovnávacej pamäte zostavenia",
      },
      reportPath: {
        title: "Cesta k správe",
        description: "Cesta k vygenerovanej správe o zostave",
      },
      stepTimings: {
        title: "Trvanie krokov",
        description: "Podrobné časy jednotlivých krokov zostavenia",
        step: "Krok",
        duration: "Trvanie (ms)",
        status: "Stav",
        filesAffected: "Súbory",
      },
    },
    errors: {
      buildFailed: {
        title: "Zostavenie zlyhalo: {{error}}",
        description: "Pri zostavení nastala chyba",
      },
      validation: {
        title: "Chyba overenia",
        description: "Zadaná konfigurácia zostavenia je neplatná",
      },
      network: {
        title: "Chyba siete",
        description: "Pri zostavení nastala chyba siete",
      },
      unauthorized: {
        title: "Bez oprávnenia",
        description: "Nemáte oprávnenie spúšťať zostavenia",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup k systému zostavovania je zakázaný",
      },
      server: {
        title: "Chyba servera",
        description: "Pri zostavení nastala chyba",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zadaný súbor alebo konfigurácia sa nenašli",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Neuložené zmeny môžu ovplyvniť zostavenie",
      },
      conflict: {
        title: "Budovať konflikty",
        description: "Už prebieha nekompatibilná operácia zostavenia",
      },
    },
    success: {
      title: "Zostavenie úspešné",
      description: "Balík bol úspešne zostavený",
    },
  },
  tags: {
    build: "zostavenie",
    npm: "npm",
    vite: "vite",
  },
  profiles: {
    development: "Vývoj",
    production: "Produkcia",
  },
  analysis: {
    criticalSize: "Kritická chyba: Veľkosť balíka ({{size}}) prekračuje limit",
    largeBundle: "Upozornenie: Zistil sa veľký balík ({{size}})",
    considerTreeShaking:
      "Zvážte odstránenie nepoužitého kódu (tree shaking) a zmenšite balík",
    checkLargeDeps: "Skontrolujte, či sa dajú veľké závislosti nahradiť",
    largeSourcemaps: "Zdrojové mapy sú veľké. Zvážte ich vypnutie v produkcii.",
    possibleDuplicates:
      "Zistili sa možné duplicitné závislosti. Zvážte ich zlúčenie.",
    totalSize: "Celková veľkosť",
    largestFiles: "Najväčšie súbory",
  },
};
