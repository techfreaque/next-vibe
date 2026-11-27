import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "रिलीज़ टूल",
  titleShort: "रिलीज़ टूल",
  description: "वर्शन बंप, git टैगिंग और CI/CD इंटीग्रेशन के साथ पैकेज रिलीज़ मैनेज करें",
  category: "रिलीज़ टूल",
  tags: {
    release: "रिलीज़",
  },
  enums: {
    versionIncrement: {
      patch: "Patch",
      minor: "Minor",
      major: "Major",
      prepatch: "Pre-patch",
      preminor: "Pre-minor",
      premajor: "Pre-major",
      prerelease: "Prerelease",
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
      custom: "कस्टम",
    },
    npmAccess: {
      public: "पब्लिक",
      restricted: "प्रतिबंधित",
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
    title: "रिलीज़ कॉन्फ़िगरेशन",
    description: "अपने पैकेज के लिए रिलीज़ ऑप्शन सेट करें",
  },
  fields: {
    configPath: {
      title: "कॉन्फ़िग पाथ",
      description: "release.config.ts फ़ाइल का पाथ (डिफ़ॉल्ट: release.config.ts)",
    },
    ci: {
      title: "CI मोड",
      description:
        "CI मोड में चलाएँ (कोई इंटरैक्टिव प्रॉम्प्ट नहीं, ciReleaseCommand इस्तेमाल होती है)",
    },
    forceUpdate: {
      title: "डिपेंडेंसी ज़बरदस्ती अपडेट करें",
      description: "बिना पूछे सभी डिपेंडेंसी अपडेट करें (बाक़ी सभी स्टेप छोड़ें)",
    },
    dryRun: {
      title: "ड्राई रन",
      description: "कोई बदलाव किए बिना रिलीज़ सिमुलेट करें",
    },
    skipLint: {
      title: "Lint छोड़ें",
      description: "लिंटिंग स्टेप छोड़ें",
    },
    skipTypecheck: {
      title: "टाइप चेक छोड़ें",
      description: "TypeScript टाइप चेकिंग स्टेप छोड़ें",
    },
    skipBuild: {
      title: "बिल्ड छोड़ें",
      description: "बिल्ड स्टेप छोड़ें",
    },
    skipTests: {
      title: "टेस्ट छोड़ें",
      description: "टेस्ट चलाने का स्टेप छोड़ें",
    },
    skipSnyk: {
      title: "Snyk छोड़ें",
      description: "Snyk वल्नरेबिलिटी स्कैन छोड़ें",
    },
    skipPublish: {
      title: "पब्लिश छोड़ें",
      description: "npm/रजिस्ट्री पर पब्लिश करना छोड़ें",
    },
    skipChangelog: {
      title: "चेंजलॉग छोड़ें",
      description: "चेंजलॉग जनरेशन छोड़ें",
    },
    prereleaseId: {
      title: "Prerelease ID",
      description: "वर्शन बंप के लिए प्रीरिलीज़ आइडेंटिफ़ायर (alpha, beta, rc)",
    },
    versionIncrement: {
      title: "वर्शन इंक्रीमेंट",
      description:
        "वर्शन इंक्रीमेंट टाइप (patch, minor, major), सिर्फ़ लोकल मोड में इस्तेमाल होता है",
    },
    targetPackage: {
      title: "टारगेट पैकेज",
      description: "कोई ख़ास पैकेज डायरेक्टरी चुनें (वैकल्पिक, डिफ़ॉल्ट: सभी पैकेज)",
    },
    inlineConfig: {
      title: "इनलाइन कॉन्फ़िग",
      description: "कॉन्फ़िग फ़ाइल की जगह रिलीज़ कॉन्फ़िगरेशन इनलाइन दें",
    },
    skipGitTag: {
      title: "Git टैग छोड़ें",
      description: "रिलीज़ के दौरान git टैग बनाना छोड़ें",
    },
    skipGitPush: {
      title: "Git पुश छोड़ें",
      description: "रिमोट रिपॉज़िटरी पर पुश करना छोड़ें",
    },
    verbose: {
      title: "वर्बोस",
      description: "विस्तृत आउटपुट के लिए वर्बोस लॉगिंग चालू करें",
    },
    skipInstall: {
      title: "इंस्टॉल छोड़ें",
      description: "डिपेंडेंसी इंस्टॉलेशन स्टेप छोड़ें",
    },
    skipClean: {
      title: "क्लीन छोड़ें",
      description: "बिल्ड से पहले का क्लीन स्टेप छोड़ें",
    },
    commitMessage: {
      title: "कमिट मैसेज",
      description:
        // eslint-disable-next-line no-template-curly-in-string -- Intentional template placeholder documentation
        "Custom commit message for version bump (supports ${version} placeholder)",
    },
    notifyWebhook: {
      title: "नोटिफ़िकेशन वेबहुक",
      description:
        "रिलीज़ नोटिफ़िकेशन भेजने के लिए वेबहुक URL (Slack, Discord, Teams या कस्टम)",
    },
    configObject: {
      title: "कॉन्फ़िगरेशन ऑब्जेक्ट",
      description: "रिलीज़ कॉन्फ़िगरेशन सेटिंग",
    },
    packageManager: {
      title: "पैकेज मैनेजर",
      description:
        "रिलीज़ के लिए इस्तेमाल होने वाला पैकेज मैनेजर (bun, npm, yarn, pnpm, deno)",
    },
    globalVersion: {
      title: "ग्लोबल वर्शन",
      description: "मोनोरेपो के सभी पैकेज के लिए ग्लोबल वर्शन सेट करें",
    },
    parallel: {
      title: "पैरेलल एक्ज़ीक्यूशन",
      description: "पैकेज की पैरेलल प्रोसेसिंग चालू करें",
    },
    maxParallelJobs: {
      title: "अधिकतम पैरेलल जॉब",
      description: "एक साथ चलने वाली जॉब की अधिकतम संख्या",
    },
    continueOnError: {
      title: "एरर पर भी जारी रखें",
      description: "एक पैकेज फ़ेल हो तो बाक़ी पैकेज की प्रोसेसिंग जारी रखें",
    },
    verifyGitStatus: {
      title: "Git स्टेटस जाँचें",
      description: "रिलीज़ से पहले git स्टेटस जाँचें",
    },
    requireCleanWorkingDir: {
      title: "साफ़ वर्किंग डायरेक्टरी ज़रूरी",
      description: "रिलीज़ से पहले वर्किंग डायरेक्टरी साफ़ होना ज़रूरी",
    },
    verifyLockfile: {
      title: "लॉकफ़ाइल जाँचें",
      description: "रिलीज़ से पहले लॉकफ़ाइल की इंटीग्रिटी जाँचें",
    },
    branch: {
      title: "ब्रांच कॉन्फ़िगरेशन",
      description: "Git ब्रांच कॉन्फ़िगरेशन सेटिंग",
    },
    branchMain: {
      title: "मेन ब्रांच",
      description: "मेन/प्रोडक्शन ब्रांच का नाम",
    },
    branchDevelop: {
      title: "Develop ब्रांच",
      description: "डेवलपमेंट ब्रांच का नाम",
    },
    allowNonMain: {
      title: "नॉन-मेन रिलीज़ की अनुमति दें",
      description: "मेन के अलावा दूसरी ब्रांच से रिलीज़ की अनुमति दें",
    },
    protectedBranches: {
      title: "सुरक्षित ब्रांच",
      description: "सुरक्षित ब्रांच के नामों की सूची",
    },
    notifications: {
      title: "नोटिफ़िकेशन",
      description: "रिलीज़ इवेंट के लिए नोटिफ़िकेशन कॉन्फ़िगरेशन",
    },
    notificationsEnabled: {
      title: "नोटिफ़िकेशन चालू करें",
      description: "रिलीज़ नोटिफ़िकेशन चालू करें",
    },
    webhookUrl: {
      title: "वेबहुक URL",
      description: "वेबहुक नोटिफ़िकेशन के लिए URL",
    },
    webhookType: {
      title: "वेबहुक टाइप",
      description: "वेबहुक का टाइप (Slack, Discord, Teams, Custom)",
    },
    onSuccess: {
      title: "सफलता पर सूचित करें",
      description: "रिलीज़ सफल होने पर नोटिफ़िकेशन भेजें",
    },
    onFailure: {
      title: "फ़ेल होने पर सूचित करें",
      description: "रिलीज़ फ़ेल होने पर नोटिफ़िकेशन भेजें",
    },
    messageTemplate: {
      title: "मैसेज टेम्पलेट",
      description: "नोटिफ़िकेशन के लिए कस्टम मैसेज टेम्पलेट",
    },
    includeTimings: {
      title: "टाइमिंग शामिल करें",
      description: "नोटिफ़िकेशन में टाइमिंग की जानकारी जोड़ें",
    },
    retry: {
      title: "रीट्राई कॉन्फ़िगरेशन",
      description: "फ़ेल ऑपरेशन के लिए रीट्राई सेटिंग",
    },
    maxAttempts: {
      title: "अधिकतम कोशिशें",
      description: "रीट्राई कोशिशों की अधिकतम संख्या",
    },
    delayMs: {
      title: "रीट्राई में देरी",
      description: "रीट्राई के बीच शुरुआती देरी, मिलीसेकंड में",
    },
    backoffMultiplier: {
      title: "बैकऑफ़ मल्टीप्लायर",
      description: "एक्सपोनेंशियल बैकऑफ़ का गुणक",
    },
    maxDelayMs: {
      title: "अधिकतम देरी",
      description: "रीट्राई के बीच अधिकतम देरी, मिलीसेकंड में",
    },
    rollback: {
      title: "रोलबैक कॉन्फ़िगरेशन",
      description: "फ़ेल होने पर ऑटोमैटिक रोलबैक की सेटिंग",
    },
    rollbackEnabled: {
      title: "रोलबैक चालू करें",
      description: "फ़ेल होने पर ऑटोमैटिक रोलबैक चालू करें",
    },
    rollbackGit: {
      title: "Git बदलाव रोलबैक करें",
      description: "फ़ेल होने पर git कमिट और टैग रोलबैक करें",
    },
    rollbackVersion: {
      title: "वर्शन बदलाव रोलबैक करें",
      description: "फ़ेल होने पर वर्शन बदलाव रोलबैक करें",
    },
    packages: {
      title: "पैकेज",
      description: "रिलीज़ होने वाले पैकेज की सूची",
    },
    package: {
      title: "पैकेज कॉन्फ़िगरेशन",
    },
    directory: {
      title: "डायरेक्टरी",
    },
    name: {
      title: "नाम",
    },
    updateDeps: {
      title: "डिपेंडेंसी अपडेट करें",
      description: "डिपेंडेंट पैकेज में डिपेंडेंसी अपडेट करें",
    },
    clean: {
      title: "क्लीन कमांड",
      description: "पैकेज क्लीन करने की कमांड या स्क्रिप्ट",
    },
    lint: {
      title: "Lint कमांड",
      description: "पैकेज लिंट करने की कमांड या स्क्रिप्ट",
    },
    typecheck: {
      title: "Typecheck कमांड",
      description: "पैकेज टाइपचेक करने की कमांड या स्क्रिप्ट",
    },
    build: {
      title: "बिल्ड कमांड",
      description: "पैकेज बिल्ड करने की कमांड या स्क्रिप्ट",
    },
    test: {
      title: "टेस्ट कमांड",
      description: "पैकेज टेस्ट करने की कमांड या स्क्रिप्ट",
    },
    snyk: {
      title: "Snyk स्कैन",
      description: "Snyk सिक्योरिटी स्कैनिंग चालू करें",
    },
    install: {
      title: "इंस्टॉल कमांड",
      description: "डिपेंडेंसी इंस्टॉल करने की कमांड या स्क्रिप्ट",
    },
    release: {
      title: "रिलीज़ कॉन्फ़िगरेशन",
    },
    releaseVersion: {
      title: "रिलीज़ वर्शन",
    },
    tagPrefix: {
      title: "टैग प्रीफ़िक्स",
    },
    tagSuffix: {
      title: "टैग सफ़िक्स",
    },
    ciReleaseCommand: {
      title: "CI रिलीज़ कमांड",
      description: "रिलीज़ के लिए CI मोड में चलने वाली कमांड",
    },
    ciCommand: {
      title: "कमांड",
      description: "चलाने के लिए कमांड ऐरे",
    },
    ciEnvMapping: {
      title: "एनवायरनमेंट मैपिंग",
      description: "CI के लिए एनवायरनमेंट वेरिएबल मैपिंग",
    },
    gitOps: {
      title: "Git ऑपरेशन",
    },
    skipTag: {
      title: "टैग छोड़ें",
    },
    skipPush: {
      title: "पुश छोड़ें",
    },
    skipCommit: {
      title: "कमिट छोड़ें",
    },
    signCommit: {
      title: "कमिट साइन करें",
    },
    signTag: {
      title: "टैग साइन करें",
    },
    remote: {
      title: "रिमोट",
    },
    npm: {
      title: "NPM कॉन्फ़िगरेशन",
    },
    npmEnabled: {
      title: "NPM पब्लिशिंग चालू करें",
    },
    npmRegistry: {
      title: "NPM रजिस्ट्री",
    },
    npmTag: {
      title: "NPM टैग",
    },
    npmAccess: {
      title: "NPM एक्सेस",
    },
    otpEnvVar: {
      title: "OTP एनवायरनमेंट वेरिएबल",
    },
    provenance: {
      title: "Provenance",
    },
    ignoreScripts: {
      title: "स्क्रिप्ट अनदेखी करें",
    },
    npmDryRun: {
      title: "NPM ड्राई रन",
    },
    jsr: {
      title: "JSR कॉन्फ़िगरेशन",
    },
    jsrEnabled: {
      title: "JSR पब्लिशिंग चालू करें",
    },
    allowSlowTypes: {
      title: "धीमे टाइप की अनुमति दें",
    },
    allowDirty: {
      title: "डर्टी की अनुमति दें",
    },
    jsrDryRun: {
      title: "JSR ड्राई रन",
    },
    changelog: {
      title: "चेंजलॉग कॉन्फ़िगरेशन",
    },
    changelogEnabled: {
      title: "चेंजलॉग चालू करें",
    },
    changelogFile: {
      title: "चेंजलॉग फ़ाइल",
    },
    changelogHeader: {
      title: "चेंजलॉग हेडर",
    },
    compareUrlFormat: {
      title: "तुलना URL फ़ॉर्मैट",
    },
    commitUrlFormat: {
      title: "कमिट URL फ़ॉर्मैट",
    },
    includeBody: {
      title: "बॉडी शामिल करें",
    },
    changelogPreset: {
      title: "चेंजलॉग प्रीसेट",
    },
    gitRelease: {
      title: "Git रिलीज़ कॉन्फ़िगरेशन",
    },
    gitReleaseEnabled: {
      title: "Git रिलीज़ चालू करें",
    },
    releaseTitle: {
      title: "रिलीज़ टाइटल",
    },
    generateNotes: {
      title: "नोट्स जनरेट करें",
    },
    releaseBody: {
      title: "रिलीज़ बॉडी",
    },
    draft: {
      title: "ड्राफ़्ट",
    },
    prerelease: {
      title: "Prerelease",
    },
    discussionCategory: {
      title: "डिस्कशन कैटेगरी",
    },
    target: {
      title: "टारगेट",
    },
    assets: {
      title: "एसेट",
      description: "अपलोड होने वाले रिलीज़ एसेट",
    },
    foldersToZip: {
      title: "ज़िप होने वाले फ़ोल्डर",
      description: "रिलीज़ के लिए ज़िप होने वाले फ़ोल्डर",
    },
    versionBumper: {
      title: "वर्शन बंपर",
      description: "package.json के अलावा दूसरी फ़ाइलों के लिए वर्शन बंप कॉन्फ़िगरेशन",
    },
    hooks: {
      title: "लाइफ़साइकल हुक",
      description: "अलग-अलग स्टेज पर चलने वाली कमांड",
    },
    preInstall: {
      title: "Pre-Install हुक",
    },
    postInstall: {
      title: "Post-Install हुक",
    },
    preClean: {
      title: "Pre-Clean हुक",
    },
    postClean: {
      title: "Post-Clean हुक",
    },
    preLint: {
      title: "Pre-Lint हुक",
    },
    postLint: {
      title: "Post-Lint हुक",
    },
    preTypecheck: {
      title: "Pre-Typecheck हुक",
    },
    postTypecheck: {
      title: "Post-Typecheck हुक",
    },
    preBuild: {
      title: "Pre-Build हुक",
    },
    postBuild: {
      title: "Post-Build हुक",
    },
    preTest: {
      title: "Pre-Test हुक",
    },
    postTest: {
      title: "Post-Test हुक",
    },
    prePublish: {
      title: "Pre-Publish हुक",
    },
    postPublish: {
      title: "Post-Publish हुक",
    },
    preRelease: {
      title: "Pre-Release हुक",
    },
    postRelease: {
      title: "Post-Release हुक",
    },
    globalHooks: {
      title: "ग्लोबल हुक",
      description: "पूरी रिलीज़ प्रक्रिया के ग्लोबल लाइफ़साइकल हुक",
    },
  },
  response: {
    status: "स्टेटस",
    success: "रिलीज़ स्टेटस",
    output: "रिलीज़ लॉग",
    duration: "अवधि",
    packages: "पैकेज",
    packagesProcessed: "प्रोसेस हुए पैकेज",
    ciEnvironment: "CI एनवायरनमेंट",
    errors: "एरर",
    warnings: "चेतावनियाँ",
    gitInfo: "Git जानकारी",
    published: "पब्लिश हुए पैकेज",
    publishedPackages: "पब्लिश हुए पैकेज",
    timings: "परफ़ॉर्मेंस",
    rollbackPerformed: "रोलबैक हुआ",
    notificationsSent: "नोटिफ़िकेशन",
  },
  table: {
    name: "पैकेज",
    directory: "डायरेक्टरी",
    version: "वर्ज़न",
    tag: "टैग",
    status: "स्टेटस",
    message: "मैसेज",
    registry: "रजिस्ट्री",
    url: "URL",
  },
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "रिलीज़ कॉन्फ़िगरेशन गलत है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "कॉन्फ़िग फ़ाइल या पैकेज नहीं मिला",
    },
    server: {
      title: "सर्वर एरर",
      description: "रिलीज़ प्रक्रिया के दौरान एरर हुआ",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर आया",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "रिलीज़ प्रक्रिया के दौरान नेटवर्क एरर",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "रिलीज़ करने की अनुमति नहीं है",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "रिलीज़ ऑपरेशन के लिए एक्सेस अस्वीकृत",
    },
    conflict: {
      title: "टकराव",
      description: "रिलीज़ कॉन्फ़्लिक्ट मिला (टैग पहले से मौजूद हो सकता है)",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "अनसेव बदलाव हैं जिन्हें पहले कमिट करना होगा",
    },
    packageNotFound: "कॉन्फ़िगरेशन में पैकेज '{{targetPackage}}' नहीं मिला",
    gitOperationFailed: "Git ऑपरेशन फ़ेल हुआ: {{error}}",
    gitAddFailed: "Git add फ़ेल हुआ: {{error}}",
    gitTagFailed: "Git टैग '{{tag}}' फ़ेल हुआ: {{error}}",
    gitPushFailed: "'{{remote}}' पर git push फ़ेल हुआ: {{error}}",
    gitPushTagFailed:
      "टैग '{{tag}}' को '{{remote}}' पर पुश करना फ़ेल हुआ: {{error}}",
  },
  success: {
    title: "रिलीज़ पूरी हुई",
    description: "रिलीज़ प्रक्रिया सफलतापूर्वक पूरी हुई",
  },
  config: {
    fileNotFound: "कॉन्फ़िग फ़ाइल नहीं मिली: {{path}}",
    invalidFormat:
      "कॉन्फ़िग फ़ॉर्मैट गलत है। पक्का करें कि कॉन्फ़िग 'packages' ऐरे वाला डिफ़ॉल्ट ऑब्जेक्ट एक्सपोर्ट करता है। ज़्यादा जानकारी के लिए डॉक्स देखें।",
    errorLoading: "कॉन्फ़िग लोड करते समय एरर: {{error}}",
  },
  packageJson: {
    notFound: "Package.json नहीं मिली: {{path}}",
    invalidFormat: "Package.json का फ़ॉर्मैट गलत है: {{path}}",
    errorReading: "Package.json पढ़ते समय एरर: {{error}}",
    errorUpdatingDeps: "{{directory}} की डिपेंडेंसी अपडेट करते समय एरर: {{error}}",
    errorUpdatingVersion:
      "{{directory}} का पैकेज वर्शन अपडेट करते समय एरर: {{error}}",
  },
  scripts: {
    invalidPackageJson: "{{path}} में package.json का फ़ॉर्मैट गलत है",
    testsFailed: "{{path}} में टेस्ट फ़ेल हुए: {{error}}",
    lintFailed: "{{path}} में लिंटिंग फ़ेल हुई: {{output}}",
    typecheckFailed: "{{path}} में टाइप चेकिंग फ़ेल हुई: {{error}}",
    buildFailed: "{{path}} में बिल्ड फ़ेल हुआ: {{error}}",
    packageJsonNotFound: "{{path}} में package.json नहीं मिली",
  },
  snyk: {
    cliNotFound: "Snyk CLI नहीं मिला। इससे इंस्टॉल करें: npm install -g snyk",
    testFailed: "{{packageName}} के लिए Snyk वल्नरेबिलिटी टेस्ट फ़ेल हुआ: {{error}}",
    tokenRequired: "{{packageName}} के लिए SNYK_TOKEN एनवायरनमेंट वेरिएबल चाहिए",
    orgKeyRequired: "{{packageName}} के लिए SNYK_ORG_KEY एनवायरनमेंट वेरिएबल चाहिए",
    monitorFailed: "{{packageName}} के लिए Snyk मॉनिटर फ़ेल हुआ: {{error}}",
  },
  git: {
    tagCreated: "Git टैग '{{tag}}' सफलतापूर्वक बन गया",
    tagExists: "Git टैग '{{tag}}' पहले से मौजूद है",
    pushSuccess: "बदलाव रिमोट पर पुश हो गए",
    noCommits: "टैग '{{lastTag}}' के बाद कोई नया कमिट नहीं",
    uncommittedChanges: "अनकमिटेड बदलाव मिले",
    notOnMain: "आप ब्रांच '{{main}}' पर नहीं हैं (मौजूदा: {{currentBranch}})",
    commitFailed: "बदलाव कमिट नहीं हो सके",
    tagFailed: "टैग नहीं बन सका",
    pushFailed: "रिमोट पर पुश नहीं हो सका",
  },
  version: {
    bumped: "वर्शन {{from}} से {{to}} हुआ ({{increment}})",
    fileUpdated: "{{file}} में वर्शन {{newVersion}} पर अपडेट हुआ",
    invalidFormat: "वर्शन फ़ॉर्मैट गलत है: {{version}}",
  },
  ci: {
    commandRunning: "{{package}} के लिए CI रिलीज़ कमांड चल रही है: {{command}}",
    commandSuccess: "{{package}} के लिए CI रिलीज़ कमांड पूरी हुई",
    commandFailed: "{{package}} के लिए CI रिलीज़ कमांड फ़ेल हुई: {{error}}",
    commandRequired:
      "CI मोड में {{package}} के लिए ciReleaseCommand कॉन्फ़िगरेशन चाहिए",
    envVarMissing:
      "{{package}} के लिए ज़रूरी एनवायरनमेंट वेरिएबल '{{variable}}' सेट नहीं है",
  },
  zip: {
    starting: "फ़ोल्डर ज़िप हो रहे हैं...",
    complete: "{{input}} को {{output}} में सफलतापूर्वक ज़िप किया ({{bytes}} bytes)",
    failed: "{{input}} ज़िप नहीं हो सका: {{error}}",
    noFolders: "कॉन्फ़िगरेशन में ज़िप करने के लिए कोई फ़ोल्डर नहीं",
    inputNotFound: "इनपुट फ़ोल्डर {{input}} मौजूद नहीं है",
  },
  dryRun: {
    prefix: "[ड्राई रन]",
    wouldExecute: "यह चलाया जाता: {{action}}",
  },
  release: {
    starting: "रिलीज़ प्रक्रिया शुरू हो रही है...",
    ciMode: "CI मोड में रिलीज़ चल रही है...",
    localMode: "लोकल मोड में रिलीज़ चल रही है...",
    forceUpdate: "डिपेंडेंसी ज़बरदस्ती अपडेट हो रही हैं...",
    complete: "रिलीज़ प्रक्रिया पूरी हुई",
    failed: "रिलीज़ प्रक्रिया फ़ेल हुई",
    processingPackage: "पैकेज प्रोसेस हो रहा है: {{name}}",
    packageSkipped: "पैकेज '{{name}}' छोड़ा गया: {{reason}}",
    packageComplete: "पैकेज '{{name}}' पूरा हुआ",
    packageFailed: "पैकेज '{{name}}' फ़ेल हुआ: {{error}}",
    firstRelease: "कोई पिछला टैग नहीं मिला। यह पहली रिलीज़ होगी।",
  },
  qualityChecks: {
    linting: "{{package}} की लिंटिंग चल रही है...",
    lintPassed: "{{package}} की लिंटिंग पास हुई",
    lintFailed: "{{package}} की लिंटिंग फ़ेल हुई",
    typeChecking: "{{package}} का टाइप चेक चल रहा है...",
    typeCheckPassed: "{{package}} का टाइप चेक पास हुआ",
    typeCheckFailed: "{{package}} का टाइप चेक फ़ेल हुआ",
    building: "{{package}} बिल्ड हो रहा है...",
    buildPassed: "{{package}} का बिल्ड पास हुआ",
    buildFailed: "{{package}} का बिल्ड फ़ेल हुआ",
    testing: "{{package}} के टेस्ट चल रहे हैं...",
    testsPassed: "{{package}} के टेस्ट पास हुए",
    testsFailed: "{{package}} के टेस्ट फ़ेल हुए",
    snykTesting: "{{package}} का Snyk टेस्ट चल रहा है...",
    snykTestPassed: "{{package}} का Snyk टेस्ट पास हुआ",
    snykTestFailed: "{{package}} का Snyk टेस्ट फ़ेल हुआ",
    snykMonitoring: "{{package}} का Snyk मॉनिटर चल रहा है...",
    snykMonitorPassed: "{{package}} का Snyk मॉनिटर पूरा हुआ",
    snykMonitorFailed: "{{package}} का Snyk मॉनिटर फ़ेल हुआ",
  },
  dependencies: {
    updating: "{{directory}} की डिपेंडेंसी अपडेट हो रही हैं...",
    updated: "{{directory}} की डिपेंडेंसी अपडेट हो गईं",
    failed: "{{directory}} की डिपेंडेंसी अपडेट फ़ेल हुई: {{error}}",
    skipped: "{{directory}} की डिपेंडेंसी अपडेट छोड़ी जा रही हैं",
    dedupeFailed: "{{directory}} की डिपेंडेंसी डीडुप्लिकेट नहीं हो सकीं: {{error}}",
  },
  security: {
    auditFailed: "{{directory}} का सिक्योरिटी ऑडिट फ़ेल हुआ: {{error}}",
  },
  hooks: {
    running: "{{package}} के लिए {{hook}} हुक चल रहा है...",
    completed: "{{package}} के लिए हुक {{hook}} पूरा हुआ",
    failed: "हुक कमांड '{{command}}' फ़ेल हुई: {{error}}",
    skipped: "{{hook}} हुक छोड़ा जा रहा है (continueOnError)",
  },
  npm: {
    publishing: "{{package}} npm पर पब्लिश हो रहा है...",
    published: "{{package}}@{{version}} npm पर सफलतापूर्वक पब्लिश हुआ",
    publishFailed: "{{package}} npm पर पब्लिश नहीं हो सका: {{error}}",
    registry: "npm रजिस्ट्री इस्तेमाल हो रही है: {{registry}}",
    dryRun: "[ड्राई रन] {{package}}@{{version}} npm पर पब्लिश होता",
  },
  changelog: {
    generating: "{{package}} का चेंजलॉग बन रहा है...",
    generated: "{{package}} का चेंजलॉग बन गया",
    failed: "{{directory}} का चेंजलॉग नहीं बन सका: {{error}}",
    noChanges: "{{package}} के चेंजलॉग में जोड़ने के लिए कोई बदलाव नहीं",
  },
  branch: {
    checking: "ब्रांच स्टेटस जाँचा जा रहा है...",
    notAllowed: "ब्रांच '{{branch}}' से रिलीज़ की अनुमति नहीं है (मेन: {{main}})",
    isProtected: "ब्रांच '{{branch}}' सुरक्षित है",
  },
  gitRelease: {
    creating: "{{tag}} के लिए GitHub रिलीज़ बन रही है...",
    created: "GitHub रिलीज़ सफलतापूर्वक बन गई: {{url}}",
    failed: "GitHub रिलीज़ नहीं बन सकी: {{error}}",
    ghNotFound: "GitHub CLI (gh) नहीं मिला, GitHub रिलीज़ छोड़ी जा रही है",
    notGitHub: "GitHub रिलीज़ सिर्फ़ GitHub रिपॉज़िटरी के लिए सपोर्टेड है",
  },
  validation: {
    branchNotAllowed: "ब्रांच '{{branch}}' से रिलीज़ की अनुमति नहीं है",
    dirtyWorkingDir: "वर्किंग डायरेक्टरी में अनकमिटेड बदलाव हैं",
    passed: "सभी वैलिडेशन पास हुए",
  },
  summary: {
    header: "रिलीज़ सारांश",
    successCount: "{{count}} पैकेज सफलतापूर्वक रिलीज़ हुए",
    skipCount: "{{count}} पैकेज छोड़े गए",
    failCount: "{{count}} पैकेज फ़ेल हुए",
  },
  jsr: {
    publishing: "{{package}} JSR पर पब्लिश हो रहा है...",
    published: "{{package}} JSR पर सफलतापूर्वक पब्लिश हुआ",
    failed: "{{package}} JSR पर पब्लिश नहीं हो सका: {{error}}",
  },
  gitlab: {
    creating: "{{tag}} के लिए GitLab रिलीज़ बन रही है...",
    created: "GitLab रिलीज़ सफलतापूर्वक बन गई: {{url}}",
    failed: "GitLab रिलीज़ नहीं बन सकी: {{error}}",
    glabNotFound: "GitLab CLI (glab) नहीं मिला, GitLab रिलीज़ छोड़ी जा रही है",
  },
  lockfile: {
    checking: "लॉकफ़ाइल की इंटीग्रिटी जाँची जा रही है...",
    valid: "लॉकफ़ाइल सही है",
    invalid: "लॉकफ़ाइल इंटीग्रिटी चेक फ़ेल हुआ: {{error}}",
    missing: "कोई लॉकफ़ाइल नहीं मिली (अपेक्षित: {{expected}})",
  },
  notifications: {
    sending: "नोटिफ़िकेशन भेजा जा रहा है...",
    sent: "नोटिफ़िकेशन सफलतापूर्वक भेजा गया",
    failed: "नोटिफ़िकेशन भेजना फ़ेल हुआ: {{error}}",
    disabled: "नोटिफ़िकेशन बंद हैं",
  },
  retry: {
    attempt: "{{operation}} के लिए रीट्राई कोशिश {{attempt}} / {{maxAttempts}}",
    failed: "{{operation}} की सभी रीट्राई कोशिशें फ़ेल हुईं",
    success: "ऑपरेशन {{operation}} रीट्राई के बाद सफल हुआ",
  },
  rollback: {
    starting: "रोलबैक शुरू हो रहा है...",
    complete: "रोलबैक सफलतापूर्वक पूरा हुआ",
    failed: "रोलबैक फ़ेल हुआ: {{error}}",
    git: "Git बदलाव रोलबैक हो रहे हैं...",
    version: "वर्शन बदलाव रोलबैक हो रहे हैं...",
  },
  timings: {
    report: "टाइमिंग ब्रेकडाउन",
    validation: "वैलिडेशन",
    install: "इंस्टॉल",
    clean: "क्लीन",
    lint: "लिंट",
    typecheck: "टाइपचेक",
    build: "बिल्ड",
    test: "टेस्ट",
    publish: "पब्लिश",
    changelog: "चेंजलॉग",
    gitOperations: "Git ऑपरेशन",
  },
  widget: {
    runRelease: "रिलीज़ चलाएँ",
    runAgain: "फिर से चलाएँ",
    complete: "रिलीज़ पूरी हुई",
    failed: "रिलीज़ फ़ेल हुई",
    published: "पब्लिश किया गया",
    errors: "एरर",
    bullet: "•",
    warning: "⚠",
  },
};
