import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "बिल्डर",
  description: "प्रोजेक्ट के लिए बिल्ड और बंडल टूल",
  cli: {
    build: {
      description: "बिल्ड का प्रकार: build",
      configOption: "कॉन्फ़िग फ़ाइल का पाथ बताएँ",
      defaultConfig: "build.config.ts",
    },
  },
  enums: {
    profile: {
      development: "डेवलपमेंट",
      production: "प्रोडक्शन",
    },
    buildType: {
      reactTailwind: "React + Tailwind",
      react: "React",
      vanilla: "Vanilla JS",
      executable: "एक्ज़ीक्यूटेबल (Bun)",
      spa: "SPA (Vite ऐप बिल्ड)",
    },
    bunTarget: {
      bun: "Bun रनटाइम",
      node: "Node.js",
      browser: "ब्राउज़र",
    },
    sourcemap: {
      external: "बाहरी (.map फ़ाइल)",
      inline: "इनलाइन (एम्बेडेड)",
      none: "कोई नहीं (बंद)",
    },
    format: {
      esm: "ES मॉड्यूल",
      cjs: "CommonJS",
      iife: "IIFE (ब्राउज़र)",
    },
    viteMinify: {
      esbuild: "esbuild (तेज़)",
      terser: "Terser (छोटा)",
      false: "बंद",
    },
    viteLibFormat: {
      es: "ES मॉड्यूल",
      cjs: "CommonJS",
      umd: "UMD",
      iife: "IIFE",
    },
    viteSourcemap: {
      true: "चालू",
      false: "बंद",
      inline: "इनलाइन",
      hidden: "छिपा है",
    },
  },
  errors: {
    inputFileNotFound: "इनपुट फ़ाइल {{filePath}} मौजूद नहीं है",
    invalidOutputFileName: "आउटपुट फ़ाइल का नाम गलत है",
    invalidBuildConfig:
      "बिल्ड कॉन्फ़िग का फ़ॉर्मैट गलत है। पक्का करें कि कॉन्फ़िग एक डिफ़ॉल्ट BuildConfig ऑब्जेक्ट एक्सपोर्ट करता है।",
    configNotFound: "कॉन्फ़िग फ़ाइल नहीं मिली: {{path}}",
    inputRequired: "इस बिल्ड टारगेट के लिए इनपुट फ़ाइल ज़रूरी है",
    emptyConfig: "कॉन्फ़िगरेशन खाली है, कोई बिल्ड स्टेप तय नहीं",
  },
  warnings: {
    outputIsDirectory: "आउटपुट पाथ फ़ाइल होना चाहिए, डायरेक्टरी नहीं: {{path}}",
    sourceNotFound: "सोर्स फ़ाइल नहीं मिली: {{path}}",
  },
  suggestions: {
    checkFilePaths: "जाँचें कि सभी फ़ाइल पाथ सही हैं और फ़ाइलें मौजूद हैं",
    runFromProjectRoot: "पक्का करें कि आप प्रोजेक्ट की रूट डायरेक्टरी से चला रहे हैं",
    checkPermissions: "इनपुट और आउटपुट डायरेक्टरी की फ़ाइल परमिशन जाँचें",
    checkDependencies: "कुछ डिपेंडेंसी गायब हो सकती हैं, इम्पोर्ट जाँचें",
    runInstall: "सारी डिपेंडेंसी उपलब्ध करने के लिए 'bun install' चलाकर देखें",
    increaseMemory:
      "बड़े बिल्ड के लिए मेमोरी बढ़ाएँ: NODE_OPTIONS=--max-old-space-size=4096",
    useExternals: "बड़ी डिपेंडेंसी को एक्सटर्नल चिह्नित करने पर विचार करें",
    checkSyntax: "अपनी सोर्स फ़ाइलों में सिंटैक्स एरर जाँचें",
    runTypecheck: "टाइप एरर जाँचने के लिए 'bun typecheck' चलाएँ",
    increaseTimeout: "बिल्ड ऑपरेशन का टाइमआउट बढ़ाएँ",
    checkNetworkConnection: "अपना नेटवर्क कनेक्शन जाँचें",
    checkDiskSpace: "उपलब्ध डिस्क जगह जाँचें",
    cleanBuildCache: "बिल्ड कैश और टेम्पररी फ़ाइलें साफ़ करके देखें",
  },
  messages: {
    buildStart: "बिल्ड शुरू हो रहा है...",
    cleaningDist: "आउटपुट डायरेक्टरी साफ़ हो रही है...",
    cleaningFolders: "फ़ोल्डर साफ़ हो रहे हैं...",
    buildingVersion: "वर्शन {{version}} बन रहा है...",
    bundlingCli: "Bun से CLI बंडल हो रहा है...",
    bundleFailed: "बंडल फ़ेल हुआ: {{error}}",
    bundleFailedUnknown: "बंडल बिना एरर मैसेज के फ़ेल हुआ",
    outputMissing: "बंडल से कोई आउटपुट नहीं बना: {{output}} गायब या खाली है",
    bundleSuccess: "CLI बंडल हो गया",
    creatingPackageJson: "package.json बन रहा है...",
    copyingFiles: "README और LICENSE कॉपी हो रहे हैं...",
    copyingAdditionalFiles: "अतिरिक्त फ़ाइलें कॉपी हो रही हैं...",
    publishInstructions: "पब्लिश करने के लिए:",
    buildComplete: "बिल्ड पूरा हुआ!",
    buildFailed: "बिल्ड फ़ेल हुआ",
    loadingConfig: "{{path}} से कॉन्फ़िग लोड हो रहा है...",
    cleaningFolder: "फ़ोल्डर साफ़ हो रहा है: {{folder}}",
    compilingFiles: "Vite से फ़ाइलें कंपाइल हो रही हैं...",
    compilingFile: "कंपाइल हो रहा है: {{file}}",
    fileCompiled: "कंपाइल हुआ: {{file}}",
    buildingWithVite: "Vite ({{type}}) से बिल्ड हो रहा है...",
    usingInlineConfig: "इनलाइन कॉन्फ़िगरेशन इस्तेमाल हो रहा है...",
    filesCopied: "फ़ाइलें कॉपी हो गईं",
    dryRunMode: "[ड्राई रन] कोई बदलाव नहीं किया जाएगा",
    buildSummary: "बिल्ड सारांश:",
    totalDuration: "कुल अवधि",
    filesBuilt: "बनी फ़ाइलें",
    filesCopiedCount: "कॉपी हुई फ़ाइलें",
    stepsCompleted: "पूरे हुए स्टेप",
    usingProfile: "प्रोफ़ाइल इस्तेमाल हो रही है: {{profile}}",
    runningPreBuild: "प्री-बिल्ड हुक चल रहा है...",
    runningPostBuild: "पोस्ट-बिल्ड हुक चल रहा है...",
    preBuildComplete: "प्री-बिल्ड हुक पूरा हुआ",
    postBuildComplete: "पोस्ट-बिल्ड हुक पूरा हुआ",
    analyzingBundles: "बंडल साइज़ का विश्लेषण हो रहा है...",
    bundleAnalysis: "बंडल विश्लेषण",
    optimizationTips: "ऑप्टिमाइज़ेशन टिप्स",
    suggestions: "सुझाव",
    validatingConfig: "बिल्ड कॉन्फ़िगरेशन वैलिडेट हो रहा है...",
    configValid: "कॉन्फ़िगरेशन सही है",
    configWarnings: "कॉन्फ़िगरेशन चेतावनियाँ",
    tsEntrypointWithNode:
      "Node टारगेट वाला TypeScript एंट्रीपॉइंट, बेहतर कम्पैटिबिलिटी के लिए Bun टारगेट पर विचार करें",
    watchModeStarted: "वॉच मोड शुरू हुआ, फ़ाइल बदलाव का इंतज़ार है...",
    watchModeRebuild: "फ़ाइल बदली: {{file}}, दोबारा बन रही है...",
    watchModeReady: "बिल्ड पूरा हुआ, बदलावों पर नज़र है...",
    watchModeError: "वॉच मोड एरर: {{error}}",
    watchModeStopped: "वॉच मोड बंद हुआ",
    parallelCompiling: "{{count}} फ़ाइलें पैरेलल कंपाइल हो रही हैं...",
    parallelComplete: "पैरेलल कंपाइलेशन पूरा: {{count}} फ़ाइलें {{duration}}ms में",
    cacheHit: "कैश हिट: {{file}} (छोड़ी गई)",
    cacheMiss: "कैश मिस: {{file}} (दोबारा बन रही है)",
    cacheCleared: "बिल्ड कैश साफ़ हुआ",
    cacheStats: "कैश: {{hits}} हिट, {{misses}} मिस ({{hitRate}}% हिट रेट)",
    generatingReport: "बिल्ड रिपोर्ट बन रही है...",
    reportGenerated: "बिल्ड रिपोर्ट बन गई: {{path}}",
    progress: "[{{current}}/{{total}}] {{step}}",
    spinnerBuilding: "बन रहा है...",
    spinnerCompiling: "कंपाइल हो रहा है...",
    spinnerBundling: "बंडल हो रहा है...",
  },
  post: {
    title: "पैकेज बिल्ड करें",
    titleShort: "पैकेज बिल्ड करें",
    description:
      "CLI बंडलिंग, Vite बिल्ड, React/Tailwind और npm डिस्ट्रीब्यूशन सपोर्ट करने वाला पूरा बिल्ड टूल",
    form: {
      title: "बिल्ड कॉन्फ़िगरेशन",
      description: "बिल्ड सेटिंग्स सेट करें या build.config.ts फ़ाइल इस्तेमाल करें",
    },
    fields: {
      // Config file path
      configPath: {
        title: "कॉन्फ़िग फ़ाइल का पाथ",
        description: "बिल्ड कॉन्फ़िगरेशन फ़ाइल का पाथ (build.config.ts)",
        placeholder: "build.config.ts",
      },
      // Config object
      configObject: {
        title: "बिल्ड विकल्प",
        description: "इनलाइन बिल्ड कॉन्फ़िगरेशन (कॉन्फ़िग फ़ाइल को ओवरराइड करता है)",
      },
      // Runtime options
      profile: {
        title: "बिल्ड प्रोफ़ाइल",
        description: "डेवलपमेंट (तेज़, डीबग) या प्रोडक्शन (ऑप्टिमाइज़्ड, मिनिफ़ाइड)",
      },
      dryRun: {
        title: "ड्राई रन",
        description: "बिना चलाए देखें कि क्या बनेगा",
      },
      verbose: {
        title: "विस्तृत आउटपुट",
        description: "बिल्ड की विस्तृत जानकारी और प्रगति दिखाएँ",
      },
      analyze: {
        title: "बंडल विश्लेषण",
        description: "बंडल साइज़ का विश्लेषण करें और ऑप्टिमाइज़ेशन के मौके खोजें",
      },
      watch: {
        title: "वॉच मोड",
        description: "फ़ाइल बदलावों पर नज़र रखें और अपने आप दोबारा बनाएँ",
      },
      parallel: {
        title: "पैरेलल बिल्ड",
        description: "तेज़ बिल्ड के लिए कई फ़ाइलें पैरेलल कंपाइल करें",
      },
      cache: {
        title: "बिल्ड कैश",
        description: "बिना बदली फ़ाइलें छोड़ने के लिए बिल्ड आर्टिफ़ैक्ट कैश करें",
      },
      report: {
        title: "रिपोर्ट बनाएँ",
        description: "विस्तृत मेट्रिक्स के साथ JSON बिल्ड रिपोर्ट बनाएँ",
      },
      minify: {
        title: "मिनिफ़ाई",
        description: "आउटपुट बंडल मिनिफ़ाई करें (प्रोफ़ाइल सेटिंग को ओवरराइड करता है)",
      },
      // Folders to clean
      foldersToClean: {
        title: "साफ़ करने के फ़ोल्डर",
        description: "बिल्ड से पहले हटाने वाले फ़ोल्डर (जैसे dist, build)",
        placeholder: "dist, build, .cache",
      },
      // Files to compile
      filesToCompile: {
        title: "कंपाइल करने की फ़ाइलें",
        description: "Vite या Bun से कंपाइल होने वाली फ़ाइलों की लिस्ट",
      },
      fileToCompile: {
        title: "फ़ाइल कॉन्फ़िगरेशन",
      },
      disabled: {
        title: "बंद",
        description: "बिल्ड के दौरान इस एंट्री को छोड़ें",
      },
      input: {
        title: "इनपुट फ़ाइल",
        description: "एंट्री पॉइंट फ़ाइल का पाथ (जैसे src/index.ts)",
        placeholder: "src/index.ts",
      },
      output: {
        title: "आउटपुट फ़ाइल",
        description: "आउटपुट फ़ाइल का पाथ (जैसे dist/index.js)",
        placeholder: "dist/index.js",
      },
      type: {
        title: "बिल्ड का प्रकार",
        description: "बिल्ड का प्रकार: React, Vanilla JS या एक्ज़ीक्यूटेबल",
      },
      modulesToExternalize: {
        title: "एक्सटर्नल मॉड्यूल",
        description: "बंडल से बाहर रखने वाले मॉड्यूल (जैसे react, lodash)",
        placeholder: "react, react-dom, lodash",
      },
      inlineCss: {
        title: "इनलाइन CSS",
        description: "CSS सीधे JavaScript बंडल में डालें",
      },
      bundleReact: {
        title: "React बंडल करें",
        description: "React को एक्सटर्नल की जगह बंडल में शामिल करें",
      },
      // Package config
      packageConfig: {
        title: "पैकेज कॉन्फ़िग",
        description: "TypeScript डिक्लेरेशन के साथ लाइब्रेरी बिल्ड की सेटिंग्स",
      },
      isPackage: {
        title: "पैकेज है",
        description: "पैकेज एक्सपोर्ट के साथ लाइब्रेरी मोड चालू करें",
      },
      dtsInclude: {
        title: "DTS शामिल करें",
        description: "डिक्लेरेशन में शामिल होने वाली TypeScript फ़ाइलों के Glob पैटर्न",
        placeholder: "src/**/*.ts",
      },
      dtsEntryRoot: {
        title: "DTS एंट्री रूट",
        description: "डिक्लेरेशन फ़ाइल बनाने की रूट डायरेक्टरी",
        placeholder: "src",
      },
      // Bun options
      bunOptions: {
        title: "Bun विकल्प",
        description: "एक्ज़ीक्यूटेबल बिल्ड के लिए Bun के ख़ास बिल्ड विकल्प",
      },
      bunTarget: {
        title: "टारगेट रनटाइम",
        description: "टारगेट रनटाइम: Bun, Node.js या ब्राउज़र",
      },
      bunMinify: {
        title: "मिनिफ़ाई",
        description: "छोटे आउटपुट के लिए मिनिफ़िकेशन चालू करें",
      },
      sourcemap: {
        title: "सोर्स मैप",
        description: "डीबगिंग के लिए सोर्स मैप बनाएँ",
      },
      external: {
        title: "एक्सटर्नल मॉड्यूल",
        description: "बंडल से बाहर रखने वाले मॉड्यूल",
        placeholder: "react, react-dom",
      },
      define: {
        title: "कॉन्स्टेंट परिभाषित करें",
        description: "JSON के रूप में कंपाइल-टाइम कॉन्स्टेंट (जैसे process.env.NODE_ENV)",
        placeholder: '{"process.env.NODE_ENV": "\\"production\\""}',
      },
      splitting: {
        title: "कोड स्प्लिटिंग",
        description: "साझा चंक के लिए कोड स्प्लिटिंग चालू करें",
      },
      format: {
        title: "आउटपुट फ़ॉर्मैट",
        description: "मॉड्यूल फ़ॉर्मैट: ESM, CommonJS या IIFE",
      },
      bytecode: {
        title: "बाइटकोड",
        description: "तेज़ स्टार्टअप के लिए Bun बाइटकोड में कंपाइल करें",
      },
      banner: {
        title: "बैनर",
        description: "आउटपुट के आगे जोड़ने वाला टेक्स्ट (जैसे शेबैंग लाइन)",
        placeholder: "#!/usr/bin/env node",
      },
      footer: {
        title: "फ़ुटर",
        description: "आउटपुट के अंत में जोड़ने वाला टेक्स्ट",
        placeholder: "// End of file",
      },
      publicPath: {
        title: "पब्लिक पाथ",
        label: "पब्लिक पाथ",
        description: "एसेट के लिए पब्लिक पाथ प्रीफ़िक्स",
      },
      naming: {
        title: "नेमिंग",
        label: "नेमिंग",
        description: "आउटपुट नेमिंग पैटर्न",
      },
      root: {
        title: "रूट",
        label: "रूट",
        description: "रूट डायरेक्टरी",
      },
      conditions: {
        title: "कंडीशन",
        label: "कंडीशन",
        description: "एक्सपोर्ट कंडीशन",
      },
      loader: {
        title: "लोडर",
        label: "लोडर",
        description: "फ़ाइल लोडर की मैपिंग",
      },
      drop: {
        title: "गिरावट",
        label: "गिरावट",
        description: "हटाने वाले आइडेंटिफ़ायर",
      },
      // Vite options
      viteOptions: {
        title: "Vite विकल्प",
        description: "एडवांस्ड Vite बिल्ड कॉन्फ़िगरेशन",
      },
      viteTarget: {
        title: "बिल्ड टारगेट",
        description: "ब्राउज़र/एनवायरनमेंट टारगेट (जैसे es2020, chrome80)",
        placeholder: "es2020, chrome80, node18",
      },
      viteOutDir: {
        title: "आउटपुट डायरेक्टरी",
        description: "बिल्ड आउटपुट की डायरेक्टरी",
        placeholder: "dist",
      },
      viteAssetsDir: {
        title: "एसेट डायरेक्टरी",
        description: "स्टैटिक एसेट की सबडायरेक्टरी",
        placeholder: "assets",
      },
      viteAssetsInlineLimit: {
        title: "इनलाइन सीमा",
        description: "एसेट को base64 में इनलाइन करने की अधिकतम साइज़ (बाइट)",
        placeholder: "4096",
      },
      viteChunkSizeWarningLimit: {
        title: "चंक साइज़ चेतावनी",
        description: "चंक साइज़ (KB) जिस पर चेतावनी आए",
        placeholder: "500",
      },
      viteCssCodeSplit: {
        title: "CSS कोड स्प्लिट",
        description: "हर चंक के लिए CSS को अलग फ़ाइलों में बाँटें",
      },
      viteSourcemap: {
        title: "सोर्स मैप",
        description: "सोर्स मैप बनाने का मोड",
      },
      viteMinify: {
        title: "मिनिफ़ायर",
        description: "मिनिफ़िकेशन टूल: esbuild या terser",
      },
      viteEmptyOutDir: {
        title: "आउटपुट डायरेक्टरी खाली करें",
        description: "बिल्ड से पहले आउटपुट डायरेक्टरी साफ़ करें",
      },
      viteReportCompressedSize: {
        title: "कंप्रेस्ड साइज़ रिपोर्ट करें",
        description: "gzip किए बंडल का साइज़ रिपोर्ट करें",
      },
      viteManifest: {
        title: "बिल्ड मैनिफ़ेस्ट",
        description: "एसेट फ़िंगरप्रिंटिंग के लिए manifest.json बनाएँ",
      },
      // Vite lib options
      viteLib: {
        title: "लाइब्रेरी मोड",
        description: "Vite लाइब्रेरी बिल्ड मोड सेट करें",
      },
      viteLibEntry: {
        title: "एंट्री पॉइंट",
        description: "लाइब्रेरी की एंट्री पॉइंट फ़ाइल(ें)",
        placeholder: "src/index.ts",
      },
      viteLibName: {
        title: "लाइब्रेरी का नाम",
        description: "UMD/IIFE बिल्ड के लिए ग्लोबल वेरिएबल का नाम",
        placeholder: "MyLibrary",
      },
      viteLibFormats: {
        title: "आउटपुट फ़ॉर्मैट",
        description: "लाइब्रेरी आउटपुट फ़ॉर्मैट (ES, CJS, UMD, IIFE)",
      },
      viteLibFileName: {
        title: "फ़ाइल का नाम",
        description: "आउटपुट फ़ाइल का नाम (एक्सटेंशन के बिना)",
        placeholder: "my-library",
      },
      // Rollup options
      viteRollupOptions: {
        title: "Rollup विकल्प",
        description: "एडवांस्ड Rollup बंडलर कॉन्फ़िगरेशन",
      },
      rollupExternal: {
        title: "एक्सटर्नल मॉड्यूल",
        description: "बंडल से बाहर रखने वाले मॉड्यूल",
        placeholder: "react, react-dom",
      },
      rollupTreeshake: {
        title: "ट्री शेकिंग",
        description: "बंडल से बिना इस्तेमाल का कोड हटाएँ",
      },
      rollupOutput: {
        title: "Rollup आउटपुट विकल्प",
        label: "Rollup आउटपुट विकल्प",
        description: "rollup आउटपुट विकल्प सीधे आगे भेजें",
      },
      viteTsconfigPath: {
        title: "tsconfig पाथ",
        description: "vite-tsconfig-paths के लिए tsconfig का पाथ (SPA मोड)",
        placeholder: "tsconfig.tanstack.json",
      },
      viteModuleAliases: {
        label: "मॉड्यूल अलायस",
        description:
          "इम्पोर्ट स्पेसिफ़ायर को असली फ़ाइल पाथ से जोड़ें (क्लाइंट और SSR दोनों पर लागू)",
      },
      vitePlugins: {
        title: "Vite प्लगइन",
        label: "Vite प्लगइन",
        description: "Vite प्लगइन की रॉ ऐरे (प्रोग्रामैटिक इस्तेमाल के लिए)",
      },
      viteBuild: {
        title: "रॉ बिल्ड विकल्प",
        label: "रॉ बिल्ड विकल्प",
        description: "Vite बिल्ड विकल्प सीधे आगे भेजें",
      },
      // Files to copy
      filesOrFoldersToCopy: {
        title: "कॉपी करने की फ़ाइलें",
        description: "कंपाइलेशन के बाद कॉपी होने वाली फ़ाइलें या फ़ोल्डर",
      },
      copyConfig: {
        title: "कॉपी कॉन्फ़िगरेशन",
      },
      copyInput: {
        title: "सोर्स",
        description: "सोर्स फ़ाइल या फ़ोल्डर का पाथ",
        placeholder: "README.md",
      },
      copyOutput: {
        title: "गंतव्य",
        description: "गंतव्य फ़ाइल या फ़ोल्डर का पाथ",
        placeholder: "dist/README.md",
      },
      copyPattern: {
        title: "पैटर्न",
        description: "फ़ाइलें फ़िल्टर करने का Glob पैटर्न",
        placeholder: "**/*.json",
      },
      // NPM package
      npmPackage: {
        title: "NPM पैकेज",
        description: "npm डिस्ट्रीब्यूशन के लिए package.json बनाएँ",
      },
      packageName: {
        title: "पैकेज का नाम",
        description: "npm पैकेज का नाम (जैसे @scope/package)",
        placeholder: "@myorg/package-name",
      },
      packageVersion: {
        title: "वर्ज़न",
        description: "पैकेज वर्शन (डिफ़ॉल्ट: रूट package.json)",
        placeholder: "1.0.0",
      },
      packageDescription: {
        title: "विवरण",
        description: "npm के लिए पैकेज का छोटा विवरण",
        placeholder: "आपके पैकेज का छोटा विवरण",
      },
      packageMain: {
        title: "मुख्य एंट्री",
        description: "CommonJS एंट्री पॉइंट (main फ़ील्ड)",
        placeholder: "./dist/index.cjs",
      },
      packageModule: {
        title: "मॉड्यूल एंट्री",
        description: "ES मॉड्यूल एंट्री पॉइंट (module फ़ील्ड)",
        placeholder: "./dist/index.mjs",
      },
      packageTypes: {
        title: "टाइप्स एंट्री",
        description: "TypeScript डिक्लेरेशन एंट्री (types फ़ील्ड)",
        placeholder: "./dist/index.d.ts",
      },
      packageBin: {
        title: "बाइनरी",
        description: "CLI एक्ज़ीक्यूटेबल की मैपिंग, JSON के रूप में",
        placeholder: '{"my-cli": "./dist/bin/cli.js"}',
      },
      packageExports: {
        title: "एक्सपोर्ट मैप",
        description: "पैकेज का exports फ़ील्ड, JSON के रूप में",
        placeholder:
          '{".": {"import": "./dist/index.mjs", "require": "./dist/index.cjs"}}',
      },
      packageDependencies: {
        title: "डिपेंडेंसी",
        description: "रनटाइम डिपेंडेंसी, JSON के रूप में",
        placeholder: '{"lodash": "^4.17.21"}',
      },
      packagePeerDependencies: {
        title: "पीयर डिपेंडेंसी",
        description: "पीयर डिपेंडेंसी, JSON के रूप में",
        placeholder: '{"react": ">=18.0.0"}',
      },
      packagePeerDependenciesMeta: {
        title: "पीयर डिपेंडेंसी मेटा",
        description: "पीयर डिपेंडेंसी को वैकल्पिक चिह्नित करें",
        placeholder: '{"react": {"optional": true}}',
      },
      packageFiles: {
        title: "शामिल फ़ाइलें",
        description: "पब्लिश होने वाले पैकेज में शामिल फ़ाइलें",
        placeholder: "dist, README.md, LICENSE",
      },
      packageKeywords: {
        title: "कीवर्ड",
        description: "npm सर्च कीवर्ड",
        placeholder: "typescript, build, vite",
      },
      packageLicense: {
        title: "लाइसेंस",
        description: "पैकेज का लाइसेंस (जैसे MIT, Apache-2.0)",
        placeholder: "MIT",
      },
      packageRepository: {
        title: "रिपॉज़िटरी",
        description: "Git रिपॉज़िटरी URL",
        placeholder: "https://github.com/user/repo",
      },
      packageOutputDir: {
        title: "आउटपुट डायरेक्टरी",
        description: "जिस डायरेक्टरी में package.json लिखा जाएगा (डिफ़ॉल्ट: dist/)",
        placeholder: ".dist/checker",
      },
      // Response fields
      success: {
        title: "सफल",
      },
      buildOutput: {
        title: "बिल्ड आउटपुट",
      },
      duration: {
        title: "अवधि (ms)",
      },
      outputPath: {
        title: "आउटपुट पाथ",
      },
      filesBuilt: {
        title: "बनी फ़ाइलें",
        item: "बनी फ़ाइल",
      },
      filesCopied: {
        title: "कॉपी हुई फ़ाइलें",
        item: "कॉपी की फ़ाइल",
      },
      packageJson: {
        title: "बनी package.json",
      },
      profileUsed: {
        title: "इस्तेमाल हुई प्रोफ़ाइल",
      },
      cacheStats: {
        title: "कैश आँकड़े",
        description: "बिल्ड कैश परफ़ॉर्मेंस मेट्रिक्स",
      },
      reportPath: {
        title: "रिपोर्ट का पाथ",
        description: "बनी बिल्ड रिपोर्ट का पाथ",
      },
      stepTimings: {
        title: "स्टेप टाइमिंग",
        description: "हर बिल्ड स्टेप की विस्तृत टाइमिंग",
        step: "स्टेप",
        duration: "अवधि (ms)",
        status: "स्टेटस",
        filesAffected: "फ़ाइलें",
      },
    },
    errors: {
      buildFailed: {
        title: "बिल्ड फ़ेल हुआ: {{error}}",
        description: "बिल्ड प्रोसेस एरर के साथ फ़ेल हुई",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिया गया बिल्ड कॉन्फ़िगरेशन गलत है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "बिल्ड प्रोसेस के दौरान नेटवर्क एरर आया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको बिल्ड चलाने की अनुमति नहीं है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "बिल्ड सिस्टम का एक्सेस मना है",
      },
      server: {
        title: "सर्वर एरर",
        description: "बिल्ड प्रोसेस के दौरान एरर आया",
      },
      notFound: {
        title: "नहीं मिला",
        description: "बताई गई फ़ाइल या कॉन्फ़िग नहीं मिला",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं जो बिल्ड पर असर डाल सकते हैं",
      },
      conflict: {
        title: "बिल्ड कॉन्फ़्लिक्ट",
        description: "एक टकराने वाला बिल्ड ऑपरेशन पहले से चल रहा है",
      },
    },
    success: {
      title: "बिल्ड सफल",
      description: "पैकेज बन गया",
    },
  },
  tags: {
    build: "build",
    npm: "npm",
    vite: "vite",
  },
  profiles: {
    development: "डेवलपमेंट",
    production: "प्रोडक्शन",
  },
  analysis: {
    criticalSize: "गंभीर: बंडल साइज़ ({{size}}) सीमा से ज़्यादा है",
    largeBundle: "चेतावनी: बड़ा बंडल मिला ({{size}})",
    considerTreeShaking: "बंडल साइज़ घटाने के लिए ट्री-शेकिंग चालू करने पर विचार करें",
    checkLargeDeps: "बड़ी डिपेंडेंसी जाँचें जिन्हें बदला जा सकता है",
    largeSourcemaps: "बड़े सोर्समैप मिले, प्रोडक्शन में बंद करने पर विचार करें",
    possibleDuplicates: "डुप्लिकेट डिपेंडेंसी की आशंका, डीडुप्लिकेशन पर विचार करें",
    totalSize: "कुल साइज़",
    largestFiles: "सबसे बड़ी फ़ाइलें",
  },
};
