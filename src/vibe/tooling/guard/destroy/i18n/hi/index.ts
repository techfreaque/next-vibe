import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सिस्टम गार्ड",
  title: "गार्ड नष्ट करें",
  titleShort: "गार्ड नष्ट करें",
  description: "गार्ड एनवायरनमेंट नष्ट करें और रिसोर्स साफ़ करें",
  tag: "guard-management",
  container: {
    title: "गार्ड नष्ट करने का कॉन्फ़िगरेशन",
    description: "गार्ड एनवायरनमेंट नष्ट करने के पैरामीटर सेट करें",
  },
  fields: {
    projectPath: {
      title: "प्रोजेक्ट पाथ",
      description: "प्रोजेक्ट डायरेक्टरी का पाथ",
      placeholder: "/home/user/projects/my-project",
    },
    guardId: {
      title: "गार्ड ID",
      description: "गार्ड की यूनीक पहचान",
      placeholder: "guard_my_project_abc123",
    },
    force: {
      title: "ज़बरदस्ती नष्ट करें",
      description: "गार्ड चल रहा हो तब भी ज़बरदस्ती नष्ट करें",
    },
    cleanupFiles: {
      title: "फ़ाइलें साफ़ करें",
      description: "गार्ड से जुड़ी सभी फ़ाइलें हटाएँ",
    },
    dryRun: {
      title: "ड्राई रन",
      description: "असल में नष्ट किए बिना प्रीव्यू देखें कि क्या नष्ट होगा",
    },
    success: {
      title: "सफल",
    },
    output: {
      title: "आउटपुट",
    },
    destroyedGuards: {
      title: "नष्ट किए गए गार्ड",
    },
    warnings: {
      title: "चेतावनियाँ",
    },
    totalDestroyed: {
      title: "कुल नष्ट",
    },
    username: {
      title: "यूज़रनेम",
    },
    wasRunning: {
      title: "चल रहा था",
    },
    filesRemoved: {
      title: "हटाई गई फ़ाइलें",
    },
    userRemoved: {
      title: "हटाया गया यूज़र",
    },
  },
  form: {
    title: "नष्ट करने का कॉन्फ़िगरेशन",
    description: "नष्ट करने के पैरामीटर सेट करें",
  },
  response: {
    title: "जवाब",
    description: "नष्ट करने का जवाब डेटा",
  },
  errors: {
    unauthorized: {
      title: "अनधिकृत",
      description: "ऑथेंटिकेशन ज़रूरी है",
    },
    validation: {
      title: "वैलिडेशन एरर",
      description: "रिक्वेस्ट पैरामीटर गलत हैं",
    },
    server: {
      title: "सर्वर एरर",
      description: "आंतरिक सर्वर एरर हुआ",
    },
    internal: {
      title: "आंतरिक एरर",
      description: "एक आंतरिक एरर हुआ",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अज्ञात एरर हुआ",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क एरर हुआ",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "एक्सेस प्रतिबंधित",
    },
    notFound: {
      title: "नहीं मिला",
      description: "रिसोर्स नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "डेटा टकराव हुआ",
    },
    destruction_failed: {
      title: "गार्ड नष्ट करना फ़ेल: {{error}}",
      description: "गार्ड एनवायरनमेंट नष्ट नहीं हो सका",
    },
    guard_not_found: {
      title: "प्रोजेक्ट '{{project}}' के लिए कोई गार्ड नहीं मिला",
      description: "बताए गए प्रोजेक्ट के लिए कोई गार्ड एनवायरनमेंट नहीं मिला",
    },
  },
  success: {
    title: "सफल",
    description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
  },
};
