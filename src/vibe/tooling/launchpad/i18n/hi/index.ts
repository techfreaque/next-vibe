import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "रिलीज़ एक्ज़ीक्यूटर",
  errors: {
    configNotLoaded: "कॉन्फ़िगरेशन लोड नहीं हुआ। पहले कॉन्फ़िगरेशन लोड करें।",
    configFileNotFound: "कॉन्फ़िग फ़ाइल नहीं मिली: {{path}}",
    configFileNotFoundInParents:
      "कॉन्फ़िग फ़ाइल '{{filename}}' मौजूदा डायरेक्टरी या किसी भी पैरेंट डायरेक्टरी में नहीं मिली",
    invalidConfigFormat:
      "कॉन्फ़िग फ़ॉर्मैट गलत है। पक्का करें कि कॉन्फ़िग 'packages' प्रॉपर्टी वाला डिफ़ॉल्ट ऑब्जेक्ट एक्सपोर्ट करता है।",
    errorLoadingConfig: "कॉन्फ़िग लोड करने में एरर:",
  },
  releaseExecutor: {
    processing: "\n🚀 प्रोसेस हो रहा है: {{directory}}",
    executing: "चल रहा है: {{command}}",
    completed: "✅ सफलतापूर्वक पूरा: {{directory}}",
    failed: "❌ {{directory}} प्रोसेस नहीं हो सका",
    baseCommand: "bun pub release",
    forceUpdateCommand: "bun pub release --force-update",
    state: {
      continuing: "पिछली स्थिति से जारी...",
      noState: "कोई पुरानी स्थिति नहीं मिली, नए सिरे से शुरू...",
      allCompleted: "सभी टारगेट सफलतापूर्वक प्रोसेस हो गए!",
    },
    prompts: {
      retryFailed: "{{count}} फ़ेल टारगेट फिर आज़माएँ?",
      targetAction: "{{directory}} के साथ क्या करना है?",
      processTarget: "यह टारगेट प्रोसेस करें",
      skipTarget: "यह टारगेट छोड़ें",
      abortOperation: "पूरा ऑपरेशन रद्द करें",
      continueAfterFailure: "बाकी टारगेट के साथ जारी रखें?",
    },
    actions: {
      skipped: "⏭️  छोड़ा गया: {{directory}}",
      aborted: "यूज़र ने ऑपरेशन रद्द किया",
      stopped: "फ़ेल होने की वजह से ऑपरेशन रुक गया",
      continuing: "बाकी टारगेट के साथ जारी...",
    },
    summary: {
      title: "\n📊 अंतिम सार:",
      allSuccess: "🎉 सभी टारगेट सफलतापूर्वक प्रोसेस हुए!",
      failedTargets:
        "⚠️  {{count}} टारगेट फ़ेल हुए। दोबारा आज़माने के लिए --continue इस्तेमाल करें।",
    },
    forceUpdate: {
      starting: "🔄 सभी टारगेट की डिपेंडेंसी ज़बरदस्ती अपडेट हो रही हैं...",
      updating: "\n📦 अपडेट हो रहा है: {{directory}}",
      updated: "✅ अपडेट हुआ: {{directory}}",
      failed: "❌ {{directory}} अपडेट नहीं हो सका",
      completed: "🎉 सभी टारगेट के लिए ज़बरदस्ती अपडेट पूरा!",
    },
    forceRelease: {
      starting:
        "🚀 {{versionBump}} वर्ज़न बंप के साथ सभी टारगेट ज़बरदस्ती रिलीज़ हो रहे हैं...",
    },
    weeklyUpdate: {
      starting: "📅 साप्ताहिक अपडेट प्रक्रिया शुरू...",
      targetBranch: "टारगेट ब्रांच: {{branchName}}",
      creatingBranch: "🌿 अपडेट ब्रांच बन रही है...",
      gitCheckout:
        "git checkout -b {{branchName}} || git checkout {{branchName}}",
      updatingPackages: "🔄 सभी पैकेज डिपेंडेंसी अपडेट हो रही हैं...",
      runningSnyk: "🔍 Snyk सिक्योरिटी मॉनिटरिंग चल रही है...",
      noChanges: "📝 कोई बदलाव नहीं मिला, कमिट और PR बनाना छोड़ा जा रहा है",
      committing: "💾 बदलाव कमिट हो रहे हैं...",
      pushing: "📤 ब्रांच पुश हो रही है...",
      gitPush: "git push origin {{branchName}}",
      creatingPR: "📝 पुल रिक्वेस्ट बन/अपडेट हो रही है...",
      completed: "🎉 साप्ताहिक अपडेट सफलतापूर्वक पूरा!",
      failed: "❌ साप्ताहिक अपडेट फ़ेल:",
    },
    snyk: {
      noCredentials:
        "⚠️  Snyk क्रेडेंशियल नहीं मिले, सिक्योरिटी मॉनिटरिंग छोड़ी जा रही है",
      monitoring: "🔍 {{packageName}} मॉनिटर हो रहा है...",
      failed:
        "⚠️  {{packageFile}} के लिए Snyk मॉनिटरिंग फ़ेल, जारी रखा जा रहा है...",
    },
    github: {
      noToken: "⚠️  GITHUB_TOKEN नहीं मिला, PR बनाना छोड़ा जा रहा है",
      prFailed: "⚠️  PR बनाना फ़ेल, जारी रखा जा रहा है...",
      prError: "PR बनाने में एरर:",
      prSuccess: "✅ PR सफलतापूर्वक बना/अपडेट हुआ",
    },
    git: {
      findCommand:
        'find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*"',
    },
  },
  cloneMissing: {
    checking: "🔍 गायब रिपॉज़िटरी जाँची जा रही हैं...",
    failedToClone: "❌ {{repoPath}} क्लोन नहीं हो सका",
    noMissing: "✅ कोई रिपॉज़िटरी गायब नहीं",
    success: "✅ {{count}} रिपॉज़िटरी सफलतापूर्वक क्लोन हुईं",
    failed: "❌ {{count}} रिपॉज़िटरी क्लोन नहीं हो सकीं:",
    failedRepo: "  - {{repo}}",
  },
  updateAll: {
    updating: "🔄 सभी रिपॉज़िटरी अपडेट हो रही हैं...",
    failedClone:
      "⚠️  {{repoPath}} क्लोन नहीं हो सका, बाकी रिपॉज़िटरी के साथ जारी...",
    failedUpdate:
      "⚠️  {{repoPath}} अपडेट नहीं हो सका, बाकी रिपॉज़िटरी के साथ जारी...",
    clonedSuccess: "✅ गायब {{count}} रिपॉज़िटरी सफलतापूर्वक क्लोन हुईं।",
    updatedSuccess: "✅ मौजूदा {{count}} रिपॉज़िटरी सफलतापूर्वक अपडेट हुईं।",
    cloneFailed: "❌ {{count}} रिपॉज़िटरी क्लोन नहीं हो सकीं:",
    updateFailed: "❌ {{count}} रिपॉज़िटरी अपडेट नहीं हो सकीं:",
    failedRepo: "   - {{repo}}",
  },
};
